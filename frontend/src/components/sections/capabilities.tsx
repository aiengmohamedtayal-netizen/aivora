"use client"

import { motion } from "framer-motion"
import { SectionLabel, Card, CardHeader, CardTitle, CardContent } from "@/components/ui"
import { staggerContainer, fadeUp } from "@/lib/motion"

export function SectionCapabilities() {
  const capabilities = [
    {
      title: "Full-Stack Architecture",
      desc: "High-performance web applications built with Next.js 15 and React 19. Server-first rendering, type-safe APIs, and real-time data layers."
    },
    {
      title: "Intelligent Systems",
      desc: "Agentic automation powered by FastAPI and containerized microservices. Custom LLM orchestration, vector search, and prompt engineering."
    },
    {
      title: "Immersive Interfaces",
      desc: "Fast, accessible 3D and motion experiences. Design system-driven UI with Framer Motion, React Three Fiber, and WCAG AA compliance."
    }
  ]

  return (
    <section aria-label="What We Build" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4 text-primary">WHAT WE BUILD</SectionLabel>
          <h2 className="text-h2 font-display">Full-spectrum engineering. From database schema to pixel.</h2>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {capabilities.map((cap, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="h-full bg-background border-border hover:border-primary/50 transition-colors shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{cap.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-body text-muted-foreground">{cap.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
