import { test } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

test("Capture Visual Baselines for English and Arabic", async ({ page }) => {
  test.setTimeout(90000);
  const locales = ["en", "ar"];
  const outputDir = path.resolve("C:/Users/Click Labtop/.gemini/antigravity/brain/89623e87-fc77-4ffc-92a1-174e72ac788b/baselines");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Set standard screen size for consistency
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const locale of locales) {
    const localeDir = path.join(outputDir, locale);
    if (!fs.existsSync(localeDir)) {
      fs.mkdirSync(localeDir, { recursive: true });
    }

    console.log(`Navigating to http://localhost:3000/${locale}...`);
    await page.goto(`/${locale}`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Allow additional rendering/animation time

    // Locate primary sections on the home page via language-agnostic selectors
    const sections = [
      { name: "01_hero", selector: 'section[aria-label="Manifesto"]' },
      { name: "02_showcase", selector: 'section[aria-label="Aivora Product Demo"]' },
      { name: "03_services", selector: 'section[aria-label="Studio Capabilities"]' },
      { name: "04_industries", selector: 'section[aria-label="Industries We Serve"]' },
      { name: "05_why_aivora", selector: 'section[aria-label="Why Choose Aivora"]' },
      { name: "06_process", selector: 'section[aria-label="Development Process"]' },
      { name: "07_team", selector: 'section[aria-label="Meet The Team"]' },
      { name: "08_faq", selector: 'section[aria-label="FAQ"]' },
      { name: "09_contact", selector: 'section#intake' },
      { name: "10_footer", selector: "footer" }
    ];

    for (const sec of sections) {
      try {
        const element = page.locator(sec.selector).first();
        if (await element.isVisible()) {
          const filePath = path.join(localeDir, `${sec.name}.png`);
          // Scroll it into view nicely
          await element.scrollIntoViewIfNeeded();
          await page.waitForTimeout(500); // Wait for scrolls/transitions to settle
          await element.screenshot({ path: filePath });
          console.log(`Saved screenshot for ${sec.name} at ${filePath}`);
        } else {
          console.warn(`Element with selector ${sec.selector} was not visible for locale ${locale}`);
        }
      } catch (err: any) {
        console.error(`Failed to capture section ${sec.name}: ${err.message}`);
      }
    }
  }
});
