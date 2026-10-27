import { Page, Locator } from '@playwright/test'

export type CarDetails = {
    name: string;
    model: string;
    year: string;
    transmission: string;
    fuelType: string;
    seats: string;
    pricePerDay: string;
    status: 'Available' | 'Rented' | 'Maintenance';
}

export class CreateCarPage {
    readonly page: Page;
     readonly brandSelect: Locator;
     readonly nameInput: Locator;
     readonly modelInput: Locator;
     readonly yearInput: Locator;
     readonly transmissionInput: Locator;
     readonly fuelTypeInput: Locator;
     readonly seatsInput: Locator;
     readonly priceInput: Locator;
    readonly statusSelect: Locator;
    readonly createButton: Locator;

    constructor(page:Page)
    {
        this.page = page;
        this.brandSelect = page.locator('select[name="BrandId"]');
        this.nameInput = page.locator('input[name="CarName"]');
        this.modelInput = page.locator('input[name="Model"]');
        this.yearInput = page.locator('input[name="Year"]');
        this.transmissionInput = page.locator('input[name="Transmission"]');
        this.fuelTypeInput = page.locator('input[name="FuelType"]');
        this.seatsInput = page.locator('input[name="SeatingCapacity"]');
        this.priceInput = page.locator('input[name="PricePerDay"]');
        this.statusSelect = page.locator('select[name="Status"]');
        this.createButton = page.getByRole('button', { name: 'Create', exact: true });
    }
    async goto() {
        await this.page.goto('/Admin/Cars/Create');
    }
    async create(car: CarDetails, imagePath: string) {
         await this.brandSelect.selectOption({ index: 1 });
         await this.nameInput.fill(car.name);
         await this.modelInput.fill(car.model);
         await this.yearInput.fill(car.year);
         await this.transmissionInput.fill(car.transmission);
         await this.fuelTypeInput.fill(car.fuelType);
         await this.seatsInput.fill(car.seats);
         await this.priceInput.fill(car.pricePerDay);
         await this.statusSelect.selectOption(car.status);
         await this.page.locator('input[name="image1"]').setInputFiles(imagePath);
         await this.page.locator('input[name="image2"]').setInputFiles(imagePath);
         await this.page.locator('input[name="image3"]').setInputFiles(imagePath);
         await this.createButton.click();
    }
}