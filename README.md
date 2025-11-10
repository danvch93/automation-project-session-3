# Mega Image Frontend Test Automation Framework

Automation framework built with Playwright and TypeScript that follows the Page Object Model pattern, captures screenshots for every test step, and produces HTML reports with embedded evidence.

## Tech Stack

- [Playwright](https://playwright.dev/) for browser automation and test runner
- TypeScript for typings and maintainability
- Custom step helper for reusable step definitions with automatic screenshots
- [Allure](https://docs.qameta.io/allure/) and Playwright HTML reporters for rich visual reporting

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   npm run install:playwright
   ```

2. **Run the smoke test suite**

   ```bash
   npm test
   ```

3. **Open Playwright HTML report**

   ```bash
   npm run report
   ```

4. **Generate and open Allure report**

   ```bash
   npm run allure:generate
   npm run allure:open
   ```

## Project Structure

```
.
├── playwright.config.ts      # Global Playwright configuration
├── src
│   ├── pages                 # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   ├── CartPage.ts
│   │   └── SearchResultsPage.ts
│   ├── flows                 # Business flows that wrap steps & screenshots
│   │   ├── HomeFlow.ts
│   │   └── CartFlow.ts
│   └── steps                 # Shared step helpers with screenshots
│       └── stepRunner.ts
├── tests
│   ├── home.spec.ts          # Example smoke test orchestrated through HomeFlow
│   └── cart.spec.ts          # Adds two items to the cart and validates contents
└── tsconfig.json
```

## Writing Tests with Steps

Use the provided flows to perform business actions while automatically recording Playwright steps and screenshots.

```typescript
import { test } from '@playwright/test';
import { HomeFlow } from '../src/flows/HomeFlow';

test('example', async ({ page }, testInfo) => {
  const flow = new HomeFlow(page, testInfo);
  await flow.openHome();
  await flow.verifyHeroVisible();
});
```

## Environment Configuration

The base URL defaults to `https://www.mega-image.ro/`. Override it with the `BASE_URL` environment variable:

```bash
BASE_URL=https://staging.mega-image.ro npm test
```

Add additional environment variables by creating a `.env` file and loading it prior to invoking Playwright (e.g., using `dotenv` in custom scripts).

## Continuous Integration

- Use `npm test` for headless runs across Chromium, Firefox, and WebKit.
- Collect Allure artifacts (`allure-results`) and publish with `allure-commandline` or your CI’s reporting plugin.
- Playwright trace files are generated on first retry and can be uploaded as build artifacts for advanced debugging.

## Troubleshooting

- Ensure `npm run install:playwright` has been executed on fresh environments to download required browser binaries.
- Delete cached artifacts with `npm run allure:clean` if reports accumulate stale data.
- For interactive debugging, use `npm run test:debug` or `npm run test:headed`.

