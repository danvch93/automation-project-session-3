import { test } from '@playwright/test';
import { CartFlow } from '../src/flows/CartFlow';

test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('Mega Image cart flows', () => {
  test('add two products to cart and verify contents', async ({ page }, testInfo) => {
    const flow = new CartFlow(page, testInfo);

    await flow.openHome();
    await flow.acceptCookiesIfPresent();
    await flow.search('lapte');
    await flow.addProductAt(0);
    await flow.addProductAt(1);
    await flow.openCart();
    await flow.verifyCartContainsSelectedProducts();
  });
});

