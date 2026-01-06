import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Rocket Client SaaS | All-In-One Marketing & Sales Automation",
  description:
    "Discover Rocket Client: CRM, email marketing, funnel building, AI chatbots, and more. Streamline your operations and boost growth with our powerful SaaS platform.",
}

export default function RocketClientsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Rocket Client SaaS</h1>
          <p className="text-xl text-muted-foreground mb-8">All-In-One Marketing & Sales Automation Platform</p>

          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">CRM & Sales</h3>
              <p className="text-muted-foreground">Manage your customer relationships and sales pipeline efficiently</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Email Marketing</h3>
              <p className="text-muted-foreground">Create and automate powerful email campaigns</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">AI Chatbots</h3>
              <p className="text-muted-foreground">Engage customers 24/7 with intelligent automation</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
