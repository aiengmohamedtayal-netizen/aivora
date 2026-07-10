"use client"

import { useState } from "react"
import { CreditCard, Plus, Trash2, Printer, CheckCircle, Clock, AlertCircle } from "lucide-react"

type Invoice = {
  id: string
  client: string
  project: string
  amount: number
  status: "paid" | "pending" | "overdue"
  date: string
}

export default function InvoicesManagerPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "inv-1001", client: "Riyadh Tech", project: "AI CRM Solutions", amount: 4500, status: "paid", date: "2026-07-01" },
    { id: "inv-1002", client: "Dubai Retail", project: "E-Commerce Re-Architecture", amount: 1800, status: "pending", date: "2026-07-08" },
    { id: "inv-1003", client: "SaaS Startups", project: "Multi-tenant SaaS Core", amount: 6000, status: "overdue", date: "2026-06-15" }
  ])

  const [newClient, setNewClient] = useState("")
  const [newProject, setNewProject] = useState("AI CRM Solutions")
  const [newAmount, setNewAmount] = useState("")
  const [newStatus, setNewStatus] = useState<Invoice["status"]>("pending")

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClient.trim() || !newAmount.trim()) return

    const invoice: Invoice = {
      id: `inv-${Math.floor(1000 + Math.random() * 9000)}`,
      client: newClient,
      project: newProject,
      amount: parseFloat(newAmount),
      status: newStatus,
      date: new Date().toISOString().split('T')[0]!
    }

    setInvoices([invoice, ...invoices])
    setNewClient("")
    setNewAmount("")
  }

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(i => i.id !== id))
  }

  const printInvoice = (inv: Invoice) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
      <head>
        <title>Invoice ${inv.id}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .meta { margin: 40px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { bg-color: #f5f5f5; }
          .total { margin-top: 40px; text-align: right; font-size: 1.2em; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Aivora Engineering</h1>
            <p>hello@aivora.com</p>
          </div>
          <div>
            <h2>INVOICE</h2>
            <p>Invoice ID: ${inv.id}</p>
            <p>Date: ${inv.date}</p>
          </div>
        </div>
        <div class="meta">
          <h3>Billed To:</h3>
          <p><strong>${inv.client}</strong></p>
          <p>Project: ${inv.project}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Software Engineering Services for ${inv.project}</td>
              <td style="text-align: right;">$${inv.amount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <div class="total">
          Total Due: $${inv.amount.toLocaleString()}
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OS Invoices</h1>
          <p className="text-muted-foreground text-sm">Issue invoices, record client payments, and track billing details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Invoice Form */}
        <div className="bg-card border border-border/80 rounded-xl p-6 h-fit space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Create Invoice
          </h3>

          <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-muted-foreground block">Client Name</label>
              <input 
                type="text" 
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                placeholder="Riyadh Tech"
                className="w-full p-2.5 bg-secondary/35 border border-border rounded-lg outline-none text-foreground text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground block">Project Description</label>
              <select 
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                className="w-full p-2.5 bg-secondary/35 border border-border rounded-lg outline-none text-foreground text-sm cursor-pointer"
              >
                <option value="AI CRM Solutions">AI CRM Solutions</option>
                <option value="E-Commerce Re-Architecture">E-Commerce Re-Architecture</option>
                <option value="Multi-tenant SaaS Core">Multi-tenant SaaS Core</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground block">Billing Amount ($)</label>
              <input 
                type="number" 
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="4500"
                className="w-full p-2.5 bg-secondary/35 border border-border rounded-lg outline-none text-foreground text-sm font-semibold"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground block">Invoice Status</label>
              <select 
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full p-2.5 bg-secondary/35 border border-border rounded-lg outline-none text-foreground text-sm cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
            <button 
              type="submit"
              className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs shadow-md mt-2"
            >
              Generate Invoice PDF
            </button>
          </form>
        </div>

        {/* Invoices List table */}
        <div className="lg:col-span-2 bg-card border border-border/80 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" /> Invoice History
          </h3>

          <div className="border border-border/40 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase border-b border-border/40">
                <tr>
                  <th className="px-4 py-3">Invoice ID</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-secondary/15 transition-colors text-xs">
                    <td className="px-4 py-3 font-mono text-muted-foreground">{inv.id}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground block">{inv.client}</span>
                      <span className="text-[10px] text-muted-foreground">{inv.project}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-foreground">${inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' 
                        : inv.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' 
                        : 'bg-red-500/10 text-red-400'
                      }`}>
                        {inv.status === 'paid' ? <CheckCircle className="w-3 h-3" /> 
                        : inv.status === 'pending' ? <Clock className="w-3 h-3" /> 
                        : <AlertCircle className="w-3 h-3" />}
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2.5">
                      <button 
                        onClick={() => printInvoice(inv)}
                        className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                        title="Print Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteInvoice(inv.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
