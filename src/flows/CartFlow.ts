import type { Page, TestInfo } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { CartPage } from '@pages/CartPage';
import { step } from '@steps/stepRunner';

export class CartFlow {
  private readonly homePage: HomePage;
  private readonly searchResultsPage: SearchResultsPage;
  private readonly cartPage: CartPage;
  private readonly selectedProducts: string[] = [];

  constructor(private readonly page: Page, private readonly testInfo: TestInfo) {
    this.homePage = new HomePage(page);
    this.searchResultsPage = new SearchResultsPage(page);
    this.cartPage = new CartPage(page);
  }

  async openHome(): Promise<void> {
    await step(this.testInfo, this.page, 'Navigate to Mega Image home page', async () => {
      await this.homePage.goto();
    });
  }

  async acceptCookiesIfPresent(): Promise<void> {
    await step(this.testInfo, this.page, 'Accept cookies banner if present', async () => {
      await this.homePage.acceptCookiesIfPresent();
    });
  }

  async search(term: string): Promise<void> {
    await step(this.testInfo, this.page, `Search for ${term}`, async () => {
      await this.homePage.searchFor(term);
    });
  }

  async addProductAt(index: number): Promise<void> {
    await step(this.testInfo, this.page, `Add product at index ${index + 1} to cart`, async () => {
      const productName = await this.searchResultsPage.addProductAt(index);
      this.selectedProducts.push(productName);
      await this.homePage.waitForCartCount(this.selectedProducts.length);
    });
  }

  async openCart(): Promise<void> {
    await step(this.testInfo, this.page, 'Open cart', async () => {
      await this.homePage.openCart();
    });
  }

  async verifyCartContainsSelectedProducts(): Promise<void> {
    await step(this.testInfo, this.page, 'Verify cart contains added products', async () => {
      await this.cartPage.expectItems(this.selectedProducts);
    });
  }

  getSelectedProducts(): string[] {
    return [...this.selectedProducts];
  }
}

