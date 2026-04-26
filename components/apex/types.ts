/** Shared types for the APEX assessment flow. */

export interface Insight {
  type?: 'standard' | 'social_media_analysis' | 'competitive_analysis' | 'redesign'
  title?: string
  text?: string
  // social_media_analysis
  platforms?: Array<{ platform: string; analysis: string; recommendation: string }>
  // competitive_analysis
  competitors?: Competitor[]
}

export interface Competitor {
  name: string
  rating: number
  userRatingsTotal: number
  isPlayer: boolean
}

export interface TurnInsight {
  type?: Insight['type']
  title?: string
  text?: string
  platforms?: Insight['platforms']
}

export interface Turn {
  question?: string
  options?: string[]
  insight?: TurnInsight
}

export interface Personalization {
  name: string
  company: string
  website: string
  zipCode: string
  industry: string
}

export interface Collected { question: string; answer: string }

export interface Assessment {
  'Executive Summary'?: string
  'Identified Strengths'?: string
  'Critical Weaknesses'?: string
  'Market Opportunities'?: string
  'Competitive Threats'?: string
  'Social Media Presence'?: string
  'Strategic Next Steps'?: string
}

export interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

export type AppState =
  | 'intro'
  | 'consent'
  | 'collectingInfo'
  | 'selectingCompetitors'
  | 'interacting'
  | 'capturing'
  | 'generating'
  | 'outro'

export type InfoStep = 'name' | 'company' | 'zipCode' | 'industry' | 'website'
