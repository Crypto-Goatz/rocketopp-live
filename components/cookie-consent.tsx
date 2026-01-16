'use client'

// ============================================================
// Cookie Consent Banner
// ============================================================
// GDPR-compliant cookie consent with preferences management
// ============================================================

import { useState, useEffect } from 'react'
import { X, Cookie, Shield, Settings, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const CONSENT_KEY = 'rocketopp_cookie_consent'
const CONSENT_VERSION = '1.0'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    // Check if consent has been given
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }

    // Parse and apply stored preferences
    try {
      const stored = JSON.parse(consent)
      if (stored.version !== CONSENT_VERSION) {
        // Version mismatch, show banner again
        setIsVisible(true)
      }
    } catch {
      setIsVisible(true)
    }
  }, [])

  const saveConsent = (prefs: ConsentPreferences) => {
    const consentData = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      preferences: prefs,
    }
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData))
    setIsVisible(false)

    // Dispatch event for analytics tracking
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cookie-consent-update', { detail: prefs })
      )
    }
  }

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    setPreferences(allAccepted)
    saveConsent(allAccepted)
  }

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    setPreferences(necessaryOnly)
    saveConsent(necessaryOnly)
  }

  const saveCustomPreferences = () => {
    saveConsent(preferences)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop for settings modal */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-slide-up">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-6">
            {!showSettings ? (
              // Simple View
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    We value your privacy
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    We use cookies to enhance your experience, analyze traffic, and personalize content.
                    By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                    <Link href="/privacy" className="text-primary hover:underline ml-1">
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={acceptNecessary}
                    className="border-white/10 hover:bg-white/5"
                  >
                    Necessary Only
                  </Button>
                  <Button size="sm" onClick={acceptAll}>
                    Accept All
                  </Button>
                </div>
              </div>
            ) : (
              // Settings View
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-semibold text-white">
                      Cookie Preferences
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Necessary */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">Strictly Necessary</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                          Required
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400">
                        Essential for the website to function. These cannot be disabled.
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-12 h-7 rounded-full bg-primary flex items-center justify-end px-1">
                      <div className="w-5 h-5 rounded-full bg-white" />
                    </div>
                  </div>

                  {/* Analytics */}
                  <label className="flex items-start gap-4 p-4 rounded-xl bg-white/5 cursor-pointer hover:bg-white/[0.07] transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">Analytics</h4>
                      <p className="text-sm text-zinc-400">
                        Help us understand how visitors interact with our website.
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                      className={`flex-shrink-0 w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
                        preferences.analytics ? 'bg-primary justify-end' : 'bg-zinc-700 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white" />
                    </button>
                  </label>

                  {/* Marketing */}
                  <label className="flex items-start gap-4 p-4 rounded-xl bg-white/5 cursor-pointer hover:bg-white/[0.07] transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">Marketing</h4>
                      <p className="text-sm text-zinc-400">
                        Used to deliver personalized ads and measure campaign effectiveness.
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                      className={`flex-shrink-0 w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
                        preferences.marketing ? 'bg-primary justify-end' : 'bg-zinc-700 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white" />
                    </button>
                  </label>

                  {/* Preferences */}
                  <label className="flex items-start gap-4 p-4 rounded-xl bg-white/5 cursor-pointer hover:bg-white/[0.07] transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">Preferences</h4>
                      <p className="text-sm text-zinc-400">
                        Remember your settings and personalization choices.
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences(p => ({ ...p, preferences: !p.preferences }))}
                      className={`flex-shrink-0 w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
                        preferences.preferences ? 'bg-primary justify-end' : 'bg-zinc-700 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white" />
                    </button>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <Link
                    href="/privacy"
                    className="text-sm text-zinc-400 hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={acceptNecessary}
                      className="border-white/10 hover:bg-white/5"
                    >
                      Necessary Only
                    </Button>
                    <Button size="sm" onClick={saveCustomPreferences}>
                      <Check className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default CookieConsent
