import { test, expect } from '@playwright/test';

test('test leads page interactivity', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:3030/dashboard/chatbots/10df2440-6aac-441a-855d-715c0ea8e506/leads');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot to see the initial state
  await page.screenshot({ path: 'leads-page-initial.png', fullPage: true });
  
  // Check for any elements with pointer-events: none that might block clicks
  const blockingElements = await page.$$eval('*', elements => {
    return elements
      .filter(el => {
        const style = window.getComputedStyle(el);
        return style.pointerEvents === 'none' || 
               style.position === 'fixed' || 
               style.position === 'absolute';
      })
      .map(el => ({
        tag: el.tagName,
        class: el.className,
        id: el.id,
        position: window.getComputedStyle(el).position,
        pointerEvents: window.getComputedStyle(el).pointerEvents,
        zIndex: window.getComputedStyle(el).zIndex,
        rect: el.getBoundingClientRect()
      }));
  });
  
  console.log('Potentially blocking elements:', JSON.stringify(blockingElements, null, 2));
  
  // Try to click on the "Back to Chatbot" link
  const backLink = page.locator('text=Back to Chatbot').first();
  
  // Check if the link is visible and enabled
  const isVisible = await backLink.isVisible().catch(() => false);
  const isEnabled = await backLink.isEnabled().catch(() => false);
  
  console.log('Back to Chatbot link - visible:', isVisible, 'enabled:', isEnabled);
  
  // Try clicking the link
  if (isVisible) {
    try {
      await backLink.click({ timeout: 5000 });
      console.log('Successfully clicked Back to Chatbot link');
    } catch (e) {
      console.log('Failed to click Back to Chatbot:', e);
    }
  }
  
  // Check for any console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // Wait a moment and check errors
  await page.waitForTimeout(1000);
  console.log('Console errors:', errors);
  
  // Try clicking on a tab if present
  const leadsTab = page.locator('text=Leads').first();
  if (await leadsTab.isVisible().catch(() => false)) {
    try {
      await leadsTab.click({ timeout: 5000 });
      console.log('Successfully clicked Leads tab');
    } catch (e) {
      console.log('Failed to click Leads tab:', e);
    }
  }
  
  // Final screenshot
  await page.screenshot({ path: 'leads-page-final.png', fullPage: true });
});
