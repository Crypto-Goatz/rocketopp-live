"use client"

import { useState, useRef, useEffect } from "react"
import {
  MessageSquare, Send, X, Minimize2, Maximize2,
  Sparkles, Fuel, Loader2, Bot, User as UserIcon
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIChatProps {
  userId: string
  initialFuel: number
}

export function AIChat({ userId, initialFuel }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [fuel, setFuel] = useState(initialFuel)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-10) // Last 10 messages for context
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setFuel(data.remainingFuel)
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error.message || "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center hover:scale-105 transition-transform z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col z-50 transition-all duration-300 ${
        isMinimized ? "w-80 h-14" : "w-96 h-[600px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
            {!isMinimized && (
              <div className="flex items-center gap-1 text-xs text-orange-400">
                <Fuel className="w-3 h-3" />
                <span>{fuel.toLocaleString()} fuel</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="text-white font-medium mb-2">How can I help?</h4>
                <p className="text-sm text-white/50">
                  Ask me anything about your account, analytics, or business.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === "user"
                      ? "bg-primary/20"
                      : "bg-gradient-to-br from-orange-500/20 to-red-500/20"
                  }`}
                >
                  {message.role === "user" ? (
                    <UserIcon className="w-4 h-4 text-primary" />
                  ) : (
                    <Bot className="w-4 h-4 text-orange-400" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-white/5 text-white/90"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-orange-400" />
                </div>
                <div className="bg-white/5 rounded-xl px-4 py-3">
                  <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={loading || fuel < 1}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading || fuel < 1}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white disabled:opacity-50 hover:from-orange-400 hover:to-red-400 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {fuel < 10 && (
              <p className="text-xs text-orange-400 mt-2 text-center">
                Low fuel! Each message costs ~1 fuel credit.
              </p>
            )}
          </form>
        </>
      )}
    </div>
  )
}
