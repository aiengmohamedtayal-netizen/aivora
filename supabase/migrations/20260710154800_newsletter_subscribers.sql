-- Create the newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    locale TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'website',
    status TEXT NOT NULL DEFAULT 'active',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    unsubscribe_token UUID DEFAULT gen_random_uuid(),
    ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert new subscriptions
CREATE POLICY "Anyone can subscribe to the newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Only service role can read/update/delete (no policies added for these, meaning they default to deny for anon/auth users)
