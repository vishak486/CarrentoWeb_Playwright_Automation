import {test,expect} from '@playwright/test';
import {LoginPage} from './pages/LoginPage';

test('invalid login shows error message', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('wrong@example.com', 'WrongPass123');

  await expect(loginPage.errorMessage).toBeVisible();
});

test('admin can log in and reach the dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
    await expect(page).toHaveURL(/\/Admin/);
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
})