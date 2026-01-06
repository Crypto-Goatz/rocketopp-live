import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Clock,
  TrendingUp,
  Zap,
  Target,
  BarChart,
  Shield,
  Users,
  Database,
  Workflow,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react"

export const metadata: Metadata = {
  title: "AI for Business - Transform Operations & Save Time | RocketOpp",
  description:
    "Discover how AI can revolutionize your business beyond content generation. Learn about intelligent automation, data analysis, workflow optimization, and more.",
}

export default function AIForBusinessPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">The Hidden Power of AI in Business</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Most businesses barely scratch the surface of what AI can do. They're using it for images and blog posts
              while missing the real opportunity.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link href="/ai-assessment-start">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Discover Your AI Opportunities
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Talk to an Expert
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">The Problem: AI Isn't Just a Content Tool</h2>
              <p className="text-lg text-muted-foreground">
                Every day, businesses waste countless hours on repetitive tasks that AI could handle instantly. Data
                sits in spreadsheets, unanalyzed. Customer inquiries pile up, unanswered. Scheduling conflicts create
                chaos. Documents get lost in email threads.
              </p>
              <p className="text-lg text-muted-foreground">
                Meanwhile, companies pay for AI subscriptions to generate blog posts and social media images, never
                realizing they're sitting on a goldmine of automation potential.
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                <p className="text-lg font-semibold text-destructive">
                  The average knowledge worker spends 19 hours per week on tasks that could be automated.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="p-6 border-muted-foreground/20">
                <h3 className="font-semibold text-lg mb-2">Manual Data Entry</h3>
                <p className="text-muted-foreground">
                  Copying information between systems, updating spreadsheets, managing inventory
                </p>
              </Card>
              <Card className="p-6 border-muted-foreground/20">
                <h3 className="font-semibold text-lg mb-2">Scheduling & Coordination</h3>
                <p className="text-muted-foreground">Back-and-forth emails, calendar conflicts, meeting follow-ups</p>
              </Card>
              <Card className="p-6 border-muted-foreground/20">
                <h3 className="font-semibold text-lg mb-2">Document Management</h3>
                <p className="text-muted-foreground">Searching files, version control, data extraction from PDFs</p>
              </Card>
              <Card className="p-6 border-muted-foreground/20">
                <h3 className="font-semibold text-lg mb-2">Customer Service</h3>
                <p className="text-muted-foreground">Answering common questions, routing inquiries, status updates</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What AI Actually Does Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">What AI Can Actually Do for Your Business</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Beyond generating content, AI becomes your most productive team member. Here's what's possible right now.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Intelligent Data Processing</h3>
              <p className="text-muted-foreground">
                Extract, analyze, and organize data from any source - emails, PDFs, images, spreadsheets -
                automatically. No human eyes required.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Workflow className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Workflow Automation</h3>
              <p className="text-muted-foreground">
                Connect your tools and let AI handle complex multi-step processes. From lead qualification to invoice
                processing, AI orchestrates everything.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">24/7 Customer Intelligence</h3>
              <p className="text-muted-foreground">
                AI that knows your business inside-out, answers customer questions accurately, routes complex issues,
                and learns from every interaction.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                AI monitors your business metrics, spots trends before you do, and alerts you to opportunities or
                problems instantly.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Smart Scheduling</h3>
              <p className="text-muted-foreground">
                AI that manages calendars, coordinates teams, optimizes meeting times, and handles all the
                back-and-forth without human intervention.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Document Intelligence</h3>
              <p className="text-muted-foreground">
                Extract key information from contracts, invoices, and forms. Generate reports, summaries, and insights
                from mountains of documents.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Predictive Decision Support</h3>
              <p className="text-muted-foreground">
                AI analyzes patterns in your data to predict outcomes, recommend actions, and help you make better
                decisions faster.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Team Collaboration</h3>
              <p className="text-muted-foreground">
                AI that summarizes meetings, tracks action items, follows up on deadlines, and keeps everyone aligned
                without constant check-ins.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Compliance & Quality Control</h3>
              <p className="text-muted-foreground">
                Monitor processes for errors, ensure compliance with regulations, and maintain quality standards
                automatically across all operations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Time Savings Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">The Real ROI: Time Multiplied</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              When AI is implemented correctly, it doesn't just save time—it multiplies your team's capacity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 text-center space-y-4 border-primary/40">
              <Clock className="h-12 w-12 text-primary mx-auto" />
              <div className="text-5xl font-bold text-primary">85%</div>
              <p className="text-muted-foreground">Reduction in time spent on data entry and processing tasks</p>
            </Card>

            <Card className="p-8 text-center space-y-4 border-primary/40">
              <Zap className="h-12 w-12 text-primary mx-auto" />
              <div className="text-5xl font-bold text-primary">10x</div>
              <p className="text-muted-foreground">Faster response times for customer inquiries and support requests</p>
            </Card>

            <Card className="p-8 text-center space-y-4 border-primary/40">
              <TrendingUp className="h-12 w-12 text-primary mx-auto" />
              <div className="text-5xl font-bold text-primary">300%</div>
              <p className="text-muted-foreground">Increase in data analysis capacity without additional headcount</p>
            </Card>
          </div>

          <Card className="p-8 bg-primary/5 border-primary/40">
            <h3 className="text-2xl font-bold mb-4">Real-World Example</h3>
            <p className="text-lg text-muted-foreground mb-4">
              A mid-sized professional services firm was spending 15 hours per week managing client onboarding -
              collecting documents, entering data, sending follow-ups, and coordinating schedules.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              After implementing AI automation, that same process now takes less than 2 hours per week. The AI handles
              document collection, extracts key information, populates their CRM, schedules kickoff meetings, and sends
              personalized communications—all without human intervention.
            </p>
            <p className="text-lg font-semibold text-primary">
              Result: 13 hours saved per week. That's 676 hours per year redirected to revenue-generating activities.
            </p>
          </Card>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Most Businesses Get AI Wrong</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-destructive font-bold">✕</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Treating AI as a Tool, Not a System</h3>
                  <p className="text-muted-foreground">
                    Using ChatGPT for occasional tasks instead of integrating AI into core business processes means
                    missing 95% of the value.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-destructive font-bold">✕</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Focusing Only on Customer-Facing AI</h3>
                  <p className="text-muted-foreground">
                    Chatbots and content creation get attention, but the biggest gains come from automating internal
                    operations.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-destructive font-bold">✕</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Not Connecting AI to Existing Systems</h3>
                  <p className="text-muted-foreground">
                    AI that can't access your CRM, email, calendar, and databases is just an expensive notepad. Real
                    power comes from integration.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-destructive font-bold">✕</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Waiting for the "Perfect" Solution</h3>
                  <p className="text-muted-foreground">
                    While competitors automate and scale, businesses wait for AI to mature. The technology is ready
                    now—the question is whether you are.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center space-y-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/40">
            <h2 className="text-3xl md:text-4xl font-bold">Stop Using AI Like Everyone Else</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a custom AI assessment that identifies exactly where automation can save your business time and money.
              No generic recommendations—just specific opportunities for your operations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link href="/ai-assessment-start">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Get Your Free AI Assessment
                </Button>
              </Link>
              <Link href="/services/ai-integration">
                <Button size="lg" variant="outline">
                  View AI Integration Services
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
