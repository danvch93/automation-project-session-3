import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly path = '/';

  private readonly cookieBannerDismissButton: Locator;
  private readonly heroPromoSection: Locator;
  private readonly searchInput: Locator;
  private readonly topNavLinks: Locator;
  private readonly headerCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.cookieBannerDismissButton = page.getByRole('button', { name: /accept/i }).first();
    this.heroPromoSection = page.locator('main section').first();
    this.searchInput = page.locator('input[type="search"], input[placeholder*="caut"]');
    this.topNavLinks = page.locator('[data-testid=menu-wrapper] li');
    this.headerCartLink = page
      .locator('a[href*="cart"], a[href*="cos"], a[href*="checkout"]')
      .first();
  }

  async acceptCookiesIfPresent(): Promise<void> {
    if (await this.cookieBannerDismissButton.isVisible().catch(() => false)) {
      await this.click(this.cookieBannerDismissButton);
    }
  }

  async expectHeroVisible(): Promise<void> {
    await expect(this.heroPromoSection).toBeVisible();
  }

  async searchFor(term: string): Promise<void> {
    this.click(this.page.locator('[id=header-search-bar-input]'));
    await this.page.locator('[id=header-search-bar-input]').fill(term);
    await this.waitForElementVisible(this.page.locator('div[data-testid=search-bar-results]'));
    this.click(this.page.locator('button[aria-label="Incepe cautarea"]'));
    await this.waitForElementVisible(this.page.locator('div[data-testid="search-results-list-wrapper"]'));
  }

  async expectTopNavContains(label: string): Promise<void> {
    const count = await this.topNavLinks.filter({ hasText: label }).count();
    expect(count, `Expected at least one top navigation entry containing "${label}".`).toBeGreaterThan(0);
  }

  async openCart(): Promise<void> {
    if (await this.headerCartLink.isVisible().catch(() => false)) {
      await this.click(this.headerCartLink);
    } else {
      await this.page.goto('/cart');
    }
  }

  async getCartCount(): Promise<number> {
    if (!(await this.headerCartLink.isVisible().catch(() => false))) {
      return 0;
    }
    const textContent =
      (await this.headerCartLink.textContent({ timeout: 2000 }).catch(() => null)) ?? '';
    const match = textContent.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async waitForCartCount(expectedCount: number): Promise<void> {
    await expect
      .poll(async () => this.getCartCount(), { timeout: 10000 })
      .toBe(expectedCount);
  }
}

