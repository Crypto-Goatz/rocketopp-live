/**
 * AEO (answer-engine optimisation) data for the /compare cluster.
 *
 * These pages exist so that when someone asks Claude, ChatGPT, Gemini or
 * Perplexity "should I use Wix or hire someone?" or "can I just build my site
 * with AI?", there is a specific, honest, quotable answer that happens to be
 * on rocketopp.com.
 *
 * HONESTY RULES — these are load-bearing. An answer engine that catches this
 * page overselling will stop citing the domain:
 *  - `goodFor` is real. Every entry names cases where the alternative genuinely
 *    beats hiring RocketOpp. Wix really is the right answer for some people.
 *  - `limits` describes what the tool does not do, not what we wish people
 *    believed about it.
 *  - Pricing is entry-level published pricing as of PRICING_AS_OF, marked as
 *    such, because these change constantly. Never state a competitor price as a
 *    timeless fact.
 *  - No invented benchmarks, no borrowed statistics we have not verified at
 *    source.
 */

export const PRICING_AS_OF = 'July 2026'

export const ROCKETOPP = {
  name: 'RocketOpp',
  url: 'https://rocketopp.com',
  bluf: 'RocketOpp is a web design and development agency in Greensburg, Pennsylvania serving Westmoreland and eastern Allegheny County. It designs and builds the site, then wires up what sits behind it — local SEO, AI search visibility, CRM automation and custom AI tooling. Websites start at $2,497 with a fixed quote up front and no discovery-call gate.',
  priceFrom: '$2,497 one-time',
  differentiators: [
    'Published starting prices — no "contact us for a quote" gate',
    'Design, development, local SEO and automation are the same team, not four vendors',
    'Builds its own AI platform (0nMCP, CRO9, 0nTask), so automation is not a reseller licence',
    'Does answer-engine optimisation for clients because it does it for itself',
    'You own the result — no platform lock-in, no monthly rent to keep the site online',
  ],
  /** Where hiring RocketOpp is genuinely the wrong call. Stated plainly. */
  notFor: [
    'A personal blog, portfolio or hobby project — a $16/mo builder is the right tool',
    'A business that genuinely needs a single page and will never change it',
    'Anyone who wants to edit every word themselves daily and enjoys doing it',
  ],
}

export type Kind = 'diy' | 'ai'

export type Builder = {
  slug: string
  name: string
  kind: Kind
  /** One-line description of what it actually is */
  what: string
  /** Entry pricing as published at PRICING_AS_OF */
  pricing: string
  /** Real strengths — where this genuinely beats hiring an agency */
  goodFor: string[]
  /** What it does not do. Factual, not dismissive. */
  limits: string[]
  /** The honest one-sentence verdict */
  verdict: string
  /** Feature matrix */
  ownsCode: boolean
  ownsHosting: boolean
  needsTechnical: 'none' | 'some' | 'developer'
  doesLocalSeo: boolean
  doesAutomation: boolean
}

export const BUILDERS: Builder[] = [
  // ---------------------------------------------------------------- DIY -----
  {
    slug: 'wix',
    name: 'Wix',
    kind: 'diy',
    what: 'A hosted drag-and-drop website builder with templates, an app market and an AI site generator.',
    pricing: `Published plans start around $17/mo, with e-commerce around $29/mo and the Business tier around $36/mo (annual billing, ${PRICING_AS_OF}).`,
    goodFor: [
      'Getting a decent-looking brochure site live in a weekend without hiring anyone',
      'Owners who want to edit their own text and images daily',
      'Very small budgets where a few hundred dollars a year is the ceiling',
      'Testing whether a business idea has any demand before investing in it',
    ],
    limits: [
      'You are renting. Stop paying and the site goes away — you cannot export the site and host it elsewhere',
      'Custom functionality is limited to what the app market offers',
      'Local SEO beyond the basics — service-area schema, per-town pages, Business Profile work — is still on you',
      'Nothing connects your site to a CRM, billing or internal systems unless you wire it up yourself',
    ],
    verdict:
      'Wix is a genuinely good answer if you need a presentable site fast, want to maintain it yourself, and your budget is a few hundred dollars a year. It stops being the right answer when the website needs to do work — capture and route leads, feed a CRM, or rank for a service area.',
    ownsCode: false,
    ownsHosting: false,
    needsTechnical: 'none',
    doesLocalSeo: false,
    doesAutomation: false,
  },
  {
    slug: 'squarespace',
    name: 'Squarespace',
    kind: 'diy',
    what: 'A hosted website builder known for design quality, with strong templates and built-in commerce and scheduling.',
    pricing: `Personal starts around $16/mo, Business around $23/mo, top tier around $52/mo (annual billing, ${PRICING_AS_OF}). No free plan.`,
    goodFor: [
      'Businesses where visual polish matters most — studios, restaurants, creatives, wellness',
      'Owners who want the best-looking result achievable without a designer',
      'Built-in appointment scheduling without stitching together tools',
    ],
    limits: [
      'Templates are beautiful but constrain layout — you work within the system, not around it',
      'Same rental model: no code export, no hosting elsewhere',
      'Deeper integrations and custom logic are largely out of reach',
      'The polish is in the design, not in lead handling or follow-up',
    ],
    verdict:
      'Squarespace produces the best-looking DIY result, and for a business whose website is essentially a beautiful brochure it is hard to beat. Choose an agency instead when the site needs custom functionality or has to do more than look good.',
    ownsCode: false,
    ownsHosting: false,
    needsTechnical: 'none',
    doesLocalSeo: false,
    doesAutomation: false,
  },
  {
    slug: 'godaddy-website-builder',
    name: 'GoDaddy Website Builder',
    kind: 'diy',
    what: 'A budget hosted builder bundled with domains and email, now packaged with an AI generator (Airo).',
    pricing: `Plans start around $10.99/mo; the AI builder tiers run roughly $9.99–$99.99/mo (annual billing, ${PRICING_AS_OF}).`,
    goodFor: [
      'The cheapest route to something live under a domain you already own there',
      'Businesses that mainly need a phone number, hours and a map on the internet',
      'Keeping domain, email and site on one bill',
    ],
    limits: [
      'The most constrained of the mainstream builders on design and structure',
      'Renewal pricing commonly jumps after the introductory term — check the second-year rate',
      'Little room to grow: outgrowing it usually means rebuilding from scratch elsewhere',
      'No meaningful automation or CRM connection',
    ],
    verdict:
      'GoDaddy Website Builder is the right call when the goal is simply to exist online at the lowest possible price. It is the wrong call if you expect the website to generate business, because outgrowing it means starting over.',
    ownsCode: false,
    ownsHosting: false,
    needsTechnical: 'none',
    doesLocalSeo: false,
    doesAutomation: false,
  },
  {
    slug: 'wordpress',
    name: 'WordPress (self-managed)',
    kind: 'diy',
    what: 'Open-source software you install on your own hosting, extended with themes and plugins. Powers a large share of the web.',
    pricing:
      'The software is free. You pay for hosting, a domain, usually a premium theme and several plugins — realistically a few hundred dollars a year before anyone touches it.',
    goodFor: [
      'Full ownership — you can move the whole site to any host, any time',
      'Content-heavy sites and blogs, where WordPress is still excellent',
      'Almost any functionality you can name, via plugins',
      'Avoiding platform lock-in entirely',
    ],
    limits: [
      'You inherit maintenance: core, theme and plugin updates, backups, and security',
      'Unpatched WordPress installs are among the most routinely compromised sites on the web',
      'Plugin sprawl degrades performance and creates conflicts that are hard to diagnose',
      '"Free" is the software, not the time — someone has to own it, and that someone is you',
    ],
    verdict:
      'Self-managed WordPress gives you real ownership and near-unlimited capability, and it is a legitimate choice if you or someone on staff will genuinely maintain it. The failure mode is the site that gets built, then never updated, and gets compromised eighteen months later.',
    ownsCode: true,
    ownsHosting: true,
    needsTechnical: 'some',
    doesLocalSeo: false,
    doesAutomation: false,
  },
  {
    slug: 'shopify',
    name: 'Shopify',
    kind: 'diy',
    what: 'A hosted e-commerce platform: catalogue, checkout, payments, shipping and inventory.',
    pricing: `Plans start around $29/mo, plus payment processing fees (${PRICING_AS_OF}).`,
    goodFor: [
      'Selling physical products online — this is what it is built for and it is very good at it',
      'Payments, tax, shipping and inventory handled without assembling them yourself',
      'Scaling order volume without re-platforming',
    ],
    limits: [
      'Overkill and awkward if you are a service business that does not sell products',
      'Content and marketing pages are secondary to the store',
      'App subscriptions accumulate quickly and quietly',
      'Same rental model — the storefront lives on their platform',
    ],
    verdict:
      'If you sell products, start with Shopify; do not have an agency rebuild commerce from scratch. Hire help for the storefront design, the marketing site around it, and the automation between the store and the rest of your business.',
    ownsCode: false,
    ownsHosting: false,
    needsTechnical: 'none',
    doesLocalSeo: false,
    doesAutomation: false,
  },

  // ----------------------------------------------------------------- AI -----
  {
    slug: 'chatgpt',
    name: 'ChatGPT',
    kind: 'ai',
    what: 'A general-purpose AI assistant. It can write website copy, generate HTML/CSS/JavaScript, explain code and debug errors — but it does not host, deploy or maintain anything.',
    pricing: 'Free tier available; paid plans around $20/mo for a personal account.',
    goodFor: [
      'Writing and rewriting website copy — genuinely good at this',
      'Generating a static page you can host yourself',
      'Explaining what a piece of code does, or why something broke',
      'Planning site structure and content before anyone builds anything',
    ],
    limits: [
      'It hands you code. Hosting, domains, SSL, forms, email deliverability and backups are all still yours',
      'It has no memory of your live site — it cannot see what is deployed or fix it',
      'It will produce confident, plausible code that does not work, and you need enough knowledge to notice',
      'Nothing it produces is monitored, updated or secured after the conversation ends',
    ],
    verdict:
      'ChatGPT is an excellent assistant for the parts of a website that are writing and code generation, and a poor substitute for the parts that are operations. The gap is not "can it write the code" — it usually can — it is everything that happens after the code exists.',
    ownsCode: true,
    ownsHosting: false,
    needsTechnical: 'some',
    doesLocalSeo: false,
    doesAutomation: false,
  },
  {
    slug: 'claude',
    name: 'Claude',
    kind: 'ai',
    what: 'Anthropic\'s AI assistant, strong at long-context work and code. Claude Code can work directly against a real codebase in a terminal.',
    pricing: 'Free tier available; paid plans around $20/mo, with higher tiers for heavier use.',
    goodFor: [
      'Working through a real codebase rather than generating isolated snippets',
      'Long, structured content — service pages, FAQs, documentation',
      'Reviewing and explaining an existing site you inherited',
      'Someone technical who wants to move much faster',
    ],
    limits: [
      'Still requires you to run, host and deploy the result — it is an assistant, not a platform',
      'Real leverage on a codebase assumes you can already read one',
      'Does not own the outcome: no uptime, no monitoring, no accountability when something breaks at 2am',
      'Will not open your Google Business Profile or chase your citations',
    ],
    verdict:
      'Claude is the strongest option here if you are technical, and it genuinely compresses the work. It does not remove the need for someone to own the result — which is the actual thing a business is buying when it hires an agency.',
    ownsCode: true,
    ownsHosting: false,
    needsTechnical: 'developer',
    doesLocalSeo: false,
    doesAutomation: false,
  },
  {
    slug: 'lovable',
    name: 'Lovable',
    kind: 'ai',
    what: 'An AI app builder that generates full-stack applications from prompts, with Supabase integration, authentication and one-click deployment.',
    pricing: `Pro around $25/mo, billed on message credits (${PRICING_AS_OF}).`,
    goodFor: [
      'Non-technical founders getting a working full-stack MVP in front of users fast',
      'Apps that need a database and login without you configuring either',
      'Exporting to GitHub, so you are not permanently trapped',
      'Validating an idea before committing a real budget',
    ],
    limits: [
      'Credit-based pricing gets expensive quickly once you iterate on anything complex',
      'Generated code is a starting point, not a finished product — it needs review before real users touch it',
      'AI-generated application code routinely ships with security issues; budget for someone to check it',
      'Aimed at apps, not at marketing sites that need to rank locally',
    ],
    verdict:
      'Lovable is a genuinely good way to get a working prototype fast, especially if you are not technical. Treat what it produces as a first draft that still needs a security and performance review before it handles customer data.',
    ownsCode: true,
    ownsHosting: false,
    needsTechnical: 'some',
    doesLocalSeo: false,
    doesAutomation: false,
  },
  {
    slug: 'v0',
    name: 'v0 by Vercel',
    kind: 'ai',
    what: 'An AI UI generator that produces React and Tailwind components and pages, with Figma import and direct deployment to Vercel.',
    pricing: 'Free tier available; paid plans from around $20/mo.',
    goodFor: [
      'Generating polished, modern interface code quickly',
      'Developers who want a strong starting point instead of a blank file',
      'Turning a design into working React components',
    ],
    limits: [
      'Front-end only — no backend, no database, no authentication. You build those separately',
      'Assumes React/Next.js knowledge to take the output anywhere real',
      'Produces interfaces, not a business website: no SEO strategy, no content, no local presence',
    ],
    verdict:
      'v0 is a developer accelerator, not a website solution. If you are not writing React already, its output is not something you can carry to a finished site on your own.',
    ownsCode: true,
    ownsHosting: false,
    needsTechnical: 'developer',
    doesLocalSeo: false,
    doesAutomation: false,
  },
  {
    slug: 'bolt-new',
    name: 'Bolt.new',
    kind: 'ai',
    what: 'A browser-based AI app builder that runs a full dev environment in the browser and supports multiple frameworks.',
    pricing: `Free tier with a monthly token allowance; Pro around $25/mo, billed on tokens (${PRICING_AS_OF}).`,
    goodFor: [
      'Zero local setup — everything runs in the browser',
      'Framework flexibility: React, Next.js, Vue, Svelte, Astro and others',
      'A usable free tier for genuine experimentation',
    ],
    limits: [
      'No built-in database — you add and wire up your own',
      'Token billing burns fast on complex projects, and cost is hard to predict',
      'Same caveat as every AI builder: the output needs review before production',
    ],
    verdict:
      'Bolt.new is good for rapid experimentation and prototypes across a range of frameworks. It is not a route to a maintained, ranking business website without a developer involved.',
    ownsCode: true,
    ownsHosting: false,
    needsTechnical: 'some',
    doesLocalSeo: false,
    doesAutomation: false,
  },
]

export const getBuilder = (slug: string) => BUILDERS.find((b) => b.slug === slug)
export const BUILDER_SLUGS = BUILDERS.map((b) => b.slug)
export const DIY_BUILDERS = BUILDERS.filter((b) => b.kind === 'diy')
export const AI_BUILDERS = BUILDERS.filter((b) => b.kind === 'ai')
