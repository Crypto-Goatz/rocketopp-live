"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Sparkles } from "lucide-react"

interface AiSearchInputProps {
  onSubmit: (query: string) => void
  isProcessing: boolean
}

export default function AiSearchInput({ onSubmit, isProcessing }: AiSearchInputProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isProcessing) {
      onSubmit(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/30 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-focus-within:opacity-75"></div>
        <div className="relative flex items-center">
          <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/70 pointer-events-none" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What's your biggest challenge right now?"
            className="pl-10 pr-20 py-6 text-base rounded-xl backdrop-blur-md border-2 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0 
            dark:bg-background/20 dark:border-white/10 dark:text-white
            bg-white/80 border-primary/10 text-gray-800 shadow-[0_4px_20px_rgba(36,101,237,0.1)] dark:shadow-[0_4px_20px_rgba(var(--primary-rgb)/0.2)]"
            disabled={isProcessing}
            aria-label="Describe your challenge"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 
            bg-primary/90 hover:bg-primary backdrop-blur-md shadow-md"
            disabled={isProcessing || !query.trim()}
            aria-label="Submit challenge"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      {isProcessing && <p className="text-xs text-center mt-2 text-muted-foreground">AI is thinking...</p>}
    </form>
  )
}
