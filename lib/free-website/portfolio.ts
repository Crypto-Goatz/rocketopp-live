/**
 * Websites our team has built — real client sites, screenshotted when they launched (Mike's "Website Portfolio" folder,
 * 2019–2020). Files live in /public/portfolio at 1440 px wide. Never add a mockup or an AI-generated image here: this list
 * is presented as work we did.
 */
export type PortfolioItem = { slug: string; name: string; kind: string; w: number; h: number }

export const PORTFOLIO: PortfolioItem[] = [
  { slug: "blue-fox-landscape", name: "Blue Fox Landscape Design", kind: "Landscape design", w: 1440, h: 725 },
  { slug: "eden-salon", name: "Eden Salon & Day Spa", kind: "Salon & day spa", w: 1440, h: 724 },
  { slug: "ecospray-solutions", name: "EcoSpray Solutions", kind: "Insulation & spray-on bedliners", w: 1440, h: 726 },
  { slug: "pavers-restored", name: "Pavers Restored", kind: "Hardscape restoration", w: 1440, h: 726 },
  { slug: "first-med-training", name: "First Med Training", kind: "CPR & first-aid classes", w: 1440, h: 725 },
  { slug: "lady-fox-gardening", name: "Lady Fox Gardening", kind: "Garden care", w: 1440, h: 726 },
  { slug: "shasko-logistics", name: "Shasko Global Logistics", kind: "Trucking", w: 1440, h: 543 },
  { slug: "premier-pet-doors", name: "Premier Pet Doors", kind: "Pet doors & installation", w: 1440, h: 726 },
  { slug: "murrysville-sportzone", name: "Murrysville SportZone", kind: "Sports complex", w: 1440, h: 725 },
  { slug: "clutch-energy", name: "Clutch Energy Services", kind: "Energy field services", w: 1440, h: 726 },
  { slug: "donnas-dance", name: "Donna's School of Dance", kind: "Dance studio", w: 1440, h: 723 },
  { slug: "playground-world", name: "Playground World", kind: "Playsets", w: 1440, h: 725 },
  { slug: "swank-farm", name: "Swank Farm", kind: "Red Angus cattle", w: 1440, h: 726 },
  { slug: "komadix", name: "Komadix", kind: "Staffing", w: 1440, h: 725 },
  { slug: "process-kana", name: "Process Kana", kind: "Liquid handling", w: 1440, h: 725 },
  { slug: "strainsense", name: "StrainSense", kind: "Load cells & calibration", w: 1440, h: 724 },
  { slug: "arbco-wheels", name: "Arbco Wheels", kind: "Industrial wheels", w: 1440, h: 726 },
  { slug: "hidden-acres", name: "Hidden Acres Farm", kind: "Hereford cattle", w: 1440, h: 726 },
  { slug: "rhino-bags", name: "Rhino Bags", kind: "Industrial packaging", w: 1440, h: 772 },
  { slug: "flexscreen", name: "FlexScreen", kind: "Window screens", w: 1440, h: 748 },
]

export const portfolioSrc = (slug: string) => `/portfolio/${slug}.jpg`
export const portfolioBySlug = (slug: string) => PORTFOLIO.find((p) => p.slug === slug)
