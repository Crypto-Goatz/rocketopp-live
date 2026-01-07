-- Blog Posts Table for Auto-Generated Content
-- Run this in Supabase SQL Editor

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  excerpt TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Technology',
  reading_time INTEGER DEFAULT 5,
  seo_keywords TEXT[] DEFAULT '{}',
  related_services TEXT[] DEFAULT '{}',

  -- Social posts
  linkedin_post TEXT,
  twitter_post TEXT,
  facebook_post TEXT,
  linkedin_posted BOOLEAN DEFAULT false,
  twitter_posted BOOLEAN DEFAULT false,
  facebook_posted BOOLEAN DEFAULT false,
  linkedin_posted_at TIMESTAMPTZ,
  twitter_posted_at TIMESTAMPTZ,
  facebook_posted_at TIMESTAMPTZ,

  -- Source tracking
  source_topic TEXT,
  source_data JSONB DEFAULT '{}',

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,

  -- Analytics
  views INTEGER DEFAULT 0,
  linkedin_clicks INTEGER DEFAULT 0,
  twitter_clicks INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Create content_pipeline_runs table for tracking automation
CREATE TABLE IF NOT EXISTS content_pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),

  -- Stats
  topics_fetched INTEGER DEFAULT 0,
  posts_generated INTEGER DEFAULT 0,
  posts_published INTEGER DEFAULT 0,
  linkedin_posts_sent INTEGER DEFAULT 0,

  -- Logs
  logs JSONB DEFAULT '[]',
  error TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create linkedin_connections table for OAuth
CREATE TABLE IF NOT EXISTS linkedin_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES rocketopp_users(id) ON DELETE CASCADE,

  -- LinkedIn profile
  linkedin_id TEXT NOT NULL,
  profile_url TEXT,
  name TEXT,
  email TEXT,
  avatar_url TEXT,

  -- OAuth tokens
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scopes TEXT[] DEFAULT '{}',

  -- Status
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_linkedin_connections_updated_at ON linkedin_connections;
CREATE TRIGGER update_linkedin_connections_updated_at
  BEFORE UPDATE ON linkedin_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed)
-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE content_pipeline_runs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE linkedin_connections ENABLE ROW LEVEL SECURITY;
