import { Page, Locator } from '@playwright/test';

export class CarsPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly createLink: Locator;
    readonly updateCarLinks: Locator;
    readonly statusSelects: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Cars List' });
        this.createLink = page.getByRole('link', { name: 'Create New Car' });
        this.updateCarLinks = page.getByRole('link', { name: 'Update Car' });
        this.statusSelects = page.locator('#carTable .status-select');

    }
    async goto() {
    // The table fills via AJAX, so wait for that call to finish
    const loaded = this.page.waitForResponse((r) =>
      r.url().includes('/Admin/Cars/GetAll')
    );
    await this.page.goto('/Admin/Cars');
    await loaded;
  }
}