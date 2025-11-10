import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  abstract readonly path: string;

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectUrlContains(partial: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(partial));
  }

  protected async click(
    locator: Locator,
    options?: Parameters<Locator['click']>[0],
  ): Promise<void> {
    await expect(locator).toBeVisible({ timeout: 10000 });
    await locator.click(options);
  }

  protected async sendKeys(
    locator: Locator,
    value: string,
    options?: Parameters<Locator['fill']>[1],
  ): Promise<void> {
    const timeout = options?.timeout ?? 10000;
    await expect(locator).toBeVisible({ timeout });
    await locator.fill(value, options);
  }

  protected async waitForElementVisible(locator: Locator, timeout = 10000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }
}

