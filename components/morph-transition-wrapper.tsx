"use client"

import { type ReactNode, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import StarDustEffect from "./star-dust-effect" // Import the new component

interface MorphTransitionWrapperProps {
  children: ReactNode
  contentKey: string // A key that changes when content should "morph"
}

export default function MorphTransitionWrapper({ children, contentKey }: MorphTransitionWrapperProps) {
  const [isMorphing, setIsMorphing] = useState(false)
  const [previousKey, setPreviousKey] = useState(contentKey)

  useEffect(() => {
    if (contentKey !== previousKey) {
      setIsMorphing(true)
      // Duration of the morph effect (overlay visibility)
      const timer = setTimeout(() => {
        setIsMorphing(false)
        setPreviousKey(contentKey)
      }, 900) // Shorter duration for star dust + text fade
      return () => clearTimeout(timer)
    }
  }, [contentKey, previousKey])

  // Variants for the main content block
  const contentVariants = {
    initial: {
      opacity: 0,
      scale: 0.92, // Was 0.9
      filter: "blur(5px) brightness(1.8)", // Was blur(8px) brightness(2.5)
      y: 15, // Was 20
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px) brightness(1)",
      y: 0,
      transition: { duration: 0.65, ease: [0.42, 0, 0.58, 1], delay: 0.15 }, // Delay allows star dust to be more prominent
    },
    exit: {
      opacity: 0,
      scale: 0.96, // Was 0.95
      filter: "blur(3px) brightness(0.9)", // Was blur(5px) brightness(0.8)
      y: -15, // Was -20
      transition: { duration: 0.35, ease: [0.42, 0, 0.58, 1] }, // duration was 0.4
    },
  }

  // Variants for the morphing overlay
  const overlayVariants = {
    hidden: { opacity: 0, transition: { duration: 0.3, delay: 0.55 } }, // Delay hiding to let stars finish
    visible: { opacity: 1, transition: { duration: 0.3 } },
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isMorphing && (
          <motion.div
            key="morph-overlay"
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[200] flex items-center justify-center" // Less opaque backdrop
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <StarDustEffect particleCount={50} />
            <motion.div
              className="text-xl font-semibold text-primary" // Slightly smaller text
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              Personalizing...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          key={contentKey} // This key is crucial for AnimatePresence to detect changes
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
