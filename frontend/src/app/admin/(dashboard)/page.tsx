import { createClient } from "@/lib/supabase/server"
import { 
  Users, 
  Bot, 
  Inbox, 
  FileText, 
  Mail, 
  TrendingUp, 
  Globe, 
  Activity 
} from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Safely fetch metrics with fallbacks
  let stats = {
    visitors: 1280, // Mocked for analytics (logged client-side)
    aiChats: 0,
    contacts: 0,
    intakes: 0,
    subscribers: 0,
    posts: 0,
    conversionRate: "4.2%",
  }

  try {
    // 1. Fetch AI Chats count
    const { count: chatCount } = await supabase
      .from("chat_sessions")
      .select("*", { count: "exact", head: true })
    stats.aiChats = chatCount || 0

    // 2. Fetch Newsletter subscribers count
    const { count: subCount } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
    stats.subscribers = subCount || 0

    // 3. Fetch Blog articles count
    const { count: postCount } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
    stats.posts = postCount || 0

    // 4. Fetch Intake Requests (leads table)
    const { count: leadCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
    stats.intakes = leadCount || 0

    // Calculate simulated conversion rate based on leads / visitors
    if (stats.visitors > 0) {
      stats.conversionRate = ((stats.intakes / stats.visitors) * 100).toFixed(1) + "%"
    }
  } catch (err) {
    console.error("Dashboard metrics failed to load. Using safe fallbacks:", err)
  }

  const kpis = [
    { name: "Today's Visitors", value: stats.visitors, change: "+12.4%", icon: Users, color: "text-blue-500 bg-blue-500/10" },
    { name: "AI Conversations", value: stats.aiChats, change: "+4.1%", icon: Bot, color: "text-purple-500 bg-purple-500/10" },
    { name: "Intake Requests", value: stats.intakes, change: "New Leads", icon: Inbox, color: "text-emerald-500 bg-emerald-500/10" },
    { name: "Newsletter Subscribers", value: stats.subscribers, change: "Active", icon: Mail, color: "text-pink-500 bg-pink-500/10" },
    { name: "Blog Posts", value: stats.posts, change: "CMS Articles", icon: FileText, color: "text-orange-500 bg-orange-500/10" },
    { name: "Conversion Rate", value: stats.conversionRate, change: "+0.8%", icon: TrendingUp, color: "text-cyan-500 bg-cyan-500/10" },
  ]

  const topPages = [
    { path: "/", views: 840, unique: 610 },
    { path: "/services/ai-solutions", views: 320, unique: 220 },
    { path: "/blog/why-startups-should-choose-custom-software", views: 180, unique: 110 },
  ]

  const topCountries = [
    { country: "Saudi Arabia", visitors: 420, code: "SA" },
    { country: "United Arab Emirates", visitors: 280, code: "AE" },
    { country: "Egypt", visitors: 190, code: "EG" },
    { country: "United States", visitors: 120, code: "US" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
        <p className="text-muted-foreground text-sm">Welcome back. Here is the operational health of Aivora OS.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="p-6 bg-card border border-border/80 rounded-xl flex items-center justify-between shadow-sm">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{kpi.name}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">{kpi.value}</span>
                <span className="text-xs text-emerald-500 font-medium">{kpi.change}</span>
              </div>
            </div>
            <div className={`p-3.5 rounded-lg ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className="p-6 bg-card border border-border/80 rounded-xl space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Most Visited Pages
          </h2>
          <div className="border border-border/40 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase border-b border-border/40">
                <tr>
                  <th className="px-4 py-3">Path</th>
                  <th className="px-4 py-3 text-right">Views</th>
                  <th className="px-4 py-3 text-right">Unique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {topPages.map((page) => (
                  <tr key={page.path} className="hover:bg-secondary/15 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{page.path}</td>
                    <td className="px-4 py-3 text-right font-medium">{page.views}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{page.unique}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Countries */}
        <div className="p-6 bg-card border border-border/80 rounded-xl space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Demographics by Country
          </h2>
          <div className="border border-border/40 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase border-b border-border/40">
                <tr>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3 text-right">Visitors</th>
                  <th className="px-4 py-3 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {topCountries.map((tc) => (
                  <tr key={tc.country} className="hover:bg-secondary/15 transition-colors">
                    <td className="px-4 py-3 font-medium">{tc.country}</td>
                    <td className="px-4 py-3 text-right font-bold">{tc.visitors}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {((tc.visitors / 1010) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
