import { SectionLabel } from "@/components/ui/SectionLabel"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch some quick stats
  const { count: postCount } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true })
  const { count: subCount } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true })

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <SectionLabel>Dashboard</SectionLabel>
        <h1 className="text-4xl font-bold tracking-tight mt-2">Overview</h1>
        <p className="text-muted-foreground mt-2 text-lg">Welcome to Aivora OS. Manage your content and subscribers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 rounded-xl border border-border/50 bg-card">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Articles</h3>
          <p className="text-4xl font-bold mt-2">{postCount || 0}</p>
        </div>
        
        <div className="p-6 rounded-xl border border-border/50 bg-card">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Subscribers</h3>
          <p className="text-4xl font-bold mt-2">{subCount || 0}</p>
        </div>

        <div className="p-6 rounded-xl border border-border/50 bg-card">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Comments</h3>
          <p className="text-4xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  )
}
