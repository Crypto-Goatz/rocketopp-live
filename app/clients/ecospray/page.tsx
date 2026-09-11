import { withCro9Meta } from '@/lib/cro9-meta'
import type { Metadata } from 'next'
import EcosprayHero from "./components/hero"
import EcosprayServices from "./components/services"
import EcosprayBenefits from "./components/benefits"
import EcosprayProcess from "./components/process"
import EcosprayTestimonials from "./components/testimonials"
import EcosprayCta from "./components/cta"
import EcosprayFooter from "./components/footer"

export default function EcosprayPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <EcosprayHero />
      <EcosprayServices />
      <EcosprayBenefits />
      <EcosprayProcess />
      <EcosprayTestimonials />
      <EcosprayCta />
      <EcosprayFooter />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/clients/ecospray', {})
}
