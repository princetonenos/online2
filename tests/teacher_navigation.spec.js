// tests/teacher_navigation.spec.js
import { test, expect } from '@playwright/test';
const BASE = process.env.BASE_URL || 'http://localhost:5173';

test.beforeEach(async ({ page }) => {
  // ensure mock currentUser is a teacher
  await page.goto(`${BASE}/login`);
  await page.evaluate(() => {
    localStorage.setItem('mock:currentUser', JSON.stringify({ id: 'teacher-1', role: 'teacher', name: 'teacher-dev' }));
  });
  await page.goto(`${BASE}/teacher/dashboard`);
  await page.waitForLoadState('networkidle');
});

test('My classes opens /teacher/classes', async ({ page }) => {
  await page.getByRole('button', { name: /📚 My classes/ }).click();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toMatch(/\/teacher\/classes/);
});

test('Assignments opens /teacher/assignments', async ({ page }) => {
  await page.getByRole('button', { name: /📝 Assignments/ }).click();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toMatch(/\/teacher\/assignments/);
});

test('Calendar opens /teacher/calendar', async ({ page }) => {
  await page.getByRole('button', { name: /📅 Calendar/ }).click();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toMatch(/\/teacher\/calendar/);
});
