# Tools components guide

This folder contains small, composable UI tools that are built around a shared button abstraction. The goal is to keep each toggle thin, readable, and consistent with the rest of the app.

## For humans

### What this folder is for

Use this folder when you need a compact action such as:

- toggling a boolean or state
- switching between two or three related options
- opening a popover or nested UI
- exposing a keyboard shortcut

Most files here follow the same shape:

- a component named like `SomethingToggle.tsx`
- a small amount of state logic
- one `GenericToggleButtonGroup` wrapper
- one or more `GenericToggleButtonProps` items

### Common structure

A typical toggle component looks like this:

```tsx
export default function ExampleToggle() {
  const { t } = useTranslation()

  return (
    <GenericToggleButtonGroup
      items={[
        {
          tooltip: t('someLabel'),
          icon: <SomeIcon />,
          onClick: () => {},
          selected: false,
        },
      ] satisfies GenericToggleButtonProps[]}
    />
  )
}
```

### Patterns already used in the repo

1. Single-action state toggle
   - Example: [FavoriteToggle.tsx](FavoriteToggle.tsx)
   - Best for one state change such as favorite/private/ignore.

2. Multi-option toggle group
   - Example: [SortOrderToggle.tsx](SortOrderToggle.tsx)
   - Best when the user chooses between several related values.

3. Popover toggle
   - Example: [SettingsToggle.tsx](SettingsToggle.tsx)
   - Best when the button opens extra controls instead of directly changing state.

4. Shortcut-aware toggle
   - Example: [SelectionToggle.tsx](SelectionToggle.tsx)
   - Best when the action also has a keyboard shortcut and should be discoverable through hotkeys.

### Practical conventions

- Prefer existing stores or hooks over local component state.
- Use `useTranslation()` and translation keys rather than hard-coded UI copy.
- Keep the component focused; avoid burying business logic inside the JSX.
- Use `icon` from `lucide-react` when possible.
- Use `selected` for the current active state and `disabled` for unavailable actions.
- Keep labels short and action-oriented.

## For AI agents

When creating a new tool, follow this checklist:

1. Pick the right pattern
   - Single action: one button, one state change
   - Grouped choice: multiple `items` with a shared meaning
   - Popover: use `popover` to render nested UI

2. Start from an existing nearby component
   - Good templates:
     - [FavoriteToggle.tsx](FavoriteToggle.tsx)
     - [SortOrderToggle.tsx](SortOrderToggle.tsx)
     - [SelectionToggle.tsx](SelectionToggle.tsx)
     - [SettingsToggle.tsx](SettingsToggle.tsx)

3. Use the shared primitives
   - `GenericToggleButtonGroup` for layout
   - `GenericToggleButtonProps` for item shape
   - `GenericHotkey` for keyboard shortcuts when relevant

4. Keep the implementation minimal
   - Do not invent custom styles unless truly necessary.
   - Do not duplicate button rendering logic.
   - Do not add local UI state when a store or hook already exists.

5. Make the action accessible
   - Provide `tooltip`
   - Provide `icon`
   - Add `kbd` only if there is a real hotkey
   - Add `meta` when the hotkey should participate in the app’s command/hotkey system

6. Keep the component consistent with the repo
   - Name the file `SomethingToggle.tsx`
   - Export a default component
   - Use `satisfies GenericToggleButtonProps[]` when declaring items
   - Use the same import style as nearby files

### Recommended implementation template

```tsx
import { GenericToggleButtonProps } from '@/middleware/tools/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/middleware/tools/shared/GenericToggleButtonGroup';
import { SomeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ExampleToggle() {
  const { t } = useTranslation()

  return (
    <GenericToggleButtonGroup
      items={[
        {
          tooltip: t('exampleLabel'),
          icon: <SomeIcon />,
          onClick: () => {},
          selected: false,
        },
      ] satisfies GenericToggleButtonProps[]}
    />
  )
}
```

## Strategies observed in this folder

- Thin wrapper components are preferred over large, self-contained toggle implementations.
- Most toggles derive their behavior from app stores or hooks rather than holding their own state.
- The folder favors composition: one shared button primitive, many small feature-specific wrappers.
- Keyboard shortcuts are treated as a first-class part of the interaction when appropriate.
- Popovers are used when the action needs a richer UI without creating a new standalone page or modal.

## Useful guidance

- If the toggle changes a value in a store, connect it to that store directly.
- If the toggle is purely visual, prefer `selected` and `disabled` over custom state logic.
- If the action is destructive or irreversible, make the behavior obvious through the tooltip and icon.
- If the toggle is reused in multiple places, keep it as a small standalone component rather than embedding it inline.
- If a new toggle is conceptually related to an existing one, start by copying that component and adapting it instead of writing from scratch.
