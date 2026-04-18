/**
 * Service-account access-token minting for Google APIs.
 * Uses signed JWT → exchange for OAuth2 bearer token.
 * Falls back gracefully if GOOGLE_SERVICE_ACCOUNT_JSON is missing.
 */

import jwt from 'jsonwebtoken'

interface ServiceAccount {
  type: string
  project_id: string
  private_key_id?: string
  private_key: string
  client_email: string
  client_id?: string
  token_uri?: string
}

interface TokenCache {
  token: string
  expiresAt: number
}

const cache = new Map<string, TokenCache>()

function loadServiceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) return null
  try {
    return JSON.parse(raw) as ServiceAccount
  } catch {
    return null
  }
}

/** Mint an OAuth access token for the given scope. Cached until 60s before expiry. */
export async function getGoogleAccessToken(scope: string): Promise<string | null> {
  const sa = loadServiceAccount()
  if (!sa) return null

  const cached = cache.get(scope)
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token

  const now = Math.floor(Date.now() / 1000)
  const claim = {
    iss: sa.client_email,
    scope,
    aud: sa.token_uri || 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }
  const assertion = jwt.sign(claim, sa.private_key, {
    algorithm: 'RS256',
    header: { alg: 'RS256', typ: 'JWT', kid: sa.private_key_id },
  })

  try {
    const res = await fetch(sa.token_uri || 'https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
    })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      console.error('[google/auth] token exchange failed:', res.status, txt.slice(0, 200))
      return null
    }
    const data = (await res.json()) as { access_token?: string; expires_in?: number }
    if (!data.access_token) return null
    cache.set(scope, {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
    })
    return data.access_token
  } catch (err) {
    console.error('[google/auth] token error:', err)
    return null
  }
}

export function getServiceAccountEmail(): string | null {
  return loadServiceAccount()?.client_email || null
}
