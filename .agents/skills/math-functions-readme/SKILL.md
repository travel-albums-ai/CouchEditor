---
name: math-functions-readme
description: Generate and maintain MATH_FUNCTIONS.md with technical documentation for CouchEditor's image-processing stages, formulas, input ranges, clamping rules, and source references.
---

# Math Functions README

Maintain `MATH_FUNCTIONS.md` as the technical reference for CouchEditor's image-processing stages.

## Source of truth

Before editing, inspect:

- `src/lib/utils.ts` for pixel-stage implementations and helper functions.
- `src/lib/lut.ts` for `.cube` LUT parsing, interpolation, domains, and output conversion.
- `src/pipeline/NodePalette.tsx` for user-facing labels, groups, slider ranges, steps, and defaults.
- `src/pipeline/pipeline.worker.ts` for stage registration and runtime composition.

Do not infer an input range from a formula alone when the palette config supplies a UI range. Document both values when they differ:

- **UI range**: the `min`, `max`, `step`, and `defaultValue` configured in `NodePalette.tsx`.
- **Implementation domain**: values accepted by the function and any internal normalization, clamping, or undefined behavior.

## Required content

For every relevant stage in `src/lib/utils.ts` and `lutStage` in `src/lib/lut.ts`, document:

1. Function and pipeline node name.
2. Palette group and purpose.
3. Every input, its meaning, units, UI range, step, default, and implementation domain.
4. The core formula or algorithm, using readable Markdown math.
5. Whether RGB values are clamped, LUT-rounded, or allowed to flow through `Uint8ClampedArray` conversion.
6. Whether alpha is preserved.
7. Important edge cases, defaults, and performance characteristics.

Include pure helpers such as `detectFilmBaseColor` when they materially affect a stage. Include `boxBlur1D` as an implementation detail of HDR rather than as a standalone pipeline node.

## Accuracy rules

- Treat `ImageData.data` as RGBA bytes in the range 0..255 unless the source proves otherwise.
- State that stages mutate the supplied `ImageData` in place.
- Do not claim that a function clamps an input parameter when the implementation does not.
- Call out UI configuration inconsistencies, such as a default outside its configured range.
- Preserve source naming and link to files with relative paths.
- Keep formulas faithful to source order and constants. Mention when a displayed formula is shorthand for the source implementation.
- Do not edit application code or locale files for documentation work.

## Validation

After updating `MATH_FUNCTIONS.md`:

1. Search for every exported stage name in `src/lib/utils.ts` and confirm it is represented.
2. Verify every adjustable stage has a documented UI range from `NodePalette.tsx`, or an explicit note that the UI has no numeric config.
3. Check that formulas and edge-case notes match the current source.
4. Run the repository's available documentation-adjacent checks, normally `npm run lint` when the environment supports it.
5. At task end, perform the repository translation synchronization check and the end-of-task screenshot procedure required by the workspace instructions, even though this skill does not modify locales or UI code.
