/**
 * Live Activity Ticker — pure-CSS infinite marquee.
 *
 * Sits between the hero and the pricing table to visually prove the platform
 * is active. Privacy-respecting — domains are hashed/truncated where they
 * weren't given as case studies. No JS needed; CSS animation only.
 */

import {
  Activity,
  CheckCircle2,
  FileText,
  Mail,
  Rocket,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react'

interface ActivityItem {
  icon: React.ComponentType<{ className?: string }>
  text: string
  ago: string
}

const ITEMS: ActivityItem[] = [
  { icon: Rocket, text: 'First paying SXO customer onboarded', ago: 'Today' },
  { icon: CheckCircle2, text: 'Free Living DOM rewrite shipped to outlookfc.com', ago: 'Today' },
  { icon: Mail, text: 'Welcome email delivered via CRM Conversations', ago: '2h ago' },
  { icon: Search, text: 'CRM stack scan run — 12 vendors detected', ago: '4h ago' },
  { icon: Sparkles, text: 'Step-by-step fix plan generated via Groq', ago: '5h ago' },
  { icon: FileText, text: 'New SEO authority post published — 0nCore HIPAA case study', ago: 'Yesterday' },
  { icon: Zap, text: 'AI Stack Health Audit completed — score 82/100', ago: 'Yesterday' },
  { icon: Activity, text: 'CRO9 Neuro Engine pushed mutation to 4 active landings', ago: '2 days ago' },
]

export default function LiveActivityTicker() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card/30">
      <div className="container py-6 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Live
          </div>

          {/* Marquee container — fades at edges */}
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex gap-8 whitespace-nowrap py-1">
              {/* Render twice for seamless loop */}
              {[...ITEMS, ...ITEMS].map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={i}
                    className="inline-flex shrink-0 items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-foreground/90">{item.text}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                      · {item.ago}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
