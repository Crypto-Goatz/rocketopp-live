"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const loadingMessages = [
  "Analyzing your query...",
  "Consulting vast knowledge networks...",
  "Cross-referencing industry best practices...",
  "Engaging advanced AI thought processes...",
  "Synthesizing complex information...",
  "Generating comprehensive insights...",
  "Formulating a detailed strategic response...",
  "Designing relevant visual concepts...",
  "Crafting your personalized solution...",
  "Finalizing recommendations and details...",
]

interface AiLoadingOverlayProps {
  isVisible: boolean
}

export default function AiLoadingOverlay({ isVisible }: AiLoadingOverlayProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let messageInterval: NodeJS.Timeout | undefined
    let progressInterval: NodeJS.Timeout | undefined

    if (isVisible) {
      setCurrentMessageIndex(0) // Reset message index
      setProgress(0) // Reset progress

      // Cycle through messages
      messageInterval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length)
      }, 1500) // Change message every 1.5 seconds

      // Simulate progress to 95% over ~6 seconds
      const minLoadingTime = 6000 // Minimum 6 seconds for visual effect
      const progressSteps = 100 // Number of steps for progress bar update
      const stepDuration = minLoadingTime / progressSteps
      let currentProgress = 0

      progressInterval = setInterval(() => {
        currentProgress += 95 / progressSteps // Reach 95% in minLoadingTime
        setProgress(Math.min(currentProgress, 99)) // Cap at 99% until actual completion

        if (currentProgress >= 95) {
          // Let it reach 95% then rely on parent to hide
          // If AI finishes faster, parent will hide. If slower, it stays at 99%.
          // No need to clear interval here if we want it to stick at 99%
        }
      }, stepDuration)
    } else {
      // If overlay becomes not visible, clear intervals
      if (messageInterval) clearInterval(messageInterval)
      if (progressInterval) clearInterval(progressInterval)
    }

    return () => {
      if (messageInterval) clearInterval(messageInterval)
      if (progressInterval) clearInterval(progressInterval)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-md text-center">
        <div className="relative h-20 w-20 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full bg-primary/20"
            animate={{ scale: [1, 0.9, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>

        <p className="text-xl font-semibold text-primary mb-4 h-12 flex items-center justify-center">
          {" "}
          {/* Fixed height for message area */}
          {loadingMessages[currentMessageIndex]}
        </p>

        <div className="w-full bg-muted rounded-full h-2.5 mb-2 overflow-hidden">
          <motion.div
            className="bg-primary h-2.5 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.15, ease: "linear" }} // Faster update for smoother progress
          />
        </div>
        <p className="text-sm text-muted-foreground">{Math.floor(progress)}% Complete</p>
      </div>
    </motion.div>
  )
}
