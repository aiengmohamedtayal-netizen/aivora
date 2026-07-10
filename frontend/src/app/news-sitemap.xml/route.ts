import { NextResponse } from 'next/server'
import { getPosts } from '@/lib/supabase/blog'

export async function GET() {
  try {
    const posts = await getPosts('en')
    
    // Google News sitemaps only include articles published in the last 2 days
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const recentPosts = posts.filter(post => new Date(post.publishDate) >= twoDaysAgo)

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${recentPosts.map(post => `
  <url>
    <loc>https://aivora.com/en/blog/${post.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Aivora Engineering</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.publishDate).toISOString()}</news:publication_date>
      <news:title>${post.title}</news:title>
    </news:news>
  </url>
  `).join('')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    })
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
