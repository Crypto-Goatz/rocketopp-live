'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, Play, ShieldCheck, VolumeX } from 'lucide-react'

/**
 * Rocket Shield explainer video.
 *
 * DESIGN — a black plate, deliberately:
 * the video is authored on pure black with the RocketOpp orange/red gradient, so the
 * panel is #000 with generous padding and the frame edge is invisible. It reads as
 * part of the page rather than an embed dropped onto it. No border on the video
 * itself; the padding is the frame.
 *
 * PLAYBACK — click to play, `preload="none"`:
 * the file is 21MB and three minutes long. Autoplaying it would blow the LCP and
 * burn mobile data for every visitor who never watches. Nothing but the poster
 * (30KB) loads until someone actually presses play.
 *
 * THE VIDEO HAS NO AUDIO TRACK — checked with ffprobe. So the badge says "Silent"
 * up front. Without that, a viewer spends the first thirty seconds hunting for a
 * mute button that was never there and assumes the player is broken.
 */
export default function RocketShieldVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  function start() {
    setPlaying(true)
    // The element is already mounted, so this play() is inside the click gesture and
    // will not be blocked.
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {})
    })
  }

  return (
    <section className="relative overflow-hidden border-y border-border py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      <div className="container relative z-10 px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <ShieldCheck className="h-4 w-4" />
            Rocket Shield
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
            Your ad budget{' '}
            <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent">
              has a leak.
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A large share of paid traffic is never a customer — datacentre bots, headless
            browsers, three-second bounces. Rocket Shield blocks the junk and feeds what it
            learns back into your targeting, so your campaigns stop bidding on it in the first
            place.
          </p>
        </div>

        {/* ── The black plate. Padding is the frame; the video has no border. ── */}
        <div className="mx-auto mt-12 max-w-5xl">
          <div className="rounded-3xl bg-black p-3 shadow-2xl ring-1 ring-white/10 sm:p-6 md:p-8">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
              <video
                ref={videoRef}
                className="h-full w-full"
                src="/videos/rocket-shield-explainer.mp4"
                poster="/videos/rocket-shield-poster.jpg"
                preload="none"
                controls={playing}
                playsInline
                onEnded={() => setPlaying(false)}
                aria-label="Rocket Shield explainer: how bot and junk traffic drains an ad budget, and how blocking it improves targeting"
              />

              {!playing && (
                <button
                  onClick={start}
                  aria-label="Play the Rocket Shield explainer"
                  className="group absolute inset-0 flex items-center justify-center"
                >
                  {/* The poster as an <Image> so it is optimised and sized; the
                      <video> poster attribute is the no-JS fallback. */}
                  <Image
                    src="/videos/rocket-shield-poster.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 900px"
                    className="object-cover"
                    priority={false}
                  />
                  <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
                  <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 shadow-lg transition-transform group-hover:scale-110">
                    <Play className="ml-1 h-8 w-8 text-white" fill="currentColor" />
                  </span>
                </button>
              )}
            </div>

            {/* Meta row, inside the plate so it reads as part of the player. */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/50 sm:mt-6">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />3 min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <VolumeX className="h-3.5 w-3.5" />
                Silent — no audio needed
              </span>
              <span>Rocket Shield · traffic quality &amp; targeting</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/health-check"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Check my site free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-4 text-lg font-semibold transition-colors hover:border-primary/40"
          >
            Talk to us about Rocket Shield
          </Link>
        </div>
      </div>
    </section>
  )
}
