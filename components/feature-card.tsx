"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"
import FrostedGlassIcon from "./frosted-glass-icon"
import HoverGlowCard from "./hover-glow-card" // Added

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  accentColor?: string
}

export default function FeatureCard({
  icon,
  title,
  description,
  accentColor = "rgba(120, 120, 255, 0.5)",
}: FeatureCardProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const adjustedAccentColor = isDark
    ? accentColor.replace(/rgba$$(\d+),\s*(\d+),\s*(\d+),\s*[\d.]+$$/, "rgba($1, $2, $3, 0.3)")
    : accentColor

  return (
    <HoverGlowCard className="h-full" glowColor="hsl(var(--primary))" borderRadius="var(--radius)">
      {" "}
      {/* Added Wrapper */}
      <motion.div
        className="relative group h-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Card className="h-full overflow-hidden bg-background/60 backdrop-blur-sm border transition-all duration-300 group-hover:shadow-lg dark:bg-background/80">
          {" "}
          {/* Removed hover:shadow-lg as HoverGlowCard handles hover */}
          <div className="p-6 h-full flex flex-col relative z-10">
            <FrostedGlassIcon icon={icon} color={accentColor} className="mb-4 self-start" />

            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground flex-grow">{description}</p>
          </div>
          <motion.div
            className="absolute inset-0 z-0 opacity-20 dark:opacity-30"
            initial={{ opacity: 0 }}
            animate={{
              background: [
                `radial-gradient(circle at 30% 30%, ${adjustedAccentColor} 0%, transparent 60%)`,
                `radial-gradient(circle at 70% 70%, ${adjustedAccentColor} 0%, transparent 60%)`,
              ],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </Card>
      </motion.div>
    </HoverGlowCard>
  )
}
