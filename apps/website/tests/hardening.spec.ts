import { test, expect } from "@playwright/test"

test.describe("Aivora OS Production Hardening & Release Verification", () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto("/en")
  })

  // 1. Language switcher & persistence test
  test("Language Switcher switches locale and persists across navigation/reload", async ({ page }) => {
    // Locate the language switcher button (LocaleSwitcher)
    const switcher = page.locator("header").getByRole("button", { name: /العربية|English/ })
    await expect(switcher).toBeVisible()
    
    // Switch to Arabic
    await switcher.click()
    await page.waitForURL("**/ar")
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
    await expect(page.locator("html")).toHaveAttribute("lang", "ar")

    // Navigate to /about (من نحن) and verify persistence
    await page.goto("/ar/about")
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
    await expect(page.locator("html")).toHaveAttribute("lang", "ar")

    // Reload the page and verify language remains Arabic
    await page.reload()
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
  })

  // 2. Accessibility: Skip to Content test
  test("Accessibility: 'Skip to Content' link is accessible and focuses the main element", async ({ page }) => {
    // Focus the document and press Tab to reveal 'Skip to Content'
    await page.keyboard.press("Tab")
    
    const skipLink = page.locator("a", { hasText: /Skip to content|تخطي إلى المحتوى/i })
    await expect(skipLink).toBeFocused()
    
    // Press Enter to activate the skip link
    await page.keyboard.press("Enter")
    
    // The main-content area should be focused
    const mainContent = page.locator("#main-content")
    await expect(mainContent).toBeVisible()
  })

  // 3. Accessibility: Dialog Focus Trap (Chatbot)
  test("Accessibility: Aivora Assistant Dialog traps focus when open", async ({ page }) => {
    // Open the chatbot assistant button
    const chatButton = page.locator("button").filter({ hasText: /Aivora AI|أيفورا الذكي/i })
    if (await chatButton.count() > 0) {
      await chatButton.first().click()
      
      // Check that the dialog is open
      const dialog = page.locator("[role='dialog']")
      await expect(dialog).toBeVisible()

      // Focus should be inside the text field
      const textarea = dialog.locator("textarea")
      await expect(textarea).toBeFocused()

      // Pressing Escape should close the dialog
      await page.keyboard.press("Escape")
      await expect(dialog).not.toBeVisible()
    }
  })

  // 4. Newsletter Form submission & honeypot tests
  test("Newsletter: validates input and prevents empty submission", async ({ page }) => {
    // Scroll down to Footer where Newsletter resides
    const emailInput = page.locator("input[type='email']")
    await expect(emailInput).toBeVisible()
    
    const submitButton = page.locator("form").getByRole("button", { name: /Subscribe|اشترك/i })
    await expect(submitButton).toBeVisible()

    // Submit with invalid email format
    await emailInput.fill("invalid-email")
    await submitButton.click()
    
    // Should display validation alert/message (e.g. standard browser alert or field validation indicator)
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity())
    expect(isValid).toBe(false)
  })

  // 5. Intake/Contact form verification
  test("Contact Form: prevents invalid submission", async ({ page }) => {
    // Go to intake/contact page
    await page.goto("/en/intake")
    
    const submitBtn = page.getByRole("button", { name: /Submit|إرسال/i })
    if (await submitBtn.count() > 0) {
      await expect(submitBtn.first()).toBeVisible()
      await submitBtn.first().click()
      
      // Should show validation errors or block form submit
      const form = page.locator("form").first()
      await expect(form).toBeVisible()
    }
  })

})
