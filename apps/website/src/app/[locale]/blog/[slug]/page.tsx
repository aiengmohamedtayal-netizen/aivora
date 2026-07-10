import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import Script from "next/script"
import { ArticleHero } from "@/components/blog/ArticleHero"
import { AuthorCard } from "@/components/blog/AuthorCard"
import { ShareButtons } from "@/components/blog/ShareButtons"
import { TableOfContents } from "@/components/blog/TableOfContents"
import { RelatedArticles } from "@/components/blog/RelatedArticles"
import { NewsletterCTA } from "@/components/blog/NewsletterCTA"
import { ReadingProgress } from "@/components/blog/ReadingProgress"
import { BlogComments } from "@/components/blog/BlogComments"
import { getPostBySlug } from "@aivora/lib/supabase/blog"

export async function generateStaticParams() {
  // Read from the English index JSON (it should match Arabic)
  const indexJson = await import(`../../../../../messages/en/blog/index.json`)
  const slugs = indexJson.slugs as string[]
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  
  try {
    const t = await getTranslations({ locale, namespace: `blog.${slug}` })
    return {
      title: t("seoTitle"),
      description: t("seoDescription"),
      keywords: t("keywords"),
      alternates: {
        canonical: `https://aivora-lac.vercel.app/${locale}/blog/${slug}`,
        languages: {
          "en": `https://aivora-lac.vercel.app/en/blog/${slug}`,
          "ar": `https://aivora-lac.vercel.app/ar/blog/${slug}`,
        }
      },
      openGraph: {
        title: t("seoTitle"),
        description: t("seoDescription"),
        type: "article",
        publishedTime: t("publishDate"),
        modifiedTime: t("updatedDate"),
        authors: [t("author")],
        images: [{ url: t("coverImage") }],
      },
      twitter: {
        card: "summary_large_image",
        title: t("seoTitle"),
        description: t("seoDescription"),
        images: [t("coverImage")],
      }
    }
  } catch (err) {
    return {}
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  let post = await getPostBySlug(slug, locale)

  if (!post || !post.content) {
    let postT;
    try {
      postT = await getTranslations({ locale, namespace: `blog.${slug}` })
    } catch (err) {
      notFound()
    }

    post = {
      id: "json-fallback",
      slug,
      title: postT("title"),
      subtitle: postT("subtitle"),
      excerpt: postT("excerpt"),
      author: postT("author"),
      authorRole: postT("authorRole"),
      authorImage: postT("authorImage"),
      coverImage: postT("coverImage"),
      category: postT("category"),
      tags: postT.raw("tags") as string[],
      publishDate: postT("publishDate"),
      updatedDate: postT("updatedDate"),
      readingTime: postT("readingTime"),
      tableOfContents: postT.raw("tableOfContents") as { id: string, title: string }[],
      content: postT.raw("content") as { type: string, id?: string, text: string }[],
      relatedPostsSlugs: postT.raw("relatedPosts") as string[],
    } as any
  } else {
    // Supabase post structure adaptation
    post = {
      ...post,
      authorRole: "Software Engineer",
      authorImage: "/team/placeholder.png",
      updatedDate: post.publishDate,
      tableOfContents: typeof post.content === 'string' ? [] : (post as any).tableOfContents || [],
      content: typeof post.content === 'string' ? [{ type: 'p', text: post.content }] : post.content,
      relatedPostsSlugs: []
    } as any
  }

  const article = post as any

  // Load related posts dynamically
  const relatedPosts = await Promise.all(article.relatedPostsSlugs.map(async (relatedSlug: string) => {
    try {
      const relT = await getTranslations({ locale, namespace: `blog.${relatedSlug}` })
      return {
        slug: relatedSlug,
        title: relT("title"),
        excerpt: relT("excerpt"),
        author: relT("author"),
        coverImage: relT("coverImage"),
        category: relT("category"),
        publishDate: relT("publishDate"),
        readingTime: relT("readingTime"),
      }
    } catch {
      return null
    }
  }))

  const validRelatedPosts = relatedPosts.filter(Boolean) as any[]

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": `https://aivora-lac.vercel.app${article.coverImage}`,
    "datePublished": article.publishDate,
    "dateModified": article.updatedDate,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Aivora",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aivora-lac.vercel.app/logo.png"
      }
    }
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": locale === "ar" ? "الرئيسية" : "Home",
        "item": `https://aivora-lac.vercel.app/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": locale === "ar" ? "المدونة" : "Blog",
        "item": `https://aivora-lac.vercel.app/${locale}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://aivora-lac.vercel.app/${locale}/blog/${slug}`
      }
    ]
  }

  return (
    <main className="flex min-h-screen flex-col bg-background pt-24 lg:pt-32 relative">
      <ReadingProgress />
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <ArticleHero post={article} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24 relative">
          
          {/* Left Sidebar: Share & TOC */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <div>
                <ShareButtons url={`https://aivora-lac.vercel.app/${locale}/blog/${slug}`} title={article.title} />
              </div>
              <TableOfContents toc={article.tableOfContents} />
            </div>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-6 flex flex-col gap-8 text-lg leading-loose text-muted-foreground">
            {article.content.map((block: any, idx: number) => {
              if (block.type === "h2") {
                return <h2 key={idx} id={block.id} className="text-3xl font-bold text-foreground mt-8 mb-4 tracking-tight">{block.text}</h2>
              }
              if (block.type === "p") {
                return <p key={idx}>{block.text}</p>
              }
              return null
            })}
            
            <div className="mt-12 lg:hidden">
              <ShareButtons url={`https://aivora-lac.vercel.app/${locale}/blog/${slug}`} title={article.title} />
            </div>
          </article>

          {/* Right Sidebar: Author */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <AuthorCard author={article.author} role={article.authorRole} image={article.authorImage} />
            </div>
          </aside>
        </div>

        <BlogComments postId={article.id} />
        
        <div className="mt-24">
          <NewsletterCTA />
        </div>
        
        <RelatedArticles posts={validRelatedPosts} />
      </div>
    </main>
  )
}
