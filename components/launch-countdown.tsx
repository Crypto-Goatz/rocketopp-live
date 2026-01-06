"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Rocket } from "lucide-react"
import type { Industry } from "@/lib/personalization-store"

interface LaunchCountdownProps {
  firstName: string
  companyName: string
  industry: Industry
  onComplete: () => void
}

const loadingMessages = [
  {
    template:
      "{{firstName}}, we're generating a page just for {{company}} that explains how our services benefit the {{industry}}.",
    requiresCompany: true,
  },
  {
    template:
      "{{firstName}}, we're crafting a personalized experience that shows how our services can transform your {{industry}} business.",
    requiresCompany: false,
  },
  {
    template: "Your page will show you exactly how AI can be used with {{company}}'s products and services.",
    requiresCompany: true,
  },
  {
    template: "Analyzing the {{industry}} market to provide tailored recommendations for {{firstName}}...",
    requiresCompany: false,
  },
  {
    template: "Building your custom dashboard with industry-specific insights for {{industry}}...",
    requiresCompany: false,
  },
  {
    template:
      "{{firstName}}, we're preparing exclusive strategies that have helped {{industry}} businesses grow 300%...",
    requiresCompany: false,
  },
  {
    template: "Generating conversion-optimized content specifically for {{company}} in the {{industry}} sector...",
    requiresCompany: true,
  },
  {
    template: "Almost ready! Your personalized RocketOpp experience is about to launch, {{firstName}}!",
    requiresCompany: false,
  },
]

export function LaunchCountdown({ firstName, companyName, industry, onComplete }: LaunchCountdownProps) {
  const [count, setCount] = useState(10)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)

  const getDisplayIndustry = useCallback(() => {
    if (!industry) return "your industry"
    return industry
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }, [industry])

  const getFormattedMessage = useCallback(
    (msg: (typeof loadingMessages)[0]) => {
      const displayCompany = companyName || "your company"
      return msg.template
        .replace(/\{\{firstName\}\}/g, firstName)
        .replace(/\{\{company\}\}/g, displayCompany)
        .replace(/\{\{industry\}\}/g, getDisplayIndustry())
    },
    [firstName, companyName, getDisplayIndustry],
  )

  const getFilteredMessages = useCallback(() => {
    return loadingMessages.filter((msg) => companyName || !msg.requiresCompany)
  }, [companyName])

  useEffect(() => {
    if (count <= 0) {
      setIsFadingOut(true)
      setTimeout(onComplete, 1500)
      return
    }

    const timer = setTimeout(() => {
      setCount(count - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [count, onComplete])

  useEffect(() => {
    const filtered = getFilteredMessages()
    const messageTimer = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % filtered.length)
    }, 2500)

    return () => clearInterval(messageTimer)
  }, [getFilteredMessages])

  const filteredMessages = getFilteredMessages()
  const currentMessage = filteredMessages[currentMessageIndex % filteredMessages.length]

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="p-8 min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-primary/5"
    >
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Countdown Title */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl font-bold text-primary mb-8 relative z-10"
      >
        Launch Countdown
      </motion.h2>

      {/* Countdown Number */}
      <div className="relative mb-8">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 1.5, opacity: 0, rotateY: 90 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10 w-32 h-32 flex items-center justify-center"
          >
            <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary to-primary/50">
              {count}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rocket Animation */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="mb-8 relative z-10"
      >
        <div className="relative">
          <Rocket className="h-16 w-16 text-primary" />
          {/* Flame Effect */}
          <motion.div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full blur-sm"
            animate={{
              height: [32, 48, 32],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 0.3, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>

      {/* Dynamic Message */}
      <div className="max-w-md text-center relative z-10 min-h-[80px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground text-sm leading-relaxed"
          >
            {getFormattedMessage(currentMessage)}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs mt-8 relative z-10">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-primary to-orange-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((10 - count) / 10) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  )
}
