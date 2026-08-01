"use client"

import { usePathname } from "next/navigation"
import Navbar from "./navbar"
import { SpaceBackground } from "./space-background"
import { CartDrawer } from "./cart/cart-drawer"
import { ExitIntentAiReadiness } from "./exit-intent-ai-readiness"
import Reveal from "./reveal"

/**
 * THIS COMPONENT OWNS THE SITE HEADER. Read before adding a nav anywhere.
 *
 * <Navbar /> renders here, once, for every route not listed below. A page must
 * NEVER render <Navbar /> itself or hand-roll a `sticky top-0 z-50` bar — the
 * global nav is fixed at top-0/z-50, so anything else up there stacks a second
 * header on top of it. That is exactly what happened on /blog, /shop,
 * /ai-lead-tools, /onboarding/[slug] and /clients/ecospray.
 *
 * If a page needs its own chrome:
 *   - Owns the whole shell (client micro-sites, funnels)? Add its prefix to
 *     HIDDEN_ROUTES so the global nav steps aside.
 *   - Needs a contextual sub-bar (back link, share, filters)? Park it at
 *     `sticky top-16 z-40`, beneath the global nav — see app/blog/[slug].
 */
const HIDDEN_ROUTES = [
  "/dashboard",
  "/login",
  "/register",
  "/hipaa",
  "/gtm",
  // Client micro-sites ship their own layout + navbar (app/clients/*/layout.tsx).
  "/clients",
]

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const shouldHideNavbar = HIDDEN_ROUTES.some(route => pathname?.startsWith(route))

  if (shouldHideNavbar) {
    return <main>{children}</main>
  }

  return (
    <>
      <SpaceBackground />
      <Navbar />
      <main className="pt-16">{children}</main>
      <CartDrawer />
      <ExitIntentAiReadiness />
      <Reveal />
    </>
  )
}
