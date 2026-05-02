'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart-store'

/** Clears the local cart on success-page mount. */
export function ClearCart() {
  const clear = useCartStore((s) => s.clear)
  useEffect(() => {
    clear()
  }, [clear])
  return null
}
