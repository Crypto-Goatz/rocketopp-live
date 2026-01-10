"use client"

import { useState } from "react"
import {
  Rocket, Building2, Globe, Code, Zap, BarChart3, Users, Mail,
  Phone, ExternalLink, FolderKanban, ChevronDown, ChevronUp,
  Terminal, Database, Server, Bot, TrendingUp, DollarSign,
  Send, FileText, Image, Megaphone, GraduationCap, Settings,
  Home, Layers, X, Check, Loader2, PlayCircle
} from "lucide-react"

// ============================================================
// HARDCODED DATA - WORKS IMMEDIATELY
// ============================================================

const CLIENTS = [
  {
    id: "rocketopp",
    name: "RocketOpp",
    logo: "🚀",
    status: "active",
    mrr: 0,
    health: 100,
    website: "https://rocketopp.com",
    github: "https://github.com/Crypto-Goatz/rocketopp-live",
    ghlLocation: "6MSqx0trfxgLxeHBJE1k",
    email: "team@rocketopp.com",
    phone: "(878) 888-1230"
  },
  {
    id: "abk",
    name: "ABK Unlimited",
    logo: "🏠",
    status: "active",
    mrr: 2500,
    health: 92,
    website: "https://abkunlimited.com",
    github: "https://github.com/Crypto-Goatz/ABK-Unlimited",
    ghlLocation: "abk-location",
    email: "contact@abkunlimited.com",
    phone: null
  },
  {
    id: "ecospray",
    name: "EcoSpray Solutions",
    logo: "🌿",
    status: "onboarding",
    mrr: 0,
    health: 50,
    website: "https://ecospraysolutions.com",
    github: null,
    ghlLocation: null,
    email: "info@ecospraysolutions.com",
    phone: null,
    platform: "wordpress"
  }
]

export default function CommandCenter() {
  const [activeClient, setActiveClient] = useState(CLIENTS[0])
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [toolLoading, setToolLoading] = useState(false)
  const [toolSuccess, setToolSuccess] = useState(false)

  // Tool execution
  const runTool = async (toolId: string) => {
    setActiveTool(toolId)
    setToolLoading(true)
    setToolSuccess(false)

    // Simulate tool execution
    await new Promise(r => setTimeout(r, 2000))

    setToolLoading(false)
    setToolSuccess(true)

    setTimeout(() => {
      setToolSuccess(false)
      setActiveTool(null)
    }, 2000)
  }

  // Send course to GHL
  const sendCourseToGHL = async () => {
    if (!activeClient.ghlLocation) {
      alert("This client doesn't have GHL connected yet.")
      return
    }

    setActiveTool("course")
    setToolLoading(true)

    try {
      const response = await fetch("/api/ghl/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: activeClient.ghlLocation,
          courseName: "AI Business Growth Blueprint",
          clientName: activeClient.name
        })
      })

      if (response.ok) {
        setToolSuccess(true)
      }
    } catch (error) {
      console.error("Failed to send course:", error)
    }

    setToolLoading(false)
    setTimeout(() => {
      setToolSuccess(false)
      setActiveTool(null)
    }, 3000)
  }

  const totalMRR = CLIENTS.reduce((sum, c) => sum + c.mrr, 0)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Clean Header */}
      <header className="border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">Command</span>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-green-400 font-medium">${totalMRR.toLocaleString()}</span>
              <span>MRR</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-white font-medium">{CLIENTS.filter(c => c.status === "active").length}</span>
              <span>Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Clean & Focused */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Client Selector - Clean Pills */}
        <div className="flex items-center gap-2 mb-10">
          {CLIENTS.map((client) => (
            <button
              key={client.id}
              onClick={() => setActiveClient(client)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeClient.id === client.id
                  ? "bg-white text-black"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span>{client.logo}</span>
              <span className="font-medium">{client.name}</span>
              {client.status === "onboarding" && (
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
              )}
            </button>
          ))}
        </div>

        {/* Client Dashboard */}
        <div className="space-y-8">
          {/* Client Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl">{activeClient.logo}</span>
                <div>
                  <h1 className="text-3xl font-bold">{activeClient.name}</h1>
                  <div className="flex items-center gap-4 mt-1 text-zinc-400">
                    <span className={`flex items-center gap-1.5 ${
                      activeClient.status === "active" ? "text-green-400" : "text-yellow-400"
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {activeClient.status}
                    </span>
                    <span>Health: {activeClient.health}%</span>
                    {activeClient.mrr > 0 && (
                      <span className="text-green-400">${activeClient.mrr}/mo</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-2">
              {activeClient.website && (
                <a
                  href={activeClient.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Website</span>
                </a>
              )}
              {activeClient.github && (
                <a
                  href={activeClient.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <Code className="w-4 h-4" />
                  <span className="text-sm">GitHub</span>
                </a>
              )}
              {activeClient.ghlLocation && (
                <a
                  href={`https://app.gohighlevel.com/location/${activeClient.ghlLocation}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">GHL</span>
                </a>
              )}
            </div>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Send Course to GHL */}
            <button
              onClick={sendCourseToGHL}
              disabled={!activeClient.ghlLocation || toolLoading}
              className={`relative p-6 rounded-2xl text-left transition-all group ${
                activeClient.ghlLocation
                  ? "bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-500/60"
                  : "bg-zinc-900/50 border border-zinc-800 opacity-50 cursor-not-allowed"
              }`}
            >
              {activeTool === "course" && toolLoading && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                </div>
              )}
              {activeTool === "course" && toolSuccess && (
                <div className="absolute inset-0 bg-green-600/20 rounded-2xl flex items-center justify-center border border-green-500">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
              )}
              <GraduationCap className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-semibold mb-1">Send AI Course</h3>
              <p className="text-sm text-zinc-400">Deploy course to GHL</p>
            </button>

            {/* Generate Content */}
            <button
              onClick={() => runTool("content")}
              className="relative p-6 rounded-2xl text-left bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 hover:border-blue-500/60 transition-all group"
            >
              {activeTool === "content" && toolLoading && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                </div>
              )}
              {activeTool === "content" && toolSuccess && (
                <div className="absolute inset-0 bg-green-600/20 rounded-2xl flex items-center justify-center border border-green-500">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
              )}
              <FileText className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-semibold mb-1">Generate Content</h3>
              <p className="text-sm text-zinc-400">Blog posts, emails, social</p>
            </button>

            {/* SEO Analysis */}
            <button
              onClick={() => runTool("seo")}
              className="relative p-6 rounded-2xl text-left bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 hover:border-green-500/60 transition-all group"
            >
              {activeTool === "seo" && toolLoading && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-green-400" />
                </div>
              )}
              {activeTool === "seo" && toolSuccess && (
                <div className="absolute inset-0 bg-green-600/20 rounded-2xl flex items-center justify-center border border-green-500">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
              )}
              <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-semibold mb-1">SEO Analysis</h3>
              <p className="text-sm text-zinc-400">Audit & recommendations</p>
            </button>

            {/* Send Email */}
            <button
              onClick={() => window.location.href = `mailto:${activeClient.email}`}
              className="p-6 rounded-2xl text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <Mail className="w-8 h-8 text-orange-400 mb-3" />
              <h3 className="font-semibold mb-1">Send Email</h3>
              <p className="text-sm text-zinc-400">{activeClient.email}</p>
            </button>

            {/* View Leads */}
            <a
              href="/dashboard/leads"
              className="p-6 rounded-2xl text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <Users className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="font-semibold mb-1">View Leads</h3>
              <p className="text-sm text-zinc-400">Lead management</p>
            </a>

            {/* Analytics */}
            <a
              href="/dashboard/analytics"
              className="p-6 rounded-2xl text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <BarChart3 className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-semibold mb-1">Analytics</h3>
              <p className="text-sm text-zinc-400">Traffic & conversions</p>
            </a>
          </div>

          {/* Platform Notice for WordPress clients */}
          {activeClient.platform === "wordpress" && (
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-yellow-400">WordPress Site</h4>
                <p className="text-sm text-zinc-400">
                  This client uses WordPress. RocketWP plugin coming soon for full control.
                </p>
              </div>
              <button className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-500/30 transition-colors">
                Plan Rebuild
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Mega Menu */}
      <footer className="border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          {/* Mega Menu Dropdown */}
          {megaMenuOpen && (
            <div className="py-8 grid grid-cols-4 gap-8 border-b border-zinc-800 animate-in slide-in-from-bottom-2 duration-200">
              {/* Tools */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Tools</h4>
                <div className="space-y-2">
                  <a href="/assessment" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <Bot className="w-4 h-4" /> Spark Assessment
                  </a>
                  <a href="/dashboard/tools/content-writer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <FileText className="w-4 h-4" /> Content Writer
                  </a>
                  <a href="/dashboard/tools/image-generator" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <Image className="w-4 h-4" /> Image Generator
                  </a>
                  <a href="/dashboard/tools/seo-analyzer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <TrendingUp className="w-4 h-4" /> SEO Analyzer
                  </a>
                </div>
              </div>

              {/* External */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">External</h4>
                <div className="space-y-2">
                  <a href="https://app.gohighlevel.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <Zap className="w-4 h-4" /> GoHighLevel
                  </a>
                  <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <Globe className="w-4 h-4" /> Vercel
                  </a>
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <Database className="w-4 h-4" /> Supabase
                  </a>
                  <a href="https://github.com/Crypto-Goatz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <Code className="w-4 h-4" /> GitHub
                  </a>
                </div>
              </div>

              {/* Dashboard */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Dashboard</h4>
                <div className="space-y-2">
                  <a href="/dashboard" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <Home className="w-4 h-4" /> Home
                  </a>
                  <a href="/dashboard/leads" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <Users className="w-4 h-4" /> Leads
                  </a>
                  <a href="/dashboard/analytics" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <BarChart3 className="w-4 h-4" /> Analytics
                  </a>
                  <a href="/dashboard/admin" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" /> Admin
                  </a>
                </div>
              </div>

              {/* Quick Contact */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Jessica AI</h4>
                <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Call Jessica</p>
                      <p className="text-xs text-zinc-500">Available 24/7</p>
                    </div>
                  </div>
                  <a
                    href="tel:+18788881230"
                    className="block w-full py-2 bg-orange-500 rounded-lg text-center text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    (878) 888-1230
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Footer Nav Bar */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="/dashboard" className="text-sm text-zinc-500 hover:text-white transition-colors">
                Dashboard
              </a>
              <a href="/dashboard/leads" className="text-sm text-zinc-500 hover:text-white transition-colors">
                Leads
              </a>
              <a href="/dashboard/analytics" className="text-sm text-zinc-500 hover:text-white transition-colors">
                Analytics
              </a>
              <a href="/assessment" className="text-sm text-zinc-500 hover:text-white transition-colors">
                Assessment
              </a>
            </div>

            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                megaMenuOpen
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">Menu</span>
              {megaMenuOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>

            <div className="flex items-center gap-4">
              <a
                href="https://app.gohighlevel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Zap className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/Crypto-Goatz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Code className="w-5 h-5" />
              </a>
              <a
                href="tel:+18788881230"
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-full text-sm hover:bg-orange-500/30 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Jessica
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
