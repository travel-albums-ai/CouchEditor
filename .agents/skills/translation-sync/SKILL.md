---
name: translation-sync
description: When the user says translations are needed, synchronize localized JSON translations with en.json and validate locale coverage.
---

# Translation Sync

Run this skill only when the user explicitly says that translations are needed. At that point, keep `src/locales/en.json` as the source of truth for translation keys. Preserve the existing locale file structure and terminology while adding translations for every English leaf key.

## Scope

- Work only in `src/locales` unless the request explicitly includes another area.
- Treat keys as identifiers: do not rename, remove, or reorder existing keys unless requested.
- Translate missing values into the target locale; do not copy English text as a fallback except for brand names, product names, technical acronyms, or terms intentionally unchanged in the locale.
- Preserve interpolation tokens exactly, including `{{name}}`, `{{count}}`, `{{version}}`, `{{selected}}`, `{{total}}`, `{{number}}`, and `{{model}}`.
- Preserve intentional punctuation, ellipses, capitalization, units, and markup-like text unless the target language requires a grammatical change.
- Do not overwrite existing translations merely to improve wording unless explicitly asked.

## Procedure

1. Identify the target locale file or all locale files requested. If no target is specified, inspect every `src/locales/*.json` file except `en.json`.
2. Parse `en.json` and the target locale as JSON before editing. Stop and report malformed JSON rather than guessing.
3. Compare recursive leaf key paths. Report both:
   - missing keys: present in `en.json` but absent from the target locale;
   - extra keys: present in the target locale but absent from `en.json`.
4. Read nearby existing translations to match the locale's register, terminology, and naming conventions.
5. Add only missing keys with natural translations. Keep technical names such as `GitHub`, `Google Drive`, `OpenAI`, `EXIF`, `GPS`, `LUT`, `BYOK`, and `AI` consistent with the locale unless an established translation already exists.
6. Check every changed value for placeholder parity against its English counterpart. Every token in the English value must occur in the translated value exactly as written.
7. Parse the edited JSON again and rerun the recursive key comparison.
8. Report the number of translated keys, any extra keys found, and validation results.

## Recommended Validation

Use a small read-only script or equivalent JSON tooling to compare leaf paths and placeholders. A locale is synchronized only when:

- both JSON files parse successfully;
- no English leaf keys are missing from the locale;
- changed translations preserve all English interpolation tokens.

Extra locale keys should be reported for review, but should not be deleted automatically because they may be intentional compatibility keys.

## Review Mode

When asked to review rather than translate:

- report missing keys first, ordered by file;
- flag untranslated English values only when they are not an intentional brand or technical term;
- flag placeholder mismatches as errors;
- do not edit files unless the user also asks for fixes.

## Completion Report

Keep the final report concise:

```text
Locale: <locale>
Added: <count> missing translations
Missing English keys: <count>
Extra locale keys: <count>
Validation: <JSON and placeholder status>
```
