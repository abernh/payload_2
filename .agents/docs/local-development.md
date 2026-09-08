# Local development

## Install

Run commands from the repository root.

```bash
pnpm install
```

The repository declares pnpm in `package.json` and workspace policy in
`pnpm-workspace.yaml`. Do not use npm or Yarn for the monorepo install.

The Postgres adapter uses a published stable `drizzle-kit` release. The previous
canary tarball was unavailable from npm and prevented a clean install.

## Start a feature suite

The root dev command loads a config from `test/<suite>/config.ts`.

```bash
PORT=3030 NODE_ENV=test pnpm dev versions
```

This command starts the versions suite at `http://localhost:3030/admin`.

- `PORT` overrides the default port `3000`.
- `NODE_ENV=test` starts the repository's in-memory MongoDB replica set.
- The dev harness drops the test database on restart by default.
- The Admin UI automatically logs in with `dev@payloadcms.com` and password `test`.

Replace `versions` with another suite name, such as `fields`, to load its config.

## Key files

| Purpose | Path |
|---------|------|
| Dev server entry | `test/dev.ts` |
| Shared test config defaults | `test/buildConfigWithDefaults.ts` |
| Suite config | `test/<suite>/config.ts` |
| Root nodemon command | `nodemon.json` |
| Contributor workflow | `CONTRIBUTING.md` |

## Verification

Use focused suites while developing:

```bash
NODE_ENV=test DISABLE_LOGGING=true pnpm exec jest test/versions/int.spec.ts --runInBand --forceExit
```

The versions E2E suite uses the repository Playwright configuration and requires
its browser binaries to be available.
