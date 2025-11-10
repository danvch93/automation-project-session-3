import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly path = '/cart';

  private readonly cartContainer: Locator;
  private readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.cartContainer = page.locator('main');
    this.cartItems = this.cartContainer.locator('li').filter({
      has: page.getByRole('button', { name: /adauga 1 produs/i }),
    });
  }

  async waitForLoaded(): Promise<void> {
    await this.waitForElementVisible(this.cartItems.first());
  }

  async getCartItemNames(): Promise<string[]> {
    await this.waitForLoaded();
    const nameLocators = this.cartItems.locator('h2, h3');
    const texts = await nameLocators.allTextContents();
    return texts.map((text) => text.trim()).filter((text) => text.length > 0);
  }

  async expectItems(productNames: string[]): Promise<void> {
    const cartNames = await this.getCartItemNames();
    for (const name of productNames) {
      const matched = cartNames.some((cartName) =>
        cartName.toLowerCase().includes(name.toLowerCase()),
      );
      expect(matched, `Expected cart to contain product similar to "${name}".`).toBeTruthy();
    }
  }
}

