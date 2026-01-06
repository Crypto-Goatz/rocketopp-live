'use client'

import Script from 'next/script'

interface MicrosoftClarityProps {
  projectId: string
}

export function MicrosoftClarity({ projectId }: MicrosoftClarityProps) {
  if (!projectId) return null

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${projectId}");
      `}
    </Script>
  )
}

// Clarity helper functions
export function clarityIdentify(userId: string, sessionId?: string, pageId?: string) {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('identify', userId, sessionId, pageId)
  }
}

export function claritySet(key: string, value: string) {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('set', key, value)
  }
}

export function claritySendEvent(name: string) {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', name)
  }
}

export function clarityUpgrade(reason: string) {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('upgrade', reason)
  }
}

// Tag user sessions for better analysis
export function tagClaritySession(tags: Record<string, string>) {
  Object.entries(tags).forEach(([key, value]) => {
    claritySet(key, value)
  })
}

// Mark session as important (records full session)
export function markImportantSession(reason: string) {
  clarityUpgrade(reason)
}
