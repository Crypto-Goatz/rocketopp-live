# rocketopp.com — AI HQ Control Inventory

> How much control can the AI HQ gather over this site? This is the full map.
> Stack: Next.js 16 (App Router) · React 19 · Tailwind 3.4 · shadcn/ui + Radix · framer-motion · Supabase · Stripe.
> Design tokens already live as **shadcn CSS variables** in `app/globals.css` — the AI HQ drives these, never layers CSS on top (per house rule).

Legend: **G** = one-click global (site-wide) · **P** = per-page · **C** = per-component · ⚡ = instant (no deploy, token/DB) · 🔧 = code change (deploy)

---

## 1. Global Design Tokens (shadcn variables) — **G ⚡**
Every one of these already exists as a CSS variable; the HQ edits the value and the entire site restyles. Light **and** dark mode each get their own value.

| Token | Controls |
|---|---|
| `--background` / `--foreground` | Page background + base text |
| `--card` / `--card-foreground` | Cards, panels |
| `--popover` / `--popover-foreground` | Menus, tooltips, dropdowns |
| `--primary` / `--primary-foreground` | Primary buttons, key accents |
| `--secondary` / `--secondary-foreground` | Secondary buttons/badges |
| `--muted` / `--muted-foreground` | Muted surfaces + secondary text |
| `--accent` / `--accent-foreground` | Hover states, highlights |
| `--destructive` / `--destructive-foreground` | Errors, delete actions |
| `--border` · `--input` · `--ring` | Borders, field borders, focus rings |
| `--radius` | Global corner radius (all components) |
| `--service-accent-rgb` | Per-service accent theming |

**Gathered control:** full palette (11 color pairs), focus/border system, global radius, light/dark — all one-click, instant.

## 2. Typography — **G** (fonts 🔧 via `next/font`, everything else ⚡)
- Heading font family + weight + letter-spacing + case
- Body font family + base size + line-height + paragraph spacing
- Type scale (h1–h6 sizes), link styling/underline
- Font pairing presets (sans/serif/display combinations)

## 3. Buttons & Interactive Components — **G/C ⚡**
- Button: variant (solid/outline/soft/ghost), radius, size, shadow, uppercase, icon position
- Inputs/forms: radius, border style, focus ring, filled vs outline
- Cards: radius, border, shadow depth, hover behavior
- All shadcn component variants (badge, tabs, accordion, dialog, switch, select, navigation-menu) inherit from the token layer

## 4. Layout & Spacing — **G/P ⚡**
- Container max-width (narrow/normal/wide)
- Section vertical rhythm (tight/normal/roomy)
- Content density (compact/comfortable)
- Grid columns per section, alignment, gap
- Sticky header on/off, header height, transparency on scroll

## 5. Motion (framer-motion) — **G/C ⚡**
- Scroll-reveal on/off + style (fade / slide-up / zoom / stagger)
- Global animation speed + easing
- Hover effects (lift / glow / scale / none)
- Page-transition style, parallax on/off, count-up stats, marquee speed
- Reduced-motion respect (accessibility)

## 6. Effects & Aesthetic — **G ⚡**
- Gradient heroes on/off + gradient palette
- Image overlays (none/light/dark), duotone, grain/noise
- Shadow system (flat/soft/deep), glassmorphism, background patterns/blobs
- Dark/light default + auto (system)

## 7. Navigation & Chrome — **G ⚡**
- Nav items (add/remove/reorder/rename), mega-menu vs simple
- Logo (swap), logo size, favicon
- Header layout (left/center/split), CTA button in nav
- Footer columns, links, legal, social icons, newsletter block
- Announcement bar (copy, color, dismissible), cookie banner

## 8. Pages & Content Blocks — **P (⚡ content, 🔧 new block types)**
Per page, add/remove/reorder/edit blocks: hero, feature grid, logo cloud, stats, steps/how-it-works, pricing, comparison table, testimonials, case studies, FAQ, CTA banners, team, blog list, lead form, calculator/assessment embeds.
Existing route surface the HQ can manage (each is an editable page):
`/` · `/about` · `/ai-for-business` · `/ai-solution` · `/ai-readiness` · `/ai-assessment(-start)` · `/ai-lead-tools` · `/assessment(-timeline/-thank-you)` · `/applications` · `/apps` · `/blog` · `/clients` · `/consultation` · `/contact` · `/experience` · `/family` · `/health-check` · `/hipaa` · `/marketplace` · `/0nai` · `/pitch-idea` · `/personalized` · `/privacy` · `/dashboard` · `/admin` · `/login` · `/onboarding` · `/checkout` · `/order` …

## 9. Functionality & Modules — **P/C (🔧 wiring, ⚡ config)**
- **Forms → CRM**: contact, consultation, inquiry, assessment intake → CRM contact + pipeline + tags
- **AI Assessments**: readiness/health-check/HIPAA scoring engines, results pages, timelines
- **Payments**: Stripe checkout, pricing tables, order/checkout flows, coupons
- **Auth**: login/register/forgot-password (Supabase), gated dashboard/admin
- **Blog/CMS**: posts, categories, authors, RSS, auto-content
- **Marketplace**: listings, apps, applications
- **Chatbot / lead tools**: AI concierge (Nova), lead magnets, calculators
- **Booking / scheduling**, **email sequences**, **reviews** (add-on modules)

## 10. SEO & Meta — **P ⚡**
- Per-page title, description, canonical, OG/Twitter cards
- JSON-LD (Organization, Product, FAQ, Article, Breadcrumb)
- Sitemap.ts, robots.ts, llms.txt, IndexNow submission
- Redirects, slugs, headings hierarchy

## 11. Integrations & Analytics — **G ⚡**
- GTM / GA4 / analytics IDs, conversion events
- CRO9 live analytics + AI actions
- Supabase project binding, Stripe keys/products, CRM PIT
- Webhooks (Stripe, CRM), cron/scheduled agents

## 12. Brand Assets & Global Content — **G ⚡**
- Logo, favicon, social share image, brand colors
- Company name/tagline, phone, address, hours, socials (global content vars)
- Legal/compliance copy, testimonial pool, image library

---

## Verdict — how much control
**Near-total.** Because the site is already token-driven (shadcn variables) + component-driven (Radix/shadcn) + data-driven (Supabase/Stripe), the AI HQ can control:
- **100% of visual design** globally via the token layer — instant, no deploy.
- **All page content & structure** via the block model.
- **All functionality config** (forms, payments, auth, SEO, integrations) via data.
- Only **new block *types* / net-new component code** require a deploy.

The HQ ships as: **(1)** a Global Settings panel bound to the shadcn tokens, **(2)** a page/section manager with Nova (describe-to-edit) + drag-drop modules, **(3)** the assessment engine that learns the current brand and proposes a theme, **(4)** template presets that rewrite the whole token set in one click.
