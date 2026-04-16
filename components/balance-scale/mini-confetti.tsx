"use client"

import { useEffect, useRef } from "react"

interface MiniConfettiProps {
  show: boolean
}

interface MiniPiece {
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
  alpha: number
  life: number
  maxLife: number
}

const MC_COLORS = ["#C9920A", "#4A7C59", "#1B7A8C", "#FFD700", "#FF6B6B", "#6BCB77", "#4D96FF", "#FF9F1C", "#a78bfa", "#f472b6"]

export function MiniConfetti({ show }: MiniConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const piecesRef = useRef<MiniPiece[]>([])
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

    const createPiece = (): MiniPiece => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -200,
      r: Math.random() * 5 + 3,
      color: MC_COLORS[Math.floor(Math.random() * MC_COLORS.length)],
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 10,
      shape: Math.random() < 0.5 ? "rect" : "circle",
      w: Math.random() * 10 + 5,
      h: Math.random() * 5 + 3,
      alpha: 1,
      life: 0,
      maxLife: Math.random() * 40 + 50,
    })

    piecesRef.current = Array.from({ length: 70 }, createPiece)
    runningRef.current = true

    const animate = () => {
      if (!runningRef.current) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = piecesRef.current.length - 1; i >= 0; i--) {
        const p = piecesRef.current[i]
        p.y += p.vy
        p.x += p.vx
        p.rot += p.vrot
        p.life++
        p.alpha = Math.max(0, 1 - p.life / p.maxLife)

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * 0.9

        if (p.shape === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, p.r, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        }

        ctx.restore()

        if (p.life >= p.maxLife || p.y > canvas.height + 20) {
          piecesRef.current.splice(i, 1)
        }
      }

      if (piecesRef.current.length > 0) {
        animIdRef.current = requestAnimationFrame(animate)
      } else {
        runningRef.current = false
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    animate()

    return () => {
      runningRef.current = false
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current)
    }
  }, [show])

  if (!show) return null

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[197]" />
}
