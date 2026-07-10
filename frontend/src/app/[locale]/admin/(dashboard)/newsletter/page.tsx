import { SectionLabel } from "@/components/ui/SectionLabel"
import { createClient } from "@/lib/supabase/server"

export default async function AdminNewsletterPage() {
  const supabase = await createClient()

  // Fetch subscribers
  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <SectionLabel>Newsletter</SectionLabel>
          <h1 className="text-4xl font-bold tracking-tight mt-2">Subscribers</h1>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 border border-border rounded-md text-sm hover:bg-secondary">Export CSV</button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Broadcast</button>
        </div>
      </div>

      <div className="border border-border/50 rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">Email</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Source</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Date Joined</th>
              <th className="px-6 py-4 font-medium text-right text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(subscribers || []).map((sub: any) => (
              <tr key={sub.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-medium">{sub.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${sub.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground capitalize">{sub.source || 'Website'}</td>
                <td className="px-6 py-4 text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-destructive hover:underline text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {(!subscribers || subscribers.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
