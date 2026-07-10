"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Mail, MessageSquare, Bot, Inbox as InboxIcon, Filter, Search, Send } from "lucide-react"

export default function UnifiedInboxPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "contact" | "intake" | "ai" | "email">("all")
  const [search, setSearch] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null)
  const [replyText, setReplyText] = useState("")

  const supabase = createClient()

  useEffect(() => {
    // Generate high-fidelity inbox mock items
    setMessages([
      {
        id: "m1",
        type: "contact",
        sender: "Ahmed",
        company: "ABC Corp",
        subject: "Needs custom CRM solution",
        body: "Hello Aivora team, we are looking to replace our Salesforce pipeline with a custom built CRM solution tailored to our real-estate brokerage. We need advanced lead matching algorithms.",
        date: "10m ago",
        status: "new"
      },
      {
        id: "m2",
        type: "intake",
        sender: "Yousef",
        company: "Riyadh Fintech",
        subject: "Project Intake Wizard Form Submission",
        body: "Project Type: SaaS Development. Budget: $10k+. Expected Timeline: 3 months. Phase: MVP. Stack preference: Next.js + Supabase. Custom requirements: Payment gateway integration (Mada, StcPay).",
        date: "2h ago",
        status: "contacted"
      },
      {
        id: "m3",
        type: "ai",
        sender: "Anonymous Visitor",
        company: "Browser Session",
        subject: "Chat session: 'I want to build a SaaS'",
        body: "Visitor: 'How much does it cost to build a SaaS?'\nAI: 'Building a custom SaaS platform typically starts at $8k depending on scope. Tell me about your requirements.'\nVisitor: 'I want to build a SaaS for medical scheduling.'",
        date: "4h ago",
        status: "new"
      },
      {
        id: "m4",
        type: "email",
        sender: "Sarah Smith",
        company: "N/A",
        subject: "Newsletter reply: Re: Next-intl setup tips",
        body: "Thanks for this newsletter update! It helped me solve the dynamic route params exception in Next 15. Do you guys offer consulting for enterprise migrations?",
        date: "1d ago",
        status: "new"
      }
    ])
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
    alert(`Reply sent to ${selectedMessage.sender}!`)
    setReplyText("")
  }

  const updateStatus = (id: string, newStatus: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, status: newStatus } : m)
    setMessages(updated)
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus })
    }
  }

  return (
    <div className="flex h-[82vh] gap-6 overflow-hidden">
      {/* Messages List Panel */}
      <div className="w-[400px] flex-shrink-0 bg-card border border-border/80 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/60 space-y-3">
          <h1 className="text-xl font-bold text-foreground">Unified Inbox</h1>
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search inbox..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-secondary/35 border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
          </div>

          {/* Filter badges */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
            {[
              { id: "all", label: "All", icon: Filter },
              { id: "contact", label: "Forms", icon: Mail },
              { id: "intake", label: "Intake", icon: InboxIcon },
              { id: "ai", label: "AI Chat", icon: Bot },
              { id: "email", label: "Email", icon: MessageSquare }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                  activeTab === tab.id 
                    ? "bg-primary border-primary text-primary-foreground font-semibold" 
                    : "border-border bg-card text-muted-foreground hover:bg-secondary/40"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Cards Scroll */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/40">
          {filteredMessages.map((msg) => (
            <div 
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`p-4 cursor-pointer transition-all text-left ${
                selectedMessage?.id === msg.id 
                  ? "bg-secondary/45 border-l-2 border-primary" 
                  : "hover:bg-secondary/15"
              }`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="font-bold text-xs text-foreground">{msg.sender}</span>
                <span className="text-[10px] text-muted-foreground">{msg.date}</span>
              </div>
              <h3 className="text-xs font-semibold text-foreground truncate mb-1">{msg.subject}</h3>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{msg.body}</p>
              
              <div className="flex items-center justify-between mt-3 text-[9px] text-muted-foreground">
                <span className="uppercase tracking-wider font-bold bg-secondary px-2 py-0.5 rounded text-[8px]">{msg.type}</span>
                <span className={`px-1.5 py-0.5 rounded font-medium capitalize ${
                  msg.status === 'new' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                }`}>{msg.status}</span>
              </div>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No messages match this filter
            </div>
          )}
        </div>
      </div>

      {/* Message Conversation Viewer Panel */}
      <div className="flex-1 bg-card border border-border/80 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
        {selectedMessage ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-border/60 flex justify-between items-center bg-secondary/5">
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedMessage.subject}</h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>From: <strong className="text-foreground">{selectedMessage.sender}</strong></span>
                  <span>•</span>
                  <span>Company: <strong className="text-foreground">{selectedMessage.company}</strong></span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={selectedMessage.status}
                  onChange={(e) => updateStatus(selectedMessage.id, e.target.value)}
                  className="bg-secondary text-xs text-muted-foreground border border-border rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="proposal">Proposal</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>

            {/* Message Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                  {selectedMessage.sender[0]}
                </div>
                <div className="flex-1 p-4 bg-secondary/20 rounded-xl border border-border/40 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.body}
                </div>
              </div>
            </div>

            {/* Reply Input Bar */}
            <div className="p-4 border-t border-border/65 bg-secondary/10 flex gap-4 items-end">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${selectedMessage.sender}...`}
                className="flex-1 min-h-[50px] max-h-[120px] p-3 bg-background border border-border/80 rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none"
              />
              <button 
                onClick={sendReply}
                className="p-3 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <Mail className="w-12 h-12 text-muted-foreground/40" />
            <p className="text-sm">Select a message from the list to view conversations</p>
          </div>
        )}
      </div>
    </div>
  )
}
