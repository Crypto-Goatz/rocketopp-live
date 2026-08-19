/**
 * Ecosystem Strip — server-rendered from sources that are actually true.
 *
 * HISTORY, so nobody re-adds the old wiring: this component used to source from
 * `0ncore.com/api/dispatch` (the UCP feed). Dispatch was DEMOTED on 2026-08-19 —
 * it stopped being written on 2026-06-17 but kept answering HTTP 200 with
 * confident, current-looking JSON. Consequences that shipped to production and
 * sat on the public homepage for ~2 months:
 *
 *   - "Last shipped 62d ago" under a pulsing "Ecosystem Live" badge, while the
 *     ecosystem was in fact shipping daily.
 *   - Product chips reading "0nCore  Status" / "RocketPost  Status" — internal
 *     status-page naming leaked into customer-facing UI.
 *   - A chip whose visible label AND href were literally
 *     "rocketpost.co (NOTE: serves the CRO9 product — see strategic note below)"
 *     — an internal strategy note published on the homepage, inside a broken link.
 *
 * Rules this now obeys:
 *   - Products come from FAMILY_MEMBERS, the same in-repo list that powers
 *     /family/[slug]. One concept, one source of truth.
 *   - The deploy stamp is ABSOLUTE, never relative. These pages are statically
 *     rendered, so a relative time computed at build would freeze at "just now"
 *     and lie forever — the identical failure in a new costume.
 */

import { Activity, Server } from 'lucide-react'
import Link from 'next/link'

import { FAMILY_MEMBERS } from '@/lib/rocketopp-family'

/** Absolute, so it cannot decay into a false claim once the HTML is cached. */
function deployStamp(): string | null {
  const raw = process.env.BUILD_TIME
  if (!raw) return null
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default function EcosystemStrip() {
  const products = FAMILY_MEMBERS.filter((m) => m.status === 'live')
  const stamp = deployStamp()
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null

  return (
    <section
      aria-label="Ecosystem status"
      className="relative overflow-hidden border-b border-border bg-card/30"
    >
      <div className="container px-4 py-5 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Pulse + headline */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Ecosystem Live
            </div>
            {stamp && (
              <div className="hidden text-sm text-muted-foreground md:block">
                <span className="font-mono text-xs uppercase tracking-widest text-foreground/70">
                  Deployed {stamp}
                </span>
                {sha && (
                  <span className="ml-3 font-mono text-[10px] text-muted-foreground/70">
                    · {sha}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product chips marquee */}
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="animate-marquee flex gap-3 whitespace-nowrap py-1">
              {[...products, ...products].map((p, i) => (
                <Link
                  key={`${p.slug}-${i}`}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Server className="h-3 w-3 text-primary" />
                  <span>{p.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {p.url.replace(/^https?:\/\//, '')}
                  </span>
                </Link>
              ))}
              <span className="inline-flex shrink-0 items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
                <Activity className="h-3 w-3 text-primary" />
                {products.length} live products across the 0n network
              </span>
            </div>
          </div>

          {/* Footer link */}
          <Link
            href="/0n"
            className="hidden shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary md:block"
          >
            See the network →
          </Link>
        </div>
      </div>
    </section>
  )
}
