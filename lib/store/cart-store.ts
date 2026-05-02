/**
 * RocketOpp store cart — Zustand with localStorage persistence.
 *
 * Drives the off-canvas drawer + checkout. State lives client-side; the
 * authoritative price/billing per item is re-derived on the server at
 * checkout time so a tampered cart can't change Stripe line-item amounts.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { PRODUCTS, type Product } from './products'

export interface CartItem {
  slug: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  drawerOpen: boolean

  addItem: (slug: string, quantity?: number) => void
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

      addItem: (slug, quantity = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === slug)
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.slug === slug ? { ...i, quantity: i.quantity + quantity } : i,
              ),
              drawerOpen: true,
            }
          }
          return { items: [...s.items, { slug, quantity }], drawerOpen: true }
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
  return useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  )
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => {
    const product = PRODUCTS.find((p) => p.slug === i.slug)
    if (!product) return sum
    return sum + product.priceCents * i.quantity
  }, 0)
}

export function expandCart(items: CartItem[]): {
  product: Product
  quantity: number
}[] {
  return items
    .map((i) => {
      const product = PRODUCTS.find((p) => p.slug === i.slug)
      return product ? { product, quantity: i.quantity } : null
    })
    .filter((x): x is { product: Product; quantity: number } => x !== null)
}
