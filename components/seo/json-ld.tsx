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
  url
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
