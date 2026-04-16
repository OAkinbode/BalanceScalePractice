import { cn } from "@/lib/utils"

interface MiniCelebrationProps {
  visible: boolean
  message: string
}

export function MiniCelebration({ visible, message }: MiniCelebrationProps) {
  return (
    <div
      className={cn(
        "text-center px-4 md:px-5 py-2 text-sm md:text-base font-bold text-[#2a5c38] min-h-[34px] border-b-2 transition-opacity duration-400",
        visible ? "bg-[#e6f9ec] border-[#b8e8c4] opacity-100" : "bg-transparent border-transparent opacity-0"
      )}
    >
      {message}
    </div>
  )
}
