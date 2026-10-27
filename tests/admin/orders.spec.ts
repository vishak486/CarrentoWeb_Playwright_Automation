import { test, expect } from '@playwright/test';
import { OrdersPage } from '../pages/OrdersPage';

test('orders page shows the heading and table columns', async ({ page }) => {
  const ordersPage = new OrdersPage(page);
  await ordersPage.goto();

  await expect(ordersPage.heading).toBeVisible();
  for (const column of ['Order #', 'Customer', 'Cars', 'Placed On', 'Total', 'Status', 'Car Returned', 'Action']) {
    await expect(page.getByRole('columnheader', { name: column })).toBeVisible();
  }
});

test('orders table finishes loading', async ({ page }) => {
  const ordersPage = new OrdersPage(page);
  await ordersPage.goto();

  await expect(ordersPage.rows.first()).toBeVisible();
});