"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Settings, Play, Pause, Trash2, RefreshCw,
  Shield, Clock, CheckCircle, XCircle, AlertCircle,
  RotateCcw, History, Save, Loader2, ChevronDown, ChevronUp
} from "lucide-react"

interface SkillLog {
  id: string
  action: string
  target: string
  before_state: any
  after_state: any
  reversible: boolean
  reverted: boolean
  created_at: string
}

interface Installation {
  id: string
  skill_id: string
  status: string
  installed_at: string
  last_run: string | null
  config: Record<string, any>
  environment: Record<string, string>
  permissions_granted: string[]
  skill: {
    id: string
    slug: string
    name: string
    description: string
    icon: string
    version: string
    author: string
    manifest: {
      permissions: string[]
      onboarding: Array<{
        field: string
        label: string
        type: string
        required: boolean
        description?: string
      }>
    }
  }
}

export default function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [installation, setInstallation] = useState<Installation | null>(null)
  const [logs, setLogs] = useState<SkillLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState<"config" | "logs" | "permissions">("config")
  const [onboardingData, setOnboardingData] = useState<Record<string, string>>({})
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  useEffect(() => {
    fetchInstallation()
    fetchLogs()
  }, [id])

  const fetchInstallation = async () => {
    try {
      const res = await fetch(`/api/skills/installed`)
      const data = await res.json()

      if (data.success) {
        const inst = data.skills.find((s: Installation) => s.id === id)
        if (inst) {
          setInstallation(inst)
          // Initialize onboarding data from config
          const initialData: Record<string, string> = {}
          inst.skill.manifest?.onboarding?.forEach((field: any) => {
            initialData[field.field] = inst.config[field.field] || ""
          })
          setOnboardingData(initialData)
        }
      }
    } catch (error) {
      console.error("Failed to fetch installation:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/skills/${id}/logs?limit=20`)
      const data = await res.json()
      if (data.success) {
        setLogs(data.logs)
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    }
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      // Save onboarding data
      await fetch(`/api/skills/${id}/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: onboardingData }),
      })

      // Update config
      await fetch(`/api/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: onboardingData }),
      })

      fetchInstallation()
    } catch (error) {
      console.error("Failed to save config:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleExecute = async () => {
    setExecuting(true)
    try {
      const res = await fetch(`/api/skills/${id}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.success) {
        fetchInstallation()
        fetchLogs()
      } else {
        alert(data.error || "Execution failed")
      }
    } catch (error) {
      console.error("Failed to execute:", error)
    } finally {
      setExecuting(false)
    }
  }

  const handlePauseResume = async () => {
    const action = installation?.status === "paused" ? "resume" : "pause"
    try {
      await fetch(`/api/skills/${id}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      fetchInstallation()
    } catch (error) {
      console.error("Failed to pause/resume:", error)
    }
  }

  const handleUninstall = async () => {
    if (!confirm("Are you sure you want to uninstall this skill? This action cannot be undone.")) {
      return
    }

    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/dashboard/skills")
      }
    } catch (error) {
      console.error("Failed to uninstall:", error)
    }
  }

  const handleRevertLog = async (logId: string) => {
    if (!confirm("Are you sure you want to revert this action?")) return

    try {
      const res = await fetch(`/api/skills/${id}/rollback/${logId}`, {
        method: "POST",
      })
      const data = await res.json()
      if (data.success) {
        fetchLogs()
      } else {
        alert(data.error || "Failed to revert")
      }
    } catch (error) {
      console.error("Failed to revert:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "installed":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "paused":
        return <Pause className="w-5 h-5 text-yellow-400" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-white/40" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!installation) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/60">Installation not found</p>
        <Link href="/dashboard/skills" className="text-primary hover:underline mt-2 inline-block">
          Back to Skills
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/skills"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{installation.skill.name}</h1>
              {getStatusIcon(installation.status)}
            </div>
            <p className="text-white/60 mt-1">{installation.skill.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-white/40">
              <span>v{installation.skill.version}</span>
              <span>by {installation.skill.author}</span>
              <span>
                Installed {new Date(installation.installed_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExecute}
            disabled={executing || installation.status !== "installed"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-all disabled:opacity-50"
          >
            {executing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Run
          </button>
          <button
            onClick={handlePauseResume}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              installation.status === "paused"
                ? "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                : "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {installation.status === "paused" ? (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </button>
          <button
            onClick={handleUninstall}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Uninstall
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/10">
        {(["config", "logs", "permissions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-all relative ${
              activeTab === tab
                ? "text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "config" && (
        <div className="space-y-6">
          {installation.skill.manifest?.onboarding?.length > 0 ? (
            <>
              {installation.skill.manifest.onboarding.map((field) => (
                <div key={field.field}>
                  <label className="block text-sm font-medium text-white mb-2">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={onboardingData[field.field] || ""}
                      onChange={(e) =>
                        setOnboardingData({
                          ...onboardingData,
                          [field.field]: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
                    />
                  ) : (
                    <input
                      type={field.type === "password" ? "password" : "text"}
                      value={onboardingData[field.field] || ""}
                      onChange={(e) =>
                        setOnboardingData({
                          ...onboardingData,
                          [field.field]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
                    />
                  )}
                  {field.description && (
                    <p className="text-xs text-white/40 mt-1">{field.description}</p>
                  )}
                </div>
              ))}

              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-red-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Configuration
              </button>
            </>
          ) : (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">This skill has no configuration options</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "logs" && (
        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No activity logs yet</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-zinc-900/50 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        log.reverted
                          ? "bg-white/5 text-white/40"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="text-sm text-white/60">{log.target}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                    {log.reversible && !log.reverted && (
                      <button
                        onClick={() => handleRevertLog(log.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                        title="Revert this action"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {log.reverted && (
                      <span className="text-xs text-white/40 italic">Reverted</span>
                    )}
                    <button
                      onClick={() =>
                        setExpandedLog(expandedLog === log.id ? null : log.id)
                      }
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    >
                      {expandedLog === log.id ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedLog === log.id && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/40 mb-2">Before</p>
                      <pre className="p-3 rounded-lg bg-black/50 text-xs text-white/60 overflow-x-auto">
                        {JSON.stringify(log.before_state, null, 2) || "null"}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-2">After</p>
                      <pre className="p-3 rounded-lg bg-black/50 text-xs text-white/60 overflow-x-auto">
                        {JSON.stringify(log.after_state, null, 2) || "null"}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "permissions" && (
        <div className="space-y-4">
          {installation.permissions_granted.map((perm) => (
            <div
              key={perm}
              className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-white/10"
            >
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-white">{perm}</p>
                <p className="text-sm text-white/50">
                  {getPermissionDescription(perm)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Last Run Info */}
      {installation.last_run && (
        <div className="mt-8 p-4 rounded-xl bg-zinc-900/50 border border-white/10">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Clock className="w-4 h-4" />
            Last executed: {new Date(installation.last_run).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}

function getPermissionDescription(permission: string): string {
  const descriptions: Record<string, string> = {
    "api:read": "Read data from API endpoints",
    "api:write": "Create and modify API endpoints",
    "database:*": "Full database access",
    "files:read": "Read project files",
    "files:write": "Create and modify project files",
    "env:*": "Access all environment variables",
    "exec:server": "Execute server-side code",
    "exec:client": "Execute client-side code",
    "cron:*": "Schedule recurring tasks",
  }

  if (descriptions[permission]) {
    return descriptions[permission]
  }

  const [category, scope] = permission.split(":")

  switch (category) {
    case "database":
      return `Access to database tables matching: ${scope}`
    case "env":
      return `Access to environment variable: ${scope}`
    case "cron":
      return `Schedule tasks: ${scope}`
    default:
      return permission
  }
}
