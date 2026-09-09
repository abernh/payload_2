import React, { useEffect, useId, useMemo, useState } from 'react'
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued'
import { useTranslation } from 'react-i18next'

import type { Props } from '../types'

import { getTranslation } from '../../../../../../../utilities/getTranslation'
import Pill from '../../../../../elements/Pill'
import Label from '../../Label'
import { diffStyles } from '../styles'
import { collapseUnchangedContent } from './collapseUnchangedContent'
import './index.scss'

const baseClass = 'text-diff'

const Text: React.FC<Props> = ({
  comparison,
  diffMethod,
  field,
  isRichText = false,
  locale,
  version,
}) => {
  const { i18n, t } = useTranslation(['general', 'fields'])
  const [showFullContent, setShowFullContent] = useState(false)
  const diffRegionId = useId()

  let placeholder = ''
  if (version === comparison) placeholder = `[${t('noValue')}]`

  let versionToRender = version
  let comparisonToRender = comparison

  if (isRichText) {
    if (typeof version === 'object') versionToRender = JSON.stringify(version, null, 2)
    if (typeof comparison === 'object') comparisonToRender = JSON.stringify(comparison, null, 2)
  }

  const comparisonString =
    typeof comparisonToRender !== 'undefined' ? String(comparisonToRender) : placeholder
  const versionString =
    typeof versionToRender !== 'undefined' ? String(versionToRender) : placeholder

  const collapsed = useMemo(
    () => collapseUnchangedContent(comparisonString, versionString),
    [comparisonString, versionString],
  )

  useEffect(() => {
    setShowFullContent(false)
  }, [comparisonString, versionString])

  const oldValue = showFullContent ? comparisonString : collapsed.comparison
  const newValue = showFullContent ? versionString : collapsed.version

  return (
    <div className={baseClass}>
      <Label>
        <span className={`${baseClass}__label-content`}>
          {locale && <span className={`${baseClass}__locale-label`}>{locale}</span>}
          {getTranslation(field.label, i18n)}
        </span>
        {collapsed.hasCollapsedContent && (
          <Pill
            aria-controls={diffRegionId}
            aria-expanded={showFullContent}
            className={`${baseClass}__toggle`}
            onClick={() => setShowFullContent((current) => !current)}
            pillStyle="light"
          >
            {showFullContent ? t('collapse') : t('fields:showAll')}
          </Pill>
        )}
      </Label>
      <div className={`${baseClass}__viewer`} id={diffRegionId}>
        <ReactDiffViewer
          compareMethod={DiffMethod[diffMethod]}
          hideLineNumbers
          newValue={newValue}
          oldValue={oldValue}
          showDiffOnly={false}
          splitView
          styles={diffStyles}
        />
      </div>
    </div>
  )
}

export default Text
