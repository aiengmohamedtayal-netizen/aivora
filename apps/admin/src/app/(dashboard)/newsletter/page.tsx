"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { createClient } from "@aivora/lib/supabase/client"
import { useTranslations } from "next-intl"
import { PageHeader } from "@/components/admin/PageHeader"
import { EmptyState } from "@/components/admin/EmptyState"
import { LoadingState } from "@/components/admin/LoadingState"
import { Users, Trash2, Download, Search, CheckCircle, Clock, XCircle, Mailbox } from "lucide-react"

export default function NewsletterSubscribersPage() {
  const t = useTranslations("admin.Newsletter")
  const supabase = useMemo(() => createClient(), [])
  
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setSubscribers(data || [])
    } catch (e) {
      console.error("Failed to fetch subscribers", e)
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return
    const filtered = subscribers.filter(s => s.id !== id)
    setSubscribers(filtered)
    await supabase.from("newsletter_subscribers").delete().eq("id", id)
  }

  const exportCSV = () => {
    if (subscribers.length === 0) return
    const headers = "Email,Source,Status,Date,Locale\n"
    const rows = subscribers.map(s => 
      `"${s.email}","${s.source || 'website'}","${s.status}","${s.created_at}","${s.locale}"`
    ).join("\n")

    const blob = new Blob([headers + rows], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("href", url)
    a.setAttribute("download", `aivora-subscribers-${new Date().toISOString().split('T')[0]}.csv`)
    a.click()
  }

  const filteredSubs = subscribers.filter(s => 
    (s.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.source || "").toLowerCase().includes(search.toLowerCase())
  )

  // Compute subscriber statistics
  const stats = useMemo(() => {
    const total = subscribers.length
    const confirmed = subscribers.filter(s => s.status === "confirmed").length
    const pending = subscribers.filter(s => s.status === "pending").length
    const unsubscribed = subscribers.filter(s => s.status === "unsubscribed").length
    return { total, confirmed, pending, unsubscribed }
  }, [subscribers])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <PageHeader title={t("title")} description={t("subtitle")}>
        <button 
          onClick={exportCSV}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 px-4 py-2 border border-border/80 rounded-lg text-sm text-foreground hover:bg-secondary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </PageHeader>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Subscribers", count: stats.total, color: "border-blue-500/20 bg-blue-500/5 text-blue-400" },
          { label: "Confirmed Opt-in", count: stats.confirmed, color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
          { label: "Pending Verification", count: stats.pending, color: "border-amber-500/20 bg-amber-500/5 text-amber-400" },
          { label: "Unsubscribed", count: stats.unsubscribed, color: "border-red-500/20 bg-red-500/5 text-red-400" }
        ].map((item, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${item.color} flex flex-col gap-1`}>
            <span className="text-xs font-medium opacity-80">{item.label}</span>
            <span className="text-2xl font-bold tracking-tight">{item.count}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4 items-center max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search email or source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border/80 rounded-lg text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary transition-colors shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading subscribers..." />
      ) : subscribers.length === 0 ? (
        <EmptyState 
          icon={Mailbox} 
          title="No Subscribers Yet" 
          description="You don't have any newsletter subscribers yet. Wait for users to subscribe via the website footer." 
        />
      ) : (
        <div className="border border-border/60 rounded-xl overflow-hidden bg-card/60 backdrop-blur-md shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 border-b border-border/60">
                <tr>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Subscriber Email</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Source</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Date Subscribed</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Locale</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 font-medium text-right text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredSubs.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      {sub.email}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                      <span className="bg-secondary px-2.5 py-1 rounded-full border border-border/40">
                        {sub.source || "Website Footer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(sub.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs uppercase font-medium">{sub.locale || "en"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border ${
                        sub.status === 'confirmed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : sub.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {sub.status === 'confirmed' ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : sub.status === 'pending' ? (
                          <Clock className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => deleteSubscriber(sub.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSubs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Search className="w-8 h-8 opacity-20" />
                        <span className="text-sm">No subscribers match your search</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
