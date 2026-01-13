import type { Metadata } from "next"
import Script from "next/script"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Video, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Live Consultation - Book Your Free Discovery Call | RocketOpp",
  description:
    "Schedule a free 30-minute discovery call with the RocketOpp team. Discuss your AI and automation needs, explore solutions, and get expert guidance for your next project.",
}

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Video className="h-4 w-4" />
            Free 30-Minute Call
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Book Your{" "}
            <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent">
              Discovery Call
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's discuss your project and explore how AI and automation can transform your business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Calendar Widget - Main Focus */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/5">
              <CardContent className="p-0">
                <div className="h-[700px] w-full bg-background">
                  <iframe
                    src="https://links.rocketclients.com/widget/booking/p4EEMwP9hLoGQ1eF7pv0"
                    style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
                    scrolling="no"
                    id="discovery-call-booking"
                    title="Schedule a Discovery Call"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">What to Expect</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "30-minute video consultation",
                    "Discuss your specific needs",
                    "Get expert recommendations",
                    "No obligation or pressure",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">We Can Help With</h3>
                <div className="space-y-3">
                  {[
                    { title: "AI Integration", desc: "Leverage AI to automate workflows" },
                    { title: "Custom Development", desc: "Build tailored solutions for your needs" },
                    { title: "CRM Automation", desc: "Streamline your sales and marketing" },
                    { title: "Strategy Consulting", desc: "Plan your digital transformation" },
                  ].map((item, i) => (
                    <div key={i} className="border-l-2 border-primary/30 pl-3">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              <p>Questions? Email us at</p>
              <a href="mailto:Mike@rocketopp.com" className="text-primary hover:underline font-medium">
                Mike@rocketopp.com
              </a>
            </div>
          </div>
        </div>
      </div>
      <Script src="https://links.rocketclients.com/js/form_embed.js" strategy="lazyOnload" />
    </div>
  )
}
