-- Migration: Secure RLS Policies
-- Removes public access to chat history and enforces least-privilege.

-- 1. Drop public policies on chat_sessions
DROP POLICY IF EXISTS "Enable insert for anonymous users on sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Enable read for all on sessions" ON public.chat_sessions;

-- 2. Drop public policies on chat_messages
DROP POLICY IF EXISTS "Enable insert for anonymous users on messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable read for all on messages" ON public.chat_messages;

-- RLS remains enabled.
-- Because no other policies grant access to the 'public' or 'authenticated' roles,
-- all reads and writes from the client are blocked at the database level.
-- ONLY the backend, using the SERVICE_ROLE_KEY, can bypass RLS and perform operations.
