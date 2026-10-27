import { Page, expect } from '@playwright/test';
import { CarDetailsPage } from '../pages/CarDetailsPage';
import { futureDate } from '../../utils/dates';

// Browses to the first available car and adds it to the cart. Returns the car name.
export async function addFirstCarToCart(page: Page, nights: number): Promise<string> {
  const offset = 30 + Math.floor(Math.random() * 300);

  await page.goto('/Customer/Brands');
  await page.locator('a[href*="brandId="]').first().click();
  await page.getByRole('link', { name: 'View Details' }).first().click();

  const details = new CarDetailsPage(page);
  const carName = (await details.carTitle.textContent())!.trim();

  await details.addToCart(futureDate(offset), futureDate(offset + nights));
  await expect(page).toHaveURL(/\/Customer\/Cart/);

  return carName;
}