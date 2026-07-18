"use client"

import React from "react"
import { motion } from "framer-motion"
import { socialConfig } from "@/config/social"

export function SocialLinks() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {/* Small heading above the icons */}
      <h4 className="text-[11px] font-mono tracking-widest text-muted-foreground/60 uppercase select-none">
        Connect With Aivora
      </h4>

      {/* Centered dynamically rendered list */}
      <div className="flex items-center justify-center gap-5 sm:gap-6">
        {socialConfig.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.a
              key={item.platform}
              href={item.href}
              target={item.platform === "email" ? undefined : "_blank"}
              rel={item.platform === "email" ? undefined : "noopener noreferrer"}
              aria-label={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: "0 0 15px rgba(59,130,246,0.25)"
              }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 dark:border-white/5 text-muted-foreground hover:text-blue-400 hover:border-blue-500/30 backdrop-blur-md transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
            >
              <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5" />
            </motion.a>
          )
        })}
      </div>
    </div>
  )
}
