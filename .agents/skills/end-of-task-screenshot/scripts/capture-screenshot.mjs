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

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
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

await mkdir(screenshotsDirectory, { recursive: true });

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log(`Screenshot captured: ${outputPath}`);
} finally {
  await browser.close();
}
