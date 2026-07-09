"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Bot, 
  Workflow, 
  Sparkles, 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Activity, 
  TrendingUp, 
  Check, 
  ArrowRight,
  ShieldAlert,
  Cpu
} from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import { ClaudeChatInput } from "@/components/common/ClaudeChatInput"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type EntryType = "system" | "user" | "assistant" | "thinking" | "tool" | "success" | "warning" | "error"

interface TerminalEntry {
  id: string
  type: EntryType
  content: string
  timestamp: number
}

interface TerminalSession {
  id: string
  status: "booting" | "idle" | "processing" | "error"
  entries: TerminalEntry[]
}

export function IntelligenceWorkspace() {
  const t = useTranslations("IntelligencePage")
  const locale = useLocale()

  const [activeTab, setActiveTab] = React.useState<"overview" | "agents" | "workflows" | "chat">("overview")
  
  // Pre-load the session with a welcome message so it looks populated immediately
  const [session, setSession] = React.useState<TerminalSession>({
    id: "session_01",
    status: "idle",
    entries: [
      {
        id: "welcome",
        type: "assistant",
        content: locale === "ar" 
          ? "مرحباً بك في أيفورا! أنا المساعد الذكي الخاص بك. كيف يمكنني مساعدتك اليوم؟\n\nيمكنني مساعدتك في:\n1. استكشاف خدماتنا الفنية وأتمتة العمليات.\n2. حساب تقديري لميزانية مشروعك.\n3. توجيه طلبك إلى فريقنا الفني مباشرة."
          : "Welcome to Aivora! I am your AI Business Assistant. How can I help you today?\n\nI can assist you with:\n1. Exploring our technical services and automations.\n2. Estimating your project budget.\n3. Submitting your request directly to our team.",
        timestamp: Date.now()
      }
    ]
  })
  
  const [streamedContent, setStreamedContent] = React.useState("")
  const [execTime, setExecTime] = React.useState(0)
  
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Navigation Items
  const navItems = [
    { id: "overview", icon: LayoutDashboard, label: locale === "ar" ? "لوحة التحكم" : "Overview" },
    { id: "agents", icon: Bot, label: locale === "ar" ? "الوكلاء النشطون" : "Active AI Agents" },
    { id: "workflows", icon: Workflow, label: locale === "ar" ? "أتمتة سير العمل" : "Automated Workflows" },
    { id: "chat", icon: Sparkles, label: locale === "ar" ? "مساعد الأعمال الذكي" : "Business Assistant" },
  ]

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [session.entries, streamedContent, activeTab])

  const simulateStream = async (text: string, signal: AbortSignal) => {
    return new Promise<void>((resolve) => {
      let currentIndex = 0
      setStreamedContent("")

      const updateStream = () => {
        if (signal.aborted) {
          resolve()
          return
        }

        if (currentIndex < text.length) {
          const chunk = Math.floor(Math.random() * 3) + 1
          setStreamedContent(prev => prev + text.substring(currentIndex, currentIndex + chunk))
          currentIndex += chunk
          requestAnimationFrame(updateStream)
        } else {
          resolve()
        }
      }

      requestAnimationFrame(updateStream)
    })
  }

  const handleClaudeSubmit = async (data: {
      message: string;
      files: any[];
      pastedContent: any[];
      model: string;
      isThinkingEnabled: boolean;
  }) => {
    if ((!data.message.trim() && data.files.length === 0 && data.pastedContent.length === 0) || session.status === "processing") return

    const userEntry: TerminalEntry = {
      id: `usr_${Date.now()}`,
      type: "user",
      content: data.message || "Attached files/content",
      timestamp: Date.now()
    }

    setSession(prev => ({
      ...prev,
      status: "processing",
      entries: [...prev.entries, userEntry]
    }))

    setExecTime(0)
    const timer = setInterval(() => setExecTime(prev => prev + 10), 10)

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    await new Promise(r => setTimeout(r, 600))
    if (signal.aborted) return clearInterval(timer)

    const responses: string[] = t.raw("terminal.mockResponses")
    const mockOutput = responses[Math.floor(Math.random() * responses.length)]

    await simulateStream(mockOutput || "", signal)
    if (signal.aborted) return clearInterval(timer)

    clearInterval(timer)

    setSession(prev => ({
      ...prev,
      status: "idle",
      entries: [
        ...prev.entries,
        {
          id: `ast_${Date.now()}`,
          type: "assistant",
          content: mockOutput || "",
          timestamp: Date.now()
        }
      ]
    }))
    setStreamedContent("")
  }

  const handleSuggestion = (suggestion: string) => {
    handleClaudeSubmit({
      message: suggestion,
      files: [],
      pastedContent: [],
      model: "sonnet-4.5",
      isThinkingEnabled: false
    })
  }

  const renderEntryIcon = (type: EntryType) => {
    switch (type) {
      case "system": return <Terminal size={14} className="text-muted-foreground mt-1" />
      case "user": return <span className="text-primary mt-1 font-mono">{">"}</span>
      case "assistant": return <Bot size={14} className="text-primary mt-1" />
      case "success": return <CheckCircle2 size={14} className="text-green-500 mt-1" />
      case "warning": return <AlertCircle size={14} className="text-amber-500 mt-1" />
      case "error": return <AlertCircle size={14} className="text-destructive mt-1" />
      default: return <span className="w-3.5 h-3.5 mt-1" />
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 gap-8">
      
      {/* 1. Sidebar Navigation */}
      <aside className="w-full lg:w-64 flex flex-col gap-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20">
            <Cpu size={16} className="text-primary animate-pulse" />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">
            {locale === "ar" ? "ذكاء أيفورا" : "Aivora OS"}
          </span>
        </div>

        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none border-b lg:border-b-0 border-border/40">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-300 whitespace-nowrap",
                activeTab === item.id 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(37,99,235,0.05)]" 
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent"
              )}
            >
              <item.icon size={16} className={activeTab === item.id ? "text-primary" : "text-muted-foreground"} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main Workspace Display */}
      <main className="flex-1 flex flex-col min-w-0 h-[580px] lg:h-[620px]">
        <GlassCard className="flex-1 flex flex-col rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-background/80 backdrop-blur-2xl">
          
          <AnimatePresence mode="wait">
            
            {/* --- TAB 1: OVERVIEW --- */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground">
                    {locale === "ar" ? "لوحة معلومات الأداء" : "Performance Overview"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {locale === "ar" ? "إحصائيات فورية للعمليات المؤتمتة ومستوى التوفير" : "Real-time stats of automations and operations"}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: locale === "ar" ? "عمليات مؤتمتة" : "Automated Actions", val: "142,850+", icon: Workflow, color: "text-primary bg-primary/5" },
                    { label: locale === "ar" ? "التوفير المالي" : "Cost Savings", val: "78%", icon: TrendingUp, color: "text-green-500 bg-green-500/5" },
                    { label: locale === "ar" ? "معدل التشغيل" : "Uptime", val: "99.98%", icon: Activity, color: "text-primary bg-primary/5" },
                    { label: locale === "ar" ? "زمن الاستجابة" : "Response Time", val: "1.4s", icon: Clock, color: "text-gold bg-gold/5" },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border/60 bg-muted/10 flex flex-col gap-2">
                      <div className={cn("p-1.5 rounded-lg w-fit", stat.color)}>
                        <stat.icon size={16} />
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                      <span className="text-lg font-medium text-foreground">{stat.val}</span>
                    </div>
                  ))}
                </div>

                {/* Main Split Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-stretch">
                  {/* Left: Active Systems */}
                  <div className="p-5 rounded-xl border border-border/60 bg-card/20 flex flex-col gap-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      {locale === "ar" ? "الأنظمة النشطة" : "Active Systems"}
                    </h4>
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {[
                        { name: locale === "ar" ? "مزامنة بيانات CRM" : "CRM Sync Pipeline", desc: locale === "ar" ? "تحديث تلقائي وفوري للصفقات" : "Real-time deals integration" },
                        { name: locale === "ar" ? "مستجيب البريد الذكي" : "AI Email Responder", desc: locale === "ar" ? "فرز وتصنيف استفسارات العملاء" : "Lead classification engine" },
                        { name: locale === "ar" ? "محلل البيانات المالية" : "Financial Analytics Agent", desc: locale === "ar" ? "تصدير فوري للتقارير الشهرية" : "Sub-second metrics generator" }
                      ].map((sys, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-border/40 bg-background/50 text-xs">
                          <div>
                            <span className="font-medium block">{sys.name}</span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 block">{sys.desc}</span>
                          </div>
                          <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-mono">ACTIVE</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Live Logs */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-[10px] text-zinc-400 flex flex-col gap-2 min-h-[160px] overflow-hidden shadow-lg select-none text-left" dir="ltr">
                    {/* Terminal Window Header */}
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-1 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-[9px] font-sans font-medium text-zinc-500 uppercase tracking-wider">
                        {locale === "ar" ? "سجل التشغيل المباشر" : "Live Runtime Logs"}
                      </span>
                      <div className="w-8" /> {/* Balance spacer */}
                    </div>
                    {/* Log Lines */}
                    <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar leading-relaxed">
                      <div className="flex gap-2">
                        <span className="text-zinc-600">[12:34:56]</span>
                        <span className="text-emerald-400">system: Initializing CRM sync session...</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-zinc-600">[12:35:10]</span>
                        <span className="text-sky-400">AI Agent: Qualified lead Nexus Corp. Staged in CRM.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-zinc-600">[12:35:12]</span>
                        <span className="text-zinc-300">system: Dispatched Slack notification.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-zinc-600">[12:35:28]</span>
                        <span className="text-sky-400">AI Agent: Autocategorized invoice #2938 (EGP 120k).</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-zinc-600">[12:36:01]</span>
                        <span className="text-emerald-400">system: Health check passed. Uptime: 99.98%.</span>
                        <span className="animate-pulse inline-block w-1.5 h-3 bg-emerald-400 ml-0.5 align-middle" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- TAB 2: ACTIVE AGENTS --- */}
            {activeTab === "agents" && (
              <motion.div
                key="agents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground">
                    {locale === "ar" ? "الوكلاء النشطون" : "Active AI Agents"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {locale === "ar" ? "وكلاء ذكاء اصطناعي مخصصون لتسريع الأعمال وأتمتة العمليات" : "Custom AI agents engineered for business speed and automation"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: locale === "ar" ? "وكيل دعم العملاء" : "Customer Success Agent",
                      desc: locale === "ar" ? "يستخدم البحث الدلالي للإجابة الفورية والدقيقة على استفسارات المستخدمين." : "Uses semantic search to instantly resolve user inquiries with high precision.",
                      role: "Support & Docs"
                    },
                    {
                      name: locale === "ar" ? "فرز وتصنيف الصفقات" : "Lead Qualification Agent",
                      desc: locale === "ar" ? "يراجع تفاصيل استمارات التواصل وتصنيفها وتوجيهها حسب القيمة والميزانية." : "Analyzes incoming proposals, scores leads, and routes them to CRM automatically.",
                      role: "Sales & CRM"
                    },
                    {
                      name: locale === "ar" ? "منسق سير العمل" : "Workflow Director",
                      desc: locale === "ar" ? "يتم تصدير الإشعارات وحفظ المعاملات وربط الأنظمة فورياً." : "Handles event-driven notifications, updates databases, and connects legacy integrations.",
                      role: "System Orchestrator"
                    }
                  ].map((agent, i) => (
                    <div key={i} className="p-5 rounded-xl border border-border/60 bg-muted/10 flex flex-col justify-between h-[180px]">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-mono font-medium uppercase">{agent.role}</span>
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <h4 className="text-sm font-medium text-foreground mb-2">{agent.name}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{agent.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- TAB 3: WORKFLOWS --- */}
            {activeTab === "workflows" && (
              <motion.div
                key="workflows"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground">
                    {locale === "ar" ? "أتمتة سير العمل" : "Automated Workflows"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {locale === "ar" ? "كيف نقوم بربط وتأمين نقل البيانات من Pixels إلى قاعدة البيانات" : "How we cleanly connect and secure event-driven workflows from pixels to DB"}
                  </p>
                </div>

                {/* Workflow Timeline */}
                <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full pt-4">
                  {[
                    { step: "01", name: locale === "ar" ? "استلام الطلبات" : "Lead Intake", desc: locale === "ar" ? "يقوم العميل بملء بياناته في نموذج الاتصال المطور بالجنيه المصري." : "Customer submits project inquiry via the custom EGP-localized form." },
                    { step: "02", name: locale === "ar" ? "التصنيف التلقائي للذكاء" : "AI Lead Classification", desc: locale === "ar" ? "يقوم وكيل الذكاء الاصطناعي بدراسة الميزانية وتوجيه الطلب فورا." : "Autonomous AI agent scores values, logs in database, and stages request." },
                    { step: "03", name: locale === "ar" ? "إشعار البريد الإلكتروني" : "SMTP Dispatch & Notification", desc: locale === "ar" ? "تصلك رسالة إلكترونية (تيكت) فورا عبر Outlook بتفاصيل العميل." : "Email ticket is securely dispatched to aivoraaa@outlook.com via Gmail SMTP." },
                  ].map((flow, i) => (
                    <div key={i} className="flex gap-4 items-start relative pb-4 last:pb-0">
                      {i < 2 && <div className="absolute top-10 bottom-0 left-[18px] w-0.5 bg-border/50" />}
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-mono text-xs font-medium text-primary shrink-0">
                        {flow.step}
                      </div>
                      <div className="pt-1.5">
                        <span className="font-medium text-sm text-foreground block">{flow.name}</span>
                        <span className="text-xs text-muted-foreground leading-normal mt-1 block">{flow.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- TAB 4: CHAT TERMINAL --- */}
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col min-h-0"
              >
                {/* Header Bar */}
                <header className="h-12 border-b border-border/50 flex items-center justify-between px-4 shrink-0 bg-muted/10">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-border" />
                      <div className="w-2.5 h-2.5 rounded-full bg-border" />
                      <div className="w-2.5 h-2.5 rounded-full bg-border" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {locale === "ar" ? "مساعد أيفورا النشط" : "Aivora Assistant Active"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[9px] hidden md:flex border-border/40">
                      {t("terminal.header.model")}: AIV-CORE-1
                    </Badge>
                    <Badge variant="secondary" className="font-mono text-[9px] bg-primary/10 text-primary uppercase border border-primary/20">
                      {session.status === "processing" ? t("terminal.statusProcessing") : t("terminal.statusIdle")}
                    </Badge>
                    {execTime > 0 && (
                      <span className="text-[9px] font-mono text-muted-foreground min-w-[30px] text-right">
                        {(execTime / 1000).toFixed(2)}s
                      </span>
                    )}
                  </div>
                </header>

                {/* Terminal Body */}
                <div 
                  ref={scrollRef}
                  role="log"
                  aria-live="polite"
                  className="flex-1 overflow-y-auto p-5 font-mono text-xs leading-relaxed scroll-smooth flex flex-col justify-between"
                >
                  {/* Log Stream */}
                  <div className="flex flex-col gap-3 max-w-3xl pb-6">
                    {session.entries.map((entry) => (
                      <div key={entry.id} className="flex gap-3 group">
                        <div className="shrink-0 pt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                          {renderEntryIcon(entry.type)}
                        </div>
                        <div className={cn(
                          "flex-1 break-words whitespace-pre-line",
                          entry.type === "system" && "text-muted-foreground",
                          entry.type === "user" && "text-foreground",
                          entry.type === "assistant" && "text-primary/90",
                          entry.type === "error" && "text-destructive",
                        )}>
                          {entry.content}
                        </div>
                      </div>
                    ))}

                    {/* Active Stream Renderer */}
                    {streamedContent && (
                      <div className="flex gap-3">
                        <div className="shrink-0 pt-0.5 opacity-70">
                          <Bot size={14} className="text-primary mt-1" />
                        </div>
                        <div className="flex-1 break-words text-primary/90 whitespace-pre-line">
                          {streamedContent}
                          <motion.span 
                            animate={{ opacity: [1, 0] }} 
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="inline-block w-1.5 h-3.5 bg-primary align-middle ml-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggestions List (Always visible inside chat for user interaction) */}
                  {session.status === "idle" && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-border/20">
                      {(t.raw("terminal.suggestions") as string[]).map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestion(suggestion)}
                          className="px-2.5 py-1 rounded-lg border border-border/50 bg-muted/20 text-[10px] text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input Footer */}
                <div className="p-3 border-t border-border/50 shrink-0 w-full max-w-3xl mx-auto">
                  <ClaudeChatInput 
                    onSendMessage={handleClaudeSubmit} 
                    disabled={session.status === "processing"} 
                  />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </GlassCard>
      </main>
    </div>
  )
}
