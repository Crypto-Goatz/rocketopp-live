import { Sparkles, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Free AI Business Assessment | RocketOpp",
  description: "Get a comprehensive AI-powered assessment of your business growth opportunities.",
}

export default function AiAssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-20 w-20 text-primary animate-pulse" />
              <Rocket className="h-10 w-10 text-primary absolute -bottom-2 -right-2 animate-bounce" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-500 to-primary">
            Free AI Business Assessment
          </h1>

          <div className="inline-block px-6 py-3 bg-primary/10 border border-primary/30 rounded-full mb-8">
            <p className="text-xl md:text-2xl font-semibold text-primary">Coming Soon...</p>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
            We're building something amazing. Our AI-powered business assessment will analyze your industry,
            competition, and growth opportunities to create a personalized roadmap for success.
          </p>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">What to Expect:</h2>
            <ul className="text-left space-y-3 text-muted-foreground max-w-xl mx-auto">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Comprehensive industry analysis powered by AI</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Competitive landscape evaluation</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Growth opportunity identification</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Custom strategic recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Actionable next steps for your business</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Get Notified When We Launch</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
