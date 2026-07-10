-- Fix RLS recursion on user_roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the policies on user_roles using the security definer function
DROP POLICY IF EXISTS "Admins can do everything on user_roles" ON public.user_roles;

CREATE POLICY "Admins can do everything on user_roles" ON public.user_roles
    FOR ALL USING ( public.is_admin() );
