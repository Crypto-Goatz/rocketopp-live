"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useEffect, useState, useRef } from "react"

interface ShimmerHighlightProps {
  children: ReactNode
  className?: string
  active: boolean // Prop to activate shimmer, e.g., when content changes
  delay?: number // Optional delay before first shimmer
  animationDuration?: number // Duration for ONE PHASE of the animation (e.g., fade-in or fade-out)
}

export default function ShimmerHighlight({
  children,
  className,
  active,
  delay = 0,
  animationDuration = 1.5, // 1.5s for fade-in, 1.5s for fade-out = 3s total effect
}: ShimmerHighlightProps) {
  const [isShimmering, setIsShimmering] = useState(false)
  const shimmerTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const postShimmerTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (shimmerTimeoutRef.current) clearTimeout(shimmerTimeoutRef.current)
    if (postShimmerTimeoutRef.current) clearTimeout(postShimmerTimeoutRef.current)

    if (active) {
      const randomDelay = delay + Math.random() * 2000 + 300 // 0.3-2.3s + initial delay

      shimmerTimeoutRef.current = setTimeout(() => {
        setIsShimmering(true)
        // Set isShimmering to false after the "on" phase (fade-in duration)
        // This will trigger the fade-out animation.
        postShimmerTimeoutRef.current = setTimeout(() => {
          setIsShimmering(false)
        }, animationDuration * 1000)
      }, randomDelay)
    } else {
      setIsShimmering(false)
    }

    return () => {
      if (shimmerTimeoutRef.current) clearTimeout(shimmerTimeoutRef.current)
      if (postShimmerTimeoutRef.current) clearTimeout(postShimmerTimeoutRef.current)
    }
  }, [active, delay, animationDuration, children])

  const variants = {
    normal: {
      filter: "blur(0px)",
      color: "inherit", // Use parent's color
      textShadow: "none",
      transition: { duration: animationDuration, ease: "easeOut" }, // Fade-out duration
    },
    shimmeringStart: {
      filter: "blur(0.5px)", // More subtle blur
      color: "hsl(var(--primary))", // Keep text color as primary, or could be inherit
      // Subtle layered glow with the primary color
      textShadow: `
        0 0 7px hsl(var(--primary) / 0.6), 
        0 0 12px hsl(var(--primary) / 0.3), 
        0 0 18px hsl(var(--primary) / 0.1)
      `,
      transition: { duration: animationDuration, ease: "easeIn" }, // Fade-in duration
    },
  }

  return (
    <motion.span
      className={className}
      variants={variants}
      animate={isShimmering ? "shimmeringStart" : "normal"}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.span>
  )
}
