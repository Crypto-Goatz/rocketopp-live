'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import {
  useCartStore,
  useCartItems,
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

export function CartDrawer() {
  const router = useRouter()
  const items = useCartItems()
  const open = useCartStore((s) => s.drawerOpen)
  const close = useCartStore((s) => s.closeDrawer)
  const setOpen = useCartStore((s) => s.toggleDrawer)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const expanded = expandCart(items)
  const subtotal = getCartTotal(items)

  const handleCheckout = () => {
    close()
    router.push('/checkout')
  }

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? setOpen() : close())}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 bg-background border-l border-border"
      >
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your cart
          </SheetTitle>
          <SheetDescription className="sr-only">
            Items selected for purchase
          </SheetDescription>
        </SheetHeader>

        {expanded.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Browse the store to find your next system.
              </p>
            </div>
            <Button asChild onClick={close} className="mt-2">
              <Link href="/store">Browse store</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {expanded.map(({ product, quantity }) => {
                const Icon = product.icon
                const lineTotal = product.priceCents * quantity
                return (
                  <div
                    key={product.slug}
                    className="flex gap-3 pb-4 border-b border-border last:border-0"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/store/${product.slug}`}
                            onClick={close}
                            className="font-semibold text-sm leading-tight hover:text-primary truncate block"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {product.priceLabel}
                            {product.billing === 'subscription' &&
                              `/${product.interval}`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(product.slug)}
                          aria-label={`Remove ${product.name}`}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border border-border">
                          <button
                            onClick={() =>
                              updateQuantity(product.slug, quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                            disabled={quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-sm font-medium tabular-nums w-7 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(product.slug, quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold tabular-nums">
                          {formatUsd(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="px-6 py-5 border-t border-border space-y-4 bg-card/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold tabular-nums">
                  {formatUsd(subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Subscriptions are billed{' '}
                {expanded.some((e) => e.product.billing === 'subscription')
                  ? 'monthly after checkout'
                  : 'monthly'}
                . Taxes calculated at checkout.
              </p>
              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full text-base"
              >
                Checkout
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                asChild
                variant="ghost"
                onClick={close}
                className="w-full text-muted-foreground"
              >
                <Link href="/store">Keep shopping</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
