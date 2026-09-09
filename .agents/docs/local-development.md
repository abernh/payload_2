# Local development

## Overview

Local Admin and API work runs through the test harness, not a separate demo app.
Each feature suite under `test/<suite>/` with a `config.ts` is one development
environment. See [ADR 0001](adr/0001-feature-suites-as-local-dev.md).

## Related ADRs

- [0001 - Feature suites are the local development environments](adr/0001-feature-suites-as-local-dev.md)

## Install

Run commands from the repository root.

```bash
pnpm install
```

Use pnpm only. The repository declares the package manager in `package.json` and
workspace policy in `pnpm-workspace.yaml`.

## Start a feature suite

```bash
PORT=3030 NODE_ENV=test pnpm dev versions
```

- Admin URL: `http://localhost:3030/admin`
- API URL: `http://localhost:3030/api`
- Default port without `PORT` is `3000`
- `NODE_ENV=test` starts the in-memory MongoDB replica set (mongoose path)
- The harness sets `PAYLOAD_DROP_DATABASE=true` unless you set it to `false`
- Auto-login uses `dev@payloadcms.com` / `test`
- Disable auto-login with `pnpm dev <suite> --no-auto-login`

VS Code launch entries under `.vscode/launch.json` wrap common suites.

## Which environment for which case

Pick the nearest feature suite. Replace `<suite>` with a directory under `test/`
that contains `config.ts`.

| Case | Environment |
|------|-------------|
| Scratch or issue reproduction | `_community` |
| Versions, drafts, autosave | `versions` |
| Field types and Admin field UI | `fields` |
| Field validation error UI | `field-error-states` |
| Localization | `localization` (RTL: `localization-rtl`) |
| Uploads | `uploads` |
| Auth | `auth` |
| Access control | `access-control` |
| Admin chrome and views | `admin` |
| Collections over REST | `collections-rest` |
| Collections over GraphQL | `collections-graphql` |
| Globals | `globals` |
| Hooks | `hooks` |
| Relationships | `relationships` or `fields-relationship` |
| Live preview | `live-preview` |
| Migrations CLI | `migrations-cli` (usually with Postgres) |
| Official plugin work | matching `plugin-*` or `plugins` suite |
| Cloud storage plugin with Docker deps | `plugin-cloud-storage` plus `pnpm docker:start` |

Generate suite types after config changes:

```bash
pnpm dev:generate-types <suite>
```

## Database and bundler switches

These switches apply on top of any feature suite.

| Goal | How |
|------|-----|
| Default MongoDB (mongoose) | Omit `PAYLOAD_DATABASE` |
| In-memory MongoDB replica | `NODE_ENV=test` and no `PAYLOAD_TEST_MONGO_URL` |
| External MongoDB while testing | `NODE_ENV=test` and `PAYLOAD_TEST_MONGO_URL=<url>` |
| Postgres | `PAYLOAD_DATABASE=postgres` or `pnpm dev:postgres <suite>` |
| Postgres UUID ids | `PAYLOAD_DATABASE=postgres-uuid` |
| Postgres custom schema | `PAYLOAD_DATABASE=postgres-custom-schema` |
| Supabase-shaped Postgres URL default | `PAYLOAD_DATABASE=supabase` |
| Webpack Admin bundler (default) | Omit `PAYLOAD_BUNDLER` |
| Vite Admin bundler | `PAYLOAD_BUNDLER=vite` |

Postgres int tests: `pnpm test:int:postgres` (local Postgres required).
Default connection string is `postgres://127.0.0.1:5432/payloadtests`, or
`POSTGRES_URL` when set.

## Key files

| Purpose | Path |
|---------|------|
| Dev server entry | `test/dev.ts` |
| Shared suite defaults (db, bundler, auto-login) | `test/buildConfigWithDefaults.ts` |
| Suite config | `test/<suite>/config.ts` |
| Nodemon wrapper | `nodemon.json` |
| Mongo connect / memory server | `packages/db-mongodb/src/connect.ts` |
| VS Code launch presets | `.vscode/launch.json` |
| Contributor workflow (human) | `CONTRIBUTING.md` |

## Verification

Focused int test:

```bash
NODE_ENV=test DISABLE_LOGGING=true pnpm exec jest test/versions/int.spec.ts --runInBand --forceExit
```

- Jest: core specs and `test/**/*int.spec.ts`
- Playwright: `test/*e2e.spec.ts` via `pnpm test:e2e`
- Full suite: `pnpm test` (builds first)

## Related

- Hub: [Agent documentation](README.md)
- [Version comparison](version-comparison.md)
- [Terminology](terminology.md)
