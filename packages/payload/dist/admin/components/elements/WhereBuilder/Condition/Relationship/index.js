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
const _useDebounce = /*#__PURE__*/ _interop_require_default(require("../../../../../hooks/useDebounce"));
const _Auth = require("../../../../utilities/Auth");
const _Config = require("../../../../utilities/Config");
const _ReactSelect = /*#__PURE__*/ _interop_require_default(require("../../../ReactSelect"));
require("./index.scss");
const _optionsReducer = /*#__PURE__*/ _interop_require_default(require("./optionsReducer"));
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
const baseClass = 'condition-value-relationship';
const maxResultsPerRequest = 10;
const RelationshipField = (props)=>{
    const { admin: { isSortable } = {}, disabled, filterOptions, hasMany, onChange, operator, relationTo, value } = props;
    const { collections, routes: { api }, serverURL } = (0, _Config.useConfig)();
    const hasMultipleRelations = Array.isArray(relationTo);
    const [options, dispatchOptions] = (0, _react.useReducer)(_optionsReducer.default, []);
    const [lastFullyLoadedRelation, setLastFullyLoadedRelation] = (0, _react.useState)(-1);
    const [lastLoadedPage, setLastLoadedPage] = (0, _react.useState)(1);
    const [search, setSearch] = (0, _react.useState)('');
    const [errorLoading, setErrorLoading] = (0, _react.useState)('');
    const [hasLoadedFirstOptions, setHasLoadedFirstOptions] = (0, _react.useState)(false);
    const debouncedSearch = (0, _useDebounce.default)(search, 300);
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const { user } = (0, _Auth.useAuth)();
    const isMulti = [
        'in',
        'not_in'
    ].includes(operator);
    const addOptions = (0, _react.useCallback)((data, relation)=>{
        const collection = collections.find((coll)=>coll.slug === relation);
        dispatchOptions({
            type: 'ADD',
            collection,
            data,
            hasMultipleRelations,
            i18n,
            relation
        });
    }, [
        collections,
        hasMultipleRelations,
        i18n
    ]);
    const getResults = (0, _react.useCallback)(async ({ lastFullyLoadedRelation: lastFullyLoadedRelationArg, lastLoadedPage: lastLoadedPageArg, search: searchArg })=>{
        let lastLoadedPageToUse = typeof lastLoadedPageArg !== 'undefined' ? lastLoadedPageArg : 1;
        const lastFullyLoadedRelationToUse = typeof lastFullyLoadedRelationArg !== 'undefined' ? lastFullyLoadedRelationArg : -1;
        const relations = Array.isArray(relationTo) ? relationTo : [
            relationTo
        ];
        const relationsToFetch = lastFullyLoadedRelationToUse === -1 ? relations : relations.slice(lastFullyLoadedRelationToUse + 1);
        let resultsFetched = 0;
        if (!errorLoading) {
            void relationsToFetch.reduce(async (priorRelation, relation)=>{
                await priorRelation;
                if (resultsFetched < 10) {
                    const search = {
                        depth: 0,
                        limit: maxResultsPerRequest,
                        page: lastLoadedPageToUse,
                        where: {
                            and: []
                        }
                    };
                    const collection = collections.find((coll)=>coll.slug === relation);
                    const fieldToSearch = collection?.admin?.useAsTitle || 'id';
                    // add search arg to where object
                    if (searchArg) {
                        search.where.and.push({
                            [fieldToSearch]: {
                                like: searchArg
                            }
                        });
                    }
                    // call the filterOptions function if it exists passing in the collection
                    if (filterOptions) {
                        const optionFilter = typeof filterOptions === 'function' ? await filterOptions({
                            // data and siblingData are empty since we cannot fetch with the values covering the
                            // entire list this limitation means that filterOptions functions using a document's
                            //  data are unsupported in the whereBuilder
                            id: undefined,
                            data: {},
                            relationTo: collection.slug,
                            siblingData: {},
                            user
                        }) : filterOptions;
                        if (typeof optionFilter === 'object') {
                            search.where.and.push(optionFilter);
                        }
                        if (optionFilter === false) {
                            // no options will be returned
                            setLastFullyLoadedRelation(relations.indexOf(relation));
                            // If there are more relations to search, need to reset lastLoadedPage to 1
                            // both locally within function and state
                            if (relations.indexOf(relation) + 1 < relations.length) {
                                lastLoadedPageToUse = 1;
                            }
                            return;
                        }
                    }
                    if (search.where.and.length === 0) {
                        delete search.where;
                    }
                    const response = await fetch(`${serverURL}${api}/${relation}?${_qs.default.stringify(search)}`, {
                        credentials: 'include',
                        headers: {
                            'Accept-Language': i18n.language
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data.docs.length > 0) {
                            resultsFetched += data.docs.length;
                            addOptions(data, relation);
                            setLastLoadedPage(data.page);
                            if (!data.nextPage) {
                                setLastFullyLoadedRelation(relations.indexOf(relation));
                                // If there are more relations to search, need to reset lastLoadedPage to 1
                                // both locally within function and state
                                if (relations.indexOf(relation) + 1 < relations.length) {
                                    lastLoadedPageToUse = 1;
                                }
                            }
                        }
                    } else {
                        setErrorLoading(t('error:unspecific'));
                    }
                }
            }, Promise.resolve());
        }
    }, [
        relationTo,
        errorLoading,
        collections,
        filterOptions,
        serverURL,
        api,
        i18n.language,
        user,
        addOptions,
        t
    ]);
    const findOptionsByValue = (0, _react.useCallback)(()=>{
        if (value) {
            if (hasMany || isMulti) {
                if (Array.isArray(value)) {
                    return value.map((val)=>{
                        if (hasMultipleRelations) {
                            let matchedOption;
                            options.forEach((opt)=>{
                                if (opt.options) {
                                    opt.options.some((subOpt)=>{
                                        if (subOpt?.value == val.value) {
                                            matchedOption = subOpt;
                                            return true;
                                        }
                                        return false;
                                    });
                                }
                            });
                            return matchedOption;
                        }
                        return options.find((opt)=>opt.value == val);
                    });
                }
                return undefined;
            }
            if (hasMultipleRelations) {
                let matchedOption;
                const valueWithRelation = value;
                options.forEach((opt)=>{
                    if (opt?.options) {
                        opt.options.some((subOpt)=>{
                            if (subOpt?.value == valueWithRelation.value) {
                                matchedOption = subOpt;
                                return true;
                            }
                            return false;
                        });
                    }
                });
                return matchedOption;
            }
            return options.find((opt)=>opt.value == value);
        }
        return undefined;
    }, [
        hasMany,
        hasMultipleRelations,
        isMulti,
        value,
        options
    ]);
    const handleInputChange = (0, _react.useCallback)((newSearch)=>{
        if (search !== newSearch) {
            setSearch(newSearch);
        }
    }, [
        search
    ]);
    const addOptionByID = (0, _react.useCallback)(async (id, relation)=>{
        if (!errorLoading && id !== 'null') {
            const response = await fetch(`${serverURL}${api}/${relation}/${id}?depth=0`, {
                credentials: 'include',
                headers: {
                    'Accept-Language': i18n.language
                }
            });
            if (response.ok) {
                const data = await response.json();
                addOptions({
                    docs: [
                        data
                    ]
                }, relation);
            } else {
                // eslint-disable-next-line no-console
                console.error(t('error:loadingDocument', {
                    id
                }));
            }
        }
    }, [
        i18n,
        addOptions,
        api,
        errorLoading,
        serverURL,
        t
    ]);
    // ///////////////////////////
    // Get results when search input changes
    // ///////////////////////////
    (0, _react.useEffect)(()=>{
        dispatchOptions({
            type: 'CLEAR',
            i18n,
            required: true
        });
        setHasLoadedFirstOptions(true);
        setLastLoadedPage(1);
        setLastFullyLoadedRelation(-1);
        void getResults({
            search: debouncedSearch
        });
    }, [
        getResults,
        debouncedSearch,
        relationTo,
        i18n
    ]);
    // ///////////////////////////
    // Format options once first options have been retrieved
    // ///////////////////////////
    (0, _react.useEffect)(()=>{
        if (value && hasLoadedFirstOptions) {
            if (hasMany || isMulti) {
                const matchedOptions = findOptionsByValue();
                (matchedOptions || []).forEach((option, i)=>{
                    if (!option) {
                        if (hasMultipleRelations) {
                            void addOptionByID(value[i].value, value[i].relationTo);
                        } else {
                            void addOptionByID(value[i], relationTo);
                        }
                    }
                });
            } else {
                const matchedOption = findOptionsByValue();
                if (!matchedOption) {
                    if (hasMultipleRelations) {
                        const valueWithRelation = value;
                        void addOptionByID(valueWithRelation.value, valueWithRelation.relationTo);
                    } else {
                        void addOptionByID(value, relationTo);
                    }
                }
            }
        }
    }, [
        addOptionByID,
        findOptionsByValue,
        hasMany,
        hasMultipleRelations,
        isMulti,
        relationTo,
        value,
        hasLoadedFirstOptions
    ]);
    const classes = [
        'field-type',
        baseClass,
        errorLoading && 'error-loading'
    ].filter(Boolean).join(' ');
    const valueToRender = findOptionsByValue() || value;
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: classes
    }, !errorLoading && /*#__PURE__*/ _react.default.createElement(_ReactSelect.default, {
        disabled: disabled,
        isMulti: hasMany || isMulti,
        isSortable: isSortable,
        onChange: (selected)=>{
            if (hasMany || isMulti) {
                onChange(selected ? selected.map((option)=>{
                    if (hasMultipleRelations) {
                        return {
                            relationTo: option.relationTo,
                            value: option.value
                        };
                    }
                    return option.value;
                }) : null);
            } else if (hasMultipleRelations) {
                onChange({
                    relationTo: selected.relationTo,
                    value: selected.value
                });
            } else {
                onChange(selected.value);
            }
        },
        onInputChange: handleInputChange,
        onMenuScrollToBottom: ()=>{
            void getResults({
                lastFullyLoadedRelation,
                lastLoadedPage: lastLoadedPage + 1
            });
        },
        options: options,
        placeholder: t('selectValue'),
        value: valueToRender
    }), errorLoading && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__error-loading`
    }, errorLoading));
};
const _default = RelationshipField;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL1doZXJlQnVpbGRlci9Db25kaXRpb24vUmVsYXRpb25zaGlwL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFdoZXJlIH0gZnJvbSAncGF5bG9hZC90eXBlcydcblxuaW1wb3J0IHFzIGZyb20gJ3FzJ1xuaW1wb3J0IFJlYWN0LCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVJlZHVjZXIsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5cbmltcG9ydCB0eXBlIHsgUGFnaW5hdGVkRG9jcyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL2RhdGFiYXNlL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBPcHRpb24gfSBmcm9tICcuLi8uLi8uLi9SZWFjdFNlbGVjdC90eXBlcydcbmltcG9ydCB0eXBlIHsgR2V0UmVzdWx0cywgUHJvcHMsIFZhbHVlV2l0aFJlbGF0aW9uIH0gZnJvbSAnLi90eXBlcydcblxuaW1wb3J0IHVzZURlYm91bmNlIGZyb20gJy4uLy4uLy4uLy4uLy4uL2hvb2tzL3VzZURlYm91bmNlJ1xuaW1wb3J0IHsgdXNlQXV0aCB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdGllcy9BdXRoJ1xuaW1wb3J0IHsgdXNlQ29uZmlnIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0aWVzL0NvbmZpZydcbmltcG9ydCBSZWFjdFNlbGVjdCBmcm9tICcuLi8uLi8uLi9SZWFjdFNlbGVjdCdcbmltcG9ydCAnLi9pbmRleC5zY3NzJ1xuaW1wb3J0IG9wdGlvbnNSZWR1Y2VyIGZyb20gJy4vb3B0aW9uc1JlZHVjZXInXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdjb25kaXRpb24tdmFsdWUtcmVsYXRpb25zaGlwJ1xuXG5jb25zdCBtYXhSZXN1bHRzUGVyUmVxdWVzdCA9IDEwXG5cbmNvbnN0IFJlbGF0aW9uc2hpcEZpZWxkOiBSZWFjdC5GQzxQcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3Qge1xuICAgIGFkbWluOiB7IGlzU29ydGFibGUgfSA9IHt9LFxuICAgIGRpc2FibGVkLFxuICAgIGZpbHRlck9wdGlvbnMsXG4gICAgaGFzTWFueSxcbiAgICBvbkNoYW5nZSxcbiAgICBvcGVyYXRvcixcbiAgICByZWxhdGlvblRvLFxuICAgIHZhbHVlLFxuICB9ID0gcHJvcHNcblxuICBjb25zdCB7XG4gICAgY29sbGVjdGlvbnMsXG4gICAgcm91dGVzOiB7IGFwaSB9LFxuICAgIHNlcnZlclVSTCxcbiAgfSA9IHVzZUNvbmZpZygpXG5cbiAgY29uc3QgaGFzTXVsdGlwbGVSZWxhdGlvbnMgPSBBcnJheS5pc0FycmF5KHJlbGF0aW9uVG8pXG4gIGNvbnN0IFtvcHRpb25zLCBkaXNwYXRjaE9wdGlvbnNdID0gdXNlUmVkdWNlcihvcHRpb25zUmVkdWNlciwgW10pXG4gIGNvbnN0IFtsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbiwgc2V0TGFzdEZ1bGx5TG9hZGVkUmVsYXRpb25dID0gdXNlU3RhdGUoLTEpXG4gIGNvbnN0IFtsYXN0TG9hZGVkUGFnZSwgc2V0TGFzdExvYWRlZFBhZ2VdID0gdXNlU3RhdGUoMSlcbiAgY29uc3QgW3NlYXJjaCwgc2V0U2VhcmNoXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbZXJyb3JMb2FkaW5nLCBzZXRFcnJvckxvYWRpbmddID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtoYXNMb2FkZWRGaXJzdE9wdGlvbnMsIHNldEhhc0xvYWRlZEZpcnN0T3B0aW9uc10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgZGVib3VuY2VkU2VhcmNoID0gdXNlRGVib3VuY2Uoc2VhcmNoLCAzMDApXG4gIGNvbnN0IHsgaTE4biwgdCB9ID0gdXNlVHJhbnNsYXRpb24oJ2dlbmVyYWwnKVxuICBjb25zdCB7IHVzZXIgfSA9IHVzZUF1dGgoKVxuXG4gIGNvbnN0IGlzTXVsdGkgPSBbJ2luJywgJ25vdF9pbiddLmluY2x1ZGVzKG9wZXJhdG9yKVxuXG4gIGNvbnN0IGFkZE9wdGlvbnMgPSB1c2VDYWxsYmFjayhcbiAgICAoZGF0YSwgcmVsYXRpb24pID0+IHtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9ucy5maW5kKChjb2xsKSA9PiBjb2xsLnNsdWcgPT09IHJlbGF0aW9uKVxuICAgICAgZGlzcGF0Y2hPcHRpb25zKHsgdHlwZTogJ0FERCcsIGNvbGxlY3Rpb24sIGRhdGEsIGhhc011bHRpcGxlUmVsYXRpb25zLCBpMThuLCByZWxhdGlvbiB9KVxuICAgIH0sXG4gICAgW2NvbGxlY3Rpb25zLCBoYXNNdWx0aXBsZVJlbGF0aW9ucywgaTE4bl0sXG4gIClcblxuICBjb25zdCBnZXRSZXN1bHRzID0gdXNlQ2FsbGJhY2s8R2V0UmVzdWx0cz4oXG4gICAgYXN5bmMgKHtcbiAgICAgIGxhc3RGdWxseUxvYWRlZFJlbGF0aW9uOiBsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbkFyZyxcbiAgICAgIGxhc3RMb2FkZWRQYWdlOiBsYXN0TG9hZGVkUGFnZUFyZyxcbiAgICAgIHNlYXJjaDogc2VhcmNoQXJnLFxuICAgIH0pID0+IHtcbiAgICAgIGxldCBsYXN0TG9hZGVkUGFnZVRvVXNlID0gdHlwZW9mIGxhc3RMb2FkZWRQYWdlQXJnICE9PSAndW5kZWZpbmVkJyA/IGxhc3RMb2FkZWRQYWdlQXJnIDogMVxuICAgICAgY29uc3QgbGFzdEZ1bGx5TG9hZGVkUmVsYXRpb25Ub1VzZSA9XG4gICAgICAgIHR5cGVvZiBsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbkFyZyAhPT0gJ3VuZGVmaW5lZCcgPyBsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbkFyZyA6IC0xXG5cbiAgICAgIGNvbnN0IHJlbGF0aW9ucyA9IEFycmF5LmlzQXJyYXkocmVsYXRpb25UbykgPyByZWxhdGlvblRvIDogW3JlbGF0aW9uVG9dXG4gICAgICBjb25zdCByZWxhdGlvbnNUb0ZldGNoID1cbiAgICAgICAgbGFzdEZ1bGx5TG9hZGVkUmVsYXRpb25Ub1VzZSA9PT0gLTFcbiAgICAgICAgICA/IHJlbGF0aW9uc1xuICAgICAgICAgIDogcmVsYXRpb25zLnNsaWNlKGxhc3RGdWxseUxvYWRlZFJlbGF0aW9uVG9Vc2UgKyAxKVxuXG4gICAgICBsZXQgcmVzdWx0c0ZldGNoZWQgPSAwXG5cbiAgICAgIGlmICghZXJyb3JMb2FkaW5nKSB7XG4gICAgICAgIHZvaWQgcmVsYXRpb25zVG9GZXRjaC5yZWR1Y2UoYXN5bmMgKHByaW9yUmVsYXRpb24sIHJlbGF0aW9uKSA9PiB7XG4gICAgICAgICAgYXdhaXQgcHJpb3JSZWxhdGlvblxuICAgICAgICAgIGlmIChyZXN1bHRzRmV0Y2hlZCA8IDEwKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2g6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ICYgeyB3aGVyZTogV2hlcmUgfSA9IHtcbiAgICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgICAgIGxpbWl0OiBtYXhSZXN1bHRzUGVyUmVxdWVzdCxcbiAgICAgICAgICAgICAgcGFnZTogbGFzdExvYWRlZFBhZ2VUb1VzZSxcbiAgICAgICAgICAgICAgd2hlcmU6IHsgYW5kOiBbXSB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25zLmZpbmQoKGNvbGwpID0+IGNvbGwuc2x1ZyA9PT0gcmVsYXRpb24pXG4gICAgICAgICAgICBjb25zdCBmaWVsZFRvU2VhcmNoID0gY29sbGVjdGlvbj8uYWRtaW4/LnVzZUFzVGl0bGUgfHwgJ2lkJ1xuICAgICAgICAgICAgLy8gYWRkIHNlYXJjaCBhcmcgdG8gd2hlcmUgb2JqZWN0XG4gICAgICAgICAgICBpZiAoc2VhcmNoQXJnKSB7XG4gICAgICAgICAgICAgIHNlYXJjaC53aGVyZS5hbmQucHVzaCh7XG4gICAgICAgICAgICAgICAgW2ZpZWxkVG9TZWFyY2hdOiB7XG4gICAgICAgICAgICAgICAgICBsaWtlOiBzZWFyY2hBcmcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNhbGwgdGhlIGZpbHRlck9wdGlvbnMgZnVuY3Rpb24gaWYgaXQgZXhpc3RzIHBhc3NpbmcgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICAgICAgICAgIGlmIChmaWx0ZXJPcHRpb25zKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG9wdGlvbkZpbHRlciA9XG4gICAgICAgICAgICAgICAgdHlwZW9mIGZpbHRlck9wdGlvbnMgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgICAgID8gYXdhaXQgZmlsdGVyT3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gZGF0YSBhbmQgc2libGluZ0RhdGEgYXJlIGVtcHR5IHNpbmNlIHdlIGNhbm5vdCBmZXRjaCB3aXRoIHRoZSB2YWx1ZXMgY292ZXJpbmcgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgLy8gZW50aXJlIGxpc3QgdGhpcyBsaW1pdGF0aW9uIG1lYW5zIHRoYXQgZmlsdGVyT3B0aW9ucyBmdW5jdGlvbnMgdXNpbmcgYSBkb2N1bWVudCdzXG4gICAgICAgICAgICAgICAgICAgICAgLy8gIGRhdGEgYXJlIHVuc3VwcG9ydGVkIGluIHRoZSB3aGVyZUJ1aWxkZXJcbiAgICAgICAgICAgICAgICAgICAgICBpZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uVG86IGNvbGxlY3Rpb24uc2x1ZyxcbiAgICAgICAgICAgICAgICAgICAgICBzaWJsaW5nRGF0YToge30sXG4gICAgICAgICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIDogZmlsdGVyT3B0aW9uc1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbkZpbHRlciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBzZWFyY2gud2hlcmUuYW5kLnB1c2gob3B0aW9uRmlsdGVyKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChvcHRpb25GaWx0ZXIgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgLy8gbm8gb3B0aW9ucyB3aWxsIGJlIHJldHVybmVkXG4gICAgICAgICAgICAgICAgc2V0TGFzdEZ1bGx5TG9hZGVkUmVsYXRpb24ocmVsYXRpb25zLmluZGV4T2YocmVsYXRpb24pKVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG1vcmUgcmVsYXRpb25zIHRvIHNlYXJjaCwgbmVlZCB0byByZXNldCBsYXN0TG9hZGVkUGFnZSB0byAxXG4gICAgICAgICAgICAgICAgLy8gYm90aCBsb2NhbGx5IHdpdGhpbiBmdW5jdGlvbiBhbmQgc3RhdGVcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25zLmluZGV4T2YocmVsYXRpb24pICsgMSA8IHJlbGF0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIGxhc3RMb2FkZWRQYWdlVG9Vc2UgPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWFyY2gud2hlcmUuYW5kLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICBkZWxldGUgc2VhcmNoLndoZXJlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7c2VydmVyVVJMfSR7YXBpfS8ke3JlbGF0aW9ufT8ke3FzLnN0cmluZ2lmeShzZWFyY2gpfWAsIHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBY2NlcHQtTGFuZ3VhZ2UnOiBpMThuLmxhbmd1YWdlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGRhdGE6IFBhZ2luYXRlZERvY3MgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZG9jcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0c0ZldGNoZWQgKz0gZGF0YS5kb2NzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGFkZE9wdGlvbnMoZGF0YSwgcmVsYXRpb24pXG4gICAgICAgICAgICAgICAgc2V0TGFzdExvYWRlZFBhZ2UoZGF0YS5wYWdlKVxuXG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhLm5leHRQYWdlKSB7XG4gICAgICAgICAgICAgICAgICBzZXRMYXN0RnVsbHlMb2FkZWRSZWxhdGlvbihyZWxhdGlvbnMuaW5kZXhPZihyZWxhdGlvbikpXG5cbiAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBtb3JlIHJlbGF0aW9ucyB0byBzZWFyY2gsIG5lZWQgdG8gcmVzZXQgbGFzdExvYWRlZFBhZ2UgdG8gMVxuICAgICAgICAgICAgICAgICAgLy8gYm90aCBsb2NhbGx5IHdpdGhpbiBmdW5jdGlvbiBhbmQgc3RhdGVcbiAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGlvbnMuaW5kZXhPZihyZWxhdGlvbikgKyAxIDwgcmVsYXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0TG9hZGVkUGFnZVRvVXNlID0gMVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2V0RXJyb3JMb2FkaW5nKHQoJ2Vycm9yOnVuc3BlY2lmaWMnKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKVxuICAgICAgfVxuICAgIH0sXG4gICAgW1xuICAgICAgcmVsYXRpb25UbyxcbiAgICAgIGVycm9yTG9hZGluZyxcbiAgICAgIGNvbGxlY3Rpb25zLFxuICAgICAgZmlsdGVyT3B0aW9ucyxcbiAgICAgIHNlcnZlclVSTCxcbiAgICAgIGFwaSxcbiAgICAgIGkxOG4ubGFuZ3VhZ2UsXG4gICAgICB1c2VyLFxuICAgICAgYWRkT3B0aW9ucyxcbiAgICAgIHQsXG4gICAgXSxcbiAgKVxuXG4gIGNvbnN0IGZpbmRPcHRpb25zQnlWYWx1ZSA9IHVzZUNhbGxiYWNrKCgpOiBPcHRpb24gfCBPcHRpb25bXSA9PiB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBpZiAoaGFzTWFueSB8fCBpc011bHRpKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZS5tYXAoKHZhbCkgPT4ge1xuICAgICAgICAgICAgaWYgKGhhc011bHRpcGxlUmVsYXRpb25zKSB7XG4gICAgICAgICAgICAgIGxldCBtYXRjaGVkT3B0aW9uOiBPcHRpb25cblxuICAgICAgICAgICAgICBvcHRpb25zLmZvckVhY2goKG9wdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChvcHQub3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgb3B0Lm9wdGlvbnMuc29tZSgoc3ViT3B0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJPcHQ/LnZhbHVlID09IHZhbC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWRPcHRpb24gPSBzdWJPcHRcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hlZE9wdGlvblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5maW5kKChvcHQpID0+IG9wdC52YWx1ZSA9PSB2YWwpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgaWYgKGhhc011bHRpcGxlUmVsYXRpb25zKSB7XG4gICAgICAgIGxldCBtYXRjaGVkT3B0aW9uOiBPcHRpb25cblxuICAgICAgICBjb25zdCB2YWx1ZVdpdGhSZWxhdGlvbiA9IHZhbHVlIGFzIFZhbHVlV2l0aFJlbGF0aW9uXG5cbiAgICAgICAgb3B0aW9ucy5mb3JFYWNoKChvcHQpID0+IHtcbiAgICAgICAgICBpZiAob3B0Py5vcHRpb25zKSB7XG4gICAgICAgICAgICBvcHQub3B0aW9ucy5zb21lKChzdWJPcHQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHN1Yk9wdD8udmFsdWUgPT0gdmFsdWVXaXRoUmVsYXRpb24udmFsdWUpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVkT3B0aW9uID0gc3ViT3B0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBtYXRjaGVkT3B0aW9uXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvcHRpb25zLmZpbmQoKG9wdCkgPT4gb3B0LnZhbHVlID09IHZhbHVlKVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfSwgW2hhc01hbnksIGhhc011bHRpcGxlUmVsYXRpb25zLCBpc011bHRpLCB2YWx1ZSwgb3B0aW9uc10pXG5cbiAgY29uc3QgaGFuZGxlSW5wdXRDaGFuZ2UgPSB1c2VDYWxsYmFjayhcbiAgICAobmV3U2VhcmNoKSA9PiB7XG4gICAgICBpZiAoc2VhcmNoICE9PSBuZXdTZWFyY2gpIHtcbiAgICAgICAgc2V0U2VhcmNoKG5ld1NlYXJjaClcbiAgICAgIH1cbiAgICB9LFxuICAgIFtzZWFyY2hdLFxuICApXG5cbiAgY29uc3QgYWRkT3B0aW9uQnlJRCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChpZCwgcmVsYXRpb24pID0+IHtcbiAgICAgIGlmICghZXJyb3JMb2FkaW5nICYmIGlkICE9PSAnbnVsbCcpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtzZXJ2ZXJVUkx9JHthcGl9LyR7cmVsYXRpb259LyR7aWR9P2RlcHRoPTBgLCB7XG4gICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQWNjZXB0LUxhbmd1YWdlJzogaTE4bi5sYW5ndWFnZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgICAgICBhZGRPcHRpb25zKHsgZG9jczogW2RhdGFdIH0sIHJlbGF0aW9uKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS5lcnJvcih0KCdlcnJvcjpsb2FkaW5nRG9jdW1lbnQnLCB7IGlkIH0pKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBbaTE4biwgYWRkT3B0aW9ucywgYXBpLCBlcnJvckxvYWRpbmcsIHNlcnZlclVSTCwgdF0sXG4gIClcblxuICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gR2V0IHJlc3VsdHMgd2hlbiBzZWFyY2ggaW5wdXQgY2hhbmdlc1xuICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGRpc3BhdGNoT3B0aW9ucyh7XG4gICAgICB0eXBlOiAnQ0xFQVInLFxuICAgICAgaTE4bixcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0pXG5cbiAgICBzZXRIYXNMb2FkZWRGaXJzdE9wdGlvbnModHJ1ZSlcbiAgICBzZXRMYXN0TG9hZGVkUGFnZSgxKVxuICAgIHNldExhc3RGdWxseUxvYWRlZFJlbGF0aW9uKC0xKVxuICAgIHZvaWQgZ2V0UmVzdWx0cyh7IHNlYXJjaDogZGVib3VuY2VkU2VhcmNoIH0pXG4gIH0sIFtnZXRSZXN1bHRzLCBkZWJvdW5jZWRTZWFyY2gsIHJlbGF0aW9uVG8sIGkxOG5dKVxuXG4gIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLyBGb3JtYXQgb3B0aW9ucyBvbmNlIGZpcnN0IG9wdGlvbnMgaGF2ZSBiZWVuIHJldHJpZXZlZFxuICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICh2YWx1ZSAmJiBoYXNMb2FkZWRGaXJzdE9wdGlvbnMpIHtcbiAgICAgIGlmIChoYXNNYW55IHx8IGlzTXVsdGkpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hlZE9wdGlvbnMgPSBmaW5kT3B0aW9uc0J5VmFsdWUoKVxuXG4gICAgICAgIDsoKG1hdGNoZWRPcHRpb25zIGFzIE9wdGlvbltdKSB8fCBbXSkuZm9yRWFjaCgob3B0aW9uLCBpKSA9PiB7XG4gICAgICAgICAgaWYgKCFvcHRpb24pIHtcbiAgICAgICAgICAgIGlmIChoYXNNdWx0aXBsZVJlbGF0aW9ucykge1xuICAgICAgICAgICAgICB2b2lkIGFkZE9wdGlvbkJ5SUQodmFsdWVbaV0udmFsdWUsIHZhbHVlW2ldLnJlbGF0aW9uVG8pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2b2lkIGFkZE9wdGlvbkJ5SUQodmFsdWVbaV0sIHJlbGF0aW9uVG8pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbWF0Y2hlZE9wdGlvbiA9IGZpbmRPcHRpb25zQnlWYWx1ZSgpXG5cbiAgICAgICAgaWYgKCFtYXRjaGVkT3B0aW9uKSB7XG4gICAgICAgICAgaWYgKGhhc011bHRpcGxlUmVsYXRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZVdpdGhSZWxhdGlvbiA9IHZhbHVlIGFzIFZhbHVlV2l0aFJlbGF0aW9uXG4gICAgICAgICAgICB2b2lkIGFkZE9wdGlvbkJ5SUQodmFsdWVXaXRoUmVsYXRpb24udmFsdWUsIHZhbHVlV2l0aFJlbGF0aW9uLnJlbGF0aW9uVG8pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZvaWQgYWRkT3B0aW9uQnlJRCh2YWx1ZSwgcmVsYXRpb25UbylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIFtcbiAgICBhZGRPcHRpb25CeUlELFxuICAgIGZpbmRPcHRpb25zQnlWYWx1ZSxcbiAgICBoYXNNYW55LFxuICAgIGhhc011bHRpcGxlUmVsYXRpb25zLFxuICAgIGlzTXVsdGksXG4gICAgcmVsYXRpb25UbyxcbiAgICB2YWx1ZSxcbiAgICBoYXNMb2FkZWRGaXJzdE9wdGlvbnMsXG4gIF0pXG5cbiAgY29uc3QgY2xhc3NlcyA9IFsnZmllbGQtdHlwZScsIGJhc2VDbGFzcywgZXJyb3JMb2FkaW5nICYmICdlcnJvci1sb2FkaW5nJ11cbiAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgLmpvaW4oJyAnKVxuXG4gIGNvbnN0IHZhbHVlVG9SZW5kZXIgPSAoZmluZE9wdGlvbnNCeVZhbHVlKCkgfHwgdmFsdWUpIGFzIE9wdGlvblxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9PlxuICAgICAgeyFlcnJvckxvYWRpbmcgJiYgKFxuICAgICAgICA8UmVhY3RTZWxlY3RcbiAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgaXNNdWx0aT17aGFzTWFueSB8fCBpc011bHRpfVxuICAgICAgICAgIGlzU29ydGFibGU9e2lzU29ydGFibGV9XG4gICAgICAgICAgb25DaGFuZ2U9eyhzZWxlY3RlZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGhhc01hbnkgfHwgaXNNdWx0aSkge1xuICAgICAgICAgICAgICBvbkNoYW5nZShcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFxuICAgICAgICAgICAgICAgICAgPyBzZWxlY3RlZC5tYXAoKG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNNdWx0aXBsZVJlbGF0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25Ubzogb3B0aW9uLnJlbGF0aW9uVG8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBvcHRpb24udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbi52YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhhc011bHRpcGxlUmVsYXRpb25zKSB7XG4gICAgICAgICAgICAgIG9uQ2hhbmdlKHtcbiAgICAgICAgICAgICAgICByZWxhdGlvblRvOiBzZWxlY3RlZC5yZWxhdGlvblRvLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBzZWxlY3RlZC52YWx1ZSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG9uQ2hhbmdlKHNlbGVjdGVkLnZhbHVlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25JbnB1dENoYW5nZT17aGFuZGxlSW5wdXRDaGFuZ2V9XG4gICAgICAgICAgb25NZW51U2Nyb2xsVG9Cb3R0b209eygpID0+IHtcbiAgICAgICAgICAgIHZvaWQgZ2V0UmVzdWx0cyh7IGxhc3RGdWxseUxvYWRlZFJlbGF0aW9uLCBsYXN0TG9hZGVkUGFnZTogbGFzdExvYWRlZFBhZ2UgKyAxIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvcHRpb25zPXtvcHRpb25zfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXt0KCdzZWxlY3RWYWx1ZScpfVxuICAgICAgICAgIHZhbHVlPXt2YWx1ZVRvUmVuZGVyfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtlcnJvckxvYWRpbmcgJiYgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2Vycm9yLWxvYWRpbmdgfT57ZXJyb3JMb2FkaW5nfTwvZGl2Pn1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWxhdGlvbnNoaXBGaWVsZFxuIl0sIm5hbWVzIjpbImJhc2VDbGFzcyIsIm1heFJlc3VsdHNQZXJSZXF1ZXN0IiwiUmVsYXRpb25zaGlwRmllbGQiLCJwcm9wcyIsImFkbWluIiwiaXNTb3J0YWJsZSIsImRpc2FibGVkIiwiZmlsdGVyT3B0aW9ucyIsImhhc01hbnkiLCJvbkNoYW5nZSIsIm9wZXJhdG9yIiwicmVsYXRpb25UbyIsInZhbHVlIiwiY29sbGVjdGlvbnMiLCJyb3V0ZXMiLCJhcGkiLCJzZXJ2ZXJVUkwiLCJ1c2VDb25maWciLCJoYXNNdWx0aXBsZVJlbGF0aW9ucyIsIkFycmF5IiwiaXNBcnJheSIsIm9wdGlvbnMiLCJkaXNwYXRjaE9wdGlvbnMiLCJ1c2VSZWR1Y2VyIiwib3B0aW9uc1JlZHVjZXIiLCJsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbiIsInNldExhc3RGdWxseUxvYWRlZFJlbGF0aW9uIiwidXNlU3RhdGUiLCJsYXN0TG9hZGVkUGFnZSIsInNldExhc3RMb2FkZWRQYWdlIiwic2VhcmNoIiwic2V0U2VhcmNoIiwiZXJyb3JMb2FkaW5nIiwic2V0RXJyb3JMb2FkaW5nIiwiaGFzTG9hZGVkRmlyc3RPcHRpb25zIiwic2V0SGFzTG9hZGVkRmlyc3RPcHRpb25zIiwiZGVib3VuY2VkU2VhcmNoIiwidXNlRGVib3VuY2UiLCJpMThuIiwidCIsInVzZVRyYW5zbGF0aW9uIiwidXNlciIsInVzZUF1dGgiLCJpc011bHRpIiwiaW5jbHVkZXMiLCJhZGRPcHRpb25zIiwidXNlQ2FsbGJhY2siLCJkYXRhIiwicmVsYXRpb24iLCJjb2xsZWN0aW9uIiwiZmluZCIsImNvbGwiLCJzbHVnIiwidHlwZSIsImdldFJlc3VsdHMiLCJsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbkFyZyIsImxhc3RMb2FkZWRQYWdlQXJnIiwic2VhcmNoQXJnIiwibGFzdExvYWRlZFBhZ2VUb1VzZSIsImxhc3RGdWxseUxvYWRlZFJlbGF0aW9uVG9Vc2UiLCJyZWxhdGlvbnMiLCJyZWxhdGlvbnNUb0ZldGNoIiwic2xpY2UiLCJyZXN1bHRzRmV0Y2hlZCIsInJlZHVjZSIsInByaW9yUmVsYXRpb24iLCJkZXB0aCIsImxpbWl0IiwicGFnZSIsIndoZXJlIiwiYW5kIiwiZmllbGRUb1NlYXJjaCIsInVzZUFzVGl0bGUiLCJwdXNoIiwibGlrZSIsIm9wdGlvbkZpbHRlciIsImlkIiwidW5kZWZpbmVkIiwic2libGluZ0RhdGEiLCJpbmRleE9mIiwibGVuZ3RoIiwicmVzcG9uc2UiLCJmZXRjaCIsInFzIiwic3RyaW5naWZ5IiwiY3JlZGVudGlhbHMiLCJoZWFkZXJzIiwibGFuZ3VhZ2UiLCJvayIsImpzb24iLCJkb2NzIiwibmV4dFBhZ2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsImZpbmRPcHRpb25zQnlWYWx1ZSIsIm1hcCIsInZhbCIsIm1hdGNoZWRPcHRpb24iLCJmb3JFYWNoIiwib3B0Iiwic29tZSIsInN1Yk9wdCIsInZhbHVlV2l0aFJlbGF0aW9uIiwiaGFuZGxlSW5wdXRDaGFuZ2UiLCJuZXdTZWFyY2giLCJhZGRPcHRpb25CeUlEIiwiY29uc29sZSIsImVycm9yIiwidXNlRWZmZWN0IiwicmVxdWlyZWQiLCJtYXRjaGVkT3B0aW9ucyIsIm9wdGlvbiIsImkiLCJjbGFzc2VzIiwiZmlsdGVyIiwiQm9vbGVhbiIsImpvaW4iLCJ2YWx1ZVRvUmVuZGVyIiwiZGl2IiwiY2xhc3NOYW1lIiwiUmVhY3RTZWxlY3QiLCJzZWxlY3RlZCIsIm9uSW5wdXRDaGFuZ2UiLCJvbk1lbnVTY3JvbGxUb0JvdHRvbSIsInBsYWNlaG9sZGVyIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkF5WEE7OztlQUFBOzs7MkRBdlhlOytEQUNxRDs4QkFDckM7b0VBTVA7c0JBQ0E7d0JBQ0U7b0VBQ0Y7UUFDakI7dUVBQ29COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUUzQixNQUFNQSxZQUFZO0FBRWxCLE1BQU1DLHVCQUF1QjtBQUU3QixNQUFNQyxvQkFBcUMsQ0FBQ0M7SUFDMUMsTUFBTSxFQUNKQyxPQUFPLEVBQUVDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUMxQkMs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