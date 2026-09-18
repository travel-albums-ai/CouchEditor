---
name: ui-playwright-targeting
description: Use when working on UI interfaces or frontend behavior. Before inspecting or changing the UI, ask the user how to reach the interface in Playwright, including the URL or navigation steps and any relevant element IDs. Then ask for the ID of the specific component being worked on and use those IDs to target browser inspection and validation.
---

# UI Playwright Targeting

Use this workflow for UI implementation, styling, interaction, and visual bug fixes.

## Required intake

Before using Playwright or editing UI code, ask the user these questions:

1. How should Playwright reach the interface?
   - Request the URL or route.
   - Request any required navigation steps, login or setup state, query parameters, or feature flags.
   - Request the IDs of relevant page-level elements if the route alone is not enough.
2. What is the ID of the specific component we are working on?
   - Ask for the component's DOM `id` or another stable test ID.
   - If the user provides multiple IDs, ask which one is the primary target and which are supporting elements.

Do not guess these IDs or silently substitute text selectors when the user has not provided a target. If the interface is already clearly available from the current task context, confirm the route and target ID briefly instead of asking for information already known.

## Procedure

1. Collect and restate the Playwright entry point and target component ID.
2. Navigate to the interface using the user's route and setup steps.
3. Verify that the target component exists and is uniquely identifiable by the supplied ID.
4. Inspect the target's current behavior, layout, computed state, and nearby supporting elements before editing.
5. Make the smallest UI change that addresses the request.
6. Re-run the relevant Playwright check against the supplied target ID and verify the expected behavior at the required viewport sizes.
7. Report the route used, target ID, validation performed, and any limitation such as unavailable authentication or an unreachable environment.

## Rules

- Treat user-provided IDs as the primary targeting contract for browser inspection and validation.
- Prefer stable IDs or test IDs over brittle text, positional, or generated-class selectors.
- Do not claim a UI change is verified if the target could not be reached or uniquely located.
- Keep browser inspection scoped to the requested interface and component.
- If Playwright is unavailable, explain the blocker and provide the narrowest available validation instead.
