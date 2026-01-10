"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Rocket, Building2, Globe, Code, Zap, BarChart3, Users, Mail,
  Phone, ExternalLink, FolderKanban, CheckCircle, Clock, AlertTriangle,
  Terminal, Database, Server, Plug, Play, Settings, Plus, Search,
  FileText, Image, Bot, Megaphone, TrendingUp, DollarSign, Calendar,
  MessageSquare, Send, RefreshCw, Eye, Edit, Trash2, Copy, Download
} from "lucide-react"

// ============================================================
// HARDCODED CLIENT DATA - NO DATABASE BULLSHIT
// ============================================================

const CLIENTS = {
  rocketopp: {
    id: "rocketopp",
    name: "RocketOpp",
    logo: "🚀",
    industry: "Technology / Agency",
    status: "active",
    health: 100,
    mrr: 0,
    website: "https://rocketopp.com",
    github: "https://github.com/Crypto-Goatz/rocketopp-live",
    ghl: {
      locationId: "6MSqx0trfxgLxeHBJE1k",
      connected: true
    },
    vercel: "rocketopp-live",
    projects: [
      { name: "RocketOpp.com", status: "active", progress: 85, url: "https://rocketopp.com" },
      { name: "Rocket+ App", status: "active", progress: 90, url: "https://rocketadd.com" },
      { name: "Spark Assessment", status: "active", progress: 95, url: "https://rocketopp.com/assessment" }
    ],
    contacts: [
      { name: "Internal Team", email: "team@rocketopp.com", phone: "(878) 888-1230" }
    ]
  },
  abk: {
    id: "abk",
    name: "ABK Unlimited",
    logo: "🏠",
    industry: "Home Services / Construction",
    status: "active",
    health: 92,
    mrr: 2500,
    website: "https://abkunlimited.com",
    github: "https://github.com/Crypto-Goatz/ABK-Unlimited",
    ghl: {
      locationId: "abk-location",
      pipelineId: "G9L7BKFIGlD7140Ebh9x",
      connected: true
    },
    vercel: "abk-unlimited",
    projects: [
      { name: "ABK Website", status: "complete", progress: 100, url: "https://abkunlimited.com" },
      { name: "GHL Pipeline", status: "complete", progress: 100, url: null },
      { name: "SEO Campaign", status: "active", progress: 60, url: null }
    ],
    contacts: [
      { name: "ABK Team", email: "contact@abkunlimited.com", phone: null }
    ]
  },
  ecospray: {
    id: "ecospray",
    name: "EcoSpray Solutions",
    logo: "🌿",
    industry: "Home Services / Insulation",
    status: "onboarding",
    health: 50,
    mrr: 0,
    website: "https://ecospraysolutions.com",
    github: null,
    ghl: {
      locationId: null,
      connected: false
    },
    vercel: null,
    platform: "wordpress",
    projects: [
      { name: "Website Rebuild", status: "planning", progress: 5, url: "https://ecospraysolutions.com" },
      { name: "SEO Domination", status: "planning", progress: 0, url: null },
      { name: "GHL Setup", status: "pending", progress: 0, url: null }
    ],
    contacts: [
      { name: "EcoSpray Team", email: "info@ecospraysolutions.com", phone: null }
    ]
  }
}

// Quick action tools
const TOOLS = [
  { name: "Spark Assessment", icon: Bot, href: "/assessment", color: "orange", desc: "AI business assessment" },
  { name: "Content Writer", icon: FileText, href: "/dashboard/tools/content-writer", color: "blue", desc: "Generate content" },
  { name: "Image Generator", icon: Image, href: "/dashboard/tools/image-generator", color: "purple", desc: "AI images" },
  { name: "SEO Analyzer", icon: TrendingUp, href: "/dashboard/tools/seo-analyzer", color: "green", desc: "Check SEO health" },
  { name: "Lead Dashboard", icon: Users, href: "/dashboard/leads", color: "yellow", desc: "View all leads" },
  { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics", color: "cyan", desc: "Site analytics" },
]

// External quick links
const QUICK_LINKS = [
  { name: "GHL Dashboard", url: "https://app.gohighlevel.com", icon: Zap },
  { name: "Vercel", url: "https://vercel.com/dashboard", icon: Globe },
  { name: "Supabase", url: "https://supabase.com/dashboard", icon: Database },
  { name: "GitHub", url: "https://github.com/Crypto-Goatz", icon: Code },
  { name: "Anthropic Console", url: "https://console.anthropic.com", icon: Bot },
  { name: "Google Analytics", url: "https://analytics.google.com", icon: BarChart3 },
]

export default function CommandCenter() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const clients = Object.values(CLIENTS)
  const totalMRR = clients.reduce((sum, c) => sum + c.mrr, 0)
  const activeClients = clients.filter(c => c.status === "active").length

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const client = selectedClient ? CLIENTS[selectedClient as keyof typeof CLIENTS] : null

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Command Center</h1>
              <p className="text-sm text-zinc-500">RocketOpp Agency HQ</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">${totalMRR.toLocaleString()}</p>
              <p className="text-xs text-zinc-500">Monthly MRR</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-400">{activeClients}</p>
              <p className="text-xs text-zinc-500">Active Clients</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-400">{clients.length}</p>
              <p className="text-xs text-zinc-500">Total Clients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">

          {/* Left Sidebar - Clients */}
          <div className="col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <button className="p-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {filteredClients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClient(c.id)}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    selectedClient === c.id
                      ? "bg-zinc-800 border-orange-500"
                      : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.logo}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{c.name}</h3>
                        <span className={`w-2 h-2 rounded-full ${
                          c.status === "active" ? "bg-green-400" :
                          c.status === "onboarding" ? "bg-yellow-400" : "bg-zinc-500"
                        }`} />
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{c.industry}</p>
                    </div>
                    {c.mrr > 0 && (
                      <span className="text-sm font-medium text-green-400">${c.mrr}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-6 space-y-6">
            {client ? (
              <>
                {/* Client Header */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{client.logo}</span>
                      <div>
                        <h2 className="text-2xl font-bold">{client.name}</h2>
                        <p className="text-zinc-400">{client.industry}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            client.status === "active" ? "bg-green-500/20 text-green-400" :
                            client.status === "onboarding" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-zinc-500/20 text-zinc-400"
                          }`}>
                            {client.status}
                          </span>
                          <span className="text-sm text-zinc-500">Health: {client.health}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {client.website && (
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                          title="Visit Website"
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                      {client.github && (
                        <a
                          href={client.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                          title="GitHub Repo"
                        >
                          <Code className="w-5 h-5" />
                        </a>
                      )}
                      {client.ghl?.connected && (
                        <a
                          href={`https://app.gohighlevel.com/location/${client.ghl.locationId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          title="GHL Dashboard"
                        >
                          <Zap className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-400">${client.mrr}</p>
                      <p className="text-xs text-zinc-500">MRR</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{client.projects.length}</p>
                      <p className="text-xs text-zinc-500">Projects</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-400">
                        {client.ghl?.connected ? "✓" : "✗"}
                      </p>
                      <p className="text-xs text-zinc-500">GHL</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                      <p className={`text-2xl font-bold ${
                        client.health >= 80 ? "text-green-400" :
                        client.health >= 50 ? "text-yellow-400" : "text-red-400"
                      }`}>{client.health}%</p>
                      <p className="text-xs text-zinc-500">Health</p>
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FolderKanban className="w-5 h-5 text-purple-400" />
                      Projects
                    </h3>
                    <button className="text-sm text-orange-400 hover:underline">+ Add Project</button>
                  </div>

                  <div className="space-y-3">
                    {client.projects.map((project, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${
                          project.status === "complete" ? "bg-green-400" :
                          project.status === "active" ? "bg-blue-400" :
                          project.status === "planning" ? "bg-yellow-400" : "bg-zinc-500"
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{project.name}</span>
                            {project.url && (
                              <a href={project.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 text-zinc-500 hover:text-white" />
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-zinc-500">{project.progress}%</span>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          project.status === "complete" ? "bg-green-500/20 text-green-400" :
                          project.status === "active" ? "bg-blue-500/20 text-blue-400" :
                          "bg-zinc-500/20 text-zinc-400"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contacts */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-400" />
                    Contacts
                  </h3>

                  <div className="space-y-3">
                    {client.contacts.map((contact, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-zinc-400">{contact.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`mailto:${contact.email}`}
                            className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          {contact.phone && (
                            <a
                              href={`tel:${contact.phone}`}
                              className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions for this client */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Send Update
                    </button>
                    <button className="p-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" /> Generate Report
                    </button>
                    <button className="p-3 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" /> Schedule Call
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No client selected - show tools */
              <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Select a client to get started</h3>
                  <p className="text-zinc-400">Click on a client in the sidebar to view details, projects, and take actions.</p>
                </div>

                {/* Tools Grid */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-orange-400" />
                    Agency Tools
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {TOOLS.map((tool) => (
                      <Link
                        key={tool.name}
                        href={tool.href}
                        className={`p-4 rounded-xl border border-zinc-800 hover:border-${tool.color}-500/50 transition-all group`}
                      >
                        <tool.icon className={`w-8 h-8 text-${tool.color}-400 mb-3`} />
                        <h4 className="font-medium group-hover:text-orange-400 transition-colors">{tool.name}</h4>
                        <p className="text-xs text-zinc-500 mt-1">{tool.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Quick Links & Activity */}
          <div className="col-span-3 space-y-4">
            {/* Quick Links */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="font-semibold mb-3 text-sm text-zinc-400 uppercase tracking-wider">Quick Links</h3>
              <div className="space-y-1">
                {QUICK_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors group"
                  >
                    <link.icon className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                    <span className="text-sm">{link.name}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-600 ml-auto" />
                  </a>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="font-semibold mb-3 text-sm text-zinc-400 uppercase tracking-wider">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5" />
                  <div>
                    <p>Spark Assessment rebranded</p>
                    <p className="text-xs text-zinc-500">Just now</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                  <div>
                    <p>Agency dashboard created</p>
                    <p className="text-xs text-zinc-500">5 min ago</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5" />
                  <div>
                    <p>EcoSpray added as prospect</p>
                    <p className="text-xs text-zinc-500">10 min ago</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5" />
                  <div>
                    <p>ABK SEO campaign updated</p>
                    <p className="text-xs text-zinc-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* This Week */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="font-semibold mb-3 text-sm text-zinc-400 uppercase tracking-wider">This Week</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">New Leads</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Assessments</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Calls Booked</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Revenue</span>
                  <span className="font-medium text-green-400">$2,500</span>
                </div>
              </div>
            </div>

            {/* Jessica AI */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Jessica AI</h3>
                  <p className="text-xs text-zinc-400">Always available</p>
                </div>
              </div>
              <a
                href="tel:+18788881230"
                className="block w-full p-2 bg-orange-500 rounded-lg text-center font-medium hover:bg-orange-600 transition-colors"
              >
                (878) 888-1230
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
