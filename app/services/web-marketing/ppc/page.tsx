import type { Metadata } from "next"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart2, Target, DollarSign, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "PPC Advertising Services | Rocket Opp",
  description:
    "Maximize your ROI with Rocket Opp's expert Pay-Per-Click (PPC) management for Google Ads, Facebook Ads, and more. Drive targeted traffic and generate leads.",
}

const ppcPlatforms = [
  {
    name: "Google Ads",
    description: "Search, Display, Shopping, Video, and Remarketing campaigns to reach high-intent users.",
  },
  {
    name: "Facebook & Instagram Ads",
    description: "Advanced audience targeting and diverse ad formats to engage users on social media.",
  },
  { name: "LinkedIn Ads", description: "Ideal for B2B marketing, reaching professionals and decision-makers." },
  {
    name: "Other Platforms",
    description: "Campaigns on platforms like X (Twitter), Pinterest, and TikTok based on your audience.",
  },
]

export default function PpcPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <section
          className="py-12 md:py-16 bg-primary/5 dark:bg-primary/10 relative"
          style={{
            backgroundImage: "url(/photorealistic-astronaut-managing-ppc-campaigns.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/85" />
          <div className="container text-center relative z-10">
            <BarChart2 className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Pay-Per-Click (PPC) Advertising</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Supercharge your growth with Rocket Opp's expert PPC management. We create targeted campaigns that deliver
              immediate results and maximize your return on investment.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Benefits of PPC with Rocket Opp</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                {
                  title: "Immediate Results",
                  icon: <Target className="h-10 w-10 text-primary" />,
                  description: "Drive traffic as soon as your ads go live.",
                },
                {
                  title: "Precise Targeting",
                  icon: <DollarSign className="h-10 w-10 text-primary" />,
                  description: "Reach specific demographics, locations, and interests.",
                },
                {
                  title: "Cost Control & Measurable ROI",
                  icon: <CheckCircle className="h-10 w-10 text-primary" />,
                  description: "Manage your budget effectively and track every conversion.",
                },
              ].map((benefit) => (
                <div key={benefit.title} className="p-6 bg-card rounded-lg shadow-lg">
                  <div className="flex justify-center mb-3">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/50 dark:bg-muted/20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-10">Platforms We Manage</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {ppcPlatforms.map((platform) => (
                <div key={platform.name} className="p-6 bg-card rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-primary mb-2">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link href="/#contact?service=ppc-management">Optimize Your Ad Spend</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
