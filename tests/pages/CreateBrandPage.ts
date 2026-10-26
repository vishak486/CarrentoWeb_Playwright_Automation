import { Page, Locator } from '@playwright/test';

export class CreateBrandPage {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly logoInput: Locator;
    readonly activeCheckbox: Locator;
    readonly createButton: Locator;

     constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator('input[name="BrandName"]');
        this.logoInput = page.locator('input[name="file"]');
        this.activeCheckbox = page.locator('input[name="IsActive"][type="checkbox"]');
        this.createButton = page.getByRole('button', { name: 'Create', exact: true });
     }

     async goto() {
        await this.page.goto('/Admin/Brands/Create');
    }
    async create(name: string, logoPath: string) {
        await this.nameInput.fill(name);
        await this.logoInput.setInputFiles(logoPath);
        await this.activeCheckbox.check();
        await this.createButton.click();
    }
}