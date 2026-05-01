/**
 * RocketOpp Family — every site Mike owns/operates, treated as one ecosystem.
 *
 * These are NOT marketed as separate "apps" — they're the family portfolio.
 * Each one becomes a deep-dive lead-gen page at /family/[slug] on rocketopp.com.
 *
 * Three buckets shown in the dropdown:
 *   1. AI Lead Gen Apps  — tools that generate leads (free or freemium)
 *   2. AI SaaS Apps      — productized recurring revenue
 *   3. 0nMCP             — singular hero entry, the orchestrator behind it all
 *
 * Plus a fourth list of "0n family" sister sites linked below the buckets.
 *
 * Every entry exports the data the deep-dive page needs to render.
 */

export type FamilyBucket = 'lead-gen' | 'saas' | '0nmcp' | '0n-family'

export interface FamilyKeyword {
  /** What people actually type into search. */
  query: string
  /** Approx monthly search volume — used for prioritization, not displayed. */
  volume?: number
}

export interface FamilyStat {
  label: string
  value: string
}

export interface FamilyFeature {
  title: string
  body: string
  /** Lucide icon name to render. Resolved client-side. */
  icon?: string
}

export interface FamilyMember {
  /** URL slug at /family/[slug] */
  slug: string
  /** Human-readable name */
  name: string
  /** One-line tagline shown on the index + dropdown */
  tagline: string
  /** Bucket for grouping in nav */
  bucket: FamilyBucket
  /** Live external URL of the property */
  url: string
  /** Brand color hex (used for accent on the deep-dive page) */
  accent: string
  /** Lucide icon name (resolved client-side via the LucideIconRenderer) */
  icon: string
  /** Status — controls which CTA we show + whether the deep-dive shows pricing-style proof */
  status: 'live' | 'beta' | 'soon'
  /** SEO-targeted keywords this page should rank for */
  keywords: FamilyKeyword[]

  /** ─── deep-dive content ─── */
  /** Hero — H1 stays brand-named; this is the deck */
  bluf: string
  /** Optional context paragraph under the BLUF */
  context: string
  /** Stat tiles shown in the hero row (4 max) */
  stats: FamilyStat[]
  /** "Why we built it" / build-process narrative */
  buildStory: string[]
  /** "How 0nMCP powers it" / agentic-AI utilization */
  mcpStory: string[]
  /** 6 capability cards rendered in a grid */
  capabilities: FamilyFeature[]
  /** 6 quick-win benefits shown as a checklist */
  benefits: string[]
  /** FAQ array — voice-search-friendly question format */
  faqs: { question: string; answer: string }[]
  /** Optional list of sister-family slugs to link in the related cluster */
  related?: string[]
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. 0nMCP — the hero
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ONMCP: FamilyMember = {
  slug: '0nmcp',
  name: '0nMCP',
  tagline: 'The world\'s largest interconnected MCP server. 1,554 tools across 96 services.',
  bucket: '0nmcp',
  url: 'https://0nmcp.com',
  accent: '#ff6b00',
  icon: 'Cpu',
  status: 'live',
  keywords: [
    { query: 'MCP server', volume: 12000 },
    { query: 'Model Context Protocol', volume: 8000 },
    { query: 'best MCP server 2026', volume: 1500 },
    { query: 'open source MCP', volume: 800 },
    { query: 'Claude Desktop MCP setup', volume: 4000 },
    { query: 'MCP for business', volume: 600 },
    { query: 'AI tool orchestrator', volume: 2200 },
    { query: 'agentic AI infrastructure', volume: 900 },
  ],
  bluf: 'The orchestrator behind every AI workflow we ship. 1,554 tools across 96 services, available to any AI host that speaks MCP — Claude Desktop, Cursor, Windsurf, Cline, Continue, Gemini, custom. Open source, BSL 1.1 licensed, npm install away.',
  context: 'When Anthropic published the Model Context Protocol in 2024, every AI vendor scrambled to ship a half-built server. 0nMCP went the other way — we built the deepest one. Today it powers RocketOpp\'s entire service catalog, drives all the family sites, and is the single biggest reason we can offer enterprise-grade AI work at one-tenth the industry price.',
  stats: [
    { label: 'Tools available', value: '1,554' },
    { label: 'Services covered', value: '96' },
    { label: 'AI hosts supported', value: '7+' },
    { label: 'License', value: 'BSL 1.1' },
  ],
  buildStory: [
    'We started building 0nMCP in late 2024 because every AI agent we shipped for clients needed the same dozen integrations — CRM, email, Slack, Stripe, GitHub, Google Workspace. Each one was a 2-week task. The math didn\'t work for small businesses.',
    'Instead of charging the integration tax on every project, we paid it once. 0nMCP became the universal connector — every tool the team builds gets added to the catalog. Every project after gets it for free.',
    'By Q2 2026 we\'d crossed 1,000 tools across 50+ services. By May 2026 we hit 1,554 / 96. We open-sourced the core under BSL 1.1 because the more developers extend it, the more leverage every RocketOpp client gets.',
  ],
  mcpStory: [
    '0nMCP IS the orchestrator. Every other RocketOpp service ships on top of it.',
    'When we build an AI agent for your CRM Automation engagement, that agent uses 0nMCP under the hood to call Stripe, send Slack messages, update HubSpot, run Groq inference, and write to Supabase — all from one MCP session.',
    'When we ship an SXO engagement, the content engine uses 0nMCP to pull trending topics, generate articles via Groq, post to WordPress, fan out to LinkedIn, and notify the CRM — all observable in one dashboard.',
    'It\'s not just leverage for us. It\'s leverage for any developer who builds on it. The same catalog that powers RocketOpp powers your stack the moment we plug you in.',
  ],
  capabilities: [
    { title: '1,554 tools', body: 'Every tool you would touch in a real business — CRM, email, payments, ops, analytics, social, content, dev — already integrated and credential-managed.', icon: 'Globe' },
    { title: '96 services', body: 'HubSpot, Salesforce, Stripe, Slack, GitHub, Google Workspace, Microsoft 365, Shopify, Twilio, Calendly, AWS, Vercel, Supabase — and 80+ more.', icon: 'Workflow' },
    { title: '7+ AI hosts', body: 'Claude Desktop, Cursor, Windsurf, Cline, Continue, Gemini, Claude Code — your team uses the AI tooling they already prefer.', icon: 'Cpu' },
    { title: '0nVault credentials', body: 'Patent-pending credential vault (US #63/990,046). AES-256-GCM + Argon2id + audit log. Per-tool revocation in one click.', icon: 'Lock' },
    { title: 'CrewAI orchestration', body: 'Multi-agent crews built in. Supervisor + workers + hand-off + retry — all wired so complex tasks compose cleanly.', icon: 'Bot' },
    { title: 'Open source', body: 'npm install 0nmcp. Source on GitHub. BSL 1.1 license. If we ever go away, your foundation keeps running. No lock-in.', icon: 'Sparkles' },
  ],
  benefits: [
    'Skip the integration tax — every tool is already wired',
    'Use your favorite AI host, not a vendor-locked client',
    'Audit every agent action via the live dashboard',
    'Add your own custom tools any time',
    'Compliance baseline (Vault + audit log) included',
    'Open source — fork it, self-host it, contribute back',
  ],
  faqs: [
    { question: 'What is 0nMCP, exactly?', answer: '0nMCP is a Model Context Protocol server (npm: 0nmcp) that exposes 1,554 tools across 96 services to any compliant AI host. It is currently the largest interconnected MCP server publicly available. Open-source under BSL 1.1.' },
    { question: 'Why does this matter for my business?', answer: 'Every AI agent or assistant that speaks MCP can use the entire catalog through one connection. No custom integrations per tool, no per-vendor auth wiring. The same agent that runs in Claude Desktop on your laptop can run in your production app.' },
    { question: 'What kind of tools are in the catalog?', answer: 'Anything you would touch in a real business: CRM, email, payments, ops, analytics, social, content, dev. Specifically: HubSpot, Salesforce, Stripe, Slack, GitHub, Google Workspace, Shopify, Twilio, Calendly, AWS, Vercel, Supabase, MongoDB — plus 80+ more.' },
    { question: 'How does authentication work?', answer: 'Every credential lives in the 0nVault container — patent-pending AES-256-GCM + Argon2id encryption with full audit log and per-tool revocation. You hold the keys; we never see your tokens.' },
    { question: 'Is it really open source?', answer: 'Yes. npm install 0nmcp, source on GitHub. BSL 1.1 license — usage-restricted only against direct commercial competition with us, otherwise open. You can fork it, self-host it, run it on-prem.' },
    { question: 'How do I get help integrating it?', answer: 'For self-serve: full docs at 0nmcp.com. For done-for-you: book an MCP integration engagement with us — $1,997 for the Connect tier, ships in a week.' },
  ],
  related: ['0ncore', 'sxowebsite', 'rocketadd', 'verifiedsxo'],
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. 0nCore — pillar SaaS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ONCORE: FamilyMember = {
  slug: '0ncore',
  name: '0nCore',
  tagline: 'The customer portal for the entire 0n stack. Manage agents, vaults, billing, and the live ecosystem from one screen.',
  bucket: 'saas',
  url: 'https://0ncore.com',
  accent: '#7ed957',
  icon: 'Sparkles',
  status: 'live',
  keywords: [
    { query: 'AI agent dashboard', volume: 1200 },
    { query: 'AI command center', volume: 800 },
    { query: 'business AI portal', volume: 400 },
    { query: '0nMCP dashboard', volume: 200 },
    { query: 'agentic AI control panel', volume: 150 },
  ],
  bluf: 'One screen for everything 0n. Browse the live tool catalog, manage AI agents, audit Vault access, run reports, dispatch tasks across the network. The control surface for operators running AI-native businesses.',
  context: '0nCore is what you live in once your business is running on 0nMCP. Single-pane-of-glass view across your CRM, email, payments, content, automations. No tab juggling, no context switching, no five-tool sprawl.',
  stats: [
    { label: 'Pages in the portal', value: '129+' },
    { label: 'API routes', value: '263+' },
    { label: 'Live ecosystem signals', value: '24/7' },
    { label: 'Mode', value: 'AI-first' },
  ],
  buildStory: [
    '0nCore exists because the operators using 0nMCP needed somewhere to live. The orchestrator runs the work; 0nCore is the cockpit you observe + steer from.',
    'Built on Next.js 16, deployed on Vercel, backed by Supabase. The dispatch protocol (UCP) at /api/dispatch/* is what powers the cross-ecosystem signals — including the live strip you see across rocketopp.com right now.',
    'Every Rocket family site plugs into the same UCP feed. When something ships in 0nCore, the news ripples to every other site automatically.',
  ],
  mcpStory: [
    'Every action in 0nCore is an MCP call. The AI agents you build run inside the portal — observable, auditable, replayable.',
    'The portal\'s own AI assistant (Jaxx) lives in 0nCore as a CRM-agent-backed chat widget. Same widget reused across the family — including embedded in your own WordPress install via the 0nWP plugin.',
    'Dashboards pull from the UCP dispatch feed in real time. When a customer signs up on rocketopp.com, it shows up in 0nCore in seconds.',
  ],
  capabilities: [
    { title: 'Live ecosystem dashboard', body: 'See every product status, latest commits, ecosystem registry, dispatch rules — all from one screen.', icon: 'Activity' },
    { title: 'AI agent management', body: 'Deploy, observe, replay, retire agents. Audit log of every action. One-click rollback when needed.', icon: 'Bot' },
    { title: 'Vault management', body: 'Add credentials, revoke per-tool, audit access. The single source of truth for every secret your agents touch.', icon: 'Lock' },
    { title: 'CRM integration', body: 'Native CRM dashboard inside 0nCore — contacts, conversations, pipelines, automations.', icon: 'Database' },
    { title: 'Reports + analytics', body: 'Live reporting dashboards. Pull data from any 0nMCP-connected service into one view.', icon: 'BarChart3' },
    { title: 'Plugin ecosystem', body: '31+ add-ons available. Voice AI, social media, course builder, lead-magnet engine, dev-health scans.', icon: 'Layers' },
  ],
  benefits: [
    'One control surface for the entire AI stack',
    'Built-in observability — every agent action logged',
    'Live updates from across the family of sites',
    'Vault-backed credential management',
    'Native CRM + analytics + reporting',
    '31+ plugins in the marketplace',
  ],
  faqs: [
    { question: 'What is 0nCore?', answer: '0nCore is the customer portal for the entire 0n ecosystem. Single-pane-of-glass for managing agents, vaults, automations, CRM, billing, and the live cross-product feed.' },
    { question: 'Do I need 0nMCP first?', answer: 'No — 0nCore can run independently with its own integrations. But the two are designed to compose. Most operators run them together.' },
    { question: 'What plugins are available?', answer: '31+ add-ons across voice AI, social media management, course building, lead-magnet engines, HIPAA scanning, dev-health checks, content engines, and more. Marketplace inside the portal.' },
    { question: 'How does the dashboard stay in sync with my real business?', answer: 'Every connected service pushes events into 0nCore via the UCP dispatch protocol. New leads, new sales, completed automations, agent runs — they all show up in seconds.' },
    { question: 'Can I embed 0nCore widgets on my own site?', answer: 'Yes. Several 0nCore widgets (Jaxx chat, dispatch live strip, scan engine) are embeddable on third-party sites — including via our 0nWP plugin for WordPress.' },
    { question: 'How do I get started?', answer: 'Click below to book a 30-minute walkthrough. We\'ll show you the portal against your real stack and tell you exactly what plugging in looks like.' },
  ],
  related: ['0nmcp', 'sxowebsite', 'rocketadd', 'verifiedsxo'],
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. SXO Website — lead-gen flagship
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SXOWEBSITE: FamilyMember = {
  slug: 'sxowebsite',
  name: 'SXO Website',
  tagline: 'Free SXO scan + Living DOM rewrite. The engine that scored Outlook Financial Center 82 → 92 in under 30 days.',
  bucket: 'lead-gen',
  url: 'https://sxowebsite.com',
  accent: '#8b5cf6',
  icon: 'Search',
  status: 'live',
  keywords: [
    { query: 'free SEO scan', volume: 9800 },
    { query: 'SEO is dead', volume: 4400 },
    { query: 'AI SEO optimization', volume: 7200 },
    { query: 'SXO Search Experience Optimization', volume: 600 },
    { query: 'llms.txt generator', volume: 1100 },
    { query: 'ChatGPT SEO', volume: 8500 },
    { query: 'Perplexity citation optimization', volume: 700 },
    { query: 'Google AI Overviews ranking', volume: 3200 },
  ],
  bluf: 'A free domain scanner that audits your site against the AI-search era. Score, top blockers, AI engine readiness — in 60 seconds. Then a $4.88 step-by-step fix plan or $8 Living DOM rewrite if you want it shipped.',
  context: 'SXO Website is the lead-gen flagship of the family. Every visitor that scans their domain becomes a tagged contact in our CRM, gets a 3-step nurture sequence, and (when they convert) becomes a customer for the rest of the RocketOpp stack. Outlook Financial Center, our first paying customer, came through this funnel.',
  stats: [
    { label: 'Free scan time', value: '60 seconds' },
    { label: 'First customer score lift', value: '82 → 92' },
    { label: 'Step-by-step plan', value: '$4.88' },
    { label: 'Living DOM rewrite', value: '$8' },
  ],
  buildStory: [
    'We built SXO Website because the entire SEO industry pretended AI engines didn\'t exist. ChatGPT, Perplexity, and Google AI Overviews now answer the majority of informational queries — but no agency was scoring sites against them.',
    'The scanner runs in 60 seconds, scoring on 5 pillars (SEO, UX, CRO, AEO, GEO). Then we offer two cheap entry products to remove friction: a $4.88 step-by-step fix plan and an $8 Living DOM rewrite.',
    'Both products generate the next tier of engagement. Buyers convert into SXO Growth ($1,997/mo) or higher when they see the score lift in their first month.',
  ],
  mcpStory: [
    'The scanner is a thin web layer over a chain of 0nMCP tool calls — fetch, parse, score, store, sync to CRM, fan out to email.',
    'The Living DOM rewrite uses 0nMCP\'s content engine + Groq llama-3.3-70b for synthesis. Same model behind every RocketOpp content workflow.',
    'When a paid customer\'s report generates, 0nMCP coordinates: scan engine → AI prompt → content rewrite → schema injection → email delivery via CRM Conversations → contact tagging.',
  ],
  capabilities: [
    { title: 'Free SXO scan', body: '5-pillar score in 60 seconds. SEO + UX + CRO + AEO (AI engine optimization) + GEO (generative engine optimization).', icon: 'Search' },
    { title: 'AI engine readiness', body: 'Per-engine visibility check: ChatGPT, Perplexity, Claude, Google AI Overviews. The scan tells you who can find you and who can\'t.', icon: 'Bot' },
    { title: 'Custom llms.txt', body: 'Every paid plan ships with a custom llms.txt for your domain. AI assistants get an explicit map of who you serve.', icon: 'FileText' },
    { title: 'Living DOM rewrite', body: 'Full BLUF + table-trap + schema rewrite for any URL. $8. Same patterns we use on every site we ship.', icon: 'Workflow' },
    { title: 'Step-by-step fix plan', body: '$4.88 product. 8-12 actionable fixes with copy-paste code, custom llms.txt, and a 30-day implementation roadmap.', icon: 'GitBranch' },
    { title: '3-step CRM nurture', body: 'Every scan with a real email lands as a tagged CRM contact + queues a 3-step email sequence. Free traffic becomes pipeline.', icon: 'Mail' },
  ],
  benefits: [
    'Free scan, no credit card',
    'Score AI engines + traditional SEO at once',
    'Custom llms.txt for your domain',
    'BLUF + Living DOM patterns ready to ship',
    'Cheap entry products ($4.88 / $8) lower the conversion bar',
    'Real customer story: Outlook Financial Center 82 → 92',
  ],
  faqs: [
    { question: 'What is SXO and how is it different from SEO?', answer: 'SXO (Search Experience Optimization) replaces SEO for the AI era. It optimizes for AI engines (ChatGPT, Perplexity, Claude, Google AI Overviews) plus traditional search plus user experience plus conversion — all in one protocol.' },
    { question: 'Is the scan really free?', answer: 'Yes. No credit card. 60 seconds. You get an SXO score, the biggest blocker, and a target score before any paid product is offered.' },
    { question: 'What does the $4.88 product include?', answer: 'A step-by-step fix plan for your single domain — 8-12 prioritized fixes with copy-paste code, schema snippets, a custom llms.txt, and a 30-day implementation roadmap. It\'s the cheapest paid product in the family.' },
    { question: 'What about the $8 Living DOM rewrite?', answer: 'A complete page-level rewrite delivered as ready-to-deploy HTML. Mutation engine, BLUF structure, table-traps, deep schema, FAQ. Drop-in replacement for any URL.' },
    { question: 'Will my site actually get cited by AI engines?', answer: 'Yes — that\'s the entire point of the AI-engine readiness layer. Custom llms.txt, schema markup, BLUF restructuring, FAQ + HowTo schema. Outlook Financial Center, our first paying customer, was projected to start AI citations within 14 days.' },
    { question: 'Where does the lead go after I scan?', answer: 'Your contact is tagged in the SXO sub-location of our CRM and you receive a 3-step email nurture (free score recap, $4.88 fix-plan pitch, $8 Living DOM offer). All transparent — opt out anytime.' },
  ],
  related: ['verifiedsxo', '0nmcp', '0ncore', 'cro9'],
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. VerifiedSXO — claim verification
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const VERIFIEDSXO: FamilyMember = {
  slug: 'verifiedsxo',
  name: 'VerifiedSXO',
  tagline: 'The proof layer for marketers. Submit a marketing claim, get it verified, publish the badge.',
  bucket: 'lead-gen',
  url: 'https://verifiedsxo.com',
  accent: '#10b981',
  icon: 'ShieldCheck',
  status: 'live',
  keywords: [
    { query: 'marketing claim verification', volume: 900 },
    { query: 'agency proof of results', volume: 700 },
    { query: 'marketing badge', volume: 1200 },
    { query: 'verified marketing claim', volume: 300 },
    { query: 'agency credibility tool', volume: 200 },
  ],
  bluf: 'Every marketing agency claims results. Almost none can prove them. VerifiedSXO submits any claim through a multi-source verification pipeline (web search, citations, contradictions) and publishes a public proof page with the verdict.',
  context: 'Built for agencies, creators, and consultants who want to win sales calls with provable claims instead of unverifiable case-study screenshots. The K-layer Verify Engine does the research; the proof layer publishes it; the certificate is permanent.',
  stats: [
    { label: 'Verdict types', value: '5' },
    { label: 'Sources per verification', value: 'Up to 8' },
    { label: 'Public proof page', value: 'Permanent' },
    { label: 'API access', value: 'Available' },
  ],
  buildStory: [
    'We built VerifiedSXO because every sales conversation now starts with a healthy skepticism of agency claims. "We grew their revenue 300%" used to be an interesting hook; in 2026 it\'s an immediate trust-killer.',
    'The Verify Engine runs entity extraction (Groq), query planning (Groq), web search (Brave + DuckDuckGo fallback), source enrichment, and synthesis (Groq llama-3.3-70b) to produce one of five verdicts: likely_true, likely_false, unsupported, mixed, inconclusive.',
    'Every claim verified gets a public proof page at /v/[id] with full citation trail. Buyers can audit the work. Agencies can ship the badge. Same architecture as a peer-reviewed paper — but in 30 seconds.',
  ],
  mcpStory: [
    'VerifiedSXO is exposed as a public K-layer API at /api/k/verify. Any 0nMCP-connected AI agent can verify claims as a tool call.',
    'The verification pipeline itself uses 0nMCP under the hood — Brave Search, Groq inference, Supabase persistence, CRM contact tagging.',
    'Public verification pages are live URLs that crawl freely — Google, ChatGPT, Perplexity all see them. The badge isn\'t just trust; it\'s SEO authority.',
  ],
  capabilities: [
    { title: 'Multi-source verification', body: 'Web search across Brave + DuckDuckGo, source enrichment, Groq synthesis. Citations attached to every claim.', icon: 'Search' },
    { title: '5-verdict scale', body: 'likely_true / likely_false / unsupported / mixed / inconclusive. Honest gradations, not binary thumbs-up.', icon: 'CheckCircle' },
    { title: 'Public proof pages', body: 'Every verified claim gets a permanent /v/[id] URL with full citation trail. Permalinks for sales, social, ads.', icon: 'Globe' },
    { title: 'Embeddable badges', body: 'Drop a verified-badge on your site. Live, click-through to the public proof page. Works on any HTML.', icon: 'Workflow' },
    { title: 'K-layer API', body: 'Public POST endpoint at /api/k/verify. Any AI agent or app can verify claims as a tool. Bearer auth + tiered rate limits.', icon: 'Cpu' },
    { title: 'Per-claim auto-elevation', body: 'Pro tier auto-elevates supporting evidence to 100% certainty when it can. AI does the citation hunting.', icon: 'TrendingUp' },
  ],
  benefits: [
    'Win sales calls with provable claims',
    'Public proof pages double as SEO assets',
    'Embeddable badges for any site',
    'API access for AI agents to verify claims as a tool',
    'Plan-based depth: free tier through Scale',
    'Public profile membership ($X/mo) for permanent agency cred',
  ],
  faqs: [
    { question: 'What is VerifiedSXO?', answer: 'A claim verification platform built for marketers. Submit any marketing claim, get a verdict (likely_true / likely_false / unsupported / mixed / inconclusive) with full citation trail, and publish a permanent proof page.' },
    { question: 'How is this different from a fact-checker?', answer: 'Fact-checkers rate political claims for general audiences. VerifiedSXO is built for marketing claims — agency results, case-study numbers, before/after comparisons. The verification pipeline is tuned for that vertical.' },
    { question: 'Who uses it?', answer: 'Agencies (to ship verified results in pitches), creators (to back up income claims), consultants (to prove case studies), and AI apps (via the K-layer API).' },
    { question: 'How accurate is the verdict?', answer: 'The pipeline runs multi-source web search + Groq synthesis. Every verdict comes with citations the buyer can audit. We grade honestly — "unsupported" is a real verdict and gets used a lot.' },
    { question: 'Can I embed badges on my site?', answer: 'Yes. Every verified claim ships with an embed snippet. Drop it anywhere — landing pages, sales emails, ad creative. Click-through goes to the permanent proof page.' },
    { question: 'Is there an API?', answer: 'Yes. Public K-layer endpoint at /api/k/verify with bearer auth and tiered rate limits. Designed for AI agents to verify claims as a tool.' },
  ],
  related: ['sxowebsite', '0nmcp', '0ncore'],
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. Rocket+ — agency CRM SaaS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ROCKETADD: FamilyMember = {
  slug: 'rocketadd',
  name: 'Rocket+',
  tagline: 'Modular CRM enhancements. 50+ tools and growing — install instantly via OAuth.',
  bucket: 'saas',
  url: 'https://rocketadd.com',
  accent: '#ff6b00',
  icon: 'Rocket',
  status: 'live',
  keywords: [
    { query: 'CRM marketplace app', volume: 1800 },
    { query: 'CRM extensions', volume: 4500 },
    { query: 'CRM mods', volume: 600 },
    { query: 'agency CRM tools', volume: 2100 },
    { query: 'AI course generator CRM', volume: 700 },
    { query: 'CRM workflow builder', volume: 8200 },
    { query: 'GoHighLevel marketplace', volume: 5500 },
    { query: 'Rocket Plus app', volume: 200 },
  ],
  bluf: 'Modular CRM enhancements that install in your CRM location with one OAuth click. RocketFlow visual workflow builder, AI Course Generator, Focus Flow productivity, API Connections, and 50+ more.',
  context: 'Rocket+ is the marketplace app every agency wishes their CRM came with out of the box. Each "Mod" is a self-contained capability — install only what you need, pay only for what you use.',
  stats: [
    { label: 'Live mods', value: '4 (50+ planned)' },
    { label: 'Install time', value: 'One OAuth click' },
    { label: 'CRM integration', value: 'Native' },
    { label: 'Tier model', value: 'Per-mod licensing' },
  ],
  buildStory: [
    'Rocket+ started with a simple observation: every agency we worked with had built the same internal tools five times. Course generators, focus-mode dashboards, custom workflow builders, API webhook routers. All wheel-reinvented.',
    'We turned each one into a CRM marketplace app. OAuth installs into a CRM location. Encrypted tokens, per-location isolation. The agency installs once and the mod is everywhere.',
    'RocketFlow is the visual workflow builder — drag-and-drop with AI suggestion mode. AI Course Generator turns a topic into a complete course with chapters, lessons, quizzes. Focus Flow is the deep-work productivity layer.',
  ],
  mcpStory: [
    'Every Rocket+ mod is a 0nMCP-powered application under the hood.',
    'When you generate a course with AI Course Generator, it\'s 0nMCP coordinating Groq for content + the CRM API for content delivery + Stripe for course payments + email for student notifications.',
    'The agency-side admin dashboard is the same UI pattern as 0nCore — single-pane-of-glass, observable, audited.',
  ],
  capabilities: [
    { title: 'RocketFlow', body: 'Visual workflow builder with AI suggestion mode. Drag-and-drop, drop-on-CRM-action triggers, AI-suggested next steps.', icon: 'Workflow' },
    { title: 'AI Course Generator', body: 'Topic → full course with chapters, lessons, quizzes, completion certificates. Imports straight to your CRM.', icon: 'GraduationCap' },
    { title: 'Focus Flow', body: 'Deep-work productivity layer for CRM users. Focus blocks, AI assistant on standby, post-session reports.', icon: 'Eye' },
    { title: 'API Connections', body: 'Webhook router + API key vault. Connect your CRM to anything that has an API. Encrypted, audited, plan-tiered.', icon: 'GitBranch' },
    { title: 'OAuth install model', body: 'One-click OAuth install per mod. No copy-paste API keys. Tokens encrypted with AES-256.', icon: 'Lock' },
    { title: 'Marketplace pricing', body: 'Per-mod licensing — install only what you need. Free tier available; paid tiers for power users.', icon: 'Sparkles' },
  ],
  benefits: [
    'Every mod installs in seconds via OAuth',
    'Native CRM integration — no copy-paste',
    'AI-powered: workflows + courses + focus',
    'Encrypted tokens + audit log baseline',
    'Per-mod licensing — pay for what you use',
    '50+ mods on the roadmap',
  ],
  faqs: [
    { question: 'What is Rocket+?', answer: 'A CRM marketplace app providing modular enhancements ("Mods") to your CRM — workflow builders, course generators, focus dashboards, API connectors, and more.' },
    { question: 'How does install work?', answer: 'OAuth — one click. The mod installs into your CRM location, gets a scoped access token, and starts running in seconds.' },
    { question: 'Which CRMs are supported?', answer: 'CRM platforms supported in our agency stack — including GoHighLevel-style sub-account CRMs that comply with the Marketplace OAuth spec.' },
    { question: 'How are credentials protected?', answer: 'Every access token is encrypted with AES-256-CBC. Tokens are scoped to a single CRM location. Audit log on every API action.' },
    { question: 'Is there a free tier?', answer: 'Yes — the foundational mods (RocketFlow, API Connections) have free tiers with usage limits. Pro tiers unlock AI features and remove limits.' },
    { question: 'Can I build my own mod?', answer: 'Yes. Rocket+ has a developer SDK in beta — your team can ship a private mod for your agency, or list publicly in the marketplace.' },
  ],
  related: ['mcpfed', '0nmcp', '0ncore', 'rocketclients'],
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. CRO9 — conversion optimization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CRO9: FamilyMember = {
  slug: 'cro9',
  name: 'CRO9',
  tagline: 'Self-optimizing landing pages. Living DOM mutations + 147 behavioral metrics + Multi-Armed Bandit testing.',
  bucket: 'saas',
  url: 'https://cro9.com',
  accent: '#06b6d4',
  icon: 'TrendingUp',
  status: 'live',
  keywords: [
    { query: 'conversion rate optimization tool', volume: 5400 },
    { query: 'AI A/B testing', volume: 3700 },
    { query: 'landing page optimization', volume: 18000 },
    { query: 'multi-armed bandit testing', volume: 800 },
    { query: 'self optimizing website', volume: 600 },
    { query: 'CRO automation', volume: 2400 },
  ],
  bluf: 'A 15KB embed that turns any landing page into a self-optimizing one. Tracks 147 behavioral metrics, runs Multi-Armed Bandit experiments, and mutates content in real time based on what\'s converting.',
  context: 'CRO9 is the optimization layer behind every page RocketOpp ships. Every Living DOM rewrite, every PPC landing page, every SXO Growth client gets CRO9 on top. The mutation engine learns what converts and rewrites the page accordingly — no A/B-test setup, no traffic-split planning, no waiting for significance.',
  stats: [
    { label: 'Embed size', value: '<15KB' },
    { label: 'Behavioral metrics', value: '147' },
    { label: 'Test method', value: 'Multi-Armed Bandit' },
    { label: 'Mutation latency', value: 'Real-time' },
  ],
  buildStory: [
    'Classic A/B testing is dead. By the time you have statistical significance on your headline test, the world has moved on, the campaign has ended, and most of your traffic saw the loser.',
    'CRO9 takes the modern approach: Multi-Armed Bandit allocation. The engine sends more traffic to the winning variant in real time — every visitor benefits, no need to wait for "significance."',
    'On top of MAB we layered Living DOM mutations: instead of pre-defined variants, the engine generates new variants automatically based on visitor behavior. Different headline for mobile vs desktop, different CTA for paid vs organic, different social-proof block by traffic source.',
  ],
  mcpStory: [
    'CRO9\'s mutation engine pulls from 0nMCP for content generation. New variants are Groq-generated, schema-validated, and shipped in real time.',
    'The 147 behavioral metrics are stored in Supabase and reachable via 0nMCP tool calls — meaning AI agents can read CRO9 data and act on it (e.g. "if conversion rate on this page drops below 2%, generate three new variants").',
    'CRO9 is what makes every other RocketOpp service compound. PPC sends traffic; SXO sends rankings; CRO9 makes sure the page that lands them converts.',
  ],
  capabilities: [
    { title: 'Living DOM mutations', body: 'Real-time content rewrites based on visitor behavior. Different headline for mobile, different CTA for paid traffic, different social-proof for industries.', icon: 'Workflow' },
    { title: '147 behavioral metrics', body: 'Scroll depth, time-on-section, hover heatmaps, abandonment points, click-trail. Every signal CRO data scientists track, automatically.', icon: 'BarChart3' },
    { title: 'Multi-Armed Bandit', body: 'Replaces A/B testing with allocation that learns. Winning variants get more traffic in real time — no waiting for significance.', icon: 'Sparkles' },
    { title: '<15KB embed', body: 'Drop a single script tag. No PageSpeed hit. No bloat. Works on any platform — WordPress, Webflow, Next.js, custom HTML.', icon: 'Zap' },
    { title: 'AI variant generator', body: 'New copy + CTAs + layouts generated by Groq automatically. No more "we need to write more variants" — the engine writes them.', icon: 'Bot' },
    { title: 'Plan tiers', body: 'Ignite ($29/mo) + Amplify ($99/mo) + Dominate ($299/mo). All plans include the mutation engine + MAB + 147 metrics.', icon: 'Target' },
  ],
  benefits: [
    'Drop a 15KB embed — done',
    'No A/B-test setup or significance waits',
    'Real-time content mutations',
    '147 behavioral signals tracked automatically',
    'AI generates new variants on demand',
    'Compounds with every other RocketOpp service',
  ],
  faqs: [
    { question: 'What is CRO9?', answer: 'A self-optimizing landing-page engine that runs as a 15KB JavaScript embed. Tracks 147 behavioral metrics, runs Multi-Armed Bandit experiments, and mutates content in real time based on what\'s converting.' },
    { question: 'How is this different from Optimizely or VWO?', answer: 'Optimizely / VWO are A/B testing tools — you write variants manually and wait for significance. CRO9 generates variants automatically with Groq, allocates traffic with MAB, and rewrites content in real time. Smarter, faster, cheaper.' },
    { question: 'Will the embed slow my site down?', answer: 'No. Under 15KB gzipped, async-loaded, runs after page paint. We measure PageSpeed before/after on every install — it\'s typically a 0-2 point delta.' },
    { question: 'What metrics does CRO9 track?', answer: '147 behavioral signals: scroll depth, time-on-section, hover heatmaps, abandonment points, click trails, form-field interaction, copy-paste events, and 140 more. All correlated with conversion.' },
    { question: 'Does it work with my platform?', answer: 'Yes. WordPress, Webflow, Squarespace, Shopify, Next.js, custom HTML — anywhere you can drop a script tag.' },
    { question: 'How much does it cost?', answer: 'Ignite is $29/mo, Amplify is $99/mo, Dominate is $299/mo. All plans include the full engine; tiers differ on traffic limits and seat count.' },
  ],
  related: ['sxowebsite', '0nmcp', '0ncore', 'rocketadd'],
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Registry export
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const FAMILY_MEMBERS: FamilyMember[] = [
  ONMCP,
  ONCORE,
  SXOWEBSITE,
  VERIFIEDSXO,
  ROCKETADD,
  CRO9,
]

export function getFamilyMember(slug: string): FamilyMember | undefined {
  return FAMILY_MEMBERS.find((m) => m.slug === slug)
}

export function getFamilyByBucket(bucket: FamilyBucket): FamilyMember[] {
  return FAMILY_MEMBERS.filter((m) => m.bucket === bucket)
}
