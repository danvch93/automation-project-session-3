import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  readonly path = '/search';

  private readonly resultList: Locator;
  private readonly productItems: Locator;
  private readonly addressDialog: Locator;
  private readonly addressDialogClose: Locator;
  private readonly addressDialogConfirm: Locator;

  constructor(page: Page) {
    super(page);
    this.resultList = page.locator('[data-testid=search-results-list-wrapper]');
    this.productItems = this.resultList.locator('[data-testid=product-block]');
    this.addressDialog = page.getByRole('dialog', { name: /adauga adresa/i });
    this.addressDialogClose = this.addressDialog.getByRole('button', {
      name: /(închide|inchide)/i,
    });
    this.addressDialogConfirm = this.addressDialog.getByRole('button', { name: /confirma/i });
  }

  async waitForResults(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForElementVisible(this.resultList);
    await this.waitForElementVisible(this.productItems.first());
  }

  async addFirstProductToCart(): Promise<string> {
    return this.addProductAt(0);
  }

  async addProductAt(index: number): Promise<string> {
    await this.waitForResults();

    const item = this.productItems.nth(index);
    await item.scrollIntoViewIfNeeded();
    await this.waitForElementVisible(item);
    await item.hover();

    const titleLocator = item.locator(
      'h1, h2, h3, a[title], a[class*="title"], span[class*="title"], p strong, p',
    );

    const rawTitle = (await titleLocator.first().textContent()) ?? '';
    const productName = rawTitle.trim() || 'Unknown product';

    const addButton = await this.locateAddButton(item);
    if (!addButton) {
      throw new Error(`Unable to locate an Add to cart button for product at index ${index}.`);
    }
    await this.click(addButton);

    await this.dismissAddressPrompt();

    return productName;
  }

  private async dismissAddressPrompt(): Promise<void> {
    await this.addressDialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
    const dialogVisible = await this.addressDialog.isVisible().catch(() => false);
    if (!dialogVisible) {
      return;
    }

    if (await this.addressDialogClose.isVisible().catch(() => false)) {
      await this.click(this.addressDialogClose, { force: true });
    } else if (await this.addressDialogConfirm.isVisible().catch(() => false)) {
      await this.click(this.addressDialogConfirm, { force: true });
    }
    await this.addressDialog.waitFor({ state: 'detached', timeout: 10000 }).catch(() => undefined);
  }

  private async locateAddButton(item: Locator): Promise<Locator | null> {
    const candidates: Locator[] = [
      item.getByRole('button', { name: /adauga in cos/i }),
      item.getByRole('button', { name: /adauga 1 produs/i }),
      item.locator('button[aria-label*="adauga" i]'),
      item.locator('button:has-text("+1")'),
      item.locator('button span:has-text("+1")'),
      item.locator('button[title*="adauga" i]'),
    ];

    for (const candidate of candidates) {
      const handle = await candidate.first().elementHandle();
      if (!handle) {
        continue;
      }
      const isVisible = await candidate.first().isVisible().catch(() => false);
      if (!isVisible) {
        continue;
      }
      return candidate.first();
    }

    return null;
  }
}

