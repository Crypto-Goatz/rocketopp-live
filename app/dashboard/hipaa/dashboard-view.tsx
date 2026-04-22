'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck, Mail, Loader2, Sparkles, ExternalLink, Calendar, CheckCircle2,
  FileText, Code2, Telescope, Crown, LogOut,
} from 'lucide-react'

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
  const active = orders.filter((o) => o.report_status === 'ready' || o.report_status === 'generating')
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400 text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Powered by 0nCore
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My HIPAA reports</h1>
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
    </div>
  )
}

function OrderCard({ order }: { order: OrderRow }) {
  const tierIcon = order.tier === 1 ? <FileText className="w-4 h-4" /> : order.tier === 2 ? <Code2 className="w-4 h-4" /> : order.tier === 3 ? <Telescope className="w-4 h-4" /> : <Crown className="w-4 h-4" />
  const tierName = ['', 'Current HIPAA', 'Developer Fix Kit', '+ 2026 NPRM', 'Full Compliance'][order.tier]
  const isReady = order.report_status === 'ready'
  const daysLeft = order.support_call_expires_at ? Math.max(0, Math.ceil((new Date(order.support_call_expires_at).getTime() - Date.now()) / 86400000)) : 0
  const viewUrl = `/hipaa/reports/${order.id}?t=${encodeURIComponent(order.report_view_token)}`
  const bookUrl = `/hipaa/book-call?order=${order.id}`

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
              Open report <ExternalLink className="w-3.5 h-3.5" />
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
    </article>
  )
}
