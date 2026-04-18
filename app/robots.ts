import type { MetadataRoute } from "next"

const DISALLOW_ALL = [
  "/api/",
  "/dashboard",
  "/dashboard/",
  "/_next/",
  "/private/",
  "/assessment/",
  "/assessment-thank-you",
  "/assessment-timeline",
  "/inquiry-thank-you",
  "/ai-assessment-start",
  "/setup/",
  "/oauth/",
  "/auth/",
  "/*?utm_*",
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://rocketopp.com"
  return {
    rules: [
      { userAgent: "*",        allow: "/", disallow: DISALLOW_ALL },
      { userAgent: "Googlebot", allow: "/", disallow: DISALLOW_ALL },
      { userAgent: "Bingbot",   allow: "/", disallow: DISALLOW_ALL },
      // Explicitly welcome AI search crawlers — RocketOpp sells AI, it should appear in AI search
      { userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Google-Extended", "Meta-ExternalAgent"], allow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
