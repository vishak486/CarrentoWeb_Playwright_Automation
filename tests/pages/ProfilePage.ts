import { Page, Locator } from '@playwright/test';

export class ProfilePage {
    readonly page: Page;
    readonly fullNameInput: Locator;
    readonly phoneInput: Locator;
    readonly addressInput: Locator;
    readonly licenseInput: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.fullNameInput = page.getByLabel('Full Name');
        this.phoneInput = page.getByLabel('Phone number');
        this.addressInput = page.getByLabel('Address');
        this.licenseInput = page.getByLabel('Driving License Number');
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

    async goto() {
        await this.page.goto('/Identity/Account/Manage');
    }

    async fillAndSave(fullName: string, phone: string, address: string, license: string) {
        await this.fullNameInput.fill(fullName);
        await this.phoneInput.fill(phone);
        await this.addressInput.fill(address);
        await this.licenseInput.fill(license);
        await this.saveButton.click();
    }
}