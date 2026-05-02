"use client"

import { usePathname } from "next/navigation"
import Navbar from "./navbar"
import { SpaceBackground } from "./space-background"
import { CartDrawer } from "./cart/cart-drawer"

const HIDDEN_ROUTES = [
  "/dashboard",
  "/login",
  "/register",
  "/hipaa",
  "/gtm",
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
    </>
  )
}
