'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  ShieldCheck,
  Loader2,
  ShoppingBag,
} from 'lucide-react'
import Footer from '@/components/footer'
import { SectionBg } from '@/components/section-bg'
import {
  useCartItems,
  useCartStore,
  expandCart,
  getCartTotal,
} from '@/lib/store/cart-store'

function formatUsd(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export default function CheckoutPage() {
  const items = useCartItems()
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const expanded = expandCart(items)
  const subtotal = getCartTotal(items)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasSubscription = expanded.some(
    (e) => e.product.billing === 'subscription',
  )
  const hasOneTime = expanded.some((e) => e.product.billing === 'one_time')
  const isMixed = hasSubscription && hasOneTime

  const handleCheckout = async () => {
    setError(null)
    if (!email) {
      setError('Email is required')
      return
    }
    if (isMixed) {
      setError(
        'Please check out subscriptions separately from one-time purchases.',
      )
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          email,
          name: name || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to start checkout')
      }
      window.location.href = data.url as string
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed')
      setLoading(false)
    }
  }

  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-28">
        <div className="absolute inset-0 grid-background opacity-[0.07] pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
            >
              ← Continue shopping
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Checkout
            </h1>
            <p className="text-muted-foreground">
              Confirm your cart, enter your email, and we'll take you to secure
              Stripe checkout.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden pb-24">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-8">
            {/* Cart items */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Your cart</h2>

              {expanded.length === 0 ? (
                <div className="card-lifted p-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7 text-primary" />
                  </div>
                  <p className="font-semibold">Your cart is empty</p>
                  <Link
                    href="/store"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:scale-[1.02] transition-transform"
                  >
                    Browse the store
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                expanded.map(({ product, quantity }) => {
                  const Icon = product.icon
                  return (
                    <div
                      key={product.slug}
                      className="card-lifted p-5 flex gap-4"
                    >
                      <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/store/${product.slug}`}
                              className="font-bold hover:text-primary block truncate"
                            >
                              {product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-0.5 truncate">
                              {product.tagline}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(product.slug)}
                            aria-label={`Remove ${product.name}`}
                            className="shrink-0 p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-lg border border-border">
                            <button
                              onClick={() =>
                                updateQuantity(product.slug, quantity - 1)
                              }
                              disabled={quantity <= 1}
                              className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-sm font-medium tabular-nums">
                              {quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(product.slug, quantity + 1)
                              }
                              className="p-2 text-muted-foreground hover:text-foreground"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="font-bold tabular-nums">
                              {formatUsd(product.priceCents * quantity)}
                            </div>
                            {product.billing === 'subscription' && (
                              <div className="text-xs text-muted-foreground">
                                /{product.interval}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Summary + email */}
            {expanded.length > 0 && (
              <aside className="lg:sticky lg:top-24">
                <div className="card-lifted-xl p-6 space-y-5">
                  <h2 className="text-xl font-bold">Order summary</h2>

                  <div className="space-y-2 pb-4 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold tabular-nums">
                        {formatUsd(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-muted-foreground">
                        Calculated at checkout
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total today</span>
                    <span className="tabular-nums text-primary">
                      {formatUsd(subtotal)}
                      {hasSubscription && (
                        <span className="text-xs font-normal text-muted-foreground">
                          {' '}
                          /mo
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="name"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Name (optional)
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="mt-1 w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={loading || expanded.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-bold text-primary-foreground shadow-[0_0_24px_rgba(255,107,53,0.35)] hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting…
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Pay securely with Stripe
                      </>
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    256-bit TLS · No card data touches our servers
                  </p>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
