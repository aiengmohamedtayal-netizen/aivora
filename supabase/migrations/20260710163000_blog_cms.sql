-- Create enum for post status
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL UNIQUE,
    name_ar TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL UNIQUE,
    name_ar TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    excerpt_en TEXT,
    excerpt_ar TEXT,
    content_en TEXT,
    content_ar TEXT,
    cover_image TEXT,
    author_id UUID REFERENCES auth.users(id),
    category_id UUID REFERENCES public.categories(id),
    status post_status DEFAULT 'draft' NOT NULL,
    seo_title_en TEXT,
    seo_title_ar TEXT,
    seo_description_en TEXT,
    seo_description_ar TEXT,
    keywords_en TEXT[],
    keywords_ar TEXT[],
    reading_time INTEGER DEFAULT 5,
    featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS public.post_tags (
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    guest_name TEXT,
    guest_email TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- pending, approved, spam
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup RLS (Row Level Security)

-- Categories: Anyone can read, only admin can write
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are readable by everyone." ON public.categories FOR SELECT USING (true);

-- Tags: Anyone can read, only admin can write
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are readable by everyone." ON public.tags FOR SELECT USING (true);

-- Blog Posts: Anyone can read published posts, only admin can write
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are readable by everyone." ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can read all posts." ON public.blog_posts FOR SELECT USING (auth.role() = 'authenticated'); -- Simplified check for demo

-- Post Tags: Anyone can read
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Post tags are readable by everyone." ON public.post_tags FOR SELECT USING (true);

-- Comments: Anyone can read approved comments, anyone can insert
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved comments are readable by everyone." ON public.comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can insert a comment." ON public.comments FOR INSERT WITH CHECK (true);

-- Enable Supabase Full Text Search indexing
-- Add indexes for fast lookups
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
