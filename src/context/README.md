# Context Folder Guide (Human + AI)

This folder contains the app state layer for travel-albums.

It combines two patterns:

- Persistent local state stores backed by `localStorage` via `createLocalStorageStoreNg`.
- Derived global data contexts (in `globals/`) for expensive photo pipelines.

The goal is to keep UI components small, avoid prop drilling, and keep user preferences/session state persistent between reloads.

## 1) Mental model

State flows in two lanes:

1. Persistent user/app settings lane
- Files like `settingsStore.ts`, `filterStore.ts`, `favoritesStore.ts`, etc.
- State survives refresh.
- Updates are immutable and subscription-based.

2. Derived photo-data lane
- Files in `globals/`.
- Values are computed from hooks (fetch/filter/transform pipelines).
- These are not persisted stores, just context snapshots of computed arrays.

Provider nesting in `AppProviders.tsx` wires both lanes together.

## 2) Provider chain and dependency order

`AppProviders.tsx` is the composition root for this folder.

Order matters, especially for derived globals:

- `UnfilteredPhotosProvider` must run before `FilteredPhotosProvider`.
- `FilteredPhotosProvider` must run before `FilteredGpsPhotosProvider`.
- `SectionsProvider` depends on filtered/global data and should stay after those.

High-level order:

- Core settings/theme stores first.
- Feature stores (tags/sidebar/favorites/etc.) next.
- Filtering and photo-card settings next.
- Derived global photo pipeline last.

Mounted at app root in `src/main.tsx`.

## 3) File-by-file reference

### Core composition

- `AppProviders.tsx`
  - Nests all providers in one place.
  - Single source of truth for app-wide state wiring.

- `ThemeContext.tsx`
  - Builds MUI theme from `settingsStore` (`themeMode`, `themeId`).
  - Injects `CssBaseline` + app-wide `GlobalStyles` CSS variables.
  - Calls `useLocaleSync()` so locale side-effects happen at app shell level.

### Persistent stores

- `settingsStore.ts`
  - Broad app configuration store (UI mode, drawers, locale, modules, loading, server mode, etc.).
  - Exports `useSettingsStoreSelector` and command helpers in `useSettings` (`setModule`, `setPreviewPhotoObj`, `setFocusedPhoto`, plus `setSetting`).

- `filterStore.ts`
  - Main filtering state: booleans, ranges, dates, sort order, section include/exclude lists.
  - Uses `Set` fields (`includedPhotos`, `excludedPhotos`) for fast membership checks.
  - Exports `useFilterPhotos` with rich command API (toggle include/exclude, dates, presets, reset).

- `filterPresetStore.ts`
  - Persists named filter presets (`filters[]`, `filterIndex`).
  - Simple CRUD-like API for presets.

- `albumPhotoCardStore.ts`
  - Persists card presentation options (width, height, border radius, gap, details toggles).

- `favoritesStore.ts`
  - Keeps favorite photo IDs/paths.
  - Exposes helpers (`add`, `remove`, `isFavorite`, bulk ops).

- `ignoredStore.ts`
  - Keeps ignored photo IDs/paths.
  - Includes selector-friendly membership helpers.

- `privateStore.ts`
  - Keeps private photo IDs/paths.
  - Similar API shape to ignored/favorites for consistent UX logic.

- `selectedStore.ts`
  - Keeps selected photo IDs/paths for batch actions.
  - Includes `addMany`, `removeMany`, `invertMany`.

- `pinnedStore.ts`
  - Keeps pinned entities (`type_name + id`).
  - Uses key composition (`type::id`) and cached `Set` membership checks.

- `tagsStore.ts`
  - Manages tag definitions and photo-tag relationships.
  - Supports create/delete/update tags and apply/remove tags in bulk.

- `descriptionsStore.ts`
  - Keeps optional user descriptions for photos.
  - Supports upserting, reading, and removing descriptions individually or in bulk.

- `labelsStore.ts`
  - Stores raw image labels per photo + computed primary grouped labels.
  - Contains a large semantic mapping dictionary and rebuilds primary index after updates.

- `sidebarStore.ts`
  - Sidebar sorting and expanded/collapsed section state.
  - Section names are typed from constant tuple for safety.

 - `adjustmentsStore.ts`
  - Minimal store for adjustments display state (`showGenetic`).

- `types.d.ts`
  - Shared literal labels (`PHOTO_LABELS`) and `PhotoLabel` union type.

### Derived global contexts (`globals/`)

- `globals/unfilteredPhotosStore.tsx`
  - Fetch source photo list from metadata hook.

- `globals/filteredPhotosStore.tsx`
  - Produces filtered photo list from unfiltered + filter logic.

- `globals/filteredGpsPhotosStore.tsx`
  - Produces GPS-constrained subset from filtered photos.

- `globals/sectionsStore.tsx`
  - Produces transformed section model for sidebars/views.

These files intentionally expose simple `useX_GLOBAL()` consumers with no mutation API.

## 4) Why this is written this way

Design strengths:

- Persisted UX state by default.
  - Users keep settings, selections, and workflow context across reloads.

- Low re-render pressure with selector subscriptions.
  - `useStoreSelector` lets components subscribe to exactly what they need.

- Uniform command hooks.
  - Most stores expose a tiny command API (`add/remove/toggle`) instead of leaking internal shape into components.

- Immutable updates + identity short-circuiting.
  - Most commands return previous state when no change is needed.

- Built-in `Set` serialization support in store factory.
  - Fast runtime operations with JSON-safe persistence.

- Separation of concerns.
  - Persistent stores track user state; `globals/` tracks derived runtime data.

Tradeoff accepted here:

- State is spread across many small stores (more files) to keep domain boundaries clean.

## 5) Usage patterns (how components should consume stores)

Preferred:

- Read state with selector hooks (`useSettingsStoreSelector`, `useFilterStoreSelector`, etc.).
- Mutate through command hooks (`useSettings`, `useFilterPhotos`, `useSelected`, etc.).

Example style used across app:

```tsx
const selectMode = useSettingsStoreSelector((s) => s.selectMode);
const { setSetting } = useSettings();

const toggle = () => {
  setSetting((prev) => ({ ...prev, selectMode: !prev.selectMode }));
};
```

For batch/membership-heavy stores, prefer existing helper APIs instead of open-coding filter/map logic in components.

## 6) AI guidance: creating a new store file

Use this checklist exactly.

1. Define a focused state type and defaults.
- Keep one domain per store.
- Provide full defaults to make reload hydration deterministic.

2. Create store via `createLocalStorageStoreNg`.
- Pick a stable, unique `storageKey`.
- Use a key naming convention consistent with existing files.

3. Export three pieces.
- Provider: `XProvider`
- Selector hook: `useXStoreSelector`
- Command hook: `useX()` with domain actions

4. Make commands idempotent.
- If no real state change, return `prev`.
- Avoid writing equivalent values that trigger unnecessary subscribers.

5. Prefer immutable updates with structural sharing.
- Copy only touched branches.
- Keep array/object identities stable when untouched.

6. Add provider to `AppProviders.tsx`.
- Place it near related stores.
- If it depends on another provider, nest it inside that provider.

7. Consume using selectors and command hooks.
- Do not read whole store if you only need one field.
- Avoid mutating state shape directly in components.

8. Validate persistence and hydration.
- Reload page, confirm values survive.
- Confirm defaults still apply when storage payload is partial.

## 7) AI guidance: creating a new global derived context

Use this only when state is computed, not user-mutated.

1. Create `globals/newThingStore.tsx` with:
- `createContext<YourType>(fallback)`
- Provider that runs a pipeline hook
- `useNewThing_GLOBAL()` consumer

2. Wire provider in `AppProviders.tsx` after its data dependencies.

3. Keep it read-only.
- No setter API unless you intentionally convert it into a persistent store.

## 8) Wiring rules and common pitfalls

- Keep provider order stable.
  - Global derived contexts rely on upstream providers/hook outputs.

- Do not put non-serializable classes into persistent stores.
  - `Set` is supported; custom class instances are not guaranteed.

- Avoid expensive recomputation in command hooks on every render.
  - Use memoization patterns used in `pinnedStore.ts` / `selectedStore.ts` / `ignoredStore.ts`.

- Keep command API names consistent.
  - `add/remove/addMany/removeMany` style improves discoverability.

- Be careful with random IDs.
  - `tagsStore.ts` currently uses `Math.random()`; if collision risk matters, move to stronger ID generation.

## 9) Suggested conventions for future files

- File naming
  - Persistent store: `<domain>Store.ts`
  - Derived global context: `globals/<domain>Store.tsx`

- Export naming
  - `XProvider`
  - `useXStoreSelector`
  - `useX` for command API
  - `useX_GLOBAL` for derived read-only contexts

- Store shape
  - Keep normalized structures where practical for large collections.
  - Add helper indexes only when there is a measurable read-path benefit.

## 10) Quick map for contributors

If you need to:

- Change app shell/theme/locale: start at `settingsStore.ts` and `ThemeContext.tsx`.
- Add or change filtering behavior: `filterStore.ts` and filter hooks under `src/hooks/pipeline/`.
- Add a new persisted user flag: usually `settingsStore.ts` unless domain-specific enough for its own store.
- Add a new sidebar/grouped dataset: likely `globals/sectionsStore.tsx` plus section transform hooks.
- Add selection/favorite-like behavior: mirror patterns in `selectedStore.ts` / `favoritesStore.ts` / `ignoredStore.ts`.

---

For AI agents: prefer extending existing store APIs over creating duplicate state sources. The architecture is intentionally store-centric to keep business rules out of UI components.
