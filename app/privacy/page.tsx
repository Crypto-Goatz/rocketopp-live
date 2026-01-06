import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import PrivacyPolicyTemplate from "@/components/privacy-policy-template"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Rocket Opp",
  description: "Our commitment to protecting your privacy and securing your data at Rocket Opp.",
}

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow pt-8">
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <div className="mb-8">
              <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            </div>

            <PrivacyPolicyTemplate
              companyName="Rocket Opp"
              websiteUrl="https://rocket-opp.com"
              contactEmail="privacy@rocket-opp.com"
              contactAddress={`Rocket Opp\n123 Innovation Drive\nTech Hub, USA 12345`}
              lastUpdated={currentDate}
              includeGDPR={true}
              includeCCPA={true}
              includeCookies={true}
              includeAnalytics={true}
              includeThirdPartyServices={[
                "Google Analytics",
                "Vercel Analytics",
                "CRM Integration Name",
                "AI Model Provider",
              ]}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
