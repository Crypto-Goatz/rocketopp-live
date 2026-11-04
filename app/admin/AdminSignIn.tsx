'use client'

import { useState } from 'react'

function readUrl(): { err: string | null; next: string } {
  try {
    if (typeof window === 'undefined') return { err: null, next: '/admin' }
    const u = new URL(window.location.href)
    const e = u.searchParams.get('error')
    const err = e === 'signin' ? 'That sign-in was not accepted. Use the account that is on the admin list.' : e === 'link' ? 'That link is not valid any more. Open the dashboard from the CRM menu again, or sign in.' : null
    return { err, next: u.pathname.startsWith('/admin') ? u.pathname : '/admin' }
  } catch { return { err: null, next: '/admin' } }
}

export default function AdminSignIn() {
  const [{ err, next }] = useState(readUrl)
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b0d] px-5 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#141416] p-8 shadow-2xl">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#ff6b35]">RocketOpp</p>
        <h1 className="mt-2 text-2xl font-semibold">Owner dashboard</h1>
        <p className="mt-2 text-sm text-white/60">Sign in with the account on the admin list. Nothing here is public.</p>
        <a href={`/api/admin/auth/0n3/start?next=${encodeURIComponent(next)}`} className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#ff6b35] text-sm font-semibold text-black transition hover:opacity-90">
          Sign in with 0n3
        </a>
        {err ? <p className="mt-4 text-sm text-[#ff8f6b]">{err}</p> : null}
        <p className="mt-6 text-xs text-white/40">Inside the CRM, open <b>Dashboard</b> from the left menu and you land here already signed in.</p>
      </div>
    </main>
  )
}
