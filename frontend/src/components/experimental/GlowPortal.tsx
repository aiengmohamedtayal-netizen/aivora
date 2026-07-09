"use client"

import { motion } from "framer-motion"

export function GlowPortal() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center pointer-events-none select-none">
      {/* Outer Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/20 rounded-full blur-3xl opacity-60 animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[450px] bg-primary/10 rounded-full blur-2xl opacity-40" />

      {/* 3D Perspective container */}
      <div className="relative w-[300px] h-[400px] [perspective:1000px] flex items-center justify-center">
        
        {/* Left Side Glass Wall Panel */}
        <motion.div 
          initial={{ opacity: 0, rotateY: 35, x: -50 }}
          animate={{ opacity: 0.15, rotateY: 35, x: 0 }}
          transition={{ duration: 1 }}
          className="absolute left-[-20px] w-[120px] h-[360px] border border-primary/30 bg-gradient-to-r from-primary/10 to-transparent [transform-style:preserve-3d] origin-right"
        />

        {/* Right Side Glass Wall Panel */}
        <motion.div 
          initial={{ opacity: 0, rotateY: -35, x: 50 }}
          animate={{ opacity: 0.15, rotateY: -35, x: 0 }}
          transition={{ duration: 1 }}
          className="absolute right-[-20px] w-[120px] h-[360px] border border-primary/30 bg-gradient-to-l from-primary/10 to-transparent [transform-style:preserve-3d] origin-left"
        />

        {/* The Portal Frame (Glowing Doorway) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
          animate={{ opacity: 1, scale: 1, rotateY: -20 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative w-[160px] h-[320px] border-[3px] border-primary bg-background shadow-[0_0_50px_rgba(37,99,235,0.6),inset_0_0_30px_rgba(37,99,235,0.4)] rounded-sm overflow-hidden flex items-center justify-center"
        >
          {/* Internal Portal Light Mesh */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/50 to-primary/95 flex items-center justify-center">
            {/* Bright Center Core */}
            <div className="w-[100px] h-[300px] bg-white rounded-full blur-2xl opacity-90 animate-pulse-glow" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,1)_0%,transparent_70%)]" />
          </div>
          
          {/* Light flare running up and down */}
          <motion.div 
            animate={{ y: [-320, 320] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-[60px] bg-gradient-to-b from-transparent via-white/50 to-transparent pointer-events-none"
          />
        </motion.div>

        {/* Perspective grid floor reflection */}
        <div className="absolute bottom-[-20px] w-[350px] h-[80px] bg-[linear-gradient(to_bottom,transparent,rgba(3,3,3,1))] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
          <div className="w-full h-full bg-[linear-gradient(to_right,rgba(37,99,235,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.15)_1px,transparent_1px)] bg-[size:16px_16px]" />
        </div>

      </div>
    </div>
  )
}
