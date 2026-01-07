import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client with service role
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Client-side client (anon key)
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Types for our database tables
export interface RocketOppUser {
  id: string
  email: string
  name: string | null
  password_hash: string
  created_at: string
  updated_at: string
  stripe_customer_id: string | null
  subscription_status: 'free' | 'pro' | 'agency' | null
  subscription_tier: string | null
  // Admin fields
  is_admin: boolean
  role: 'user' | 'admin' | 'superadmin'
  fuel_credits: number
  phone: string | null
  job_title: string | null
  company_name: string | null
  company_website: string | null
  company_size: string | null
  company_industry: string | null
  company_logo: string | null
  tags: string[]
  profile_complete: boolean
  last_login_at: string | null
  settings: Record<string, unknown>
  // OAuth fields
  google_id: string | null
  auth_provider: 'email' | 'google' | null
  avatar_url: string | null
}

export interface MarketplaceProduct {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  long_description: string | null
  category: string
  price: number
  price_type: 'one_time' | 'subscription' | 'lease_to_own'
  lease_terms: {
    monthly_payment: number
    total_months: number
    buyout_price: number
  } | null
  stripe_price_id: string | null
  stripe_product_id: string | null
  features: string[]
  images: string[]
  demo_url: string | null
  docs_url: string | null
  status: 'draft' | 'active' | 'coming_soon' | 'archived'
  is_featured: boolean
  seller_id: string | null
  downloads: number
  rating: number | null
  created_at: string
  updated_at: string
  seo_title: string | null
  seo_description: string | null
  schema_type: string | null
}

export interface UserPurchase {
  id: string
  user_id: string
  product_id: string
  purchase_type: 'one_time' | 'subscription' | 'lease_to_own'
  status: 'active' | 'cancelled' | 'completed' | 'pending'
  stripe_subscription_id: string | null
  lease_payments_made: number | null
  lease_total_payments: number | null
  purchased_at: string
  expires_at: string | null
}

export interface PluginInstall {
  id: string
  user_id: string
  product_id: string
  plugin_id: string
  config: Record<string, unknown>
  enabled: boolean
  installed_at: string
}
