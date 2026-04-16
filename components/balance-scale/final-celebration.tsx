import { cn } from "@/lib/utils"

interface FinalCelebrationProps {
  show: boolean
  onClose: () => void
}

export function FinalCelebration({ show, onClose }: FinalCelebrationProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-[#085358]/95 z-[200] items-center justify-center flex-col text-center px-6 md:px-10 py-10",
        show ? "flex" : "hidden"
      )}
    >
      <div className="text-4xl md:text-5xl mb-3 tracking-[8px] animate-bounce">🌟 🌟 🌟</div>
      <h2 className="text-3xl md:text-4xl text-[#C9920A] font-black mb-3 drop-shadow-lg">Well done!</h2>
      <p className="text-sm md:text-lg text-white leading-relaxed max-w-md mb-6 md:mb-7">
        You matched every word to the right part of the Medicine Wheel AND the right side of the scale. That means you
        understand not just that conflict hurts — but exactly where it hurts and exactly what heals it. That is the
        whole lesson!
      </p>
      <button
        onClick={onClose}
        className="bg-[#C9920A] text-[#2C2C2A] border-none rounded-xl px-8 md:px-11 py-4 text-base md:text-lg font-extrabold cursor-pointer shadow-lg transition-transform hover:scale-105"
      >
        Keep exploring
      </button>
    </div>
  )
}
