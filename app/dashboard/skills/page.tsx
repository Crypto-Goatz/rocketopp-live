"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Puzzle, Plus, Search, Grid, List,
  Play, Pause, Settings, Trash2, AlertCircle,
  CheckCircle, Clock, XCircle, ChevronRight,
  Download, LayoutGrid, Store
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
  is_marketplace: boolean
}

interface Installation {
  id: string
  skill_id: string
  status: string
  installed_at: string
  last_run: string | null
  config: Record<string, any>
  skill: Skill
}

export default function SkillsPage() {
  const [installations, setInstallations] = useState<Installation[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "installed" | "paused" | "error">("all")

  useEffect(() => {
    fetchInstallations()
  }, [])

  const fetchInstallations = async () => {
    try {
      const res = await fetch("/api/skills/installed")
      const data = await res.json()
      if (data.success) {
        setInstallations(data.skills)
      }
    } catch (error) {
      console.error("Failed to fetch installations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePauseResume = async (installationId: string, currentStatus: string) => {
    const action = currentStatus === "paused" ? "resume" : "pause"
    try {
      const res = await fetch(`/api/skills/${installationId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        fetchInstallations()
      }
    } catch (error) {
      console.error("Failed to pause/resume skill:", error)
    }
  }

  const handleUninstall = async (installationId: string) => {
    if (!confirm("Are you sure you want to uninstall this skill?")) return

    try {
      const res = await fetch(`/api/skills/${installationId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        fetchInstallations()
      }
    } catch (error) {
      console.error("Failed to uninstall skill:", error)
    }
  }

  const filteredInstallations = installations.filter((inst) => {
    const matchesSearch =
      inst.skill.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.skill.description?.toLowerCase().includes(search.toLowerCase())

    const matchesFilter =
      filter === "all" ||
      (filter === "installed" && inst.status === "installed") ||
      (filter === "paused" && inst.status === "paused") ||
      (filter === "error" && inst.status === "error")

    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "installed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-400" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "installing":
        return <Clock className="w-4 h-4 text-blue-400 animate-spin" />
      default:
        return <AlertCircle className="w-4 h-4 text-white/40" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "installed":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      case "paused":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      case "error":
        return "bg-red-500/10 text-red-400 border-red-500/30"
      case "installing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      default:
        return "bg-white/5 text-white/40 border-white/10"
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Puzzle className="w-8 h-8 text-primary" />
            Skills
          </h1>
          <p className="text-white/60 mt-1">
            Extend your dashboard with powerful skills and integrations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/skills/marketplace"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all border border-white/10"
          >
            <Store className="w-4 h-4" />
            <span>Marketplace</span>
          </Link>
          <Link
            href="/dashboard/skills/install"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-red-500 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>Install Skill</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
          {(["all", "installed", "paused", "error"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredInstallations.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <Puzzle className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {search || filter !== "all" ? "No skills found" : "No skills installed"}
          </h3>
          <p className="text-white/50 mb-6">
            {search || filter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by installing a skill from the marketplace"}
          </p>
          <Link
            href="/dashboard/skills/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-red-500 text-white font-medium hover:opacity-90 transition-all"
          >
            <Store className="w-5 h-5" />
            Browse Marketplace
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInstallations.map((inst) => (
            <div
              key={inst.id}
              className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-primary/30 transition-all"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(
                    inst.status
                  )}`}
                >
                  {getStatusIcon(inst.status)}
                  {inst.status}
                </span>
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center mb-4">
                <Puzzle className="w-6 h-6 text-primary" />
              </div>

              {/* Info */}
              <h3 className="text-lg font-semibold text-white mb-1">
                {inst.skill.name}
              </h3>
              <p className="text-sm text-white/50 mb-4 line-clamp-2">
                {inst.skill.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
                <span>v{inst.skill.version}</span>
                <span>by {inst.skill.author}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/skills/${inst.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Configure
                </Link>
                <button
                  onClick={() => handlePauseResume(inst.id, inst.status)}
                  className={`p-2 rounded-lg transition-all ${
                    inst.status === "paused"
                      ? "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                      : "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
                  }`}
                  title={inst.status === "paused" ? "Resume" : "Pause"}
                >
                  {inst.status === "paused" ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleUninstall(inst.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                  title="Uninstall"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredInstallations.map((inst) => (
            <div
              key={inst.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/10 hover:border-primary/30 transition-all"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center flex-shrink-0">
                <Puzzle className="w-5 h-5 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white">{inst.skill.name}</h3>
                <p className="text-sm text-white/50 truncate">
                  {inst.skill.description}
                </p>
              </div>

              {/* Status */}
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(
                  inst.status
                )}`}
              >
                {getStatusIcon(inst.status)}
                {inst.status}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/skills/${inst.id}`}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all"
                  title="Configure"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handlePauseResume(inst.id, inst.status)}
                  className={`p-2 rounded-lg transition-all ${
                    inst.status === "paused"
                      ? "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                      : "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
                  }`}
                  title={inst.status === "paused" ? "Resume" : "Pause"}
                >
                  {inst.status === "paused" ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleUninstall(inst.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                  title="Uninstall"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {!loading && installations.length > 0 && (
        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/10">
            <p className="text-2xl font-bold text-white">{installations.length}</p>
            <p className="text-sm text-white/50">Total Skills</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/10">
            <p className="text-2xl font-bold text-green-400">
              {installations.filter((i) => i.status === "installed").length}
            </p>
            <p className="text-sm text-white/50">Active</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/10">
            <p className="text-2xl font-bold text-yellow-400">
              {installations.filter((i) => i.status === "paused").length}
            </p>
            <p className="text-sm text-white/50">Paused</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/10">
            <p className="text-2xl font-bold text-red-400">
              {installations.filter((i) => i.status === "error").length}
            </p>
            <p className="text-sm text-white/50">Errors</p>
          </div>
        </div>
      )}
    </div>
  )
}
