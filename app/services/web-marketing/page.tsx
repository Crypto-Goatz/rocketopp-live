import { CardFooter } from "@/components/ui/card"
import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Search, BarChart2, Users, Edit3, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Strategic Web Marketing Services | Rocket Opp",
  description:
    "Drive growth with Rocket Opp's data-driven web marketing: SEO, PPC, Social Media, and Content Marketing strategies tailored for your success.",
}

const marketingServices = [
  {
    title: "Search Engine Optimization (SEO)",
    description: "Improve visibility and rank higher on search engines to attract organic, high-intent traffic.",
    href: "/services/web-marketing/seo",
    icon: <Search className="h-8 w-8 text-primary" />,
  },
  {
    title: "Pay-Per-Click (PPC) Advertising",
    description: "Achieve immediate results with targeted ad campaigns that maximize your ROI.",
    href: "/services/web-marketing/ppc",
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
  },
  {
    title: "Social Media Marketing",
    description: "Engage your audience, build brand loyalty, and drive conversions through strategic social campaigns.",
    href: "/services/web-marketing/social-media",
    icon: <Users className="h-8 w-8 text-primary" />,
  },
  {
    title: "Content Marketing",
    description: "Tell your brand’s story with impactful content that captivates and converts.",
    href: "/services/web-marketing/content-marketing",
    icon: <Edit3 className="h-8 w-8 text-primary" />,
  },
]

export default function WebMarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-primary/5 dark:bg-primary/10">
          <div className="container text-center">
            <LineChart className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Strategic Web Marketing</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Amplify your online presence and achieve measurable results with Rocket Opp’s comprehensive web marketing
              services. We combine data-driven strategies with creative execution.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Our Core Marketing Disciplines</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {marketingServices.map((service) => (
                <Card key={service.title} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader className="items-center text-center">
                    {service.icon}
                    <CardTitle className="text-xl mt-2">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow text-center">
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button asChild variant="link" className="text-primary group">
                      <Link href={service.href}>
                        Explore {service.title.split("(")[0].trim()}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/50 dark:bg-muted/20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Ignite Your Growth?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Let our expert marketers craft a tailored strategy to help you achieve your business objectives.
            </p>
            <Button asChild size="lg">
              <Link href="/#contact?service=web-marketing">Get a Marketing Consultation</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
