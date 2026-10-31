/**
 * One page per service trade at /free-website/<slug> — the same offer as the homepage, said in that trade's words, so a
 * plumber searching "free website for plumbers" lands on a page about plumbers. Every claim here is either the offer as Mike
 * stated it (free website if we're a fit, $49/mo lead tool, nothing more) or general advice about what the trade's site
 * needs. No invented results, timelines or guarantees.
 */
export type Trade = {
  slug: string
  /** "Plumbers" — the chip label and the plural in titles */
  name: string
  /** "plumbing business" — fills "a free website for your ___" */
  business: string
  /** what this trade's customers are doing when they find you */
  moment: string
  /** what a website for this trade needs — shown as the "built for" list */
  needs: string[]
  faq: { question: string; answer: string }[]
  /** portfolio slugs to show first */
  work: string[]
}

const BASE_NEEDS = {
  call: "Click-to-call on every page, so a customer on a phone reaches you in one tap",
  book: "Online booking that lands straight in your lead management tool",
  areas: "Your service areas spelled out, so Google knows where you work",
  reviews: "Room for your reviews and photos of real jobs",
}

export const TRADES: Trade[] = [
  {
    slug: "plumbers", name: "Plumbers", business: "plumbing business",
    moment: "Most plumbing calls start with a problem that can't wait — a leak, a clog, no hot water — and a search on a phone.",
    needs: [BASE_NEEDS.call, "A clear list of what you fix and install, from drains to water heaters", "Emergency and after-hours availability stated up front", BASE_NEEDS.areas, BASE_NEEDS.reviews],
    faq: [
      { question: "Do you build websites for plumbers?", answer: "Yes. Plumbing is one of the service trades we focus on. Start with a free consultation — if we're a good fit, we build your plumbing business a website for free, and the only cost is the $49/month lead management tool." },
      { question: "What should a plumbing website have?", answer: "A phone number you can tap, the services you offer, the towns you cover, whether you take emergency calls, and reviews from real customers. Those are what someone with a leak looks for before they call." },
    ],
    work: ["ecospray-solutions", "pavers-restored", "clutch-energy"],
  },
  {
    slug: "hvac", name: "HVAC", business: "HVAC business",
    moment: "Heating and cooling customers search when the system quits or the season turns — and they call whoever looks trustworthy first.",
    needs: [BASE_NEEDS.call, "Separate pages for heating, cooling, maintenance and installs", "Seasonal tune-up booking that fills your slow weeks", BASE_NEEDS.areas, BASE_NEEDS.reviews],
    faq: [
      { question: "Do you build websites for HVAC companies?", answer: "Yes. HVAC is one of the service trades we focus on. Book a free consultation — if we're a good fit, your website is free, and the only cost is the $49/month lead management tool for your contacts and appointments." },
      { question: "What should an HVAC website have?", answer: "Tap-to-call, the systems you service, your service area, maintenance plans or tune-up booking, and reviews. Seasonal booking matters most: it turns a slow month into a full calendar." },
    ],
    work: ["ecospray-solutions", "process-kana", "clutch-energy"],
  },
  {
    slug: "electricians", name: "Electricians", business: "electrical business",
    moment: "People hire an electrician on trust. Your website is where they decide whether you look licensed, local and reliable.",
    needs: [BASE_NEEDS.call, "Residential and commercial work on their own pages", "Your licensing and insurance where customers can see it", BASE_NEEDS.areas, BASE_NEEDS.book],
    faq: [
      { question: "Do you build websites for electricians?", answer: "Yes. Electricians are one of the service trades we focus on. Start with a free consultation; if we take the project on, the website is free and the only cost is the $49/month lead management tool." },
      { question: "What should an electrician's website have?", answer: "A tappable phone number, the work you do (panels, wiring, lighting, EV chargers, commercial), proof you're licensed and insured, the towns you serve, and a simple way to request an estimate." },
    ],
    work: ["clutch-energy", "strainsense", "ecospray-solutions"],
  },
  {
    slug: "roofers", name: "Roofers", business: "roofing business",
    moment: "A roof is a big decision. Homeowners compare a few roofers online before they ever pick up the phone.",
    needs: ["Photos of finished roofs front and center", "A free-estimate request that goes straight to your lead tool", "Storm and insurance-claim help explained plainly", BASE_NEEDS.areas, BASE_NEEDS.reviews],
    faq: [
      { question: "Do you build websites for roofers?", answer: "Yes. Roofing is one of the service trades we focus on. Book a free consultation — if we're a good fit, we build your roofing website for free. The only cost is the $49/month lead management tool." },
      { question: "What should a roofing website have?", answer: "Photos of real jobs, an easy estimate request, the materials and services you offer, how you handle storm damage and insurance, your service area, and reviews." },
    ],
    work: ["pavers-restored", "ecospray-solutions", "blue-fox-landscape"],
  },
  {
    slug: "landscapers", name: "Landscaping", business: "landscaping business",
    moment: "Landscaping sells with pictures. A good site lets your best yards do the talking — and makes the next step easy.",
    needs: ["A gallery of your best projects", "Design, install and maintenance as separate services", "Seasonal booking for spring cleanups and fall work", BASE_NEEDS.areas, BASE_NEEDS.call],
    faq: [
      { question: "Do you build websites for landscapers?", answer: "Yes — and we've built several, including Blue Fox Landscape Design and Lady Fox Gardening. Start with a free consultation; if we're a good fit your website is free, and the only cost is the $49/month lead management tool." },
      { question: "What should a landscaping website have?", answer: "A project gallery, the services you offer, your service area, seasonal booking and an easy way to ask for a quote. Customers buy what they can see." },
    ],
    work: ["blue-fox-landscape", "lady-fox-gardening", "pavers-restored"],
  },
  {
    slug: "cleaning-services", name: "Cleaning", business: "cleaning business",
    moment: "Cleaning customers want to know three things fast: what you clean, when you can come, and whether they can trust you in their home.",
    needs: ["Residential, commercial and move-out cleaning spelled out", "Recurring-visit booking that keeps your schedule full", "Who you are — customers are letting you into their space", BASE_NEEDS.areas, BASE_NEEDS.reviews],
    faq: [
      { question: "Do you build websites for cleaning companies?", answer: "Yes. Cleaning services are one of the trades we focus on. Book a free consultation — if we're a good fit, the website is free and the only cost is the $49/month lead management tool for your contacts and appointments." },
      { question: "What should a cleaning business website have?", answer: "The kinds of cleaning you do, how to book a one-time or recurring visit, your service area, something about your team, and reviews." },
    ],
    work: ["lady-fox-gardening", "eden-salon", "premier-pet-doors"],
  },
  {
    slug: "contractors", name: "Contractors", business: "contracting business",
    moment: "Homeowners vet contractors carefully. The ones with a clear, professional website get the call back.",
    needs: ["Before-and-after photos of real projects", "Each type of job you take on its own page", "An estimate request that goes straight to your lead tool", BASE_NEEDS.areas, BASE_NEEDS.reviews],
    faq: [
      { question: "Do you build websites for contractors?", answer: "Yes. General contractors and remodelers are one of the trades we focus on. Start with a free consultation; if we take the project on, your website is free and the only cost is the $49/month lead management tool." },
      { question: "What should a contractor's website have?", answer: "Project photos, the work you take on, the area you cover, licensing and insurance, reviews, and an easy way to request an estimate." },
    ],
    work: ["pavers-restored", "ecospray-solutions", "blue-fox-landscape"],
  },
  {
    slug: "auto-repair", name: "Auto repair", business: "auto repair shop",
    moment: "Drivers choose a shop by what's close, what's open and what other drivers say. Your website should answer all three in seconds.",
    needs: [BASE_NEEDS.call, "Hours, location and directions impossible to miss", "The services you do, from oil changes to diagnostics", BASE_NEEDS.book, BASE_NEEDS.reviews],
    faq: [
      { question: "Do you build websites for auto repair shops?", answer: "Yes. Auto repair is one of the service trades we focus on. Book a free consultation — if we're a good fit your website is free, and the only cost is the $49/month lead management tool." },
      { question: "What should an auto repair website have?", answer: "Hours, address and directions, tap-to-call, the services you offer, appointment booking and reviews." },
    ],
    work: ["clutch-energy", "arbco-wheels", "shasko-logistics"],
  },
  {
    slug: "salons-and-spas", name: "Salons & spas", business: "salon or spa",
    moment: "Salon and spa clients book on feel. A calm, beautiful site with easy booking fills chairs.",
    needs: ["A look that matches the experience you give", "Services and booking side by side", "Your team, with who does what", "Gift cards and specials easy to find", BASE_NEEDS.reviews],
    faq: [
      { question: "Do you build websites for salons and spas?", answer: "Yes — Eden Salon & Day Spa is one of ours. Start with a free consultation; if we're a good fit, your website is free and the only cost is the $49/month lead management tool, which keeps your clients and appointments in one place." },
      { question: "What should a salon website have?", answer: "Your services, your team, easy online booking, photos of your work and space, and reviews." },
    ],
    work: ["eden-salon", "donnas-dance", "first-med-training"],
  },
  {
    slug: "pet-care", name: "Pet care", business: "pet care business",
    moment: "Pet owners are picky for good reason. They want to see who's caring for their animal before they book.",
    needs: ["Grooming, boarding, walking or training — each clearly explained", "Photos of real pets and your space", BASE_NEEDS.book, BASE_NEEDS.areas, BASE_NEEDS.reviews],
    faq: [
      { question: "Do you build websites for pet care businesses?", answer: "Yes. Groomers, sitters, walkers, trainers and boarders are all a fit. Book a free consultation — if we take the project on, your website is free and the only cost is the $49/month lead management tool." },
      { question: "What should a pet care website have?", answer: "The services you offer, who'll care for the pet, photos, booking, your area and reviews." },
    ],
    work: ["premier-pet-doors", "swank-farm", "hidden-acres"],
  },
  {
    slug: "movers", name: "Movers", business: "moving company",
    moment: "People hire movers once every few years and compare several. The one that's easiest to get a quote from usually wins.",
    needs: ["A quote request that asks the right questions up front", "Local, long-distance and packing as separate services", BASE_NEEDS.call, BASE_NEEDS.areas, BASE_NEEDS.reviews],
    faq: [
      { question: "Do you build websites for moving companies?", answer: "Yes. Movers are one of the service trades we focus on. Start with a free consultation; if we're a good fit, your website is free and the only cost is the $49/month lead management tool." },
      { question: "What should a moving company website have?", answer: "A simple quote request, your services, the areas you move to and from, licensing, and reviews." },
    ],
    work: ["shasko-logistics", "clutch-energy", "rhino-bags"],
  },
  {
    slug: "pest-control", name: "Pest control", business: "pest control business",
    moment: "Nobody shops for pest control until they need it now. Be the one they can reach in one tap.",
    needs: [BASE_NEEDS.call, "The pests you handle, each with its own page", "Recurring service plans explained simply", BASE_NEEDS.areas, BASE_NEEDS.reviews],
    faq: [
      { question: "Do you build websites for pest control companies?", answer: "Yes. Pest control is one of the service trades we focus on. Book a free consultation — if we're a good fit, the website is free and the only cost is the $49/month lead management tool." },
      { question: "What should a pest control website have?", answer: "Tap-to-call, the pests you treat, service plans, your service area, and reviews." },
    ],
    work: ["ecospray-solutions", "lady-fox-gardening", "premier-pet-doors"],
  },
]

export const tradeBySlug = (slug: string) => TRADES.find((t) => t.slug === slug)
