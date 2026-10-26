import { test, expect } from '@playwright/test';
import { CarsPage } from '../pages/CarsPage';

test('cars page shows the list heading and table columns', async ({ page }) => {
    const carsPage = new CarsPage(page);
    await carsPage.goto();
    await expect(carsPage.heading).toBeVisible();
    for (const column of ['Image', 'Car Name', 'Brand', 'Year', 'Price/Day', 'Status', 'Action']) {
    await expect(page.getByRole('columnheader', { name: column})).toBeVisible();
  }
})

test('cars table lists at least one car', async ({ page }) => {
  const carsPage = new CarsPage(page);
  await carsPage.goto();

  await expect(carsPage.statusSelects.first()).toBeVisible();
});

test('create new car link opens the create form', async ({ page }) => {
  const carsPage = new CarsPage(page);
  await carsPage.goto();

  await carsPage.createLink.click();

  await expect(page).toHaveURL(/\/Admin\/Cars\/Create/);
  await expect(page.getByRole('heading', { name: 'Create Car' })).toBeVisible();
});

test('update car link opens the edit form', async ({ page }) => {
  const carsPage = new CarsPage(page);
  await carsPage.goto();

  await carsPage.updateCarLinks.first().click();

  await expect(page).toHaveURL(/\/Admin\/Cars\/Edit\/\d+/);
  await expect(page.getByRole('heading', { name: 'Edit Car' })).toBeVisible();
});