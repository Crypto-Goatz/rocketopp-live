-- Admin Migration for RocketOpp
-- Run this in Supabase SQL Editor

-- Add admin columns to users table
ALTER TABLE rocketopp_users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
ADD COLUMN IF NOT EXISTS fuel_credits INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS company_website TEXT,
ADD COLUMN IF NOT EXISTS company_size TEXT,
ADD COLUMN IF NOT EXISTS company_industry TEXT,
ADD COLUMN IF NOT EXISTS company_logo TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';

-- Set mike@rocketopp.com as superadmin
UPDATE rocketopp_users
SET is_admin = TRUE,
    role = 'superadmin',
    fuel_credits = 999999
WHERE email = 'mike@rocketopp.com';

-- If user doesn't exist, we'll need to create after they sign up
-- This ensures the admin flag is set

-- Create admin audit log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES rocketopp_users(id),
  action TEXT NOT NULL,
  entity_type TEXT, -- user, product, lead, etc.
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log(created_at DESC);

-- Create site settings table for CMS-like functionality
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_by UUID REFERENCES rocketopp_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value, description, category) VALUES
  ('site_name', '"RocketOpp"', 'Site name', 'branding'),
  ('site_tagline', '"We Build Tools That Work While You Sleep"', 'Site tagline', 'branding'),
  ('primary_color', '"#f97316"', 'Primary brand color', 'branding'),
  ('features_enabled', '{"analytics": true, "leads": true, "marketplace": true, "tools": true}', 'Feature toggles', 'features'),
  ('signup_bonus_fuel', '100', 'Fuel credits for new signups', 'rewards'),
  ('profile_complete_bonus', '500', 'Fuel credits for completing profile', 'rewards'),
  ('referral_bonus', '250', 'Fuel credits for referrals', 'rewards')
ON CONFLICT (key) DO NOTHING;

-- Create feature flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  description TEXT,
  rollout_percentage INTEGER DEFAULT 100, -- 0-100 for gradual rollout
  user_whitelist UUID[] DEFAULT '{}', -- Specific users who always have access
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO feature_flags (name, enabled, description) VALUES
  ('ai_tools', true, 'Enable AI tools in dashboard'),
  ('marketplace', true, 'Enable marketplace'),
  ('analytics_dashboard', true, 'Enable analytics dashboard'),
  ('leads_dashboard', true, 'Enable leads dashboard'),
  ('google_login', false, 'Enable Google OAuth login'),
  ('admin_portal', true, 'Enable admin portal')
ON CONFLICT (name) DO NOTHING;

-- Create API keys table for integrations
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES rocketopp_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL, -- Store hashed key
  key_prefix TEXT NOT NULL, -- First 8 chars for identification
  scopes TEXT[] DEFAULT '{}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix);

-- Create analytics tables if they don't exist (for admin_stats view)
CREATE TABLE IF NOT EXISTS analytics_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  name TEXT,
  phone TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_pageviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  session_id TEXT,
  path TEXT,
  referrer TEXT,
  device_type TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES rocketopp_users(id),
  product_id UUID,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- View for admin dashboard stats
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM rocketopp_users) as total_users,
  (SELECT COUNT(*) FROM rocketopp_users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_week,
  (SELECT COUNT(*) FROM rocketopp_users WHERE created_at > NOW() - INTERVAL '30 days') as new_users_month,
  (SELECT COUNT(*) FROM analytics_leads) as total_leads,
  (SELECT COUNT(*) FROM analytics_leads WHERE created_at > NOW() - INTERVAL '7 days') as new_leads_week,
  (SELECT COUNT(*) FROM user_purchases WHERE status = 'active') as active_subscriptions,
  (SELECT COUNT(*) FROM analytics_pageviews WHERE created_at > NOW() - INTERVAL '24 hours') as pageviews_today,
  (SELECT COUNT(DISTINCT visitor_id) FROM analytics_pageviews WHERE created_at > NOW() - INTERVAL '24 hours') as visitors_today;
