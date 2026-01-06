-- RocketOpp Marketplace Database Schema
-- Run this in Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS rocketopp_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro', 'agency')),
  subscription_tier TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_seller BOOLEAN DEFAULT FALSE,
  seller_verified BOOLEAN DEFAULT FALSE
);

-- Sessions table for auth
CREATE TABLE IF NOT EXISTS rocketopp_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES rocketopp_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Marketplace products
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  price_type TEXT NOT NULL CHECK (price_type IN ('one_time', 'subscription', 'lease_to_own')),
  lease_terms JSONB, -- { monthly_payment, total_months, buyout_price }
  stripe_price_id TEXT,
  stripe_product_id TEXT,

  -- Features & media
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  demo_url TEXT,
  docs_url TEXT,
  github_url TEXT,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'coming_soon', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,

  -- Seller
  seller_id UUID REFERENCES rocketopp_users(id),
  is_rocketopp_product BOOLEAN DEFAULT TRUE, -- Our products vs third-party

  -- Stats
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1),
  review_count INTEGER DEFAULT 0,

  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  schema_type TEXT DEFAULT 'SoftwareApplication',

  -- Tech specs
  tech_stack TEXT[],
  ai_providers TEXT[], -- ['claude', 'openai', 'local']
  integrations TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- User purchases
CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES rocketopp_users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES marketplace_products(id),
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('one_time', 'subscription', 'lease_to_own')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'cancelled', 'completed', 'pending', 'expired')),

  -- Stripe
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,

  -- Lease tracking
  lease_payments_made INTEGER DEFAULT 0,
  lease_total_payments INTEGER,
  lease_next_payment_date TIMESTAMPTZ,
  lease_owned BOOLEAN DEFAULT FALSE,

  -- Timestamps
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Plugin system for extensibility
CREATE TABLE IF NOT EXISTS product_plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0.0',
  config_schema JSONB, -- JSON Schema for plugin config
  is_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User plugin installations
CREATE TABLE IF NOT EXISTS user_plugin_installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES rocketopp_users(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES user_purchases(id) ON DELETE CASCADE,
  plugin_id UUID REFERENCES product_plugins(id) ON DELETE CASCADE,
  config JSONB DEFAULT '{}',
  enabled BOOLEAN DEFAULT TRUE,
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plugin_id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES rocketopp_users(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES user_purchases(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Categories for SEO
CREATE TABLE IF NOT EXISTS marketplace_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES marketplace_categories(id),
  seo_title TEXT,
  seo_description TEXT,
  product_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON marketplace_products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON marketplace_products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON marketplace_products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON marketplace_products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_purchases_user ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_product ON user_purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON rocketopp_sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON rocketopp_sessions(user_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON rocketopp_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON marketplace_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert initial categories
INSERT INTO marketplace_categories (slug, name, description, icon, sort_order) VALUES
  ('ai-agents', 'AI Agents', 'Autonomous AI agents that handle business operations', 'Bot', 1),
  ('automation', 'Automation Tools', 'Workflow automation and process optimization', 'Zap', 2),
  ('crm', 'CRM Extensions', 'Customer relationship management enhancements', 'Users', 3),
  ('marketing', 'Marketing Tools', 'Content, social media, and marketing automation', 'Megaphone', 4),
  ('analytics', 'Analytics & Insights', 'Data analysis and business intelligence', 'BarChart', 5),
  ('integrations', 'Integrations', 'Connect your tools and platforms', 'Link', 6),
  ('templates', 'Templates & Starters', 'Ready-to-use project templates', 'Layout', 7),
  ('plugins', 'Plugins & Extensions', 'Add-ons for existing products', 'Puzzle', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert RocketOpp's own products
INSERT INTO marketplace_products (
  slug, name, tagline, description, category, price, price_type,
  features, status, is_featured, is_rocketopp_product, tech_stack, ai_providers
) VALUES
  (
    'rocket-plus',
    'Rocket+',
    'Supercharge Your CRM',
    'Modular enhancements that make your CRM actually useful. AI course generation, workflow automation, and 50+ tools that work while you don''t.',
    'crm',
    0,
    'subscription',
    ARRAY['AI Course Generator', '50+ Automation Tools', 'Workflow Builder', 'MCP Integration', 'Custom Dashboards'],
    'active',
    TRUE,
    TRUE,
    ARRAY['Next.js', 'Supabase', 'Stripe'],
    ARRAY['claude', 'openai']
  ),
  (
    'mcpfed',
    'MCPFED',
    'Federation of AI Agents',
    'Connect, manage, and orchestrate MCP servers. The command center for your AI tools.',
    'ai-agents',
    19.99,
    'subscription',
    ARRAY['MCP Server Management', 'One-Click Connections', 'AI Config Profiles', 'Server Directory'],
    'active',
    TRUE,
    TRUE,
    ARRAY['Next.js', 'Supabase', 'MCP'],
    ARRAY['claude']
  ),
  (
    'rocketpost',
    'RocketPost',
    'Social Media on Autopilot',
    'Schedule, generate, and publish content across all platforms. AI writes, you approve, it posts.',
    'marketing',
    29.99,
    'subscription',
    ARRAY['Multi-Platform Posting', 'AI Content Generation', 'Smart Scheduling', 'Analytics Dashboard'],
    'coming_soon',
    TRUE,
    TRUE,
    ARRAY['Next.js', 'Supabase'],
    ARRAY['claude', 'openai']
  ),
  (
    'cro9',
    'CRO9',
    'Conversion Intelligence',
    'Track, analyze, optimize. Know exactly what''s working and what''s not.',
    'analytics',
    49.99,
    'subscription',
    ARRAY['Real-time Analytics', 'A/B Testing', 'Heatmaps', 'Conversion Funnels', 'AI Recommendations'],
    'coming_soon',
    TRUE,
    TRUE,
    ARRAY['Next.js', 'Supabase'],
    ARRAY['claude']
  ),
  (
    'botcoaches',
    'BotCoaches',
    'AI That Knows You',
    'Personalized AI instruction sets. Generate custom Skills, prompts, and coaching profiles for any AI platform.',
    'ai-agents',
    9.99,
    'subscription',
    ARRAY['Custom AI Profiles', 'Multi-Platform Export', 'Style Learning', 'Coach Marketplace'],
    'coming_soon',
    TRUE,
    TRUE,
    ARRAY['Next.js', 'Supabase'],
    ARRAY['claude', 'openai', 'local']
  )
ON CONFLICT (slug) DO NOTHING;
