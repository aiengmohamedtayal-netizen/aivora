"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Play, Code2, Network, Terminal, CheckCircle2, Cpu, Globe, Database, ArrowRight } from "lucide-react"

type ActiveTab = "api" | "graph" | "logs"

interface LogLine {
  id: number
  text: string
  type: "info" | "success" | "warning"
}

export function HeroDashboard() {
  const t = useTranslations("HomePage.hero.metrics")
  const [activeTab, setActiveTab] = useState<ActiveTab>("api")
  const [isRunning, setIsRunning] = useState(false)
  const [latency, setLatency] = useState(12.4)
  const [throughput, setThroughput] = useState(14240)
  const [logs, setLogs] = useState<LogLine[]>([
    { id: 1, text: "AIVORA_NODE_ONLINE: Frankfurt (Edge)", type: "info" },
    { id: 2, text: "ROUTING_PROXIES_READY: 100% capacity", type: "success" }
  ])
  const [currentStep, setCurrentStep] = useState(0)

  // Simulation loop for active metrics
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning) {
        setLatency(parseFloat((11.8 + Math.random() * 0.8).toFixed(1)))
        setThroughput(Math.floor(14190 + Math.random() * 95))
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [isRunning])

  // Start Pipeline Simulation
  const triggerSimulation = () => {
    if (isRunning) return
    setIsRunning(true)
    setCurrentStep(1)
    setLogs((prev) => [
      { id: Date.now(), text: "EXECUTION_TRIGGERED: POST /api/v1/agents/run", type: "info" },
      ...prev
    ])

    // Step 1: Gateway and Zod Validate
    setTimeout(() => {
      setCurrentStep(2)
      setLogs((prev) => [
        { id: Date.now() + 1, text: "ZOD_SCHEMATIC_VALIDATION: PASS (schema: Lead)", type: "success" },
        ...prev
      ])
    }, 1000)

    // Step 2: Agent routing & db mutates
    setTimeout(() => {
      setCurrentStep(3)
      setLogs((prev) => [
        { id: Date.now() + 2, text: "DB_ROUTING_LOCK: Supabase Postgres RLS initialized", type: "info" },
        { id: Date.now() + 3, text: "MUTATION_PROXIED: db.leads.insert() completed", type: "success" },
        ...prev
      ])
    }, 2200)

    // Step 3: Model reasoning
    setTimeout(() => {
      setCurrentStep(4)
      setLogs((prev) => [
        { id: Date.now() + 4, text: "INFERENCE_RESOLVED: moonshotai/Kimi-K2.6 (12ms)", type: "success" },
        { id: Date.now() + 5, text: "STATE_IMMUTABILITY_SYNC: 200 OK", type: "success" },
        ...prev
      ])
      setIsRunning(false)
    }, 3500)
  }

  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0 z-10">
      {/* Aurora spotlight behind dashboard */}
      <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-3xl pointer-events-none opacity-60 animate-pulse-glow" />

      {/* Main Glass Panel */}
      <div className="relative border border-border/80 bg-card/65 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border-beam-container">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-destructive/30 border border-destructive/50" />
              <span className="w-3 h-3 rounded-full bg-gold/30 border border-gold/50" />
              <span className="w-3 h-3 rounded-full bg-primary/30 border border-primary/50" />
            </div>
            <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 ms-2">
              <Terminal className="w-3 h-3 text-primary" />
              aivora-developer-console
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={isRunning ? "w-1.5 h-1.5 rounded-full bg-gold animate-pulse" : "w-1.5 h-1.5 rounded-full bg-primary animate-pulse"} />
            <span className="font-mono text-[10px] text-primary uppercase tracking-wider font-bold">
              {isRunning ? "PROCESSING" : "READY"}
            </span>
          </div>
        </div>

        {/* Dynamic Metric Bar */}
        <div className="grid grid-cols-3 gap-px bg-border/50 border-b border-border/60 text-center font-mono">
          <div className="bg-muted/10 py-3">
            <span className="text-[10px] text-muted-foreground block">{t("latency")}</span>
            <span className="text-sm font-bold text-foreground">{latency}ms</span>
          </div>
          <div className="bg-muted/10 py-3 border-x border-border/50">
            <span className="text-[10px] text-muted-foreground block">{t("throughput")}</span>
            <span className="text-sm font-bold text-foreground">{throughput.toLocaleString()} /s</span>
          </div>
          <div className="bg-muted/10 py-3">
            <span className="text-[10px] text-muted-foreground block">Active Model</span>
            <span className="text-sm font-bold text-foreground">Kimi-K2.6</span>
          </div>
        </div>

        {/* Tab Controllers */}
        <div className="flex border-b border-border/60 bg-muted/10">
          <button
            onClick={() => setActiveTab("api")}
            className={`flex-1 py-2.5 text-xs font-mono font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === "api"
                ? "border-primary text-foreground bg-muted/20"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            API Playground
          </button>
          <button
            onClick={() => setActiveTab("graph")}
            className={`flex-1 py-2.5 text-xs font-mono font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === "graph"
                ? "border-primary text-foreground bg-muted/20"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Orchestration Graph
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex-1 py-2.5 text-xs font-mono font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === "logs"
                ? "border-primary text-foreground bg-muted/20"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Live Execution
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 min-h-[260px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: API Playground */}
            {activeTab === "api" && (
              <motion.div
                key="api"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2 bg-background/80 border border-border/60 rounded-lg p-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold">POST</span>
                    <span className="text-muted-foreground">/api/v1/agents/run</span>
                  </div>
                  
                  {/* Mock Request JSON */}
                  <div className="bg-background/90 border border-border/60 rounded-xl p-3.5 text-[11px] leading-relaxed text-muted-foreground overflow-x-auto">
                    <pre className="text-foreground">
{`{
  "agent": "LeadScout",
  "parameters": {
    "domain": "aivora.io",
    "depth": 3,
    "immutable": true
  }
}`}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-auto">
                  <span className="text-[11px] text-muted-foreground">Click run to trigger execution flow</span>
                  <button
                    onClick={triggerSimulation}
                    disabled={isRunning}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    RUN QUERY
                  </button>
                </div>
              </motion.div>
            )}

            {/* Tab 2: SVG Orchestration Graph */}
            {activeTab === "graph" && (
              <motion.div
                key="graph"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col justify-between"
              >
                {/* SVG Visual Graph */}
                <div className="relative w-full h-40 bg-background/50 border border-border/60 rounded-xl overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full p-4" viewBox="0 0 400 160">
                    {/* Node Connections */}
                    <path
                      d="M 50 80 Q 125 30 200 80 T 350 80 M 200 80 Q 200 130 200 80"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="1.5"
                    />

                    {/* Animated Pulsing Lines when running */}
                    {isRunning && (
                      <path
                        d="M 50 80 Q 125 30 200 80 T 350 80"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="2"
                        strokeDasharray="10 120"
                        strokeDashoffset="0"
                        className="animate-grid-drift"
                      />
                    )}

                    {/* Nodes */}
                    {/* Node 1: Client Gateway */}
                    <circle cx="50" cy="80" r="16" className={cn("fill-card stroke-2", currentStep >= 1 ? "stroke-primary" : "stroke-border")} />
                    <g transform="translate(42, 73)">
                      <Globe className={cn("w-4 h-4", currentStep >= 1 ? "text-primary" : "text-muted-foreground")} />
                    </g>
                    <text x="50" y="112" textAnchor="middle" className="font-mono text-[9px] fill-muted-foreground">Gateway</text>

                    {/* Node 2: Agent Router */}
                    <circle cx="200" cy="80" r="20" className={cn("fill-card stroke-2", currentStep >= 2 ? "stroke-primary" : "stroke-border")} />
                    <g transform="translate(190, 70)">
                      <Cpu className={cn("w-5 h-5", currentStep >= 2 ? "text-primary" : "text-muted-foreground")} />
                    </g>
                    <text x="200" y="116" textAnchor="middle" className="font-mono text-[9px] fill-muted-foreground">Agent Router</text>

                    {/* Node 3: Database Gateway */}
                    <circle cx="350" cy="80" r="16" className={cn("fill-card stroke-2", currentStep >= 3 ? "stroke-primary animate-pulse" : "stroke-border")} />
                    <g transform="translate(342, 73)">
                      <Database className={cn("w-4 h-4", currentStep >= 3 ? "text-primary" : "text-muted-foreground")} />
                    </g>
                    <text x="350" y="112" textAnchor="middle" className="font-mono text-[9px] fill-muted-foreground">Supabase DB</text>
                  </svg>
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-auto">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {currentStep === 0 && "Idle state: Network nodes ready."}
                    {currentStep === 1 && "Verifying perimeter token rules..."}
                    {currentStep === 2 && "Input validated. Routing query to Agent Router."}
                    {currentStep >= 3 && "Executing row level security mutator..."}
                  </span>
                  <button
                    onClick={triggerSimulation}
                    disabled={isRunning}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    RUN QUERY
                  </button>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Execution Timeline Logs */}
            {activeTab === "logs" && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3 flex-1 flex flex-col justify-between"
              >
                <div className="border border-border/60 bg-background/80 rounded-xl p-3.5 font-mono text-[11px] space-y-2 min-h-[160px] overflow-hidden relative">
                  <div className="space-y-2 max-h-[145px] overflow-y-auto">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-start gap-2">
                        {log.type === "success" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                        ) : (
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50 mt-2 ms-1.5 flex-shrink-0" />
                        )}
                        <span className={log.type === "success" ? "text-primary font-bold" : "text-muted-foreground"}>
                          {log.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-auto">
                  <span className="text-[11px] text-muted-foreground font-mono">Trace latency: {latency}ms</span>
                  <button
                    onClick={triggerSimulation}
                    disabled={isRunning}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    RUN QUERY
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
