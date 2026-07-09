'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, Cloud, Server, Zap, Code2, Network } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIProductsVisual() {
  return (
    <div className="relative flex h-full min-h-[400px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-6 shadow-2xl backdrop-blur-xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-primary to-purple-500/50" />
      <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">AI Orchestration Engine</h4>
            <p className="text-xs text-muted-foreground">Autonomous Agent Status</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-green-500">Active</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4">
        {[
          { icon: Database, label: 'Data Ingestion', status: 'Completed', color: 'text-blue-400' },
          { icon: Brain, label: 'Vector Embeddings', status: 'Processing', color: 'text-purple-400', active: true },
          { icon: Zap, label: 'LLM Generation', status: 'Queued', color: 'text-muted-foreground' },
        ].map((step, idx) => (
          <div key={idx} className={cn("flex items-center justify-between rounded-xl border border-border/50 bg-background/50 p-4", step.active && "border-primary/30 bg-primary/5")}>
            <div className="flex items-center gap-3">
              <step.icon className={cn("h-5 w-5", step.color)} />
              <span className="text-sm font-medium text-foreground">{step.label}</span>
            </div>
            {step.active ? (
              <div className="h-1 w-16 overflow-hidden rounded-full bg-primary/20">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }} 
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="h-full w-full bg-primary"
                />
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">{step.status}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlatformVisual() {
  return (
    <div className="relative flex h-full min-h-[400px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-6 shadow-2xl backdrop-blur-xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 via-teal-500 to-cyan-500/50" />
      <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10">
            <Code2 className="h-5 w-5 text-teal-500" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Aivora Platform OS</h4>
            <p className="text-xs text-muted-foreground">High-performance architecture</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-background/50 p-4">
          <span className="text-xs text-muted-foreground">Lighthouse Score</span>
          <span className="text-3xl font-medium text-emerald-400">100</span>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-emerald-500" />
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-background/50 p-4">
          <span className="text-xs text-muted-foreground">Response Time</span>
          <span className="text-3xl font-medium text-cyan-400">42ms</span>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
            <motion.div initial={{ width: 0 }} whileInView={{ width: "15%" }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-cyan-500" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1 rounded-xl border border-border/50 bg-background/50 p-4 flex flex-col">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Server Components Activity</span>
        </div>
        <div className="flex flex-1 items-end gap-2">
          {[40, 70, 45, 90, 65, 85, 60, 50, 75].map((h, i) => (
            <motion.div 
              key={i} 
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.5, type: "spring" }}
              className="w-full rounded-t-sm bg-teal-500/40"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function IntegrationVisual() {
  return (
    <div className="relative flex h-full min-h-[400px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-6 shadow-2xl backdrop-blur-xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/50 via-rose-500 to-pink-500/50" />
      <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
            <Network className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Event-Driven Middleware</h4>
            <p className="text-xs text-muted-foreground">Real-time data synchronization</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8">
        <div className="flex w-full items-center justify-between px-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-background shadow-lg">
            <Database className="h-6 w-6 text-foreground" />
          </div>
          
          <div className="relative flex-1 px-2">
            <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-border/50" />
            <motion.div 
              animate={{ x: ["0%", "400%"] }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 -ml-2 -mt-2 h-4 w-4 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
            />
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-background shadow-lg">
            <Server className="h-6 w-6 text-foreground" />
          </div>
          
          <div className="relative flex-1 px-2">
            <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-border/50" />
            <motion.div 
              animate={{ x: ["0%", "400%"] }} 
              transition={{ duration: 1.5, delay: 0.75, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 -ml-2 -mt-2 h-4 w-4 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(243,24,102,0.5)]"
            />
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-background shadow-lg">
            <Cloud className="h-6 w-6 text-foreground" />
          </div>
        </div>
        
        <div className="flex w-full justify-between px-2 text-xs font-medium text-muted-foreground">
          <span>PostgreSQL</span>
          <span>Redis Cache</span>
          <span>Cloud Edge</span>
        </div>
      </div>
    </div>
  );
}
