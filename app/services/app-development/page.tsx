import type { Metadata } from "next"
import { Code2, Smartphone, Globe, Layers, Database, Cloud, Shield, Rocket, CheckCircle, ArrowRight, Award, Zap, Users } from "lucide-react"
import { ServiceHero } from "@/components/service-hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "App Development Services | Mobile & Web Applications | RocketOpp",
  description: "Transform your ideas into powerful applications. Custom mobile apps, web applications, and SaaS products built with modern technology. From MVP to enterprise scale.",
  keywords: "app development, mobile apps, web applications, SaaS development, iOS development, Android development, React Native, cross-platform apps, custom software, RocketOpp",
  authors: [{ name: "RocketOpp", url: "https://rocketopp.com" }],
  openGraph: {
    title: "App Development Services | Mobile & Web Apps | RocketOpp",
    description: "Custom mobile apps, web applications, and SaaS products built with cutting-edge technology.",
    url: "https://rocketopp.com/services/app-development",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/og-app-development.jpg",
        width: 1200,
        height: 630,
        alt: "RocketOpp App Development Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "App Development Services | RocketOpp",
    description: "Custom app development from MVP to enterprise scale.",
    images: ["https://rocketopp.com/twitter-app-development.jpg"],
  },
  alternates: {
    canonical: "https://rocketopp.com/services/app-development",
  },
}

const services = [
  {
    id: "mobile",
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile apps for iOS and Android that deliver exceptional user experiences.",
    features: ["React Native / Flutter", "Native iOS & Android", "Offline-First Architecture"]
  },
  {
    id: "web",
    icon: Globe,
    title: "Web Applications",
    description: "Powerful web applications that run in any browser with desktop-class performance and capabilities.",
    features: ["Progressive Web Apps", "Real-Time Features", "Responsive Design"]
  },
  {
    id: "saas",
    icon: Layers,
    title: "SaaS Products",
    description: "Full-featured SaaS platforms with subscription management, multi-tenancy, and scalable architecture.",
    features: ["Multi-Tenant Architecture", "Subscription Billing", "Analytics Dashboard"]
  },
  {
    icon: Database,
    title: "Backend Development",
    description: "Robust, scalable backend systems that power your applications with security and reliability.",
    features: ["API Development", "Database Design", "Microservices"]
  },
]

const process = [
  { step: "01", title: "Ideation", description: "We refine your concept, define features, and create a technical roadmap." },
  { step: "02", title: "Design", description: "UI/UX design that focuses on user engagement and conversion." },
  { step: "03", title: "Build", description: "Agile development with regular demos and iterative improvements." },
  { step: "04", title: "Launch", description: "App store submission, deployment, and launch strategy execution." },
  { step: "05", title: "Scale", description: "Ongoing support, feature additions, and performance optimization." },
]

const stats = [
  { value: "200+", label: "Apps Delivered" },
  { value: "4.8★", label: "App Store Rating" },
  { value: "50M+", label: "Users Served" },
  { value: "99.9%", label: "Uptime" },
]

const technologies = [
  "React Native", "Flutter", "Swift", "Kotlin", "Next.js", "Node.js", "PostgreSQL", "MongoDB", "Redis", "AWS", "Firebase"
]

const faqs = [
  {
    question: "How long does it take to build a mobile app?",
    answer: "A minimum viable product (MVP) typically takes 8-16 weeks. Full-featured apps can take 4-9 months depending on complexity. We use agile methodology to deliver working features every 2 weeks so you see progress continuously."
  },
  {
    question: "Should I build native or cross-platform?",
    answer: "Cross-platform (React Native/Flutter) is ideal for most apps—it's faster and more cost-effective while delivering near-native performance. We recommend native development for apps requiring heavy device integration, gaming, or absolute peak performance."
  },
  {
    question: "Do you handle app store submissions?",
    answer: "Yes. We manage the entire app store submission process including asset preparation, metadata optimization, compliance review, and ongoing updates. We've successfully launched hundreds of apps on both iOS and Android stores."
  },
  {
    question: "Can you build an MVP to test my idea?",
    answer: "Absolutely. We specialize in rapid MVP development to help validate ideas quickly. Our MVP packages start at $15,000 and typically deliver in 6-8 weeks—enough to test market fit without major investment."
  },
  {
    question: "What about ongoing maintenance and updates?",
    answer: "All apps require ongoing maintenance for OS updates, security patches, and feature enhancements. We offer maintenance packages starting at $2,000/month that include bug fixes, minor updates, and technical support."
  },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "App Development Services",
  "provider": {
    "@type": "Organization",
    "name": "RocketOpp",
    "url": "https://rocketopp.com"
  },
  "description": "Custom app development services including mobile apps, web applications, and SaaS products.",
  "areaServed": "Worldwide",
  "serviceType": "Software Development",
  "offers": {
    "@type": "Offer",
    "price": "15000",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": "15000",
      "priceCurrency": "USD",
      "minPrice": "15000"
    }
  }
}

export default function AppDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex min-h-screen flex-col bg-background">
        <ServiceHero
          icon={<Code2 className="w-6 h-6" />}
          title="Turn Ideas Into Applications"
          subtitle="Ideas to Reality"
          description="From concept to launch, we build mobile apps, web applications, and SaaS products that users love. Modern technology, proven process, measurable results."
          gradient="from-purple-500 to-pink-500"
          visualVariant="cube"
          floatingCards={[
            { value: "4.9★", label: "App Rating", color: "text-yellow-500", position: "top-right" },
            { value: "50M+", label: "Downloads", color: "text-purple-500", position: "mid-left" },
            { value: "99.9%", label: "Uptime", color: "text-green-500", position: "bottom-right" },
          ]}
          stats={[
            { value: "200+", label: "Apps Built" },
            { value: "4.8★", label: "Rating" },
            { value: "50M+", label: "Users" },
          ]}
          ctaText="Start Building"
          ctaHref="/contact?service=app-development"
        />

        {/* Stats Bar */}
        <section className="py-12 bg-muted/30 border-y border-border/50">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Full-Spectrum App Development</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you need a mobile app, web application, or complete SaaS platform, we have the expertise to deliver.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, i) => {
                const Icon = service.icon
                return (
                  <div
                    key={i}
                    id={service.id}
                    className="p-8 card-lifted-xl group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">From Idea to App Store</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our streamlined process takes your concept from whiteboard to worldwide launch.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {process.map((step, i) => (
                <div key={i} className="relative p-6 card-lifted-sm group text-center">
                  <div className="text-4xl font-bold text-primary/10 mb-3 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Modern Tech Stack</h2>
              <p className="text-lg text-muted-foreground">
                We use the latest technologies for performance, scalability, and maintainability.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {technologies.map((tech, i) => (
                <div
                  key={i}
                  className="px-6 py-3 bg-card border rounded-full hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <span className="font-medium text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Common questions about app development answered by our experts.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-6 card-lifted-sm">
                  <h3 className="font-bold mb-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground pl-8">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 md:p-12 border border-purple-500/20 text-center">
              <Rocket className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your App?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's turn your idea into a powerful application that users will love.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild className="group">
                  <Link href="/contact?service=app-development">
                    Start Your Project
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/marketplace">View Our Products</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
