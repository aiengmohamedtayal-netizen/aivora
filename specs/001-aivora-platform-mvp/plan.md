# Implementation Plan: Aivora Platform MVP

**Branch**: `001-aivora-platform-mvp` | **Date**: 2026-07-08 | **Spec**: [spec.md](file:///D:/Aivora/specs/001-aivora-platform-mvp/spec.md)

**Input**: Feature specification from `/specs/001-aivora-platform-mvp/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary
The implementation plan for the Aivora platform MVP coordinates the deployment of a high-performance Next.js 15 (React 19) frontend coupled with a FastAPI backend microservice and Supabase database. The blueprint maps out the execution from core foundation configurations to the premium narrative sections and dynamic AI sandbox elements, adhering strictly to the repository's Engineering Constitution.

## Technical Context

**Language/Version**: TypeScript (Strict), Node.js (v22+), Python (3.12+ for FastAPI)

**Primary Dependencies**: Next.js 15, React 19, Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion, React Three Fiber, Drei, FastAPI, Zod, next-intl, Resend

**Storage**: PostgreSQL (via Supabase)

**Testing**: Vitest (for Next.js unit/integration), Pytest (for FastAPI unit/integration), Playwright (for E2E and Accessibility audits)

**Target Platform**: Vercel (Next.js frontend), AWS App Runner or Dockerized VPS (FastAPI backend), Supabase (database/auth)

**Project Type**: Full-Stack Web Application + Backend Microservice

**Performance Goals**: Lighthouse >= 95, Core Web Vitals optimized, R3F frame rate stable at 60 FPS

**Constraints**: Strict type checks, WCAG AA compliance, English + Arabic localization, zero dead/duplicated code

**Scale/Scope**: 5 pages, 25 homepage sections, 2 languages, 2 interactive AI sandboxes

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
specs/001-aivora-platform-mvp/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── contracts/           # Phase 1 output (/speckit-plan command)
    ├── api_contract.md
    └── ui_contract.md
```

### Source Code (repository root)

```text
backend/           # FastAPI microservice
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       └── router.py
│   ├── core/      # configs, prompt templates
│   │   ├── config.py
│   │   └── prompts.py
│   ├── schemas/   # Pydantic models for validation
│   │   └── schema.py
│   ├── services/  # AI and vision services
│   │   ├── ai_service.py
│   │   └── vision_service.py
│   └── main.py
├── tests/
│   └── test_api.py
├── Dockerfile
└── requirements.txt

frontend/          # Next.js frontend
├── messages/      # translation JSON maps
│   ├── en.json
│   └── ar.json
├── src/
│   ├── app/       # App Router locale layouts
│   │   └── [locale]/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── about/
│   │       ├── services/
│   │       ├── case-studies/
│   │       └── contact/
│   ├── components/
│   │   ├── layout/  # Navigation, Header, Footer
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/ # Homepage narrative sections (1-25)
│   │   └── ui/    # Reusable atomic elements (Button, Input, Card)
│   ├── lib/       # motion configs, Supabase client
│   │   ├── motion.ts
│   │   └── supabase.ts
│   └── styles/
├── tests/
│   ├── accessibility/
│   └── integration/
├── tailwind.config.ts
└── next.config.js
```

**Structure Decision**: Option 2: Web application (Next.js frontend + FastAPI backend). This allows the frontend to stay fast and edge-deployed on Vercel while isolating heavy AI logic in a Python container.

## Complexity Tracking

*No constitution violations present. All architectural decisions strictly align with constitution standards.*

---

## Planning Principles
- **Rigor-First**: Do not write layout components until the shared UI foundations (primitives, design tokens, configurations) exist.
- **Milestone Stability**: Every phase must result in a buildable codebase that passes all linting, type checks, and test gates.
- **Dependency Flow**: Foundation configuration $\rightarrow$ Design system tokens $\rightarrow$ Component primitives $\rightarrow$ Layout/Shell $\rightarrow$ Pages $\rightarrow$ AI/Integrations $\rightarrow$ Polish.

---

## Implementation Phases

### Phase 0: Project Foundation
- **Objectives**: Initialize Next.js and FastAPI environments with unified layout settings.
- **Deliverables**: Base configurations (`tsconfig.json`, `package.json`, `requirements.txt`, linter rules).
- **Dependencies**: None.
- **Risks**: Version mismatch between Next.js 15 and Tailwind v4. Resolved by following official migration templates.
- **Validation**: Build succeeds; linting checks pass with zero errors.
- **Exit Criteria**: Configs merged; lockfiles generated.

### Phase 1: Core Architecture
- **Objectives**: Setup App Router locale structure (`/[locale]/`) and FastAPI router groups.
- **Deliverables**: Locale middleware, layout file configurations, FastAPI base app startup.
- **Dependencies**: Phase 0.
- **Risks**: Edge routing configuration issues on locale redirects.
- **Validation**: Routing tests match `/en` and `/ar` correctly.
- **Exit Criteria**: Root paths configured to redirect to active locale default.

### Phase 2: Design System Integration
- **Objectives**: Implement design tokens from `desi.md`/`ivora.md` into Tailwind configs.
- **Deliverables**: CSS variables mapping, Tailwind theme configurations.
- **Dependencies**: Phase 1.
- **Risks**: Token collisions between legacy design systems.
- **Validation**: Visual theme token verification passes.
- **Exit Criteria**: No hardcoded color/spacing overrides exist in global files.

### Phase 3: Application Shell
- **Objectives**: Construct layout shell elements (Navbar, Footer).
- **Deliverables**: Reusable layout container, sticky header navigation with blur effects, semantic footer.
- **Dependencies**: Phase 2.
- **Risks**: Layout shifts during font loading.
- **Validation**: Zero CLS during header navigation renders.
- **Exit Criteria**: Desktop and mobile navigation layouts functional.

### Phase 4: Internationalization (i18n)
- **Objectives**: Configure `next-intl` translation maps and RTL logical properties.
- **Deliverables**: Message JSON files, layout logical alignment hooks (`dir="rtl"`).
- **Dependencies**: Phase 3.
- **Risks**: Missing translations causing runtime display text keys.
- **Validation**: Zero hardcoded strings remain in layouts.
- **Exit Criteria**: 100% text coverage in translations.

### Phase 5: Homepage Narrative Structure
- **Objectives**: Scaffold the structural containers for the 25 narrative sections.
- **Deliverables**: 25 skeleton page blocks aligned in the specified story sequence.
- **Dependencies**: Phase 4.
- **Risks**: Section stacking causing paint blockage.
- **Validation**: Correct sequential layout matches sitemap spec.
- **Exit Criteria**: Scroll container loads all placeholders without crash.

### Phase 6: Services Layout
- **Objectives**: Implement Services page and service detail cards.
- **Deliverables**: Service grids, hover effect cards.
- **Dependencies**: Phase 5.
- **Risks**: Content layout breaking on small screens.
- **Validation**: Card grid passes 320px responsive tests.
- **Exit Criteria**: Services page behaves responsively.

### Phase 7: Case Studies Layout
- **Objectives**: Implement Case Studies grid and narrative technical articles.
- **Deliverables**: Technical case study templates, dynamic category filters.
- **Dependencies**: Phase 6.
- **Risks**: Image aspect-ratio layout shifts.
- **Validation**: Zero layout shifts on case study category changes.
- **Exit Criteria**: Filter routes resolve on URL query parameters.

### Phase 8: About Page Layout
- **Objectives**: Construct narrative-driven About page.
- **Deliverables**: Serif quote grids, team bio layout elements.
- **Dependencies**: Phase 7.
- **Risks**: Heavy typography blocking font load cycles.
- **Validation**: FOUT (Flash of Unstyled Text) minimized via preloading.
- **Exit Criteria**: Font configurations load serifs instantly.

### Phase 9: Contact Form Portal
- **Objectives**: Implement contact form with Zod schema verification.
- **Deliverables**: Form components, field validators.
- **Dependencies**: Phase 8.
- **Risks**: Spam submissions without recaptcha/rate limiting.
- **Validation**: Form submits fail on incorrect schema data formats.
- **Exit Criteria**: Valid form triggers database submission handlers.

### Phase 10: AI Showcase Terminal
- **Objectives**: Build interactive sandbox chatbot.
- **Deliverables**: Live terminal mock client, input validation filters.
- **Dependencies**: Phase 9.
- **Risks**: High API execution lag.
- **Validation**: Terminal prints streaming tokens within 100ms of payload dispatch.
- **Exit Criteria**: Chatbot operates correctly inside client canvas.

### Phase 11: Headless CMS Integration
- **Objectives**: Bind Supabase content queries.
- **Deliverables**: Supabase clients, ISR/SSG page bindings.
- **Dependencies**: Phase 10.
- **Risks**: Cross-tenant data leaks.
- **Validation**: RLS policies restrict all non-public content updates.
- **Exit Criteria**: All data queries pass through active client instances.

### Phase 12: Backend AI Service Integration
- **Objectives**: Integrate Next.js with FastAPI AI microservice.
- **Deliverables**: Proxy API routing, FastAPI prompt routers.
- **Dependencies**: Phase 11.
- **Risks**: OpenAI API timeouts.
- **Validation**: FastAPI service handles model failure gracefully with fallback outputs.
- **Exit Criteria**: Microservice container resolves Next.js API payloads.

### Phase 13: Performance Optimization
- **Objectives**: Optimize bundle sizes and load speed metrics.
- **Deliverables**: Dynamic dynamic imports, lazy loading R3F canvases.
- **Dependencies**: Phase 12.
- **Risks**: Frame rate drops during animation scroll events.
- **Validation**: Performance score >= 95 in Lighthouse test environments.
- **Exit Criteria**: All massive assets defer load cycle.

### Phase 14: Accessibility Compliance
- **Objectives**: Audit WCAG AA standards.
- **Deliverables**: Accessible color contrast, keyboard tab indexing overlays.
- **Dependencies**: Phase 13.
- **Risks**: Screen readers missing dynamic terminal message streams.
- **Validation**: Automated axe-core tests yield 0 violations.
- **Exit Criteria**: Keyboard traversal navigates every route.

### Phase 15: SEO Optimization
- **Objectives**: Setup dynamic metadata hooks and search schemas.
- **Deliverables**: Sitemap generators, robots config, structured JSON-LD schemas.
- **Dependencies**: Phase 14.
- **Risks**: Indexed locale duplicate page warnings.
- **Validation**: Meta elements render language tags correctly.
- **Exit Criteria**: Dynamic sitemaps resolve XML.

### Phase 16: Analytics Integration
- **Objectives**: Configure event tracking modules.
- **Deliverables**: Vercel web analytics bindings, event trackers on contact forms and locale switch.
- **Dependencies**: Phase 15.
- **Risks**: Script loads blocking initial content paint.
- **Validation**: Analytics scripts defer load cycle until interactive state.
- **Exit Criteria**: Analytics fire on click conversion events.

### Phase 17: Testing Loop
- **Objectives**: Complete end-to-end integration and contract test loops.
- **Deliverables**: Playwright E2E suites, contract schema verification tests.
- **Dependencies**: Phase 16.
- **Risks**: Mock service responses drift from live Supabase API structures.
- **Validation**: Test coverage verifies successful route navigation.
- **Exit Criteria**: All tests report pass status.

### Phase 18: Production Deployment
- **Objectives**: Deploy system to Vercel and container environment.
- **Deliverables**: Production build outputs, docker registry configs.
- **Dependencies**: Phase 17.
- **Risks**: Deployment env secrets mismatch.
- **Validation**: Live staging domain resolves all pages.
- **Exit Criteria**: Deployment goes live; build hooks configured.

---

## Architecture Planning

### Folder Structure
Strict modular layout based on option 2 (Web application). Client UI logic isolated in `frontend/`, heavy AI services isolated in `backend/` FastAPI.

### Feature Boundaries
Features (Services, Case Studies, AI sandbox) maintain clean boundary setups. Shared components (`/components/ui/`) must not import components from specific page route directories.

### Shared UI Architecture
Atomic components exist in `src/components/ui/` (Button, Input, Card). These elements are stateless primitives, configurable via props and wrapped inside standard `cn()` utilities.

### Design Token Architecture
Tokens from `desi.md`/`ivora.md` map to Tailwind utility styles via CSS variables inside the global stylesheet. Colors, typography scales, radii, and shadow sizes are strictly governed by this mapping.

### Component Hierarchy
```
Page Layout (RSC)
└── Page Shell / Layout (RSC)
    ├── Navbar (Client)
    ├── Narrative Sections (RSC/Client Mix)
    └── Footer (RSC)
```

### State Management
URL parameters store active filtering and pagination states. Zustand manages light, client-side states (active theme, chatbot history context).

### Server vs. Client Components
Server components by default for layouts, pages, and markdown content blocks. Client components isolated strictly to leaf nodes (forms, interactive terminal, custom R3F canvases).

### Data Fetching Strategy
Next.js Server Actions fetch dynamic data directly from Supabase. Next.js Route Handlers proxy heavier AI interactions to the FastAPI backend.

### Caching Strategy
Static content pages (Services, Case Studies) render as Incremental Static Regeneration (ISR) with a revalidation cycle of 24 hours.

### Error Handling
App Router `error.tsx` catches runtime page exceptions. Zod handles input validations, throwing type-safe validation payload errors to form controllers.

### Loading Strategy
Dynamic imports load the R3F Canvas and 3D particles. Skeleton components render in placeholder slots during load.

### Route Architecture
i18n middleware routes locale parameters dynamically. Sub-routes map clean paths for content slugs.

### API Architecture
FastAPI handles AI generation routes. CORS limits FastAPI access strictly to Next.js API requests.

### Supabase Integration
Client instances utilize environment configuration variables. RLS policies protect database records from non-authorized client writes.

### FastAPI Integration
Communicates via HTTP payloads over private networks. Exposes OpenAPI schemas.

### AI Service Abstraction
FastAPI abstracts AI model providers behind unified services, ensuring easy LLM provider swaps without modifying frontend UI endpoints.

### Prompt Management
Prompts are isolated in the FastAPI backend as text templates. Version control tracks prompt modifications independently.

---

## UI Planning
- **Navigation**: Desktop uses sticky glassmorphism headers; mobile uses full-screen Radix-based overlays.
- **Layout**: Flexible css grids with standard margins.
- **Editorial Homepage**: Asymmetric section layouts using bold Lora serif headlines.
- **Storytelling Sections**: Staggered content layouts using GSAP scroll triggers.
- **Animation Architecture**: GPU translation vectors to optimize rendering performance.
- **Motion Library**: Framer Motion controls component transitions; GSAP handles scroll-aligned animations.
- **3D Strategy**: R3F elements load asynchronously in suspended canvas wrappers.
- **Dark Mode**: Configured via class selector maps.
- **RTL**: Handled by logical properties and locale text direction mapping.

---

## Performance Planning
- **Streaming**: React Suspense streams in complex sections (AI terminal, Case Study details) independently.
- **Image Optimization**: Custom next/image components enforce modern layout formats.
- **Bundle Splitting**: Defer R3F and GSAP loading until users scroll to targeted blocks.
- **Font Loading**: Standard Google Font weights preload statically.

---

## Quality Gates
- **Duplication**: Zero component duplication. Standard ui components must be extracted to `src/components/ui/`.
- **Accessibility**: CI pipeline runs axe-core tests. Build fails if accessibility violations are detected.
- **Performance**: Vercel preview builds run Lighthouse checks. Pull requests reject if performance scores drop below 95.
- **Hydration**: Hydration error checks run in development environments.
- **Tokens**: ESLint checks prevent raw HEX values in styling files.
