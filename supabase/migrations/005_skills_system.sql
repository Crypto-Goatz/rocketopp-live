-- Skills System Migration
-- Enables installing, managing, and executing skills/plugins

-- Skill definitions (marketplace + custom)
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL DEFAULT '1.0.0',
  author TEXT,
  icon_url TEXT,
  icon TEXT, -- lucide icon name
  category TEXT DEFAULT 'general',
  manifest JSONB NOT NULL DEFAULT '{}',
  source_url TEXT,
  is_marketplace BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User skill installations
CREATE TABLE IF NOT EXISTS skill_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES rocketopp_users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'installed' CHECK (status IN ('installing', 'installed', 'paused', 'error', 'uninstalling')),
  config JSONB DEFAULT '{}',
  permissions_granted JSONB DEFAULT '[]',
  environment JSONB DEFAULT '{}', -- stored env vars for the skill
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  last_run TIMESTAMPTZ,
  error_message TEXT,
  UNIQUE(user_id, skill_id)
);

-- Skill execution logs (for rollback)
CREATE TABLE IF NOT EXISTS skill_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id UUID REFERENCES skill_installations(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN (
    'file_create', 'file_modify', 'file_delete',
    'db_insert', 'db_update', 'db_delete',
    'api_call', 'env_set', 'config_change',
    'install', 'uninstall', 'execute'
  )),
  target TEXT NOT NULL, -- file path, table name, or API endpoint
  before_state JSONB,
  after_state JSONB,
  metadata JSONB DEFAULT '{}', -- additional context
  reversible BOOLEAN DEFAULT true,
  reverted BOOLEAN DEFAULT false,
  reverted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill onboarding data
CREATE TABLE IF NOT EXISTS skill_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id UUID REFERENCES skill_installations(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_value TEXT,
  field_type TEXT DEFAULT 'text',
  encrypted BOOLEAN DEFAULT false,
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(installation_id, field_name)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills(slug);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_marketplace ON skills(is_marketplace);
CREATE INDEX IF NOT EXISTS idx_skill_installations_user ON skill_installations(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_installations_skill ON skill_installations(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_installations_status ON skill_installations(status);
CREATE INDEX IF NOT EXISTS idx_skill_logs_installation ON skill_logs(installation_id);
CREATE INDEX IF NOT EXISTS idx_skill_logs_created ON skill_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_onboarding_installation ON skill_onboarding(installation_id);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Skills are readable by all authenticated users
CREATE POLICY "Skills are viewable by all" ON skills
  FOR SELECT USING (true);

-- Only admins can insert/update/delete skills
CREATE POLICY "Skills are manageable by service role" ON skills
  FOR ALL USING (true);

-- Users can only see their own installations
CREATE POLICY "Users can view own installations" ON skill_installations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own installations" ON skill_installations
  FOR ALL USING (user_id = auth.uid());

-- Users can only see logs for their own installations
CREATE POLICY "Users can view own logs" ON skill_logs
  FOR SELECT USING (
    installation_id IN (
      SELECT id FROM skill_installations WHERE user_id = auth.uid()
    )
  );

-- Users can only see their own onboarding data
CREATE POLICY "Users can manage own onboarding" ON skill_onboarding
  FOR ALL USING (
    installation_id IN (
      SELECT id FROM skill_installations WHERE user_id = auth.uid()
    )
  );

-- Insert some default marketplace skills
INSERT INTO skills (slug, name, description, version, author, icon, category, is_marketplace, manifest) VALUES
(
  'analytics-dashboard',
  'Analytics Dashboard',
  'Google Analytics 4 and Search Console integration with SERP ranking tracking',
  '1.0.0',
  'RocketOpp',
  'chart-bar',
  'analytics',
  true,
  '{
    "permissions": ["api:read", "api:write", "database:analytics_*", "env:GA4_PROPERTY_ID", "env:SERP_API_KEY"],
    "onboarding": [
      {"field": "ga4_property_id", "label": "Google Analytics 4 Property ID", "type": "text", "required": false},
      {"field": "serp_api_key", "label": "SerpApi Key", "type": "password", "required": false}
    ],
    "dashboard": {"route": "/dashboard/analytics", "sidebar": {"label": "Analytics", "icon": "chart-bar"}}
  }'::jsonb
),
(
  'seo-audit',
  'SEO Audit Tool',
  'Crawl your site pages and get detailed SEO recommendations for meta tags, headings, and images',
  '1.0.0',
  'RocketOpp',
  'search',
  'seo',
  true,
  '{
    "permissions": ["api:read", "files:read"],
    "onboarding": [
      {"field": "site_url", "label": "Site URL to audit", "type": "url", "required": true}
    ],
    "dashboard": {"route": "/dashboard/seo-audit", "sidebar": {"label": "SEO Audit", "icon": "search"}}
  }'::jsonb
),
(
  'backup-manager',
  'Backup Manager',
  'Create database snapshots and export your data to downloadable files',
  '1.0.0',
  'RocketOpp',
  'database',
  'utilities',
  true,
  '{
    "permissions": ["database:*", "files:write"],
    "onboarding": [],
    "dashboard": {"route": "/dashboard/backups", "sidebar": {"label": "Backups", "icon": "database"}}
  }'::jsonb
),
(
  'social-scheduler',
  'Social Scheduler',
  'Schedule and automate social media posts across multiple platforms',
  '1.0.0',
  'RocketOpp',
  'calendar',
  'social',
  true,
  '{
    "permissions": ["api:read", "api:write", "database:social_*", "cron:daily"],
    "onboarding": [
      {"field": "twitter_api_key", "label": "Twitter API Key", "type": "password", "required": false},
      {"field": "linkedin_token", "label": "LinkedIn Access Token", "type": "password", "required": false}
    ],
    "dashboard": {"route": "/dashboard/social", "sidebar": {"label": "Social", "icon": "calendar"}}
  }'::jsonb
),
(
  'ai-content-writer',
  'AI Content Writer',
  'Generate blog posts, social content, and marketing copy with AI',
  '1.0.0',
  'RocketOpp',
  'pen-tool',
  'content',
  true,
  '{
    "permissions": ["api:read", "api:write", "env:OPENAI_API_KEY", "env:ANTHROPIC_API_KEY"],
    "onboarding": [
      {"field": "openai_api_key", "label": "OpenAI API Key", "type": "password", "required": false},
      {"field": "anthropic_api_key", "label": "Anthropic API Key", "type": "password", "required": false}
    ],
    "dashboard": {"route": "/dashboard/ai-writer", "sidebar": {"label": "AI Writer", "icon": "pen-tool"}}
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
