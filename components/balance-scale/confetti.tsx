"use client"

import { useEffect, useRef } from "react"

interface ConfettiProps {
  show: boolean
}

interface Piece {
  x: number
  y: number
  r: number
  color: string
  vx: number
  vy: number
  rot: number
  vrot: number
  shape: "rect" | "circle"
  w: number
  h: number
  wobble: number
  wobbleSpeed: number
}

const COLORS = ["#C9920A", "#B85042", "#4A7C59", "#1B7A8C", "#FFD700", "#FF6B6B", "#6BCB77", "#4D96FF", "#FF9F1C", "#E84855"]

export function Confetti({ show }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const piecesRef = useRef<Piece[]>([])
  const animIdRef = useRef<number | null>(null)
  const runningRef = useRef(false)

  useEffect(() => {
    if (!show) {
      runningRef.current = false
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current)
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      piecesRef.current = []
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const createPiece = (): Piece => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -400,
      r: Math.random() * 7 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 8,
      shape: Math.random() < 0.5 ? "rect" : "circle",
      w: Math.random() * 12 + 6,
      h: Math.random() * 6 + 4,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.1 + 0.05,
    })

    piecesRef.current = Array.from({ length: 160 }, createPiece)
    runningRef.current = true

    const animate = () => {
      if (!runningRef.current) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = piecesRef.current.length - 1; i >= 0; i--) {
        const p = piecesRef.current[i]
        p.y += p.vy
        p.x += p.vx
        p.rot += p.vrot
        p.wobble += p.wobbleSpeed
        p.x += Math.sin(p.wobble) * 1.2

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.9

        if (p.shape === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, p.r, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        }

        ctx.restore()

        if (p.y > canvas.height + 30) {
          piecesRef.current.splice(i, 1)
          if (runningRef.current) piecesRef.current.push(createPiece())
        }
      }

      animIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (runningRef.current) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      runningRef.current = false
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current)
    }
  }, [show])

  if (!show) return null

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[199]" />
}
