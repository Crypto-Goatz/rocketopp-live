"use client"

/**
 * Full-bleed looping video background with:
 *  - Lazy mount below-the-fold (IntersectionObserver)
 *  - Auto-pause when offscreen (saves CPU + bandwidth)
 *  - `prefers-reduced-motion` → static first frame only
 *  - Poster frame for instant visual before MP4 loads
 *  - Configurable darkening overlay for text legibility
 */

import { useEffect, useRef, useState } from "react"

type Overlay = "dark" | "darker" | "bottom" | "top" | "radial"

interface VideoBackgroundProps {
  src: string
  poster?: string
  eager?: boolean
  overlay?: Overlay
  className?: string
  children?: React.ReactNode
  /** Additional classes for the inner content wrapper (below overlay) */
  contentClassName?: string
}

const OVERLAY: Record<Overlay, string> = {
  dark: "bg-black/55",
  darker: "bg-black/70",
  bottom:
    "bg-gradient-to-t from-background via-background/70 to-background/20",
  top: "bg-gradient-to-b from-background via-background/60 to-transparent",
  radial:
    "bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.8)_100%)]",
}

export function VideoBackground({
  src,
  poster,
  eager = false,
  overlay = "dark",
  className = "",
  children,
  contentClassName = "",
}: VideoBackgroundProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [mount, setMount] = useState(eager)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handle = () => setReduced(mq.matches)
    handle()
    mq.addEventListener?.("change", handle)
    return () => mq.removeEventListener?.("change", handle)
  }, [])

  useEffect(() => {
    if (mount || !wrapRef.current) return
    const el = wrapRef.current
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMount(true)
          io.disconnect()
        }
      },
      { rootMargin: "300px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mount])

  useEffect(() => {
    if (!mount || !videoRef.current) return
    const v = videoRef.current
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            v.play().catch(() => {})
          } else {
            v.pause()
          }
        }
      },
      { threshold: 0.15 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [mount])

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {mount && !reduced ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          // @ts-expect-error – valid attribute, not in TS DOM lib
          disableRemotePlayback=""
          controls={false}
        />
      ) : poster ? (
        // Reduced-motion or not-yet-mounted: show poster
        <img
          src={poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading={eager ? "eager" : "lazy"}
        />
      ) : null}

      <div className={`absolute inset-0 ${OVERLAY[overlay]}`} />
      {children ? (
        <div className={`relative h-full w-full pointer-events-auto ${contentClassName}`}>
          {children}
        </div>
      ) : null}
    </div>
  )
}

export const ROCKETOPP_HERO_VIDEO =
  "https://assets.cdn.filesafe.space/6MSqx0trfxgLxeHBJE1k/media/6887ae9ff9fb83f0f3ed1848.mp4"
