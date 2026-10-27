import { test, expect } from '@playwright/test';

const adminPages = [
  { path: '/Admin/Users', heading: 'Customers List' },
  { path: '/Admin/Contacts', heading: 'Manage Contacts' },
];

for (const { path, heading } of adminPages) {
  test(`${heading} page loads for admin`, async ({ page }) => {
    await page.goto(path);

    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  });
}