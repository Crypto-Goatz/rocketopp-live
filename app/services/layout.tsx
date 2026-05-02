import type { ReactNode } from "react"
import { ServicePageCta } from "@/components/order/service-page-cta"
import { ServiceAccentScope } from "@/components/order/service-accent-scope"

/**
 * Wraps every /services/* page in:
 *  - ServiceAccentScope: sets a CSS variable scope that overrides --primary
 *    with the per-service accent color so existing primary-colored UI on
 *    each page automatically retints to the service's brand color.
 *  - ServicePageCta: floating bottom CTA that funnels to the /order wizard
 *    with the right service pre-seeded.
 */
export default function ServicesLayout({ children }: { children: ReactNode }) {
  return (
    <ServiceAccentScope>
      {children}
      <ServicePageCta />
    </ServiceAccentScope>
  )
}
