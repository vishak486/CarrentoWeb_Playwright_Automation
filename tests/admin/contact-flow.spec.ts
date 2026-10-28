import { test, expect } from '@playwright/test';
import { ContactSection } from '../pages/ContactSection';

test('visitor message reaches the admin, who then deletes it', async ({ page, browser }) => {
  const subject = `AUTO_TEST_${Date.now()}`;
  const baseURL = test.info().project.use.baseURL;

  // 1. A separate, logged-out browser session plays the visitor
  const visitorContext = await browser.newContext({
    baseURL,
    storageState: { cookies: [], origins: [] },
  });
  const visitorPage = await visitorContext.newPage();
  await visitorPage.goto('/');
  await new ContactSection(visitorPage).send(
    'Auto Tester',
    'autotest@example.com',
    subject,
    'This is an automated test message.'
  );
  await visitorContext.close();

  // 2. The admin session (this test's own page) finds the message
  await page.goto('/Admin/Contacts');
  await page.getByRole('searchbox').fill(subject);
  const row = page.getByRole('row', { name: new RegExp(subject) });
  await expect(row).toBeVisible();

  // 3. Delete it. The page asks for confirmation with confirm(), so accept that dialog
  page.once('dialog', (dialog) => dialog.accept());
  await row.getByRole('button', { name: 'Delete' }).click();
  await expect(row).toBeHidden();
});