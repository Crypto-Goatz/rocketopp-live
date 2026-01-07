"use client"

import { MessageSquare, Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function MessagesPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
          <MessageSquare className="w-10 h-10 text-orange-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Message Center</h1>
        <p className="text-white/60 mb-6">
          Direct communication with your account manager and team.
          AI-assisted responses and smart notifications coming soon.
        </p>
        <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 mb-6">
          <div className="flex items-center justify-center gap-2 text-orange-400 text-sm font-medium">
            <Rocket className="w-4 h-4" />
            Launching Soon
          </div>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          Back to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
