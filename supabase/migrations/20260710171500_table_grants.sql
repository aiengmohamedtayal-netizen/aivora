-- Grant explicit table permissions for authenticated and anon roles
-- Required because the tables were created manually by postgres superuser

GRANT ALL ON public.user_roles TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.categories TO anon, authenticated;
GRANT ALL ON public.tags TO anon, authenticated;
GRANT ALL ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.post_tags TO anon, authenticated;
GRANT ALL ON public.comments TO anon, authenticated;
GRANT ALL ON public.visitor_logs TO anon, authenticated;
GRANT ALL ON public.audit_logs TO anon, authenticated;
