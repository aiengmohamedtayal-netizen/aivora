"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Shield, Cpu, Activity, CheckCircle2 } from "lucide-react"

interface LogLine {
  id: number
  text: string
  type: "info" | "success" | "warning"
}

export function HeroDashboard() {
  const t = useTranslations("HomePage.hero.metrics")
  const [latency, setLatency] = useState(12.4)
  const [throughput, setThroughput] = useState(14240)
  const [activeAgents, setActiveAgents] = useState(18)
  const [logs, setLogs] = useState<LogLine[]>([])

  // Jitter variables for realistic updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(parseFloat((11.8 + Math.random() * 1.2).toFixed(1)))
      setThroughput(Math.floor(14190 + Math.random() * 95))
      setActiveAgents(Math.floor(16 + Math.random() * 4))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  // Log simulation
  useEffect(() => {
    const logList = [
      { text: "TOPOLOGICAL_BOUNDARIES_VERIFIED", type: "success" },
      { text: "INFERENCE_ROUTING: moonshotai/Kimi-K2.6", type: "info" },
      { text: "ZOD_SCHEMATIC_VALIDATION: PASS", type: "success" },
      { text: "STATE_IMMUTABILITY_LOCK: ACTIVE", type: "info" },
      { text: "DETERMINISTIC_PATH_RESOLVED: 12ms", type: "success" },
      { text: "COMPILER_STATE_SYNC: OK", type: "success" },
      { text: "SUPABASE_MUTATION_PROXIED", type: "success" },
    ] as const

    let i = 0
    const addLog = () => {
      const selected = logList[i % logList.length] || logList[0]
      setLogs((prev) => [
        { id: Date.now(), text: selected.text, type: selected.type },
        ...prev.slice(0, 5),
      ])
      i++
    }

    addLog()
    const logInterval = setInterval(addLog, 2500)
    return () => clearInterval(logInterval)
  }, [])

  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0 z-10">
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-3xl pointer-events-none opacity-60" />

      {/* Main Container */}
      <div className="relative border border-border/80 bg-card/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-destructive/30 border border-destructive/50" />
              <span className="w-3 h-3 rounded-full bg-gold/30 border border-gold/50" />
              <span className="w-3 h-3 rounded-full bg-primary/30 border border-primary/50" />
            </div>
            <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 ms-2">
              <Terminal className="w-3 h-3 text-primary" />
              {t("consoleTitle")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] text-primary uppercase tracking-wider font-bold">
              {t("statusActive")}
            </span>
          </div>
        </div>

        {/* Console Content */}
        <div className="p-5 space-y-6">
          {/* Dashboard Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Metric Card 1: Latency */}
            <div className="border border-border/60 bg-background/50 rounded-xl p-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono tracking-tight">{t("latency")}</span>
              </div>
              <span className="text-2xl font-mono font-bold tracking-tight text-foreground mt-1">
                {latency}ms
              </span>
            </div>

            {/* Metric Card 2: Throughput */}
            <div className="border border-border/60 bg-background/50 rounded-xl p-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono tracking-tight">{t("throughput")}</span>
              </div>
              <span className="text-2xl font-mono font-bold tracking-tight text-foreground mt-1">
                {throughput.toLocaleString()} <span className="text-xs text-muted-foreground">/s</span>
              </span>
            </div>

            {/* Metric Card 3: Active Model */}
            <div className="col-span-2 border border-border/60 bg-background/50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-muted-foreground tracking-tight">
                    {t("activeModel")}
                  </span>
                  <span className="text-sm font-mono font-bold text-foreground">
                    moonshotai/Kimi-K2.6
                  </span>
                </div>
              </div>
              <div className="text-end">
                <span className="text-[10px] font-mono text-muted-foreground tracking-tight block">
                  {t("activeAgents")}
                </span>
                <span className="text-sm font-mono font-bold text-foreground">
                  {activeAgents}
                </span>
              </div>
            </div>

          </div>

          {/* Live Terminal Output Logs */}
          <div className="border border-border/60 bg-background/80 rounded-xl p-4 font-mono text-xs space-y-2 min-h-[140px] overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3 text-muted-foreground text-[10px] tracking-wider uppercase font-bold">
              <span>{t("runStatus")}</span>
              <span>UTC-0</span>
            </div>
            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-2.5"
                  >
                    {log.type === "success" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-1.5 ms-1 flex-shrink-0" />
                    )}
                    <span
                      className={
                        log.type === "success"
                          ? "text-primary font-bold"
                          : log.type === "warning"
                          ? "text-gold"
                          : "text-muted-foreground"
                      }
                    >
                      {log.text}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
