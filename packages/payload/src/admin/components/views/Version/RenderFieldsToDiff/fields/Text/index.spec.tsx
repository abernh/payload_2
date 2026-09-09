import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import Text from './index'

const viewerCalls: Array<Record<string, unknown>> = []

jest.mock('react-diff-viewer-continued', () => {
  const DiffMethod = {
    CHARS: 'CHARS',
  }

  const ReactDiffViewer = (props: Record<string, unknown>) => {
    viewerCalls.push(props)
    return (
      <div
        data-new={String(props.newValue)}
        data-old={String(props.oldValue)}
        data-testid="diff-viewer"
      />
    )
  }

  return {
    __esModule: true,
    DiffMethod,
    default: ReactDiffViewer,
  }
})

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {},
    t: (key: string) => {
      if (key === 'noValue') return 'No value'
      if (key === 'fields:showAll' || key === 'showAll') return 'Show All'
      if (key === 'general:collapse' || key === 'collapse') return 'Collapse'
      return key
    },
  }),
}))

jest.mock('../../../../../../../utilities/getTranslation', () => ({
  getTranslation: (label: string) => label,
}))

const longPad = (char: string, count: number) => char.repeat(count)

const baseField = {
  name: 'description',
  label: 'Description',
  type: 'textarea',
}

const renderText = (props: Partial<React.ComponentProps<typeof Text>> = {}) =>
  render(
    <Text
      comparison={props.comparison}
      diffMethod={props.diffMethod || 'CHARS'}
      field={props.field || baseField}
      fieldComponents={{}}
      isRichText={props.isRichText}
      locale={props.locale}
      version={props.version}
      {...props}
    />,
  )

describe('Text field diff', () => {
  beforeEach(() => {
    viewerCalls.length = 0
  })

  it('renders one viewer with compact values by default', () => {
    const lead = longPad('a', 150)
    const comparison = `${lead}OLD`
    const version = `${lead}NEW`

    renderText({ comparison, version })

    expect(screen.getAllByTestId('diff-viewer')).toHaveLength(1)
    expect(viewerCalls).toHaveLength(1)
    expect(String(viewerCalls[0].oldValue)).toContain('[...50chars]')
    expect(String(viewerCalls[0].newValue)).toContain('[...50chars]')
    expect(String(viewerCalls[0].oldValue)).toContain('OLD')
    expect(String(viewerCalls[0].newValue)).toContain('NEW')
  })

  it('does not render a toggle when nothing was collapsed', () => {
    renderText({ comparison: 'short old', version: 'short new' })

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders a light Pill after the field label when content was collapsed', () => {
    const lead = longPad('a', 150)
    renderText({
      comparison: `${lead}OLD`,
      version: `${lead}NEW`,
    })

    const button = screen.getByRole('button', { name: 'Show All' })
    expect(button).toBeInTheDocument()
    expect(button.className).toContain('pill--style-light')
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })

  it('switches that viewer to full values and updates aria-expanded', () => {
    const lead = longPad('a', 150)
    const comparison = `${lead}OLD`
    const version = `${lead}NEW`

    renderText({ comparison, version })

    fireEvent.click(screen.getByRole('button', { name: 'Show All' }))

    expect(viewerCalls.at(-1)?.oldValue).toBe(comparison)
    expect(viewerCalls.at(-1)?.newValue).toBe(version)
    expect(screen.getByRole('button', { name: 'Collapse' }).getAttribute('aria-expanded')).toBe(
      'true',
    )
  })

  it('switches back to compact values', () => {
    const lead = longPad('a', 150)
    const comparison = `${lead}OLD`
    const version = `${lead}NEW`

    renderText({ comparison, version })

    fireEvent.click(screen.getByRole('button', { name: 'Show All' }))
    fireEvent.click(screen.getByRole('button', { name: 'Collapse' }))

    expect(String(viewerCalls.at(-1)?.oldValue)).toContain('[...50chars]')
    expect(screen.getByRole('button', { name: 'Show All' }).getAttribute('aria-expanded')).toBe(
      'false',
    )
  })

  it('resets to compact when field values change', () => {
    const lead = longPad('a', 150)
    const first = renderText({
      comparison: `${lead}OLD`,
      version: `${lead}NEW`,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Show All' }))
    expect(screen.getByRole('button', { name: 'Collapse' })).toBeInTheDocument()

    first.rerender(
      <Text
        comparison={`${lead}LEFT`}
        diffMethod="CHARS"
        field={baseField}
        fieldComponents={{}}
        version={`${lead}RIGHT`}
      />,
    )

    expect(screen.getByRole('button', { name: 'Show All' }).getAttribute('aria-expanded')).toBe(
      'false',
    )
    expect(String(viewerCalls.at(-1)?.oldValue)).toContain('[...50chars]')
  })

  it('keeps showDiffOnly false and the supplied CHARS method', () => {
    renderText({
      comparison: 'a',
      diffMethod: 'CHARS',
      version: 'b',
    })

    expect(viewerCalls[0].showDiffOnly).toBe(false)
    expect(viewerCalls[0].compareMethod).toBe('CHARS')
  })

  it('normalizes rich-text objects before collapse', () => {
    const pad = longPad('x', 150)
    const comparisonObj = { root: { children: [{ text: `${pad}old` }] } }
    const versionObj = { root: { children: [{ text: `${pad}new` }] } }

    renderText({
      comparison: comparisonObj,
      isRichText: true,
      version: versionObj,
    })

    expect(String(viewerCalls[0].oldValue)).toContain('[...')
    expect(String(viewerCalls[0].newValue)).toContain('[...')
    expect(String(viewerCalls[0].oldValue)).toContain('old')
    expect(String(viewerCalls[0].newValue)).toContain('new')
    expect(String(viewerCalls[0].oldValue)).toMatch(/[{}\[\]]/)
  })
})
