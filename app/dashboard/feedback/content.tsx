"use client"

import { useState, useEffect } from 'react'
import { Lightbulb, TrendingUp, Clock, CheckCircle2, Loader2, ExternalLink, ThumbsUp, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeedbackWidget } from '@/components/canny/feedback-widget'

// Get board token from env or use placeholder
const BOARD_TOKEN = process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN || ''

interface Post {
  id: string
  title: string
  details: string
  score: number
  commentCount: number
  status: string
  url: string
  created: string
  author: {
    name: string
    avatarURL?: string
  }
}

export function FeedbackPageContent() {
  const [view, setView] = useState<'widget' | 'api'>('widget')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch posts via API (alternative to widget)
  useEffect(() => {
    if (view === 'api') {
      fetchPosts()
    }
  }, [view])

  async function fetchPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/canny/posts?sort=trending&limit=20')
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'in progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'planned': return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
      case 'under review': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="w-3 h-3" />
      case 'in progress': return <TrendingUp className="w-3 h-3" />
      case 'planned': return <Clock className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Feature Requests</h1>
            <p className="text-sm text-zinc-400">Vote on ideas and share your feedback</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant={view === 'widget' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('widget')}
          className={view === 'widget'
            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0'
            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
          }
        >
          Full Board
        </Button>
        <Button
          variant={view === 'api' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('api')}
          className={view === 'api'
            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0'
            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
          }
        >
          Compact View
        </Button>
      </div>

      {/* Content */}
      {view === 'widget' ? (
        <div className="bg-zinc-900/50 rounded-2xl border border-white/10 overflow-hidden">
          {BOARD_TOKEN ? (
            <FeedbackWidget boardToken={BOARD_TOKEN} basePath="/dashboard/feedback" theme="dark" />
          ) : (
            <div className="p-12 text-center">
              <Lightbulb className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Feedback Board Coming Soon</h3>
              <p className="text-zinc-400 text-sm max-w-md mx-auto">
                We&apos;re setting up our feedback system. Soon you&apos;ll be able to submit ideas and vote on features!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-zinc-900/50 rounded-2xl border border-white/10 p-12 text-center">
              <Lightbulb className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No feature requests yet</h3>
              <p className="text-zinc-400 text-sm">Be the first to suggest an idea!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-zinc-900/50 rounded-xl border border-white/10 p-4 hover:border-orange-500/30 transition-all group"
              >
                <div className="flex gap-4">
                  {/* Vote Count */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button className="w-10 h-10 rounded-lg bg-white/5 hover:bg-orange-500/20 flex items-center justify-center transition-colors group-hover:border-orange-500/30 border border-transparent">
                      <ThumbsUp className="w-4 h-4 text-zinc-400 group-hover:text-orange-400" />
                    </button>
                    <span className="text-sm font-medium text-white">{post.score}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-medium group-hover:text-orange-400 transition-colors">
                          {post.title}
                        </h3>
                        {post.details && (
                          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                            {post.details.replace(/<[^>]*>/g, '')}
                          </p>
                        )}
                      </div>
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-orange-400 transition-colors flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-3">
                      {post.status && post.status !== 'open' && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${getStatusColor(post.status)}`}>
                          {getStatusIcon(post.status)}
                          {post.status}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                        <MessageSquare className="w-3 h-3" />
                        {post.commentCount}
                      </span>
                      <span className="text-xs text-zinc-600">
                        by {post.author?.name || 'Anonymous'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20 p-4">
        <h4 className="text-white font-medium mb-1">How it works</h4>
        <ul className="text-sm text-zinc-400 space-y-1">
          <li>• Submit your ideas for new features</li>
          <li>• Vote on ideas you&apos;d like to see built</li>
          <li>• Track progress as we ship updates</li>
          <li>• Get notified when your ideas are completed</li>
        </ul>
      </div>
    </div>
  )
}
