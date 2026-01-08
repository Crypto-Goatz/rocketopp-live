-- Ignition Skill Execution System
-- Tracks executions, deployments, and generated sites

-- Skill executions (track each run)
CREATE TABLE IF NOT EXISTS skill_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id UUID REFERENCES skill_installations(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  input JSONB DEFAULT '{}',
  output JSONB DEFAULT '{}',
  progress JSONB DEFAULT '[]', -- array of progress events
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER
);

-- Skill-generated deployments (for Rocket+Sites and similar)
CREATE TABLE IF NOT EXISTS skill_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID REFERENCES skill_executions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES rocketopp_users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,

  -- Deployment info
  provider TEXT DEFAULT 'vercel',
  provider_project_id TEXT,
  provider_deployment_id TEXT,

  -- URLs
  deployment_url TEXT,
  custom_domain TEXT,

  -- Status
  status TEXT DEFAULT 'building' CHECK (status IN ('building', 'ready', 'error', 'deleted')),

  -- Metadata
  name TEXT,
  config JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rocket+Sites specific table
CREATE TABLE IF NOT EXISTS rocket_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES rocketopp_users(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES skill_deployments(id) ON DELETE SET NULL,

  -- Site info
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- business, portfolio, saas, blog, ecommerce
  industry TEXT,
  description TEXT,

  -- Vercel
  vercel_project_id TEXT,
  vercel_url TEXT,
  custom_domain TEXT,

  -- Status
  status TEXT DEFAULT 'building' CHECK (status IN ('building', 'deployed', 'error', 'deleted')),

  -- Generated content (for editing)
  pages JSONB DEFAULT '[]',
  components JSONB DEFAULT '[]',
  config JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add execution tracking to skill_installations
ALTER TABLE skill_installations ADD COLUMN IF NOT EXISTS
  current_execution_id UUID REFERENCES skill_executions(id);

ALTER TABLE skill_installations ADD COLUMN IF NOT EXISTS
  total_executions INTEGER DEFAULT 0;

ALTER TABLE skill_installations ADD COLUMN IF NOT EXISTS
  successful_executions INTEGER DEFAULT 0;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_skill_executions_installation ON skill_executions(installation_id);
CREATE INDEX IF NOT EXISTS idx_skill_executions_status ON skill_executions(status);
CREATE INDEX IF NOT EXISTS idx_skill_executions_started ON skill_executions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_deployments_user ON skill_deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_deployments_execution ON skill_deployments(execution_id);
CREATE INDEX IF NOT EXISTS idx_skill_deployments_status ON skill_deployments(status);
CREATE INDEX IF NOT EXISTS idx_rocket_sites_user ON rocket_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_rocket_sites_status ON rocket_sites(status);

-- Enable RLS
ALTER TABLE skill_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rocket_sites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skill_executions
CREATE POLICY "Users can view own executions" ON skill_executions
  FOR SELECT USING (
    installation_id IN (
      SELECT id FROM skill_installations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access executions" ON skill_executions
  FOR ALL USING (true);

-- RLS Policies for skill_deployments
CREATE POLICY "Users can view own deployments" ON skill_deployments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role full access deployments" ON skill_deployments
  FOR ALL USING (true);

-- RLS Policies for rocket_sites
CREATE POLICY "Users can manage own sites" ON rocket_sites
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Service role full access sites" ON rocket_sites
  FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON skill_executions TO service_role;
GRANT ALL ON skill_deployments TO service_role;
GRANT ALL ON rocket_sites TO service_role;
