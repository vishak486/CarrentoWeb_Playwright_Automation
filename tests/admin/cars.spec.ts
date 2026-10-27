import { test, expect } from '@playwright/test';
import { CarsPage } from '../pages/CarsPage';
import { CreateCarPage } from '../pages/CreateCarPage';

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

test('admin can create a car with images in Maintenance status', async ({ page }) => {
  const carName = `AUTO_TEST_CAR_${Date.now()}`;
  const createPage = new CreateCarPage(page);

  await createPage.goto();
  await createPage.create(
    {
      name: carName,
      model: 'TestModel',
      year: '2024',
      transmission: 'Manual',
      fuelType: 'Petrol',
      seats: '5',
      pricePerDay: '1500',
      status: 'Maintenance',
    },
    'tests/fixtures/test-logo.png'
  );

  // Redirects to the list; find our car using the table search box
  await expect(page).toHaveURL(/\/Admin\/Cars\/?$/);
  await page.getByRole('searchbox').fill(carName);

  const row = page.getByRole('row', { name: new RegExp(carName) });
  await expect(row).toBeVisible();
  await expect(row.locator('img')).toBeVisible();
  await expect(row.locator('.status-select')).toHaveValue('Maintenance');
});