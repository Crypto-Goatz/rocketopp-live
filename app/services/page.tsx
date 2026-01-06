import type { Metadata } from "next"
import Footer from "@/components/footer"
import ServicesPageClient from "./ServicesPageClient"

export const metadata: Metadata = {
  title: "Our Services | Rocket Opp",
  description:
    "Explore Rocket Opp's comprehensive digital solutions: Website Design, AI Integration, App Development, and strategic Web Marketing services to elevate your business.",
}

export default function ServicesPage() {
  return (
    <>
      <ServicesPageClient />
      <Footer />
    </>
  )
}
