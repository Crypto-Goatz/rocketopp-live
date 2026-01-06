import type { Metadata } from "next"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, CheckCircle, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "SEO Optimization Services | Rocket Opp",
  description:
    "Boost your search engine rankings and drive organic traffic with Rocket Opp's expert SEO services, including audits, keyword research, on-page, technical, and local SEO.",
}

const seoServices = [
  {
    title: "Comprehensive SEO Audits",
    description: "In-depth analysis of your site's current SEO performance to identify strengths and weaknesses.",
  },
  {
    title: "Keyword Research & Strategy",
    description: "Identifying high-traffic, relevant keywords and crafting a plan to rank for them.",
  },
  {
    title: "On-Page SEO Optimization",
    description: "Optimizing content, meta tags, and internal linking for better visibility and usability.",
  },
  {
    title: "Technical SEO",
    description:
      "Ensuring your site meets search engine technical requirements, including speed and mobile-friendliness.",
  },
  {
    title: "Local SEO",
    description: "Boosting visibility in local search results for businesses serving specific geographic areas.",
  },
  {
    title: "Link Building",
    description: "Acquiring high-quality backlinks from authoritative sites to boost domain authority.",
  },
]

export default function SeoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-primary/5 dark:bg-primary/10">
          <div className="container text-center">
            <Search className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Search Engine Optimization (SEO)</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Unlock the power of organic search. Rocket Opp's SEO services enhance your visibility, drive targeted
              traffic, and increase conversions.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Our SEO Services Include:</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {seoServices.map((service) => (
                <div key={service.title} className="p-6 bg-card rounded-lg shadow-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-3" />
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/50 dark:bg-muted/20">
          <div className="container text-center">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-6">Why SEO is Essential</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Increased visibility, cost-effective marketing, building trust and credibility, and achieving long-term
              sustainable results are key benefits of a strong SEO strategy.
            </p>
            <Button asChild size="lg">
              <Link href="/#contact?service=seo-audit">Request an SEO Audit</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
