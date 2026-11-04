export default function AdminNav({ email, name, via }: { email: string; name?: string; via: string }) {
  return (
    <header className="border-b border-white/10 bg-[#141416]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <nav className="flex items-center gap-4 text-sm">
          <a href="/admin" className="font-semibold text-white">RocketOpp · Admin</a>
          <a href="/admin/serp" className="text-white/60 hover:text-white">SERP</a>
        </nav>
        <div className="flex items-center gap-3 text-xs text-white/50">
          <span>{name ? `${name} · ` : ''}{email} <span className="opacity-60">({via === 'crm-link' ? 'via CRM' : 'via 0n3'})</span></span>
          <a href="/api/admin/auth/logout" className="rounded-full border border-white/15 px-3 py-1 hover:bg-white/5">Sign out</a>
        </div>
      </div>
    </header>
  )
}
