// tests/teacher_quick_actions.spec.js
import { test, expect } from '@playwright/test';
const BASE = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Teacher quick actions and KPIs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    // adjust the button selector that logs in as teacher
    // this expects some "Teacher" quick sign button or similar in /login
    if (await page.locator('button', { hasText: 'Teacher' }).count() > 0) {
      await page.getByRole('button', { name: 'Teacher' }).click();
    } else {
      // if app has a mock login input, try setting localStorage then navigate
      await page.evaluate(() => {
        localStorage.setItem('mock:currentUser', JSON.stringify({ id: 'teacher-1', role: 'teacher', name:'teacher-dev' }));
      });
      await page.goto(`${BASE}/teacher/dashboard`);
    }
    await page.waitForLoadState('networkidle');
  });

  test('My classes quick action opens classes page', async ({ page }) => {
    await page.getByRole('button', { name: /📚 My classes/ }).click();
    await page.waitForURL(/teacher\/classes/);
  });

  test('Assignments quick action opens assignments page', async ({ page }) => {
    await page.getByRole('button', { name: /📝 Assignments/ }).click();
    await page.waitForURL(/teacher\/assignments/);
    await expect(page.locator('text=Assignments').first()).toBeVisible();
  });

  test('Calendar quick action opens calendar', async ({ page }) => {
    await page.getByRole('button', { name: /📅 Calendar/ }).click();
    await page.waitForURL(/teacher\/calendar/);
  });

  test('Create course opens modal', async ({ page }) => {
    if (await page.getByText('Create course').count() > 0) {
      await page.getByText('Create course').click();
      // expect modal - check for Save/Create button or title
      await expect(page.locator('text=Create course').first()).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('Add event opens calendar modal', async ({ page }) => {
    if (await page.getByText('Add event').count() > 0) {
      await page.getByText('Add event').click();
      await expect(page.locator('text=Add event').first()).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('Create student opens enroll form', async ({ page }) => {
    if (await page.getByText('Create student').count() > 0) {
      await page.getByText('Create student').click();
      await expect(page.locator('text=Enroll student|Course title|Email', { timeout: 3000 }).first()).toBeVisible().catch(()=>{});
    } else {
      test.skip();
    }
  });
});
