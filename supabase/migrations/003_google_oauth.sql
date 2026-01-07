-- Add Google OAuth columns to rocketopp_users
-- Run this migration in Supabase SQL Editor

-- Add OAuth columns
ALTER TABLE rocketopp_users
ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email',
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index for Google ID lookups
CREATE INDEX IF NOT EXISTS idx_rocketopp_users_google_id
ON rocketopp_users(google_id)
WHERE google_id IS NOT NULL;

-- Allow empty password_hash for OAuth users
-- (already allows NULL by default in most setups, but making it explicit)
ALTER TABLE rocketopp_users
ALTER COLUMN password_hash DROP NOT NULL;
