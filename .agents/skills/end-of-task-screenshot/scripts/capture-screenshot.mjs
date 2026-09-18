import { copyFile, mkdir } from 'node:fs/promises';
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
].join('-');
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
const toolboxOutputPath = path.join(
  screenshotsDirectory,
  `couch-editor-${timestamp}-toolbox.png`,
);
const stableToolboxOutputPath = path.join(screenshotsDirectory, 'couch-editor-toolbox.png');
const stableOutputPath = path.join(screenshotsDirectory, 'couch-editor.png');
const stableSettingsOutputPath = path.join(
  screenshotsDirectory,
  'couch-editor-settings.png',
);
const stableSettingsOnboardingThemesPath = path.join(
  screenshotsDirectory,
  'couch-editor-settings-onboarding-themes.png',
);
const stableSettingsOnboardingAIPath = path.join(
  screenshotsDirectory,
  'couch-editor-settings-onboarding-ai.png',
);
const settingsOnboardingThemes = path.join(
  screenshotsDirectory,
  `couch-editor-${timestamp}-settings-onboarding-themes.png`,
);
const settingsOnboardingAI = path.join(
  screenshotsDirectory,
  `couch-editor-${timestamp}-settings-onboarding-ai.png`,
);
const stableTemplatesOutputPath = path.join(
  screenshotsDirectory,
  'couch-editor-templates.png',
);
const stableHelpOutputPath = path.join(screenshotsDirectory, 'couch-editor-help.png');

const helpScreenshotsDirectory = path.join(screenshotsDirectory, 'help');

await mkdir(screenshotsDirectory, { recursive: true });
await mkdir(helpScreenshotsDirectory, { recursive: true });

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.screenshot({ path: outputPath, fullPage: true });
  await copyFile(outputPath, stableOutputPath);
  console.log(`Screenshot captured: ${outputPath}`);

  await page.locator('#onboarding-next-button').click();
  await page.screenshot({ path: settingsOnboardingThemes, fullPage: true });
  await copyFile(settingsOnboardingThemes, stableSettingsOnboardingThemesPath);
  console.log(`Settings screenshot captured: ${settingsOnboardingThemes}`);

  await page.locator('#onboarding-next-button').click();
  await page.screenshot({ path: settingsOnboardingAI, fullPage: true });
  await copyFile(settingsOnboardingAI, stableSettingsOnboardingAIPath);
  console.log(`Settings screenshot captured: ${settingsOnboardingAI}`);

  await page.keyboard.press('Escape');

  await page.locator('#settings-toggle').click();
  await page.screenshot({ path: settingsOutputPath, fullPage: true });
  await copyFile(settingsOutputPath, stableSettingsOutputPath);
  console.log(`Settings screenshot captured: ${settingsOutputPath}`);

  await page.keyboard.press('Escape');

  await page.locator('#templates-toggle').click();
  await page.screenshot({ path: templatesOutputPath, fullPage: true });
  await copyFile(templatesOutputPath, stableTemplatesOutputPath);
  console.log(`Templates screenshot captured: ${templatesOutputPath}`);

  await page.keyboard.press('Escape');

  await page.locator('#help-toggle').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: helpOutputPath, fullPage: true });
  await copyFile(helpOutputPath, stableHelpOutputPath);
  console.log(`Help screenshot captured: ${helpOutputPath}`);

  await page.locator('#help-independent-switch').click();
  const nextHelpItemButton = page.locator('#help-next-independent-item');
  const capturedHelpItems = new Set();

  await nextHelpItemButton.click();

  while (true) {
    const helpItem = page.locator('[id^="help-item-"]').first();
    await helpItem.waitFor({ state: 'visible' });
    const helpItemId = await helpItem.getAttribute('id');

    if (!helpItemId || capturedHelpItems.has(helpItemId)) {
      break;
    }

    await helpItem.screenshot({
      path: path.join(helpScreenshotsDirectory, `${helpItemId}.png`),
    });
    capturedHelpItems.add(helpItemId);

    await nextHelpItemButton.click();
  }

  console.log(`Help item screenshots captured: ${capturedHelpItems.size}`);

  await page.keyboard.press('Escape');

  await page.locator('#toggle-toolbox-toggle').click();
  await page.locator('#toolbox-wrapper').evaluate((element) => {
    element.style.maxHeight = 'unset';
  });
  await page.locator('#toolbox').screenshot({ path: toolboxOutputPath });
  await copyFile(toolboxOutputPath, stableToolboxOutputPath);
  console.log(`Toolbox screenshot captured: ${toolboxOutputPath}`);
} finally {
  await browser.close();
}
