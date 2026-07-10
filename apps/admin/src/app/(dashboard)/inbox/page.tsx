"use client"

import { useState, useEffect } from "react"
import { createClient } from "@aivora/lib/supabase/client"
import { useTranslations } from "next-intl"
import { PageHeader } from "@/components/admin/PageHeader"
import { EmptyState } from "@/components/admin/EmptyState"
import { LoadingState } from "@/components/admin/LoadingState"
import { Bot, Inbox as InboxIcon, Filter, Search, Send, Clock, User, Hash } from "lucide-react"

type MessageItem = {
  id: string
  type: "intake" | "ai"
  sender: string
  company: string
  subject: string
  body: string
  date: string
  rawDate: Date
  status: string
  metadata?: any
}

export default function UnifiedInboxPage() {
  const t = useTranslations("admin.Inbox")
  const supabase = createClient()
  
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "intake" | "ai">("all")
  const [search, setSearch] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null)
  const [replyText, setReplyText] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchInbox = async () => {
    setLoading(true)
    try {
      const unified: MessageItem[] = []

      // 1. Fetch Intake Requests (leads)
      const { data: leads } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (leads) {
        leads.forEach((lead: any) => {
          unified.push({
            id: `lead_${lead.id}`,
            type: "intake",
            sender: lead.name,
            company: lead.company || "Unknown Company",
            subject: `Project Inquiry: ${lead.project_type}`,
            body: `Budget: ${lead.budget}\nPhone: ${lead.phone || 'N/A'}\nEmail: ${lead.email}\n\nMessage:\n${lead.message}`,
            date: new Date(lead.created_at).toLocaleDateString(),
            rawDate: new Date(lead.created_at),
            status: lead.status || "new",
            metadata: lead
          })
        })
      }

      // 2. Fetch AI Chat Sessions
      const { data: sessions } = await supabase
        .from("chat_sessions")
        .select("*, chat_messages(role, content, created_at)")
        .order("last_activity", { ascending: false })
        .limit(50)

      if (sessions) {
        sessions.forEach((session: any) => {
          // Format chat log
          const chatLog = (session.chat_messages || [])
            .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
            .join("\n\n")

          unified.push({
            id: `chat_${session.id}`,
            type: "ai",
            sender: "Anonymous Visitor",
            company: "Website AI Agent",
            subject: `AI Chat: ${session.title}`,
            body: chatLog || "No messages recorded.",
            date: new Date(session.last_activity || session.created_at).toLocaleDateString(),
            rawDate: new Date(session.last_activity || session.created_at),
            status: "new",
            metadata: session
          })
        })
      }

      // Sort by newest first
      unified.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime())
      setMessages(unified)

    } catch (e) {
      console.error("Failed to load inbox", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInbox()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredMessages = messages.filter(m => {
    const matchesTab = activeTab === "all" || m.type === activeTab
    const matchesSearch = 
      m.sender.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.body.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  const sendReply = () => {
    if (!replyText.trim() || !selectedMessage) return
    alert(`Reply functionality requires backend mailer integration.`)
    setReplyText("")
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, status: newStatus } : m)
    setMessages(updated)
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus })
    }

    if (id.startsWith("lead_")) {
      const dbId = id.replace("lead_", "")
      await supabase.from("leads").update({ status: newStatus }).eq("id", dbId)
    }
  }

  return (
    <div className="h-[88vh] flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <PageHeader title={t("title")} description={t("subtitle")} />

      {loading ? (
        <LoadingState message="Syncing inbox sources..." />
      ) : messages.length === 0 ? (
        <EmptyState 
          icon={InboxIcon} 
          title="Inbox Zero" 
          description="You have no messages across any of your connected sources." 
        />
      ) : (
        <div className="flex flex-1 gap-6 overflow-hidden pb-4">
          {/* Messages List Panel */}
          <div className="w-[400px] flex-shrink-0 bg-card/60 backdrop-blur-md border border-border/80 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border/60 space-y-3">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search across all sources..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-secondary/35 border border-border/80 rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Filter badges */}
              <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                {[
                  { id: "all", label: "All", icon: Filter },
                  { id: "intake", label: "Intake Forms", icon: InboxIcon },
                  { id: "ai", label: "AI Sessions", icon: Bot },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                      activeTab === tab.id 
                        ? "bg-primary border-primary text-primary-foreground font-semibold shadow-md" 
                        : "border-border/60 bg-secondary/20 text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Cards Scroll */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/40 custom-scrollbar">
              {filteredMessages.map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 cursor-pointer transition-all text-left ${
                    selectedMessage?.id === msg.id 
                      ? "bg-primary/5 border-l-2 border-primary" 
                      : "hover:bg-secondary/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-bold text-sm text-foreground">{msg.sender}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> {msg.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground truncate mb-1">{msg.subject}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{msg.body}</p>
                  
                  <div className="flex items-center justify-between mt-3 text-[10px] font-medium">
                    <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      msg.type === 'ai' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {msg.type === 'ai' ? <Bot className="w-3 h-3"/> : <InboxIcon className="w-3 h-3"/>}
                      {msg.type.toUpperCase()}
                    </span>
                    
                    {msg.type === 'intake' && (
                      <span className={`px-2 py-0.5 rounded-full capitalize border ${
                        msg.status === 'new' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>{msg.status}</span>
                    )}
                  </div>
                </div>
              ))}

              {filteredMessages.length === 0 && (
                <div className="py-16 text-center flex flex-col items-center justify-center text-muted-foreground gap-3">
                  <Search className="w-8 h-8 opacity-20" />
                  <span className="text-sm">No messages match this filter</span>
                </div>
              )}
            </div>
          </div>

          {/* Message Conversation Viewer Panel */}
          <div className="flex-1 bg-card/60 backdrop-blur-md border border-border/80 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
            {selectedMessage ? (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-border/60 flex justify-between items-center bg-secondary/5">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedMessage.subject}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-3">
                      <span className="flex items-center gap-1.5"><User className="w-4 h-4"/> <strong className="text-foreground">{selectedMessage.sender}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5"><Hash className="w-4 h-4"/> <strong className="text-foreground">{selectedMessage.company}</strong></span>
                    </div>
                  </div>
                  
                  {selectedMessage.type === "intake" && (
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedMessage.status}
                        onChange={(e) => updateStatus(selectedMessage.id, e.target.value)}
                        className="bg-secondary/50 hover:bg-secondary text-sm font-medium text-foreground border border-border/80 rounded-lg px-4 py-2 outline-none cursor-pointer transition-colors"
                      >
                        <option value="new">New Lead</option>
                        <option value="qualified">Qualified</option>
                        <option value="discovery">Discovery Call</option>
                        <option value="proposal">Proposal</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-background/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                      {selectedMessage.type === 'ai' ? <Bot className="w-5 h-5"/> : (selectedMessage.sender?.[0]?.toUpperCase() || '?')}
                    </div>
                    <div className="flex-1 p-5 bg-card border border-border/60 rounded-xl rounded-tl-sm text-sm text-foreground leading-relaxed whitespace-pre-wrap shadow-sm font-mono">
                      {selectedMessage.body}
                    </div>
                  </div>
                </div>

                {/* Reply Input Bar */}
                {selectedMessage.type === 'intake' && (
                  <div className="p-5 border-t border-border/65 bg-card/80 flex gap-4 items-end">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply via email to ${selectedMessage.metadata?.email || selectedMessage.sender}...`}
                      className="flex-1 min-h-[60px] max-h-[160px] p-3 bg-secondary/20 border border-border/80 rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none transition-all"
                    />
                    <button 
                      onClick={sendReply}
                      className="h-[60px] px-6 bg-primary text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
                    >
                      <span>Send</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState 
                icon={InboxIcon} 
                title="Unified Inbox" 
                description="Select an intake form or AI chat session from the list to view the conversation details." 
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
