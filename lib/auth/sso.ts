import { randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/db/supabase'

const SSO_TOKEN_DURATION = 5 * 60 * 1000 // 5 minutes (short-lived for security)

export type SSOProduct = 'sxo' | 'rocket-plus' | 'mcpfed' | 'cro9' | 'rocketpost' | 'botcoaches' | 'rocketeq'

export interface SSOTokenPayload {
  userId: string
  email: string
  name: string | null
  product: SSOProduct
}

/**
 * Generate a short-lived SSO token for cross-product authentication
 */
export async function generateSSOToken(
  userId: string,
  product: SSOProduct,
  ip?: string
): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SSO_TOKEN_DURATION)

  await supabaseAdmin.from('rocketopp_sso_tokens').insert({
    user_id: userId,
    token,
    product,
    expires_at: expiresAt.toISOString(),
    ip_address: ip
  })

  return token
}

/**
 * Validate and consume an SSO token (one-time use)
 */
export async function validateSSOToken(
  token: string,
  product: SSOProduct
): Promise<SSOTokenPayload | null> {
  // Get and delete token in one transaction
  const { data: ssoToken } = await supabaseAdmin
    .from('rocketopp_sso_tokens')
    .select('user_id, product, expires_at, used_at')
    .eq('token', token)
    .eq('product', product)
    .single()

  if (!ssoToken) return null

  // Check if already used
  if (ssoToken.used_at) return null

  // Check if expired
  if (new Date(ssoToken.expires_at) < new Date()) {
    // Clean up expired token
    await supabaseAdmin.from('rocketopp_sso_tokens').delete().eq('token', token)
    return null
  }

  // Mark as used
  await supabaseAdmin
    .from('rocketopp_sso_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)

  // Get user data
  const { data: user } = await supabaseAdmin
    .from('rocketopp_users')
    .select('id, email, name')
    .eq('id', ssoToken.user_id)
    .single()

  if (!user) return null

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    product
  }
}

/**
 * Get SSO redirect URL for a product
 */
export function getSSORedirectUrl(product: SSOProduct, token: string): string {
  const productUrls: Record<SSOProduct, string> = {
    'sxo': 'https://sxowebsite.com',
    'rocket-plus': 'https://rocketadd.com',
    'mcpfed': 'https://mcpfed.com',
    'cro9': 'https://cro9.io',
    'rocketpost': 'https://rocketpost.ai',
    'botcoaches': 'https://botcoaches.com',
    'rocketeq': 'https://rocketeq.com'
  }

  const baseUrl = productUrls[product] || productUrls['rocket-plus']
  return `${baseUrl}/api/auth/sso?token=${token}`
}

/**
 * Clean up expired SSO tokens (run periodically)
 */
export async function cleanupExpiredSSOTokens(): Promise<number> {
  const { count } = await supabaseAdmin
    .from('rocketopp_sso_tokens')
    .delete()
    .lt('expires_at', new Date().toISOString())

  return count || 0
}
