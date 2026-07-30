'use client'

import { useEffect, useRef } from 'react'

/**
 * Reading-progress bar for long-form articles.
 *
 * Two deliberate choices:
 *
 * 1. It measures against the ARTICLE's own height, not the document's. A long
 *    footer or a related-posts rail would otherwise make the bar read "40% done"
 *    when the article itself is finished.
 *
 * 2. It writes a CSS custom property on the node instead of setting React state.
 *    Scroll fires dozens of times a second; re-rendering a component that often to
 *    change one number is waste, and the width lives in globals.css
 *    (.reading-progress-fill) rather than as an inline style.
 *
 * Pass the id of the element to track.
 */
export default function ReadingProgress({ target }: { target: string }) {
  const fillRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = document.getElementById(target)
    const fill = fillRef.current
    const bar = barRef.current
    if (!el || !fill || !bar) return

    let frame = 0
    const measure = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const pct = total <= 0 ? 0 : Math.min(100, Math.max(0, (-rect.top / total) * 100))
      fill.style.setProperty('--progress', `${pct}%`)
      bar.setAttribute('aria-valuenow', String(Math.round(pct)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [target])

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 top-0 z-[60] h-0.5"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div ref={fillRef} className="reading-progress-fill h-full bg-primary" />
    </div>
  )
}
