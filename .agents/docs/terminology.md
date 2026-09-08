# Terminology

Canonical names for project plans, agent docs, and new code identifiers.

| Term | Meaning | Avoid |
|------|---------|-------|
| Feature suite | A focused test area under `test/<suite>/` with its own Payload config | Test project |
| Locale code | The stable localization key stored in data, such as `en` or `es` | Locale value |
| Locale label | Display text for a locale, such as `English` or `Spanish` | Locale name when referring to stored keys |
| Test dev server | The `pnpm dev <suite>` harness implemented by `test/dev.ts` | Package dev server |
| Version comparison | The Admin UI view that compares one stored version with another document or version | Version diff page |
