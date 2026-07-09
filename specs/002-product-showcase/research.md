# Research & Decisions: Product Showcase

## Decision 1: Sticky Scroll Implementation
- **Decision**: Use Framer Motion's `useScroll` paired with a fixed sticky container.
- **Rationale**: Provides smooth 60FPS scroll-jacking that works naturally with the browser's native scroll engine rather than hijacking it entirely (which breaks accessibility and mobile).
- **Alternatives**: GSAP ScrollTrigger (too heavy, requires additional licensing for some plugins), React Scroll (not powerful enough for interpolation).

## Decision 2: macOS-style Window Mockups
- **Decision**: Create a generic wrapper component `<MacWindow />` using CSS border-radius, glassmorphism overlays, and absolute positioning for the red/yellow/green control dots.
- **Rationale**: Highly reusable across different product mockups (e.g., placing the CRM mockup inside it).
- **Alternatives**: Static image exports (not responsive, cannot be localized easily).

## Decision 3: Bento Grid Layout
- **Decision**: CSS Grid with `col-span` utilities based on Tailwind.
- **Rationale**: Extremely lightweight, natively responsive, and perfectly matches modern SaaS trends (Linear, Stripe).
- **Alternatives**: Flexbox (harder to manage asymmetrical 2D layouts).

## Decision 4: Translation Data Strategy
- **Decision**: Keep the structural product list in a TS file, but map the title/description strings directly to `next-intl` keys.
- **Rationale**: Ensures the presentation layer handles localization natively without complex data fetching.
