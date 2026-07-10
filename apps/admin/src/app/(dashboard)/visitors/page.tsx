"use client"

import { useState, useEffect } from "react"
import { createClient } from "@aivora/lib/supabase/client"
import { useTranslations } from "next-intl"
import { PageHeader } from "@/components/admin/PageHeader"
import { EmptyState } from "@/components/admin/EmptyState"
import { LoadingState } from "@/components/admin/LoadingState"
import { BarChart3, Users, Laptop, Globe, Compass, Share2 } from "lucide-react"

export default function VisitorsAnalyticsPage() {
  const t = useTranslations("admin.Visitors")
  const supabase = createClient()
  
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [onlineCount, setOnlineCount] = useState(0)
  
  const [stats, setStats] = useState({
    topOrigin: "Unknown",
    deviceShare: "Unknown",
    topBrowser: "Unknown",
    topReferrer: "Unknown"
  })

  const fetchVisitors = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("visitor_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) throw error
      const logs = data || []
      setVisitors(logs)

      // Calculate pseudo-stats based on real logs
      if (logs.length > 0) {
        const countries: Record<string, number> = {}
        const devices: Record<string, number> = {}
        const browsers: Record<string, number> = {}
        const referrers: Record<string, number> = {}

        logs.forEach((log: any) => {
          const c = log.country || "Unknown"
          const d = log.device || "Desktop"
          const b = log.browser || "Chrome"
          const r = log.referrer || "Direct"

          countries[c] = (countries[c] || 0) + 1
          devices[d] = (devices[d] || 0) + 1
          browsers[b] = (browsers[b] || 0) + 1
          referrers[r] = (referrers[r] || 0) + 1
        })

        const maxKey = (obj: Record<string, number>) => {
          const keys = Object.keys(obj);
          if (keys.length === 0) return "Unknown";
          return keys.reduce((a, b) => (obj[a] || 0) > (obj[b] || 0) ? a : b);
        }
        
        setStats({
          topOrigin: `${maxKey(countries)} (${Math.round(((countries[maxKey(countries)] || 0) / logs.length) * 100)}%)`,
          deviceShare: `${maxKey(devices)} (${Math.round(((devices[maxKey(devices)] || 0) / logs.length) * 100)}%)`,
          topBrowser: `${maxKey(browsers)} (${Math.round(((browsers[maxKey(browsers)] || 0) / logs.length) * 100)}%)`,
          topReferrer: `${maxKey(referrers)} (${Math.round(((referrers[maxKey(referrers)] || 0) / logs.length) * 100)}%)`,
        })

        // Estimate online count based on logs in the last 15 minutes
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
        const recentLogs = logs.filter((l: any) => l.created_at >= fifteenMinsAgo)
        setOnlineCount(recentLogs.length)
      }

    } catch (e) {
      console.error("Failed to load visitor logs", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitors()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <PageHeader title={t("title")} description={t("subtitle")}>
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-semibold shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {onlineCount} Online Now
        </div>
      </PageHeader>

      {loading ? (
        <LoadingState message="Loading visitor analytics..." />
      ) : visitors.length === 0 ? (
        <EmptyState 
          icon={BarChart3} 
          title="No Visitors Yet" 
          description="We haven't recorded any visitors in the database. Ensure the tracking script is active on the frontend." 
        />
      ) : (
        <>
          {/* Analytics Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Top Origin", value: stats.topOrigin, icon: Globe, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
              { label: "Device Share", value: stats.deviceShare, icon: Laptop, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
              { label: "Fav Browser", value: stats.topBrowser, icon: Compass, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
              { label: "Primary Source", value: stats.topReferrer, icon: Share2, color: "text-pink-500 bg-pink-500/10 border-pink-500/20" }
            ].map(item => (
              <div key={item.label} className="p-5 bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                  <div className="text-sm font-bold text-foreground line-clamp-1">{item.value}</div>
                </div>
                <div className={`p-3 rounded-xl border ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Visitor Session Logs */}
          <div className="bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
              <BarChart3 className="w-5 h-5 text-primary" /> Recent Visitor Logs (Last 100)
            </h2>

            <div className="border border-border/40 rounded-xl overflow-hidden bg-background/50">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/50 text-xs text-muted-foreground uppercase border-b border-border/40 font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">IP Address</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Device</th>
                      <th className="px-6 py-4">Browser</th>
                      <th className="px-6 py-4">Path</th>
                      <th className="px-6 py-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {visitors.map((v) => (
                      <tr key={v.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-foreground/80">{v.ip || "Unknown"}</td>
                        <td className="px-6 py-4 text-foreground/90 font-medium">
                          {v.city ? `${v.city}, ` : ''}{v.country || "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          <span className="bg-secondary px-2.5 py-1 rounded-full text-xs font-medium border border-border/40">
                            {v.device || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">{v.browser || "Unknown"}</td>
                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs max-w-[150px] truncate" title={v.path}>
                          {v.path || "/"}
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-muted-foreground font-medium">
                          {new Date(v.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
