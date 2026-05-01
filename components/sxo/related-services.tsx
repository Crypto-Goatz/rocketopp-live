/**
 * Related Services — internal SEO link cluster. Every service page links
 * to the other services + the live SXO scanner so AI engines see the
 * full topic graph and Google's internal-link signal stays strong.
 */

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface RelatedLink {
  label: string
  href: string
  /** Optional sub-line for context. */
  hint?: string
  /** Mark the link as external (opens in new tab). */
  external?: boolean
}

export interface RelatedServicesProps {
  heading?: string
  links: RelatedLink[]
}

export default function RelatedServices({
  heading = 'Explore the rest of the stack',
  links,
}: RelatedServicesProps) {
  return (
    <section className="border-t border-border bg-card/20 py-14 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{heading}</h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Every RocketOpp service composes with the others. Pick one to start.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex items-start gap-3 rounded-2xl border border-border bg-card/50 p-4 backdrop-blur transition-colors hover:border-primary/40"
            >
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary">
                  {link.label}
                </div>
                {link.hint && (
                  <div className="mt-0.5 text-xs text-muted-foreground">{link.hint}</div>
                )}
              </div>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
