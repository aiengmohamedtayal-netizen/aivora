"use client"

import { Link, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Inbox, 
  Bot, 
  BarChart3, 
  Server,
  CreditCard,
  CheckSquare,
  Mail
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Leads & Intake", href: "/admin/leads", icon: Inbox },
  { name: "Unified Inbox", href: "/admin/inbox", icon: Mail },
  { name: "Newsletter", href: "/admin/newsletter", icon: Users },
  { name: "Blog CMS", href: "/admin/blog", icon: FileText },
  { name: "Services CMS", href: "/admin/services", icon: Server },
  { name: "Visitors", href: "/admin/visitors", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const t = useTranslations("admin.Sidebar")

  const navItems = [
    { name: t("dashboard"), href: "/admin", icon: LayoutDashboard, exact: true },
    { name: t("leads"), href: "/admin/leads", icon: Inbox },
    { name: t("inbox"), href: "/admin/inbox", icon: Mail },
    { name: t("newsletter"), href: "/admin/newsletter", icon: Users },
    { name: t("blog"), href: "/admin/blog", icon: FileText },
    { name: t("services"), href: "/admin/services", icon: Server },
    { name: t("visitors"), href: "/admin/visitors", icon: BarChart3 },
    { name: t("settings"), href: "/admin/settings", icon: Settings },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card/60 backdrop-blur-xl h-screen fixed left-0 top-0 flex flex-col pt-8 z-20">
      <div className="px-6 mb-8 flex flex-col gap-2">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2 rtl:rotate-180" /> {t("backToWebsite")}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Aivora OS</h1>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{t("businessOperations")}</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <button 
          onClick={async () => {
            window.location.href = '/'
          }}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          {t("signOut")}
        </button>
      </div>
    </aside>
  )
}
