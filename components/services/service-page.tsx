import Link from "next/link"
import Image from "next/image"
import { Plus_Jakarta_Sans } from "next/font/google"
import { ArrowRight, Check, Phone, CalendarCheck, UserPlus, Zap, ExternalLink } from "lucide-react"
import Footer from "@/components/footer"
import { FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import { ContactForm } from "@/app/contact/contact-form"
import { Tilt } from "@/components/free-website/tilt"
import { PORTFOLIO, portfolioSrc } from "@/lib/free-website/portfolio"
import { MAIN_SERVICES, mainServiceBySlug, type Chart, type Demo, type MainService } from "@/lib/services/main"
import "./service.css"

/**
 * The one template behind the six main service pages (2026-10-31). Server-rendered; the only client code is the contact form
 * and the small pointer-tilt island on the example sites. No infinite animations, no backdrop-filter, no blend modes —
 * Mike's 2018 MacBook Pro froze on the old pages, so nothing here may cost the main thread or GPU at rest.
 */
const display = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--sv-display", display: "swap" })
const SITE = "https://rocketopp.com"

function StatCard({ value, label, source, url }: MainService["stats"][number]) {
  return (
    <figure className="sv-stat">
      <b>{value}</b>
      <figcaption>{label}</figcaption>
      <a href={url} target="_blank" rel="noopener nofollow">{source} <ExternalLink /></a>
    </figure>
  )
}

function ChartBlock({ chart }: { chart: Chart }) {
  return (
    <div className="sv-chart">
      <p className="sv-eyebrow">The data</p>
      <h3>{chart.title}</h3>
      <p className="sv-chart-note">{chart.note}</p>
      {chart.kind === "bars" && (() => {
        const max = Math.max(...chart.data.map((d) => d.value))
        return (
          <ul className="sv-bars" role="list">
            {chart.data.map((d) => (
              <li key={d.label}>
                <span className="sv-bar-label">{d.label}</span>
                <span className="sv-bar-track"><span className="sv-bar-fill" style={{ width: `${(d.value / max) * 100}%` }} /></span>
                <span className="sv-bar-value">{chart.unit === "$" ? `$${d.value.toFixed(2)}` : `${d.value}%`}</span>
              </li>
            ))}
          </ul>
        )
      })()}
      {chart.kind === "donut" && (
        <div className="sv-donut-wrap">
          <svg viewBox="0 0 120 120" className="sv-donut" role="img" aria-label={`${chart.value}% ${chart.caption}`}>
            <circle cx="60" cy="60" r="50" className="sv-donut-track" />
            <circle cx="60" cy="60" r="50" className="sv-donut-fill" strokeDasharray={`${(chart.value / 100) * 314.16} 314.16`} />
          </svg>
          <div className="sv-donut-center"><b>{chart.value}%</b><span>{chart.caption}</span></div>
        </div>
      )}
      {chart.kind === "timeline" && (
        <ol className="sv-timeline">
          {chart.data.map((d) => <li key={d.when}><b>{d.when}</b><span>{d.what}</span></li>)}
        </ol>
      )}
      <a className="sv-source" href={chart.url} target="_blank" rel="noopener nofollow">Source: {chart.source} <ExternalLink /></a>
    </div>
  )
}

/** Example panels — clearly labelled as examples, built in HTML/CSS (no images, no JS). */
function DemoBlock({ demo }: { demo: Demo }) {
  if (demo === "examples") {
    const items = ["blue-fox-landscape", "eden-salon", "ecospray-solutions"].map((s) => PORTFOLIO.find((p) => p.slug === s)!)
    return (
      <div className="sv-examples">
        {items.map((p) => (
          <figure key={p.slug}>
            <Tilt className="fw-tilt sv-tilt" max={7}>
              <div className="fw-tilt-in sv-browser">
                <div className="sv-bar" aria-hidden><i /><i /><i /><em>{p.name}</em></div>
                <Image src={portfolioSrc(p.slug)} alt={`${p.name} website — ${p.kind}, built by our team`} width={p.w} height={p.h} sizes="(min-width: 1024px) 360px, 90vw" />
              </div>
            </Tilt>
            <figcaption><b>{p.name}</b><span>{p.kind}</span></figcaption>
          </figure>
        ))}
      </div>
    )
  }
  const label = <p className="sv-demo-label">Example view</p>
  if (demo === "runlog") {
    const rows = [["9:41 pm", "Form received", "“Water heater leaking — can someone come tomorrow?”"], ["9:41 pm", "Contact created", "Name, phone and address added to the CRM"], ["9:41 pm", "Scored + routed", "Urgent · residential · inside service area"], ["9:42 pm", "Text sent", "“Thanks — we can be there 8–10 am. Reply YES to book.”"], ["9:47 pm", "Booked", "Appointment on the calendar, reminder scheduled"]]
    return <div className="sv-demo">{label}<ol className="sv-runlog">{rows.map(([t, a, b]) => <li key={a}><time>{t}</time><div><b>{a}</b><span>{b}</span></div></li>)}</ol></div>
  }
  if (demo === "answer") {
    return (
      <div className="sv-demo">{label}
        <div className="sv-ask"><span>Who&rsquo;s a reliable plumber near Greensburg that can come today?</span></div>
        <div className="sv-answer">
          <p className="sv-answer-h">AI answer</p>
          <p>Here are well-reviewed plumbers serving Greensburg, PA with same-day availability:</p>
          <ol><li><b>Your Business Name</b> — 24/7 emergency service, upfront pricing, books online. <u>yourbusiness.com</u></li><li>Another local plumber…</li></ol>
          <p className="sv-answer-cite">Sources: yourbusiness.com · Google reviews</p>
        </div>
      </div>
    )
  }
  if (demo === "pipeline") {
    const cols: [string, string[]][] = [["New lead", ["Kitchen remodel quote", "Furnace not igniting"]], ["Contacted", ["Gutter cleaning"]], ["Booked", ["Annual AC tune-up", "Drain cleaning"]], ["Won", ["Water heater install"]]]
    return <div className="sv-demo">{label}<div className="sv-pipeline">{cols.map(([c, cards]) => <div key={c}><p>{c} <small>{cards.length}</small></p>{cards.map((x) => <span key={x}>{x}</span>)}</div>)}</div></div>
  }
  if (demo === "ads") {
    const rows = [["Emergency plumber", "Search", "Calls + forms"], ["Water heater install", "Search", "Booked jobs"], ["Local Services Ads", "LSA", "Calls"], ["Spring tune-up", "Meta", "Bookings"]]
    return <div className="sv-demo">{label}<table className="sv-table"><thead><tr><th>Campaign</th><th>Channel</th><th>Optimised for</th></tr></thead><tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody></table></div>
  }
  // stack
  const tools = ["CRM", "Gmail / Outlook", "Calendar", "Stripe", "Slack", "QuickBooks", "Google Drive", "Shopify"]
  return (
    <div className="sv-demo">{label}
      <div className="sv-stack">
        <div className="sv-node sv-node-ai">Your AI assistant<small>Claude · ChatGPT · Gemini</small></div>
        <span className="sv-down" aria-hidden />
        <div className="sv-node sv-node-core">0nMCP<small>+ 0nVault encrypted credentials</small></div>
        <span className="sv-down" aria-hidden />
        <div className="sv-tools">{tools.map((t) => <span key={t}>{t}</span>)}</div>
      </div>
    </div>
  )
}

export function ServicePage({ slug }: { slug: string }) {
  const s = mainServiceBySlug(slug)
  const url = `${SITE}/services/${s.slug}`
  const related = s.related.map((r) => MAIN_SERVICES.find((x) => x.slug === r)!).filter(Boolean)
  const schema = {
    "@context": "https://schema.org", "@type": "Service", "@id": `${url}#service`, name: s.name, serviceType: s.eyebrow, description: s.lede,
    provider: { "@type": "Organization", name: "RocketOpp", url: SITE, telephone: "+1-878-888-1230" }, areaServed: { "@type": "Country", name: "United States" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free consultation", url: `${url}#consultation` }, image: `${SITE}${s.image.src}`,
  }
  const howto = { "@context": "https://schema.org", "@type": "HowTo", name: `How RocketOpp delivers ${s.name}`, step: s.flow.map((f, i) => ({ "@type": "HowToStep", position: i + 1, name: f.title, text: f.body })) }

  return (
    <div className={`sv ${display.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howto) }} />
      <FAQSchema items={s.faq} />
      <BreadcrumbSchema items={[{ name: "Home", url: SITE }, { name: "Services", url: `${SITE}/services` }, { name: s.name, url }]} />

      <main>
        {/* HERO */}
        <section className="sv-hero">
          <div className="sv-wrap sv-hero-grid">
            <div>
              <nav className="sv-crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/services">Services</Link><span>/</span><span>{s.name}</span></nav>
              <p className="sv-eyebrow">{s.eyebrow}</p>
              <h1 className="sv-h1">{s.h1[0]}<em>{s.h1[1]}</em></h1>
              <p className="sv-lede">{s.lede}</p>
              <div className="sv-ctas">
                <a href="#consultation" className="sv-btn sv-btn-primary">Book a free consultation <ArrowRight /></a>
                <a href="tel:+18788881230" className="sv-btn sv-btn-ghost"><Phone /> (878) 888-1230</a>
              </div>
            </div>
            <div className="sv-photo">
              <Image src={s.image.src} alt={s.image.alt} width={1600} height={893} priority sizes="(min-width: 1024px) 600px, 100vw" />
              <div className="sv-chip sv-chip-a" aria-hidden><i><UserPlus /></i><div><b>{s.chips[0].title}</b><span>{s.chips[0].sub}</span></div></div>
              <div className="sv-chip sv-chip-b" aria-hidden><i><CalendarCheck /></i><div><b>{s.chips[1].title}</b><span>{s.chips[1].sub}</span></div></div>
            </div>
          </div>
        </section>

        {/* STATS (white) */}
        <section className="sv-white">
          <div className="sv-wrap">
            <p className="sv-eyebrow">Why it matters</p>
            <h2 className="sv-h2">{s.problem.title}</h2>
            <p className="sv-sub">{s.problem.body}</p>
            <div className="sv-stats">{s.stats.map((st) => <StatCard key={st.label} {...st} />)}</div>
          </div>
        </section>

        {/* FLOW (white) */}
        <section className="sv-white sv-tight">
          <div className="sv-wrap">
            <p className="sv-eyebrow">How it works</p>
            <h2 className="sv-h2">From first conversation to <em>results</em></h2>
            <ol className="sv-flow">
              {s.flow.map((f, i) => (
                <li key={f.title}>
                  <span className="sv-flow-n">{i + 1}</span>
                  {f.when && <span className="sv-flow-when">{f.when}</span>}
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* DATA + EXAMPLE (ink) */}
        <section className="sv-ink">
          <div className="sv-wrap sv-split">
            <ChartBlock chart={s.chart} />
            <div>
              <p className="sv-eyebrow">{s.demo === "examples" ? "Our work" : "What it looks like"}</p>
              <h2 className="sv-h2">{s.demo === "examples" ? <>Websites built for <em>real businesses</em></> : <>See it <em>in action</em></>}</h2>
              <DemoBlock demo={s.demo} />
            </div>
          </div>
        </section>

        {/* INCLUDES (white) */}
        <section className="sv-white">
          <div className="sv-wrap">
            <p className="sv-eyebrow">What you get</p>
            <h2 className="sv-h2">Everything included in <em>{s.name}</em></h2>
            <ul className="sv-includes">
              {s.includes.map((x) => <li key={x.title}><i><Check /></i><h3>{x.title}</h3><p>{x.body}</p></li>)}
            </ul>
            <div className="sv-offer">
              <div><b>Free website</b><span>For small service businesses that are a good fit</span></div>
              <div><b>$49/month</b><span>Lead management tool — contacts and appointments</span></div>
              <div><b>Free consultation</b><span>Scope and cost set together, before anything starts</span></div>
            </div>
          </div>
        </section>

        {/* FAQ (white) */}
        <section className="sv-white sv-tight">
          <div className="sv-wrap sv-narrow">
            <p className="sv-eyebrow">Questions</p>
            <h2 className="sv-h2">The honest <em>answers</em></h2>
            <div className="sv-faq">
              {s.faq.map((f, i) => <details key={f.question} open={i === 0}><summary>{f.question}</summary><p>{f.answer}</p></details>)}
            </div>
          </div>
        </section>

        {/* CONSULTATION (ink) */}
        <section id="consultation" className="sv-ink scroll-mt-24">
          <div className="sv-wrap sv-consult">
            <div>
              <p className="sv-eyebrow">Start here</p>
              <h2 className="sv-h2">Book a free <em>consultation</em></h2>
              <p className="sv-sub">Tell us about your business. We&rsquo;ll be in touch to set up a time — a relaxed conversation, honest advice, no pressure.</p>
              <a href="tel:+18788881230" className="sv-phone"><i><Phone /></i><div><span>Prefer to talk?</span><b>(878) 888-1230</b></div></a>
              <div className="sv-related">
                <p>Related services</p>
                {related.map((r) => <Link key={r.slug} href={`/services/${r.slug}`}><Zap /> {r.name} <ArrowRight /></Link>)}
              </div>
            </div>
            <ContactForm form="contact" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
