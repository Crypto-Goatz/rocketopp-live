import type { Metadata } from 'next'
import { HIPAALanding } from './hipaa-landing'

export const metadata: Metadata = {
  title: 'Free HIPAA Compliance Scanner — 63-Point Assessment | RocketOpp',
  description:
    'Scan your healthcare website for HIPAA compliance in 30 seconds. 63 automated checks against current Security Rule and proposed 2026 NPRM requirements. Dual scoring, remediation roadmap, and state-specific guidance. Free instant scan.',
  keywords: [
    'HIPAA compliance scanner',
    'HIPAA website audit',
    'HIPAA 2026 NPRM',
    'healthcare website security',
    'HIPAA readiness assessment',
    'HIPAA compliance check',
    'HIPAA security rule assessment',
    'healthcare compliance tool',
    'HIPAA violation prevention',
    'medical website HIPAA audit',
    'HIPAA penalty avoidance',
    'healthcare security headers',
    'ePHI protection audit',
    'HIPAA gap analysis',
    'covered entity compliance',
    'business associate HIPAA check',
  ],
  openGraph: {
    title: 'HIPAA Compliance Scanner — Is Your Healthcare Site Ready?',
    description:
      '51-point automated assessment. Dual scoring against current law and 2026 NPRM. Results in 30 seconds. Remediation roadmap included.',
    url: 'https://rocketopp.com/hipaa',
    type: 'website',
    images: [
      {
        url: 'https://rocketopp.com/images/rocketopp-og.png',
        width: 1200,
        height: 630,
        alt: 'RocketOpp HIPAA Compliance Scanner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HIPAA Compliance Scanner — 51-Point Assessment',
    description:
      'Scan any healthcare website for HIPAA compliance in 30 seconds. Current law + 2026 NPRM scoring. From $149.',
  },
  alternates: {
    canonical: 'https://rocketopp.com/hipaa',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'HIPAA Compliance Scanner',
  description: '51-point automated HIPAA compliance assessment for healthcare websites.',
  url: 'https://rocketopp.com/hipaa',
  provider: {
    '@type': 'Organization',
    name: 'RocketOpp',
    url: 'https://rocketopp.com',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rocketopp.com' },
      { '@type': 'ListItem', position: 2, name: 'HIPAA Scanner', item: 'https://rocketopp.com/hipaa' },
    ],
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a HIPAA compliance scan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A HIPAA compliance scan is a passive, non-invasive assessment of your healthcare website against 51 checks derived from the HIPAA Security Rule (45 CFR Part 164). It evaluates TLS configuration, security headers, privacy disclosures, authentication controls, and data exposure risks without accessing any PHI or submitting any forms.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the HIPAA 2026 NPRM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The 2026 NPRM (Notice of Proposed Rulemaking) is a set of proposed changes to the HIPAA Security Rule published by HHS. Key changes include mandatory MFA for all ePHI access, required encryption at rest, annual vulnerability scans, biennial penetration tests, and elimination of the "addressable" specification category. Organizations have until approximately January 2027 to comply.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a HIPAA compliance scan cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'RocketOpp offers two scan tiers: the Current Law Scan at $149 assesses your site against existing HIPAA Security Rule requirements with full remediation roadmap. The 2026 NPRM Readiness Scan at $249 includes everything in the current law scan plus future-readiness scoring against proposed 2026 changes, giving you a head start on compliance.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the penalties for HIPAA violations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'HIPAA penalties range from $141 to $2,134,831 per violation depending on the tier. Tier 1 (Did Not Know): $141-$71,162. Tier 2 (Reasonable Cause): $1,424-$71,162. Tier 3 (Willful Neglect, Corrected): $14,232-$71,162. Tier 4 (Willful Neglect, Not Corrected): $71,162-$2,134,831. Criminal penalties can include up to 10 years imprisonment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the scan safe for my website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The scan is entirely passive — it only sends standard HTTP GET and HEAD requests, exactly like a web browser. It never attempts to log in, submit forms, access restricted areas, or interact with any PHI. No credentials are required and no patient data is ever accessed or collected.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who needs a HIPAA compliance scan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Any organization that handles electronic Protected Health Information (ePHI) should regularly scan their web presence. This includes covered entities (hospitals, clinics, health plans, clearinghouses), business associates (billing companies, IT providers, cloud hosts), and their subcontractors. If you have a patient portal, telehealth platform, or healthcare website, you need this scan.',
      },
    },
  ],
}

const productJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'HIPAA Current Law Compliance Scan',
    description: '51-point assessment against current HIPAA Security Rule with full remediation roadmap.',
    brand: { '@type': 'Organization', name: 'RocketOpp' },
    offers: {
      '@type': 'Offer',
      price: '149.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://rocketopp.com/hipaa',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'HIPAA 2026 NPRM Readiness Scan',
    description: 'Current law assessment plus 2026 NPRM future-readiness scoring with full remediation roadmap.',
    brand: { '@type': 'Organization', name: 'RocketOpp' },
    offers: {
      '@type': 'Offer',
      price: '249.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://rocketopp.com/hipaa',
    },
  },
]

export default function HIPAAPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {productJsonLd.map((p, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(p) }} />
      ))}
      <HIPAALanding />
    </>
  )
}
