"use client"

import { useEffect, useRef } from "react"

type Star = {
  x: number
  y: number
  r: number
  layer: number
  hue: number
  baseAlpha: number
  twinkleAmp: number
  twinklePhase: number
  twinkleSpeed: number
}

type Shooter = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  ttl: number
  len: number
}

const STAR_COUNTS = [60, 45, 25] // far, mid, near
const LAYER_DRIFT = [0.012, 0.028, 0.06] // px/ms — far drifts slowest
const LAYER_RADIUS = [0.6, 1.0, 1.6]
const LAYER_BASE_ALPHA = [0.35, 0.55, 0.85]

const HUES = [210, 220, 200, 30, 25, 280] // mostly blue-white, hint of warm + violet for variety

const PRIMARY_DRIFT_X = -1 // direction multiplier (drift left)
const PRIMARY_DRIFT_Y = 0.18 // slight diagonal

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let stars: Star[] = []
    let shooters: Shooter[] = []
    let raf = 0
    let last = performance.now()
    let nextShooterAt = performance.now() + rand(8000, 16000)
    let running = true

    const seedStars = () => {
      stars = []
      for (let layer = 0; layer < STAR_COUNTS.length; layer++) {
        const count = Math.round(STAR_COUNTS[layer] * (width * height) / (1280 * 720))
        for (let i = 0; i < count; i++) {
          stars.push({
            x: rand(0, width),
            y: rand(0, height),
            r: LAYER_RADIUS[layer] * rand(0.7, 1.3),
            layer,
            hue: HUES[Math.floor(rand(0, HUES.length))],
            baseAlpha: LAYER_BASE_ALPHA[layer] * rand(0.7, 1),
            twinkleAmp: rand(0.15, 0.4),
            twinklePhase: rand(0, Math.PI * 2),
            twinkleSpeed: rand(0.0006, 0.0018), // radians/ms
          })
        }
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seedStars()
    }

    const spawnShooter = () => {
      const fromTop = Math.random() > 0.5
      const x = rand(width * 0.1, width * 0.9)
      const y = fromTop ? -20 : rand(0, height * 0.4)
      const angle = rand(Math.PI * 0.15, Math.PI * 0.35) // diagonal down-left-ish
      const speed = rand(0.4, 0.7) // px/ms
      shooters.push({
        x,
        y,
        vx: -Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        ttl: rand(900, 1500),
        len: rand(80, 140),
      })
    }

    const draw = (now: number) => {
      const dt = Math.min(now - last, 64) // clamp big tab-switch jumps
      last = now

      // Fully transparent clear so the CSS nebula gradient underneath shows through.
      // Shooter trails are drawn as gradient lines per frame, so no motion-blur needed.
      ctx.clearRect(0, 0, width, height)

      // Drift + render stars
      for (const s of stars) {
        if (!reduced) {
          const drift = LAYER_DRIFT[s.layer] * dt
          s.x += PRIMARY_DRIFT_X * drift
          s.y += PRIMARY_DRIFT_Y * drift
          // wrap — perfect loop
          if (s.x < -2) s.x = width + 2
          else if (s.x > width + 2) s.x = -2
          if (s.y < -2) s.y = height + 2
          else if (s.y > height + 2) s.y = -2
        }

        const twinkle = reduced
          ? 0
          : s.twinkleAmp * Math.sin(now * s.twinkleSpeed + s.twinklePhase)
        const alpha = Math.max(0, Math.min(1, s.baseAlpha + twinkle))

        // crisp dot + soft halo for near layer
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${s.hue}, 80%, 88%, ${alpha})`
        ctx.fill()

        if (s.layer === 2) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 2.6, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${s.hue}, 80%, 80%, ${alpha * 0.12})`
          ctx.fill()
        }
      }

      // Shooting stars — sparse, only when not reduced
      if (!reduced) {
        if (now > nextShooterAt && shooters.length < 2) {
          spawnShooter()
          nextShooterAt = now + rand(9000, 18000)
        }
        shooters = shooters.filter((sh) => {
          sh.life += dt
          sh.x += sh.vx * dt
          sh.y += sh.vy * dt
          const t = sh.life / sh.ttl
          if (t >= 1) return false

          const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85
          const alpha = Math.max(0, fade) * 0.85
          const tailX = sh.x - sh.vx * sh.len * 0.6
          const tailY = sh.y - sh.vy * sh.len * 0.6

          const grad = ctx.createLinearGradient(tailX, tailY, sh.x, sh.y)
          grad.addColorStop(0, "rgba(255, 200, 140, 0)")
          grad.addColorStop(0.7, `rgba(255, 220, 180, ${alpha * 0.6})`)
          grad.addColorStop(1, `rgba(255, 245, 230, ${alpha})`)

          ctx.strokeStyle = grad
          ctx.lineWidth = 1.2
          ctx.lineCap = "round"
          ctx.beginPath()
          ctx.moveTo(tailX, tailY)
          ctx.lineTo(sh.x, sh.y)
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(sh.x, sh.y, 1.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 245, 230, ${alpha})`
          ctx.fill()

          return true
        })
      }

      raf = requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(draw)
      }
    }

    resize()
    window.addEventListener("resize", resize)
    document.addEventListener("visibilitychange", onVisibility)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Deep space gradient base — painted via CSS so it never flickers */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 20% 10%, rgba(80, 40, 140, 0.18) 0%, transparent 55%), radial-gradient(ellipse 90% 70% at 85% 90%, rgba(220, 90, 30, 0.12) 0%, transparent 55%), radial-gradient(ellipse 100% 100% at 50% 50%, rgba(10, 14, 28, 1) 0%, rgba(4, 6, 12, 1) 100%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
