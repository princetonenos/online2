import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard System Tools Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/');
    
    // Quick sign-in as admin
    await page.click('button:has-text("Admin")');
    
    // Wait for navigation to admin dashboard
    await page.waitForURL('**/admin/dashboard');
  });

  test('should navigate to Bulk Operations page', async ({ page }) => {
    // Click the Bulk Ops button in System Tools section
    await page.click('section:has(h3:has-text("System Tools")) button:has-text("Bulk Ops")');
    
    // Verify navigation to Bulk Operations page
    await expect(page).toHaveURL(/.*\/admin\/bulk-operations/);
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Bulk Operations|Bulk Ops/i })).toBeVisible();
  });

  test('should navigate to Settings page', async ({ page }) => {
    // Click the Settings button in System Tools section
    await page.click('section:has(h3:has-text("System Tools")) button:has-text("Settings")');
    
    // Verify navigation to Settings page
    await expect(page).toHaveURL(/.*\/admin\/settings/);
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Settings|System Settings/i })).toBeVisible();
  });

  test('should navigate to Analytics page', async ({ page }) => {
    // Click the Analytics button in System Tools section
    await page.click('section:has(h3:has-text("System Tools")) button:has-text("Analytics")');
    
    // Verify navigation to Analytics page
    await expect(page).toHaveURL(/.*\/admin\/analytics/);
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Analytics|Usage Stats/i })).toBeVisible();
  });

  test('should navigate to Backup page', async ({ page }) => {
    // Click the Backup button in System Tools section
    await page.click('section:has(h3:has-text("System Tools")) button:has-text("Backup")');
    
    // Verify navigation to Backup page
    await expect(page).toHaveURL(/.*\/admin\/backup/);
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Backup|Data Safety/i })).toBeVisible();
  });

  test('should display System Tools section with all buttons', async ({ page }) => {
    // Verify System Tools section is visible
    const systemToolsSection = page.locator('section:has(h3:has-text("System Tools"))');
    await expect(systemToolsSection).toBeVisible();
    
    // Verify all four buttons are present
    await expect(systemToolsSection.locator('button:has-text("Bulk Ops")')).toBeVisible();
    await expect(systemToolsSection.locator('button:has-text("Settings")')).toBeVisible();
    await expect(systemToolsSection.locator('button:has-text("Analytics")')).toBeVisible();
    await expect(systemToolsSection.locator('button:has-text("Backup")')).toBeVisible();
    
    // Verify button descriptions
    await expect(systemToolsSection.locator('button:has-text("Bulk Ops")')).toContainText('Import/Export');
    await expect(systemToolsSection.locator('button:has-text("Settings")')).toContainText('System config');
    await expect(systemToolsSection.locator('button:has-text("Analytics")')).toContainText('Usage stats');
    await expect(systemToolsSection.locator('button:has-text("Backup")')).toContainText('Data safety');
  });

  test('should have correct icons in System Tools buttons', async ({ page }) => {
    const systemToolsSection = page.locator('section:has(h3:has-text("System Tools"))');
    
    // Check for emoji icons (since we're using emojis in the buttons)
    await expect(systemToolsSection.locator('button:has-text("Bulk Ops")')).toContainText('📦');
    await expect(systemToolsSection.locator('button:has-text("Settings")')).toContainText('⚙️');
    await expect(systemToolsSection.locator('button:has-text("Analytics")')).toContainText('📊');
    await expect(systemToolsSection.locator('button:has-text("Backup")')).toContainText('💾');
  });

  test('should maintain navigation state after page reload', async ({ page }) => {
    // Navigate to one of the system tools pages
    await page.click('section:has(h3:has-text("System Tools")) button:has-text("Analytics")');
    await page.waitForURL('**/admin/analytics');
    
    // Reload the page
    await page.reload();
    
    // Verify we're still on the Analytics page
    await expect(page).toHaveURL(/.*\/admin\/analytics/);
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Analytics|Usage Stats/i })).toBeVisible();
  });

  test('should be able to navigate back to dashboard from system tools pages', async ({ page }) => {
    // Navigate to Backup page
    await page.click('section:has(h3:has-text("System Tools")) button:has-text("Backup")');
    await page.waitForURL('**/admin/backup');
    
    // Navigate back to dashboard (using browser back or through UI if available)
    await page.goBack();
    
    // Verify we're back on the dashboard
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Admin Dashboard|Dashboard/i })).toBeVisible();
  });
});
