# Implementation Plan: Services / Capabilities

**Feature Branch**: `[003-services-capabilities]`
**Feature Spec**: `[spec.md](file:///d:/Aivora/specs/003-services-capabilities/spec.md)`

## 1. Technical Context

- **Goal**: Build a premium Services / Capabilities section matching the quality of the Hero and Product Showcase.
- **Data Source**: localization files (`en.json`, `ar.json`).
- **Dependencies**: React, Next.js App Router, Framer Motion, Tailwind CSS, next-intl, Lucide React.
- **Constraints**: 
  - Do NOT modify unrelated files.
  - Preserve existing architecture.
  - Follow the project Constitution.
  - Reuse existing design tokens, animation primitives, typography system.
  - Respect RTL/LTR and Reduced Motion.
  - No placeholder UI, no lorem ipsum, no fake backend.

## 2. Constitution Check

- **CC-001**: Use `next-intl` for translations. (PASS)
- **CC-002**: UI must have native RTL support and pass WCAG AA. (PASS)
- **CC-003**: Reuse existing design tokens. (PASS)
- **CC-004**: Respect `prefers-reduced-motion` using `useReducedMotion`. (PASS)

## 3. Architecture & Data Model

### Data Model
Data for the services will be sourced from existing keys in `en.json` (`HomePage.services`). To ensure type safety and easy iteration, we will define a lightweight data model mapping localization keys and Lucide icons.
```typescript
// Type signature for ServiceItem
type ServiceItem = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  problemKey: string;
  solutionKey: string;
  benefitsKey: string;
  processKey: string;
  ctaKey: string;
  icon: LucideIcon;
  href: string;
};
```

### Component Tree
```text
SectionServices
└── ServiceCard (maps over services)
    ├── ServiceHeader (Icon + Title)
    ├── ServiceDescription (Description + Problem + Solution + Benefits + Process)
    └── ServiceCTA (Button linking to detailed capability/intake)
```

## 4. UX Decisions

- **Storytelling**: We will use an elegant grid layout or a stacked interactive list that highlights each service's problem, solution, and process.
- **Animations**: Subtle fade-ups and hover scales. We will use the existing `MacWindow` and `BentoGrid` or create a new `FeatureCard` using the same glassmorphism design tokens (`bg-white/5 border-white/10 backdrop-blur-md`).
- **Premium SaaS Look**: Inspiration from Linear/Vercel with micro-interactions and high-contrast typography.

## 5. Output Artifacts

- `d:\Aivora\frontend\src\components\sections\services\SectionServices.tsx`
- `d:\Aivora\frontend\src\components\sections\services\ServiceCard.tsx`
- `d:\Aivora\specs\003-services-capabilities\data-model.md`
- `d:\Aivora\specs\003-services-capabilities\tasks.md`
