-- Migration: Initial Schema for Aivora Platform
-- Creates leads, services, and case_studies tables with constraints, indexes, and RLS

-- 1. Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) >= 2),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    company TEXT,
    message TEXT NOT NULL CHECK (char_length(message) >= 10),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    desc_en TEXT NOT NULL,
    desc_ar TEXT NOT NULL,
    icon TEXT NOT NULL
);

-- 3. Create Case Studies Table
CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    metrics JSONB,
    tech_stack TEXT[] NOT NULL
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON public.case_studies(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- Leads: 
-- 1. Anonymous users can INSERT leads (via the public API key in the browser/backend).
CREATE POLICY "Enable insert for anonymous users" 
ON public.leads FOR INSERT 
TO anon 
WITH CHECK (true);

-- 2. Authenticated users (admins) can SELECT, UPDATE, DELETE leads.
CREATE POLICY "Enable read access for authenticated users" 
ON public.leads FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable update for authenticated users" 
ON public.leads FOR UPDATE 
TO authenticated 
USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" 
ON public.leads FOR DELETE 
TO authenticated 
USING (true);

-- Services:
-- 1. Anyone can read services.
CREATE POLICY "Enable read access for all users" 
ON public.services FOR SELECT 
USING (true);

-- 2. Only authenticated admins can modify services.
CREATE POLICY "Enable insert for authenticated users" 
ON public.services FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
ON public.services FOR UPDATE 
TO authenticated 
USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" 
ON public.services FOR DELETE 
TO authenticated 
USING (true);

-- Case Studies:
-- 1. Anyone can read case studies.
CREATE POLICY "Enable read access for all users" 
ON public.case_studies FOR SELECT 
USING (true);

-- 2. Only authenticated admins can modify case studies.
CREATE POLICY "Enable insert for authenticated users" 
ON public.case_studies FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
ON public.case_studies FOR UPDATE 
TO authenticated 
USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" 
ON public.case_studies FOR DELETE 
TO authenticated 
USING (true);
