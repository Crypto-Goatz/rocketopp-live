import type { Metadata } from 'next'

import OfferClient from './OfferClient'
import { INCLUDED, OFFER_PRICE, OFFER_PRICE_DISPLAY } from '@/lib/offer'
import { breadcrumbSchema, faqSchema, localBusinessSchema } from '@/lib/local/schema'

const SITE = 'https://rocketopp.com'

// Root layout applies "%s | RocketOpp" — do not append the brand here.
const TITLE = `${OFFER_PRICE_DISPLAY} Website Offer — Built For You, Yours To Edit`
const DESCRIPTION = `A complete website designed and built for your business for ${OFFER_PRICE_DISPLAY}, then handed over so you can edit and revise it yourself. Serving Greensburg, Murrysville, Monroeville and the surrounding Western PA area. New offer opens every Monday.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}/497-website` },
  openGraph: {
    title: `${TITLE} | RocketOpp`,
    description: DESCRIPTION,
    url: `${SITE}/497-website`,
    type: 'website',
  },
}

const FAQS = [
  {
    q: `What exactly do I get for ${OFFER_PRICE_DISPLAY}?`,
    a: `${INCLUDED.join('. ')}.`,
  },
  {
    q: `Is ${OFFER_PRICE_DISPLAY} the total price, or a deposit?`,
    a: `For a standard business website it is the total. We confirm the scope with you before anyone pays anything — if what you need genuinely goes beyond it (e-commerce, memberships, booking systems, custom applications), we will tell you what that would actually cost instead of taking the ${OFFER_PRICE_DISPLAY} and adding fees later.`,
  },
  {
    q: 'How do I make changes to my website after it is built?',
    a: 'You ask for them in plain English. Type something like "change the phone number on the contact page" or "add a new service called In-Home Consults and write the content for it", and our patent-pending technology makes the change on your live site — usually within the hour. Every request runs through automated code checks and a human review before it ships, so the site still works afterwards. There is no dashboard to learn, no support ticket, and no fee per change.',
  },
  {
    q: 'Can I edit the website myself afterwards?',
    a: 'Yes, and that is the point. The site is built on web0n, RocketOpp\'s own AI website platform, and it is handed over to you to edit and revise whenever you want. There are no change-request fees and no waiting on us to update a phone number or add a service.',
  },
  {
    q: `How can a website cost ${OFFER_PRICE_DISPLAY} when agencies charge thousands?`,
    a: 'Because RocketOpp builds the platform it uses. web0n is our own software, so there is no licence to pay, and the AI handles layout, first-draft copy, structure and schema — the parts that used to consume most of the hours. What we still do by hand is the judgement: deciding what your site should say, what to leave out, and how people in your area actually find you.',
  },
  {
    q: 'Why does the offer expire every Friday?',
    a: 'We only take on a limited number of these each week so each one gets real attention. The current week closes Friday at midnight Eastern and a new one opens Monday morning. If you apply over the weekend you are simply first in line when it reopens — nothing is lost.',
  },
  {
    q: 'Do I have to get on a sales call?',
    a: 'No. Fill in the form and you will get a straight answer by email. If you would rather talk, call (878) 888-1230 — but it is not a requirement, and there is no pitch meeting before you can find out whether this works for you.',
  },
]

export default function OfferPage() {
  const jsonLd = [
    localBusinessSchema(),
    faqSchema(FAQS),
    breadcrumbSchema([{ name: `${OFFER_PRICE_DISPLAY} Website Offer`, path: '/497-website' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${OFFER_PRICE_DISPLAY} Website`,
      serviceType: 'Web design and development',
      description: DESCRIPTION,
      provider: { '@id': `${SITE}/#business` },
      url: `${SITE}/497-website`,
      offers: {
        '@type': 'Offer',
        price: String(OFFER_PRICE),
        priceCurrency: 'USD',
        availability: 'https://schema.org/LimitedAvailability',
        url: `${SITE}/497-website`,
      },
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OfferClient />
    </main>
  )
}
