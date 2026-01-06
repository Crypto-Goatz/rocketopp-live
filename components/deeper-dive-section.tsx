"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Palette,
  TrendingUp,
  Brain,
  Users,
  Code2,
  ShoppingCart,
  BarChart3,
  MessageCircle,
  Bot,
  Settings2,
  Search,
  Target,
  Zap,
  Shield,
  Cpu,
} from "lucide-react"
import HoverGlowCard from "./hover-glow-card"
import Link from "next/link"
import { Button } from "./ui/button"

const deeperDiveData = {
  webDevelopment: {
    title: "Web Development",
    icon: <Palette className="h-5 w-5 mr-2" />,
    description:
      "Enterprise-grade websites and applications built with cutting-edge technology. From stunning designs to complex web applications, we deliver solutions that drive results.",
    services: [
      {
        id: "custom-websites",
        title: "Custom Website Design & Development",
        details:
          "Photorealistic, responsive websites built with Next.js 16 and React 19. Our designs convert visitors into customers with strategic UX/UI, lightning-fast performance, and SEO optimization baked in from day one.",
        icon: <Code2 className="h-5 w-5 text-primary mr-2" />,
        link: "/services/website-design",
      },
      {
        id: "seo-optimization",
        title: "Search Engine Optimization (SEO)",
        details:
          "Dominate Google rankings with our comprehensive SEO services. Technical SEO audits, keyword research, on-page optimization, content strategy, and ongoing monitoring to ensure your business stays ahead of the competition.",
        icon: <Search className="h-5 w-5 text-primary mr-2" />,
        link: "/services/website-development/seo-services",
      },
      {
        id: "conversion-optimization",
        title: "Conversion Rate Optimization (CRO)",
        details:
          "Our revolutionary self-optimizing AI tracks every visitor interaction - mouse movements, scroll patterns, time on page, and engagement metrics. The system automatically adjusts content, colors, and layouts to maximize conversions.",
        icon: <Target className="h-5 w-5 text-primary mr-2" />,
        link: "/services/website-development/conversion-optimization",
      },
      {
        id: "ecommerce",
        title: "eCommerce Solutions",
        details:
          "Build your online store with secure payment processing, inventory management, customer accounts, and AI-powered product recommendations. Integration with all major payment gateways and shipping providers.",
        icon: <ShoppingCart className="h-5 w-5 text-primary mr-2" />,
        link: "/services/app-development",
      },
      {
        id: "web-apps",
        title: "Custom Web Applications",
        details:
          "Complex SaaS platforms, internal business tools, customer portals, and enterprise applications. Built with scalable architecture, secure authentication, real-time data processing, and API integrations.",
        icon: <Settings2 className="h-5 w-5 text-primary mr-2" />,
        link: "/services/app-development",
      },
    ],
  },
  digitalMarketing: {
    title: "Digital Marketing",
    icon: <TrendingUp className="h-5 w-5 mr-2" />,
    description:
      "Data-driven marketing strategies that deliver measurable ROI. From social media to PPC campaigns, we connect your business with the right audience at the right time.",
    services: [
      {
        id: "social-media",
        title: "Social Media Marketing",
        details:
          "Strategic social media management across all major platforms. Content creation, community engagement, paid advertising, influencer partnerships, and detailed analytics. Build authentic connections with your audience.",
        icon: <MessageCircle className="h-5 w-5 text-primary mr-2" />,
        link: "/services/web-marketing/social-media",
      },
      {
        id: "ppc",
        title: "Pay-Per-Click (PPC) Advertising",
        details:
          "Expert Google Ads, Facebook Ads, and LinkedIn Ads management. Keyword research, ad copy optimization, landing page design, A/B testing, and continuous campaign refinement for maximum ROI.",
        icon: <Target className="h-5 w-5 text-primary mr-2" />,
        link: "/services/web-marketing/ppc",
      },
      {
        id: "content-marketing",
        title: "Content Marketing Strategy",
        details:
          "Compelling content that educates, engages, and converts. Blog posts, whitepapers, case studies, infographics, and video content designed to establish your authority and drive organic traffic.",
        icon: <BarChart3 className="h-5 w-5 text-primary mr-2" />,
        link: "/services/web-marketing/content-marketing",
      },
      {
        id: "email-marketing",
        title: "Email Marketing Automation",
        details:
          "Sophisticated email campaigns with automated workflows, segmentation, personalization, and detailed performance tracking. Nurture leads and retain customers with targeted messaging.",
        icon: <Zap className="h-5 w-5 text-primary mr-2" />,
        link: "/services/automation",
      },
      {
        id: "analytics",
        title: "Marketing Analytics & Reporting",
        details:
          "Comprehensive analytics dashboards tracking all marketing metrics. Real-time reporting, conversion tracking, attribution modeling, and actionable insights to optimize your marketing spend.",
        icon: <BarChart3 className="h-5 w-5 text-primary mr-2" />,
        link: "/services/web-marketing",
      },
    ],
  },
  aiSolutions: {
    title: "AI Solutions",
    icon: <Brain className="h-5 w-5 mr-2" />,
    description:
      "Enterprise AI technology at small business prices. Custom AI-powered systems that automate workflows, personalize experiences, and provide intelligent insights to transform your operations.",
    services: [
      {
        id: "ai-crm",
        title: "AI-Powered CRM Systems",
        details:
          "Our flagship product: fully customized CRM with built-in AI starting at just $5,000. Includes intelligent lead scoring, automated follow-ups, predictive analytics, customer sentiment analysis, and seamless integrations with your existing tools.",
        icon: <Users className="h-5 w-5 text-primary mr-2" />,
        link: "/services/ai-crm",
      },
      {
        id: "ai-integration",
        title: "AI Integration Services",
        details:
          "Integrate artificial intelligence into your existing business processes. Natural language processing, computer vision, predictive modeling, recommendation engines, and custom machine learning models tailored to your needs.",
        icon: <Bot className="h-5 w-5 text-primary mr-2" />,
        link: "/services/ai-integration",
      },
      {
        id: "automation",
        title: "Business Process Automation",
        details:
          "Automated workflows with human oversight - the key to successful SOPs. We build systems that handle repetitive tasks while keeping your team in control. 25 years of experience scaling businesses through intelligent automation.",
        icon: <Zap className="h-5 w-5 text-primary mr-2" />,
        link: "/services/automation",
      },
      {
        id: "chatbots",
        title: "AI Chatbots & Virtual Assistants",
        details:
          "Intelligent conversational AI that provides 24/7 customer support, qualifies leads, schedules appointments, and answers common questions. Seamlessly escalates complex issues to human agents when needed.",
        icon: <MessageCircle className="h-5 w-5 text-primary mr-2" />,
        link: "/services/ai-integration",
      },
      {
        id: "ai-analytics",
        title: "AI-Powered Business Intelligence",
        details:
          "Turn your data into actionable insights with AI-driven analytics. Predictive forecasting, anomaly detection, customer behavior analysis, and automated reporting that helps you make smarter business decisions.",
        icon: <Cpu className="h-5 w-5 text-primary mr-2" />,
        link: "/services/ai-integration",
      },
    ],
  },
  applications: {
    title: "Applications",
    icon: <Users className="h-5 w-5 mr-2" />,
    description:
      "Browse our portfolio of custom-built applications. From CRMs to specialized industry solutions, see real examples of enterprise technology we've delivered to businesses like yours.",
    services: [
      {
        id: "portfolio",
        title: "View Our Application Portfolio",
        details:
          "Explore 9+ custom applications we've built across various industries. Each solution demonstrates our expertise in delivering enterprise-grade technology at disruptive prices. See real examples of AI-powered CRMs, workflow automation systems, and industry-specific tools.",
        icon: <Code2 className="h-5 w-5 text-primary mr-2" />,
        link: "/applications",
      },
      {
        id: "custom-development",
        title: "Custom Application Development",
        details:
          "Need something unique? We build custom applications from scratch tailored to your exact requirements. Mobile apps, desktop software, web applications, and integrated systems designed specifically for your business processes.",
        icon: <Settings2 className="h-5 w-5 text-primary mr-2" />,
        link: "/services/app-development",
      },
      {
        id: "saas-platforms",
        title: "SaaS Platform Development",
        details:
          "Launch your own software-as-a-service platform. We handle everything from architecture design to deployment, including subscription billing, user management, multi-tenancy, and scalable infrastructure.",
        icon: <Shield className="h-5 w-5 text-primary mr-2" />,
        link: "/services/app-development",
      },
      {
        id: "mobile-apps",
        title: "Mobile Application Development",
        details:
          "Native iOS and Android apps, or cross-platform solutions using React Native. Push notifications, offline functionality, GPS integration, camera access, and seamless synchronization with your backend systems.",
        icon: <Code2 className="h-5 w-5 text-primary mr-2" />,
        link: "/services/app-development",
      },
      {
        id: "api-development",
        title: "API Development & Integration",
        details:
          "RESTful APIs, GraphQL endpoints, webhooks, and third-party integrations. Connect your systems, automate data flows, and build a cohesive technology ecosystem that works together seamlessly.",
        icon: <Cpu className="h-5 w-5 text-primary mr-2" />,
        link: "/services/app-development",
      },
    ],
  },
}

export default function DeeperDiveSection() {
  return (
    <section
      className="py-16 md:py-24 bg-muted/30 dark:bg-muted/10"
      id="deeper-dive"
      aria-labelledby="deeper-dive-heading"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground mb-2">
            DEEPER DIVE
          </div>
          <h2 id="deeper-dive-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Comprehensive Solutions for Every Business Need
          </h2>
          <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl leading-relaxed">
            Explore our full range of services designed to transform your business with enterprise technology. Each
            solution is customizable to your specific industry and business goals.
          </p>
        </div>

        <Tabs defaultValue="webDevelopment" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto p-2">
            {Object.entries(deeperDiveData).map(([key, tab]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="py-3 data-[state=active]:shadow-md flex items-center justify-center text-center"
              >
                {tab.icon} {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(deeperDiveData).map(([key, tab]) => (
            <TabsContent key={key} value={key}>
              <HoverGlowCard borderRadius="0.75rem">
                <div className="p-6 md:p-8 rounded-xl bg-card border">
                  <h3 className="text-2xl font-semibold mb-3 flex items-center">
                    {tab.icon} {tab.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{tab.description}</p>
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {tab.services.map((service) => (
                      <HoverGlowCard key={service.id} borderRadius="0.5rem">
                        <AccordionItem
                          value={service.id}
                          className="border rounded-lg bg-background/50 dark:bg-muted/20 overflow-hidden"
                        >
                          <AccordionTrigger className="px-4 py-3 text-md hover:no-underline flex items-center">
                            {service.icon}
                            <span className="ml-2">{service.title}</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-3 pt-0 text-muted-foreground">
                            <p className="mb-3 leading-relaxed">{service.details}</p>
                            <Button variant="link" asChild className="p-0 h-auto text-primary">
                              <Link href={service.link || "/#contact"}>
                                Learn more about {service.title.toLowerCase()} →
                              </Link>
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </HoverGlowCard>
                    ))}
                  </Accordion>
                </div>
              </HoverGlowCard>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
