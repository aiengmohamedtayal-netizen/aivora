"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Bot, MessageSquare, DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function AIConsolePage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalSessions: 142,
    tokenUsage: 358000,
    cost: 0.72,
    responseTime: "1.2s"
  })

  const supabase = createClient()

  useEffect(() => {
    // Mock conversations for the dashboard console logs
    setSessions([
      { id: "s1", title: "Looking to build a SaaS for medical scheduling", date: "15m ago", tokens: 420, messages: 6, lead: true },
      { id: "s2", title: "General inquiry on Aivora cloud architectures", date: "1h ago", tokens: 180, messages: 2, lead: false },
      { id: "s3", title: "Intake help checklist walkthrough assistant", date: "3h ago", tokens: 840, messages: 12, lead: true },
    ])
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant Console</h1>
        <p className="text-muted-foreground text-sm">Monitor live AI chatbot conversations, track token expenditures, costs, and lead generation conversions.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { name: "Total AI Sessions", value: stats.totalSessions, icon: Bot, color: "text-purple-500 bg-purple-500/10" },
          { name: "Tokens Consumed", value: stats.tokenUsage.toLocaleString(), icon: MessageSquare, color: "text-blue-500 bg-blue-500/10" },
          { name: "Est. OpenAI Cost", value: `$${stats.cost.toFixed(2)}`, icon: DollarSign, color: "text-emerald-500 bg-emerald-500/10" },
          { name: "Avg Response Speed", value: stats.responseTime, icon: Clock, color: "text-orange-500 bg-orange-500/10" },
        ].map((item) => (
          <div key={item.name} className="p-5 bg-card border border-border/80 rounded-xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.name}</span>
              <div className="text-2xl font-bold text-foreground">{item.value}</div>
            </div>
            <div className={`p-3 rounded-lg ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Conversations log */}
      <div className="bg-card border border-border/80 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Live AI Chat Logs</h2>
        
        <div className="border border-border/40 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase border-b border-border/40">
              <tr>
                <th className="px-6 py-3.5">Conversation Inquiry</th>
                <th className="px-6 py-3.5 text-center">Messages</th>
                <th className="px-6 py-3.5 text-center">Tokens</th>
                <th className="px-6 py-3.5 text-center">Lead Conversion</th>
                <th className="px-6 py-3.5 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-secondary/15 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2.5">
                    <Bot className="w-4 h-4 text-purple-400" />
                    {session.title}
                  </td>
                  <td className="px-6 py-4 text-center text-muted-foreground">{session.messages}</td>
                  <td className="px-6 py-4 text-center text-muted-foreground font-mono text-xs">{session.tokens}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      session.lead ? 'bg-emerald-500/10 text-emerald-400' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {session.lead ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {session.lead ? "Converted" : "No Conversion"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-muted-foreground">{session.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
