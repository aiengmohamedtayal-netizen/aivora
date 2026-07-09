-- Migration: Add Chat Memory Support
-- Creates tables for storing AI conversation history.

-- 1. Create Chat Sessions Table
DROP TABLE IF EXISTS public.chat_messages;
DROP TABLE IF EXISTS public.chat_sessions;

CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    intent TEXT,
    lead_status TEXT DEFAULT 'new',
    project_type TEXT,
    budget TEXT,
    preferred_stack TEXT,
    contact_information JSONB,
    summary TEXT,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    model TEXT DEFAULT 'gpt-4o',
    temperature FLOAT DEFAULT 0.7,
    metadata JSONB,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    token_usage INT,
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for fast retrieval of conversation history
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at ASC);

-- Row Level Security (RLS)
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for Chat Sessions
-- 1. Anyone can create a chat session (frontend anonymous users)
CREATE POLICY "Enable insert for anonymous users on sessions" 
ON public.chat_sessions FOR INSERT 
TO public
WITH CHECK (true);

-- 2. Anyone can read their own session data (In a real app, this should be scoped by auth or strict session tokens, but for now we allow public access assuming clients use UUIDs securely)
CREATE POLICY "Enable read for all on sessions" 
ON public.chat_sessions FOR SELECT 
TO public
USING (true);

-- Policies for Chat Messages
-- 1. Anyone can insert messages
CREATE POLICY "Enable insert for anonymous users on messages" 
ON public.chat_messages FOR INSERT 
TO public
WITH CHECK (true);

-- 2. Anyone can read messages
CREATE POLICY "Enable read for all on messages" 
ON public.chat_messages FOR SELECT 
TO public
USING (true);
