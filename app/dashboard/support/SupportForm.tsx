"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Send, Loader2, CheckCircle, MessageSquare, Bug, Lightbulb, HelpCircle
} from "lucide-react"

const categories = [
  { id: 'question', label: 'General Question', icon: HelpCircle, description: 'Ask about features or how to use RocketOpp' },
  { id: 'bug', label: 'Bug Report', icon: Bug, description: 'Report something that isn\'t working correctly' },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, description: 'Suggest a new feature or improvement' },
  { id: 'billing', label: 'Billing & Account', icon: MessageSquare, description: 'Questions about your subscription or account' },
]

interface SupportFormProps {
  user: {
    email: string
    name?: string | null
  }
}

export function SupportForm({ user }: SupportFormProps) {
  const [category, setCategory] = useState<string>('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('normal')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!category) {
      setError('Please select a category')
      return
    }

    setSending(true)
    setError(null)

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          subject,
          message,
          priority,
          user_email: user.email,
          user_name: user.name,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSending(false)
    }
  }

  if (success) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
        <p className="text-white/60 mb-6 max-w-md mx-auto">
          Thank you for reaching out. Our support team will review your message and get back to you within 24 hours.
        </p>
        <Button onClick={() => {
          setSuccess(false)
          setCategory('')
          setSubject('')
          setMessage('')
        }}>
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Selection */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">What can we help you with?</h2>

        <div className="grid sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                category === cat.id
                  ? 'bg-primary/10 border-primary/50'
                  : 'bg-black/30 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  category === cat.id ? 'bg-primary/20' : 'bg-white/5'
                }`}>
                  <cat.icon className={`w-5 h-5 ${category === cat.id ? 'text-primary' : 'text-white/40'}`} />
                </div>
                <div>
                  <p className={`font-medium ${category === cat.id ? 'text-primary' : 'text-white'}`}>
                    {cat.label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{cat.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Details */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">Tell us more</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your request"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide as much detail as possible. Include steps to reproduce if reporting a bug."
              rows={6}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            >
              <option value="low">Low - Not urgent</option>
              <option value="normal">Normal - Can wait a day or two</option>
              <option value="high">High - Affecting my work</option>
              <option value="urgent">Urgent - Business critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Info (Read-only) */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">Your Contact Info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Name</label>
            <input
              type="text"
              value={user.name || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/5 text-white/50 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/5 text-white/50 cursor-not-allowed"
            />
          </div>
        </div>
        <p className="text-xs text-white/30 mt-2">We'll respond to your account email</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={sending} size="lg">
          {sending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
