/**
 * RocketOpp store cart — Zustand with localStorage persistence.
 *
 * Drives the off-canvas drawer + checkout. State lives client-side; the
 * authoritative price/billing per item is re-derived on the server at
 * checkout time so a tampered cart can't change Stripe line-item amounts.
 *
 * Discounts: an item may carry an optional `discountPct` (0–20). It is only
 * ever set by the Service Recommendation Engine (/recommend), and the server
 * clamps it to MAX_ITEM_DISCOUNT_PCT so a hand-edited localStorage can't beat
 * the public offer. Regular store add-to-cart carries no discount.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { PRODUCTS, type Product } from './products'
import {
  MAX_ITEM_DISCOUNT_PCT,
  clampDiscount,
  unitCentsAfterDiscount,
} from './pricing'

// Re-export the pure pricing helpers so existing client imports keep working.
export { MAX_ITEM_DISCOUNT_PCT, clampDiscount, unitCentsAfterDiscount }

export interface CartItem {
  slug: string
  quantity: number
  /** Optional promo discount (0–20). Attached by /recommend; sticks to the item. */
  discountPct?: number
}

interface AddOpts {
  discountPct?: number
}

interface CartState {
  items: CartItem[]
  drawerOpen: boolean

  addItem: (slug: string, quantity?: number, opts?: AddOpts) => void
  removeItem: (slug: string) => void
  updateQuantity: (slug: string, quantity: number) => void
  clear: () => void

  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,

      addItem: (slug, quantity = 1, opts) =>
        set((s) => {
          const nextDiscount = clampDiscount(opts?.discountPct)
          const existing = s.items.find((i) => i.slug === slug)
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.slug === slug
                  ? {
                      ...i,
                      quantity: i.quantity + quantity,
                      // Keep the better of the two discounts so a plain
                      // add-to-cart never strips a recommended discount.
                      discountPct: Math.max(
                        clampDiscount(i.discountPct),
                        nextDiscount,
                      ),
                    }
                  : i,
              ),
              drawerOpen: true,
            }
          }
          return {
            items: [
              ...s.items,
              { slug, quantity, ...(nextDiscount ? { discountPct: nextDiscount } : {}) },
            ],
            drawerOpen: true,
          }
        }),

      removeItem: (slug) =>
        set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),

      updateQuantity: (slug, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.slug !== slug)
              : s.items.map((i) => (i.slug === slug ? { ...i, quantity } : i)),
        })),

      clear: () => set({ items: [] }),

      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
    }),
    {
      name: 'rocketopp-cart-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
)

/** Selector helpers (kept outside the store for stable identity). */

export function useCartItems() {
  return useCartStore((s) => s.items)
}

export function useCartCount() {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
}

/** Cart total AFTER discounts (what the customer actually pays), in cents. */
export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => {
    const product = PRODUCTS.find((p) => p.slug === i.slug)
    if (!product) return sum
    return sum + unitCentsAfterDiscount(product, i.discountPct) * i.quantity
  }, 0)
}

/** Cart total BEFORE discounts (list price), in cents. */
export function getCartGrossTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => {
    const product = PRODUCTS.find((p) => p.slug === i.slug)
    if (!product) return sum
    return sum + product.priceCents * i.quantity
  }, 0)
}

/** Total amount saved across the cart (gross − net), in cents. */
export function getCartDiscountTotal(items: CartItem[]): number {
  return getCartGrossTotal(items) - getCartTotal(items)
}

export interface ExpandedCartItem {
  product: Product
  quantity: number
  /** Clamped discount applied to this line (0–20). */
  discountPct: number
  /** Net per-unit price in cents (after discount). */
  unitCents: number
  /** List per-unit price in cents (before discount). */
  grossUnitCents: number
}

export function expandCart(items: CartItem[]): ExpandedCartItem[] {
  return items
    .map((i) => {
      const product = PRODUCTS.find((p) => p.slug === i.slug)
      if (!product) return null
      const discountPct = clampDiscount(i.discountPct)
      return {
        product,
        quantity: i.quantity,
        discountPct,
        unitCents: unitCentsAfterDiscount(product, discountPct),
        grossUnitCents: product.priceCents,
      }
    })
    .filter((x): x is ExpandedCartItem => x !== null)
}
