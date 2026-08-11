'use client'

import Image from 'next/image'
import { BrainCircuit, Cloud, Database, Workflow } from 'lucide-react'

const systems = [
  { label: 'AI model', icon: BrainCircuit },
  { label: 'Data layer', icon: Database },
  { label: 'Automation', icon: Workflow },
  { label: 'Cloud scale', icon: Cloud },
]

export function HeroComposition() {
  return (
    <div
      className="relative flex w-full items-center justify-center"
      style={{ height: 'clamp(440px, 52vw, 620px)' }}
    >
      <div className="relative w-full max-w-[800px]">
        <div
          className="group relative overflow-hidden rounded-[28px] border border-sky-200/15 bg-[#050a13] shadow-[0_32px_90px_rgba(15,23,42,0.28)] sm:rounded-[34px]"
          style={{ height: 'clamp(280px, 38vw, 500px)' }}
        >
          <Image
            src="/aivora-hero-intelligence-constellation.jpg"
            alt="Aivora intelligence constellation connecting AI, data, automation, and cloud systems"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.72)_0%,rgba(3,7,18,0.02)_38%,rgba(3,7,18,0.76)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200/75 to-transparent" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
            <div className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-2 backdrop-blur-md sm:px-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.19em] text-sky-100/65">Aivora intelligence fabric</p>
              <p className="mt-1 text-xs font-medium text-white sm:text-sm">Built for connected ambition.</p>
            </div>
            <span className="hidden rounded-full border border-cyan-200/15 bg-cyan-300/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur-md sm:inline-flex">
              Systems online
            </span>
          </div>

          <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2 sm:inset-x-6 sm:bottom-6 sm:grid-cols-4 sm:gap-3">
            {systems.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/55 px-3 py-2.5 backdrop-blur-md"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-sky-200" />
                <span className="text-[10px] font-medium text-slate-100 sm:text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -right-1 top-[11%] hidden rounded-2xl border border-sky-200/15 bg-slate-950/65 p-3.5 shadow-xl backdrop-blur-xl sm:block lg:-right-6">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-sky-300/10 text-sky-200">
            <BrainCircuit className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
          </span>
          <div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400">Core state</p>
            <p className="mt-0.5 text-xs font-medium text-white">Learning live</p>
          </div>
        </div>
      </div>

      <div className="absolute -left-1 bottom-[13%] hidden rounded-2xl border border-violet-200/15 bg-slate-950/65 p-3.5 shadow-xl backdrop-blur-xl sm:block lg:-left-6">
        <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400">Orchestration</p>
        <div className="mt-2 flex items-end gap-1">
          {[0.45, 0.75, 0.6, 1, 0.8].map((height, index) => (
            <span
              key={index}
              className="w-1 rounded-full bg-gradient-to-t from-violet-400/55 to-sky-200"
              style={{ height: `${height * 22}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
