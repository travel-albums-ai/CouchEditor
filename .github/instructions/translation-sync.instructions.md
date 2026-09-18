---
name: translation-sync-at-task-end
description: At the end of every workspace task, verify that all locale JSON files remain synchronized with src/locales/en.json and translate any missing keys.
applyTo: "**"
---

# End-of-Task Translation Check

At the end of every task, before reporting completion, perform an end-of-task locale comparison against `src/locales/en.json`:

Compare `en.json` against all locale JSON files in `src/locales/*.json`.

1. Parse `src/locales/en.json` and every other `src/locales/*.json` file as JSON.
2. Compare recursive leaf key paths with `en.json` as the source of truth and report missing and extra keys.
3. For each locale with missing English keys, add natural translations while preserving the locale's existing terminology and register.
4. Preserve placeholders and interpolation tokens exactly, including tokens such as `{{count}}`, `{{name}}`, `{{version}}`, `{{selected}}`, `{{total}}`, `{{number}}`, and `{{model}}`.
5. Report extra locale keys, but do not delete them automatically.
6. Reparse all changed locale files and rerun the key comparison after any edits as post-edit revalidation.

Use the `translation-sync` skill for the detailed translation and validation workflow. A task is complete only after the locale files parse successfully and no English leaf keys are missing from any locale, unless a blocker is explicitly reported.

This check applies even when the task did not modify translations, because `en.json` may have changed during the task or may already contain unsynchronized keys.
