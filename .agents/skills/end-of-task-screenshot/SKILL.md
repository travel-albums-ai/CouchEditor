---
name: end-of-task-screenshot
description: At the end of every workspace task, run a Playwright smoke capture and save a timestamped screenshot of the application in screenshots.
---

# End-of-Task Screenshot

After completing every workspace task, capture the current application state with Playwright and save the PNG under `screenshots/`.

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
- Name files `couch-editor-YYYY-MM-DD-HH-mm-ss.png` using the local current date and time.
- Never overwrite an existing screenshot; the timestamped name should identify each task capture.
- Also refresh the stable aliases `couch-editor.png`, `couch-editor-settings.png`, `couch-editor-templates.png`, and `couch-editor-help.png`; these files intentionally overwrite the previous run's aliases.
- If the app cannot be started or reached, report the failure instead of claiming a screenshot was created.

## Validation

The bundled script creates `screenshots/` when needed, launches Chromium, navigates to the configured URL, captures the page, writes both timestamped captures and stable aliases, and prints the absolute output paths. Playwright must be available in the environment, either from the repository dependencies or the agent's configured Node runtime.
