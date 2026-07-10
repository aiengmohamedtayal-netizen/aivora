import { createClient } from "./client"

export async function getCategories() {
  const supabase = createClient()
  const { data, error } = await supabase.from('categories').select('*').order('name_en')
  if (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
  return data || []
}

export async function getTags() {
  const supabase = createClient()
  const { data, error } = await supabase.from('tags').select('*').order('name_en')
  if (error) {
    console.error("Failed to fetch tags:", error)
    return []
  }
  return data || []
}

export async function getPosts(locale: string = 'en') {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id, slug, status, cover_image, reading_time, featured, published_at,
      title_en, title_ar, excerpt_en, excerpt_ar,
      category:categories ( id, name_en, name_ar, slug ),
      post_tags (
        tag:tags ( id, name_en, name_ar, slug )
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error("Failed to fetch posts:", error)
    return []
  }

  const postsData = data as any[]

  // Transform data to a flat structure easy for frontend consumption
  return (postsData || []).map(post => ({
    id: post.id,
    slug: post.slug,
    title: post[`title_${locale}`] || post.title_en,
    excerpt: post[`excerpt_${locale}`] || post.excerpt_en,
    coverImage: post.cover_image,
    readingTime: post.reading_time,
    featured: post.featured,
    publishDate: post.published_at,
    category: Array.isArray(post.category) ? post.category[0]?.[`name_${locale}`] : (post.category as any)?.[`name_${locale}`],
    tags: post.post_tags?.map((pt: any) => pt.tag?.[`name_${locale}`]).filter(Boolean) || [],
    author: "Aivora Engineering" // Placeholder until author join is implemented
  }))
}

export async function getPostBySlug(slug: string, locale: string = 'en') {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id, slug, status, cover_image, reading_time, featured, published_at,
      title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar,
      seo_title_en, seo_title_ar, seo_description_en, seo_description_ar,
      keywords_en, keywords_ar,
      category:categories ( id, name_en, name_ar, slug ),
      post_tags (
        tag:tags ( id, name_en, name_ar, slug )
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    console.error(`Failed to fetch post ${slug}:`, error)
    return null
  }

  const postData = data as any

  return {
    id: postData.id,
    slug: postData.slug,
    title: postData[`title_${locale}`] || postData.title_en,
    excerpt: postData[`excerpt_${locale}`] || postData.excerpt_en,
    content: postData[`content_${locale}`] || postData.content_en,
    seoTitle: postData[`seo_title_${locale}`] || postData.seo_title_en,
    seoDescription: postData[`seo_description_${locale}`] || postData.seo_description_en,
    keywords: postData[`keywords_${locale}`] || postData.keywords_en || [],
    coverImage: postData.cover_image,
    readingTime: postData.reading_time,
    publishDate: postData.published_at,
    category: Array.isArray(postData.category) ? postData.category[0]?.[`name_${locale}`] : (postData.category as any)?.[`name_${locale}`],
    tags: postData.post_tags?.map((pt: any) => pt.tag?.[`name_${locale}`]).filter(Boolean) || [],
    author: "Aivora Engineering"
  }
}
