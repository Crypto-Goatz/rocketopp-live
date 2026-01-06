"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Rocket, Menu, X, ShoppingBag, User, ChevronDown,
  Globe, Cpu, Code2, Megaphone, Search, Workflow,
  Palette, Zap, BarChart3, Target,
  Bot, Smartphone, PenTool, Share2, LineChart,
  Lightbulb, HelpCircle, FileText, Sparkles, Package, CreditCard
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
    name: "SOP Automation",
    tagline: "Systems That Scale",
    href: "/services/sop-automation",
    icon: Workflow,
    color: "from-indigo-500 to-violet-500",
    features: [
      { name: "Process Mapping", href: "/services/sop-automation#mapping", icon: FileText },
      { name: "Workflow Automation", href: "/services/sop-automation#workflows", icon: Zap },
      { name: "Team Training", href: "/services/sop-automation#training", icon: Bot },
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

const marketplaceProducts = [
  { name: "Rocket+", description: "50+ AI automation tools", href: "/marketplace/rocket-plus", icon: Rocket, color: "from-orange-500 to-red-500" },
  { name: "MCPFED", description: "MCP server management", href: "/marketplace/mcpfed", icon: Cpu, color: "from-blue-500 to-cyan-500" },
  { name: "BotCoaches", description: "AI coaching profiles", href: "/marketplace/botcoaches", icon: Bot, color: "from-purple-500 to-pink-500" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false)
  const [marketplaceMenuOpen, setMarketplaceMenuOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileServiceExpanded, setMobileServiceExpanded] = useState<string | null>(null)
  const [mobileMarketplaceExpanded, setMobileMarketplaceExpanded] = useState(false)
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const marketplaceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current)
    setMarketplaceMenuOpen(false)
    setServicesMenuOpen(true)
  }

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => setServicesMenuOpen(false), 150)
  }

  const handleMarketplaceEnter = () => {
    if (marketplaceTimeoutRef.current) clearTimeout(marketplaceTimeoutRef.current)
    setServicesMenuOpen(false)
    setMarketplaceMenuOpen(true)
  }

  const handleMarketplaceLeave = () => {
    marketplaceTimeoutRef.current = setTimeout(() => setMarketplaceMenuOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current)
      if (marketplaceTimeoutRef.current) clearTimeout(marketplaceTimeoutRef.current)
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
          <div className="hidden lg:flex items-center gap-1">
            {/* Services Mega Menu */}
            <div
              className="relative"
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
                Services
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Services Mega Menu Dropdown */}
              {servicesMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-[720px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  {/* Glassy overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                  <div className="relative p-6">
                    <div className="grid grid-cols-3 gap-3">
                      {services.map((service) => {
                        const Icon = service.icon
                        return (
                          <Link
                            key={service.name}
                            href={service.href}
                            className="group p-4 rounded-xl hover:bg-white/10 transition-all duration-200"
                            onClick={() => setServicesMenuOpen(false)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-sm text-white group-hover:text-primary transition-colors">
                                  {service.name}
                                </h3>
                                <p className="text-xs text-white/50 mt-0.5">
                                  {service.tagline}
                                </p>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                      <p className="text-xs text-white/40">
                        Need help? <Link href="/contact" className="text-primary hover:underline">Talk to an expert</Link>
                      </p>
                      <Link
                        href="/services"
                        className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                        onClick={() => setServicesMenuOpen(false)}
                      >
                        All Services
                        <ChevronDown className="w-3 h-3 -rotate-90" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Marketplace Mega Menu */}
            <div
              className="relative"
              onMouseEnter={handleMarketplaceEnter}
              onMouseLeave={handleMarketplaceLeave}
            >
              <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
                <ShoppingBag className="w-4 h-4" />
                Marketplace
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${marketplaceMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Marketplace Mega Menu Dropdown */}
              {marketplaceMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-[580px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  {/* Glassy overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                  <div className="relative p-6">
                    {/* Products */}
                    <div className="mb-6">
                      <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Products</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {marketplaceProducts.map((product) => {
                          const Icon = product.icon
                          return (
                            <Link
                              key={product.name}
                              href={product.href}
                              className="group p-3 rounded-xl hover:bg-white/10 transition-all text-center"
                              onClick={() => setMarketplaceMenuOpen(false)}
                            >
                              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-lg`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="font-semibold text-sm text-white">{product.name}</h3>
                              <p className="text-xs text-white/50 mt-0.5">{product.description}</p>
                            </Link>
                          )
                        })}
                      </div>
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Link
                        href="/pitch-idea"
                        className="group p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all"
                        onClick={() => setMarketplaceMenuOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Lightbulb className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-white">Pitch Us an Idea</h3>
                            <p className="text-xs text-white/50">Got a concept? Let's build it</p>
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/request-app"
                        className="group p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                        onClick={() => setMarketplaceMenuOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Package className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-white">Request an App</h3>
                            <p className="text-xs text-white/50">Custom build for your needs</p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Lease Info */}
                    <Link
                      href="/how-leasing-works"
                      className="group block p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
                      onClick={() => setMarketplaceMenuOpen(false)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                            How Does Leasing Work?
                            <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full">Industry First</span>
                          </h3>
                          <p className="text-xs text-white/50 mt-0.5">Pay monthly, own it eventually. The smart way to get premium software.</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-white/40 -rotate-90 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                      <p className="text-xs text-white/40">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        Buy, Subscribe, or Lease-to-Own
                      </p>
                      <Link
                        href="/marketplace"
                        className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                        onClick={() => setMarketplaceMenuOpen(false)}
                      >
                        Browse All
                        <ChevronDown className="w-3 h-3 -rotate-90" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
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
                  onClick={() => setMobileServiceExpanded(mobileServiceExpanded === 'services' ? null : 'services')}
                >
                  <span>Services</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileServiceExpanded === 'services' ? 'rotate-180' : ''}`} />
                </button>

                {mobileServiceExpanded === 'services' && (
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

              {/* Marketplace Accordion */}
              <div className="border-b border-border/50 pb-2 mb-2">
                <button
                  className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium"
                  onClick={() => setMobileMarketplaceExpanded(!mobileMarketplaceExpanded)}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Marketplace
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileMarketplaceExpanded ? 'rotate-180' : ''}`} />
                </button>

                {mobileMarketplaceExpanded && (
                  <div className="mt-2 space-y-2 pl-2">
                    {marketplaceProducts.map((product) => {
                      const Icon = product.icon
                      return (
                        <Link
                          key={product.name}
                          href={product.href}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${product.color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.description}</div>
                          </div>
                        </Link>
                      )
                    })}
                    <div className="pt-2 space-y-2">
                      <Link href="/pitch-idea" className="flex items-center gap-2 px-2 py-2 text-sm text-primary" onClick={() => setMobileMenuOpen(false)}>
                        <Lightbulb className="w-4 h-4" /> Pitch Us an Idea
                      </Link>
                      <Link href="/request-app" className="flex items-center gap-2 px-2 py-2 text-sm text-purple-400" onClick={() => setMobileMenuOpen(false)}>
                        <Package className="w-4 h-4" /> Request an App
                      </Link>
                      <Link href="/how-leasing-works" className="flex items-center gap-2 px-2 py-2 text-sm text-emerald-400" onClick={() => setMobileMenuOpen(false)}>
                        <CreditCard className="w-4 h-4" /> How Leasing Works
                      </Link>
                    </div>
                  </div>
                )}
              </div>

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
