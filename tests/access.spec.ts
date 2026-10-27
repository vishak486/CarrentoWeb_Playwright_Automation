import { test, expect } from '@playwright/test';

const protectedPaths = [
  '/Admin',
  '/Admin/Brands',
  '/Admin/Cars',
  '/Admin/Orders',
  '/Customer/Cart',
  '/Customer/Order',
];

for (const path of protectedPaths) {
  test(`visitor is redirected to login from ${path}`, async ({ page }) => {
    await page.goto(path);

    await expect(page).toHaveURL(/\/Identity\/Account\/Login/);
    await expect(page).toHaveURL(/ReturnUrl=/i);
    // exact: true because "Use a local account to log in." also contains "log in"
    await expect(page.getByRole('heading', { name: 'Log in', exact: true })).toBeVisible();
  });
}