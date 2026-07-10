"use client"

import { useState, useEffect } from "react"
import { createClient } from "@aivora/lib/supabase/client"
import { useTranslations } from "next-intl"
import { PageHeader } from "@/components/admin/PageHeader"
import { LoadingState } from "@/components/admin/LoadingState"
import { Save, Globe, Phone, Mail, Settings2 } from "lucide-react"

export default function OSConfigSettingsPage() {
  const t = useTranslations("admin.Settings")
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settingsId, setSettingsId] = useState<string | null>(null)

  const [siteName, setSiteName] = useState("Aivora")
  const [siteDescription, setSiteDescription] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [supportPhone, setSupportPhone] = useState("")

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setSettingsId(data.id)
        setSiteName(data.site_name || "")
        setSiteDescription(data.site_description || "")
        setContactEmail(data.contact_email || "")
        setSupportPhone(data.support_phone || "")
      }
    } catch (e) {
      console.error("Failed to load settings", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveSettings = async () => {
    setSaving(true)
    try {
      const payload = {
        site_name: siteName,
        site_description: siteDescription,
        contact_email: contactEmail,
        support_phone: supportPhone,
        updated_at: new Date().toISOString()
      }

      if (settingsId) {
        const { error } = await supabase.from("site_settings").update(payload).eq("id", settingsId)
        if (error) throw error
        alert("Settings updated successfully!")
      } else {
        const { data, error } = await supabase.from("site_settings").insert([payload]).select().single()
        if (error) throw error
        setSettingsId(data.id)
        alert("Settings created successfully!")
      }
    } catch (e: any) {
      alert("Error saving settings: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <PageHeader title={t("title")} description={t("subtitle")}>
        <button 
          onClick={saveSettings}
          disabled={saving || loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" /> 
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </PageHeader>

      {loading ? (
        <LoadingState message="Loading system settings..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Settings categories */}
          <div className="md:col-span-2 space-y-8">
            {/* General Metadata */}
            <div className="p-6 bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl space-y-6 shadow-sm">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                <Globe className="w-4 h-4 text-primary" /> General Branding
              </h3>
              <div className="space-y-5 text-sm">
                <div className="space-y-2">
                  <label className="text-foreground font-medium block">Site Name</label>
                  <input 
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full p-3 bg-background border border-border/80 rounded-xl outline-none text-foreground focus:border-primary transition-colors text-sm"
                    placeholder="e.g. Aivora"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-foreground font-medium block">Default SEO Description</label>
                  <textarea 
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    className="w-full p-3 bg-background border border-border/80 rounded-xl outline-none text-foreground focus:border-primary transition-colors text-sm min-h-[100px] resize-none leading-relaxed"
                    placeholder="A brief description of your platform for search engines..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-6 bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl space-y-6 shadow-sm">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" /> Public Contact Info
              </h3>
              <div className="space-y-5 text-sm">
                <div className="space-y-2">
                  <label className="text-foreground font-medium block">Public Support Email</label>
                  <input 
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-3 bg-background border border-border/80 rounded-xl outline-none text-foreground focus:border-primary transition-colors text-sm"
                    placeholder="support@aivora.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-foreground font-medium block">Business Phone (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="tel"
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border/80 rounded-xl outline-none text-foreground focus:border-primary transition-colors text-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info card */}
          <div className="bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-6 space-y-6 h-fit sticky top-24 shadow-sm">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b border-border/40 pb-3 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" /> System Info
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold opacity-70">Environment</span>
                <span className="text-foreground font-medium">Production</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold opacity-70">Framework</span>
                <span className="text-foreground font-medium">Next.js 15.5</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold opacity-70">Database</span>
                <span className="text-foreground font-medium">Supabase (PostgreSQL)</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold opacity-70">Secret Keys</span>
                <span className="text-foreground font-medium">Managed via .env</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
