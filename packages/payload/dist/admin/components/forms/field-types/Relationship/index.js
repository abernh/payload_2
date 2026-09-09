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
const _validations = require("../../../../../fields/validations");
const _wordBoundariesRegex = /*#__PURE__*/ _interop_require_default(require("../../../../../utilities/wordBoundariesRegex"));
const _useDebouncedCallback = require("../../../../hooks/useDebouncedCallback");
const _ReactSelect = /*#__PURE__*/ _interop_require_default(require("../../../elements/ReactSelect"));
const _Auth = require("../../../utilities/Auth");
const _Config = require("../../../utilities/Config");
const _GetFilterOptions = require("../../../utilities/GetFilterOptions");
const _Locale = require("../../../utilities/Locale");
const _Error = /*#__PURE__*/ _interop_require_default(require("../../Error"));
const _FieldDescription = /*#__PURE__*/ _interop_require_default(require("../../FieldDescription"));
const _context = require("../../Form/context");
const _Label = /*#__PURE__*/ _interop_require_default(require("../../Label"));
const _useField = /*#__PURE__*/ _interop_require_default(require("../../useField"));
const _withCondition = /*#__PURE__*/ _interop_require_default(require("../../withCondition"));
const _shared = require("../shared");
const _AddNew = require("./AddNew");
const _createRelationMap = require("./createRelationMap");
const _findOptionsByValue = require("./findOptionsByValue");
require("./index.scss");
const _optionsReducer = /*#__PURE__*/ _interop_require_default(require("./optionsReducer"));
const _MultiValueLabel = require("./select-components/MultiValueLabel");
const _SingleValue = require("./select-components/SingleValue");
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
const maxResultsPerRequest = 10;
const baseClass = 'relationship';
const Relationship = (props)=>{
    const { name, admin: { allowCreate = true, className, components: { Error, Label } = {}, condition, description, isSortable = true, readOnly, sortOptions, style, width } = {}, filterOptions, hasMany, label, path, relationTo, required, validate = _validations.relationship } = props;
    const ErrorComp = Error || _Error.default;
    const LabelComp = Label || _Label.default;
    const config = (0, _Config.useConfig)();
    const { collections, routes: { api }, serverURL } = config;
    const hasMultipleRelations = Array.isArray(relationTo);
    const initialLoadedPageState = hasMultipleRelations ? relationTo.reduce((acc, relation)=>{
        return {
            ...acc,
            [relation]: 0
        };
    }, {}) : {};
    const { i18n, t } = (0, _reacti18next.useTranslation)('fields');
    const { permissions } = (0, _Auth.useAuth)();
    const { code: locale } = (0, _Locale.useLocale)();
    const formProcessing = (0, _context.useFormProcessing)();
    const [options, dispatchOptions] = (0, _react.useReducer)(_optionsReducer.default, []);
    const [lastFullyLoadedRelation, setLastFullyLoadedRelation] = (0, _react.useState)(-1);
    const [lastLoadedPage, setLastLoadedPage] = (0, _react.useState)(initialLoadedPageState);
    const [errorLoading, setErrorLoading] = (0, _react.useState)('');
    const [filterOptionsResult, setFilterOptionsResult] = (0, _react.useState)();
    const [search, setSearch] = (0, _react.useState)('');
    const [isLoading, setIsLoading] = (0, _react.useState)(false);
    const [hasLoadedFirstPage, setHasLoadedFirstPage] = (0, _react.useState)(false);
    const [enableWordBoundarySearch, setEnableWordBoundarySearch] = (0, _react.useState)(false);
    const firstRun = (0, _react.useRef)(true);
    const pathOrName = path || name;
    const memoizedValidate = (0, _react.useCallback)((value, validationOptions)=>{
        return validate(value, {
            ...validationOptions,
            required
        });
    }, [
        validate,
        required
    ]);
    const { errorMessage, initialValue, setValue, showError, value } = (0, _useField.default)({
        condition,
        path: pathOrName,
        validate: memoizedValidate
    });
    const [drawerIsOpen, setDrawerIsOpen] = (0, _react.useState)(false);
    const getResults = (0, _react.useCallback)(async ({ lastFullyLoadedRelation: lastFullyLoadedRelationArg, onSuccess, search: searchArg, sort, value: valueArg })=>{
        if (!permissions) {
            return;
        }
        const lastFullyLoadedRelationToUse = typeof lastFullyLoadedRelationArg !== 'undefined' ? lastFullyLoadedRelationArg : -1;
        const relations = Array.isArray(relationTo) ? relationTo : [
            relationTo
        ];
        const relationsToFetch = lastFullyLoadedRelationToUse === -1 ? relations : relations.slice(lastFullyLoadedRelationToUse + 1);
        let resultsFetched = 0;
        const relationMap = (0, _createRelationMap.createRelationMap)({
            hasMany,
            relationTo,
            value: valueArg
        });
        if (!errorLoading) {
            await relationsToFetch.reduce(async (priorRelation, relation)=>{
                const relationFilterOption = filterOptionsResult?.[relation];
                let lastLoadedPageToUse;
                if (search !== searchArg) {
                    lastLoadedPageToUse = 1;
                } else {
                    lastLoadedPageToUse = lastLoadedPage[relation] + 1;
                }
                await priorRelation;
                if (relationFilterOption === false) {
                    setLastFullyLoadedRelation(relations.indexOf(relation));
                    return Promise.resolve();
                }
                if (resultsFetched < 10) {
                    const collection = collections.find((coll)=>coll.slug === relation);
                    const fieldToSearch = collection?.admin?.useAsTitle || 'id';
                    let fieldToSort = collection?.defaultSort || 'id';
                    if (typeof sortOptions === 'string') {
                        fieldToSort = sortOptions;
                    } else if (sortOptions?.[relation]) {
                        fieldToSort = sortOptions[relation];
                    }
                    const query = {
                        depth: 0,
                        draft: true,
                        limit: maxResultsPerRequest,
                        locale,
                        page: lastLoadedPageToUse,
                        sort: fieldToSort,
                        where: {
                            and: [
                                {
                                    id: {
                                        not_in: relationMap[relation]
                                    }
                                }
                            ]
                        }
                    };
                    if (searchArg) {
                        query.where.and.push({
                            [fieldToSearch]: {
                                like: searchArg
                            }
                        });
                    }
                    if (relationFilterOption && typeof relationFilterOption !== 'boolean') {
                        query.where.and.push(relationFilterOption);
                    }
                    const response = await fetch(`${serverURL}${api}/${relation}?${_qs.default.stringify(query, {
                        strictNullHandling: true
                    })}`, {
                        credentials: 'include',
                        headers: {
                            'Accept-Language': i18n.language
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setLastLoadedPage((prevState)=>{
                            return {
                                ...prevState,
                                [relation]: lastLoadedPageToUse
                            };
                        });
                        if (!data.nextPage) {
                            setLastFullyLoadedRelation(relations.indexOf(relation));
                        }
                        if (data.docs.length > 0) {
                            resultsFetched += data.docs.length;
                            dispatchOptions({
                                type: 'ADD',
                                collection,
                                config,
                                docs: data.docs,
                                i18n,
                                sort
                            });
                        }
                    } else if (response.status === 403) {
                        setLastFullyLoadedRelation(relations.indexOf(relation));
                        dispatchOptions({
                            type: 'ADD',
                            collection,
                            config,
                            docs: [],
                            i18n,
                            ids: relationMap[relation],
                            sort
                        });
                    } else {
                        setErrorLoading(t('error:unspecific'));
                    }
                }
            }, Promise.resolve());
            if (typeof onSuccess === 'function') onSuccess();
        }
    }, [
        permissions,
        relationTo,
        hasMany,
        errorLoading,
        search,
        lastLoadedPage,
        collections,
        locale,
        filterOptionsResult,
        serverURL,
        sortOptions,
        api,
        i18n,
        config,
        t
    ]);
    const updateSearch = (0, _useDebouncedCallback.useDebouncedCallback)((searchArg, valueArg)=>{
        void getResults({
            search: searchArg,
            sort: true,
            value: valueArg
        });
        setSearch(searchArg);
    }, 300);
    const handleInputChange = (0, _react.useCallback)((searchArg, valueArg)=>{
        if (search !== searchArg) {
            setLastLoadedPage(initialLoadedPageState);
            updateSearch(searchArg, valueArg, searchArg !== '');
        }
    }, [
        initialLoadedPageState,
        search,
        updateSearch
    ]);
    // ///////////////////////////////////
    // Ensure we have an option for each value
    // ///////////////////////////////////
    (0, _react.useEffect)(()=>{
        const relationMap = (0, _createRelationMap.createRelationMap)({
            hasMany,
            relationTo,
            value
        });
        void Object.entries(relationMap).reduce(async (priorRelation, [relation, ids])=>{
            await priorRelation;
            const idsToLoad = ids.filter((id)=>{
                return !options.find((optionGroup)=>optionGroup?.options?.find((option)=>option.value === id && option.relationTo === relation));
            });
            if (idsToLoad.length > 0) {
                const query = {
                    depth: 0,
                    draft: true,
                    limit: idsToLoad.length,
                    locale,
                    where: {
                        id: {
                            in: idsToLoad
                        }
                    }
                };
                if (!errorLoading) {
                    const response = await fetch(`${serverURL}${api}/${relation}?${_qs.default.stringify(query, {
                        strictNullHandling: true
                    })}`, {
                        credentials: 'include',
                        headers: {
                            'Accept-Language': i18n.language
                        }
                    });
                    const collection = collections.find((coll)=>coll.slug === relation);
                    let docs = [];
                    if (response.ok) {
                        const data = await response.json();
                        docs = data.docs;
                    }
                    dispatchOptions({
                        type: 'ADD',
                        collection,
                        config,
                        docs,
                        i18n,
                        ids: idsToLoad,
                        sort: true
                    });
                }
            }
        }, Promise.resolve());
    }, [
        options,
        value,
        hasMany,
        errorLoading,
        collections,
        hasMultipleRelations,
        serverURL,
        api,
        i18n,
        relationTo,
        locale,
        config
    ]);
    // Determine if we should switch to word boundary search
    (0, _react.useEffect)(()=>{
        const relations = Array.isArray(relationTo) ? relationTo : [
            relationTo
        ];
        const isIdOnly = relations.reduce((idOnly, relation)=>{
            const collection = collections.find((coll)=>coll.slug === relation);
            const fieldToSearch = collection?.admin?.useAsTitle || 'id';
            return fieldToSearch === 'id' && idOnly;
        }, true);
        setEnableWordBoundarySearch(!isIdOnly);
    }, [
        relationTo,
        collections
    ]);
    // When (`relationTo` || `filterOptionsResult` || `locale`) changes, reset component
    // Note - effect should not run on first run
    (0, _react.useEffect)(()=>{
        if (firstRun.current) {
            firstRun.current = false;
            return;
        }
        dispatchOptions({
            type: 'CLEAR'
        });
        setLastFullyLoadedRelation(-1);
        setLastLoadedPage(initialLoadedPageState);
        setHasLoadedFirstPage(false);
    }, [
        relationTo,
        filterOptionsResult,
        locale
    ]);
    const onSave = (0, _react.useCallback)((args)=>{
        dispatchOptions({
            type: 'UPDATE',
            collection: args.collectionConfig,
            config,
            doc: args.doc,
            i18n
        });
    }, [
        i18n,
        config
    ]);
    const filterOption = (0, _react.useCallback)((item, searchFilter)=>{
        if (!searchFilter) {
            return true;
        }
        const r = (0, _wordBoundariesRegex.default)(searchFilter || '');
        // breaking the labels to search into smaller parts increases performance
        const breakApartThreshold = 250;
        let string = item.label;
        // strings less than breakApartThreshold length won't be chunked
        while(string.length > breakApartThreshold){
            // slicing by the next space after the length of the search input prevents slicing the string up by partial words
            const indexOfSpace = string.indexOf(' ', searchFilter.length);
            if (r.test(string.slice(0, indexOfSpace === -1 ? searchFilter.length : indexOfSpace + 1))) {
                return true;
            }
            string = string.slice(indexOfSpace === -1 ? searchFilter.length : indexOfSpace + 1);
        }
        return r.test(string.slice(-breakApartThreshold));
    }, []);
    const valueToRender = (0, _findOptionsByValue.findOptionsByValue)({
        options,
        value
    });
    if (!Array.isArray(valueToRender) && valueToRender?.value === 'null') valueToRender.value = null;
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: [
            _shared.fieldBaseClass,
            baseClass,
            className,
            showError && 'error',
            errorLoading && 'error-loading',
            readOnly && `${baseClass}--read-only`
        ].filter(Boolean).join(' '),
        id: `field-${pathOrName.replace(/\./g, '__')}`,
        style: {
            ...style,
            width
        }
    }, /*#__PURE__*/ _react.default.createElement(ErrorComp, {
        message: errorMessage,
        showError: showError
    }), /*#__PURE__*/ _react.default.createElement(LabelComp, {
        htmlFor: pathOrName,
        label: label,
        required: required
    }), /*#__PURE__*/ _react.default.createElement(_GetFilterOptions.GetFilterOptions, {
        filterOptions,
        filterOptionsResult,
        path: pathOrName,
        relationTo,
        setFilterOptionsResult
    }), !errorLoading && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__wrap`
    }, /*#__PURE__*/ _react.default.createElement(_ReactSelect.default, {
        backspaceRemovesValue: !drawerIsOpen,
        components: {
            MultiValueLabel: _MultiValueLabel.MultiValueLabel,
            SingleValue: _SingleValue.SingleValue
        },
        customProps: {
            disableKeyDown: drawerIsOpen,
            disableMouseDown: drawerIsOpen,
            onSave,
            setDrawerIsOpen
        },
        disabled: readOnly || formProcessing,
        filterOption: enableWordBoundarySearch ? filterOption : undefined,
        isLoading: isLoading,
        isMulti: hasMany,
        isSortable: isSortable,
        onChange: !readOnly ? (selected)=>{
            if (selected === null) {
                setValue(hasMany ? [] : null);
            } else if (hasMany) {
                setValue(selected ? selected.map((option)=>{
                    if (hasMultipleRelations) {
                        return {
                            relationTo: option.relationTo,
                            value: option.value
                        };
                    }
                    return option.value;
                }) : null);
            } else if (hasMultipleRelations) {
                setValue({
                    relationTo: selected.relationTo,
                    value: selected.value
                });
            } else {
                setValue(selected.value);
            }
        } : undefined,
        onInputChange: (newSearch)=>handleInputChange(newSearch, value),
        onMenuOpen: ()=>{
            if (!hasLoadedFirstPage) {
                setIsLoading(true);
                void getResults({
                    onSuccess: ()=>{
                        setHasLoadedFirstPage(true);
                        setIsLoading(false);
                    },
                    value: initialValue
                });
            }
        },
        onMenuScrollToBottom: ()=>{
            void getResults({
                lastFullyLoadedRelation,
                search,
                sort: false,
                value: initialValue
            });
        },
        options: options,
        showError: showError,
        value: valueToRender ?? null
    }), !readOnly && allowCreate && /*#__PURE__*/ _react.default.createElement(_AddNew.AddNewRelation, {
        dispatchOptions,
        hasMany,
        options,
        path: pathOrName,
        relationTo,
        setValue,
        value
    })), errorLoading && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__error-loading`
    }, errorLoading), /*#__PURE__*/ _react.default.createElement(_FieldDescription.default, {
        description: description,
        path: path,
        value: value
    }));
};
const _default = (0, _withCondition.default)(Relationship);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Zvcm1zL2ZpZWxkLXR5cGVzL1JlbGF0aW9uc2hpcC9pbmRleC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHFzIGZyb20gJ3FzJ1xuaW1wb3J0IFJlYWN0LCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVJlZHVjZXIsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcblxuaW1wb3J0IHR5cGUgeyBQYWdpbmF0ZWREb2NzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGF0YWJhc2UvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFdoZXJlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IERvY3VtZW50RHJhd2VyUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9Eb2N1bWVudERyYXdlci90eXBlcydcbmltcG9ydCB0eXBlIHsgRmlsdGVyT3B0aW9uc1Jlc3VsdCwgR2V0UmVzdWx0cywgT3B0aW9uLCBQcm9wcywgVmFsdWUgfSBmcm9tICcuL3R5cGVzJ1xuXG5pbXBvcnQgeyByZWxhdGlvbnNoaXAgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9maWVsZHMvdmFsaWRhdGlvbnMnXG5pbXBvcnQgd29yZEJvdW5kYXJpZXNSZWdleCBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsaXRpZXMvd29yZEJvdW5kYXJpZXNSZWdleCdcbmltcG9ydCB7IHVzZURlYm91bmNlZENhbGxiYWNrIH0gZnJvbSAnLi4vLi4vLi4vLi4vaG9va3MvdXNlRGVib3VuY2VkQ2FsbGJhY2snXG5pbXBvcnQgUmVhY3RTZWxlY3QgZnJvbSAnLi4vLi4vLi4vZWxlbWVudHMvUmVhY3RTZWxlY3QnXG5pbXBvcnQgeyB1c2VBdXRoIH0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0aWVzL0F1dGgnXG5pbXBvcnQgeyB1c2VDb25maWcgfSBmcm9tICcuLi8uLi8uLi91dGlsaXRpZXMvQ29uZmlnJ1xuaW1wb3J0IHsgR2V0RmlsdGVyT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL3V0aWxpdGllcy9HZXRGaWx0ZXJPcHRpb25zJ1xuaW1wb3J0IHsgdXNlTG9jYWxlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0aWVzL0xvY2FsZSdcbmltcG9ydCBEZWZhdWx0RXJyb3IgZnJvbSAnLi4vLi4vRXJyb3InXG5pbXBvcnQgRmllbGREZXNjcmlwdGlvbiBmcm9tICcuLi8uLi9GaWVsZERlc2NyaXB0aW9uJ1xuaW1wb3J0IHsgdXNlRm9ybVByb2Nlc3NpbmcgfSBmcm9tICcuLi8uLi9Gb3JtL2NvbnRleHQnXG5pbXBvcnQgRGVmYXVsdExhYmVsIGZyb20gJy4uLy4uL0xhYmVsJ1xuaW1wb3J0IHVzZUZpZWxkIGZyb20gJy4uLy4uL3VzZUZpZWxkJ1xuaW1wb3J0IHdpdGhDb25kaXRpb24gZnJvbSAnLi4vLi4vd2l0aENvbmRpdGlvbidcbmltcG9ydCB7IGZpZWxkQmFzZUNsYXNzIH0gZnJvbSAnLi4vc2hhcmVkJ1xuaW1wb3J0IHsgQWRkTmV3UmVsYXRpb24gfSBmcm9tICcuL0FkZE5ldydcbmltcG9ydCB7IGNyZWF0ZVJlbGF0aW9uTWFwIH0gZnJvbSAnLi9jcmVhdGVSZWxhdGlvbk1hcCdcbmltcG9ydCB7IGZpbmRPcHRpb25zQnlWYWx1ZSB9IGZyb20gJy4vZmluZE9wdGlvbnNCeVZhbHVlJ1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5pbXBvcnQgb3B0aW9uc1JlZHVjZXIgZnJvbSAnLi9vcHRpb25zUmVkdWNlcidcbmltcG9ydCB7IE11bHRpVmFsdWVMYWJlbCB9IGZyb20gJy4vc2VsZWN0LWNvbXBvbmVudHMvTXVsdGlWYWx1ZUxhYmVsJ1xuaW1wb3J0IHsgU2luZ2xlVmFsdWUgfSBmcm9tICcuL3NlbGVjdC1jb21wb25lbnRzL1NpbmdsZVZhbHVlJ1xuXG5jb25zdCBtYXhSZXN1bHRzUGVyUmVxdWVzdCA9IDEwXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdyZWxhdGlvbnNoaXAnXG5cbmNvbnN0IFJlbGF0aW9uc2hpcDogUmVhY3QuRkM8UHJvcHM+ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBuYW1lLFxuICAgIGFkbWluOiB7XG4gICAgICBhbGxvd0NyZWF0ZSA9IHRydWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBjb21wb25lbnRzOiB7IEVycm9yLCBMYWJlbCB9ID0ge30sXG4gICAgICBjb25kaXRpb24sXG4gICAgICBkZXNjcmlwdGlvbixcbiAgICAgIGlzU29ydGFibGUgPSB0cnVlLFxuICAgICAgcmVhZE9ubHksXG4gICAgICBzb3J0T3B0aW9ucyxcbiAgICAgIHN0eWxlLFxuICAgICAgd2lkdGgsXG4gICAgfSA9IHt9LFxuICAgIGZpbHRlck9wdGlvbnMsXG4gICAgaGFzTWFueSxcbiAgICBsYWJlbCxcbiAgICBwYXRoLFxuICAgIHJlbGF0aW9uVG8sXG4gICAgcmVxdWlyZWQsXG4gICAgdmFsaWRhdGUgPSByZWxhdGlvbnNoaXAsXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IEVycm9yQ29tcCA9IEVycm9yIHx8IERlZmF1bHRFcnJvclxuICBjb25zdCBMYWJlbENvbXAgPSBMYWJlbCB8fCBEZWZhdWx0TGFiZWxcblxuICBjb25zdCBjb25maWcgPSB1c2VDb25maWcoKVxuXG4gIGNvbnN0IHtcbiAgICBjb2xsZWN0aW9ucyxcbiAgICByb3V0ZXM6IHsgYXBpIH0sXG4gICAgc2VydmVyVVJMLFxuICB9ID0gY29uZmlnXG5cbiAgY29uc3QgaGFzTXVsdGlwbGVSZWxhdGlvbnMgPSBBcnJheS5pc0FycmF5KHJlbGF0aW9uVG8pXG4gIGNvbnN0IGluaXRpYWxMb2FkZWRQYWdlU3RhdGUgPSBoYXNNdWx0aXBsZVJlbGF0aW9uc1xuICAgID8gcmVsYXRpb25Uby5yZWR1Y2UoKGFjYywgcmVsYXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5hY2MsXG4gICAgICAgICAgW3JlbGF0aW9uXTogMCxcbiAgICAgICAgfVxuICAgICAgfSwge30pXG4gICAgOiB7fVxuXG4gIGNvbnN0IHsgaTE4biwgdCB9ID0gdXNlVHJhbnNsYXRpb24oJ2ZpZWxkcycpXG4gIGNvbnN0IHsgcGVybWlzc2lvbnMgfSA9IHVzZUF1dGgoKVxuICBjb25zdCB7IGNvZGU6IGxvY2FsZSB9ID0gdXNlTG9jYWxlKClcbiAgY29uc3QgZm9ybVByb2Nlc3NpbmcgPSB1c2VGb3JtUHJvY2Vzc2luZygpXG4gIGNvbnN0IFtvcHRpb25zLCBkaXNwYXRjaE9wdGlvbnNdID0gdXNlUmVkdWNlcihvcHRpb25zUmVkdWNlciwgW10pXG4gIGNvbnN0IFtsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbiwgc2V0TGFzdEZ1bGx5TG9hZGVkUmVsYXRpb25dID0gdXNlU3RhdGUoLTEpXG4gIGNvbnN0IFtsYXN0TG9hZGVkUGFnZSwgc2V0TGFzdExvYWRlZFBhZ2VdID1cbiAgICB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCBudW1iZXI+Pihpbml0aWFsTG9hZGVkUGFnZVN0YXRlKVxuICBjb25zdCBbZXJyb3JMb2FkaW5nLCBzZXRFcnJvckxvYWRpbmddID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtmaWx0ZXJPcHRpb25zUmVzdWx0LCBzZXRGaWx0ZXJPcHRpb25zUmVzdWx0XSA9IHVzZVN0YXRlPEZpbHRlck9wdGlvbnNSZXN1bHQ+KClcbiAgY29uc3QgW3NlYXJjaCwgc2V0U2VhcmNoXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtoYXNMb2FkZWRGaXJzdFBhZ2UsIHNldEhhc0xvYWRlZEZpcnN0UGFnZV0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2VuYWJsZVdvcmRCb3VuZGFyeVNlYXJjaCwgc2V0RW5hYmxlV29yZEJvdW5kYXJ5U2VhcmNoXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBmaXJzdFJ1biA9IHVzZVJlZih0cnVlKVxuICBjb25zdCBwYXRoT3JOYW1lID0gcGF0aCB8fCBuYW1lXG5cbiAgY29uc3QgbWVtb2l6ZWRWYWxpZGF0ZSA9IHVzZUNhbGxiYWNrKFxuICAgICh2YWx1ZSwgdmFsaWRhdGlvbk9wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiB2YWxpZGF0ZSh2YWx1ZSwgeyAuLi52YWxpZGF0aW9uT3B0aW9ucywgcmVxdWlyZWQgfSlcbiAgICB9LFxuICAgIFt2YWxpZGF0ZSwgcmVxdWlyZWRdLFxuICApXG5cbiAgY29uc3QgeyBlcnJvck1lc3NhZ2UsIGluaXRpYWxWYWx1ZSwgc2V0VmFsdWUsIHNob3dFcnJvciwgdmFsdWUgfSA9IHVzZUZpZWxkPFZhbHVlIHwgVmFsdWVbXT4oe1xuICAgIGNvbmRpdGlvbixcbiAgICBwYXRoOiBwYXRoT3JOYW1lLFxuICAgIHZhbGlkYXRlOiBtZW1vaXplZFZhbGlkYXRlLFxuICB9KVxuXG4gIGNvbnN0IFtkcmF3ZXJJc09wZW4sIHNldERyYXdlcklzT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICBjb25zdCBnZXRSZXN1bHRzOiBHZXRSZXN1bHRzID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHtcbiAgICAgIGxhc3RGdWxseUxvYWRlZFJlbGF0aW9uOiBsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbkFyZyxcbiAgICAgIG9uU3VjY2VzcyxcbiAgICAgIHNlYXJjaDogc2VhcmNoQXJnLFxuICAgICAgc29ydCxcbiAgICAgIHZhbHVlOiB2YWx1ZUFyZyxcbiAgICB9KSA9PiB7XG4gICAgICBpZiAoIXBlcm1pc3Npb25zKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY29uc3QgbGFzdEZ1bGx5TG9hZGVkUmVsYXRpb25Ub1VzZSA9XG4gICAgICAgIHR5cGVvZiBsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbkFyZyAhPT0gJ3VuZGVmaW5lZCcgPyBsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbkFyZyA6IC0xXG5cbiAgICAgIGNvbnN0IHJlbGF0aW9ucyA9IEFycmF5LmlzQXJyYXkocmVsYXRpb25UbykgPyByZWxhdGlvblRvIDogW3JlbGF0aW9uVG9dXG4gICAgICBjb25zdCByZWxhdGlvbnNUb0ZldGNoID1cbiAgICAgICAgbGFzdEZ1bGx5TG9hZGVkUmVsYXRpb25Ub1VzZSA9PT0gLTFcbiAgICAgICAgICA/IHJlbGF0aW9uc1xuICAgICAgICAgIDogcmVsYXRpb25zLnNsaWNlKGxhc3RGdWxseUxvYWRlZFJlbGF0aW9uVG9Vc2UgKyAxKVxuXG4gICAgICBsZXQgcmVzdWx0c0ZldGNoZWQgPSAwXG4gICAgICBjb25zdCByZWxhdGlvbk1hcCA9IGNyZWF0ZVJlbGF0aW9uTWFwKHtcbiAgICAgICAgaGFzTWFueSxcbiAgICAgICAgcmVsYXRpb25UbyxcbiAgICAgICAgdmFsdWU6IHZhbHVlQXJnLFxuICAgICAgfSlcblxuICAgICAgaWYgKCFlcnJvckxvYWRpbmcpIHtcbiAgICAgICAgYXdhaXQgcmVsYXRpb25zVG9GZXRjaC5yZWR1Y2UoYXN5bmMgKHByaW9yUmVsYXRpb24sIHJlbGF0aW9uKSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVsYXRpb25GaWx0ZXJPcHRpb24gPSBmaWx0ZXJPcHRpb25zUmVzdWx0Py5bcmVsYXRpb25dXG4gICAgICAgICAgbGV0IGxhc3RMb2FkZWRQYWdlVG9Vc2VcbiAgICAgICAgICBpZiAoc2VhcmNoICE9PSBzZWFyY2hBcmcpIHtcbiAgICAgICAgICAgIGxhc3RMb2FkZWRQYWdlVG9Vc2UgPSAxXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxhc3RMb2FkZWRQYWdlVG9Vc2UgPSBsYXN0TG9hZGVkUGFnZVtyZWxhdGlvbl0gKyAxXG4gICAgICAgICAgfVxuICAgICAgICAgIGF3YWl0IHByaW9yUmVsYXRpb25cblxuICAgICAgICAgIGlmIChyZWxhdGlvbkZpbHRlck9wdGlvbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHNldExhc3RGdWxseUxvYWRlZFJlbGF0aW9uKHJlbGF0aW9ucy5pbmRleE9mKHJlbGF0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyZXN1bHRzRmV0Y2hlZCA8IDEwKSB7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gY29sbGVjdGlvbnMuZmluZCgoY29sbCkgPT4gY29sbC5zbHVnID09PSByZWxhdGlvbilcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkVG9TZWFyY2ggPSBjb2xsZWN0aW9uPy5hZG1pbj8udXNlQXNUaXRsZSB8fCAnaWQnXG4gICAgICAgICAgICBsZXQgZmllbGRUb1NvcnQgPSBjb2xsZWN0aW9uPy5kZWZhdWx0U29ydCB8fCAnaWQnXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNvcnRPcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBmaWVsZFRvU29ydCA9IHNvcnRPcHRpb25zXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNvcnRPcHRpb25zPy5bcmVsYXRpb25dKSB7XG4gICAgICAgICAgICAgIGZpZWxkVG9Tb3J0ID0gc29ydE9wdGlvbnNbcmVsYXRpb25dXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5OiB7XG4gICAgICAgICAgICAgIFtrZXk6IHN0cmluZ106IHVua25vd25cbiAgICAgICAgICAgICAgd2hlcmU6IFdoZXJlXG4gICAgICAgICAgICB9ID0ge1xuICAgICAgICAgICAgICBkZXB0aDogMCxcbiAgICAgICAgICAgICAgZHJhZnQ6IHRydWUsXG4gICAgICAgICAgICAgIGxpbWl0OiBtYXhSZXN1bHRzUGVyUmVxdWVzdCxcbiAgICAgICAgICAgICAgbG9jYWxlLFxuICAgICAgICAgICAgICBwYWdlOiBsYXN0TG9hZGVkUGFnZVRvVXNlLFxuICAgICAgICAgICAgICBzb3J0OiBmaWVsZFRvU29ydCxcbiAgICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgICBhbmQ6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICBub3RfaW46IHJlbGF0aW9uTWFwW3JlbGF0aW9uXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlYXJjaEFyZykge1xuICAgICAgICAgICAgICBxdWVyeS53aGVyZS5hbmQucHVzaCh7XG4gICAgICAgICAgICAgICAgW2ZpZWxkVG9TZWFyY2hdOiB7XG4gICAgICAgICAgICAgICAgICBsaWtlOiBzZWFyY2hBcmcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlbGF0aW9uRmlsdGVyT3B0aW9uICYmIHR5cGVvZiByZWxhdGlvbkZpbHRlck9wdGlvbiAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgIHF1ZXJ5LndoZXJlLmFuZC5wdXNoKHJlbGF0aW9uRmlsdGVyT3B0aW9uKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgICBgJHtzZXJ2ZXJVUkx9JHthcGl9LyR7cmVsYXRpb259PyR7cXMuc3RyaW5naWZ5KHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgc3RyaWN0TnVsbEhhbmRsaW5nOiB0cnVlLFxuICAgICAgICAgICAgICB9KX1gLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAnQWNjZXB0LUxhbmd1YWdlJzogaTE4bi5sYW5ndWFnZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgY29uc3QgZGF0YTogUGFnaW5hdGVkRG9jczx1bmtub3duPiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgICAgICAgICBzZXRMYXN0TG9hZGVkUGFnZSgocHJldlN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIC4uLnByZXZTdGF0ZSxcbiAgICAgICAgICAgICAgICAgIFtyZWxhdGlvbl06IGxhc3RMb2FkZWRQYWdlVG9Vc2UsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgIGlmICghZGF0YS5uZXh0UGFnZSkge1xuICAgICAgICAgICAgICAgIHNldExhc3RGdWxseUxvYWRlZFJlbGF0aW9uKHJlbGF0aW9ucy5pbmRleE9mKHJlbGF0aW9uKSlcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChkYXRhLmRvY3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHNGZXRjaGVkICs9IGRhdGEuZG9jcy5sZW5ndGhcblxuICAgICAgICAgICAgICAgIGRpc3BhdGNoT3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnQUREJyxcbiAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICAgICAgICBkb2NzOiBkYXRhLmRvY3MsXG4gICAgICAgICAgICAgICAgICBpMThuLFxuICAgICAgICAgICAgICAgICAgc29ydCxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAzKSB7XG4gICAgICAgICAgICAgIHNldExhc3RGdWxseUxvYWRlZFJlbGF0aW9uKHJlbGF0aW9ucy5pbmRleE9mKHJlbGF0aW9uKSlcbiAgICAgICAgICAgICAgZGlzcGF0Y2hPcHRpb25zKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnQUREJyxcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgICAgICBkb2NzOiBbXSxcbiAgICAgICAgICAgICAgICBpMThuLFxuICAgICAgICAgICAgICAgIGlkczogcmVsYXRpb25NYXBbcmVsYXRpb25dLFxuICAgICAgICAgICAgICAgIHNvcnQsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZXRFcnJvckxvYWRpbmcodCgnZXJyb3I6dW5zcGVjaWZpYycpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgUHJvbWlzZS5yZXNvbHZlKCkpXG5cbiAgICAgICAgaWYgKHR5cGVvZiBvblN1Y2Nlc3MgPT09ICdmdW5jdGlvbicpIG9uU3VjY2VzcygpXG4gICAgICB9XG4gICAgfSxcbiAgICBbXG4gICAgICBwZXJtaXNzaW9ucyxcbiAgICAgIHJlbGF0aW9uVG8sXG4gICAgICBoYXNNYW55LFxuICAgICAgZXJyb3JMb2FkaW5nLFxuICAgICAgc2VhcmNoLFxuICAgICAgbGFzdExvYWRlZFBhZ2UsXG4gICAgICBjb2xsZWN0aW9ucyxcbiAgICAgIGxvY2FsZSxcbiAgICAgIGZpbHRlck9wdGlvbnNSZXN1bHQsXG4gICAgICBzZXJ2ZXJVUkwsXG4gICAgICBzb3J0T3B0aW9ucyxcbiAgICAgIGFwaSxcbiAgICAgIGkxOG4sXG4gICAgICBjb25maWcsXG4gICAgICB0LFxuICAgIF0sXG4gIClcblxuICBjb25zdCB1cGRhdGVTZWFyY2ggPSB1c2VEZWJvdW5jZWRDYWxsYmFjaygoc2VhcmNoQXJnOiBzdHJpbmcsIHZhbHVlQXJnOiBWYWx1ZSB8IFZhbHVlW10pID0+IHtcbiAgICB2b2lkIGdldFJlc3VsdHMoeyBzZWFyY2g6IHNlYXJjaEFyZywgc29ydDogdHJ1ZSwgdmFsdWU6IHZhbHVlQXJnIH0pXG4gICAgc2V0U2VhcmNoKHNlYXJjaEFyZylcbiAgfSwgMzAwKVxuXG4gIGNvbnN0IGhhbmRsZUlucHV0Q2hhbmdlID0gdXNlQ2FsbGJhY2soXG4gICAgKHNlYXJjaEFyZzogc3RyaW5nLCB2YWx1ZUFyZzogVmFsdWUgfCBWYWx1ZVtdKSA9PiB7XG4gICAgICBpZiAoc2VhcmNoICE9PSBzZWFyY2hBcmcpIHtcbiAgICAgICAgc2V0TGFzdExvYWRlZFBhZ2UoaW5pdGlhbExvYWRlZFBhZ2VTdGF0ZSlcbiAgICAgICAgdXBkYXRlU2VhcmNoKHNlYXJjaEFyZywgdmFsdWVBcmcsIHNlYXJjaEFyZyAhPT0gJycpXG4gICAgICB9XG4gICAgfSxcbiAgICBbaW5pdGlhbExvYWRlZFBhZ2VTdGF0ZSwgc2VhcmNoLCB1cGRhdGVTZWFyY2hdLFxuICApXG5cbiAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gRW5zdXJlIHdlIGhhdmUgYW4gb3B0aW9uIGZvciBlYWNoIHZhbHVlXG4gIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByZWxhdGlvbk1hcCA9IGNyZWF0ZVJlbGF0aW9uTWFwKHtcbiAgICAgIGhhc01hbnksXG4gICAgICByZWxhdGlvblRvLFxuICAgICAgdmFsdWUsXG4gICAgfSlcblxuICAgIHZvaWQgT2JqZWN0LmVudHJpZXMocmVsYXRpb25NYXApLnJlZHVjZShhc3luYyAocHJpb3JSZWxhdGlvbiwgW3JlbGF0aW9uLCBpZHNdKSA9PiB7XG4gICAgICBhd2FpdCBwcmlvclJlbGF0aW9uXG5cbiAgICAgIGNvbnN0IGlkc1RvTG9hZCA9IGlkcy5maWx0ZXIoKGlkKSA9PiB7XG4gICAgICAgIHJldHVybiAhb3B0aW9ucy5maW5kKChvcHRpb25Hcm91cCkgPT5cbiAgICAgICAgICBvcHRpb25Hcm91cD8ub3B0aW9ucz8uZmluZChcbiAgICAgICAgICAgIChvcHRpb24pID0+IG9wdGlvbi52YWx1ZSA9PT0gaWQgJiYgb3B0aW9uLnJlbGF0aW9uVG8gPT09IHJlbGF0aW9uLFxuICAgICAgICAgICksXG4gICAgICAgIClcbiAgICAgIH0pXG5cbiAgICAgIGlmIChpZHNUb0xvYWQubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBxdWVyeSA9IHtcbiAgICAgICAgICBkZXB0aDogMCxcbiAgICAgICAgICBkcmFmdDogdHJ1ZSxcbiAgICAgICAgICBsaW1pdDogaWRzVG9Mb2FkLmxlbmd0aCxcbiAgICAgICAgICBsb2NhbGUsXG4gICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICAgIGluOiBpZHNUb0xvYWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWVycm9yTG9hZGluZykge1xuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICAgICAgICBgJHtzZXJ2ZXJVUkx9JHthcGl9LyR7cmVsYXRpb259PyR7cXMuc3RyaW5naWZ5KHF1ZXJ5LCB7XG4gICAgICAgICAgICAgIHN0cmljdE51bGxIYW5kbGluZzogdHJ1ZSxcbiAgICAgICAgICAgIH0pfWAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQWNjZXB0LUxhbmd1YWdlJzogaTE4bi5sYW5ndWFnZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25zLmZpbmQoKGNvbGwpID0+IGNvbGwuc2x1ZyA9PT0gcmVsYXRpb24pXG4gICAgICAgICAgbGV0IGRvY3MgPSBbXVxuXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICAgICAgICBkb2NzID0gZGF0YS5kb2NzXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGlzcGF0Y2hPcHRpb25zKHtcbiAgICAgICAgICAgIHR5cGU6ICdBREQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgIGRvY3MsXG4gICAgICAgICAgICBpMThuLFxuICAgICAgICAgICAgaWRzOiBpZHNUb0xvYWQsXG4gICAgICAgICAgICBzb3J0OiB0cnVlLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBQcm9taXNlLnJlc29sdmUoKSlcbiAgfSwgW1xuICAgIG9wdGlvbnMsXG4gICAgdmFsdWUsXG4gICAgaGFzTWFueSxcbiAgICBlcnJvckxvYWRpbmcsXG4gICAgY29sbGVjdGlvbnMsXG4gICAgaGFzTXVsdGlwbGVSZWxhdGlvbnMsXG4gICAgc2VydmVyVVJMLFxuICAgIGFwaSxcbiAgICBpMThuLFxuICAgIHJlbGF0aW9uVG8sXG4gICAgbG9jYWxlLFxuICAgIGNvbmZpZyxcbiAgXSlcblxuICAvLyBEZXRlcm1pbmUgaWYgd2Ugc2hvdWxkIHN3aXRjaCB0byB3b3JkIGJvdW5kYXJ5IHNlYXJjaFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHJlbGF0aW9ucyA9IEFycmF5LmlzQXJyYXkocmVsYXRpb25UbykgPyByZWxhdGlvblRvIDogW3JlbGF0aW9uVG9dXG4gICAgY29uc3QgaXNJZE9ubHkgPSByZWxhdGlvbnMucmVkdWNlKChpZE9ubHksIHJlbGF0aW9uKSA9PiB7XG4gICAgICBjb25zdCBjb2xsZWN0aW9uID0gY29sbGVjdGlvbnMuZmluZCgoY29sbCkgPT4gY29sbC5zbHVnID09PSByZWxhdGlvbilcbiAgICAgIGNvbnN0IGZpZWxkVG9TZWFyY2ggPSBjb2xsZWN0aW9uPy5hZG1pbj8udXNlQXNUaXRsZSB8fCAnaWQnXG4gICAgICByZXR1cm4gZmllbGRUb1NlYXJjaCA9PT0gJ2lkJyAmJiBpZE9ubHlcbiAgICB9LCB0cnVlKVxuICAgIHNldEVuYWJsZVdvcmRCb3VuZGFyeVNlYXJjaCghaXNJZE9ubHkpXG4gIH0sIFtyZWxhdGlvblRvLCBjb2xsZWN0aW9uc10pXG5cbiAgLy8gV2hlbiAoYHJlbGF0aW9uVG9gIHx8IGBmaWx0ZXJPcHRpb25zUmVzdWx0YCB8fCBgbG9jYWxlYCkgY2hhbmdlcywgcmVzZXQgY29tcG9uZW50XG4gIC8vIE5vdGUgLSBlZmZlY3Qgc2hvdWxkIG5vdCBydW4gb24gZmlyc3QgcnVuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGZpcnN0UnVuLmN1cnJlbnQpIHtcbiAgICAgIGZpcnN0UnVuLmN1cnJlbnQgPSBmYWxzZVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgZGlzcGF0Y2hPcHRpb25zKHsgdHlwZTogJ0NMRUFSJyB9KVxuICAgIHNldExhc3RGdWxseUxvYWRlZFJlbGF0aW9uKC0xKVxuICAgIHNldExhc3RMb2FkZWRQYWdlKGluaXRpYWxMb2FkZWRQYWdlU3RhdGUpXG4gICAgc2V0SGFzTG9hZGVkRmlyc3RQYWdlKGZhbHNlKVxuICB9LCBbcmVsYXRpb25UbywgZmlsdGVyT3B0aW9uc1Jlc3VsdCwgbG9jYWxlXSlcblxuICBjb25zdCBvblNhdmUgPSB1c2VDYWxsYmFjazxEb2N1bWVudERyYXdlclByb3BzWydvblNhdmUnXT4oXG4gICAgKGFyZ3MpID0+IHtcbiAgICAgIGRpc3BhdGNoT3B0aW9ucyh7XG4gICAgICAgIHR5cGU6ICdVUERBVEUnLFxuICAgICAgICBjb2xsZWN0aW9uOiBhcmdzLmNvbGxlY3Rpb25Db25maWcsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgZG9jOiBhcmdzLmRvYyxcbiAgICAgICAgaTE4bixcbiAgICAgIH0pXG4gICAgfSxcbiAgICBbaTE4biwgY29uZmlnXSxcbiAgKVxuXG4gIGNvbnN0IGZpbHRlck9wdGlvbiA9IHVzZUNhbGxiYWNrKChpdGVtOiBPcHRpb24sIHNlYXJjaEZpbHRlcjogc3RyaW5nKSA9PiB7XG4gICAgaWYgKCFzZWFyY2hGaWx0ZXIpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGNvbnN0IHIgPSB3b3JkQm91bmRhcmllc1JlZ2V4KHNlYXJjaEZpbHRlciB8fCAnJylcbiAgICAvLyBicmVha2luZyB0aGUgbGFiZWxzIHRvIHNlYXJjaCBpbnRvIHNtYWxsZXIgcGFydHMgaW5jcmVhc2VzIHBlcmZvcm1hbmNlXG4gICAgY29uc3QgYnJlYWtBcGFydFRocmVzaG9sZCA9IDI1MFxuICAgIGxldCBzdHJpbmcgPSBpdGVtLmxhYmVsXG4gICAgLy8gc3RyaW5ncyBsZXNzIHRoYW4gYnJlYWtBcGFydFRocmVzaG9sZCBsZW5ndGggd29uJ3QgYmUgY2h1bmtlZFxuICAgIHdoaWxlIChzdHJpbmcubGVuZ3RoID4gYnJlYWtBcGFydFRocmVzaG9sZCkge1xuICAgICAgLy8gc2xpY2luZyBieSB0aGUgbmV4dCBzcGFjZSBhZnRlciB0aGUgbGVuZ3RoIG9mIHRoZSBzZWFyY2ggaW5wdXQgcHJldmVudHMgc2xpY2luZyB0aGUgc3RyaW5nIHVwIGJ5IHBhcnRpYWwgd29yZHNcbiAgICAgIGNvbnN0IGluZGV4T2ZTcGFjZSA9IHN0cmluZy5pbmRleE9mKCcgJywgc2VhcmNoRmlsdGVyLmxlbmd0aClcbiAgICAgIGlmIChyLnRlc3Qoc3RyaW5nLnNsaWNlKDAsIGluZGV4T2ZTcGFjZSA9PT0gLTEgPyBzZWFyY2hGaWx0ZXIubGVuZ3RoIDogaW5kZXhPZlNwYWNlICsgMSkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2UoaW5kZXhPZlNwYWNlID09PSAtMSA/IHNlYXJjaEZpbHRlci5sZW5ndGggOiBpbmRleE9mU3BhY2UgKyAxKVxuICAgIH1cbiAgICByZXR1cm4gci50ZXN0KHN0cmluZy5zbGljZSgtYnJlYWtBcGFydFRocmVzaG9sZCkpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IHZhbHVlVG9SZW5kZXIgPSBmaW5kT3B0aW9uc0J5VmFsdWUoeyBvcHRpb25zLCB2YWx1ZSB9KVxuXG4gIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZVRvUmVuZGVyKSAmJiB2YWx1ZVRvUmVuZGVyPy52YWx1ZSA9PT0gJ251bGwnKSB2YWx1ZVRvUmVuZGVyLnZhbHVlID0gbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtbXG4gICAgICAgIGZpZWxkQmFzZUNsYXNzLFxuICAgICAgICBiYXNlQ2xhc3MsXG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgc2hvd0Vycm9yICYmICdlcnJvcicsXG4gICAgICAgIGVycm9yTG9hZGluZyAmJiAnZXJyb3ItbG9hZGluZycsXG4gICAgICAgIHJlYWRPbmx5ICYmIGAke2Jhc2VDbGFzc30tLXJlYWQtb25seWAsXG4gICAgICBdXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgLmpvaW4oJyAnKX1cbiAgICAgIGlkPXtgZmllbGQtJHtwYXRoT3JOYW1lLnJlcGxhY2UoL1xcLi9nLCAnX18nKX1gfVxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgIHdpZHRoLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8RXJyb3JDb21wIG1lc3NhZ2U9e2Vycm9yTWVzc2FnZX0gc2hvd0Vycm9yPXtzaG93RXJyb3J9IC8+XG4gICAgICA8TGFiZWxDb21wIGh0bWxGb3I9e3BhdGhPck5hbWV9IGxhYmVsPXtsYWJlbH0gcmVxdWlyZWQ9e3JlcXVpcmVkfSAvPlxuICAgICAgPEdldEZpbHRlck9wdGlvbnNcbiAgICAgICAgey4uLntcbiAgICAgICAgICBmaWx0ZXJPcHRpb25zLFxuICAgICAgICAgIGZpbHRlck9wdGlvbnNSZXN1bHQsXG4gICAgICAgICAgcGF0aDogcGF0aE9yTmFtZSxcbiAgICAgICAgICByZWxhdGlvblRvLFxuICAgICAgICAgIHNldEZpbHRlck9wdGlvbnNSZXN1bHQsXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICAgeyFlcnJvckxvYWRpbmcgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fd3JhcGB9PlxuICAgICAgICAgIDxSZWFjdFNlbGVjdFxuICAgICAgICAgICAgYmFja3NwYWNlUmVtb3Zlc1ZhbHVlPXshZHJhd2VySXNPcGVufVxuICAgICAgICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICAgICAgICBNdWx0aVZhbHVlTGFiZWwsXG4gICAgICAgICAgICAgIFNpbmdsZVZhbHVlLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGN1c3RvbVByb3BzPXt7XG4gICAgICAgICAgICAgIGRpc2FibGVLZXlEb3duOiBkcmF3ZXJJc09wZW4sXG4gICAgICAgICAgICAgIGRpc2FibGVNb3VzZURvd246IGRyYXdlcklzT3BlbixcbiAgICAgICAgICAgICAgb25TYXZlLFxuICAgICAgICAgICAgICBzZXREcmF3ZXJJc09wZW4sXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGlzYWJsZWQ9e3JlYWRPbmx5IHx8IGZvcm1Qcm9jZXNzaW5nfVxuICAgICAgICAgICAgZmlsdGVyT3B0aW9uPXtlbmFibGVXb3JkQm91bmRhcnlTZWFyY2ggPyBmaWx0ZXJPcHRpb24gOiB1bmRlZmluZWR9XG4gICAgICAgICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgICAgICAgIGlzTXVsdGk9e2hhc01hbnl9XG4gICAgICAgICAgICBpc1NvcnRhYmxlPXtpc1NvcnRhYmxlfVxuICAgICAgICAgICAgb25DaGFuZ2U9e1xuICAgICAgICAgICAgICAhcmVhZE9ubHlcbiAgICAgICAgICAgICAgICA/IChzZWxlY3RlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzZXRWYWx1ZShoYXNNYW55ID8gW10gOiBudWxsKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc01hbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzZXRWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gc2VsZWN0ZWQubWFwKChvcHRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNNdWx0aXBsZVJlbGF0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uVG86IG9wdGlvbi5yZWxhdGlvblRvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBvcHRpb24udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbi52YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzTXVsdGlwbGVSZWxhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzZXRWYWx1ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvblRvOiBzZWxlY3RlZC5yZWxhdGlvblRvLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNlbGVjdGVkLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0VmFsdWUoc2VsZWN0ZWQudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25JbnB1dENoYW5nZT17KG5ld1NlYXJjaCkgPT4gaGFuZGxlSW5wdXRDaGFuZ2UobmV3U2VhcmNoLCB2YWx1ZSl9XG4gICAgICAgICAgICBvbk1lbnVPcGVuPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGlmICghaGFzTG9hZGVkRmlyc3RQYWdlKSB7XG4gICAgICAgICAgICAgICAgc2V0SXNMb2FkaW5nKHRydWUpXG4gICAgICAgICAgICAgICAgdm9pZCBnZXRSZXN1bHRzKHtcbiAgICAgICAgICAgICAgICAgIG9uU3VjY2VzczogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZXRIYXNMb2FkZWRGaXJzdFBhZ2UodHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uTWVudVNjcm9sbFRvQm90dG9tPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHZvaWQgZ2V0UmVzdWx0cyh7XG4gICAgICAgICAgICAgICAgbGFzdEZ1bGx5TG9hZGVkUmVsYXRpb24sXG4gICAgICAgICAgICAgICAgc2VhcmNoLFxuICAgICAgICAgICAgICAgIHNvcnQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb3B0aW9ucz17b3B0aW9uc31cbiAgICAgICAgICAgIHNob3dFcnJvcj17c2hvd0Vycm9yfVxuICAgICAgICAgICAgdmFsdWU9e3ZhbHVlVG9SZW5kZXIgPz8gbnVsbH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHshcmVhZE9ubHkgJiYgYWxsb3dDcmVhdGUgJiYgKFxuICAgICAgICAgICAgPEFkZE5ld1JlbGF0aW9uXG4gICAgICAgICAgICAgIHsuLi57XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hPcHRpb25zLFxuICAgICAgICAgICAgICAgIGhhc01hbnksXG4gICAgICAgICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICAgICAgICBwYXRoOiBwYXRoT3JOYW1lLFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uVG8sXG4gICAgICAgICAgICAgICAgc2V0VmFsdWUsXG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHtlcnJvckxvYWRpbmcgJiYgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2Vycm9yLWxvYWRpbmdgfT57ZXJyb3JMb2FkaW5nfTwvZGl2Pn1cbiAgICAgIDxGaWVsZERlc2NyaXB0aW9uIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbn0gcGF0aD17cGF0aH0gdmFsdWU9e3ZhbHVlfSAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IHdpdGhDb25kaXRpb24oUmVsYXRpb25zaGlwKVxuIl0sIm5hbWVzIjpbIm1heFJlc3VsdHNQZXJSZXF1ZXN0IiwiYmFzZUNsYXNzIiwiUmVsYXRpb25zaGlwIiwicHJvcHMiLCJuYW1lIiwiYWRtaW4iLCJhbGxvd0NyZWF0ZSIsImNsYXNzTmFtZSIsImNvbXBvbmVudHMiLCJFcnJvciIsIkxhYmVsIiwiY29uZGl0aW9uIiwiZGVzY3JpcHRpb24iLCJpc1NvcnRhYmxlIiwicmVhZE9ubHkiLCJzb3J0T3B0aW9ucyIsInN0eWxlIiwid2lkdGgiLCJmaWx0ZXJPcHRpb25zIiwiaGFzTWFueSIsImxhYmVsIiwicGF0aCIsInJlbGF0aW9uVG8iLCJyZXF1aXJlZCIsInZhbGlkYXRlIiwicmVsYXRpb25zaGlwIiwiRXJyb3JDb21wIiwiRGVmYXVsdEVycm9yIiwiTGFiZWxDb21wIiwiRGVmYXVsdExhYmVsIiwiY29uZmlnIiwidXNlQ29uZmlnIiwiY29sbGVjdGlvbnMiLCJyb3V0ZXMiLCJhcGkiLCJzZXJ2ZXJVUkwiLCJoYXNNdWx0aXBsZVJlbGF0aW9ucyIsIkFycmF5IiwiaXNBcnJheSIsImluaXRpYWxMb2FkZWRQYWdlU3RhdGUiLCJyZWR1Y2UiLCJhY2MiLCJyZWxhdGlvbiIsImkxOG4iLCJ0IiwidXNlVHJhbnNsYXRpb24iLCJwZXJtaXNzaW9ucyIsInVzZUF1dGgiLCJjb2RlIiwibG9jYWxlIiwidXNlTG9jYWxlIiwiZm9ybVByb2Nlc3NpbmciLCJ1c2VGb3JtUHJvY2Vzc2luZyIsIm9wdGlvbnMiLCJkaXNwYXRjaE9wdGlvbnMiLCJ1c2VSZWR1Y2VyIiwib3B0aW9uc1JlZHVjZXIiLCJsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbiIsInNldExhc3RGdWxseUxvYWRlZFJlbGF0aW9uIiwidXNlU3RhdGUiLCJsYXN0TG9hZGVkUGFnZSIsInNldExhc3RMb2FkZWRQYWdlIiwiZXJyb3JMb2FkaW5nIiwic2V0RXJyb3JMb2FkaW5nIiwiZmlsdGVyT3B0aW9uc1Jlc3VsdCIsInNldEZpbHRlck9wdGlvbnNSZXN1bHQiLCJzZWFyY2giLCJzZXRTZWFyY2giLCJpc0xvYWRpbmciLCJzZXRJc0xvYWRpbmciLCJoYXNMb2FkZWRGaXJzdFBhZ2UiLCJzZXRIYXNMb2FkZWRGaXJzdFBhZ2UiLCJlbmFibGVXb3JkQm91bmRhcnlTZWFyY2giLCJzZXRFbmFibGVXb3JkQm91bmRhcnlTZWFyY2giLCJmaXJzdFJ1biIsInVzZVJlZiIsInBhdGhPck5hbWUiLCJtZW1vaXplZFZhbGlkYXRlIiwidXNlQ2FsbGJhY2siLCJ2YWx1ZSIsInZhbGlkYXRpb25PcHRpb25zIiwiZXJyb3JNZXNzYWdlIiwiaW5pdGlhbFZhbHVlIiwic2V0VmFsdWUiLCJzaG93RXJyb3IiLCJ1c2VGaWVsZCIsImRyYXdlcklzT3BlbiIsInNldERyYXdlcklzT3BlbiIsImdldFJlc3VsdHMiLCJsYXN0RnVsbHlMb2FkZWRSZWxhdGlvbkFyZyIsIm9uU3VjY2VzcyIsInNlYXJjaEFyZyIsInNvcnQiLCJ2YWx1ZUFyZyIsImxhc3RGdWxseUxvYWRlZFJlbGF0aW9uVG9Vc2UiLCJyZWxhdGlvbnMiLCJyZWxhdGlvbnNUb0ZldGNoIiwic2xpY2UiLCJyZXN1bHRzRmV0Y2hlZCIsInJlbGF0aW9uTWFwIiwiY3JlYXRlUmVsYXRpb25NYXAiLCJwcmlvclJlbGF0aW9uIiwicmVsYXRpb25GaWx0ZXJPcHRpb24iLCJsYXN0TG9hZGVkUGFnZVRvVXNlIiwiaW5kZXhPZiIsIlByb21pc2UiLCJyZXNvbHZlIiwiY29sbGVjdGlvbiIsImZpbmQiLCJjb2xsIiwic2x1ZyIsImZpZWxkVG9TZWFyY2giLCJ1c2VBc1RpdGxlIiwiZmllbGRUb1NvcnQiLCJkZWZhdWx0U29ydCIsInF1ZXJ5IiwiZGVwdGgiLCJkcmFmdCIsImxpbWl0IiwicGFnZSIsIndoZXJlIiwiYW5kIiwiaWQiLCJub3RfaW4iLCJwdXNoIiwibGlrZSIsInJlc3BvbnNlIiwiZmV0Y2giLCJxcyIsInN0cmluZ2lmeSIsInN0cmljdE51bGxIYW5kbGluZyIsImNyZWRlbnRpYWxzIiwiaGVhZGVycyIsImxhbmd1YWdlIiwib2siLCJkYXRhIiwianNvbiIsInByZXZTdGF0ZSIsIm5leHRQYWdlIiwiZG9jcyIsImxlbmd0aCIsInR5cGUiLCJzdGF0dXMiLCJpZHMiLCJ1cGRhdGVTZWFyY2giLCJ1c2VEZWJvdW5jZWRDYWxsYmFjayIsImhhbmRsZUlucHV0Q2hhbmdlIiwidXNlRWZmZWN0IiwiT2JqZWN0IiwiZW50cmllcyIsImlkc1RvTG9hZCIsImZpbHRlciIsIm9wdGlvbkdyb3VwIiwib3B0aW9uIiwiaW4iLCJpc0lkT25seSIsImlkT25seSIsImN1cnJlbnQiLCJvblNhdmUiLCJhcmdzIiwiY29sbGVjdGlvbkNvbmZpZyIsImRvYyIsImZpbHRlck9wdGlvbiIsIml0ZW0iLCJzZWFyY2hGaWx0ZXIiLCJyIiwid29yZEJvdW5kYXJpZXNSZWdleCIsImJyZWFrQXBhcnRUaHJlc2hvbGQiLCJzdHJpbmciLCJpbmRleE9mU3BhY2UiLCJ0ZXN0IiwidmFsdWVUb1JlbmRlciIsImZpbmRPcHRpb25zQnlWYWx1ZSIsImRpdiIsImZpZWxkQmFzZUNsYXNzIiwiQm9vbGVhbiIsImpvaW4iLCJyZXBsYWNlIiwibWVzc2FnZSIsImh0bWxGb3IiLCJHZXRGaWx0ZXJPcHRpb25zIiwiUmVhY3RTZWxlY3QiLCJiYWNrc3BhY2VSZW1vdmVzVmFsdWUiLCJNdWx0aVZhbHVlTGFiZWwiLCJTaW5nbGVWYWx1ZSIsImN1c3RvbVByb3BzIiwiZGlzYWJsZUtleURvd24iLCJkaXNhYmxlTW91c2VEb3duIiwiZGlzYWJsZWQiLCJ1bmRlZmluZWQiLCJpc011bHRpIiwib25DaGFuZ2UiLCJzZWxlY3RlZCIsIm1hcCIsIm9uSW5wdXRDaGFuZ2UiLCJuZXdTZWFyY2giLCJvbk1lbnVPcGVuIiwib25NZW51U2Nyb2xsVG9Cb3R0b20iLCJBZGROZXdSZWxhdGlvbiIsIkZpZWxkRGVzY3JpcHRpb24iLCJ3aXRoQ29uZGl0aW9uIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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