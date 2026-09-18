---
name: knip-after-process
description: Run after each coding process or meaningful repository change to detect Knip issues, stop when issues are found, resolve them, and continue only after Knip passes.
---

# Knip After Process

Use this workflow after every coding process, meaningful file change, or completed implementation step in CouchEditor.

## Procedure

1. Run `npm run knip` from the repository root.
2. Treat a non-zero exit code or any reported Knip issue as a blocker. Stop the current process and do not move on to another task.
3. Inspect each finding and fix the underlying unused file, export, dependency, configuration entry, or other issue when it is caused by the current work.
4. Run `npm run knip` again after each fix or related group of fixes.
5. Continue the original process only after Knip completes successfully with no reported issues.

## Rules

- Do not hide findings by weakening Knip configuration or adding ignores unless the repository behavior clearly requires it.
- Keep fixes scoped to the findings and preserve existing user changes.
- Report unrelated pre-existing findings instead of silently ignoring them, then ask whether the workflow should continue if they cannot be resolved safely.
- A clean Knip run is required before final validation and before declaring the process complete.
