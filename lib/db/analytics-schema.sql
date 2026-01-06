-- Analytics Schema for RocketOpp
-- Run this in your Supabase SQL editor

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,

  -- Contact info
  email TEXT,
  phone TEXT,
  name TEXT,
  company TEXT,

  -- Source tracking
  source TEXT NOT NULL, -- contact_form, demo_request, newsletter, etc.
  page TEXT, -- Page where lead was captured

  -- UTM parameters
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  -- Device & location
  user_agent TEXT,
  device_type TEXT, -- desktop, mobile, tablet
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  referrer TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Lead status
  status TEXT DEFAULT 'new', -- new, contacted, qualified, converted
  notes TEXT,
  assigned_to TEXT
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON analytics_leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created ON analytics_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source ON analytics_leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON analytics_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_visitor ON analytics_leads(visitor_id);

-- ============================================
-- PAGEVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_pageviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,

  -- Page info
  path TEXT NOT NULL,
  title TEXT,
  referrer TEXT,

  -- UTM parameters
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Device info
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_pageviews_path ON analytics_pageviews(path);
CREATE INDEX IF NOT EXISTS idx_pageviews_created ON analytics_pageviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_visitor ON analytics_pageviews(visitor_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_session ON analytics_pageviews(session_id);

-- Partition by month for large scale (optional)
-- CREATE INDEX IF NOT EXISTS idx_pageviews_created_month ON analytics_pageviews(DATE_TRUNC('month', created_at));

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,

  -- Event data
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_label TEXT,
  event_value NUMERIC,
  properties JSONB,

  -- Context
  page TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_category ON analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_visitor ON analytics_events(visitor_id);

-- ============================================
-- SESSIONS TABLE (for session aggregation)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,

  -- Session info
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  page_count INTEGER DEFAULT 1,
  event_count INTEGER DEFAULT 0,

  -- First touch attribution
  landing_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,

  -- Device info
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,

  -- Conversion
  converted BOOLEAN DEFAULT FALSE,
  conversion_type TEXT, -- lead, signup, purchase
  conversion_value NUMERIC
);

CREATE INDEX IF NOT EXISTS idx_sessions_visitor ON analytics_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON analytics_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_converted ON analytics_sessions(converted) WHERE converted = TRUE;

-- ============================================
-- VISITOR PROFILES (aggregated data)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL UNIQUE,

  -- First seen
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),

  -- Aggregates
  total_sessions INTEGER DEFAULT 1,
  total_pageviews INTEGER DEFAULT 1,
  total_events INTEGER DEFAULT 0,

  -- First touch
  first_referrer TEXT,
  first_utm_source TEXT,
  first_utm_medium TEXT,
  first_utm_campaign TEXT,
  first_landing_page TEXT,

  -- Last known info
  last_device_type TEXT,
  last_browser TEXT,
  last_os TEXT,
  last_country TEXT,
  last_city TEXT,

  -- Contact info (if provided)
  email TEXT,
  phone TEXT,
  name TEXT,
  company TEXT,

  -- Status
  is_customer BOOLEAN DEFAULT FALSE,
  customer_value NUMERIC DEFAULT 0,

  -- Custom tags
  tags TEXT[]
);

CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON analytics_visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_email ON analytics_visitors(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_visitors_is_customer ON analytics_visitors(is_customer) WHERE is_customer = TRUE;

-- ============================================
-- DAILY STATS (pre-aggregated for dashboards)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_daily_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,

  -- Traffic
  pageviews INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  sessions INTEGER DEFAULT 0,

  -- Top pages (JSONB array)
  top_pages JSONB,

  -- Sources
  top_sources JSONB,

  -- Devices
  desktop_pct NUMERIC,
  mobile_pct NUMERIC,
  tablet_pct NUMERIC,

  -- Countries
  top_countries JSONB,

  -- Conversions
  leads INTEGER DEFAULT 0,
  signups INTEGER DEFAULT 0,
  purchases INTEGER DEFAULT 0,
  revenue NUMERIC DEFAULT 0,

  UNIQUE(date)
);

CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON analytics_daily_stats(date DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
-- Enable RLS
ALTER TABLE analytics_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_stats ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role can do everything" ON analytics_leads
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything" ON analytics_pageviews
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything" ON analytics_events
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything" ON analytics_sessions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything" ON analytics_visitors
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything" ON analytics_daily_stats
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- USEFUL VIEWS
-- ============================================

-- Today's stats
CREATE OR REPLACE VIEW analytics_today AS
SELECT
  COUNT(*) as pageviews,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(DISTINCT session_id) as sessions
FROM analytics_pageviews
WHERE created_at >= CURRENT_DATE;

-- This week's leads
CREATE OR REPLACE VIEW analytics_leads_this_week AS
SELECT
  source,
  COUNT(*) as count,
  COUNT(DISTINCT email) as unique_emails
FROM analytics_leads
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY source
ORDER BY count DESC;

-- Top pages (last 30 days)
CREATE OR REPLACE VIEW analytics_top_pages AS
SELECT
  path,
  COUNT(*) as views,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM analytics_pageviews
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY path
ORDER BY views DESC
LIMIT 20;

-- Traffic sources (last 30 days)
CREATE OR REPLACE VIEW analytics_traffic_sources AS
SELECT
  COALESCE(utm_source, 'direct') as source,
  COALESCE(utm_medium, 'none') as medium,
  COUNT(*) as sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM analytics_pageviews
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY utm_source, utm_medium
ORDER BY sessions DESC;
