'use client'

/**
 * HipaaAnimatedBackground — deep space atmosphere for /hipaa surfaces.
 *
 *   - 60 stars placed deterministically with varied sparkle cadences
 *   - Three slow-moving gradient blobs (red, orange, cyan) for depth
 *
 * Pure CSS, no JS animation loop, no canvas. Respects prefers-reduced-motion.
 * Fixed position behind all page content (z-index: 0, pointer-events: none).
 */

import { useMemo } from 'react'

interface Star {
  top: string
  left: string
  size: number
  delay: string
  duration: string
  brightness: number
}

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = t
    r = Math.imul(r ^ (r >>> 15), r | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function HipaaAnimatedBackground() {
  const stars = useMemo<Star[]>(() => {
    const rand = mulberry32(42)
    return Array.from({ length: 60 }, () => ({
      top: `${(rand() * 100).toFixed(2)}%`,
      left: `${(rand() * 100).toFixed(2)}%`,
      size: 1 + rand() * 2,
      delay: `${(rand() * 6).toFixed(2)}s`,
      duration: `${(3 + rand() * 5).toFixed(2)}s`,
      brightness: 0.35 + rand() * 0.55,
    }))
  }, [])

  return (
    <div className="hipaa-bg" aria-hidden="true">
      {/* Gradient blobs */}
      <div className="hipaa-bg__blob hipaa-bg__blob--red" />
      <div className="hipaa-bg__blob hipaa-bg__blob--orange" />
      <div className="hipaa-bg__blob hipaa-bg__blob--cyan" />

      {/* Stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="hipaa-bg__star"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: s.delay,
            animationDuration: s.duration,
            opacity: s.brightness,
          }}
        />
      ))}

      <style jsx>{`
        .hipaa-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .hipaa-bg__star {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
          animation: hipaaStarPulse ease-in-out infinite;
          will-change: opacity, transform;
        }
        @keyframes hipaaStarPulse {
          0%, 100% {
            opacity: var(--op, 0.35);
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        .hipaa-bg__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.55;
          will-change: transform;
        }
        .hipaa-bg__blob--red {
          width: 620px;
          height: 620px;
          top: -160px;
          left: -120px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.22), transparent 70%);
          animation: hipaaDriftA 32s ease-in-out infinite alternate;
        }
        .hipaa-bg__blob--orange {
          width: 540px;
          height: 540px;
          bottom: -140px;
          right: -120px;
          background: radial-gradient(circle, rgba(255, 107, 53, 0.2), transparent 70%);
          animation: hipaaDriftB 38s ease-in-out infinite alternate;
        }
        .hipaa-bg__blob--cyan {
          width: 480px;
          height: 480px;
          top: 40%;
          left: 55%;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.12), transparent 70%);
          animation: hipaaDriftC 44s ease-in-out infinite alternate;
        }
        @keyframes hipaaDriftA {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(80px, 60px) scale(1.08); }
        }
        @keyframes hipaaDriftB {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-70px, -90px) scale(1.06); }
        }
        @keyframes hipaaDriftC {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-120px, 70px) scale(1.04); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hipaa-bg__star,
          .hipaa-bg__blob {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
