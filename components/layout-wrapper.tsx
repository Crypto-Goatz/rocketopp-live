"use client"

import { usePathname } from "next/navigation"
import Navbar from "./navbar"

// Routes that should NOT show the public navbar or have pt-16 padding
const HIDDEN_ROUTES = [
  "/dashboard",
  "/login",
  "/register",
]

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide navbar on dashboard, login, register routes
  const shouldHideNavbar = HIDDEN_ROUTES.some(route => pathname?.startsWith(route))

  if (shouldHideNavbar) {
    // No navbar, no padding
    return <main>{children}</main>
  }

  // Public pages: navbar + padding
  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
    </>
  )
}
