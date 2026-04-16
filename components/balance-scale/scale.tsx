"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Wheel = "Physical" | "Emotional" | "Mental" | "Spiritual"
type Side = "h" | "r"

interface ScaleProps {
  hurtfulCount: number
  repairCount: number
  chips: Record<string, string[]>
  onDrop: (wordId: number, side: Side, wheel: Wheel) => void
}

interface ZoneProps {
  side: Side
  wheel: Wheel
  chips: string[]
  onDrop: (wordId: number, side: Side, wheel: Wheel) => void
}

const wheelStyles: Record<Wheel, { zone: string; label: string; chipClass: string }> = {
  Physical: { zone: "border-[#d9897e] bg-[#fff8f7]", label: "text-[#9d3222]", chipClass: "" },
  Emotional: { zone: "border-[#7bbdc9] bg-[#f4fafc]", label: "text-[#0e5a6a]", chipClass: "" },
  Mental: { zone: "border-[#c9a55c] bg-[#fffbf3]", label: "text-[#7a4a00]", chipClass: "" },
  Spiritual: { zone: "border-[#82b892] bg-[#f3faf5]", label: "text-[#2a5c38]", chipClass: "" },
}

function DropZone({ side, wheel, chips, onDrop }: ZoneProps) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    const wordId = parseInt(e.dataTransfer.getData("text/plain"), 10)
    if (!isNaN(wordId)) {
      onDrop(wordId, side, wheel)
    }
  }

  const style = wheelStyles[wheel]

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "rounded-lg border-2 border-dashed p-1 md:p-1.5 min-h-[48px] md:min-h-[54px] flex flex-col items-center transition-all",
        style.zone,
        isOver && "border-solid border-[#C9920A] bg-[#C9920A]/10"
      )}
    >
      <div className={cn("text-[8px] md:text-[9px] font-extrabold uppercase tracking-wide mb-1 opacity-85", style.label)}>
        {wheel}
      </div>
      <div className="flex flex-wrap gap-0.5 md:gap-1 justify-center">
        {chips.map((chip, idx) => (
          <div
            key={idx}
            className={cn(
              "text-[7px] md:text-[8px] font-bold rounded px-1 py-0.5 max-w-[60px] md:max-w-[68px] text-center leading-tight break-words animate-pop",
              side === "h" ? "bg-[#FAE8E4] text-[#8a2010]" : "bg-[#D6EBD5] text-[#1a4d28]"
            )}
          >
            {chip}
          </div>
        ))}
      </div>
    </div>
  )
}

interface PanProps {
  side: Side
  chips: Record<string, string[]>
  onDrop: (wordId: number, side: Side, wheel: Wheel) => void
}

function Pan({ side, chips, onDrop }: PanProps) {
  const isHurtful = side === "h"
  const wheels: Wheel[] = ["Physical", "Emotional", "Mental", "Spiritual"]

  return (
    <div
      className={cn(
        "absolute bottom-2 w-[47%] rounded-t-xl rounded-b-[54px] border-[3px] p-1.5 md:p-2",
        isHurtful ? "left-[1%] border-[#B85042] bg-[#fff5f4]" : "right-[1%] border-[#4A7C59] bg-[#f2faf4]"
      )}
    >
      <span
        className={cn(
          "text-[10px] md:text-xs font-extrabold uppercase tracking-wide text-center block mb-1 md:mb-1.5",
          isHurtful ? "text-[#B85042]" : "text-[#4A7C59]"
        )}
      >
        {isHurtful ? "Hurtful" : "Repair"}
      </span>
      <div className="grid grid-cols-2 gap-1">
        {wheels.map((wheel) => (
          <DropZone
            key={wheel}
            side={side}
            wheel={wheel}
            chips={chips[`${side}-${wheel}`] || []}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  )
}

export function Scale({ hurtfulCount, repairCount, chips, onDrop }: ScaleProps) {
  const diff = hurtfulCount - repairCount
  let tiltDeg = 0
  if (diff >= 4) tiltDeg = -20
  else if (diff === 3) tiltDeg = -15
  else if (diff === 2) tiltDeg = -10
  else if (diff === 1) tiltDeg = -5
  else if (diff === -1) tiltDeg = 5
  else if (diff === -2) tiltDeg = 10
  else if (diff === -3) tiltDeg = 15
  else if (diff <= -4) tiltDeg = 20

  return (
    <div className="bg-white px-3 md:px-5 pt-4 pb-0 border-b-[3px] border-[#d0e8e9]">
      <div className="relative h-[220px] md:h-[240px] max-w-[760px] mx-auto">
        {/* Post */}
        <div className="absolute left-1/2 top-1.5 -translate-x-1/2 w-2.5 h-12 bg-[#C9920A] rounded z-[1]" />
        {/* Ball */}
        <div className="absolute left-1/2 top-5 -translate-x-1/2 w-5 h-5 md:w-6 md:h-6 bg-[#C9920A] rounded-full z-[3] shadow-md" />
        {/* Beam */}
        <div
          className="absolute left-[4%] right-[4%] top-[42px] h-2.5 md:h-3 bg-gradient-to-r from-[#1B7A8C] to-[#0D7377] rounded-md z-[2] shadow-md transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top"
          style={{ transform: `rotate(${tiltDeg}deg)` }}
        />

        {/* Pans */}
        <Pan side="h" chips={chips} onDrop={onDrop} />
        <Pan side="r" chips={chips} onDrop={onDrop} />
      </div>
    </div>
  )
}
