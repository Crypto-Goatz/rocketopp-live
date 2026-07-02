'use client'

/**
 * /services — high-conversion, animated services grid.
 *
 * Two conversion paths, either of which is a win:
 *   1. Click a service card → capture modal (first name + email) → we tag the
 *      CRM contact, stamp the "Service Interested in" custom field, then route
 *      them to that service's detail page to pick options.
 *   2. Hero lead form → "not sure which?" → general lead + nudge to /recommend.
 *
 * Every capture POSTs /api/leads, which upserts the CRM contact, adds the
 * service tag, and writes the "Service Interested in" custom field (latest
 * interest wins).
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Globe,
  Cpu,
  Search,
  Target,
  BarChart3,
  Terminal,
  ArrowRight,
  Clock,
  X,
  Loader2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

interface Service {
  slug: string
  name: string
  description: string
  price: string
  shipsIn: string
  href: string
  icon: LucideIcon
  crmTag: string
  outcome: string
}

const SERVICES: Service[] = [
  {
    slug: 'website-development',
    name: 'Website Development',
    description: 'Custom AI-powered websites. Mobile-first, SEO-baked, conversion-focused. Live in 2 weeks.',
    price: 'From $2,497',
    shipsIn: '2 weeks',
    href: '/services/website-development',
    icon: Globe,
    crmTag: 'product-website-development',
    outcome: '3× organic traffic in 90 days',
  },
  {
    slug: 'ai-automation',
    name: 'AI Business Automation',
    description: 'Custom AI systems for customer service, lead qualification, content, and ops — built on 0nMCP.',
    price: 'From $2,997',
    shipsIn: '2 weeks',
    href: '/services/ai-automation',
    icon: Cpu,
    crmTag: 'product-ai-automation',
    outcome: '20+ hours/week reclaimed',
  },
  {
    slug: 'sxo',
    name: 'Search Experience Optimization',
    description: 'SEO + UX + conversion in one engine. Get cited by ChatGPT, Claude & Perplexity — not just ranked.',
    price: 'From $997/mo',
    shipsIn: 'Ongoing',
    href: '/services/sxo',
    icon: Search,
    crmTag: 'product-sxo',
    outcome: 'Cited by AI search engines',
  },
  {
    slug: 'crm-automation',
    name: 'CRM Automation',
    description: 'Full CRM build — pipelines, email/SMS sequences, booking, lead scoring, and tag-based routing.',
    price: 'From $1,497',
    shipsIn: '1 week',
    href: '/services/crm-automation',
    icon: Target,
    crmTag: 'product-crm-automation',
    outcome: 'Zero leads dropped, ever',
  },
  {
    slug: 'ppc-management',
    name: 'PPC & Paid Ads',
    description: 'Google, Meta & LinkedIn ads — AI-managed, CRO9-optimized, with real revenue attribution.',
    price: 'From $797/mo',
    shipsIn: 'Ongoing',
    href: '/services/ppc-management',
    icon: BarChart3,
    crmTag: 'product-ppc',
    outcome: 'CAC down month over month',
  },
  {
    slug: 'mcp-integration',
    name: 'MCP Server Integration',
    description: 'Connect your business to 1,640+ tools across 109 services. One integration, unlimited automation.',
    price: 'From $1,997',
    shipsIn: '1 week',
    href: '/services/mcp-integration',
    icon: Terminal,
    crmTag: 'product-mcp-integration',
    outcome: 'AI that actually does the work',
  },
]

const SERVICE_FIELD = 'Service Interested in'

export default function ServicesConversion() {
  const router = useRouter()
  const [active, setActive] = useState<Service | null>(null)

  // Hero "not sure" lead form.
  const [heroName, setHeroName] = useState('')
  const [heroEmail, setHeroEmail] = useState('')
  const [heroState, setHeroState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [heroError, setHeroError] = useState<string | null>(null)

  const submitHero = async (e: React.FormEvent) => {
    e.preventDefault()
    setHeroError(null)
    if (!heroName || !heroEmail) {
      setHeroError('First name and email, please.')
      return
    }
    setHeroState('loading')
    try {
      await postLead({
        firstName: heroName,
        email: heroEmail,
        service: 'Not sure yet — wants a recommendation',
        formName: 'Services — Free Recommendation',
        source: 'rocketopp-services-page',
        tags: ['services-page-lead', 'needs-recommendation'],
        customFields: { [SERVICE_FIELD]: 'Undecided (requested recommendation)' },
      })
      setHeroState('done')
    } catch {
      // Non-blocking: still guide them forward.
      setHeroState('done')
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-14 md:pt-32">
        <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Transparent pricing · No discovery calls
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl md:text-6xl font-bold mb-5"
            >
              Pick the system that grows your business
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Six proven services, priced in the open. Tap one to see your
              options — or tell us where you're stuck and we'll point you to the
              fastest win.
            </motion.p>

            {/* Hero lead form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 max-w-xl mx-auto"
            >
              {heroState === 'done' ? (
                <div className="card-lifted p-5 flex items-center gap-3 justify-center text-left">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">You're in, {heroName.split(' ')[0]}.</p>
                    <p className="text-sm text-muted-foreground">
                      Want an instant match?{' '}
                      <Link href="/recommend" className="text-primary font-medium hover:underline">
                        Run the 60-second service finder →
                      </Link>
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={submitHero}
                  className="card-lifted p-2 flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    placeholder="First name"
                    className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                  <input
                    type="email"
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                  <button
                    type="submit"
                    disabled={heroState === 'loading'}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[0_0_24px_rgba(255,107,53,0.35)] hover:scale-[1.02] transition-transform disabled:opacity-60"
                  >
                    {heroState === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Help me choose <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
              {heroError && (
                <p className="text-sm text-destructive mt-2">{heroError}</p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {SERVICES.map((svc) => {
              const Icon = svc.icon
              return (
                <motion.button
                  key={svc.slug}
                  type="button"
                  onClick={() => setActive(svc)}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="group text-left card-lifted p-6 h-full flex flex-col gap-4 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,107,53,0.22)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      {svc.shipsIn}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {svc.name}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                      {svc.description}
                    </p>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary/90">
                      <Sparkles className="w-3.5 h-3.5" />
                      {svc.outcome}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-lg font-bold text-primary">{svc.price}</span>
                    <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors inline-flex items-center gap-1">
                      Get details <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </motion.div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Not sure which fits?{' '}
            <Link href="/recommend" className="text-primary font-medium hover:underline">
              Try the interactive service finder →
            </Link>
          </p>
        </div>
      </section>

      {/* Capture modal */}
      <AnimatePresence>
        {active && (
          <CaptureModal
            service={active}
            onClose={() => setActive(null)}
            onCaptured={() => router.push(active.href)}
            onSkip={() => router.push(active.href)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── Capture modal ────────────────────────────────────────────────────────────

function CaptureModal({
  service,
  onClose,
  onCaptured,
  onSkip,
}: {
  service: Service
  onClose: () => void
  onCaptured: () => void
  onSkip: () => void
}) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const Icon = service.icon

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!firstName || !email) {
      setError('First name and email, please.')
      return
    }
    setLoading(true)
    try {
      await postLead({
        firstName,
        email,
        service: service.name,
        formName: `Services — ${service.name}`,
        source: 'rocketopp-services-page',
        tags: ['services-page-lead', service.crmTag, `interest-${service.slug}`],
        customFields: { [SERVICE_FIELD]: service.name },
      })
    } catch {
      // Non-blocking — we still send them to the service page.
    } finally {
      onCaptured()
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative w-full max-w-md card-lifted-xl p-6"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {service.price} · {service.shipsIn}
            </p>
            <h3 className="text-lg font-bold leading-tight">{service.name}</h3>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-5">
          Drop your name and email — we'll take you straight to the full
          breakdown and options, and make sure you get the details.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            autoFocus
            className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-bold text-primary-foreground shadow-[0_0_24px_rgba(255,107,53,0.35)] hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Taking you there…
              </>
            ) : (
              <>
                Show me {service.name.split(' ')[0]} options
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <button
          onClick={onSkip}
          className="w-full text-center text-xs text-muted-foreground hover:text-primary mt-3"
        >
          Skip — just view the page →
        </button>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5" />
          No spam. We'll only follow up about {service.name}.
        </p>
      </motion.div>
    </motion.div>
  )
}

// ── Lead POST helper ─────────────────────────────────────────────────────────

async function postLead(payload: {
  firstName: string
  email: string
  service: string
  formName: string
  source: string
  tags: string[]
  customFields: Record<string, string>
}) {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      pageUrl: typeof window !== 'undefined' ? window.location.href : 'https://rocketopp.com/services',
    }),
  })
  if (!res.ok) throw new Error('lead post failed')
  return res.json()
}
