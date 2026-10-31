/**
 * THE SIX MAIN SERVICE PAGES (Mike, 2026-10-31: "all the main service pages are the number one priority") — one data file, one
 * template (components/services/service-page.tsx). Rule for numbers: every statistic shown as data carries its source and a
 * link. Example panels (pipelines, run logs, answer cards) are labelled as examples, never presented as client results.
 * Process steps and FAQs are RocketOpp's own copy from the pages these replace, with prices kept out (the free consultation is
 * where scope and cost are set).
 */
export type Stat = { value: string; label: string; source: string; url: string }
export type Chart =
  | { kind: "bars"; title: string; note: string; unit: "%" | "$"; data: { label: string; value: number }[]; source: string; url: string }
  | { kind: "donut"; title: string; note: string; value: number; caption: string; source: string; url: string }
  | { kind: "timeline"; title: string; note: string; data: { when: string; what: string }[]; source: string; url: string }
export type Demo = "examples" | "runlog" | "answer" | "pipeline" | "ads" | "stack"

export type MainService = {
  slug: string
  name: string
  eyebrow: string
  h1: [string, string]
  lede: string
  image: { src: string; alt: string }
  chips: [{ title: string; sub: string }, { title: string; sub: string }]
  stats: Stat[]
  problem: { title: string; body: string }
  flow: { title: string; when?: string; body: string }[]
  includes: { title: string; body: string }[]
  chart: Chart
  demo: Demo
  faq: { question: string; answer: string }[]
  related: string[]
}

export const SOURCES = {
  googleSpeed: { source: "Google, “The Need for Mobile Speed” (2016)", url: "https://www.thinkwithgoogle.com/intl/en-gb/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks/" },
  brightlocal: { source: "BrightLocal, Local Consumer Review Survey 2025", url: "https://www.brightlocal.com/research/local-consumer-review-survey-2025/" },
  hbr: { source: "Harvard Business Review, “The Short Life of Online Sales Leads” (2011)", url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
  chamber: { source: "U.S. Chamber of Commerce, Empowering Small Business reports (2024–2026)", url: "https://www.uschamber.com/technology/2026-empowering-small-business-report" },
  localiq: { source: "LocaliQ, Home Services Advertising Benchmarks (search ads, 2020–21 data)", url: "https://localiq.com/blog/home-services-advertising-benchmarks/" },
  mcp: { source: "Model Context Protocol — history and adoption", url: "https://en.wikipedia.org/wiki/Model_Context_Protocol" },
}

const STAT_SPEED: Stat = { value: "53%", label: "of mobile visits are abandoned when a page takes longer than 3 seconds to load", ...SOURCES.googleSpeed }
const STAT_REVIEWS: Stat = { value: "96%", label: "of consumers read online reviews of local businesses — only 4% say they never do", ...SOURCES.brightlocal }
const STAT_LEADS: Stat = { value: "7×", label: "more likely to qualify a lead when you respond within an hour than when you wait longer", ...SOURCES.hbr }
const STAT_NEVER: Stat = { value: "23%", label: "of companies never responded to a web lead at all", ...SOURCES.hbr }
const STAT_AI: Stat = { value: "66%", label: "of U.S. small businesses now use AI — nearly 3× the share in 2023", ...SOURCES.chamber }
const STAT_CPL: Stat = { value: "$38–$101", label: "average search-ad cost per lead across home services, from landscaping to roofing", ...SOURCES.localiq }

const FREE_SITE = { question: "Is the website really free?", answer: "Yes. Small service businesses that are a good fit get their website built at no cost — no purchase necessary. The only cost is our lead management tool for contacts and appointments, $49 per month. That's it." }

export const MAIN_SERVICES: MainService[] = [
  {
    slug: "website-development",
    name: "Website Development",
    eyebrow: "Website development",
    h1: ["Websites that turn visitors into ", "booked jobs"],
    lede: "Fast, mobile-first websites for service businesses — built so customers can find you, trust you and call or book in one tap. For small service businesses that are a good fit, the website is free.",
    image: { src: "/images/services/website-development.jpg", alt: "A plumber beside his service van checking a new booking on his phone" },
    chips: [{ title: "New booking", sub: "From your website" }, { title: "Tap to call", sub: "On every page" }],
    stats: [STAT_SPEED, STAT_REVIEWS, STAT_LEADS],
    problem: { title: "Most small-business websites lose the customer before the phone rings.", body: "Slow on a phone, hard to find on Google, no clear way to call or book. The customer doesn't complain — they just tap the next result. We build the opposite: a fast site with one job, turning a search into a booked appointment." },
    flow: [
      { title: "Free consultation", body: "We talk about your business, your customers and your goals — and whether a website from us is a good fit." },
      { title: "Plan the pages", body: "Services, service areas, reviews, booking. Every page has a job and a reason for a customer to land on it." },
      { title: "Design", body: "A custom design in your brand — no templates — built mobile-first, because that's where your customers are." },
      { title: "Build & speed", body: "Built on Next.js and a global CDN, with schema, meta tags and a sitemap from day one." },
      { title: "Launch on Google", body: "Search Console, analytics and your Google Business Profile connected so customers can find you." },
      { title: "Leads into one place", body: "Every call, form and booking lands in your lead management tool, so nothing slips through." },
    ],
    includes: [
      { title: "Custom design", body: "Unique, branded design tailored to your business. No templates." },
      { title: "Mobile-first", body: "Looks right and works fast on every phone and tablet." },
      { title: "Search-ready", body: "Schema markup, meta tags, sitemap and Core Web Vitals handled." },
      { title: "Fast by default", body: "Next.js on a global CDN, images sized for each screen." },
      { title: "Secure & reliable", body: "HTTPS, DDoS protection and hosting on Vercel." },
      { title: "Edit it yourself", body: "Update text, photos and posts without touching code." },
    ],
    chart: { kind: "donut", title: "Speed is the first impression", note: "Share of mobile visits abandoned when a page takes more than three seconds to load.", value: 53, caption: "abandoned", ...SOURCES.googleSpeed },
    demo: "examples",
    faq: [
      FREE_SITE,
      { question: "What technology do you use?", answer: "We build with Next.js, React and Tailwind CSS, deployed on Vercel for a global CDN and automatic HTTPS." },
      { question: "Can I update the website content myself?", answer: "Yes. Every website lets you update text, images and posts without touching code, and we show you how." },
      { question: "Do you offer ongoing maintenance?", answer: "Yes. Updates, security patches, performance monitoring and content changes are available — we walk through what fits your business in the free consultation." },
    ],
    related: ["sxo", "crm-automation", "ppc-management"],
  },
  {
    slug: "ai-automation",
    name: "AI Automation",
    eyebrow: "AI business automation",
    h1: ["AI that does the work ", "you shouldn't have to"],
    lede: "We replace repetitive work — lead follow-up, scheduling, support replies, data entry, reporting — with AI agents connected to the tools you already use, with guardrails and a human in the loop.",
    image: { src: "/images/services/ai-automation.jpg", alt: "A small-business owner reviewing an automated workflow on her laptop in the evening" },
    chips: [{ title: "Lead routed", sub: "In seconds, not hours" }, { title: "Follow-up sent", sub: "While you're on a job" }],
    stats: [STAT_AI, STAT_LEADS, STAT_NEVER],
    problem: { title: "Every manual workflow is a person you'd have to hire to grow.", body: "Leads wait in an inbox, quotes go out late, the same questions get answered by hand every day. AI agents with access to your real tools take that work off your plate — and hand anything unusual to a person." },
    flow: [
      { title: "Operations audit", when: "Day 1–3", body: "We map every manual workflow worth automating and score each one by hours saved and revenue impact. You see the math before we build." },
      { title: "Agent design", when: "Day 4–7", body: "Each workflow becomes an agent with a defined goal, a tool list, guardrails and a failure plan, tested against your real data." },
      { title: "Build + integrate", when: "Week 2", body: "Agents go live against your CRM, email, calendar and billing, built on 0nMCP so they work with what you already use." },
      { title: "Observability + handoff", when: "Week 2–3", body: "A live view of every run — what it did, which tools it called. Your team learns to read it in one short session." },
      { title: "Refine in production", when: "Day 30–60", body: "Real use surfaces edge cases. We tune, add tool calls and fix anything brittle." },
      { title: "Add the next agent", when: "Month 2+", body: "Once one agent pays back, we layer the next on the same foundation." },
    ],
    includes: [
      { title: "Lead qualification + routing", body: "Read the form, enrich the contact, score it, route it with full context." },
      { title: "Customer support triage", body: "First replies to common questions; everything else handed to a person with a summary." },
      { title: "Content production", body: "Posts, emails and articles drafted in your voice and queued for your review." },
      { title: "CRM data hygiene", body: "Enrich contacts, remove duplicates, summarise calls, follow up on no-replies." },
      { title: "Operations + reporting", body: "Weekly numbers, reconciliations and anomaly flags without the Sunday-night spreadsheet." },
      { title: "Custom agents", body: "Show us the spreadsheet or the email thread — we build the agent that ends it." },
    ],
    chart: { kind: "bars", title: "Small businesses are adopting AI fast", note: "Share of U.S. small businesses using AI, by year.", unit: "%", data: [{ label: "2023", value: 23 }, { label: "2024", value: 40 }, { label: "2025", value: 58 }, { label: "2026", value: 66 }], ...SOURCES.chamber },
    demo: "runlog",
    faq: [
      { question: "What is AI business automation, exactly?", answer: "Replacing repetitive manual workflows — lead qualification, support replies, invoice reconciliation, content, scheduling — with AI agents that have access to your real business tools (CRM, email, calendar, billing)." },
      { question: "How is this different from Zapier or Make?", answer: "Zapier and Make are if-this-then-that, and they break when data doesn't fit. AI agents read each input, decide what to do, call the right tools and escalate when unsure." },
      { question: "What if the AI agent makes a mistake?", answer: "Every agent ships with a defined goal, hard guardrails (for example, never delete a contact or charge a card without confirmation), an escalation path to a human, and a complete log of every action." },
      { question: "Do I need a developer to maintain it?", answer: "No. Every agent comes with a plain-English playbook — its goal, the dashboard, when to step in. If your team can use a CRM, they can manage it." },
      { question: "What's 0nMCP?", answer: "Our own orchestrator — a Model Context Protocol server that gives an AI agent access to the business tools it needs. We build it and maintain it, so the integration work is already done." },
    ],
    related: ["crm-automation", "mcp-integration", "website-development"],
  },
  {
    slug: "sxo",
    name: "SXO",
    eyebrow: "Search experience optimisation",
    h1: ["Be the business Google — and AI — ", "recommends"],
    lede: "SXO combines search optimisation, user experience, conversion and AI-engine readiness, so you show up when customers search on Google or ask ChatGPT, and the visit turns into a call.",
    image: { src: "/images/services/sxo.jpg", alt: "A homeowner searching for a local plumber on her phone in the kitchen" },
    chips: [{ title: "Found on Google", sub: "And in AI answers" }, { title: "Visit → call", sub: "Measured, not guessed" }],
    stats: [STAT_REVIEWS, STAT_SPEED, STAT_LEADS],
    problem: { title: "Ranking isn't the goal. Being chosen is.", body: "Customers compare a few results, read reviews and pick the one that looks trustworthy and easy. More and more, an AI assistant picks for them. SXO works on all of it: being found, being understood, and being chosen." },
    flow: [
      { title: "Free SXO scan", when: "Hour 1", body: "We run your site through our scanner: a current score, the biggest blocker and a target before we ship anything." },
      { title: "Structure + schema", when: "Day 1–7", body: "Answer-first content, schema and a custom llms.txt so Google and AI assistants can understand and cite you." },
      { title: "Conversion layer", when: "Week 2", body: "CRO9 watches how visitors move and improves headlines and calls to action on your key pages." },
      { title: "Content + citations", when: "Month 1+", body: "Articles built on the same patterns, plus outreach for mentions and citations." },
      { title: "Live reporting", when: "Ongoing", body: "Rankings, AI citations, conversions and what we shipped — in one dashboard." },
      { title: "Compound", when: "Quarter 2+", body: "Pillar content, more locations and links. The site gets stronger every month." },
    ],
    includes: [
      { title: "Search optimisation", body: "Technical audit, on-page rewrites, schema, internal links, Core Web Vitals." },
      { title: "User experience", body: "Every page judged by how a real visitor moves through it." },
      { title: "Conversion", body: "Clearer calls to action and less friction between visit and call." },
      { title: "AI-engine readiness", body: "llms.txt, answer-first structure, FAQ and HowTo schema for AI assistants." },
      { title: "Local presence", body: "Google Business Profile, service-area pages and review strategy." },
      { title: "Live reporting", body: "Every signal tied to calls and bookings — no vanity charts." },
    ],
    chart: { kind: "donut", title: "Reviews decide who gets the call", note: "Share of consumers who read online reviews of local businesses.", value: 96, caption: "read reviews", ...SOURCES.brightlocal },
    demo: "answer",
    faq: [
      { question: "What is SXO and how is it different from SEO?", answer: "SXO (search experience optimisation) covers search, user experience, conversion and AI-engine readiness together. SEO was built for ten blue links; SXO is built for how people choose a business today — including through AI assistants." },
      { question: "Will my site get cited by ChatGPT and Perplexity?", answer: "That's what the AI-engine readiness layer is for: a custom llms.txt, answer-first headings, and FAQ and HowTo schema. No one can guarantee a citation, but these are the signals AI assistants rely on." },
      { question: "Do you guarantee first-page rankings?", answer: "No — no honest agency can. We agree a measurable target with you at the start (calls, organic traffic, conversions) and report against it." },
      { question: "What's CRO9?", answer: "Our own conversion engine. It observes how visitors behave and improves content blocks like headlines and calls to action on your key pages." },
    ],
    related: ["website-development", "ppc-management", "ai-automation"],
  },
  {
    slug: "crm-automation",
    name: "CRM Automation",
    eyebrow: "CRM setup & automation",
    h1: ["Never lose a lead ", "in the inbox again"],
    lede: "Pipelines, follow-up texts and emails, online booking, reminders and reporting — set up around how you actually sell, so every lead gets a fast reply and every job is tracked.",
    image: { src: "/images/services/crm-automation.jpg", alt: "A day spa owner checking the day's appointments on a tablet at the front desk" },
    chips: [{ title: "Reminder sent", sub: "24 hours before" }, { title: "Lead replied", sub: "Within minutes" }],
    stats: [STAT_LEADS, STAT_NEVER, STAT_REVIEWS],
    problem: { title: "Bad CRMs don't lose deals — they hide them.", body: "A lead fills in a form at 9 pm, nobody replies until tomorrow afternoon, and by then they've booked someone else. Speed wins, and speed comes from automation: the right reply, reminder and follow-up, sent the moment it's needed." },
    flow: [
      { title: "Revenue audit", when: "Day 1–2", body: "Where leads come from, how they're qualified, when they convert and what falls through the cracks." },
      { title: "Pipeline + fields", when: "Day 3–4", body: "Pipelines, custom fields, tags and segments modelled on your real sales process." },
      { title: "Sequences live", when: "Day 5–7", body: "Email and text sequences written and tested, every form wired in, bookings flowing." },
      { title: "AI on top", when: "Week 2", body: "Lead scoring, data hygiene and call summaries — with your CRM as the source of truth." },
      { title: "Train + handoff", when: "Week 2", body: "A one-hour walkthrough and short videos so your team can run it without us." },
      { title: "Refine + report", when: "Day 30–90", body: "We watch the numbers, tune sequences and report on the impact." },
    ],
    includes: [
      { title: "Pipelines + custom fields", body: "Modelled on how you actually sell, with automation triggers from day one." },
      { title: "Email + text sequences", body: "Written, tested and sent the moment a lead lands." },
      { title: "Booking + reminders", body: "Calendar tied to the CRM, reminders and no-show recovery." },
      { title: "AI lead scoring", body: "Hot leads rise to the top of the list automatically." },
      { title: "Data hygiene", body: "Contacts enriched, duplicates merged, calls summarised." },
      { title: "Revenue reporting", body: "Pipeline value, conversion by stage and what's working — live." },
    ],
    chart: { kind: "bars", title: "How fast companies answer web leads", note: "When 2,241 U.S. companies first responded to a web lead.", unit: "%", data: [{ label: "Within 1 hour", value: 37 }, { label: "1–24 hours", value: 16 }, { label: "Over 24 hours", value: 24 }, { label: "Never", value: 23 }], ...SOURCES.hbr },
    demo: "pipeline",
    faq: [
      { question: "What is CRM automation?", answer: "Removing manual sales work — lead routing, follow-up, appointment confirmation, data entry, call notes, stage updates — by letting your CRM do it in the background." },
      { question: "What CRM platforms do you work with?", answer: "We're platform-agnostic: HubSpot, Salesforce, Pipedrive, Zoho, ActiveCampaign, Keap and our own CRM stack." },
      { question: "Will my data import cleanly?", answer: "Yes. Import and clean-up are part of every engagement: duplicates merged, phone and email formats normalised, old fields mapped to new ones." },
      { question: "Do you handle email deliverability and texting compliance?", answer: "Yes. SPF, DKIM, DMARC and warm-up for email; opt-in flows and compliant footers for text messages." },
      { question: "What does the $49/month lead tool include?", answer: "Your contacts and appointments in one place, so every call, form and booking from your website lands somewhere you can act on it." },
    ],
    related: ["ai-automation", "website-development", "ppc-management"],
  },
  {
    slug: "ppc-management",
    name: "PPC Management",
    eyebrow: "Google & Meta ads",
    h1: ["Ads that pay for themselves — ", "or get fixed"],
    lede: "Google, Meta and LinkedIn ads run by one team, with clean tracking from click to booked job, landing pages built to convert, and a flat fee — so we never make more when you waste more.",
    image: { src: "/images/services/ppc-management.jpg", alt: "A roofing contractor reviewing ad performance charts with his marketing partner" },
    chips: [{ title: "Cost per lead", sub: "Tracked weekly" }, { title: "Your accounts", sub: "You own the data" }],
    stats: [STAT_CPL, STAT_SPEED, STAT_LEADS],
    problem: { title: "Your agency is making more when you waste more.", body: "Percentage-of-spend fees reward bigger budgets, not better results. We work on a flat fee, in your own ad accounts, and judge every campaign by cost per booked job — not clicks or impressions." },
    flow: [
      { title: "Audit + target", when: "Day 1–3", body: "We audit existing accounts and lock in your ideal customer and offer." },
      { title: "Tracking", when: "Day 4–7", body: "GA4, conversion APIs and CRM connections wired before launch, so the platforms optimise on real leads." },
      { title: "Creative + pages", when: "Week 2", body: "Ad variants in your voice and landing pages built to convert." },
      { title: "Launch + watch", when: "Week 2–3", body: "Campaigns live, monitored daily in the first weeks to catch problems before they burn budget." },
      { title: "Shift the budget", when: "Week 3+", body: "Money moves to the campaigns and channels that produce booked jobs." },
      { title: "Experiment", when: "Month 2+", body: "New audiences, offers and creative every month." },
    ],
    includes: [
      { title: "Google Search + Local Services", body: "Show up when customers search for exactly what you do, where you do it." },
      { title: "Meta + LinkedIn", body: "Reach the right people in your area before they search." },
      { title: "Conversion tracking", body: "From click to call to booked job — wired before we spend a dollar." },
      { title: "Landing pages", body: "Pages built for the ad, not your homepage." },
      { title: "Creative refresh", body: "New ad variants so performance doesn't fade." },
      { title: "Live dashboard", body: "Every channel and every dollar on one screen." },
    ],
    chart: { kind: "bars", title: "What a search-ad lead costs in home services", note: "Average cost per lead from Google search ads, by trade.", unit: "$", data: [{ label: "Landscaping", value: 38.47 }, { label: "Pest control", value: 39.25 }, { label: "Plumbing", value: 48.91 }, { label: "HVAC", value: 55.15 }, { label: "Roofing", value: 101.49 }], ...SOURCES.localiq },
    demo: "ads",
    faq: [
      { question: "Is PPC still worth it?", answer: "For most service businesses, yes — but only with clean tracking, a page built for the ad and someone watching cost per lead every week." },
      { question: "Which platform should I run?", answer: "Local services usually start with Google Search and Local Services Ads, then Meta. B2B leans on LinkedIn. We start with the channel that matches how your customers buy." },
      { question: "Will you use my existing accounts?", answer: "Always. We work inside your Google, Meta and LinkedIn accounts, so you own the data, history and audiences — if you ever leave, everything stays with you." },
      { question: "Do you guarantee results?", answer: "We guarantee execution: clean tracking, ads in market and a weekly report. We don't guarantee a cost per lead, because that depends on your offer and market — but we agree a target with you and report against it." },
      { question: "Can I cancel anytime?", answer: "Yes. Month to month, no exit fees." },
    ],
    related: ["sxo", "website-development", "crm-automation"],
  },
  {
    slug: "mcp-integration",
    name: "MCP Integration",
    eyebrow: "MCP server integration",
    h1: ["Connect your AI to the tools ", "your business runs on"],
    lede: "The Model Context Protocol lets AI assistants work with your real systems — CRM, email, calendar, billing. We set it up on 0nMCP, our own MCP server, with your credentials sealed in an encrypted vault.",
    image: { src: "/images/services/ai-automation.jpg", alt: "A business owner reviewing an AI workflow connected to her business tools" },
    chips: [{ title: "Tools connected", sub: "CRM · email · calendar" }, { title: "Credentials sealed", sub: "Encrypted vault" }],
    stats: [STAT_AI, STAT_LEADS, STAT_NEVER],
    problem: { title: "Every AI project dies in the integration phase.", body: "The AI is easy. Getting it safely into your CRM, inbox, calendar and billing is the hard part. MCP is the open standard that solves it — and 0nMCP means that work is already done." },
    flow: [
      { title: "Tool inventory", when: "Day 1", body: "We catalogue the tools you use and map each one to the 0nMCP catalogue." },
      { title: "Vault + auth", when: "Day 2–3", body: "Every credential goes into an encrypted, audit-logged 0nVault container." },
      { title: "Server provisioned", when: "Day 3–4", body: "0nMCP stands up for your environment, with configs for Claude, Cursor, Gemini and other MCP hosts." },
      { title: "First agent", when: "Day 5–7", body: "One production agent on the foundation — usually your highest-leverage workflow." },
      { title: "Docs + handoff", body: "Plain-English documentation so your team can run it." },
      { title: "Custom tools", when: "Week 2+", body: "Multi-agent crews and custom tools for anything not already covered." },
    ],
    includes: [
      { title: "0nMCP server", body: "Provisioned and secured for your environment." },
      { title: "Your tools, connected", body: "CRM, email, Slack, Stripe, Google, Microsoft, Shopify and more — authenticated to your accounts." },
      { title: "0nVault", body: "AES-256-GCM encrypted credential vault with a full audit log and per-tool revocation." },
      { title: "MCP host configs", body: "Claude Desktop, Claude Code, Cursor, Windsurf, Gemini and others." },
      { title: "First agent", body: "One production agent on top of the foundation." },
      { title: "Run history", body: "A trace of every agent run: what it did and which tools it called." },
    ],
    chart: { kind: "timeline", title: "MCP became the standard fast", note: "Key moments for the Model Context Protocol.", data: [{ when: "Nov 2024", what: "Anthropic introduces MCP as an open standard" }, { when: "Mar 2025", what: "OpenAI adopts MCP across its products" }, { when: "Apr 2025", what: "Google announces MCP support for Gemini" }], ...SOURCES.mcp },
    demo: "stack",
    faq: [
      { question: "What is MCP and why does it matter?", answer: "MCP (Model Context Protocol) is the open standard Anthropic published in 2024 that lets AI models work with external tools — CRMs, databases, APIs. Any compliant AI host can use any compliant tool, so integrations are built once." },
      { question: "What is 0nMCP?", answer: "Our own MCP server (npm: 0nmcp). Every agent we build starts from it, which is why the integration work doesn't have to be redone for each project." },
      { question: "Can I use this with Claude, Cursor or Windsurf?", answer: "Yes. We ship configs for the major MCP hosts, so your team keeps using the AI tools they prefer." },
      { question: "How are credentials secured?", answer: "Every credential lives in a 0nVault container — AES-256-GCM encrypted and audit-logged. Agents read authentication only from the vault, and any tool can be revoked in one step." },
      { question: "Do I need an in-house developer?", answer: "No. We provision, configure and document everything for a non-technical team." },
    ],
    related: ["ai-automation", "crm-automation", "sxo"],
  },
]

export const mainServiceBySlug = (slug: string) => MAIN_SERVICES.find((s) => s.slug === slug)!
