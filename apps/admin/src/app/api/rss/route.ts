import { NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { getPosts } from '@aivora/lib/supabase/blog'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    
    let posts = await getPosts(locale)
    
    if (!posts || posts.length === 0) {
      const indexT = await getTranslations({ locale, namespace: 'blog.index' })
      const slugs = indexT.raw('slugs') as string[]
      
      const allPosts = await Promise.all(slugs.map(async (slug) => {
        try {
          const postT = await getTranslations({ locale, namespace: `blog.${slug}` })
          return {
            slug,
            title: postT('title'),
            excerpt: postT('excerpt'),
            author: postT('author'),
            publishDate: postT('publishDate'),
          }
        } catch (err) {
          return null
        }
      }))
      posts = allPosts.filter(Boolean) as any[]
    }

    const baseUrl = 'https://aivora-lac.vercel.app'
    
    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Aivora Engineering Blog</title>
  <link>${baseUrl}/${locale}/blog</link>
  <description>Technical insights, product architecture, and software engineering by Aivora</description>
  <language>${locale}</language>
  ${posts.map(post => `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${baseUrl}/${locale}/blog/${post.slug}</link>
    <description><![CDATA[${post.excerpt}]]></description>
    <author>${post.author}</author>
    <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
  </item>`).join('')}
</channel>
</rss>`

    return new NextResponse(rssFeed, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate'
      }
    })
  } catch (error) {
    console.error('RSS Feed Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
