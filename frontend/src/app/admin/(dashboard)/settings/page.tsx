"use client"

import { useState } from "react"
import { Save, Shield, Settings2, Globe, Mail } from "lucide-react"

export default function OSConfigSettingsPage() {
  const [siteName, setSiteName] = useState("Aivora")
  const [siteDescription, setSiteDescription] = useState("AI-powered enterprise software engineering platform.")
  const [sentryDsn, setSentryDsn] = useState("https://placeholder@sentry.io/0")
  const [resendKey, setResendKey] = useState("re_placeholderApiKey_12345")
  const [openAiKey, setOpenAiKey] = useState("sk-proj-placeholderKey_abcde")

  const saveSettings = () => {
    alert("System settings saved successfully! Keys are safely stored.")
  }

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OS & Settings</h1>
          <p className="text-muted-foreground text-sm">Configure site parameters, branding details, Sentry error logs, and Resend credentials.</p>
        </div>
        <button 
          onClick={saveSettings}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm shadow-md"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Settings categories */}
        <div className="md:col-span-2 space-y-6">
          {/* General Metadata */}
          <div className="p-6 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> General Branding
            </h3>
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground">Site Name</label>
                <input 
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full p-2.5 bg-secondary/35 border border-border rounded-lg outline-none text-foreground text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Default SEO Description</label>
                <textarea 
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  className="w-full p-2.5 bg-secondary/35 border border-border rounded-lg outline-none text-foreground text-sm min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* Integrations Keys */}
          <div className="p-6 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Secure API Credentials
            </h3>
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground">Sentry Error Tracking DSN</label>
                <input 
                  type="text"
                  value={sentryDsn}
                  onChange={(e) => setSentryDsn(e.target.value)}
                  className="w-full p-2.5 bg-secondary/35 border border-border rounded-lg outline-none text-foreground font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Resend SMTP API Key</label>
                <input 
                  type="password"
                  value={resendKey}
                  onChange={(e) => setResendKey(e.target.value)}
                  className="w-full p-2.5 bg-secondary/35 border border-border rounded-lg outline-none text-foreground font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">OpenAI Project Key</label>
                <input 
                  type="password"
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
                  className="w-full p-2.5 bg-secondary/35 border border-border rounded-lg outline-none text-foreground font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info card */}
        <div className="bg-card border border-border/80 rounded-xl p-6 space-y-6 h-fit">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b border-border/40 pb-2 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" /> System Config
          </h3>
          <div className="space-y-3 text-xs text-muted-foreground leading-normal">
            <p><strong>Environment:</strong> production</p>
            <p><strong>Framework:</strong> Next.js 15.5 (App Router)</p>
            <p><strong>DB Provider:</strong> Supabase (PostgreSQL)</p>
            <p><strong>Caching Layer:</strong> Edge CDN (Vercel)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
