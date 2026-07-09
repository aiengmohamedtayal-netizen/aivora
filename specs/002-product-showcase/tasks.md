# Implementation Tasks: Product Showcase

## Phase 1: Data Model & Setup
- [x] 1.1 Create `showcase-data.ts` exporting the mock data structures for the products.
- [x] 1.2 Update `en.json` and `ar.json` with all corresponding title, description, and feature keys for the 7 products.

## Phase 2: Primitive UI Components
- [x] 2.1 Build `<MacWindow />` wrapper component using Tailwind CSS for glassmorphism and absolute dots.
- [x] 2.2 Build `<BentoGrid />` and `<BentoItem />` layout components with configurable span utilities.

## Phase 3: Interactive Visualizations
- [x] 3.1 Implement `<CRMVisualization />` inside a MacWindow to simulate a dashboard UI.
- [x] 3.2 Implement `<AssistantVisualization />` inside a MacWindow to simulate the chat interface.

## Phase 4: Core Layout & Storytelling
- [x] 4.1 Build `<StickyScroll />` component using Framer Motion `useScroll` and `useTransform` to bind text sections to visual cross-fades.
- [x] 4.2 Assemble `<ProductShowcase />` combining the StickyScroll and the BentoGrid into one coherent section.

## Phase 5: Assembly & Polish
- [x] 5.1 Integrate `<ProductShowcase />` into the Home Page (`page.tsx`) immediately following the Hero.
- [x] 5.2 Test and refine responsive breakpoints (converting StickyScroll to a vertical stack on mobile).
- [x] 5.3 Test RTL layouts in Arabic to ensure mirror transitions and grid flips.

## Phase 6: Polish & QA
- [x] 6.1 Refine Visual Polish (spacing, typography, glassmorphism, hover/focus states).
- [x] 6.2 Motion Polish (fine-tune framer-motion timings, remove unnecessary animations).
- [x] 6.3 Accessibility & Performance (verify semantic HTML, lazy loading where needed, keyboard focus).
- [x] 6.4 Final Regression (Run `type-check`, `lint`, and `build` and ensure zero errors).
