import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly table: Locator;
    readonly emptyMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.table = page.getByRole('table');
        this.emptyMessage = page.getByText('Your cart is empty.');
    }
    rowFor(carName: string): Locator {
        return this.table.getByRole('row', { name: carName });
    }
}