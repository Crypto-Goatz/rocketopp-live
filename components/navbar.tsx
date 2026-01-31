"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RocketOppLogo } from "@/components/logo"
import {
  Menu, X, User, ChevronDown,
  Globe, Cpu, Code2, Megaphone, Search, Workflow,
  Palette, Zap, BarChart3, Target,
  Bot, Smartphone, PenTool, Share2, LineChart,
  Lightbulb, FileText, Sparkles, Package, Rocket, ExternalLink,
  ShoppingBag
} from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"

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
      { name: "Request an App", href: "/request-app", icon: Rocket },
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

const ourApps = [
  { name: "Rocket+", description: "50+ AI CRM tools", href: "https://rocketadd.com", icon: Rocket, color: "from-orange-500 to-red-500", external: true, status: "Live" },
  { name: "MCPFED", description: "AI agent command center", href: "https://mcpfed.com", icon: Cpu, color: "from-cyan-500 to-blue-500", external: true, status: "Live" },
  { name: "BotCoaches", description: "AI coaching personas", href: "https://botcoaches.com", icon: Bot, color: "from-purple-500 to-pink-500", external: true, status: "Soon" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false)
  const [appsMenuOpen, setAppsMenuOpen] = useState(false)
  const [servicesAnimating, setServicesAnimating] = useState(false)
  const [appsAnimating, setAppsAnimating] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileServiceExpanded, setMobileServiceExpanded] = useState<string | null>(null)
  const [mobileAppsExpanded, setMobileAppsExpanded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const appsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const servicesDropdownRef = useRef<HTMLDivElement>(null)
  const appsDropdownRef = useRef<HTMLDivElement>(null)

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

  // Mouse tracking for glassy effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }, [])

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current)
    setAppsMenuOpen(false)
    setAppsAnimating(false)
    setServicesAnimating(true)
    setServicesMenuOpen(true)
  }

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesAnimating(false)
      // Small delay before fully closing to allow exit animation
      setTimeout(() => setServicesMenuOpen(false), 300)
    }, 100)
  }

  const handleAppsEnter = () => {
    if (appsTimeoutRef.current) clearTimeout(appsTimeoutRef.current)
    setServicesMenuOpen(false)
    setServicesAnimating(false)
    setAppsAnimating(true)
    setAppsMenuOpen(true)
  }

  const handleAppsLeave = () => {
    appsTimeoutRef.current = setTimeout(() => {
      setAppsAnimating(false)
      setTimeout(() => setAppsMenuOpen(false), 300)
    }, 100)
  }

  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current)
      if (appsTimeoutRef.current) clearTimeout(appsTimeoutRef.current)
    }
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <RocketOppLogo height={36} width={180} />
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
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${servicesMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Services Mega Menu Dropdown */}
                {servicesMenuOpen && (
                  <div
                    ref={servicesDropdownRef}
                    className={`absolute top-full left-0 pt-2 w-[720px] z-[100] ${servicesAnimating ? 'menu-enter' : 'menu-exit'}`}
                    onMouseMove={handleMouseMove}
                  >
                    <div className="relative bg-black border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden">
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 opacity-30">
                        <div
                          className="absolute w-[500px] h-[500px] rounded-full blur-3xl transition-all duration-500 ease-out"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,107,0,0.4) 0%, transparent 70%)',
                            left: mousePos.x - 250,
                            top: mousePos.y - 250,
                          }}
                        />
                      </div>

                      {/* Subtle grid pattern */}
                      <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}
                      />

                      {/* Edge glow effect */}
                      <div className="absolute inset-0 rounded-2xl" style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,107,0,0.05) 100%)'
                      }} />

                      <div className="relative p-6">
                        <div className="grid grid-cols-3 gap-3">
                          {services.map((service) => {
                            const Icon = service.icon
                            return (
                              <Link
                                key={service.name}
                                href={service.href}
                                className="group p-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                                onClick={() => {
                                  setServicesAnimating(false)
                                  setTimeout(() => setServicesMenuOpen(false), 50)
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-current/20 transition-all duration-300 shadow-lg`}>
                                    <Icon className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-sm text-white group-hover:text-primary transition-colors duration-300">
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
                            className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                            onClick={() => {
                              setServicesAnimating(false)
                              setTimeout(() => setServicesMenuOpen(false), 50)
                            }}
                          >
                            All Services
                            <ChevronDown className="w-3 h-3 -rotate-90" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Our Apps Mega Menu */}
              <div
                className="relative"
                onMouseEnter={handleAppsEnter}
                onMouseLeave={handleAppsLeave}
              >
                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
                  <Rocket className="w-4 h-4" />
                  Our Apps
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${appsMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Our Apps Mega Menu Dropdown */}
                {appsMenuOpen && (
                  <div
                    ref={appsDropdownRef}
                    className={`absolute top-full left-0 pt-2 w-[480px] z-[100] ${appsAnimating ? 'menu-enter' : 'menu-exit'}`}
                    onMouseMove={handleMouseMove}
                  >
                    <div className="relative bg-black border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden">
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 opacity-30">
                        <div
                          className="absolute w-[400px] h-[400px] rounded-full blur-3xl transition-all duration-500 ease-out"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,107,0,0.4) 0%, transparent 70%)',
                            left: mousePos.x - 200,
                            top: mousePos.y - 200,
                          }}
                        />
                      </div>

                      {/* Subtle grid pattern */}
                      <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}
                      />

                      {/* Edge glow effect */}
                      <div className="absolute inset-0 rounded-2xl" style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,107,0,0.05) 100%)'
                      }} />

                      <div className="relative p-6">
                        {/* Apps */}
                        <div className="mb-6">
                          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Our Software</h4>
                          <div className="space-y-2">
                            {ourApps.map((app) => {
                              const Icon = app.icon
                              return (
                                <a
                                  key={app.name}
                                  href={app.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                                  onClick={() => {
                                    setAppsAnimating(false)
                                    setTimeout(() => setAppsMenuOpen(false), 50)
                                  }}
                                >
                                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 shadow-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold text-sm text-white">{app.name}</h3>
                                      <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
                                        app.status === 'Live'
                                          ? 'bg-green-500/20 text-green-400'
                                          : 'bg-amber-500/20 text-amber-400'
                                      }`}>
                                        {app.status}
                                      </span>
                                    </div>
                                    <p className="text-xs text-white/50 mt-0.5">{app.description}</p>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                                </a>
                              )
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            href="/pitch-idea"
                            className="group p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300"
                            onClick={() => {
                              setAppsAnimating(false)
                              setTimeout(() => setAppsMenuOpen(false), 50)
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Lightbulb className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-xs text-white">Pitch an Idea</h3>
                                <p className="text-[10px] text-white/50">We might build it</p>
                              </div>
                            </div>
                          </Link>

                          <Link
                            href="/request-app"
                            className="group p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                            onClick={() => {
                              setAppsAnimating(false)
                              setTimeout(() => setAppsMenuOpen(false), 50)
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Package className="w-4 h-4 text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-xs text-white">Request App</h3>
                                <p className="text-[10px] text-white/50">Custom build</p>
                              </div>
                            </div>
                          </Link>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                          <p className="text-xs text-white/40">
                            <Sparkles className="w-3 h-3 inline mr-1" />
                            AI-Powered Software Suite
                          </p>
                          <Link
                            href="/apps"
                            className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                            onClick={() => {
                              setAppsAnimating(false)
                              setTimeout(() => setAppsMenuOpen(false), 50)
                            }}
                          >
                            View All Apps
                            <ChevronDown className="w-3 h-3 -rotate-90" />
                          </Link>
                        </div>
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
                <>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Link href="/assessment">
                      Free AI Assessment
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Link href="/assessment">
                      Free AI Assessment
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

                {/* Our Apps Accordion */}
                <div className="border-b border-border/50 pb-2 mb-2">
                  <button
                    className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium"
                    onClick={() => setMobileAppsExpanded(!mobileAppsExpanded)}
                  >
                    <span className="flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Our Apps
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileAppsExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileAppsExpanded && (
                    <div className="mt-2 space-y-2 pl-2">
                      {ourApps.map((app) => {
                        const Icon = app.icon
                        return (
                          <a
                            key={app.name}
                            href={app.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{app.name}</span>
                                <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
                                  app.status === 'Live'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {app.status}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">{app.description}</div>
                            </div>
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          </a>
                        )
                      })}
                      <div className="pt-2 space-y-2">
                        <Link href="/apps" className="flex items-center gap-2 px-2 py-2 text-sm text-primary" onClick={() => setMobileMenuOpen(false)}>
                          <Sparkles className="w-4 h-4" /> View All Apps
                        </Link>
                        <Link href="/pitch-idea" className="flex items-center gap-2 px-2 py-2 text-sm text-primary" onClick={() => setMobileMenuOpen(false)}>
                          <Lightbulb className="w-4 h-4" /> Pitch Us an Idea
                        </Link>
                        <Link href="/request-app" className="flex items-center gap-2 px-2 py-2 text-sm text-purple-400" onClick={() => setMobileMenuOpen(false)}>
                          <Package className="w-4 h-4" /> Request an App
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
                    <div className="flex flex-col gap-2">
                      <Button asChild className="w-full">
                        <Link href="/dashboard">
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-500">
                        <Link href="/assessment">Free AI Assessment</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500">
                        <Link href="/assessment">Free AI Assessment</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes menuSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
            clip-path: inset(0 0 100% 0);
          }
          60% {
            opacity: 1;
            transform: translateY(4px);
            clip-path: inset(0 0 0% 0);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            clip-path: inset(0 0 0% 0);
          }
        }

        @keyframes menuSlideOut {
          0% {
            opacity: 1;
            transform: translateY(0);
            clip-path: inset(0 0 0% 0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
            clip-path: inset(0 0 100% 0);
          }
        }

        .menu-enter {
          animation: menuSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.05s;
          opacity: 0;
        }

        .menu-exit {
          animation: menuSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </>
  )
}

export default Navbar
