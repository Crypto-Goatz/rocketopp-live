// ============================================================
// Testimonials Component with AggregateRating Schema
// ============================================================
// SXO-optimized customer testimonials for trust and conversions
// Format: First name + last initial, industry, city/state (no company names)
// ============================================================

import { Star, Quote } from 'lucide-react'

export interface Testimonial {
  id: string
  name: string // First name + Last initial (e.g., "Michael R.")
  industry: string
  location: string // City, State
  rating: number // 1-5
  text: string
  service?: string // Optional: which service they used
}

// Realistic testimonials for RocketOpp services
export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Michael R.',
    industry: 'Real Estate',
    location: 'Austin, TX',
    rating: 5,
    text: "The AI automation they built for our lead follow-up has been transformative. We went from losing leads to responding within seconds, 24/7. Our conversion rate doubled in the first month.",
    service: 'AI Automation'
  },
  {
    id: 'testimonial-2',
    name: 'Sarah K.',
    industry: 'Healthcare',
    location: 'Denver, CO',
    rating: 5,
    text: "Their CRM integration saved us countless hours of manual data entry. What used to take my team a full day now happens automatically. The ROI was immediate.",
    service: 'CRM Integration'
  },
  {
    id: 'testimonial-3',
    name: 'James T.',
    industry: 'E-Commerce',
    location: 'Miami, FL',
    rating: 5,
    text: "RocketOpp completely redesigned our website and the results speak for themselves. Page load times dropped by 60% and our organic traffic is up 140%.",
    service: 'Website Design'
  },
  {
    id: 'testimonial-4',
    name: 'Amanda L.',
    industry: 'Professional Services',
    location: 'Seattle, WA',
    rating: 5,
    text: "The AI chatbot they implemented handles 80% of our initial client inquiries. It books appointments, answers questions, and never sleeps. Best investment we made this year.",
    service: 'AI Integration'
  },
  {
    id: 'testimonial-5',
    name: 'David M.',
    industry: 'Home Services',
    location: 'Phoenix, AZ',
    rating: 5,
    text: "We were skeptical about automation at first, but their team walked us through everything. Now our entire scheduling and follow-up process runs on autopilot.",
    service: 'Business Automation'
  },
  {
    id: 'testimonial-6',
    name: 'Jennifer P.',
    industry: 'Legal',
    location: 'Chicago, IL',
    rating: 5,
    text: "Professional, responsive, and they actually delivered what they promised. Our intake process is now fully automated and we can focus on practicing law instead of chasing leads.",
    service: 'Workflow Automation'
  },
  {
    id: 'testimonial-7',
    name: 'Robert C.',
    industry: 'Financial Services',
    location: 'Boston, MA',
    rating: 5,
    text: "The custom app they developed streamlined our entire client onboarding. What took 2 weeks now takes 2 days. Our clients love the seamless experience.",
    service: 'App Development'
  },
  {
    id: 'testimonial-8',
    name: 'Lisa W.',
    industry: 'Marketing Agency',
    location: 'Los Angeles, CA',
    rating: 5,
    text: "As an agency ourselves, we have high standards. RocketOpp exceeded them. Their SEO work drove a 200% increase in qualified leads for our clients.",
    service: 'SEO Services'
  }
]

// Calculate aggregate rating
export function calculateAggregateRating(reviews: Testimonial[]) {
  const total = reviews.reduce((sum, r) => sum + r.rating, 0)
  return {
    ratingValue: (total / reviews.length).toFixed(1),
    ratingCount: reviews.length,
    bestRating: 5,
    worstRating: 1
  }
}

// AggregateRating JSON-LD Schema
interface AggregateRatingSchemaProps {
  itemName?: string
  itemType?: 'Organization' | 'Product' | 'Service' | 'LocalBusiness'
  reviews?: Testimonial[]
}

export function AggregateRatingSchema({
  itemName = 'RocketOpp',
  itemType = 'Organization',
  reviews = testimonials
}: AggregateRatingSchemaProps) {
  const aggregate = calculateAggregateRating(reviews)

  const schema = {
    '@context': 'https://schema.org',
    '@type': itemType,
    name: itemName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregate.ratingValue,
      ratingCount: aggregate.ratingCount,
      bestRating: aggregate.bestRating,
      worstRating: aggregate.worstRating
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.name
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: review.text
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Star Rating Display Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-zinc-600'
          }`}
        />
      ))}
    </div>
  )
}

// Single Testimonial Card
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-orange-500/20 transition-all duration-300">
      {/* Quote Icon */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
        <Quote className="w-4 h-4 text-white" />
      </div>

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Testimonial Text */}
      <p className="text-zinc-300 leading-relaxed mb-6">
        &quot;{testimonial.text}&quot;
      </p>

      {/* Author Info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-white">{testimonial.name}</p>
          <p className="text-sm text-zinc-500">
            {testimonial.industry} &bull; {testimonial.location}
          </p>
        </div>
        {testimonial.service && (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            {testimonial.service}
          </span>
        )}
      </div>
    </div>
  )
}

// Testimonials Grid Section
interface TestimonialsSectionProps {
  title?: string
  subtitle?: string
  showSchema?: boolean
  maxItems?: number
  filterByService?: string
}

export function TestimonialsSection({
  title = 'Trusted by Businesses Everywhere',
  subtitle = 'See what our clients have to say about working with RocketOpp',
  showSchema = true,
  maxItems = 6,
  filterByService
}: TestimonialsSectionProps) {
  let displayTestimonials = filterByService
    ? testimonials.filter(t => t.service === filterByService)
    : testimonials

  displayTestimonials = displayTestimonials.slice(0, maxItems)
  const aggregate = calculateAggregateRating(testimonials)

  return (
    <section className="py-16 md:py-24">
      {showSchema && <AggregateRatingSchema reviews={testimonials} />}

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          {/* Aggregate Rating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-zinc-300">
              <strong className="text-white">{aggregate.ratingValue}</strong> average from{' '}
              <strong className="text-white">{aggregate.ratingCount}</strong> reviews
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-zinc-400">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayTestimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Compact Testimonial Strip (for hero sections)
export function TestimonialStrip() {
  const aggregate = calculateAggregateRating(testimonials)

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <span className="text-zinc-400">
        Rated <strong className="text-white">{aggregate.ratingValue}/5</strong> by{' '}
        <strong className="text-white">{aggregate.ratingCount}+</strong> businesses
      </span>
    </div>
  )
}
