---
name: semantic-release-commit-messages
description: Use when proposing git commit messages or commit comments so semantic-release can classify them with Conventional Commits.
applyTo: "**"
---

# Semantic-Release Commit Messages

When proposing a git commit message or commit comment, use Conventional Commits syntax because this repository uses semantic-release.

Format:

```text
<type>[optional scope]: <imperative summary>
```

Use a release-relevant type when the change affects users:

- `feat`: adds user-facing functionality and normally triggers a minor release.
- `fix`: corrects a user-facing defect and normally triggers a patch release.
- `perf`: improves performance and normally triggers a patch release.
- `refactor`: changes implementation without changing behavior; use only when the repository's release configuration treats it as relevant.

Use non-release types for maintenance or documentation work when appropriate:
`build`, `chore`, `ci`, `docs`, `style`, and `test`.

Keep the summary short, specific, and imperative. Use lowercase after the colon, omit a trailing period, and add a scope when it makes the affected area clearer, for example `fix(pipeline): preserve viewer output order`.

Mark breaking changes with `!` after the type or scope, and explain the migration in the body or a `BREAKING CHANGE:` footer, for example `feat!: remove legacy album export format`.

Do not invent a release type to force a version bump. If the change is not release-worthy, prefer an appropriate non-release type and state that no release is expected. When suggesting multiple commits, give each commit one focused Conventional Commit message.