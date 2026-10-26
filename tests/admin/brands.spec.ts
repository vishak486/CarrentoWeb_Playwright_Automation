import { test, expect } from '@playwright/test';
import { BrandsPage } from '../pages/BrandsPage';

test('brands page shows the list heading and table columns', async ({ page }) => {
    const brandsPage = new BrandsPage(page);
    await brandsPage.goto();
    await expect(brandsPage.heading).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Brand Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Logo' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Active' })).toBeVisible();
})

test('brands table lists at least one brand', async ({ page }) => {
  const brandsPage = new BrandsPage(page);
  await brandsPage.goto();

  await expect(brandsPage.statusButtons.first()).toBeVisible();
});

test('create new brand link opens the create form', async ({ page }) => {
    const brandsPage = new BrandsPage(page);
    await brandsPage.goto();
    await brandsPage.createLink.click();
    await expect(page).toHaveURL(/\/Admin\/Brands\/Create/);
    await expect(page.getByRole('heading', { name: 'Create Brand' })).toBeVisible();
})