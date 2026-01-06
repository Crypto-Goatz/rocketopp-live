"use client"

import { useEffect, useRef, useCallback, useState } from "react"

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  opacity: number
  life: number
  maxLife: number
}

interface NebulaPulse {
  x: number
  y: number
  radius: number
  opacity: number
  pulseSpeed: number
  pulsePhase: number
  color: string
}

export default function InteractiveStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const starsRef = useRef<Star[]>([])
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const nebulaPulsesRef = useRef<NebulaPulse[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const initializeStars = useCallback((width: number, height: number) => {
    const stars: Star[] = []
    const starCount = Math.floor((width * height) / 8000)

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }

    starsRef.current = stars
  }, [])

  const initializeNebulaPulses = useCallback((width: number, height: number) => {
    const pulses: NebulaPulse[] = []
    const pulseCount = 3

    for (let i = 0; i < pulseCount; i++) {
      pulses.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 100 + 50,
        opacity: Math.random() * 0.1 + 0.05,
        pulseSpeed: Math.random() * 0.01 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        color: ["rgba(120, 120, 255, ", "rgba(255, 120, 255, ", "rgba(120, 255, 255, "][i % 3],
      })
    }

    nebulaPulsesRef.current = pulses
  }, [])

  const createShootingStar = useCallback((width: number, height: number) => {
    const side = Math.floor(Math.random() * 4)
    let x, y, vx, vy

    switch (side) {
      case 0: // Top
        x = Math.random() * width
        y = -10
        vx = (Math.random() - 0.5) * 4
        vy = Math.random() * 3 + 2
        break
      case 1: // Right
        x = width + 10
        y = Math.random() * height
        vx = -(Math.random() * 3 + 2)
        vy = (Math.random() - 0.5) * 4
        break
      case 2: // Bottom
        x = Math.random() * width
        y = height + 10
        vx = (Math.random() - 0.5) * 4
        vy = -(Math.random() * 3 + 2)
        break
      default: // Left
        x = -10
        y = Math.random() * height
        vx = Math.random() * 3 + 2
        vy = (Math.random() - 0.5) * 4
        break
    }

    const maxLife = Math.random() * 60 + 40

    return {
      x,
      y,
      vx,
      vy,
      length: Math.random() * 20 + 10,
      opacity: Math.random() * 0.8 + 0.2,
      life: maxLife,
      maxLife,
    }
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = canvas
    const isDark = true

    ctx.clearRect(0, 0, width, height)

    nebulaPulsesRef.current.forEach((pulse) => {
      pulse.pulsePhase += pulse.pulseSpeed
      const currentOpacity = pulse.opacity * (0.5 + 0.5 * Math.sin(pulse.pulsePhase))

      const gradient = ctx.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, pulse.radius)
      gradient.addColorStop(0, `${pulse.color}${currentOpacity})`)
      gradient.addColorStop(1, `${pulse.color}0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(pulse.x - pulse.radius, pulse.y - pulse.radius, pulse.radius * 2, pulse.radius * 2)
    })

    starsRef.current.forEach((star) => {
      star.twinklePhase += star.twinkleSpeed
      const twinkleOpacity = star.opacity * (0.3 + 0.7 * Math.sin(star.twinklePhase))

      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${twinkleOpacity})` : `rgba(100, 100, 150, ${twinkleOpacity * 0.8})`
      ctx.fill()
    })

    shootingStarsRef.current.forEach((shootingStar, index) => {
      shootingStar.x += shootingStar.vx
      shootingStar.y += shootingStar.vy
      shootingStar.life--

      if (
        shootingStar.life <= 0 ||
        shootingStar.x < -50 ||
        shootingStar.x > width + 50 ||
        shootingStar.y < -50 ||
        shootingStar.y > height + 50
      ) {
        shootingStarsRef.current.splice(index, 1)
        return
      }

      const lifeRatio = shootingStar.life / shootingStar.maxLife
      const currentOpacity = shootingStar.opacity * lifeRatio

      ctx.beginPath()
      ctx.moveTo(shootingStar.x, shootingStar.y)
      ctx.lineTo(
        shootingStar.x - shootingStar.vx * shootingStar.length,
        shootingStar.y - shootingStar.vy * shootingStar.length,
      )
      ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${currentOpacity})` : `rgba(150, 150, 200, ${currentOpacity})`
      ctx.lineWidth = 2
      ctx.stroke()
    })

    if (Math.random() < 0.003) {
      shootingStarsRef.current.push(createShootingStar(width, height))
    }
  }, [createShootingStar])

  const animate = useCallback(() => {
    draw()
    animationRef.current = requestAnimationFrame(animate)
  }, [draw])

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    initializeStars(canvas.width, canvas.height)
    initializeNebulaPulses(canvas.width, canvas.height)
  }, [initializeStars, initializeNebulaPulses])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    handleResize()
    animate()

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [handleResize, animate, handleMouseMove])

  if (!mounted) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  )
}
