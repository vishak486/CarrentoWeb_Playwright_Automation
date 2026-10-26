import {test,expect} from '@playwright/test'

test('Smoke Test',async({page})=>{
    await page.goto('/')
    await expect(page).toHaveTitle(/CarRentoWeb/);
    await expect(
    page.getByRole('heading', { name: /Drive Your Journey With CarRentoWeb/i })
  ).toBeVisible();
})