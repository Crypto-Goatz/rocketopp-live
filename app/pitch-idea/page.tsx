import type { Metadata } from "next"
import PitchIdeaClient from "./PitchIdeaClient"

export const metadata: Metadata = {
  title: "Submit Your App Idea | Pitch Software Ideas to Developers | RocketOpp",
  description: "Have an app idea? Submit your software concept to RocketOpp's development team. We review every submission, sign NDAs before discussions, and actively seek partnership opportunities. Specializing in AI applications.",
  keywords: [
    "submit app idea",
    "pitch app idea",
    "submit software idea",
    "app idea submission",
    "pitch idea to developers",
    "submit app concept",
    "software idea pitch",
    "app development partnership",
    "pitch software to company",
    "submit mobile app idea",
    "app idea review",
    "where to submit app ideas",
    "companies that accept app ideas",
    "pitch AI app idea",
    "submit SaaS idea",
    "app idea partnership",
    "revenue share app development",
    "co-founder app development",
    "app idea NDA",
    "secure app pitch",
    "submit startup idea",
    "pitch tech idea",
    "software concept submission",
    "app idea evaluation",
    "get app built from idea",
  ].join(", "),
  authors: [{ name: "RocketOpp", url: "https://rocketopp.com" }],
  openGraph: {
    title: "Submit Your App Idea | We Build Ideas Into Reality | RocketOpp",
    description: "Have an app idea? We're actively seeking innovative concepts, especially in AI. NDA protection, partnership opportunities, and expert development team ready to build.",
    url: "https://rocketopp.com/pitch-idea",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/og-pitch-idea.jpg",
        width: 1200,
        height: 630,
        alt: "Submit Your App Idea to RocketOpp",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit Your App Idea | Pitch to RocketOpp",
    description: "We review every app idea submission. NDA protection, AI specialists, and partnership opportunities available.",
    images: ["https://rocketopp.com/twitter-pitch-idea.jpg"],
  },
  alternates: {
    canonical: "https://rocketopp.com/pitch-idea",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Organization Schema
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://rocketopp.com/#organization",
  name: "RocketOpp",
  url: "https://rocketopp.com",
  logo: "https://rocketopp.com/images/rocketopp-logo.png",
  description: "AI-powered software development company that accepts and develops app ideas through partnerships and custom development.",
  telephone: "+1-878-888-1238",
  email: "Mike@rocketopp.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pittsburgh",
    addressRegion: "PA",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.linkedin.com/company/rocketopp",
    "https://twitter.com/rocketopp",
  ],
}

// Service Schema
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "App Idea Submission & Development",
  provider: {
    "@type": "Organization",
    name: "RocketOpp",
    url: "https://rocketopp.com",
  },
  description: "Submit your app idea to RocketOpp for professional evaluation, NDA-protected discussions, and potential partnership or development opportunities. Specializing in AI and innovative software applications.",
  areaServed: "Worldwide",
  serviceType: "Software Development Partnership",
  offers: {
    "@type": "Offer",
    name: "Free Idea Evaluation",
    description: "Free initial evaluation of your app idea with NDA protection",
    price: "0",
    priceCurrency: "USD",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Partnership Options",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Equity Partnership Development",
          description: "We build your app in exchange for equity stake",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Revenue Share Development",
          description: "We build your app with revenue sharing agreement",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Development",
          description: "Full custom development with you as the owner",
        },
      },
    ],
  },
}

// FAQ Schema
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I submit my app idea to RocketOpp?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply fill out our secure submission form with your basic contact information and a brief description of your idea. We'll schedule a call to discuss further details after you've signed our NDA for complete protection of your concept.",
      },
    },
    {
      "@type": "Question",
      name: "Will my app idea be protected with an NDA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Before any detailed discussions about your app idea, we provide a mutual NDA (Non-Disclosure Agreement) for you to review and sign. Your intellectual property protection is our top priority.",
      },
    },
    {
      "@type": "Question",
      name: "What kind of app ideas is RocketOpp interested in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We're particularly interested in AI-powered applications, SaaS platforms, automation tools, and innovative mobile apps. We evaluate ideas based on market potential, technical feasibility, and alignment with our expertise. We welcome ideas at any stage - from napkin sketches to detailed specifications.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer partnership opportunities for app ideas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We offer several partnership models including equity partnerships, revenue sharing agreements, and co-founder arrangements. If your idea has strong potential and aligns with our vision, we may invest our development resources in exchange for a stake in the project.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to hear back after submitting an idea?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We review every submission within 48-72 hours. If your idea shows promise, we'll reach out to schedule an initial consultation call. Even if we can't pursue a partnership, we provide feedback and may suggest alternative paths forward.",
      },
    },
    {
      "@type": "Question",
      name: "What if I don't have technical skills - can I still pitch an idea?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! Some of the best ideas come from people who understand a problem deeply but lack technical expertise. We handle all technical aspects of development. What we look for is a clear problem statement, understanding of your target market, and passion for the solution.",
      },
    },
  ],
}

// WebPage Schema
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Submit Your App Idea | RocketOpp",
  description: "Submit your app or software idea to RocketOpp for professional evaluation and potential partnership. NDA protection, free initial consultation, and expertise in AI applications.",
  url: "https://rocketopp.com/pitch-idea",
  isPartOf: {
    "@type": "WebSite",
    url: "https://rocketopp.com",
    name: "RocketOpp",
  },
  about: {
    "@type": "Thing",
    name: "App Idea Submission",
  },
  mainEntity: {
    "@type": "Service",
    name: "App Idea Evaluation & Development",
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", ".hero-description"],
  },
}

export default function PitchIdeaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <PitchIdeaClient />
    </>
  )
}
