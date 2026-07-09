'use client';

import { Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { MacWindow } from './MacWindow';

export function AssistantVisualization() {
  return (
    <MacWindow title="Aivora Agent" className="h-[400px] w-full">
      <div className="flex flex-col h-full w-full bg-background/50 relative">
        {/* Chat Area */}
        <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="self-end max-w-[80%] bg-white/10 border border-white/10 rounded-2xl rtl:rounded-tl-sm ltr:rounded-tr-sm px-4 py-3 text-sm text-foreground"
          >
            Analyze our Q3 sales data and generate a pipeline forecast.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            viewport={{ once: true }}
            className="self-start max-w-[85%] bg-blue-500/10 border border-blue-500/20 rounded-2xl rtl:rounded-tr-sm ltr:rounded-tl-sm px-4 py-3 text-sm flex gap-3"
          >
            <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-3">
              <p className="text-foreground">
                I&apos;ve analyzed the deterministic pipeline data. Q3 shows a 24%
                increase in closed-won deals.
              </p>
              <div 
                dir="ltr"
                className="bg-background/80 rounded-lg p-3 border border-white/5 font-mono text-xs text-blue-300 text-left"
              >
                <span className="text-white/40">1</span>{' '}
                {`"status": "success",`}
                <br />
                <span className="text-white/40">2</span>{' '}
                {`"forecast": "+18% MoM",`}
                <br />
                <span className="text-white/40">3</span>{' '}
                {`"confidence": 0.94`}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
          <div className="relative flex items-center bg-background/80 border border-white/10 rounded-full px-4 py-2">
            <div className="h-4 w-32 bg-white/20 rounded-full" />
            <div className="absolute right-2 rtl:right-auto rtl:left-2 p-1.5 bg-white/10 rounded-full">
              <Send className="w-3 h-3 text-white/60 rtl:-scale-x-100" />
            </div>
          </div>
        </div>
      </div>
    </MacWindow>
  );
}
