import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { AnalyticsProvider } from "@/components/analytics/analytics-provider"
import { CookieConsent } from "@/components/cookie-consent"

const inter = Inter({ subsets: ["latin"] })

// Analytics IDs from environment variables
const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

export const metadata: Metadata = {
  title: {
    default: "RocketOpp - We Build Tools That Work While You Sleep",
    template: "%s | RocketOpp"
  },
  description:
    "RocketOpp builds AI-powered automation tools for businesses. Rocket+, MCPFED, and more. Describe what you want. Watch it happen.",
  keywords:
    "RocketOpp, business automation, AI tools, Rocket+, MCPFED, CRM automation, workflow automation, AI agents, business software, MCP server, Model Context Protocol",
  authors: [{ name: "RocketOpp", url: "https://rocketopp.com" }],
  creator: "RocketOpp",
  publisher: "RocketOpp",
  metadataBase: new URL("https://rocketopp.com"),
  alternates: {
    canonical: "https://rocketopp.com",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-dark-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rocketopp.com",
    title: "RocketOpp - We Build Tools That Work While You Sleep",
    description:
      "Business automation tools that actually work. Describe what you want. Watch it happen.",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/images/rocketopp-og.png",
        width: 1200,
        height: 630,
        alt: "RocketOpp - AI-Powered Business Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RocketOpp - We Build Tools That Work While You Sleep",
    description: "Business automation tools that actually work. Describe what you want. Watch it happen.",
    site: "@rocketopp",
    creator: "@rocketopp",
    images: [
      {
        url: "https://rocketopp.com/images/rocketopp-twitter.png",
        width: 1200,
        height: 600,
        alt: "RocketOpp - AI-Powered Business Automation",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "Technology",
  classification: "Business Software",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RocketOpp",
  url: "https://rocketopp.com",
  logo: "https://rocketopp.com/images/rocketopp-logo.png",
  description: "We build AI-powered automation tools for businesses. Describe what you want. Watch it happen.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+1-878-888-1230",
      contactType: "Customer Service",
      contactOption: "TollFree",
      areaServed: "US",
      availableLanguage: ["English"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
      description: "Jessica - AI Assistant available 24/7 for appointments, questions, and project inquiries",
    },
    {
      "@type": "ContactPoint",
      email: "Mike@rocketopp.com",
      contactType: "Sales",
      availableLanguage: ["English"],
    },
  ],
  sameAs: ["https://twitter.com/rocketopp", "https://linkedin.com/company/rocketopp", "https://github.com/rocketopp"],
  areaServed: "Worldwide",
  knowsAbout: [
    "Business Automation",
    "AI Tools",
    "CRM Systems",
    "Workflow Automation",
    "AI Agents",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange>
          <Suspense fallback={null}>
            <AnalyticsProvider
              ga4Id={GA4_ID}
              gtmId={GTM_ID}
              fbPixelId={FB_PIXEL_ID}
              clarityId={CLARITY_ID}
            >
              <LayoutWrapper>{children}</LayoutWrapper>
              <CookieConsent />
            </AnalyticsProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
