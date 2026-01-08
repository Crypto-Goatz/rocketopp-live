"use client"

import Image from 'next/image'
import { Rocket } from 'lucide-react'
import { useCompanyLogo } from './LogoProvider'

interface SiteLogoProps {
  /** Maximum width in pixels */
  maxWidth?: number
  /** Maximum height in pixels */
  maxHeight?: number
  /** CSS class for additional styling */
  className?: string
  /** Show text next to logo */
  showText?: boolean
  /** Text to display (defaults to RocketOpp) */
  text?: string
  /** Variant: 'default' uses company logo with fallback, 'rocketopp' always uses RocketOpp branding */
  variant?: 'default' | 'rocketopp'
  /** Link destination when clicked */
  href?: string
}

export function SiteLogo({
  maxWidth = 120,
  maxHeight = 40,
  className = '',
  showText = false,
  text = 'RocketOpp',
  variant = 'default',
  href,
}: SiteLogoProps) {
  const { logoUrl, isLoading } = useCompanyLogo()

  // Determine which logo to show
  const shouldShowCustomLogo = variant === 'default' && logoUrl && !isLoading
  const shouldShowRocketOppLogo = variant === 'rocketopp' || (!logoUrl && !isLoading)

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      {shouldShowCustomLogo ? (
        <div
          className="relative flex items-center justify-center"
          style={{ maxWidth, maxHeight }}
        >
          <Image
            src={logoUrl}
            alt="Company Logo"
            width={maxWidth}
            height={maxHeight}
            className="object-contain"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
            }}
            priority
          />
        </div>
      ) : shouldShowRocketOppLogo ? (
        <>
          <div
            className="flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-red-500"
            style={{
              width: Math.min(maxHeight, 32),
              height: Math.min(maxHeight, 32),
            }}
          >
            <Rocket
              className="text-white"
              style={{
                width: Math.min(maxHeight, 32) * 0.5,
                height: Math.min(maxHeight, 32) * 0.5,
              }}
            />
          </div>
          {showText && (
            <span className="font-bold text-white">{text}</span>
          )}
        </>
      ) : (
        // Loading state - show placeholder
        <div
          className="bg-zinc-800 rounded-lg animate-pulse"
          style={{ width: maxHeight, height: maxHeight }}
        />
      )}
    </div>
  )

  if (href) {
    return (
      <a href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </a>
    )
  }

  return content
}

// Static version for server components that always shows RocketOpp branding
export function RocketOppLogo({
  size = 32,
  showText = true,
  className = '',
}: {
  size?: number
  showText?: boolean
  className?: string
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-red-500"
        style={{ width: size, height: size }}
      >
        <Rocket className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} />
      </div>
      {showText && (
        <span className="font-bold text-white">RocketOpp</span>
      )}
    </div>
  )
}
