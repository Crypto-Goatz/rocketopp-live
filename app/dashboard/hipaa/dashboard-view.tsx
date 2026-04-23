'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck, Mail, MailCheck, MailX, Loader2, Sparkles, ExternalLink, Calendar, CheckCircle2,
  FileText, Code2, Telescope, Crown, LogOut, Gift, MessageSquare, Zap, Phone,
} from 'lucide-react'
import { HipaaChatWidget } from '@/components/hipaa-chat-widget'

interface OrderRow {
  id: string
  tier: 1 | 2 | 3 | 4
  company_name: string
  status: string
  report_status: 'queued' | 'generating' | 'ready' | 'failed'
  report_view_token: string
  report_generated_at: string | null
  support_call_expires_at: string | null
  source_site: string | null
  created_at: string
  initial_email_sent_at?: string | null
  full_report_sent_at?: string | null
}

export function DashboardView() {
  const router = useRouter()
  const params = useSearchParams()
  const magic = params.get('magic') || ''

  const [state, setState] = useState<'loading' | 'signed-in' | 'signed-out'>('loading')
  const [email, setEmail] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    async function boot() {
      // Exchange magic token first if present
      if (magic) {
        try {
          const r = await fetch('/api/hipaa/magic/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: magic }),
          })
          if (r.ok) {
            // Strip ?magic= from the URL
            router.replace('/dashboard/hipaa')
          }
        } catch { /* ignore */ }
      }
      // Then check the session
      try {
        const r = await fetch('/api/hipaa/magic/verify')
        const d = await r.json()
        if (d.email) {
          setEmail(d.email); setOrders(d.orders || []); setState('signed-in')
        } else {
          setState('signed-out')
        }
      } catch {
        setState('signed-out')
      }
    }
    boot()
  }, [magic, router])

  async function sendMagic(e: React.FormEvent) {
    e.preventDefault()
    setErr(null); setSending(true)
    try {
      const r = await fetch('/api/hipaa/magic/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d?.error || 'send_failed')
      setSent(true)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'error')
    } finally { setSending(false) }
  }

  async function logout() {
    await fetch('/api/hipaa/magic/verify?logout=1', { method: 'POST' })
    setEmail(null); setOrders([]); setState('signed-out')
  }

  if (state === 'loading') {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-orange-400 animate-spin" /></div>
  }

  if (state === 'signed-out') {
    return (
      <section className="max-w-md mx-auto py-16 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400 text-xs font-semibold uppercase tracking-[0.18em] mb-5">
          <ShieldCheck className="w-3.5 h-3.5" /> RocketOpp × 0nCore
        </div>
        <h1 className="text-3xl font-bold mb-3">Your HIPAA reports</h1>
        <p className="text-sm text-muted-foreground mb-6">Enter the email you used at checkout and we&rsquo;ll send you a sign-in link.</p>
        {sent ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-2" />
            <div className="font-semibold mb-1">Check your inbox</div>
            <p className="text-sm text-muted-foreground">We sent a sign-in link to <strong>{emailInput}</strong>. It expires in 15 minutes.</p>
          </div>
        ) : (
          <form onSubmit={sendMagic} className="space-y-3">
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" required placeholder="you@yourclinic.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:border-orange-500 outline-none text-sm" />
            </div>
            {err && <div className="text-xs text-rose-400">{err}</div>}
            <button type="submit" disabled={sending || !emailInput.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold hover:opacity-90 disabled:opacity-40">
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send sign-in link'}
            </button>
          </form>
        )}
      </section>
    )
  }

  // Signed in
  const latestReady = orders.find((o) => o.report_status === 'ready')
  const chatContext = buildChatContext(email, orders)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400 text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Powered by 0nCore
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My HIPAA dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Signed in as <strong className="text-foreground">{email}</strong></p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/hipaa" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-card text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> New scan
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-card text-xs font-semibold text-muted-foreground">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </div>

      {/* Free-AI banner */}
      <div className="relative mb-6 rounded-2xl overflow-hidden border border-emerald-500/25"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.04))' }}>
        <div className="absolute h-[2px] left-0 right-0 top-0 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
        <div className="p-5 flex items-start gap-4 flex-wrap">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)', boxShadow: '0 0 20px rgba(16,185,129,0.25)' }}>
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
              <span>AI compliance assistant — free for you until the 2026 NPRM is voted in</span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-2 py-0.5 font-bold">
                <Zap className="h-3 w-3" /> Unlimited
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Ask about any finding, 45 CFR §164 rule, or 2026 NPRM change. Context-aware to
              your site. Tap the chat icon in the bottom-right corner to start.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <MessageSquare className="h-3.5 w-3.5" /> Always on
            </span>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <section className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <div className="font-medium mb-1">No reports yet</div>
          <p className="text-sm text-muted-foreground mb-5">Run a free scan to get started.</p>
          <Link href="/hipaa" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold">
            Run a free scan <ExternalLink className="w-4 h-4" />
          </Link>
        </section>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}

      {/* Always-on phone / AI voice support */}
      <div className="relative mt-6 rounded-xl border border-orange-500/25 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(245,158,11,0.03))' }}>
        <div className="absolute h-[2px] left-0 right-0 top-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-70" />
        <div className="p-5 flex items-center gap-4 flex-wrap">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#ef4444,#ff6b35,#f59e0b)', boxShadow: '0 0 20px rgba(255,107,53,0.35)' }}>
            <Phone className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-white">Stuck on anything? Our AI voice agent is live 24/7.</div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Call for answers about any finding, help reading your report, or to book a compliance strategy call —
              the AI picks up, understands HIPAA, and schedules directly into our calendar.
            </p>
          </div>
          <a href="tel:+18788881230"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#ef4444,#ff6b35)', boxShadow: '0 4px 14px -2px rgba(255,107,53,0.5)' }}>
            <Phone className="h-4 w-4" />
            +1 (878) 888-1230
          </a>
        </div>
      </div>

      {/* 0nCore ad */}
      <a href="https://0ncore.com" target="_blank" rel="noopener noreferrer"
        className="group mt-8 block rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-5 hover:border-white/20 transition-colors">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#6EE05A,#4ecb3a)', boxShadow: '0 0 14px rgba(110,224,90,0.3)' }}>
            <Zap className="h-5 w-5" style={{ color: '#080B0F' }} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Powered by 0nCore</div>
            <div className="text-sm font-semibold text-white">
              This dashboard was built in 2 hours with 0nMCP.
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Patent-pending AI orchestration. 1,554 tools, 96 services, one workflow language.
              See what's possible when you describe outcomes instead of writing code.
            </p>
          </div>
          <div className="shrink-0 text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            0ncore.com <ExternalLink className="h-3 w-3" />
          </div>
        </div>
      </a>

      {/* Scoped HIPAA chat widget — free tier for signed-in users */}
      <HipaaChatWidget
        context={chatContext}
        greeting={`Welcome back${latestReady ? '' : ''}. I'm your HIPAA assistant — scoped to your account. Ask me about any rule, any finding, or what to do next. Free while you're logged in.`}
        suggestions={[
          latestReady ? 'Walk me through my top critical finding' : 'What does the 2026 NPRM change?',
          'How do I implement MFA correctly?',
          'What evidence do I need for OCR?',
          'What are my penalty exposure tiers?',
        ]}
      />
    </div>
  )
}

function buildChatContext(
  email: string | null,
  orders: OrderRow[],
): string {
  const parts: string[] = []
  if (email) parts.push(`Logged-in user: ${email}`)
  const ready = orders.filter((o) => o.report_status === 'ready')
  if (ready.length > 0) {
    parts.push(`Active HIPAA reports (${ready.length}):`)
    for (const o of ready.slice(0, 3)) {
      parts.push(
        `  - ${o.company_name} · Tier ${o.tier} · ordered ${new Date(o.created_at).toLocaleDateString()}${o.source_site ? ' · site: ' + o.source_site : ''}`,
      )
    }
  }
  return parts.join('\n')
}

function OrderCard({ order }: { order: OrderRow }) {
  const tierIcon = order.tier === 1 ? <FileText className="w-4 h-4" /> : order.tier === 2 ? <Code2 className="w-4 h-4" /> : order.tier === 3 ? <Telescope className="w-4 h-4" /> : <Crown className="w-4 h-4" />
  const tierName = ['', 'Current HIPAA', 'Developer Fix Kit', '+ 2026 NPRM', 'Full Compliance'][order.tier]
  const isReady = order.report_status === 'ready'
  const daysLeft = order.support_call_expires_at ? Math.max(0, Math.ceil((new Date(order.support_call_expires_at).getTime() - Date.now()) / 86400000)) : 0
  const viewUrl = `/hipaa/reports/${order.id}?t=${encodeURIComponent(order.report_view_token)}`
  const bookUrl = `/hipaa/book-call?order=${order.id}`

  const emailConfirmFired = Boolean(order.initial_email_sent_at)
  const emailReadyFired = Boolean(order.full_report_sent_at)

  return (
    <article className="rounded-xl border border-border bg-card p-5 hover:border-foreground/25 transition-colors">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white shrink-0">{tierIcon}</div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <div className="font-semibold">{order.company_name}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tier {order.tier} · {tierName}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              Ordered {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {order.source_site && ` · ${order.source_site}`}
              {isReady ? ' · Report ready' : ' · Report ' + order.report_status}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isReady ? (
            <a href={viewUrl} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-semibold">
              Open interactive report <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating
            </span>
          )}
          {order.support_call_expires_at && daysLeft > 0 && (
            <a href={bookUrl} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/5 text-emerald-400 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" /> Book call ({daysLeft}d left)
            </a>
          )}
        </div>
      </div>

      {/* Email delivery status + fallback hint */}
      <div className="mt-4 flex items-center gap-2 flex-wrap text-[11px]">
        <EmailBadge label="Confirmation" sentAt={order.initial_email_sent_at || null} fired={emailConfirmFired} />
        {isReady && (
          <EmailBadge label="Report ready" sentAt={order.full_report_sent_at || null} fired={emailReadyFired} />
        )}
        {isReady && (
          <a
            href={viewUrl}
            className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            <MailX className="w-3 h-3" /> Didn't get the email? Open report here →
          </a>
        )}
      </div>
    </article>
  )
}

function EmailBadge({ label, sentAt, fired }: { label: string; sentAt: string | null; fired: boolean }) {
  if (!fired) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-rose-500/25 bg-rose-500/5 text-rose-300">
        <MailX className="w-3 h-3" /> {label} · not sent
      </span>
    )
  }
  const when = sentAt ? new Date(sentAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-emerald-500/25 bg-emerald-500/5 text-emerald-300">
      <MailCheck className="w-3 h-3" /> {label} sent{when ? ` · ${when}` : ''}
    </span>
  )
}
