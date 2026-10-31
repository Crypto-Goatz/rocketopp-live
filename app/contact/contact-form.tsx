"use client"

import { useState } from "react"
import { Send, CheckCircle2, Loader2, User, Mail, Phone, MessageSquare, Building } from "lucide-react"

/** The two forms this component draws: the general contact form, and the free-website consultation request. */
const COPY = {
  contact: { title: "Get in Touch", intro: "Fill out the form and we'll be in touch soon.", company: "Company", companyPh: "Acme Inc", ask: "How can we help?", askPh: "Tell us about your project, goals, or challenges you're facing...", button: "Send Message", done: "We've received your message and will get back to you within 24 hours." },
  free_website: { title: "Request your free consultation", intro: "Tell us about your business. We'll look at where you are and where you want to go, and get back to you within one business day.", company: "Business name", companyPh: "Smith Plumbing & Heating", ask: "What does your business do, and what are your goals?", askPh: "e.g. We're a 3-truck HVAC company in Greensburg. We have no website yet and want more service calls from Google...", button: "Request my free consultation", done: "We've got your request. We'll review your business and reach out within one business day to set up your free consultation." },
} as const

export function ContactForm({ form = "contact" }: { form?: keyof typeof COPY } = {}) {
  const copy = COPY[form]
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    // Honeypot — hidden from humans, bots fill it. Never shown, never required.
    // Named rk_hp (not company_website): browser autofill recognised "company_website"
    // and filled it for real people, which got Mike's own submission dropped as spam.
    rk_hp: "",
  })
  const [focused, setFocused] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Never leave someone staring at a spinner: after 25 s, say so and give them the phone and email.
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 25_000)
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, form }),
        signal: ctrl.signal,
      }).finally(() => clearTimeout(timer))

      const data = await res.json().catch(() => ({ error: `The server answered ${res.status}.` }))

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setIsSuccess(true)
    } catch (err) {
      const msg = err instanceof Error && err.name !== "AbortError" ? err.message : "That took too long to send"
      setError(`${msg} — please call (878) 888-1230 or email mike@rocketopp.com and we'll take it from there.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="p-8 md:p-12 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Thank you, {formData.name}!</h2>
        <p className="text-zinc-400 mb-6">
          {copy.done}
        </p>
        <div className="p-4 rounded-xl bg-zinc-800/50 inline-block">
          <p className="text-sm text-zinc-500">In the meantime, feel free to call</p>
          <a href="tel:+18788881230" className="text-primary font-medium hover:underline">
            +1 (878) 888-1230
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
      {/* Honeypot: off-screen (not display:none, which some bots skip), removed
          from tab order and a11y tree, autofill disabled. A filled value = bot. */}
      <input
        type="text"
        name="rk_hp"
        value={formData.rk_hp}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="new-password"
        data-lpignore="true"
        data-1p-ignore="true"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
      />
      <h2 className="text-2xl font-bold mb-2">{copy.title}</h2>
      <p className="text-zinc-500 mb-8">{copy.intro}</p>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className={`relative rounded-xl transition-all duration-300 ${focused === "name" ? "ring-2 ring-primary/50" : ""}`}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder="John Smith"
                required
                className="w-full px-4 py-4 rounded-xl bg-zinc-800/50 border border-zinc-700 focus:border-primary outline-none transition-colors text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className={`relative rounded-xl transition-all duration-300 ${focused === "email" ? "ring-2 ring-primary/50" : ""}`}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="john@company.com"
                required
                className="w-full px-4 py-4 rounded-xl bg-zinc-800/50 border border-zinc-700 focus:border-primary outline-none transition-colors text-white placeholder:text-zinc-600"
              />
            </div>
          </div>
        </div>

        {/* Phone & Company Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </label>
            <div className={`relative rounded-xl transition-all duration-300 ${focused === "phone" ? "ring-2 ring-primary/50" : ""}`}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused(null)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-4 rounded-xl bg-zinc-800/50 border border-zinc-700 focus:border-primary outline-none transition-colors text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Building className="h-4 w-4" />
              {copy.company}
            </label>
            <div className={`relative rounded-xl transition-all duration-300 ${focused === "company" ? "ring-2 ring-primary/50" : ""}`}>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                onFocus={() => setFocused("company")}
                onBlur={() => setFocused(null)}
                placeholder={copy.companyPh}
                className="w-full px-4 py-4 rounded-xl bg-zinc-800/50 border border-zinc-700 focus:border-primary outline-none transition-colors text-white placeholder:text-zinc-600"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {copy.ask} <span className="text-red-500">*</span>
          </label>
          <div className={`relative rounded-xl transition-all duration-300 ${focused === "message" ? "ring-2 ring-primary/50" : ""}`}>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocused("message")}
              onBlur={() => setFocused(null)}
              placeholder={copy.askPh}
              required
              rows={5}
              className="w-full px-4 py-4 rounded-xl bg-zinc-800/50 border border-zinc-700 focus:border-primary outline-none transition-colors text-white placeholder:text-zinc-600 resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-red-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${isSubmitting ? "opacity-0" : "opacity-100"}`}>
            {copy.button}
            <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </span>
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>

        <p className="text-xs text-zinc-600 text-center">
          By submitting this form, you agree to our{" "}
          <a href="/privacy" className="text-zinc-500 hover:text-primary transition-colors">Privacy Policy</a>
        </p>
      </div>
    </form>
  )
}
