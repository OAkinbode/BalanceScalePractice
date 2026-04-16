import { cn } from "@/lib/utils"
import type { FeedbackType } from "@/app/page"

interface FeedbackProps {
  type: FeedbackType
  message: string
}

export function Feedback({ type, message }: FeedbackProps) {
  return (
    <div className="px-4 md:px-5 py-1.5 md:py-2 bg-[#f5f9fa]">
      <div
        className={cn(
          "mx-auto min-h-[40px] md:min-h-[46px] rounded-xl px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-center leading-snug flex items-center justify-center max-w-[760px] transition-all",
          type === "ok" && "bg-[#e6f9ec] text-[#1a4d28] border-2 border-[#4A7C59]",
          type === "no" && "bg-[#fdecea] text-[#7a2214] border-2 border-[#B85042]",
          type === "hi" && "bg-[#FDF3DC] text-[#7a4a00] border-2 border-[#C9920A]",
          !type && "bg-transparent border-transparent"
        )}
      >
        {message}
      </div>
    </div>
  )
}
