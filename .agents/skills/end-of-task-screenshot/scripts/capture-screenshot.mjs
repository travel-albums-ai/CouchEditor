import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  throw new Error(
    'Playwright is required. Install it in the execution environment before running this capture script.',
  );
}

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const screenshotsDirectory = path.join(repositoryRoot, 'screenshots');
const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173';
const now = new Date();
const pad = (value) => String(value).padStart(2, '0');
const timestamp = [
  now.getFullYear(),
  pad(now.getMonth() + 1),
  pad(now.getDate()),
].join('-') + `-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
const outputPath = path.join(screenshotsDirectory, `couch-editor-${timestamp}.png`);
const settingsOutputPath = path.join(
  screenshotsDirectory,
  `couch-editor-${timestamp}-settings.png`,
);
const templatesOutputPath = path.join(
  screenshotsDirectory,
  `couch-editor-${timestamp}-templates.png`,
);
const helpOutputPath = path.join(
  screenshotsDirectory,
  `couch-editor-${timestamp}-help.png`,
);

await mkdir(screenshotsDirectory, { recursive: true });

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log(`Screenshot captured: ${outputPath}`);
  await page.keyboard.press('Escape');
  await page.locator('#settings-toggle').click();
  await page.screenshot({ path: settingsOutputPath, fullPage: true });
  console.log(`Settings screenshot captured: ${settingsOutputPath}`);
  await page.keyboard.press('Escape');
  await page.locator('#templates-toggle').click();
  await page.screenshot({ path: templatesOutputPath, fullPage: true });
  console.log(`Templates screenshot captured: ${templatesOutputPath}`);
  await page.keyboard.press('Escape');
  await page.locator('#help-toggle').click();
  await page.screenshot({ path: helpOutputPath, fullPage: true });
  console.log(`Help screenshot captured: ${helpOutputPath}`);
} finally {
  await browser.close();
}
