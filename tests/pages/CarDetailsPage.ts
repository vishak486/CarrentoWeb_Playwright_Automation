import { Page, Locator } from '@playwright/test';

export class CarDetailsPage {
    readonly page: Page;
    readonly carTitle: Locator;
    readonly startDateInput: Locator;
    readonly endDateInput: Locator;
    readonly addToCartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.carTitle = page.getByRole('heading', { level: 2 });
        this.startDateInput = page.locator('#rentalStartDate');
        this.endDateInput = page.locator('#rentalEndDate');
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    }
    async addToCart(startDate: string, endDate: string) {
        await this.startDateInput.fill(startDate);
        await this.endDateInput.fill(endDate);
        await this.addToCartButton.click();
    }
}