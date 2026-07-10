"use client"

import { useState, useEffect } from "react"
import { Bell, Search, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { CommandPalette } from "./CommandPalette"

export function Topbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single()
        if (roleData) {
          setUserRole(roleData.role)
        }
      }
    }

    fetchUser()

    // Setup dummy notifications for now (Realtime listener will bind here in Phase XII.7)
    setNotifications([
      { id: 1, title: "New Lead Registered", desc: "John from ABC Inc. requested AI CRM", time: "5m ago" },
      { id: 2, title: "Newsletter Sign-up", desc: "x@gmail.com subscribed", time: "1h ago" },
    ])
  }, [supabase])

  return (
    <header className="h-16 border-b border-border bg-card fixed top-0 right-0 left-64 flex items-center justify-between px-8 z-10">
      {/* Global Search shortcut trigger */}
      <button 
        onClick={() => {
          // Dispatches ctrl+k event manually
          const event = new KeyboardEvent("keydown", {
            key: "k",
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
          })
          window.dispatchEvent(event)
        }}
        className="flex items-center gap-3 px-4 py-2 border border-border/80 rounded-lg text-sm text-muted-foreground hover:bg-secondary/40 transition-colors w-72 text-left"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1">Search Aivora OS...</span>
        <kbd className="px-1.5 py-0.5 bg-secondary border border-border rounded text-[10px] font-bold">Ctrl+K</kbd>
      </button>

      {/* Utilities */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden py-2 z-30">
              <div className="px-4 py-2 border-b border-border/60 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notifications</span>
                {notifications.length > 0 && (
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-[10px] text-primary hover:underline font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-semibold text-foreground">{n.title}</span>
                        <span className="text-[9px] text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-normal">{n.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No new alerts
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 border-l border-border/60 pl-6">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground max-w-[150px] truncate">{userEmail || "Loading..."}</span>
            <span className="text-[9px] text-primary uppercase tracking-widest font-bold mt-0.5">{userRole || "Viewer"}</span>
          </div>
        </div>
      </div>

      <CommandPalette />
    </header>
  )
}
