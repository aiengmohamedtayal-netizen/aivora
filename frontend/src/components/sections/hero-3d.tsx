"use client"

import { useRef, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useInView } from "framer-motion"

// Dynamically import the heavy 3D scene ONLY when triggered
// This removes 'three' and '@react-three/fiber' from the initial payload
const HeroScene = dynamic(() => import("./hero-scene"), { 
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse bg-muted/20 rounded-full" />
})

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "200px" })
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Wait until intersection observer fires AND we are on the client
    if (isInView) {
      setShouldLoad(true)
    }
  }, [isInView])

  return (
    <div 
      ref={containerRef} 
      className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-50 z-0 hidden lg:block"
    >
      {shouldLoad && <HeroScene />}
    </div>
  )
}
