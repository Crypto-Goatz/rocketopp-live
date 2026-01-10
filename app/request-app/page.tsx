import type { Metadata } from "next"
import RequestAppClient from "./RequestAppClient"

export const metadata: Metadata = {
  title: "Request a Custom App | Pittsburgh App Development | RocketOpp",
  description: "Request a custom mobile or web application from Pittsburgh's leading AI-powered app development agency. Get a free consultation for your iOS, Android, or web app project. Serving Pittsburgh, PA and beyond.",
  keywords: [
    "app development Pittsburgh",
    "mobile app development Pittsburgh PA",
    "custom app development Pittsburgh",
    "iOS app developer Pittsburgh",
    "Android app developer Pittsburgh",
    "web application development Pittsburgh",
    "Pittsburgh software development company",
    "app development agency Pittsburgh",
    "hire app developer Pittsburgh",
    "custom software Pittsburgh PA",
    "SaaS development Pittsburgh",
    "startup app development Pittsburgh",
    "enterprise app development Pittsburgh",
    "React Native developer Pittsburgh",
    "AI app development Pittsburgh",
  ].join(", "),
  authors: [{ name: "RocketOpp", url: "https://rocketopp.com" }],
  openGraph: {
    title: "Request a Custom App | Pittsburgh's Premier App Development Agency",
    description: "Get a free consultation for your custom mobile or web application. Pittsburgh's top-rated AI-powered development team.",
    url: "https://rocketopp.com/request-app",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/og-request-app.jpg",
        width: 1200,
        height: 630,
        alt: "Request Custom App Development in Pittsburgh",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Request a Custom App | Pittsburgh App Development",
    description: "Free consultation for your mobile or web app project from Pittsburgh's leading development agency.",
    images: ["https://rocketopp.com/twitter-request-app.jpg"],
  },
  alternates: {
    canonical: "https://rocketopp.com/request-app",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://rocketopp.com",
  name: "RocketOpp - Pittsburgh App Development",
  description: "Custom mobile and web application development agency serving Pittsburgh, PA and businesses nationwide.",
  url: "https://rocketopp.com",
  telephone: "+1-878-888-1230",
  email: "Mike@rocketopp.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pittsburgh",
    addressRegion: "PA",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.4406,
    longitude: -79.9959,
  },
  areaServed: [
    {
      "@type": "City",
      name: "Pittsburgh",
      "@id": "https://www.wikidata.org/wiki/Q1342",
    },
    {
      "@type": "State",
      name: "Pennsylvania",
    },
    {
      "@type": "Country",
      name: "United States",
    },
  ],
  priceRange: "$$$",
  openingHours: "Mo-Fr 09:00-18:00",
  sameAs: [
    "https://www.linkedin.com/company/rocketopp",
    "https://twitter.com/rocketopp",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "App Development Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Mobile App Development",
          description: "iOS and Android app development using React Native and native technologies",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web Application Development",
          description: "Custom web applications and SaaS platforms",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI Integration",
          description: "AI-powered features and automation for applications",
        },
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "127",
    bestRating: "5",
    worstRating: "1",
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does custom app development cost in Pittsburgh?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Custom app development in Pittsburgh typically ranges from $15,000 for an MVP to $150,000+ for enterprise applications. RocketOpp offers competitive pricing starting at $15,000 for MVP development, with most projects completing in 8-16 weeks.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to build a mobile app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A minimum viable product (MVP) typically takes 8-16 weeks. Full-featured applications can take 4-9 months depending on complexity. RocketOpp uses agile development to deliver working features every 2 weeks.",
      },
    },
    {
      "@type": "Question",
      name: "Do you build apps for both iOS and Android?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we specialize in cross-platform development using React Native and Flutter, allowing us to build for both iOS and Android simultaneously. We also offer native development for apps requiring maximum performance.",
      },
    },
    {
      "@type": "Question",
      name: "Can you integrate AI into my application?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. RocketOpp specializes in AI-powered applications. We integrate machine learning, natural language processing, computer vision, and predictive analytics into mobile and web applications.",
      },
    },
  ],
}

export default function RequestAppPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <RequestAppClient />
    </>
  )
}
