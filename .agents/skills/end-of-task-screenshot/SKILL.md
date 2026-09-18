---
name: end-of-task-screenshot
description: When the user says a new version is being released, run a Playwright smoke capture and save a timestamped screenshot of the application in screenshots as the release screenshot check.
---

# End-of-Task Screenshot

Run this skill only when the user explicitly says that a new version is being released. At that point, capture the current application state with Playwright and save the PNG under `screenshots/`.

## Procedure

1. Ensure the app is reachable. Use an already-running app when available; otherwise start the repository dev server with `npm run dev -- --host 127.0.0.1` and keep it running while the capture executes.
2. Run the bundled capture script from the repository root:

   ```sh
   node .agents/skills/end-of-task-screenshot/scripts/capture-screenshot.mjs
   ```

3. Set `PLAYWRIGHT_BASE_URL` when the app is not at the default `http://127.0.0.1:5173`:

   ```sh
   PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173 node .agents/skills/end-of-task-screenshot/scripts/capture-screenshot.mjs
   ```

4. Confirm that the script reports a successful navigation and the output file exists in `screenshots/`.
5. Mention the generated screenshot path in the task completion report.

## Capture Requirements

- Use Playwright with Chromium.
- Wait for the page to reach a stable load state before capturing.
- Capture the full page as a PNG.
- Name files `couch-editor-YYYY-MM-DD.png` using the local current date only.
- Date-based captures are refreshed when the task runs again on the same day.
- Capture the onboarding themes and onboarding AI states as `couch-editor-YYYY-MM-DD-settings-onboarding-themes.png` and `couch-editor-YYYY-MM-DD-settings-onboarding-ai.png`.
- Also refresh the stable aliases `couch-editor.png`, `couch-editor-settings.png`, `couch-editor-settings-onboarding-themes.png`, `couch-editor-settings-onboarding-ai.png`, `couch-editor-templates.png`, `couch-editor-help.png`, and `couch-editor-toolbox.png`; these files intentionally overwrite the previous run's aliases.
- If the app cannot be started or reached, report the failure instead of claiming a screenshot was created.

## Validation

The bundled script creates `screenshots/` when needed, launches Chromium, navigates to the configured URL, captures the initial, onboarding, settings, templates, help, and toolbox states, writes both date-based captures and stable aliases, and prints the absolute output paths. Playwright must be available in the environment, either from the repository dependencies or the agent's configured Node runtime.

The per-function help captures are written under `screenshots/help/` using the exact DOM-derived name `help-item-${labelKey+groupKey}.png`. Preserve the concatenated `labelKey` and `groupKey` format without inserting a separator; these files are consumed by the math-functions documentation skill.
