"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import HoverGlowCard from "./hover-glow-card"
import { HelpCircle } from "lucide-react"

const faqData = [
  {
    question: "What kind of businesses does RocketOpp typically work with?",
    answer:
      "RocketOpp works with a diverse range of businesses, from startups to established enterprises, across various industries. We specialize in creating tailored digital solutions, whether you need a new website, a comprehensive marketing strategy, or AI integration. Our personalized approach ensures we meet your specific needs.",
  },
  {
    question: "How long does a typical website design project take?",
    answer:
      "The timeline for a website design project can vary depending on its complexity, features, and client responsiveness. A basic informational website might take 4-6 weeks, while a more complex e-commerce site or web application could take 8-12 weeks or longer. We provide a detailed project timeline after the initial discovery phase.",
  },
  {
    question: "What is AI Personalization and how can it benefit my business?",
    answer:
      "AI Personalization uses artificial intelligence to tailor experiences (like website content, product recommendations, or marketing messages) to individual users. This can significantly boost engagement, conversion rates, and customer loyalty by making interactions more relevant and appealing.",
  },
  {
    question: "Do you offer ongoing support and maintenance after a project is launched?",
    answer:
      "Yes, RocketOpp believes in long-term partnerships. We offer various support and maintenance packages to ensure your website or application remains secure, up-to-date, and performs optimally. We also provide ongoing optimization services to adapt to changing market trends.",
  },
  {
    question: "How does RocketOpp measure the success of a digital marketing campaign?",
    answer:
      "We use a data-driven approach, tracking key performance indicators (KPIs) relevant to your goals. This includes metrics like website traffic, conversion rates, lead generation, search engine rankings, engagement rates, and return on investment (ROI). We provide regular, transparent reports on campaign performance.",
  },
  {
    question: "Can RocketOpp help if I already have a website but it's not performing well?",
    answer:
      "We offer website audits, redesign services, and optimization strategies to improve existing websites. Whether it's enhancing SEO, improving user experience, or integrating new functionalities, RocketOpp can help revitalize your online presence.",
  },
]

export default function FaqSection() {
  return (
    <section className="py-16 md:py-24 bg-background" id="faq" aria-labelledby="faq-heading">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <HelpCircle className="h-12 w-12 text-primary mb-2" />
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Find answers to common questions about RocketOpp and our services.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item, index) => (
              <HoverGlowCard key={index} borderRadius="0.5rem">
                <AccordionItem value={`item-${index}`} className="border rounded-lg bg-card overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 text-lg hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              </HoverGlowCard>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
