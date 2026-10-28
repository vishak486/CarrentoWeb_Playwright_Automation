import { Page, Locator } from '@playwright/test';

export class ContactSection {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly subjectInput: Locator;
    readonly messageInput: Locator;
    readonly sendButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.getByLabel('Your Name', { exact: true });
        this.emailInput = page.getByLabel('Your Email', { exact: true });
        this.subjectInput = page.getByLabel('Subject', { exact: true });
        this.messageInput = page.getByLabel('Message', { exact: true });
        this.sendButton = page.getByRole('button', { name: 'Send Message' });
    }

    async send(name: string, email: string, subject: string, message: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.subjectInput.fill(subject);
        await this.messageInput.fill(message);
        await Promise.all([
            this.page.waitForResponse(
                (r) => r.url().includes('/Customer/Home/Contact') && r.request().method() === 'POST'
            ),
            this.sendButton.click(),
        ]);
    }
}