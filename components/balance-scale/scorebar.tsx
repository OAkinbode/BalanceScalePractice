interface ScorebarProps {
  hurtfulCount: number
  repairCount: number
  score: number
}

export function Scorebar({ hurtfulCount, repairCount, score }: ScorebarProps) {
  return (
    <div className="flex justify-center gap-3 md:gap-5 p-2 md:p-3 bg-white border-b-2 border-[#d0e8e9] flex-wrap">
      <div className="bg-[#e8f4f5] rounded-full px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-bold text-[#085358] border-2 border-[#b0d8da]">
        Hurtful: <span className="text-[#B85042] text-sm md:text-base font-extrabold">{hurtfulCount}</span>
      </div>
      <div className="bg-[#e8f4f5] rounded-full px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-bold text-[#085358] border-2 border-[#b0d8da]">
        Repair: <span className="text-[#B85042] text-sm md:text-base font-extrabold">{repairCount}</span>
      </div>
      <div className="bg-[#e8f4f5] rounded-full px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-bold text-[#085358] border-2 border-[#b0d8da]">
        Score: <span className="text-[#B85042] text-sm md:text-base font-extrabold">{score}</span>
      </div>
    </div>
  )
}
