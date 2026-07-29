/**
 * Service-area data for rocketopp.com local + AI-search pages.
 *
 * HONESTY RULES (these are what make the pages citable by AI engines):
 *  - Every population figure is the 2020 US Census count. No estimates dressed
 *    up as facts, no rounding into "over 50,000!".
 *  - `type` is the real municipal classification. Monroeville and Murrysville
 *    are municipalities, not boroughs; Hempfield, North Huntingdon and Penn
 *    Hills are townships; Greensburg is a city.
 *  - Norwin is NOT a municipality — it is the Norwin School District area
 *    (North Huntingdon + Irwin + North Irwin). Its page says so plainly. That
 *    correction is exactly the kind of thing an answer engine will quote.
 *  - `businessLandscape` describes generally-verifiable local character only.
 *    Never invent client names, project counts, or review numbers here.
 */

export type County = 'Westmoreland' | 'Allegheny' | 'Westmoreland & Allegheny'

export type Area = {
  /** URL slug — pages live at /web-design/{slug} */
  slug: string
  /** Short name used in prose and headings */
  name: string
  /** Full municipal name, used once in the BLUF for precision */
  formalName: string
  type: 'city' | 'borough' | 'township' | 'municipality' | 'school district area'
  county: County
  /** 2020 US Census. Null where the area is not a census municipality. */
  population: number | null
  zips: string[]
  /** Main road corridors — used for honest, specific local orientation */
  corridors: string[]
  /** Verifiable local character. Drives the unique body copy per page. */
  businessLandscape: string
  /** A true, specific detail that makes the page non-generic */
  localNote: string
  /** Slugs of neighbouring areas, for internal linking */
  nearby: string[]
}

export const AREAS: Area[] = [
  {
    slug: 'greensburg-pa',
    name: 'Greensburg',
    formalName: 'City of Greensburg',
    type: 'city',
    county: 'Westmoreland',
    population: 14976,
    zips: ['15601'],
    corridors: ['US 30 (Lincoln Highway)', 'US 119', 'PA 66'],
    businessLandscape:
      'The Westmoreland County seat, so the downtown skews toward professional services — law firms, accountants, medical practices, insurance offices and county-facing businesses — alongside independent retail and restaurants around the courthouse square.',
    localNote:
      'Greensburg is the county seat of Westmoreland County and is almost entirely surrounded by Hempfield Township, which is a separate municipality with its own government.',
    nearby: ['hempfield-pa', 'delmont-pa', 'irwin-pa', 'murrysville-pa'],
  },
  {
    slug: 'murrysville-pa',
    name: 'Murrysville',
    formalName: 'Municipality of Murrysville',
    type: 'municipality',
    county: 'Westmoreland',
    population: 21006,
    zips: ['15668'],
    corridors: ['US 22 (William Penn Highway)', 'PA 286'],
    businessLandscape:
      'A spread-out residential municipality along the US 22 corridor with a business base of professional practices, trades and contractors, and service businesses that sell to a comparatively high-income commuter population working toward Pittsburgh.',
    localNote:
      'Murrysville is a "municipality" rather than a borough or township — it adopted a home rule charter, which is why you will see it written as the Municipality of Murrysville.',
    nearby: ['delmont-pa', 'monroeville-pa', 'plum-pa', 'greensburg-pa'],
  },
  {
    slug: 'monroeville-pa',
    name: 'Monroeville',
    formalName: 'Municipality of Monroeville',
    type: 'municipality',
    county: 'Allegheny',
    population: 28640,
    zips: ['15146'],
    corridors: ['US 22 (William Penn Highway)', 'I-376 (Parkway East)', 'PA Turnpike'],
    businessLandscape:
      'The most commercially dense area we serve: a regional retail and hospitality hub built around Monroeville Mall and the US 22 strip, plus a substantial healthcare cluster and the convention centre — meaning a lot of competing local businesses fighting for the same searches.',
    localNote:
      'Monroeville sits in Allegheny County, not Westmoreland, and its position at the junction of the Parkway East and the Turnpike makes it the commercial gateway between Pittsburgh and Westmoreland County.',
    nearby: ['plum-pa', 'penn-hills-pa', 'murrysville-pa', 'trafford-pa'],
  },
  {
    slug: 'delmont-pa',
    name: 'Delmont',
    formalName: 'Delmont Borough',
    type: 'borough',
    county: 'Westmoreland',
    population: 2592,
    zips: ['15626'],
    corridors: ['US 22', 'PA 66'],
    businessLandscape:
      'A small borough at a major crossroads, so the business mix punches above its population: roadside retail, restaurants, trades and family-run service businesses that draw from the surrounding townships rather than from the borough itself.',
    localNote:
      'Delmont sits where US 22 meets PA 66, which is why a borough of well under 3,000 residents carries far more passing commercial traffic than its size suggests.',
    nearby: ['murrysville-pa', 'greensburg-pa', 'plum-pa'],
  },
  {
    slug: 'plum-pa',
    name: 'Plum',
    formalName: 'Plum Borough',
    type: 'borough',
    county: 'Allegheny',
    population: 27144,
    zips: ['15239'],
    corridors: ['PA 380', 'Old Frankstown Road'],
    businessLandscape:
      'A large, largely residential borough on Allegheny County\'s eastern edge. The business base is dominated by trades, home services, healthcare practices and small professional offices serving residents rather than drawing regional traffic.',
    localNote:
      'Plum is one of the largest boroughs in Pennsylvania by land area, which means "near me" searches behave differently here than in a compact town — customers a few miles apart get very different local results.',
    nearby: ['monroeville-pa', 'penn-hills-pa', 'murrysville-pa'],
  },
  {
    slug: 'irwin-pa',
    name: 'Irwin',
    formalName: 'Irwin Borough',
    type: 'borough',
    county: 'Westmoreland',
    population: 3902,
    zips: ['15642'],
    corridors: ['US 30 (Lincoln Highway)', 'PA Turnpike'],
    businessLandscape:
      'A compact walkable borough with a genuine Main Street — independent retail, restaurants, salons and professional offices — surrounded by the much larger North Huntingdon Township, whose residents are most of the customer base.',
    localNote:
      'Irwin borough is small (under 4,000 residents) but shares the 15642 ZIP code with North Huntingdon Township, which has roughly eight times the population — so ZIP-level targeting badly misrepresents this market.',
    nearby: ['north-huntingdon-pa', 'norwin-pa', 'trafford-pa', 'greensburg-pa'],
  },
  {
    slug: 'penn-hills-pa',
    name: 'Penn Hills',
    formalName: 'Penn Hills Township',
    type: 'township',
    county: 'Allegheny',
    population: 41059,
    zips: ['15235', '15147'],
    corridors: ['PA 380 (Frankstown Road)', 'Rodi Road', 'Allegheny River Boulevard'],
    businessLandscape:
      'One of the largest municipalities in Allegheny County by population, with a dispersed business base — home services and trades, auto, healthcare practices, churches and community organisations, and neighbourhood retail spread along several corridors rather than one downtown.',
    localNote:
      'Penn Hills has no single downtown and spans two ZIP codes (15235 and 15147), so businesses here often compete under a Pittsburgh mailing address rather than the Penn Hills name.',
    nearby: ['plum-pa', 'monroeville-pa'],
  },
  {
    slug: 'trafford-pa',
    name: 'Trafford',
    formalName: 'Trafford Borough',
    type: 'borough',
    county: 'Westmoreland & Allegheny',
    population: 3317,
    zips: ['15085'],
    corridors: ['PA 130', 'Turtle Creek valley'],
    businessLandscape:
      'A small former mill borough with a tight main-street business district — trades, restaurants, salons, and small professional offices serving Trafford and the surrounding Turtle Creek valley communities.',
    localNote:
      'Trafford straddles a county line: the large majority of residents are in Westmoreland County, with a small portion in Allegheny County. That split genuinely confuses local listings and directory data.',
    nearby: ['north-huntingdon-pa', 'monroeville-pa', 'irwin-pa'],
  },
  {
    slug: 'norwin-pa',
    name: 'Norwin',
    formalName: 'the Norwin area (Norwin School District)',
    type: 'school district area',
    county: 'Westmoreland',
    population: null,
    zips: ['15642'],
    corridors: ['US 30 (Lincoln Highway)', 'PA 993', 'PA Turnpike'],
    businessLandscape:
      'The Norwin area covers North Huntingdon Township plus Irwin and North Irwin boroughs — roughly 36,000 residents combined — and is one of the strongest retail and service corridors in western Westmoreland County, concentrated along US 30.',
    localNote:
      'Norwin is not a town. It is the Norwin School District area, and the name is a blend of "Nor" from North Huntingdon and "win" from Irwin, dating to the 1914 jointure of their high schools. Locals absolutely use "Norwin" as a place name, which is why it is worth having a page — but no municipality by that name exists.',
    nearby: ['north-huntingdon-pa', 'irwin-pa', 'trafford-pa'],
  },
  {
    slug: 'north-huntingdon-pa',
    name: 'North Huntingdon',
    formalName: 'North Huntingdon Township',
    type: 'township',
    county: 'Westmoreland',
    population: 31847,
    zips: ['15642'],
    corridors: ['US 30 (Lincoln Highway)', 'PA 993', 'PA Turnpike'],
    businessLandscape:
      'A large suburban township whose commercial life runs along US 30 — big-box and independent retail, restaurants, car dealerships, medical offices and a deep bench of contractors and home-service businesses serving the Norwin area.',
    localNote:
      'North Huntingdon is a township of nearly 32,000 people with no incorporated town centre of its own, so its businesses commonly list an Irwin, PA mailing address (ZIP 15642) even though Irwin borough is a separate municipality.',
    nearby: ['irwin-pa', 'norwin-pa', 'trafford-pa', 'hempfield-pa'],
  },
  {
    slug: 'hempfield-pa',
    name: 'Hempfield',
    formalName: 'Hempfield Township',
    type: 'township',
    county: 'Westmoreland',
    population: 41585,
    zips: ['15601'],
    corridors: ['US 30 (Lincoln Highway)', 'US 119', 'PA 136'],
    businessLandscape:
      'The largest suburb in the Pittsburgh metropolitan area by population, spread over roughly 77 square miles. The business base is correspondingly broad — retail and restaurants along US 30, industrial and light manufacturing, trades, agriculture in the outlying areas, and professional practices clustered near Greensburg.',
    localNote:
      'At 41,585 residents (2020 Census) Hempfield Township is the largest suburb in the Pittsburgh metro area, and it surrounds the city of Greensburg along with several boroughs — yet it shares the 15601 ZIP code, so "Greensburg PA" addresses often are not in Greensburg at all.',
    nearby: ['greensburg-pa', 'north-huntingdon-pa', 'irwin-pa'],
  },
]

export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug)

export const AREA_SLUGS = AREAS.map((a) => a.slug)

/** Plain list of place names for schema `areaServed` and llms.txt. */
export const AREA_NAMES = AREAS.map((a) => `${a.name}, PA`)

/** Combined 2020 Census population of the census municipalities we serve. */
export const TOTAL_POPULATION = AREAS.reduce((sum, a) => sum + (a.population ?? 0), 0)
