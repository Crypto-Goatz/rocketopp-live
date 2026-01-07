"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Store, Search, ArrowLeft, Download, Star,
  CheckCircle, Puzzle, BarChart3, Shield, Zap,
  Database, Calendar, PenTool, Globe
} from "lucide-react"

interface Skill {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  category: string
  version: string
  author: string
  downloads: number
  manifest: {
    permissions: string[]
    onboarding: any[]
  }
}

const categoryIcons: Record<string, any> = {
  analytics: BarChart3,
  seo: Globe,
  utilities: Database,
  social: Calendar,
  content: PenTool,
  security: Shield,
  general: Puzzle,
}

export default function MarketplacePage() {
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [installing, setInstalling] = useState<string | null>(null)

  useEffect(() => {
    fetchSkills()
  }, [selectedCategory])

  const fetchSkills = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.set("category", selectedCategory)

      const res = await fetch(`/api/skills/marketplace?${params}`)
      const data = await res.json()

      if (data.success) {
        setSkills(data.skills)
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInstall = async (skillId: string) => {
    setInstalling(skillId)
    try {
      const res = await fetch("/api/skills/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId }),
      })

      const data = await res.json()

      if (data.success) {
        router.push(`/dashboard/skills/${data.installation.id}`)
      } else {
        alert(data.error || "Failed to install skill")
      }
    } catch (error) {
      console.error("Failed to install:", error)
      alert("Failed to install skill")
    } finally {
      setInstalling(null)
    }
  }

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.description?.toLowerCase().includes(search.toLowerCase())
  )

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category] || Puzzle
    return <Icon className="w-5 h-5" />
  }

  const getRiskLevel = (permissions: string[]) => {
    const highRisk = ["database:*", "files:write", "env:*", "exec:server"]
    const hasHighRisk = permissions.some((p) =>
      highRisk.some((hr) => p === hr || p.startsWith(hr.replace("*", "")))
    )
    return hasHighRisk ? "high" : "low"
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/skills"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Store className="w-8 h-8 text-primary" />
            Skill Marketplace
          </h1>
          <p className="text-white/60 mt-1">
            Discover and install powerful skills to enhance your dashboard
          </p>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !selectedCategory
                ? "bg-primary text-white"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {getCategoryIcon(cat)}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <Store className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No skills found</h3>
          <p className="text-white/50">
            Try adjusting your search or browse a different category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-primary/30 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center">
                  {getCategoryIcon(skill.category)}
                </div>
                <div className="flex items-center gap-2">
                  {getRiskLevel(skill.manifest?.permissions || []) === "high" && (
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                      <Shield className="w-3 h-3 inline mr-1" />
                      Extended
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">{skill.name}</h3>
              <p className="text-sm text-white/50 mb-4 line-clamp-2">
                {skill.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {skill.downloads}
                </span>
                <span>v{skill.version}</span>
                <span>by {skill.author}</span>
              </div>

              {/* Permissions Preview */}
              {skill.manifest?.permissions && skill.manifest.permissions.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-white/40 mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {skill.manifest.permissions.slice(0, 3).map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/60"
                      >
                        {perm}
                      </span>
                    ))}
                    {skill.manifest.permissions.length > 3 && (
                      <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/60">
                        +{skill.manifest.permissions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Install Button */}
              <button
                onClick={() => handleInstall(skill.id)}
                disabled={installing === skill.id}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-red-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
              >
                {installing === skill.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Install
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
