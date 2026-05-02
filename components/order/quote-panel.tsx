'use client'

import { Sparkles, X } from 'lucide-react'
import { useOrderStore, calculateQuote } from '@/lib/order/order-store'
import { formatUsd } from '@/lib/order/services-catalog'

export function QuotePanel({ className = '' }: { className?: string }) {
  const selected = useOrderStore((s) => s.selected)
  const removeService = useOrderStore((s) => s.removeService)
  const quote = calculateQuote(selected)

  return (
    <aside
      className={`card-lifted-xl p-6 sticky top-24 ${className}`}
      aria-label="Live quote summary"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
          <Sparkles className="w-4 h-4" />
        </div>
        <h2 className="text-lg font-bold">Live quote</h2>
      </div>

      {quote.lines.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          Pick what you need on the left and your quote builds here in real
          time.
        </p>
      ) : (
        <>
          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
            {quote.lines.map((line) => (
              <div
                key={line.service.slug}
                className="text-sm pb-3 border-b border-border last:border-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug truncate">
                      {line.service.name}
                    </p>
                    {line.scope && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {line.scope.label}
                      </p>
                    )}
                    {line.addOnIds.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {line.addOnIds.length} add-on
                        {line.addOnIds.length === 1 ? '' : 's'}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {line.oneTimeCents > 0 && (
                      <div className="font-semibold tabular-nums">
                        {formatUsd(line.oneTimeCents)}
                      </div>
                    )}
                    {line.recurringCents > 0 && (
                      <div className="text-xs font-semibold text-primary tabular-nums">
                        {formatUsd(line.recurringCents)}/mo
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeService(line.service.slug)}
                    aria-label={`Remove ${line.service.name}`}
                    className="shrink-0 -mt-1 -mr-1 p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            {quote.oneTimeTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  One-time build total
                </span>
                <span className="font-bold tabular-nums">
                  {formatUsd(quote.oneTimeTotal)}
                </span>
              </div>
            )}
            {quote.recurringTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Monthly retainer total
                </span>
                <span className="font-bold tabular-nums text-primary">
                  {formatUsd(quote.recurringTotal)}/mo
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground/80 leading-relaxed">
            <strong className="text-primary">Lock this in for $50.</strong>{' '}
            Refundable deposit. Books your kickoff call and locks the
            quote for 30 days.
          </div>
        </>
      )}
    </aside>
  )
}
