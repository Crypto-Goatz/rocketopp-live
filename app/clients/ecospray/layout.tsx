import type { Metadata } from "next"
import EcosprayNavbar from "./components/navbar"

export const metadata: Metadata = {
  title: "EcoSpray Solutions | Spray Foam Insulation Pittsburgh",
  description: "Pittsburgh's trusted spray foam insulation experts. Save up to 50% on energy bills with professional residential and commercial insulation services in Murrysville, PA and surrounding areas.",
  keywords: ["spray foam insulation", "Pittsburgh insulation", "Murrysville PA", "energy savings", "residential insulation", "commercial insulation"],
  openGraph: {
    title: "EcoSpray Solutions | Spray Foam Insulation Pittsburgh",
    description: "Save up to 50% on energy bills with professional spray foam insulation services.",
    url: "https://ecospraysolutions.com",
    siteName: "EcoSpray Solutions",
    locale: "en_US",
    type: "website",
  },
}

export default function EcosprayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <style jsx global>{`
        :root {
          --ecospray-primary: 142 76% 36%;
          --ecospray-primary-light: 142 70% 45%;
          --ecospray-accent: 142 80% 40%;
        }
      `}</style>
      <EcosprayNavbar />
      <main>{children}</main>
    </div>
  )
}
