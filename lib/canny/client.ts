/**
 * Canny.io API Client
 *
 * Feedback management integration for RocketOpp
 * API Docs: https://developers.canny.io/api-reference
 */

import jwt from 'jsonwebtoken'

const CANNY_API_BASE = 'https://canny.io/api/v1'
const CANNY_API_KEY = process.env.CANNY_API_KEY!
const CANNY_SSO_KEY = process.env.CANNY_SSO_KEY! // Private SSO key from Canny settings

// Generic fetch wrapper
async function cannyFetch<T>(
  endpoint: string,
  body: Record<string, any> = {}
): Promise<T> {
  const res = await fetch(`${CANNY_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CANNY_API_KEY, ...body }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `Canny API error: ${res.status}`)
  }

  return res.json()
}

// ============================================
// SSO TOKEN GENERATION
// ============================================

export interface CannyUser {
  id: string
  email: string
  name: string
  avatarURL?: string
  companies?: {
    id: string
    name: string
    monthlySpend?: number
    customFields?: Record<string, any>
  }[]
}

export function generateSSOToken(user: CannyUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarURL: user.avatarURL,
    companies: user.companies,
  }
  return jwt.sign(payload, CANNY_SSO_KEY, { algorithm: 'HS256' })
}

// ============================================
// BOARDS
// ============================================

export interface CannyBoard {
  id: string
  name: string
  postCount: number
  privateComments: boolean
  token: string
  url: string
  created: string
}

export const boards = {
  async list() {
    return cannyFetch<{ boards: CannyBoard[] }>('/boards/list')
  },

  async retrieve(id: string) {
    return cannyFetch<CannyBoard>('/boards/retrieve', { id })
  },
}

// ============================================
// POSTS (Feature Requests)
// ============================================

export interface CannyPost {
  id: string
  author: {
    id: string
    name: string
    email: string
    avatarURL?: string
  }
  board: CannyBoard
  category?: { id: string; name: string }
  commentCount: number
  title: string
  details: string
  eta?: string
  imageURLs: string[]
  score: number
  status: 'open' | 'under review' | 'planned' | 'in progress' | 'complete' | 'closed'
  statusChangedAt?: string
  tags: { id: string; name: string }[]
  url: string
  created: string
}

export const posts = {
  async list(params?: {
    boardID?: string
    authorID?: string
    status?: string
    tagID?: string
    search?: string
    sort?: 'newest' | 'oldest' | 'relevance' | 'score' | 'statusChanged' | 'trending'
    limit?: number
    skip?: number
  }) {
    return cannyFetch<{ posts: CannyPost[]; hasMore: boolean }>('/posts/list', params || {})
  },

  async retrieve(id: string) {
    return cannyFetch<CannyPost>('/posts/retrieve', { id })
  },

  async create(data: {
    authorID: string
    boardID: string
    title: string
    details?: string
    imageURLs?: string[]
  }) {
    return cannyFetch<{ id: string }>('/posts/create', data)
  },

  async changeStatus(postID: string, status: CannyPost['status'], changerID: string, commentValue?: string) {
    return cannyFetch<CannyPost>('/posts/change_status', {
      postID,
      status,
      changerID,
      commentValue,
    })
  },

  async addTag(postID: string, tagID: string) {
    return cannyFetch<{ tags: { id: string; name: string }[] }>('/posts/add_tag', { postID, tagID })
  },
}

// ============================================
// VOTES
// ============================================

export interface CannyVote {
  id: string
  board: { id: string }
  by?: { id: string; name: string }
  post: { id: string }
  voter: { id: string; name: string; email: string }
  created: string
}

export const votes = {
  async create(postID: string, voterID: string) {
    return cannyFetch<string>('/votes/create', { postID, voterID })
  },

  async delete(postID: string, voterID: string) {
    return cannyFetch<{ success: boolean }>('/votes/delete', { postID, voterID })
  },

  async list(params?: { postID?: string; userID?: string; limit?: number; skip?: number }) {
    return cannyFetch<{ votes: CannyVote[]; hasMore: boolean }>('/votes/list', params || {})
  },
}

// ============================================
// COMMENTS
// ============================================

export interface CannyComment {
  id: string
  author: { id: string; name: string; email: string; avatarURL?: string }
  board: { id: string }
  post: { id: string }
  value: string
  private: boolean
  created: string
}

export const comments = {
  async create(authorID: string, postID: string, value: string, isPrivate = false) {
    return cannyFetch<{ id: string }>('/comments/create', {
      authorID,
      postID,
      value,
      internal: isPrivate,
    })
  },

  async list(params: { boardID?: string; postID?: string; limit?: number; skip?: number }) {
    return cannyFetch<{ comments: CannyComment[]; hasMore: boolean }>('/comments/list', params)
  },

  async delete(commentID: string) {
    return cannyFetch<{ success: boolean }>('/comments/delete', { commentID })
  },
}

// ============================================
// USERS
// ============================================

export interface CannyUserFull {
  id: string
  avatarURL?: string
  created: string
  email: string
  isAdmin: boolean
  lastActivity?: string
  name: string
  url: string
  userID: string // Your internal user ID
}

export const users = {
  async createOrUpdate(user: {
    userID: string // Your internal user ID
    email: string
    name: string
    avatarURL?: string
    companies?: { id: string; name: string; monthlySpend?: number }[]
    customFields?: Record<string, any>
  }) {
    return cannyFetch<{ id: string }>('/users/create_or_update', user)
  },

  async retrieve(params: { id?: string; email?: string; userID?: string }) {
    return cannyFetch<CannyUserFull>('/users/retrieve', params)
  },

  async delete(id: string) {
    return cannyFetch<{ success: boolean }>('/users/delete', { id })
  },
}

// ============================================
// TAGS
// ============================================

export interface CannyTag {
  id: string
  board: { id: string }
  name: string
  postCount: number
  url: string
  created: string
}

export const tags = {
  async list(boardID: string) {
    return cannyFetch<{ tags: CannyTag[] }>('/tags/list', { boardID })
  },

  async create(boardID: string, name: string) {
    return cannyFetch<{ id: string }>('/tags/create', { boardID, name })
  },
}

// ============================================
// STATUS CHANGES
// ============================================

export const statusChanges = {
  async list(boardID: string, limit = 10, skip = 0) {
    return cannyFetch<{
      statusChanges: {
        id: string
        post: { id: string; title: string }
        status: string
        changer: { id: string; name: string }
        created: string
      }[]
      hasMore: boolean
    }>('/status_changes/list', { boardID, limit, skip })
  },
}

// ============================================
// CHANGELOG
// ============================================

export interface CannyChangelogEntry {
  id: string
  labels: { id: string; name: string }[]
  lastSaved: string
  markdownDetails: string
  plaintextDetails: string
  posts: { id: string; title: string }[]
  publishedAt?: string
  scheduledFor?: string
  status: 'draft' | 'scheduled' | 'published'
  title: string
  types: string[]
  url: string
  created: string
}

export const changelog = {
  async list(params?: { labelIDs?: string[]; type?: string; limit?: number; skip?: number }) {
    return cannyFetch<{ entries: CannyChangelogEntry[]; hasMore: boolean }>('/entries/list', params || {})
  },

  async create(data: {
    title: string
    details: string
    type?: 'new' | 'improved' | 'fixed'
    labelIDs?: string[]
    postIDs?: string[]
    notify?: boolean
    publishedOn?: string
    scheduledFor?: string
  }) {
    return cannyFetch<{ id: string }>('/entries/create', data)
  },
}

// ============================================
// EXPORT ALL
// ============================================

export const canny = {
  generateSSOToken,
  boards,
  posts,
  votes,
  comments,
  users,
  tags,
  statusChanges,
  changelog,
}

export default canny
