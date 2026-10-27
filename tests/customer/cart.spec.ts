import { test, expect } from '@playwright/test';
import { CarDetailsPage } from '../pages/CarDetailsPage';
import { CartPage } from '../pages/CartPage';
import { futureDate } from '../../utils/dates';
import { addFirstCarToCart } from '../helpers/cart';

// All tests here share one customer cart, so they must not run in parallel
test.describe.configure({ mode: 'serial' });


test('customer can browse, pick dates and add a car to the cart', async ({ page }) => {
  // Random start date so repeated runs don't collide with earlier bookings
  const offset = 30 + Math.floor(Math.random() * 300);

  await page.goto('/Customer/Brands');
  // Brand names come from the database, so pick the first brand card by its link
  await page.locator('a[href*="brandId="]').first().click();
  await expect(page).toHaveURL(/\/Customer\/Cars/);

  await page.getByRole('link', { name: 'View Details' }).first().click();
  await expect(page).toHaveURL(/\/Customer\/Cars\/Details\/\d+/);

  const details = new CarDetailsPage(page);
  const carName = (await details.carTitle.textContent())!.trim();

  // Enabled only because the profile was completed in Step 13
  await expect(details.addToCartButton).toBeEnabled();
  await details.addToCart(futureDate(offset), futureDate(offset + 2));

  await expect(page).toHaveURL(/\/Customer\/Cart/);
  const cart = new CartPage(page);
  const row = cart.rowFor(carName);
  await expect(row).toBeVisible();

  // Clean up so the next run starts with an empty cart
  await row.getByRole('button', { name: 'Remove' }).click();
  await expect(row).toBeHidden();
});

test('empty cart shows a message and a link to browse cars', async ({ page }) => {
  const cart = new CartPage(page);
  await page.goto('/Customer/Cart');

  await expect(page.getByRole('heading', { name: 'My Cart' })).toBeVisible();
  await expect(cart.emptyMessage).toBeVisible();

  await page.getByRole('main').getByRole('link', { name: 'Browse Cars' }).click();
  await expect(page).toHaveURL(/\/Customer\/Brands/);
});

test('cart shows correct days, subtotal and grand total', async ({ page }) => {
  const nights = 3;
  const parseMoney = (text: string) => Number(text.replace(/[^0-9.]/g, ''));

  const carName = await addFirstCarToCart(page, nights);
  const cart = new CartPage(page);
  const row = cart.rowFor(carName);
  const cells = row.getByRole('cell');

  // Columns: Car, Dates, Days, Price/Day, Subtotal, Remove
  const days = Number(await cells.nth(2).innerText());
  const pricePerDay = parseMoney(await cells.nth(3).innerText());
  const subtotal = parseMoney(await cells.nth(4).innerText());
  const grandTotal = parseMoney(
    await page.getByRole('heading', { name: /Grand Total/ }).innerText()
  );

  expect(days).toBe(nights);
  expect(subtotal).toBeCloseTo(days * pricePerDay, 2);
  expect(grandTotal).toBeCloseTo(subtotal, 2); // only one item in the cart

  // Clean up so the cart is empty again
  await row.getByRole('button', { name: 'Remove' }).click();
  await expect(row).toBeHidden();
});