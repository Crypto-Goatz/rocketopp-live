'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Loader2,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import {
  useOrderStore,
  calculateQuote,
  type SelectedService,
} from '@/lib/order/order-store'
import {
  SERVICES,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  servicesByCategory,
  formatUsd,
  type CatalogService,
} from '@/lib/order/services-catalog'

// ────────────────────────────────────────────────────────────────────────────
// Step 1 — pick services (multi-select grouped by category)
// ────────────────────────────────────────────────────────────────────────────

function StepPickServices() {
  const selected = useOrderStore((s) => s.selected)
  const toggleService = useOrderStore((s) => s.toggleService)

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
          Step 1 of 5
        </p>
        <h2 className="text-2xl md:text-3xl font-bold">
          What do you need built?
        </h2>
        <p className="text-muted-foreground mt-2">
          Pick everything that applies. Your quote builds on the right as you
          select.
        </p>
      </header>

      {CATEGORY_ORDER.map((cat) => {
        const items = servicesByCategory(cat)
        if (items.length === 0) return null
        return (
          <section key={cat}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              {CATEGORY_LABELS[cat]}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((svc) => {
                const isSelected = selected.some((x) => x.slug === svc.slug)
                return (
                  <button
                    key={svc.slug}
                    type="button"
                    onClick={() => toggleService(svc.slug)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-primary/60 bg-primary/[0.06] shadow-[0_0_24px_-12px_rgba(255,107,53,0.4)]'
                        : 'border-border bg-card/30 hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-tight">
                          {svc.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {svc.shortPitch}
                        </p>
                      </div>
                      <div
                        className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-primary border-primary'
                            : 'border-border'
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-primary tabular-nums">
                        {svc.basePriceLabel}
                        <span className="text-xs font-normal text-muted-foreground">
                          {svc.basePriceSuffix}
                        </span>
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {svc.shipsIn}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Step 2 — scope (per-service radio choice for services that have scopeOptions)
// ────────────────────────────────────────────────────────────────────────────

function StepScope() {
  const selected = useOrderStore((s) => s.selected)
  const setScope = useOrderStore((s) => s.setScope)

  const withScope = selected
    .map((sel) => ({
      sel,
      svc: SERVICES.find((s) => s.slug === sel.slug)!,
    }))
    .filter((x) => x.svc?.scopeOptions && x.svc.scopeOptions.length > 0)

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
          Step 2 of 5
        </p>
        <h2 className="text-2xl md:text-3xl font-bold">Scope each one.</h2>
        <p className="text-muted-foreground mt-2">
          Tell us how big or how often. Your quote updates instantly.
        </p>
      </header>

      {withScope.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          Nothing to scope — your selections are flat-priced. Continue to add-ons.
        </p>
      ) : (
        withScope.map(({ sel, svc }) => (
          <ScopeBlock
            key={svc.slug}
            svc={svc}
            scopeId={sel.scopeId}
            onChange={(id) => setScope(svc.slug, id)}
          />
        ))
      )}
    </div>
  )
}

function ScopeBlock({
  svc,
  scopeId,
  onChange,
}: {
  svc: CatalogService
  scopeId?: string
  onChange: (id: string) => void
}) {
  return (
    <section className="card-lifted p-5">
      <h3 className="font-bold mb-3">{svc.name}</h3>
      <div className="space-y-2">
        {svc.scopeOptions?.map((opt) => (
          <label
            key={opt.id}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              scopeId === opt.id
                ? 'border-primary/50 bg-primary/5'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <input
              type="radio"
              name={`scope-${svc.slug}`}
              checked={scopeId === opt.id}
              onChange={() => onChange(opt.id)}
              className="mt-1 accent-primary"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{opt.label}</span>
                <span className="text-sm font-semibold text-primary tabular-nums shrink-0">
                  {opt.priceLabel ||
                    (opt.delta === 0 ? 'Included' : `+${formatUsd(opt.delta)}`)}
                </span>
              </div>
              {opt.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {opt.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Step 3 — add-ons
// ────────────────────────────────────────────────────────────────────────────

function StepAddOns() {
  const selected = useOrderStore((s) => s.selected)
  const toggleAddOn = useOrderStore((s) => s.toggleAddOn)

  const withAddOns = selected
    .map((sel) => ({ sel, svc: SERVICES.find((s) => s.slug === sel.slug)! }))
    .filter((x) => x.svc?.addOns && x.svc.addOns.length > 0)

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
          Step 3 of 5
        </p>
        <h2 className="text-2xl md:text-3xl font-bold">Anything to stack on?</h2>
        <p className="text-muted-foreground mt-2">Optional. Skip if you'd rather keep it lean.</p>
      </header>

      {withAddOns.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          No add-ons available for your selections. Continue to your details.
        </p>
      ) : (
        withAddOns.map(({ sel, svc }) => (
          <section key={svc.slug} className="card-lifted p-5">
            <h3 className="font-bold mb-3">{svc.name}</h3>
            <div className="space-y-2">
              {svc.addOns?.map((addOn) => {
                const checked = sel.addOnIds.includes(addOn.id)
                return (
                  <label
                    key={addOn.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      checked
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddOn(svc.slug, addOn.id)}
                      className="mt-1 accent-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-medium">{addOn.label}</span>
                        <span className="text-sm font-semibold text-primary tabular-nums shrink-0">
                          {addOn.priceCents === 0
                            ? 'Included'
                            : addOn.recurring
                              ? `+${formatUsd(addOn.priceCents)}/mo`
                              : `+${formatUsd(addOn.priceCents)}`}
                        </span>
                      </div>
                      {addOn.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {addOn.description}
                        </p>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </section>
        ))
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Step 4 — your details
// ────────────────────────────────────────────────────────────────────────────

function StepDetails() {
  const contact = useOrderStore((s) => s.contact)
  const setContact = useOrderStore((s) => s.setContact)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
          Step 4 of 5
        </p>
        <h2 className="text-2xl md:text-3xl font-bold">Your details.</h2>
        <p className="text-muted-foreground mt-2">
          So we can reach you, lock the quote, and book the kickoff.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full name *</Label>
          <Input
            id="name"
            required
            value={contact.name}
            onChange={(e) => setContact({ name: e.target.value })}
            placeholder="Mike Mento"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={contact.email}
            onChange={(e) => setContact({ email: e.target.value })}
            placeholder="you@company.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={contact.company || ''}
            onChange={(e) => setContact({ company: e.target.value })}
            placeholder="RocketOpp LLC"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={contact.phone || ''}
            onChange={(e) => setContact({ phone: e.target.value })}
            placeholder="+1 555 555 5555"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          value={contact.industry || ''}
          onChange={(e) => setContact({ industry: e.target.value })}
          placeholder="Healthcare / SaaS / Real Estate / etc."
          className="mt-1"
        />
      </div>

      <div>
        <Label className="mb-1 block">Timeline</Label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'asap', label: 'ASAP' },
            { id: '30d', label: '30 days' },
            { id: '60d', label: '60 days' },
            { id: '90d', label: '90 days' },
            { id: 'flexible', label: 'Flexible' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setContact({ timeline: opt.id as never })}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                contact.timeline === opt.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card/30 hover:border-primary/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Anything we should know?</Label>
        <textarea
          id="notes"
          value={contact.notes || ''}
          onChange={(e) => setContact({ notes: e.target.value })}
          placeholder="Constraints, must-haves, integrations, deadlines…"
          rows={4}
          className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Step 5 — review + AI summary + deposit
// ────────────────────────────────────────────────────────────────────────────

function StepReview() {
  const router = useRouter()
  const selected = useOrderStore((s) => s.selected)
  const contact = useOrderStore((s) => s.contact)
  const aiSummary = useOrderStore((s) => s.aiSummary)
  const setAiSummary = useOrderStore((s) => s.setAiSummary)
  const quote = calculateQuote(selected)

  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingDeposit, setLoadingDeposit] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSummary = async () => {
    setLoadingSummary(true)
    setError(null)
    try {
      const res = await fetch('/api/order/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected, contact }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate summary')
      setAiSummary(data.summary)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoadingSummary(false)
    }
  }

  const startDeposit = async () => {
    setLoadingDeposit(true)
    setError(null)
    try {
      const res = await fetch('/api/order/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected,
          contact,
          aiSummary,
          oneTimeTotal: quote.oneTimeTotal,
          recurringTotal: quote.recurringTotal,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url)
        throw new Error(data.error || 'Failed to start deposit')
      window.location.href = data.url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
      setLoadingDeposit(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
          Step 5 of 5
        </p>
        <h2 className="text-2xl md:text-3xl font-bold">Review & lock it in.</h2>
        <p className="text-muted-foreground mt-2">
          A $50 refundable deposit reserves your kickoff slot and locks this
          quote for 30 days.
        </p>
      </header>

      {/* AI quote summary */}
      <div className="card-lifted-xl p-5 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI-generated quote brief
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummary}
            disabled={loadingSummary || quote.lines.length === 0}
          >
            {loadingSummary ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : aiSummary ? (
              'Regenerate'
            ) : (
              'Generate'
            )}
          </Button>
        </div>
        {aiSummary ? (
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
            {aiSummary}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Click Generate to see how Mike's AI will brief the kickoff call —
            outcomes, sequencing, and what we'll deliver first.
          </p>
        )}
      </div>

      {/* Line items + totals */}
      <div className="card-lifted p-5 space-y-3">
        <h3 className="font-bold">Order summary</h3>
        <div className="space-y-2 text-sm">
          {quote.lines.map((line) => (
            <div
              key={line.service.slug}
              className="flex justify-between gap-3 pb-2 border-b border-border last:border-0"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{line.service.name}</p>
                {line.scope && (
                  <p className="text-xs text-muted-foreground">
                    {line.scope.label}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0 tabular-nums">
                {line.oneTimeCents > 0 && (
                  <div className="font-semibold">
                    {formatUsd(line.oneTimeCents)}
                  </div>
                )}
                {line.recurringCents > 0 && (
                  <div className="text-primary font-semibold text-xs">
                    {formatUsd(line.recurringCents)}/mo
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-3 space-y-1 border-t border-border">
          {quote.oneTimeTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">One-time build</span>
              <span className="font-bold tabular-nums">
                {formatUsd(quote.oneTimeTotal)}
              </span>
            </div>
          )}
          {quote.recurringTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly retainer</span>
              <span className="font-bold tabular-nums text-primary">
                {formatUsd(quote.recurringTotal)}/mo
              </span>
            </div>
          )}
          <div className="flex justify-between pt-2 mt-2 border-t border-border text-base">
            <span className="font-bold">Today: refundable deposit</span>
            <span className="font-bold text-primary tabular-nums">$50</span>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        size="lg"
        className="w-full"
        onClick={startDeposit}
        disabled={
          loadingDeposit ||
          quote.lines.length === 0 ||
          !contact.email ||
          !contact.name
        }
      >
        {loadingDeposit ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Redirecting…
          </>
        ) : (
          <>
            Pay $50 refundable deposit
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        After payment you'll be taken to a calendar to schedule the kickoff
        call directly with Mike. No subscription. No surprise charges.
      </p>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Wizard shell
// ────────────────────────────────────────────────────────────────────────────

const STEP_TITLES = [
  'Pick services',
  'Scope',
  'Add-ons',
  'Your details',
  'Review',
] as const

export function OrderWizard() {
  const step = useOrderStore((s) => s.step)
  const next = useOrderStore((s) => s.next)
  const prev = useOrderStore((s) => s.prev)
  const selected = useOrderStore((s) => s.selected)
  const contact = useOrderStore((s) => s.contact)

  const canAdvance = (() => {
    if (step === 1) return selected.length > 0
    if (step === 4) return !!contact.name && !!contact.email
    return true
  })()

  return (
    <div className="space-y-8">
      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {STEP_TITLES.map((title, i) => {
          const num = i + 1
          const isActive = num === step
          const isDone = num < step
          return (
            <div key={title} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isDone
                      ? 'bg-primary/20 text-primary'
                      : 'bg-card text-muted-foreground'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : num}
              </div>
              <span
                className={`hidden md:inline text-xs font-medium ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {title}
              </span>
              {num < STEP_TITLES.length && (
                <div className="w-4 md:w-8 h-px bg-border" />
              )}
            </div>
          )
        })}
      </div>

      {/* Step body */}
      <div>
        {step === 1 && <StepPickServices />}
        {step === 2 && <StepScope />}
        {step === 3 && <StepAddOns />}
        {step === 4 && <StepDetails />}
        {step === 5 && <StepReview />}
      </div>

      {/* Footer nav */}
      {step < 5 && (
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={prev}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={next}
            disabled={!canAdvance}
            size="lg"
            className="gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
