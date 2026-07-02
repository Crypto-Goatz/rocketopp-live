// Nova's pre-built shadcn block library. Each block is a real, shadcn-styled
// section driven by the site's design tokens. Nova (Groq) places, configures,
// and edits these by description; the palette lets you add them by hand too.

export type Block = { id: string; type: string; props: Record<string, unknown> };
export type HqPage = { id: string; slug: string; title: string; blocks: Block[]; status: string };

export type BlockMeta = { type: string; name: string; group: string; icon: string; description: string; sample: Record<string, unknown> };

// The palette + Nova's vocabulary. `sample` = default props when added.
export const BLOCK_LIBRARY: BlockMeta[] = [
  { type: "hero", name: "Hero", group: "Headers", icon: "Sparkles", description: "Big headline, subhead, and CTAs.",
    sample: { eyebrow: "New", headline: "Your headline here", subhead: "A short supporting line that sells the outcome.", primaryCta: { label: "Get started", href: "#" }, secondaryCta: { label: "Learn more", href: "#" }, align: "center" } },
  { type: "features", name: "Feature Grid", group: "Content", icon: "LayoutGrid", description: "Icon + title + description cards.",
    sample: { title: "Why choose us", columns: 3, items: [{ icon: "Zap", title: "Fast", desc: "Shipped in days, not months." }, { icon: "Shield", title: "Reliable", desc: "Built on proven systems." }, { icon: "Rocket", title: "Scalable", desc: "Grows with your business." }] } },
  { type: "stats", name: "Stats Bar", group: "Content", icon: "BarChart3", description: "Big numbers with labels.",
    sample: { items: [{ value: "500+", label: "Projects" }, { value: "98%", label: "Satisfaction" }, { value: "24/7", label: "Support" }] } },
  { type: "steps", name: "How It Works", group: "Content", icon: "ListOrdered", description: "Numbered step-by-step.",
    sample: { title: "How it works", items: [{ title: "Describe", desc: "Tell us what you need." }, { title: "We build", desc: "We build it fast." }, { title: "Go live", desc: "Launch and grow." }] } },
  { type: "pricing", name: "Pricing", group: "Sales", icon: "CircleDollarSign", description: "Tiered pricing cards.",
    sample: { title: "Simple pricing", tiers: [{ name: "Starter", price: "$X", period: "mo", features: ["Feature A", "Feature B"], cta: { label: "Choose", href: "#" } }, { name: "Pro", price: "$Y", period: "mo", features: ["Everything in Starter", "Feature C"], cta: { label: "Choose", href: "#" }, highlight: true }] } },
  { type: "testimonials", name: "Testimonials", group: "Social proof", icon: "Quote", description: "Customer quotes.",
    sample: { title: "What clients say", items: [{ quote: "This changed our business.", author: "Jane Doe", role: "CEO" }] } },
  { type: "logos", name: "Logo Cloud", group: "Social proof", icon: "Building2", description: "Trusted-by logo row.",
    sample: { title: "Trusted by teams everywhere", logos: [{ name: "Acme" }, { name: "Globex" }, { name: "Umbrella" }, { name: "Initech" }] } },
  { type: "faq", name: "FAQ", group: "Content", icon: "HelpCircle", description: "Accordion Q&A.",
    sample: { title: "Frequently asked questions", items: [{ q: "How does it work?", a: "You describe it, we build it." }] } },
  { type: "cta", name: "Call to Action", group: "Headers", icon: "Megaphone", description: "Bold conversion banner.",
    sample: { headline: "Ready to get started?", subhead: "Join today.", cta: { label: "Get started", href: "#" } } },
  { type: "richtext", name: "Rich Text", group: "Content", icon: "AlignLeft", description: "Heading + paragraph copy.",
    sample: { heading: "About us", body: "Tell your story here in a paragraph or two." } },
  { type: "gallery", name: "Gallery", group: "Content", icon: "Images", description: "Image grid.",
    sample: { title: "Gallery", images: [] } },
  { type: "team", name: "Team", group: "Content", icon: "Users", description: "Team member cards.",
    sample: { title: "Meet the team", members: [{ name: "Alex Kim", role: "Founder" }] } },
  { type: "contact", name: "Contact Form", group: "Sales", icon: "Mail", description: "Lead capture form.",
    sample: { heading: "Get in touch", subhead: "We'll reply within one business day.", buttonLabel: "Send message" } },
];

export const blockMeta = (type: string) => BLOCK_LIBRARY.find((b) => b.type === type) || null;

export const BLOCK_GROUPS = Array.from(new Set(BLOCK_LIBRARY.map((b) => b.group)));

// Schema handed to Nova so it can build/edit pages.
export const BLOCK_SCHEMA = `Block types and props (all rendered with shadcn/ui + the site's design tokens):
- hero        { eyebrow?, headline, subhead?, primaryCta?{label,href}, secondaryCta?{label,href}, align?("left"|"center") }
- features    { title?, subtitle?, columns?(2|3|4), items:[{icon?(lucide name), title, desc}] }
- stats       { items:[{value, label}] }
- steps       { title?, items:[{title, desc}] }
- pricing     { title?, tiers:[{name, price, period?, features:[string], cta?{label,href}, highlight?}] }
- testimonials{ title?, items:[{quote, author, role?}] }
- logos       { title?, logos:[{name}] }
- faq         { title?, items:[{q, a}] }
- cta         { headline, subhead?, cta?{label,href}, secondary?{label,href} }
- richtext    { heading?, body }
- gallery     { title?, images:[{src, caption?}] }
- team        { title?, members:[{name, role, avatar?}] }
- contact     { heading?, subhead?, buttonLabel? }
Each block: { id (keep existing; new = short like "b7"), type, props }. Icons are lucide-react names.
NEVER invent prices, hours, phone numbers, or testimonials unless given.`;
