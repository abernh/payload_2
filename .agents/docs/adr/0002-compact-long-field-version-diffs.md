# ADR 0002: Compact long-field version diffs

**Date:** 2026-09-09
**Status:** accepted

## Context

Long `text`, `textarea`, and `richText` values make version comparison hard to scan.
The Admin UI already uses `ReactDiffViewer` with character highlighting and
`showDiffOnly={false}`. Line wrapping, HTML parsing, and Lexical-aware diffs are
out of scope for this fork change.

## Decision

1. Preprocess field strings with a shared character collapse step. Keep up to 100
   unchanged characters beside each change. Replace omitted runs with identical
   `[...{N}chars]` markers on both sides. `N` is the omitted length.
2. Default each field to the compact strings. Show a field-local Show All /
   Collapse control only when content was omitted. Keep one viewer per field.
3. Override viewer `wordDiff` to `display: inline`. Set word highlight backgrounds
   to `--theme-success-600` and `--theme-error-400` so long character hunks wrap
   as normal text.

## Consequences

- Equal, short, all-added, and all-removed values stay unchanged when nothing can
  be omitted.
- Expand state is local to the field and resets when that field's compared values
  change.
- Depend on `diff@5.2.0` in the `payload` package for the collapse transform.
- Regression coverage lives in Text component tests and the versions suite e2e.

## Related

- Area docs: [Version comparison](../version-comparison.md)
- Hub: [Agent documentation](../README.md)
