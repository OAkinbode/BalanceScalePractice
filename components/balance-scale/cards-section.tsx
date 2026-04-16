"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { WordItem } from "@/app/page"

type Wheel = "Physical" | "Emotional" | "Mental" | "Spiritual"

interface CardsSectionProps {
  words: WordItem[]
  placed: Record<number, boolean>
  onAddCustom: (text: string, wheel: Wheel, side: "h" | "r") => void
  onReset: () => void
}

interface DraggableCardProps {
  word: WordItem
  isUsed: boolean
}

function DraggableCard({ word, isUsed }: DraggableCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", word.id.toString())
    e.dataTransfer.effectAllowed = "move"
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      draggable={!isUsed}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "bg-white rounded-xl px-3 py-2.5 md:px-3.5 md:py-3 text-xs md:text-sm font-semibold text-[#2C2C2A] border-2 border-[#d0dfe0] transition-all leading-snug select-none shadow-sm",
        !isUsed && "cursor-grab hover:-translate-y-0.5 hover:shadow-lg hover:border-[#0D7377]",
        isDragging && "opacity-30 scale-95",
        isUsed && "opacity-20 cursor-default pointer-events-none line-through"
      )}
    >
      {word.t}
    </div>
  )
}

export function CardsSection({ words, placed, onAddCustom, onReset }: CardsSectionProps) {
  const [customText, setCustomText] = useState("")
  const [customWheel, setCustomWheel] = useState<Wheel>("Physical")

  const handleAddHurtful = () => {
    onAddCustom(customText, customWheel, "h")
    setCustomText("")
  }

  const handleAddRepair = () => {
    onAddCustom(customText, customWheel, "r")
    setCustomText("")
  }

  return (
    <>
      <div className="px-4 md:px-6 py-4 md:py-5 bg-[#f0f7f8]">
        <div className="flex justify-between items-center mb-2.5 md:mb-3 flex-wrap gap-2">
          <span className="text-xs md:text-sm font-extrabold text-[#085358] uppercase tracking-wider">
            Word &amp; Action Cards
          </span>
          <span className="text-[10px] md:text-xs text-[#4a8a90] italic">
            Drag each card to the right quadrant AND the right side
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-2.5">
          {words.map((word) => (
            <DraggableCard key={word.id} word={word} isUsed={!!placed[word.id]} />
          ))}
        </div>

        {/* Add Custom */}
        <div className="mt-4 bg-white rounded-xl p-3 md:p-4 border-2 border-[#d0e8e9]">
          <p className="text-[10px] md:text-xs font-extrabold text-[#085358] uppercase tracking-wider mb-2 md:mb-2.5">
            Add your own word or action
          </p>
          <div className="flex gap-2 flex-wrap items-end">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type a word or action..."
              className="flex-1 min-w-[140px] md:min-w-[160px] px-2.5 py-2 md:px-3 md:py-2.5 rounded-lg border-2 border-[#d0e8e9] text-xs md:text-sm font-sans outline-none text-[#2C2C2A] bg-[#f5f9fa] focus:border-[#0D7377]"
            />
            <select
              value={customWheel}
              onChange={(e) => setCustomWheel(e.target.value as Wheel)}
              className="min-w-[130px] md:min-w-[145px] px-2.5 py-2 md:px-3 md:py-2.5 rounded-lg border-2 border-[#d0e8e9] text-xs md:text-sm font-sans outline-none text-[#2C2C2A] bg-[#f5f9fa] focus:border-[#0D7377]"
            >
              <option value="Physical">Physical (Body)</option>
              <option value="Emotional">Emotional (Heart)</option>
              <option value="Mental">Mental (Mind)</option>
              <option value="Spiritual">Spiritual (Spirit)</option>
            </select>
            <div className="flex gap-1.5">
              <button
                onClick={handleAddHurtful}
                className="px-3 py-2 md:px-4 md:py-2.5 rounded-lg border-none text-[10px] md:text-xs font-bold cursor-pointer transition-opacity bg-[#B85042] text-white hover:opacity-85"
              >
                + Hurtful
              </button>
              <button
                onClick={handleAddRepair}
                className="px-3 py-2 md:px-4 md:py-2.5 rounded-lg border-none text-[10px] md:text-xs font-bold cursor-pointer transition-opacity bg-[#4A7C59] text-white hover:opacity-85"
              >
                + Repair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="text-center py-4 pb-8 bg-[#f0f7f8]">
        <button
          onClick={onReset}
          className="px-6 md:px-8 py-2.5 rounded-xl border-2 border-[#0D7377] bg-white text-[#0D7377] text-sm md:text-base font-bold cursor-pointer transition-all hover:bg-[#0D7377] hover:text-white"
        >
          ↺ Reset
        </button>
      </div>
    </>
  )
}
