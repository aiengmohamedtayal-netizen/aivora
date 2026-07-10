"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FileText, Settings, LogOut, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Newsletter", href: "/admin/newsletter", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  // Find the base URL for routing (e.g. /en/admin)
  const localeMatch = pathname.match(/^\/(en|ar)/)
  const localePrefix = localeMatch ? localeMatch[0] : '/en'

  return (
    <aside className="w-64 border-r border-border/40 bg-background h-screen fixed left-0 top-0 flex flex-col pt-8">
      <div className="px-6 mb-8 flex flex-col gap-2">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to website
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Aivora OS</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const href = `${localePrefix}${item.href === '/admin' ? '/admin' : item.href}`
          const isActive = pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={item.name}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border/40">
        <button 
          onClick={() => {
            // Placeholder: Call Supabase signOut
            window.location.href = '/'
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
