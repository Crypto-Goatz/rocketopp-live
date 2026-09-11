'use client'

/**
 * Service Recommendation Engine — /recommend
 *
 * A 3-step interactive funnel:
 *   1. NEED    — tag-cloud of common business pains (pick one)
 *   2. ISSUES  — the symptoms behind that pain (glowing multi-select)
 *   3. RESULT  — AI-ranked recommended services at 20% off, add to cart,
 *                then lock the offer with a 25% deposit.
 *
 * The 20% discount is attached to each cart item (sticks through checkout);
 * the deposit route re-derives + clamps it server-side.
 */

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  ShieldCheck,
  Sparkles,
  ShoppingCart,
  Lock,
} from 'lucide-react'
import Footer from '@/components/footer'
import { SectionBg } from '@/components/section-bg'
import { PRODUCTS, getProduct, type Product } from '@/lib/store/products'
import { useCartStore } from '@/lib/store/cart-store'
import {
  NEEDS,
  RECOMMEND_DISCOUNT_PCT,
  DEPOSIT_PCT,
  type Need,
} from '@/lib/recommend/issue-map'

const DISCOUNT = RECOMMEND_DISCOUNT_PCT / 100

function formatUsd(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function discountedCents(p: Product): number {
  return Math.round(p.priceCents * (1 - DISCOUNT))
}

/** Tag-cloud font sizing from a need's weight (1–5). */
function needSize(weight: number): string {
  return (
    {
      5: 'text-2xl md:text-4xl',
      4: 'text-xl md:text-3xl',
      3: 'text-lg md:text-2xl',
      2: 'text-base md:text-xl',
      1: 'text-sm md:text-lg',
    }[weight] || 'text-lg md:text-2xl'
  )
}

type Step = 'need' | 'issues' | 'result'

export default function RecommendPage() {
  const [step, setStep] = useState<Step>('need')
  const [need, setNeed] = useState<Need | null>(null)
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [recSlugs, setRecSlugs] = useState<string[]>([])
  const [rationale, setRationale] = useState('')
  const [included, setIncluded] = useState<Set<string>>(new Set())

  const addItem = useCartStore((s) => s.addItem)
  const openDrawer = useCartStore((s) => s.openDrawer)

  const [email, setEmail] = useState('')
  const [depositLoading, setDepositLoading] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pickNeed = (n: Need) => {
    setNeed(n)
    setSelectedIssues([])
    setStep('issues')
  }

  const toggleIssue = (id: string) => {
    setSelectedIssues((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    )
  }

  const goToResults = async () => {
    if (selectedIssues.length === 0) return
    setStep('result')
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueIds: selectedIssues }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not build recommendations')
      const slugs: string[] = (data.slugs || []).filter((s: string) => getProduct(s))
      setRecSlugs(slugs)
      setIncluded(new Set(slugs))
      setRationale(data.rationale || '')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const toggleInclude = (slug: string) => {
    setIncluded((cur) => {
      const next = new Set(cur)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
    setAddedToCart(false)
  }

  const includedProducts = recSlugs
    .filter((s) => included.has(s))
    .map((s) => getProduct(s))
    .filter((p): p is Product => Boolean(p))

  const grossTotal = includedProducts.reduce((s, p) => s + p.priceCents, 0)
  const discountedTotal = includedProducts.reduce((s, p) => s + discountedCents(p), 0)
  const savings = grossTotal - discountedTotal
  const depositAmount = Math.max(100, Math.round(discountedTotal * (DEPOSIT_PCT / 100)))
  const remaining = discountedTotal - depositAmount

  const addAllToCart = () => {
    includedProducts.forEach((p) =>
      addItem(p.slug, 1, { discountPct: RECOMMEND_DISCOUNT_PCT }),
    )
    setAddedToCart(true)
    openDrawer()
  }

  const payDeposit = async () => {
    setError(null)
    if (!email) {
      setError('Enter your email to lock in the offer.')
      return
    }
    if (includedProducts.length === 0) {
      setError('Select at least one service.')
      return
    }
    // Make sure the discounted items are in the persistent cart, then charge.
    includedProducts.forEach((p) =>
      addItem(p.slug, 1, { discountPct: RECOMMEND_DISCOUNT_PCT }),
    )
    setDepositLoading(true)
    try {
      const res = await fetch('/api/store/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          items: includedProducts.map((p) => ({
            slug: p.slug,
            quantity: 1,
            discountPct: RECOMMEND_DISCOUNT_PCT,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Could not start deposit checkout')
      window.location.href = data.url as string
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Deposit failed')
      setDepositLoading(false)
    }
  }

  return (
    <div data-service-accent="orange">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-10 md:pt-28">
        <div className="absolute inset-0 grid-background opacity-[0.07] pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Service Finder · {RECOMMEND_DISCOUNT_PCT}% off on this page
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              What's holding your business back?
            </h1>
            <p className="text-lg text-muted-foreground">
              Tell us the problem. Our AI maps it to the exact systems that fix
              it — at an exclusive {RECOMMEND_DISCOUNT_PCT}% discount you only
              get here.
            </p>
          </div>

          {/* Step indicator */}
          <div className="mt-8 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            {(['need', 'issues', 'result'] as Step[]).map((s, i) => {
              const active = step === s
              const done =
                (['need', 'issues', 'result'] as Step[]).indexOf(step) > i
              return (
                <div key={s} className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : done
                          ? 'border-primary/50 bg-primary/20 text-primary'
                          : 'border-border'
                    }`}
                  >
                    {done ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className={active ? 'text-foreground' : ''}>
                    {s === 'need' ? 'Problem' : s === 'issues' ? 'Symptoms' : 'Your plan'}
                  </span>
                  {i < 2 && <span className="mx-1 opacity-40">→</span>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden pb-24">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          {/* STEP 1 — NEED tag cloud */}
          {step === 'need' && (
            <div className="max-w-4xl">
              <h2 className="text-xl font-bold mb-6">
                Pick the one that stings the most:
              </h2>
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                {NEEDS.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => pickNeed(n)}
                    className={`${needSize(
                      n.weight,
                    )} card-lifted px-5 py-3 font-bold leading-none transition-all hover:-translate-y-0.5 hover:text-primary hover:border-primary/50 hover:shadow-[0_0_28px_rgb(var(--service-accent-rgb)/0.28)]`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — ISSUES multi-select */}
          {step === 'issues' && need && (
            <div className="max-w-3xl">
              <button
                onClick={() => setStep('need')}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">
                {need.label}
              </h2>
              <p className="text-muted-foreground mb-6">
                {need.blurb} Select everything that sounds like you.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {need.issues.map((issue) => {
                  const on = selectedIssues.includes(issue.id)
                  return (
                    <button
                      key={issue.id}
                      onClick={() => toggleIssue(issue.id)}
                      className={`group relative flex items-center gap-3 rounded-2xl border px-5 py-4 text-left font-semibold transition-all ${
                        on
                          ? 'border-primary bg-primary/10 text-foreground shadow-[0_0_26px_rgb(var(--service-accent-rgb)/0.45)]'
                          : 'border-border bg-card/40 hover:border-primary/40'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          on
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/40'
                        }`}
                      >
                        {on && <Check className="w-3.5 h-3.5" />}
                      </span>
                      {issue.label}
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={goToResults}
                  disabled={selectedIssues.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-[0_0_24px_rgb(var(--service-accent-rgb)/0.4)] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                >
                  See my recommended plan
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-muted-foreground">
                  {selectedIssues.length} selected
                </span>
              </div>
            </div>
          )}

          {/* STEP 3 — RESULT */}
          {step === 'result' && (
            <div className="max-w-5xl mx-auto">
              <button
                onClick={() => setStep('issues')}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Adjust my answers
              </button>

              {loading ? (
                <div className="card-lifted p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="font-semibold">Building your recommendation…</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Matching your answers to the right systems.
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
                  {/* Recommended services */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      Your recommended plan
                    </h2>
                    {rationale && (
                      <p className="text-muted-foreground mb-6">{rationale}</p>
                    )}

                    <div className="space-y-3">
                      {includedProductsAndRest(recSlugs).map((p) => {
                        const on = included.has(p.slug)
                        const Icon = p.icon
                        return (
                          <div
                            key={p.slug}
                            className={`card-lifted p-5 flex gap-4 transition-all ${
                              on ? '' : 'opacity-55'
                            }`}
                          >
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <Link
                                    href={`/store/${p.slug}`}
                                    className="font-bold hover:text-primary block"
                                  >
                                    {p.name}
                                  </Link>
                                  <p className="text-sm text-muted-foreground mt-0.5">
                                    {p.tagline}
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-xs text-muted-foreground line-through tabular-nums">
                                    {p.priceLabel}
                                  </div>
                                  <div className="font-bold tabular-nums text-primary">
                                    {formatUsd(discountedCents(p))}
                                    {p.billing === 'subscription' && (
                                      <span className="text-xs font-normal text-muted-foreground">
                                        /{p.interval}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] font-semibold text-primary">
                                    {RECOMMEND_DISCOUNT_PCT}% off
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleInclude(p.slug)}
                                className={`mt-3 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                  on
                                    ? 'border-primary/50 bg-primary/10 text-primary'
                                    : 'border-border text-muted-foreground hover:border-primary/40'
                                }`}
                              >
                                {on ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" /> Included
                                  </>
                                ) : (
                                  'Add to plan'
                                )}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Offer + deposit panel */}
                  <aside className="lg:sticky lg:top-24 h-fit">
                    <div className="card-lifted-xl p-6 space-y-5">
                      <div>
                        <h3 className="text-lg font-bold">Lock in your offer</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {RECOMMEND_DISCOUNT_PCT}% off applies automatically —
                          only from this page.
                        </p>
                      </div>

                      <div className="space-y-2 pb-4 border-b border-border text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {includedProducts.length} service
                            {includedProducts.length === 1 ? '' : 's'}
                          </span>
                          <span className="tabular-nums line-through text-muted-foreground">
                            {formatUsd(grossTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-primary font-medium">
                          <span>You save ({RECOMMEND_DISCOUNT_PCT}%)</span>
                          <span className="tabular-nums">−{formatUsd(savings)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-1">
                          <span>Your price</span>
                          <span className="tabular-nums text-primary">
                            {formatUsd(discountedTotal)}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-1">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Lock className="w-4 h-4 text-primary" />
                          {DEPOSIT_PCT}% deposit to lock it in
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-primary tabular-nums">
                          <span>Due today</span>
                          <span>{formatUsd(depositAmount)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Balance of {formatUsd(remaining)} due at project
                          kickoff. Your {RECOMMEND_DISCOUNT_PCT}% discount stays
                          locked.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="rec-email"
                          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          Email *
                        </label>
                        <input
                          id="rec-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                      </div>

                      {error && <p className="text-sm text-destructive">{error}</p>}

                      <button
                        onClick={payDeposit}
                        disabled={depositLoading || includedProducts.length === 0}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-bold text-primary-foreground shadow-[0_0_24px_rgb(var(--service-accent-rgb)/0.4)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                      >
                        {depositLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Redirecting…
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Pay {formatUsd(depositAmount)} deposit
                          </>
                        )}
                      </button>

                      <button
                        onClick={addAllToCart}
                        disabled={includedProducts.length === 0}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-50"
                      >
                        {addedToCart ? (
                          <>
                            <Check className="w-4 h-4" /> Added — {RECOMMEND_DISCOUNT_PCT}% locked in cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" /> Add to cart instead
                          </>
                        )}
                      </button>

                      <p className="text-xs text-muted-foreground text-center">
                        256-bit TLS · Secure Stripe checkout
                      </p>
                    </div>
                  </aside>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )

  /** Recommended products in AI order, then any remaining catalog items last
   * (so the user can still add something we didn't lead with). */
  function includedProductsAndRest(slugs: string[]): Product[] {
    const primary = slugs
      .map((s) => getProduct(s))
      .filter((p): p is Product => Boolean(p))
    const rest = PRODUCTS.filter((p) => !slugs.includes(p.slug))
    return [...primary, ...rest]
  }
}
