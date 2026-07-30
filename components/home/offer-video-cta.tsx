'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Clock, Phone } from 'lucide-react'

import { nextDeadline } from '@/lib/offer'

/**
 * The $497 offer, carried by the ad video.
 *
 * This replaced the giant $497 card that used to sit in the hero. The hero now
 * sells what RocketOpp *is* — AI-ready websites — and the price lives here, further
 * down, where someone who has read the argument arrives ready for it.
 *
 * PLAYBACK — autoplay, muted, looping, and that is a deliberate choice that only
 * became defensible after compression. The source was 1920×1080 at ~5.2 Mbps for
 * what is mostly black motion graphics: 14.3MB. Re-encoded to 1280-wide CRF 30 it
 * is 636KB — a 22× reduction with no visible loss on this material. At 636KB an
 * autoplaying loop costs less than a hero image, so it can behave like the ad it
 * is instead of sitting behind a play button.
 *
 * It has no audio track, so muted autoplay is honest rather than a workaround, and
 * every browser permits it.
 *
 * `prefers-reduced-motion` is respected: the video is paused and the poster shown,
 * because a looping ad is exactly the kind of motion that policy exists to stop.
 */
export default function OfferVideoCta() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(false)

  /**
   * The deadline is computed CLIENT-SIDE on purpose. This page is statically
   * prerendered, so a server-rendered "Closes Friday 1 Aug" would freeze at build
   * time and eventually advertise a date that has passed. The server renders the
   * neutral label, and the real date appears on mount.
   */
  const [deadline, setDeadline] = useState('')
  useEffect(() => {
    setDeadline(
      nextDeadline().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        timeZone: 'America/New_York',
      }),
    )
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      setReduced(mq.matches)
      const v = videoRef.current
      if (!v) return
      if (mq.matches) v.pause()
      else v.play().catch(() => {})
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    <section className="relative overflow-hidden border-y border-border py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.04] to-background" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* ── The ad, on its own black plate ── */}
          <div className="rounded-3xl bg-black p-3 shadow-2xl ring-1 ring-white/10 sm:p-5">
            <div className="overflow-hidden rounded-2xl">
              <video
                ref={videoRef}
                className="block aspect-video w-full"
                src="/videos/497-ad.mp4"
                poster="/videos/497-ad-poster.jpg"
                autoPlay={!reduced}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="The $497 website offer: a complete site designed and built for your business, $250 to start and $247 at launch, then $50 a month."
              />
            </div>
          </div>

          {/* ── The offer, in words, for anyone who cannot see the video ── */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Clock className="h-4 w-4" />
              {deadline ? `Closes ${deadline}, midnight ET` : 'Limited weekly offer'}
            </div>

            <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              A complete website —{' '}
              <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent">
                $497, built for you.
              </span>
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Not a template you fill in yourself. We design and build the whole thing around your
              business, ship it AI-ready, and then hand it over — yours to edit forever, in plain
              English, with no change-request fees.
            </p>

            <ul className="mt-7 space-y-3">
              {[
                '$250 to start, $247 when it goes live — stated up front, not in the small print',
                'Then $50/month for hosting and the platform. Starts at launch, never before',
                'Structured so Google and AI search can both read it',
                'Edit it by describing what you want — no dashboard to learn',
              ].map((f) => (
                <li key={f} className="flex gap-3 leading-relaxed text-muted-foreground">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/497-website"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Claim this week&rsquo;s build
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="tel:+1-878-888-1230"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-8 py-4 text-lg font-semibold transition-colors hover:border-primary/40"
              >
                <Phone className="h-4 w-4 text-primary" />
                (878) 888-1230
              </a>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Nothing is charged until we have confirmed the scope together. If $497 will not
              genuinely cover what you need, we say so before you spend anything.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
