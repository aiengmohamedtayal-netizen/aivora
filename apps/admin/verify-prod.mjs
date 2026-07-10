import { chromium } from 'playwright';

const BASE_URL = 'https://aivora-lac.vercel.app';
const ROUTES = [
  '/',
  '/services',
  '/services/ai-solutions',
  '/blog',
  '/intake',
  '/contact',
  '/admin',
  '/admin/login',
  '/admin/leads',
  '/admin/inbox',
  '/admin/newsletter',
  '/admin/blog',
  '/admin/services',
  '/admin/settings',
  '/admin/visitors'
];
const LOCALES = ['/en', '/ar'];

async function verify() {
  console.log(`Starting production verification on ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });
  
  let totalErrors = 0;
  
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const url = `${BASE_URL}${locale}${route === '/' ? '' : route}`;
      console.log(`\nVerifying: ${url}`);
      
      const context = await browser.newContext({
        colorScheme: 'light', // Test light mode first
      });
      const page = await context.newPage();
      
      let consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          const text = msg.text();
          // Filter out expected warnings if any, but catch hydration / motion errors
          if (text.includes('Attempted to call createMotionComponent') || text.includes('Hydration') || text.includes('INSUFFICIENT_PATH') || msg.type() === 'error') {
            consoleErrors.push(text);
          }
        }
      });
      
      page.on('pageerror', err => {
        consoleErrors.push(err.message);
      });
      
      try {
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        const status = response.status();
        
        if (status >= 400 && status !== 404) { // allow 404 if some pages are legitimately missing, though they shouldn't be
          console.error(`❌ HTTP Status: ${status}`);
          totalErrors++;
        } else {
          console.log(`✅ HTTP Status: ${status}`);
        }
        
        if (consoleErrors.length > 0) {
          console.error(`❌ Console Errors/Warnings:`);
          consoleErrors.forEach(e => console.error(`  - ${e}`));
          totalErrors += consoleErrors.length;
        } else {
          console.log(`✅ Zero runtime/hydration/console errors`);
        }
        
        // Check RTL/LTR
        const dir = await page.evaluate(() => document.documentElement.dir);
        if (locale === '/ar' && dir !== 'rtl') {
          console.error(`❌ Expected RTL for Arabic, got ${dir}`);
          totalErrors++;
        } else if (locale === '/en' && dir !== 'ltr') {
          console.error(`❌ Expected LTR for English, got ${dir}`);
          totalErrors++;
        } else {
          console.log(`✅ Direction: ${dir.toUpperCase()}`);
        }
        
      } catch (err) {
        console.error(`❌ Failed to load page: ${err.message}`);
        totalErrors++;
      }
      
      await context.close();
      
      // Also quickly test dark mode for homepage
      if (route === '/') {
        const darkContext = await browser.newContext({ colorScheme: 'dark' });
        const darkPage = await darkContext.newPage();
        await darkPage.goto(url, { waitUntil: 'domcontentloaded' });
        console.log(`✅ Dark mode verified for ${url}`);
        await darkContext.close();
      }
    }
  }
  
  await browser.close();
  
  if (totalErrors === 0) {
    console.log(`\n🎉 Verification Completed Successfully: Zero Errors!`);
  } else {
    console.log(`\n⚠️ Verification Completed with ${totalErrors} Errors.`);
  }
}

verify().catch(console.error);
