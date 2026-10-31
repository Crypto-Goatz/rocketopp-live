"use client"

import { useRef, type ReactNode } from "react"

/**
 * Pointer tilt for the free-website page. Writes --rx/--ry/--gx/--gy on the element and lets CSS do the 3D — no React state,
 * no animation library, one rAF per frame. Touch screens and reduced-motion visitors get the static (still 3D) layout.
 */
export function Tilt({ children, className, max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--ry", `${((x - 0.5) * 2 * max).toFixed(2)}deg`)
      el.style.setProperty("--rx", `${((0.5 - y) * 2 * max).toFixed(2)}deg`)
      el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`)
      el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`)
      el.dataset.tilting = "1"
    })
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
    delete el.dataset.tilting
  }

  return (
    <div ref={ref} className={className} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  )
}
