# Payload v2 agent documentation

This directory is the project knowledge source for agents working in this repository.
Use `AGENTS.md` as the quick entry point.

## Area docs

| Area | Document |
|------|----------|
| Local installation, test harness, and suite choice | [Local development](local-development.md) |
| Localized fields in version comparisons | [Version comparison](version-comparison.md) |
| Canonical project terms | [Terminology](terminology.md) |
| Architecture decisions | [ADRs](adr/README.md) |
| Package release note template (global) | `~/.cursor/docs/release-notes.md` |

## Repository boundaries

- Product source lives under `packages/`.
- Core Payload runtime and Admin UI source live under `packages/payload/src/`.
- Feature suites live under `test/<suite>/` and act as local development environments.
- Product documentation lives under `docs/` (human-owned).
- Project agent rules, docs, and lessons live under `.agents/`.
- Executable session plans remain under `.cursor/plans/` when present.

## Documentation rule

Keep these docs at orientation level. Put exact behavior in source and regression tests.
Do not use area docs as a task log or roadmap.
Config: `.agents/rules/documentation.mdc`.
