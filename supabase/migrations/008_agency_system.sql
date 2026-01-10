-- ============================================================
-- Agency Management System
-- ============================================================
-- Manages agency clients, projects, integrations, and tasks
-- ============================================================

-- Agency Clients Table
CREATE TABLE IF NOT EXISTS agency_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'churned', 'prospect')),

  -- Billing
  billing_type TEXT DEFAULT 'retainer' CHECK (billing_type IN ('retainer', 'project', 'hourly')),
  monthly_retainer INTEGER DEFAULT 0,

  -- Health & Metrics
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  last_activity_at TIMESTAMPTZ DEFAULT now(),

  -- Contact Info
  primary_contact_name TEXT,
  primary_contact_email TEXT,
  primary_contact_phone TEXT,
  website TEXT,

  -- Integrations (JSON for flexibility)
  integrations JSONB DEFAULT '{}'::jsonb,
  -- Example: { "ghl": { "location_id": "xxx", "connected": true }, "mcp": { "endpoint": "xxx", "connected": true } }

  -- Settings
  settings JSONB DEFAULT '{}'::jsonb,
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Agency Projects Table
CREATE TABLE IF NOT EXISTS agency_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES agency_clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),

  -- Project Type
  project_type TEXT DEFAULT 'general',
  -- Types: website, app, marketing, seo, automation, maintenance, consulting

  -- Timeline
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMPTZ,

  -- Budget
  budget_cents INTEGER DEFAULT 0,
  spent_cents INTEGER DEFAULT 0,

  -- Progress
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

  -- Repo/Code
  github_repo TEXT,
  vercel_project TEXT,
  live_url TEXT,
  staging_url TEXT,

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  settings JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Project Tasks Table
CREATE TABLE IF NOT EXISTS agency_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES agency_projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES agency_clients(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'blocked')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),

  -- Assignment
  assigned_to TEXT,

  -- Timeline
  due_date DATE,
  completed_at TIMESTAMPTZ,

  -- Time Tracking
  estimated_hours DECIMAL(10,2),
  actual_hours DECIMAL(10,2),

  -- Organization
  tags TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Client Activity Log
CREATE TABLE IF NOT EXISTS agency_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES agency_clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES agency_projects(id) ON DELETE SET NULL,

  action TEXT NOT NULL,
  description TEXT,
  actor TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- API/MCP Connections Table
CREATE TABLE IF NOT EXISTS agency_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES agency_clients(id) ON DELETE CASCADE,

  integration_type TEXT NOT NULL,
  -- Types: ghl, mcp, analytics, stripe, custom_api

  name TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'pending')),

  -- Connection Details (encrypted in practice)
  config JSONB DEFAULT '{}'::jsonb,
  -- Example for GHL: { "location_id": "xxx", "api_key": "xxx" }
  -- Example for MCP: { "endpoint": "http://localhost:3001", "tools": ["list", "of", "tools"] }

  last_sync_at TIMESTAMPTZ,
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_agency_clients_status ON agency_clients(status);
CREATE INDEX IF NOT EXISTS idx_agency_clients_slug ON agency_clients(slug);
CREATE INDEX IF NOT EXISTS idx_agency_projects_client ON agency_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_agency_projects_status ON agency_projects(status);
CREATE INDEX IF NOT EXISTS idx_agency_tasks_project ON agency_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_agency_tasks_status ON agency_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agency_activity_client ON agency_activity(client_id);
CREATE INDEX IF NOT EXISTS idx_agency_integrations_client ON agency_integrations(client_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_agency_clients_updated_at ON agency_clients;
CREATE TRIGGER update_agency_clients_updated_at
  BEFORE UPDATE ON agency_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agency_projects_updated_at ON agency_projects;
CREATE TRIGGER update_agency_projects_updated_at
  BEFORE UPDATE ON agency_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agency_tasks_updated_at ON agency_tasks;
CREATE TRIGGER update_agency_tasks_updated_at
  BEFORE UPDATE ON agency_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agency_integrations_updated_at ON agency_integrations;
CREATE TRIGGER update_agency_integrations_updated_at
  BEFORE UPDATE ON agency_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED DATA: RocketOpp & ABK Unlimited
-- ============================================================

-- Insert RocketOpp as a client (yes, managing ourselves!)
INSERT INTO agency_clients (
  name, slug, industry, status, billing_type, monthly_retainer, health_score,
  primary_contact_name, primary_contact_email, website, integrations, notes
) VALUES (
  'RocketOpp',
  'rocketopp',
  'Technology / Agency',
  'active',
  'retainer',
  0,
  100,
  'Internal Team',
  'team@rocketopp.com',
  'https://rocketopp.com',
  '{
    "ghl": {"location_id": "6MSqx0trfxgLxeHBJE1k", "connected": true},
    "mcp": {"endpoint": "internal", "connected": true, "tools": ["analytics", "leads", "content", "skills"]},
    "vercel": {"project": "rocketopp-live", "connected": true},
    "supabase": {"connected": true}
  }'::jsonb,
  'Internal agency management. Full MCP and API access.'
) ON CONFLICT (slug) DO NOTHING;

-- Insert ABK Unlimited as a client
INSERT INTO agency_clients (
  name, slug, industry, status, billing_type, monthly_retainer, health_score,
  primary_contact_name, primary_contact_email, website, integrations, notes
) VALUES (
  'ABK Unlimited',
  'abk-unlimited',
  'Home Services / Construction',
  'active',
  'retainer',
  2500,
  92,
  'ABK Team',
  'contact@abkunlimited.com',
  'https://abkunlimited.com',
  '{
    "ghl": {"location_id": "abk-location-id", "pipeline_id": "G9L7BKFIGlD7140Ebh9x", "connected": true},
    "vercel": {"project": "abk-unlimited", "connected": true},
    "supabase": {"connected": true, "prefix": "abk_"}
  }'::jsonb,
  'Home services contractor. Kitchen, bathroom, roofing, remodeling. $2,500/mo retainer.'
) ON CONFLICT (slug) DO NOTHING;

-- RocketOpp Projects
INSERT INTO agency_projects (client_id, name, description, status, project_type, progress, github_repo, live_url)
SELECT
  id,
  'RocketOpp.com Website',
  'Main agency website with AI assessment, lead capture, and client dashboard',
  'active',
  'website',
  85,
  'Crypto-Goatz/rocketopp-live',
  'https://rocketopp.com'
FROM agency_clients WHERE slug = 'rocketopp'
ON CONFLICT DO NOTHING;

INSERT INTO agency_projects (client_id, name, description, status, project_type, progress, github_repo, live_url)
SELECT
  id,
  'Rocket+ (GHL Marketplace App)',
  'GoHighLevel marketplace app with RocketFlow, AI tools, and automation',
  'active',
  'app',
  90,
  'Crypto-Goatz/rocket-mods',
  'https://rocketadd.com'
FROM agency_clients WHERE slug = 'rocketopp'
ON CONFLICT DO NOTHING;

INSERT INTO agency_projects (client_id, name, description, status, project_type, progress)
SELECT
  id,
  'Spark AI Assessment',
  'Interactive AI-powered business assessment with lead capture',
  'active',
  'automation',
  95
FROM agency_clients WHERE slug = 'rocketopp'
ON CONFLICT DO NOTHING;

-- ABK Projects
INSERT INTO agency_projects (client_id, name, description, status, project_type, progress, github_repo, live_url)
SELECT
  id,
  'ABK Website',
  'Full-service contractor website with lead capture, portfolio, and AI visualizer',
  'active',
  'website',
  100,
  'Crypto-Goatz/ABK-Unlimited',
  'https://abkunlimited.com'
FROM agency_clients WHERE slug = 'abk-unlimited'
ON CONFLICT DO NOTHING;

INSERT INTO agency_projects (client_id, name, description, status, project_type, progress)
SELECT
  id,
  'GHL Pipeline Setup',
  'Sales pipeline configuration and automation workflows',
  'completed',
  'automation',
  100
FROM agency_clients WHERE slug = 'abk-unlimited'
ON CONFLICT DO NOTHING;

INSERT INTO agency_projects (client_id, name, description, status, project_type, progress)
SELECT
  id,
  'SEO & Local Marketing',
  'Ongoing SEO optimization and local search presence',
  'active',
  'seo',
  60
FROM agency_clients WHERE slug = 'abk-unlimited'
ON CONFLICT DO NOTHING;

-- RocketOpp Integrations
INSERT INTO agency_integrations (client_id, integration_type, name, status, config)
SELECT id, 'ghl', 'GoHighLevel CRM', 'connected',
  '{"location_id": "6MSqx0trfxgLxeHBJE1k", "features": ["contacts", "pipelines", "workflows", "sms", "email"]}'::jsonb
FROM agency_clients WHERE slug = 'rocketopp';

INSERT INTO agency_integrations (client_id, integration_type, name, status, config)
SELECT id, 'mcp', 'MCP Server (Internal)', 'connected',
  '{"endpoint": "localhost:3001", "tools": ["analytics", "leads", "content", "skills", "ghl"]}'::jsonb
FROM agency_clients WHERE slug = 'rocketopp';

INSERT INTO agency_integrations (client_id, integration_type, name, status, config)
SELECT id, 'analytics', 'Google Analytics 4', 'connected',
  '{"property_id": "GA4-ROCKETOPP", "features": ["pageviews", "events", "conversions"]}'::jsonb
FROM agency_clients WHERE slug = 'rocketopp';

INSERT INTO agency_integrations (client_id, integration_type, name, status, config)
SELECT id, 'custom_api', 'Anthropic Claude API', 'connected',
  '{"model": "claude-sonnet-4-20250514", "use_cases": ["spark_assessment", "content_generation"]}'::jsonb
FROM agency_clients WHERE slug = 'rocketopp';

-- ABK Integrations
INSERT INTO agency_integrations (client_id, integration_type, name, status, config)
SELECT id, 'ghl', 'GoHighLevel CRM', 'connected',
  '{"location_id": "abk-location", "pipeline_id": "G9L7BKFIGlD7140Ebh9x", "features": ["contacts", "pipelines", "sms"]}'::jsonb
FROM agency_clients WHERE slug = 'abk-unlimited';

INSERT INTO agency_integrations (client_id, integration_type, name, status, config)
SELECT id, 'custom_api', 'Gemini Vision API', 'connected',
  '{"use_cases": ["3d_visualizer", "room_analysis"]}'::jsonb
FROM agency_clients WHERE slug = 'abk-unlimited';
