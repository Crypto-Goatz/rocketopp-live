import type { Metadata } from 'next'
import { Sparkles, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { withCro9Meta } from '@/lib/cro9-meta'
import { Cro9Block } from '@/lib/cro9-blocks'

/*
  CRO9 writes this page's metadata and its FAQ region. Both are PULLED at
  render, so without a revalidate window this statically-generated page would
  bake whatever was true at deploy and never pick either up again — which is
  exactly what happened on 2026-09-19: CRO9 stored a new title, reported
  verified:false, and the live page kept the old one because it had not been
  rebuilt. The inner fetch's own revalidate cannot help; the PAGE has to
  re-render for generateMetadata to run at all.
*/
export const revalidate = 3600
const metadataBase = {
  title: "Free AI Business Assessment",
  description: "Get a comprehensive AI-powered assessment of your business growth opportunities.",
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/ai-assessment', metadataBase)
}

export default async function AiAssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-20 w-20 text-primary animate-pulse" />
              <Rocket className="h-10 w-10 text-primary absolute -bottom-2 -right-2 animate-bounce" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-500 to-primary">
            Free AI Business Assessment
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            Tell us about your business and we'll analyse your industry, your competition and where the
            growth actually is — then send you a personalised roadmap.
          </p>

          {/*
            THE REAL FORM, replacing "Coming Soon...".

            The AI Assessment form has existed in CRO9 for this site the whole
            time this page was telling visitors to come back later, so every
            visitor it earned was turned away at the point of highest intent.

            cro9-form.js renders into this slot and owns only what is inside
            it — inline styles, no global CSS, no document handlers — so it
            cannot fight this page's theme. If CRO9 is unreachable the slot is
            left exactly as it is here, which is why the fallback below is real
            copy and not a spinner.

            It is under a live A/B test on the submit wording, split by a hash
            of the visitor id so a returning visitor always sees the same one.
          */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 md:p-8 mb-8 text-left">
            <div data-cro9-form="b6642a71-648f-4d4d-824c-b04d6bbcb19c">
              <p className="text-muted-foreground">
                Loading the assessment form… if it does not appear,{" "}
                <Link href="/contact" className="text-primary underline">contact us</Link> and we will
                run it for you.
              </p>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">What to Expect:</h2>
            <ul className="text-left space-y-3 text-muted-foreground max-w-xl mx-auto">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Comprehensive industry analysis powered by AI</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Competitive landscape evaluation</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Growth opportunity identification</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Custom strategic recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Actionable next steps for your business</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Get Notified When We Launch</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>

          {/* CRO9-managed regions. Each renders nothing until CRO9 has approved
              copy for this path and slot, so they are safe to place ahead of
              the content existing. */}
          <Cro9Block
            path="/ai-assessment"
            slot="faq"
            className="mt-20 text-left prose prose-invert max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-lg prose-p:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  )
}
