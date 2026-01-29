// ============================================================
// Video Embed Component with Schema
// ============================================================
// Responsive YouTube/video embeds with VideoObject schema
// SXO-optimized for rich snippets
// ============================================================

import { Play, ExternalLink } from 'lucide-react'
import { VideoSchema } from './json-ld'

interface VideoEmbedProps {
  // YouTube URL or video ID
  youtubeUrl?: string
  videoId?: string
  // Metadata for schema
  title: string
  description: string
  thumbnailUrl?: string
  uploadDate?: string
  duration?: string // ISO 8601 (e.g., "PT5M30S")
  // Display options
  aspectRatio?: '16:9' | '4:3' | '1:1'
  showSchema?: boolean
  autoplay?: boolean
  className?: string
}

// Extract video ID from various YouTube URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

export function VideoEmbed({
  youtubeUrl,
  videoId,
  title,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  aspectRatio = '16:9',
  showSchema = true,
  autoplay = false,
  className = ''
}: VideoEmbedProps) {
  // Get video ID from URL or prop
  const id = videoId || (youtubeUrl ? extractYouTubeId(youtubeUrl) : null)

  if (!id) {
    console.warn('VideoEmbed: No valid YouTube URL or video ID provided')
    return null
  }

  // Generate URLs
  const embedUrl = `https://www.youtube.com/embed/${id}${autoplay ? '?autoplay=1' : ''}`
  const watchUrl = `https://www.youtube.com/watch?v=${id}`
  const thumbnail = thumbnailUrl || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`

  // Aspect ratio classes
  const aspectClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Video Schema */}
      {showSchema && (
        <VideoSchema
          name={title}
          description={description}
          thumbnailUrl={thumbnail}
          uploadDate={uploadDate || new Date().toISOString().split('T')[0]}
          duration={duration}
          embedUrl={embedUrl}
          contentUrl={watchUrl}
        />
      )}

      {/* Video Container */}
      <div className={`relative w-full ${aspectClasses[aspectRatio]} rounded-2xl overflow-hidden bg-zinc-900 border border-white/10`}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>

      {/* Video Title & Link */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-zinc-500 line-clamp-2">{description}</p>
        </div>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          title="Watch on YouTube"
        >
          <ExternalLink className="w-4 h-4 text-zinc-400" />
        </a>
      </div>
    </div>
  )
}

// Lazy-loading video thumbnail that loads iframe on click
interface LazyVideoEmbedProps extends Omit<VideoEmbedProps, 'autoplay'> {
  playButtonSize?: 'sm' | 'md' | 'lg'
}

export function LazyVideoEmbed({
  youtubeUrl,
  videoId,
  title,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  aspectRatio = '16:9',
  showSchema = true,
  playButtonSize = 'lg',
  className = ''
}: LazyVideoEmbedProps) {
  const id = videoId || (youtubeUrl ? extractYouTubeId(youtubeUrl) : null)

  if (!id) return null

  const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`
  const watchUrl = `https://www.youtube.com/watch?v=${id}`
  const thumbnail = thumbnailUrl || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`

  const aspectClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square'
  }

  const playButtonSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  const playIconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`relative ${className}`}>
      {showSchema && (
        <VideoSchema
          name={title}
          description={description}
          thumbnailUrl={thumbnail}
          uploadDate={uploadDate || new Date().toISOString().split('T')[0]}
          duration={duration}
          embedUrl={embedUrl}
          contentUrl={watchUrl}
        />
      )}

      {/* Clickable thumbnail that becomes iframe */}
      <div className={`relative w-full ${aspectClasses[aspectRatio]} rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer`}>
        {/* Thumbnail */}
        <img
          src={thumbnail}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

        {/* Play Button */}
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${playButtonSizes[playButtonSize]} rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform`}
        >
          <Play className={`${playIconSizes[playButtonSize]} text-white ml-1`} fill="white" />
        </a>

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-xs font-medium">
            {formatDuration(duration)}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-500 line-clamp-2">{description}</p>
      </div>
    </div>
  )
}

// Helper to format ISO 8601 duration to readable format
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return isoDuration

  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Video Gallery for multiple videos
interface VideoGalleryProps {
  videos: Array<{
    youtubeUrl: string
    title: string
    description: string
    duration?: string
    uploadDate?: string
  }>
  title?: string
  subtitle?: string
  columns?: 1 | 2 | 3
}

export function VideoGallery({
  videos,
  title = 'Featured Videos',
  subtitle,
  columns = 2
}: VideoGalleryProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-zinc-400">{subtitle}</p>}
        </div>

        <div className={`grid ${gridCols[columns]} gap-8 max-w-5xl mx-auto`}>
          {videos.map((video, index) => (
            <LazyVideoEmbed
              key={index}
              youtubeUrl={video.youtubeUrl}
              title={video.title}
              description={video.description}
              duration={video.duration}
              uploadDate={video.uploadDate}
              showSchema={index === 0} // Only first video gets schema to avoid duplication
            />
          ))}
        </div>
      </div>
    </section>
  )
}
