-- Migration to enhance newsletter_subscribers with secure Double Opt-In support and Row Level Security (RLS)

-- 1. Alter existing columns and defaults
ALTER TABLE public.newsletter_subscribers 
  ALTER COLUMN status SET DEFAULT 'pending'::text;

-- 2. Add new columns for token hashing, tagging, and tracking
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS verification_token_hash text,
  ADD COLUMN IF NOT EXISTS last_email_sent timestamp with time zone,
  ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb;

-- Ensure unsubscribe_token exists and is generated
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS unsubscribe_token text;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 4. Re-create clean security policies
DROP POLICY IF EXISTS insert_newsletter_subscribers ON public.newsletter_subscribers;
DROP POLICY IF EXISTS admin_newsletter_subscribers ON public.newsletter_subscribers;
DROP POLICY IF EXISTS select_newsletter_subscribers ON public.newsletter_subscribers;

-- Policy: Allow public anonymous insertion (anyone can subscribe)
CREATE POLICY insert_newsletter_subscribers ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow service_role / admins to perform any operation
CREATE POLICY admin_newsletter_subscribers ON public.newsletter_subscribers
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Set explicit permissions
GRANT SELECT, INSERT ON TABLE public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON TABLE public.newsletter_subscribers TO service_role, postgres;
