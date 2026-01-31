import { createClient } from '@supabase/supabase-js'

// Admin client with service role key for server-side operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Public client for client-side operations (if needed)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Type definitions
export interface RocketOppUser {
  id: string
  email: string
  name: string | null
  password_hash: string
  created_at: string
  updated_at: string
  stripe_customer_id: string | null
  subscription_status: 'free' | 'pro' | 'agency'
  subscription_tier: string | null
  avatar_url: string | null
  bio: string | null
  is_seller: boolean
  seller_verified: boolean
  fuel_credits: number
  company: string | null
  phone: string | null
  google_id: string | null
  email_verified: boolean
}
