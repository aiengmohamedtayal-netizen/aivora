-- Migration to expand RBAC roles
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_role_check;

ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_role_check 
CHECK (role IN ('owner', 'admin', 'editor', 'marketer', 'sales', 'support', 'viewer'));
