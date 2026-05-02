'use client'

import { useEffect } from 'react'
import { useOrderStore } from '@/lib/order/order-store'

/** Clears the wizard state once we're on the success page. */
export function ResetOrder() {
  const reset = useOrderStore((s) => s.reset)
  useEffect(() => {
    reset()
  }, [reset])
  return null
}
