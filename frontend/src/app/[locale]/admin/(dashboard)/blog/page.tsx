import { SectionLabel } from "@/components/ui/SectionLabel"
import { createClient } from "@/lib/supabase/server"
import { deletePost, createPlaceholderPost } from "@/app/actions/blog"

export default async function AdminBlogPage() {
  const supabase = await createClient()

  // Fetch posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title_en, status, published_at, category:categories(name_en)')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <SectionLabel>Content Management</SectionLabel>
          <h1 className="text-4xl font-bold tracking-tight mt-2">Blog Posts</h1>
        </div>
        <div className="flex gap-4">
          <form action={async () => {
            "use server";
            await createPlaceholderPost(`New Draft ${new Date().getTime()}`)
          }}>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Create New Post</button>
          </form>
        </div>
      </div>

      <div className="border border-border/50 rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">Title (EN)</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Category</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Published</th>
              <th className="px-6 py-4 font-medium text-right text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(posts || []).map((post) => (
              <tr key={post.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-medium">{post.title_en}</td>
                <td className="px-6 py-4 text-muted-foreground capitalize">
                  {Array.isArray(post.category) ? post.category[0]?.name_en : (post.category as any)?.name_en || 'Uncategorized'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    post.status === 'published' ? 'bg-green-500/10 text-green-500' 
                    : post.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' 
                    : 'bg-muted text-muted-foreground'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button className="text-primary hover:underline text-sm font-medium">Edit</button>
                  <form action={async () => {
                    "use server";
                    await deletePost(post.id)
                  }}>
                    <button type="submit" className="text-destructive hover:underline text-sm font-medium">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No blog posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
