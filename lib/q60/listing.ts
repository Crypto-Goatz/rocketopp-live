/**
 * 2018 Infiniti Q60 3.0t LUXE AWD — the single source for /q60-for-sale, its API routes and the PDF.
 *
 * PERFORMANCE CLAIMS: only the TPG Tuning dyno (Aug 17 2024, 93 octane, Map 1) and the EcuTek ECU Connect
 * timing are used. A second dyno session was excluded by the seller as not verified correctly — do not add
 * any figure from it back. Every number here must be backed by a document in RECEIPTS.
 */

/*
 * Images are served from this site (public/q60/), not from external storage: the Supabase project that first held
 * them was paused and every image on the live page broke. Keep them here. Dimensions are the files' real pixel sizes.
 */
export const photo = (f: string) => `/q60/photos/${f}.jpg`
export const receipt = (f: string) => `/q60/receipts/${f}.jpg`
export const ebay = (f: string) => `/q60/ebay/${f}.jpg`
export const abs = (path: string) => `https://rocketopp.com${path}`
export const DIMS: Record<string, [number, number]> = {"photos/25-taillights-night": [2400, 689], "photos/01-hero-front-quarter-sunset": [2000, 1500], "photos/02-side-profile-sunset": [2000, 1500], "photos/03-rear-quarter-sunset": [2000, 1500], "photos/04-side-low-dusk": [2000, 2667], "photos/05-front-quarter-sunset-portrait": [2000, 2667], "photos/06-taillight-diffuser-detail": [2000, 2667], "photos/07-front-quarter-lot": [2000, 1500], "photos/08-front-head-on": [2000, 1500], "photos/09-front-quarter-lot-2": [2000, 1500], "photos/10-side-profile-right": [2000, 1500], "photos/11-side-profile-left": [2000, 1500], "photos/12-garage-front-quarter": [2000, 1500], "photos/13-gravel-front-quarter": [2000, 1500], "photos/14-front-close-lip": [2000, 1500], "photos/15-park-front-quarter": [2000, 1500], "photos/20-side-profile-sunset-b": [1600, 1200], "photos/16-front-quarter-lot-b": [1600, 1200], "photos/18-front-quarter-lot-c": [1600, 1200], "photos/22-rear-quarter-spoiler-day": [1600, 1200], "photos/21-rear-quarter-sunset-b": [1600, 1200], "photos/17-front-head-on-b": [1600, 1200], "photos/24-front-quarter-summer": [1600, 1200], "photos/23-rear-straight-spoiler": [1600, 1200], "photos/19-front-quarter-dusk-fogs": [1600, 1200], "receipts/inv1": [1400, 1867], "receipts/inv2": [1400, 1867], "receipts/dyno-cmp": [1400, 1867], "receipts/dyno-2024": [1400, 1867], "receipts/bov": [1206, 1297], "receipts/downpipes": [1206, 1051], "receipts/catback": [1206, 1490], "receipts/oilpan": [1206, 1235], "receipts/coils": [1206, 1160], "receipts/springs": [1206, 1285], "receipts/zero60-366": [981, 1121], "receipts/bms-intake": [1206, 1388], "receipts/zero60-324": [1000, 740], "ebay/ebay-01": [1000, 2174], "ebay/ebay-02": [1000, 2174], "ebay/ebay-03": [1000, 2174], "ebay/ebay-04": [1000, 2174], "ebay/ebay-05": [1000, 2174], "ebay/ebay-06": [1000, 2174], "ebay/ebay-07": [1000, 2174], "ebay/ebay-08": [1000, 2174], "ebay/ebay-09": [1000, 2174], "ebay/ebay-10": [1000, 2174], "ebay/ebay-11": [1000, 279], "ebay/ebay-12": [1000, 313], "ebay/ebay-13": [1000, 289], "ebay/ebay-14": [1000, 313], "ebay/ebay-15": [1000, 357], "ebay/ebay-16": [1000, 1578]}
export const dims = (path: string): [number, number] => DIMS[path.replace(/^\/q60\//, '').replace(/\.jpg$/, '')] ?? [1600, 1200]

export const PATH = '/q60-for-sale'
export const URL_ = `https://rocketopp.com${PATH}`
export const PDF_PATH = '/q60-for-sale-listing.pdf'

export const CAR = {
  title: '2018 Infiniti Q60 3.0t LUXE AWD',
  price: 25000,
  depositCents: Number(process.env.Q60_DEPOSIT_CENTS || 100000),
  miles: 68000,
  engineMilesAtInstall: 48000,
  color: 'Black Obsidian',
  location: 'Pittsburgh, PA',
  title_status: 'Clean title, paid off, title in hand',
  shop: { name: 'TPG Tuning', address: '1301 Pontiac Court, Export, PA 15632' },
  dyno: { whp: 418, wtq: 469, avgHp: 358, avgTq: 420, date: 'Aug 17, 2024', fuel: '93 octane', map: 'Map 1' },
  stock: { whp: 313, wtq: 283 },
  zero30: 1.49,
  zero60: 3.24,
  zero60gps: 3.66,
  quarterEst: '11.6–11.9 s @ 115–118 mph',
  // aftermarketParts = performance bolt-ons 3,902.71 + exterior/interior 2,592.04 (receipted, parts only)
  spend: { performance: 14931.7, tpgInvoice: 5000, cosmetic: 2592.04, total: 22523.74, aftermarketParts: 6494.75 },
  // Seller's estimate of hardware, fluids, clips and small parts with no receipt. Always labeled as an estimate.
  unlisted: 1000,
  // total + unlisted = 23,523.74, rounded up to the next $100 for display
  invested: 23600,
  /** 2018 Infiniti Q60 3.0t LUXE AWD with every factory option, per INFINITI's 2018 Q60 press kit (usa.infinitinews.com). */
  msrp: {
    total: 58445,
    lines: [
      ['Q60 3.0t LUXE AWD base price', 46500],
      ['Sensory Package', 3200],
      ['ProACTIVE Package', 2850],
      ['ProASSIST Package', 2250],
      ['Semi-Aniline Leather Seating Package', 1350],
      ['Premium Paint', 500],
      ['Dark Maple Wood Interior Trim', 400],
      ['Radiant Grille Emblem', 400],
      ['Destination and handling', 995],
    ] as [string, number][],
  },
}

export type Photo = { src: string; w: number; h: number; alt: string }
const P = (f: string, _w: number, _h: number, alt: string): Photo => { const [w, h] = dims(photo(f)); return { src: photo(f), w, h, alt } }

export const TAILLIGHTS = P('25-taillights-night', 2400, 689, 'Tail lights glowing in the dark')
export const HERO = P('19-front-quarter-dusk-fogs', 1600, 1200, '2018 Infiniti Q60 3.0t AWD at dusk, yellow fog lights on')

export const EXTERIOR: Photo[] = [
  HERO,
  P('01-hero-front-quarter-sunset', 1800, 1350, 'Front three-quarter at sunset, fogs lighting the gravel'),
  P('21-rear-quarter-sunset-b', 1600, 1200, 'Rear quarter at sunset, spoiler and diffuser'),
  TAILLIGHTS,
  P('20-side-profile-sunset-b', 1600, 1200, 'Side profile at golden hour, red calipers'),
  P('22-rear-quarter-spoiler-day', 1600, 1200, 'Rear three-quarter, carbon spoiler, C-blades, quad diffuser'),
  P('05-front-quarter-sunset-portrait', 1600, 2133, 'Front three-quarter, headlights on'),
  P('16-front-quarter-lot-b', 1600, 1200, 'Front three-quarter, daylight'),
  P('17-front-head-on-b', 1600, 1200, 'Head-on: blacked-out grille, yellow fogs, carbon lip'),
  P('06-taillight-diffuser-detail', 1600, 2133, 'Tail light, spoiler and diffuser detail'),
  P('23-rear-straight-spoiler', 1600, 1200, 'Straight rear: ducktail spoiler, smoked tails, diffuser fins'),
  P('03-rear-quarter-sunset', 1600, 1200, 'Rear three-quarter at sunset'),
  P('18-front-quarter-lot-c', 1600, 1200, 'Front three-quarter, overcast'),
  P('24-front-quarter-summer', 1600, 1200, 'Front three-quarter, summer'),
  P('02-side-profile-sunset', 1600, 1200, 'Side profile at sunset'),
  P('04-side-low-dusk', 1600, 2133, 'Low side angle at dusk'),
  P('08-front-head-on', 1600, 1200, 'Head-on, daylight'),
  P('12-garage-front-quarter', 1600, 1200, 'Parking garage, red calipers'),
  P('10-side-profile-right', 1600, 1200, 'Right side profile'),
  P('11-side-profile-left', 1600, 1200, 'Left side profile'),
  P('07-front-quarter-lot', 1600, 1200, 'Front three-quarter, daylight'),
  P('14-front-close-lip', 1600, 1200, 'Front lip and grille close-up'),
  P('13-gravel-front-quarter', 1600, 1200, 'Front three-quarter on gravel'),
  P('15-park-front-quarter', 1600, 1200, 'Front three-quarter, park'),
  P('09-front-quarter-lot-2', 1600, 1200, 'Front three-quarter, daylight'),
]
export const INTERIOR: Photo[] = []

/**
 * Videos: YouTube (unlisted is fine) or Vimeo ids. The section renders only when this list has entries.
 * next.config.mjs frame-src allows youtube-nocookie.com and player.vimeo.com for exactly this.
 */
export type Video = { title: string; youtube?: string; vimeo?: string }
export const VIDEOS: Video[] = []

export type Item = { date: string; name: string; note: string; cost: number | null; doc?: string; incl?: boolean; listing?: boolean }
export const BUILD: { group: string; items: Item[] }[] = [
  { group: 'Engine and drivetrain', items: [
    { date: 'Feb 2025', name: 'Complete engine replacement — 2017–2023 Infiniti 3.0L AWD assembly, 48K miles', note: '30 hours TPG Tuning labor: K-member dropped, engine swapped, reconnected, fresh Motul 8100 5W-30, OEM filter, coolant. Invoice #10024.', cost: 10787.67, doc: 'inv1' },
    { date: 'Aug 2024', name: 'Infiniti QX60 front axles', note: 'Heavier axles that eliminate wheel hop on launch. On the TPG tune invoice.', cost: null, incl: true },
    { date: 'Aug 2022', name: 'Lower oil pan assembly, AWD', note: 'Z1 Motorsports order #1237825.', cost: 241.32, doc: 'oilpan' },
  ]},
  { group: 'Tuning', items: [
    { date: 'Aug 2024', name: 'EcuTek tune by TPG Tuning (AMS-certified)', note: 'Four maps switched from the EcuTek ECU Connect phone app over Bluetooth: race, street, economy, valet. The EcuTek license transfers to the buyer through TPG. Invoice covers the tune (~$2,700), QX60 axles and downpipe install.', cost: 5000, doc: 'dyno-2024' },
  ]},
  { group: 'Exhaust', items: [
    { date: 'Jul 2022', name: 'Z1 Q60 cat-back touring exhaust — catless, straight-piped', note: 'Z1 order #1205529. Installed by TPG Tuning.', cost: 1546.68, doc: 'catback' },
    { date: 'Jul 2022', name: 'Fast Intentions lower downpipes', note: 'Z1 order #1205324. Installed by TPG Tuning.', cost: 468.76, doc: 'downpipes' },
  ]},
  { group: 'Intake and boost', items: [
    { date: 'Jul 2021', name: 'Burger Tuning (BMS) billet dual intake with inlets', note: 'One filter per turbo, billet inlets, heat shields.', cost: 403, doc: 'bms-intake' },
    { date: 'Nov 2020', name: 'HKS blow-off valves ×2, Z1 Black Edition', note: 'Red silicone couplers. Z1 order #795957.', cost: 649.93, doc: 'bov' },
  ]},
  { group: 'Fuel and ignition', items: [
    { date: '—', name: 'AMS Performance fuel rail, injectors and spark plugs', note: 'Injectors fitted with a complete fuel-system and airflow cleaning.', cost: null },
    { date: '—', name: 'OEM high-pressure fuel rail crossover line', note: 'Part 17520-5CA0A.', cost: 210.04, listing: true },
    { date: 'May 2023', name: 'Z1 high-energy ignition coils, set of 6', note: 'Z1 order #1471335.', cost: 444.79, doc: 'coils' },
  ]},
  { group: 'Suspension', items: [
    { date: 'Sep 2023', name: 'Swift Spec-R lowering springs', note: 'Q60 coupe AWD. Z1 order #1574086.', cost: 389.55, doc: 'springs' },
  ]},
]

export const LOOK: string[] = [
  'Factory wheels powder coated gloss black, red calipers',
  'Professional window tint, smoked tail lights, yellow fogs',
  'Carbon ducktail spoiler, roof spoiler, quad-fin rear diffuser with LED brake light, rear canards',
  'One-piece front lip, side skirts, real carbon rear bumper C-blades',
  'Real carbon grille outline, mirror caps, fender vents, headlight eyelids, trunk emblem',
  'Blacked-out badges, chrome delete, 400R badging',
  'Full carbon fiber interior trim kit, carbon shifter and cluster trim',
]

export const RECEIPTS = [
  { id: 'dyno-2024', title: 'TPG Tuning dyno — Aug 17 2024', cap: '93 octane, Map 1. Max 418 hp / 469 lb-ft. Average 358 hp / 420 lb-ft. Mustang dynamometer, wheel-corrected.', wide: true },
  { id: 'dyno-cmp', title: 'Same dyno, same day — tuned vs. stock Q50/Q60', cap: 'Stock reference car: 313 hp / 283 lb-ft.' },
  { id: 'zero60-324', title: 'EcuTek ECU Connect — 0–60 in 3.24 s', cap: '0–30 in 1.49 s. Logged by the car’s own EcuTek ECU.' },
  { id: 'inv1', title: 'TPG engine invoice #10024, p.1', cap: '48K-mile 3.0L AWD assembly, 30 hours labor.' },
  { id: 'inv2', title: 'TPG engine invoice #10024, p.2', cap: 'Total $10,787.67 incl. PA tax.' },
  { id: 'zero60-366', title: 'GPS timer — 0–60 in 3.66 s', cap: 'Independent phone-GPS run.' },
  { id: 'catback', title: 'Z1 cat-back', cap: 'Order #1205529 · $1,546.68' },
  { id: 'downpipes', title: 'Fast Intentions downpipes', cap: 'Order #1205324 · $468.76' },
  { id: 'bov', title: 'HKS blow-off valves', cap: 'Order #795957 · $649.93' },
  { id: 'bms-intake', title: 'BMS dual intake', cap: 'Jul 2021 · $403.00' },
  { id: 'coils', title: 'Z1 high-energy coils', cap: 'Order #1471335 · $444.79' },
  { id: 'oilpan', title: 'Lower oil pan', cap: 'Order #1237825 · $241.32' },
  { id: 'springs', title: 'Swift Spec-R springs', cap: 'Order #1574086 · $389.55' },
]

/** eBay order screenshots behind the exterior/interior total. Refunded orders are not counted. */
export const EBAY: { id: string; alt: string }[] = Array.from({ length: 16 }, (_, i) => {
  const id = `ebay-${String(i + 1).padStart(2, '0')}`
  return { id, alt: `eBay order history for the Q60’s exterior and interior parts, screenshot ${i + 1}` }
})

export const FAQ: [string, string][] = [
  ['Is it paid off?', 'Yes. No lien, clean title in hand. It transfers the day you pay.'],
  ['Is this a Red Sport 400?', 'No. It is the 3.0t LUXE AWD, the same VR30DDTT twin-turbo V6, built past Red Sport output: 418 whp and 469 lb-ft on 93 octane at TPG Tuning. A stock Q50/Q60 made 313 whp on the same dyno the same day.'],
  ['Why does it have a newer engine?', 'The original engine was replaced in February 2025 with a complete 48,000-mile 3.0L AWD assembly. TPG Tuning did the swap over 30 shop hours, and the full invoice is on this page. The chassis has 68,000 miles.'],
  ['Does the tune come with it?', 'Yes. The EcuTek license transfers to you through TPG Tuning, and the four maps switch from your phone.'],
  ['Will it pass inspection?', 'It is catless and straight-piped. In a state with an emissions visual, the cats go back on; TPG can do that in a day.'],
  ['How does Buy It Now work?', 'You pay a deposit by card to hold the car. It comes off the $25,000. The balance is paid in person by cashier’s check or by wire that has cleared before the keys and title change hands. If the car is not as described when you see it, the deposit is refunded in full.'],
  ['Can I have it inspected?', 'Yes. TPG Tuning did every piece of work on it and will put it on the lift for you, or bring your own mechanic.'],
  ['Warranty?', 'None. Private sale, as-is, with every receipt and the dyno sheets.'],
]
