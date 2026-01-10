'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  type AppState,
  type InfoStep,
  type ConversationTurn,
  type HistoryItem,
  type ContactInfo,
  type Personalization,
  type Insight,
  type AssessmentData,
  type CollectedData,
  type Competitor,
  type CompetitiveAnalysisInsight,
} from '@/lib/assessment/types'
import { INDUSTRY_INSIGHTS, TOTAL_ASSESSMENT_STEPS, HIGHLIGHT_ANIMATION } from '@/lib/assessment/constants'
import SparkLogo from './components/SparkLogo'
import TypingIndicator from './components/TypingIndicator'
import ProgressBar from './components/ProgressBar'

// Helper function to parse text and wrap highlighted parts
const parseAndHighlight = (text: string) => {
  if (!text) return text
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className={`${HIGHLIGHT_ANIMATION} text-orange-400`}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  )
}

// Option Button Component
const OptionButton: React.FC<{
  text: string
  onClick: () => void
  disabled: boolean
}> = ({ text, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-medium
               hover:bg-zinc-700 hover:border-orange-500 hover:scale-105
               transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {text}
  </button>
)

// Consent Modal Component
const ConsentModal: React.FC<{ onConsent: () => void }> = ({ onConsent }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="max-w-lg w-full bg-zinc-900/80 backdrop-blur-lg rounded-2xl p-8 border border-zinc-800 shadow-2xl animate-fade-in">
      <SparkLogo className="mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-center mb-4">Rocket AI Assessment</h1>
      <p className="text-zinc-400 text-center mb-6">
        Welcome to your personalized business intelligence session. Spark will analyze your business
        and provide a comprehensive strategic blueprint.
      </p>
      <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
        <h3 className="text-orange-500 font-semibold mb-2">What to expect:</h3>
        <ul className="text-sm text-zinc-400 space-y-1">
          <li>• 6-8 strategic questions (5-7 minutes)</li>
          <li>• Real-time insights as we go</li>
          <li>• Competitive analysis</li>
          <li>• Custom strategic blueprint</li>
        </ul>
      </div>
      <button
        onClick={onConsent}
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-bold text-lg
                   hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20"
      >
        Begin Assessment
      </button>
      <p className="text-xs text-zinc-500 text-center mt-4">
        By continuing, you agree to our privacy policy. Your data is secured and never shared.
      </p>
    </div>
  </div>
)

// Lead Capture Component
const LeadCapture: React.FC<{
  userName: string
  onSubmit: (info: ContactInfo) => void
}> = ({ userName, onSubmit }) => {
  const [step, setStep] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isVisible, setIsVisible] = useState(true)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setIsVisible(false)
      setTimeout(() => {
        setStep('phone')
        setIsVisible(true)
      }, 300)
    }
  }

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name: userName, email, phone })
  }

  const handleSkipPhone = () => {
    onSubmit({ name: userName, email, phone: '' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`max-w-lg w-full transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <SparkLogo className="mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-center mb-8">Finalizing Strategic Blueprint...</h1>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <p className="text-xl text-center text-zinc-300">
              Perfect, {userName}. Where should I send your blueprint?
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoFocus
              className="w-full px-4 py-4 text-xl text-center bg-zinc-800 border-b-2 border-zinc-700
                         focus:border-orange-500 outline-none transition-colors rounded-lg"
            />
            <button
              type="submit"
              disabled={!email.trim()}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-bold
                         disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <p className="text-xl text-center text-zinc-300">
              Want a strategy call to review your blueprint? (Optional)
            </p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              autoFocus
              className="w-full px-4 py-4 text-xl text-center bg-zinc-800 border-b-2 border-zinc-700
                         focus:border-orange-500 outline-none transition-colors rounded-lg"
            />
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-bold
                         hover:opacity-90 transition-opacity"
            >
              Request Consultation
            </button>
            <button
              type="button"
              onClick={handleSkipPhone}
              className="w-full py-2 text-zinc-400 hover:text-white transition-colors"
            >
              Maybe later
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// Competitor Selection Component
const CompetitorSelection: React.FC<{
  competitors: Competitor[]
  onSubmit: (selected: Competitor[]) => void
}> = ({ competitors, onSubmit }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggleCompetitor = (name: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(name)) {
      newSelected.delete(name)
    } else {
      newSelected.add(name)
    }
    setSelected(newSelected)
  }

  const handleSubmit = () => {
    const selectedCompetitors = competitors.filter((c) => c.isPlayer || selected.has(c.name))
    onSubmit(selectedCompetitors)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-zinc-900/80 backdrop-blur-lg rounded-2xl p-8 border border-zinc-800">
        <SparkLogo className="mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-center mb-2">Your Competitive Landscape</h1>
        <p className="text-zinc-400 text-center mb-6">
          Select the businesses you consider direct competitors
        </p>

        <div className="space-y-3 mb-6">
          {competitors.map((competitor) => (
            <div
              key={competitor.name}
              onClick={() => !competitor.isPlayer && toggleCompetitor(competitor.name)}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer
                ${competitor.isPlayer
                  ? 'bg-orange-500/10 border-orange-500/50'
                  : selected.has(competitor.name)
                    ? 'bg-zinc-800 border-orange-500'
                    : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                }`}
            >
              <div className="flex items-center gap-3">
                {competitor.isPlayer ? (
                  <span className="px-2 py-1 bg-orange-500 text-xs rounded font-bold">YOU</span>
                ) : (
                  <input
                    type="checkbox"
                    checked={selected.has(competitor.name)}
                    onChange={() => {}}
                    className="w-5 h-5 accent-orange-500"
                  />
                )}
                <span className="font-medium">{competitor.name}</span>
              </div>
              {!competitor.isPlayer && competitor.rating > 0 && (
                <div className="flex items-center gap-1 text-sm text-zinc-400">
                  <span className="text-yellow-500">★</span>
                  <span>{competitor.rating}</span>
                  <span className="text-zinc-500">({competitor.userRatingsTotal})</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-bold
                     hover:opacity-90 transition-opacity"
        >
          Confirm {selected.size} Competitors & Continue
        </button>
      </div>
    </div>
  )
}

// Generating Blueprint Component
const GeneratingBlueprint: React.FC<{ companyName: string }> = ({ companyName }) => {
  const [message, setMessage] = useState('Analyzing responses...')
  const messages = [
    'Analyzing responses...',
    'Identifying market opportunities...',
    'Evaluating competitive landscape...',
    'Generating strategic recommendations...',
    'Building your blueprint...',
  ]

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % messages.length
      setMessage(messages[index])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <SparkLogo className="mx-auto mb-8 w-24 h-24 animate-pulse" />
        <h1 className="text-3xl font-bold mb-4">Creating Your Strategic Blueprint</h1>
        <p className="text-xl text-orange-400 mb-8">{companyName}</p>
        <p className="text-zinc-400 animate-pulse">{message}</p>
        <div className="mt-8">
          <TypingIndicator />
        </div>
      </div>
    </div>
  )
}

// Final Summary Component
const FinalSummary: React.FC<{
  userName: string
  companyName: string
  blueprintUrl: string | null
}> = ({ userName, companyName, blueprintUrl }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-zinc-900/80 backdrop-blur-lg rounded-2xl p-8 border border-zinc-800 text-center animate-fade-in">
      <SparkLogo className="mx-auto mb-6" />
      <h1 className="text-4xl font-bold mb-4">
        Thank You, {userName}!
      </h1>
      <p className="text-xl text-zinc-300 mb-8">
        Your preliminary assessment for <span className="text-orange-400 font-bold">{companyName}</span> is complete.
      </p>

      <div className="bg-zinc-800/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-orange-400 mb-3">What Happens Next?</h2>
        <p className="text-zinc-400">
          Our AI is conducting a deeper analysis. A RocketOpp expert will contact you
          to schedule your complimentary strategy session and present your complete blueprint.
        </p>
      </div>

      {blueprintUrl && (
        <a
          href={blueprintUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500
                     rounded-lg text-white font-bold hover:opacity-90 transition-opacity mb-6"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Access Your Blueprint
        </a>
      )}

      <p className="text-sm text-zinc-500">Powered by Spark - RocketOpp AI</p>
    </div>
  </div>
)

// Insight Card Component
const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
  if (insight.type === 'standard') {
    return (
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 animate-fade-in">
        <h3 className="text-lg font-semibold text-orange-400 mb-2">{insight.title}</h3>
        <p className="text-zinc-300">{parseAndHighlight(insight.text)}</p>
      </div>
    )
  }

  if (insight.type === 'social_media_analysis') {
    return (
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 animate-fade-in">
        <h3 className="text-lg font-semibold text-orange-400 mb-4">{insight.title}</h3>
        <div className="space-y-3">
          {insight.platforms.map((platform, i) => (
            <div key={i} className="border-l-2 border-orange-500 pl-3">
              <h4 className="font-medium text-white">{platform.platform}</h4>
              <p className="text-sm text-zinc-400">{platform.analysis}</p>
              <p className="text-sm text-orange-300 mt-1">{platform.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (insight.type === 'competitive_analysis') {
    return (
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 animate-fade-in">
        <h3 className="text-lg font-semibold text-orange-400 mb-4">{insight.title}</h3>
        <div className="space-y-2">
          {insight.competitors.map((comp, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className={comp.isPlayer ? 'text-orange-400 font-bold' : 'text-zinc-300'}>
                {comp.isPlayer && '★ '}{comp.name}
              </span>
              {comp.rating > 0 && (
                <span className="text-sm text-zinc-400">
                  {comp.rating} ★ ({comp.userRatingsTotal})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

// Live Intelligence Panel
const IntelligencePanel: React.FC<{
  insights: Insight[]
  loading: boolean
}> = ({ insights, loading }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [insights])

  return (
    <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg p-6 h-full flex flex-col border border-zinc-800">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
        <SparkLogo className="!w-8 !h-8" />
        <h2 className="text-xl font-bold">Live Intelligence Panel</h2>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4">
        {insights.length === 0 && !loading && (
          <p className="text-center text-zinc-500">Insights will appear here as we proceed...</p>
        )}
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} />
        ))}
        {loading && (
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-2 text-orange-400">
              <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full" />
              Processing...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Main Assessment Component
export default function AssessmentPage() {
  // State
  const [appState, setAppState] = useState<AppState>('intro')
  const [infoStep, setInfoStep] = useState<InfoStep>('name')
  const [currentTurn, setCurrentTurn] = useState<ConversationTurn | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in')
  const [assessmentStep, setAssessmentStep] = useState(0)

  const [personalization, setPersonalization] = useState<Personalization>({
    name: '', company: '', website: '', zipCode: '', industry: ''
  })
  const [collectedData, setCollectedData] = useState<CollectedData[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [conversationHistory, setConversationHistory] = useState<HistoryItem[]>([])
  const [potentialCompetitors, setPotentialCompetitors] = useState<Competitor[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [blueprintUrl, setBlueprintUrl] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
    }
  }, [currentAnswer])

  // Intro timer
  useEffect(() => {
    const timer = setTimeout(() => setAppState('consent'), 2500)
    return () => clearTimeout(timer)
  }, [])

  // Handle consent
  const handleConsent = () => {
    setAppState('collectingInfo')
    setCurrentTurn({ question: "Welcome! I'm Spark. To start, what's your **name**?" })
  }

  // Send message to AI
  const sendToAI = async (userMessage: string) => {
    setLoading(true)

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }]
    setMessages(newMessages)

    try {
      const response = await fetch('/api/assessment/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: personalization,
        }),
      })

      const data = await response.json()

      if (data.success) {
        processAIResponse(data.text)
        setMessages([...newMessages, { role: 'assistant', content: data.text }])
      }
    } catch (error) {
      console.error('AI error:', error)
      setCurrentTurn({
        question: 'System error. Please try again.',
      })
    } finally {
      setLoading(false)
      setFadeState('in')
    }
  }

  // Process AI response
  const processAIResponse = (text: string) => {
    const cleanJson = (str: string): string => {
      const start = str.indexOf('{')
      const end = str.lastIndexOf('}')
      if (start > -1 && end > -1) {
        return str.substring(start, end + 1)
      }
      return str
    }

    if (text.startsWith('ASSESSMENT_COMPLETE:')) {
      try {
        const jsonStr = cleanJson(text)
        const data = JSON.parse(jsonStr)
        setAssessmentData(data)
        setAppState('capturing')
      } catch {
        setAssessmentData({
          "Executive Summary": "Assessment complete. A RocketOpp expert will review your session.",
          "Strategic Next Steps": "We'll be in touch to discuss your custom strategy."
        })
        setAppState('capturing')
      }
    } else {
      try {
        const turn: ConversationTurn = JSON.parse(cleanJson(text))

        // Add insight if present
        if (turn.insight) {
          const newInsight: Insight = {
            ...turn.insight,
            type: (turn.insight.type || 'standard') as 'standard',
            animationClass: HIGHLIGHT_ANIMATION,
          } as Insight
          setInsights((prev) => [...prev, newInsight])
        }

        setConversationHistory((prev) => [...prev, { turn, answer: '' }])
        setCurrentTurn(turn)
        setAssessmentStep((prev) => prev + 1)
      } catch {
        setCurrentTurn({
          question: "My apologies, could you please **rephrase** that?",
        })
      }
    }
  }

  // Submit answer
  const submitAnswer = async (answer: string) => {
    if (loading || !answer.trim()) return

    const trimmedAnswer = answer.trim()
    setCurrentAnswer('')
    setFadeState('out')

    // Record the answer
    if (currentTurn) {
      const question = currentTurn.question.replace(/\*\*(.*?)\*\*/g, '$1')
      setCollectedData((prev) => [...prev, { question, answer: trimmedAnswer }])
    }

    setTimeout(async () => {
      if (appState === 'collectingInfo') {
        switch (infoStep) {
          case 'name':
            setPersonalization((p) => ({ ...p, name: trimmedAnswer }))
            setInfoStep('company')
            setCurrentTurn({ question: `A pleasure, ${trimmedAnswer}. What is your **company's name**?` })
            setFadeState('in')
            break
          case 'company':
            setPersonalization((p) => ({ ...p, company: trimmedAnswer }))
            setInfoStep('zipCode')
            setCurrentTurn({ question: `And your business **zip code**?` })
            setFadeState('in')
            break
          case 'zipCode':
            setPersonalization((p) => ({ ...p, zipCode: trimmedAnswer }))
            setInfoStep('industry')
            setCurrentTurn({
              question: `What's your primary **business category**?`,
              options: ['Home Services', 'Restaurant', 'Retail', 'Automotive', 'Professional Services']
            })
            setFadeState('in')
            break
          case 'industry':
            setPersonalization((p) => ({ ...p, industry: trimmedAnswer }))
            setInfoStep('website')
            const insightKey = Object.keys(INDUSTRY_INSIGHTS).find((k) =>
              trimmedAnswer.toLowerCase().includes(k.toLowerCase())
            ) || 'default'
            const industryInsight = INDUSTRY_INSIGHTS[insightKey]
            setInsights((prev) => [...prev, {
              type: 'standard',
              title: industryInsight.title,
              text: industryInsight.text,
              animationClass: HIGHLIGHT_ANIMATION,
            }])
            setCurrentTurn({
              question: `Got it. What is your company's **website** address?`,
            })
            setFadeState('in')
            break
          case 'website':
            const updatedPersonalization = { ...personalization, website: trimmedAnswer }
            setPersonalization(updatedPersonalization)
            setLoading(true)

            // Fetch competitors
            try {
              const res = await fetch('/api/assessment/competitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  company: updatedPersonalization.company,
                  zipCode: updatedPersonalization.zipCode,
                  industry: updatedPersonalization.industry,
                }),
              })
              const data = await res.json()
              if (data.competitors) {
                setPotentialCompetitors(data.competitors)
                setAppState('selectingCompetitors')
              }
            } catch {
              // Skip competitor selection on error
              handleCompetitorsSelected([{
                name: updatedPersonalization.company,
                rating: 0,
                userRatingsTotal: 0,
                isPlayer: true,
              }])
            } finally {
              setLoading(false)
            }
            break
        }
      } else if (appState === 'interacting') {
        // Update history with answer
        const newHistory = [...conversationHistory]
        if (newHistory[assessmentStep - 1]) {
          newHistory[assessmentStep - 1].answer = trimmedAnswer
        }
        setConversationHistory(newHistory)

        await sendToAI(trimmedAnswer)
      }
    }, 300)
  }

  // Handle competitor selection
  const handleCompetitorsSelected = async (selected: Competitor[]) => {
    const competitorInsight: CompetitiveAnalysisInsight = {
      type: 'competitive_analysis',
      title: 'Your Competitive Landscape',
      competitors: selected,
    }
    setInsights((prev) => [...prev, competitorInsight])

    const competitorNames = selected.filter((c) => !c.isPlayer).map((c) => c.name).join(', ')
    const firstPrompt = `My name is ${personalization.name}, company is ${personalization.company}, industry: ${personalization.industry}, website is ${personalization.website}. My competitors are: ${competitorNames || 'None identified'}. Begin the assessment with your first strategic question.`

    setAppState('interacting')
    await sendToAI(firstPrompt)
  }

  // Handle lead capture
  const handleLeadCaptureSubmit = async (info: ContactInfo) => {
    setContactInfo(info)
    setAppState('generating')

    try {
      // Generate blueprint
      const gammaRes = await fetch('/api/assessment/gamma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: info.name,
          companyName: personalization.company,
          assessmentData,
          insights,
          collectedData,
        }),
      })
      const gammaData = await gammaRes.json()
      if (gammaData.deckUrl) {
        setBlueprintUrl(gammaData.deckUrl)
      }

      // Submit lead
      await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...info,
          companyName: personalization.company,
          website: personalization.website,
          zipCode: personalization.zipCode,
          blueprintUrl: gammaData.deckUrl,
          assessmentSummary: assessmentData,
          conversationHistory: collectedData.map((d) => `Q: ${d.question}\nA: ${d.answer}`).join('\n\n'),
        }),
      })

      setTimeout(() => setAppState('outro'), 2000)
    } catch (error) {
      console.error('Submission error:', error)
      setAppState('outro')
    }
  }

  // Render based on state
  if (appState === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <SparkLogo className="w-48 h-48 animate-pulse" />
        <p className="mt-6 text-xl text-zinc-400 font-mono tracking-widest animate-pulse">
          SPARK :: INITIALIZING...
        </p>
      </div>
    )
  }

  if (appState === 'consent') {
    return <ConsentModal onConsent={handleConsent} />
  }

  if (appState === 'selectingCompetitors') {
    return <CompetitorSelection competitors={potentialCompetitors} onSubmit={handleCompetitorsSelected} />
  }

  if (appState === 'capturing') {
    return <LeadCapture userName={personalization.name} onSubmit={handleLeadCaptureSubmit} />
  }

  if (appState === 'generating') {
    return <GeneratingBlueprint companyName={personalization.company} />
  }

  if (appState === 'outro') {
    return (
      <FinalSummary
        userName={contactInfo?.name || personalization.name}
        companyName={personalization.company}
        blueprintUrl={blueprintUrl}
      />
    )
  }

  // Main interaction view
  return (
    <main className="min-h-screen text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-4rem)]">
        {/* Left: Question Area */}
        <div className="flex flex-col items-center justify-center">
          <div className={`w-full max-w-lg transition-all duration-300 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}>
            {appState === 'interacting' && (
              <ProgressBar currentStep={assessmentStep} totalSteps={TOTAL_ASSESSMENT_STEPS} />
            )}

            {loading ? (
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-6">Analyzing...</h1>
                <TypingIndicator />
              </div>
            ) : currentTurn && (
              <>
                <h1 className="text-3xl lg:text-4xl font-bold text-center mb-8">
                  {parseAndHighlight(currentTurn.question)}
                </h1>

                {currentTurn.options ? (
                  <div className="flex flex-wrap justify-center gap-3">
                    {currentTurn.options.map((option, i) => (
                      <OptionButton
                        key={i}
                        text={option}
                        onClick={() => submitAnswer(option)}
                        disabled={loading}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    <textarea
                      ref={textAreaRef}
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          submitAnswer(currentAnswer)
                        }
                      }}
                      placeholder="Type your answer..."
                      disabled={loading}
                      className="w-full text-xl p-4 pr-14 bg-zinc-800 border-2 border-zinc-700 focus:border-orange-500
                                 rounded-lg resize-none outline-none transition-all"
                      rows={1}
                    />
                    <button
                      onClick={() => submitAnswer(currentAnswer)}
                      disabled={loading || !currentAnswer.trim()}
                      className="absolute bottom-3 right-3 p-2 bg-orange-500 rounded-md text-white
                                 hover:bg-orange-600 disabled:opacity-50 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right: Intelligence Panel */}
        <div className="hidden lg:block">
          <IntelligencePanel insights={insights} loading={loading} />
        </div>
      </div>
    </main>
  )
}
