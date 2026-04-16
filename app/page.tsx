"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Header } from "@/components/balance-scale/header"
import { ScenarioBox } from "@/components/balance-scale/scenario-box"
import { Scorebar } from "@/components/balance-scale/scorebar"
import { Scale } from "@/components/balance-scale/scale"
import { MiniCelebration } from "@/components/balance-scale/mini-celebration"
import { Feedback } from "@/components/balance-scale/feedback"
import { CardsSection } from "@/components/balance-scale/cards-section"
import { FinalCelebration } from "@/components/balance-scale/final-celebration"
import { RedFlash } from "@/components/balance-scale/red-flash"
import { Confetti } from "@/components/balance-scale/confetti"
import { MiniConfetti } from "@/components/balance-scale/mini-confetti"

export type WordItem = {
  id: number
  t: string
  s: "h" | "r"
  w: "Physical" | "Emotional" | "Mental" | "Spiritual"
}

export type FeedbackType = "ok" | "no" | "hi" | null

const initialWords: WordItem[] = [
  { id: 1, t: "Sighing loudly in front of everyone", s: "h", w: "Physical" },
  { id: 2, t: "Rolling eyes at Alex", s: "h", w: "Emotional" },
  { id: 3, t: "Finishing Alex's sentence without asking", s: "h", w: "Physical" },
  { id: 4, t: '"You were taking forever"', s: "h", w: "Mental" },
  { id: 5, t: '"I was just trying to help"', s: "h", w: "Mental" },
  { id: 6, t: "The class watching it happen", s: "h", w: "Spiritual" },
  { id: 7, t: "Not checking how Alex felt after", s: "h", w: "Emotional" },
  { id: 8, t: '"I\'m sorry — what I did was not fair"', s: "r", w: "Emotional" },
  { id: 9, t: "Apologizing in front of the class", s: "r", w: "Physical" },
  { id: 10, t: '"Everyone stumbles when nervous — that was brave"', s: "r", w: "Mental" },
  { id: 11, t: "Listening without making excuses", s: "r", w: "Mental" },
  { id: 12, t: "Standing straight, making eye contact", s: "r", w: "Physical" },
  { id: 13, t: "Asking Alex to present together next time", s: "r", w: "Spiritual" },
  { id: 14, t: '"Even if I meant to help — Alex didn\'t feel helped. That matters."', s: "r", w: "Mental" },
  { id: 15, t: 'Checking in: "Are you okay?"', s: "r", w: "Emotional" },
  { id: 16, t: "Being a good partner over the next few classes", s: "r", w: "Spiritual" },
]

export default function BalanceScalePage() {
  const [words, setWords] = useState<WordItem[]>(initialWords)
  const [placed, setPlaced] = useState<Record<number, boolean>>({})
  const [chips, setChips] = useState<Record<string, string[]>>({})
  const [hurtfulCount, setHurtfulCount] = useState(0)
  const [repairCount, setRepairCount] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<{ type: FeedbackType; message: string }>({ type: null, message: "" })
  const [miniCel, setMiniCel] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" })
  const [showFinal, setShowFinal] = useState(false)
  const [showRedFlash, setShowRedFlash] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showMiniConfetti, setShowMiniConfetti] = useState(false)

  const nextIdRef = useRef(300)
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const miniCelTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const miniMsgIndexRef = useRef(0)

  const miniMsgs = [
    "Nice one! The {w} part starts to heal",
    "Kind act! {w} gets a little lighter",
    "Yes! That repairs the {w} part",
    "Good thinking! {w} starts to restore",
    "That one heals the {w} part — well done!",
  ]

  const showFeedback = useCallback((type: FeedbackType, message: string) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
    setFeedback({ type, message })
    feedbackTimeoutRef.current = setTimeout(
      () => {
        setFeedback({ type: null, message: "" })
      },
      type === "ok" ? 5000 : 3500
    )
  }, [])

  const showMiniCelebration = useCallback(
    (wheel: string) => {
      if (miniCelTimeoutRef.current) clearTimeout(miniCelTimeoutRef.current)
      const msg = miniMsgs[miniMsgIndexRef.current % miniMsgs.length].replace("{w}", wheel)
      miniMsgIndexRef.current++
      setMiniCel({ visible: true, message: msg })
      miniCelTimeoutRef.current = setTimeout(() => {
        setMiniCel({ visible: false, message: "" })
      }, 3500)
    },
    [miniMsgs]
  )

  const hideMiniCelebration = useCallback(() => {
    if (miniCelTimeoutRef.current) clearTimeout(miniCelTimeoutRef.current)
    setMiniCel({ visible: false, message: "" })
  }, [])

  const flashRed = useCallback(() => {
    setShowRedFlash(true)
    setTimeout(() => setShowRedFlash(false), 750)
  }, [])

  const triggerMiniConfetti = useCallback(() => {
    setShowMiniConfetti(true)
    setTimeout(() => setShowMiniConfetti(false), 2000)
  }, [])

  const handleDrop = useCallback(
    (wordId: number, targetSide: "h" | "r", targetWheel: "Physical" | "Emotional" | "Mental" | "Spiritual") => {
      const word = words.find((w) => w.id === wordId)
      if (!word || placed[word.id]) return

      const sideOk = word.s === targetSide
      const wheelOk = word.w === targetWheel

      if (sideOk && wheelOk) {
        setPlaced((prev) => ({ ...prev, [word.id]: true }))
        setScore((prev) => prev + 1)

        const chipKey = `${targetSide}-${targetWheel}`
        const chipText = word.t.length > 18 ? word.t.substring(0, 17) + "…" : word.t
        setChips((prev) => ({
          ...prev,
          [chipKey]: [...(prev[chipKey] || []), chipText],
        }))

        if (targetSide === "h") {
          setHurtfulCount((prev) => prev + 1)
          hideMiniCelebration()
          flashRed()
        } else {
          setRepairCount((prev) => prev + 1)
          showMiniCelebration(targetWheel)
          triggerMiniConfetti()
        }

        showFeedback("ok", `Great job! "${word.t}" — ${targetWheel}, ${targetSide === "h" ? "hurtful side." : "repair side."}`)
      } else if (sideOk && !wheelOk) {
        setScore((prev) => Math.max(0, prev - 1))
        showFeedback("no", "Right side — but which part of the Wheel does this affect?")
      } else if (!sideOk && wheelOk) {
        setScore((prev) => Math.max(0, prev - 1))
        showFeedback("no", "Right quadrant — but does this hurt or repair?")
      } else {
        setScore((prev) => Math.max(0, prev - 1))
        showFeedback("no", "Think again — which side AND which part of the Wheel?")
      }
    },
    [words, placed, hideMiniCelebration, flashRed, showMiniCelebration, triggerMiniConfetti, showFeedback]
  )

  const addCustomWord = useCallback(
    (text: string, wheel: "Physical" | "Emotional" | "Mental" | "Spiritual", side: "h" | "r") => {
      if (!text.trim()) {
        showFeedback("hi", "Type a word or action first!")
        return
      }
      const newWord: WordItem = {
        id: nextIdRef.current++,
        t: text.trim(),
        s: side,
        w: wheel,
      }
      setWords((prev) => [...prev, newWord])
      showFeedback("ok", `Added to ${side === "h" ? "Hurtful" : "Repair"} — ${wheel}.`)
    },
    [showFeedback]
  )

  const reset = useCallback(() => {
    setWords(initialWords)
    setPlaced({})
    setChips({})
    setHurtfulCount(0)
    setRepairCount(0)
    setScore(0)
    setFeedback({ type: null, message: "" })
    setMiniCel({ visible: false, message: "" })
    setShowFinal(false)
    setShowRedFlash(false)
    setShowConfetti(false)
    setShowMiniConfetti(false)
    miniMsgIndexRef.current = 0
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
    if (miniCelTimeoutRef.current) clearTimeout(miniCelTimeoutRef.current)
  }, [])

  // Check if all initial words are placed
  useEffect(() => {
    const placedCount = Object.values(placed).filter(Boolean).length
    if (placedCount === initialWords.length && placedCount > 0) {
      setTimeout(() => {
        setShowConfetti(true)
        setShowFinal(true)
      }, 700)
    }
  }, [placed])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a8edea] via-[#fed6e3] via-[#ffecd2] via-[#c3cfe2] via-[#d4fc79] to-[#fccb90] bg-[length:400%_400%] animate-bg-shift text-[#2C2C2A]">
      <Header />
      <ScenarioBox />
      <Scorebar hurtfulCount={hurtfulCount} repairCount={repairCount} score={score} />
      <Scale hurtfulCount={hurtfulCount} repairCount={repairCount} chips={chips} onDrop={handleDrop} />
      <MiniCelebration visible={miniCel.visible} message={miniCel.message} />
      <Feedback type={feedback.type} message={feedback.message} />
      <CardsSection words={words} placed={placed} onAddCustom={addCustomWord} onReset={reset} />

      <RedFlash show={showRedFlash} />
      <MiniConfetti show={showMiniConfetti} />
      <Confetti show={showConfetti} />
      <FinalCelebration
        show={showFinal}
        onClose={() => {
          setShowFinal(false)
          setShowConfetti(false)
        }}
      />
    </div>
  )
}
