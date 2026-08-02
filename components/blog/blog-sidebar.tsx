'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Tag } from 'lucide-react'
import OfferModal from './offer-modal'

/**
 * Article sidebar: coloured category rail + the $497 offer.
 *
 * Categories carry the same colour here as on the index cards, so a reader
 * builds one association per topic across the whole blog rather than relearning
 * it per page. The active category is filled rather than outlined — on a page
 * that is already mostly text, weight reads faster than a border.
 *
 * Client component only because the offer modal needs state; the category data
 * is passed down from the server page.
 */

export type SidebarCategory = { slug: string; name: string; count?: number }

/** Shared with the index cards — one colour per category, everywhere. */
export const CATEGORY_COLORS: Record<string, { dot: string; bg: string; text: string; ring: string }> = {
  'ai-automation':    { dot: 'bg-purple-400',  bg: 'bg-purple-500/10',  text: 'text-purple-300',  ring: 'ring-purple-500/30' },
  'saas-building':    { dot: 'bg-rose-400',    bg: 'bg-rose-500/10',    text: 'text-rose-300',    ring: 'ring-rose-500/30' },
  'crm-strategy':     { dot: 'bg-sky-400',     bg: 'bg-sky-500/10',     text: 'text-sky-300',     ring: 'ring-sky-500/30' },
  'hipaa-compliance': { dot: 'bg-emerald-400', bg: 'bg-emerald-500/10', text: 'text-emerald-300', ring: 'ring-emerald-500/30' },
  'seo-sxo':          { dot: 'bg-amber-400',   bg: 'bg-amber-500/10',   text: 'text-amber-300',   ring: 'ring-amber-500/30' },
  'agency-growth':    { dot: 'bg-cyan-400',    bg: 'bg-cyan-500/10',    text: 'text-cyan-300',    ring: 'ring-cyan-500/30' },
  'mcp-ecosystem':    { dot: 'bg-fuchsia-400', bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-300', ring: 'ring-fuchsia-500/30' },
  'product-updates':  { dot: 'bg-orange-400',  bg: 'bg-orange-500/10',  text: 'text-orange-300',  ring: 'ring-orange-500/30' },
  default:            { dot: 'bg-zinc-400',    bg: 'bg-zinc-500/10',    text: 'text-zinc-300',    ring: 'ring-zinc-500/30' },
}

export const catColor = (slug?: string) => CATEGORY_COLORS[slug ?? ''] ?? CATEGORY_COLORS.default

export default function BlogSidebar({
  categories,
  activeSlug,
}: {
  categories: SidebarCategory[]
  activeSlug?: string
}) {
  const [offerOpen, setOfferOpen] = useState(false)

  return (
    <>
      <aside className="space-y-6 lg:sticky lg:top-24">
        {/* ── Categories ── */}
        <nav
          aria-label="Article categories"
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              Topics
            </h2>
          </div>
          <ul className="space-y-1">
            {categories.map((c) => {
              const col = catColor(c.slug)
              const active = c.slug === activeSlug
              return (
                <li key={c.slug}>
                  <Link
                    href={`/blog?category=${c.slug}`}
                    aria-current={active ? 'true' : undefined}
                    className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? `${col.bg} ${col.text} font-semibold`
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`h-2 w-2 shrink-0 rounded-full ${col.dot} ${
                        active ? '' : 'opacity-60 group-hover:opacity-100'
                      } transition-opacity`}
                    />
                    <span className="min-w-0 flex-1 truncate">{c.name}</span>
                    {typeof c.count === 'number' && (
                      <span className="shrink-0 text-[11px] tabular-nums text-zinc-500">
                        {c.count}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* ── $497 offer ── */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/[0.14] to-transparent p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-2xl"
          />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              Offer
            </div>

            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-white">$497</span>
              <span className="text-sm text-zinc-400">website</span>
            </p>

            <p className="mt-2 text-sm font-semibold leading-snug text-white">
              Built for you. Yours to edit.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Schema, an llms.txt written for AI crawlers, a robots.txt that
              actually allowlists them, and content that leads with the answer —
              the structure this blog keeps arguing for.
            </p>

            <button
              type="button"
              onClick={() => setOfferOpen(true)}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[0_0_28px_rgba(255,107,53,0.3)] transition-transform hover:scale-[1.02]"
            >
              Learn More
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <OfferModal open={offerOpen} onClose={() => setOfferOpen(false)} />
    </>
  )
}
