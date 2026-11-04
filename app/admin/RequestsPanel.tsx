'use client'

import { useEffect, useState } from 'react'

type Row = { id: string; created_at: string; updated_at: string; source: string; requested_by: string | null; message: string; kind: string; status: string; reply: string | null; result: string | null; ontask_task_id: string | null }

const STATUS: Record<string, string> = { new: 'bg-white/10 text-white/70', queued: 'bg-[#ff6b35]/20 text-[#ffb08f]', working: 'bg-yellow-500/20 text-yellow-200', done: 'bg-emerald-500/20 text-emerald-200', blocked: 'bg-red-500/20 text-red-200', answered: 'bg-sky-500/20 text-sky-200' }

export default function RequestsPanel() {
  const [rows, setRows] = useState<Row[]>([])
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function load() {
    try { const r = await fetch('/api/admin/requests', { credentials: 'same-origin', cache: 'no-store' }); const j = await r.json(); if (j.ok) setRows(j.requests); else setErr(j.error || `HTTP ${r.status}`) } catch (e) { setErr((e as Error).message) }
  }
  useEffect(() => { void load(); const t = setInterval(load, 20000); return () => clearInterval(t) }, [])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const m = msg.trim(); if (!m) return
    setBusy(true); setErr(null)
    try {
      const r = await fetch('/api/admin/requests', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: m }) })
      const j = await r.json()
      if (!j.ok) { setErr(j.error || `HTTP ${r.status}`); return }
      setMsg(''); setRows((prev) => [j.request, ...prev])
    } catch (e2) { setErr((e2 as Error).message) } finally { setBusy(false) }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(320px,420px)_1fr]">
      <form onSubmit={send} className="rounded-2xl border border-white/10 bg-[#141416] p-5">
        <h2 className="text-lg font-semibold">Ask the concierge</h2>
        <p className="mt-1 text-xs text-white/50">A question gets an answer now. A change becomes a job for the build agent and shows up on the right as it moves.</p>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} placeholder="e.g. Change the homepage headline to … / What pages mention HIPAA? / Draft a LinkedIn post about the free website offer" className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#ff6b35] focus:outline-none" />
        <button type="submit" disabled={busy || !msg.trim()} className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#ff6b35] text-sm font-semibold text-black disabled:opacity-50">{busy ? 'Sending…' : 'Send'}</button>
        {err ? <p className="mt-3 text-sm text-[#ff8f6b]">{err}</p> : null}
      </form>
      <div className="rounded-2xl border border-white/10 bg-[#141416] p-5">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Requests</h2><button type="button" onClick={load} className="text-xs text-white/50 hover:text-white">Refresh</button></div>
        <ul className="mt-4 divide-y divide-white/10">
          {rows.length === 0 ? <li className="py-6 text-sm text-white/40">Nothing yet.</li> : null}
          {rows.map((r) => (
            <li key={r.id} className="py-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                <span className={`rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide ${STATUS[r.status] || STATUS.new}`}>{r.status}</span>
                <span>{r.kind}</span><span>·</span><span>{r.source}{r.requested_by ? ` · ${r.requested_by}` : ''}</span><span>·</span><span>{new Date(r.created_at).toLocaleString()}</span>
                {r.ontask_task_id ? <span className="ml-auto font-mono text-[10px] text-white/40">task {r.ontask_task_id.slice(0, 8)}</span> : null}
              </div>
              <p className="mt-2 text-sm text-white">{r.message}</p>
              {r.reply ? <p className="mt-2 rounded-xl bg-black/30 px-3 py-2 text-sm text-white/80"><span className="text-white/40">Concierge: </span>{r.reply}</p> : null}
              {r.result ? <p className="mt-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100"><span className="text-emerald-300/70">Result: </span>{r.result}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
