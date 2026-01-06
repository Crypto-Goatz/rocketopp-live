import type { Industry } from "./personalization-store"

// Helper function for consistent AI image query styling
function generateConsistentImageQuery(
  baseSubject: string,
  industry?: Industry | null,
  companyName?: string | null,
): string {
  let query = baseSubject
  const industryDisplayName = industry
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  if (industry && industryDisplayName) {
    query += ` for the ${industryDisplayName} industry`
  }
  if (companyName) {
    query += `, tailored for ${companyName}`
  }
  // Add consistent style prompts
  query +=
    ", digital art, vibrant, professional, cinematic lighting, high detail, modern aesthetic, abstract elements representing technology and growth, RocketOpp brand colors (subtle)"
  return query
}

// Updated ContentPiece to include more image fields
interface ContentPiece {
  headline: string
  subheadline: string
  cta: string

  // Hero Image (e.g., for homepage, about page, service category pages)
  heroImageUrl: string // Will be a path like /images/industry/hero.jpg
  heroImageQuery: string // The AI query for this specific hero image

  // Feature Section Images (Example for 3 features)
  feature1Title?: string
  feature1Description?: string
  feature1ImageUrl?: string
  feature1ImageQuery?: string

  feature2Title?: string
  feature2Description?: string
  feature2ImageUrl?: string
  feature2ImageQuery?: string

  feature3Title?: string
  feature3Description?: string
  feature3ImageUrl?: string
  feature3ImageQuery?: string

  // Specific Service Page Images (Example)
  websiteDesignPageBannerUrl?: string
  websiteDesignPageBannerQuery?: string

  // About Page Images
  aboutPageTeamSectionImageUrl?: string // Example if you had a team background
  aboutPageTeamSectionImageQuery?: string
  aboutPageValuesSectionImageUrl?: string
  aboutPageValuesSectionImageQuery?: string

  // ... other page/section specific images
  servicePageTitle?: string
  servicePageDescription?: string
  serviceBenefit1?: string
  serviceBenefit2?: string
  websiteDesignHeadline?: string
  websiteDesignSubheadline?: string
  websiteDesignBenefit?: string
  aiIntegrationHeadline?: string
  aiIntegrationSubheadline?: string
  aiBenefitPersonalized?: string
  appDevelopmentHeadline?: string
  appDevelopmentSubheadline?: string
  rocketClientsHeadline?: string
  rocketClientsSubheadline?: string
  aboutPageHeroSubtitle?: string
  whyChooseUsBenefit?: string
}

export const defaultContent: ContentPiece = {
  headline: "Ignite Your Digital Presence with RocketOpp",
  subheadline:
    "We craft stunning websites, powerful marketing strategies, and intelligent AI solutions to launch your business to new heights.",
  cta: "Discover Our Solutions",

  heroImageUrl: "/images/default/hero-main.png",
  heroImageQuery: generateConsistentImageQuery(
    "dynamic abstract digital landscape representing innovative business solutions",
  ),

  feature1Title: "Custom Web Design",
  feature1Description: "Visually stunning and highly functional websites tailored to your brand.",
  feature1ImageUrl: "/images/default/feature-web-design.png",
  feature1ImageQuery: generateConsistentImageQuery("modern website design interface mockup"),

  feature2Title: "AI-Powered Marketing",
  feature2Description: "Intelligent marketing campaigns that drive results and engagement.",
  feature2ImageUrl: "/images/default/feature-ai-marketing.jpg",
  feature2ImageQuery: generateConsistentImageQuery("abstract representation of AI analyzing marketing data"),

  feature3Title: "Rocket Client CRM",
  feature3Description: "Streamline your client management and sales processes with our intuitive CRM.",
  feature3ImageUrl: "/images/default/feature-rocket-client.jpg",
  feature3ImageQuery: generateConsistentImageQuery("sleek CRM dashboard interface"),

  websiteDesignPageBannerUrl: "/images/default/banner-web-design.jpg",
  websiteDesignPageBannerQuery: generateConsistentImageQuery("close-up of elegant website code and design elements"),

  aboutPageTeamSectionImageUrl: "/images/default/bg-team-abstract.jpg",
  aboutPageTeamSectionImageQuery: generateConsistentImageQuery(
    "abstract network representing teamwork and collaboration",
  ),
  aboutPageValuesSectionImageUrl: "/images/default/bg-values-pillars.jpg",
  aboutPageValuesSectionImageQuery: generateConsistentImageQuery("stylized pillars representing core company values"),

  // ... other default fields
  servicePageTitle: "Our Expert Digital Services by RocketOpp",
  servicePageDescription: "Explore how RocketOpp's tailored services can elevate your brand and drive growth.",
  // ... (keep other text fields as they were, ensure RocketOpp spelling)
  websiteDesignHeadline: "Professional Website Design by RocketOpp",
  websiteDesignSubheadline: "Elevate your online presence with a stunning, high-performing website from RocketOpp.",
  aiIntegrationHeadline: "AI Integration by RocketOpp",
  aiIntegrationSubheadline: "Unlock the transformative power of AI for your business with RocketOpp.",
  appDevelopmentHeadline: "Custom App Development by RocketOpp",
  appDevelopmentSubheadline: "Transform your ideas into powerful digital solutions with RocketOpp.",
  rocketClientsHeadline: "Rocket Client: The All-In-One Platform by RocketOpp",
  rocketClientsSubheadline: "Streamline marketing, sales, and operations with RocketOpp.",
  aboutPageHeroSubtitle: "Guiding companies to success since 2003. RocketOpp leads the way.",
}

// Template for generating industry-specific content including images
function createIndustryContent(
  industryName: string,
  industryKey: Exclude<Industry, null>, // Removed "other"
  mainServiceFocus: string,
  benefit1: string,
  benefit2: string,
  heroImageSubject: string,
  feature1Subject: string,
  feature2Subject: string,
  feature3Subject: string,
  websiteBannerSubject: string,
  aboutTeamBgSubject: string,
  aboutValuesBgSubject: string,
): ContentPiece {
  const ROCKETOPP_CORRECTED_INDUSTRY_NAME = industryName.replace(/Rocket Opp/g, "RocketOpp")
  return {
    headline: `Propel Your ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} Business with RocketOpp`,
    subheadline: `Specialized ${mainServiceFocus} solutions by RocketOpp for the ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} sector. Drive growth, engagement, and efficiency.`,
    cta: `Explore ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} Solutions with RocketOpp`,

    heroImageUrl: `/images/${industryKey}/hero-main.jpg`,
    heroImageQuery: generateConsistentImageQuery(heroImageSubject, industryKey),

    feature1Title: `Tailored Web Design for ${ROCKETOPP_CORRECTED_INDUSTRY_NAME}`,
    feature1Description: `Websites that capture the essence of the ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} industry.`,
    feature1ImageUrl: `/images/${industryKey}/feature-web-design.jpg`,
    feature1ImageQuery: generateConsistentImageQuery(feature1Subject, industryKey),

    feature2Title: `AI Marketing for ${ROCKETOPP_CORRECTED_INDUSTRY_NAME}`,
    feature2Description: `Drive targeted leads in the ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} market with AI precision.`,
    feature2ImageUrl: `/images/${industryKey}/feature-ai-marketing.jpg`,
    feature2ImageQuery: generateConsistentImageQuery(feature2Subject, industryKey),

    feature3Title: `CRM Solutions for ${ROCKETOPP_CORRECTED_INDUSTRY_NAME}`,
    feature3Description: `Manage your ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} client relationships effectively.`,
    feature3ImageUrl: `/images/${industryKey}/feature-rocket-client.jpg`,
    feature3ImageQuery: generateConsistentImageQuery(feature3Subject, industryKey),

    websiteDesignPageBannerUrl: `/images/${industryKey}/banner-web-design.jpg`,
    websiteDesignPageBannerQuery: generateConsistentImageQuery(websiteBannerSubject, industryKey),

    aboutPageTeamSectionImageUrl: `/images/${industryKey}/bg-team-abstract.jpg`,
    aboutPageTeamSectionImageQuery: generateConsistentImageQuery(aboutTeamBgSubject, industryKey),
    aboutPageValuesSectionImageUrl: `/images/${industryKey}/bg-values-pillars.jpg`,
    aboutPageValuesSectionImageQuery: generateConsistentImageQuery(aboutValuesBgSubject, industryKey),

    // ... other industry-specific text fields, ensuring RocketOpp spelling
    servicePageTitle: `${mainServiceFocus} for the ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} Industry by RocketOpp`,
    servicePageDescription: `Discover how RocketOpp's expert ${mainServiceFocus} services are specifically designed for the ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} sector.`,
    websiteDesignHeadline: `Professional Website Design for ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} by RocketOpp`,
    aiIntegrationHeadline: `AI Integration for ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} Success by RocketOpp`,
    appDevelopmentHeadline: `Custom App Development for ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} by RocketOpp`,
    rocketClientsHeadline: `Rocket Client: The All-In-One Platform for Your ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} Business by RocketOpp`,
    aboutPageHeroSubtitle: `Guiding ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} companies to success. RocketOpp leads the way.`,
    // Ensure benefit1, benefit2, etc., are also processed if they contain "Rocket Opp"
    serviceBenefit1: benefit1.replace(/Rocket Opp/g, "RocketOpp"),
    serviceBenefit2: benefit2.replace(/Rocket Opp/g, "RocketOpp"),
    websiteDesignSubheadline: `Elevate your ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} online presence with a stunning, high-performing website from RocketOpp.`,
    aiIntegrationSubheadline: `Unlock the transformative power of AI for your ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} business with RocketOpp.`,
    appDevelopmentSubheadline: `Transform your ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} ideas into powerful digital solutions with RocketOpp.`,
    rocketClientsSubheadline: `Streamline marketing, sales, and operations in the ${ROCKETOPP_CORRECTED_INDUSTRY_NAME} sector with RocketOpp.`,
  }
}

// Populate for a few example industries
export const industrySpecificContent: Record<Exclude<Industry, null>, ContentPiece> = {
  construction: createIndustryContent(
    "Construction",
    "construction",
    "Web Design & Lead Gen",
    "Showcase projects, attract leads.",
    "Streamline client communication.",
    "modern construction site with digital overlay",
    "blueprint and hardhat with clean design elements",
    "AI analyzing construction project data for efficiency",
    "construction CRM dashboard with project timelines",
    "construction project portfolio website banner",
    "abstract design of construction tools forming a network",
    "strong foundational pillars representing construction reliability",
  ),
  "e-commerce": createIndustryContent(
    "eCommerce",
    "e-commerce",
    "Platform Dev & AI Sales",
    "Boost sales with high-converting platforms.",
    "Personalize shopping with AI.",
    "dynamic online store interface with shopping cart",
    "user-friendly e-commerce product page design",
    "AI powered product recommendation engine visualization",
    "e-commerce sales analytics dashboard",
    "vibrant banner for an e-commerce website",
    "interconnected shopping icons forming a global network",
    "glowing shopping cart symbolizing e-commerce success",
  ),
  "financial-services": createIndustryContent(
    "Financial Services",
    "financial-services",
    "Secure Platforms & Client Trust",
    "Build trust with secure web solutions.",
    "Automate client onboarding.",
    "secure financial data analytics dashboard",
    "professional financial advisor website design",
    "AI chatbot assisting with financial queries",
    "client portal for financial services",
    "banner representing security and trust in finance",
    "abstract network of financial symbols",
    "golden coin stacks representing financial growth",
  ),
  // Add ALL other industries from your personalization-store.ts here,
  // providing unique subjects for each image category.
  // For brevity, I'm not listing all of them, but you must!
  "automotive-services": createIndustryContent(
    "Automotive Services",
    "automotive-services",
    "Online Booking & Parts Sales",
    "Streamline service bookings.",
    "Boost online parts sales.",
    "modern auto repair shop with digital check-in",
    "sleek car parts e-commerce interface",
    "AI diagnosing car issues from sensor data",
    "automotive service management dashboard",
    "banner showcasing car maintenance services",
    "abstract network of gears and engine parts",
    "stylized wrench and tire representing auto services",
  ),
  "day-spa": createIndustryContent(
    "Day Spa",
    "day-spa",
    "Booking Systems & Ambiance Marketing",
    "Elegant online booking for spa services.",
    "Showcase relaxing spa ambiance.",
    "serene day spa interior with online booking interface",
    "beautifully designed spa treatment menu page",
    "AI recommending personalized spa treatments",
    "spa appointment scheduling dashboard",
    "calming banner for a day spa website",
    "abstract design of flowing water and smooth stones",
    "lotus flower symbolizing relaxation and wellness",
  ),
  "family-lawyers": createIndustryContent(
    "Family Lawyers",
    "family-lawyers",
    "Client Acquisition & Secure Portals",
    "Attract clients with targeted marketing.",
    "Secure client communication.",
    "professional law office setting with a digital interface for client intake",
    "family law website design emphasizing trust and discretion",
    "AI organizing case files and legal documents",
    "secure client portal for family law firms",
    "banner representing justice and family law",
    "abstract scales of justice with a family silhouette",
    "gavel and law book symbolizing legal expertise",
  ),
  "franchise-businesses": createIndustryContent(
    "Franchise Businesses",
    "franchise-businesses",
    "Brand Consistency & Localized Marketing",
    "Maintain brand consistency.",
    "Effective local marketing for franchisees.",
    "network of interconnected franchise locations on a map",
    "franchise website template ensuring brand consistency",
    "AI analyzing local market trends for franchises",
    "franchise operations management dashboard",
    "banner for a multi-location franchise business",
    "abstract repeating pattern symbolizing franchise units",
    "key opening multiple doors representing franchise opportunities",
  ),
  "general-contractors": createIndustryContent(
    "General Contractors",
    "general-contractors",
    "Project Showcasing & Lead Generation",
    "Showcase your portfolio.",
    "Generate high-quality leads.",
    "impressive completed construction project by a general contractor",
    "general contractor website portfolio page",
    "AI estimating project costs and timelines",
    "construction project management dashboard for contractors",
    "banner showcasing diverse general contracting projects",
    "abstract blueprint designs forming a cityscape",
    "hard hat and tools representing general contracting work",
  ),
  "general-practitioners": createIndustryContent(
    "General Practitioners",
    "general-practitioners",
    "Patient Engagement & Online Booking",
    "Improve patient communication.",
    "Secure patient information access.",
    "friendly general practitioner's office with an online appointment system",
    "patient portal for a medical clinic website",
    "AI assisting with patient triage and health reminders",
    "medical practice management dashboard",
    "banner for a general practitioner's clinic",
    "abstract stethoscope and heartbeat line",
    "apple symbolizing health and wellness",
  ),
  healthcare: createIndustryContent(
    "Healthcare",
    "healthcare",
    "Patient Portals & HIPAA Compliance",
    "Enhance patient engagement.",
    "Ensure HIPAA compliance.",
    "modern hospital interface for patient data management",
    "secure healthcare patient portal design",
    "AI analyzing medical images for diagnostics",
    "healthcare administration dashboard",
    "banner representing advanced healthcare technology",
    "abstract DNA helix and medical cross",
    "caduceus symbol representing healthcare",
  ),
  "home-services": createIndustryContent(
    "Home Services",
    "home-services",
    "Online Booking & Local SEO",
    "Simplify online appointment booking.",
    "Dominate local search for home services.",
    "home services professional (plumber, electrician) using a tablet for scheduling",
    "online booking system for various home services",
    "AI optimizing routes for home service technicians",
    "home services business management dashboard",
    "banner showcasing a range of home improvement services",
    "abstract house silhouette with tool icons",
    "toolbox symbolizing home repair and maintenance",
  ),
  "insurance-companies": createIndustryContent(
    "Insurance Companies",
    "insurance-companies",
    "Policy Management & AI Chatbots",
    "Streamline policy management.",
    "AI chatbots for customer support.",
    "digital interface for managing insurance policies",
    "insurance company website offering online quotes",
    "AI chatbot helping customers with insurance claims",
    "insurance agency performance dashboard",
    "banner representing security and protection from an insurance company",
    "abstract shield and umbrella symbols",
    "key symbolizing security and access to insurance benefits",
  ),
  "lawncare-services": createIndustryContent(
    "Lawncare Services",
    "lawncare-services",
    "Online Quoting & Service Scheduling",
    "Instant online quotes.",
    "Easy scheduling for lawncare.",
    "lush green lawn with an online booking interface for lawncare services",
    "lawncare service packages and pricing page design",
    "AI optimizing lawn treatment plans based on weather data",
    "lawncare business scheduling and dispatch dashboard",
    "banner showcasing professional lawnmowing and landscaping",
    "abstract leaf and grass patterns",
    "sprinkler head watering a green lawn",
  ),
  manufacturing: createIndustryContent(
    "Manufacturing",
    "manufacturing",
    "B2B Marketing & Supply Chain Tech",
    "Enhance B2B marketing.",
    "Tech for supply chain visibility.",
    "modern automated factory floor with robotic arms",
    "B2B manufacturing company website showcasing products",
    "AI optimizing manufacturing processes and quality control",
    "supply chain management dashboard with real-time tracking",
    "banner representing innovation in manufacturing",
    "abstract gears and conveyor belts",
    "robotic arm assembling a product",
  ),
  "professional-painting": createIndustryContent(
    "Professional Painting",
    "professional-painting",
    "Portfolio Display & Online Estimates",
    "Showcase painting projects.",
    "Online estimates and booking.",
    "beautifully painted room interior with an online quote form for painting services",
    "professional painter's portfolio website gallery",
    "AI color matching and paint quantity estimation tool",
    "painting business project and client management dashboard",
    "banner showcasing high-quality interior and exterior painting",
    "abstract paint strokes and color palettes",
    "paint roller and brush",
  ),
  "real-estate": createIndustryContent(
    "Real Estate",
    "real-estate",
    "Property Listings & Virtual Tours",
    "Immersive property showcases.",
    "Efficient lead and client management.",
    "luxury home listing with a virtual tour interface",
    "real estate agent website with property search features",
    "AI predicting property values and market trends",
    "real estate CRM for managing leads and properties",
    "banner for a real estate agency showcasing diverse properties",
    "abstract house and key symbols",
    "For Sale sign in front of a beautiful house",
  ),
  "retail-shop": createIndustryContent(
    "Retail Shop",
    "retail-shop",
    "POS Integration & Customer Loyalty",
    "Seamless online-to-offline retail experience.",
    "Build customer loyalty programs.",
    "modern retail store interior with a POS system integrated with online inventory",
    "e-commerce website for a local retail shop",
    "AI personalizing offers for retail customers",
    "retail sales and inventory management dashboard",
    "banner for a boutique retail shop",
    "abstract shopping bags and price tags",
    "cash register and credit card terminal",
  ),
  "social-influencers": createIndustryContent(
    "Social Influencers",
    "social-influencers",
    "Personal Branding & Audience Engagement",
    "Strong personal brand website.",
    "Monetize influence, engage audience.",
    "social media influencer's personal website with portfolio and blog",
    "influencer media kit and collaboration inquiry page",
    "AI analyzing audience engagement and content performance",
    "influencer campaign management dashboard",
    "banner for a social media influencer's brand",
    "abstract network of social media icons",
    "camera and microphone symbolizing content creation",
  ),
  "telemedicine-services": createIndustryContent(
    "Telemedicine Services",
    "telemedicine-services",
    "Secure Patient Portals & Virtual Consultations",
    "Secure HIPAA-compliant virtual consultations.",
    "Improve patient access to care.",
    "doctor conducting a telemedicine consultation via video call",
    "secure patient portal for telemedicine services",
    "AI assisting with remote patient monitoring and diagnosis",
    "telehealth platform management dashboard",
    "banner for telemedicine and virtual healthcare services",
    "abstract video call icon with a medical cross",
    "stethoscope on a laptop screen",
  ),
  "trucking-logistics": createIndustryContent(
    "Trucking & Logistics",
    "trucking-logistics",
    "Fleet Management Tech & Client Portals",
    "Efficient fleet management tech.",
    "Real-time tracking for clients.",
    "fleet of trucks with a digital interface for logistics management",
    "client portal for tracking shipments in real-time",
    "AI optimizing delivery routes and fuel efficiency",
    "logistics and fleet operations dashboard",
    "banner for trucking and logistics company",
    "abstract road map and delivery truck icons",
    "cargo ship and freight train symbolizing global logistics",
  ),
}

export function getPersonalizedContent(
  industry: Industry,
  companyName: string | null,
  userName: string | null,
): ContentPiece {
  const baseContentSource =
    industry && industrySpecificContent[industry] ? industrySpecificContent[industry] : defaultContent

  const baseContent: ContentPiece = JSON.parse(JSON.stringify(baseContentSource))

  let {
    headline,
    subheadline,
    heroImageQuery, // Get base query
    feature1ImageQuery,
    feature2ImageQuery,
    feature3ImageQuery,
    websiteDesignPageBannerQuery,
    aboutPageTeamSectionImageQuery,
    aboutPageValuesSectionImageQuery,
    servicePageTitle,
    servicePageDescription,
    websiteDesignHeadline,
    websiteDesignSubheadline,
    websiteDesignBenefit,
    aiIntegrationHeadline,
    aiIntegrationSubheadline,
    aiBenefitPersonalized,
    appDevelopmentHeadline,
    appDevelopmentSubheadline,
    rocketClientsHeadline,
    rocketClientsSubheadline,
    aboutPageHeroSubtitle,
    whyChooseUsBenefit,
    serviceBenefit1,
    serviceBenefit2,
    // ... other text fields
  } = baseContent

  const industryDisplayName = industry
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Ensure RocketOpp spelling in text fields
  const ROCKETOPP_CORRECTOR = (text?: string) => text?.replace(/Rocket Opp/g, "RocketOpp")

  headline = ROCKETOPP_CORRECTOR(headline)!
  subheadline = ROCKETOPP_CORRECTOR(subheadline)!
  servicePageTitle = ROCKETOPP_CORRECTOR(servicePageTitle)
  servicePageDescription = ROCKETOPP_CORRECTOR(servicePageDescription)
  websiteDesignHeadline = ROCKETOPP_CORRECTOR(websiteDesignHeadline)
  websiteDesignSubheadline = ROCKETOPP_CORRECTOR(websiteDesignSubheadline)
  aiIntegrationHeadline = ROCKETOPP_CORRECTOR(aiIntegrationHeadline)
  aiIntegrationSubheadline = ROCKETOPP_CORRECTOR(aiIntegrationSubheadline)
  appDevelopmentHeadline = ROCKETOPP_CORRECTOR(appDevelopmentHeadline)
  appDevelopmentSubheadline = ROCKETOPP_CORRECTOR(appDevelopmentSubheadline)
  rocketClientsHeadline = ROCKETOPP_CORRECTOR(rocketClientsHeadline)
  rocketClientsSubheadline = ROCKETOPP_CORRECTOR(rocketClientsSubheadline)
  aboutPageHeroSubtitle = ROCKETOPP_CORRECTOR(aboutPageHeroSubtitle)
  serviceBenefit1 = ROCKETOPP_CORRECTOR(serviceBenefit1)
  serviceBenefit2 = ROCKETOPP_CORRECTOR(serviceBenefit2)
  whyChooseUsBenefit = ROCKETOPP_CORRECTOR(whyChooseUsBenefit)
  aiBenefitPersonalized = ROCKETOPP_CORRECTOR(aiBenefitPersonalized)
  websiteDesignBenefit = ROCKETOPP_CORRECTOR(websiteDesignBenefit)
  // Correct all other text fields similarly... (ensure this is done in createIndustryContent and defaultContent too)

  if (companyName) {
    headline = headline.replace(/Your \w+ Business/gi, `${companyName}'s Success`)
    subheadline = subheadline.replace(
      new RegExp(industryDisplayName || "Your Industry", "gi"),
      `${companyName} (${industryDisplayName || "Your Industry"})`,
    )
  } else if (industry && industryDisplayName) {
    headline = headline.replace(/Your \w+ Business/gi, `Your ${industryDisplayName} Business`)
  }

  // Regenerate descriptive queries with personalization for *all* image slots
  // Path remains as defined, only query potentially changes for alt text or future use
  return {
    ...baseContent, // returns all original fields, including original image paths
    headline,
    subheadline,
    // Ensure image queries are re-generated if they depend on companyName for alt-text or context
    heroImageQuery: generateConsistentImageQuery(
      baseContent.heroImageQuery.split(" for the")[0],
      industry,
      companyName,
    ), // Extract base subject for regeneration
    feature1ImageQuery: generateConsistentImageQuery(
      baseContent.feature1ImageQuery?.split(" for the")[0] || "feature image 1",
      industry,
      companyName,
    ),
    feature2ImageQuery: generateConsistentImageQuery(
      baseContent.feature2ImageQuery?.split(" for the")[0] || "feature image 2",
      industry,
      companyName,
    ),
    feature3ImageQuery: generateConsistentImageQuery(
      baseContent.feature3ImageQuery?.split(" for the")[0] || "feature image 3",
      industry,
      companyName,
    ),
    websiteDesignPageBannerQuery: generateConsistentImageQuery(
      baseContent.websiteDesignPageBannerQuery?.split(" for the")[0] || "website design banner",
      industry,
      companyName,
    ),
    aboutPageTeamSectionImageQuery: generateConsistentImageQuery(
      baseContent.aboutPageTeamSectionImageQuery?.split(" for the")[0] || "team background",
      industry,
      companyName,
    ),
    aboutPageValuesSectionImageQuery: generateConsistentImageQuery(
      baseContent.aboutPageValuesSectionImageQuery?.split(" for the")[0] || "values background",
      industry,
      companyName,
    ),
    // Ensure all other text fields are passed through, corrected for RocketOpp
    servicePageTitle: ROCKETOPP_CORRECTOR(baseContent.servicePageTitle),
    servicePageDescription: ROCKETOPP_CORRECTOR(baseContent.servicePageDescription),
    serviceBenefit1: ROCKETOPP_CORRECTOR(baseContent.serviceBenefit1),
    serviceBenefit2: ROCKETOPP_CORRECTOR(baseContent.serviceBenefit2),
    websiteDesignHeadline: ROCKETOPP_CORRECTOR(baseContent.websiteDesignHeadline),
    websiteDesignSubheadline: ROCKETOPP_CORRECTOR(baseContent.websiteDesignSubheadline),
    websiteDesignBenefit: ROCKETOPP_CORRECTOR(
      baseContent.websiteDesignBenefit?.replace("the Market", `the ${industryDisplayName || "Market"}`),
    ),
    aiIntegrationHeadline: ROCKETOPP_CORRECTOR(baseContent.aiIntegrationHeadline),
    aiIntegrationSubheadline: ROCKETOPP_CORRECTOR(baseContent.aiIntegrationSubheadline),
    aiBenefitPersonalized: ROCKETOPP_CORRECTOR(
      baseContent.aiBenefitPersonalized?.replace("Clients", `${industryDisplayName || "Clients"}`),
    ),
    appDevelopmentHeadline: ROCKETOPP_CORRECTOR(baseContent.appDevelopmentHeadline),
    appDevelopmentSubheadline: ROCKETOPP_CORRECTOR(baseContent.appDevelopmentSubheadline),
    rocketClientsHeadline: ROCKETOPP_CORRECTOR(baseContent.rocketClientsHeadline),
    rocketClientsSubheadline: ROCKETOPP_CORRECTOR(baseContent.rocketClientsSubheadline),
    aboutPageHeroSubtitle: ROCKETOPP_CORRECTOR(baseContent.aboutPageHeroSubtitle),
    whyChooseUsBenefit: ROCKETOPP_CORRECTOR(
      baseContent.whyChooseUsBenefit?.replace("the Sector", `the ${industryDisplayName || "Sector"}`),
    ),
  }
}
