"use client"

import type React from "react"

import type { ReactNode } from "react"
import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils" // Assuming you have a cn utility

interface HoverGlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string // e.g., "hsl(var(--primary))"
  borderRadius?: string // e.g., "var(--radius)" or "1rem"
}

export default function HoverGlowCard({
  children,
  className,
  glowColor = "hsl(var(--primary))",
  borderRadius = "var(--radius)",
}: HoverGlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
    }
  }

  const glowStyle = {
    "--mouse-x": `${mousePosition.x}px`,
    "--mouse-y": `${mousePosition.y}px`,
    "--glow-color": glowColor,
    "--border-radius": borderRadius,
  } as React.CSSProperties

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      style={glowStyle}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* The actual content */}
      {children}

      {/* The Glow Effect using a pseudo-element approach (styled via CSS-in-JS for dynamic color) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[calc(var(--border-radius)+1px)] opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), var(--glow-color), transparent 80%)`,
          borderRadius: `calc(${borderRadius} + 1px)`, // Ensure glow respects border radius
        }}
        animate={{ opacity: isHovering ? 0.3 : 0 }} // Adjust opacity for desired glow intensity
        transition={{ duration: 0.3 }}
      />
      {/* Optional: A harder border glow */}
      <motion.div
        className="pointer-events-none absolute -inset-0.5 rounded-[var(--border-radius)] opacity-0 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 0 2px var(--glow-color)`,
          borderRadius: borderRadius,
        }}
        animate={{ opacity: isHovering ? 0.5 : 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      />
    </motion.div>
  )
}
