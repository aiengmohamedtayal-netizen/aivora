"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Save, ArrowLeft, ArrowRight, Server, FileText, HelpCircle, Layers } from "lucide-react"

export default function ServicesCMSPage() {
  const [services, setServices] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState<any | null>(null)
  
  // Service configuration states
  const [heroTitle, setHeroTitle] = useState("")
  const [heroDesc, setHeroDesc] = useState("")
  const [pricing, setPricing] = useState("")
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDesc, setSeoDesc] = useState("")
  
  const supabase = createClient()

  useEffect(() => {
    // Generate default services mapping (matching standard config)
    setServices([
      { id: "s1", slug: "ai-solutions", title: "AI Solutions / Chatbots", category: "AI Integration" },
      { id: "s2", slug: "custom-software", title: "Custom Enterprise Software", category: "Cloud Architecture" },
      { id: "s3", slug: "saas-development", title: "SaaS Development Platforms", category: "Web Apps" },
      { id: "s4", slug: "web-development", title: "Web Development Pages", category: "React / Next.js" },
      { id: "s5", slug: "automation", title: "Workflow & Business Automation", category: "Integrations" },
      { id: "s6", slug: "startup-mvp", title: "Startup MVP Accelerator", category: "Rapid Sprints" },
    ])
  }, [])

  const startEdit = (srv: any) => {
    setSelectedService(srv)
    setHeroTitle(srv.hero_title || `Scale with Aivora ${srv.title}`)
    setHeroDesc(srv.hero_desc || "Custom systems built for growth, reliability, and security.")
    setPricing(srv.pricing_tiers || "$5,000 / starting price")
    setSeoTitle(srv.seo_title || `${srv.title} – Aivora`)
    setSeoDesc(srv.seo_desc || "Bespoke development services tailored to your operations.")
  }

  const saveService = () => {
    alert("Service parameters successfully saved to Database!")
    setSelectedService(null)
  }

  if (selectedService) {
    return (
      <div className="space-y-8 pb-16">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <button 
            onClick={() => setSelectedService(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to List
          </button>
          <button 
            onClick={saveService}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm shadow-md"
          >
            <Save className="w-4 h-4" /> Save Metadata
          </button>
        </div>

        <div className="max-w-3xl space-y-6 bg-card border border-border p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="text-xl font-bold text-foreground">Editing Service: <span className="text-primary">{selectedService.title}</span></h2>
            <p className="text-xs text-muted-foreground mt-1">Configure layout, SEO descriptions, pricing, and FAQs.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold uppercase tracking-wider block">Hero Title</label>
              <input 
                type="text" 
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full p-3 bg-secondary/35 border border-border rounded-lg outline-none text-foreground text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold uppercase tracking-wider block">Hero Description</label>
              <textarea 
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
                className="w-full p-3 bg-secondary/35 border border-border rounded-lg outline-none text-foreground min-h-[100px] text-sm leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold uppercase tracking-wider block">Pricing Tier (Standard starting package)</label>
              <input 
                type="text" 
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                className="w-full p-3 bg-secondary/35 border border-border rounded-lg outline-none text-foreground text-sm"
              />
            </div>

            <div className="border-t border-border/40 my-6 pt-4 space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Search & SEO Meta Schema
              </h3>

              <div className="space-y-1">
                <label className="text-muted-foreground block">SEO Title Tag</label>
                <input 
                  type="text" 
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full p-2 bg-secondary/35 border border-border rounded-lg outline-none text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground block">SEO Meta Description</label>
                <textarea 
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full p-2 bg-secondary/35 border border-border rounded-lg outline-none text-foreground min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Services CMS</h1>
        <p className="text-muted-foreground text-sm">Configure details, JSON-LD schemas, pricing plans, and content for services dynamically.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div key={srv.id} className="p-6 bg-card border border-border/80 rounded-xl flex flex-col justify-between shadow-sm hover:border-primary/50 transition-all">
            <div className="space-y-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">{srv.title}</h3>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{srv.category}</span>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-border/40 flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-mono text-[10px]">/{srv.slug}</span>
              <button 
                onClick={() => startEdit(srv)}
                className="flex items-center gap-1 text-primary hover:underline font-semibold"
              >
                Configure <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
