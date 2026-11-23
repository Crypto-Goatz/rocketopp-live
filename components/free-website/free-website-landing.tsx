import Link from "next/link"
import Image from "next/image"
import { Plus_Jakarta_Sans } from "next/font/google"
import { ArrowRight, ArrowUpRight, Check, Phone, CalendarCheck, UserPlus } from "lucide-react"
import Footer from "@/components/footer"
import { FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import { YearEndOffer, YearEndStrip } from "@/components/year-end/year-end-offer"
import { Tilt } from "@/components/free-website/tilt"
import { PORTFOLIO, portfolioBySlug, portfolioSrc, type PortfolioItem } from "@/lib/free-website/portfolio"
import { TRADES, type Trade } from "@/lib/free-website/trades"
import "./free-website.css"

/**
 * THE WEBSITE OFFER — the page rocketopp.com leads with. Changed by Mike 2026-11-23 (was a no-cost site + a monthly lead tool):
 *   custom-built websites for businesses we feel are a good fit — not cookie-cutter — with three of our patent-pending
 *   tools, including a free CRM for customers and leads. The consultation is free. NO PRICE on this page: the year-end
 *   price is revealed only after the form is submitted (components/year-end/year-end-offer.tsx + /api/contact/submit).
 *
 * Design (same day): "high end but approachable… a professional and relaxed feel", with real client sites in animated 3D tilt.
 * Warm ink + paper sheets, Fraunces for display, every effect a CSS transform; one tiny client island (Tilt) besides the form.
 * Served at "/" and "/free-website"; with `trade` it is /free-website/<trade>.
 */
const display = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--fw-display", display: "swap" })

const SITE = "https://rocketopp.com"

export const FREE_WEBSITE_FAQ = [
  { question: "What does the website cost?", answer: "Through December 31 we're building websites at one flat year-end price — the lowest we've ever offered. Fill out your details on this page and the price is shown right away. The consultation is free." },
  { question: "Is it a template?", answer: "No. Every site is custom built for that one business — not cookie-cutter, not a template." },
  { question: "What comes with it?", answer: "Three of our patent-pending tools, including a free CRM for managing your customers and leads. Every call, form and booking from your new website lands somewhere you can act on it." },
  { question: "How do you decide who's a good fit?", answer: "We start with a free consultation. We look at where your business is today and where you want it to go. If we believe a website from us will genuinely help you grow, we take the project on." },
  { question: "Who is this for?", answer: "Small businesses getting off the ground, especially in the service industry — the trades, home services, personal services and local shops that run on calls and appointments." },
  { question: "What do I need to do to start?", answer: "Request a free consultation with the form on this page, or call (878) 888-1230. That's the whole first step." },
]

const STEPS = [
  { title: "A free consultation", body: "Tell us about your business — where it is today, who your customers are, and what you want the next year to look like. No pitch, no pressure." },
  { title: "We assess the fit", body: "We look honestly at your situation and goals. If a website from us will make a real difference for you, we take the project on." },
  { title: "Your custom website", body: "We build a website made for your business alone — not a template — with a free CRM for your customers and leads. A site you're proud to send people to." },
]

const GETS = [
  "A website custom built for your business — not a template",
  "Fast and easy to use on a phone, where your customers are",
  "Set up so people can call you or book with you in one tap",
  "Built so customers can find you on Google",
]

function Browser({ item, priority = false, sizes }: { item: PortfolioItem; priority?: boolean; sizes: string }) {
  return (
    <div className="fw-browser">
      <div className="fw-bar" aria-hidden><span /><span /><span /><em>{item.name}</em></div>
      <Image src={portfolioSrc(item.slug)} alt={`${item.name} website — ${item.kind}, built by our team`} width={item.w} height={item.h}
        sizes={sizes} priority={priority} loading={priority ? undefined : "lazy"} />
      <div className="fw-glare" aria-hidden />
    </div>
  )
}

/** Service + offers + how-to + the portfolio as one JSON-LD graph — what search and answer engines read the offer from. */
function OfferSchema({ trade, url }: { trade?: Trade; url: string }) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: trade ? `Custom website for ${trade.name.toLowerCase()} businesses` : "Custom website for small service businesses",
        serviceType: "Website design and development",
        description: "Custom-built websites for small businesses we feel are a good fit — not cookie-cutter, not a template — with three of our patent-pending tools, including a free CRM for managing customers and leads. The consultation is free.",
        provider: { "@type": "Organization", name: "RocketOpp", url: SITE, telephone: "+1-878-888-1230" },
        areaServed: { "@type": "Country", name: "United States" },
        audience: { "@type": "BusinessAudience", audienceType: trade ? `${trade.name} businesses` : "Small service businesses" },
        // No price in the markup: the year-end price is revealed only after the form is submitted.
        offers: { "@type": "Offer", name: "Year-end custom website", description: "Custom built for businesses we feel are a good fit, with a free CRM. Available through December 31, 2026.", availabilityEnds: "2026-12-31T23:59:59-05:00", url: `${url}#consultation` },
      },
      {
        "@type": "HowTo",
        "@id": `${url}#how`,
        name: "How to get a custom website for your business",
        step: STEPS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.body })),
      },
      {
        "@type": "ItemList",
        "@id": `${url}#work`,
        name: "Websites our team has built",
        itemListElement: PORTFOLIO.map((p, i) => ({
          "@type": "ListItem", position: i + 1,
          item: { "@type": "CreativeWork", name: `${p.name} website`, about: p.kind, image: `${SITE}${portfolioSrc(p.slug)}`, creator: { "@type": "Organization", name: "RocketOpp" } },
        })),
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
}

export function FreeWebsiteLanding({ trade }: { trade?: Trade } = {}) {
  const url = trade ? `${SITE}/free-website/${trade.slug}` : SITE
  const first = (trade?.work ?? []).map(portfolioBySlug).filter((p): p is PortfolioItem => !!p)
  const ordered = [...first, ...PORTFOLIO.filter((p) => !first.includes(p))]
  const hero = ordered.slice(0, 3)
  const work = ordered.slice(0, 9)
  const rowA = PORTFOLIO.filter((_, i) => i % 2 === 0)
  const rowB = PORTFOLIO.filter((_, i) => i % 2 === 1)
  const faq = trade ? [...trade.faq, ...FREE_WEBSITE_FAQ] : FREE_WEBSITE_FAQ
  const who = trade ? trade.business : "business"

  return (
    <div className={`fw ${display.variable}`}>
      <YearEndStrip />
      <FAQSchema items={faq} />
      <OfferSchema trade={trade} url={url} />
      {trade && <BreadcrumbSchema items={[{ name: "Home", url: SITE }, { name: "Websites", url: `${SITE}/free-website` }, { name: trade.name, url }]} />}

      <main>
        {/* ── HERO ── */}
        <section className="fw-hero fw-grain">
          <div className="fw-wrap">
            <div className="fw-hero-grid">
              <div>
                <p className="fw-eyebrow fw-rise">{trade ? `Websites for ${trade.name.toLowerCase()}` : "For small service businesses"}</p>
                <h1 className="fw-h1 fw-serif fw-rise fw-rise-2">
                  A custom website<br /> for your <em>{who}</em>.
                </h1>
                <p className="fw-lede fw-rise fw-rise-3">
                  {trade ? `${trade.moment} ` : ""}
                  Book a free consultation. We&rsquo;ll look at where your business is and where you want it to go &mdash; and if
                  we&rsquo;re a good fit, we build you a custom website &mdash; made for your business, not from a template.
                </p>
                <div className="fw-ctas fw-rise fw-rise-4">
                  <Link href="#consultation" className="fw-btn fw-btn-primary">Reveal my price <ArrowRight /></Link>
                  <a href="tel:+18788881230" className="fw-btn fw-btn-ghost"><Phone /> (878) 888-1230</a>
                </div>
                <ul className="fw-reassure fw-rise fw-rise-4">
                  <li><Check /> Custom, not a template</li>
                  <li><Check /> Free CRM included</li>
                  <li><Check /> Free consultation</li>
                </ul>
              </div>

              <Tilt className="fw-stage" max={7}>
                <div className="fw-stage-inner">
                  {hero.map((p, i) => (
                    <div key={p.slug} className={`fw-shot fw-shot-${i + 1}`}>
                      <div className="fw-float"><Browser item={p} priority={i === 2} sizes="(min-width: 1024px) 480px, 80vw" /></div>
                    </div>
                  ))}
                  <div className="fw-chip fw-chip-a" aria-hidden><i><UserPlus /></i><div><b>New contact</b><span>From your website</span></div></div>
                  <div className="fw-chip fw-chip-b" aria-hidden><i><CalendarCheck /></i><div><b>Appointment booked</b><span>Straight to your calendar</span></div></div>
                </div>
              </Tilt>
            </div>

            <div className="fw-answer">
              <p className="fw-eyebrow">In short</p>
              <p>
                <strong>RocketOpp builds custom websites for small service businesses.</strong> Start with a free consultation; if
                we&rsquo;re a good fit, we build your {who} a website made for your business alone &mdash; not a template. It comes with three of our patent-pending tools, including <strong>a free CRM</strong> for managing
                your customers and leads.
              </p>
            </div>
          </div>
        </section>

        {/* ── YEAR-END OFFER: the price-reveal form, right under the hero ── */}
        <YearEndOffer trade={trade?.slug} />

        {/* ── THE WALL OF WORK ── */}
        <section className="fw-wall" aria-label="Websites our team has built">
          <div className="fw-wall-plane">
            {[rowA, rowB].map((row, r) => (
              <div key={r} className={`fw-row${r ? " fw-rev" : ""}`}>
                {[...row, ...row].map((p, i) => (
                  <div key={`${p.slug}-${i}`} className="fw-tile" aria-hidden={i >= row.length || undefined}>
                    <Browser item={p} sizes="380px" />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="fw-wall-cap">Real websites our team has built for local businesses</p>
        </section>

        {/* ── HOW IT WORKS + THE OFFER (paper) ── */}
        <section id="how-it-works" className="fw-paper">
          <div className="fw-wrap">
            <p className="fw-eyebrow">How it works</p>
            <h2 className="fw-h2 fw-serif">How to get a custom website <em>for your {trade ? who : "small business"}</em></h2>
            <p className="fw-sub">Three steps, and the first one is a conversation. We only take on projects where we&rsquo;re confident we can help.</p>
            <ol className="fw-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="fw-step">
                  <span className="fw-step-n fw-serif" aria-hidden>0{i + 1}</span>
                  <h3 className="fw-serif">{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>

            {trade && (
              <div className="fw-needs">
                <div>
                  <p className="fw-eyebrow">Built for {trade.name.toLowerCase()}</p>
                  <h2 className="fw-h2 fw-serif">What a {trade.business} website <em>needs</em></h2>
                  <p className="fw-sub">{trade.moment}</p>
                </div>
                <ul className="fw-list">
                  {trade.needs.map((n) => <li key={n}><Check /><span>{n}</span></li>)}
                </ul>
              </div>
            )}

            <div className="fw-offer">
              <div className="fw-card-paper">
                <h3 className="fw-serif">Your custom website</h3>
                <ul className="fw-list">
                  {GETS.map((g) => <li key={g}><Check /><span>{g}</span></li>)}
                </ul>
                <p className="fw-fine">Custom built for your business. Not cookie-cutter, not a template.</p>
              </div>
              <div className="fw-card-ink">
                <h3 className="fw-serif" style={{ position: "relative" }}>Included with it</h3>
                <p className="fw-price fw-serif"><b>Free</b><span>CRM</span></p>
                <p style={{ position: "relative", marginTop: 6, fontWeight: 500 }}>One of three patent-pending tools that come with your website</p>
                <ul className="fw-list" style={{ position: "relative" }}>
                  <li><UserPlus /><span>Manage your customers and leads &mdash; every call, form and customer in one place</span></li>
                  <li><CalendarCheck /><span>Manage your appointments</span></li>
                </ul>
                <p className="fw-fine fw-serif" style={{ position: "relative" }}>Free with your website.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SELECTED WORK ── */}
        <section className="fw-ink-sec">
          <div className="fw-wrap">
            <p className="fw-eyebrow">Our work</p>
            <h2 className="fw-h2 fw-serif">Websites built for <em>real businesses</em></h2>
            <p className="fw-sub">Landscapers, salons, contractors, trainers, farms and shops &mdash; a few of the local businesses our team has built websites for.</p>
            <div className="fw-work">
              {work.map((p) => (
                <figure key={p.slug}>
                  <Tilt className="fw-tilt" max={9}>
                    <div className="fw-tilt-in"><Browser item={p} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" /></div>
                  </Tilt>
                  <figcaption><b>{p.name}</b><span>{p.kind}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRADES ── */}
        <section className="fw-ink-sec" style={{ paddingTop: 0 }}>
          <div className="fw-wrap">
            <p className="fw-eyebrow">Built for the service industry</p>
            <h2 className="fw-h2 fw-serif">For businesses that run on <em>calls and appointments</em></h2>
            <p className="fw-sub">We want to help small businesses get off the ground. Find your trade:</p>
            <nav className="fw-trades" aria-label="Websites by trade">
              {TRADES.map((t) => (
                <Link key={t.slug} href={`/free-website/${t.slug}`} aria-current={t.slug === trade?.slug ? "page" : undefined}>
                  Websites for {t.name.toLowerCase()} <ArrowUpRight />
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {/* ── FAQ (paper) ── */}
        <section className="fw-paper">
          <div className="fw-wrap" style={{ maxWidth: 920 }}>
            <p className="fw-eyebrow">Questions</p>
            <h2 className="fw-h2 fw-serif">The honest <em>answers</em></h2>
            <div className="fw-faq">
              {faq.map((f, i) => (
                <details key={f.question} open={i === 0}>
                  <summary className="fw-serif">{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLOSING CTA → the year-end form above ── */}
        <section className="fw-ink-sec">
          <div className="fw-wrap" style={{ textAlign: "center" }}>
            <p className="fw-eyebrow">Through December 31</p>
            <h2 className="fw-h2 fw-serif">One flat year-end price, <em>the lowest we&rsquo;ve offered</em></h2>
            <p className="fw-sub" style={{ marginLeft: "auto", marginRight: "auto" }}>Fill out your details to reveal the price. The consultation is free.</p>
            <div className="fw-ctas" style={{ justifyContent: "center" }}>
              <a href="#consultation" className="fw-btn fw-btn-primary">Reveal my price <ArrowRight /></a>
              <a href="tel:+18788881230" className="fw-btn fw-btn-ghost"><Phone /> (878) 888-1230</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
