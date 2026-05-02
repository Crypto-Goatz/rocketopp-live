import type { ReactNode } from "react"
import { ServicePageCta } from "@/components/order/service-page-cta"

/**
 * Wraps every /services/* page with a sticky bottom CTA that funnels to
 * the /order wizard with the right service pre-seeded.
 */
export default function ServicesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ServicePageCta />
    </>
  )
}
