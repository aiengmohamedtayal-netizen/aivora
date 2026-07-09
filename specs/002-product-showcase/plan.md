# Implementation Plan: Product Showcase

**Branch**: `[002-product-showcase]` | **Date**: 2026-07-09 | **Spec**: [spec.md](file:///d:/Aivora/specs/002-product-showcase/spec.md)

**Input**: Feature specification from `/specs/002-product-showcase/spec.md`

## Summary

Build a highly interactive, premium Product Showcase section highlighting Aivora's custom engineering capabilities (AI Assistant, CRM, Automation, etc.). The showcase will utilize a hybrid interaction pattern featuring sticky scroll storytelling, bento grids, and macOS-style mockups, translating interest into leads via primary and secondary CTAs.

## Technical Context

**Language/Version**: TypeScript (Strict), Next.js 15 (React 19)

**Primary Dependencies**: Framer Motion, Tailwind CSS v4, Lucide React, next-intl

**Storage**: N/A (Static Data with Localized Strings)

**Testing**: Lint, Type Check, Visual Verification

**Target Platform**: Web (Desktop & Mobile Responsive)

**Project Type**: Frontend Component Architecture

**Performance Goals**: 60 FPS scrolling, Lighthouse 95+, 0 CLS

**Constraints**: Must reuse existing design tokens, full RTL support, WCAG AA compliance.

**Scale/Scope**: ~5-7 new modular UI components, integrating localized JSON data.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Architecture**: Is it a feature-first architecture that enforces clean architecture, modular boundaries, and separation of concerns?
- [x] **Technology Stack**: Does the plan rely exclusively on the approved core stack (Next.js 15, React 19, Supabase, Tailwind v4, etc.)?
- [x] **Code Quality**: Does the plan support zero dead code, explicit typing, and strict TypeScript?
- [x] **Design System**: Are no new colors, spacing, or typography tokens invented? Does it reuse `ivora.md`/`cv.md` conventions?
- [x] **Performance**: Will this plan maintain Lighthouse >= 95 and prioritize Server Components and lazy loading?
- [x] **Accessibility**: Are WCAG AA standards, keyboard navigation, and semantic HTML explicitly planned for?
- [x] **Internationalization**: Is the UI fully translation-driven (English + Arabic) with native RTL support?
- [x] **Security**: Are inputs validated with Zod, secrets protected, and least-privilege principles applied?
- [x] **AI Integration**: Are AI features modular, model-agnostic, and centrally managed?
- [x] **Testing**: Is the architecture unit-test and integration-test friendly?

## Project Structure

### Documentation (this feature)

```text
specs/002-product-showcase/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   └── product-showcase/
│   │   │       ├── ProductShowcase.tsx
│   │   │       ├── StickyScroll.tsx
│   │   │       ├── BentoGrid.tsx
│   │   │       ├── MacWindow.tsx
│   │   │       └── ProductCards.tsx
│   ├── lib/
│   │   └── data/
│   │       └── showcase-data.ts
└── messages/
    ├── en.json
    └── ar.json
```

**Structure Decision**: A feature-centric folder inside `sections/product-showcase` keeps all sub-components encapsulated and prevents the `components/ui` folder from being polluted with highly specific layout components.
