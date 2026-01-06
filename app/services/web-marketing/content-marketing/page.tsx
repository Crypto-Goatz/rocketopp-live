import type { Metadata } from "next"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit3, FileText, Video } from "lucide-react"

export const metadata: Metadata = {
  title: "Content Marketing Services | Rocket Opp",
  description:
    "Tell your brand's story and engage your audience with Rocket Opp's expert content marketing services, including strategy, creation, SEO optimization, and distribution.",
}

const contentServices = [
  {
    title: "Content Strategy Development",
    description: "Customized strategies aligned with your business goals and target audience.",
  },
  {
    title: "High-Quality Content Creation",
    description: "Blog posts, articles, infographics, videos, and more, crafted by expert writers and designers.",
  },
  {
    title: "SEO Optimization for Content",
    description: "Ensuring every piece of content is optimized for maximum search engine visibility.",
  },
  {
    title: "Multi-Channel Content Distribution",
    description: "Reaching your audience across social media, email, and third-party publications.",
  },
  {
    title: "Performance Analysis & Reporting",
    description: "Tracking content effectiveness and refining strategies for better results.",
  },
]

export default function ContentMarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <section
          className="py-12 md:py-16 bg-primary/5 dark:bg-primary/10 relative"
          style={{
            backgroundImage: "url(/photorealistic-astronaut-creating-content.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/85" />
          <div className="container text-center relative z-10">
            <Edit3 className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Content Marketing</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Captivate your audience and drive conversions with compelling content. Rocket Opp creates and executes
              content strategies that build authority and deliver value.
            </p>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Our Comprehensive Content Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentServices.map((service) => (
                <div key={service.title} className="p-6 bg-card rounded-lg shadow-lg">
                  <FileText className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/50 dark:bg-muted/20">
          <div className="container text-center">
            <Video className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-6">Why Content Marketing is Effective</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Content marketing expands reach, boosts SEO, increases ROI through lead generation, and fosters customer
              retention. However, it's time-consuming and skill-intensive to do it yourself.
            </p>
            <Button asChild size="lg">
              <Link href="/#contact?service=content-strategy">Develop Your Content Strategy</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
