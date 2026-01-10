// ============================================================
// AI Assessment Types
// ============================================================

export interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  options?: string[]
}

export type AssessmentData = Record<string, string>

export interface CollectedData {
  question: string
  answer: string
}

export interface StandardInsight {
  type: 'standard'
  title: string
  text: string
  animationClass: string
}

export interface RedesignInsight {
  type: 'redesign'
  title: string
  originalImage: string
  mockups: Array<{
    image: string
    text: string
  }>
}

export interface Competitor {
  name: string
  rating: number
  userRatingsTotal: number
  isPlayer: boolean
}

export interface CompetitiveAnalysisInsight {
  type: 'competitive_analysis'
  title: string
  competitors: Competitor[]
}

export interface SocialMediaPlatformAnalysis {
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'X (Twitter)' | 'TikTok' | 'Other'
  analysis: string
  recommendation: string
}

export interface SocialMediaInsight {
  type: 'social_media_analysis'
  title: string
  platforms: SocialMediaPlatformAnalysis[]
}

export type Insight = StandardInsight | RedesignInsight | CompetitiveAnalysisInsight | SocialMediaInsight

export interface ConversationTurn {
  question: string
  options?: string[]
  insight?: { type?: string; title: string; [key: string]: unknown }
}

export interface HistoryItem {
  turn: ConversationTurn
  answer: string
}

export interface ContactInfo {
  name: string
  email: string
  phone: string
}

export interface Personalization {
  name: string
  company: string
  website: string
  zipCode: string
  industry: string
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

export interface GammaGenerationRequest {
  title: string
  content: string
  userName: string
  companyName: string
  assessmentData: AssessmentData
  insights: Insight[]
}

export interface GammaGenerationResponse {
  success: boolean
  deckUrl?: string
  error?: string
}
