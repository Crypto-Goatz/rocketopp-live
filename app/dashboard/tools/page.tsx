"use client"

import Link from "next/link"
import {
  Sparkles, Zap, Target, Wand2, FileText, Image as ImageIcon,
  Search, Mail, MessageSquare, ChevronRight, Fuel
} from "lucide-react"

const tools = [
  {
    name: "AI Content Writer",
    description: "Generate blog posts, ads, emails, and social media content with AI",
    icon: FileText,
    href: "/dashboard/tools/content-writer",
    color: "from-purple-500 to-pink-500",
    fuelCost: 10,
    category: "Content"
  },
  {
    name: "Image Generator",
    description: "Create stunning visuals and graphics with AI-powered image generation",
    icon: ImageIcon,
    href: "/dashboard/tools/image-generator",
    color: "from-blue-500 to-cyan-500",
    fuelCost: 25,
    category: "Creative"
  },
  {
    name: "SEO Analyzer",
    description: "Analyze and optimize your content for search engines",
    icon: Target,
    href: "/dashboard/tools/seo-analyzer",
    color: "from-green-500 to-emerald-500",
    fuelCost: 15,
    category: "Marketing"
  },
  {
    name: "Email Writer",
    description: "Generate professional email templates and sequences",
    icon: Mail,
    href: "/dashboard/tools/email-writer",
    color: "from-orange-500 to-red-500",
    fuelCost: 10,
    category: "Content"
  },
  {
    name: "Chat Assistant",
    description: "Get answers to business questions and brainstorm ideas",
    icon: MessageSquare,
    href: "/dashboard/tools/chat",
    color: "from-indigo-500 to-purple-500",
    fuelCost: 5,
    category: "Assistant"
  },
  {
    name: "Keyword Research",
    description: "Find the best keywords for your content and SEO strategy",
    icon: Search,
    href: "/dashboard/tools/keywords",
    color: "from-teal-500 to-green-500",
    fuelCost: 20,
    category: "Marketing"
  },
]

const categories = [...new Set(tools.map(t => t.category))]

export default function ToolsPage() {
  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Tools
        </h1>
        <p className="text-white/60">
          Powerful AI tools to help you create, analyze, and optimize your business
        </p>
      </div>

      {/* Tools by Category */}
      {categories.map(category => (
        <div key={category} className="mb-10">
          <h2 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            {category}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools
              .filter(t => t.category === category)
              .map(tool => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-primary/30 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{tool.name}</h3>
                  <p className="text-sm text-white/50 mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-orange-400">
                      <Fuel className="w-4 h-4" />
                      {tool.fuelCost} fuel
                    </div>
                    <div className="text-primary group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
