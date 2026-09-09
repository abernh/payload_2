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
const _reactrouterdom = require("react-router-dom");
const _reacttoastify = require("react-toastify");
const _useDebounce = /*#__PURE__*/ _interop_require_default(require("../../../hooks/useDebounce"));
const _formatDate = require("../../../utilities/formatDate");
const _context = require("../../forms/Form/context");
const _reduceFieldsToValues = /*#__PURE__*/ _interop_require_default(require("../../forms/Form/reduceFieldsToValues"));
const _reduceFieldsToValuesWithValidation = require("../../forms/Form/reduceFieldsToValuesWithValidation");
const _Config = require("../../utilities/Config");
const _DocumentInfo = require("../../utilities/DocumentInfo");
const _EditDepth = require("../../utilities/EditDepth");
const _Locale = require("../../utilities/Locale");
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
const baseClass = 'autosave';
const Autosave = ({ id, collection, global, onSave, publishedDocUpdatedAt })=>{
    const { routes: { admin, api }, serverURL } = (0, _Config.useConfig)();
    const { getVersions, versions } = (0, _DocumentInfo.useDocumentInfo)();
    const [fields] = (0, _context.useAllFormFields)();
    const modified = (0, _context.useFormModified)();
    const { code: locale } = (0, _Locale.useLocale)();
    const submitted = (0, _context.useFormSubmitted)();
    const { dispatchFields, setSubmitted } = (0, _context.useForm)();
    const history = (0, _reactrouterdom.useHistory)();
    const { i18n, t } = (0, _reacti18next.useTranslation)('version');
    const depth = (0, _EditDepth.useEditDepth)();
    let interval = 800;
    const validateDrafts = collection?.versions.drafts && collection.versions?.drafts?.validate || global?.versions.drafts && global.versions?.drafts?.validate;
    if (collection?.versions.drafts && collection.versions?.drafts?.autosave) interval = collection.versions.drafts.autosave.interval;
    if (global?.versions.drafts && global.versions?.drafts?.autosave) interval = global.versions.drafts.autosave.interval;
    const [saving, setSaving] = (0, _react.useState)(false);
    const [lastSaved, setLastSaved] = (0, _react.useState)();
    const debouncedFields = (0, _useDebounce.default)(fields, interval);
    const fieldRef = (0, _react.useRef)(fields);
    const modifiedRef = (0, _react.useRef)(modified);
    const localeRef = (0, _react.useRef)(locale);
    // Store fields in ref so the autosave func
    // can always retrieve the most to date copies
    // after the timeout has executed
    fieldRef.current = fields;
    // Store modified in ref so the autosave func
    // can bail out if modified becomes false while
    // timing out during autosave
    modifiedRef.current = modified;
    const createCollectionDoc = (0, _react.useCallback)(async ()=>{
        const res = await fetch(`${serverURL}${api}/${collection.slug}?locale=${locale}&fallback-locale=null&depth=0&draft=true&autosave=true`, {
            body: JSON.stringify({}),
            credentials: 'include',
            headers: {
                'Accept-Language': i18n.language,
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
        if (res.status === 201) {
            const json = await res.json();
            if (depth === 1) {
                history.replace(`${admin}/collections/${collection.slug}/${json.doc.id}`, {
                    state: {
                        data: json.doc
                    }
                });
            } else {
                onSave(json);
            }
        } else {
            _reacttoastify.toast.error(t('error:autosaving'));
        }
    }, [
        serverURL,
        api,
        collection?.slug,
        locale,
        i18n.language,
        history,
        admin,
        t,
        depth,
        onSave
    ]);
    (0, _react.useEffect)(()=>{
        // If no ID, but this is used for a collection doc,
        // Immediately save it and set lastSaved
        if (!id && collection) {
            void createCollectionDoc();
        }
    }, [
        id,
        collection,
        createCollectionDoc
    ]);
    // When debounced fields change, autosave
    (0, _react.useEffect)(()=>{
        const abortController = new AbortController();
        let autosaveTimeout = undefined;
        const autosave = async ()=>{
            if (modified) {
                setSaving(true);
                let url;
                let method;
                if (collection && id) {
                    url = `${serverURL}${api}/${collection.slug}/${id}?draft=true&autosave=true&locale=${localeRef.current}`;
                    method = 'PATCH';
                }
                if (global) {
                    url = `${serverURL}${api}/globals/${global.slug}?draft=true&autosave=true&locale=${localeRef.current}`;
                    method = 'POST';
                }
                if (url) {
                    autosaveTimeout = setTimeout(async ()=>{
                        if (modifiedRef.current) {
                            const { data, valid } = {
                                ...(0, _reduceFieldsToValuesWithValidation.reduceFieldsToValuesWithValidation)(fieldRef.current, true)
                            };
                            data._status = 'draft';
                            const skipSubmission = submitted && !valid && validateDrafts;
                            if (!skipSubmission) {
                                const res = await fetch(url, {
                                    body: JSON.stringify(data),
                                    credentials: 'include',
                                    headers: {
                                        'Accept-Language': i18n.language,
                                        'Content-Type': 'application/json'
                                    },
                                    method,
                                    signal: abortController.signal
                                });
                                if (res.status === 200) {
                                    const newDate = new Date();
                                    setLastSaved(newDate.getTime());
                                    void getVersions();
                                }
                                if (validateDrafts && res.status === 400) {
                                    const json = await res.json();
                                    if (Array.isArray(json.errors)) {
                                        const [fieldErrors, nonFieldErrors] = json.errors.reduce(([fieldErrs, nonFieldErrs], err)=>{
                                            const newFieldErrs = [];
                                            const newNonFieldErrs = [];
                                            if (err?.message) {
                                                newNonFieldErrs.push(err);
                                            }
                                            if (Array.isArray(err?.data)) {
                                                err.data.forEach((dataError)=>{
                                                    if (dataError?.field) {
                                                        newFieldErrs.push(dataError);
                                                    } else {
                                                        newNonFieldErrs.push(dataError);
                                                    }
                                                });
                                            }
                                            return [
                                                [
                                                    ...fieldErrs,
                                                    ...newFieldErrs
                                                ],
                                                [
                                                    ...nonFieldErrs,
                                                    ...newNonFieldErrs
                                                ]
                                            ];
                                        }, [
                                            [],
                                            []
                                        ]);
                                        fieldErrors.forEach((err)=>{
                                            dispatchFields({
                                                type: 'UPDATE',
                                                errorMessage: err.message,
                                                path: err.field,
                                                valid: false
                                            });
                                        });
                                        nonFieldErrors.forEach((err)=>{
                                            _reacttoastify.toast.error(err.message || i18n.t('error:unknown'));
                                        });
                                        setSubmitted(true);
                                        setSaving(false);
                                        return;
                                    }
                                }
                            }
                            const body = {
                                ...(0, _reduceFieldsToValues.default)(fieldRef.current, true),
                                _status: 'draft'
                            };
                            const res = await fetch(url, {
                                body: JSON.stringify(body),
                                credentials: 'include',
                                headers: {
                                    'Accept-Language': i18n.language,
                                    'Content-Type': 'application/json'
                                },
                                method
                            });
                            if (res.status === 200) {
                                setLastSaved(new Date().getTime());
                                void getVersions();
                            }
                        }
                        setSaving(false);
                    }, 1000);
                }
            }
        };
        void autosave();
        return ()=>{
            clearTimeout(autosaveTimeout);
            if (abortController.signal) abortController.abort();
            setSaving(false);
        };
    }, [
        i18n,
        debouncedFields,
        modified,
        serverURL,
        api,
        collection,
        global,
        id,
        getVersions,
        localeRef,
        modifiedRef,
        submitted,
        validateDrafts,
        setSubmitted,
        dispatchFields
    ]);
    (0, _react.useEffect)(()=>{
        if (versions?.docs?.[0]) {
            setLastSaved(new Date(versions.docs[0].updatedAt).getTime());
        } else if (publishedDocUpdatedAt) {
            setLastSaved(new Date(publishedDocUpdatedAt).getTime());
        }
    }, [
        publishedDocUpdatedAt,
        versions
    ]);
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: baseClass
    }, saving && t('saving'), !saving && lastSaved && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, t('lastSavedAgo', {
        distance: (0, _formatDate.formatTimeToNow)(lastSaved, i18n.language)
    })));
};
const _default = Autosave;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL0F1dG9zYXZlL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlSGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nXG5pbXBvcnQgeyB0b2FzdCB9IGZyb20gJ3JlYWN0LXRvYXN0aWZ5J1xuXG5pbXBvcnQgdHlwZSB7IFByb3BzIH0gZnJvbSAnLi90eXBlcydcblxuaW1wb3J0IHVzZURlYm91bmNlIGZyb20gJy4uLy4uLy4uL2hvb2tzL3VzZURlYm91bmNlJ1xuaW1wb3J0IHsgZm9ybWF0VGltZVRvTm93IH0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0aWVzL2Zvcm1hdERhdGUnXG5pbXBvcnQge1xuICB1c2VBbGxGb3JtRmllbGRzLFxuICB1c2VGb3JtLFxuICB1c2VGb3JtTW9kaWZpZWQsXG4gIHVzZUZvcm1TdWJtaXR0ZWQsXG59IGZyb20gJy4uLy4uL2Zvcm1zL0Zvcm0vY29udGV4dCdcbmltcG9ydCByZWR1Y2VGaWVsZHNUb1ZhbHVlcyBmcm9tICcuLi8uLi9mb3Jtcy9Gb3JtL3JlZHVjZUZpZWxkc1RvVmFsdWVzJ1xuaW1wb3J0IHsgcmVkdWNlRmllbGRzVG9WYWx1ZXNXaXRoVmFsaWRhdGlvbiB9IGZyb20gJy4uLy4uL2Zvcm1zL0Zvcm0vcmVkdWNlRmllbGRzVG9WYWx1ZXNXaXRoVmFsaWRhdGlvbidcbmltcG9ydCB7IHVzZUNvbmZpZyB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9Db25maWcnXG5pbXBvcnQgeyB1c2VEb2N1bWVudEluZm8gfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvRG9jdW1lbnRJbmZvJ1xuaW1wb3J0IHsgdXNlRWRpdERlcHRoIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL0VkaXREZXB0aCdcbmltcG9ydCB7IHVzZUxvY2FsZSB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9Mb2NhbGUnXG5pbXBvcnQgJy4vaW5kZXguc2NzcydcbmNvbnN0IGJhc2VDbGFzcyA9ICdhdXRvc2F2ZSdcblxuY29uc3QgQXV0b3NhdmU6IFJlYWN0LkZDPFByb3BzPiA9ICh7IGlkLCBjb2xsZWN0aW9uLCBnbG9iYWwsIG9uU2F2ZSwgcHVibGlzaGVkRG9jVXBkYXRlZEF0IH0pID0+IHtcbiAgY29uc3Qge1xuICAgIHJvdXRlczogeyBhZG1pbiwgYXBpIH0sXG4gICAgc2VydmVyVVJMLFxuICB9ID0gdXNlQ29uZmlnKClcbiAgY29uc3QgeyBnZXRWZXJzaW9ucywgdmVyc2lvbnMgfSA9IHVzZURvY3VtZW50SW5mbygpXG4gIGNvbnN0IFtmaWVsZHNdID0gdXNlQWxsRm9ybUZpZWxkcygpXG4gIGNvbnN0IG1vZGlmaWVkID0gdXNlRm9ybU1vZGlmaWVkKClcbiAgY29uc3QgeyBjb2RlOiBsb2NhbGUgfSA9IHVzZUxvY2FsZSgpXG4gIGNvbnN0IHN1Ym1pdHRlZCA9IHVzZUZvcm1TdWJtaXR0ZWQoKVxuICBjb25zdCB7IGRpc3BhdGNoRmllbGRzLCBzZXRTdWJtaXR0ZWQgfSA9IHVzZUZvcm0oKVxuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpXG4gIGNvbnN0IHsgaTE4biwgdCB9ID0gdXNlVHJhbnNsYXRpb24oJ3ZlcnNpb24nKVxuICBjb25zdCBkZXB0aCA9IHVzZUVkaXREZXB0aCgpXG5cbiAgbGV0IGludGVydmFsID0gODAwXG4gIGNvbnN0IHZhbGlkYXRlRHJhZnRzID1cbiAgICAoY29sbGVjdGlvbj8udmVyc2lvbnMuZHJhZnRzICYmIGNvbGxlY3Rpb24udmVyc2lvbnM/LmRyYWZ0cz8udmFsaWRhdGUpIHx8XG4gICAgKGdsb2JhbD8udmVyc2lvbnMuZHJhZnRzICYmIGdsb2JhbC52ZXJzaW9ucz8uZHJhZnRzPy52YWxpZGF0ZSlcbiAgaWYgKGNvbGxlY3Rpb24/LnZlcnNpb25zLmRyYWZ0cyAmJiBjb2xsZWN0aW9uLnZlcnNpb25zPy5kcmFmdHM/LmF1dG9zYXZlKVxuICAgIGludGVydmFsID0gY29sbGVjdGlvbi52ZXJzaW9ucy5kcmFmdHMuYXV0b3NhdmUuaW50ZXJ2YWxcbiAgaWYgKGdsb2JhbD8udmVyc2lvbnMuZHJhZnRzICYmIGdsb2JhbC52ZXJzaW9ucz8uZHJhZnRzPy5hdXRvc2F2ZSlcbiAgICBpbnRlcnZhbCA9IGdsb2JhbC52ZXJzaW9ucy5kcmFmdHMuYXV0b3NhdmUuaW50ZXJ2YWxcblxuICBjb25zdCBbc2F2aW5nLCBzZXRTYXZpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtsYXN0U2F2ZWQsIHNldExhc3RTYXZlZF0gPSB1c2VTdGF0ZTxudW1iZXI+KClcbiAgY29uc3QgZGVib3VuY2VkRmllbGRzID0gdXNlRGVib3VuY2UoZmllbGRzLCBpbnRlcnZhbClcbiAgY29uc3QgZmllbGRSZWYgPSB1c2VSZWYoZmllbGRzKVxuICBjb25zdCBtb2RpZmllZFJlZiA9IHVzZVJlZihtb2RpZmllZClcbiAgY29uc3QgbG9jYWxlUmVmID0gdXNlUmVmKGxvY2FsZSlcblxuICAvLyBTdG9yZSBmaWVsZHMgaW4gcmVmIHNvIHRoZSBhdXRvc2F2ZSBmdW5jXG4gIC8vIGNhbiBhbHdheXMgcmV0cmlldmUgdGhlIG1vc3QgdG8gZGF0ZSBjb3BpZXNcbiAgLy8gYWZ0ZXIgdGhlIHRpbWVvdXQgaGFzIGV4ZWN1dGVkXG4gIGZpZWxkUmVmLmN1cnJlbnQgPSBmaWVsZHNcblxuICAvLyBTdG9yZSBtb2RpZmllZCBpbiByZWYgc28gdGhlIGF1dG9zYXZlIGZ1bmNcbiAgLy8gY2FuIGJhaWwgb3V0IGlmIG1vZGlmaWVkIGJlY29tZXMgZmFsc2Ugd2hpbGVcbiAgLy8gdGltaW5nIG91dCBkdXJpbmcgYXV0b3NhdmVcbiAgbW9kaWZpZWRSZWYuY3VycmVudCA9IG1vZGlmaWVkXG5cbiAgY29uc3QgY3JlYXRlQ29sbGVjdGlvbkRvYyA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChcbiAgICAgIGAke3NlcnZlclVSTH0ke2FwaX0vJHtjb2xsZWN0aW9uLnNsdWd9P2xvY2FsZT0ke2xvY2FsZX0mZmFsbGJhY2stbG9jYWxlPW51bGwmZGVwdGg9MCZkcmFmdD10cnVlJmF1dG9zYXZlPXRydWVgLFxuICAgICAge1xuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7fSksXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQWNjZXB0LUxhbmd1YWdlJzogaTE4bi5sYW5ndWFnZSxcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICB9LFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIH0sXG4gICAgKVxuXG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDIwMSkge1xuICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlcy5qc29uKClcbiAgICAgIGlmIChkZXB0aCA9PT0gMSkge1xuICAgICAgICBoaXN0b3J5LnJlcGxhY2UoYCR7YWRtaW59L2NvbGxlY3Rpb25zLyR7Y29sbGVjdGlvbi5zbHVnfS8ke2pzb24uZG9jLmlkfWAsIHtcbiAgICAgICAgICBzdGF0ZToge1xuICAgICAgICAgICAgZGF0YToganNvbi5kb2MsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uU2F2ZShqc29uKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0b2FzdC5lcnJvcih0KCdlcnJvcjphdXRvc2F2aW5nJykpXG4gICAgfVxuICB9LCBbc2VydmVyVVJMLCBhcGksIGNvbGxlY3Rpb24/LnNsdWcsIGxvY2FsZSwgaTE4bi5sYW5ndWFnZSwgaGlzdG9yeSwgYWRtaW4sIHQsIGRlcHRoLCBvblNhdmVdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gSWYgbm8gSUQsIGJ1dCB0aGlzIGlzIHVzZWQgZm9yIGEgY29sbGVjdGlvbiBkb2MsXG4gICAgLy8gSW1tZWRpYXRlbHkgc2F2ZSBpdCBhbmQgc2V0IGxhc3RTYXZlZFxuICAgIGlmICghaWQgJiYgY29sbGVjdGlvbikge1xuICAgICAgdm9pZCBjcmVhdGVDb2xsZWN0aW9uRG9jKClcbiAgICB9XG4gIH0sIFtpZCwgY29sbGVjdGlvbiwgY3JlYXRlQ29sbGVjdGlvbkRvY10pXG5cbiAgLy8gV2hlbiBkZWJvdW5jZWQgZmllbGRzIGNoYW5nZSwgYXV0b3NhdmVcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKVxuICAgIGxldCBhdXRvc2F2ZVRpbWVvdXQgPSB1bmRlZmluZWRcblxuICAgIGNvbnN0IGF1dG9zYXZlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKG1vZGlmaWVkKSB7XG4gICAgICAgIHNldFNhdmluZyh0cnVlKVxuXG4gICAgICAgIGxldCB1cmw6IHN0cmluZ1xuICAgICAgICBsZXQgbWV0aG9kOiBzdHJpbmdcblxuICAgICAgICBpZiAoY29sbGVjdGlvbiAmJiBpZCkge1xuICAgICAgICAgIHVybCA9IGAke3NlcnZlclVSTH0ke2FwaX0vJHtjb2xsZWN0aW9uLnNsdWd9LyR7aWR9P2RyYWZ0PXRydWUmYXV0b3NhdmU9dHJ1ZSZsb2NhbGU9JHtsb2NhbGVSZWYuY3VycmVudH1gXG4gICAgICAgICAgbWV0aG9kID0gJ1BBVENIJ1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdsb2JhbCkge1xuICAgICAgICAgIHVybCA9IGAke3NlcnZlclVSTH0ke2FwaX0vZ2xvYmFscy8ke2dsb2JhbC5zbHVnfT9kcmFmdD10cnVlJmF1dG9zYXZlPXRydWUmbG9jYWxlPSR7bG9jYWxlUmVmLmN1cnJlbnR9YFxuICAgICAgICAgIG1ldGhvZCA9ICdQT1NUJ1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIGF1dG9zYXZlVGltZW91dCA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1vZGlmaWVkUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgY29uc3QgeyBkYXRhLCB2YWxpZCB9ID0ge1xuICAgICAgICAgICAgICAgIC4uLnJlZHVjZUZpZWxkc1RvVmFsdWVzV2l0aFZhbGlkYXRpb24oZmllbGRSZWYuY3VycmVudCwgdHJ1ZSksXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZGF0YS5fc3RhdHVzID0gJ2RyYWZ0J1xuICAgICAgICAgICAgICBjb25zdCBza2lwU3VibWlzc2lvbiA9IHN1Ym1pdHRlZCAmJiAhdmFsaWQgJiYgdmFsaWRhdGVEcmFmdHNcblxuICAgICAgICAgICAgICBpZiAoIXNraXBTdWJtaXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdBY2NlcHQtTGFuZ3VhZ2UnOiBpMThuLmxhbmd1YWdlLFxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgIHNpZ25hbDogYWJvcnRDb250cm9sbGVyLnNpZ25hbCxcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKClcbiAgICAgICAgICAgICAgICAgIHNldExhc3RTYXZlZChuZXdEYXRlLmdldFRpbWUoKSlcbiAgICAgICAgICAgICAgICAgIHZvaWQgZ2V0VmVyc2lvbnMoKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0ZURyYWZ0cyAmJiByZXMuc3RhdHVzID09PSA0MDApIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXMuanNvbigpXG4gICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShqc29uLmVycm9ycykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2ZpZWxkRXJyb3JzLCBub25GaWVsZEVycm9yc10gPSBqc29uLmVycm9ycy5yZWR1Y2UoXG4gICAgICAgICAgICAgICAgICAgICAgKFtmaWVsZEVycnMsIG5vbkZpZWxkRXJyc10sIGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3RmllbGRFcnJzID0gW11cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld05vbkZpZWxkRXJycyA9IFtdXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnI/Lm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Tm9uRmllbGRFcnJzLnB1c2goZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlcnI/LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVyci5kYXRhLmZvckVhY2goKGRhdGFFcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhRXJyb3I/LmZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWVsZEVycnMucHVzaChkYXRhRXJyb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld05vbkZpZWxkRXJycy5wdXNoKGRhdGFFcnJvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFsuLi5maWVsZEVycnMsIC4uLm5ld0ZpZWxkRXJyc10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFsuLi5ub25GaWVsZEVycnMsIC4uLm5ld05vbkZpZWxkRXJyc10sXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBbW10sIFtdXSxcbiAgICAgICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkRXJyb3JzLmZvckVhY2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoRmllbGRzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdVUERBVEUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGVyci5maWVsZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIG5vbkZpZWxkRXJyb3JzLmZvckVhY2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHRvYXN0LmVycm9yKGVyci5tZXNzYWdlIHx8IGkxOG4udCgnZXJyb3I6dW5rbm93bicpKVxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIHNldFN1Ym1pdHRlZCh0cnVlKVxuICAgICAgICAgICAgICAgICAgICBzZXRTYXZpbmcoZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB7XG4gICAgICAgICAgICAgICAgLi4ucmVkdWNlRmllbGRzVG9WYWx1ZXMoZmllbGRSZWYuY3VycmVudCwgdHJ1ZSksXG4gICAgICAgICAgICAgICAgX3N0YXR1czogJ2RyYWZ0JyxcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgJ0FjY2VwdC1MYW5ndWFnZSc6IGkxOG4ubGFuZ3VhZ2UsXG4gICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICBzZXRMYXN0U2F2ZWQobmV3IERhdGUoKS5nZXRUaW1lKCkpXG4gICAgICAgICAgICAgICAgdm9pZCBnZXRWZXJzaW9ucygpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0U2F2aW5nKGZhbHNlKVxuICAgICAgICAgIH0sIDEwMDApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2b2lkIGF1dG9zYXZlKClcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQoYXV0b3NhdmVUaW1lb3V0KVxuICAgICAgaWYgKGFib3J0Q29udHJvbGxlci5zaWduYWwpIGFib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgICBzZXRTYXZpbmcoZmFsc2UpXG4gICAgfVxuICB9LCBbXG4gICAgaTE4bixcbiAgICBkZWJvdW5jZWRGaWVsZHMsXG4gICAgbW9kaWZpZWQsXG4gICAgc2VydmVyVVJMLFxuICAgIGFwaSxcbiAgICBjb2xsZWN0aW9uLFxuICAgIGdsb2JhbCxcbiAgICBpZCxcbiAgICBnZXRWZXJzaW9ucyxcbiAgICBsb2NhbGVSZWYsXG4gICAgbW9kaWZpZWRSZWYsXG4gICAgc3VibWl0dGVkLFxuICAgIHZhbGlkYXRlRHJhZnRzLFxuICAgIHNldFN1Ym1pdHRlZCxcbiAgICBkaXNwYXRjaEZpZWxkcyxcbiAgXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICh2ZXJzaW9ucz8uZG9jcz8uWzBdKSB7XG4gICAgICBzZXRMYXN0U2F2ZWQobmV3IERhdGUodmVyc2lvbnMuZG9jc1swXS51cGRhdGVkQXQpLmdldFRpbWUoKSlcbiAgICB9IGVsc2UgaWYgKHB1Ymxpc2hlZERvY1VwZGF0ZWRBdCkge1xuICAgICAgc2V0TGFzdFNhdmVkKG5ldyBEYXRlKHB1Ymxpc2hlZERvY1VwZGF0ZWRBdCkuZ2V0VGltZSgpKVxuICAgIH1cbiAgfSwgW3B1Ymxpc2hlZERvY1VwZGF0ZWRBdCwgdmVyc2lvbnNdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2Jhc2VDbGFzc30+XG4gICAgICB7c2F2aW5nICYmIHQoJ3NhdmluZycpfVxuICAgICAgeyFzYXZpbmcgJiYgbGFzdFNhdmVkICYmIChcbiAgICAgICAgPFJlYWN0LkZyYWdtZW50PlxuICAgICAgICAgIHt0KCdsYXN0U2F2ZWRBZ28nLCB7XG4gICAgICAgICAgICBkaXN0YW5jZTogZm9ybWF0VGltZVRvTm93KGxhc3RTYXZlZCwgaTE4bi5sYW5ndWFnZSksXG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1dG9zYXZlXG4iXSwibmFtZXMiOlsiYmFzZUNsYXNzIiwiQXV0b3NhdmUiLCJpZCIsImNvbGxlY3Rpb24iLCJnbG9iYWwiLCJvblNhdmUiLCJwdWJsaXNoZWREb2NVcGRhdGVkQXQiLCJyb3V0ZXMiLCJhZG1pbiIsImFwaSIsInNlcnZlclVSTCIsInVzZUNvbmZpZyIsImdldFZlcnNpb25zIiwidmVyc2lvbnMiLCJ1c2VEb2N1bWVudEluZm8iLCJmaWVsZHMiLCJ1c2VBbGxGb3JtRmllbGRzIiwibW9kaWZpZWQiLCJ1c2VGb3JtTW9kaWZpZWQiLCJjb2RlIiwibG9jYWxlIiwidXNlTG9jYWxlIiwic3VibWl0dGVkIiwidXNlRm9ybVN1Ym1pdHRlZCIsImRpc3BhdGNoRmllbGRzIiwic2V0U3VibWl0dGVkIiwidXNlRm9ybSIsImhpc3RvcnkiLCJ1c2VIaXN0b3J5IiwiaTE4biIsInQiLCJ1c2VUcmFuc2xhdGlvbiIsImRlcHRoIiwidXNlRWRpdERlcHRoIiwiaW50ZXJ2YWwiLCJ2YWxpZGF0ZURyYWZ0cyIsImRyYWZ0cyIsInZhbGlkYXRlIiwiYXV0b3NhdmUiLCJzYXZpbmciLCJzZXRTYXZpbmciLCJ1c2VTdGF0ZSIsImxhc3RTYXZlZCIsInNldExhc3RTYXZlZCIsImRlYm91bmNlZEZpZWxkcyIsInVzZURlYm91bmNlIiwiZmllbGRSZWYiLCJ1c2VSZWYiLCJtb2RpZmllZFJlZiIsImxvY2FsZVJlZiIsImN1cnJlbnQiLCJjcmVhdGVDb2xsZWN0aW9uRG9jIiwidXNlQ2FsbGJhY2siLCJyZXMiLCJmZXRjaCIsInNsdWciLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImNyZWRlbnRpYWxzIiwiaGVhZGVycyIsImxhbmd1YWdlIiwibWV0aG9kIiwic3RhdHVzIiwianNvbiIsInJlcGxhY2UiLCJkb2MiLCJzdGF0ZSIsImRhdGEiLCJ0b2FzdCIsImVycm9yIiwidXNlRWZmZWN0IiwiYWJvcnRDb250cm9sbGVyIiwiQWJvcnRDb250cm9sbGVyIiwiYXV0b3NhdmVUaW1lb3V0IiwidW5kZWZpbmVkIiwidXJsIiwic2V0VGltZW91dCIsInZhbGlkIiwicmVkdWNlRmllbGRzVG9WYWx1ZXNXaXRoVmFsaWRhdGlvbiIsIl9zdGF0dXMiLCJza2lwU3VibWlzc2lvbiIsInNpZ25hbCIsIm5ld0RhdGUiLCJEYXRlIiwiZ2V0VGltZSIsIkFycmF5IiwiaXNBcnJheSIsImVycm9ycyIsImZpZWxkRXJyb3JzIiwibm9uRmllbGRFcnJvcnMiLCJyZWR1Y2UiLCJmaWVsZEVycnMiLCJub25GaWVsZEVycnMiLCJlcnIiLCJuZXdGaWVsZEVycnMiLCJuZXdOb25GaWVsZEVycnMiLCJtZXNzYWdlIiwicHVzaCIsImZvckVhY2giLCJkYXRhRXJyb3IiLCJmaWVsZCIsInR5cGUiLCJlcnJvck1lc3NhZ2UiLCJwYXRoIiwicmVkdWNlRmllbGRzVG9WYWx1ZXMiLCJjbGVhclRpbWVvdXQiLCJhYm9ydCIsImRvY3MiLCJ1cGRhdGVkQXQiLCJkaXYiLCJjbGFzc05hbWUiLCJSZWFjdCIsIkZyYWdtZW50IiwiZGlzdGFuY2UiLCJmb3JtYXRUaW1lVG9Ob3ciXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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