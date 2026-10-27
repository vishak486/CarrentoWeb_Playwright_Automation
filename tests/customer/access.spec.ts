import { test, expect } from '@playwright/test';

const adminPaths = ['/Admin', '/Admin/Brands', '/Admin/Orders'];

for (const path of adminPaths) {
  test(`customer is denied access to ${path}`, async ({ page }) => {
    await page.goto(path);

    await expect(page).toHaveURL(/\/Identity\/Account\/AccessDenied/);
    await expect(page.getByRole('heading', { name: 'Access denied' })).toBeVisible();
  });
}