"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ArrayRow", {
    enumerable: true,
    get: function() {
        return ArrayRow;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reacti18next = require("react-i18next");
const _getTranslation = require("../../../../../utilities/getTranslation");
const _ArrayAction = require("../../../elements/ArrayAction");
const _Collapsible = require("../../../elements/Collapsible");
const _ErrorPill = require("../../../elements/ErrorPill");
const _context = require("../../Form/context");
const _createNestedFieldPath = require("../../Form/createNestedFieldPath");
const _RenderFields = /*#__PURE__*/ _interop_require_default(require("../../RenderFields"));
const _RowLabel = require("../../RowLabel");
const _HiddenInput = /*#__PURE__*/ _interop_require_default(require("../HiddenInput"));
require("./index.scss");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const baseClass = 'array-field';
const ArrayRow = ({ CustomRowLabel, addRow, attributes, duplicateRow, fieldTypes, fields, forceRender, hasMaxRows, indexPath, isSortable, labels, listeners, moveRow, path: parentPath, permissions, readOnly, removeRow, row, rowCount, rowIndex, setCollapse, setNodeRef, transform })=>{
    const path = `${parentPath}.${rowIndex}`;
    const { i18n } = (0, _reacti18next.useTranslation)();
    const hasSubmitted = (0, _context.useFormSubmitted)();
    const fallbackLabel = `${(0, _getTranslation.getTranslation)(labels.singular, i18n)} ${String(rowIndex + 1).padStart(2, '0')}`;
    const childErrorPathsCount = row.childErrorPaths?.size;
    const fieldHasErrors = hasSubmitted && childErrorPathsCount > 0;
    const classNames = [
        `${baseClass}__row`,
        fieldHasErrors ? `${baseClass}__row--has-errors` : `${baseClass}__row--no-errors`
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ _react.default.createElement("div", {
        id: `${parentPath.split('.').join('-')}-row-${rowIndex}`,
        key: `${parentPath}-row-${row.id}`,
        ref: setNodeRef,
        style: {
            transform
        }
    }, /*#__PURE__*/ _react.default.createElement(_Collapsible.Collapsible, {
        actions: !readOnly ? /*#__PURE__*/ _react.default.createElement(_ArrayAction.ArrayAction, {
            addRow: addRow,
            duplicateRow: duplicateRow,
            hasMaxRows: hasMaxRows,
            index: rowIndex,
            isSortable: isSortable,
            moveRow: moveRow,
            removeRow: removeRow,
            rowCount: rowCount
        }) : undefined,
        className: classNames,
        collapsed: row.collapsed,
        collapsibleStyle: fieldHasErrors ? 'error' : 'default',
        dragHandleProps: isSortable ? {
            id: row.id,
            attributes,
            listeners
        } : undefined,
        header: /*#__PURE__*/ _react.default.createElement("div", {
            className: `${baseClass}__row-header`
        }, /*#__PURE__*/ _react.default.createElement(_RowLabel.RowLabel, {
            label: CustomRowLabel || fallbackLabel,
            path: path,
            rowNumber: rowIndex + 1
        }), fieldHasErrors && /*#__PURE__*/ _react.default.createElement(_ErrorPill.ErrorPill, {
            count: childErrorPathsCount,
            withMessage: true
        })),
        onToggle: (collapsed)=>setCollapse(row.id, collapsed)
    }, /*#__PURE__*/ _react.default.createElement(_HiddenInput.default, {
        name: `${path}.id`,
        value: row.id
    }), /*#__PURE__*/ _react.default.createElement(_RenderFields.default, {
        className: `${baseClass}__fields`,
        fieldSchema: fields.map((field)=>({
                ...field,
                path: (0, _createNestedFieldPath.createNestedFieldPath)(path, field)
            })),
        fieldTypes: fieldTypes,
        forceRender: forceRender,
        indexPath: indexPath,
        margins: "small",
        permissions: permissions?.fields,
        readOnly: readOnly
    })));
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Zvcm1zL2ZpZWxkLXR5cGVzL0FycmF5L0FycmF5Um93LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5cbmltcG9ydCB0eXBlIHsgVXNlRHJhZ2dhYmxlU29ydGFibGVSZXR1cm4gfSBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9EcmFnZ2FibGVTb3J0YWJsZS91c2VEcmFnZ2FibGVTb3J0YWJsZS90eXBlcydcbmltcG9ydCB0eXBlIHsgUm93IH0gZnJvbSAnLi4vLi4vRm9ybS90eXBlcydcbmltcG9ydCB0eXBlIHsgUm93TGFiZWwgYXMgUm93TGFiZWxUeXBlIH0gZnJvbSAnLi4vLi4vUm93TGFiZWwvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFByb3BzIH0gZnJvbSAnLi90eXBlcydcblxuaW1wb3J0IHsgZ2V0VHJhbnNsYXRpb24gfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsaXRpZXMvZ2V0VHJhbnNsYXRpb24nXG5pbXBvcnQgeyBBcnJheUFjdGlvbiB9IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0FycmF5QWN0aW9uJ1xuaW1wb3J0IHsgQ29sbGFwc2libGUgfSBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9Db2xsYXBzaWJsZSdcbmltcG9ydCB7IEVycm9yUGlsbCB9IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0Vycm9yUGlsbCdcbmltcG9ydCB7IHVzZUZvcm1TdWJtaXR0ZWQgfSBmcm9tICcuLi8uLi9Gb3JtL2NvbnRleHQnXG5pbXBvcnQgeyBjcmVhdGVOZXN0ZWRGaWVsZFBhdGggfSBmcm9tICcuLi8uLi9Gb3JtL2NyZWF0ZU5lc3RlZEZpZWxkUGF0aCdcbmltcG9ydCBSZW5kZXJGaWVsZHMgZnJvbSAnLi4vLi4vUmVuZGVyRmllbGRzJ1xuaW1wb3J0IHsgUm93TGFiZWwgfSBmcm9tICcuLi8uLi9Sb3dMYWJlbCdcbmltcG9ydCBIaWRkZW5JbnB1dCBmcm9tICcuLi9IaWRkZW5JbnB1dCdcbmltcG9ydCAnLi9pbmRleC5zY3NzJ1xuXG5jb25zdCBiYXNlQ2xhc3MgPSAnYXJyYXktZmllbGQnXG5cbnR5cGUgQXJyYXlSb3dQcm9wcyA9IFVzZURyYWdnYWJsZVNvcnRhYmxlUmV0dXJuICZcbiAgUGljazxQcm9wcywgJ2ZpZWxkVHlwZXMnIHwgJ2ZpZWxkcycgfCAnaW5kZXhQYXRoJyB8ICdsYWJlbHMnIHwgJ3BhdGgnIHwgJ3Blcm1pc3Npb25zJz4gJiB7XG4gICAgQ3VzdG9tUm93TGFiZWw/OiBSb3dMYWJlbFR5cGVcbiAgICBhZGRSb3c6IChyb3dJbmRleDogbnVtYmVyKSA9PiB2b2lkXG4gICAgZHVwbGljYXRlUm93OiAocm93SW5kZXg6IG51bWJlcikgPT4gdm9pZFxuICAgIGZvcmNlUmVuZGVyPzogYm9vbGVhblxuICAgIGhhc01heFJvd3M/OiBib29sZWFuXG4gICAgaXNTb3J0YWJsZTogYm9vbGVhblxuICAgIG1vdmVSb3c6IChmcm9tSW5kZXg6IG51bWJlciwgdG9JbmRleDogbnVtYmVyKSA9PiB2b2lkXG4gICAgcmVhZE9ubHk/OiBib29sZWFuXG4gICAgcmVtb3ZlUm93OiAocm93SW5kZXg6IG51bWJlcikgPT4gdm9pZFxuICAgIHJvdzogUm93XG4gICAgcm93Q291bnQ6IG51bWJlclxuICAgIHJvd0luZGV4OiBudW1iZXJcbiAgICBzZXRDb2xsYXBzZTogKHJvd0lEOiBzdHJpbmcsIGNvbGxhcHNlZDogYm9vbGVhbikgPT4gdm9pZFxuICB9XG5leHBvcnQgY29uc3QgQXJyYXlSb3c6IFJlYWN0LkZDPEFycmF5Um93UHJvcHM+ID0gKHtcbiAgQ3VzdG9tUm93TGFiZWwsXG4gIGFkZFJvdyxcbiAgYXR0cmlidXRlcyxcbiAgZHVwbGljYXRlUm93LFxuICBmaWVsZFR5cGVzLFxuICBmaWVsZHMsXG4gIGZvcmNlUmVuZGVyLFxuICBoYXNNYXhSb3dzLFxuICBpbmRleFBhdGgsXG4gIGlzU29ydGFibGUsXG4gIGxhYmVscyxcbiAgbGlzdGVuZXJzLFxuICBtb3ZlUm93LFxuICBwYXRoOiBwYXJlbnRQYXRoLFxuICBwZXJtaXNzaW9ucyxcbiAgcmVhZE9ubHksXG4gIHJlbW92ZVJvdyxcbiAgcm93LFxuICByb3dDb3VudCxcbiAgcm93SW5kZXgsXG4gIHNldENvbGxhcHNlLFxuICBzZXROb2RlUmVmLFxuICB0cmFuc2Zvcm0sXG59KSA9PiB7XG4gIGNvbnN0IHBhdGggPSBgJHtwYXJlbnRQYXRofS4ke3Jvd0luZGV4fWBcbiAgY29uc3QgeyBpMThuIH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGhhc1N1Ym1pdHRlZCA9IHVzZUZvcm1TdWJtaXR0ZWQoKVxuXG4gIGNvbnN0IGZhbGxiYWNrTGFiZWwgPSBgJHtnZXRUcmFuc2xhdGlvbihsYWJlbHMuc2luZ3VsYXIsIGkxOG4pfSAke1N0cmluZyhyb3dJbmRleCArIDEpLnBhZFN0YXJ0KFxuICAgIDIsXG4gICAgJzAnLFxuICApfWBcblxuICBjb25zdCBjaGlsZEVycm9yUGF0aHNDb3VudCA9IHJvdy5jaGlsZEVycm9yUGF0aHM/LnNpemVcbiAgY29uc3QgZmllbGRIYXNFcnJvcnMgPSBoYXNTdWJtaXR0ZWQgJiYgY2hpbGRFcnJvclBhdGhzQ291bnQgPiAwXG5cbiAgY29uc3QgY2xhc3NOYW1lcyA9IFtcbiAgICBgJHtiYXNlQ2xhc3N9X19yb3dgLFxuICAgIGZpZWxkSGFzRXJyb3JzID8gYCR7YmFzZUNsYXNzfV9fcm93LS1oYXMtZXJyb3JzYCA6IGAke2Jhc2VDbGFzc31fX3Jvdy0tbm8tZXJyb3JzYCxcbiAgXVxuICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAuam9pbignICcpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBpZD17YCR7cGFyZW50UGF0aC5zcGxpdCgnLicpLmpvaW4oJy0nKX0tcm93LSR7cm93SW5kZXh9YH1cbiAgICAgIGtleT17YCR7cGFyZW50UGF0aH0tcm93LSR7cm93LmlkfWB9XG4gICAgICByZWY9e3NldE5vZGVSZWZ9XG4gICAgICBzdHlsZT17e1xuICAgICAgICB0cmFuc2Zvcm0sXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxDb2xsYXBzaWJsZVxuICAgICAgICBhY3Rpb25zPXtcbiAgICAgICAgICAhcmVhZE9ubHkgPyAoXG4gICAgICAgICAgICA8QXJyYXlBY3Rpb25cbiAgICAgICAgICAgICAgYWRkUm93PXthZGRSb3d9XG4gICAgICAgICAgICAgIGR1cGxpY2F0ZVJvdz17ZHVwbGljYXRlUm93fVxuICAgICAgICAgICAgICBoYXNNYXhSb3dzPXtoYXNNYXhSb3dzfVxuICAgICAgICAgICAgICBpbmRleD17cm93SW5kZXh9XG4gICAgICAgICAgICAgIGlzU29ydGFibGU9e2lzU29ydGFibGV9XG4gICAgICAgICAgICAgIG1vdmVSb3c9e21vdmVSb3d9XG4gICAgICAgICAgICAgIHJlbW92ZVJvdz17cmVtb3ZlUm93fVxuICAgICAgICAgICAgICByb3dDb3VudD17cm93Q291bnR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXN9XG4gICAgICAgIGNvbGxhcHNlZD17cm93LmNvbGxhcHNlZH1cbiAgICAgICAgY29sbGFwc2libGVTdHlsZT17ZmllbGRIYXNFcnJvcnMgPyAnZXJyb3InIDogJ2RlZmF1bHQnfVxuICAgICAgICBkcmFnSGFuZGxlUHJvcHM9e1xuICAgICAgICAgIGlzU29ydGFibGVcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIGlkOiByb3cuaWQsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgICAgaGVhZGVyPXtcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fcm93LWhlYWRlcmB9PlxuICAgICAgICAgICAgPFJvd0xhYmVsXG4gICAgICAgICAgICAgIGxhYmVsPXtDdXN0b21Sb3dMYWJlbCB8fCBmYWxsYmFja0xhYmVsfVxuICAgICAgICAgICAgICBwYXRoPXtwYXRofVxuICAgICAgICAgICAgICByb3dOdW1iZXI9e3Jvd0luZGV4ICsgMX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZmllbGRIYXNFcnJvcnMgJiYgPEVycm9yUGlsbCBjb3VudD17Y2hpbGRFcnJvclBhdGhzQ291bnR9IHdpdGhNZXNzYWdlIC8+fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICB9XG4gICAgICAgIG9uVG9nZ2xlPXsoY29sbGFwc2VkKSA9PiBzZXRDb2xsYXBzZShyb3cuaWQsIGNvbGxhcHNlZCl9XG4gICAgICA+XG4gICAgICAgIDxIaWRkZW5JbnB1dCBuYW1lPXtgJHtwYXRofS5pZGB9IHZhbHVlPXtyb3cuaWR9IC8+XG4gICAgICAgIDxSZW5kZXJGaWVsZHNcbiAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2ZpZWxkc2B9XG4gICAgICAgICAgZmllbGRTY2hlbWE9e2ZpZWxkcy5tYXAoKGZpZWxkKSA9PiAoe1xuICAgICAgICAgICAgLi4uZmllbGQsXG4gICAgICAgICAgICBwYXRoOiBjcmVhdGVOZXN0ZWRGaWVsZFBhdGgocGF0aCwgZmllbGQpLFxuICAgICAgICAgIH0pKX1cbiAgICAgICAgICBmaWVsZFR5cGVzPXtmaWVsZFR5cGVzfVxuICAgICAgICAgIGZvcmNlUmVuZGVyPXtmb3JjZVJlbmRlcn1cbiAgICAgICAgICBpbmRleFBhdGg9e2luZGV4UGF0aH1cbiAgICAgICAgICBtYXJnaW5zPVwic21hbGxcIlxuICAgICAgICAgIHBlcm1pc3Npb25zPXtwZXJtaXNzaW9ucz8uZmllbGRzfVxuICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgLz5cbiAgICAgIDwvQ29sbGFwc2libGU+XG4gICAgPC9kaXY+XG4gIClcbn1cbiJdLCJuYW1lcyI6WyJBcnJheVJvdyIsImJhc2VDbGFzcyIsIkN1c3RvbVJvd0xhYmVsIiwiYWRkUm93IiwiYXR0cmlidXRlcyIsImR1cGxpY2F0ZVJvdyIsImZpZWxkVHlwZXMiLCJmaWVsZHMiLCJmb3JjZVJlbmRlciIsImhhc01heFJvd3MiLCJpbmRleFBhdGgiLCJpc1NvcnRhYmxlIiwibGFiZWxzIiwibGlzdGVuZXJzIiwibW92ZVJvdyIsInBhdGgiLCJwYXJlbnRQYXRoIiwicGVybWlzc2lvbnMiLCJyZWFkT25seSIsInJlbW92ZVJvdyIsInJvdyIsInJvd0NvdW50Iiwicm93SW5kZXgiLCJzZXRDb2xsYXBzZSIsInNldE5vZGVSZWYiLCJ0cmFuc2Zvcm0iLCJpMThuIiwidXNlVHJhbnNsYXRpb24iLCJoYXNTdWJtaXR0ZWQiLCJ1c2VGb3JtU3VibWl0dGVkIiwiZmFsbGJhY2tMYWJlbCIsImdldFRyYW5zbGF0aW9uIiwic2luZ3VsYXIiLCJTdHJpbmciLCJwYWRTdGFydCIsImNoaWxkRXJyb3JQYXRoc0NvdW50IiwiY2hpbGRFcnJvclBhdGhzIiwic2l6ZSIsImZpZWxkSGFzRXJyb3JzIiwiY2xhc3NOYW1lcyIsImZpbHRlciIsIkJvb2xlYW4iLCJqb2luIiwiZGl2IiwiaWQiLCJzcGxpdCIsImtleSIsInJlZiIsInN0eWxlIiwiQ29sbGFwc2libGUiLCJhY3Rpb25zIiwiQXJyYXlBY3Rpb24iLCJpbmRleCIsInVuZGVmaW5lZCIsImNsYXNzTmFtZSIsImNvbGxhcHNlZCIsImNvbGxhcHNpYmxlU3R5bGUiLCJkcmFnSGFuZGxlUHJvcHMiLCJoZWFkZXIiLCJSb3dMYWJlbCIsImxhYmVsIiwicm93TnVtYmVyIiwiRXJyb3JQaWxsIiwiY291bnQiLCJ3aXRoTWVzc2FnZSIsIm9uVG9nZ2xlIiwiSGlkZGVuSW5wdXQiLCJuYW1lIiwidmFsdWUiLCJSZW5kZXJGaWVsZHMiLCJmaWVsZFNjaGVtYSIsIm1hcCIsImZpZWxkIiwiY3JlYXRlTmVzdGVk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