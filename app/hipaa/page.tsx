import type { Metadata } from 'next'
import { HIPAALanding } from './hipaa-landing'

export const metadata: Metadata = {
  title: 'HIPAA Compliance Scanner + AI Report | 15-min Delivery | From $149',
  description:
    'Free 51-point HIPAA Security Rule scan for any healthcare website. Paid AI-written report with rule-cited findings, pasteable developer fixes, and a 2026 NPRM overlay — delivered in 15 minutes. $149 to $899. No discovery calls.',
  keywords: [
    'HIPAA compliance scanner',
    'HIPAA compliance audit',
    'HIPAA readiness assessment',
    'HIPAA website audit',
    'HIPAA risk assessment',
    'HIPAA security rule check',
    'HIPAA gap analysis',
    'HIPAA compliance report',
    'HIPAA remediation plan',
    'HIPAA 2026 NPRM',
    'HIPAA MFA requirement',
    'HIPAA encryption at rest',
    'HIPAA penalty avoidance',
    'HIPAA business associate',
    'HIPAA covered entity audit',
    'HIPAA Security Rule 164.312',
    'HIPAA ePHI protection',
    'OCR HIPAA audit preparation',
    'healthcare website security',
    'patient portal HIPAA compliance',
    'telehealth HIPAA check',
    'medical website HIPAA scanner',
    'HIPAA attestation checklist',
    'HIPAA developer fix guide',
    'HIPAA dev security checklist',
    'healthcare compliance software',
    'HITECH breach notification',
  ],
  alternates: { canonical: 'https://rocketopp.com/hipaa' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: 'HIPAA Compliance Scanner + AI Report · From $149 · 15-min delivery',
    description:
      '51-point automated HIPAA compliance scan + AI-written remediation report. Rule-cited findings, pasteable developer fixes, 2026 NPRM overlay. Delivered in 15 minutes.',
    url: 'https://rocketopp.com/hipaa',
    type: 'website',
    images: [
      { url: 'https://rocketopp.com/images/rocketopp-og.png', width: 1200, height: 630, alt: 'RocketOpp HIPAA Compliance Scanner' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HIPAA Compliance Scanner + AI Report · From $149',
    description: 'Free 51-point HIPAA scan. AI-written report in 15 minutes. Rule-cited. Dev fixes. 2026 NPRM overlay.',
  },
}

// ---------------------------------------------------------------------------
// JSON-LD bundle — Organization, Service, Product × 4, FAQ × 16, Breadcrumb.
// ---------------------------------------------------------------------------

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'RocketOpp HIPAA Compliance Scanner and AI Report',
  serviceType: 'HIPAA compliance assessment and remediation report',
  provider: {
    '@type': 'Organization',
    name: 'RocketOpp',
    url: 'https://rocketopp.com',
    sameAs: [
      'https://linkedin.com/company/rocketopp',
      'https://0nmcp.com',
    ],
  },
  areaServed: { '@type': 'Country', name: 'United States' },
  audience: { '@type': 'Audience', audienceType: 'Healthcare covered entities and business associates' },
  offers: [
    {
      '@type': 'Offer',
      name: 'Tier 1 — Cited Issues',
      price: '149.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://rocketopp.com/hipaa#pricing',
    },
    {
      '@type': 'Offer',
      name: 'Tier 2 — Developer Fix Kit',
      price: '399.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://rocketopp.com/hipaa#pricing',
    },
    {
      '@type': 'Offer',
      name: 'Tier 3 — NPRM Overview',
      price: '499.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://rocketopp.com/hipaa#pricing',
    },
    {
      '@type': 'Offer',
      name: 'Tier 4 — Full Compliance',
      price: '899.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://rocketopp.com/hipaa#pricing',
    },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rocketopp.com' },
    { '@type': 'ListItem', position: 2, name: 'HIPAA Compliance Scanner', item: 'https://rocketopp.com/hipaa' },
  ],
}

const productJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'HIPAA Compliance Report · Cited Issues (Tier 1)',
    description: 'AI-written HIPAA Security Rule compliance report with rule-cited findings and plain-English explanations. 45 CFR §164 citations. Delivered in 15 minutes.',
    brand: { '@type': 'Organization', name: 'RocketOpp' },
    category: 'Healthcare compliance',
    offers: { '@type': 'Offer', price: '149.00', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://rocketopp.com/hipaa' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '212' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'HIPAA Compliance Report · Developer Fix Kit (Tier 2)',
    description: 'Tier 1 content plus pasteable developer remediation steps with real code fences, stack detection, and verification commands. 15-minute delivery.',
    brand: { '@type': 'Organization', name: 'RocketOpp' },
    category: 'Healthcare compliance',
    offers: { '@type': 'Offer', price: '399.00', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://rocketopp.com/hipaa' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '188' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'HIPAA Compliance Report · 2026 NPRM Overview (Tier 3)',
    description: 'Tier 1 content plus 2026 NPRM overlay per finding. Side-by-side current rule vs. proposed rule analysis with business-impact guidance.',
    brand: { '@type': 'Organization', name: 'RocketOpp' },
    category: 'Healthcare compliance',
    offers: { '@type': 'Offer', price: '499.00', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://rocketopp.com/hipaa' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '146' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'HIPAA Compliance Report · Full Compliance (Tier 4)',
    description: 'Everything above plus developer fix kit, 2026 NPRM overlay, attestation checklist, and a 60-day free support call with a compliance engineer.',
    brand: { '@type': 'Organization', name: 'RocketOpp' },
    category: 'Healthcare compliance',
    offers: {
      '@type': 'Offer',
      price: '899.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://rocketopp.com/hipaa',
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '427' },
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What exactly does the HIPAA scanner check?',
      acceptedAnswer: { '@type': 'Answer', text: '51 automated checks across five categories — transport security, privacy disclosures, security headers, authentication controls, data exposure — with every check mapped to a specific 45 CFR §164 section.' },
    },
    {
      '@type': 'Question',
      name: 'Is the scan safe to run on a production healthcare site?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The scan is entirely passive — only standard HTTP GET and HEAD requests. It never logs in, submits forms, or touches patient data. No credentials required. No ePHI is ever accessed.' },
    },
    {
      '@type': 'Question',
      name: 'How much does a HIPAA compliance report cost?',
      acceptedAnswer: { '@type': 'Answer', text: 'Four tiers: Tier 1 Cited Issues at $149, Tier 2 Developer Fix Kit at $399, Tier 3 NPRM Overview at $499, Tier 4 Full Compliance at $899. All tiers are one-time payments with 15-minute delivery.' },
    },
    {
      '@type': 'Question',
      name: 'How fast is the 15-minute delivery?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most reports generate in 45 to 90 seconds. The 15-minute SLA is the ceiling — if the AI pipeline stalls we still deliver inside 15 minutes or refund the order.' },
    },
    {
      '@type': 'Question',
      name: 'What is the HIPAA 2026 NPRM?',
      acceptedAnswer: { '@type': 'Answer', text: 'A proposed overhaul to the HIPAA Security Rule published by HHS. It eliminates the addressable specification category, mandates MFA for all ePHI access, requires encryption at rest, adds biennial penetration tests and six-month vulnerability scans, and tightens breach notification. Estimated compliance deadline: January 2027.' },
    },
    {
      '@type': 'Question',
      name: 'What are HIPAA penalty amounts in 2026?',
      acceptedAnswer: { '@type': 'Answer', text: 'Civil penalties range from $141 per violation (Tier 1) to $2,134,831 per violation per year (Tier 4 — willful neglect, uncorrected). Criminal penalties for knowing ePHI disclosure reach up to 10 years imprisonment. Average 2025 settlement: $275,000.' },
    },
    {
      '@type': 'Question',
      name: 'Who should get a HIPAA compliance scan?',
      acceptedAnswer: { '@type': 'Answer', text: 'Any covered entity (hospitals, clinics, health plans, clearinghouses), any business associate (billing companies, IT providers, telehealth platforms, revenue-cycle vendors, cloud hosts), and any subcontractor that touches ePHI.' },
    },
    {
      '@type': 'Question',
      name: 'Does this replace a Security Risk Analysis (SRA)?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. The report documents the web-facing portion of your risk analysis and demonstrates ongoing monitoring — a required evidence artifact under 45 CFR §164.308(a)(1)(ii)(A). It does not replace a full SRA of internal systems, but it is the right first piece of the binder.' },
    },
    {
      '@type': 'Question',
      name: 'What stacks do the developer fixes support?',
      acceptedAnswer: { '@type': 'Answer', text: 'Next.js, React, Nuxt, Vue, Angular, Django, Rails, Laravel, Apache, Nginx, IIS, Cloudflare, AWS, Vercel, Netlify, WordPress, Drupal, and legacy PHP. Vendor-agnostic fallback uses curl verification commands that work on any stack.' },
    },
    {
      '@type': 'Question',
      name: 'Can I rescan my site after remediation?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — the 51-point scan is always free. Run it before and after remediation to confirm closure. Follow-up paid reports are 25% off for 12 months after the original order.' },
    },
    {
      '@type': 'Question',
      name: 'How does the 60-day free support call work (Tier 4)?',
      acceptedAnswer: { '@type': 'Answer', text: 'Tier 4 includes a 30-minute working session with a compliance engineer booked via the RocketOpp calendar. You have 60 days after delivery to book. We show up prepped with your report open and walk every finding line by line.' },
    },
    {
      '@type': 'Question',
      name: 'Do you retain my scan data?',
      acceptedAnswer: { '@type': 'Answer', text: 'We keep the assessment row for 90 days to support rescans and audit-evidence requests. Paid reports are retained indefinitely under your account. No patient data is collected. We never sell or share data with third parties.' },
    },
    {
      '@type': 'Question',
      name: 'What if the scanner finds no issues?',
      acceptedAnswer: { '@type': 'Answer', text: 'Your Cited Issues section is short and your attestation checklist finishes in 20 minutes. You still get the NPRM overlay (Tier 3+) and the documented assessment artifact for your OCR binder. A clean scan is an evidence-ready defensible document.' },
    },
    {
      '@type': 'Question',
      name: 'Is there a white-label or partner program?',
      acceptedAnswer: { '@type': 'Answer', text: 'Partner program opens Q3 2026 for compliance consultancies and MSPs. Discounted bulk tokens, co-branded reports, API access. Email mike@rocketopp.com to join the early-access list.' },
    },
    {
      '@type': 'Question',
      name: 'What do I do if a finding is incorrect?',
      acceptedAnswer: { '@type': 'Answer', text: 'Every finding cites a rule section and a scanner observation. If either is factually wrong, reply to your delivery email and we correct the report inside 24 hours at no charge.' },
    },
    {
      '@type': 'Question',
      name: 'Do you cover state laws that stack on HIPAA (CMIA, 201 CMR 17, TMRPA)?',
      acceptedAnswer: { '@type': 'Answer', text: 'California CMIA and Massachusetts 201 CMR 17 are live on the Full Compliance tier as of April 2026. Texas TMRPA, New York SHIELD Act, and HIPAA-preempting state carve-outs are rolling in throughout 2026.' },
    },
  ],
}

export default function HIPAAPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {productJsonLd.map((p, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(p) }} />
      ))}
      <HIPAALanding />
    </>
  )
}
