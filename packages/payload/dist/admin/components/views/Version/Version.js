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
const _types = require("../../../../fields/config/types");
const _getTranslation = require("../../../../utilities/getTranslation");
const _usePayloadAPI = /*#__PURE__*/ _interop_require_default(require("../../../hooks/usePayloadAPI"));
const _formatDate = require("../../../utilities/formatDate");
const _Gutter = require("../../elements/Gutter");
const _StepNav = require("../../elements/StepNav");
const _ActionsProvider = require("../../utilities/ActionsProvider");
const _Auth = require("../../utilities/Auth");
const _Config = require("../../utilities/Config");
const _DocumentInfo = require("../../utilities/DocumentInfo");
const _Locale = require("../../utilities/Locale");
const _Meta = /*#__PURE__*/ _interop_require_default(require("../../utilities/Meta"));
const _NotFound = /*#__PURE__*/ _interop_require_default(require("../NotFound"));
const _Compare = /*#__PURE__*/ _interop_require_default(require("./Compare"));
const _RenderFieldsToDiff = /*#__PURE__*/ _interop_require_default(require("./RenderFieldsToDiff"));
const _fields = /*#__PURE__*/ _interop_require_default(require("./RenderFieldsToDiff/fields"));
const _Restore = /*#__PURE__*/ _interop_require_default(require("./Restore"));
const _SelectLocales = /*#__PURE__*/ _interop_require_default(require("./SelectLocales"));
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
const baseClass = 'view-version';
const VersionView = ({ collection, global })=>{
    const { admin: { dateFormat }, localization, routes: { admin, api }, serverURL } = (0, _Config.useConfig)();
    const { setStepNav } = (0, _StepNav.useStepNav)();
    const { setViewActions } = (0, _ActionsProvider.useActions)();
    const { params: { id, versionID } } = (0, _reactrouterdom.useRouteMatch)();
    const [compareValue, setCompareValue] = (0, _react.useState)();
    const [localeOptions] = (0, _react.useState)(()=>{
        if (localization && localization?.locales) {
            return localization.locales.map(({ code, label })=>({
                    label,
                    value: code
                }));
        }
        return [];
    });
    const [locales, setLocales] = (0, _react.useState)(localeOptions);
    const { permissions } = (0, _Auth.useAuth)();
    const { code: locale } = (0, _Locale.useLocale)();
    const { i18n, t } = (0, _reacti18next.useTranslation)('version');
    const { docPermissions } = (0, _DocumentInfo.useDocumentInfo)();
    let originalDocFetchURL;
    let versionFetchURL;
    let entityLabel;
    let fields;
    let fieldPermissions;
    let compareBaseURL;
    let slug;
    let parentID;
    const [latestDraftVersion, setLatestDraftVersion] = (0, _react.useState)(undefined);
    const [latestPublishedVersion, setLatestPublishedVersion] = (0, _react.useState)(undefined);
    if (collection) {
        ({ slug } = collection);
        originalDocFetchURL = `${serverURL}${api}/${slug}/${id}`;
        versionFetchURL = `${serverURL}${api}/${slug}/versions/${versionID}`;
        compareBaseURL = `${serverURL}${api}/${slug}/versions`;
        entityLabel = (0, _getTranslation.getTranslation)(collection.labels.singular, i18n);
        parentID = id;
        fields = collection.fields;
        fieldPermissions = permissions.collections[collection.slug].fields;
    }
    if (global) {
        ({ slug } = global);
        originalDocFetchURL = `${serverURL}${api}/globals/${slug}`;
        versionFetchURL = `${serverURL}${api}/globals/${slug}/versions/${versionID}`;
        compareBaseURL = `${serverURL}${api}/globals/${slug}/versions`;
        entityLabel = (0, _getTranslation.getTranslation)(global.label, i18n);
        fields = global.fields;
        fieldPermissions = permissions.globals[global.slug].fields;
    }
    const compareFetchURL = compareValue?.value && `${compareBaseURL}/${compareValue.value}`;
    const [{ data: doc, isError }] = (0, _usePayloadAPI.default)(versionFetchURL, {
        initialParams: {
            depth: 1,
            locale: '*'
        }
    });
    const [{ data: publishedDoc }] = (0, _usePayloadAPI.default)(originalDocFetchURL, {
        initialParams: {
            depth: 1,
            locale: '*'
        }
    });
    const [{ data: mostRecentDoc }] = (0, _usePayloadAPI.default)(originalDocFetchURL, {
        initialParams: {
            depth: 1,
            draft: true,
            locale: '*'
        }
    });
    const [{ data: compareDoc }] = (0, _usePayloadAPI.default)(compareFetchURL, {
        initialParams: {
            depth: 1,
            draft: 'true',
            locale: '*'
        }
    });
    const hasDraftsEnabled = collection?.versions?.drafts || global?.versions?.drafts;
    const sharedParams = (status)=>{
        return {
            depth: 0,
            limit: 1,
            sort: '-updatedAt',
            where: {
                'version._status': {
                    equals: status
                }
            }
        };
    };
    const [{ data: draft }] = (0, _usePayloadAPI.default)(compareBaseURL, {
        initialParams: hasDraftsEnabled ? {
            ...sharedParams('draft')
        } : {}
    });
    const [{ data: published }] = (0, _usePayloadAPI.default)(compareBaseURL, {
        initialParams: hasDraftsEnabled ? {
            ...sharedParams('published')
        } : {}
    });
    (0, _react.useEffect)(()=>{
        if (hasDraftsEnabled) {
            const formattedPublished = published?.docs?.length > 0 && published?.docs[0];
            const formattedDraft = draft?.docs?.length > 0 && draft?.docs[0];
            if (!formattedPublished || !formattedDraft) return;
            const publishedNewerThanDraft = formattedPublished?.updatedAt > formattedDraft?.updatedAt;
            setLatestDraftVersion(publishedNewerThanDraft ? undefined : formattedDraft?.id);
            setLatestPublishedVersion(formattedPublished.latest ? formattedPublished?.id : undefined);
        }
    }, [
        hasDraftsEnabled,
        draft,
        published
    ]);
    (0, _react.useEffect)(()=>{
        let nav = [];
        if (collection) {
            let docLabel = '';
            if (mostRecentDoc) {
                const { useAsTitle } = collection.admin;
                if (useAsTitle !== 'id') {
                    const titleField = collection.fields.find((field)=>(0, _types.fieldAffectsData)(field) && field.name === useAsTitle);
                    if (titleField && mostRecentDoc[useAsTitle]) {
                        if (titleField.localized) {
                            docLabel = mostRecentDoc[useAsTitle]?.[locale];
                        } else {
                            docLabel = mostRecentDoc[useAsTitle];
                        }
                    } else {
                        docLabel = `[${t('general:untitled')}]`;
                    }
                } else {
                    docLabel = mostRecentDoc.id;
                }
            }
            nav = [
                {
                    label: (0, _getTranslation.getTranslation)(collection.labels.plural, i18n),
                    url: `${admin}/collections/${collection.slug}`
                },
                {
                    label: docLabel,
                    url: `${admin}/collections/${collection.slug}/${id}`
                },
                {
                    label: 'Versions',
                    url: `${admin}/collections/${collection.slug}/${id}/versions`
                },
                {
                    label: doc?.createdAt ? (0, _formatDate.formatDate)(doc.createdAt, dateFormat, i18n?.language) : ''
                }
            ];
        }
        if (global) {
            nav = [
                {
                    label: global.label,
                    url: `${admin}/globals/${global.slug}`
                },
                {
                    label: 'Versions',
                    url: `${admin}/globals/${global.slug}/versions`
                },
                {
                    label: doc?.createdAt ? (0, _formatDate.formatDate)(doc.createdAt, dateFormat, i18n?.language) : ''
                }
            ];
        }
        setStepNav(nav);
    }, [
        setStepNav,
        collection,
        global,
        dateFormat,
        doc,
        mostRecentDoc,
        admin,
        id,
        locale,
        t,
        i18n
    ]);
    (0, _react.useEffect)(()=>{
        const editConfig = (collection || global)?.admin?.components?.views?.Edit;
        const versionActions = editConfig && 'Version' in editConfig && 'actions' in editConfig.Version ? editConfig.Version.actions : [];
        setViewActions(versionActions);
        return ()=>{
            setViewActions([]);
        };
    }, [
        collection,
        global,
        setViewActions
    ]);
    let metaTitle;
    let metaDesc;
    const versionCreatedAt = doc?.updatedAt ? (0, _formatDate.formatDate)(doc.updatedAt, dateFormat, i18n?.language) : '';
    if (collection) {
        const useAsTitle = collection?.admin?.useAsTitle || 'id';
        metaTitle = `${t('version')} - ${versionCreatedAt} - ${doc[useAsTitle]} - ${entityLabel}`;
        metaDesc = t('viewingVersion', {
            documentTitle: doc[useAsTitle],
            entityLabel
        });
    }
    if (global) {
        metaTitle = `${t('version')} - ${versionCreatedAt} - ${entityLabel}`;
        metaDesc = t('viewingVersionGlobal', {
            entityLabel
        });
    }
    let comparison = compareDoc?.version;
    if (compareValue?.value === 'mostRecent') {
        comparison = mostRecentDoc;
    }
    if (compareValue?.value === 'published') {
        comparison = publishedDoc;
    }
    const canUpdate = docPermissions?.update?.permission;
    if (isError) {
        return /*#__PURE__*/ _react.default.createElement(_NotFound.default, {
            marginTop: "large"
        });
    }
    return /*#__PURE__*/ _react.default.createElement("main", {
        className: baseClass
    }, /*#__PURE__*/ _react.default.createElement(_Meta.default, {
        description: metaDesc,
        title: metaTitle
    }), /*#__PURE__*/ _react.default.createElement(_Gutter.Gutter, {
        className: `${baseClass}__wrap`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__header-wrap`
    }, /*#__PURE__*/ _react.default.createElement("p", {
        className: `${baseClass}__created-at`
    }, t('versionCreatedOn', {
        version: t(doc?.autosave ? 'autosavedVersion' : 'version')
    })), /*#__PURE__*/ _react.default.createElement("header", {
        className: `${baseClass}__header`
    }, /*#__PURE__*/ _react.default.createElement("h2", null, versionCreatedAt), canUpdate && /*#__PURE__*/ _react.default.createElement(_Restore.default, {
        className: `${baseClass}__restore`,
        collection: collection,
        global: global,
        originalDocID: id,
        versionDate: versionCreatedAt,
        versionID: versionID
    }))), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__controls`
    }, /*#__PURE__*/ _react.default.createElement(_Compare.default, {
        baseURL: compareBaseURL,
        latestDraftVersion: latestDraftVersion,
        latestPublishedVersion: latestPublishedVersion,
        onChange: setCompareValue,
        parentID: parentID,
        value: compareValue,
        versionID: versionID
    }), localization && /*#__PURE__*/ _react.default.createElement(_SelectLocales.default, {
        onChange: setLocales,
        options: localeOptions,
        value: locales
    })), doc?.version && /*#__PURE__*/ _react.default.createElement(_RenderFieldsToDiff.default, {
        comparison: comparison,
        fieldComponents: _fields.default,
        fieldPermissions: fieldPermissions,
        fields: fields,
        locales: locales ? locales.map(({ value })=>typeof value === 'string' ? value : undefined) : [],
        version: doc?.version
    })));
};
const _default = VersionView;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL1ZlcnNpb24vVmVyc2lvbi50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZVJvdXRlTWF0Y2ggfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJ1xuXG5pbXBvcnQgdHlwZSB7IEZpZWxkUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9hdXRoJ1xuaW1wb3J0IHR5cGUgeyBGaWVsZCwgRmllbGRBZmZlY3RpbmdEYXRhIH0gZnJvbSAnLi4vLi4vLi4vLi4vZmllbGRzL2NvbmZpZy90eXBlcydcbmltcG9ydCB0eXBlIHsgT3B0aW9uIH0gZnJvbSAnLi4vLi4vZWxlbWVudHMvUmVhY3RTZWxlY3QvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFN0ZXBOYXZJdGVtIH0gZnJvbSAnLi4vLi4vZWxlbWVudHMvU3RlcE5hdi90eXBlcydcbmltcG9ydCB0eXBlIHsgQ29tcGFyZU9wdGlvbiwgUHJvcHMgfSBmcm9tICcuL3R5cGVzJ1xuXG5pbXBvcnQgeyBmaWVsZEFmZmVjdHNEYXRhIH0gZnJvbSAnLi4vLi4vLi4vLi4vZmllbGRzL2NvbmZpZy90eXBlcydcbmltcG9ydCB7IGdldFRyYW5zbGF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0aWVzL2dldFRyYW5zbGF0aW9uJ1xuaW1wb3J0IHVzZVBheWxvYWRBUEkgZnJvbSAnLi4vLi4vLi4vaG9va3MvdXNlUGF5bG9hZEFQSSdcbmltcG9ydCB7IGZvcm1hdERhdGUgfSBmcm9tICcuLi8uLi8uLi91dGlsaXRpZXMvZm9ybWF0RGF0ZSdcbmltcG9ydCB7IEd1dHRlciB9IGZyb20gJy4uLy4uL2VsZW1lbnRzL0d1dHRlcidcbmltcG9ydCB7IHVzZVN0ZXBOYXYgfSBmcm9tICcuLi8uLi9lbGVtZW50cy9TdGVwTmF2J1xuaW1wb3J0IHsgdXNlQWN0aW9ucyB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9BY3Rpb25zUHJvdmlkZXInXG5pbXBvcnQgeyB1c2VBdXRoIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL0F1dGgnXG5pbXBvcnQgeyB1c2VDb25maWcgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvQ29uZmlnJ1xuaW1wb3J0IHsgdXNlRG9jdW1lbnRJbmZvIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL0RvY3VtZW50SW5mbydcbmltcG9ydCB7IHVzZUxvY2FsZSB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9Mb2NhbGUnXG5pbXBvcnQgTWV0YSBmcm9tICcuLi8uLi91dGlsaXRpZXMvTWV0YSdcbmltcG9ydCBOb3RGb3VuZCBmcm9tICcuLi9Ob3RGb3VuZCdcbmltcG9ydCBDb21wYXJlVmVyc2lvbiBmcm9tICcuL0NvbXBhcmUnXG5pbXBvcnQgUmVuZGVyRmllbGRzVG9EaWZmIGZyb20gJy4vUmVuZGVyRmllbGRzVG9EaWZmJ1xuaW1wb3J0IGZpZWxkQ29tcG9uZW50cyBmcm9tICcuL1JlbmRlckZpZWxkc1RvRGlmZi9maWVsZHMnXG5pbXBvcnQgUmVzdG9yZSBmcm9tICcuL1Jlc3RvcmUnXG5pbXBvcnQgU2VsZWN0TG9jYWxlcyBmcm9tICcuL1NlbGVjdExvY2FsZXMnXG5pbXBvcnQgJy4vaW5kZXguc2NzcydcblxuY29uc3QgYmFzZUNsYXNzID0gJ3ZpZXctdmVyc2lvbidcblxuY29uc3QgVmVyc2lvblZpZXc6IFJlYWN0LkZDPFByb3BzPiA9ICh7IGNvbGxlY3Rpb24sIGdsb2JhbCB9KSA9PiB7XG4gIGNvbnN0IHtcbiAgICBhZG1pbjogeyBkYXRlRm9ybWF0IH0sXG4gICAgbG9jYWxpemF0aW9uLFxuICAgIHJvdXRlczogeyBhZG1pbiwgYXBpIH0sXG4gICAgc2VydmVyVVJMLFxuICB9ID0gdXNlQ29uZmlnKClcbiAgY29uc3QgeyBzZXRTdGVwTmF2IH0gPSB1c2VTdGVwTmF2KClcblxuICBjb25zdCB7IHNldFZpZXdBY3Rpb25zIH0gPSB1c2VBY3Rpb25zKClcblxuICBjb25zdCB7XG4gICAgcGFyYW1zOiB7IGlkLCB2ZXJzaW9uSUQgfSxcbiAgfSA9IHVzZVJvdXRlTWF0Y2g8eyBpZD86IHN0cmluZzsgdmVyc2lvbklEOiBzdHJpbmcgfT4oKVxuXG4gIGNvbnN0IFtjb21wYXJlVmFsdWUsIHNldENvbXBhcmVWYWx1ZV0gPSB1c2VTdGF0ZTxDb21wYXJlT3B0aW9uPigpXG4gIGNvbnN0IFtsb2NhbGVPcHRpb25zXSA9IHVzZVN0YXRlPE9wdGlvbltdPigoKSA9PiB7XG4gICAgaWYgKGxvY2FsaXphdGlvbiAmJiBsb2NhbGl6YXRpb24/LmxvY2FsZXMpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6YXRpb24ubG9jYWxlcy5tYXAoKHsgY29kZSwgbGFiZWwgfSkgPT4gKHtcbiAgICAgICAgbGFiZWwsXG4gICAgICAgIHZhbHVlOiBjb2RlLFxuICAgICAgfSkpXG4gICAgfVxuICAgIHJldHVybiBbXVxuICB9KVxuICBjb25zdCBbbG9jYWxlcywgc2V0TG9jYWxlc10gPSB1c2VTdGF0ZTxPcHRpb25bXT4obG9jYWxlT3B0aW9ucylcbiAgY29uc3QgeyBwZXJtaXNzaW9ucyB9ID0gdXNlQXV0aCgpXG4gIGNvbnN0IHsgY29kZTogbG9jYWxlIH0gPSB1c2VMb2NhbGUoKVxuICBjb25zdCB7IGkxOG4sIHQgfSA9IHVzZVRyYW5zbGF0aW9uKCd2ZXJzaW9uJylcbiAgY29uc3QgeyBkb2NQZXJtaXNzaW9ucyB9ID0gdXNlRG9jdW1lbnRJbmZvKClcblxuICBsZXQgb3JpZ2luYWxEb2NGZXRjaFVSTDogc3RyaW5nXG4gIGxldCB2ZXJzaW9uRmV0Y2hVUkw6IHN0cmluZ1xuICBsZXQgZW50aXR5TGFiZWw6IHN0cmluZ1xuICBsZXQgZmllbGRzOiBGaWVsZFtdXG4gIGxldCBmaWVsZFBlcm1pc3Npb25zOiBSZWNvcmQ8c3RyaW5nLCBGaWVsZFBlcm1pc3Npb25zPlxuICBsZXQgY29tcGFyZUJhc2VVUkw6IHN0cmluZ1xuICBsZXQgc2x1Zzogc3RyaW5nXG4gIGxldCBwYXJlbnRJRDogc3RyaW5nXG4gIGNvbnN0IFtsYXRlc3REcmFmdFZlcnNpb24sIHNldExhdGVzdERyYWZ0VmVyc2lvbl0gPSB1c2VTdGF0ZSh1bmRlZmluZWQpXG4gIGNvbnN0IFtsYXRlc3RQdWJsaXNoZWRWZXJzaW9uLCBzZXRMYXRlc3RQdWJsaXNoZWRWZXJzaW9uXSA9IHVzZVN0YXRlKHVuZGVmaW5lZClcblxuICBpZiAoY29sbGVjdGlvbikge1xuICAgIDsoeyBzbHVnIH0gPSBjb2xsZWN0aW9uKVxuICAgIG9yaWdpbmFsRG9jRmV0Y2hVUkwgPSBgJHtzZXJ2ZXJVUkx9JHthcGl9LyR7c2x1Z30vJHtpZH1gXG4gICAgdmVyc2lvbkZldGNoVVJMID0gYCR7c2VydmVyVVJMfSR7YXBpfS8ke3NsdWd9L3ZlcnNpb25zLyR7dmVyc2lvbklEfWBcbiAgICBjb21wYXJlQmFzZVVSTCA9IGAke3NlcnZlclVSTH0ke2FwaX0vJHtzbHVnfS92ZXJzaW9uc2BcbiAgICBlbnRpdHlMYWJlbCA9IGdldFRyYW5zbGF0aW9uKGNvbGxlY3Rpb24ubGFiZWxzLnNpbmd1bGFyLCBpMThuKVxuICAgIHBhcmVudElEID0gaWRcbiAgICBmaWVsZHMgPSBjb2xsZWN0aW9uLmZpZWxkc1xuICAgIGZpZWxkUGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uLnNsdWddLmZpZWxkc1xuICB9XG5cbiAgaWYgKGdsb2JhbCkge1xuICAgIDsoeyBzbHVnIH0gPSBnbG9iYWwpXG4gICAgb3JpZ2luYWxEb2NGZXRjaFVSTCA9IGAke3NlcnZlclVSTH0ke2FwaX0vZ2xvYmFscy8ke3NsdWd9YFxuICAgIHZlcnNpb25GZXRjaFVSTCA9IGAke3NlcnZlclVSTH0ke2FwaX0vZ2xvYmFscy8ke3NsdWd9L3ZlcnNpb25zLyR7dmVyc2lvbklEfWBcbiAgICBjb21wYXJlQmFzZVVSTCA9IGAke3NlcnZlclVSTH0ke2FwaX0vZ2xvYmFscy8ke3NsdWd9L3ZlcnNpb25zYFxuICAgIGVudGl0eUxhYmVsID0gZ2V0VHJhbnNsYXRpb24oZ2xvYmFsLmxhYmVsLCBpMThuKVxuICAgIGZpZWxkcyA9IGdsb2JhbC5maWVsZHNcbiAgICBmaWVsZFBlcm1pc3Npb25zID0gcGVybWlzc2lvbnMuZ2xvYmFsc1tnbG9iYWwuc2x1Z10uZmllbGRzXG4gIH1cblxuICBjb25zdCBjb21wYXJlRmV0Y2hVUkwgPSBjb21wYXJlVmFsdWU/LnZhbHVlICYmIGAke2NvbXBhcmVCYXNlVVJMfS8ke2NvbXBhcmVWYWx1ZS52YWx1ZX1gXG5cbiAgY29uc3QgW3sgZGF0YTogZG9jLCBpc0Vycm9yIH1dID0gdXNlUGF5bG9hZEFQSSh2ZXJzaW9uRmV0Y2hVUkwsIHtcbiAgICBpbml0aWFsUGFyYW1zOiB7IGRlcHRoOiAxLCBsb2NhbGU6ICcqJyB9LFxuICB9KVxuICBjb25zdCBbeyBkYXRhOiBwdWJsaXNoZWREb2MgfV0gPSB1c2VQYXlsb2FkQVBJKG9yaWdpbmFsRG9jRmV0Y2hVUkwsIHtcbiAgICBpbml0aWFsUGFyYW1zOiB7IGRlcHRoOiAxLCBsb2NhbGU6ICcqJyB9LFxuICB9KVxuICBjb25zdCBbeyBkYXRhOiBtb3N0UmVjZW50RG9jIH1dID0gdXNlUGF5bG9hZEFQSShvcmlnaW5hbERvY0ZldGNoVVJMLCB7XG4gICAgaW5pdGlhbFBhcmFtczogeyBkZXB0aDogMSwgZHJhZnQ6IHRydWUsIGxvY2FsZTogJyonIH0sXG4gIH0pXG4gIGNvbnN0IFt7IGRhdGE6IGNvbXBhcmVEb2MgfV0gPSB1c2VQYXlsb2FkQVBJKGNvbXBhcmVGZXRjaFVSTCwge1xuICAgIGluaXRpYWxQYXJhbXM6IHsgZGVwdGg6IDEsIGRyYWZ0OiAndHJ1ZScsIGxvY2FsZTogJyonIH0sXG4gIH0pXG5cbiAgY29uc3QgaGFzRHJhZnRzRW5hYmxlZCA9IGNvbGxlY3Rpb24/LnZlcnNpb25zPy5kcmFmdHMgfHwgZ2xvYmFsPy52ZXJzaW9ucz8uZHJhZnRzXG5cbiAgY29uc3Qgc2hhcmVkUGFyYW1zID0gKHN0YXR1cykgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBkZXB0aDogMCxcbiAgICAgIGxpbWl0OiAxLFxuICAgICAgc29ydDogJy11cGRhdGVkQXQnLFxuICAgICAgd2hlcmU6IHtcbiAgICAgICAgJ3ZlcnNpb24uX3N0YXR1cyc6IHtcbiAgICAgICAgICBlcXVhbHM6IHN0YXR1cyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfVxuICB9XG5cbiAgY29uc3QgW3sgZGF0YTogZHJhZnQgfV0gPSB1c2VQYXlsb2FkQVBJKGNvbXBhcmVCYXNlVVJMLCB7XG4gICAgaW5pdGlhbFBhcmFtczogaGFzRHJhZnRzRW5hYmxlZCA/IHsgLi4uc2hhcmVkUGFyYW1zKCdkcmFmdCcpIH0gOiB7fSxcbiAgfSlcblxuICBjb25zdCBbeyBkYXRhOiBwdWJsaXNoZWQgfV0gPSB1c2VQYXlsb2FkQVBJKGNvbXBhcmVCYXNlVVJMLCB7XG4gICAgaW5pdGlhbFBhcmFtczogaGFzRHJhZnRzRW5hYmxlZCA/IHsgLi4uc2hhcmVkUGFyYW1zKCdwdWJsaXNoZWQnKSB9IDoge30sXG4gIH0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFzRHJhZnRzRW5hYmxlZCkge1xuICAgICAgY29uc3QgZm9ybWF0dGVkUHVibGlzaGVkID0gcHVibGlzaGVkPy5kb2NzPy5sZW5ndGggPiAwICYmIHB1Ymxpc2hlZD8uZG9jc1swXVxuICAgICAgY29uc3QgZm9ybWF0dGVkRHJhZnQgPSBkcmFmdD8uZG9jcz8ubGVuZ3RoID4gMCAmJiBkcmFmdD8uZG9jc1swXVxuXG4gICAgICBpZiAoIWZvcm1hdHRlZFB1Ymxpc2hlZCB8fCAhZm9ybWF0dGVkRHJhZnQpIHJldHVyblxuXG4gICAgICBjb25zdCBwdWJsaXNoZWROZXdlclRoYW5EcmFmdCA9IGZvcm1hdHRlZFB1Ymxpc2hlZD8udXBkYXRlZEF0ID4gZm9ybWF0dGVkRHJhZnQ/LnVwZGF0ZWRBdFxuXG4gICAgICBzZXRMYXRlc3REcmFmdFZlcnNpb24ocHVibGlzaGVkTmV3ZXJUaGFuRHJhZnQgPyB1bmRlZmluZWQgOiBmb3JtYXR0ZWREcmFmdD8uaWQpXG4gICAgICBzZXRMYXRlc3RQdWJsaXNoZWRWZXJzaW9uKGZvcm1hdHRlZFB1Ymxpc2hlZC5sYXRlc3QgPyBmb3JtYXR0ZWRQdWJsaXNoZWQ/LmlkIDogdW5kZWZpbmVkKVxuICAgIH1cbiAgfSwgW2hhc0RyYWZ0c0VuYWJsZWQsIGRyYWZ0LCBwdWJsaXNoZWRdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IG5hdjogU3RlcE5hdkl0ZW1bXSA9IFtdXG5cbiAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgbGV0IGRvY0xhYmVsID0gJydcblxuICAgICAgaWYgKG1vc3RSZWNlbnREb2MpIHtcbiAgICAgICAgY29uc3QgeyB1c2VBc1RpdGxlIH0gPSBjb2xsZWN0aW9uLmFkbWluXG5cbiAgICAgICAgaWYgKHVzZUFzVGl0bGUgIT09ICdpZCcpIHtcbiAgICAgICAgICBjb25zdCB0aXRsZUZpZWxkID0gY29sbGVjdGlvbi5maWVsZHMuZmluZChcbiAgICAgICAgICAgIChmaWVsZCkgPT4gZmllbGRBZmZlY3RzRGF0YShmaWVsZCkgJiYgZmllbGQubmFtZSA9PT0gdXNlQXNUaXRsZSxcbiAgICAgICAgICApIGFzIEZpZWxkQWZmZWN0aW5nRGF0YVxuXG4gICAgICAgICAgaWYgKHRpdGxlRmllbGQgJiYgbW9zdFJlY2VudERvY1t1c2VBc1RpdGxlXSkge1xuICAgICAgICAgICAgaWYgKHRpdGxlRmllbGQubG9jYWxpemVkKSB7XG4gICAgICAgICAgICAgIGRvY0xhYmVsID0gbW9zdFJlY2VudERvY1t1c2VBc1RpdGxlXT8uW2xvY2FsZV1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRvY0xhYmVsID0gbW9zdFJlY2VudERvY1t1c2VBc1RpdGxlXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2NMYWJlbCA9IGBbJHt0KCdnZW5lcmFsOnVudGl0bGVkJyl9XWBcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jTGFiZWwgPSBtb3N0UmVjZW50RG9jLmlkXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbmF2ID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6IGdldFRyYW5zbGF0aW9uKGNvbGxlY3Rpb24ubGFiZWxzLnBsdXJhbCwgaTE4biksXG4gICAgICAgICAgdXJsOiBgJHthZG1pbn0vY29sbGVjdGlvbnMvJHtjb2xsZWN0aW9uLnNsdWd9YCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiBkb2NMYWJlbCxcbiAgICAgICAgICB1cmw6IGAke2FkbWlufS9jb2xsZWN0aW9ucy8ke2NvbGxlY3Rpb24uc2x1Z30vJHtpZH1gLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdWZXJzaW9ucycsXG4gICAgICAgICAgdXJsOiBgJHthZG1pbn0vY29sbGVjdGlvbnMvJHtjb2xsZWN0aW9uLnNsdWd9LyR7aWR9L3ZlcnNpb25zYCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiBkb2M/LmNyZWF0ZWRBdCA/IGZvcm1hdERhdGUoZG9jLmNyZWF0ZWRBdCwgZGF0ZUZvcm1hdCwgaTE4bj8ubGFuZ3VhZ2UpIDogJycsXG4gICAgICAgIH0sXG4gICAgICBdXG4gICAgfVxuXG4gICAgaWYgKGdsb2JhbCkge1xuICAgICAgbmF2ID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6IGdsb2JhbC5sYWJlbCxcbiAgICAgICAgICB1cmw6IGAke2FkbWlufS9nbG9iYWxzLyR7Z2xvYmFsLnNsdWd9YCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnVmVyc2lvbnMnLFxuICAgICAgICAgIHVybDogYCR7YWRtaW59L2dsb2JhbHMvJHtnbG9iYWwuc2x1Z30vdmVyc2lvbnNgLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6IGRvYz8uY3JlYXRlZEF0ID8gZm9ybWF0RGF0ZShkb2MuY3JlYXRlZEF0LCBkYXRlRm9ybWF0LCBpMThuPy5sYW5ndWFnZSkgOiAnJyxcbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICB9XG5cbiAgICBzZXRTdGVwTmF2KG5hdilcbiAgfSwgW3NldFN0ZXBOYXYsIGNvbGxlY3Rpb24sIGdsb2JhbCwgZGF0ZUZvcm1hdCwgZG9jLCBtb3N0UmVjZW50RG9jLCBhZG1pbiwgaWQsIGxvY2FsZSwgdCwgaTE4bl0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBlZGl0Q29uZmlnID0gKGNvbGxlY3Rpb24gfHwgZ2xvYmFsKT8uYWRtaW4/LmNvbXBvbmVudHM/LnZpZXdzPy5FZGl0XG4gICAgY29uc3QgdmVyc2lvbkFjdGlvbnMgPVxuICAgICAgZWRpdENvbmZpZyAmJiAnVmVyc2lvbicgaW4gZWRpdENvbmZpZyAmJiAnYWN0aW9ucycgaW4gZWRpdENvbmZpZy5WZXJzaW9uXG4gICAgICAgID8gZWRpdENvbmZpZy5WZXJzaW9uLmFjdGlvbnNcbiAgICAgICAgOiBbXVxuXG4gICAgc2V0Vmlld0FjdGlvbnModmVyc2lvbkFjdGlvbnMpXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc2V0Vmlld0FjdGlvbnMoW10pXG4gICAgfVxuICB9LCBbY29sbGVjdGlvbiwgZ2xvYmFsLCBzZXRWaWV3QWN0aW9uc10pXG5cbiAgbGV0IG1ldGFUaXRsZTogc3RyaW5nXG4gIGxldCBtZXRhRGVzYzogc3RyaW5nXG4gIGNvbnN0IHZlcnNpb25DcmVhdGVkQXQgPSBkb2M/LnVwZGF0ZWRBdFxuICAgID8gZm9ybWF0RGF0ZShkb2MudXBkYXRlZEF0LCBkYXRlRm9ybWF0LCBpMThuPy5sYW5ndWFnZSlcbiAgICA6ICcnXG5cbiAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICBjb25zdCB1c2VBc1RpdGxlID0gY29sbGVjdGlvbj8uYWRtaW4/LnVzZUFzVGl0bGUgfHwgJ2lkJ1xuICAgIG1ldGFUaXRsZSA9IGAke3QoJ3ZlcnNpb24nKX0gLSAke3ZlcnNpb25DcmVhdGVkQXR9IC0gJHtkb2NbdXNlQXNUaXRsZV19IC0gJHtlbnRpdHlMYWJlbH1gXG4gICAgbWV0YURlc2MgPSB0KCd2aWV3aW5nVmVyc2lvbicsIHsgZG9jdW1lbnRUaXRsZTogZG9jW3VzZUFzVGl0bGVdLCBlbnRpdHlMYWJlbCB9KVxuICB9XG5cbiAgaWYgKGdsb2JhbCkge1xuICAgIG1ldGFUaXRsZSA9IGAke3QoJ3ZlcnNpb24nKX0gLSAke3ZlcnNpb25DcmVhdGVkQXR9IC0gJHtlbnRpdHlMYWJlbH1gXG4gICAgbWV0YURlc2MgPSB0KCd2aWV3aW5nVmVyc2lvbkdsb2JhbCcsIHsgZW50aXR5TGFiZWwgfSlcbiAgfVxuXG4gIGxldCBjb21wYXJpc29uID0gY29tcGFyZURvYz8udmVyc2lvblxuXG4gIGlmIChjb21wYXJlVmFsdWU/LnZhbHVlID09PSAnbW9zdFJlY2VudCcpIHtcbiAgICBjb21wYXJpc29uID0gbW9zdFJlY2VudERvY1xuICB9XG5cbiAgaWYgKGNvbXBhcmVWYWx1ZT8udmFsdWUgPT09ICdwdWJsaXNoZWQnKSB7XG4gICAgY29tcGFyaXNvbiA9IHB1Ymxpc2hlZERvY1xuICB9XG5cbiAgY29uc3QgY2FuVXBkYXRlID0gZG9jUGVybWlzc2lvbnM/LnVwZGF0ZT8ucGVybWlzc2lvblxuXG4gIGlmIChpc0Vycm9yKSB7XG4gICAgcmV0dXJuIDxOb3RGb3VuZCBtYXJnaW5Ub3A9XCJsYXJnZVwiIC8+XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxtYWluIGNsYXNzTmFtZT17YmFzZUNsYXNzfT5cbiAgICAgIDxNZXRhIGRlc2NyaXB0aW9uPXttZXRhRGVzY30gdGl0bGU9e21ldGFUaXRsZX0gLz5cbiAgICAgIDxHdXR0ZXIgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X193cmFwYH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19oZWFkZXItd3JhcGB9PlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fY3JlYXRlZC1hdGB9PlxuICAgICAgICAgICAge3QoJ3ZlcnNpb25DcmVhdGVkT24nLCB7XG4gICAgICAgICAgICAgIHZlcnNpb246IHQoZG9jPy5hdXRvc2F2ZSA/ICdhdXRvc2F2ZWRWZXJzaW9uJyA6ICd2ZXJzaW9uJyksXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L3A+XG4gICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2hlYWRlcmB9PlxuICAgICAgICAgICAgPGgyPnt2ZXJzaW9uQ3JlYXRlZEF0fTwvaDI+XG4gICAgICAgICAgICB7Y2FuVXBkYXRlICYmIChcbiAgICAgICAgICAgICAgPFJlc3RvcmVcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3Jlc3RvcmVgfVxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb249e2NvbGxlY3Rpb259XG4gICAgICAgICAgICAgICAgZ2xvYmFsPXtnbG9iYWx9XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxEb2NJRD17aWR9XG4gICAgICAgICAgICAgICAgdmVyc2lvbkRhdGU9e3ZlcnNpb25DcmVhdGVkQXR9XG4gICAgICAgICAgICAgICAgdmVyc2lvbklEPXt2ZXJzaW9uSUR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2NvbnRyb2xzYH0+XG4gICAgICAgICAgPENvbXBhcmVWZXJzaW9uXG4gICAgICAgICAgICBiYXNlVVJMPXtjb21wYXJlQmFzZVVSTH1cbiAgICAgICAgICAgIGxhdGVzdERyYWZ0VmVyc2lvbj17bGF0ZXN0RHJhZnRWZXJzaW9ufVxuICAgICAgICAgICAgbGF0ZXN0UHVibGlzaGVkVmVyc2lvbj17bGF0ZXN0UHVibGlzaGVkVmVyc2lvbn1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRDb21wYXJlVmFsdWV9XG4gICAgICAgICAgICBwYXJlbnRJRD17cGFyZW50SUR9XG4gICAgICAgICAgICB2YWx1ZT17Y29tcGFyZVZhbHVlfVxuICAgICAgICAgICAgdmVyc2lvbklEPXt2ZXJzaW9uSUR9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7bG9jYWxpemF0aW9uICYmIChcbiAgICAgICAgICAgIDxTZWxlY3RMb2NhbGVzIG9uQ2hhbmdlPXtzZXRMb2NhbGVzfSBvcHRpb25zPXtsb2NhbGVPcHRpb25zfSB2YWx1ZT17bG9jYWxlc30gLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7ZG9jPy52ZXJzaW9uICYmIChcbiAgICAgICAgICA8UmVuZGVyRmllbGRzVG9EaWZmXG4gICAgICAgICAgICBjb21wYXJpc29uPXtjb21wYXJpc29ufVxuICAgICAgICAgICAgZmllbGRDb21wb25lbnRzPXtmaWVsZENvbXBvbmVudHN9XG4gICAgICAgICAgICBmaWVsZFBlcm1pc3Npb25zPXtmaWVsZFBlcm1pc3Npb25zfVxuICAgICAgICAgICAgZmllbGRzPXtmaWVsZHN9XG4gICAgICAgICAgICBsb2NhbGVzPXtcbiAgICAgICAgICAgICAgbG9jYWxlc1xuICAgICAgICAgICAgICAgID8gbG9jYWxlcy5tYXAoKHsgdmFsdWUgfSkgPT4gKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IHVuZGVmaW5lZCkpXG4gICAgICAgICAgICAgICAgOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmVyc2lvbj17ZG9jPy52ZXJzaW9ufVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L0d1dHRlcj5cbiAgICA8L21haW4+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgVmVyc2lvblZpZXdcbiJdLCJuYW1lcyI6WyJiYXNlQ2xhc3MiLCJWZXJzaW9uVmlldyIsImNvbGxlY3Rpb24iLCJnbG9iYWwiLCJhZG1pbiIsImRhdGVGb3JtYXQiLCJsb2NhbGl6YXRpb24iLCJyb3V0ZXMiLCJhcGkiLCJzZXJ2ZXJVUkwiLCJ1c2VDb25maWciLCJzZXRTdGVwTmF2IiwidXNlU3RlcE5hdiIsInNldFZpZXdBY3Rpb25zIiwidXNlQWN0aW9ucyIsInBhcmFtcyIsImlkIiwidmVyc2lvbklEIiwidXNlUm91dGVNYXRjaCIsImNvbXBhcmVWYWx1ZSIsInNldENvbXBhcmVWYWx1ZSIsInVzZVN0YXRlIiwibG9jYWxlT3B0aW9ucyIsImxvY2FsZXMiLCJtYXAiLCJjb2RlIiwibGFiZWwiLCJ2YWx1ZSIsInNldExvY2FsZXMiLCJwZXJtaXNzaW9ucyIsInVzZUF1dGgiLCJsb2NhbGUiLCJ1c2VMb2NhbGUiLCJpMThuIiwidCIsInVzZVRyYW5zbGF0aW9uIiwiZG9jUGVybWlzc2lvbnMiLCJ1c2VEb2N1bWVudEluZm8iLCJvcmlnaW5hbERvY0ZldGNoVVJMIiwidmVyc2lvbkZldGNoVVJMIiwiZW50aXR5TGFiZWwiLCJmaWVsZHMiLCJmaWVsZFBlcm1pc3Npb25zIiwiY29tcGFyZUJhc2VVUkwiLCJzbHVnIiwicGFyZW50SUQiLCJsYXRlc3REcmFmdFZlcnNpb24iLCJzZXRMYXRlc3REcmFmdFZlcnNpb24iLCJ1bmRlZmluZWQiLCJsYXRlc3RQdWJsaXNoZWRWZXJzaW9uIiwic2V0TGF0ZXN0UHVibGlzaGVkVmVyc2lvbiIsImdldFRyYW5zbGF0aW9uIiwibGFiZWxzIiwic2luZ3VsYXIiLCJjb2xsZWN0aW9ucyIsImdsb2JhbHMiLCJjb21wYXJlRmV0Y2hVUkwiLCJkYXRhIiwiZG9jIiwiaXNFcnJvciIsInVzZVBheWxvYWRBUEkiLCJpbml0aWFsUGFyYW1zIiwiZGVwdGgiLCJwdWJsaXNoZWREb2MiLCJtb3N0UmVjZW50RG9jIiwiZHJhZnQiLCJjb21wYXJlRG9jIiwiaGFzRHJhZnRzRW5hYmxlZCIsInZlcnNpb25zIiwiZHJhZnRzIiwic2hhcmVkUGFyYW1zIiwic3RhdHVzIiwibGltaXQiLCJzb3J0Iiwid2hlcmUiLCJlcXVhbHMiLCJwdWJsaXNoZWQiLCJ1c2VFZmZlY3QiLCJmb3JtYXR0ZWRQdWJsaXNoZWQiLCJkb2NzIiwibGVuZ3RoIiwiZm9ybWF0dGVkRHJhZnQiLCJwdWJsaXNoZWROZXdlclRoYW5EcmFmdCIsInVwZGF0ZWRBdCIsImxhdGVzdCIsIm5hdiIsImRvY0xhYmVsIiwidXNlQXNUaXRsZSIsInRpdGxlRmllbGQiLCJmaW5kIiwiZmllbGQiLCJmaWVsZEFmZmVjdHNEYXRhIiwibmFtZSIsImxvY2FsaXplZCIsInBsdXJhbCIsInVybCIsImNyZWF0ZWRBdCIsImZvcm1hdERhdGUiLCJsYW5ndWFnZSIsImVkaXRDb25maWciLCJjb21wb25lbnRzIiwidmlld3MiLCJFZGl0IiwidmVyc2lvbkFjdGlvbnMiLCJWZXJzaW9uIiwiYWN0aW9ucyIsIm1ldGFUaXRsZSIsIm1ldGFEZXNjIiwidmVyc2lvbkNyZWF0ZWRBdCIsImRvY3VtZW50VGl0bGUiLCJjb21wYXJpc29uIiwidmVyc2lvbiIsImNhblVwZGF0ZSIsInVwZGF0ZSIsInBlcm1pc3Npb24iLCJOb3RGb3VuZCIsIm1hcmdpblRvcCIsIm1haW4iLCJjbGFzc05hbWUiLCJNZXRhIiwiZGVzY3JpcHRpb24iLCJ0aXRsZSIsIkd1dHRlciIsImRpdiIsInAiLCJhdXRvc2F2ZSIsImhlYWRlciIsImgyIiwiUmVzdG9yZSIsIm9yaWdpbmFsRG9jSUQiLCJ2ZXJzaW9uRGF0ZSIsIkNvbXBhcmVWZXJzaW9uIiwiYmFzZVVSTCIsIm9uQ2hhbmdlIiwiU2VsZWN0TG9jYWxlcyIsIm9wdGlvbnMiLCJSZW5kZXJGaWVsZHNUb0RpZmYiLCJmaWVsZENvbXBvbmVudHMiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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