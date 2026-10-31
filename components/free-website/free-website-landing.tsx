import Link from "next/link"
import { ArrowRight, Check, MessageSquare, ClipboardCheck, Rocket, Phone, CalendarCheck, Users } from "lucide-react"
import Footer from "@/components/footer"
import { FAQSchema } from "@/components/seo/json-ld"
import { ContactForm } from "@/app/contact/contact-form"

/**
 * THE FREE WEBSITE OFFER (Mike, 2026-10-31) — the page rocketopp.com now leads with:
 *   "For a free website, all they need to do is contact us for a free consultation. We will assess their situation and goals and
 *    make a determination if they are a good fit for us. If we take on the project they will receive a free website for their
 *    business. No purchase is necessary for the website, we will simply provide a lead management tool that allows the user to
 *    manage their contacts and appointments for $49 per month moving forward… that's it. Nothing more."
 *
 * Built to be fast: a server component, no video, no animation library, one client island (the form). The $49/mo lead tool is
 * the ONLY price on the page, and the only one the marketing site states. Served at "/" and "/free-website".
 */
export const FREE_WEBSITE_FAQ = [
  { question: "Is the website really free?", answer: "Yes. If we take on your project, we build your website at no cost. No purchase is necessary for the website." },
  { question: "So what does it cost?", answer: "Only the lead management tool: $49 per month. It keeps your contacts and your appointments in one place, so every call, form and booking from your new website lands somewhere you can act on it. That's it — nothing more." },
  { question: "How do you decide who's a good fit?", answer: "We start with a free consultation. We look at where your business is today and where you want it to go. If we believe a website from us will genuinely help you grow, we take the project on." },
  { question: "Who is this for?", answer: "Small businesses getting off the ground, especially in the service industry — the trades, home services, personal services and local shops that run on calls and appointments." },
  { question: "What do I need to do to start?", answer: "Request a free consultation with the form on this page, or call us. That's the whole first step." },
]

const STEPS = [
  { icon: MessageSquare, title: "Free consultation", body: "Tell us about your business. We talk through where you are today, who your customers are and what you want the next year to look like." },
  { icon: ClipboardCheck, title: "We assess the fit", body: "We look honestly at your situation and goals. If a website from us will make a real difference, we take the project on." },
  { icon: Rocket, title: "Your free website", body: "We build your business a professional website — at no cost, no purchase necessary." },
]

const GETS = [
  "A professional website built for your business",
  "Fast and easy to use on a phone, where your customers are",
  "Set up so people can call you or book with you in one tap",
  "Built so customers can find you on Google",
]

const TRADES = ["Plumbing", "HVAC", "Electrical", "Roofing", "Landscaping", "Cleaning", "Contractors", "Auto repair", "Salons & spas", "Pet care", "Movers", "Pest control"]

export function FreeWebsiteLanding() {
  return (
    <>
      <FAQSchema items={FREE_WEBSITE_FAQ} />
      <main className="min-h-screen">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,53,0.18),transparent_60%)]" aria-hidden />
          <div className="container relative px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                For small service businesses
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                A free website<br className="hidden sm:block" /> for your business.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                No purchase necessary. Book a free consultation, we&rsquo;ll look at where your business is and where you want it to go —
                and if we&rsquo;re a good fit, we build your website for free.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="#consultation" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-red-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/40">
                  Book my free consultation <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a href="tel:+18788881230" className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-4 font-medium text-foreground transition-colors hover:border-primary/50">
                  <Phone className="mr-2 h-4 w-4" /> (878) 888-1230
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="border-y border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">How it works</h2>
            <ol className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-border bg-card/50 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></span>
                    <span className="text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── WHAT YOU GET + THE ONE COST ── */}
        <section className="py-16 md:py-24">
          <div className="container grid max-w-6xl gap-8 px-4 md:grid-cols-2 md:px-6">
            <div className="rounded-2xl border border-border bg-card/50 p-8">
              <h2 className="text-2xl font-bold">Your website — free</h2>
              <ul className="mt-6 space-y-3">
                {GETS.map((g) => (
                  <li key={g} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 flex-none text-primary" /><span>{g}</span></li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">No purchase necessary for the website.</p>
            </div>
            <div className="rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/10 to-transparent p-8">
              <h2 className="text-2xl font-bold">The only cost</h2>
              <p className="mt-4 text-5xl font-bold tracking-tight">$49<span className="text-xl font-medium text-muted-foreground">/month</span></p>
              <p className="mt-2 font-medium">Lead management tool</p>
              <ul className="mt-6 space-y-3">
                <li className="flex gap-3"><Users className="mt-0.5 h-5 w-5 flex-none text-primary" /><span>Manage your contacts — every call, form and customer in one place</span></li>
                <li className="flex gap-3"><CalendarCheck className="mt-0.5 h-5 w-5 flex-none text-primary" /><span>Manage your appointments</span></li>
              </ul>
              <p className="mt-6 text-muted-foreground">That&rsquo;s it. Nothing more.</p>
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ── */}
        <section className="border-y border-border py-16 md:py-20">
          <div className="container max-w-4xl px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Built for the service industry</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We want to help small businesses get off the ground — especially the ones that run on calls and appointments.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {TRADES.map((t) => <li key={t} className="rounded-full border border-border px-4 py-1.5 text-sm">{t}</li>)}
            </ul>
          </div>
        </section>

        {/* ── THE CONSULTATION ── */}
        <section id="consultation" className="scroll-mt-24 py-16 md:py-24">
          <div className="container grid max-w-6xl gap-10 px-4 md:grid-cols-[0.9fr_1.1fr] md:px-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Start with a free consultation</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Fill this in and we&rsquo;ll be in touch to set up your consultation. Prefer to talk? Call{" "}
                <a href="tel:+18788881230" className="font-medium text-foreground hover:text-primary">(878) 888-1230</a>.
              </p>
              <dl className="mt-10 space-y-6">
                {FREE_WEBSITE_FAQ.map((f) => (
                  <div key={f.question}>
                    <dt className="font-semibold">{f.question}</dt>
                    <dd className="mt-1 leading-relaxed text-muted-foreground">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ContactForm form="free_website" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
