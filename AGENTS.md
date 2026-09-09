# AGENTS.md

Quick reference for humans and agents working on this Payload v2 repository.

## Project knowledge

Project agent knowledge lives under `.agents/`.

- [Documentation hub](.agents/docs/README.md)
- [Local development](.agents/docs/local-development.md)
- [Version comparison](.agents/docs/version-comparison.md)
- [Terminology](.agents/docs/terminology.md)
- [ADRs](.agents/docs/adr/README.md)
- Release notes template: `~/.cursor/docs/release-notes.md`

Keep `AGENTS.md` short. Put durable area details in `.agents/docs/`, behavior in
tests, and session plans under `.cursor/plans/`.

## Documentation preferences

**Skill:** `maintain-documentation` (altitude required - see skill ADR 001)

| Setting | Value |
|---------|-------|
| Agent docs root | `.agents/docs/` |
| Hub doc | `.agents/docs/README.md` |
| ADRs | `.agents/docs/adr/` |
| Terminology | `.agents/docs/terminology.md` |
| Human docs (no agent edits) | `docs/`, `CONTRIBUTING.md` |
| Project documentation rule | `.agents/rules/documentation.mdc` |

### Required (agent docs)

- New functional blocks (high-level map entry)
- Changed semantics or cross-module contracts
- Behavior changes → ADR + thin area-doc pointer

### Exempt / leave in code

- CSS / copy-only; IDs; versions; exhaustive API/DOM listings
- Human `docs/` tree and `CONTRIBUTING.md`

## Repository map

| Area                   | Path                                                     |
| ---------------------- | -------------------------------------------------------- |
| Core Payload package   | `packages/payload/`                                      |
| MongoDB adapter        | `packages/db-mongodb/`                                   |
| Postgres adapter       | `packages/db-postgres/`                                  |
| Bundlers               | `packages/bundler-webpack/`, `packages/bundler-vite/`    |
| Rich text packages     | `packages/richtext-slate/`, `packages/richtext-lexical/` |
| Official plugins       | `packages/plugin-*/`                                     |
| Feature suites         | `test/<suite>/`                                          |
| Examples and templates | `examples/`, `templates/`                                |
| Product documentation  | `docs/`                                                  |

The monorepo uses pnpm workspaces and Turborepo.

## Core entry points

| Purpose              | Path                                 |
| -------------------- | ------------------------------------ |
| Public package entry | `packages/payload/src/index.ts`      |
| HTTP initialization  | `packages/payload/src/initHTTP.ts`   |
| Core class           | `packages/payload/src/payload.ts`    |
| Admin UI             | `packages/payload/src/admin/`        |
| Collections          | `packages/payload/src/collections/`  |
| Globals              | `packages/payload/src/globals/`      |
| Fields               | `packages/payload/src/fields/`       |
| Versions and drafts  | `packages/payload/src/versions/`     |
| Localization         | `packages/payload/src/localization/` |

## Common commands

Run commands from the repository root.

```bash
pnpm install
pnpm build
pnpm lint
pnpm test
```

Start a feature suite with its config:

```bash
PORT=3030 NODE_ENV=test pnpm dev versions
```

The dev command requires a directory under `test/` that contains `config.ts`.
See [Local development](.agents/docs/local-development.md) for runtime details.

## Test structure

A feature suite usually contains:

```text
test/<suite>/
├── config.ts
├── int.spec.ts
├── e2e.spec.ts
└── payload-types.ts
```

- Jest matches core specs and `test/**/*int.spec.ts`.
- Playwright matches `test/*e2e.spec.ts`.
- Generate suite types with `pnpm dev:generate-types <suite>`.
- Add regression coverage to the nearest existing feature suite.

## Current behavior notes

- Version comparison must use locale codes as data keys. Locale labels are
  display-only. See [Version comparison](.agents/docs/version-comparison.md).
- The Postgres adapter must reference published dependencies so a clean root
  install remains possible.
- Write package release notes with the shared template in
  `~/.cursor/docs/release-notes.md`.
- This fork develops on `main_v2`, releases from `release_v2`, and tracks
  upstream Payload v2 from `2.x`. Package versions add 100 to the upstream
  minor (`2.32.x` → `2.132.x`). See the top notice in `README.md`.

## Working rules

- Use pnpm. Do not create npm or Yarn lockfiles.
- Keep changes surgical and follow existing package conventions.
- Prefer tests in an existing feature suite over a new one.
- Do not edit unrelated working-tree changes.
- Update `.agents/docs/` when a durable boundary or behavior changes.
- Follow `CONTRIBUTING.md` for contribution and commit conventions.
