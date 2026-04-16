"use client"

import { cn } from "@/lib/utils"

interface RedFlashProps {
  show: boolean
}

export function RedFlash({ show }: RedFlashProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none z-[198] transition-[background] duration-50",
        show ? "animate-red-pulse" : "bg-transparent"
      )}
    />
  )
}
