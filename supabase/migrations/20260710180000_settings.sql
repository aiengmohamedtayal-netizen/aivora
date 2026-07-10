-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT 'Aivora',
    site_description TEXT,
    contact_email TEXT,
    support_phone TEXT,
    social_links JSONB DEFAULT '{"twitter": "", "linkedin": "", "github": ""}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users" ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admin update site_settings" ON public.site_settings FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin insert site_settings" ON public.site_settings FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Insert default settings row if table is empty
INSERT INTO public.site_settings (site_name, site_description, contact_email) 
SELECT 'Aivora', 'AI-powered enterprise software engineering platform.', 'contact@aivora.com'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);
