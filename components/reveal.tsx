'use client'

import { useEffect } from 'react'

/**
 * Adds .in-view to any .reveal element as it scrolls into frame.
 *
 * Mounted once at the layout level rather than wrapping each section in a
 * component, so markup stays plain and a section opts in with a class.
 *
 * Progressive enhancement: .reveal's hidden base state is only applied by the
 * stylesheet, and this observer reveals it. If JS fails the CSS still shows
 * content on the reduced-motion path, and the observer marks everything visible
 * immediately when IntersectionObserver is unavailable.
 */
export default function Reveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!nodes.length) return

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('in-view'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return null
}
