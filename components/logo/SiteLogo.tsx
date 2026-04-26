"use client"

import Image from 'next/image'
import Link from 'next/link'
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
  maxWidth = 160,
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
    <div className={`flex items-center ${className}`}>
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
        <div className="relative" style={{ height: maxHeight }}>
          <Image
            src="/images/rocketopp-logo-full.png"
            alt="RocketOpp - AI-Powered Business Solutions"
            width={maxWidth}
            height={maxHeight}
            className="object-contain"
            style={{
              height: '100%',
              width: 'auto',
              maxWidth: maxWidth,
            }}
            priority
          />
        </div>
      ) : (
        // Loading state - show placeholder
        <div
          className="bg-zinc-800 rounded-lg animate-pulse"
          style={{ width: maxWidth * 0.6, height: maxHeight }}
        />
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity flex items-center">
        {content}
      </Link>
    )
  }

  return content
}

// RocketOpp brand lockup — rocket icon + bold wordmark.
// Renders as icon + "RocketOpp" text; icon scales to height, text scales
// proportionally so a single `height` prop controls the whole lockup.
export function RocketOppLogo({
  height = 36,
  width = 180,
  className = '',
  wordmark = true,
}: {
  height?: number
  width?: number
  className?: string
  /** Hide the wordmark and show only the rocket icon */
  wordmark?: boolean
}) {
  const iconSize = height
  const textSize = Math.round(height * 0.55)

  return (
    <div
      className={`flex items-center ${className}`}
      style={{ gap: Math.round(height * 0.28) }}
    >
      <Image
        src="/images/logo.png"
        alt="RocketOpp"
        width={iconSize}
        height={iconSize}
        className="object-contain shrink-0"
        style={{
          height: iconSize,
          width: iconSize,
          filter: 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.25))',
        }}
        priority
      />
      {wordmark && (
        <span
          className="font-black tracking-tight text-white whitespace-nowrap"
          style={{
            fontSize: textSize,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            maxWidth: Math.max(0, width - iconSize),
          }}
        >
          RocketOpp
        </span>
      )}
    </div>
  )
}
