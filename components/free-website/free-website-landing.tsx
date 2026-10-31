import Link from "next/link"
import Image from "next/image"
import { Fraunces } from "next/font/google"
import { ArrowRight, ArrowUpRight, Check, Phone, CalendarCheck, UserPlus } from "lucide-react"
import Footer from "@/components/footer"
import { FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import { ContactForm } from "@/app/contact/contact-form"
import { Tilt } from "@/components/free-website/tilt"
import { PORTFOLIO, portfolioBySlug, portfolioSrc, type PortfolioItem } from "@/lib/free-website/portfolio"
import { TRADES, type Trade } from "@/lib/free-website/trades"
import "./free-website.css"

/**
 * THE FREE WEBSITE OFFER (Mike, 2026-10-31) — the page rocketopp.com leads with:
 *   "For a free website, all they need to do is contact us for a free consultation. We will assess their situation and goals and
 *    make a determination if they are a good fit for us. If we take on the project they will receive a free website for their
 *    business. No purchase is necessary for the website, we will simply provide a lead management tool that allows the user to
 *    manage their contacts and appointments for $49 per month moving forward… that's it. Nothing more."
 *
 * Design (same day): "high end but approachable… a professional and relaxed feel", with real client sites in animated 3D tilt.
 * Warm ink + paper sheets, Fraunces for display, every effect a CSS transform; one tiny client island (Tilt) besides the form.
 * Served at "/" and "/free-website"; with `trade` it is /free-website/<trade>.
 */
const display = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--fw-display", display: "swap" })

const SITE = "https://rocketopp.com"

export const FREE_WEBSITE_FAQ = [
  { question: "Is the website really free?", answer: "Yes. If we take on your project, we build your website at no cost. No purchase is necessary for the website." },
  { question: "So what does it cost?", answer: "Only the lead management tool: $49 per month. It keeps your contacts and your appointments in one place, so every call, form and booking from your new website lands somewhere you can act on it. That's it — nothing more." },
  { question: "Why would you build a website for free?", answer: "We want to help small businesses get off the ground, especially in the service industry. Instead of charging for the build, the only cost is the lead management tool that makes the website pay off — your contacts and appointments in one place." },
  { question: "How do you decide who's a good fit?", answer: "We start with a free consultation. We look at where your business is today and where you want it to go. If we believe a website from us will genuinely help you grow, we take the project on." },
  { question: "Who is this for?", answer: "Small businesses getting off the ground, especially in the service industry — the trades, home services, personal services and local shops that run on calls and appointments." },
  { question: "What do I need to do to start?", answer: "Request a free consultation with the form on this page, or call (878) 888-1230. That's the whole first step." },
]

const STEPS = [
  { title: "A free consultation", body: "Tell us about your business — where it is today, who your customers are, and what you want the next year to look like. No pitch, no pressure." },
  { title: "We assess the fit", body: "We look honestly at your situation and goals. If a website from us will make a real difference for you, we take the project on." },
  { title: "Your website, free", body: "We build your business a professional website at no cost. No purchase necessary — just a site you're proud to send people to." },
]

const GETS = [
  "A professional website built for your business",
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
        name: trade ? `Free website for ${trade.name.toLowerCase()} businesses` : "Free website for small service businesses",
        serviceType: "Website design and development",
        description: "Book a free consultation. If we're a good fit, we build your business a website for free. No purchase is necessary for the website; the only cost is a lead management tool for contacts and appointments at $49 per month.",
        provider: { "@type": "Organization", name: "RocketOpp", url: SITE, telephone: "+1-878-888-1230" },
        areaServed: { "@type": "Country", name: "United States" },
        audience: { "@type": "BusinessAudience", audienceType: trade ? `${trade.name} businesses` : "Small service businesses" },
        offers: [
          { "@type": "Offer", name: "Website build", price: "0", priceCurrency: "USD", description: "Free for businesses we take on after a free consultation. No purchase necessary.", url },
          {
            "@type": "Offer", name: "Lead management tool", price: "49", priceCurrency: "USD", description: "Manage your contacts and appointments.",
            priceSpecification: { "@type": "UnitPriceSpecification", price: "49", priceCurrency: "USD", unitText: "MONTH", billingDuration: "P1M" },
          },
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${url}#how`,
        name: "How to get a free website for your business",
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
      <FAQSchema items={faq} />
      <OfferSchema trade={trade} url={url} />
      {trade && <BreadcrumbSchema items={[{ name: "Home", url: SITE }, { name: "Free website", url: `${SITE}/free-website` }, { name: trade.name, url }]} />}

      <main>
        {/* ── HERO ── */}
        <section className="fw-hero fw-grain">
          <div className="fw-wrap">
            <div className="fw-hero-grid">
              <div>
                <p className="fw-eyebrow fw-rise">{trade ? `Websites for ${trade.name.toLowerCase()}` : "For small service businesses"}</p>
                <h1 className="fw-h1 fw-serif fw-rise fw-rise-2">
                  A free website<br /> for your <em>{who}</em>.
                </h1>
                <p className="fw-lede fw-rise fw-rise-3">
                  {trade ? `${trade.moment} ` : ""}
                  Book a free consultation. We&rsquo;ll look at where your business is and where you want it to go &mdash; and if
                  we&rsquo;re a good fit, we build your website for free. No purchase necessary.
                </p>
                <div className="fw-ctas fw-rise fw-rise-4">
                  <Link href="#consultation" className="fw-btn fw-btn-primary">Book my free consultation <ArrowRight /></Link>
                  <a href="tel:+18788881230" className="fw-btn fw-btn-ghost"><Phone /> (878) 888-1230</a>
                </div>
                <ul className="fw-reassure fw-rise fw-rise-4">
                  <li><Check /> No purchase necessary</li>
                  <li><Check /> One cost: $49/mo lead tool</li>
                  <li><Check /> Nothing more</li>
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
                <strong>RocketOpp builds free websites for small service businesses.</strong> Start with a free consultation; if
                we&rsquo;re a good fit, we build your {who} a professional website at no cost &mdash; no purchase necessary. The only
                ongoing cost is our lead management tool for your contacts and appointments: <strong>$49 per month. That&rsquo;s it.</strong>
              </p>
            </div>
          </div>
        </section>

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
            <h2 className="fw-h2 fw-serif">How to get a free website <em>for your {trade ? who : "small business"}</em></h2>
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
                <h3 className="fw-serif">Your website &mdash; free</h3>
                <ul className="fw-list">
                  {GETS.map((g) => <li key={g}><Check /><span>{g}</span></li>)}
                </ul>
                <p className="fw-fine">No purchase necessary for the website.</p>
              </div>
              <div className="fw-card-ink">
                <h3 className="fw-serif" style={{ position: "relative" }}>The only cost</h3>
                <p className="fw-price fw-serif"><b>$49</b><span>/ month</span></p>
                <p style={{ position: "relative", marginTop: 6, fontWeight: 500 }}>Lead management tool</p>
                <ul className="fw-list" style={{ position: "relative" }}>
                  <li><UserPlus /><span>Manage your contacts &mdash; every call, form and customer in one place</span></li>
                  <li><CalendarCheck /><span>Manage your appointments</span></li>
                </ul>
                <p className="fw-fine fw-serif" style={{ position: "relative" }}>That&rsquo;s it. Nothing more.</p>
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
            <nav className="fw-trades" aria-label="Free websites by trade">
              {TRADES.map((t) => (
                <Link key={t.slug} href={`/free-website/${t.slug}`} aria-current={t.slug === trade?.slug ? "page" : undefined}>
                  Free website for {t.name.toLowerCase()} <ArrowUpRight />
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

        {/* ── THE CONSULTATION ── */}
        <section id="consultation" className="fw-ink-sec scroll-mt-24">
          <div className="fw-wrap fw-consult">
            <div>
              <p className="fw-eyebrow">Start here</p>
              <h2 className="fw-h2 fw-serif">Book your <em>free consultation</em></h2>
              <p className="fw-sub">
                Fill this in and we&rsquo;ll be in touch to set up a time. It&rsquo;s a relaxed conversation about your business &mdash;
                if we&rsquo;re a good fit, your website is on us.
              </p>
              <a href="tel:+18788881230" className="fw-phone">
                <i><Phone /></i>
                <div><span>Prefer to talk?</span><b>(878) 888-1230</b></div>
              </a>
            </div>
            <ContactForm form="free_website" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
