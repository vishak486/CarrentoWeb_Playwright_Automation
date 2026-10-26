import { Page, Locator } from '@playwright/test';

export class BrandsPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly createLink: Locator;
    readonly statusButtons: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Brands List' });
        this.createLink = page.getByRole('link', { name: 'Create New Brand' });
        this.statusButtons = page.locator('#brandTable .toggle-status');
    }
     async goto() {
        const loaded = this.page.waitForResponse((r) =>
            r.url().includes('/Admin/Brands/GetAll')
        );
        await this.page.goto('/Admin/Brands');
        await loaded;
     }
    
}