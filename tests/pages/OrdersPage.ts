import { Page, Locator } from '@playwright/test';

export class OrdersPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly rows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Rental Orders' });
        // Shows either order rows or DataTables' "No data available" row
        this.rows = page.locator('#orderTable tbody tr');
    }
    async goto() {
        // The table fills via AJAX, so wait for that call to finish
        const loaded = this.page.waitForResponse((r) =>
            r.url().includes('/Admin/Orders/GetAll')
        );
        await this.page.goto('/Admin/Orders');
        await loaded;
    }
}