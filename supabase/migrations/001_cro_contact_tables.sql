-- CRO Events table for tracking form interactions
-- This table stores all form interaction events for CRO analysis and AI optimization
CREATE TABLE IF NOT EXISTS cro_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  variant TEXT DEFAULT 'default',
  step INTEGER,
  field TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact submissions table
-- Stores all contact form submissions with metadata for analysis
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interests TEXT[] DEFAULT '{}',
  message TEXT,
  timeline TEXT,
  session_id TEXT,
  variant TEXT DEFAULT 'default',
  source TEXT DEFAULT 'contact_form',
  status TEXT DEFAULT 'new',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cro_events_session ON cro_events(session_id);
CREATE INDEX IF NOT EXISTS idx_cro_events_type ON cro_events(event_type);
CREATE INDEX IF NOT EXISTS idx_cro_events_variant ON cro_events(variant);
CREATE INDEX IF NOT EXISTS idx_cro_events_created ON cro_events(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE cro_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Service role full access to cro_events" ON cro_events
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access to contact_submissions" ON contact_submissions
  FOR ALL USING (true) WITH CHECK (true);
