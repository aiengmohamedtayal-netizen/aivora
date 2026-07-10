'use client';

import { BarChart, Users, Activity, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { MacWindow } from './MacWindow';
import { useTranslations } from 'next-intl';

export function CRMVisualization() {
  const t = useTranslations('showcase');

  return (
    <MacWindow title="Aivora CRM" className="h-[400px] w-full">
      <div className="flex h-full w-full bg-background/50 text-foreground">
        {/* Sidebar */}
        <div className="hidden w-16 md:flex flex-col items-center border-r border-white/5 py-4 gap-6 bg-white/[0.01]">
          <div className="w-8 h-8 rounded-lg bg-white/10" />
          <div className="flex flex-col gap-4 mt-4 text-white/40">
            <Users className="w-5 h-5 text-white/80" />
            <BarChart className="w-5 h-5" />
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-lg">{t('visualizations.crm.salesPipeline')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('visualizations.crm.realtimeSync')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
              <span>+24%</span>
            </div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="h-2 w-12 bg-white/20 rounded-full" />
                <div className="h-6 w-24 bg-white/80 rounded-md mt-2" />
              </motion.div>
            ))}
          </div>

          {/* Data Table Mock */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
            <div className="h-4 w-32 bg-white/20 rounded-full mb-2" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-2 w-20 bg-white/60 rounded-full" />
                    <div className="h-1.5 w-12 bg-white/20 rounded-full" />
                  </div>
                </div>
                <div className="h-2 w-16 bg-emerald-400/50 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MacWindow>
  );
}
