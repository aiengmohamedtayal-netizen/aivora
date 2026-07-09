"use client"

import React, { useState, useRef } from "react"
import { motion, useSpring } from "framer-motion"
import { 
  Users, 
  Workflow, 
  LayoutDashboard, 
  Sparkles,
  Search,
  Bell,
  BarChart3,
  TrendingUp,
  Mail,
  MoreHorizontal
} from "lucide-react"

export function HeroComposition() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Parallax and Magnetic effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x, y })
  }

  // Softened rotation for a more grounded feel
  const rotateX = useSpring(mousePosition.y * -8, { stiffness: 150, damping: 20 })
  const rotateY = useSpring(mousePosition.x * 8, { stiffness: 150, damping: 20 })
  
  // Floating animation variants (subtle and purposeful)
  const floatAnimation = (delay = 0, yRange = 8, duration = 6) => ({
    animate: {
      y: [-yRange, yRange, -yRange],
      transition: {
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }
    }
  })

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center perspective-[2000px] transform-gpu overflow-visible font-sans"
    >
      {/* Ambient glow behind composition - soft primary color */}
      <motion.div 
        animate={{ 
          opacity: [0.15, 0.3, 0.15],
          scale: [0.9, 1.05, 0.9]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary/20 blur-[100px] rounded-full pointer-events-none"
      />

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-full max-w-[800px] h-full flex items-center justify-center group"
      >
        
        {/* 1. CENTER PIECE: Aivora Client OS / CRM Dashboard */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute z-10 w-[110%] sm:w-[680px] h-[420px] bg-background/80 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 hover:border-primary/20 hover:shadow-primary/5"
          style={{ translateZ: 0 }}
        >
          {/* Header */}
          <div className="h-12 border-b border-border/50 flex items-center px-4 justify-between bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-gold/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-sm font-semibold">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                Aivora OS
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-background/50 border border-border/50 rounded-lg px-4 py-1.5 text-xs text-muted-foreground">
              <Search className="w-3.5 h-3.5" /> Search contacts, deals...
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Bell className="w-4 h-4" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-gold opacity-80" />
            </div>
          </div>
          
          {/* Main Dashboard Body */}
          <div className="flex flex-1 overflow-hidden bg-background/40">
            {/* Sidebar */}
            <div className="hidden sm:flex w-48 border-r border-border/50 flex-col py-4 px-3 gap-1">
              <div className="flex items-center gap-3 px-3 py-2 bg-muted/40 text-foreground rounded-lg text-sm font-medium">
                <LayoutDashboard className="w-4 h-4 text-primary" /> Overview
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted/20 hover:text-foreground rounded-lg text-sm font-medium transition-colors">
                <Users className="w-4 h-4" /> CRM Pipeline
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted/20 hover:text-foreground rounded-lg text-sm font-medium transition-colors">
                <Workflow className="w-4 h-4" /> Automations
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted/20 hover:text-foreground rounded-lg text-sm font-medium transition-colors">
                <BarChart3 className="w-4 h-4" /> Analytics
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold">Active Pipeline</h3>
                  <p className="text-sm text-muted-foreground">Q3 Lead conversion tracking</p>
                </div>
                <div className="hidden sm:flex px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg border border-primary/20 items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Auto-sync active
                </div>
              </div>

              {/* Data Table Mockup */}
              <div className="border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm overflow-hidden flex-1">
                <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-2">Client</div>
                  <div>Status</div>
                  <div>Value</div>
                </div>
                <div className="flex flex-col">
                  {[
                    { name: "Acme Corp", type: "SaaS Platform", status: "Qualified", val: "$45,000" },
                    { name: "Nexus Industries", type: "AI Integration", status: "Proposal", val: "$120,000" },
                    { name: "Vertex Tech", type: "Automation", status: "Discovery", val: "$28,500" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-border/50 last:border-0 items-center hover:bg-muted/20 transition-colors cursor-pointer">
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs">
                          {row.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{row.name}</div>
                          <div className="text-xs text-muted-foreground">{row.type}</div>
                        </div>
                      </div>
                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          row.status === 'Qualified' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                          row.status === 'Proposal' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          'bg-gold/10 text-gold border border-gold/20'
                        }`}>
                          {row.status}
                        </span>
                      </div>
                      <div className="text-sm font-semibold">{row.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Floating Layer: Aivora AI Consultant Chat (Top Left) */}
        <motion.div
          {...floatAnimation(0.2, 10, 5.5)}
          initial={{ opacity: 0, x: -40, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute z-20 top-[0%] sm:top-[5%] -left-[5%] sm:-left-[12%] w-[240px] sm:w-[280px] bg-card/80 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-xl overflow-hidden hidden sm:block"
          style={{ translateZ: 40 }}
        >
          <div className="p-3 border-b border-border/50 flex items-center gap-2 bg-muted/10">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            <div>
              <div className="text-xs font-bold leading-none">Aivora AI</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">Business Consultant</div>
            </div>
          </div>
          <div className="p-4 bg-background/50 space-y-3">
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-full bg-muted shrink-0" />
              <div className="bg-muted p-2 rounded-xl rounded-tl-sm text-[11px] text-foreground">
                Summarize our Q3 enterprise leads.
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
              <div className="bg-primary/10 border border-primary/20 p-2 rounded-xl rounded-tl-sm text-[11px] text-foreground leading-relaxed">
                <span className="font-semibold block mb-1 text-primary">I&apos;ve analyzed 42 new leads:</span>
                3 qualify for Enterprise plans. I&apos;ve drafted personalized proposals and staged them in your CRM. Should I email them?
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Floating Layer: Workflow Automation (Bottom Right) */}
        <motion.div
          {...floatAnimation(0.5, 12, 6)}
          initial={{ opacity: 0, x: 40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute z-30 bottom-[5%] sm:bottom-[10%] -right-[5%] sm:-right-[15%] w-[240px] p-4 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl hidden sm:block"
          style={{ translateZ: 60 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold">Lead Automation</span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="flex flex-col gap-2 relative">
            <div className="absolute top-4 bottom-4 left-4 w-px bg-border -z-10" />
            
            <div className="flex items-center gap-3 p-2 bg-background rounded-lg border border-border/50 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <Mail className="w-3 h-3" />
              </div>
              <div className="text-[11px] font-medium truncate">New Email Inquiry</div>
            </div>
            
            <div className="flex items-center gap-3 p-2 bg-background rounded-lg border border-primary/30 shadow-sm ring-1 ring-primary/10">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 relative">
                <Sparkles className="w-3 h-3" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              </div>
              <div className="text-[11px] font-medium truncate">AI Lead Qualification</div>
            </div>

            <div className="flex items-center gap-3 p-2 bg-background rounded-lg border border-border/50 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                <Users className="w-3 h-3" />
              </div>
              <div className="text-[11px] font-medium truncate">Add to CRM Pipeline</div>
            </div>
          </div>
        </motion.div>

        {/* 4. Floating Layer: Premium Revenue Analytics (Bottom Left) */}
        <motion.div
          {...floatAnimation(0.8, 8, 4.5)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute z-25 bottom-[-5%] sm:bottom-[-2%] -left-[5%] sm:left-[-5%] w-[180px] p-4 bg-card/90 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-xl flex flex-col"
          style={{ translateZ: 50 }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Revenue</span>
            <TrendingUp className="w-3 h-3 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold font-display">$84.5K</span>
            <span className="text-[10px] text-green-500 font-medium">+14.2%</span>
          </div>
          
          <div className="flex items-end gap-1 h-12">
            {[40, 30, 45, 60, 50, 85, 75].map((height, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: 0.7 + (i * 0.1) }}
                className={`flex-1 rounded-t-sm transition-colors ${i === 6 ? 'bg-primary' : 'bg-primary/20 hover:bg-primary/40'}`}
              />
            ))}
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  )
}
