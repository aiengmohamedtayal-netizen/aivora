/**
 * Aivora Wave Background — Design System Configuration
 *
 * Single source of truth for all wave animation parameters.
 * Adjust these values to tune the global atmosphere across the site.
 */

// ─── Brand Colors ──────────────────────────────────────────────────────────────
export const WAVE_COLORS = {
  /** Primary indigo brand accent */
  primary: "rgba(99, 102, 241, 1)",
  /** Soft violet secondary */
  secondary: "rgba(139, 92, 246, 1)",
  /** Neutral muted for very low-contrast pages */
  muted: "rgba(148, 163, 184, 1)",
} as const

// ─── Page Intensity Map ────────────────────────────────────────────────────────
/**
 * Controls how visible the wave effect is per route prefix.
 * 1.0 = maximum (still subtle), 0.0 = invisible.
 * Any page not listed inherits the `default` value.
 */
export const PAGE_INTENSITY: Record<string, number> = {
  "/":           1.0,   // Home  – strongest (still very subtle)
  "/services":   0.6,
  "/products":   0.6,
  "/industries": 0.4,
  "/case-studies": 0.35,
  "/about":      0.45,
  "/contact":    0.25,
  "/intelligence": 0.5,
  "/capabilities": 0.5,
  "/intake":     0.3,
  default:       0.45,
}

// ─── Base Visual Tokens ────────────────────────────────────────────────────────
export const WAVE_CONFIG = {
  /** Base opacity multiplier — intensity from PAGE_INTENSITY scales this */
  baseOpacity: 0.08,

  /** Stroke color (before opacity is applied via SVG) */
  strokeColor: WAVE_COLORS.primary,

  /** Canvas grid gap on desktop — larger = fewer lines = lighter render */
  xGap: 28,
  yGap: 28,

  /** Grid gap on mobile (coarser = better performance) */
  xGapMobile: 48,
  yGapMobile: 48,

  /** Noise animation speed multiplier — lower = slower, calmer */
  speedX: 0.002,
  speedY: 0.001,

  /** Noise amplitude — how far each line bends */
  noiseAmplitude: 6,
  waveX: 10,
  waveY: 5,

  /** Cursor influence radius */
  cursorRadius: 140,

  /** Cursor force dampening — higher = less ripple */
  cursorDamping: 0.012,

  /** Stroke width of each wave line */
  strokeWidth: "0.6",

  /** Pointer dot size in rem */
  pointerSize: 0,

  /** Smoothing for cursor tracking (0–1, higher = snappier) */
  cursorSmoothing: 0.06,

  /** Velocity smoothing */
  velocitySmoothing: 0.08,

  /** RAF throttle: skip every N frames on low-power hint */
  throttleFrames: 1,
} as const
