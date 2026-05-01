/**
 * UCP Live Strip — server-rendered, sources from the live dispatch feed at
 * 0ncore.com/api/dispatch. Replaces the static activity ticker with the
 * actual ecosystem heartbeat: real version SHA, real product list, real
 * rule count, real "last shipped" timestamp.
 *
 * Renders an asymmetric strip: pulse + headline + product chips + version.
 * No JS — pure CSS marquee for the chips.
 */

import { Activity, Server } from 'lucide-react'
import Link from 'next/link'
import { getUcpSnapshot, relativeFrom } from '@/lib/ucp'

export default async function UcpLiveStrip() {
  const snapshot = await getUcpSnapshot()
  const lastShipped = snapshot.version
    ? relativeFrom(snapshot.version.pushed_at)
    : '—'
  const products = snapshot.live_products

  return (
    <section
      aria-label="Live ecosystem status"
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
            <div className="hidden text-sm text-muted-foreground md:block">
              <span className="font-mono text-xs uppercase tracking-widest text-foreground/70">
                Last shipped {lastShipped}
              </span>
              {snapshot.version && (
                <span className="ml-3 font-mono text-[10px] text-muted-foreground/70">
                  · {snapshot.version.sha.slice(0, 7)}
                </span>
              )}
            </div>
          </div>

          {/* Product chips marquee */}
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="animate-marquee flex gap-3 whitespace-nowrap py-1">
              {[...products, ...products].map((p, i) => (
                <Link
                  key={`${p.slug}-${i}`}
                  href={p.domain ? `https://${p.domain}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Server className="h-3 w-3 text-primary" />
                  <span>{p.display_name}</span>
                  {p.domain && (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {p.domain}
                    </span>
                  )}
                </Link>
              ))}
              {/* Filler items so the marquee never feels short */}
              <span className="inline-flex shrink-0 items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
                <Activity className="h-3 w-3 text-primary" />
                {snapshot.active_rules_count} active rules · {snapshot.ecosystem_count} ecosystem entries
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
