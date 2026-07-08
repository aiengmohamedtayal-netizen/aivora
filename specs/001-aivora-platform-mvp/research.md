# Research Findings: Aivora Platform MVP

## 1. Next.js 15 & React 19 compatibility with React Three Fiber (R3F)
- **Decision**: Isolate R3F canvas components in client-only modules and load them using dynamic imports with `ssr: false` disabled.
- **Rationale**: React 19 introduces changes to element structures. Isolating the canvas layer prevents hydration mismatches and server-side rendering crashes since R3F requires a window/webgl context.
- **Alternatives Considered**: SSR-rendering placeholder elements. Rejected because it causes complex hydration mismatch loops during canvas mounting.

## 2. Tailwind CSS v4 CSS-first Configuration
- **Decision**: Define design system tokens inside the global `globals.css` using the native Tailwind v4 `@theme` directive.
- **Rationale**: Tailwind CSS v4 moves config files into CSS directives, rendering faster and aligning better with modern stylesheet standards.
- **Alternatives Considered**: Maintaining a separate legacy `tailwind.config.ts`. Rejected because it creates configuration redundancy in Tailwind v4 environments.

## 3. FastAPI AI Rate-Limiting & Security
- **Decision**: Implement `slowapi` middleware in the FastAPI microservice for local rate-limiting, and utilize Upstash Redis for global limit tracking.
- **Rationale**: Protects OpenAI API keys and FastAPI endpoints from denial of service and cost exhaustion attacks.
- **Alternatives Considered**: Client-side rate-limiting. Rejected because client-side restrictions are easily bypassed by direct API calls.

## 4. Supabase Content Access Policies
- **Decision**: Configure Read access on `CaseStudies` and `Services` tables to `public` under Row Level Security (RLS). Protect write access to authorized admin roles only.
- **Rationale**: Ensures anyone can read case studies, but only validated administrators (matching authentication tokens) can write or edit data.
- **Alternatives Considered**: Disabling RLS for public tables. Rejected because it exposes backend structures to SQL injection/write vectors.
