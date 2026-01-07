"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Rocket, Mail, Lock, User, Loader2, ArrowRight, Eye, EyeOff, CheckCircle2, Zap, Users, TrendingUp } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const passwordRequirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(password), text: "One uppercase letter" },
    { met: /[0-9]/.test(password), text: "One number" }
  ]

  const isPasswordValid = passwordRequirements.every(req => req.met)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPasswordValid) {
      setError("Please meet all password requirements")
      return
    }

    if (!firstName.trim()) {
      setError("First name is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10" />

        {/* Animated Orbs */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-red-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-orange-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">RocketOpp</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white mt-8 mb-4">
            Join the
            <span className="block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Rocket Revolution
            </span>
          </h1>

          <p className="text-lg text-zinc-400 mb-12 max-w-md">
            Start building your business with AI-powered tools. No coding required.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10">
              <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">50+</div>
              <p className="text-xs text-zinc-500">AI Tools</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10">
              <Users className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1k+</div>
              <p className="text-xs text-zinc-500">Users</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">10k+</div>
              <p className="text-xs text-zinc-500">Tasks Done</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <p className="text-zinc-300 italic mb-4">
              &ldquo;RocketOpp transformed how we handle leads. The AI tools save us hours every single day.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
              <div>
                <p className="text-white font-medium text-sm">James Davidson</p>
                <p className="text-zinc-500 text-xs">Growth Marketing Agency</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">RocketOpp</span>
            </div>
          </div>

          {/* Register Card */}
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
              <p className="text-zinc-400">Get 100 free Fuel credits to start</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-zinc-300 mb-2">
                    First name <span className="text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-zinc-300 mb-2">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Email <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                  Password <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password requirements */}
                {password && (
                  <div className="mt-3 space-y-1">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${req.met ? 'text-green-400' : 'text-zinc-600'}`} />
                        <span className={req.met ? 'text-green-400' : 'text-zinc-500'}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms */}
              <p className="text-xs text-zinc-500">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-orange-400 hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-orange-400 hover:underline">Privacy Policy</Link>.
              </p>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !isPasswordValid || !firstName.trim()}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold shadow-lg shadow-orange-500/25 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-zinc-900/80 text-zinc-500">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <Button
              variant="outline"
              className="w-full h-12 bg-transparent border-white/10 hover:bg-white/5 hover:border-orange-500/30 text-white transition-all"
              asChild
            >
              <Link href="/login">
                Sign in instead
              </Link>
            </Button>
          </div>

          {/* Back to Home */}
          <p className="text-center mt-6 text-zinc-500 text-sm">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              &larr; Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
