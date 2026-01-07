"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Target, Sparkles, Loader2, CheckCircle, XCircle,
  AlertCircle, Fuel, Globe, FileText
} from "lucide-react"

interface AnalysisResult {
  score: number
  title: { status: string; message: string; value?: string }
  meta: { status: string; message: string; value?: string }
  headings: { status: string; message: string; count?: number }
  keywords: { status: string; message: string; density?: number }
  readability: { status: string; message: string; grade?: string }
  links: { status: string; message: string; internal?: number; external?: number }
  images: { status: string; message: string; withAlt?: number; total?: number }
  suggestions: string[]
}

export default function SEOAnalyzerPage() {
  const [input, setInput] = useState("")
  const [inputType, setInputType] = useState<"url" | "content">("url")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleAnalyze = async () => {
    if (!input.trim()) return

    setAnalyzing(true)
    setResult(null)

    // Simulate AI analysis (replace with actual API call)
    await new Promise(r => setTimeout(r, 2500))

    // Mock result
    setResult({
      score: 72,
      title: {
        status: "good",
        message: "Title tag is well-optimized",
        value: "Your Page Title (55 characters)"
      },
      meta: {
        status: "warning",
        message: "Meta description could be longer",
        value: "Current description is 120 characters. Aim for 150-160."
      },
      headings: {
        status: "good",
        message: "Good heading structure",
        count: 8
      },
      keywords: {
        status: "good",
        message: "Primary keyword density is optimal",
        density: 2.3
      },
      readability: {
        status: "warning",
        message: "Some sentences are too long",
        grade: "Grade 9"
      },
      links: {
        status: "good",
        message: "Good internal linking",
        internal: 12,
        external: 4
      },
      images: {
        status: "error",
        message: "Some images missing alt text",
        withAlt: 5,
        total: 8
      },
      suggestions: [
        "Add alt text to all images for better accessibility and SEO",
        "Consider adding more internal links to related content",
        "Break up longer paragraphs for better readability",
        "Add schema markup for rich snippets"
      ]
    })

    setAnalyzing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/tools"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target className="w-6 h-6 text-green-400" />
            SEO Analyzer
          </h1>
          <p className="text-white/60 mt-1">
            Analyze and optimize your content for search engines
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-lg">
          <Fuel className="w-4 h-4" />
          15 fuel per analysis
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-8">
        {/* Input Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputType("url")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              inputType === "url"
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <Globe className="w-4 h-4" />
            Analyze URL
          </button>
          <button
            onClick={() => setInputType("content")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              inputType === "content"
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <FileText className="w-4 h-4" />
            Analyze Content
          </button>
        </div>

        {/* Input */}
        {inputType === "url" ? (
          <input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/your-page"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
          />
        ) : (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your content here to analyze..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
          />
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!input.trim() || analyzing}
          className="mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze SEO
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {analyzing && (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-green-400 mx-auto mb-4" />
          <p className="text-white/60">Analyzing your content...</p>
        </div>
      )}

      {result && !analyzing && (
        <div className="space-y-6">
          {/* Score */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 text-center">
            <p className="text-white/60 mb-2">Overall SEO Score</p>
            <p className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}
            </p>
            <p className="text-sm text-white/40 mt-2">out of 100</p>
          </div>

          {/* Analysis Items */}
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(result)
              .filter(([key]) => !["score", "suggestions"].includes(key))
              .map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 rounded-xl bg-zinc-900/50 border border-white/10"
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon((value as any).status)}
                    <div>
                      <h3 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                      <p className="text-sm text-white/60 mt-1">{(value as any).message}</p>
                      {(value as any).value && (
                        <p className="text-xs text-white/40 mt-1">{(value as any).value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Suggestions */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-400" />
              Improvement Suggestions
            </h3>
            <ul className="space-y-3">
              {result.suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-3 text-white/70">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm flex-shrink-0">
                    {i + 1}
                  </span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
