import { test, expect } from '@playwright/test';

test('dashboard loads for logged-in admin', async ({ page }) => {
    await page.goto('/Admin/Home/Index');
    await expect(
    page.getByRole('heading', { name: 'Admin Dashboard' })
  ).toBeVisible();
})