import { getSession } from "@/lib/auth/session"
import { SupportForm } from "./SupportForm"
import { HelpCircle, MessageCircle, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Support | RocketOpp",
  description: "Get help with RocketOpp",
}

const quickLinks = [
  {
    title: "Documentation",
    description: "Browse our guides and tutorials",
    href: "/docs",
    icon: FileText,
  },
  {
    title: "FAQ",
    description: "Answers to common questions",
    href: "/faq",
    icon: HelpCircle,
  },
  {
    title: "Community",
    description: "Join our Discord community",
    href: "https://discord.gg/rocketopp",
    icon: MessageCircle,
    external: true,
  },
]

export default async function SupportPage() {
  const user = await getSession()
  if (!user) return null

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Support Center
        </h1>
        <p className="text-white/50">
          We're here to help. Send us a message and we'll get back to you within 24 hours.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <link.icon className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white group-hover:text-primary transition-colors flex items-center gap-1">
                  {link.title}
                  {link.external && <ExternalLink className="w-3 h-3" />}
                </p>
                <p className="text-xs text-white/40">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Support Form */}
      <SupportForm user={{ email: user.email, name: user.name }} />
    </div>
  )
}
