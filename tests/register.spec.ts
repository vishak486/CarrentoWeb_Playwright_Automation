import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage';

test('mismatched passwords show a validation error', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  await registerPage.goto();
  await registerPage.register(
    `autotest_${Date.now()}@example.com`,
    'Test@12345',
    'Different@999'
  );

  await expect(
    page.getByText('The password and confirmation password do not match.')
  ).toBeVisible();
  await expect(page).toHaveURL(/\/Identity\/Account\/Register/);
});

test('new customer can register and is logged in', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  await registerPage.goto();
  await registerPage.register(
    `autotest_${Date.now()}@example.com`,
    'Test@12345',
    'Test@12345'
  );

  // Registration signs the user in and sends them to the home page
  await expect(page).toHaveURL(/carrentoweb\.runasp\.net\/?$/);
  await expect(page.getByRole('link', { name: 'Login' })).toBeHidden();
  await expect(page.getByRole('link', { name: 'Register' })).toBeHidden();
});