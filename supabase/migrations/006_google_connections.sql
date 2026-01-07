-- Google service connections for users
-- Stores OAuth tokens for Analytics, Search Console, Ads

CREATE TABLE IF NOT EXISTS user_google_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES rocketopp_users(id) ON DELETE CASCADE,

  -- OAuth tokens
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,

  -- Connected services (which scopes were granted)
  services JSONB DEFAULT '[]', -- ['analytics', 'search_console', 'ads', 'calendar']

  -- Service-specific data
  ga4_property_id TEXT,
  search_console_site TEXT,
  ads_customer_id TEXT,

  -- Metadata
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_refresh TIMESTAMPTZ,
  status TEXT DEFAULT 'active', -- active, expired, revoked

  UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE user_google_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections" ON user_google_connections
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role full access" ON user_google_connections
  FOR ALL USING (true);

-- Index for faster lookups
CREATE INDEX idx_google_connections_user ON user_google_connections(user_id);

-- Grant permissions
GRANT ALL ON user_google_connections TO service_role;
