# Version comparison

## Purpose

The Payload v2 Admin UI can compare two collection or global versions. The view
renders each configured field and supports selecting which locales to show.

## Localized field contract

Localized version data uses locale codes as object keys:

```json
{
  "title": {
    "en": "English title",
    "es": "Spanish title"
  }
}
```

Locale labels are display text only. The version renderer must use locale option
values, such as `en` and `es`, when reading localized version data. Using labels,
such as `English` and `Spanish`, produces missing lookups and displays
`[No value]`.

## Implementation map

| Purpose | Path |
|---------|------|
| Version view and locale selection | `packages/payload/src/admin/components/views/Version/Version.tsx` |
| Field diff traversal | `packages/payload/src/admin/components/views/Version/RenderFieldsToDiff/` |
| Versions feature config | `test/versions/config.ts` |
| Browser regression test | `test/versions/e2e.spec.ts` |
| Versions integration tests | `test/versions/int.spec.ts` |

The versions fixture deliberately uses labels that differ from locale codes.
This prevents tests from hiding label-to-key mistakes.

## Regression behavior

The test `localized version diff uses locale codes when labels differ` creates
English and Spanish versions, opens the comparison view, and checks both values.
Neither locale may display `[No value]` when its stored value exists.
