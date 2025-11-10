import { test, TestInfo } from '@playwright/test';
import type { Page } from '@playwright/test';

const sanitize = (title: string) =>
  title
    .replace(/[^\w\d]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

export async function step(
  testInfo: TestInfo,
  page: Page,
  title: string,
  body: () => Promise<void>,
): Promise<void> {
  await test.step(title, async () => {
    try {
      await body();
      await attachScreenshot(testInfo, page, title);
    } catch (error) {
      await attachScreenshot(testInfo, page, `${title}-error`);
      throw error;
    }
  });
}

async function attachScreenshot(testInfo: TestInfo, page: Page, title: string): Promise<void> {
  const screenshot = await page.screenshot({ fullPage: true });
  await testInfo.attach(`screenshot-${sanitize(title)}`, {
    body: screenshot,
    contentType: 'image/png',
  });
}

