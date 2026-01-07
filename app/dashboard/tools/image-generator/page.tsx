"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Image as ImageIcon, Sparkles, Loader2, Download,
  Fuel, Grid, Square, RectangleHorizontal
} from "lucide-react"

const styles = [
  { id: "realistic", label: "Realistic", preview: "Photo-like images" },
  { id: "illustration", label: "Illustration", preview: "Hand-drawn style" },
  { id: "3d", label: "3D Render", preview: "3D graphics style" },
  { id: "anime", label: "Anime", preview: "Anime/manga style" },
  { id: "abstract", label: "Abstract", preview: "Abstract art" },
  { id: "minimalist", label: "Minimalist", preview: "Clean, simple" },
]

const sizes = [
  { id: "square", label: "Square", icon: Square, dimensions: "1024x1024" },
  { id: "landscape", label: "Landscape", icon: RectangleHorizontal, dimensions: "1792x1024" },
  { id: "portrait", label: "Portrait", icon: RectangleHorizontal, dimensions: "1024x1792", rotate: true },
]

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("realistic")
  const [size, setSize] = useState("square")
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setGenerating(true)
    setResult(null)

    // Simulate AI generation (replace with actual API call)
    await new Promise(r => setTimeout(r, 3000))

    // Mock result - placeholder image
    setResult("https://via.placeholder.com/512x512/1a1a2e/ff6b35?text=AI+Generated+Image")

    setGenerating(false)
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
            <ImageIcon className="w-6 h-6 text-blue-400" />
            AI Image Generator
          </h1>
          <p className="text-white/60 mt-1">
            Create stunning visuals with AI
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-lg">
          <Fuel className="w-4 h-4" />
          25 fuel per generation
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Describe your image
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city skyline at sunset with flying cars..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {styles.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    style === s.id
                      ? "bg-blue-500/20 border-2 border-blue-500/50 text-white"
                      : "bg-white/5 border-2 border-transparent text-white/70 hover:bg-white/10"
                  }`}
                >
                  <div className="font-medium text-sm">{s.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{s.preview}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Size
            </label>
            <div className="flex gap-2">
              {sizes.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    size === s.id
                      ? "bg-blue-500/20 border-2 border-blue-500/50 text-white"
                      : "bg-white/5 border-2 border-transparent text-white/70 hover:bg-white/10"
                  }`}
                >
                  <s.icon className={`w-6 h-6 ${s.rotate ? "rotate-90" : ""}`} />
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-white/40">{s.dimensions}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Image
              </>
            )}
          </button>
        </div>

        {/* Result */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-white">
              Generated Image
            </label>
            {result && (
              <a
                href={result}
                download
                className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            )}
          </div>
          <div className="aspect-square rounded-xl bg-zinc-900/50 border border-white/10 overflow-hidden flex items-center justify-center">
            {generating ? (
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-3" />
                <p className="text-white/60">Creating your image...</p>
                <p className="text-sm text-white/40 mt-1">This may take a moment</p>
              </div>
            ) : result ? (
              <img
                src={result}
                alt="Generated image"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-white/40">
                <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p>Your generated image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
