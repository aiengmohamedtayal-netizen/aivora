# Feature Specification: Aivora Platform MVP

**Feature Branch**: `[001-aivora-platform-mvp]`
**Created**: 2026-07-08
**Status**: Draft

## Executive Summary
Aivora is a premium AI engineering company delivering enterprise software, AI systems, automation platforms, SaaS products, and cloud solutions. The official Aivora platform MVP serves as a digital headquarters that acts as both a B2B agency portfolio and a high-performance interactive SaaS experience. By merging professional B2B aesthetics with 3D/Motion elements and functional AI demos, the platform establishes immediate trust, proves engineering excellence, and generates highly qualified leads.

## Vision
To build an immersive, enterprise-grade digital experience that proves Aivora’s technical supremacy through its very execution—where the medium is the message. The platform must feel like an advanced operating system while maintaining the accessibility and clarity of an elite consulting agency.

## Goals
- Generate qualified leads from enterprise clients, CTOs, and founders.
- Demonstrate engineering excellence (Performance >= 95 Lighthouse, WCAG AA Accessibility).
- Showcase practical AI capabilities via interactive demos.
- Build immediate trust through a premium, polished design language.
- Establish the foundational architecture for long-term platform expansion (CMS, Authentication, AI microservices).

## Non-Goals (MVP Scope)
- Building custom, proprietary AI models (reliance will be on APIs like OpenAI).
- Implementing complex e-commerce, billing, or automated payment gateways.
- Releasing a fully featured custom CMS interface (Supabase will act as the headless CMS initially).
- Developing a dedicated mobile application (PWA/Responsive Web only).

## Problem Statement
B2B software and AI agencies often suffer from a "credibility gap" where their websites are static, generic, and fail to demonstrate the complex engineering capabilities they sell. Prospective enterprise clients lack a tangible way to experience the agency’s expertise before booking a consultation.

## Personas
1. **Startup Founder (SaaS):** Needs a reliable, highly skilled technical partner to build or scale their product rapidly. Values modern tech stacks and speed to market.
2. **CTO / Enterprise Decision Maker:** Seeks to automate processes or integrate AI into existing systems. Values security, scalability, solid architecture, and quantifiable case studies.
3. **Marketing/Partnership Director:** Interested in thought leadership (blog), case studies, and brand reputation. Values design, accessibility, and clear messaging.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive AI Engagement to Lead Generation (Priority: P1)
A prospective enterprise client visits the home page, interacts with an AI showcase (e.g., a chatbot or computer vision demo), is impressed by the instantaneous response and smooth UI, and proceeds to book a consultation.
**Why this priority**: Directly tied to the primary goal of generating qualified leads through demonstrated capability.
**Independent Test**: Can be tested by navigating to the home page, interacting with the AI component, and successfully submitting the contact/scheduling form.
**Acceptance Scenarios**:
1. **Given** the user is on the Home page, **When** they interact with the AI Chatbot demo, **Then** they receive an accurate, streaming response within 1 second.
2. **Given** the user is impressed, **When** they click "Book Consultation", **Then** they are routed to the Contact page and can submit their details.

### User Story 2 - Multilingual Portfolio Browsing (Priority: P1)
An Arabic-speaking executive visits the Case Studies page to evaluate past work, switches the language to Arabic, and reads the technical breakdown in a native RTL layout without any visual breakage.
**Why this priority**: Proves the platform's commitment to localization and the Middle Eastern market, a core demographic requirement.
**Independent Test**: Navigate to the Case Studies page, toggle language to Arabic, verify content translates, and layout mirrors to RTL seamlessly.
**Acceptance Scenarios**:
1. **Given** the site is in English (LTR), **When** the user toggles the language to Arabic, **Then** the UI instantly switches to RTL, fonts update to the Arabic system font, and text is translated.

### User Story 3 - CMS Content Consumption (Priority: P2)
A user navigates to the blog or a specific service page to learn about Aivora's capabilities, utilizing dynamic filtering to find articles relevant to "AI Automation".
**Why this priority**: Essential for SEO, thought leadership, and organic traffic generation.
**Independent Test**: Navigate to the Blog/Services, apply a category filter, and verify the displayed list updates correctly.
**Acceptance Scenarios**:
1. **Given** the user is on the Services index, **When** they select the "Cloud Solutions" filter, **Then** only cloud-related services/case studies are displayed.

## Functional Requirements
- **FR-001**: The system MUST support dynamic internationalization (English/LTR and Arabic/RTL) with URL-based locale routing (`/en/`, `/ar/`).
- **FR-002**: The system MUST provide an interactive AI Chatbot demo restricted to Aivora's context (system prompt shielding).
- **FR-003**: The system MUST include a dynamic Contact Form that saves lead data to the database and dispatches a notification email.
- **FR-004**: The system MUST fetch and display dynamic content (Case Studies, Services) from a headless CMS backend.
- **FR-005**: The system MUST support responsive layouts across mobile, tablet, and desktop viewports.

### Constitution Constraints *(mandatory)*
- **CC-001**: All user-facing text MUST be translation-ready using `next-intl`.
- **CC-002**: UI MUST have native RTL support and pass WCAG AA accessibility tests.
- **CC-003**: All inputs MUST be validated with Zod.
- **CC-004**: System MUST reuse existing design tokens from `ivora.md`, `cv.md`, `desi.md`. No new colors/typography.
- **CC-005**: AI Logic MUST NOT hardcode model providers and MUST use centralized prompt management.

## Non-Functional Requirements
- **NFR-001**: Page loads must achieve a Lighthouse Performance score of >= 95.
- **NFR-002**: First Input Delay (FID) and Cumulative Layout Shift (CLS) must meet Core Web Vitals "Good" thresholds.
- **NFR-003**: 3D elements and heavy animations MUST gracefully degrade or disable if the user's OS prefers reduced motion or on low-power mobile devices.
- **NFR-004**: The API rate limiting must prevent abuse of the AI demonstration endpoints.

## Information Architecture & Navigation Structure
- **Global Header**: Logo, Navigation Links (Services, Case Studies, About), Language Toggle (EN/AR), Primary CTA ("Contact Us").
- **Global Footer**: Links, Socials, Legal, Newsletter Signup.

## Sitemap
- `/` (Home)
- `/services` (Services Index)
  - `/services/[slug]` (Individual Service)
- `/case-studies` (Case Studies Index)
  - `/case-studies/[slug]` (Individual Case Study)
- `/about` (About Aivora)
- `/contact` (Contact / Lead Form)

## User Flows
1. **Lead Generation Flow**: Landing Page -> Engage with AI/3D Hero -> View Key Services -> Click CTA -> Complete Contact Form -> Success Page/Toast.
2. **Evaluation Flow**: Landing Page -> Navigate to Case Studies -> Filter by Industry -> Read Case Study Detail -> Click CTA -> Contact Form.

## Page Specifications
- **Home**: Parallax 3D hero section, trust badges, AI interactive demo block, brief services overview, animated staggered feature cards.
- **Services**: Grid layout of service offerings with high-end glassmorphism cards and hover effects.
- **Case Studies**: Filterable masonry or grid list of past projects. Detail pages contain deep technical breakdowns, architectures, and metrics.
- **About**: Narrative-driven page using editorial serif typography (`Lora`/`Newsreader`), detailing the company mission, vision, and team.
- **Contact**: Split-screen layout. Left side contains dynamic blobs or 3D elements and contact info; right side contains a highly polished Zod-validated form.

## Content Strategy
- **Tone**: Professional, authoritative, technically precise, yet accessible.
- **Assets**: Use optimized GLTF/GLB models for 3D elements. Use SVG for all iconography (Lucide).
- **Structure**: Markdown-based content for Case Studies and Blog posts stored in Supabase.

## SEO Requirements
- Metadata (Title, Description, OpenGraph, Twitter Cards) MUST be dynamically generated per page.
- Semantic HTML tags (`<main>`, `<article>`, `<nav>`, `<h1>` to `<h6>` strictly ordered) must be used.
- Include `hreflang` tags for English and Arabic variants.
- Generate dynamic `sitemap.xml` and `robots.txt`.

## Accessibility Requirements
- Strict adherence to WCAG AA guidelines.
- Focus rings MUST be visible for all interactive elements via keyboard navigation.
- Minimum color contrast ratio of 4.5:1 for standard text.
- `aria-labels` on all icon-only buttons and dynamic interactive elements.
- `prefers-reduced-motion` media queries must disable GSAP/Framer Motion and 3D Canvas updates.

## Localization Strategy
- Implement `next-intl` for App Router.
- All static strings stored in `messages/en.json` and `messages/ar.json`.
- CSS logical properties (`ps-4`, `me-2`) used exclusively over physical margins/paddings.
- Typography swaps based on locale (e.g., `Inter`/`Lora` for EN, `Tajawal`/`Thmanyah` for AR).

## Security Requirements
- Supabase Row Level Security (RLS) enabled on all tables.
- API endpoints protected by Rate Limiting (e.g., Upstash).
- No API keys exposed to the client bundle.
- Zod schema validation applied on both the client (form) and the server (Route Handlers/FastAPI).

## Performance Requirements
- React Server Components (RSC) utilized by default. Client components (`'use client'`) isolated to leaves of the tree.
- Next.js Image component for all raster graphics.
- React Three Fiber `<Suspense>` boundaries to prevent blocking the main thread during asset loading.

## Data Model (Supabase Requirements)
- **Leads**: `id`, `name`, `email`, `company`, `message`, `status`, `created_at`.
- **Services**: `id`, `slug`, `title_en`, `title_ar`, `desc_en`, `desc_ar`, `icon`.
- **CaseStudies**: `id`, `slug`, `title_en`, `title_ar`, `content_en`, `content_ar`, `metrics`, `tech_stack`.
- **Categories**: `id`, `slug`, `name_en`, `name_ar`.

## FastAPI Responsibilities
- Serve as a microservice behind the Next.js API route.
- Handle heavy AI operations (e.g., orchestrating calls to OpenAI, managing the prompt chain, filtering outputs).
- Process computer vision tasks if applicable to the demo.
- Expose structured, type-safe JSON endpoints.

## AI Integration Strategy
- **Modularity**: The Next.js frontend calls its own Route Handlers, which proxy to the FastAPI microservice.
- **Prompt Management**: System prompts and constraints are managed via environment variables or a secure configuration layer in the FastAPI backend, never in the frontend.
- **Safety**: Inputs sanitized; outputs passed through a guardrail to prevent hallucinations or out-of-scope answers.

## CMS Strategy
- **Headless**: Supabase acts as the primary data store.
- **MVP Management**: Data is managed via the Supabase Studio dashboard directly.
- **Future Proofing**: The API surface (fetch calls) is abstracted so a custom admin dashboard can be seamlessly layered on later.

## Analytics Requirements
- Integration ready for standard tracking (e.g., Vercel Web Analytics, Google Analytics, or PostHog).
- Track key conversion events: AI Demo interactions, Form Submissions, Locale Toggles.
- Fully compliant with GDPR/Cookie consent.

## Risks
- **Performance Budget vs. 3D Elements**: High-fidelity 3D and heavy Framer Motion animations may compromise Lighthouse scores on mid-tier devices.
- **Hydration Mismatches**: i18n routing and Dark Mode toggles often cause React hydration errors if not carefully managed at the layout level.

## Constraints
- Must deploy Frontend exclusively to Vercel to utilize App Router Edge features.
- Backend FastAPI must be containerized (Docker) for separate hosting.

## Assumptions
- External APIs (Supabase, OpenAI) have sufficient quota and SLA for production.
- UI/UX layout references from the provided design documents (`ivora.md`, `desi.md`, `desi2.md`, `cv.md`) are the undisputed visual truth.

--------------------------------------------------
## 1. Brand Narrative
--------------------------------------------------
Aivora exists to bridge the gap between speculative AI potential and production-grade engineering realities. We do not build toys; we build systems.

- **Brand Mission**: To deliver deterministic, world-class software and intelligent automation that solves high-impact enterprise challenges.
- **Brand Vision**: A future where AI systems are as stable, predictable, and highly engineered as aerospace systems.
- **Brand Promise**: Zero-compromise execution. If it is built by Aivora, it runs efficiently, scales indefinitely, and delivers tangible business output.
- **Core Values**:
  - *Engineering Rigor*: We respect protocols, strict typing, and mathematically grounded UI design.
  - *Deterministic Quality*: We replace marketing hand-waving with verifiable code performance.
  - *Radical Transparency*: We write clear documentation, build open APIs, and avoid hype.
- **Brand Personality**: Calm, confident, technically elite, and mature. comparable to Stripe, Vercel, and Linear.
- **Communication Style**: Assertive yet understated. We speak in the active voice, prioritizing direct truths over marketing adjectives.
- **Emotional Positioning**: Stability and capability. When a CTO works with Aivora, they feel the reassurance of absolute engineering control.

--------------------------------------------------
## 2. Experience Goals
--------------------------------------------------
As visitors navigate the Aivora platform, the layout, typography, performance, and interaction rhythm must provoke a series of distinct psychological transitions:
- **Trust**: Instilled by sub-100ms response times, visible WCAG AA accessibility outlines, and clear documentation.
- **Curiosity**: Sparked by interactive visual structures (3D Canvas components and live AI terminals) that invite engagement.
- **Confidence**: Reinforced by deeply detailed technical case studies explaining architecture decisions.
- **Technical Excellence**: Experienced through fluid, GPU-accelerated motion profiles and strict responsive discipline.
- **Innovation**: Realized through actual, embedded sandbox tools, demonstrating functional AI workflows rather than static screenshots.
- **Premium Quality**: Communicated via custom typography combinations, micro-borders, and tailored design token variables.
- **Long-term Partnership**: Projected by a platform layout that values the reader's time and intellect, treating them as technical peers.

--------------------------------------------------
## 3. Editorial Philosophy
--------------------------------------------------
The platform rejects standard SaaS templates (such as centered icon-grids and generic hero illustrations). Instead, it adopts a digital-magazine layout prioritizing high-contrast typographic focus, asymmetric whitespace, and editorial pacing.
- **Storytelling & Pacing**: Information is structured as a series of chapters. A dense data-grid is preceded by a generous typographic quote, allowing the reader's eyes to transition from macro-narratives to technical specifics.
- **Visual Rhythm & Reading Flow**: We alternate between high-impact full-bleed viewports and high-density, double-column technical logs. The layout enforces an alternating LTR/RTL structural balance.
- **Section Transitions**: Transitions utilize Lerp-smoothed scrolling (Lenis) and GPU-backed translations. Sections do not simply clip; they dissolve, slide, or morph on scroll using GSAP timelines.
- **Hierarchy & Typographic Emphasis**: Headings use a high-contrast serif font (`Lora` / `Newsreader`) to command attention. Technical labels and data tables use strict monospaced typefaces (`Geist Mono`), framing details like raw system readouts.
- **Premium Whitespace**: Gaps between major modules use significant vertical whitespace (`py-24 lg:py-32`) to communicate sophistication and spatial maturity.

--------------------------------------------------
## 4. Homepage Narrative Flow
--------------------------------------------------
The homepage follows a progressive, psychologically structured narrative journey:

```
[ Attention ]
     ↓
 [ Future ]
     ↓
 [ Problem ]
     ↓
[ Engineering ]
     ↓
[ Capabilities]
     ↓
[ Technology ]
     ↓
    [ AI ]
     ↓
  [ Process ]
     ↓
   [ Trust ]
     ↓
  [ Results ]
     ↓
[ Conversion ]
```

1. **Attention**: Hook the user instantly using an atmospheric 3D viewport.
   * *Visitor Mindset*: "Is this another generic agency?"
   * *Expected Outcome*: Fascination and validation of premium quality.
2. **Future**: Present Aivora's vision of the engineering landscape.
   * *Visitor Mindset*: "What is their perspective on technical trajectory?"
   * *Expected Outcome*: Intellectual alignment.
3. **Problem**: Articulate the fragility and failure modes of typical AI implementations.
   * *Visitor Mindset*: "They understand my concerns about system fragility."
   * *Expected Outcome*: Relieved skepticism.
4. **Engineering Mindset**: Introduce Aivora's core engineering laws (the Constitution).
   * *Visitor Mindset*: "How do they work differently?"
   * *Expected Outcome*: Respect for our technical discipline.
5. **Capabilities**: Display our service layers in a clear, functional directory.
   * *Visitor Mindset*: "Can they build what I need?"
   * *Expected Outcome*: Confirmation of technical capabilities.
6. **Technology**: Show the precise stack we build on (Next.js, FastAPI, Supabase).
   * *Visitor Mindset*: "Is their stack modern and maintainable?"
   * *Expected Outcome*: Validation of stack choices.
7. **AI Showcase**: Provide a live, interactive, sandboxed AI demo.
   * *Visitor Mindset*: "Show me, don't tell me."
   * *Expected Outcome*: Direct proof of implementation skill.
8. **Process**: Walk through our deterministic development lifecycle.
   * *Visitor Mindset*: "What is the timeline risk?"
   * *Expected Outcome*: Reassurance of structured execution.
9. **Trust**: Display in-depth case studies with architectural diagrams.
   * *Visitor Mindset*: "Have they executed at scale?"
   * *Expected Outcome*: Elimination of risk doubts.
10. **Results**: Present raw performance metrics and client impact indicators.
    * *Visitor Mindset*: "What are the measurable returns?"
    * *Expected Outcome*: Business validation.
11. **Conversion**: Offer a direct, low-friction, progressive consultation booking.
    * *Visitor Mindset*: "I want to speak with their lead architect."
    * *Expected Outcome*: Highly qualified lead conversion.

--------------------------------------------------
## 5. Content Strategy
--------------------------------------------------
Aivora's copy must respect the intelligence of a technical buyer. We write for CTOs, product leaders, and visionary founders.
- **Headline Principles**: Focus on clear statements. Replace "Transformative AI Solutions" with "Deterministic AI Systems Designed for High-Throughput Environments."
- **Editorial Writing Style**: Lean, declarative, and prose-driven. Use Newsreader Serif for extended paragraphs, giving the text the weight of an academic journal.
- **Value-First & Minimal Marketing**: Every claim must be backed by a metric, stack choice, or architectural decision. Avoid words like "revolutionary," "groundbreaking," or "magical."
- **Human Language & Technical Credibility**: Balance high-level business value with raw technical descriptions. We talk about API payloads, database isolation, and latency profiles alongside ROI and system efficiency.
- **CTA Philosophy**: Avoid aggressive, repeated "Book a Call Now!" CTAs. Instead, place subtle, contextual links (e.g., *View Architecture*, *Read the Spec*, *Audit the Code*) that organically guide the user to the conversion scheduler.

--------------------------------------------------
## 6. Brand Voice
--------------------------------------------------
Writing on the Aivora platform must follow these strict guidelines:
- **Confident & Engineering-First**: We speak from a position of deep execution experience. "We construct robust APIs" instead of "We can help you build your API."
- **Minimal & Clear**: Keep sentences short. Eliminate fluff words.
- **Technical & Honest**: Frame capabilities clearly. If a demo has a 2-second cold-start latency due to model execution, document it openly as a technical label next to the input.
- **Tone Matrix**:
  - *Do*: "Next.js 15 App Router enforces strict server-side boundaries, reducing client-side payload sizes."
  - *Do Not*: "Experience the magic of Next.js 15, the revolutionary framework that makes websites lightning-fast!"

--------------------------------------------------
## 7. Conversion Strategy
--------------------------------------------------
We build a relationship through progressive value delivery rather than sales pressure:
- **Phase 1 (Immediate Proof)**: Visual fluidity and a functional AI terminal prove core development capabilities within 10 seconds of landing.
- **Phase 2 (Architectural Validation)**: Free access to our case study schematics and raw database structures proves operational integrity.
- **Phase 3 (Operational Confidence)**: Exposing our repository's Engineering Constitution builds alignment on quality control.
- **Phase 4 (Contextual Conversion)**: Offering the contact form and scheduler as a consultation with a "Systems Architect" rather than a sales representative. The conversion gate is a technical intake process, validating their scope and budget before a meeting is confirmed.

--------------------------------------------------
## 8. Design Philosophy
--------------------------------------------------
The platform design must feel like a premium, highly engineered system:
- **Calm & Calm UI**: Using a deep navy base (`#F8FAFC` light / `#0F172A` dark) with low-contrast borders. The color system restricts accents to surgical highlights (primary blue and gold).
- **Fast**: Every animation must feel snappy. Transitions operate on GPU coordinates (`translate3d`) and maintain a target frame rate of 60 FPS.
- **Highly Engineered**: Subtle visual indicators (like layout grid-lines, tiny coordinate readouts on hover, and active system status indicators) reinforce the engineering theme.

--------------------------------------------------
## 9. Story Framework
--------------------------------------------------
Every homepage section must conform to this operational framework to maintain narrative consistency:
- **Objective**: The strategic role of the section.
- **Narrative Role**: How it progresses the story.
- **Visual Role**: The design elements and layout pattern.
- **Interaction Role**: How the user physically engages with the section.
- **Business Goal**: The conversion or trust metric it supports.
- **Psychological Impact**: The visitor's internal realization.
- **Transition**: The visual hook guiding the eye to the next block.

--------------------------------------------------
## 10. Homepage Sections (Narrative-Driven)
--------------------------------------------------

### Section 1: The Opening Manifesto (Attention)
- **Purpose**: Establishes the company's elite positioning.
- **Key Message**: "We build software that runs without compromise."
- **Visual Direction**: Immersive full-screen layout. Large premium serif display title, crisp monospaced coordinates, and an atmospheric 3D canvas rendering a slowly rotating particle field.
- **Recommended Interaction**: Parallax movement of the 3D canvas following the user's cursor.
- **Expected Visitor Action**: Scroll downward, engaged by the smooth scrolling effect.

### Section 2: Global Operations (Attention)
- **Purpose**: Proves geographical and technical range.
- **Key Message**: "Enterprise scale, deployed worldwide."
- **Visual Direction**: Monospaced status log displaying server load, latency, and current active instances.
- **Recommended Interaction**: Live ticking clock showing local times of key infrastructure zones.
- **Expected Visitor Action**: Absorb the technical reality of our infrastructure.

### Section 3: The Core Thesis (Attention)
- **Purpose**: Challenges traditional agency complacency.
- **Key Message**: "Most software projects fail because of shortcuts. We don't take them."
- **Visual Direction**: Clean, asymmetric layout. A large quote block in Newsreader Serif offset by generous whitespace.
- **Recommended Interaction**: Smooth text fade-in as the section scrolls into view.
- **Expected Visitor Action**: Read the quote and reflect on their past software failures.

### Section 4: The Technological Shift (Future)
- **Purpose**: Outlines our view of the AI trajectory.
- **Key Message**: "AI is not a feature; it is the new architectural layer."
- **Visual Direction**: Minimalistic flow diagram mapping traditional software components transitioning into unified, intelligent agent nodes.
- **Recommended Interaction**: Interactive toggles to switch between "Traditional Architecture" and "Agentic Architecture."
- **Expected Visitor Action**: Recognize Aivora's forward-looking technical foresight.

### Section 5: Long-Term Platform Vision (Future)
- **Purpose**: Establishes that Aivora builds modular systems, not single-use components.
- **Key Message**: "Scalability from Day One. Built for decades."
- **Visual Direction**: An animated timeline showcasing modular expansion from an MVP landing page to an integrated ERP/AI system.
- **Recommended Interaction**: Hovering over timeline milestones reveals details of the stack scalability at each phase.
- **Expected Visitor Action**: Realize Aivora is a partner for long-term growth.

### Section 6: The Software Fragility Crisis (Problem)
- **Purpose**: Identifies the core problem of typical B2B websites.
- **Key Message**: "Static websites mask poor code. We let our execution speak for itself."
- **Visual Direction**: Split screen. Left side displays standard, slow agency stats; right side displays a live, ticking system monitor showing Aivora's current client-side render speed.
- **Recommended Interaction**: Mouse hover displays tooltips detailing the metric calculations.
- **Expected Visitor Action**: Contrast traditional agencies with Aivora's transparent metrics.

### Section 7: The Integration Crisis (Problem)
- **Purpose**: Details the difficulty of combining AI with legacy systems.
- **Key Message**: "Bridging the gap between legacy databases and modern language models."
- **Visual Direction**: Asymmetric grid showcasing typical bottleneck points (latency, type mismatch, context loss) highlighted in muted gold warning borders.
- **Recommended Interaction**: Clicking a bottleneck highlight displays a brief architectural solution description.
- **Expected Visitor Action**: Understand that Aivora is aware of the exact implementation pitfalls.

### Section 8: The Engineering Constitution (Engineering Mindset)
- **Purpose**: Introduces our core quality rules.
- **Key Message**: "A team governed by code quality laws."
- **Visual Direction**: A stylized, readable presentation of the Aivora Repository Constitution. Key principles (SOLID, strict TypeScript, Lighthouse >= 95) rendered with crisp icons.
- **Recommended Interaction**: Clicking a principle reveals the exact rule description from the constitution file.
- **Expected Visitor Action**: Appreciate the developer-first rigor of Aivora's process.

### Section 9: Strict Typings & Protocols (Engineering Mindset)
- **Purpose**: Demonstrates our commitment to strict type safety.
- **Key Message**: "Zod validation at the perimeter. Strict compile-time safety inside."
- **Visual Direction**: A stylized representation of a Zod schema validating a real payload in a clean code viewport.
- **Recommended Interaction**: Interactive input fields that validation tests in real-time.
- **Expected Visitor Action**: Verify Aivora's type-safety standards.

### Section 10: Full-Stack Architecture (Capabilities)
- **Purpose**: Displays our core web development service.
- **Key Message**: "High-performance web apps built with Next.js 15 and React 19."
- **Visual Direction**: 3-column clean grid highlighting specific full-stack offerings.
- **Recommended Interaction**: Smooth card lift and border-glow translation on hover.
- **Expected Visitor Action**: Identify the services applicable to their business.

### Section 11: Intelligent Systems (Capabilities)
- **Purpose**: Displays our custom AI integration capabilities.
- **Key Message**: "Agentic automation powered by FastAPI and containerized microservices."
- **Visual Direction**: Visual cards representing automation modules, database sync, and prompt orchestration.
- **Recommended Interaction**: Hover triggers micro-animations of data passing between modules.
- **Expected Visitor Action**: Understand the depth of our backend engineering.

### Section 12: Immersive Interfaces (Capabilities)
- **Purpose**: Displays our front-end design system depth.
- **Key Message**: "Fast, accessible 3D and motion experiences that engage."
- **Visual Direction**: Showcase of 3D Canvas integration using design system tokens.
- **Recommended Interaction**: Draggable 3D sphere that morphs on mouse acceleration.
- **Expected Visitor Action**: Experience the fluid, highly engineered frontend firsthand.

### Section 13: The Verified Stack (Technology)
- **Purpose**: Validates our core engineering decisions.
- **Key Message**: "We build on tools we have stress-tested."
- **Visual Direction**: Clean grid of tech logos (Next.js 15, React 19, Supabase, FastAPI, Tailwind v4, Zod) with brief explanations of why they are in the constitution.
- **Recommended Interaction**: Clicking a logo filters the case studies below by that specific stack component.
- **Expected Visitor Action**: Note Aivora's stack specialization.

### Section 14: The Edge Infrastructure (Technology)
- **Purpose**: Proves global delivery speed.
- **Key Message**: "Zero cold starts. Globally distributed Vercel deployment."
- **Visual Direction**: Interactive globe highlighting edge node routes and current simulated delivery latencies.
- **Recommended Interaction**: Hover over nodes to show response times.
- **Expected Visitor Action**: Feel confidence in Aivora's infrastructure choices.

### Section 15: The Live Terminal (AI Showcase)
- **Purpose**: Provides immediate proof of engineering ability.
- **Key Message**: "Interact with Aivora. Ask our system prompt directly."
- **Visual Direction**: A terminal interface embedded in a glassmorphism card. Users can input queries.
- **Recommended Interaction**: Functional, streaming chatbot with prompt input validation.
- **Expected Visitor Action**: Test the AI chatbot and receive high-speed, relevant responses.

### Section 16: The Vision Sandbox (AI Showcase)
- **Purpose**: Demonstrates computer vision capabilities.
- **Key Message**: "Real-time edge analysis, simulated."
- **Visual Direction**: A sandbox interface showing a canvas scanning placeholder patterns.
- **Recommended Interaction**: Draggable target bounding box that updates coordinates in a monospaced debug log.
- **Expected Visitor Action**: Interact with the mock analyzer, noting coordinate tracking precision.

### Section 17: Process Blueprint (Process)
- **Purpose**: Demystifies the delivery roadmap.
- **Key Message**: "From feature specification to verified deployment."
- **Visual Direction**: 4-phase horizontal roadmap card layout detailing Setup, Foundation, User Stories, and Polish.
- **Recommended Interaction**: Carousel navigation or horizontal scroll.
- **Expected Visitor Action**: Understand how Aivora manages project delivery risk.

### Section 18: Quality Gates & Testing Loop (Process)
- **Purpose**: Proves our QA rigor.
- **Key Message**: "No code is merged without passing our automated quality gates."
- **Visual Direction**: An animated checklist showing Type Safety, Linting, Accessibility, and Unit tests passing sequentially.
- **Recommended Interaction**: Hovering over a gate displays the exact test command executed in the codebase.
- **Expected Visitor Action**: Recognize Aivora's testing discipline.

### Section 19: Case Study: Enterprise Automation (Trust)
- **Purpose**: Demonstrates execution at scale.
- **Key Message**: "Redesigned a legacy clinical portal, achieving 99% uptime and LTR/RTL parity."
- **Visual Direction**: High-impact editorial page mockup featuring clean typography and a structural system diagram.
- **Recommended Interaction**: Horizontal slide transition revealing before/after comparison.
- **Expected Visitor Action**: Click "View Case Study" to review the technical details.

### Section 20: Case Study: SaaS Architecture (Trust)
- **Purpose**: Proves start-to-finish product delivery.
- **Key Message**: "Built a custom AI scheduler engine handling 10k concurrent users."
- **Visual Direction**: Showcase card focusing on backend schema and FastAPI route endpoints.
- **Recommended Interaction**: Expanding the card reveals code symbol definitions.
- **Expected Visitor Action**: Gain confidence in Aivora's ability to handle scale.

### Section 21: Compliance & Security Blueprint (Trust)
- **Purpose**: Validates enterprise compliance.
- **Key Message**: "Security is baked into the database schema."
- **Visual Direction**: Highlights of Row Level Security (RLS), Zod validation, and WCAG AA accessibility audits.
- **Recommended Interaction**: Toggle buttons to switch between database tables showing how RLS prevents cross-tenant access.
- **Expected Visitor Action**: Trust Aivora with sensitive enterprise data.

### Section 22: Client Impact Metrics (Results)
- **Purpose**: Quantifies business value.
- **Key Message**: "95% performance baseline. 40% reduction in support ticket volume."
- **Visual Direction**: Grid of metric cards utilizing large tabular-num Geist Mono typography.
- **Recommended Interaction**: Animated counter counts up to target values when scrolled into view.
- **Expected Visitor Action**: Validate Aivora's business-level impact.

### Section 23: The Consultation Gate (Conversion)
- **Purpose**: Initiates the intake conversion process.
- **Key Message**: "Consult with a Systems Architect."
- **Visual Direction**: Elevated form panel. Right side features a minimal form; left side displays coordinate indicators and active status alerts.
- **Recommended Interaction**: Interactive, real-time Zod validated form inputs.
- **Expected Visitor Action**: Input contact info and submit project requirements.

### Section 24: Calendar Integration (Conversion)
- **Purpose**: Streamlines booking.
- **Key Message**: "Select an engineering session."
- **Visual Direction**: Embedded, customized scheduling interface (e.g., Calendly/Resend).
- **Recommended Interaction**: Interactive calendar grid displaying available technical slots.
- **Expected Visitor Action**: Pick a time and schedule the call.

### Section 25: The Closing Manifesto (Exit)
- **Purpose**: Leaves a strong brand impression.
- **Key Message**: "Aivora. Engineering the future, deterministically."
- **Visual Direction**: Full-bleed dark slate container featuring gold accent typography and a slow fade-out to black.
- **Recommended Interaction**: Slow zoom of background grid lines.
- **Expected Visitor Action**: Complete the session with a memorable impression of a world-class technology brand.

## Acceptance Criteria
- [ ] Users can navigate the entire site in both English and Arabic.
- [ ] Language switch dynamically flips the layout direction (LTR/RTL).
- [ ] Lighthouse performance score is >= 95 on Desktop.
- [ ] The Contact form successfully writes to the Supabase database.
- [ ] The AI Demo responds to valid queries and rejects out-of-bounds queries.
- [ ] All responsive breakpoints render correctly without horizontal scrolling.
- [ ] Homepage sections 1-25 display the correct narrative sequence and visual tokens.

## Definition of Done
- Specification is completely filled, uniquely clear, and devoid of implementation instructions (React code, SQL queries).
- All [NEEDS CLARIFICATION] markers resolved.
- Meets the engineering constitution and is ready for Phase 0 Research and Phase 1 Design under the `speckit-plan` workflow.
