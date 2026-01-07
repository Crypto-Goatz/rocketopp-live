"use client"

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface FeedbackWidgetProps {
  boardToken: string
  basePath?: string
  theme?: 'light' | 'dark' | 'auto'
}

export function FeedbackWidget({ boardToken, basePath = '/feedback', theme = 'dark' }: FeedbackWidgetProps) {
  const [ssoToken, setSsoToken] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Fetch SSO token on mount
  useEffect(() => {
    async function fetchSSOToken() {
      try {
        const res = await fetch('/api/canny/sso')
        if (res.ok) {
          const data = await res.json()
          setSsoToken(data.ssoToken)
        }
      } catch (error) {
        console.error('Failed to fetch Canny SSO token:', error)
      }
    }
    fetchSSOToken()
  }, [])

  // Initialize widget when SDK loads and SSO token is ready
  useEffect(() => {
    if (loaded && ssoToken && typeof window !== 'undefined' && (window as any).Canny) {
      ;(window as any).Canny('render', {
        boardToken,
        basePath,
        ssoToken,
        theme,
      })
    }
  }, [loaded, ssoToken, boardToken, basePath, theme])

  return (
    <>
      <Script
        src="https://canny.io/sdk.js"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />
      <div data-canny className="min-h-[600px]" />
    </>
  )
}

// Changelog widget for showing updates
interface ChangelogWidgetProps {
  appID: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'top' | 'bottom' | 'left' | 'right'
}

export function ChangelogWidget({ appID, position = 'bottom', align = 'right' }: ChangelogWidgetProps) {
  const [loaded, setLoaded] = useState(false)
  const [ssoToken, setSsoToken] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSSOToken() {
      try {
        const res = await fetch('/api/canny/sso')
        if (res.ok) {
          const data = await res.json()
          setSsoToken(data.ssoToken)
        }
      } catch (error) {
        console.error('Failed to fetch Canny SSO token:', error)
      }
    }
    fetchSSOToken()
  }, [])

  useEffect(() => {
    if (loaded && typeof window !== 'undefined' && (window as any).Canny) {
      ;(window as any).Canny('initChangelog', {
        appID,
        position,
        align,
        theme: 'dark',
        ssoToken: ssoToken || undefined,
      })
    }
  }, [loaded, appID, position, align, ssoToken])

  return (
    <Script
      src="https://canny.io/sdk.js"
      strategy="afterInteractive"
      onLoad={() => setLoaded(true)}
    />
  )
}

// Feedback button that opens Canny modal
interface FeedbackButtonProps {
  boardToken: string
  children: React.ReactNode
  className?: string
}

export function FeedbackButton({ boardToken, children, className }: FeedbackButtonProps) {
  const [ssoToken, setSsoToken] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSSOToken() {
      try {
        const res = await fetch('/api/canny/sso')
        if (res.ok) {
          const data = await res.json()
          setSsoToken(data.ssoToken)
        }
      } catch (error) {
        console.error('Failed to fetch Canny SSO token:', error)
      }
    }
    fetchSSOToken()
  }, [])

  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).Canny) {
      ;(window as any).Canny('open', {
        boardToken,
        ssoToken: ssoToken || undefined,
        theme: 'dark',
      })
    }
  }

  return (
    <>
      <Script src="https://canny.io/sdk.js" strategy="afterInteractive" />
      <button onClick={handleClick} className={className}>
        {children}
      </button>
    </>
  )
}
