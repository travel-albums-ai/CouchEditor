---
name: readme-updater
description: Update the CouchEditor README with accurate usage, development, toolkit, workflow, and screenshot documentation.
---

# README Updater

Maintain `README.md` as the user-facing guide for CouchEditor. Keep the writing practical and beginner-friendly while verifying product details against the current application source.

## Scope

- Update `README.md` and use only documentation images from `screenshots/` unless the request explicitly names another asset.
- Do not change application code, localization files, or generated screenshots as part of a README update.
- Preserve useful existing explanations and improve or replace stale sections instead of duplicating them.

## Source of Truth

Before editing, inspect the smallest relevant sources:

- `package.json` for install, development, build, lint, preview, and screenshot commands.
- `src/pipeline/NodePalette.tsx` for the available toolbox groups and node types.
- `src/pipeline/NodeToolbox.tsx` for toolbox behavior such as search, drag-and-drop, and optional AI filtering.
- Nearby toolbar, settings, and help components when documenting a visible control or workflow.

Do not infer a feature from an old README paragraph alone. Verify names and behavior in source, and use cautious wording for optional integrations or environment-dependent features.

## Required README Coverage

Keep these user paths easy to find:

1. What CouchEditor is and what a pipeline does.
2. How to use it: choose photos, add nodes, connect nodes, adjust controls, preview results, and download output.
3. How to run it locally: `npm install`, `npm run dev`, and the relevant production commands from `package.json`.
4. The available toolkit, grouped as:
   - Input
   - Logic
   - Transform
   - Light
   - Color
   - Detail
   - Effects
   - AI
   - Output
5. Common usage flows, at minimum:
   - quick edit: input -> transform or adjustment -> viewer;
   - repeatable recipe: build, save, clone, export, and import a `.cep` pipeline;
   - inspection: viewer, histogram, metadata, or map output where supported;
   - optional AI workflow, including required settings or keys when applicable.
6. Saving, sharing, browser storage limitations, and the fact that a `.cep` file contains the recipe rather than the original photos.
7. A short developer section with verified commands and links to the license.

## Stable Screenshot Policy

Use the untimestamped aliases below. Do not reference files containing `YYYY-MM-DD` in README documentation because those are dated capture artifacts.

| README location | Image | Purpose |
|---|---|---|
| Introduction or overview | `screenshots/couch-editor.png` | Show the main application surface. |
| Getting started or basic usage | `screenshots/couch-editor-toolbox.png` | Show the toolbox and available node groups. |
| Saving, settings, or configuration | `screenshots/couch-editor-settings.png` | Show application settings. |
| Optional AI section | `screenshots/couch-editor-settings-onboarding-ai.png` | Show AI onboarding or configuration. |
| Themes or personalization | `screenshots/couch-editor-settings-onboarding-themes.png` | Show theme onboarding when relevant. |
| Templates or repeatable recipes | `screenshots/couch-editor-templates.png` | Show pipeline templates. |
| Help or troubleshooting | `screenshots/couch-editor-help.png` | Show in-app help. |

Use each image where it helps explain the nearby workflow, with useful alt text. Avoid decorative repetition. Keep image paths relative to the repository root, for example `![CouchEditor workspace](./screenshots/couch-editor.png)`.

## Procedure

1. Read the current README and identify stale claims, placeholders, duplicated sections, and existing image references.
2. Verify the requested behavior against the source files listed above and `package.json`.
3. Compare `screenshots/` filenames and dimensions. Select only the stable untimestamped aliases from the screenshot map.
4. Edit the README in a coherent order: overview, getting started, toolkit, usage flows, saving and sharing, results, optional features, local development, and license.
5. Replace image placeholders with the best matching stable screenshots. Keep screenshots near the section they illustrate and do not place images in a section that makes claims they do not show.
6. Check that every command, node group, button name, file extension, and limitation is either source-verified or clearly marked as optional.
7. Search the finished README for dated screenshot names, broken relative paths, duplicate headings, and leftover image placeholders.
8. Run the repository's available documentation-adjacent checks, at minimum `npm run lint` when the environment supports it, and report any unrelated failures without modifying application code.

## Completion Checklist

- README explains how to use CouchEditor and how to run it locally.
- Toolkit groups and usage flows match the current source.
- Stable screenshots are placed beside the workflows they document.
- No dated screenshot filenames are referenced.
- No stale placeholders or unsupported claims remain.
- Commands and links are readable and relative paths resolve.
