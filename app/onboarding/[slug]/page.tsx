import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Lock, Sparkles, Workflow, Bot } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getProduct, PRODUCTS } from '@/lib/shop/products'
import { OnboardingLockIn } from './LockInForm'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = getProduct(slug)
  if (!p) return { title: 'Onboarding · RocketOpp' }
  return {
    title: `Onboarding — ${p.name} · ${p.priceLabel}${p.recurring ? `/${p.recurring}` : ''}`,
    description: `Lock in ${p.priceLabel}${p.recurring ? `/${p.recurring}` : ''} for ${p.name}. AI-guided setup. The more you bring upfront, the lower the final price.`,
    robots: { index: false, follow: false },
  }
}

export async function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const Icon = product.icon

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href={`/shop/${product.slug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {product.name}
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400">— Onboarding</div>
              <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
            </div>
          </div>

          {/* Locked-in price */}
          <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent p-6 mb-8">
            <div className="flex items-start gap-3 mb-3">
              <Lock className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">Price locked</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight">{product.priceLabel}</span>
                  {product.recurring && <span className="text-sm text-muted-foreground">/{product.recurring}</span>}
                  <span className="text-xs text-muted-foreground font-mono ml-2">· {product.delivery}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  This is the most you'll pay. Onboarding can only adjust the price{' '}
                  <em className="text-foreground">downward</em> — for upfront brand assets, content, or longer commitments.
                </p>
              </div>
            </div>
          </div>

          {/* What's coming + email capture */}
          <h2 className="text-xl font-bold tracking-tight mb-3">What happens next</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            The 0n AI builder walks you through a step-by-step setup — style, colors, logo upload, copy, integrations — and locks in your final price as you go. While we put the finishing touches on the live wizard, drop your email and we'll start your onboarding within 1 business hour.
          </p>

          {/* Three-step preview */}
          <div className="grid md:grid-cols-3 gap-3 mb-10">
            <Step n={1} icon={<Sparkles className="w-4 h-4" />} title="Brand + style" body="Pick a vibe, upload logos, choose colors. ~5 min." />
            <Step n={2} icon={<Workflow className="w-4 h-4" />} title="Content + integrations" body="Drop in copy, photos, CRM + email keys. ~10 min." />
            <Step n={3} icon={<Bot className="w-4 h-4" />} title="0n builds + ships" body="The agent assembles, deploys, and reports back." />
          </div>

          <OnboardingLockIn product={{ slug: product.slug, name: product.name, priceLabel: product.priceLabel, priceCents: product.priceCents, recurring: product.recurring }} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Step({ n, icon, title, body }: { n: number; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-mono font-bold text-muted-foreground">0{n}</span>
        <span className="text-orange-400">{icon}</span>
      </div>
      <div className="text-sm font-semibold mb-1">{title}</div>
      <div className="text-xs text-muted-foreground leading-relaxed">{body}</div>
    </div>
  )
}
