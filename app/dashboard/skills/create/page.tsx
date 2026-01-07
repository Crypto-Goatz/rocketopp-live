"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Wand2, FileCode, Globe, LayoutDashboard, Clock, Database,
  ChevronRight, Check, Loader2, AlertCircle, Eye
} from "lucide-react"

interface TemplateVariable {
  name: string
  label: string
  description?: string
  type: string
  required: boolean
  default?: string
  options?: { value: string; label: string }[]
  validation?: string
}

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: string
  variables: TemplateVariable[]
}

const categoryIcons: Record<string, any> = {
  general: FileCode,
  integrations: Globe,
  ui: LayoutDashboard,
  automation: Clock,
  data: Database,
}

export default function CreateSkillPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [preview, setPreview] = useState<{ files: any[]; manifest: any } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"select" | "configure" | "preview">("select")

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/skills/create")
      const data = await res.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    // Initialize variables with defaults
    const defaults: Record<string, string> = {}
    template.variables.forEach((v) => {
      if (v.default) defaults[v.name] = v.default
    })
    setVariables(defaults)
    setStep("configure")
    setError(null)
    setPreview(null)
  }

  const handlePreview = async () => {
    if (!selectedTemplate) return

    setPreviewing(true)
    setError(null)

    try {
      const res = await fetch("/api/skills/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          variables,
          preview: true,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setPreview({ files: data.files, manifest: data.manifest })
        setStep("preview")
      } else {
        setError(data.errors?.join(", ") || "Preview failed")
      }
    } catch (err) {
      setError("Failed to generate preview")
    } finally {
      setPreviewing(false)
    }
  }

  const handleCreate = async () => {
    if (!selectedTemplate) return

    setCreating(true)
    setError(null)

    try {
      const res = await fetch("/api/skills/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          variables,
          autoInstall: true,
        }),
      })

      const data = await res.json()

      if (data.success) {
        router.push(`/dashboard/skills/${data.skill.id}`)
      } else {
        setError(data.errors?.join(", ") || data.error || "Creation failed")
      }
    } catch (err) {
      setError("Failed to create skill")
    } finally {
      setCreating(false)
    }
  }

  const isFormValid = () => {
    if (!selectedTemplate) return false
    return selectedTemplate.variables
      .filter((v) => v.required)
      .every((v) => variables[v.name]?.trim())
  }

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category] || FileCode
    return <Icon className="w-5 h-5" />
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/skills"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Wand2 className="w-6 h-6 text-primary" />
            Create New Skill
          </h1>
          <p className="text-white/60 mt-1">
            Choose a template and customize your skill
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {["select", "configure", "preview"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? "bg-primary text-white"
                  : ["select", "configure", "preview"].indexOf(step) > i
                  ? "bg-green-500 text-white"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {["select", "configure", "preview"].indexOf(step) > i ? (
                <Check className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-sm ${
                step === s ? "text-white" : "text-white/40"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 2 && <ChevronRight className="w-4 h-4 text-white/20 mx-2" />}
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Step 1: Select Template */}
      {step === "select" && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Choose a Template
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-primary/50 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      {getCategoryIcon(template.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-white/50 mb-2">
                        {template.description}
                      </p>
                      <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/40">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Configure */}
      {step === "configure" && selectedTemplate && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Configure {selectedTemplate.name}
              </h2>
              <p className="text-sm text-white/50">{selectedTemplate.description}</p>
            </div>
            <button
              onClick={() => setStep("select")}
              className="text-sm text-white/50 hover:text-white"
            >
              Change template
            </button>
          </div>

          <div className="space-y-6">
            {selectedTemplate.variables.map((variable) => (
              <div key={variable.name}>
                <label className="block text-sm font-medium text-white mb-2">
                  {variable.label}
                  {variable.required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </label>

                {variable.type === "select" ? (
                  <select
                    value={variables[variable.name] || ""}
                    onChange={(e) =>
                      setVariables({ ...variables, [variable.name]: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50"
                  >
                    <option value="">Select...</option>
                    {variable.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={variables[variable.name] || ""}
                    onChange={(e) =>
                      setVariables({ ...variables, [variable.name]: e.target.value })
                    }
                    placeholder={variable.default || `Enter ${variable.label.toLowerCase()}`}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                  />
                )}

                {variable.description && (
                  <p className="text-xs text-white/40 mt-1">{variable.description}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={handlePreview}
              disabled={!isFormValid() || previewing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
            >
              {previewing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              Preview
            </button>
            <button
              onClick={handleCreate}
              disabled={!isFormValid() || creating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-red-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              Create Skill
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === "preview" && preview && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Preview</h2>
            <button
              onClick={() => setStep("configure")}
              className="text-sm text-white/50 hover:text-white"
            >
              Back to configure
            </button>
          </div>

          {/* Manifest Preview */}
          <div className="mb-6 p-4 rounded-xl bg-zinc-900/50 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-3">Manifest</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/40">Name:</span>
                <span className="text-white ml-2">{preview.manifest.name}</span>
              </div>
              <div>
                <span className="text-white/40">Slug:</span>
                <span className="text-white ml-2">{preview.manifest.slug}</span>
              </div>
              <div>
                <span className="text-white/40">Version:</span>
                <span className="text-white ml-2">{preview.manifest.version}</span>
              </div>
              <div>
                <span className="text-white/40">Category:</span>
                <span className="text-white ml-2">{preview.manifest.category}</span>
              </div>
            </div>
          </div>

          {/* Files Preview */}
          <div className="mb-6 p-4 rounded-xl bg-zinc-900/50 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-3">
              Files to be created ({preview.files.length})
            </h3>
            <div className="space-y-2">
              {preview.files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg bg-black/30"
                >
                  <FileCode className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white/80 font-mono">
                    {file.path}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40">
                    {file.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          {preview.manifest.permissions?.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-zinc-900/50 border border-white/10">
              <h3 className="text-sm font-medium text-white mb-3">Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {preview.manifest.permissions.map((perm: string) => (
                  <span
                    key={perm}
                    className="text-xs px-2 py-1 rounded bg-primary/10 text-primary"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep("configure")}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
            >
              Back
            </button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-red-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              Create Skill
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
