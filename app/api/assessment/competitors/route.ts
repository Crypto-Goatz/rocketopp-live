// ============================================================
// Competitors API - Search for local competitors
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import type { Competitor } from '@/lib/assessment/types'

// Industry-specific competitor pools for demo/fallback
const INDUSTRY_COMPETITORS: Record<string, string[]> = {
  'Restaurant': [
    'The Local Bistro', 'Downtown Eats', 'Corner Cafe', 'Fresh Kitchen Co',
    'Urban Plates', 'The Hungry Fork', 'Main Street Grill', 'Flavor Town'
  ],
  'Home Services': [
    'Pro Home Solutions', 'Quality First Services', 'Hometown Handyman',
    'Elite Home Care', 'Trusted Repairs Inc', 'All-Pro Maintenance', 'Local Fix-It'
  ],
  'Retail': [
    'City Goods', 'Main Street Mercantile', 'Local Luxe', 'The Corner Store',
    'Urban Outfitters Local', 'Boutique Central', 'Quality Goods Co'
  ],
  'Automotive': [
    'Peak Performance Auto', 'Precision Motors', 'Quick Lube Express',
    'Elite Auto Care', 'Hometown Garage', 'Pro Auto Service', 'Speed Shop'
  ],
  'Professional Services': [
    'Premier Consulting Group', 'Elite Advisory', 'Strategic Partners LLC',
    'Local Experts Inc', 'Professional Solutions', 'Business First Advisors'
  ],
}

export async function POST(request: NextRequest) {
  try {
    const { company, zipCode, industry } = await request.json()

    // Check if we have Google Places API key
    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY

    if (googleApiKey) {
      // Real Google Places API call
      try {
        const competitors = await searchGooglePlaces(company, zipCode, industry, googleApiKey)
        return NextResponse.json({ success: true, competitors })
      } catch (error) {
        console.error('Google Places API error:', error)
        // Fall through to mock data
      }
    }

    // Fallback: Generate mock competitors
    const competitors = generateMockCompetitors(company, industry)

    return NextResponse.json({
      success: true,
      competitors,
      source: 'mock',
    })
  } catch (error) {
    console.error('Competitors API error:', error)
    return NextResponse.json(
      { error: 'Failed to search competitors' },
      { status: 500 }
    )
  }
}

async function searchGooglePlaces(
  company: string,
  zipCode: string,
  industry: string,
  apiKey: string
): Promise<Competitor[]> {
  const query = encodeURIComponent(`${industry} near ${zipCode}`)
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`

  const response = await fetch(url)
  const data = await response.json()

  if (data.status !== 'OK' || !data.results) {
    throw new Error('Google Places API returned no results')
  }

  const competitors: Competitor[] = data.results.slice(0, 6).map((place: {
    name: string
    rating?: number
    user_ratings_total?: number
  }) => ({
    name: place.name,
    rating: place.rating || 0,
    userRatingsTotal: place.user_ratings_total || 0,
    isPlayer: place.name.toLowerCase().includes(company.toLowerCase()),
  }))

  // Ensure the user's company is included
  const hasPlayer = competitors.some((c) => c.isPlayer)
  if (!hasPlayer) {
    competitors.unshift({
      name: company,
      rating: 0,
      userRatingsTotal: 0,
      isPlayer: true,
    })
  }

  return competitors
}

function generateMockCompetitors(company: string, industry: string): Competitor[] {
  const pool = INDUSTRY_COMPETITORS[industry] || INDUSTRY_COMPETITORS['Professional Services']

  // Shuffle and pick 4-6 competitors
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 4)

  const competitors: Competitor[] = [
    // User's company first
    {
      name: company,
      rating: 0,
      userRatingsTotal: 0,
      isPlayer: true,
    },
    // Mock competitors with realistic ratings
    ...selected.map((name) => ({
      name,
      rating: Math.round((3.2 + Math.random() * 1.7) * 10) / 10, // 3.2 - 4.9
      userRatingsTotal: Math.floor(50 + Math.random() * 400),
      isPlayer: false,
    })),
  ]

  return competitors
}
