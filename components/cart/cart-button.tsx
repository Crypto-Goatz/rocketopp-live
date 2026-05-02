'use client'

import { ShoppingBag } from 'lucide-react'
import { useCartStore, useCartCount } from '@/lib/store/cart-store'
import { useEffect, useState } from 'react'

interface Props {
  className?: string
}

export function CartButton({ className = '' }: Props) {
  const open = useCartStore((s) => s.openDrawer)
  const count = useCartCount()
  // Avoid SSR/hydration mismatch — render the badge only after mount
  // because the count is hydrated from localStorage on the client.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <button
      onClick={open}
      aria-label={`Open cart${mounted && count > 0 ? `, ${count} item${count === 1 ? '' : 's'}` : ''}`}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-card transition-colors ${className}`}
    >
      <ShoppingBag className="w-5 h-5" />
      {mounted && count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center tabular-nums">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
