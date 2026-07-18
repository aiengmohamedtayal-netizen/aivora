"use client"

import React, { useState, useRef } from "react"
import { LazyMotion, domMax, m, useSpring } from "framer-motion"
import { 
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Globe,
  Smartphone,
  MessageSquare,
  Activity,
  ChevronRight
} from "lucide-react"

// ─── HELPER COMPONENT: Glass Card Wrapper ──────────────────────────────────────
function GlassCard({ 
  children, 
  className = "", 
  style = {} 
}: { 
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties 
}) {
  return (
    <div 
      style={style}
      className={`backdrop-blur-[20px] bg-white/[0.04] dark:bg-black/[0.2] border border-white/[0.08] dark:border-white/[0.04] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] ${className}`}
    >
      {children}
    </div>
  )
}

export function HeroComposition() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x, y })
  }

  // Springs for smooth 3D parallax rotation
  const rotateX = useSpring(mousePosition.y * -10, { stiffness: 120, damping: 25 })
  const rotateY = useSpring(mousePosition.x * 10, { stiffness: 120, damping: 25 })

  // Floating animation generator
  const floatAnimation = (delay = 0, yRange = 6, duration = 6) => ({
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
    <LazyMotion features={domMax}>
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full h-[600px] lg:h-[705px] flex items-center justify-center perspective-[2000px] transform-gpu overflow-visible"
      >
        {/* Ambient Radial Gradient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <m.div 
            animate={{ 
              scale: [1, 1.08, 1],
              opacity: [0.12, 0.22, 0.12]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/10 blur-[100px]"
          />
          <m.div 
            animate={{ 
              scale: [1.08, 1, 1.08],
              opacity: [0.08, 0.18, 0.08]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/10 blur-[90px]"
          />
          {/* Subtle grid pattern inside visual */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <m.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
          className="relative w-full max-w-[780px] h-full flex items-center justify-center"
        >
          
          {/* ─── 1. BROWSER WINDOW MOCKUP (Premium Startup Landing Page) ────────── */}
          <m.div 
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute z-10 w-[95%] sm:w-[680px] h-[430px] rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.12)]"
            style={{ translateZ: 0 }}
          >
            <GlassCard className="w-full h-full flex flex-col border-white/10 dark:border-white/5 rounded-3xl">
              
              {/* Browser Header Bar */}
              <div className="h-12 border-b border-white/10 dark:border-white/5 flex items-center px-5 justify-between bg-white/[0.01] dark:bg-black/[0.15]">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ef4444]/60" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#f59e0b]/60" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#10b981]/60" />
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 dark:bg-black/20 rounded-md border border-white/5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] font-mono text-muted-foreground select-none">aivora.studio/client-preview</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-semibold text-foreground/80">
                  <span className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">Platform</span>
                  <span className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">Solutions</span>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] border border-primary/20">Live Preview</span>
                </div>
              </div>

              {/* Browser Content Viewport (Stunning Product Showcase Layout) */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-white/[0.01] to-transparent custom-scrollbar flex flex-col gap-6">
                
                {/* Navbar */}
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">NEXUS</span>
                  <div className="flex gap-4 text-[10px] font-semibold text-muted-foreground">
                    <span>Features</span>
                    <span>Solutions</span>
                    <span>Pricing</span>
                  </div>
                  <button className="px-3.5 py-1 rounded-full bg-white text-black font-semibold text-[10px] hover:scale-105 transition-transform">
                    Start Project
                  </button>
                </div>

                {/* Hero Header */}
                <div className="text-center py-4 flex flex-col items-center gap-3">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight max-w-md bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">
                    Automate your enterprise intelligence.
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                    Connect all your business APIs, run secure workflows, and view real-time operations in one integrated dashboard.
                  </p>
                  <div className="flex gap-3 mt-1">
                    <span className="px-3.5 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[10px] shadow-lg shadow-blue-500/20 cursor-pointer transition-colors flex items-center gap-1">
                      Deploy to Cloud <ChevronRight className="w-3 h-3" />
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-foreground text-[10px] cursor-pointer hover:bg-white/10 transition-colors">
                      Read API Docs
                    </span>
                  </div>
                </div>

                {/* 3 Product Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Cpu, title: "Custom APIs", desc: "Build tailored systems" },
                    { icon: ShieldCheck, title: "Enterprise Grade", desc: "Highest security compliance" },
                    { icon: Activity, title: "Real-time Metrics", desc: "Interactive dashboards" }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-1.5 hover:bg-white/[0.04] transition-all">
                      <item.icon className="w-4 h-4 text-blue-400" />
                      <span className="text-[10px] font-bold text-foreground">{item.title}</span>
                      <span className="text-[9px] text-muted-foreground leading-normal">{item.desc}</span>
                    </div>
                  ))}
                </div>

              </div>
            </GlassCard>
          </m.div>

          {/* ─── 2. FLOATING LAYER: Responsive Mobile View Mockup (Top Right) ────── */}
          <m.div
            {...floatAnimation(0.3, 7, 5.2)}
            initial={{ opacity: 0, x: 50, y: -40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute z-30 top-[5%] -right-[8%] sm:-right-[11%] w-[130px] h-[255px] rounded-[24px] overflow-hidden hidden sm:block shadow-2xl"
            style={{ translateZ: 80 }}
          >
            <GlassCard className="w-full h-full border-white/10 p-3.5 flex flex-col gap-4 rounded-[24px]">
              {/* Phone notch */}
              <div className="w-14 h-3.5 bg-black/60 dark:bg-white/5 rounded-full mx-auto flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Mobile View viewport content */}
              <div className="flex-1 flex flex-col gap-3 text-center">
                <span className="font-bold text-[9px] tracking-wider text-muted-foreground">NEXUS</span>
                
                <h4 className="text-[12px] font-black leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                  Automate intelligence.
                </h4>

                {/* Stacked Layout visual */}
                <div className="h-[75px] rounded-lg bg-white/5 border border-white/5 flex flex-col justify-center items-center gap-1.5 p-2">
                  <Smartphone className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
                  <span className="text-[8px] text-muted-foreground leading-snug">Fully responsive designs</span>
                </div>

                <div className="py-1.5 rounded-full bg-blue-500 text-white font-semibold text-[8px] shadow-lg shadow-blue-500/25">
                  Install App
                </div>
              </div>
            </GlassCard>
          </m.div>

          {/* ─── 3. FLOATING LAYER: Real-time Analytics Card (Bottom Left) ───────── */}
          <m.div
            {...floatAnimation(0.7, 6, 5.7)}
            initial={{ opacity: 0, x: -50, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute z-25 bottom-[2%] -left-[6%] sm:-left-[12%] w-[200px] p-4 hidden sm:block"
            style={{ translateZ: 50 }}
          >
            <GlassCard className="p-4 border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[9px] font-bold tracking-widest uppercase">Live Visitors</span>
                <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">24,580</span>
                <span className="text-[9.5px] font-bold text-[#10b981] bg-[#10b981]/15 px-1.5 py-0.5 rounded-full">+18%</span>
              </div>
              
              {/* Smooth SVG Analytics Sparkline */}
              <svg viewBox="0 0 100 24" className="w-full h-8 mt-1 overflow-visible">
                <defs>
                  <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,20 C 15,18 20,8 35,12 C 50,16 55,2 70,6 C 85,10 90,2 100,5"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M 0,20 C 15,18 20,8 35,12 C 50,16 55,2 70,6 C 85,10 90,2 100,5 L 100,24 L 0,24 Z"
                  fill="url(#sparkline-grad)"
                />
              </svg>
            </GlassCard>
          </m.div>

          {/* ─── 4. FLOATING LAYER: Revenue MRR Metrics Card (Bottom Right) ──────── */}
          <m.div
            {...floatAnimation(0.9, 8, 6.2)}
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute z-20 bottom-[-5%] sm:bottom-[-2%] right-[-4%] sm:-right-[10%] w-[180px] p-4 hidden sm:block"
            style={{ translateZ: 40 }}
          >
            <GlassCard className="p-4 border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[9px] font-bold tracking-widest uppercase">MRR Growth</span>
                <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black">$124,000</span>
                <span className="text-[9px] text-[#10b981] font-semibold">↑ 37%</span>
              </div>
              
              {/* Modern stacked loading indicator */}
              <div className="flex gap-1 mt-2">
                <div className="h-1 flex-1 rounded bg-[#10b981]" />
                <div className="h-1 flex-1 rounded bg-[#10b981]" />
                <div className="h-1 flex-1 rounded bg-[#10b981]" />
                <div className="h-1 flex-1 rounded bg-[#10b981]" />
                <div className="h-1 flex-1 rounded bg-white/10" />
              </div>
            </GlassCard>
          </m.div>

          {/* ─── 5. FLOATING LAYER: AI Copilot Assistant Widget (Top Left) ─────────── */}
          <m.div
            {...floatAnimation(0.1, 7.5, 4.8)}
            initial={{ opacity: 0, x: -50, y: -45 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute z-35 top-[2%] -left-[8%] sm:-left-[12%] w-[210px] hidden sm:block"
            style={{ translateZ: 90 }}
          >
            <GlassCard className="p-3.5 border-white/10 flex flex-col gap-3">
              
              {/* Header info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center">
                    <MessageSquare className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold block leading-none">Aivora AI</span>
                    <span className="text-[8px] text-[#10b981] font-medium leading-none">● Online</span>
                  </div>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </div>

              {/* Prompt dialog box */}
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[9.5px] leading-relaxed text-foreground/90 font-medium">
                "Building your design token system... Done. Preparing Vercel production deploy."
              </div>
            </GlassCard>
          </m.div>

          {/* ─── 6. FLOATING LAYER: Deployment Success Toast (Middle Left) ───────── */}
          <m.div
            {...floatAnimation(0.5, 5.5, 5.1)}
            initial={{ opacity: 0, x: -40, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute z-30 top-[40%] -left-[14%] w-[190px] hidden sm:block"
            style={{ translateZ: 60 }}
          >
            <GlassCard className="p-3 border-emerald-500/20 bg-emerald-500/[0.02] flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="truncate">
                <span className="text-[9.5px] font-bold block text-foreground leading-none">Deployment Success</span>
                <span className="text-[8px] text-muted-foreground tracking-tight leading-none mt-1 block">Production Ready</span>
              </div>
            </GlassCard>
          </m.div>

        </m.div>
      </div>
    </LazyMotion>
  )
}
