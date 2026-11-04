import type { Metadata } from 'next'
import { readSession } from '@/lib/admin/auth'
import AdminSignIn from './AdminSignIn'
import AdminNav from './AdminNav'

/**
 * /admin — the owner's dashboard. NOINDEX (metadata + X-Robots-Tag from middleware
 * + robots.txt), United States only (middleware answers 404 elsewhere), and a signed
 * session (Sign in with 0n3, or the CRM custom-menu link). No session → sign-in screen.
 */
export const metadata: Metadata = {
  title: 'RocketOpp — Admin',
  robots: { index: false, follow: false, nocache: true, noarchive: true, nosnippet: true, googleBot: { index: false, follow: false, noimageindex: true } },
}
export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession()
  if (!session) return <AdminSignIn />
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <AdminNav email={session.email} name={session.name} via={session.via} />
      {children}
    </div>
  )
}
