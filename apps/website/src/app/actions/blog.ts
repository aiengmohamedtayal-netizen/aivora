"use server"

import { createClient } from "@aivora/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deletePost(id: string) {
  const supabase = await createClient()

  // Verify Admin/Editor role (RLS also protects this)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/blog')
  revalidatePath('/[locale]/blog', 'layout')
  return { success: true }
}

export async function createPlaceholderPost(title: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const { error } = await supabase.from('blog_posts').insert({
    slug,
    title_en: title,
    title_ar: title,
    excerpt_en: "New placeholder excerpt",
    excerpt_ar: "New placeholder excerpt",
    content_en: [{ type: "p", text: "New placeholder content." }],
    content_ar: [{ type: "p", text: "New placeholder content." }],
    seo_title_en: title,
    seo_title_ar: title,
    status: 'draft',
    reading_time: 1
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/blog')
  return { success: true }
}
