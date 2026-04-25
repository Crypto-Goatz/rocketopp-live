import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowUpRight, ArrowLeft, Lock, Check, Sparkles, FileText,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getProduct, PRODUCTS } from '@/lib/shop/products'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = getProduct(slug)
  if (!p) return { title: 'Product not found · RocketOpp Shop' }
  return {
    title: `${p.name} — ${p.priceLabel}${p.recurring ? `/${p.recurring}` : ''} · RocketOpp Shop`,
    description: p.blurb,
    alternates: { canonical: `https://rocketopp.com/shop/${p.slug}` },
    openGraph: {
      title: `${p.name} — ${p.priceLabel}${p.recurring ? `/${p.recurring}` : ''}`,
      description: p.blurb,
      url: `https://rocketopp.com/shop/${p.slug}`,
    },
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
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> All products
          </Link>

          {/* Hero image — Gamma-generated, full-bleed band before content */}
          {product.imageUrl && (
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border/60 mb-10 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>
          )}

          {/* Hero */}
          <div className="grid lg:grid-cols-[1fr,360px] gap-10 items-start">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                {product.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-orange-500/30 bg-orange-500/10 text-orange-400">
                    {product.badge}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{product.name}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{product.blurb}</p>

              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">— What's included</h2>
              <ul className="space-y-2.5 mb-10">
                {product.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {product.faqs.length > 0 && (
                <>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">— FAQ</h2>
                  <div className="space-y-2 mb-8">
                    {product.faqs.map((f) => (
                      <details key={f.q} className="rounded-xl border border-border/60 bg-card/30 px-4 py-3 group">
                        <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold">
                          {f.q}
                          <span className="text-muted-foreground transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                        </summary>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </>
              )}

              {product.gammaUrl && (
                <a
                  href={product.gammaUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/15 text-sm font-semibold mt-2"
                >
                  <FileText className="w-4 h-4" /> View pitch deck <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Sticky pricing card */}
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">— Price (locked-in)</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black tracking-tight">{product.priceLabel}</span>
                  {product.recurring && <span className="text-base text-muted-foreground">/{product.recurring}</span>}
                </div>
                <div className="text-xs text-muted-foreground font-mono mb-5">{product.delivery}</div>

                <Link
                  href={`/onboarding/${product.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm hover:brightness-110 transition"
                >
                  {product.ctaLabel} <ArrowUpRight className="w-4 h-4" />
                </Link>

                <div className="mt-5 p-3 rounded-lg border border-orange-500/20 bg-orange-500/5 flex gap-3">
                  <Lock className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="text-[12px] text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Price-lock</strong> — onboarding can only adjust this <em className="text-foreground">downward</em>. Bring brand + content upfront and the price drops.
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg border border-border/60 bg-card/30 flex gap-3">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-[12px] text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">AI builder</strong> — onboarding is conducted by 0n. Step-by-step style, color, logo, and content choices.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
