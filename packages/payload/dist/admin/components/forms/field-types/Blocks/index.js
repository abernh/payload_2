"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reacti18next = require("react-i18next");
const _validations = require("../../../../../fields/validations");
const _getTranslation = require("../../../../../utilities/getTranslation");
const _scrollToID = require("../../../../utilities/scrollToID");
const _Banner = /*#__PURE__*/ _interop_require_default(require("../../../elements/Banner"));
const _Button = /*#__PURE__*/ _interop_require_default(require("../../../elements/Button"));
const _DraggableSortable = /*#__PURE__*/ _interop_require_default(require("../../../elements/DraggableSortable"));
const _DraggableSortableItem = /*#__PURE__*/ _interop_require_default(require("../../../elements/DraggableSortable/DraggableSortableItem"));
const _Drawer = require("../../../elements/Drawer");
const _useDrawerSlug = require("../../../elements/Drawer/useDrawerSlug");
const _ErrorPill = require("../../../elements/ErrorPill");
const _Config = require("../../../utilities/Config");
const _DocumentInfo = require("../../../utilities/DocumentInfo");
const _Locale = require("../../../utilities/Locale");
const _Error = /*#__PURE__*/ _interop_require_default(require("../../Error"));
const _FieldDescription = /*#__PURE__*/ _interop_require_default(require("../../FieldDescription"));
const _context = require("../../Form/context");
const _NullifyField = require("../../NullifyField");
const _useField = /*#__PURE__*/ _interop_require_default(require("../../useField"));
const _withCondition = /*#__PURE__*/ _interop_require_default(require("../../withCondition"));
const _shared = require("../shared");
const _BlockRow = require("./BlockRow");
const _BlocksDrawer = require("./BlocksDrawer");
require("./index.scss");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const baseClass = 'blocks-field';
const BlocksField = (props)=>{
    const { i18n, t } = (0, _reacti18next.useTranslation)('fields');
    const { name, admin: { className, condition, description, isSortable = true, readOnly }, blocks, fieldTypes, forceRender = false, indexPath, label, labels: labelsFromProps, localized, maxRows, minRows, path: pathFromProps, permissions, required, validate = _validations.blocks } = props;
    const path = pathFromProps || name;
    const { setDocFieldPreferences } = (0, _DocumentInfo.useDocumentInfo)();
    const { addFieldRow, dispatchFields, removeFieldRow, setModified } = (0, _context.useForm)();
    const { code: locale } = (0, _Locale.useLocale)();
    const { localization } = (0, _Config.useConfig)();
    const drawerSlug = (0, _useDrawerSlug.useDrawerSlug)('blocks-drawer');
    const submitted = (0, _context.useFormSubmitted)();
    const labels = {
        plural: t('blocks'),
        singular: t('block'),
        ...labelsFromProps
    };
    const editingDefaultLocale = (()=>{
        if (localization && localization.fallback) {
            const defaultLocale = localization.defaultLocale || 'en';
            return locale === defaultLocale;
        }
        return true;
    })();
    const memoizedValidate = (0, _react.useCallback)((value, options)=>{
        // alternative locales can be null
        if (!editingDefaultLocale && value === null) {
            return true;
        }
        return validate(value, {
            ...options,
            maxRows,
            minRows,
            required
        });
    }, [
        maxRows,
        minRows,
        required,
        validate,
        editingDefaultLocale
    ]);
    const { errorMessage, rows = [], showError, valid, value } = (0, _useField.default)({
        condition,
        hasRows: true,
        path,
        validate: memoizedValidate
    });
    const addRow = (0, _react.useCallback)(async (rowIndex, blockType)=>{
        await addFieldRow({
            data: {
                blockType
            },
            path,
            rowIndex
        });
        setModified(true);
        setTimeout(()=>{
            (0, _scrollToID.scrollToID)(`${path}-row-${rowIndex + 1}`);
        }, 0);
    }, [
        addFieldRow,
        path,
        setModified
    ]);
    const duplicateRow = (0, _react.useCallback)((rowIndex)=>{
        dispatchFields({
            type: 'DUPLICATE_ROW',
            path,
            rowIndex
        });
        setModified(true);
        setTimeout(()=>{
            (0, _scrollToID.scrollToID)(`${path}-row-${rowIndex + 1}`);
        }, 0);
    }, [
        dispatchFields,
        path,
        setModified
    ]);
    const removeRow = (0, _react.useCallback)((rowIndex)=>{
        removeFieldRow({
            path,
            rowIndex
        });
        setModified(true);
    }, [
        path,
        removeFieldRow,
        setModified
    ]);
    const moveRow = (0, _react.useCallback)((moveFromIndex, moveToIndex)=>{
        dispatchFields({
            type: 'MOVE_ROW',
            moveFromIndex,
            moveToIndex,
            path
        });
        setModified(true);
    }, [
        dispatchFields,
        path,
        setModified
    ]);
    const toggleCollapseAll = (0, _react.useCallback)((collapsed)=>{
        dispatchFields({
            type: 'SET_ALL_ROWS_COLLAPSED',
            collapsed,
            path,
            setDocFieldPreferences
        });
    }, [
        dispatchFields,
        path,
        setDocFieldPreferences
    ]);
    const setCollapse = (0, _react.useCallback)((rowID, collapsed)=>{
        dispatchFields({
            type: 'SET_ROW_COLLAPSED',
            collapsed,
            path,
            rowID,
            setDocFieldPreferences
        });
    }, [
        dispatchFields,
        path,
        setDocFieldPreferences
    ]);
    const hasMaxRows = maxRows && rows.length >= maxRows;
    const fieldErrorCount = rows.reduce((total, row)=>total + (row?.childErrorPaths?.size || 0), 0);
    const fieldHasErrors = submitted && fieldErrorCount + (valid ? 0 : 1) > 0;
    const showMinRows = rows.length < minRows || required && rows.length === 0;
    const showRequired = readOnly && rows.length === 0;
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: [
            _shared.fieldBaseClass,
            baseClass,
            className,
            fieldHasErrors ? `${baseClass}--has-error` : `${baseClass}--has-no-error`
        ].filter(Boolean).join(' '),
        id: `field-${path.replace(/\./g, '__')}`
    }, showError && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__error-wrap`
    }, /*#__PURE__*/ _react.default.createElement(_Error.default, {
        message: errorMessage,
        showError: showError
    })), /*#__PURE__*/ _react.default.createElement("header", {
        className: `${baseClass}__header`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__header-wrap`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__heading-with-error`
    }, /*#__PURE__*/ _react.default.createElement("h3", null, (0, _getTranslation.getTranslation)(label || name, i18n)), fieldHasErrors && fieldErrorCount > 0 && /*#__PURE__*/ _react.default.createElement(_ErrorPill.ErrorPill, {
        count: fieldErrorCount,
        withMessage: true
    })), rows.length > 0 && /*#__PURE__*/ _react.default.createElement("ul", {
        className: `${baseClass}__header-actions`
    }, /*#__PURE__*/ _react.default.createElement("li", null, /*#__PURE__*/ _react.default.createElement("button", {
        className: `${baseClass}__header-action`,
        onClick: ()=>toggleCollapseAll(true),
        type: "button"
    }, t('collapseAll'))), /*#__PURE__*/ _react.default.createElement("li", null, /*#__PURE__*/ _react.default.createElement("button", {
        className: `${baseClass}__header-action`,
        onClick: ()=>toggleCollapseAll(false),
        type: "button"
    }, t('showAll'))))), /*#__PURE__*/ _react.default.createElement(_FieldDescription.default, {
        description: description,
        path: path,
        value: value
    })), /*#__PURE__*/ _react.default.createElement(_NullifyField.NullifyLocaleField, {
        fieldValue: value,
        localized: localized,
        path: path
    }), (rows.length > 0 || !valid && (showRequired || showMinRows)) && /*#__PURE__*/ _react.default.createElement(_DraggableSortable.default, {
        className: `${baseClass}__rows`,
        ids: rows.map((row)=>row.id),
        onDragEnd: ({ moveFromIndex, moveToIndex })=>moveRow(moveFromIndex, moveToIndex)
    }, rows.map((row, i)=>{
        const { blockType } = row;
        const blockToRender = blocks.find((block)=>block.slug === blockType);
        if (blockToRender) {
            return /*#__PURE__*/ _react.default.createElement(_DraggableSortableItem.default, {
                disabled: readOnly || !isSortable,
                id: row.id,
                key: row.id
            }, (draggableSortableItemProps)=>/*#__PURE__*/ _react.default.createElement(_BlockRow.BlockRow, {
                    ...draggableSortableItemProps,
                    addRow: addRow,
                    blockToRender: blockToRender,
                    blocks: blocks,
                    duplicateRow: duplicateRow,
                    fieldTypes: fieldTypes,
                    forceRender: forceRender,
                    hasMaxRows: hasMaxRows,
                    indexPath: indexPath,
                    isSortable: isSortable,
                    labels: labels,
                    moveRow: moveRow,
                    path: path,
                    permissions: permissions,
                    readOnly: readOnly,
                    removeRow: removeRow,
                    row: row,
                    rowCount: rows.length,
                    rowIndex: i,
                    setCollapse: setCollapse
                }));
        }
        return null;
    }), !editingDefaultLocale && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, showMinRows && /*#__PURE__*/ _react.default.createElement(_Banner.default, {
        type: "error"
    }, t('validation:requiresAtLeast', {
        count: minRows,
        label: (0, _getTranslation.getTranslation)(minRows === 1 || typeof minRows === 'undefined' ? labels.singular : labels.plural, i18n)
    })), showRequired && /*#__PURE__*/ _react.default.createElement(_Banner.default, null, t('validation:fieldHasNo', {
        label: (0, _getTranslation.getTranslation)(labels.plural, i18n)
    })))), !readOnly && !hasMaxRows && /*#__PURE__*/ _react.default.createElement(_react.Fragment, null, /*#__PURE__*/ _react.default.createElement(_Drawer.DrawerToggler, {
        className: `${baseClass}__drawer-toggler`,
        slug: drawerSlug
    }, /*#__PURE__*/ _react.default.createElement(_Button.default, {
        buttonStyle: "icon-label",
        el: "span",
        icon: "plus",
        iconPosition: "left",
        iconStyle: "with-border"
    }, t('addLabel', {
        label: (0, _getTranslation.getTranslation)(labels.singular, i18n)
    }))), /*#__PURE__*/ _react.default.createElement(_BlocksDrawer.BlocksDrawer, {
        addRow: addRow,
        addRowIndex: rows?.length || 0,
        blocks: blocks,
        drawerSlug: drawerSlug,
        labels: labels
    })));
};
const _default = (0, _withCondition.default)(BlocksField);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Zvcm1zL2ZpZWxkLXR5cGVzL0Jsb2Nrcy9pbmRleC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IEZyYWdtZW50LCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuXG5pbXBvcnQgdHlwZSB7IFByb3BzIH0gZnJvbSAnLi90eXBlcydcblxuaW1wb3J0IHsgYmxvY2tzIGFzIGJsb2Nrc1ZhbGlkYXRvciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2ZpZWxkcy92YWxpZGF0aW9ucydcbmltcG9ydCB7IGdldFRyYW5zbGF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbGl0aWVzL2dldFRyYW5zbGF0aW9uJ1xuaW1wb3J0IHsgc2Nyb2xsVG9JRCB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdGllcy9zY3JvbGxUb0lEJ1xuaW1wb3J0IEJhbm5lciBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9CYW5uZXInXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0J1dHRvbidcbmltcG9ydCBEcmFnZ2FibGVTb3J0YWJsZSBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9EcmFnZ2FibGVTb3J0YWJsZSdcbmltcG9ydCBEcmFnZ2FibGVTb3J0YWJsZUl0ZW0gZnJvbSAnLi4vLi4vLi4vZWxlbWVudHMvRHJhZ2dhYmxlU29ydGFibGUvRHJhZ2dhYmxlU29ydGFibGVJdGVtJ1xuaW1wb3J0IHsgRHJhd2VyVG9nZ2xlciB9IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0RyYXdlcidcbmltcG9ydCB7IHVzZURyYXdlclNsdWcgfSBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9EcmF3ZXIvdXNlRHJhd2VyU2x1ZydcbmltcG9ydCB7IEVycm9yUGlsbCB9IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0Vycm9yUGlsbCdcbmltcG9ydCB7IHVzZUNvbmZpZyB9IGZyb20gJy4uLy4uLy4uL3V0aWxpdGllcy9Db25maWcnXG5pbXBvcnQgeyB1c2VEb2N1bWVudEluZm8gfSBmcm9tICcuLi8uLi8uLi91dGlsaXRpZXMvRG9jdW1lbnRJbmZvJ1xuaW1wb3J0IHsgdXNlTG9jYWxlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0aWVzL0xvY2FsZSdcbmltcG9ydCBFcnJvciBmcm9tICcuLi8uLi9FcnJvcidcbmltcG9ydCBGaWVsZERlc2NyaXB0aW9uIGZyb20gJy4uLy4uL0ZpZWxkRGVzY3JpcHRpb24nXG5pbXBvcnQgeyB1c2VGb3JtLCB1c2VGb3JtU3VibWl0dGVkIH0gZnJvbSAnLi4vLi4vRm9ybS9jb250ZXh0J1xuaW1wb3J0IHsgTnVsbGlmeUxvY2FsZUZpZWxkIH0gZnJvbSAnLi4vLi4vTnVsbGlmeUZpZWxkJ1xuaW1wb3J0IHVzZUZpZWxkIGZyb20gJy4uLy4uL3VzZUZpZWxkJ1xuaW1wb3J0IHdpdGhDb25kaXRpb24gZnJvbSAnLi4vLi4vd2l0aENvbmRpdGlvbidcbmltcG9ydCB7IGZpZWxkQmFzZUNsYXNzIH0gZnJvbSAnLi4vc2hhcmVkJ1xuaW1wb3J0IHsgQmxvY2tSb3cgfSBmcm9tICcuL0Jsb2NrUm93J1xuaW1wb3J0IHsgQmxvY2tzRHJhd2VyIH0gZnJvbSAnLi9CbG9ja3NEcmF3ZXInXG5pbXBvcnQgJy4vaW5kZXguc2NzcydcblxuY29uc3QgYmFzZUNsYXNzID0gJ2Jsb2Nrcy1maWVsZCdcblxuY29uc3QgQmxvY2tzRmllbGQ6IFJlYWN0LkZDPFByb3BzPiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IGkxOG4sIHQgfSA9IHVzZVRyYW5zbGF0aW9uKCdmaWVsZHMnKVxuXG4gIGNvbnN0IHtcbiAgICBuYW1lLFxuICAgIGFkbWluOiB7IGNsYXNzTmFtZSwgY29uZGl0aW9uLCBkZXNjcmlwdGlvbiwgaXNTb3J0YWJsZSA9IHRydWUsIHJlYWRPbmx5IH0sXG4gICAgYmxvY2tzLFxuICAgIGZpZWxkVHlwZXMsXG4gICAgZm9yY2VSZW5kZXIgPSBmYWxzZSxcbiAgICBpbmRleFBhdGgsXG4gICAgbGFiZWwsXG4gICAgbGFiZWxzOiBsYWJlbHNGcm9tUHJvcHMsXG4gICAgbG9jYWxpemVkLFxuICAgIG1heFJvd3MsXG4gICAgbWluUm93cyxcbiAgICBwYXRoOiBwYXRoRnJvbVByb3BzLFxuICAgIHBlcm1pc3Npb25zLFxuICAgIHJlcXVpcmVkLFxuICAgIHZhbGlkYXRlID0gYmxvY2tzVmFsaWRhdG9yLFxuICB9ID0gcHJvcHNcblxuICBjb25zdCBwYXRoID0gcGF0aEZyb21Qcm9wcyB8fCBuYW1lXG5cbiAgY29uc3QgeyBzZXREb2NGaWVsZFByZWZlcmVuY2VzIH0gPSB1c2VEb2N1bWVudEluZm8oKVxuICBjb25zdCB7IGFkZEZpZWxkUm93LCBkaXNwYXRjaEZpZWxkcywgcmVtb3ZlRmllbGRSb3csIHNldE1vZGlmaWVkIH0gPSB1c2VGb3JtKClcbiAgY29uc3QgeyBjb2RlOiBsb2NhbGUgfSA9IHVzZUxvY2FsZSgpXG4gIGNvbnN0IHsgbG9jYWxpemF0aW9uIH0gPSB1c2VDb25maWcoKVxuICBjb25zdCBkcmF3ZXJTbHVnID0gdXNlRHJhd2VyU2x1ZygnYmxvY2tzLWRyYXdlcicpXG4gIGNvbnN0IHN1Ym1pdHRlZCA9IHVzZUZvcm1TdWJtaXR0ZWQoKVxuXG4gIGNvbnN0IGxhYmVscyA9IHtcbiAgICBwbHVyYWw6IHQoJ2Jsb2NrcycpLFxuICAgIHNpbmd1bGFyOiB0KCdibG9jaycpLFxuICAgIC4uLmxhYmVsc0Zyb21Qcm9wcyxcbiAgfVxuXG4gIGNvbnN0IGVkaXRpbmdEZWZhdWx0TG9jYWxlID0gKCgpID0+IHtcbiAgICBpZiAobG9jYWxpemF0aW9uICYmIGxvY2FsaXphdGlvbi5mYWxsYmFjaykge1xuICAgICAgY29uc3QgZGVmYXVsdExvY2FsZSA9IGxvY2FsaXphdGlvbi5kZWZhdWx0TG9jYWxlIHx8ICdlbidcbiAgICAgIHJldHVybiBsb2NhbGUgPT09IGRlZmF1bHRMb2NhbGVcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9KSgpXG5cbiAgY29uc3QgbWVtb2l6ZWRWYWxpZGF0ZSA9IHVzZUNhbGxiYWNrKFxuICAgICh2YWx1ZSwgb3B0aW9ucykgPT4ge1xuICAgICAgLy8gYWx0ZXJuYXRpdmUgbG9jYWxlcyBjYW4gYmUgbnVsbFxuICAgICAgaWYgKCFlZGl0aW5nRGVmYXVsdExvY2FsZSAmJiB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkYXRlKHZhbHVlLCB7IC4uLm9wdGlvbnMsIG1heFJvd3MsIG1pblJvd3MsIHJlcXVpcmVkIH0pXG4gICAgfSxcbiAgICBbbWF4Um93cywgbWluUm93cywgcmVxdWlyZWQsIHZhbGlkYXRlLCBlZGl0aW5nRGVmYXVsdExvY2FsZV0sXG4gIClcblxuICBjb25zdCB7XG4gICAgZXJyb3JNZXNzYWdlLFxuICAgIHJvd3MgPSBbXSxcbiAgICBzaG93RXJyb3IsXG4gICAgdmFsaWQsXG4gICAgdmFsdWUsXG4gIH0gPSB1c2VGaWVsZDxudW1iZXI+KHtcbiAgICBjb25kaXRpb24sXG4gICAgaGFzUm93czogdHJ1ZSxcbiAgICBwYXRoLFxuICAgIHZhbGlkYXRlOiBtZW1vaXplZFZhbGlkYXRlLFxuICB9KVxuXG4gIGNvbnN0IGFkZFJvdyA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChyb3dJbmRleDogbnVtYmVyLCBibG9ja1R5cGU6IHN0cmluZykgPT4ge1xuICAgICAgYXdhaXQgYWRkRmllbGRSb3coe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgYmxvY2tUeXBlLFxuICAgICAgICB9LFxuICAgICAgICBwYXRoLFxuICAgICAgICByb3dJbmRleCxcbiAgICAgIH0pXG4gICAgICBzZXRNb2RpZmllZCh0cnVlKVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2Nyb2xsVG9JRChgJHtwYXRofS1yb3ctJHtyb3dJbmRleCArIDF9YClcbiAgICAgIH0sIDApXG4gICAgfSxcbiAgICBbYWRkRmllbGRSb3csIHBhdGgsIHNldE1vZGlmaWVkXSxcbiAgKVxuXG4gIGNvbnN0IGR1cGxpY2F0ZVJvdyA9IHVzZUNhbGxiYWNrKFxuICAgIChyb3dJbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBkaXNwYXRjaEZpZWxkcyh7IHR5cGU6ICdEVVBMSUNBVEVfUk9XJywgcGF0aCwgcm93SW5kZXggfSlcbiAgICAgIHNldE1vZGlmaWVkKHRydWUpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzY3JvbGxUb0lEKGAke3BhdGh9LXJvdy0ke3Jvd0luZGV4ICsgMX1gKVxuICAgICAgfSwgMClcbiAgICB9LFxuICAgIFtkaXNwYXRjaEZpZWxkcywgcGF0aCwgc2V0TW9kaWZpZWRdLFxuICApXG5cbiAgY29uc3QgcmVtb3ZlUm93ID0gdXNlQ2FsbGJhY2soXG4gICAgKHJvd0luZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIHJlbW92ZUZpZWxkUm93KHsgcGF0aCwgcm93SW5kZXggfSlcbiAgICAgIHNldE1vZGlmaWVkKHRydWUpXG4gICAgfSxcbiAgICBbcGF0aCwgcmVtb3ZlRmllbGRSb3csIHNldE1vZGlmaWVkXSxcbiAgKVxuXG4gIGNvbnN0IG1vdmVSb3cgPSB1c2VDYWxsYmFjayhcbiAgICAobW92ZUZyb21JbmRleDogbnVtYmVyLCBtb3ZlVG9JbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBkaXNwYXRjaEZpZWxkcyh7IHR5cGU6ICdNT1ZFX1JPVycsIG1vdmVGcm9tSW5kZXgsIG1vdmVUb0luZGV4LCBwYXRoIH0pXG4gICAgICBzZXRNb2RpZmllZCh0cnVlKVxuICAgIH0sXG4gICAgW2Rpc3BhdGNoRmllbGRzLCBwYXRoLCBzZXRNb2RpZmllZF0sXG4gIClcblxuICBjb25zdCB0b2dnbGVDb2xsYXBzZUFsbCA9IHVzZUNhbGxiYWNrKFxuICAgIChjb2xsYXBzZWQ6IGJvb2xlYW4pID0+IHtcbiAgICAgIGRpc3BhdGNoRmllbGRzKHsgdHlwZTogJ1NFVF9BTExfUk9XU19DT0xMQVBTRUQnLCBjb2xsYXBzZWQsIHBhdGgsIHNldERvY0ZpZWxkUHJlZmVyZW5jZXMgfSlcbiAgICB9LFxuICAgIFtkaXNwYXRjaEZpZWxkcywgcGF0aCwgc2V0RG9jRmllbGRQcmVmZXJlbmNlc10sXG4gIClcblxuICBjb25zdCBzZXRDb2xsYXBzZSA9IHVzZUNhbGxiYWNrKFxuICAgIChyb3dJRDogc3RyaW5nLCBjb2xsYXBzZWQ6IGJvb2xlYW4pID0+IHtcbiAgICAgIGRpc3BhdGNoRmllbGRzKHsgdHlwZTogJ1NFVF9ST1dfQ09MTEFQU0VEJywgY29sbGFwc2VkLCBwYXRoLCByb3dJRCwgc2V0RG9jRmllbGRQcmVmZXJlbmNlcyB9KVxuICAgIH0sXG4gICAgW2Rpc3BhdGNoRmllbGRzLCBwYXRoLCBzZXREb2NGaWVsZFByZWZlcmVuY2VzXSxcbiAgKVxuXG4gIGNvbnN0IGhhc01heFJvd3MgPSBtYXhSb3dzICYmIHJvd3MubGVuZ3RoID49IG1heFJvd3NcblxuICBjb25zdCBmaWVsZEVycm9yQ291bnQgPSByb3dzLnJlZHVjZSgodG90YWwsIHJvdykgPT4gdG90YWwgKyAocm93Py5jaGlsZEVycm9yUGF0aHM/LnNpemUgfHwgMCksIDApXG4gIGNvbnN0IGZpZWxkSGFzRXJyb3JzID0gc3VibWl0dGVkICYmIGZpZWxkRXJyb3JDb3VudCArICh2YWxpZCA/IDAgOiAxKSA+IDBcblxuICBjb25zdCBzaG93TWluUm93cyA9IHJvd3MubGVuZ3RoIDwgbWluUm93cyB8fCAocmVxdWlyZWQgJiYgcm93cy5sZW5ndGggPT09IDApXG4gIGNvbnN0IHNob3dSZXF1aXJlZCA9IHJlYWRPbmx5ICYmIHJvd3MubGVuZ3RoID09PSAwXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e1tcbiAgICAgICAgZmllbGRCYXNlQ2xhc3MsXG4gICAgICAgIGJhc2VDbGFzcyxcbiAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgICBmaWVsZEhhc0Vycm9ycyA/IGAke2Jhc2VDbGFzc30tLWhhcy1lcnJvcmAgOiBgJHtiYXNlQ2xhc3N9LS1oYXMtbm8tZXJyb3JgLFxuICAgICAgXVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgIC5qb2luKCcgJyl9XG4gICAgICBpZD17YGZpZWxkLSR7cGF0aC5yZXBsYWNlKC9cXC4vZywgJ19fJyl9YH1cbiAgICA+XG4gICAgICB7c2hvd0Vycm9yICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2Vycm9yLXdyYXBgfT5cbiAgICAgICAgICA8RXJyb3IgbWVzc2FnZT17ZXJyb3JNZXNzYWdlfSBzaG93RXJyb3I9e3Nob3dFcnJvcn0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2hlYWRlcmB9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9faGVhZGVyLXdyYXBgfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9faGVhZGluZy13aXRoLWVycm9yYH0+XG4gICAgICAgICAgICA8aDM+e2dldFRyYW5zbGF0aW9uKGxhYmVsIHx8IG5hbWUsIGkxOG4pfTwvaDM+XG5cbiAgICAgICAgICAgIHtmaWVsZEhhc0Vycm9ycyAmJiBmaWVsZEVycm9yQ291bnQgPiAwICYmIChcbiAgICAgICAgICAgICAgPEVycm9yUGlsbCBjb3VudD17ZmllbGRFcnJvckNvdW50fSB3aXRoTWVzc2FnZSAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7cm93cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2hlYWRlci1hY3Rpb25zYH0+XG4gICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2hlYWRlci1hY3Rpb25gfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdG9nZ2xlQ29sbGFwc2VBbGwodHJ1ZSl9XG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dCgnY29sbGFwc2VBbGwnKX1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9faGVhZGVyLWFjdGlvbmB9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0b2dnbGVDb2xsYXBzZUFsbChmYWxzZSl9XG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dCgnc2hvd0FsbCcpfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEZpZWxkRGVzY3JpcHRpb24gZGVzY3JpcHRpb249e2Rlc2NyaXB0aW9ufSBwYXRoPXtwYXRofSB2YWx1ZT17dmFsdWV9IC8+XG4gICAgICA8L2hlYWRlcj5cbiAgICAgIDxOdWxsaWZ5TG9jYWxlRmllbGQgZmllbGRWYWx1ZT17dmFsdWV9IGxvY2FsaXplZD17bG9jYWxpemVkfSBwYXRoPXtwYXRofSAvPlxuICAgICAgeyhyb3dzLmxlbmd0aCA+IDAgfHwgKCF2YWxpZCAmJiAoc2hvd1JlcXVpcmVkIHx8IHNob3dNaW5Sb3dzKSkpICYmIChcbiAgICAgICAgPERyYWdnYWJsZVNvcnRhYmxlXG4gICAgICAgICAgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19yb3dzYH1cbiAgICAgICAgICBpZHM9e3Jvd3MubWFwKChyb3cpID0+IHJvdy5pZCl9XG4gICAgICAgICAgb25EcmFnRW5kPXsoeyBtb3ZlRnJvbUluZGV4LCBtb3ZlVG9JbmRleCB9KSA9PiBtb3ZlUm93KG1vdmVGcm9tSW5kZXgsIG1vdmVUb0luZGV4KX1cbiAgICAgICAgPlxuICAgICAgICAgIHtyb3dzLm1hcCgocm93LCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGJsb2NrVHlwZSB9ID0gcm93XG4gICAgICAgICAgICBjb25zdCBibG9ja1RvUmVuZGVyID0gYmxvY2tzLmZpbmQoKGJsb2NrKSA9PiBibG9jay5zbHVnID09PSBibG9ja1R5cGUpXG5cbiAgICAgICAgICAgIGlmIChibG9ja1RvUmVuZGVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPERyYWdnYWJsZVNvcnRhYmxlSXRlbSBkaXNhYmxlZD17cmVhZE9ubHkgfHwgIWlzU29ydGFibGV9IGlkPXtyb3cuaWR9IGtleT17cm93LmlkfT5cbiAgICAgICAgICAgICAgICAgIHsoZHJhZ2dhYmxlU29ydGFibGVJdGVtUHJvcHMpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPEJsb2NrUm93XG4gICAgICAgICAgICAgICAgICAgICAgey4uLmRyYWdnYWJsZVNvcnRhYmxlSXRlbVByb3BzfVxuICAgICAgICAgICAgICAgICAgICAgIGFkZFJvdz17YWRkUm93fVxuICAgICAgICAgICAgICAgICAgICAgIGJsb2NrVG9SZW5kZXI9e2Jsb2NrVG9SZW5kZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgYmxvY2tzPXtibG9ja3N9XG4gICAgICAgICAgICAgICAgICAgICAgZHVwbGljYXRlUm93PXtkdXBsaWNhdGVSb3d9XG4gICAgICAgICAgICAgICAgICAgICAgZmllbGRUeXBlcz17ZmllbGRUeXBlc31cbiAgICAgICAgICAgICAgICAgICAgICBmb3JjZVJlbmRlcj17Zm9yY2VSZW5kZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgaGFzTWF4Um93cz17aGFzTWF4Um93c31cbiAgICAgICAgICAgICAgICAgICAgICBpbmRleFBhdGg9e2luZGV4UGF0aH1cbiAgICAgICAgICAgICAgICAgICAgICBpc1NvcnRhYmxlPXtpc1NvcnRhYmxlfVxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVscz17bGFiZWxzfVxuICAgICAgICAgICAgICAgICAgICAgIG1vdmVSb3c9e21vdmVSb3d9XG4gICAgICAgICAgICAgICAgICAgICAgcGF0aD17cGF0aH1cbiAgICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucz17cGVybWlzc2lvbnN9XG4gICAgICAgICAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZVJvdz17cmVtb3ZlUm93fVxuICAgICAgICAgICAgICAgICAgICAgIHJvdz17cm93fVxuICAgICAgICAgICAgICAgICAgICAgIHJvd0NvdW50PXtyb3dzLmxlbmd0aH1cbiAgICAgICAgICAgICAgICAgICAgICByb3dJbmRleD17aX1cbiAgICAgICAgICAgICAgICAgICAgICBzZXRDb2xsYXBzZT17c2V0Q29sbGFwc2V9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvRHJhZ2dhYmxlU29ydGFibGVJdGVtPlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgICAgfSl9XG4gICAgICAgICAgeyFlZGl0aW5nRGVmYXVsdExvY2FsZSAmJiAoXG4gICAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAgICAgIHtzaG93TWluUm93cyAmJiAoXG4gICAgICAgICAgICAgICAgPEJhbm5lciB0eXBlPVwiZXJyb3JcIj5cbiAgICAgICAgICAgICAgICAgIHt0KCd2YWxpZGF0aW9uOnJlcXVpcmVzQXRMZWFzdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IG1pblJvd3MsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBnZXRUcmFuc2xhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICBtaW5Sb3dzID09PSAxIHx8IHR5cGVvZiBtaW5Sb3dzID09PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyBsYWJlbHMuc2luZ3VsYXJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbGFiZWxzLnBsdXJhbCxcbiAgICAgICAgICAgICAgICAgICAgICBpMThuLFxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgPC9CYW5uZXI+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHtzaG93UmVxdWlyZWQgJiYgKFxuICAgICAgICAgICAgICAgIDxCYW5uZXI+XG4gICAgICAgICAgICAgICAgICB7dCgndmFsaWRhdGlvbjpmaWVsZEhhc05vJywgeyBsYWJlbDogZ2V0VHJhbnNsYXRpb24obGFiZWxzLnBsdXJhbCwgaTE4bikgfSl9XG4gICAgICAgICAgICAgICAgPC9CYW5uZXI+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvRHJhZ2dhYmxlU29ydGFibGU+XG4gICAgICApfVxuICAgICAgeyFyZWFkT25seSAmJiAhaGFzTWF4Um93cyAmJiAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICA8RHJhd2VyVG9nZ2xlciBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2RyYXdlci10b2dnbGVyYH0gc2x1Zz17ZHJhd2VyU2x1Z30+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGJ1dHRvblN0eWxlPVwiaWNvbi1sYWJlbFwiXG4gICAgICAgICAgICAgIGVsPVwic3BhblwiXG4gICAgICAgICAgICAgIGljb249XCJwbHVzXCJcbiAgICAgICAgICAgICAgaWNvblBvc2l0aW9uPVwibGVmdFwiXG4gICAgICAgICAgICAgIGljb25TdHlsZT1cIndpdGgtYm9yZGVyXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ2FkZExhYmVsJywgeyBsYWJlbDogZ2V0VHJhbnNsYXRpb24obGFiZWxzLnNpbmd1bGFyLCBpMThuKSB9KX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvRHJhd2VyVG9nZ2xlcj5cbiAgICAgICAgICA8QmxvY2tzRHJhd2VyXG4gICAgICAgICAgICBhZGRSb3c9e2FkZFJvd31cbiAgICAgICAgICAgIGFkZFJvd0luZGV4PXtyb3dzPy5sZW5ndGggfHwgMH1cbiAgICAgICAgICAgIGJsb2Nrcz17YmxvY2tzfVxuICAgICAgICAgICAgZHJhd2VyU2x1Zz17ZHJhd2VyU2x1Z31cbiAgICAgICAgICAgIGxhYmVscz17bGFiZWxzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IHdpdGhDb25kaXRpb24oQmxvY2tzRmllbGQpXG4iXSwibmFtZXMiOlsiYmFzZUNsYXNzIiwiQmxvY2tzRmllbGQiLCJwcm9wcyIsImkxOG4iLCJ0IiwidXNlVHJhbnNsYXRpb24iLCJuYW1lIiwiYWRtaW4iLCJjbGFzc05hbWUiLCJjb25kaXRpb24iLCJkZXNjcmlwdGlvbiIsImlzU29ydGFibGUiLCJyZWFkT25seSIsImJsb2NrcyIsImZpZWxkVHlwZXMiLCJmb3JjZVJlbmRlciIsImluZGV4UGF0aCIsImxhYmVsIiwibGFiZWxzIiwibGFiZWxzRnJvbVByb3BzIiwibG9jYWxpemVkIiwibWF4Um93cyIsIm1pblJvd3MiLCJwYXRoIiwicGF0aEZyb21Qcm9wcyIsInBlcm1pc3Npb25zIiwicmVxdWlyZWQiLCJ2YWxpZGF0ZSIsImJsb2Nrc1ZhbGlkYXRvciIsInNldERvY0ZpZWxkUHJlZmVyZW5jZXMiLCJ1c2VEb2N1bWVudEluZm8iLCJhZGRGaWVsZFJvdyIsImRpc3BhdGNoRmllbGRzIiwicmVtb3ZlRmllbGRSb3ciLCJzZXRNb2RpZmllZCIsInVzZUZvcm0iLCJjb2RlIiwibG9jYWxlIiwidXNlTG9jYWxlIiwibG9jYWxpemF0aW9uIiwidXNlQ29uZmlnIiwiZHJhd2VyU2x1ZyIsInVzZURyYXdlclNsdWciLCJzdWJtaXR0ZWQiLCJ1c2VGb3JtU3VibWl0dGVkIiwicGx1cmFsIiwic2luZ3VsYXIiLCJlZGl0aW5nRGVmYXVsdExvY2FsZSIsImZhbGxiYWNrIiwiZGVmYXVsdExvY2FsZSIsIm1lbW9pemVkVmFsaWRhdGUiLCJ1c2VDYWxsYmFjayIsInZhbHVlIiwib3B0aW9ucyIsImVycm9yTWVzc2FnZSIsInJvd3MiLCJzaG93RXJyb3IiLCJ2YWxpZCIsInVzZUZpZWxkIiwiaGFzUm93cyIsImFkZFJvdyIsInJvd0luZGV4IiwiYmxvY2tUeXBlIiwiZGF0YSIsInNldFRpbWVvdXQiLCJzY3JvbGxUb0lEIiwiZHVwbGljYXRlUm93IiwidHlwZSIsInJlbW92ZVJvdyIsIm1vdmVSb3ciLCJtb3ZlRnJvbUluZGV4IiwibW92ZVRvSW5kZXgiLCJ0b2dnbGVDb2xsYXBzZUFsbCIsImNvbGxhcHNlZCIsInNldENvbGxhcHNlIiwicm93SUQiLCJoYXNNYXhSb3dzIiwibGVuZ3RoIiwiZmllbGRFcnJvckNvdW50IiwicmVkdWNlIiwidG90YWwiLCJyb3ciLCJjaGlsZEVycm9yUGF0aHMiLCJzaXplIiwiZmllbGRIYXNFcnJvcnMiLCJzaG93TWluUm93cyIsInNob3dSZXF1aXJlZCIsImRpdiIsImZpZWxkQmFzZUNsYXNzIiwiZmlsdGVyIiwiQm9vbGVhbiIsImpvaW4iLCJpZCIsInJlcGxhY2UiLCJFcnJvciIsIm1lc3NhZ2UiLCJoZWFkZXIiLCJoMyIsImdldFRyYW5zbGF0aW9uIiwiRXJyb3JQaWxsIiwiY291bnQiLCJ3aXRoTWVzc2FnZSIsInVsIiwibGkiLCJidXR0b24iLCJvbkNsaWNrIiwiRmllbGREZXNjcmlwdGlvbiIsIk51bGxpZnlMb2NhbGVGaWVsZCIsImZpZWxkVmFsdWUiLCJEcmFnZ2FibGVTb3J0YWJsZSIsImlkcyIsIm1hcCIsIm9uRHJhZ0VuZCIsImkiLCJibG9ja1RvUmVuZGVyIiwiZmluZCIsImJsb2NrIiwic2x1ZyIsIkRyYWdnYWJsZVNvcnRhYmxlSXRlbSIsImRpc2FibGVkIiwia2V5IiwiZHJhZ2dhYmxlU29ydGFibGVJdGVtUHJvcHMiLCJCbG9ja1JvdyIsInJvd0NvdW50IiwiUmVhY3QiLCJGcmFnbWVudCIsIkJhbm5lciIsIkRyYXdlclRvZ2dsZXIiLCJCdXR0b24iLCJidXR0b25TdHlsZSIsImVsIiwiaWNvbiIsImljb25Qb3NpdGlvbiIsImljb25TdHlsZSIsIkJsb2Nrc0RyYXdlciIsImFkZFJvd0luZGV4Iiwid2l0aENvbmRpdGlvbiJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OytCQXlUQTs7O2VBQUE7OzsrREF6VDZDOzhCQUNkOzZCQUlXO2dDQUNYOzRCQUNKOytEQUNSOytEQUNBOzBFQUNXOzhFQUNJO3dCQUNKOytCQUNBOzJCQUNKO3dCQUNBOzhCQUNNO3dCQUNOOzhEQUNSO3lFQUNXO3lCQUNhOzhCQUNQO2lFQUNkO3NFQUNLO3dCQUNL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