import type { Transition, Variants } from "framer-motion"

/* ─────────────────────────────────────────────────────────────────────────
   Standard Springs — per desi.md §6
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
   Duration Tokens
   ───────────────────────────────────────────────────────────────────────── */

export const duration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const

/* ─────────────────────────────────────────────────────────────────────────
   Core Variants — per desi.md §6
   ───────────────────────────────────────────────────────────────────────── */

/** Entry animation: translates up 24px while fading in. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSmooth,
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

/** Macro section reveal for scroll-triggered entrances. */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

/* ─────────────────────────────────────────────────────────────────────────
   Interaction Presets
   ───────────────────────────────────────────────────────────────────────── */

/** Button micro-interaction. */
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
