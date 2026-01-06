"use client"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Database, Sparkles, TrendingDown, Users, Zap, CheckCircle, Building2, Target } from "lucide-react"
import { usePersonalizationStore } from "@/lib/personalization-store"

export default function AiCrmClientPage() {
  const { companyName, userName } = usePersonalizationStore()

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Fully Customized Applications",
      description:
        "Every CRM we build is tailored specifically to your business processes, workflows, and industry requirements. No templates, no compromises.",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Built-in AI Solutions",
      description:
        "Advanced AI capabilities integrated directly into your CRM - from predictive analytics to automated workflows and intelligent insights.",
    },
    {
      icon: <TrendingDown className="h-8 w-8 text-primary" />,
      title: "90% Cost Reduction",
      description:
        "Starting at just $5,000, our AI-powered development process delivers enterprise-level CRM solutions at a fraction of traditional costs.",
    },
    {
      icon: <Building2 className="h-8 w-8 text-primary" />,
      title: "Enterprise Technology",
      description:
        "The same cutting-edge technology used by Fortune 500 companies, now accessible to businesses of all sizes.",
    },
  ]

  const capabilities = [
    "Custom data models tailored to your business",
    "AI-powered lead scoring and qualification",
    "Automated workflow and task management",
    "Predictive analytics and forecasting",
    "Intelligent customer segmentation",
    "Natural language processing for communications",
    "Real-time reporting and dashboards",
    "Multi-channel integration (email, SMS, social)",
    "Mobile-responsive design",
    "Role-based access control and security",
    "API integrations with existing tools",
    "Scalable architecture for business growth",
  ]

  const stats = [
    { value: "$5,000", label: "Starting Price", subtext: "vs. $50,000+ industry average" },
    { value: "90%", label: "Cost Savings", subtext: "Compared to traditional development" },
    { value: "100%", label: "Customization", subtext: "Built for your specific needs" },
    { value: "Enterprise", label: "Technology Level", subtext: "Fortune 500 capabilities" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-primary/5 relative"
          style={{
            backgroundImage: "url(/photorealistic-astronaut-managing-futuristic-crm.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/85" />
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Featured Product</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                AI-Powered CRM
                <span className="block text-primary mt-2">Disrupting Industries</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Enterprise-level CRM technology starting at just $5,000. We've revolutionized the development process
                and passed the savings directly to small businesses competing with corporate giants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/ai-assessment-start">Get Your Custom CRM</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.subtext}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Leveling the Playing Field</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We've worked with enterprise clients and small businesses alike. We've seen firsthand how corporate
                giants leverage cutting-edge technology to dominate their markets. Now, we're shifting gears.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                By cutting our own development time by 90% through AI-powered automation, we're able to offer the same
                enterprise-level CRM solutions at a fraction of the cost. This isn't just about making technology
                affordable - <strong className="text-foreground">this is about disrupting entire industries</strong>.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Small businesses in all industries can now compete with the corporations they're up against, using the
                exact same technology those corporations rely on.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise Technology, Small Business Price</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Completely customized CRM solutions with fully integrated AI capabilities, built specifically for your
                business
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="p-8 bg-card rounded-lg shadow-lg">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Database className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Capabilities Built-In</h2>
                <p className="text-lg text-muted-foreground">
                  Every CRM includes advanced features customized to your specific business needs
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why This Changes Everything</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="text-5xl font-bold text-primary mb-4">$50k+</div>
                  <div className="font-semibold mb-2">Traditional CRM Development</div>
                  <div className="text-sm text-muted-foreground">
                    Industry standard pricing for custom enterprise CRM solutions
                  </div>
                </div>
                <div className="text-center p-6 bg-card rounded-lg shadow-lg border-2 border-primary">
                  <div className="text-5xl font-bold text-primary mb-4">$5k</div>
                  <div className="font-semibold mb-2">Our AI-Powered Process</div>
                  <div className="text-sm text-muted-foreground">
                    Same enterprise technology, 90% less cost through automation
                  </div>
                </div>
                <div className="text-center p-6">
                  <div className="text-5xl font-bold text-primary mb-4">100%</div>
                  <div className="font-semibold mb-2">Customization Level</div>
                  <div className="text-sm text-muted-foreground">
                    Built entirely for your specific business needs and processes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Compete with Enterprise Competitors?</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Stop letting corporate giants have all the technological advantages. Get enterprise-level CRM technology
                built specifically for your business at a price that makes sense.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/ai-assessment-start">Start Your Custom CRM Project</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
                  <Link href="/#contact">Schedule a Consultation</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Starting at $5,000 • Enterprise Technology • Fully Customized • Built-in AI
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
