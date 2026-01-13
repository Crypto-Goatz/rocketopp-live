import type { Metadata } from "next"
import Script from "next/script"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Calendar, ArrowRight } from "lucide-react"
import { SmartContactForm } from "@/components/contact/SmartContactForm"

export const metadata: Metadata = {
  title: "Contact Us - Get Started with RocketOpp",
  description:
    "Tell us about your project and get a personalized response within 24 hours. Schedule a free discovery call to explore AI and automation solutions for your business.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Let's Build Something{" "}
            <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent">
              Amazing
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us about your project and we'll get back to you within 24 hours with a personalized response.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Smart Contact Form - Primary CTA */}
          <div className="lg:col-span-2">
            <SmartContactForm variant="contact-page-v1" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Book Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-orange-500/10 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Prefer to talk now?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Skip the form and jump straight to a live conversation.
                </p>
                <Link href="/consultation">
                  <Button className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90">
                    Book Discovery Call
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Email</h4>
                    <a href="mailto:Mike@rocketopp.com" className="text-muted-foreground hover:text-primary text-sm">
                      Mike@rocketopp.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Talk to Jessica (AI)</h4>
                    <a href="tel:+18788881230" className="text-muted-foreground hover:text-primary block text-sm">
                      +1 (878) 888-1230
                    </a>
                    <span className="text-xs text-muted-foreground/70">Available 24/7</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Location</h4>
                    <span className="text-muted-foreground text-sm">Serving clients globally</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Form submissions</span>
                  <span className="text-sm bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">Within 24h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Jessica (AI)</span>
                  <span className="text-sm bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">Instant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Discovery calls</span>
                  <span className="text-sm text-muted-foreground">Book anytime</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Script src="https://links.rocketclients.com/js/form_embed.js" strategy="lazyOnload" />
    </div>
  )
}
