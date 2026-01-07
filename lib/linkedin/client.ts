/**
 * LinkedIn API Client
 *
 * Handles OAuth and posting to LinkedIn
 * Docs: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
 */

import { supabaseAdmin } from '@/lib/db/supabase'

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!
const LINKEDIN_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`

// ============================================
// TYPES
// ============================================

export interface LinkedInProfile {
  id: string
  localizedFirstName: string
  localizedLastName: string
  profilePicture?: {
    displayImage: string
  }
}

export interface LinkedInConnection {
  id: string
  linkedin_id: string
  name: string
  email?: string
  avatar_url?: string
  access_token: string
  refresh_token?: string
  expires_at: Date
}

export interface PostResult {
  success: boolean
  postId?: string
  error?: string
}

// ============================================
// OAUTH
// ============================================

export function getAuthorizationUrl(state: string): string {
  const scopes = ['openid', 'profile', 'email', 'w_member_social'].join(' ')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    state,
    scope: scopes,
  })

  return `https://www.linkedin.com/oauth/v2/authorization?${params}`
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string
  expires_in: number
  refresh_token?: string
}> {
  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: LINKEDIN_REDIRECT_URI,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`LinkedIn token exchange failed: ${error}`)
  }

  return res.json()
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string
  expires_in: number
  refresh_token?: string
}> {
  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  })

  if (!res.ok) {
    throw new Error('LinkedIn token refresh failed')
  }

  return res.json()
}

// ============================================
// PROFILE
// ============================================

export async function getProfile(accessToken: string): Promise<LinkedInProfile> {
  const res = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch LinkedIn profile')
  }

  const data = await res.json()

  return {
    id: data.sub,
    localizedFirstName: data.given_name || '',
    localizedLastName: data.family_name || '',
    profilePicture: data.picture ? { displayImage: data.picture } : undefined,
  }
}

// ============================================
// POSTING
// ============================================

export async function createPost(
  accessToken: string,
  authorId: string, // LinkedIn URN like "urn:li:person:xxxxx"
  text: string,
  link?: { url: string; title?: string; description?: string }
): Promise<PostResult> {
  // Build the post body
  const postBody: any = {
    author: authorId.startsWith('urn:') ? authorId : `urn:li:person:${authorId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text,
        },
        shareMediaCategory: link ? 'ARTICLE' : 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  }

  // Add link if provided
  if (link) {
    postBody.specificContent['com.linkedin.ugc.ShareContent'].media = [
      {
        status: 'READY',
        originalUrl: link.url,
        title: link.title ? { text: link.title } : undefined,
        description: link.description ? { text: link.description } : undefined,
      },
    ]
  }

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202401',
    },
    body: JSON.stringify(postBody),
  })

  if (!res.ok) {
    const error = await res.text()
    console.error('LinkedIn post failed:', error)
    return { success: false, error }
  }

  const data = await res.json()
  return { success: true, postId: data.id }
}

// ============================================
// CONNECTION MANAGEMENT
// ============================================

export async function getActiveConnection(userId: string): Promise<LinkedInConnection | null> {
  const { data, error } = await supabaseAdmin
    .from('linkedin_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (error || !data) return null

  // Check if token is expired
  if (new Date(data.expires_at) < new Date()) {
    // Try to refresh
    if (data.refresh_token) {
      try {
        const newTokens = await refreshAccessToken(data.refresh_token)
        const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000)

        await supabaseAdmin
          .from('linkedin_connections')
          .update({
            access_token: newTokens.access_token,
            refresh_token: newTokens.refresh_token || data.refresh_token,
            expires_at: expiresAt.toISOString(),
          })
          .eq('id', data.id)

        return {
          ...data,
          access_token: newTokens.access_token,
          expires_at: expiresAt,
        }
      } catch (e) {
        console.error('Failed to refresh LinkedIn token:', e)
        return null
      }
    }
    return null
  }

  return data
}

export async function saveConnection(
  userId: string,
  linkedinId: string,
  name: string,
  email: string | undefined,
  avatarUrl: string | undefined,
  accessToken: string,
  refreshToken: string | undefined,
  expiresIn: number
): Promise<void> {
  const expiresAt = new Date(Date.now() + expiresIn * 1000)

  await supabaseAdmin.from('linkedin_connections').upsert(
    {
      user_id: userId,
      linkedin_id: linkedinId,
      name,
      email,
      avatar_url: avatarUrl,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt.toISOString(),
      is_active: true,
    },
    { onConflict: 'user_id' }
  )
}

// ============================================
// EXPORT
// ============================================

export const linkedin = {
  getAuthorizationUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  getProfile,
  createPost,
  getActiveConnection,
  saveConnection,
}

export default linkedin
