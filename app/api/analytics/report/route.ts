import { NextRequest, NextResponse } from 'next/server'
import { generateAnalyticsReport } from '@/lib/analytics/clients'
import { supabaseAdmin } from '@/lib/db/supabase'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const range = url.searchParams.get('range') || '7d'
  const skipSerp = url.searchParams.get('skipSerp') === 'true'

  try {
    const report = await generateAnalyticsReport(range)

    // Optionally save to database for historical tracking
    const saveReport = url.searchParams.get('save') === 'true'
    if (saveReport) {
      await supabaseAdmin.from('analytics_reports').insert({
        report_date: new Date().toISOString().split('T')[0],
        range,
        data: report,
      })
    }

    return NextResponse.json({
      success: true,
      report,
    })
  } catch (error: any) {
    console.error('Analytics report error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Generate markdown report for Claude
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { range = '7d', format = 'markdown' } = body

    const report = await generateAnalyticsReport(range)

    if (format === 'markdown') {
      const markdown = generateMarkdownReport(report)
      return NextResponse.json({
        success: true,
        markdown,
        report,
      })
    }

    return NextResponse.json({
      success: true,
      report,
    })
  } catch (error: any) {
    console.error('Analytics report error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

function generateMarkdownReport(report: any): string {
  const { ga4, searchConsole, serp, summary, generatedAt, range } = report

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num))
  }

  const formatPercent = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  const rangeLabel = range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'

  let md = `# Daily Analytics Report

**Generated:** ${new Date(generatedAt).toLocaleString()}
**Period:** ${rangeLabel}
**Domain:** rocketopp.com

---

## Traffic Overview

| Metric | Value |
|--------|-------|
| **Sessions** | ${formatNumber(summary.totalSessions)} |
| **Users** | ${formatNumber(summary.totalUsers)} |
| **Page Views** | ${formatNumber(summary.totalPageviews)} |
| **Bounce Rate** | ${formatPercent(summary.bounceRate)} |
| **Avg Session Duration** | ${formatDuration(ga4.overview.avgSessionDuration)} |
| **New Users** | ${formatNumber(ga4.overview.newUsers)} |

---

## Traffic Sources

| Source | Sessions | Share |
|--------|----------|-------|
`

  ga4.trafficSources.forEach((source: any) => {
    md += `| ${source.source} | ${formatNumber(source.sessions)} | ${formatPercent(source.percentage)} |\n`
  })

  md += `
---

## Top Pages

| Page | Views | Avg Time | Bounce Rate |
|------|-------|----------|-------------|
`

  ga4.topPages.slice(0, 10).forEach((page: any) => {
    md += `| ${page.path} | ${formatNumber(page.pageviews)} | ${formatDuration(page.avgTime)} | ${formatPercent(page.bounceRate)} |\n`
  })

  md += `
---

## Search Performance

| Metric | Value |
|--------|-------|
| **Total Clicks** | ${formatNumber(summary.totalClicks)} |
| **Total Impressions** | ${formatNumber(summary.totalImpressions)} |
| **Average CTR** | ${formatPercent(summary.avgCtr)} |
| **Average Position** | ${summary.avgPosition.toFixed(1)} |

---

## Top Search Queries

| Query | Clicks | Impressions | CTR | Position |
|-------|--------|-------------|-----|----------|
`

  searchConsole.queries.slice(0, 10).forEach((q: any) => {
    md += `| ${q.query} | ${formatNumber(q.clicks)} | ${formatNumber(q.impressions)} | ${formatPercent(q.ctr)} | ${q.position.toFixed(1)} |\n`
  })

  if (serp && serp.length > 0) {
    md += `
---

## SERP Rankings

| Keyword | Position | URL |
|---------|----------|-----|
`

    serp.forEach((result: any) => {
      const positionDisplay = result.position ? `#${result.position}` : 'Not in top 100'
      const urlDisplay = result.url ? result.url.replace('https://rocketopp.com', '') : '-'
      md += `| ${result.keyword} | ${positionDisplay} | ${urlDisplay} |\n`
    })
  }

  md += `
---

## Device Breakdown

| Device | Sessions | Share |
|--------|----------|-------|
`

  ga4.devices.forEach((device: any) => {
    md += `| ${device.device} | ${formatNumber(device.sessions)} | ${formatPercent(device.percentage)} |\n`
  })

  md += `
---

## Geographic Distribution

| Country | Sessions | Share |
|---------|----------|-------|
`

  ga4.countries.forEach((country: any) => {
    md += `| ${country.country} | ${formatNumber(country.sessions)} | ${formatPercent(country.percentage)} |\n`
  })

  md += `
---

## Key Insights

1. **Top Traffic Source:** ${summary.topTrafficSource} drives the most traffic
2. **Top Search Query:** "${summary.topSearchQuery}" is the top performing search term
3. **Keywords Tracked:** ${summary.keywordsTracked} keywords, ${summary.keywordsRanking} ranking in top 100

## Recommendations

Based on this data, consider:

1. **Content Optimization:** Focus on pages with high impressions but low CTR to improve click-through rates
2. **Keyword Targeting:** Target queries where you rank between positions 5-20 for quick wins
3. **Mobile Experience:** Ensure mobile experience is optimized as it represents ${ga4.devices.find((d: any) => d.device === 'Mobile')?.percentage || 0}% of traffic
4. **Bounce Rate:** Pages with >50% bounce rate may need content or UX improvements

---

*Report generated automatically by RocketOpp Analytics*
`

  return md
}
