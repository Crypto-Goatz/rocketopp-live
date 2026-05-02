'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart-store'
import { Plus, Check } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  slug: string
  className?: string
  size?: 'default' | 'lg'
  fullWidth?: boolean
}

export function AddToCartButton({
  slug,
  className = '',
  size = 'lg',
  fullWidth = true,
}: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!justAdded) return
    const t = setTimeout(() => setJustAdded(false), 1400)
    return () => clearTimeout(t)
  }, [justAdded])

  return (
    <Button
      onClick={() => {
        addItem(slug, 1)
        setJustAdded(true)
      }}
      size={size}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {justAdded ? (
        <>
          <Check className="mr-2 w-4 h-4" />
          Added — opening cart
        </>
      ) : (
        <>
          <Plus className="mr-2 w-4 h-4" />
          Add to cart
        </>
      )}
    </Button>
  )
}
