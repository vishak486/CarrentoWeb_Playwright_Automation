import {Page,Locator} from '@playwright/test'

export class LoginPage{
    readonly page:Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page:Page){
        this.page=page;
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password', { exact: true });
        this.loginButton = page.getByRole('button', { name: 'Log in' });
        this.errorMessage = page.getByText('Invalid login attempt.');
    }

    async goto(){
        await this.page.goto('/Identity/Account/Login');
    }
    async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    }
}
