"use client"

import { motion } from "framer-motion"

interface StarDustEffectProps {
  particleCount?: number
  color?: string
}

const StarParticle = ({ delay, color }: { delay: number; color: string }) => {
  const randomX = (Math.random() - 0.5) * 2 // -1 to 1
  const randomY = (Math.random() - 0.5) * 2 // -1 to 1
  const distance = Math.random() * 200 + 100 // 100px to 300px outward

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: Math.random() * 4 + 2, // 2px to 6px
        height: Math.random() * 4 + 2,
        backgroundColor: color,
        left: "50%",
        top: "50%",
        x: "-50%", // Center the particle before transform
        y: "-50%",
      }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        x: `${randomX * distance}px`,
        y: `${randomY * distance}px`,
        opacity: 0,
        scale: Math.random() * 0.5, // Shrink as it moves
      }}
      transition={{
        duration: Math.random() * 0.8 + 0.5, // 0.5s to 1.3s
        ease: "easeOut",
        delay: delay,
      }}
    />
  )
}

export default function StarDustEffect({ particleCount = 30, color = "hsl(var(--primary))" }: StarDustEffectProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => (
        <StarParticle key={i} delay={Math.random() * 0.3} color={color} /> // Staggered start
      ))}
    </div>
  )
}
