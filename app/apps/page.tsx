// ============================================================
// Our Apps - SXO Optimized Product Showcase
// ============================================================
// Lists all RocketOpp apps with external links
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Rocket,
  Bot,
  Cpu,
  ExternalLink,
  Star,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import Footer from '@/components/footer'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { TestimonialsSection } from '@/components/seo/testimonials'
import { FAQSchema, ProductSchema } from '@/components/seo/json-ld'

export const metadata: Metadata = {
  title: 'Our Apps | RocketOpp - AI-Powered Business Software',
  description: 'Explore RocketOpp\'s suite of AI-powered applications: Rocket+ for CRM automation, MCPFED for AI agent management, and BotCoaches for personalized AI coaching. Built to work while you sleep.',
  keywords: [
    'RocketOpp apps',
    'Rocket+ CRM',
    'MCPFED',
    'BotCoaches',
    'AI business apps',
    'CRM automation',
    'AI agents',
    'business software'
  ],
  openGraph: {
    title: 'Our Apps | RocketOpp',
    description: 'AI-powered business applications that work while you sleep.',
    url: 'https://rocketopp.com/apps',
    type: 'website'
  },
  alternates: {
    canonical: 'https://rocketopp.com/apps'
  }
}

// App data with external links
const apps = [
  {
    id: 'rocket-plus',
    name: 'Rocket+',
    tagline: '50+ AI Automation Tools for Your CRM',
    description: 'Supercharge your GoHighLevel CRM with AI-powered course generation, workflow automation, and modular enhancements. The ultimate toolkit for agencies and businesses who want to do more with less.',
    url: 'https://rocketadd.com',
    icon: Rocket,
    color: 'from-orange-500 to-red-500',
    shadowColor: 'shadow-orange-500/20',
    status: 'Live',
    features: [
      'AI Course Generator',
      'RocketFlow Automation',
      'Focus Flow Mode',
      'API Connections Hub',
      '50+ Modular Tools',
      'MCP Server Integration'
    ],
    highlights: [
      { icon: Zap, text: 'Instant AI Responses' },
      { icon: Shield, text: 'Enterprise Security' },
      { icon: Clock, text: '24/7 Automation' }
    ],
    price: 'Starting at $49/mo'
  },
  {
    id: 'mcpfed',
    name: 'MCPFED',
    tagline: 'The AI Agent Command Center',
    description: 'Connect, manage, and orchestrate all your MCP (Model Context Protocol) servers from one unified dashboard. The control center for AI-powered businesses running Claude, GPT, and custom AI agents.',
    url: 'https://mcpfed.com',
    icon: Cpu,
    color: 'from-cyan-500 to-blue-500',
    shadowColor: 'shadow-cyan-500/20',
    status: 'Live',
    features: [
      'Unified MCP Dashboard',
      'Multi-Server Management',
      'Real-time Monitoring',
      'Custom Tool Builder',
      'Team Collaboration',
      'Usage Analytics'
    ],
    highlights: [
      { icon: Bot, text: 'AI Agent Hub' },
      { icon: Shield, text: 'Secure Connections' },
      { icon: Sparkles, text: 'Smart Orchestration' }
    ],
    price: 'Free Tier Available'
  },
  {
    id: 'botcoaches',
    name: 'BotCoaches',
    tagline: 'AI Coaching Personalities On Demand',
    description: 'Access a library of specialized AI coaching profiles for business, fitness, mindset, and more. Each BotCoach is trained with expert methodologies to provide personalized guidance whenever you need it.',
    url: 'https://botcoaches.com',
    icon: Bot,
    color: 'from-purple-500 to-pink-500',
    shadowColor: 'shadow-purple-500/20',
    status: 'Coming Soon',
    features: [
      'Expert AI Personas',
      'Business Coaching',
      'Fitness & Health',
      'Mindset Training',
      'Custom Bot Creation',
      'Voice Interactions'
    ],
    highlights: [
      { icon: Star, text: 'Expert Knowledge' },
      { icon: Clock, text: 'Available 24/7' },
      { icon: Zap, text: 'Instant Guidance' }
    ],
    price: 'Early Access Available'
  }
]

const appFAQs = [
  {
    question: 'What is Rocket+ and who is it for?',
    answer: 'Rocket+ is a suite of 50+ AI automation tools designed for GoHighLevel CRM users. It\'s perfect for marketing agencies, SaaS businesses, and entrepreneurs who want to automate repetitive tasks, generate courses with AI, and supercharge their CRM capabilities.'
  },
  {
    question: 'What is MCPFED?',
    answer: 'MCPFED is a command center for managing Model Context Protocol (MCP) servers. If you use AI assistants like Claude or custom AI agents, MCPFED lets you connect, monitor, and orchestrate all your AI tools from one dashboard.'
  },
  {
    question: 'How do I get started with RocketOpp apps?',
    answer: 'Simply click on any app above to visit its dedicated website. Each app has its own signup process, documentation, and support. All our apps offer free tiers or trials so you can test before committing.'
  },
  {
    question: 'Do your apps integrate with each other?',
    answer: 'Yes! All RocketOpp apps are designed to work together seamlessly. Rocket+ can connect to MCPFED for enhanced AI capabilities, and BotCoaches can be deployed through both platforms.'
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'Each app includes documentation, video tutorials, and community support. Premium plans include priority support, and enterprise customers get dedicated account managers. You can also reach our AI assistant Jessica at 878-888-1230.'
  }
]

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Our Apps', url: '/apps' }
]

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Schema */}
      <FAQSchema items={appFAQs} />
      {apps.map(app => (
        <ProductSchema
          key={app.id}
          name={app.name}
          description={app.description}
          price={0}
          brand="RocketOpp"
          url={app.url}
        />
      ))}

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Software Suite</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
              Our Apps
              <span className="block bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent">
                Built to Work While You Sleep
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              A suite of AI-powered applications designed to automate your business,
              manage your AI agents, and provide expert guidance on demand.
            </p>
          </div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {apps.map((app, index) => {
              const Icon = app.icon
              return (
                <div
                  key={app.id}
                  className={`relative p-8 md:p-10 rounded-3xl bg-card border border-border overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-2xl ${app.shadowColor}`}
                >
                  {/* Background gradient */}
                  <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${app.color} opacity-5 blur-3xl -z-10`} />

                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Content */}
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg ${app.shadowColor}`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold">{app.name}</h2>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              app.status === 'Live'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-primary font-medium">{app.tagline}</p>
                        </div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {app.description}
                      </p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-4 mb-6">
                        {app.highlights.map((highlight, i) => {
                          const HIcon = highlight.icon
                          return (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <HIcon className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">{highlight.text}</span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Price & CTA */}
                      <div className="flex flex-wrap items-center gap-4">
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${app.color} text-white font-semibold hover:opacity-90 transition-opacity shadow-lg ${app.shadowColor}`}
                        >
                          Visit {app.name}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <span className="text-sm text-muted-foreground">{app.price}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className={`bg-muted/30 rounded-2xl p-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Key Features
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {app.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Have an App Idea?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            We&apos;re always building new tools. If you have an idea for an app that could help your business,
            let us know and we might build it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/request-app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              Request an App
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pitch-idea"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-semibold hover:bg-primary/20 transition-colors"
            >
              Pitch Us an Idea
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {appFAQs.map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection
        title="Trusted by Businesses Worldwide"
        subtitle="See what our users say about our apps"
        maxItems={3}
      />

      <Footer />
    </div>
  )
}
