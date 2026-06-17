-- ============================================================
-- 011_password_resets.sql
-- Password reset tokens for custom bcrypt auth
-- (rocketopp_users / rocketopp_sessions / cookie rocketopp_session)
-- ============================================================

CREATE TABLE IF NOT EXISTS rocketopp_password_resets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES rocketopp_users(id) ON DELETE CASCADE,
  token       text NOT NULL UNIQUE,
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rocketopp_password_resets_token
  ON rocketopp_password_resets (token);

CREATE INDEX IF NOT EXISTS idx_rocketopp_password_resets_user
  ON rocketopp_password_resets (user_id);

-- Service-role only: all access is via supabaseAdmin (service role key) in API routes.
ALTER TABLE rocketopp_password_resets ENABLE ROW LEVEL SECURITY;
