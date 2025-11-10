import type { Page, TestInfo } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { step } from '@steps/stepRunner';

export class HomeFlow {
  private readonly homePage: HomePage;

  constructor(private readonly page: Page, private readonly testInfo: TestInfo) {
    this.homePage = new HomePage(page);
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

  async verifyHeroVisible(): Promise<void> {
    await step(this.testInfo, this.page, 'Verify hero promotions are visible', async () => {
      await this.homePage.expectHeroVisible();
    });
  }

  async assertTopNavContains(label: string): Promise<void> {
    await step(
      this.testInfo,
      this.page,
      `Check primary navigation contains ${label}`,
      async () => {
        await this.homePage.expectTopNavContains(label);
      },
    );
  }

  async search(term: string): Promise<void> {
    await step(this.testInfo, this.page, `Search for ${term}`, async () => {
      await this.homePage.searchFor(term);
    });
  }
}

