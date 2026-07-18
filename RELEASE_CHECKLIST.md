# Aivora OS - Release Checklist (Production-Grade)

This checklist serves as the final gatekeeper for production releases. Every build must satisfy these criteria before deploying to production.

---

## 📋 Pre-Flight Checks

### 1. Build & Compilation
- [ ] **Lint Check**: Run `npm run lint` (or workspace equivalent) with zero errors.
- [ ] **Typecheck**: Run `npm run type-check` (or `tsc --noEmit`) to verify zero TypeScript errors.
- [ ] **Production Build**: Run `npm run build` and ensure successful webpack asset outputs.
- [ ] **next start Validation**: Run `next start` on staging to verify that hydration, API routes, and page routing execute without runtime console errors.

### 2. Automated E2E Testing (Playwright)
- [ ] **Hardening Suite**: Run `pnpm exec playwright test` under `apps/website/tests/hardening.spec.ts` ensuring:
  - Language Persistence persists English/Arabic across navigations and hard reloads.
  - "Skip to Content" focuses `#main-content` correctly.
  - Dialog Focus Trap behaves correctly on opening and Esc closing.
  - Newsletter Form fields block invalid submissions.
  - Contact Form fields reject empty entries.
- [ ] **Cross-browser Verification**: Pass tests on Chromium, Firefox, WebKit, Mobile Safari, and Mobile Chrome viewports.

### 3. Accessibility & Inclusivity (Axe-Core)
- [ ] **Automated Audit**: Run axe-playwright scans on `/`, `/about`, `/services`, and `/contact` subroutes.
- [ ] **Accessibility Rules**: Ensure zero WCAG 2.1 AA level violations (tab order, dialog focus traps, landmark headers, skip links).

### 4. Bundle & Performance Budgets
- [ ] **Route JS Budget**: Ensure First Load JS for all routes is $\le 120$ KB.
- [ ] **Module Chunk Budget**: Ensure largest shared JS chunk is $\le 250$ KB.
- [ ] **Dynamic Load Check**: Defer heavy components (GlobalWaveBackground, Chatbot) using `next/dynamic` to ensure:
  - LCP $\le 1.5$ s
  - CLS $\le 0.05$
  - INP $\le 150$ ms

---

## 🔒 Security & Privacy

- [ ] **Security Headers**: Verify the presence of the following HTTP headers on all responses:
  - `Content-Security-Policy` (CSP)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security` (HSTS)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (camera, mic disabled)
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Resource-Policy: same-origin`
- [ ] **Newsletter RLS**: Verify that Row Level Security (RLS) is active on the `newsletter_subscribers` table, with write/read privileges limited to the `service_role` and `INSERT` limited to public clients.

---

## 🌐 SEO & Meta Verification

- [ ] **Sitemaps**: Ensure `sitemap.xml` is dynamic, covers both `/ar` and `/en` routes, and points correctly to the new service slugs:
  - `/services/web-development`
  - `/services/ai-integration`
  - `/services/cloud-infrastructure`
  - `/services/workflow-automation`
- [ ] **Robots**: Validate `robots.txt` output to allow crawling of pages while disallowing API and admin routes.
- [ ] **Structured Data (JSON-LD)**: Verify Organization, Website, and Service schema markups on all key landing pages.
- [ ] **Open Graph & Twitter**: Validate image metadata pointing to `/og-image.jpg` with valid alternative texts.

---

## 🚨 Monitoring & Rollback Strategy

- [ ] **Sentry Integration**: Ensure `@sentry/nextjs` is configured and error capture bounds are functional.
- [ ] **Vercel Analytics**: Verify Vercel Web Vitals and Speed Insights scripts load without blocking the main thread.
- [ ] **Database Backup**: Take a pg_dump or Supabase database backup before executing schema modifications.
- [ ] **Git Rollback**: Prepare git commit hash revert trigger in the CI/CD pipeline for instant rollback.
