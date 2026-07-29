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
 * BASE_LOCALITY and PHONE below were confirmed by Mike on 2026-07-29. They must
 * match the Google Business Profile exactly — change them here and nowhere else.
 */

/** Legal entity name. Must match the GBP business name character-for-character. */
export const BUSINESS_NAME = 'RocketOpp'
export const LEGAL_NAME = 'RocketOpp LLC'

/** Base of operations — Greensburg, the Westmoreland county seat. Confirmed. */
export const BASE_LOCALITY = 'Greensburg'
export const BASE_REGION = 'PA'
export const BASE_REGION_NAME = 'Pennsylvania'
export const BASE_POSTAL_CODE = '15601'
export const BASE_COUNTRY = 'US'

/**
 * Confirmed published line. app/pitch-idea previously carried +1-878-888-1238,
 * a one-off that broke NAP consistency; it has been corrected.
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
