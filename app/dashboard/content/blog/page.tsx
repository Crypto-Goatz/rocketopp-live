'use client'

// ============================================================
// Blog Admin Dashboard
// ============================================================
// Manage blog posts, generate new content, view analytics
// ============================================================

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileText,
  Plus,
  Sparkles,
  Eye,
  Clock,
  Calendar,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Zap
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  reading_time: number
  views: number
  created_at: string
  published_at: string | null
}

interface PipelineRun {
  id: string
  status: string
  posts_generated: number
  created_at: string
  error: string | null
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateStatus, setGenerateStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Fetch posts and pipeline data
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/blog/generate')
      const data = await response.json()
      setPosts(data.recentPosts || [])
      setPipelineRuns(data.recentRuns || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Generate new post
  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerateStatus(null)

    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoPublish: true })
      })

      const data = await response.json()

      if (response.ok) {
        setGenerateStatus({
          type: 'success',
          message: `Generated: "${data.post.title}"`
        })
        // Refresh the list
        fetchData()
      } else {
        throw new Error(data.error || 'Generation failed')
      }
    } catch (error) {
      setGenerateStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to generate post'
      })
    }

    setIsGenerating(false)
  }

  // Delete post
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Status badge colors
  const statusColors = {
    draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    published: 'bg-green-500/10 text-green-400 border-green-500/20',
    scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    archived: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
  }

  // Calculate stats
  const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0)
  const publishedCount = posts.filter(p => p.status === 'published').length

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blog Management</h1>
            <p className="text-zinc-400">Manage posts, generate AI content, track performance</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Post
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Message */}
        {generateStatus && (
          <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
            generateStatus.type === 'success'
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            {generateStatus.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={generateStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}>
              {generateStatus.message}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <FileText className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-zinc-400 text-sm">Total Posts</span>
            </div>
            <p className="text-3xl font-bold">{posts.length}</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-zinc-400 text-sm">Published</span>
            </div>
            <p className="text-3xl font-bold">{publishedCount}</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-zinc-400 text-sm">Total Views</span>
            </div>
            <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-zinc-400 text-sm">Avg. Views</span>
            </div>
            <p className="text-3xl font-bold">
              {posts.length > 0 ? Math.round(totalViews / posts.length) : 0}
            </p>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-500" />
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
              <p className="text-zinc-500 mb-4">No posts yet</p>
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Generate your first post
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="p-5 flex items-center gap-4 hover:bg-white/5 transition-colors"
                >
                  {/* Title & Slug */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-500 truncate">
                      /blog/{post.slug}
                    </p>
                  </div>

                  {/* Category */}
                  <div className="hidden md:block">
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-400">
                      {post.category}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${statusColors[post.status]}`}>
                      {post.status}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.reading_time}m
                    </span>
                  </div>

                  {/* Date */}
                  <div className="hidden md:block text-sm text-zinc-500 w-40 text-right">
                    {formatDate(post.created_at)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      title="View"
                    >
                      <ExternalLink className="w-4 h-4 text-zinc-400" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pipeline History */}
        {pipelineRuns.length > 0 && (
          <div className="mt-8 bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h2 className="text-lg font-semibold">Generation History</h2>
            </div>
            <div className="divide-y divide-white/5">
              {pipelineRuns.map(run => (
                <div key={run.id} className="p-4 flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    run.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300">
                      {run.status === 'success'
                        ? `Generated ${run.posts_generated} post(s)`
                        : run.error || 'Generation failed'
                      }
                    </p>
                  </div>
                  <p className="text-sm text-zinc-500">
                    {formatDate(run.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Link
            href="/blog"
            target="_blank"
            className="p-5 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-orange-500/30 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <ExternalLink className="w-5 h-5 text-orange-400" />
              <span className="font-medium group-hover:text-orange-400 transition-colors">
                View Live Blog
              </span>
            </div>
            <p className="text-sm text-zinc-500">See the public blog page</p>
          </Link>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="p-5 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-orange-500/30 transition-colors group text-left disabled:opacity-50"
          >
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="font-medium group-hover:text-purple-400 transition-colors">
                Quick Generate
              </span>
            </div>
            <p className="text-sm text-zinc-500">Generate new AI content now</p>
          </button>
          <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <span className="font-medium text-orange-400">Daily Automation</span>
            </div>
            <p className="text-sm text-zinc-400">
              Auto-generates every day at 6:00 AM UTC
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
