import RequestsPanel from './RequestsPanel'

export const dynamic = 'force-dynamic'

export default function AdminHome() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-white/60">Private to the admin list. Not indexed, United States only. Ask for a website or marketing change here, or text the concierge number in the CRM — same queue, same agent.</p>
      <div className="mt-8">
        <RequestsPanel />
      </div>
      <p className="mt-6 text-xs text-white/40">Built on 0n3 · concierge passthrough · proof run 2026-11-03</p>
    </main>
  )
}
