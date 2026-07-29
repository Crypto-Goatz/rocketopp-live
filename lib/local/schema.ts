/**
 * Structured-data builders for the local + AI-search pages.
 *
 * All of these read NAP from lib/local/nap.ts so the business identity is
 * byte-identical everywhere Google and the answer engines look.
 *
 * Deliberately NOT emitted here: AggregateRating / Review. Those require real,
 * verifiable reviews. Add them only when genuine reviews exist.
 */

import type { Area } from './areas'
import { AREAS } from './areas'
import {
  BUSINESS_NAME,
  LEGAL_NAME,
  EMAIL,
  GEO,
  LOGO,
  PHONE,
  SAME_AS,
  SERVICE_RADIUS_M,
  URL as SITE_URL,
  postalAddress,
} from './nap'

/** schema.org place entries for every town we serve. */
export function areaServed() {
  return AREAS.map((a) => ({
    '@type': a.county === 'Allegheny' ? 'City' : 'City',
    name: a.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: a.name,
      addressRegion: 'PA',
      addressCountry: 'US',
    },
  }))
}

/**
 * ProfessionalService is a LocalBusiness subtype and is the correct pick for an
 * agency — it inherits everything LocalBusiness gives the local pack while
 * being more specific about what we actually are.
 */
export function localBusinessSchema(area?: Area) {
  const name = area ? `${BUSINESS_NAME} — Web Design & Development, ${area.name} PA` : BUSINESS_NAME
  const id = area ? `${SITE_URL}/web-design/${area.slug}#business` : `${SITE_URL}/#business`

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': id,
    name,
    legalName: LEGAL_NAME,
    url: area ? `${SITE_URL}/web-design/${area.slug}` : SITE_URL,
    logo: LOGO,
    image: LOGO,
    telephone: PHONE,
    email: EMAIL,
    priceRange: '$$',
    description: area
      ? `Web design, web development and AI systems for businesses in ${area.name}, Pennsylvania and the surrounding ${area.county} County area.`
      : 'Web design, web development, automation and AI systems for small and mid-sized businesses across Westmoreland and eastern Allegheny County, Pennsylvania.',
    address: postalAddress,
    geo: { '@type': 'GeoCoordinates', latitude: GEO.latitude, longitude: GEO.longitude },
    // Service-area business: coverage is expressed as areaServed, never as a
    // published street address.
    areaServed: area
      ? [
          {
            '@type': 'City',
            name: area.name,
            address: {
              '@type': 'PostalAddress',
              addressLocality: area.name,
              addressRegion: 'PA',
              addressCountry: 'US',
            },
          },
        ]
      : areaServed(),
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: GEO.latitude, longitude: GEO.longitude },
      geoRadius: SERVICE_RADIUS_M,
    },
    knowsAbout: [
      'Web design',
      'Web development',
      'Local SEO',
      'Answer engine optimization',
      'Business automation',
      'CRM automation',
      'Custom AI development',
    ],
    sameAs: [...SAME_AS],
  }
}

export function serviceSchema(area: Area) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web design and web development',
    provider: { '@id': `${SITE_URL}/web-design/${area.slug}#business` },
    areaServed: {
      '@type': 'City',
      name: area.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: area.name,
        addressRegion: 'PA',
        addressCountry: 'US',
      },
    },
    name: `Web design & development in ${area.name}, PA`,
    description: `Custom website design, development and AI-powered automation for businesses in ${area.name}, Pennsylvania.`,
    url: `${SITE_URL}/web-design/${area.slug}`,
  }
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  }
}
