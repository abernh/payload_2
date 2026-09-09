# Terminology

Canonical names for project plans, agent docs, and new code identifiers.

| Term | Meaning | Avoid |
|------|---------|-------|
| Feature suite | A focused test area under `test/<suite>/` with its own Payload config. Also the local development environment for that area | Test project; package demo app |
| Locale code | The stable localization key stored in data, such as `en` or `es` | Locale value |
| Locale label | Display text for a locale, such as `English` or `Spanish` | Locale name when referring to stored keys |
| Test dev server | The `pnpm dev <suite>` harness implemented by `test/dev.ts` | Package dev server |
| `PAYLOAD_DATABASE` | Env key selecting the suite database adapter (`mongoose`, `postgres`, and related keys in `buildConfigWithDefaults`) | Hardcoding adapter imports in suite configs |
| `PAYLOAD_BUNDLER` | Env key selecting the Admin bundler (`webpack` default, or `vite`) | Assuming webpack is the only bundler under test |
| Version comparison | The Admin UI view that compares one stored version with another document or version | Version diff page |
| Compact field diff | Version comparison mode that keeps a short unchanged window around each change and replaces the rest with `[...{N}chars]` | Full-field-only diff |
| Omission marker | The shared `[...{N}chars]` token inserted for omitted unchanged text in a compact field diff | Ellipsis placeholder |
| Changelog | Root `CHANGELOG.md` entry for a version range, conventional section headers without emoji | Release notes; release prose |
| Release notes | GitHub release body under `releases/<package>@<version>.md`, emoji section headers from `~/.cursor/docs/release-notes.md` | Changelog dump; copying emoji headers into `CHANGELOG.md` |
| Session plan | Executable plan under `.agents/plans/` | `.cursor/plans/` on this fork |
| Deferred issue | Parked issue stub under `.agents/issues/` | `.cursor/issues/` on this fork |
| Fork versioning | Package versions on this fork add 100 to the upstream v2 minor (`2.32.x` → `2.132.x`) | Matching the upstream package version on this fork |
| `main_v2` | Development branch for this fork | `main` |
| `release_v2` | Branch used to cut packaged releases for this fork | `release` |
| `2.x` | Upstream official Payload v2 branch | Treating `main_v2` as upstream |
