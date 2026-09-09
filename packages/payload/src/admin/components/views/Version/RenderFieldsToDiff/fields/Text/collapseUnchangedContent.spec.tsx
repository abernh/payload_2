import { DEFAULT_CONTEXT_LENGTH, collapseUnchangedContent } from './collapseUnchangedContent'

const CONTEXT = DEFAULT_CONTEXT_LENGTH

const repeat = (char: string, count: number): string => char.repeat(count)

describe('collapseUnchangedContent', () => {
  it('leaves short changed values unchanged', () => {
    const comparison = 'hello world'
    const version = 'hello there'

    const result = collapseUnchangedContent(comparison, version)

    expect(result).toEqual({
      comparison,
      version,
      hasCollapsedContent: false,
    })
  })

  it('collapses leading context beyond 100 characters', () => {
    const leading = repeat('a', CONTEXT + 50)
    const comparison = `${leading}OLD`
    const version = `${leading}NEW`

    const result = collapseUnchangedContent(comparison, version)

    expect(result.hasCollapsedContent).toBe(true)
    expect(result.comparison).toBe(`[...50chars]${repeat('a', CONTEXT)}OLD`)
    expect(result.version).toBe(`[...50chars]${repeat('a', CONTEXT)}NEW`)
  })

  it('collapses trailing context beyond 100 characters', () => {
    const trailing = repeat('z', CONTEXT + 40)
    const comparison = `OLD${trailing}`
    const version = `NEW${trailing}`

    const result = collapseUnchangedContent(comparison, version)

    expect(result.hasCollapsedContent).toBe(true)
    expect(result.comparison).toBe(`OLD${repeat('z', CONTEXT)}[...40chars]`)
    expect(result.version).toBe(`NEW${repeat('z', CONTEXT)}[...40chars]`)
  })

  it('collapses the middle of a long unchanged run between two changes', () => {
    const middle = repeat('m', CONTEXT * 2 + 25)
    const comparison = `A${middle}B`
    const version = `X${middle}Y`

    const result = collapseUnchangedContent(comparison, version)

    expect(result.hasCollapsedContent).toBe(true)
    expect(result.comparison).toBe(`A${repeat('m', CONTEXT)}[...25chars]${repeat('m', CONTEXT)}B`)
    expect(result.version).toBe(`X${repeat('m', CONTEXT)}[...25chars]${repeat('m', CONTEXT)}Y`)
  })

  it('keeps an unchanged run of exactly 200 characters between changes', () => {
    const middle = repeat('m', CONTEXT * 2)
    const comparison = `A${middle}B`
    const version = `X${middle}Y`

    const result = collapseUnchangedContent(comparison, version)

    expect(result).toEqual({
      comparison,
      version,
      hasCollapsedContent: false,
    })
  })

  it('supports several separated changes and emits several markers', () => {
    const lead = repeat('a', CONTEXT + 10)
    const mid = repeat('b', CONTEXT * 2 + 15)
    const trail = repeat('c', CONTEXT + 20)
    const comparison = `${lead}ONE${mid}TWO${trail}`
    const version = `${lead}AAA${mid}BBB${trail}`

    const result = collapseUnchangedContent(comparison, version)

    expect(result.hasCollapsedContent).toBe(true)
    expect(result.comparison).toContain('[...10chars]')
    expect(result.comparison).toContain('[...15chars]')
    expect(result.comparison).toContain('[...20chars]')
    expect(result.comparison).toContain('ONE')
    expect(result.comparison).toContain('TWO')
    expect(result.version).toContain('AAA')
    expect(result.version).toContain('BBB')
    expect(result.comparison.match(/\[\.\.\.\d+chars\]/g)).toHaveLength(3)
    expect(result.version.match(/\[\.\.\.\d+chars\]/g)).toHaveLength(3)
  })

  it('uses identical markers on the comparison and version sides', () => {
    const pad = repeat('p', CONTEXT + 33)
    const comparison = `${pad}left`
    const version = `${pad}right`

    const result = collapseUnchangedContent(comparison, version)

    const comparisonMarkers = result.comparison.match(/\[\.\.\.\d+chars\]/g) || []
    const versionMarkers = result.version.match(/\[\.\.\.\d+chars\]/g) || []

    expect(comparisonMarkers).toEqual(versionMarkers)
    expect(comparisonMarkers).toEqual(['[...33chars]'])
  })

  it('reports the exact omitted character count', () => {
    const omitted = 77
    const lead = repeat('q', CONTEXT + omitted)
    const comparison = `${lead}A`
    const version = `${lead}B`

    const result = collapseUnchangedContent(comparison, version)

    expect(result.comparison).toContain(`[...${omitted}chars]`)
    expect(result.version).toContain(`[...${omitted}chars]`)
  })

  // Spec: ±100 context; marker N is omitted length only (not retained context).
  // Lead 150 → omit 50; mid 239 (100M + 39 sentinel + 100N) → omit 39; trail 150 → omit 50.
  it('collapses the browser QA fixture with exact omitted counts', () => {
    const lead = repeat('L', 150)
    const mid = `${repeat('M', 100)}OMIT_XXXXXXXXXXXXXXXXXXXXXXXXX_SENTINEL${repeat('N', 100)}`
    const trail = repeat('T', 150)
    const comparison = `${lead}ONE${mid}AAA${trail}`
    const version = `${lead}TWO${mid}BBB${trail}`

    const result = collapseUnchangedContent(comparison, version)

    expect(result.hasCollapsedContent).toBe(true)
    expect(result.version).toBe(
      `[...50chars]${repeat('L', 100)}TWO${repeat('M', 100)}[...39chars]${repeat('N', 100)}BBB${repeat('T', 100)}[...50chars]`,
    )
    expect(result.comparison).toBe(
      `[...50chars]${repeat('L', 100)}ONE${repeat('M', 100)}[...39chars]${repeat('N', 100)}AAA${repeat('T', 100)}[...50chars]`,
    )
    expect(result.version.includes('OMIT_')).toBe(false)
  })

  it('preserves newlines and whitespace in retained content', () => {
    const lead = `${repeat('x', CONTEXT + 5)}\n  `
    const comparison = `${lead}old`
    const version = `${lead}new`

    const result = collapseUnchangedContent(comparison, version)

    expect(result.comparison).toContain('\n  ')
    expect(result.version).toContain('\n  ')
    expect(result.comparison.endsWith('old')).toBe(true)
    expect(result.version.endsWith('new')).toBe(true)
  })

  it('does not collapse equal, all-added, or all-removed values', () => {
    const equal = collapseUnchangedContent(repeat('e', 500), repeat('e', 500))
    expect(equal).toEqual({
      comparison: repeat('e', 500),
      version: repeat('e', 500),
      hasCollapsedContent: false,
    })

    const allAdded = collapseUnchangedContent('', repeat('a', 300))
    expect(allAdded).toEqual({
      comparison: '',
      version: repeat('a', 300),
      hasCollapsedContent: false,
    })

    const allRemoved = collapseUnchangedContent(repeat('r', 300), '')
    expect(allRemoved).toEqual({
      comparison: repeat('r', 300),
      version: '',
      hasCollapsedContent: false,
    })
  })
})
