import type { Metadata } from "next"
import Script from "next/script"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - Schedule a Discovery Call | RocketOpp",
  description:
    "Schedule a free discovery call with the RocketOpp team. Discuss your project, explore AI solutions, or start building with us. We're here to help you leverage AI and automation.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact RocketOpp</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Schedule a free discovery call to discuss your project, or reach out directly. We're ready to help you leverage AI and automation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Schedule a Discovery Call</CardTitle>
              <CardDescription>Book a free 30-minute discovery call to discuss your project and explore how we can help you leverage AI and automation.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[750px] w-full">
                <iframe
                  src="https://api.rocketclients.com/widget/booking/p4EEMwP9hLoGQ1eF7pv0"
                  style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
                  scrolling="no"
                  id="discovery-call-booking"
                  title="Schedule a Discovery Call"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <a href="mailto:Mike@rocketopp.com" className="text-muted-foreground hover:text-primary">
                    Mike@rocketopp.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Talk to Jessica (AI Assistant)</h4>
                  <a href="tel:+18788881230" className="text-muted-foreground hover:text-primary block">
                    +1 (878) 888-1230
                  </a>
                  <span className="text-xs text-muted-foreground/70">Available 24/7 - Book appointments, get answers, or start a project</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Location</h4>
                  <span className="text-muted-foreground">
                    Serving clients globally from our remote-first headquarters.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2">
              <div>
                <p className="font-medium text-foreground">Jessica (AI)</p>
                <p>Available 24/7 - Call anytime</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Human Team</p>
                <p>Monday - Friday: 9:00 AM - 6:00 PM (EST)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Script src="https://api.rocketclients.com/js/form_embed.js" strategy="lazyOnload" />
    </div>
  )
}
