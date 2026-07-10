-- Create user_roles table for RBAC
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Admins can read/write everything, users can read their own roles
CREATE POLICY "Users can read their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can do everything on user_roles" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Secure Blog Posts write access to Admin/Editor
DROP POLICY IF EXISTS "Admins can read all posts." ON public.blog_posts;
CREATE POLICY "Admin and Editors can write posts" ON public.blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
    );
