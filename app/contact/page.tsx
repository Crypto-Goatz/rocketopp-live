import type { Metadata } from "next"
import Script from "next/script"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | RocketOpp",
  description:
    "Get in touch with the RocketOpp team. Schedule a consultation, ask a question, or start your next project with us. We're here to help you leverage AI and web technology.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact RocketOpp</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Whether you have a question, a project idea, or want to schedule a free consultation, we're ready to listen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Schedule a Consultation</CardTitle>
              <CardDescription>Use our interactive calendar to find a time that works for you.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[750px] w-full">
                <iframe
                  src="https://api.rocketclients.com/widget/booking/dnH2nAQpjwwS71EufcnC"
                  style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
                  scrolling="no"
                  id="dnH2nAQpjwwS71EufcnC_1753665080517"
                  title="Booking Widget"
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
                  <h4 className="font-semibold">Phone</h4>
                  <span className="text-muted-foreground">Schedule a call using the form</span>
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
            <CardContent className="text-muted-foreground">
              <p>Monday - Friday: 9:00 AM - 6:00 PM (EST)</p>
              <p>Saturday & Sunday: Closed</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Script src="https://api.rocketclients.com/js/form_embed.js" strategy="lazyOnload" />
    </div>
  )
}
