/**
 * Pure cart-pricing helpers — no React, no zustand, no browser globals.
 *
 * Safe to import from server routes (Stripe checkout/deposit) as well as the
 * client cart store. Keeps the discount math in exactly one place so the
 * amount the customer sees always matches what the server charges.
 */

import type { Product } from './products'

/** Hard ceiling on any per-item discount honored client- or server-side. */
export const MAX_ITEM_DISCOUNT_PCT = 20

/** Clamp a raw discount to the allowed [0, MAX] range. */
export function clampDiscount(pct?: number): number {
  if (!pct || Number.isNaN(pct)) return 0
  return Math.max(0, Math.min(MAX_ITEM_DISCOUNT_PCT, Math.round(pct)))
}

/** Net per-unit price after this item's (clamped) discount, in cents. */
export function unitCentsAfterDiscount(product: Product, discountPct?: number): number {
  const pct = clampDiscount(discountPct)
  return Math.round(product.priceCents * (1 - pct / 100))
}
