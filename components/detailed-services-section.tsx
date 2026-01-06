"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Palette,
  TrendingUp,
  Brain,
  Users,
  CheckCircle,
  Code2,
  ShoppingCart,
  BarChart3,
  MessageCircle,
  BotIcon as AiBotIcon,
  Settings2,
} from "lucide-react"
import HoverGlowCard from "./hover-glow-card"
import Link from "next/link"
import { Button } from "./ui/button"

const detailedServicesData = {
  webSolutions: {
    title: "Web Solutions",
    icon: <Palette className="h-5 w-5 mr-2" />,
    description:
      "Crafting digital experiences that captivate and convert. From stunning designs to robust applications, RocketOpp builds your online foundation.",
    services: [
      {
        id: "custom-design",
        title: "Custom Website Design & Development",
        details:
          "Our team creates visually appealing, user-friendly websites tailored to your brand. We focus on responsive design, fast loading speeds, and intuitive navigation to ensure an optimal user experience across all devices. Every RocketOpp site is built with SEO best practices in mind.",
        icon: <Code2 className="h-5 w-5 text-primary mr-2" />,
        link: "/services/website-design",
      },
      {
        id: "ecommerce",
        title: "eCommerce Platform Development",
        details:
          "Launch or scale your online store with RocketOpp. We build secure, feature-rich eCommerce platforms with seamless payment gateway integration, inventory management, and personalized shopping experiences to maximize your sales.",
        icon: <ShoppingCart className="h-5 w-5 text-primary mr-2" />,
        link: "/services/e-commerce", // Assuming you'll create this page
      },
      {
        id: "web-apps",
        title: "Web Application Development",
        details:
          "Need a complex web application? RocketOpp develops custom solutions, from SaaS platforms to internal business tools, using modern technologies to deliver scalable, secure, and efficient applications.",
        icon: <Settings2 className="h-5 w-5 text-primary mr-2" />,
        link: "/services/app-development",
      },
    ],
  },
  marketingGrowth: {
    title: "Marketing & Growth",
    icon: <TrendingUp className="h-5 w-5 mr-2" />,
    description:
      "Amplify your reach and accelerate growth. RocketOpp's data-driven marketing strategies connect you with your target audience and drive measurable results.",
    services: [
      {
        id: "seo-content",
        title: "SEO & Content Marketing",
        details:
          "Dominate search engine rankings and establish authority with RocketOpp's comprehensive SEO and content strategies. We cover keyword research, on-page optimization, technical SEO, and high-quality content creation that resonates with your audience.",
        icon: <BarChart3 className="h-5 w-5 text-primary mr-2" />,
        link: "/services/web-marketing/seo",
      },
      {
        id: "ppc-social",
        title: "PPC & Social Media Advertising",
        details:
          "Achieve immediate visibility and targeted leads with RocketOpp's expert PPC campaign management (Google Ads, social media ads). We optimize for ROI and continuously refine campaigns for peak performance.",
        icon: <MessageCircle className="h-5 w-5 text-primary mr-2" />,
        link: "/services/web-marketing/ppc", // or a general social media ads page
      },
    ],
  },
  aiAutomation: {
    title: "AI & Automation",
    icon: <Brain className="h-5 w-5 mr-2" />,
    description:
      "Unlock the power of Artificial Intelligence. RocketOpp integrates intelligent solutions to personalize experiences, automate processes, and provide actionable insights.",
    services: [
      {
        id: "ai-personalization",
        title: "AI-Powered Personalization",
        details:
          "Deliver unique experiences to every user. RocketOpp implements AI algorithms to personalize website content, product recommendations, and marketing messages, significantly boosting engagement and conversions.",
        icon: <AiBotIcon />, // Using the existing BotIcon as AiBotIcon
        link: "/services/ai-integration",
      },
      {
        id: "workflow-automation",
        title: "Workflow Automation & Chatbots",
        details:
          "Streamline your business operations with custom AI-driven workflow automation and intelligent chatbots. RocketOpp helps you reduce manual effort, improve efficiency, and provide 24/7 customer support.",
        icon: <Settings2 className="h-5 w-5 text-primary mr-2" />,
        link: "/services/ai-integration#automation", // Example anchor link
      },
    ],
  },
  clientManagement: {
    title: "Client Management",
    icon: <Users className="h-5 w-5 mr-2" />,
    description:
      "The Rocket Client platform: Your all-in-one solution for marketing, sales, and operations. Simplify your workflow and delight your customers.",
    services: [
      {
        id: "rocket-client-platform",
        title: "Rocket Client Platform",
        details:
          "Rocket Client by RocketOpp is a comprehensive SaaS platform integrating CRM, email marketing, funnel building, AI chatbots, appointment scheduling, and much more. Manage your entire client lifecycle from one powerful dashboard.",
        icon: <CheckCircle className="h-5 w-5 text-primary mr-2" />,
        link: "/rocket-clients",
      },
    ],
  },
}

export default function DetailedServicesSection() {
  return (
    <section
      className="py-16 md:py-24 bg-muted/30 dark:bg-muted/10"
      id="detailed-services"
      aria-labelledby="detailed-services-heading"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground mb-2">
            Our Expertise
          </div>
          <h2 id="detailed-services-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            A Deeper Dive into RocketOpp Solutions
          </h2>
          <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
            Explore the core components of our service offerings, designed to provide comprehensive support for your
            business's digital journey with RocketOpp.
          </p>
        </div>

        <Tabs defaultValue="webSolutions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto p-2">
            {Object.entries(detailedServicesData).map(([key, tab]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="py-3 data-[state=active]:shadow-md flex items-center justify-center text-center"
              >
                {tab.icon} {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(detailedServicesData).map(([key, tab]) => (
            <TabsContent key={key} value={key}>
              <HoverGlowCard borderRadius="0.75rem">
                <div className="p-6 md:p-8 rounded-xl bg-card border">
                  <h3 className="text-2xl font-semibold mb-3 flex items-center">
                    {tab.icon} {tab.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">{tab.description}</p>
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
                            <p className="mb-3">{service.details}</p>
                            <Button variant="link" asChild className="p-0 h-auto text-primary">
                              <Link href={service.link || "/#contact"}>
                                Learn more about {service.title.toLowerCase()} with RocketOpp
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
