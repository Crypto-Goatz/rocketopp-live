"use client"

import { useState, useEffect, useRef } from 'react'
import {
  Rocket, Play, RefreshCw, CheckCircle2, XCircle, Clock,
  FileText, TrendingUp, Linkedin, AlertCircle, Loader2, Eye,
  Plus, Trash2, Send, Calendar, Upload, Download, Search,
  Filter, MoreVertical, ExternalLink, Edit, Clock3, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Social platform icons
const TwitterIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
const FacebookIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
const LinkedinIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>

interface BlogPost {
  id: string
  slug: string
  title: string
  category: string
  status: 'draft' | 'scheduled' | 'published'
  views: number
  published_at: string | null
  scheduled_at: string | null
  created_at: string
  meta_description?: string
  linkedin_posted: boolean
  twitter_posted: boolean
  facebook_posted: boolean
}

interface ContentStats {
  total_posts: number
  published: number
  scheduled: number
  drafts: number
  total_views: number
}

// Platform status indicator
function PlatformStatus({ posted }: { posted: boolean }) {
  if (posted) return <CheckCircle2 className="w-4 h-4 text-green-400" />
  return <Clock3 className="w-4 h-4 text-zinc-500" />
}

// Post Detail Modal
function PostDetailModal({
  post,
  onClose,
  onPublish,
  onDelete,
  onSchedule
}: {
  post: BlogPost
  onClose: () => void
  onPublish: () => void
  onDelete: () => void
  onSchedule: (date: string) => void
}) {
  const [scheduleDate, setScheduleDate] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              post.status === 'published' ? 'bg-green-500/20 text-green-400' :
              post.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
              'bg-zinc-700 text-zinc-300'
            }`}>
              {post.status.toUpperCase()}
            </span>
            <span className="text-sm text-zinc-500">{post.category}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">{post.title}</h2>

          {post.meta_description && (
            <p className="text-zinc-400 text-sm">{post.meta_description}</p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-zinc-400">
              <Eye className="w-4 h-4" /> {post.views.toLocaleString()} views
            </span>
            <span className="text-zinc-500">
              Created: {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Social Status */}
          <div className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-xl">
            <span className="text-sm text-zinc-400">Posted to:</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <LinkedinIcon />
                <PlatformStatus posted={post.linkedin_posted} />
              </div>
              <div className="flex items-center gap-1">
                <TwitterIcon />
                <PlatformStatus posted={post.twitter_posted} />
              </div>
              <div className="flex items-center gap-1">
                <FacebookIcon />
                <PlatformStatus posted={post.facebook_posted} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          {post.status === 'draft' && (
            <div className="p-4 bg-zinc-800/50 rounded-xl space-y-3">
              <label className="text-sm text-zinc-400 block">Schedule for later:</label>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white"
                />
                <Button
                  size="sm"
                  onClick={() => onSchedule(scheduleDate)}
                  disabled={!scheduleDate}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Schedule
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onDelete}
            className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <div className="flex items-center gap-3">
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener"
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors flex items-center gap-2 text-white"
            >
              <ExternalLink className="w-4 h-4" /> View
            </a>
            {post.status === 'draft' && (
              <Button
                onClick={onPublish}
                className="bg-green-500 hover:bg-green-600"
              >
                <Send className="w-4 h-4 mr-2" /> Publish Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// CSV Import Modal
function CSVImportModal({
  onClose,
  onImport
}: {
  onClose: () => void
  onImport: (posts: any[]) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

        const posts = lines.slice(1).map(line => {
          const values = line.split(',')
          const post: any = {}
          headers.forEach((header, i) => {
            post[header] = values[i]?.trim() || ''
          })
          return post
        }).filter(p => p.title)

        setCsvData(posts)
        setError(null)
      } catch (err) {
        setError('Failed to parse CSV file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-2xl max-w-xl w-full border border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-white">Import Blog Posts from CSV</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-zinc-800/50 rounded-xl border border-dashed border-zinc-600">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-center">
              <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/5 border-white/10 text-white"
              >
                Select CSV File
              </Button>
              <p className="text-xs text-zinc-500 mt-2">
                Required columns: title, content, category
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {csvData.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">{csvData.length} posts found:</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {csvData.map((post, i) => (
                  <div key={i} className="p-2 bg-zinc-800/50 rounded text-sm text-white truncate">
                    {post.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="bg-white/5 border-white/10 text-white">
            Cancel
          </Button>
          <Button
            onClick={() => onImport(csvData)}
            disabled={csvData.length === 0}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import {csvData.length} Posts
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ContentPipelineManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [stats, setStats] = useState<ContentStats>({
    total_posts: 0,
    published: 0,
    scheduled: 0,
    drafts: 0,
    total_views: 0
  })
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Get unique categories
  const categories = [...new Set(posts.map(p => p.category))].filter(Boolean)

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch('/api/content/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
        setStats(data.stats || stats)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function generateContent() {
    setGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/content/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      await fetchData()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  async function publishPost(postId: string) {
    try {
      const res = await fetch('/api/content/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action: 'publish' }),
      })

      if (res.ok) {
        await fetchData()
        setSelectedPost(null)
      }
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function schedulePost(postId: string, scheduledAt: string) {
    try {
      const res = await fetch('/api/content/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action: 'schedule', scheduled_at: scheduledAt }),
      })

      if (res.ok) {
        await fetchData()
        setSelectedPost(null)
      }
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function deletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const res = await fetch('/api/content/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })

      if (res.ok) {
        await fetchData()
        setSelectedPost(null)
      }
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function importCSV(csvPosts: any[]) {
    try {
      const res = await fetch('/api/content/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: csvPosts }),
      })

      if (res.ok) {
        await fetchData()
        setShowImport(false)
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Import failed')
      }
    } catch (e: any) {
      setError(e.message)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Modals */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onPublish={() => publishPost(selectedPost.id)}
          onDelete={() => deletePost(selectedPost.id)}
          onSchedule={(date) => schedulePost(selectedPost.id, date)}
        />
      )}
      {showImport && (
        <CSVImportModal
          onClose={() => setShowImport(false)}
          onImport={importCSV}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Content Engine</h1>
            <p className="text-sm text-zinc-400">SEO blog posts & social distribution</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImport(true)}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={generateContent}
            disabled={generating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Generate Post
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">Dismiss</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-zinc-900/50 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-zinc-500">Total Posts</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total_posts}</p>
        </div>
        <div className="bg-zinc-900/50 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs text-zinc-500">Published</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.published}</p>
        </div>
        <div className="bg-zinc-900/50 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-zinc-500">Scheduled</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.scheduled}</p>
        </div>
        <div className="bg-zinc-900/50 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-500">Drafts</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.drafts}</p>
        </div>
        <div className="bg-zinc-900/50 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-zinc-500">Total Views</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total_views.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800/50 border border-white/10 text-white placeholder:text-zinc-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-zinc-800/50 border border-white/10 text-white"
        >
          <option value="all">All Status</option>
          <option value="draft">Drafts</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-zinc-800/50 border border-white/10 text-white"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Posts Table */}
      <div className="bg-zinc-900/50 rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left text-sm text-zinc-400">
              <th className="px-4 py-3 font-medium">Post</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3 font-medium text-center">
                <LinkedinIcon />
              </th>
              <th className="px-4 py-3 font-medium text-center">
                <TwitterIcon />
              </th>
              <th className="px-4 py-3 font-medium text-center">
                <FacebookIcon />
              </th>
              <th className="px-4 py-3 font-medium text-center">Views</th>
              <th className="px-4 py-3 font-medium text-center">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-zinc-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading posts...
                </td>
              </tr>
            ) : filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-zinc-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No posts found. Generate your first post!
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <td className="px-4 py-4">
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate max-w-[300px]">{post.title}</p>
                      <p className="text-xs text-zinc-500">{post.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      post.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-zinc-700 text-zinc-300'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center" onClick={e => e.stopPropagation()}>
                    <PlatformStatus posted={post.linkedin_posted} />
                  </td>
                  <td className="px-4 py-4 text-center" onClick={e => e.stopPropagation()}>
                    <PlatformStatus posted={post.twitter_posted} />
                  </td>
                  <td className="px-4 py-4 text-center" onClick={e => e.stopPropagation()}>
                    <PlatformStatus posted={post.facebook_posted} />
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-zinc-400">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-zinc-400">
                    {formatDate(post.published_at || post.created_at)}
                  </td>
                  <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-zinc-400" />
                      </button>
                      {post.status === 'draft' && (
                        <button
                          onClick={() => publishPost(post.id)}
                          className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Publish"
                        >
                          <Send className="w-4 h-4 text-green-400" />
                        </button>
                      )}
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SEO Info */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          SEO-Optimized Content
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-zinc-400">
          <div>
            <p className="font-medium text-white mb-1">Schema.org Markup</p>
            <p>All posts include BlogPosting structured data for rich search results.</p>
          </div>
          <div>
            <p className="font-medium text-white mb-1">Meta Optimization</p>
            <p>Auto-generated titles, descriptions, and keywords for every post.</p>
          </div>
          <div>
            <p className="font-medium text-white mb-1">Social Distribution</p>
            <p>Posts automatically shared to LinkedIn, Twitter, and Facebook via GHL.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
