import { test as setup, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage';

const adminFile = 'playwright/.auth/admin.json';
setup('authenticate as admin', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
    await expect(page).toHaveURL(/\/Admin/);
    await page.context().storageState({ path: adminFile });
})