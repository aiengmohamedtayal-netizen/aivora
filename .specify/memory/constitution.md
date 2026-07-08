<!--
Sync Impact Report:
- Version change: 1.0.0 (Initial Draft)
- Modified principles: Initialized based on user inputs
- Added sections: Core Principles (Product, Architecture, Technology Standards, Code Quality, UI & Design System, Performance, Accessibility, Internationalization, Security, AI Integration, Testing, Documentation)
- Removed sections: N/A
- Templates requiring updates:
  - ✅ `.specify/templates/plan-template.md` (Updated Constitution Gates)
  - ✅ `.specify/templates/spec-template.md` (Updated constraints)
  - ✅ `.specify/templates/tasks-template.md` (Updated polish tasks)
- Follow-up TODOs: Implement rule enforcement in CI/CD.
-->
# Aivora Platform Constitution

## Core Principles

### I. Product
- **Premium AI Engineering Company**: Output must reflect an enterprise-first quality standard.
- **Longevity**: Designed for long-term maintainability and scalability by default.
- **Developer Experience**: Must provide an excellent and seamless developer experience.

### II. Architecture
- **Feature-First Architecture**: Features encapsulate their own layers where appropriate.
- **Clean Architecture & SOLID**: Enforce strict separation of concerns, DRY, KISS, and YAGNI principles.
- **Domain-Driven Organization**: Modular boundaries built with reusable components centered around the domain.

### III. Technology Standards
- **Core Stack**: Next.js 15 App Router, React 19, TypeScript (strict), Vercel.
- **UI & 3D**: Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion, React Three Fiber, Drei.
- **Backend & Data**: Supabase, PostgreSQL, FastAPI.
- **Utilities**: Zod (for validation), next-intl (for internationalization).

### IV. Code Quality
- **Strict Guidelines**: Strict TypeScript, ESLint, and Prettier are mandatory.
- **Zero Tolerance**: Zero dead code and zero duplicated code.
- **Componentry**: Build small, reusable, explicitly typed components within a predictable folder structure.
- **Version Control**: Enforce conventional commits.

### V. UI & Design System
- **Single Source of Truth**: The referenced DESIGN documents (`ivora.md`, `cv.md`) dictate the visual SSOT.
- **No Invention**: Never invent colors, spacing, typography, or motion outside the defined design system.
- **Reusability**: Always reuse existing design tokens and UI patterns to preserve visual consistency across the entire platform.

### VI. Performance
- **Metrics**: Must achieve Lighthouse >= 95 and optimize Core Web Vitals.
- **Server Components**: Prefer Server Components by default.
- **Optimizations**: Implement lazy loading where appropriate, route-level code splitting, image optimization, and font optimization with strict bundle size awareness.

### VII. Accessibility
- **Standards**: WCAG AA minimum compliance.
- **Usability**: Full keyboard navigation, screen reader compatibility, proper semantic HTML, focus visibility, and reduced motion support.

### VIII. Internationalization
- **Languages**: English and Arabic.
- **RTL Support**: Native RTL support must be built-in.
- **Text Management**: No hardcoded text; must use translation-driven UI exclusively.

### IX. Security
- **Data Validation**: Validate all inputs using Zod.
- **Access & Privacy**: Secrets never exposed, secure authentication, and principle of least privilege applied.
- **Mindset**: Security-first development.

### X. AI Integration
- **Modularity**: AI features must be modular and AI providers must be replaceable.
- **Prompt Management**: Centralized prompt management required.
- **Agnostic Logic**: Never hardcode model-specific logic; prepare architecture for future AI expansion.

### XI. Testing
- **Testability**: Unit-test friendly architecture, integration-test friendly APIs, and components designed for testability from the ground up.

### XII. Documentation
- **Decision Tracking**: Every architectural decision must be documented using Architecture Decision Records (ADRs).
- **Synchronization**: Keep documentation synchronized with the underlying implementation.

## Engineering Rules & Quality Gates

The following mandatory engineering rules and non-negotiable standards govern every future implementation:
- **Design Adherence Gate**: Any pull request that introduces new unapproved design tokens (colors, spacing) will be rejected.
- **Performance Gate**: CI/CD must fail if Lighthouse scores drop below 95 or if new severe bundle bloat is introduced.
- **Accessibility Gate**: Code changes must pass automated WCAG AA accessibility tests and screen reader checks.
- **Type Safety & Linting Gate**: Must pass strict TypeScript compilation and 100% adherence to ESLint and Prettier rules.
- **Testing Gate**: Code must not be merged without accompanying unit or integration tests that prove the functionality and architecture guidelines.
- **Internationalization Gate**: All user-facing strings must utilize `next-intl` translation keys.

## Governance

- **Supremacy**: This constitution supersedes all other practices and documentation.
- **Amendments**: Amendments require a formal PR, documented justification in an ADR, and approval from the core architecture team.
- **Compliance**: All PRs and architectural reviews must verify compliance with this constitution before approval.

**Version**: 1.0.0 | **Ratified**: 2026-07-08 | **Last Amended**: 2026-07-08
