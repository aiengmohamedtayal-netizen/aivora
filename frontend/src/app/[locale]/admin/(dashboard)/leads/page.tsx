"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useTranslations } from "next-intl"
import { PageHeader } from "@/components/admin/PageHeader"
import { EmptyState } from "@/components/admin/EmptyState"
import { LoadingState } from "@/components/admin/LoadingState"
import { 
  Plus, 
  Trash2, 
  Download, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  UserPlus,
  Inbox
} from "lucide-react"

const columns = [
  { id: "new", name: "New" },
  { id: "qualified", name: "Qualified" },
  { id: "discovery", name: "Discovery Call" },
  { id: "proposal", name: "Proposal" },
  { id: "negotiation", name: "Negotiation" },
  { id: "won", name: "Won" },
  { id: "lost", name: "Lost" },
]

export default function LeadsPipelinePage() {
  const t = useTranslations("admin.Leads")
  const supabase = createClient()
  
  const [leads, setLeads] = useState<any[]>([])
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [notes, setNotes] = useState("")
  const [assignee, setAssignee] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (e) {
      console.error("Failed to load leads", e)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const updated = leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead)
    setLeads(updated)
    await supabase.from("leads").update({ status: newStatus }).eq("id", id)
  }

  const saveDetails = async () => {
    if (!selectedLead) return
    const updated = leads.map(lead => 
      lead.id === selectedLead.id ? { ...lead, notes, assignee } : lead
    )
    setLeads(updated)
    await supabase.from("leads").update({ notes, assignee }).eq("id", selectedLead.id)
    setSelectedLead({ ...selectedLead, notes, assignee })
    alert("Lead details saved successfully!")
  }

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return
    const filtered = leads.filter(l => l.id !== id)
    setLeads(filtered)
    if (selectedLead?.id === id) {
      setSelectedLead(null)
    }
    await supabase.from("leads").delete().eq("id", id)
  }

  const exportCSV = () => {
    if (leads.length === 0) return
    const headers = "Name,Email,Phone,Company,Project Type,Budget,Status,Created At\n"
    const rows = leads.map(l => 
      `"${l.name}","${l.email}","${l.phone || ''}","${l.company || ''}","${l.project_type}","${l.budget}","${l.status}","${l.created_at}"`
    ).join("\n")

    const blob = new Blob([headers + rows], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("href", url)
    a.setAttribute("download", `aivora-leads-${new Date().toISOString().split('T')[0]}.csv`)
    a.click()
  }

  return (
    <div className="space-y-8 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <PageHeader title={t("title")} description={t("subtitle")}>
        <button 
          onClick={exportCSV}
          disabled={leads.length === 0}
          className="flex items-center gap-2 px-4 py-2 border border-border/80 rounded-lg text-sm text-foreground hover:bg-secondary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </PageHeader>

      {loading ? (
        <LoadingState message="Loading pipeline..." />
      ) : leads.length === 0 ? (
        <EmptyState 
          icon={Inbox} 
          title="No Leads Found" 
          description="Your pipeline is currently empty. New project inquiries will appear here." 
        />
      ) : (
        <div className="flex-1 overflow-x-auto pb-4 flex gap-6 items-start">
          {columns.map((col) => {
            const colLeads = leads.filter(l => (l.status || "new") === col.id)
            return (
              <div key={col.id} className="w-80 flex-shrink-0 bg-card/60 backdrop-blur-md border border-border/60 rounded-xl p-4 flex flex-col max-h-[70vh]">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-border/40">
                  <h3 className="font-bold text-sm text-foreground">{col.name}</h3>
                  <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-medium">{colLeads.length}</span>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {colLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      onClick={() => {
                        setSelectedLead(lead)
                        setNotes(lead.notes || "")
                        setAssignee(lead.assignee || "")
                      }}
                      className="p-4 bg-secondary/35 border border-border/40 rounded-lg shadow-sm hover:border-primary/50 transition-all cursor-pointer space-y-3 hover:bg-secondary/50"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm text-foreground">{lead.name}</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{lead.budget}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{lead.message}</p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                        <span>{lead.project_type}</span>
                        <span>{lead.assignee ? `@${lead.assignee}` : "Unassigned"}</span>
                      </div>

                      <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-1" onClick={e => e.stopPropagation()}>
                        <select 
                          value={lead.status || "new"}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="bg-card text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 outline-none cursor-pointer"
                        >
                          {columns.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => deleteLead(lead.id)}
                          className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {colLeads.length === 0 && (
                    <div className="py-8 text-center text-xs text-muted-foreground border-2 border-dashed border-border/40 rounded-lg">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-40 flex flex-col p-8 transition-transform animate-in slide-in-from-right">
          <div className="flex justify-between items-center pb-4 border-b border-border/60">
            <h2 className="text-xl font-bold text-foreground">Lead Details</h2>
            <button 
              onClick={() => setSelectedLead(null)}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-primary">{selectedLead.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedLead.company || "No Company Specified"}</p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${selectedLead.email}`} className="hover:text-primary transition-colors">{selectedLead.email}</a>
              </div>
              {selectedLead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedLead.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span>Budget: <strong className="text-foreground">{selectedLead.budget}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Received: {new Date(selectedLead.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider">Project Proposal Inquiry</h4>
              <div className="p-4 bg-secondary/30 rounded-lg text-sm text-muted-foreground leading-relaxed border border-border/40">
                {selectedLead.message}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-sm text-foreground uppercase tracking-wider block">Internal Staff Notes</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write private notes on project scope, meeting feedback..."
                className="w-full min-h-[100px] p-3 bg-secondary/35 border border-border/80 rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-sm text-foreground uppercase tracking-wider block">Assign Staff Member</label>
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-muted-foreground" />
                <input 
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="Employee name (e.g. Khalid)"
                  className="flex-1 p-2 bg-secondary/35 border border-border/80 rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border flex gap-4">
              <button 
                onClick={saveDetails}
                className="flex-1 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm shadow-md"
              >
                Save Changes
              </button>
              <button 
                onClick={() => {
                  window.location.href = `mailto:${selectedLead.email}?subject=Project Consultation Inquiry — Aivora`
                }}
                className="flex-1 py-2.5 border border-border text-muted-foreground font-semibold rounded-lg text-sm hover:bg-secondary/40 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
