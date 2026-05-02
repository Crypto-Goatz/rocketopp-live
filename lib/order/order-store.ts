/**
 * Order wizard state — Zustand with sessionStorage persist (loses on close,
 * which is fine: we don't want stale quotes lingering).
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SERVICES, type CatalogService, type ScopeOption } from './services-catalog'

export interface SelectedService {
  slug: string
  /** Selected scope option id, if the service has scopeOptions. */
  scopeId?: string
  /** Selected add-on ids. */
  addOnIds: string[]
}

export interface OrderContact {
  name: string
  email: string
  company?: string
  phone?: string
  industry?: string
  timeline?: 'asap' | '30d' | '60d' | '90d' | 'flexible'
  notes?: string
}

interface OrderState {
  step: 1 | 2 | 3 | 4 | 5
  selected: SelectedService[]
  contact: OrderContact
  /** Server-generated AI quote summary (filled at step 4). */
  aiSummary?: string

  setStep: (step: OrderState['step']) => void
  next: () => void
  prev: () => void

  toggleService: (slug: string) => void
  setScope: (slug: string, scopeId: string) => void
  toggleAddOn: (slug: string, addOnId: string) => void
  removeService: (slug: string) => void

  setContact: (patch: Partial<OrderContact>) => void
  setAiSummary: (text: string) => void
  reset: () => void
}

const initialContact: OrderContact = {
  name: '',
  email: '',
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      step: 1,
      selected: [],
      contact: initialContact,

      setStep: (step) => set({ step }),
      next: () =>
        set((s) => ({ step: (Math.min(s.step + 1, 5) as OrderState['step']) })),
      prev: () =>
        set((s) => ({ step: (Math.max(s.step - 1, 1) as OrderState['step']) })),

      toggleService: (slug) =>
        set((s) => {
          const exists = s.selected.find((x) => x.slug === slug)
          if (exists) {
            return { selected: s.selected.filter((x) => x.slug !== slug) }
          }
          // Default to first scope option, if any
          const svc = SERVICES.find((x) => x.slug === slug)
          const scopeId = svc?.scopeOptions?.[0]?.id
          return {
            selected: [
              ...s.selected,
              { slug, scopeId, addOnIds: [] },
            ],
          }
        }),

      setScope: (slug, scopeId) =>
        set((s) => ({
          selected: s.selected.map((x) =>
            x.slug === slug ? { ...x, scopeId } : x,
          ),
        })),

      toggleAddOn: (slug, addOnId) =>
        set((s) => ({
          selected: s.selected.map((x) => {
            if (x.slug !== slug) return x
            const has = x.addOnIds.includes(addOnId)
            return {
              ...x,
              addOnIds: has
                ? x.addOnIds.filter((id) => id !== addOnId)
                : [...x.addOnIds, addOnId],
            }
          }),
        })),

      removeService: (slug) =>
        set((s) => ({ selected: s.selected.filter((x) => x.slug !== slug) })),

      setContact: (patch) =>
        set((s) => ({ contact: { ...s.contact, ...patch } })),

      setAiSummary: (text) => set({ aiSummary: text }),

      reset: () =>
        set({
          step: 1,
          selected: [],
          contact: initialContact,
          aiSummary: undefined,
        }),
    }),
    {
      name: 'rocketopp-order-v1',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

// ────────────────────────────────────────────────────────────────────────────
// Quote calculation — pure, used by the right-side panel
// ────────────────────────────────────────────────────────────────────────────

export interface QuoteLine {
  service: CatalogService
  scope?: ScopeOption
  addOnIds: string[]
  /** One-time cost in cents (build, deposits, etc.) */
  oneTimeCents: number
  /** Recurring monthly cost in cents (retainers + recurring add-ons). */
  recurringCents: number
}

export interface Quote {
  lines: QuoteLine[]
  oneTimeTotal: number
  recurringTotal: number
}

export function calculateQuote(selected: SelectedService[]): Quote {
  const lines: QuoteLine[] = []
  let oneTimeTotal = 0
  let recurringTotal = 0

  for (const sel of selected) {
    const service = SERVICES.find((s) => s.slug === sel.slug)
    if (!service) continue
    const scope = service.scopeOptions?.find((o) => o.id === sel.scopeId)

    // Compute the "main" price for this service.
    let mainCents = service.basePriceCents
    if (scope) {
      if (scope.mode === 'replace') mainCents = scope.delta
      else mainCents += scope.delta
    }

    // Bucket the main price by billing.
    const isRecurring = service.billing !== 'flat'
    if (isRecurring) recurringTotal += mainCents
    else oneTimeTotal += mainCents

    let lineOneTime = isRecurring ? 0 : mainCents
    let lineRecurring = isRecurring ? mainCents : 0

    // Add-ons
    for (const addOnId of sel.addOnIds) {
      const addOn = service.addOns?.find((a) => a.id === addOnId)
      if (!addOn) continue
      if (addOn.recurring) {
        recurringTotal += addOn.priceCents
        lineRecurring += addOn.priceCents
      } else {
        oneTimeTotal += addOn.priceCents
        lineOneTime += addOn.priceCents
      }
    }

    lines.push({
      service,
      scope,
      addOnIds: sel.addOnIds,
      oneTimeCents: lineOneTime,
      recurringCents: lineRecurring,
    })
  }

  return { lines, oneTimeTotal, recurringTotal }
}
