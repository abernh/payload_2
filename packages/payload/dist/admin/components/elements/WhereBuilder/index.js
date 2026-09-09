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
const _qs = /*#__PURE__*/ _interop_require_default(require("qs"));
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reacti18next = require("react-i18next");
const _reactrouterdom = require("react-router-dom");
const _types = require("../../../../exports/types");
const _flattenTopLevelFields = /*#__PURE__*/ _interop_require_default(require("../../../../utilities/flattenTopLevelFields"));
const _getTranslation = require("../../../../utilities/getTranslation");
const _useThrottledEffect = /*#__PURE__*/ _interop_require_default(require("../../../hooks/useThrottledEffect"));
const _createNestedFieldPath = require("../../forms/Form/createNestedFieldPath");
const _SearchParams = require("../../utilities/SearchParams");
const _Button = /*#__PURE__*/ _interop_require_default(require("../Button"));
const _FieldSelect = require("../FieldSelect");
const _Condition = /*#__PURE__*/ _interop_require_default(require("./Condition"));
const _fieldtypes = /*#__PURE__*/ _interop_require_default(require("./field-types"));
require("./index.scss");
const _reducer = /*#__PURE__*/ _interop_require_default(require("./reducer"));
const _transformWhereQuery = require("./transformWhereQuery");
const _validateWhereQuery = /*#__PURE__*/ _interop_require_default(require("./validateWhereQuery"));
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
const baseClass = 'where-builder';
const reduceFields = (fields, i18n, labelPrefix, pathPrefix)=>(0, _flattenTopLevelFields.default)(fields).reduce((reduced, field)=>{
        let operators = [];
        if (field.admin && 'disableListFilter' in field.admin && field.admin?.disableListFilter) return reduced;
        if (field.type === 'group' && 'fields' in field) {
            const translatedLabel = (0, _getTranslation.getTranslation)(field.label || '', i18n);
            const labelWithPrefix = labelPrefix ? translatedLabel ? labelPrefix + ' > ' + translatedLabel : labelPrefix : translatedLabel;
            const pathWithPrefix = field.name ? pathPrefix ? pathPrefix + '.' + field.name : field.name : pathPrefix;
            reduced.push(...reduceFields(field.fields, i18n, labelWithPrefix, pathWithPrefix));
            return reduced;
        }
        if (field.type === 'tab' && 'tabs' in field) {
            const tabs = field.tabs;
            tabs.forEach((tab)=>{
                if (typeof tab.label !== 'boolean') {
                    const localizedTabLabel = (0, _getTranslation.getTranslation)(tab.label, i18n);
                    const labelWithPrefix = labelPrefix ? labelPrefix + ' > ' + localizedTabLabel : localizedTabLabel;
                    const tabPathPrefix = (0, _types.tabHasName)(tab) && tab.name ? pathPrefix ? pathPrefix + '.' + tab.name : tab.name : pathPrefix;
                    if (typeof localizedTabLabel === 'string') {
                        reduced.push(...reduceFields(tab.fields, i18n, labelWithPrefix, tabPathPrefix));
                    }
                }
            });
            return reduced;
        }
        if (field.type === 'row' && 'fields' in field) {
            reduced.push(...reduceFields(field.fields, i18n, labelPrefix, pathPrefix));
            return reduced;
        }
        if (field.type === 'collapsible' && 'fields' in field) {
            const localizedTabLabel = (0, _getTranslation.getTranslation)(field.label || '', i18n);
            const labelWithPrefix = labelPrefix ? labelPrefix + ' > ' + localizedTabLabel : localizedTabLabel;
            reduced.push(...reduceFields(field.fields, i18n, labelWithPrefix, pathPrefix));
            return reduced;
        }
        if (typeof _fieldtypes.default[field.type] === 'object') {
            if (typeof _fieldtypes.default[field.type].operators === 'function') {
                operators = _fieldtypes.default[field.type].operators('hasMany' in field && field.hasMany ? true : false);
            } else {
                operators = _fieldtypes.default[field.type].operators;
            }
            const operatorKeys = new Set();
            const reducedOperators = operators.reduce((acc, operator)=>{
                if (!operatorKeys.has(operator.value)) {
                    operatorKeys.add(operator.value);
                    return [
                        ...acc,
                        {
                            ...operator,
                            label: i18n.t(`operators:${operator.label}`)
                        }
                    ];
                }
                return acc;
            }, []);
            const localizedLabel = (0, _getTranslation.getTranslation)(field.label || field.name, i18n);
            const formattedLabel = labelPrefix ? (0, _FieldSelect.combineLabel)(labelPrefix, field, i18n) : localizedLabel;
            const formattedValue = pathPrefix ? (0, _createNestedFieldPath.createNestedFieldPath)(pathPrefix, field) : field.name;
            const formattedField = {
                label: formattedLabel,
                value: formattedValue,
                ..._fieldtypes.default[field.type],
                operators: reducedOperators,
                props: {
                    ...field
                }
            };
            reduced.push(formattedField);
            return reduced;
        }
        return reduced;
    }, []);
/**
 * The WhereBuilder component is used to render the filter controls for a collection's list view.
 * It is part of the {@link ListControls} component which is used to render the controls (search, filter, where).
 */ const WhereBuilder = (props)=>{
    const { collection: { labels: { plural } = {} } = {}, collection, handleChange, modifySearchQuery = true } = props;
    const history = (0, _reactrouterdom.useHistory)();
    const params = (0, _SearchParams.useSearchParams)();
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    // This handles initializing the where conditions from the search query (URL). That way, if you pass in
    // query params to the URL, the where conditions will be initialized from those and displayed in the UI.
    // Example: /admin/collections/posts?where[or][0][and][0][text][equals]=example%20post
    const [conditions, dispatchConditions] = (0, _react.useReducer)(_reducer.default, params.where, (whereFromSearch)=>{
        if (modifySearchQuery && whereFromSearch) {
            if ((0, _validateWhereQuery.default)(whereFromSearch)) {
                return whereFromSearch.or;
            }
            // Transform the where query to be in the right format. This will transform something simple like [text][equals]=example%20post to the right format
            const transformedWhere = (0, _transformWhereQuery.transformWhereQuery)(whereFromSearch);
            if ((0, _validateWhereQuery.default)(transformedWhere)) {
                return transformedWhere.or;
            }
            console.warn('Invalid where query in URL. Ignoring.');
        }
        return [];
    });
    const [reducedFields] = (0, _react.useState)(()=>reduceFields(collection.fields, i18n, null, null));
    // This handles updating the search query (URL) when the where conditions change
    (0, _useThrottledEffect.default)(()=>{
        const currentParams = _qs.default.parse(history.location.search, {
            depth: 10,
            ignoreQueryPrefix: true
        });
        const paramsToKeep = typeof currentParams?.where === 'object' && 'or' in currentParams.where ? currentParams.where.or.reduce((keptParams, param)=>{
            const newParam = {
                ...param
            };
            if (param.and) {
                delete newParam.and;
            }
            return [
                ...keptParams,
                newParam
            ];
        }, []) : [];
        const hasNewWhereConditions = conditions.length > 0;
        const newWhereQuery = {
            ...typeof currentParams?.where === 'object' && ((0, _validateWhereQuery.default)(currentParams?.where) || !hasNewWhereConditions) ? currentParams.where : {},
            or: [
                ...conditions,
                ...paramsToKeep
            ]
        };
        const reducedQuery = {
            or: newWhereQuery.or.map((orCondition)=>{
                const andConditions = (orCondition.and || []).map((andCondition)=>{
                    const reducedCondition = {};
                    Object.entries(andCondition).forEach(([fieldName, fieldValue])=>{
                        Object.entries(fieldValue).forEach(([operatorKey, operatorValue])=>{
                            reducedCondition[fieldName] = {};
                            reducedCondition[fieldName][operatorKey] = !operatorValue ? undefined : operatorValue;
                        });
                    });
                    return reducedCondition;
                });
                return {
                    and: andConditions
                };
            })
        };
        if (handleChange) handleChange(newWhereQuery);
        const hasExistingConditions = typeof currentParams?.where === 'object' && 'or' in currentParams.where;
        if (modifySearchQuery && (hasExistingConditions && !hasNewWhereConditions || hasNewWhereConditions)) {
            history.replace({
                search: _qs.default.stringify({
                    ...currentParams,
                    page: 1,
                    where: reducedQuery
                }, {
                    addQueryPrefix: true
                })
            });
        }
    }, 500, [
        conditions,
        modifySearchQuery,
        handleChange
    ]);
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: baseClass
    }, conditions.length > 0 && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__label`
    }, t('filterWhere', {
        label: (0, _getTranslation.getTranslation)(plural, i18n)
    })), /*#__PURE__*/ _react.default.createElement("ul", {
        className: `${baseClass}__or-filters`
    }, conditions.map((or, orIndex)=>/*#__PURE__*/ _react.default.createElement("li", {
            key: orIndex
        }, orIndex !== 0 && /*#__PURE__*/ _react.default.createElement("div", {
            className: `${baseClass}__label`
        }, t('or')), /*#__PURE__*/ _react.default.createElement("ul", {
            className: `${baseClass}__and-filters`
        }, Array.isArray(or?.and) && or.and.map((_, andIndex)=>{
            const condition = conditions[orIndex].and[andIndex];
            const fieldName = Object.keys(condition)[0];
            const operator = Object.keys(condition?.[fieldName] || {})?.[0];
            return /*#__PURE__*/ _react.default.createElement("li", {
                key: andIndex
            }, andIndex !== 0 && /*#__PURE__*/ _react.default.createElement("div", {
                className: `${baseClass}__label`
            }, t('and')), /*#__PURE__*/ _react.default.createElement(_Condition.default, {
                andIndex: andIndex,
                dispatch: dispatchConditions,
                fields: reducedFields,
                key: `${fieldName}-${operator}-${andIndex}-${orIndex}`,
                orIndex: orIndex,
                value: condition
            }));
        }))))), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        buttonStyle: "icon-label",
        className: `${baseClass}__add-or`,
        icon: "plus",
        iconPosition: "left",
        iconStyle: "with-border",
        onClick: ()=>{
            if (reducedFields.length > 0) dispatchConditions({
                type: 'add',
                field: reducedFields[0].value
            });
        }
    }, t('or'))), conditions.length === 0 && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__no-filters`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__label`
    }, t('noFiltersSet')), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        buttonStyle: "icon-label",
        className: `${baseClass}__add-first-filter`,
        icon: "plus",
        iconPosition: "left",
        iconStyle: "with-border",
        onClick: ()=>{
            if (reducedFields.length > 0) dispatchConditions({
                type: 'add',
                field: reducedFields[0].value
            });
        }
    }, t('addFilter'))));
};
const _default = WhereBuilder;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL1doZXJlQnVpbGRlci9pbmRleC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHF1ZXJ5U3RyaW5nIGZyb20gJ3FzJ1xuaW1wb3J0IFJlYWN0LCB7IHVzZVJlZHVjZXIsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSdcblxuaW1wb3J0IHR5cGUgeyBGaWVsZCB9IGZyb20gJy4uLy4uLy4uLy4uL2V4cG9ydHMvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFdoZXJlIH0gZnJvbSAnLi4vLi4vLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFByb3BzIH0gZnJvbSAnLi90eXBlcydcblxuaW1wb3J0IHsgdGFiSGFzTmFtZSB9IGZyb20gJy4uLy4uLy4uLy4uL2V4cG9ydHMvdHlwZXMnXG5pbXBvcnQgZmxhdHRlblRvcExldmVsRmllbGRzIGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdGllcy9mbGF0dGVuVG9wTGV2ZWxGaWVsZHMnXG5pbXBvcnQgeyBnZXRUcmFuc2xhdGlvbiB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdGllcy9nZXRUcmFuc2xhdGlvbidcbmltcG9ydCB1c2VUaHJvdHRsZWRFZmZlY3QgZnJvbSAnLi4vLi4vLi4vaG9va3MvdXNlVGhyb3R0bGVkRWZmZWN0J1xuaW1wb3J0IHsgY3JlYXRlTmVzdGVkRmllbGRQYXRoIH0gZnJvbSAnLi4vLi4vZm9ybXMvRm9ybS9jcmVhdGVOZXN0ZWRGaWVsZFBhdGgnXG5pbXBvcnQgeyB1c2VTZWFyY2hQYXJhbXMgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvU2VhcmNoUGFyYW1zJ1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9CdXR0b24nXG5pbXBvcnQgeyBjb21iaW5lTGFiZWwgfSBmcm9tICcuLi9GaWVsZFNlbGVjdCdcbmltcG9ydCBDb25kaXRpb24gZnJvbSAnLi9Db25kaXRpb24nXG5pbXBvcnQgZmllbGRUeXBlcyBmcm9tICcuL2ZpZWxkLXR5cGVzJ1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5pbXBvcnQgcmVkdWNlciBmcm9tICcuL3JlZHVjZXInXG5pbXBvcnQgeyB0cmFuc2Zvcm1XaGVyZVF1ZXJ5IH0gZnJvbSAnLi90cmFuc2Zvcm1XaGVyZVF1ZXJ5J1xuaW1wb3J0IHZhbGlkYXRlV2hlcmVRdWVyeSBmcm9tICcuL3ZhbGlkYXRlV2hlcmVRdWVyeSdcbmNvbnN0IGJhc2VDbGFzcyA9ICd3aGVyZS1idWlsZGVyJ1xuXG5leHBvcnQgdHlwZSBSZWR1Y2VDbGllbnRGaWVsZHNBcmdzID0ge1xuICBmaWVsZHM6IEZpZWxkW11cbiAgaTE4bjogYW55XG4gIGxhYmVsUHJlZml4Pzogc3RyaW5nXG4gIHBhdGhQcmVmaXg/OiBzdHJpbmdcbn1cblxuY29uc3QgcmVkdWNlRmllbGRzID0gKGZpZWxkcywgaTE4biwgbGFiZWxQcmVmaXgsIHBhdGhQcmVmaXgpID0+XG4gIGZsYXR0ZW5Ub3BMZXZlbEZpZWxkcyhmaWVsZHMpLnJlZHVjZSgocmVkdWNlZCwgZmllbGQpID0+IHtcbiAgICBsZXQgb3BlcmF0b3JzID0gW11cblxuICAgIGlmIChmaWVsZC5hZG1pbiAmJiAnZGlzYWJsZUxpc3RGaWx0ZXInIGluIGZpZWxkLmFkbWluICYmIGZpZWxkLmFkbWluPy5kaXNhYmxlTGlzdEZpbHRlcilcbiAgICAgIHJldHVybiByZWR1Y2VkXG5cbiAgICBpZiAoZmllbGQudHlwZSA9PT0gJ2dyb3VwJyAmJiAnZmllbGRzJyBpbiBmaWVsZCkge1xuICAgICAgY29uc3QgdHJhbnNsYXRlZExhYmVsID0gZ2V0VHJhbnNsYXRpb24oZmllbGQubGFiZWwgfHwgJycsIGkxOG4pXG5cbiAgICAgIGNvbnN0IGxhYmVsV2l0aFByZWZpeCA9IGxhYmVsUHJlZml4XG4gICAgICAgID8gdHJhbnNsYXRlZExhYmVsXG4gICAgICAgICAgPyBsYWJlbFByZWZpeCArICcgPiAnICsgdHJhbnNsYXRlZExhYmVsXG4gICAgICAgICAgOiBsYWJlbFByZWZpeFxuICAgICAgICA6IHRyYW5zbGF0ZWRMYWJlbFxuXG4gICAgICBjb25zdCBwYXRoV2l0aFByZWZpeCA9IGZpZWxkLm5hbWVcbiAgICAgICAgPyBwYXRoUHJlZml4XG4gICAgICAgICAgPyBwYXRoUHJlZml4ICsgJy4nICsgZmllbGQubmFtZVxuICAgICAgICAgIDogZmllbGQubmFtZVxuICAgICAgICA6IHBhdGhQcmVmaXhcblxuICAgICAgcmVkdWNlZC5wdXNoKC4uLnJlZHVjZUZpZWxkcyhmaWVsZC5maWVsZHMsIGkxOG4sIGxhYmVsV2l0aFByZWZpeCwgcGF0aFdpdGhQcmVmaXgpKVxuICAgICAgcmV0dXJuIHJlZHVjZWRcbiAgICB9XG5cbiAgICBpZiAoZmllbGQudHlwZSA9PT0gJ3RhYicgJiYgJ3RhYnMnIGluIGZpZWxkKSB7XG4gICAgICBjb25zdCB0YWJzID0gZmllbGQudGFicyBhcyBBcnJheTxhbnk+XG5cbiAgICAgIHRhYnMuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFiLmxhYmVsICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBjb25zdCBsb2NhbGl6ZWRUYWJMYWJlbCA9IGdldFRyYW5zbGF0aW9uKHRhYi5sYWJlbCwgaTE4bilcblxuICAgICAgICAgIGNvbnN0IGxhYmVsV2l0aFByZWZpeCA9IGxhYmVsUHJlZml4XG4gICAgICAgICAgICA/IGxhYmVsUHJlZml4ICsgJyA+ICcgKyBsb2NhbGl6ZWRUYWJMYWJlbFxuICAgICAgICAgICAgOiBsb2NhbGl6ZWRUYWJMYWJlbFxuXG4gICAgICAgICAgY29uc3QgdGFiUGF0aFByZWZpeCA9XG4gICAgICAgICAgICB0YWJIYXNOYW1lKHRhYikgJiYgdGFiLm5hbWVcbiAgICAgICAgICAgICAgPyBwYXRoUHJlZml4XG4gICAgICAgICAgICAgICAgPyBwYXRoUHJlZml4ICsgJy4nICsgdGFiLm5hbWVcbiAgICAgICAgICAgICAgICA6IHRhYi5uYW1lXG4gICAgICAgICAgICAgIDogcGF0aFByZWZpeFxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBsb2NhbGl6ZWRUYWJMYWJlbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJlZHVjZWQucHVzaCguLi5yZWR1Y2VGaWVsZHModGFiLmZpZWxkcywgaTE4biwgbGFiZWxXaXRoUHJlZml4LCB0YWJQYXRoUHJlZml4KSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gcmVkdWNlZFxuICAgIH1cblxuICAgIGlmICgoZmllbGQudHlwZSBhcyBzdHJpbmcpID09PSAncm93JyAmJiAnZmllbGRzJyBpbiBmaWVsZCkge1xuICAgICAgcmVkdWNlZC5wdXNoKC4uLnJlZHVjZUZpZWxkcyhmaWVsZC5maWVsZHMsIGkxOG4sIGxhYmVsUHJlZml4LCBwYXRoUHJlZml4KSlcbiAgICAgIHJldHVybiByZWR1Y2VkXG4gICAgfVxuXG4gICAgaWYgKChmaWVsZC50eXBlIGFzIHN0cmluZykgPT09ICdjb2xsYXBzaWJsZScgJiYgJ2ZpZWxkcycgaW4gZmllbGQpIHtcbiAgICAgIGNvbnN0IGxvY2FsaXplZFRhYkxhYmVsID0gZ2V0VHJhbnNsYXRpb24oZmllbGQubGFiZWwgfHwgJycsIGkxOG4pXG5cbiAgICAgIGNvbnN0IGxhYmVsV2l0aFByZWZpeCA9IGxhYmVsUHJlZml4XG4gICAgICAgID8gbGFiZWxQcmVmaXggKyAnID4gJyArIGxvY2FsaXplZFRhYkxhYmVsXG4gICAgICAgIDogbG9jYWxpemVkVGFiTGFiZWxcblxuICAgICAgcmVkdWNlZC5wdXNoKC4uLnJlZHVjZUZpZWxkcyhmaWVsZC5maWVsZHMsIGkxOG4sIGxhYmVsV2l0aFByZWZpeCwgcGF0aFByZWZpeCkpXG4gICAgICByZXR1cm4gcmVkdWNlZFxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZmllbGRUeXBlc1tmaWVsZC50eXBlXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGRUeXBlc1tmaWVsZC50eXBlXS5vcGVyYXRvcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb3BlcmF0b3JzID0gZmllbGRUeXBlc1tmaWVsZC50eXBlXS5vcGVyYXRvcnMoXG4gICAgICAgICAgJ2hhc01hbnknIGluIGZpZWxkICYmIGZpZWxkLmhhc01hbnkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wZXJhdG9ycyA9IGZpZWxkVHlwZXNbZmllbGQudHlwZV0ub3BlcmF0b3JzXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9wZXJhdG9yS2V5cyA9IG5ldyBTZXQoKVxuICAgICAgY29uc3QgcmVkdWNlZE9wZXJhdG9ycyA9IG9wZXJhdG9ycy5yZWR1Y2UoKGFjYywgb3BlcmF0b3IpID0+IHtcbiAgICAgICAgaWYgKCFvcGVyYXRvcktleXMuaGFzKG9wZXJhdG9yLnZhbHVlKSkge1xuICAgICAgICAgIG9wZXJhdG9yS2V5cy5hZGQob3BlcmF0b3IudmFsdWUpXG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIC4uLmFjYyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLi4ub3BlcmF0b3IsXG4gICAgICAgICAgICAgIGxhYmVsOiBpMThuLnQoYG9wZXJhdG9yczoke29wZXJhdG9yLmxhYmVsfWApLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgfSwgW10pXG5cbiAgICAgIGNvbnN0IGxvY2FsaXplZExhYmVsID0gZ2V0VHJhbnNsYXRpb24oZmllbGQubGFiZWwgfHwgZmllbGQubmFtZSwgaTE4bilcblxuICAgICAgY29uc3QgZm9ybWF0dGVkTGFiZWwgPSBsYWJlbFByZWZpeCA/IGNvbWJpbmVMYWJlbChsYWJlbFByZWZpeCwgZmllbGQsIGkxOG4pIDogbG9jYWxpemVkTGFiZWxcblxuICAgICAgY29uc3QgZm9ybWF0dGVkVmFsdWUgPSBwYXRoUHJlZml4XG4gICAgICAgID8gY3JlYXRlTmVzdGVkRmllbGRQYXRoKHBhdGhQcmVmaXgsIGZpZWxkIGFzIEZpZWxkKVxuICAgICAgICA6IGZpZWxkLm5hbWVcblxuICAgICAgY29uc3QgZm9ybWF0dGVkRmllbGQgPSB7XG4gICAgICAgIGxhYmVsOiBmb3JtYXR0ZWRMYWJlbCxcbiAgICAgICAgdmFsdWU6IGZvcm1hdHRlZFZhbHVlLFxuICAgICAgICAuLi5maWVsZFR5cGVzW2ZpZWxkLnR5cGVdLFxuICAgICAgICBvcGVyYXRvcnM6IHJlZHVjZWRPcGVyYXRvcnMsXG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgLi4uZmllbGQsXG4gICAgICAgIH0sXG4gICAgICB9XG5cbiAgICAgIHJlZHVjZWQucHVzaChmb3JtYXR0ZWRGaWVsZClcbiAgICAgIHJldHVybiByZWR1Y2VkXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlZHVjZWRcbiAgfSwgW10pXG5cbi8qKlxuICogVGhlIFdoZXJlQnVpbGRlciBjb21wb25lbnQgaXMgdXNlZCB0byByZW5kZXIgdGhlIGZpbHRlciBjb250cm9scyBmb3IgYSBjb2xsZWN0aW9uJ3MgbGlzdCB2aWV3LlxuICogSXQgaXMgcGFydCBvZiB0aGUge0BsaW5rIExpc3RDb250cm9sc30gY29tcG9uZW50IHdoaWNoIGlzIHVzZWQgdG8gcmVuZGVyIHRoZSBjb250cm9scyAoc2VhcmNoLCBmaWx0ZXIsIHdoZXJlKS5cbiAqL1xuY29uc3QgV2hlcmVCdWlsZGVyOiBSZWFjdC5GQzxQcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3Qge1xuICAgIGNvbGxlY3Rpb246IHsgbGFiZWxzOiB7IHBsdXJhbCB9ID0ge30gfSA9IHt9LFxuICAgIGNvbGxlY3Rpb24sXG4gICAgaGFuZGxlQ2hhbmdlLFxuICAgIG1vZGlmeVNlYXJjaFF1ZXJ5ID0gdHJ1ZSxcbiAgfSA9IHByb3BzXG5cbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKVxuICBjb25zdCBwYXJhbXMgPSB1c2VTZWFyY2hQYXJhbXMoKVxuICBjb25zdCB7IGkxOG4sIHQgfSA9IHVzZVRyYW5zbGF0aW9uKCdnZW5lcmFsJylcblxuICAvLyBUaGlzIGhhbmRsZXMgaW5pdGlhbGl6aW5nIHRoZSB3aGVyZSBjb25kaXRpb25zIGZyb20gdGhlIHNlYXJjaCBxdWVyeSAoVVJMKS4gVGhhdCB3YXksIGlmIHlvdSBwYXNzIGluXG4gIC8vIHF1ZXJ5IHBhcmFtcyB0byB0aGUgVVJMLCB0aGUgd2hlcmUgY29uZGl0aW9ucyB3aWxsIGJlIGluaXRpYWxpemVkIGZyb20gdGhvc2UgYW5kIGRpc3BsYXllZCBpbiB0aGUgVUkuXG4gIC8vIEV4YW1wbGU6IC9hZG1pbi9jb2xsZWN0aW9ucy9wb3N0cz93aGVyZVtvcl1bMF1bYW5kXVswXVt0ZXh0XVtlcXVhbHNdPWV4YW1wbGUlMjBwb3N0XG4gIGNvbnN0IFtjb25kaXRpb25zLCBkaXNwYXRjaENvbmRpdGlvbnNdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBwYXJhbXMud2hlcmUsICh3aGVyZUZyb21TZWFyY2gpID0+IHtcbiAgICBpZiAobW9kaWZ5U2VhcmNoUXVlcnkgJiYgd2hlcmVGcm9tU2VhcmNoKSB7XG4gICAgICBpZiAodmFsaWRhdGVXaGVyZVF1ZXJ5KHdoZXJlRnJvbVNlYXJjaCkpIHtcbiAgICAgICAgcmV0dXJuIHdoZXJlRnJvbVNlYXJjaC5vclxuICAgICAgfVxuXG4gICAgICAvLyBUcmFuc2Zvcm0gdGhlIHdoZXJlIHF1ZXJ5IHRvIGJlIGluIHRoZSByaWdodCBmb3JtYXQuIFRoaXMgd2lsbCB0cmFuc2Zvcm0gc29tZXRoaW5nIHNpbXBsZSBsaWtlIFt0ZXh0XVtlcXVhbHNdPWV4YW1wbGUlMjBwb3N0IHRvIHRoZSByaWdodCBmb3JtYXRcbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVkV2hlcmUgPSB0cmFuc2Zvcm1XaGVyZVF1ZXJ5KHdoZXJlRnJvbVNlYXJjaClcblxuICAgICAgaWYgKHZhbGlkYXRlV2hlcmVRdWVyeSh0cmFuc2Zvcm1lZFdoZXJlKSkge1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtZWRXaGVyZS5vclxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgd2hlcmUgcXVlcnkgaW4gVVJMLiBJZ25vcmluZy4nKVxuICAgIH1cbiAgICByZXR1cm4gW11cbiAgfSlcblxuICBjb25zdCBbcmVkdWNlZEZpZWxkc10gPSB1c2VTdGF0ZSgoKSA9PiByZWR1Y2VGaWVsZHMoY29sbGVjdGlvbi5maWVsZHMsIGkxOG4sIG51bGwsIG51bGwpKVxuXG4gIC8vIFRoaXMgaGFuZGxlcyB1cGRhdGluZyB0aGUgc2VhcmNoIHF1ZXJ5IChVUkwpIHdoZW4gdGhlIHdoZXJlIGNvbmRpdGlvbnMgY2hhbmdlXG4gIHVzZVRocm90dGxlZEVmZmVjdChcbiAgICAoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50UGFyYW1zID0gcXVlcnlTdHJpbmcucGFyc2UoaGlzdG9yeS5sb2NhdGlvbi5zZWFyY2gsIHtcbiAgICAgICAgZGVwdGg6IDEwLFxuICAgICAgICBpZ25vcmVRdWVyeVByZWZpeDogdHJ1ZSxcbiAgICAgIH0pIGFzIHsgd2hlcmU6IFdoZXJlIH1cblxuICAgICAgY29uc3QgcGFyYW1zVG9LZWVwID1cbiAgICAgICAgdHlwZW9mIGN1cnJlbnRQYXJhbXM/LndoZXJlID09PSAnb2JqZWN0JyAmJiAnb3InIGluIGN1cnJlbnRQYXJhbXMud2hlcmVcbiAgICAgICAgICA/IGN1cnJlbnRQYXJhbXMud2hlcmUub3IucmVkdWNlKChrZXB0UGFyYW1zLCBwYXJhbSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuZXdQYXJhbSA9IHsgLi4ucGFyYW0gfVxuICAgICAgICAgICAgICBpZiAocGFyYW0uYW5kKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG5ld1BhcmFtLmFuZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBbLi4ua2VwdFBhcmFtcywgbmV3UGFyYW1dXG4gICAgICAgICAgICB9LCBbXSlcbiAgICAgICAgICA6IFtdXG5cbiAgICAgIGNvbnN0IGhhc05ld1doZXJlQ29uZGl0aW9ucyA9IGNvbmRpdGlvbnMubGVuZ3RoID4gMFxuXG4gICAgICBjb25zdCBuZXdXaGVyZVF1ZXJ5ID0ge1xuICAgICAgICAuLi4odHlwZW9mIGN1cnJlbnRQYXJhbXM/LndoZXJlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAodmFsaWRhdGVXaGVyZVF1ZXJ5KGN1cnJlbnRQYXJhbXM/LndoZXJlKSB8fCAhaGFzTmV3V2hlcmVDb25kaXRpb25zKVxuICAgICAgICAgID8gY3VycmVudFBhcmFtcy53aGVyZVxuICAgICAgICAgIDoge30pLFxuICAgICAgICBvcjogWy4uLmNvbmRpdGlvbnMsIC4uLnBhcmFtc1RvS2VlcF0sXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlZHVjZWRRdWVyeSA9IHtcbiAgICAgICAgb3I6IG5ld1doZXJlUXVlcnkub3IubWFwKChvckNvbmRpdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnN0IGFuZENvbmRpdGlvbnMgPSAob3JDb25kaXRpb24uYW5kIHx8IFtdKS5tYXAoKGFuZENvbmRpdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVkdWNlZENvbmRpdGlvbiA9IHt9XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhhbmRDb25kaXRpb24pLmZvckVhY2goKFtmaWVsZE5hbWUsIGZpZWxkVmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGZpZWxkVmFsdWUpLmZvckVhY2goKFtvcGVyYXRvcktleSwgb3BlcmF0b3JWYWx1ZV0pID0+IHtcbiAgICAgICAgICAgICAgICByZWR1Y2VkQ29uZGl0aW9uW2ZpZWxkTmFtZV0gPSB7fVxuICAgICAgICAgICAgICAgIHJlZHVjZWRDb25kaXRpb25bZmllbGROYW1lXVtvcGVyYXRvcktleV0gPSAhb3BlcmF0b3JWYWx1ZVxuICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgIDogb3BlcmF0b3JWYWx1ZVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiByZWR1Y2VkQ29uZGl0aW9uXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYW5kOiBhbmRDb25kaXRpb25zLFxuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICB9XG5cbiAgICAgIGlmIChoYW5kbGVDaGFuZ2UpIGhhbmRsZUNoYW5nZShuZXdXaGVyZVF1ZXJ5IGFzIFdoZXJlKVxuXG4gICAgICBjb25zdCBoYXNFeGlzdGluZ0NvbmRpdGlvbnMgPVxuICAgICAgICB0eXBlb2YgY3VycmVudFBhcmFtcz8ud2hlcmUgPT09ICdvYmplY3QnICYmICdvcicgaW4gY3VycmVudFBhcmFtcy53aGVyZVxuXG4gICAgICBpZiAoXG4gICAgICAgIG1vZGlmeVNlYXJjaFF1ZXJ5ICYmXG4gICAgICAgICgoaGFzRXhpc3RpbmdDb25kaXRpb25zICYmICFoYXNOZXdXaGVyZUNvbmRpdGlvbnMpIHx8IGhhc05ld1doZXJlQ29uZGl0aW9ucylcbiAgICAgICkge1xuICAgICAgICBoaXN0b3J5LnJlcGxhY2Uoe1xuICAgICAgICAgIHNlYXJjaDogcXVlcnlTdHJpbmcuc3RyaW5naWZ5KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAuLi5jdXJyZW50UGFyYW1zLFxuICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICB3aGVyZTogcmVkdWNlZFF1ZXJ5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgYWRkUXVlcnlQcmVmaXg6IHRydWUgfSxcbiAgICAgICAgICApLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sXG4gICAgNTAwLFxuICAgIFtjb25kaXRpb25zLCBtb2RpZnlTZWFyY2hRdWVyeSwgaGFuZGxlQ2hhbmdlXSxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2Jhc2VDbGFzc30+XG4gICAgICB7Y29uZGl0aW9ucy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgPFJlYWN0LkZyYWdtZW50PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19sYWJlbGB9PlxuICAgICAgICAgICAge3QoJ2ZpbHRlcldoZXJlJywgeyBsYWJlbDogZ2V0VHJhbnNsYXRpb24ocGx1cmFsLCBpMThuKSB9KX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19vci1maWx0ZXJzYH0+XG4gICAgICAgICAgICB7Y29uZGl0aW9ucy5tYXAoKG9yLCBvckluZGV4KSA9PiAoXG4gICAgICAgICAgICAgIDxsaSBrZXk9e29ySW5kZXh9PlxuICAgICAgICAgICAgICAgIHtvckluZGV4ICE9PSAwICYmIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19sYWJlbGB9Pnt0KCdvcicpfTwvZGl2Pn1cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19hbmQtZmlsdGVyc2B9PlxuICAgICAgICAgICAgICAgICAge0FycmF5LmlzQXJyYXkob3I/LmFuZCkgJiZcbiAgICAgICAgICAgICAgICAgICAgb3IuYW5kLm1hcCgoXywgYW5kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSBjb25kaXRpb25zW29ySW5kZXhdLmFuZFthbmRJbmRleF1cbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZE5hbWUgPSBPYmplY3Qua2V5cyhjb25kaXRpb24pWzBdXG4gICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSBPYmplY3Qua2V5cyhjb25kaXRpb24/LltmaWVsZE5hbWVdIHx8IHt9KT8uWzBdXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2FuZEluZGV4fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2FuZEluZGV4ICE9PSAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fbGFiZWxgfT57dCgnYW5kJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxDb25kaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmRJbmRleD17YW5kSW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2g9e2Rpc3BhdGNoQ29uZGl0aW9uc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHM9e3JlZHVjZWRGaWVsZHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtgJHtmaWVsZE5hbWV9LSR7b3BlcmF0b3J9LSR7YW5kSW5kZXh9LSR7b3JJbmRleH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ySW5kZXg9e29ySW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NvbmRpdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBidXR0b25TdHlsZT1cImljb24tbGFiZWxcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19hZGQtb3JgfVxuICAgICAgICAgICAgaWNvbj1cInBsdXNcIlxuICAgICAgICAgICAgaWNvblBvc2l0aW9uPVwibGVmdFwiXG4gICAgICAgICAgICBpY29uU3R5bGU9XCJ3aXRoLWJvcmRlclwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChyZWR1Y2VkRmllbGRzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hDb25kaXRpb25zKHsgdHlwZTogJ2FkZCcsIGZpZWxkOiByZWR1Y2VkRmllbGRzWzBdLnZhbHVlIH0pXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdvcicpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICAgKX1cbiAgICAgIHtjb25kaXRpb25zLmxlbmd0aCA9PT0gMCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19uby1maWx0ZXJzYH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2xhYmVsYH0+e3QoJ25vRmlsdGVyc1NldCcpfTwvZGl2PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGJ1dHRvblN0eWxlPVwiaWNvbi1sYWJlbFwiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2FkZC1maXJzdC1maWx0ZXJgfVxuICAgICAgICAgICAgaWNvbj1cInBsdXNcIlxuICAgICAgICAgICAgaWNvblBvc2l0aW9uPVwibGVmdFwiXG4gICAgICAgICAgICBpY29uU3R5bGU9XCJ3aXRoLWJvcmRlclwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChyZWR1Y2VkRmllbGRzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hDb25kaXRpb25zKHsgdHlwZTogJ2FkZCcsIGZpZWxkOiByZWR1Y2VkRmllbGRzWzBdLnZhbHVlIH0pXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdhZGRGaWx0ZXInKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFdoZXJlQnVpbGRlclxuIl0sIm5hbWVzIjpbImJhc2VDbGFzcyIsInJlZHVjZUZpZWxkcyIsImZpZWxkcyIsImkxOG4iLCJsYWJlbFByZWZpeCIsInBhdGhQcmVmaXgiLCJmbGF0dGVuVG9wTGV2ZWxGaWVsZHMiLCJyZWR1Y2UiLCJyZWR1Y2VkIiwiZmllbGQiLCJvcGVyYXRvcnMiLCJhZG1pbiIsImRpc2FibGVMaXN0RmlsdGVyIiwidHlwZSIsInRyYW5zbGF0ZWRMYWJlbCIsImdldFRyYW5zbGF0aW9uIiwibGFiZWwiLCJsYWJlbFdpdGhQcmVmaXgiLCJwYXRoV2l0aFByZWZpeCIsIm5hbWUiLCJwdXNoIiwidGFicyIsImZvckVhY2giLCJ0YWIiLCJsb2NhbGl6ZWRUYWJMYWJlbCIsInRhYlBhdGhQcmVmaXgiLCJ0YWJIYXNOYW1lIiwiZmllbGRUeXBlcyIsImhhc01hbnkiLCJvcGVyYXRvcktleXMiLCJTZXQiLCJyZWR1Y2VkT3BlcmF0b3JzIiwiYWNjIiwib3BlcmF0b3IiLCJoYXMiLCJ2YWx1ZSIsImFkZCIsInQiLCJsb2NhbGl6ZWRMYWJlbCIsImZvcm1hdHRlZExhYmVsIiwiY29tYmluZUxhYmVsIiwiZm9ybWF0dGVkVmFsdWUiLCJjcmVhdGVOZXN0ZWRGaWVsZFBhdGgiLCJmb3JtYXR0ZWRGaWVsZCIsInByb3BzIiwiV2hlcmVCdWlsZGVyIiwiY29sbGVjdGlvbiIsImxhYmVscyIsInBsdXJhbCIsImhhbmRsZUNoYW5nZSIsIm1vZGlmeVNlYXJjaFF1ZXJ5IiwiaGlzdG9yeSIsInVzZUhpc3RvcnkiLCJwYXJhbXMiLCJ1c2VTZWFyY2hQYXJhbXMiLCJ1c2VUcmFuc2xhdGlvbiIsImNvbmRpdGlvbnMiLCJkaXNwYXRjaENvbmRpdGlvbnMiLCJ1c2VSZWR1Y2VyIiwicmVkdWNlciIsIndoZXJlIiwid2hlcmVGcm9tU2VhcmNoIiwidmFsaWRhdGVXaGVyZVF1ZXJ5Iiwib3IiLCJ0cmFuc2Zvcm1lZFdoZXJlIiwidHJhbnNmb3JtV2hlcmVRdWVyeSIsImNvbnNvbGUiLCJ3YXJuIiwicmVkdWNlZEZpZWxkcyIsInVzZVN0YXRlIiwidXNlVGhyb3R0bGVkRWZmZWN0IiwiY3VycmVudFBhcmFtcyIsInF1ZXJ5U3RyaW5nIiwicGFyc2UiLCJsb2NhdGlvbiIsInNlYXJjaCIsImRlcHRoIiwiaWdub3JlUXVlcnlQcmVmaXgiLCJwYXJhbXNUb0tlZXAiLCJrZXB0UGFyYW1zIiwicGFyYW0iLCJuZXdQYXJhbSIsImFuZCIsImhhc05ld1doZXJlQ29uZGl0aW9ucyIsImxlbmd0aCIsIm5ld1doZXJlUXVlcnkiLCJyZWR1Y2VkUXVlcnkiLCJtYXAiLCJvckNvbmRpdGlvbiIsImFuZENvbmRpdGlvbnMiLCJhbmRDb25kaXRpb24iLCJyZWR1Y2VkQ29uZGl0aW9uIiwiT2JqZWN0IiwiZW50cmllcyIsImZpZWxkTmFtZSIsImZpZWxkVmFsdWUiLCJvcGVyYXRvcktleSIsIm9wZXJhdG9yVmFsdWUiLCJ1bmRlZmluZWQiLCJoYXNFeGlzdGluZ0NvbmRpdGlvbnMiLCJyZXBsYWNlIiwic3RyaW5naWZ5IiwicGFnZSIsImFkZFF1ZXJ5UHJlZml4IiwiZGl2IiwiY2xhc3NOYW1lIiwiUmVhY3QiLCJGcmFnbWVudCIsInVsIiwib3JJbmRleCIsImxpIiwia2V5IiwiQXJyYXkiLCJpc0FycmF5IiwiXyIsImFuZEluZGV4IiwiY29uZGl0aW9uIiwia2V5cyIsIkNvbmRpdGlvbiIsImRpc3BhdGNoIiwiQnV0dG9uIiwiYnV0dG9uU3R5bGUiLCJpY29uIiwiaWNvblBvc2l0aW9uIiwiaWNvblN0eWxlIiwib25DbGljayJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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