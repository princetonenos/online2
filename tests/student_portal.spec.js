import { test, expect } from '@playwright/test';

test.describe('Student Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/');
    await expect(page).toHaveTitle(/Classroom Replica/);
  });

  test('should login as student and access dashboard', async ({ page }) => {
    // Use quick login as student
    await page.click('button:has-text("Student")');
    
    // Wait for navigation to student dashboard
    await page.waitForURL('**/student/dashboard');
    
    // Verify dashboard elements
    await expect(page.locator('h1')).toContainText('Welcome');
    await expect(page.locator('text=Your Classes')).toBeVisible();
    await expect(page.locator('text=Upcoming')).toBeVisible();
    await expect(page.locator('text=Due Today')).toBeVisible();
    
    // Verify quick action buttons
    await expect(page.locator('text=Join Class')).toBeVisible();
    await expect(page.locator('text=View Classes')).toBeVisible();
    await expect(page.locator('text=View Classwork')).toBeVisible();
  });

  test('should navigate to classes page', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Navigate to classes
    await page.click('text=View Classes');
    await page.waitForURL('**/student/classes');
    
    // Verify classes page
    await expect(page.locator('h1')).toContainText('Classes');
    await expect(page.locator('text=Your Classes')).toBeVisible();
  });

  test('should navigate to classwork page', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Navigate to classwork
    await page.click('text=View Classwork');
    await page.waitForURL('**/student/classwork');
    
    // Verify classwork page
    await expect(page.locator('h1')).toContainText('Classwork');
    await expect(page.locator('text=Assignments')).toBeVisible();
  });

  test('should navigate to grades page', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Navigate to grades via quick action
    await page.click('text=Grades');
    await page.waitForURL('**/student/grades');
    
    // Verify grades page
    await expect(page.locator('h1')).toContainText('Grades');
  });

  test('should navigate to calendar page', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Navigate to calendar
    await page.click('text=View Calendar');
    await page.waitForURL('**/student/calendar');
    
    // Verify calendar page
    await expect(page.locator('h1')).toContainText('Calendar');
  });

  test('should navigate to people page', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Navigate to people
    await page.click('text=People');
    await page.waitForURL('**/student/people');
    
    // Verify people page
    await expect(page.locator('h1')).toContainText('People');
  });

  test('should navigate to stream page', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Navigate to stream via announcements
    await page.click('text=View all', { hasText: 'Recent Announcements' });
    await page.waitForURL('**/student/stream');
    
    // Verify stream page
    await expect(page.locator('h1')).toContainText('Stream');
  });

  test('should navigate to join class page', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Navigate to join class
    await page.click('text=Join Class');
    await page.waitForURL('**/student/join');
    
    // Verify join class page
    await expect(page.locator('h1')).toContainText('Join Class');
    await expect(page.locator('text=Enter Class Code')).toBeVisible();
  });

  test('should display student dashboard statistics', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Verify dashboard statistics
    await expect(page.locator('text=Your Classes')).toBeVisible();
    await expect(page.locator('text=Upcoming')).toBeVisible();
    await expect(page.locator('text=Due Today')).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();
    await expect(page.locator('text=Avg. Grade')).toBeVisible();
    await expect(page.locator('text=Attendance')).toBeVisible();
    
    // Verify these elements contain numbers
    const classCount = page.locator('text=Your Classes + * >> text=/\\d+/');
    await expect(classCount).toBeVisible();
  });

  test('should display recent announcements', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Verify recent announcements section
    await expect(page.locator('text=Recent Announcements')).toBeVisible();
    
    // Check if announcements are displayed or empty state
    const announcements = page.locator('[data-testid="announcement"]');
    const count = await announcements.count();
    
    if (count > 0) {
      await expect(announcements.first()).toBeVisible();
    } else {
      await expect(page.locator('text=No Recent Announcements')).toBeVisible();
    }
  });

  test('should display enrolled classes', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Verify enrolled classes section
    await expect(page.locator('text=Your Classes')).toBeVisible();
    
    // Check if classes are displayed or empty state
    const classes = page.locator('[data-testid="class-card"]');
    const count = await classes.count();
    
    if (count > 0) {
      await expect(classes.first()).toBeVisible();
    } else {
      await expect(page.locator('text=No Classes Enrolled')).toBeVisible();
      await expect(page.locator('text=Join Class')).toBeVisible();
    }
  });

  test('should display pending assignments', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Verify pending assignments section
    await expect(page.locator('text=Pending Assignments')).toBeVisible();
    
    // Check if assignments are displayed or empty state
    const assignments = page.locator('[data-testid="assignment-card"]');
    const count = await assignments.count();
    
    if (count > 0) {
      await expect(assignments.first()).toBeVisible();
    } else {
      await expect(page.locator('text=No Pending Assignments')).toBeVisible();
    }
  });

  test('should navigate to assignment details', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Try to click on first assignment if available
    const assignment = page.locator('[data-testid="assignment-card"]').first();
    if (await assignment.isVisible()) {
      await assignment.click();
      await page.waitForURL('**/student/classwork/**');
      await expect(page.locator('h1')).toContainText('Assignment');
    }
  });

  test('should navigate to class details', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Try to click on first class if available
    const classCard = page.locator('[data-testid="class-card"]').first();
    if (await classCard.isVisible()) {
      await classCard.click();
      await page.waitForURL('**/student/classes/**');
      await expect(page.locator('h1')).toContainText('Class');
    }
  });

  test('should display quick stats', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Verify quick stats section
    await expect(page.locator('text=Quick Stats')).toBeVisible();
    await expect(page.locator('text=Performance')).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();
    await expect(page.locator('text=Pending')).toBeVisible();
    await expect(page.locator('text=Attendance')).toBeVisible();
  });

  test('should display upcoming deadlines', async ({ page }) => {
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Verify upcoming deadlines section
    await expect(page.locator('text=Upcoming Deadlines')).toBeVisible();
  });

  test('should handle empty states gracefully', async ({ page }) => {
    // This test ensures the app handles empty data states without errors
    // Login as student
    await page.click('button:has-text("Student")');
    await page.waitForURL('**/student/dashboard');
    
    // Check that all sections render without errors
    await expect(page.locator('text=Welcome')).toBeVisible();
    await expect(page.locator('text=Recent Announcements')).toBeVisible();
    await expect(page.locator('text=Your Classes')).toBeVisible();
    await expect(page.locator('text=Pending Assignments')).toBeVisible();
    await expect(page.locator('text=Quick Stats')).toBeVisible();
    await expect(page.locator('text=Upcoming Deadlines')).toBeVisible();
    
    // The page should load without any console errors
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });
    
    // Wait a bit for any potential errors
    await page.waitForTimeout(1000);
    
    // If there are console errors, fail the test
    if (logs.length > 0) {
      console.error('Console errors found:', logs);
      throw new Error(`Found console errors: ${logs.join(', ')}`);
    }
  });
});
