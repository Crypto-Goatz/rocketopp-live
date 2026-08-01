'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Adds .in-view to any .reveal element as it scrolls into frame.
 *
 * Mounted once at the layout level rather than wrapping each section in a
 * component, so markup stays plain and a section opts in with a class.
 *
 * ── Why this is not a plain useEffect(..., []) ──────────────────────────────
 *
 * It used to be. This component lives in LayoutWrapper, which PERSISTS across
 * client-side navigation, so the effect ran exactly once — for whichever page
 * happened to load first. Navigate to any other route and its .reveal sections
 * were never observed, so they sat at opacity:0 permanently. A hard refresh
 * remounted the layout and "fixed" it, which is exactly what it looked like
 * from the outside: content that only appears if you force-reload the page.
 *
 * Two things prevent that recurring:
 *   - pathname is a dependency, so every navigation re-scans the document.
 *   - a MutationObserver picks up .reveal nodes that arrive after the scan
 *     (streamed Suspense content, client-rendered islands, late data).
 */
export default function Reveal() {
  const pathname = usePathname()

  useEffect(() => {
    // The pre-paint script in app/layout.tsx set a timer that un-hides
    // everything if we never got here. We did, so cancel it.
    const w = window as Window & { __revealFailsafe?: ReturnType<typeof setTimeout> }
    if (w.__revealFailsafe) {
      clearTimeout(w.__revealFailsafe)
      w.__revealFailsafe = undefined
    }

    const revealAll = () => {
      document
        .querySelectorAll<HTMLElement>('.reveal:not(.in-view)')
        .forEach((n) => n.classList.add('in-view'))
    }

    // No IntersectionObserver: show everything rather than hide it.
    if (!('IntersectionObserver' in window)) {
      revealAll()
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

    const observe = (root: ParentNode) => {
      root
        .querySelectorAll<HTMLElement>('.reveal:not(.in-view)')
        .forEach((n) => io.observe(n))
    }

    observe(document)

    // Catch .reveal nodes added after this pass — streamed or client-rendered.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.classList.contains('reveal') && !node.classList.contains('in-view')) {
            io.observe(node)
          }
          observe(node)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
