import { createClient } from '@supabase/supabase-js'
import { getSession } from './session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type UserRole = 'user' | 'admin' | 'superadmin'

export interface AdminUser {
  id: string
  email: string
  name: string | null
  is_admin: boolean
  role: UserRole
  fuel_credits: number
  phone?: string
  job_title?: string
  company_name?: string
  company_website?: string
  company_size?: string
  company_industry?: string
  company_logo?: string
  tags?: string[]
  profile_complete: boolean
  last_login_at?: string
  settings?: Record<string, any>
  created_at: string
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const session = await getSession()
  if (!session) return null

  const { data: user } = await supabase
    .from('rocketopp_users')
    .select('*')
    .eq('id', session.id)
    .single()

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    is_admin: user.is_admin || false,
    role: user.role || 'user',
    fuel_credits: user.fuel_credits || 100,
    phone: user.phone,
    job_title: user.job_title,
    company_name: user.company_name,
    company_website: user.company_website,
    company_size: user.company_size,
    company_industry: user.company_industry,
    company_logo: user.company_logo,
    tags: user.tags || [],
    profile_complete: user.profile_complete || false,
    last_login_at: user.last_login_at,
    settings: user.settings || {},
    created_at: user.created_at,
  }
}

export async function isAdmin(): Promise<boolean> {
  const user = await getAdminUser()
  return user?.is_admin === true || user?.role === 'admin' || user?.role === 'superadmin'
}

export async function isSuperAdmin(): Promise<boolean> {
  const user = await getAdminUser()
  return user?.role === 'superadmin'
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser()
  if (!user || (!user.is_admin && user.role !== 'admin' && user.role !== 'superadmin')) {
    throw new Error('Unauthorized: Admin access required')
  }
  return user
}

export async function requireSuperAdmin(): Promise<AdminUser> {
  const user = await getAdminUser()
  if (!user || user.role !== 'superadmin') {
    throw new Error('Unauthorized: Superadmin access required')
  }
  return user
}

// Audit logging
export async function logAdminAction(
  adminId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, any>,
  ipAddress?: string
) {
  await supabase.from('admin_audit_log').insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
    ip_address: ipAddress,
  })
}

// Site settings
export async function getSiteSetting(key: string): Promise<any> {
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()

  return data?.value
}

export async function setSiteSetting(
  key: string,
  value: any,
  adminId: string,
  description?: string,
  category?: string
): Promise<void> {
  await supabase
    .from('site_settings')
    .upsert({
      key,
      value,
      description,
      category,
      updated_by: adminId,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'key'
    })
}

export async function getAllSiteSettings(): Promise<Record<string, any>> {
  const { data } = await supabase
    .from('site_settings')
    .select('key, value, description, category')
    .order('category')

  const settings: Record<string, any> = {}
  data?.forEach(row => {
    settings[row.key] = {
      value: row.value,
      description: row.description,
      category: row.category,
    }
  })

  return settings
}

// Feature flags
export async function getFeatureFlag(name: string, userId?: string): Promise<boolean> {
  const { data } = await supabase
    .from('feature_flags')
    .select('*')
    .eq('name', name)
    .single()

  if (!data || !data.enabled) return false

  // Check user whitelist
  if (userId && data.user_whitelist?.includes(userId)) {
    return true
  }

  // Check rollout percentage
  if (data.rollout_percentage < 100) {
    // Simple deterministic rollout based on user ID
    if (userId) {
      const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      return (hash % 100) < data.rollout_percentage
    }
    return false
  }

  return true
}

export async function getAllFeatureFlags(): Promise<Array<{
  name: string
  enabled: boolean
  description: string | null
  rollout_percentage: number
}>> {
  const { data } = await supabase
    .from('feature_flags')
    .select('name, enabled, description, rollout_percentage')
    .order('name')

  return data || []
}

export async function setFeatureFlag(
  name: string,
  enabled: boolean,
  rolloutPercentage?: number
): Promise<void> {
  await supabase
    .from('feature_flags')
    .update({
      enabled,
      rollout_percentage: rolloutPercentage ?? 100,
      updated_at: new Date().toISOString(),
    })
    .eq('name', name)
}

// Admin stats
export async function getAdminStats(): Promise<{
  total_users: number
  new_users_week: number
  new_users_month: number
  total_leads: number
  new_leads_week: number
  active_subscriptions: number
  pageviews_today: number
  visitors_today: number
}> {
  const { data } = await supabase
    .from('admin_stats')
    .select('*')
    .single()

  return data || {
    total_users: 0,
    new_users_week: 0,
    new_users_month: 0,
    total_leads: 0,
    new_leads_week: 0,
    active_subscriptions: 0,
    pageviews_today: 0,
    visitors_today: 0,
  }
}

// User management
export async function getAllUsers(limit = 50, offset = 0): Promise<{
  users: AdminUser[]
  total: number
}> {
  const { data, count } = await supabase
    .from('rocketopp_users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return {
    users: data || [],
    total: count || 0,
  }
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
  isAdmin: boolean,
  adminId: string
): Promise<void> {
  await supabase
    .from('rocketopp_users')
    .update({
      role,
      is_admin: isAdmin,
    })
    .eq('id', userId)

  await logAdminAction(adminId, 'update_user_role', 'user', userId, { role, is_admin: isAdmin })
}

export async function updateUserFuel(
  userId: string,
  fuelCredits: number,
  adminId: string
): Promise<void> {
  await supabase
    .from('rocketopp_users')
    .update({ fuel_credits: fuelCredits })
    .eq('id', userId)

  await logAdminAction(adminId, 'update_fuel_credits', 'user', userId, { fuel_credits: fuelCredits })
}
