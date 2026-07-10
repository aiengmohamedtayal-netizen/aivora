-- Security Hardening Migration
-- 1. Revoke public execution of rls_auto_enable()
ALTER FUNCTION IF EXISTS public.rls_auto_enable() SECURITY DEFINER;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
ALTER FUNCTION IF EXISTS public.rls_auto_enable() OWNER TO postgres;

-- 2. Harden case_studies table
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.case_studies;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.case_studies;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.case_studies;

CREATE POLICY "Admin only insert case_studies" ON public.case_studies
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin only update case_studies" ON public.case_studies
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin only delete case_studies" ON public.case_studies
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 3. Harden services table
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.services;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.services;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.services;

CREATE POLICY "Admin only insert services" ON public.services
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin only update services" ON public.services
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin only delete services" ON public.services
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 4. Harden leads table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.leads;

CREATE POLICY "Admin read leads" ON public.leads FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin update leads" ON public.leads FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin delete leads" ON public.leads FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Harden chat memory tables (ensuring complete lockdown)
ALTER TABLE IF EXISTS public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for anonymous users on sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Enable read for all on sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Enable insert for anonymous users on messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable read for all on messages" ON public.chat_messages;
