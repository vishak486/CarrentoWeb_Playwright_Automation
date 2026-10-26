import { test, expect } from '@playwright/test';
import { BrandsPage } from '../pages/BrandsPage';
import { CreateBrandPage } from '../pages/CreateBrandPage';

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

test('admin can create a brand with a logo, then deactivate it', async ({ page }) => {
    const brandName = `AUTO_TEST_${Date.now()}`;
    const createPage = new CreateBrandPage(page);
    const brandsPage = new BrandsPage(page);

    await createPage.goto();
    await createPage.create(brandName, 'tests/fixtures/test-logo.png');

    // Redirects to the list; find our brand using the table search box
    await expect(page).toHaveURL(/\/Admin\/Brands\/?$/);
    await page.getByRole('searchbox').fill(brandName);

    const row = page.getByRole('row', { name: new RegExp(brandName) });
    await expect(row).toBeVisible();
    await expect(row.locator('img')).toBeVisible();
    await expect(row.getByRole('button', { name: 'Active' })).toBeVisible();

    // Clean up: deactivate so customers don't see the test brand
    await row.getByRole('button', { name: 'Active' }).click();
    await expect(row.getByRole('button', { name: 'Inactive' })).toBeVisible();
})
