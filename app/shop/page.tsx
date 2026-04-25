import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Lock, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PRODUCTS, CATEGORY_LABELS, productsByCategory, type ShopProduct, type ProductCategory } from '@/lib/shop/products'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop — RocketOpp · AI builds, HIPAA, web, marketing',
  description: 'The full RocketOpp catalog. Free Apex Assessment, HIPAA compliance scans, custom AI builds, SaaS platforms, and recurring marketing. Lock in advertised prices through guided AI onboarding.',
  alternates: { canonical: 'https://rocketopp.com/shop' },
  openGraph: {
    title: 'Shop — RocketOpp',
    description: 'AI builds, HIPAA scans, web, marketing — locked-in pricing through guided onboarding.',
    url: 'https://rocketopp.com/shop',
    type: 'website',
    images: [{ url: 'https://rocketopp.com/images/rocketopp-og.png', width: 1200, height: 630, alt: 'RocketOpp Shop' }],
  },
}

const CATEGORY_ORDER: ProductCategory[] = ['assessment', 'compliance', 'ai', 'saas', 'web', 'marketing']

export default function ShopPage() {
  const grouped = productsByCategory()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3 h-3" /> RocketOpp Shop
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Lock in the price. <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Onboard with AI.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed">
            Every product on this page is priced as advertised. Click <strong className="text-foreground">Buy Now</strong>, and the AI onboarding flow walks you through style, brand, and content step by step — locking in the price you see right now. The more you bring upfront, the more we discount.
          </p>
        </section>

        {/* Lock-in callout */}
        <section className="container mx-auto px-4 mb-14">
          <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent p-6 md:p-7 flex items-start md:items-center gap-4 flex-col md:flex-row">
            <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">Price-Lock Guarantee</div>
              <div className="text-base">
                <strong>The price you see is the price you pay.</strong> Onboarding can only adjust it{' '}
                <em className="text-foreground">downward</em> — for upfront content, brand assets, or longer commitments.
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <div className="container mx-auto px-4 space-y-16">
          {CATEGORY_ORDER.map((cat) => {
            const items = grouped[cat]
            if (!items?.length) return null
            return (
              <section key={cat}>
                <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{CATEGORY_LABELS[cat]}</h2>
                  <span className="text-xs text-muted-foreground font-mono">{items.length} {items.length === 1 ? 'product' : 'products'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((p) => <ProductCard key={p.slug} product={p} />)}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ProductCard({ product }: { product: ShopProduct }) {
  const Icon = product.icon
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative block rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Hero — Gamma-generated AI image, fades into card body at the bottom */}
      {product.imageUrl ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          {product.badge && (
            <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border backdrop-blur-md ${
              product.badge === 'Free'        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300' :
              product.badge === 'Best seller' ? 'border-orange-500/40 bg-orange-500/20 text-orange-300'   :
              product.badge === 'New'         ? 'border-violet-500/40 bg-violet-500/20 text-violet-200'   :
                                                'border-cyan-500/40 bg-cyan-500/20 text-cyan-200'
            }`}>{product.badge}</span>
          )}
        </div>
      ) : (
        <div className={`relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br ${product.gradient}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-12 h-12 text-white/40" />
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-9 h-9 -mt-7 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-lg shrink-0 ring-2 ring-card`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors flex-1 min-w-0 leading-snug">
            {product.name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{product.tagline}</p>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-black tracking-tight">
              {product.priceLabel}
              {product.recurring && <span className="text-sm font-medium text-muted-foreground">/{product.recurring}</span>}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{product.delivery}</div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
            Buy now <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
