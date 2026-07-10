import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@aivora/lib/supabase/blog'
import { getTranslations } from 'next-intl/server'

export const runtime = 'edge'
export const alt = 'Aivora Blog Post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params

  // Try to fetch from Supabase, fallback to JSON
  let post = await getPostBySlug(slug, locale)
  let title = "Aivora Engineering Blog"
  let category = "Software Engineering"

  if (post) {
    title = post.title
    category = Array.isArray(post.category) ? post.category[0]?.name : (post.category as any)?.name || category
  } else {
    try {
      const t = await getTranslations({ locale, namespace: `blog.${slug}` })
      title = t("title") || title
      category = t("category") || category
    } catch {
      // ignore
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(to bottom right, #000000, #111111)',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ background: '#3b82f6', padding: '8px 16px', borderRadius: '40px', fontSize: 24, fontWeight: 'bold' }}>
            {category}
          </div>
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', maxWidth: '900px' }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
          <div style={{ fontSize: 32, fontWeight: 500, color: '#a1a1aa' }}>
            Aivora Engineering
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
