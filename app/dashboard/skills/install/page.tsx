"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Link as LinkIcon, Upload, Shield, AlertTriangle,
  CheckCircle, Loader2, FileJson, Globe
} from "lucide-react"

export default function InstallSkillPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"url" | "file">("url")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleUrlInstall = async () => {
    if (!url.trim()) {
      setError("Please enter a skill URL")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/skills/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceUrl: url }),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/dashboard/skills/${data.installation.id}`)
        }, 1500)
      } else {
        setError(data.error || "Failed to install skill")
      }
    } catch (err) {
      setError("Failed to install skill. Please check the URL and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const content = await file.text()
      const manifest = JSON.parse(content)

      // For now, we'll just validate the manifest
      if (!manifest.name || !manifest.slug || !manifest.version) {
        setError("Invalid manifest: missing required fields (name, slug, version)")
        return
      }

      setError("File upload installation coming soon. Please use URL installation for now.")
    } catch (err) {
      setError("Failed to parse skill file. Please ensure it's valid JSON.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/skills"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Install Custom Skill</h1>
          <p className="text-white/60 mt-1">
            Install a skill from a URL or upload a skill file
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl mb-8 border border-white/10">
        <button
          onClick={() => setMode("url")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
            mode === "url"
              ? "bg-white/10 text-white"
              : "text-white/50 hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          Install from URL
        </button>
        <button
          onClick={() => setMode("file")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
            mode === "file"
              ? "bg-white/10 text-white"
              : "text-white/50 hover:text-white"
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>

      {/* Success State */}
      {success ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Skill Installed Successfully!
          </h3>
          <p className="text-white/50">Redirecting to configuration...</p>
        </div>
      ) : mode === "url" ? (
        /* URL Installation */
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Skill Manifest URL
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/skill.json"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
              />
            </div>
            <p className="text-xs text-white/40 mt-2">
              Enter the URL to a skill.json manifest file
            </p>
          </div>

          {/* Warning */}
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-400">
                  Security Notice
                </p>
                <p className="text-sm text-yellow-400/70 mt-1">
                  Only install skills from trusted sources. Skills have access to
                  various system resources based on their declared permissions.
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Install Button */}
          <button
            onClick={handleUrlInstall}
            disabled={loading || !url.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-red-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Installing...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Install Skill
              </>
            )}
          </button>
        </div>
      ) : (
        /* File Upload */
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Skill File
            </label>
            <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-white/20 hover:border-primary/50 bg-white/5 cursor-pointer transition-all">
              <FileJson className="w-12 h-12 text-white/30 mb-3" />
              <p className="text-sm text-white/60 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-white/40">skill.json (max 1MB)</p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Warning */}
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-400">
                  Security Notice
                </p>
                <p className="text-sm text-yellow-400/70 mt-1">
                  Only install skills from trusted sources. The skill file will be
                  validated before installation.
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 p-6 rounded-2xl bg-zinc-900/50 border border-white/10">
        <h3 className="font-semibold text-white mb-3">Creating a Skill</h3>
        <p className="text-sm text-white/60 mb-4">
          Skills are defined by a manifest file (skill.json) that describes the skill&apos;s
          capabilities, permissions, and configuration options.
        </p>
        <pre className="p-4 rounded-lg bg-black/50 text-xs text-white/70 overflow-x-auto">
{`{
  "name": "My Custom Skill",
  "slug": "my-custom-skill",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "A brief description",
  "permissions": ["api:read", "database:custom_*"],
  "onboarding": [
    {
      "field": "api_key",
      "label": "API Key",
      "type": "password",
      "required": true
    }
  ]
}`}
        </pre>
      </div>
    </div>
  )
}
