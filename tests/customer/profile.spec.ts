import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/ProfilePage';

test('customer can complete their profile', async ({ page }) => {
  const profilePage = new ProfilePage(page);

  await profilePage.goto();
  await profilePage.fillAndSave(
    'Auto Test Customer',
    '9876543210',
    'Test Street, Kochi',
    'KL07 20240001234'
  );

  await expect(page.getByText('Your profile has been updated')).toBeVisible();

  // Confirm the values were really saved, not just shown
  await page.reload();
  await expect(profilePage.fullNameInput).toHaveValue('Auto Test Customer');
  await expect(profilePage.licenseInput).toHaveValue('KL07 20240001234');
});