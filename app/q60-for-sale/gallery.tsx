'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Photo } from '@/lib/q60/listing'
import s from './q60.module.css'

export function Gallery({ exterior, interior }: { exterior: Photo[]; interior: Photo[] }) {
  const [tab, setTab] = useState<'exterior' | 'interior'>('exterior')
  const [open, setOpen] = useState<number | null>(null)
  const list = tab === 'exterior' ? exterior : interior

  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, step])

  return (
    <div>
      <div className={s.tabs} role="tablist" aria-label="Photo set">
        {(['exterior', 'interior'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? s.tabOn : s.tab} onClick={() => { setTab(t); setOpen(null) }}>
            {t === 'exterior' ? 'Exterior' : 'Interior'} <span>{(t === 'exterior' ? exterior : interior).length}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className={s.empty}>Interior photos are being shot now. Ask for them in the form below and they go to you first.</p>
      ) : (
        <div className={s.grid}>
          {list.map((p, i) => (
            <button key={p.src} className={`${s.tile} ${p.h > p.w ? s.tall : ''} ${i === 0 ? s.lead : ''}`} onClick={() => setOpen(i)} aria-label={`Open photo: ${p.alt}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading={i < 4 ? 'eager' : 'lazy'} decoding="async" />
            </button>
          ))}
        </div>
      )}

      {open !== null && list[open] && (
        <div className={s.lightbox} role="dialog" aria-modal="true" aria-label={list[open].alt} onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={list[open].src} alt={list[open].alt} />
          <div className={s.lbBar} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => step(-1)} aria-label="Previous photo">‹</button>
            <span>{open + 1} / {list.length} · {list[open].alt}</span>
            <button onClick={() => step(1)} aria-label="Next photo">›</button>
            <button onClick={() => setOpen(null)} aria-label="Close">✕</button>
          </div>
        </div>
      )}
    </div>
  )
}
