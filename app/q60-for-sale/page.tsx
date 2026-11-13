import type { Metadata } from 'next'
import Image from 'next/image'
import { withCro9Meta } from '@/lib/cro9-meta'
import { CAR, HERO, EXTERIOR, INTERIOR, VIDEOS, BUILD, LOOK, RECEIPTS, EBAY, FAQ, URL_, PATH, PDF_PATH, receipt, ebay, abs, dims } from '@/lib/q60/listing'
import { Gallery } from './gallery'
import { BuyPanel } from './buy-panel'
import { StickyBar } from './sticky-bar'
import { serif, sans } from './fonts'
import s from './q60.module.css'


const usd = (n: number, cents = false) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 })

const TITLE = '2018 Infiniti Q60 3.0t AWD for Sale — 418 whp, Paid Off, $25,000'
const DESC = `Black 2018 Infiniti Q60 LUXE AWD for sale in Pittsburgh, PA. 418 whp / 469 lb-ft dyno-verified at TPG Tuning, 0–60 in ${CAR.zero60} s, 48K-mile replacement engine, transferable EcuTek tune, ${usd(CAR.spend.total)} in receipted upgrades. Paid off, clean title. Buy it now for ${usd(CAR.price)} or make an offer.`

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta(PATH, {
    title: { absolute: TITLE },
    description: DESC,
    alternates: { canonical: URL_ },
    openGraph: { type: 'website', url: URL_, title: TITLE, description: DESC, images: [{ url: abs(HERO.src), width: HERO.w, height: HERO.h, alt: HERO.alt }] },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [abs(HERO.src)] },
  })
}

function jsonLd() {
  return [
    {
      '@context': 'https://schema.org', '@type': 'Car', name: CAR.title, url: URL_,
      brand: { '@type': 'Brand', name: 'Infiniti' }, model: 'Q60', vehicleModelDate: '2018', bodyType: 'Coupe',
      color: CAR.color, vehicleTransmission: 'Automatic', driveWheelConfiguration: 'AWD', itemCondition: 'https://schema.org/UsedCondition',
      mileageFromOdometer: { '@type': 'QuantitativeValue', value: CAR.miles, unitCode: 'SMI' },
      vehicleEngine: { '@type': 'EngineSpecification', name: 'VR30DDTT 3.0L twin-turbo V6', enginePower: { '@type': 'QuantitativeValue', value: CAR.dyno.whp, unitText: 'wheel horsepower' }, torque: { '@type': 'QuantitativeValue', value: CAR.dyno.wtq, unitText: 'lb-ft at the wheels' } },
      accelerationTime: { '@type': 'QuantitativeValue', value: CAR.zero60, unitCode: 'SEC', description: '0–60 mph' },
      image: EXTERIOR.slice(0, 8).map((p) => abs(p.src)),
      description: DESC,
      offers: { '@type': 'Offer', price: CAR.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/UsedCondition', url: URL_, areaServed: CAR.location, seller: { '@type': 'Person', name: 'Mike Mento' } },
    },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ]
}

function Bars({ label, mine, stock }: { label: string; mine: number; stock: number }) {
  const max = 500
  return (
    <div className={s.barBlock}>
      <p className={s.barLabel}>{label}</p>
      <div className={s.bar}><span className={s.fillMine} style={{ width: `${(mine / max) * 100}%` }} /><b>{mine}</b><i>This car</i></div>
      <div className={s.bar}><span className={s.fillStock} style={{ width: `${(stock / max) * 100}%` }} /><b>{stock}</b><i>Stock Q50/Q60</i></div>
    </div>
  )
}

export default function Page() {
  const deposit = CAR.depositCents / 100
  return (
    <div className={`${s.root} ${serif.variable} ${sans.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />

      <header className={s.hero} id="q60-hero">
        <Image className={s.heroImg} src={HERO.src} alt={HERO.alt} width={HERO.w} height={HERO.h} priority sizes="100vw" quality={80} />
        <div className={s.heroShade} />
        <div className={s.heroCopy}>
          <p className={s.kicker}>For sale · {CAR.location}</p>
          <h1 className={s.h1}>2018 Infiniti Q60 <em>3.0t</em> AWD</h1>
          <ul className={s.badges}>
            <li>Paid off</li><li>Clean title</li><li>{CAR.miles.toLocaleString()} miles</li><li>48K-mile engine</li>
          </ul>
          <div className={s.stats}>
            <div><b>{CAR.dyno.whp}</b><span>wheel hp</span></div>
            <div><b>{CAR.dyno.wtq}</b><span>lb-ft at the wheels</span></div>
            <div><b>{CAR.zero60}</b><span>s, 0–60</span></div>
          </div>
          <div className={s.ctas}>
            <a className={s.btnPrimary} href="#buy" data-cro9="q60-hero-buy">Buy it now · {usd(CAR.price)}</a>
            <a className={s.btnGhost} href="#offer" data-cro9="q60-hero-offer">Make an offer</a>
          </div>
        </div>
      </header>

      <main className={s.main}>
        <section className={s.intro}>
          <p>Dyno-proven at TPG Tuning, timed by its own ECU, and documented down to the badge clips. {usd(CAR.spend.total)} in receipted parts and labor, every install by one shop. The engine was replaced in February 2025 with a 48,000-mile assembly, so the motor has 20,000 fewer miles than the car. The EcuTek tune and its phone-switchable maps transfer to you.</p>
        </section>

        <section id="photos" className={s.section}>
          <h2 className={s.h2}>The car</h2>
          <Gallery exterior={EXTERIOR} interior={INTERIOR} />
        </section>

        <section id="proof" className={s.section}>
          <h2 className={s.h2}>The numbers, on paper</h2>
          <div className={s.proof}>
            <div className={s.proofBars}>
              <Bars label="Wheel horsepower" mine={CAR.dyno.whp} stock={CAR.stock.whp} />
              <Bars label="Wheel torque, lb-ft" mine={CAR.dyno.wtq} stock={CAR.stock.wtq} />
              <p className={s.fine}>TPG Tuning Mustang dynamometer, {CAR.dyno.date}, {CAR.dyno.fuel}, {CAR.dyno.map}, wheel-corrected, with a stock Q50/Q60 run on the same dyno. Average across the pull: {CAR.dyno.avgHp} hp / {CAR.dyno.avgTq} lb-ft. Estimated quarter mile {CAR.quarterEst} (calculated from the dyno and weight, not run at a strip).</p>
            </div>
            <figure className={s.ecutek}>
              <Image src={receipt('zero60-324')} alt="EcuTek ECU Connect performance results: 0–30 mph 1.49 s, 0–60 mph 3.24 s" width={dims(receipt('zero60-324'))[0]} height={dims(receipt('zero60-324'))[1]} sizes="(min-width: 900px) 45vw, 100vw" />
              <figcaption>Logged by the car’s own EcuTek ECU: 0–30 in {CAR.zero30} s, 0–60 in {CAR.zero60} s.</figcaption>
            </figure>
          </div>
        </section>

        {VIDEOS.length > 0 && (
          <section id="video" className={s.section}>
            <h2 className={s.h2}>Hear it</h2>
            <div className={s.videos}>
              {VIDEOS.map((v) => (
                <div key={v.title} className={s.video}>
                  <iframe
                    src={v.youtube ? `https://www.youtube-nocookie.com/embed/${v.youtube}` : `https://player.vimeo.com/video/${v.vimeo}`}
                    title={v.title} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
                  />
                  <p>{v.title}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="build" className={s.section}>
          <h2 className={s.h2}>The build</h2>
          <p className={s.lede}>{usd(CAR.spend.total, true)} documented. Installed and tuned by {CAR.shop.name}, {CAR.shop.address}. Run on 92+ octane from day one.</p>
          {BUILD.map((g) => (
            <div key={g.group} className={s.group}>
              <h3 className={s.h3}>{g.group}</h3>
              <ul>
                {g.items.map((it) => (
                  <li key={it.name}>
                    <div className={s.itemRow}>
                      <span className={s.date}>{it.date}</span>
                      <span className={s.name}>{it.name}</span>
                      <span className={s.cost}>{it.incl ? 'included' : it.cost == null ? 'receipt pending' : usd(it.cost, true)}{it.listing ? '*' : ''}</span>
                    </div>
                    <p className={s.note}>{it.note}{it.doc && <> <a href={`#doc-${it.doc}`}>See receipt</a></>}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className={s.group}>
            <h3 className={s.h3}>The look</h3>
            <ul className={s.look}>{LOOK.map((l) => <li key={l}>{l}</li>)}</ul>
            <p className={s.fine}>{usd(CAR.spend.cosmetic, true)} of exterior and interior parts receipted. * listing price; order confirmation on file.</p>
          </div>
        </section>

        <section id="receipts" className={s.section}>
          <h2 className={s.h2}>Receipts and dyno sheets</h2>
          <div className={s.docs}>
            {RECEIPTS.map((d) => (
              <figure key={d.id} id={`doc-${d.id}`} className={d.wide ? s.docWide : s.doc}>
                <a href={receipt(d.id)} target="_blank" rel="noopener noreferrer">
                  <Image src={receipt(d.id)} alt={d.title} width={dims(receipt(d.id))[0]} height={dims(receipt(d.id))[1]} sizes="(min-width: 1000px) 33vw, (min-width: 640px) 50vw, 100vw" />
                </a>
                <figcaption><b>{d.title}</b>{d.cap}</figcaption>
              </figure>
            ))}
          </div>
          <details className={s.ebay}>
            <summary>eBay order history for the exterior and interior parts ({EBAY.length} screenshots)</summary>
            <div className={s.ebayGrid}>
              {EBAY.map((e) => (
                <a key={e.id} href={ebay(e.id)} target="_blank" rel="noopener noreferrer">
                  <Image src={ebay(e.id)} alt={e.alt} width={dims(ebay(e.id))[0]} height={dims(ebay(e.id))[1]} sizes="(min-width: 760px) 25vw, 50vw" />
                </a>
              ))}
            </div>
          </details>
        </section>

        <section id="faq" className={s.section}>
          <h2 className={s.h2}>Straight answers</h2>
          <div className={s.faq}>
            {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </section>

        <section id="buy" className={s.buySection}>
          <span id="offer" className={s.anchor} /><span id="ask" className={s.anchor} />
          <div className={s.buyHead}>
            <h2 className={s.h2}>{usd(CAR.price)}. Paid off. Ready to go.</h2>
            <p className={s.lede}>Buy it outright, send a number, or ask anything. Every submission goes straight to Mike.</p>
          </div>
          <BuyPanel price={CAR.price} deposit={deposit} />
        </section>
      </main>

      <footer className={s.footer}>
        <p>Private sale by Mike Mento, Pittsburgh PA. Sold as-is with every receipt, both dyno sheets and the TPG service history. Questions: <a href="mailto:mike@rocketopp.com">mike@rocketopp.com</a></p>
        <p><a href={PDF_PATH} download>Download the full listing (PDF)</a></p>
      </footer>

      <StickyBar priceLabel={usd(CAR.price)} />
    </div>
  )
}
