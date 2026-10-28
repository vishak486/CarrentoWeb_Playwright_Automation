import { test, expect } from '@playwright/test';
import { CarDetailsPage } from '../pages/CarDetailsPage';
import { CartPage } from '../pages/CartPage';
import { futureDate } from '../../utils/dates';
import { addFirstCarToCart } from '../helpers/cart';
import { stubRazorpay } from '../helpers/razorpay';
import { OrdersPage } from '../pages/OrdersPage';

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

test('customer pays with a stubbed Razorpay checkout, then admin cancels the order', async ({ page, browser }) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  test.skip(!keySecret, 'RAZORPAY_KEY_SECRET is not set');

  await stubRazorpay(page, keySecret!);
  const carName = await addFirstCarToCart(page, 2);

  // Checkout and pay (the order is created on the server, then the stub "pays")
  await page.getByRole('link', { name: 'Proceed to Checkout' }).click();
  await expect(page).toHaveURL(/\/Customer\/Checkout/);
  await page.getByRole('button', { name: 'Pay', exact: true }).click();

  await expect(page).toHaveURL(/\/Customer\/Order\/Success\?orderId=\d+/, { timeout: 20000 });
  await expect(page.getByRole('heading', { name: 'Payment Successful' })).toBeVisible();
  const orderId = new URL(page.url()).searchParams.get('orderId')!;

  // The order appears in My Orders as Completed
  await page.goto('/Customer/Order');
  const myRow = page
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: orderId, exact: true }) });
  await expect(myRow).toContainText('Completed');
  await expect(myRow).toContainText(carName);

  // Clean up: an admin session cancels the order (this also marks the payment refunded)
  const adminContext = await browser.newContext({
    baseURL: test.info().project.use.baseURL,
    storageState: 'playwright/.auth/admin.json',
  });
  const adminPage = await adminContext.newPage();
  const ordersPage = new OrdersPage(adminPage);
  await ordersPage.goto();

  const adminRow = adminPage
    .getByRole('row')
    .filter({ has: adminPage.getByRole('cell', { name: orderId, exact: true }) });
  adminPage.once('dialog', (dialog) => dialog.accept());
  await adminRow.getByRole('button', { name: 'Cancel' }).click();
  await expect(adminRow).toContainText('Cancelled');
  await adminContext.close();
});