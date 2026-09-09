import { diffChars } from 'diff'

export type CollapsedContent = {
  comparison: string
  hasCollapsedContent: boolean
  version: string
}

export const DEFAULT_CONTEXT_LENGTH = 100

const makeMarker = (omittedLength: number): string => `[...${omittedLength}chars]`

/**
 * Collapse unchanged runs outside ±contextLength around each change.
 * Markers are identical on both sides so the viewer treats them as shared context.
 */
export const collapseUnchangedContent = (
  comparison: string,
  version: string,
  contextLength: number = DEFAULT_CONTEXT_LENGTH,
): CollapsedContent => {
  if (comparison === version) {
    return {
      comparison,
      hasCollapsedContent: false,
      version,
    }
  }

  const changes = diffChars(comparison, version)
  const hasChange = changes.some((change) => change.added || change.removed)

  if (!hasChange) {
    return {
      comparison,
      hasCollapsedContent: false,
      version,
    }
  }

  let comparisonOut = ''
  let versionOut = ''
  let hasCollapsedContent = false

  const firstChangeIndex = changes.findIndex((change) => change.added || change.removed)
  let lastChangeIndex = -1
  for (let i = changes.length - 1; i >= 0; i -= 1) {
    if (changes[i].added || changes[i].removed) {
      lastChangeIndex = i
      break
    }
  }

  changes.forEach((change, index) => {
    if (change.added) {
      versionOut += change.value
      return
    }

    if (change.removed) {
      comparisonOut += change.value
      return
    }

    const value = change.value
    const isLeading = index < firstChangeIndex
    const isTrailing = index > lastChangeIndex
    const isBetween = index > firstChangeIndex && index < lastChangeIndex

    if (isLeading && value.length > contextLength) {
      const omitted = value.length - contextLength
      const marker = makeMarker(omitted)
      const retained = value.slice(-contextLength)
      comparisonOut += marker + retained
      versionOut += marker + retained
      hasCollapsedContent = true
      return
    }

    if (isTrailing && value.length > contextLength) {
      const omitted = value.length - contextLength
      const marker = makeMarker(omitted)
      const retained = value.slice(0, contextLength)
      comparisonOut += retained + marker
      versionOut += retained + marker
      hasCollapsedContent = true
      return
    }

    if (isBetween && value.length > contextLength * 2) {
      const omitted = value.length - contextLength * 2
      const marker = makeMarker(omitted)
      const head = value.slice(0, contextLength)
      const tail = value.slice(-contextLength)
      comparisonOut += head + marker + tail
      versionOut += head + marker + tail
      hasCollapsedContent = true
      return
    }

    comparisonOut += value
    versionOut += value
  })

  return {
    comparison: comparisonOut,
    hasCollapsedContent,
    version: versionOut,
  }
}
