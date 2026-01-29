// SEO JSON-LD Schema Components

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  description?: string
  sameAs?: string[]
}

export function OrganizationSchema({
  name = "RocketOpp",
  url = "https://rocketopp.com",
  logo = "https://rocketopp.com/images/rocketopp-logo.png",
  description = "We build AI-powered automation tools for businesses. Describe what you want. Watch it happen.",
  sameAs = [
    "https://twitter.com/rocketopp",
    "https://linkedin.com/company/rocketopp",
    "https://github.com/rocketopp"
  ]
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    sameAs,
    areaServed: "Worldwide",
    knowsAbout: [
      "Business Automation",
      "AI Tools",
      "CRM Systems",
      "Workflow Automation",
      "AI Agents",
      "Software Development"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebsiteSchemaProps {
  name?: string
  url?: string
  description?: string
}

export function WebsiteSchema({
  name = "RocketOpp",
  url = "https://rocketopp.com",
  description = "AI-powered automation tools for businesses"
}: WebsiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/marketplace?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface SoftwareApplicationSchemaProps {
  name: string
  description: string
  applicationCategory?: string
  price: number
  priceCurrency?: string
  availability?: "InStock" | "PreOrder" | "OutOfStock"
  rating?: number
  ratingCount?: number
  operatingSystem?: string
  url?: string
}

export function SoftwareApplicationSchema({
  name,
  description,
  applicationCategory = "BusinessApplication",
  price,
  priceCurrency = "USD",
  availability = "InStock",
  rating,
  ratingCount,
  operatingSystem = "Web",
  url
}: SoftwareApplicationSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
      availability: `https://schema.org/${availability}`
    }
  }

  if (url) {
    schema.url = url
  }

  if (rating && ratingCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      ratingCount
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQSchemaProps {
  items: Array<{ question: string; answer: string }>
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ProductSchemaProps {
  name: string
  description: string
  image?: string
  price: number
  priceCurrency?: string
  availability?: "InStock" | "PreOrder" | "OutOfStock"
  brand?: string
  sku?: string
  url?: string
  rating?: number
  ratingCount?: number
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  priceCurrency = "USD",
  availability = "InStock",
  brand = "RocketOpp",
  sku,
  url,
  rating,
  ratingCount
}: ProductSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: {
      "@type": "Brand",
      name: brand
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "Organization",
        name: "RocketOpp"
      }
    }
  }

  if (image) schema.image = image
  if (sku) schema.sku = sku
  if (url) schema.url = url
  if (rating && ratingCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      ratingCount,
      bestRating: 5,
      worstRating: 1
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Service Schema for service pages
interface ServiceSchemaProps {
  name: string
  description: string
  provider?: string
  serviceType?: string
  areaServed?: string
  url?: string
}

export function ServiceSchema({
  name,
  description,
  provider = "RocketOpp",
  serviceType,
  areaServed = "Worldwide",
  url
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
      url: "https://rocketopp.com"
    },
    serviceType: serviceType || name,
    areaServed,
    url: url || "https://rocketopp.com/services"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Video Schema for YouTube embeds
interface VideoSchemaProps {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string // ISO 8601 format (e.g., "PT1M30S" for 1 min 30 sec)
  embedUrl: string
  contentUrl?: string
}

export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  embedUrl,
  contentUrl
}: VideoSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    uploadDate,
    embedUrl,
    publisher: {
      "@type": "Organization",
      name: "RocketOpp",
      logo: {
        "@type": "ImageObject",
        url: "https://rocketopp.com/images/rocketopp-logo.png"
      }
    }
  }

  if (duration) schema.duration = duration
  if (contentUrl) schema.contentUrl = contentUrl

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// HowTo Schema for tutorial/guide content
interface HowToStep {
  name: string
  text: string
  image?: string
}

interface HowToSchemaProps {
  name: string
  description: string
  steps: HowToStep[]
  totalTime?: string // ISO 8601 duration
  image?: string
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  image
}: HowToSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image })
    }))
  }

  if (totalTime) schema.totalTime = totalTime
  if (image) schema.image = image

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Local Business Schema
interface LocalBusinessSchemaProps {
  name?: string
  description?: string
  telephone?: string
  email?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  priceRange?: string
  openingHours?: string
}

export function LocalBusinessSchema({
  name = "RocketOpp",
  description = "AI-powered automation tools and digital transformation services for businesses",
  telephone = "+1-878-888-1230",
  email = "Mike@rocketopp.com",
  address,
  priceRange = "$$",
  openingHours = "Mo-Su 00:00-23:59"
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url: "https://rocketopp.com",
    logo: "https://rocketopp.com/images/rocketopp-logo.png",
    telephone,
    email,
    priceRange,
    openingHours,
    address: address ? {
      "@type": "PostalAddress",
      ...address
    } : {
      "@type": "PostalAddress",
      addressCountry: "US"
    },
    sameAs: [
      "https://twitter.com/rocketopp",
      "https://linkedin.com/company/rocketopp",
      "https://github.com/rocketopp"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
