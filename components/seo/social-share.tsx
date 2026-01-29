// ============================================================
// Social Share Buttons Component
// ============================================================
// Reusable social sharing component for blog posts and content
// Supports: LinkedIn, Twitter/X, Facebook, Copy Link
// ============================================================

'use client'

import { useState } from 'react'
import {
  Linkedin,
  Twitter,
  Facebook,
  Link2,
  Check,
  Share2,
  Mail
} from 'lucide-react'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  variant?: 'horizontal' | 'vertical' | 'compact'
  showLabels?: boolean
  className?: string
}

export function SocialShare({
  url,
  title,
  description = '',
  variant = 'horizontal',
  showLabels = true,
  className = ''
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const buttonBaseClass = variant === 'compact'
    ? 'p-2 rounded-lg'
    : 'flex items-center gap-2 px-4 py-2 rounded-xl'

  const containerClass = variant === 'vertical'
    ? 'flex flex-col gap-2'
    : 'flex flex-wrap items-center gap-2'

  return (
    <div className={`${containerClass} ${className}`}>
      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBaseClass} bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors`}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
        {showLabels && variant !== 'compact' && <span className="text-sm font-medium">LinkedIn</span>}
      </a>

      {/* Twitter/X */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBaseClass} bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors`}
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
        {showLabels && variant !== 'compact' && <span className="text-sm font-medium">Twitter</span>}
      </a>

      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBaseClass} bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors`}
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
        {showLabels && variant !== 'compact' && <span className="text-sm font-medium">Facebook</span>}
      </a>

      {/* Email */}
      <a
        href={shareLinks.email}
        className={`${buttonBaseClass} bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors`}
        aria-label="Share via Email"
      >
        <Mail className="w-4 h-4" />
        {showLabels && variant !== 'compact' && <span className="text-sm font-medium">Email</span>}
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`${buttonBaseClass} bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors`}
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            {showLabels && variant !== 'compact' && <span className="text-sm font-medium text-green-400">Copied!</span>}
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            {showLabels && variant !== 'compact' && <span className="text-sm font-medium">Copy Link</span>}
          </>
        )}
      </button>
    </div>
  )
}

// Share Section with Title
interface ShareSectionProps {
  url: string
  title: string
  description?: string
  sectionTitle?: string
}

export function ShareSection({
  url,
  title,
  description,
  sectionTitle = 'Share this article'
}: ShareSectionProps) {
  return (
    <div className="pt-8 border-t border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-zinc-400 flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          {sectionTitle}
        </p>
        <SocialShare
          url={url}
          title={title}
          description={description}
          variant="horizontal"
          showLabels={true}
        />
      </div>
    </div>
  )
}

// Floating Share Bar (for long-form content)
interface FloatingShareBarProps {
  url: string
  title: string
  position?: 'left' | 'right'
}

export function FloatingShareBar({
  url,
  title,
  position = 'left'
}: FloatingShareBarProps) {
  const positionClass = position === 'left'
    ? 'left-4 lg:left-8'
    : 'right-4 lg:right-8'

  return (
    <div className={`fixed ${positionClass} top-1/2 -translate-y-1/2 z-40 hidden xl:block`}>
      <div className="flex flex-col gap-2 p-2 rounded-2xl bg-zinc-900/80 backdrop-blur-sm border border-white/10">
        <SocialShare
          url={url}
          title={title}
          variant="vertical"
          showLabels={false}
        />
      </div>
    </div>
  )
}

// Native Share Button (uses Web Share API if available)
interface NativeShareButtonProps {
  url: string
  title: string
  description?: string
  className?: string
}

export function NativeShareButton({
  url,
  title,
  description = '',
  className = ''
}: NativeShareButtonProps) {
  const [showFallback, setShowFallback] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        })
      } catch (err) {
        // User cancelled or error - show fallback
        if ((err as Error).name !== 'AbortError') {
          setShowFallback(true)
        }
      }
    } else {
      setShowFallback(true)
    }
  }

  if (showFallback) {
    return (
      <div className={className}>
        <SocialShare url={url} title={title} description={description} variant="compact" />
      </div>
    )
  }

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors ${className}`}
    >
      <Share2 className="w-4 h-4" />
      <span className="text-sm font-medium">Share</span>
    </button>
  )
}
