-- Add featured_image column to blog_posts table
-- Run this in Supabase SQL Editor

-- Add featured_image column
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Update content_pipeline_runs status enum to include 'success'
-- (The original had 'completed' but we're using 'success' in the code)
ALTER TABLE content_pipeline_runs
  DROP CONSTRAINT IF EXISTS content_pipeline_runs_status_check;

ALTER TABLE content_pipeline_runs
  ADD CONSTRAINT content_pipeline_runs_status_check
  CHECK (status IN ('running', 'completed', 'failed', 'success'));
