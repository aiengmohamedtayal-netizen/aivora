import { test, expect } from "@playwright/test"

/**
 * Regression Guard — Service Routes
 * 
 * These tests exist because of a P0 production incident where all
 * service routes returned 500 due to:
 *   1. Type mismatch (problems/solution vs overview)
 *   2. Non-serializable props crossing Server→Client boundary
 *
 * This suite ensures every service route returns HTTP 200 for both
 * locales. If any route returns 500, the CI pipeline MUST fail.
 */
test.describe("Service Routes — HTTP 200 Regression Guard", () => {
  const locales = ["en", "ar"]

  const slugs = [
    "web-development",
    "ai-integration",
    "cloud-infrastructure",
    "workflow-automation",
  ]

  for (const locale of locales) {
    for (const slug of slugs) {
      test(`/${locale}/services/${slug} returns HTTP 200`, async ({ page }) => {
        const response = await page.goto(`/${locale}/services/${slug}`)

        // The response must exist and must be 200
        expect(response).not.toBeNull()
        expect(response!.status()).toBe(200)

        // Page must contain the service hero heading (h1)
        const h1 = page.locator("h1")
        await expect(h1).toBeVisible({ timeout: 10000 })
        
        // h1 text must not be empty
        const text = await h1.textContent()
        expect(text?.trim().length).toBeGreaterThan(0)
      })
    }
  }

  // Verify legacy slugs redirect instead of crashing
  test("Legacy slug /en/services/ai-solutions redirects to /en/services/ai-integration", async ({ page }) => {
    const response = await page.goto("/en/services/ai-solutions")
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)
    expect(page.url()).toContain("/services/ai-integration")
  })

  // Verify unknown slugs return 404, not 500
  test("Unknown slug /en/services/nonexistent returns 404", async ({ page }) => {
    const response = await page.goto("/en/services/nonexistent")
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(404)
  })
})
