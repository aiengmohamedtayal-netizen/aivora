"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { useLocale } from "next-intl"
import { ArrowUpRight, ArrowDownRight, Activity, Zap, Users, Server, Box, GitMerge } from "lucide-react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------
const revenueData = [
  { name: "Jan", revenue: 4000, previous: 2400 },
  { name: "Feb", revenue: 5200, previous: 3100 },
  { name: "Mar", revenue: 4800, previous: 3900 },
  { name: "Apr", revenue: 8400, previous: 4200 },
  { name: "May", revenue: 10500, previous: 4800 },
  { name: "Jun", revenue: 12100, previous: 5100 },
  { name: "Jul", revenue: 14200, previous: 5800 },
]

const aiRequestsData = [
  { time: "00:00", count: 120 },
  { time: "04:00", count: 80 },
  { time: "08:00", count: 450 },
  { time: "12:00", count: 600 },
  { time: "16:00", count: 520 },
  { time: "20:00", count: 300 },
  { time: "24:00", count: 150 },
]

const serviceDistributionData = [
  { name: "SaaS Platforms", value: 45, color: "hsl(var(--primary))" },
  { name: "AI Agents", value: 30, color: "hsl(var(--gold))" },
  { name: "CRM Integrations", value: 15, color: "#3B82F6" }, // Blue
  { name: "Consulting", value: 10, color: "#8B5CF6" }, // Violet
]

const funnelData = [
  { name: "Total Leads", count: 1000, opacity: 0.2 },
  { name: "Qualified", count: 650, opacity: 0.5 },
  { name: "Proposals", count: 320, opacity: 0.8 },
  { name: "Won", count: 180, opacity: 1 },
]

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

// Metric Card with Sparkline
function MetricCard({
  title,
  value,
  delta,
  trend,
  icon: Icon,
  data,
  dataKey,
  color,
}: {
  title: string
  value: string
  delta: string
  trend: "up" | "down"
  icon: any
  data: any[]
  dataKey: string
  color: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-primary/30 hover:shadow-primary/5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-muted/50 p-2 border border-border/50">
              <Icon size={16} className="text-muted-foreground" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
              trend === "up" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
            )}
          >
            {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {delta}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-3xl font-display font-bold tracking-tight text-foreground">{value}</div>
          <div className="h-12 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/50 bg-background/95 p-3 shadow-xl backdrop-blur-md">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-4 justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {p.name.toLowerCase().includes('revenue') ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// -----------------------------------------------------------------------------
// Main Workspace
// -----------------------------------------------------------------------------
export function AnalyticsWorkspace() {
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[600px] w-full animate-pulse bg-muted/20 rounded-3xl" />

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full p-2"
    >
      {/* Top Row: Mini Metrics */}
      <motion.div variants={itemVariants} className="col-span-1 lg:col-span-1">
        <MetricCard
          title={locale === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
          value="$142.5k"
          delta="+24.5%"
          trend="up"
          icon={Activity}
          data={revenueData}
          dataKey="revenue"
          color="hsl(var(--primary))"
        />
      </motion.div>
      <motion.div variants={itemVariants} className="col-span-1 lg:col-span-1">
        <MetricCard
          title={locale === 'ar' ? 'الطلبات الذكية' : 'AI Inferences'}
          value="2.4M"
          delta="+12.2%"
          trend="up"
          icon={Zap}
          data={aiRequestsData}
          dataKey="count"
          color="#10B981"
        />
      </motion.div>
      <motion.div variants={itemVariants} className="col-span-1 lg:col-span-1">
        <MetricCard
          title={locale === 'ar' ? 'معدل التحويل' : 'Conversion'}
          value="4.8%"
          delta="+0.8%"
          trend="up"
          icon={Users}
          data={funnelData}
          dataKey="count"
          color="#3B82F6"
        />
      </motion.div>
      <motion.div variants={itemVariants} className="col-span-1 lg:col-span-1">
        <MetricCard
          title={locale === 'ar' ? 'زمن الاستجابة' : 'Avg Latency'}
          value="12ms"
          delta="-4.1%"
          trend="down" // Down is good for latency
          icon={Server}
          data={aiRequestsData}
          dataKey="count"
          color="#8B5CF6"
        />
      </motion.div>

      {/* Main Row: Revenue Trend & Distribution */}
      <motion.div
        variants={itemVariants}
        className="col-span-1 md:col-span-2 lg:col-span-3 rounded-3xl border border-border/50 bg-card/40 p-6 shadow-xl backdrop-blur-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative z-10 flex flex-col h-full min-h-[300px]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                {locale === 'ar' ? 'نمو الإيرادات' : 'Revenue Growth'}
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                {locale === 'ar' ? 'مقارنة بالربع السابق' : 'Compared to previous quarter'}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-foreground">{locale === 'ar' ? 'الحالي' : 'Current'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="text-muted-foreground">{locale === 'ar' ? 'السابق' : 'Previous'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full h-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(val) => `$${val/1000}k`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="previous"
                  name={locale === 'ar' ? 'السابق' : 'Previous'}
                  stroke="hsl(var(--muted-foreground) / 0.5)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorPrevious)"
                  isAnimationActive={true}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name={locale === 'ar' ? 'الإيرادات' : 'Revenue'}
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 3 }}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Distribution Donut */}
      <motion.div
        variants={itemVariants}
        className="col-span-1 lg:col-span-1 rounded-3xl border border-border/50 bg-card/40 p-6 shadow-xl backdrop-blur-2xl flex flex-col min-h-[300px] hover:border-primary/30 transition-colors"
      >
        <h3 className="font-display text-sm font-bold text-foreground mb-4">
          {locale === 'ar' ? 'توزيع الخدمات' : 'Service Distribution'}
        </h3>
        <div className="flex-1 w-full relative min-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={serviceDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                isAnimationActive={true}
              >
                {serviceDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-display text-xl font-bold">100%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {serviceDistributionData.slice(0, 4).map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] text-muted-foreground truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Row: Funnel & AI Telemetry */}
      <motion.div
        variants={itemVariants}
        className="col-span-1 md:col-span-2 lg:col-span-2 rounded-3xl border border-border/50 bg-card/40 p-6 shadow-xl backdrop-blur-2xl min-h-[260px] flex flex-col"
      >
        <h3 className="font-display text-sm font-bold text-foreground mb-4">
          {locale === 'ar' ? 'قمع المبيعات' : 'Sales Funnel'}
        </h3>
        <div className="flex-1 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnelData}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                width={90}
                orientation={locale === 'ar' ? 'right' : 'left'}
              />
              <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                name={locale === 'ar' ? 'العدد' : 'Count'} 
                radius={[0, 4, 4, 0]}
                barSize={24}
                isAnimationActive={true}
              >
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--primary))" fillOpacity={entry.opacity} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="col-span-1 md:col-span-2 lg:col-span-2 rounded-3xl border border-border/50 bg-card/40 p-6 shadow-xl backdrop-blur-2xl min-h-[260px] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-sm font-bold text-foreground">
            {locale === 'ar' ? 'الطلبات الحية' : 'Live Telemetry'}
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-green-500/20 bg-green-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-500">LIVE</span>
          </div>
        </div>
        <div className="flex-1 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aiRequestsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Line
                type="monotone"
                dataKey="count"
                name={locale === 'ar' ? 'الطلبات' : 'Requests'}
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: "#10B981", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </motion.div>
  )
}
