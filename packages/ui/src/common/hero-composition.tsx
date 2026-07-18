"use client"

import React, { useState, useRef } from "react"
import { motion, useSpring } from "framer-motion"
import { 
  Code2, 
  Layers, 
  Monitor,
  Sparkles,
  Cpu,
  Settings,
  Boxes,
  Play,
  Terminal,
  Grid,
  FileCode2,
  Sliders,
  RotateCw,
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

  // Softened rotation for a 3D perspective effect
  const rotateX = useSpring(mousePosition.y * -15, { stiffness: 120, damping: 25 })
  const rotateY = useSpring(mousePosition.x * 15, { stiffness: 120, damping: 25 })
  
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
      {/* Ambient glow behind composition - soft primary and neon cyan/magenta gradients */}
      <motion.div 
        animate={{ 
          opacity: [0.15, 0.35, 0.15],
          scale: [0.95, 1.1, 0.95]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-primary/10 via-cyan-500/10 to-purple-500/10 blur-[120px] rounded-full pointer-events-none"
      />

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-full max-w-[800px] h-full flex items-center justify-center group"
      >
        
        {/* 1. CENTER PIECE: Futuristic 3D IDE & Live WebGL Viewport */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute z-10 w-[110%] sm:w-[720px] h-[440px] bg-background/55 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col transition-all duration-500 hover:border-cyan-500/30 hover:shadow-cyan-500/5"
          style={{ translateZ: 0 }}
        >
          {/* Header */}
          <div className="h-12 border-b border-border/40 flex items-center px-4 justify-between bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="w-6 h-6 rounded bg-cyan-500/10 flex items-center justify-center">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">aivora-app-engine</span>
              </div>
            </div>

            {/* Active file tabs */}
            <div className="hidden md:flex items-center gap-1 bg-background/30 rounded-lg p-0.5 border border-border/20">
              <span className="px-3 py-1 text-[11px] font-mono bg-background/60 text-foreground border border-border/10 rounded-md flex items-center gap-1.5 cursor-pointer">
                <FileCode2 className="w-3 h-3 text-cyan-400" /> canvas-3d.tsx
              </span>
              <span className="px-3 py-1 text-[11px] font-mono text-muted-foreground hover:text-foreground rounded-md flex items-center gap-1.5 cursor-pointer transition-colors">
                <FileCode2 className="w-3 h-3 text-purple-400" /> global.css
              </span>
              <span className="px-3 py-1 text-[11px] font-mono text-muted-foreground hover:text-foreground rounded-md flex items-center gap-1.5 cursor-pointer transition-colors">
                <FileCode2 className="w-3 h-3 text-amber-400" /> package.json
              </span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="h-7 w-7 rounded-lg bg-green-500/10 flex items-center justify-center cursor-pointer border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors">
                <Play className="w-3.5 h-3.5 fill-green-400" />
              </div>
            </div>
          </div>
          
          {/* Main IDE Body */}
          <div className="flex flex-1 overflow-hidden bg-background/20">
            {/* Left Side: Code Editor (Syntax Highlighted) */}
            <div className="w-[50%] border-r border-border/40 p-4 font-mono text-[10.5px] leading-6 select-none overflow-y-auto custom-scrollbar flex">
              {/* Line Numbers */}
              <div className="text-muted-foreground/30 text-right pr-3 select-none text-[10px] w-6 border-r border-border/10 mr-3">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i}>{String(i + 1).padStart(2, "0")}</div>
                ))}
              </div>
              {/* Code Content */}
              <div className="flex-1 text-foreground/80 overflow-x-hidden">
                <div><span className="text-purple-400">import</span> {"{"} <span className="text-cyan-400">Canvas</span>, <span className="text-cyan-400">useFrame</span> {"}"} <span className="text-purple-400">from</span> <span className="text-green-300">"@react-three/fiber"</span></div>
                <div><span className="text-purple-400">import</span> {"{"} <span className="text-cyan-400">OrbitControls</span> {"}"} <span className="text-purple-400">from</span> <span className="text-green-300">"@react-three/drei"</span></div>
                <div className="text-muted-foreground/40">// Initialize WebGL 3D Scene</div>
                <div><span className="text-purple-400">export</span> <span className="text-blue-400">const</span> <span className="text-amber-400">Web3DApp</span> = () =&gt; {"{"}</div>
                <div className="pl-4"><span className="text-blue-400">const</span> meshRef = useRef&lt;<span className="text-cyan-400">Mesh</span>&gt;(<span className="text-blue-400">null</span>)</div>
                <div className="pl-4"><span className="text-cyan-400">useFrame</span>((state) =&gt; {"{"}</div>
                <div className="pl-8">meshRef.<span className="text-cyan-400">current</span>.rotation.y += <span className="text-pink-400">0.01</span></div>
                <div className="pl-8">meshRef.<span className="text-cyan-400">current</span>.rotation.x = Math.sin(state.clock.elapsedTime) * <span className="text-pink-400">0.2</span></div>
                <div className="pl-4">{"})"}</div>
                <div className="pl-4"><span className="text-purple-400">return</span> (</div>
                <div className="pl-8">&lt;<span className="text-red-400">Canvas</span> <span className="text-purple-400">camera</span>={"{{"} <span className="text-cyan-400">position</span>: [<span className="text-pink-400">0, 0, 5</span>] {"}}"}&gt;</div>
                <div className="pl-12">&lt;<span className="text-red-400">ambientLight</span> <span className="text-purple-400">intensity</span>={"{0.5}"} /&gt;</div>
                <div className="pl-12">&lt;<span className="text-red-400">mesh</span> <span className="text-purple-400">ref</span>={"{meshRef}"}&gt;</div>
                <div className="pl-16">&lt;<span className="text-red-400">boxGeometry</span> /&gt;</div>
                <div className="pl-16">&lt;<span className="text-red-400">meshStandardMaterial</span> <span className="text-purple-400">wireframe</span> /&gt;</div>
              </div>
            </div>
            
            {/* Right Side: Interactive 3D Viewport View */}
            <div className="flex-1 p-4 flex flex-col gap-3 bg-muted/10 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-muted-foreground/60 border-b border-border/20 pb-2">
                <span className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-cyan-400" /> WebGL Render Viewport
                </span>
                <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] rounded font-mono">
                  60 FPS
                </span>
              </div>

              {/* Dynamic 3D CSS Wireframe Scene */}
              <div className="flex-1 relative rounded-xl border border-border/30 bg-background/50 overflow-hidden flex items-center justify-center group/viewport">
                
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

                {/* Rotating 3D Object Render Mockup */}
                <motion.div
                  animate={{ 
                    rotateY: 360,
                    rotateX: [15, 30, 15]
                  }}
                  transition={{ 
                    rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
                    rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="relative w-36 h-36 border border-dashed border-cyan-500/30 rounded-full flex items-center justify-center transform-gpu"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Rotating Wireframe Cube Inner */}
                  <motion.div 
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute w-20 h-20 border-2 border-primary/40 rounded flex items-center justify-center bg-primary/5 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                  >
                    <Grid className="w-10 h-10 text-cyan-400/50 animate-pulse" />
                  </motion.div>

                  {/* Orbiting Particles */}
                  <div className="absolute top-0 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-ping" />
                  <div className="absolute bottom-0 w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899] animate-pulse" />
                  <div className="absolute right-0 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                </motion.div>

                {/* Depth overlay visualizer */}
                <div className="absolute bottom-3 left-3 flex flex-col gap-1 text-[9px] font-mono text-muted-foreground">
                  <div>X-ROTATION: <span className="text-cyan-400">ACTIVE</span></div>
                  <div>Z-BUFFER: <span className="text-purple-400">ENABLE</span></div>
                </div>

                {/* Hover Interaction Tip */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover/viewport:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm pointer-events-none">
                  <div className="text-center space-y-2">
                    <RotateCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Move Mouse to Rotate Scene</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. FLOATING LAYER: 3D Shader Controls (Bottom Left) */}
        <motion.div
          {...floatAnimation(0.2, 10, 5.5)}
          initial={{ opacity: 0, x: -40, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute z-20 bottom-[-5%] sm:bottom-[-2%] -left-[5%] sm:left-[-6%] w-[210px] bg-card/85 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden hidden sm:block"
          style={{ translateZ: 50 }}
        >
          <div className="p-3 border-b border-border/40 flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-mono font-medium tracking-wider text-muted-foreground uppercase">WebGL Controls</span>
            </div>
            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          
          <div className="p-4 space-y-3">
            {/* Control Sliders */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono">
                <span className="text-muted-foreground">Bloom Threshold</span>
                <span className="text-cyan-400">0.82</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-[82%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono">
                <span className="text-muted-foreground">Camera FOV</span>
                <span className="text-purple-400">45°</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 w-[45%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono">
                <span className="text-muted-foreground">Anisotropy</span>
                <span className="text-pink-400">16x</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-pink-400 w-[100%]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. FLOATING LAYER: GPU Performance Monitor (Top Left) */}
        <motion.div
          {...floatAnimation(0.6, 8, 4.5)}
          initial={{ opacity: 0, x: -40, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute z-25 top-[0%] sm:top-[2%] -left-[5%] sm:left-[-10%] w-[190px] p-4 bg-card/90 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex flex-col hidden sm:flex"
          style={{ translateZ: 30 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-mono font-medium text-muted-foreground uppercase tracking-wider">GPU Engine</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-lg font-mono font-bold text-foreground">3.2 MB</span>
            <span className="text-[9px] text-green-400 font-mono">Mesh Opt</span>
          </div>
          
          {/* Wave/Graph simulation */}
          <div className="flex items-end gap-0.5 h-8">
            {[30, 45, 35, 55, 60, 40, 75, 85, 50, 40, 60, 70].map((height, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.4, delay: 0.5 + (i * 0.05) }}
                className={`flex-1 rounded-t-sm ${i === 7 ? 'bg-cyan-400' : 'bg-cyan-500/20 hover:bg-cyan-500/40'}`}
              />
            ))}
          </div>
        </motion.div>

        {/* 4. FLOATING LAYER: Live Dev Server Terminal (Bottom Right) */}
        <motion.div
          {...floatAnimation(0.4, 12, 6.5)}
          initial={{ opacity: 0, x: 40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute z-30 bottom-[3%] sm:bottom-[6%] -right-[5%] sm:-right-[10%] w-[250px] bg-card/85 backdrop-blur-xl border border-border/40 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden hidden sm:block"
          style={{ translateZ: 60 }}
        >
          <div className="flex items-center justify-between px-3 py-2 bg-muted/20 border-b border-border/45">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-pink-500" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Dev Server Logs</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          
          <div className="p-3 font-mono text-[9px] leading-5 text-foreground/80 space-y-1">
            <div className="text-muted-foreground/50">$ npm run dev</div>
            <div className="text-cyan-400">&gt; ready - started server on http://localhost:3000</div>
            <div>&gt; event - compiled client and server successfully</div>
            <div className="flex items-center gap-1.5 text-green-400">
              <Sparkles className="w-3 h-3 text-green-400 shrink-0" />
              <span>3D Assets Optimization complete.</span>
            </div>
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  )
}
