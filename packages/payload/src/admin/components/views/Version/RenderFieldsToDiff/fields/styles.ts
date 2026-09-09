export const diffStyles = {
  variables: {
    dark: {
      addedBackground: 'var(--theme-success-900)',
      addedColor: 'var(--theme-success-100)',
      diffViewerBackground: 'transparent',
      diffViewerColor: 'var(--theme-text)',
      emptyLineBackground: 'var(--theme-elevation-50)',
      removedBackground: 'var(--theme-error-900)',
      removedColor: 'var(--theme-error-100)',
      wordAddedBackground: 'var(--theme-success-600)',
      wordRemovedBackground: 'var(--theme-error-400)',
    },
    light: {
      addedBackground: 'var(--theme-success-100)',
      addedColor: 'var(--theme-success-900)',
      diffViewerBackground: 'transparent',
      diffViewerColor: 'var(--theme-text)',
      emptyLineBackground: 'var(--theme-elevation-50)',
      removedBackground: 'var(--theme-error-100)',
      removedColor: 'var(--theme-error-900)',
      wordAddedBackground: 'var(--theme-success-600)',
      wordRemovedBackground: 'var(--theme-error-400)',
    },
  },
  // Library default is inline-flex; that wraps long CHARS hunks onto solo lines.
  wordDiff: {
    display: 'inline',
  },
}
