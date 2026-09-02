// Analytics API Clients for GA4, Search Console, and SERP API

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

// Date range helpers
export function getDateRange(range: string = '7d') {
  const endDate = new Date()
  const startDate = new Date()

  switch (range) {
    case '30d':
      startDate.setDate(startDate.getDate() - 30)
      break
    case '90d':
      startDate.setDate(startDate.getDate() - 90)
      break
    case '7d':
    default:
      startDate.setDate(startDate.getDate() - 7)
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  }
}

// ===========================================
// Ranking client — Search Console, not SerpAPI
// ===========================================
//
// This was a SECOND, independent SerpAPI client. lib/serp.ts wrapped the same
// vendor for the tracker, and this one wrapped it again for the analytics
// report — two implementations of one question, which is how they came to
// disagree about what "position" meant (this one looked at the top 100 and
// returned null below that; the tracker recorded whatever SerpAPI gave it).
//
// Both are gone. One source now: Search Console, which reports the position
// Google actually served rather than one scrape from one location, and costs
// nothing.
//
// The method names are unchanged so both callers keep working without edits.
import { ranksForDomain } from '@/lib/gsc-rank'

export const serpApi = {
  async checkRanking(keyword: string, domain: string = 'rocketopp.com') {
    const { byQuery, error } = await ranksForDomain(domain)
    if (error) {
      // The platform's own words. A swallowed error here is how the old client
      // returned null for "no credentials" and "you rank nowhere" alike.
      console.error(`[ranking] search console read failed for ${domain}: ${error}`)
      return null
    }
    const snap = byQuery.get(keyword.toLowerCase().trim())
    if (!snap) return null      // absent from GSC — NOT "position 101"
    return {
      keyword,
      domain,
      position: snap.position,
      url: snap.url,
      impressions: snap.impressions,
      clicks: snap.clicks,
      source: 'search-console' as const,
    }
  },

  /*
    One call for the whole set, where the old one slept a full second between
    every keyword. Twenty keywords cost twenty seconds and twenty paid requests;
    now they cost one request and no delay, because GSC returns every query for
    a property at once.
  */
  async checkMultipleKeywords(keywords: string[], domain: string = 'rocketopp.com') {
    const { byQuery, error } = await ranksForDomain(domain)
    if (error) {
      console.error(`[ranking] search console read failed for ${domain}: ${error}`)
      return []
    }
    return keywords
      .map((k) => {
        const snap = byQuery.get(k.toLowerCase().trim())
        return snap
          ? { keyword: k, domain, position: snap.position, url: snap.url,
              impressions: snap.impressions, clicks: snap.clicks, source: 'search-console' as const }
          : null
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
  },
}

// ===========================================
// Google Analytics 4 Data API (Mock/Simplified)
// Note: Full implementation requires Google API client library
// ===========================================
export const ga4Api = {
  // For full GA4 API, you'd need @google-analytics/data package
  // This provides a simplified fetch-based approach

  async getMetrics(range: string = '7d') {
    const { startDate, endDate } = getDateRange(range)

    // Note: This requires a service account or OAuth token
    // For now, return mock data structure that matches GA4 API response
    // To implement fully, install: npm install @google-analytics/data

    if (!GA4_PROPERTY_ID || GA4_PROPERTY_ID === 'YOUR_GA4_PROPERTY_ID') {
      console.warn('GA4_PROPERTY_ID not configured - returning demo data')
      return this.getDemoData(range)
    }

    // TODO: Implement actual GA4 Data API call
    // This requires setting up a service account in Google Cloud Console
    // and granting it access to the GA4 property

    return this.getDemoData(range)
  },

  getDemoData(range: string) {
    // Demo data for development/testing
    const multiplier = range === '30d' ? 4 : range === '90d' ? 12 : 1

    return {
      overview: {
        sessions: Math.floor(1250 * multiplier * (0.9 + Math.random() * 0.2)),
        users: Math.floor(980 * multiplier * (0.9 + Math.random() * 0.2)),
        pageviews: Math.floor(3420 * multiplier * (0.9 + Math.random() * 0.2)),
        bounceRate: 42.5 + (Math.random() * 10 - 5),
        avgSessionDuration: 185 + Math.floor(Math.random() * 60),
        newUsers: Math.floor(720 * multiplier * (0.9 + Math.random() * 0.2)),
      },
      trafficSources: [
        { source: 'Organic Search', sessions: Math.floor(520 * multiplier), percentage: 41.6 },
        { source: 'Direct', sessions: Math.floor(380 * multiplier), percentage: 30.4 },
        { source: 'Referral', sessions: Math.floor(210 * multiplier), percentage: 16.8 },
        { source: 'Social', sessions: Math.floor(95 * multiplier), percentage: 7.6 },
        { source: 'Email', sessions: Math.floor(45 * multiplier), percentage: 3.6 },
      ],
      topPages: [
        { path: '/', title: 'Home', pageviews: Math.floor(890 * multiplier), avgTime: 145, bounceRate: 38.2 },
        { path: '/services', title: 'Services', pageviews: Math.floor(456 * multiplier), avgTime: 210, bounceRate: 35.1 },
        { path: '/marketplace', title: 'Marketplace', pageviews: Math.floor(342 * multiplier), avgTime: 185, bounceRate: 42.5 },
        { path: '/contact', title: 'Contact', pageviews: Math.floor(234 * multiplier), avgTime: 120, bounceRate: 28.4 },
        { path: '/blog', title: 'Blog', pageviews: Math.floor(198 * multiplier), avgTime: 265, bounceRate: 45.2 },
        { path: '/services/ai-applications', title: 'AI Applications', pageviews: Math.floor(167 * multiplier), avgTime: 198, bounceRate: 39.8 },
        { path: '/services/website-development', title: 'Web Development', pageviews: Math.floor(145 * multiplier), avgTime: 175, bounceRate: 41.2 },
        { path: '/about', title: 'About', pageviews: Math.floor(132 * multiplier), avgTime: 95, bounceRate: 52.1 },
        { path: '/login', title: 'Login', pageviews: Math.floor(98 * multiplier), avgTime: 45, bounceRate: 65.3 },
        { path: '/register', title: 'Register', pageviews: Math.floor(76 * multiplier), avgTime: 85, bounceRate: 48.7 },
      ],
      devices: [
        { device: 'Desktop', sessions: Math.floor(625 * multiplier), percentage: 50 },
        { device: 'Mobile', sessions: Math.floor(500 * multiplier), percentage: 40 },
        { device: 'Tablet', sessions: Math.floor(125 * multiplier), percentage: 10 },
      ],
      countries: [
        { country: 'United States', sessions: Math.floor(687 * multiplier), percentage: 55 },
        { country: 'United Kingdom', sessions: Math.floor(187 * multiplier), percentage: 15 },
        { country: 'Canada', sessions: Math.floor(125 * multiplier), percentage: 10 },
        { country: 'Australia', sessions: Math.floor(100 * multiplier), percentage: 8 },
        { country: 'Germany', sessions: Math.floor(75 * multiplier), percentage: 6 },
      ],
      dailyTrend: this.generateDailyTrend(range),
    }
  },

  generateDailyTrend(range: string) {
    const days = range === '30d' ? 30 : range === '90d' ? 90 : 7
    const trend = []
    const baseValue = 150

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Add some variance with weekend dips
      const dayOfWeek = date.getDay()
      const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1

      trend.push({
        date: date.toISOString().split('T')[0],
        sessions: Math.floor(baseValue * weekendMultiplier * (0.8 + Math.random() * 0.4)),
        pageviews: Math.floor(baseValue * 2.5 * weekendMultiplier * (0.8 + Math.random() * 0.4)),
        users: Math.floor(baseValue * 0.85 * weekendMultiplier * (0.8 + Math.random() * 0.4)),
      })
    }

    return trend
  },
}

// ===========================================
// Google Search Console API (Mock/Simplified)
// ===========================================
export const searchConsoleApi = {
  async getSearchAnalytics(range: string = '7d', type: string = 'queries') {
    const { startDate, endDate } = getDateRange(range)

    // Note: Full implementation requires Google Search Console API
    // and OAuth authentication with search console scope

    console.warn('Search Console API - returning demo data')
    return this.getDemoData(range, type)
  },

  getDemoData(range: string, type: string) {
    const multiplier = range === '30d' ? 4 : range === '90d' ? 12 : 1

    const baseData = {
      overview: {
        totalClicks: Math.floor(856 * multiplier * (0.9 + Math.random() * 0.2)),
        totalImpressions: Math.floor(12450 * multiplier * (0.9 + Math.random() * 0.2)),
        averageCtr: 6.8 + (Math.random() * 2 - 1),
        averagePosition: 18.5 + (Math.random() * 5 - 2.5),
      },
      queries: [
        { query: 'ai agency', clicks: Math.floor(89 * multiplier), impressions: Math.floor(1250 * multiplier), ctr: 7.1, position: 8.2 },
        { query: 'digital agency ai', clicks: Math.floor(67 * multiplier), impressions: Math.floor(980 * multiplier), ctr: 6.8, position: 12.5 },
        { query: 'rocketopp', clicks: Math.floor(156 * multiplier), impressions: Math.floor(420 * multiplier), ctr: 37.1, position: 1.2 },
        { query: 'ai web development', clicks: Math.floor(45 * multiplier), impressions: Math.floor(890 * multiplier), ctr: 5.1, position: 15.8 },
        { query: 'custom ai applications', clicks: Math.floor(34 * multiplier), impressions: Math.floor(650 * multiplier), ctr: 5.2, position: 18.2 },
        { query: 'sop automation', clicks: Math.floor(28 * multiplier), impressions: Math.floor(520 * multiplier), ctr: 5.4, position: 14.5 },
        { query: 'ai marketing agency', clicks: Math.floor(42 * multiplier), impressions: Math.floor(780 * multiplier), ctr: 5.4, position: 22.1 },
        { query: 'website development agency', clicks: Math.floor(38 * multiplier), impressions: Math.floor(1120 * multiplier), ctr: 3.4, position: 28.5 },
        { query: 'crm ai tools', clicks: Math.floor(29 * multiplier), impressions: Math.floor(450 * multiplier), ctr: 6.4, position: 16.8 },
        { query: 'ai business solutions', clicks: Math.floor(25 * multiplier), impressions: Math.floor(680 * multiplier), ctr: 3.7, position: 24.2 },
      ],
      pages: [
        { page: 'https://rocketopp.com/', clicks: Math.floor(312 * multiplier), impressions: Math.floor(4500 * multiplier), ctr: 6.9, position: 12.5 },
        { page: 'https://rocketopp.com/services/ai-applications', clicks: Math.floor(145 * multiplier), impressions: Math.floor(2100 * multiplier), ctr: 6.9, position: 15.2 },
        { page: 'https://rocketopp.com/marketplace', clicks: Math.floor(98 * multiplier), impressions: Math.floor(1650 * multiplier), ctr: 5.9, position: 18.8 },
        { page: 'https://rocketopp.com/services/website-development', clicks: Math.floor(87 * multiplier), impressions: Math.floor(1420 * multiplier), ctr: 6.1, position: 16.5 },
        { page: 'https://rocketopp.com/blog', clicks: Math.floor(76 * multiplier), impressions: Math.floor(980 * multiplier), ctr: 7.8, position: 14.2 },
      ],
      devices: [
        { device: 'DESKTOP', clicks: Math.floor(428 * multiplier), impressions: Math.floor(6225 * multiplier), ctr: 6.9, position: 17.5 },
        { device: 'MOBILE', clicks: Math.floor(385 * multiplier), impressions: Math.floor(5600 * multiplier), ctr: 6.9, position: 19.2 },
        { device: 'TABLET', clicks: Math.floor(43 * multiplier), impressions: Math.floor(625 * multiplier), ctr: 6.9, position: 18.8 },
      ],
      countries: [
        { country: 'USA', clicks: Math.floor(471 * multiplier), impressions: Math.floor(6847 * multiplier), ctr: 6.9, position: 17.5 },
        { country: 'GBR', clicks: Math.floor(128 * multiplier), impressions: Math.floor(1867 * multiplier), ctr: 6.9, position: 19.2 },
        { country: 'CAN', clicks: Math.floor(86 * multiplier), impressions: Math.floor(1245 * multiplier), ctr: 6.9, position: 18.8 },
        { country: 'AUS', clicks: Math.floor(68 * multiplier), impressions: Math.floor(996 * multiplier), ctr: 6.8, position: 20.1 },
        { country: 'DEU', clicks: Math.floor(51 * multiplier), impressions: Math.floor(747 * multiplier), ctr: 6.8, position: 21.5 },
      ],
    }

    return baseData
  },
}

// ===========================================
// Combined Report Generator
// ===========================================
export async function generateAnalyticsReport(range: string = '7d') {
  const [ga4Data, searchConsoleData] = await Promise.all([
    ga4Api.getMetrics(range),
    searchConsoleApi.getSearchAnalytics(range),
  ])

  // Default keywords to track
  const targetKeywords = [
    'ai agency',
    'digital agency ai',
    'ai web development',
    'custom ai applications',
    'rocketopp',
  ]

  // Check SERP rankings (rate limited)
  const serpResults = await serpApi.checkMultipleKeywords(targetKeywords)

  return {
    generatedAt: new Date().toISOString(),
    range,
    ga4: ga4Data,
    searchConsole: searchConsoleData,
    serp: serpResults,
    summary: {
      totalSessions: ga4Data.overview.sessions,
      totalUsers: ga4Data.overview.users,
      totalPageviews: ga4Data.overview.pageviews,
      bounceRate: ga4Data.overview.bounceRate,
      totalClicks: searchConsoleData.overview.totalClicks,
      totalImpressions: searchConsoleData.overview.totalImpressions,
      avgCtr: searchConsoleData.overview.averageCtr,
      avgPosition: searchConsoleData.overview.averagePosition,
      topTrafficSource: ga4Data.trafficSources[0]?.source || 'Unknown',
      topSearchQuery: searchConsoleData.queries[0]?.query || 'Unknown',
      keywordsTracked: serpResults.length,
      keywordsRanking: serpResults.filter((r: any) => r.position && r.position <= 100).length,
    },
  }
}
