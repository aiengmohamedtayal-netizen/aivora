import type { Transition, Variants, TargetAndTransition } from "framer-motion"

/* ─────────────────────────────────────────────────────────────────────────
   1. EASING CONSTANTS
   Named cubic-bezier curves for consistent, premium motion.
   ───────────────────────────────────────────────────────────────────────── */

export const ease = {
  /** Expo out — fast start, graceful stop. Best for entrances. */
  expoOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** Quint out — smooth general-purpose ease. */
  quintOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Standard — for micro-interactions and state changes. */
  standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
  /** Decelerate — for elements entering the screen. */
  decelerate: [0, 0, 0.2, 1] as [number, number, number, number],
  /** Accelerate — for elements leaving the screen. */
  accelerate: [0.4, 0, 1, 1] as [number, number, number, number],
} as const

/* ─────────────────────────────────────────────────────────────────────────
   2. SPRING TRANSITIONS — per desi.md §6
   ───────────────────────────────────────────────────────────────────────── */

export const springSmooth: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 26,
}

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 28,
}

/* ─────────────────────────────────────────────────────────────────────────
   3. DURATION TOKENS
   ───────────────────────────────────────────────────────────────────────── */

export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  /** For large hero reveals and composition entrances. */
  hero: 0.8,
} as const

/* ─────────────────────────────────────────────────────────────────────────
   4. STANDARD VIEWPORT CONFIGURATION
   Use on all scroll-triggered animations for consistent trigger points.
   ───────────────────────────────────────────────────────────────────────── */

export const viewport = {
  /** Default — triggers when element is 100px into the viewport. */
  default: { once: true, margin: "-100px" } as const,
  /** Tight — triggers when element is 50px into the viewport (small cards). */
  tight: { once: true, margin: "-50px" } as const,
  /** Eager — triggers as soon as any pixel enters the viewport. */
  eager: { once: true, margin: "0px" } as const,
} as const

/* ─────────────────────────────────────────────────────────────────────────
   5. ENTER/EXIT VARIANTS — per desi.md §6
   All variants use "hidden" / "visible" state names for consistency.
   Note: MotionConfig reducedMotion="user" in MotionProvider.tsx handles
   prefers-reduced-motion globally — no per-variant guards needed.
   ───────────────────────────────────────────────────────────────────────── */

/** Entry animation: translates up 24px while fading in. Primary scroll reveal. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSmooth,
  },
}

/** Pure fade — for overlays, tooltips, and modals. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal, ease: ease.standard },
  },
}

/** Scale in from 95% — for cards, dialogs, and feature blocks. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slow, ease: ease.expoOut },
  },
}

/** Slide in from the right — for sidebars and panels. */
export const slideIn: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.slow, ease: ease.expoOut },
  },
}

/** Slide in from the left — for RTL and left-side panels. */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.slow, ease: ease.expoOut },
  },
}

/** Orchestrator: staggers child animations. */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

/** Macro section reveal for large scroll-triggered entrances. */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.hero,
      ease: ease.quintOut,
    },
  },
}

/** Hero composition entrance — scale + fade + lift. */
export const heroEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: duration.hero, ease: ease.expoOut, delay: 0.2 },
  },
}

/* ─────────────────────────────────────────────────────────────────────────
   6. INTERACTION PRESETS
   ───────────────────────────────────────────────────────────────────────── */

/** Button micro-interaction — gentle lift and scale. */
export const buttonHover = {
  whileHover: { y: -2, scale: 1.02, transition: springSnappy },
  whileTap: { scale: 0.96, transition: springSnappy },
}

/** Card hover — lifts and scales subtly. */
export const cardHover = {
  whileHover: {
    y: -8,
    scale: 1.02,
    transition: springSmooth,
  },
}

/* ─────────────────────────────────────────────────────────────────────────
   7. ACCORDION / COLLAPSE TRANSITION
   For height-animating collapsed content (FAQ, accordion, etc.)
   ───────────────────────────────────────────────────────────────────────── */

export const collapseTransition: Transition = {
  duration: duration.normal,
  ease: ease.standard,
}

/** Spread props for a height-collapsing motion.div. Use with AnimatePresence. */
export const collapseProps = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 } as TargetAndTransition,
  exit: { height: 0, opacity: 0 } as TargetAndTransition,
  transition: collapseTransition,
} as const
