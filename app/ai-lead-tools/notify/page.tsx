import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getLeadTool } from '@/lib/lead-tools/catalog'
import { NotifyForm } from './NotifyForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Notify me — RocketOpp AI Lead Tools',
  description: 'Get notified when this AI lead tool launches. Email-only signup; you also get a 25% launch coupon.',
  robots: { index: false, follow: false },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ tool?: string }> }) {
  const sp = await searchParams
  const slug = sp?.tool || ''
  const tool = slug ? getLeadTool(slug) : null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-xl">
          <Link href="/ai-lead-tools" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> All AI Lead Tools
          </Link>

          <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-2">
            — {tool ? tool.name : 'AI Lead Tool'} · launching soon
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
            Get on the list. <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              First in, 25% off.
            </span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            {tool?.blurb || 'Drop your email — we\'ll notify you the moment this tool ships and send a 25%-off launch coupon.'}
          </p>

          <NotifyForm toolSlug={slug || 'general'} toolName={tool?.name || 'AI Lead Tools'} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
