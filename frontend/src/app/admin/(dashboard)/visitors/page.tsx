"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { BarChart3, Users, Laptop, Globe, Compass, Share2 } from "lucide-react"

export default function VisitorsAnalyticsPage() {
  const [onlineCount, setOnlineCount] = useState(5)
  const [visitors, setVisitors] = useState<any[]>([])

  useEffect(() => {
    // Simulated visitors logs
    setVisitors([
      { id: 1, ip: "192.168.1.42", country: "Saudi Arabia", city: "Riyadh", device: "Desktop", browser: "Chrome", referrer: "Google", duration: "12m 40s" },
      { id: 2, ip: "98.24.51.109", country: "United States", city: "New York", device: "Mobile", browser: "Safari", referrer: "Direct", duration: "4m 12s" },
      { id: 3, ip: "109.87.12.3", country: "United Arab Emirates", city: "Dubai", device: "Desktop", browser: "Firefox", referrer: "Twitter / X", duration: "8m 55s" },
      { id: 4, ip: "197.32.1.200", country: "Egypt", city: "Cairo", device: "Mobile", browser: "Chrome", referrer: "LinkedIn", duration: "1m 30s" }
    ])

    // Randomize online visitor count slightly to show dynamic updates
    const timer = setInterval(() => {
      setOnlineCount(prev => Math.max(2, prev + (Math.random() > 0.5 ? 1 : -1)))
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visitors & Analytics</h1>
          <p className="text-muted-foreground text-sm">Monitor real-time visitors, session durations, devices, and traffic origins.</p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {onlineCount} Online Now
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Top Origin", value: "Saudi Arabia (42%)", icon: Globe, color: "text-blue-500 bg-blue-500/10" },
          { label: "Device Share", value: "Mobile (58%)", icon: Laptop, color: "text-purple-500 bg-purple-500/10" },
          { label: "Fav Browser", value: "Chrome (64%)", icon: Compass, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Primary Source", value: "Google Search (48%)", icon: Share2, color: "text-pink-500 bg-pink-500/10" }
        ].map(item => (
          <div key={item.label} className="p-5 bg-card border border-border/80 rounded-xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
              <div className="text-base font-bold text-foreground">{item.value}</div>
            </div>
            <div className={`p-3 rounded-lg ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Visitor Session Logs */}
      <div className="bg-card border border-border/80 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" /> Active Visitor Logs
        </h2>

        <div className="border border-border/40 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase border-b border-border/40">
              <tr>
                <th className="px-6 py-3.5">IP Address</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Device</th>
                <th className="px-6 py-3.5">Browser</th>
                <th className="px-6 py-3.5">Referrer</th>
                <th className="px-6 py-3.5 text-right">Session Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {visitors.map((v) => (
                <tr key={v.id} className="hover:bg-secondary/15 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-foreground">{v.ip}</td>
                  <td className="px-6 py-4 text-muted-foreground">{v.city}, {v.country}</td>
                  <td className="px-6 py-4 text-muted-foreground">{v.device}</td>
                  <td className="px-6 py-4 text-muted-foreground">{v.browser}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{v.referrer}</td>
                  <td className="px-6 py-4 text-right font-semibold text-foreground">{v.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
