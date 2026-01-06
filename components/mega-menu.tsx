"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Globe, Bot, Zap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  {
    category: "Web Development",
    icon: <Globe className="h-5 w-5" />,
    items: [
      { name: "Website Design", href: "/services/website-design", description: "Custom, responsive websites" },
      {
        name: "SEO Services",
        href: "/services/website-development/seo-services",
        description: "Search engine optimization",
      },
      {
        name: "Conversion Optimization",
        href: "/services/website-development/conversion-optimization",
        description: "AI-powered self-optimizing sites",
      },
      { name: "App Development", href: "/services/app-development", description: "Mobile and web applications" },
    ],
  },
  {
    category: "AI Solutions",
    icon: <Bot className="h-5 w-5" />,
    items: [
      {
        name: "AI-Powered CRM",
        href: "/services/ai-crm",
        description: "⭐ Custom enterprise CRM from $5k",
        featured: true,
      },
      { name: "AI Integration", href: "/services/ai-integration", description: "Intelligent automation solutions" },
      { name: "AI for Business", href: "/ai-for-business", description: "Enterprise AI transformation" },
    ],
    cta: {
      title: "Free AI Business Assessment",
      href: "/ai-assessment",
      icon: <Sparkles className="h-5 w-5" />,
    },
  },
  {
    category: "Digital Marketing",
    icon: <Zap className="h-5 w-5" />,
    items: [
      { name: "Automation", href: "/services/automation", description: "AI-powered workflow automation" },
      { name: "PPC Advertising", href: "/services/web-marketing/ppc", description: "Pay-per-click campaigns" },
      { name: "Social Media", href: "/services/web-marketing/social-media", description: "Social media management" },
      {
        name: "Content Marketing",
        href: "/services/web-marketing/content-marketing",
        description: "Strategic content creation",
      },
    ],
  },
]

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false)
    }, 150)
    setTimeoutId(id)
  }

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={menuRef}>
      <button
        ref={buttonRef}
        className="flex items-center space-x-1 text-foreground/80 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        <span>Services</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-screen max-w-4xl bg-background/95 backdrop-blur-md border border-border/40 rounded-b-lg shadow-lg z-[100] origin-top animate-in fade-in slide-in-from-top-2 duration-200"
        >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <div className="flex items-center space-x-2 text-primary font-semibold">
                  {category.icon}
                  <span>{category.category}</span>
                </div>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className={`block p-2 rounded-md hover:bg-muted/50 transition-colors group ${
                        item.featured ? "bg-primary/5 border border-primary/20" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </Link>
                  ))}

                  {category.cta && (
                    <div className="mt-3 p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30">
                      <div className="flex items-center space-x-2 mb-2 text-primary">
                        {category.cta.icon}
                        <span className="font-medium text-sm">{category.cta.title}</span>
                      </div>
                      <Link href={category.cta.href} onClick={() => setIsOpen(false)}>
                        <Button size="sm" className="w-full text-sm">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border/40">
            <div className="flex flex-wrap gap-4 text-sm">
              <Link
                href="/services"
                className="text-primary hover:text-primary/80 font-medium"
                onClick={() => setIsOpen(false)}
              >
                View All Services →
              </Link>
              <Link
                href="/ai-assessment-start"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Free Consultation
              </Link>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  )
}

export default MegaMenu
