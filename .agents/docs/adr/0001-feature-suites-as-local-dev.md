# ADR 0001: Feature suites are the local development environments

**Date:** 2026-09-09
**Status:** accepted

## Context

This monorepo develops Payload packages under `packages/`. Contributors need a running Admin UI and API while changing core or plugin code. There is no separate package-level demo app for day-to-day core work.

## Decision

Local development uses the test harness. Run `pnpm dev <suite>` from the repository root. Nodemon executes `test/dev.ts`, which loads `test/<suite>/config.ts` through `PAYLOAD_CONFIG_PATH`.

Each directory under `test/` that contains `config.ts` is a feature suite and counts as a local development environment for that area.

## Consequences

- Choose the nearest existing feature suite for the work. Prefer extending that suite over adding a new one.
- Database and bundler choice come from environment variables on the same harness (`PAYLOAD_DATABASE`, `PAYLOAD_BUNDLER`, `NODE_ENV`).
- Product docs under `docs/` stay human-owned. Agent orientation for this flow lives in [Local development](../local-development.md).

## Related

- Area docs: [Local development](../local-development.md)
- Hub: [Agent documentation](../README.md)
