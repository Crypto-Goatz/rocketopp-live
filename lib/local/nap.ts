/**
 * NAP (Name / Address / Phone) — SINGLE SOURCE OF TRUTH.
 *
 * Every LocalBusiness / Organization / ContactPoint schema block and every
 * user-visible address or phone number on rocketopp.com must read from here.
 * Local search ranking depends on NAP being byte-identical across the website,
 * the Google Business Profile, and every citation/directory listing.
 *
 * RocketOpp is a SERVICE-AREA BUSINESS (SAB): we travel to / work remotely for
 * clients and do not operate a walk-in storefront. Per Google's guidelines an
 * SAB must NOT publish a street address on its Business Profile, so we
 * deliberately omit `streetAddress` from PostalAddress and express coverage via
 * `areaServed` instead. Emitting a fake or hidden street address is the single
 * fastest way to get a Business Profile suspended.
 *
 * ⚠️  TODO(mike): confirm BASE_LOCALITY and PHONE below before the Google
 *     Business Profile is created. These two values must match the GBP exactly.
 */

/** Legal entity name. Must match the GBP business name character-for-character. */
export const BUSINESS_NAME = 'RocketOpp'
export const LEGAL_NAME = 'RocketOpp LLC'

/**
 * ⚠️ UNCONFIRMED — assumed base of operations.
 * Chosen as the geographic centre of the service area (Westmoreland county
 * seat). If RocketOpp actually operates out of a different town, change this
 * one constant and every schema block + page follows.
 */
export const BASE_LOCALITY = 'Greensburg'
export const BASE_REGION = 'PA'
export const BASE_REGION_NAME = 'Pennsylvania'
export const BASE_POSTAL_CODE = '15601'
export const BASE_COUNTRY = 'US'

/**
 * ⚠️ Canonicalised on +1-878-888-1230 (used in app/layout.tsx, app/about,
 * app/request-app). app/pitch-idea previously carried +1-878-888-1238 — a
 * one-off that broke NAP consistency. Confirm which is the real published line.
 */
export const PHONE = '+1-878-888-1230'
export const PHONE_DISPLAY = '(878) 888-1230'
export const EMAIL = 'mike@rocketopp.com'

export const URL = 'https://rocketopp.com'
export const LOGO = 'https://rocketopp.com/images/rocketopp-logo.png'

/** Approximate centre of the service area, used for GeoCircle areaServed. */
export const GEO = { latitude: 40.3015, longitude: -79.5389 } as const

/** Radius that comfortably covers all 11 service-area towns, in metres. */
export const SERVICE_RADIUS_M = 40000

export const SAME_AS = [
  'https://www.0nmcp.com',
  'https://www.cro9.com',
  'https://linkedin.com/company/rocketopp',
  'https://github.com/rocketopp',
] as const

/**
 * PostalAddress for a service-area business: locality + region + country, no
 * streetAddress. Safe to embed on every page.
 */
export const postalAddress = {
  '@type': 'PostalAddress',
  addressLocality: BASE_LOCALITY,
  addressRegion: BASE_REGION,
  postalCode: BASE_POSTAL_CODE,
  addressCountry: BASE_COUNTRY,
} as const

/** Copy-paste block for directory / citation submissions. Keep identical everywhere. */
export const CITATION_BLOCK = `${LEGAL_NAME}
${BASE_LOCALITY}, ${BASE_REGION} ${BASE_POSTAL_CODE}
${PHONE_DISPLAY}
${EMAIL}
${URL}`
