'use client'

import { useEffect, useState } from 'react'
import s from './q60.module.css'

/** Appears once the hero (which has its own buttons) is off screen; steps aside while the buy section is in view. */
export function StickyBar({ priceLabel }: { priceLabel: string }) {
  const [heroGone, setHeroGone] = useState(false)
  const [atBuy, setAtBuy] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('q60-hero')
    const buy = document.getElementById('buy')
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroGone(!e.isIntersecting)
        if (e.target === buy) setAtBuy(e.isIntersecting)
      }
    }, { threshold: 0.05 })
    if (hero) io.observe(hero)
    if (buy) io.observe(buy)
    return () => io.disconnect()
  }, [])

  const show = heroGone && !atBuy
  return (
    <nav className={`${s.sticky} ${show ? s.stickyOn : ''}`} aria-label="Buy this car" aria-hidden={!show}>
      <a href="#buy" className={s.stickyBuy} data-cro9="q60-sticky-buy" tabIndex={show ? 0 : -1}>Buy · {priceLabel}</a>
      <a href="#offer" className={s.stickyOffer} data-cro9="q60-sticky-offer" tabIndex={show ? 0 : -1}>Make an offer</a>
    </nav>
  )
}
