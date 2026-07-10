'use client'

/**
 * GlobalWaveBackground
 *
 * A single, fixed-position animated wave canvas that sits at z-0 behind
 * every page in the Aivora layout. Never duplicated, never causes layout
 * shifts, never intercepts pointer events.
 *
 * Features:
 * - Page-aware intensity via `usePathname`
 * - prefers-reduced-motion: pauses animation entirely
 * - Tab visibility API: pauses RAF when tab is hidden
 * - Mobile density reduction: coarser grid = fewer DOM nodes
 * - All tokens driven from `wave-config.ts` — zero magic numbers here
 */

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { createNoise2D } from 'simplex-noise'
import { WAVE_CONFIG, PAGE_INTENSITY } from '@aivora/lib/wave-config'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Point {
  x: number
  y: number
  wave: { x: number; y: number }
  cursor: { x: number; y: number; vx: number; vy: number }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function resolveIntensity(pathname: string): number {
  // Strip locale prefix (/ar or /en)
  const stripped = pathname.replace(/^\/(ar|en)/, '') || '/'

  // Exact match first
  if (stripped in PAGE_INTENSITY) return PAGE_INTENSITY[stripped]!

  // Prefix match (e.g. /services/ai-solutions → /services)
  for (const [key, val] of Object.entries(PAGE_INTENSITY)) {
    if (key !== 'default' && stripped.startsWith(key)) return val
  }

  return PAGE_INTENSITY.default ?? 0.45
}

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function GlobalWaveBackground() {
  const pathname = usePathname()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)

  const mouseRef = React.useRef({
    x: -200, y: 0,
    lx: 0, ly: 0,
    sx: 0, sy: 0,
    v: 0, vs: 0, a: 0,
    set: false,
  })

  const pathsRef = React.useRef<SVGPathElement[]>([])
  const linesRef = React.useRef<Point[][]>([])
  const noiseRef = React.useRef<((x: number, y: number) => number) | null>(null)
  const rafRef = React.useRef<number | null>(null)
  const boundingRef = React.useRef<DOMRect | null>(null)
  const pausedRef = React.useRef(false)
  const reducedMotionRef = React.useRef(false)
  const frameCountRef = React.useRef(0)

  // Compute intensity once per pathname change
  const intensity = React.useMemo(() => resolveIntensity(pathname), [pathname])
  const finalOpacity = WAVE_CONFIG.baseOpacity * intensity

  // ── Detect reduced motion ──
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mq.matches
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ── Pause when tab hidden ──
  React.useEffect(() => {
    const onVisible = () => { pausedRef.current = document.hidden }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  // ── Core animation setup ──
  React.useEffect(() => {
    if (!containerRef.current || !svgRef.current) return
    const container = containerRef.current

    noiseRef.current = createNoise2D()
    setSize()
    setLines()

    const onResize = () => { setSize(); setLines() }
    const onMouseMove = (e: MouseEvent) => updateMouse(e.pageX, e.pageY)
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const t = e.touches[0]
      if (t) updateMouse(t.clientX, t.clientY)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    container.addEventListener('touchmove', onTouchMove, { passive: false })

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('touchmove', onTouchMove)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Grid setup ──
  function setSize() {
    if (!containerRef.current || !svgRef.current) return
    boundingRef.current = containerRef.current.getBoundingClientRect()
    const { width, height } = boundingRef.current
    svgRef.current.style.width = `${width}px`
    svgRef.current.style.height = `${height}px`
  }

  function setLines() {
    if (!svgRef.current || !boundingRef.current) return
    const { width, height } = boundingRef.current

    // Clear existing
    pathsRef.current.forEach(p => p.remove())
    pathsRef.current = []
    linesRef.current = []

    // Use coarser grid on mobile
    const mobile = isMobile()
    const xGap = mobile ? WAVE_CONFIG.xGapMobile : WAVE_CONFIG.xGap
    const yGap = mobile ? WAVE_CONFIG.yGapMobile : WAVE_CONFIG.yGap

    const oWidth = width + 200
    const oHeight = height + 60

    const totalLines = Math.ceil(oWidth / xGap)
    const totalPoints = Math.ceil(oHeight / yGap)

    const xStart = (width - xGap * totalLines) / 2
    const yStart = (height - yGap * totalPoints) / 2

    for (let i = 0; i < totalLines; i++) {
      const points: Point[] = []

      for (let j = 0; j < totalPoints; j++) {
        points.push({
          x: xStart + xGap * i,
          y: yStart + yGap * j,
          wave: { x: 0, y: 0 },
          cursor: { x: 0, y: 0, vx: 0, vy: 0 },
        })
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', WAVE_CONFIG.strokeColor)
      path.setAttribute('stroke-width', WAVE_CONFIG.strokeWidth)
      svgRef.current.appendChild(path)
      pathsRef.current.push(path)
      linesRef.current.push(points)
    }
  }

  // ── Mouse / touch position ──
  function updateMouse(x: number, y: number) {
    if (!boundingRef.current) return
    const m = mouseRef.current
    m.x = x - boundingRef.current.left
    m.y = y - boundingRef.current.top + window.scrollY
    if (!m.set) {
      m.sx = m.x; m.sy = m.y
      m.lx = m.x; m.ly = m.y
      m.set = true
    }
  }

  // ── Point physics ──
  function movePoints(time: number) {
    const noise = noiseRef.current
    if (!noise) return
    const m = mouseRef.current

    for (const points of linesRef.current) {
      for (const p of points) {
        const noiseVal = noise(
          (p.x + time * WAVE_CONFIG.speedX) * 0.003,
          (p.y + time * WAVE_CONFIG.speedY) * 0.002,
        ) * WAVE_CONFIG.noiseAmplitude

        p.wave.x = Math.cos(noiseVal) * WAVE_CONFIG.waveX
        p.wave.y = Math.sin(noiseVal) * WAVE_CONFIG.waveY

        // Cursor influence
        const dx = p.x - m.sx
        const dy = p.y - m.sy
        const d = Math.hypot(dx, dy)
        const l = Math.max(WAVE_CONFIG.cursorRadius, m.vs)

        if (d < l) {
          const s = 1 - d / l
          const f = Math.cos(d * 0.001) * s
          p.cursor.vx += Math.cos(m.a) * f * l * m.vs * WAVE_CONFIG.cursorDamping
          p.cursor.vy += Math.sin(m.a) * f * l * m.vs * WAVE_CONFIG.cursorDamping
        }

        // Spring restoration
        p.cursor.vx += (0 - p.cursor.x) * 0.012
        p.cursor.vy += (0 - p.cursor.y) * 0.012
        p.cursor.vx *= 0.96
        p.cursor.vy *= 0.96
        p.cursor.x = Math.min(40, Math.max(-40, p.cursor.x + p.cursor.vx))
        p.cursor.y = Math.min(40, Math.max(-40, p.cursor.y + p.cursor.vy))
      }
    }
  }

  function movedPoint(p: Point, withCursor = true) {
    return {
      x: p.x + p.wave.x + (withCursor ? p.cursor.x : 0),
      y: p.y + p.wave.y + (withCursor ? p.cursor.y : 0),
    }
  }

  function drawLines() {
    const lines = linesRef.current
    const paths = pathsRef.current

    lines.forEach((points, li) => {
      if (points.length < 2 || !paths[li]) return
      const first = points[0]
      if (!first) return

      const fp = movedPoint(first, false)
      let d = `M ${fp.x} ${fp.y}`

      for (let i = 1; i < points.length; i++) {
        const p = points[i]
        if (!p) continue
        const mp = movedPoint(p)
        d += `L ${mp.x} ${mp.y}`
      }

      paths[li]!.setAttribute('d', d)
    })
  }

  // ── Main animation loop ──
  function tick(time: number) {
    // Pause conditions
    if (pausedRef.current || reducedMotionRef.current) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    // Frame throttle (skip frames on heavy pages if needed)
    frameCountRef.current++
    if (frameCountRef.current % WAVE_CONFIG.throttleFrames !== 0) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    const m = mouseRef.current
    m.sx += (m.x - m.sx) * WAVE_CONFIG.cursorSmoothing
    m.sy += (m.y - m.sy) * WAVE_CONFIG.cursorSmoothing

    const dx = m.x - m.lx
    const dy = m.y - m.ly
    m.v = Math.hypot(dx, dy)
    m.vs += (m.v - m.vs) * WAVE_CONFIG.velocitySmoothing
    m.vs = Math.min(100, m.vs)
    m.lx = m.x
    m.ly = m.y
    m.a = Math.atan2(dy, dx)

    movePoints(time)
    drawLines()

    rafRef.current = requestAnimationFrame(tick)
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        opacity: finalOpacity,
        transition: 'opacity 800ms ease',
        willChange: 'opacity',
      }}
    >
      <svg
        ref={svgRef}
        className="block w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  )
}
