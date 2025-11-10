import { test } from '@playwright/test';
import { HomeFlow } from '../src/flows/HomeFlow';

test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('Mega Image storefront smoke', () => {
  test('displays core navigation and allows search', async ({ page }, testInfo) => {
    const flow = new HomeFlow(page, testInfo);

    await flow.openHome();
    await flow.acceptCookiesIfPresent();
    await flow.verifyHeroVisible();
    await flow.assertTopNavContains('Supermarket Online');
    await flow.search('cafea');
  });
});

