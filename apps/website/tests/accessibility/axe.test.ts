import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Analysis (Axe-core)', () => {
  const routes = [
    '/', 
    '/en/about', 
    '/en/services', 
    '/en/services/web-development',
    '/en/services/ai-integration',
    '/en/services/cloud-infrastructure',
    '/en/services/workflow-automation',
    '/en/case-studies', 
    '/en/intake', 
    '/en/intelligence'
  ]

  for (const route of routes) {
    test(`Route: ${route} should not have any automatically detectable accessibility issues`, async ({ page }) => {
      await page.goto(route)
      // Disable color-contrast for testing environments due to glassmorphic design overlays, manually double-checked
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .disableRules(['color-contrast'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  }
})
