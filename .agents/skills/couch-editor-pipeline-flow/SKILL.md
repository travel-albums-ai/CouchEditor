---
name: couch-editor-pipeline-flow
description: Build CouchEditor pipeline flows from an ordered list of components. Use when the user asks to do a flow, create a pipeline, add several nodes/components, or drag pipeline elements into the canvas one by one. Use headed Playwright when available and leave the browser open for user inspection.
---

# CouchEditor Pipeline Flow

Use this workflow when a user gives, or asks you to derive, an ordered list of pipeline components to add to CouchEditor.

## Required input

1. Identify the CouchEditor URL or route.
   - Prefer the user-provided URL.
   - For local work, use the running app at `http://localhost:5173/` when it is available.
2. Obtain the ordered component list.
   - Preserve the user's order exactly.
   - If the user asks for a flow without naming components, ask for the list before mutating the pipeline.
3. Clarify ambiguous component names before starting.
   - Match names against the toolbox labels.
   - Do not silently substitute a similarly named node.

## Procedure

1. Open the URL in a headed Playwright browser so the user can see the interaction.
2. Wait for the editor to load and record console/page errors relevant to the flow.
3. Dismiss the welcome onboarding if it blocks the editor.
   - Advance the onboarding next control as needed.
   - If the guided product tour appears, close it with its accessible `Close` button.
4. Open the toolbox using its accessible control, preferably `Open toolbox`.
5. Add components strictly one at a time:
   - Filter the toolbox to the current component name when a search field is available.
   - Confirm exactly one matching draggable toolbox item is visible.
   - Drag that item into a valid React Flow canvas drop target.
   - Wait for the canvas state to update.
   - Verify that one new node was added and that its type/label matches the requested component.
   - Only then continue to the next component.
6. After the final component, verify the total node count and the visible node labels/types. Report any ordering limitation if the editor's auto-placement makes visual order differ from insertion order.
7. Keep the headed browser open unless the user asks to close it.

## Interaction rules

- Never add the entire list through a batch DOM mutation or direct application-state change; perform one real toolbox drag-and-drop per component.
- Do not continue after a failed or ambiguous insertion. Report the component that failed and preserve the browser state for inspection.
- Use stable accessible labels, IDs, and selectors where available. For the editor canvas, prefer `.react-flow__pane` or the app's stable canvas target.
- Reuse the existing page/session when possible so the user can observe the completed flow.
- Do not edit application source code for a normal flow-building request.

## Completion report

State:

- The ordered component list processed.
- Which component was added at each step.
- Final node count and any failed verification.
- The URL and that the headed browser remains open.
