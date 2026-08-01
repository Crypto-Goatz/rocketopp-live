/**
 * Q&A and definitions for the "AI search vs Google" report.
 *
 * WHY THIS FILE EXISTS — and the rule for editing it:
 *
 * An answer engine quotes a passage, not a page. So every answer below is
 * written to survive being lifted out on its own: it opens with the direct
 * answer in the first sentence, names its figure, and names the publisher and
 * date of that figure inline. No answer depends on the paragraph before it.
 *
 * HARD CONSTRAINT (lib/stats.ts, RULE 1): every number here already appears in
 * lib/report-kpis.ts with a named source and period. Do not add a figure to
 * this file that is not sourced there. If you cannot name the publisher and the
 * period, the sentence does not ship.
 */

export type Faq = { question: string; answer: string }

export const REPORT_FAQS: Faq[] = [
  {
    question: 'Is Google search dying?',
    answer:
      'No — and the claim is easy to disprove, which is why building a strategy on it backfires. Google handles 16.4 billion searches a day, up from 13.7 billion in January 2025 (Demandsage, May 2026). Organic traffic to websites is down only about 2.5% year over year (Graphite, January 2026). Demand did not collapse. What collapsed is the click: 68.01% of US Google searches now end without a click to any website, up from 58.5% in 2024 (SparkToro analysis of Similarweb clickstream, January–April 2026). The searches are still happening. They just end on Google.',
  },
  {
    question: 'What is a zero-click search?',
    answer:
      'A zero-click search is a search that ends without the user clicking through to any website, because the answer appeared on the results page itself — in an AI Overview, a featured snippet, a knowledge panel, or a direct answer box. As of January–April 2026, 68.01% of US Google searches end this way, up from 58.5% in 2024 (SparkToro analysis of Similarweb clickstream). The practical consequence is that ranking and traffic have come apart: you can hold position one and still receive nothing, because the page that used to send the visit now answers the question itself.',
  },
  {
    question: 'How much traffic do you lose when an AI Overview appears?',
    answer:
      'Organic click-through falls roughly 61% when an AI Overview sits above the results — from 1.76% to 0.61% (Seer Interactive, September 2025). Ahrefs measured the effect specifically on position one and found a 34.5% click-through loss across 300,000 keywords (2025). The two figures measure different things — Seer is average CTR across positions, Ahrefs is position one only — so treat them as bracketing the damage rather than contradicting each other. Either way, the loss lands hardest on exactly the rankings that were previously most valuable.',
  },
  {
    question: 'What percentage of Google searches show an AI Overview?',
    answer:
      'About 48% of Google queries now return an AI Overview, a 58% increase year over year (Advanced Web Ranking / Digital Applied, March 2026). Methods that measure US results only put it higher, at 60.32%. The spread between those two numbers is a methodology difference, not a disagreement: AI Overviews appear more often on US English queries than on the worldwide average, so any single figure you see quoted depends entirely on which pool was sampled.',
  },
  {
    question: 'How big is AI search compared to Google?',
    answer:
      'AI prompting accounts for roughly 28% of search volume worldwide and about 12% in the US, counting only prompts classified as search-like (Graphite, March 2026). That makes AI meaningfully large as a place where questions get asked. It is not yet large as a place that sends visits: AI referrals are 1.08% of all website traffic against 25% from organic search (Conductor, 2026), a Google-to-ChatGPT referral ratio of roughly 190 to 1. The gap between those two facts is the whole story — people are asking AI, and AI is mostly answering without passing anyone along.',
  },
  {
    question: 'Is AI traffic actually worth anything if it is only 1% of visits?',
    answer:
      'Yes, because it converts at a completely different rate. Ahrefs found AI visitors converting up to 23 times better than organic ones — 0.5% of visitors producing 12.1% of signups (2025). Semrush measured a more conservative 4.4x. Similarweb measured 11.4% versus 5.3% on ecommerce. The mechanism is intuitive: someone arriving from an AI answer has already had their question answered and their options narrowed, so they land much closer to a decision than someone still browsing ten blue links.',
  },
  {
    question: 'Are AI engines citing sources more often over time?',
    answer:
      'Sharply more often. ChatGPT showed links in 6.8% of answers as of May 2026, up from 1.6% in June 2025 — a 4.25x increase in a single year (Similarweb). This is the number that decides whether AI referral traffic stays a rounding error or becomes a channel. Referrals are a product of prompt volume times citation rate, and prompt volume is already large, so the citation rate is the variable doing the work. It is rising fast, and the traffic accrues to whoever is already being cited when it does.',
  },
  {
    question: 'Which AI platforms actually send traffic?',
    answer:
      'ChatGPT still dominates but its share is falling: it dropped from 72.5% to 62.6% of AI referrals in four months, while Claude climbed from 11.8% to 18.5% over the same period. Generative AI properties collectively draw about 9.5 billion monthly web visits worldwide from 655 million unique visitors, up 70% and 57% year over year respectively (Similarweb, averaged June 2025 – May 2026). The practical read: optimising for one engine is a bet on a share that is visibly moving, so track citations across all of them.',
  },
  {
    question: 'What is answer engine optimization (AEO)?',
    answer:
      'Answer engine optimization is the practice of structuring content so an AI engine can extract, trust, and cite it as the source of an answer, rather than so a search engine can rank it in a list. The tactics diverge from classic SEO in a specific way: AEO rewards a direct answer in the opening sentence, explicit question-shaped headings, comparison tables, definitions stated plainly, and named sources with dates. It matters now because 68.01% of searches end without a click (SparkToro, January–April 2026) — being the cited source is what replaces being the clicked result.',
  },
  {
    question: 'What is the difference between AEO, GEO, and SEO?',
    answer:
      'SEO optimises to rank in a list of links. AEO (answer engine optimization) optimises to be the source an AI answer cites. GEO (generative engine optimization) is a near-synonym for AEO, used more often when the emphasis is on generated summaries specifically. In practice the three overlap heavily — the same crawlable, well-structured, factually sourced page tends to do well at all of them — and the meaningful split is not between the acronyms but between optimising for a click and optimising for a citation. With click-free searches at 68.01% (SparkToro, January–April 2026), the second is where the growth is.',
  },
  {
    question: 'Does blocking AI crawlers protect your content?',
    answer:
      'It prevents you from being cited, which is the opposite of protection in a market where citation is the traffic. An engine cannot quote a page it cannot read, so a blocked site is invisible in exactly the surface that is growing — ChatGPT citation rates went from 1.6% to 6.8% in a year (Similarweb, May 2026). Many sites block AI crawlers by accident rather than by decision, through a default robots.txt rule or a hosting provider toggle they never opened. Checking that specific setting is among the cheapest competitive moves available, precisely because so many competitors have not.',
  },
  {
    question: 'Why is my traffic down when my rankings have not moved?',
    answer:
      'Because rankings and traffic decoupled. An AI Overview above your result cuts organic click-through by about 61%, from 1.76% to 0.61% (Seer Interactive, September 2025), and those Overviews now appear on roughly 48% of queries (Advanced Web Ranking / Digital Applied, March 2026). Your position report can be completely unchanged while the clicks attached to that position are gone. If your rank tracker looks healthy and analytics does not, this is almost always the explanation — and it is why impressions-versus-clicks in Search Console is now the more honest pair of numbers to watch.',
  },
  {
    question: 'Can you track traffic coming from AI engines?',
    answer:
      'Partially, and only if you set it up in advance. AI platforms do not append utm_source parameters, so AI visits arrive as referrals or as direct traffic and have to be identified by referrer host rather than campaign tagging. The harder constraint is that none of it is backfillable: analytics cannot reconstruct visits it never collected, so a site that installs measurement later has no history of the period it most wants to understand. Given AI referrals currently sit at 1.08% of traffic and are growing (Conductor, 2026), the cost of waiting is losing the baseline you would measure growth against.',
  },
  {
    question: 'What should a business actually change in response to this?',
    answer:
      'Five things, in order of payoff. First, allowlist AI crawlers — you cannot be cited by an engine that cannot read you. Second, restructure key pages to answer their question in the first sentence, since that is the passage an engine lifts. Third, add FAQ and comparison structure, because question-shaped and table-shaped content is disproportionately quoted. Fourth, track citations across every engine rather than ChatGPT alone, as ChatGPT fell from 72.5% to 62.6% of AI referrals in four months. Fifth, install analytics now — AI referral data is not backfillable.',
  },
  {
    question: 'Is it too late to start optimising for AI search?',
    answer:
      'No, and the arbitrage is unusually wide right now. AI is roughly 28% the size of search by prompt volume (Graphite, March 2026) while sending 1.08% of traffic (Conductor, 2026) — a gap that exists only because citation rates are still low. Those rates are climbing quickly, from 1.6% to 6.8% at ChatGPT in one year (Similarweb, May 2026), and when they climb the traffic flows to pages that are already cited. Being early to this is cheaper than being early to Google ever was, because most competitors have not yet noticed that ranking and being quoted are now different jobs.',
  },
  {
    question: 'How is SXO different from SEO?',
    answer:
      'SXO (search experience optimization) treats search visibility, page experience, conversion, and AI-engine readability as one problem rather than four. Classic SEO optimised for a ranking and handed off; SXO optimises for the whole path from question to outcome, which now includes surfaces where there is no click at all. The reason for combining them is arithmetic: if 68.01% of searches end click-free (SparkToro, January–April 2026) and click-through drops 61% where an AI Overview appears (Seer Interactive, September 2025), then work that improves ranking alone is optimising a shrinking fraction of the journey.',
  },
]

/** Plain definitions — the shape an engine can lift verbatim into an answer. */
export const REPORT_TERMS: { term: string; definition: string }[] = [
  {
    term: 'Zero-click search',
    definition:
      'A search that ends without a click to any website because the answer appeared on the results page itself. 68.01% of US Google searches, January–April 2026 (SparkToro analysis of Similarweb clickstream).',
  },
  {
    term: 'AI Overview',
    definition:
      'A Google-generated summary placed above the organic results. Present on roughly 48% of queries as of March 2026 (Advanced Web Ranking / Digital Applied), and associated with a 61% drop in organic click-through (Seer Interactive, September 2025).',
  },
  {
    term: 'AEO (Answer Engine Optimization)',
    definition:
      'Structuring content so an AI engine can extract, trust, and cite it as the source of an answer, rather than so a search engine can rank it in a list of links.',
  },
  {
    term: 'GEO (Generative Engine Optimization)',
    definition:
      'A near-synonym for AEO, used where the emphasis is on generated summaries specifically. In practice the same crawlable, well-sourced, clearly structured page serves both.',
  },
  {
    term: 'Citation rate',
    definition:
      'The share of AI answers that display a link to a source. ChatGPT reached 6.8% in May 2026, up from 1.6% in June 2025 (Similarweb) — the variable that converts prompt volume into referral traffic.',
  },
  {
    term: 'SXO (Search Experience Optimization)',
    definition:
      'Treating search visibility, page experience, conversion, and AI-engine readability as a single optimisation problem rather than four separate ones.',
  },
]
