"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Bot, Workflow, Database, Book, Command, History, Settings, Play, CheckCircle2, AlertCircle } from "lucide-react"
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

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export function IntelligenceWorkspace() {
  const t = useTranslations("IntelligencePage")

  const [session, setSession] = React.useState<TerminalSession>({
    id: "session_01",
    status: "idle",
    entries: []
  })
  
  const [streamedContent, setStreamedContent] = React.useState("")
  const [isBooted, setIsBooted] = React.useState(false)
  const [hasStarted, setHasStarted] = React.useState(false)
  const [execTime, setExecTime] = React.useState(0)
  
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // -----------------------------------------------------------------------------
  // Navigation Definitions
  // -----------------------------------------------------------------------------
  const navItems = [
    { id: "terminal", icon: Terminal, label: t("workspace.terminal"), active: true },
    { id: "agents", icon: Bot, label: t("workspace.agents"), active: false },
    { id: "workflows", icon: Workflow, label: t("workspace.workflows"), active: false },
    { id: "models", icon: Database, label: t("workspace.models"), active: false },
    { id: "knowledge", icon: Book, label: t("workspace.knowledge"), active: false },
    { id: "prompts", icon: Command, label: t("workspace.promptLibrary"), active: false },
    { id: "history", icon: History, label: t("workspace.history"), active: false },
    { id: "settings", icon: Settings, label: t("workspace.settings"), active: false },
  ]

  // -----------------------------------------------------------------------------
  // Boot Sequence
  // -----------------------------------------------------------------------------
  const startBootSequence = React.useCallback(async () => {
    setHasStarted(true)
    setSession(prev => ({ ...prev, status: "booting" }))
    const bootLogs: string[] = t.raw("terminal.bootSequence")
    
    for (let i = 0; i < bootLogs.length; i++) {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 200))
      setSession(prev => ({
        ...prev,
        entries: [
          ...prev.entries,
          { id: `boot_${i}`, type: "system", content: bootLogs[i] || "", timestamp: Date.now() }
        ]
      }))
    }
    
    setSession(prev => ({ ...prev, status: "idle" }))
    setIsBooted(true)
  }, [t])

  // Auto-scroll
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [session.entries, streamedContent])

  // -----------------------------------------------------------------------------
  // Stream Controller
  // -----------------------------------------------------------------------------
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
          // Add chunks of 1-3 characters to simulate deterministic fast LLM
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

    // 1. Dispatch User Entry
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

    // Start timer
    setExecTime(0)
    const timer = setInterval(() => setExecTime(prev => prev + 10), 10)

    // Abort controller for streaming
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    // 2. Think (Simulated Delay)
    await new Promise(r => setTimeout(r, 600))
    if (signal.aborted) return clearInterval(timer)

    // 3. Dispatch Agent Entry
    const responses: string[] = t.raw("terminal.mockResponses")
    const mockOutput = responses[Math.floor(Math.random() * responses.length)]

    await simulateStream(mockOutput || "", signal)
    if (signal.aborted) return clearInterval(timer)

    clearInterval(timer)

    // 4. Finalize Output
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

  const handleSuggestion = async (suggestion: string) => {
    if (!hasStarted) {
      await startBootSequence()
    }
    handleClaudeSubmit({
      message: suggestion,
      files: [],
      pastedContent: [],
      model: "sonnet-4.5",
      isThinkingEnabled: false
    })
  }

  // -----------------------------------------------------------------------------
  // Renderers
  // -----------------------------------------------------------------------------
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
    <div className="flex min-h-[calc(100vh-4rem)] max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 gap-8">
      
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 hidden lg:flex flex-col gap-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20">
            <Command size={16} className="text-primary" />
          </div>
          <span className="font-display font-bold tracking-tight">{t("title")}</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group",
                item.active 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-not-allowed opacity-70"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} className={item.active ? "text-primary" : "opacity-50"} />
                <span>{item.label}</span>
              </div>
              {!item.active && (
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("workspace.comingSoon")}
                </span>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* 2. Main Terminal Workspace */}
      <main className="flex-1 flex flex-col min-w-0">
        <GlassCard className="flex-1 flex flex-col rounded-xl overflow-hidden border border-border/50 shadow-2xl bg-background/80 backdrop-blur-2xl">
          
          {/* Header Bar */}
          <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 shrink-0 bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
              </div>
              <span className="text-xs font-mono text-muted-foreground hidden sm:inline-block">
                {t("terminal.header.title")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono text-[10px] hidden md:flex border-border/50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                {t("terminal.header.connection")}: WSS
              </Badge>
              <Badge variant="outline" className="font-mono text-[10px] hidden md:flex border-border/50">
                {t("terminal.header.model")}: AIV-CORE-1
              </Badge>
              <Badge variant="secondary" className="font-mono text-[10px] bg-primary/10 text-primary uppercase border border-primary/20">
                {session.status === "processing" ? t("terminal.statusProcessing") : 
                 session.status === "booting" ? t("terminal.statusBooting") : 
                 t("terminal.statusIdle")}
              </Badge>
              {execTime > 0 && (
                <span className="text-[10px] font-mono text-muted-foreground min-w-[40px] text-right">
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
            className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed scroll-smooth flex flex-col"
          >
            {!hasStarted ? (
              // Empty State
              <div className="flex flex-col items-center justify-center flex-1 text-center max-w-lg mx-auto gap-8 opacity-0 animate-in fade-in duration-1000">
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                    <Terminal size={32} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">{t("title")}</h2>
                  <p className="text-muted-foreground">{t("emptyState")}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {(t.raw("terminal.suggestions") as string[]).map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(suggestion)}
                      className="px-3 py-1.5 rounded-md border border-border/50 bg-muted/20 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Log Stream
              <div className="flex flex-col gap-4 max-w-3xl pb-8">
                {session.entries.map((entry) => (
                  <div key={entry.id} className="flex gap-4 group">
                    <div className="shrink-0 pt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      {renderEntryIcon(entry.type)}
                    </div>
                    <div className={cn(
                      "flex-1 break-words",
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
                  <div className="flex gap-4">
                    <div className="shrink-0 pt-0.5 opacity-70">
                      <Bot size={14} className="text-primary mt-1" />
                    </div>
                    <div className="flex-1 break-words text-primary/90">
                      {streamedContent}
                      <motion.span 
                        animate={{ opacity: [1, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-4 bg-primary align-middle ml-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Footer */}
          {hasStarted && (
            <div className="p-4 border-t border-border/50 shrink-0 w-full max-w-4xl mx-auto">
              <ClaudeChatInput 
                onSendMessage={handleClaudeSubmit} 
                disabled={session.status === "booting" || session.status === "processing"} 
              />
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  )
}
