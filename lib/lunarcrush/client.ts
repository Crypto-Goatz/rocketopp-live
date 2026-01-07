// LunarCrush API Client
const LUNARCRUSH_API_BASE = 'https://lunarcrush.com/api4'

export interface TrendingTopic {
  id: string
  topic: string
  title: string
  category: string
  sentiment: number
  interactions: number
  trend: 'up' | 'down' | 'flat'
  score: number
}

export interface ContentOpportunity extends TrendingTopic {
  reasoning: string
  whatsup?: string[]
  news?: any[]
}

async function fetchAPI(endpoint: string) {
  const apiKey = process.env.LUNARCRUSH_API_KEY
  if (!apiKey) throw new Error('LUNARCRUSH_API_KEY not configured')
  const res = await fetch(LUNARCRUSH_API_BASE + endpoint, {
    headers: { 'Authorization': 'Bearer ' + apiKey },
    next: { revalidate: 3600 }
  })
  if (!res.ok) throw new Error('LunarCrush API error: ' + res.status)
  return res.json()
}

async function getTrendingTopics(limit = 20): Promise<TrendingTopic[]> {
  try {
    const data = await fetchAPI('/public/topics/list')
    if (!data.data) return []
    return data.data.slice(0, limit).map((item: any, index: number) => ({
      id: item.topic || 'topic-' + index,
      topic: item.topic || item.title,
      title: item.title || item.topic,
      category: item.category || 'Technology',
      sentiment: item.sentiment || 3,
      interactions: item.interactions_24h || 0,
      trend: item.trend || 'flat',
      score: item.galaxy_score || 50
    }))
  } catch (error) {
    console.error('Error fetching trending topics:', error)
    return getMockTopics()
  }
}

async function getBestContentOpportunities(count = 3): Promise<ContentOpportunity[]> {
  const topics = await getTrendingTopics(30)
  const scored = topics
    .filter(t => t.sentiment >= 2.5)
    .map(t => ({ ...t, calculatedScore: calculateScore(t) }))
    .sort((a, b) => b.calculatedScore - a.calculatedScore)
    .slice(0, count)
  return scored.map(topic => ({
    ...topic,
    reasoning: 'High engagement topic with ' + (topic.sentiment >= 3.5 ? 'positive' : 'neutral') + ' sentiment.'
  }))
}

function calculateScore(topic: TrendingTopic): number {
  let score = topic.score
  if (topic.interactions > 10000) score += 20
  if (topic.interactions > 50000) score += 30
  if (topic.sentiment >= 4) score += 15
  if (topic.sentiment >= 4.5) score += 10
  if (topic.trend === 'up') score += 10
  return score
}

function getMockTopics(): TrendingTopic[] {
  return [
    { id: '1', topic: 'AI Automation', title: 'AI Business Automation', category: 'Technology', sentiment: 4.2, interactions: 125000, trend: 'up', score: 85 },
    { id: '2', topic: 'Marketing Analytics', title: 'Data-Driven Marketing', category: 'Marketing', sentiment: 3.8, interactions: 89000, trend: 'up', score: 78 },
    { id: '3', topic: 'Lead Generation', title: 'Lead Gen Strategies', category: 'Sales', sentiment: 3.5, interactions: 67000, trend: 'flat', score: 72 },
    { id: '4', topic: 'CRM Integration', title: 'CRM Best Practices', category: 'Technology', sentiment: 3.9, interactions: 54000, trend: 'up', score: 70 },
    { id: '5', topic: 'Social Media Marketing', title: 'Social Strategy 2026', category: 'Marketing', sentiment: 4.0, interactions: 98000, trend: 'up', score: 82 }
  ]
}

export const lunarcrush = { getTrendingTopics, getBestContentOpportunities }
