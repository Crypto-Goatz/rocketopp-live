// ============================================================
// Lease-to-Own - Revolutionary Software Ownership Model
// ============================================================
// Landing page explaining RocketOpp's innovative lease-to-own model
// ============================================================

import Link from 'next/link'
import {
  Rocket,
  Check,
  ArrowRight,
  DollarSign,
  Calendar,
  Shield,
  Zap,
  Star,
  TrendingUp,
  Sparkles,
  Clock,
  Gift,
  BadgeCheck,
  ChevronRight
} from 'lucide-react'
import type { Metadata } from 'next'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Lease-to-Own AI Software | RocketOpp',
  description: 'Own powerful AI software through affordable monthly payments. No credit checks, no long-term contracts. Make payments and earn ownership - industry first!',
  keywords: 'lease to own software, AI software financing, affordable AI tools, software ownership, AI app payments',
  openGraph: {
    title: 'Lease-to-Own AI Software | RocketOpp',
    description: 'Own powerful AI software through affordable monthly payments. Industry-first ownership model.',
    type: 'website',
    url: 'https://rocketopp.com/marketplace/lease-to-own',
  },
}

const benefits = [
  {
    icon: DollarSign,
    title: 'Affordable Entry',
    description: 'Start using premium AI tools with low monthly payments instead of large upfront costs'
  },
  {
    icon: Calendar,
    title: 'Build Ownership',
    description: 'Every payment builds equity. After 12-24 months, the software is yours forever'
  },
  {
    icon: Shield,
    title: 'No Credit Check',
    description: 'No credit applications, no financing approvals. Just pay and use immediately'
  },
  {
    icon: Zap,
    title: 'Full Features',
    description: 'Get complete access to all features from day one - no feature restrictions'
  },
  {
    icon: Clock,
    title: 'Flexible Terms',
    description: 'Choose payment terms that work for you. Pay faster to own sooner'
  },
  {
    icon: Gift,
    title: 'Ownership Bonus',
    description: 'When you complete payments, get a free upgrade to the next tier'
  }
]

const howItWorks = [
  {
    step: 1,
    title: 'Choose Your App',
    description: 'Browse our marketplace and select the AI application that fits your needs'
  },
  {
    step: 2,
    title: 'Select Lease-to-Own',
    description: 'Choose the lease-to-own option and pick your payment term (12, 18, or 24 months)'
  },
  {
    step: 3,
    title: 'Start Using Immediately',
    description: 'Get instant access to all features while making comfortable monthly payments'
  },
  {
    step: 4,
    title: 'Own It Forever',
    description: 'After completing payments, the software is yours with no recurring fees'
  }
]

const faqs = [
  {
    q: 'How is this different from a subscription?',
    a: 'Subscriptions charge you forever with no end. Lease-to-own has a finish line - once you complete your payments, you own the software permanently with no more monthly fees.'
  },
  {
    q: 'Can I pay off early?',
    a: 'Absolutely! You can make extra payments or pay off your lease early anytime. We actually give you a 10% discount on remaining balance for early payoff.'
  },
  {
    q: 'What happens if I miss a payment?',
    a: 'We understand life happens. You have a 15-day grace period on all payments. After that, your account is paused (not deleted) until payment resumes. Your progress is never lost.'
  },
  {
    q: 'Do I own the updates after I complete payments?',
    a: 'Yes! You own the version you completed payments for, plus you get 12 months of updates included. After that, updates are optional at a reduced rate.'
  },
  {
    q: 'Can I try before I lease?',
    a: 'Most of our products offer a 14-day trial period. Try the full product risk-free before committing to a lease-to-own plan.'
  }
]

export default function LeaseToOwnPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 mb-8">
            <Star className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-white">Industry First</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Own AI Software,
            <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
              One Payment at a Time
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Revolutionary lease-to-own model. Make affordable monthly payments and build ownership.
            No credit checks. No long-term lock-in. Just software that becomes yours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/marketplace"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-orange-500/25"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white font-medium rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              See How It Works
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-white/10">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">$0</p>
              <p className="text-sm text-zinc-500">Credit Check</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">12-24</p>
              <p className="text-sm text-zinc-500">Month Terms</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-sm text-zinc-500">Ownership</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10%</p>
              <p className="text-sm text-zinc-500">Early Payoff Bonus</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Lease-to-Own?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Traditional software licensing means paying forever or huge upfront costs.
              We believe there&apos;s a better way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-orange-500/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-zinc-950/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400">
              Four simple steps to owning your AI software
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                {/* Connector Line */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-orange-500/50 to-transparent" />
                )}

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-zinc-400 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare Your Options
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-left text-zinc-400 font-medium">Feature</th>
                  <th className="px-6 py-4 text-center text-zinc-400 font-medium">Subscription</th>
                  <th className="px-6 py-4 text-center text-zinc-400 font-medium">One-Time Buy</th>
                  <th className="px-6 py-4 text-center text-white font-medium bg-orange-500/10">Lease-to-Own</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="px-6 py-4 text-white">Ownership</td>
                  <td className="px-6 py-4 text-center text-red-400">Never</td>
                  <td className="px-6 py-4 text-center text-green-400">Immediate</td>
                  <td className="px-6 py-4 text-center text-green-400 bg-orange-500/5">After payments</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-white">Upfront Cost</td>
                  <td className="px-6 py-4 text-center text-green-400">Low</td>
                  <td className="px-6 py-4 text-center text-red-400">High</td>
                  <td className="px-6 py-4 text-center text-green-400 bg-orange-500/5">Low</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-white">Long-term Cost</td>
                  <td className="px-6 py-4 text-center text-red-400">Infinite</td>
                  <td className="px-6 py-4 text-center text-green-400">Fixed</td>
                  <td className="px-6 py-4 text-center text-green-400 bg-orange-500/5">Fixed</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-white">Full Features</td>
                  <td className="px-6 py-4 text-center text-green-400">Yes</td>
                  <td className="px-6 py-4 text-center text-green-400">Yes</td>
                  <td className="px-6 py-4 text-center text-green-400 bg-orange-500/5">Yes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-white">Credit Check</td>
                  <td className="px-6 py-4 text-center text-zinc-400">Sometimes</td>
                  <td className="px-6 py-4 text-center text-green-400">No</td>
                  <td className="px-6 py-4 text-center text-green-400 bg-orange-500/5">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-zinc-950/50 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Questions & Answers
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-zinc-900/50 border border-white/5"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-orange-500/10 via-red-500/10 to-purple-500/10 border border-orange-500/20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Own Your AI Future?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Browse our marketplace and find the perfect AI application for your business.
              Start small, own big.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-orange-500/25"
            >
              Explore the Marketplace
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
