"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { createClient } from "@aivora/lib/supabase/client"
import { useTranslations } from "next-intl"
import { PageHeader } from "@/components/admin/PageHeader"
import { EmptyState } from "@/components/admin/EmptyState"
import { LoadingState } from "@/components/admin/LoadingState"
import { Save, ArrowLeft, ArrowRight, Server, Plus, Trash2, Edit2, Code, Smartphone, Cloud, Bot, Database } from "lucide-react"

export default function ServicesCMSPage() {
  const t = useTranslations("admin.Services")
  const supabase = useMemo(() => createClient(), [])
  
  const [services, setServices] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Real DB configurations
  const [slug, setSlug] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [titleAr, setTitleAr] = useState("")
  const [descEn, setDescEn] = useState("")
  const [descAr, setDescAr] = useState("")
  const [icon, setIcon] = useState("Server")

  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("services").select("*").order("title_en")
      if (error) throw error
      setServices(data || [])
    } catch (e) {
      console.error("Failed to fetch services", e)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const startEdit = (srv: any) => {
    setSelectedService(srv)
    setSlug(srv.slug || "")
    setTitleEn(srv.title_en || "")
    setTitleAr(srv.title_ar || "")
    setDescEn(srv.desc_en || "")
    setDescAr(srv.desc_ar || "")
    setIcon(srv.icon || "Server")
  }

  const startCreate = () => {
    startEdit({
      id: "new",
      slug: "new-service",
      title_en: "",
      title_ar: "",
      desc_en: "",
      desc_ar: "",
      icon: "Server"
    })
  }

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service permanently?")) return
    await supabase.from("services").delete().eq("id", id)
    setServices(services.filter(s => s.id !== id))
  }

  const saveService = async () => {
    const payload = {
      slug,
      title_en: titleEn,
      title_ar: titleAr,
      desc_en: descEn,
      desc_ar: descAr,
      icon
    }

    if (selectedService.id === "new") {
      const { error } = await supabase.from("services").insert([payload])
      if (error) {
        alert("Error creating service: " + error.message)
      } else {
        alert("Service created!")
        fetchServices()
        setSelectedService(null)
      }
    } else {
      const { error } = await supabase.from("services").update(payload).eq("id", selectedService.id)
      if (error) {
        alert("Error updating service: " + error.message)
      } else {
        alert("Service updated!")
        fetchServices()
        setSelectedService(null)
      }
    }
  }

  if (selectedService) {
    return (
      <div className="space-y-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <button 
            onClick={() => setSelectedService(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </button>
          <button 
            onClick={saveService}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            <Save className="w-4 h-4" /> Save Service
          </button>
        </div>

        <div className="max-w-4xl space-y-8 bg-card/60 backdrop-blur-md border border-border/80 p-8 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {selectedService.id === "new" ? "Create Service" : "Edit Service"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Configure bilingual details for the public services page.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-muted-foreground font-medium text-sm block">URL Slug (must be unique, lowercase, hyphens)</label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full p-3 bg-background border border-border/80 rounded-xl outline-none text-foreground focus:border-primary transition-colors text-sm"
                  placeholder="e.g. ai-automation"
                />
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground font-medium text-sm block">Title (English)</label>
                <input 
                  type="text" 
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full p-3 bg-background border border-border/80 rounded-xl outline-none text-foreground focus:border-primary transition-colors text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground font-medium text-sm block">Description (English)</label>
                <textarea 
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  className="w-full p-3 bg-background border border-border/80 rounded-xl outline-none text-foreground focus:border-primary transition-colors min-h-[120px] resize-none text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-muted-foreground font-medium text-sm block">Icon Identifier</label>
                <select 
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full p-3 bg-background border border-border/80 rounded-xl outline-none text-foreground focus:border-primary transition-colors text-sm cursor-pointer"
                >
                  <option value="Server">Server</option>
                  <option value="Code">Code</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Bot">Bot</option>
                  <option value="Database">Database</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground font-medium text-sm block">Title (Arabic)</label>
                <input 
                  type="text" 
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  dir="rtl"
                  className="w-full p-3 bg-background border border-border/80 rounded-xl outline-none text-foreground focus:border-primary transition-colors text-sm font-arabic"
                />
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground font-medium text-sm block">Description (Arabic)</label>
                <textarea 
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  dir="rtl"
                  className="w-full p-3 bg-background border border-border/80 rounded-xl outline-none text-foreground focus:border-primary transition-colors min-h-[120px] resize-none text-sm leading-relaxed font-arabic"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <PageHeader title={t("title")} description={t("subtitle")}>
        <button 
          onClick={startCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </PageHeader>

      {loading ? (
        <LoadingState message="Loading services schema..." />
      ) : services.length === 0 ? (
        <EmptyState 
          icon={Server} 
          title="No Services Configured" 
          description="You have not created any services yet. These appear on your main website offerings." 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div key={srv.id} className="group p-6 bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit group-hover:scale-110 transition-transform">
                    {srv.icon === "Code" && <Code className="w-5 h-5" />}
                    {srv.icon === "Smartphone" && <Smartphone className="w-5 h-5" />}
                    {srv.icon === "Cloud" && <Cloud className="w-5 h-5" />}
                    {srv.icon === "Bot" && <Bot className="w-5 h-5" />}
                    {srv.icon === "Database" && <Database className="w-5 h-5" />}
                    {(!["Code", "Smartphone", "Cloud", "Bot", "Database"].includes(srv.icon)) && <Server className="w-5 h-5" />}
                  </div>
                  <button 
                    onClick={() => deleteService(srv.id)}
                    className="p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div>
                  <h3 className="font-bold text-base text-foreground mb-1">{srv.title_en}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{srv.desc_en}</p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-border/40 flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-mono bg-secondary px-2 py-1 rounded">/{srv.slug}</span>
                <button 
                  onClick={() => startEdit(srv)}
                  className="flex items-center gap-1.5 text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
