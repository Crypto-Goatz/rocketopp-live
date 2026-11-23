import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FreeWebsiteLanding } from "@/components/free-website/free-website-landing"
import { TRADES, tradeBySlug } from "@/lib/free-website/trades"

/** /free-website/<trade> — the offer said in one trade's words, so "website for plumbers" lands on a page about plumbers. */
export const dynamicParams = false
export const generateStaticParams = () => TRADES.map((t) => ({ trade: t.slug }))

export async function generateMetadata({ params }: { params: Promise<{ trade: string }> }): Promise<Metadata> {
  const t = tradeBySlug((await params).trade)
  if (!t) return {}
  const url = `https://rocketopp.com/free-website/${t.slug}`
  const title = `Custom Website for ${t.name === "HVAC" ? "HVAC Companies" : t.name.replace(/^(.)/, (c) => c.toUpperCase())} | RocketOpp`
  const description = `A custom website for your ${t.business}, not a template. Year-end pricing through December 31 — fill out your details to reveal the price. Includes a free CRM for your customers and leads.`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, siteName: "RocketOpp", images: [{ url: "https://rocketopp.com/images/rocketopp-og.png", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function TradePage({ params }: { params: Promise<{ trade: string }> }) {
  const t = tradeBySlug((await params).trade)
  if (!t) notFound()
  return <FreeWebsiteLanding trade={t} />
}
