"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    FieldSelect: function() {
        return FieldSelect;
    },
    combineLabel: function() {
        return combineLabel;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reacti18next = require("react-i18next");
const _types = require("../../../../fields/config/types");
const _getTranslation = require("../../../../utilities/getTranslation");
const _context = require("../../forms/Form/context");
const _createNestedFieldPath = require("../../forms/Form/createNestedFieldPath");
const _Label = /*#__PURE__*/ _interop_require_default(require("../../forms/Label"));
const _ReactSelect = /*#__PURE__*/ _interop_require_default(require("../ReactSelect"));
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
const baseClass = 'field-select';
const combineLabel = (prefix, field, i18n)=>`${prefix === '' ? '' : `${prefix} > `}${(0, _getTranslation.getTranslation)(field.label || field.name, i18n) || ''}`;
const reduceFields = (fields, i18n, path = '', labelPrefix = '')=>fields.reduce((fieldsToUse, field)=>{
        // escape for a variety of reasons
        if ((0, _types.fieldAffectsData)(field) && (field.admin?.disableBulkEdit || field.unique || field.hidden || field.admin?.hidden || field.admin?.readOnly)) {
            return fieldsToUse;
        }
        if (field.type === 'collapsible') {
            return [
                ...fieldsToUse,
                ...reduceFields(field.fields, i18n, path, labelPrefix)
            ];
        }
        if (!(field.type === 'array' || field.type === 'blocks') && (0, _types.fieldHasSubFields)(field)) {
            return [
                ...fieldsToUse,
                ...reduceFields(field.fields, i18n, (0, _createNestedFieldPath.createNestedFieldPath)(path, field), combineLabel(labelPrefix, field, i18n))
            ];
        }
        if (field.type === 'tabs') {
            return [
                ...fieldsToUse,
                ...field.tabs.reduce((tabFields, tab)=>{
                    return [
                        ...tabFields,
                        ...reduceFields(tab.fields, i18n, (0, _types.tabHasName)(tab) ? (0, _createNestedFieldPath.createNestedFieldPath)(path, field) : path, combineLabel(labelPrefix, field, i18n))
                    ];
                }, [])
            ];
        }
        const formattedField = {
            label: combineLabel(labelPrefix, field, i18n),
            value: {
                ...field,
                path: (0, _createNestedFieldPath.createNestedFieldPath)(path, field)
            }
        };
        return [
            ...fieldsToUse,
            formattedField
        ];
    }, []);
const FieldSelect = ({ fields, setSelected })=>{
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const [options] = (0, _react.useState)(()=>reduceFields(fields, i18n));
    const { dispatchFields, getFields } = (0, _context.useForm)();
    const handleChange = (selected)=>{
        const activeFields = getFields();
        if (selected === null) {
            setSelected([]);
        } else {
            setSelected(selected.map(({ value })=>value));
        }
        // remove deselected values from form state
        if (selected === null || Object.keys(activeFields).length > selected.length) {
            Object.keys(activeFields).forEach((path)=>{
                if (selected === null || !selected.find((field)=>{
                    return field.value.path === path;
                })) {
                    dispatchFields({
                        path,
                        type: 'REMOVE'
                    });
                }
            });
        }
    };
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: baseClass
    }, /*#__PURE__*/ _react.default.createElement(_Label.default, {
        label: t('fields:selectFieldsToEdit')
    }), /*#__PURE__*/ _react.default.createElement(_ReactSelect.default, {
        isMulti: true,
        onChange: handleChange,
        options: options
    }));
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL0ZpZWxkU2VsZWN0L2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcblxuaW1wb3J0IHR5cGUgeyBGaWVsZCwgRmllbGRXaXRoUGF0aCB9IGZyb20gJy4uLy4uLy4uLy4uL2ZpZWxkcy9jb25maWcvdHlwZXMnXG5cbmltcG9ydCB7IGZpZWxkQWZmZWN0c0RhdGEsIGZpZWxkSGFzU3ViRmllbGRzLCB0YWJIYXNOYW1lIH0gZnJvbSAnLi4vLi4vLi4vLi4vZmllbGRzL2NvbmZpZy90eXBlcydcbmltcG9ydCB7IGdldFRyYW5zbGF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0aWVzL2dldFRyYW5zbGF0aW9uJ1xuaW1wb3J0IHsgdXNlRm9ybSB9IGZyb20gJy4uLy4uL2Zvcm1zL0Zvcm0vY29udGV4dCdcbmltcG9ydCB7IGNyZWF0ZU5lc3RlZEZpZWxkUGF0aCB9IGZyb20gJy4uLy4uL2Zvcm1zL0Zvcm0vY3JlYXRlTmVzdGVkRmllbGRQYXRoJ1xuaW1wb3J0IExhYmVsIGZyb20gJy4uLy4uL2Zvcm1zL0xhYmVsJ1xuaW1wb3J0IFJlYWN0U2VsZWN0IGZyb20gJy4uL1JlYWN0U2VsZWN0J1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdmaWVsZC1zZWxlY3QnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIGZpZWxkczogRmllbGRbXVxuICBzZXRTZWxlY3RlZDogKGZpZWxkczogRmllbGRXaXRoUGF0aFtdKSA9PiB2b2lkXG59XG5cbmV4cG9ydCBjb25zdCBjb21iaW5lTGFiZWwgPSAocHJlZml4LCBmaWVsZCwgaTE4bik6IHN0cmluZyA9PlxuICBgJHtwcmVmaXggPT09ICcnID8gJycgOiBgJHtwcmVmaXh9ID4gYH0ke2dldFRyYW5zbGF0aW9uKGZpZWxkLmxhYmVsIHx8IGZpZWxkLm5hbWUsIGkxOG4pIHx8ICcnfWBcbmNvbnN0IHJlZHVjZUZpZWxkcyA9IChcbiAgZmllbGRzOiBGaWVsZFtdLFxuICBpMThuLFxuICBwYXRoID0gJycsXG4gIGxhYmVsUHJlZml4ID0gJycsXG4pOiB7IGxhYmVsOiBzdHJpbmc7IHZhbHVlOiBGaWVsZFdpdGhQYXRoIH1bXSA9PlxuICBmaWVsZHMucmVkdWNlKChmaWVsZHNUb1VzZSwgZmllbGQpID0+IHtcbiAgICAvLyBlc2NhcGUgZm9yIGEgdmFyaWV0eSBvZiByZWFzb25zXG4gICAgaWYgKFxuICAgICAgZmllbGRBZmZlY3RzRGF0YShmaWVsZCkgJiZcbiAgICAgIChmaWVsZC5hZG1pbj8uZGlzYWJsZUJ1bGtFZGl0IHx8XG4gICAgICAgIGZpZWxkLnVuaXF1ZSB8fFxuICAgICAgICBmaWVsZC5oaWRkZW4gfHxcbiAgICAgICAgZmllbGQuYWRtaW4/LmhpZGRlbiB8fFxuICAgICAgICBmaWVsZC5hZG1pbj8ucmVhZE9ubHkpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmllbGRzVG9Vc2VcbiAgICB9XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09ICdjb2xsYXBzaWJsZScpIHtcbiAgICAgIHJldHVybiBbLi4uZmllbGRzVG9Vc2UsIC4uLnJlZHVjZUZpZWxkcyhmaWVsZC5maWVsZHMsIGkxOG4sIHBhdGgsIGxhYmVsUHJlZml4KV1cbiAgICB9XG4gICAgaWYgKCEoZmllbGQudHlwZSA9PT0gJ2FycmF5JyB8fCBmaWVsZC50eXBlID09PSAnYmxvY2tzJykgJiYgZmllbGRIYXNTdWJGaWVsZHMoZmllbGQpKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAuLi5maWVsZHNUb1VzZSxcbiAgICAgICAgLi4ucmVkdWNlRmllbGRzKFxuICAgICAgICAgIGZpZWxkLmZpZWxkcyxcbiAgICAgICAgICBpMThuLFxuICAgICAgICAgIGNyZWF0ZU5lc3RlZEZpZWxkUGF0aChwYXRoLCBmaWVsZCksXG4gICAgICAgICAgY29tYmluZUxhYmVsKGxhYmVsUHJlZml4LCBmaWVsZCwgaTE4biksXG4gICAgICAgICksXG4gICAgICBdXG4gICAgfVxuICAgIGlmIChmaWVsZC50eXBlID09PSAndGFicycpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIC4uLmZpZWxkc1RvVXNlLFxuICAgICAgICAuLi5maWVsZC50YWJzLnJlZHVjZSgodGFiRmllbGRzLCB0YWIpID0+IHtcbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLi4udGFiRmllbGRzLFxuICAgICAgICAgICAgLi4ucmVkdWNlRmllbGRzKFxuICAgICAgICAgICAgICB0YWIuZmllbGRzLFxuICAgICAgICAgICAgICBpMThuLFxuICAgICAgICAgICAgICB0YWJIYXNOYW1lKHRhYikgPyBjcmVhdGVOZXN0ZWRGaWVsZFBhdGgocGF0aCwgZmllbGQpIDogcGF0aCxcbiAgICAgICAgICAgICAgY29tYmluZUxhYmVsKGxhYmVsUHJlZml4LCBmaWVsZCwgaTE4biksXG4gICAgICAgICAgICApLFxuICAgICAgICAgIF1cbiAgICAgICAgfSwgW10pLFxuICAgICAgXVxuICAgIH1cbiAgICBjb25zdCBmb3JtYXR0ZWRGaWVsZCA9IHtcbiAgICAgIGxhYmVsOiBjb21iaW5lTGFiZWwobGFiZWxQcmVmaXgsIGZpZWxkLCBpMThuKSxcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIC4uLmZpZWxkLFxuICAgICAgICBwYXRoOiBjcmVhdGVOZXN0ZWRGaWVsZFBhdGgocGF0aCwgZmllbGQpLFxuICAgICAgfSxcbiAgICB9XG5cbiAgICByZXR1cm4gWy4uLmZpZWxkc1RvVXNlLCBmb3JtYXR0ZWRGaWVsZF1cbiAgfSwgW10pXG5leHBvcnQgY29uc3QgRmllbGRTZWxlY3Q6IFJlYWN0LkZDPFByb3BzPiA9ICh7IGZpZWxkcywgc2V0U2VsZWN0ZWQgfSkgPT4ge1xuICBjb25zdCB7IGkxOG4sIHQgfSA9IHVzZVRyYW5zbGF0aW9uKCdnZW5lcmFsJylcbiAgY29uc3QgW29wdGlvbnNdID0gdXNlU3RhdGUoKCkgPT4gcmVkdWNlRmllbGRzKGZpZWxkcywgaTE4bikpXG4gIGNvbnN0IHsgZGlzcGF0Y2hGaWVsZHMsIGdldEZpZWxkcyB9ID0gdXNlRm9ybSgpXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChzZWxlY3RlZCkgPT4ge1xuICAgIGNvbnN0IGFjdGl2ZUZpZWxkcyA9IGdldEZpZWxkcygpXG4gICAgaWYgKHNlbGVjdGVkID09PSBudWxsKSB7XG4gICAgICBzZXRTZWxlY3RlZChbXSlcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0U2VsZWN0ZWQoc2VsZWN0ZWQubWFwKCh7IHZhbHVlIH0pID0+IHZhbHVlKSlcbiAgICB9XG4gICAgLy8gcmVtb3ZlIGRlc2VsZWN0ZWQgdmFsdWVzIGZyb20gZm9ybSBzdGF0ZVxuICAgIGlmIChzZWxlY3RlZCA9PT0gbnVsbCB8fCBPYmplY3Qua2V5cyhhY3RpdmVGaWVsZHMpLmxlbmd0aCA+IHNlbGVjdGVkLmxlbmd0aCkge1xuICAgICAgT2JqZWN0LmtleXMoYWN0aXZlRmllbGRzKS5mb3JFYWNoKChwYXRoKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBzZWxlY3RlZCA9PT0gbnVsbCB8fFxuICAgICAgICAgICFzZWxlY3RlZC5maW5kKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLnZhbHVlLnBhdGggPT09IHBhdGhcbiAgICAgICAgICB9KVxuICAgICAgICApIHtcbiAgICAgICAgICBkaXNwYXRjaEZpZWxkcyh7XG4gICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgdHlwZTogJ1JFTU9WRScsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtiYXNlQ2xhc3N9PlxuICAgICAgPExhYmVsIGxhYmVsPXt0KCdmaWVsZHM6c2VsZWN0RmllbGRzVG9FZGl0Jyl9IC8+XG4gICAgICA8UmVhY3RTZWxlY3QgaXNNdWx0aSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBvcHRpb25zPXtvcHRpb25zfSAvPlxuICAgIDwvZGl2PlxuICApXG59XG4iXSwibmFtZXMiOlsiRmllbGRTZWxlY3QiLCJjb21iaW5lTGFiZWwiLCJiYXNlQ2xhc3MiLCJwcmVmaXgiLCJmaWVsZCIsImkxOG4iLCJnZXRUcmFuc2xhdGlvbiIsImxhYmVsIiwibmFtZSIsInJlZHVjZUZpZWxkcyIsImZpZWxkcyIsInBhdGgiLCJsYWJlbFByZWZpeCIsInJlZHVjZSIsImZpZWxkc1RvVXNlIiwiZmllbGRBZmZlY3RzRGF0YSIsImFkbWluIiwiZGlzYWJsZUJ1bGtFZGl0IiwidW5pcXVlIiwiaGlkZGVuIiwicmVhZE9ubHkiLCJ0eXBlIiwiZmllbGRIYXNTdWJGaWVsZHMiLCJjcmVhdGVOZXN0ZWRGaWVsZFBhdGgiLCJ0YWJzIiwidGFiRmllbGRzIiwidGFiIiwidGFiSGFzTmFtZSIsImZvcm1hdHRlZEZpZWxkIiwidmFsdWUiLCJzZXRTZWxlY3RlZCIsInQiLCJ1c2VUcmFuc2xhdGlvbiIsIm9wdGlvbnMiLCJ1c2VTdGF0ZSIsImRpc3BhdGNoRmllbGRzIiwiZ2V0RmllbGRzIiwidXNlRm9ybSIsImhhbmRsZUNoYW5nZSIsInNlbGVjdGVkIiwiYWN0aXZlRmllbGRzIiwibWFwIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImZvckVhY2giLCJmaW5kIiwiZGl2IiwiY2xhc3NOYW1lIiwiTGFiZWwiLCJSZWFjdFNlbGVjdCIsImlzTXVsdGkiLCJvbkNoYW5nZSJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7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