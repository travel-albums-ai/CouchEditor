---
name: couch-editor-webmcp-inspector
description: Inspect CouchEditor at couch-editor.com with browser tools, discover WebMCP tools, and verify pipeline tool registrations. Use when asked which WebMCP tools are live, what CouchEditor exposes to an AI agent, or whether pipeline tools are registered correctly.
---

# CouchEditor WebMCP Inspector

Inspect the requested CouchEditor page and report which Model Context Protocol tools are actually registered at runtime.

## Scope

- Inspect only the requested CouchEditor page and the local CouchEditor source needed to corroborate registrations.
- Treat runtime browser state as authoritative. Do not claim a tool is live when `document.modelContext` is absent or registration cannot be observed.
- Never execute mutating pipeline tools merely to discover them.
- Do not modify application source, pipeline state, settings, or user data.
- Keep the report focused on WebMCP discovery. Do not perform a general code review.

## Procedure

1. Navigate to the requested CouchEditor URL with the browser tools available to the host agent.
2. Check whether `document.modelContext` is present.
3. Inspect only non-mutating metadata exposed by the page or browser integration.
4. If runtime registration is unavailable, inspect local `src/components/WebMCP*.tsx` registrations and `src/layout/index.tsx` to distinguish source-defined tools from live tools.
5. Report observed runtime tools separately from tools inferred from source.

## Required Report

Use this structure:

```text
Runtime status: <observable or unavailable>

Live tools:
| Name | Description | Input shape |
|---|---|---|
| ... | ... | ... |

Source-defined tools:
| Name | Description | Evidence |
|---|---|---|
| ... | ... | ... |

Limitations: <one short note>
```

Use `None observed` when no live tools can be verified. Do not present source-defined tools as live tools.
