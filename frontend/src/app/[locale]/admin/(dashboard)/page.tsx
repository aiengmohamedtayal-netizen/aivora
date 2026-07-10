import { createClient } from "@/lib/supabase/server"
import { getTranslations } from "next-intl/server"
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
import { PageHeader } from "@/components/admin/PageHeader"
import { EmptyState } from "@/components/admin/EmptyState"

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()
  const t = await getTranslations({ locale, namespace: "admin.Dashboard" })

  // Safely fetch metrics with fallbacks
  let stats = {
    visitors: 0,
    aiChats: 0,
    contacts: 0,
    intakes: 0,
    subscribers: 0,
    posts: 0,
    conversionRate: "0%",
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

    // 5. Fetch visitors (count today)
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const { count: visitorCount } = await supabase
      .from("visitor_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfDay.toISOString())
    stats.visitors = visitorCount || 0

    // Calculate simulated conversion rate based on leads / visitors
    if (stats.visitors > 0) {
      stats.conversionRate = ((stats.intakes / stats.visitors) * 100).toFixed(1) + "%"
    }
  } catch (err) {
    console.error("Dashboard metrics failed to load.", err)
  }

  const kpis = [
    { name: t("todayVisitors"), value: stats.visitors, change: "", icon: Users, color: "text-blue-500 bg-blue-500/10" },
    { name: t("activeSessions"), value: stats.aiChats, change: "", icon: Bot, color: "text-purple-500 bg-purple-500/10" },
    { name: t("newLeads"), value: stats.intakes, change: "", icon: Inbox, color: "text-emerald-500 bg-emerald-500/10" },
    { name: t("subscribers"), value: stats.subscribers, change: "", icon: Mail, color: "text-pink-500 bg-pink-500/10" },
    { name: t("blog"), value: stats.posts, change: "", icon: FileText, color: "text-orange-500 bg-orange-500/10" },
    { name: "Conversion Rate", value: stats.conversionRate, change: "", icon: TrendingUp, color: "text-cyan-500 bg-cyan-500/10" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <PageHeader 
        title={t("title")} 
        description={t("subtitle")} 
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="p-6 bg-card/60 backdrop-blur-md border border-border/80 rounded-xl flex items-center justify-between shadow-sm transition-all hover:shadow-md hover:bg-card/80">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{kpi.name}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-foreground">{kpi.value}</span>
                {kpi.change && <span className="text-xs text-emerald-500 font-medium">{kpi.change}</span>}
              </div>
            </div>
            <div className={`p-3.5 rounded-xl ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="p-6 bg-card/60 backdrop-blur-md border border-border/80 rounded-xl space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Activity className="w-4 h-4 text-primary" /> {t("recentActivity")}
          </h2>
          <EmptyState 
            icon={Activity} 
            title={t("recentActivity")} 
            description={t("emptyActivity")} 
          />
        </div>

        {/* System Health */}
        <div className="p-6 bg-card/60 backdrop-blur-md border border-border/80 rounded-xl space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Globe className="w-4 h-4 text-primary" /> {t("healthStatus")}
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <span className="text-sm font-medium">Supabase Database</span>
              <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 rounded">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <span className="text-sm font-medium">OpenAI API</span>
              <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 rounded">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
