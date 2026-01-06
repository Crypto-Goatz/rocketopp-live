"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Rocket, Menu, X, ShoppingBag, User, ChevronDown,
  Globe, Cpu, Code2, Megaphone, Search,
  Palette, Zap, BarChart3, Target, TrendingUp,
  Bot, Smartphone, PenTool, Share2, LineChart
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface UserData {
  id: string
  email: string
  name: string | null
}

const services = [
  {
    name: "Website Development",
    tagline: "Sites That Convert",
    href: "/services/website-development",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    features: [
      { name: "Custom Web Design", href: "/services/website-development", icon: Palette },
      { name: "E-Commerce Sites", href: "/services/website-development#ecommerce", icon: ShoppingBag },
      { name: "Landing Pages", href: "/services/website-development#landing", icon: Target },
    ]
  },
  {
    name: "AI Applications",
    tagline: "Intelligence On Demand",
    href: "/services/ai-applications",
    icon: Cpu,
    color: "from-orange-500 to-red-500",
    features: [
      { name: "AI Chatbots", href: "/services/ai-applications#chatbots", icon: Bot },
      { name: "Process Automation", href: "/services/ai-applications#automation", icon: Zap },
      { name: "Custom AI Tools", href: "/services/ai-applications#tools", icon: Cpu },
    ]
  },
  {
    name: "App Development",
    tagline: "Ideas to Reality",
    href: "/services/app-development",
    icon: Code2,
    color: "from-purple-500 to-pink-500",
    features: [
      { name: "Mobile Apps", href: "/services/app-development#mobile", icon: Smartphone },
      { name: "Web Applications", href: "/services/app-development#web", icon: Globe },
      { name: "SaaS Products", href: "/services/app-development#saas", icon: Code2 },
    ]
  },
  {
    name: "Online Marketing",
    tagline: "Growth That Compounds",
    href: "/services/online-marketing",
    icon: Megaphone,
    color: "from-green-500 to-emerald-500",
    features: [
      { name: "Social Media", href: "/services/online-marketing#social", icon: Share2 },
      { name: "Content Strategy", href: "/services/online-marketing#content", icon: PenTool },
      { name: "PPC Advertising", href: "/services/online-marketing#ppc", icon: BarChart3 },
    ]
  },
  {
    name: "Search Optimization",
    tagline: "Get Found First",
    href: "/services/search-optimization",
    icon: Search,
    color: "from-yellow-500 to-orange-500",
    features: [
      { name: "Technical SEO", href: "/services/search-optimization#technical", icon: Code2 },
      { name: "Local SEO", href: "/services/search-optimization#local", icon: Target },
      { name: "Analytics & Reporting", href: "/services/search-optimization#analytics", icon: LineChart },
    ]
  },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileServiceExpanded, setMobileServiceExpanded] = useState<string | null>(null)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setMegaMenuOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-red-500 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">RocketOpp</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Services Mega Menu */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={megaMenuRef}
            >
              <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors py-2">
                Services
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[900px] bg-background/98 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-6">
                    <div className="grid grid-cols-5 gap-4">
                      {services.map((service) => {
                        const Icon = service.icon
                        return (
                          <div key={service.name} className="group">
                            <Link
                              href={service.href}
                              className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                              onClick={() => setMegaMenuOpen(false)}
                            >
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                                {service.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {service.tagline}
                              </p>
                            </Link>
                            <div className="mt-2 space-y-1">
                              {service.features.map((feature) => {
                                const FeatureIcon = feature.icon
                                return (
                                  <Link
                                    key={feature.name}
                                    href={feature.href}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded transition-colors"
                                    onClick={() => setMegaMenuOpen(false)}
                                  >
                                    <FeatureIcon className="w-3 h-3" />
                                    {feature.name}
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Need help choosing? <Link href="/contact" className="text-primary hover:underline">Talk to an expert</Link>
                      </p>
                      <Link
                        href="/services"
                        className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                        onClick={() => setMegaMenuOpen(false)}
                      >
                        View All Services
                        <ChevronDown className="w-3 h-3 -rotate-90" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/marketplace"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Marketplace
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* CTA / Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Button asChild>
                  <Link href="/contact">
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {/* Services Accordion */}
              <div className="border-b border-border/50 pb-2 mb-2">
                <button
                  className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium"
                  onClick={() => setMobileServiceExpanded(mobileServiceExpanded ? null : 'services')}
                >
                  <span>Services</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileServiceExpanded ? 'rotate-180' : ''}`} />
                </button>

                {mobileServiceExpanded && (
                  <div className="mt-2 space-y-1 pl-2">
                    {services.map((service) => {
                      const Icon = service.icon
                      return (
                        <Link
                          key={service.name}
                          href={service.href}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{service.name}</div>
                            <div className="text-xs text-muted-foreground">{service.tagline}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              <Link
                href="/marketplace"
                className="flex items-center gap-2 text-foreground hover:text-primary text-sm font-medium transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag className="w-4 h-4" />
                Marketplace
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="border-t border-border pt-4 mt-2">
                {user ? (
                  <Button asChild className="w-full">
                    <Link href="/dashboard">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/contact">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
