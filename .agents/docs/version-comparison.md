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

## Compact long-field diffs

Text-backed fields (`text`, `textarea`, `richText`, and other types that reuse
the Text renderer) keep character and line highlighting. Unchanged runs outside
a 100-character window around each change are replaced with `[...{N}chars]`,
where `N` is the omitted character count (not the retained context length).
Leading and trailing runs keep the nearest 100 characters; runs between changes
keep the first and last 100 (collapse only when longer than 200). Markers are
identical on both sides.

Default view is compact when content was omitted (`Show All` means collapsed).
A field-local Show All / Collapse control appears after the field label only in
that case. Expanding is field-local and resets when that field's compared values
change. Toggling recomputes that field's existing viewer between compact and
full values. `showDiffOnly` stays false so surrounding context remains visible.

Character highlight spans use `display: inline` via shared `fields/styles.ts`.
Word-added and word-removed backgrounds use `--theme-success-600` and
`--theme-error-400`.

Line splitting and HTML or Lexical-aware parsing are intentionally excluded.

## Implementation map

| Purpose | Path |
|---------|------|
| Version view and locale selection | `packages/payload/src/admin/components/views/Version/Version.tsx` |
| Field diff traversal | `packages/payload/src/admin/components/views/Version/RenderFieldsToDiff/` |
| Compact unchanged content | `.../RenderFieldsToDiff/fields/Text/collapseUnchangedContent.ts` |
| Text field viewer and toggle | `.../RenderFieldsToDiff/fields/Text/index.tsx` |
| Diff viewer theme and word-diff layout | `.../RenderFieldsToDiff/fields/styles.ts` |
| Versions feature config | `test/versions/config.ts` |
| Browser regression test | `test/versions/e2e.spec.ts` |
| Versions integration tests | `test/versions/int.spec.ts` |

The versions fixture deliberately uses labels that differ from locale codes.
This prevents tests from hiding label-to-key mistakes.

## Regression behavior

The test `localized version diff uses locale codes when labels differ` creates
English and Spanish versions, opens the comparison view, and checks both values.
Neither locale may display `[No value]` when its stored value exists.

The test `long text version diff can toggle between compact and full content`
asserts compact markers, omitted distant content, and field-local Show All /
Collapse behavior on the Description field.

## Related ADRs

- [ADR 0002: Compact long-field version diffs](adr/0002-compact-long-field-version-diffs.md)
