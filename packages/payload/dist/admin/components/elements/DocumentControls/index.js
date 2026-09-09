"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DocumentControls", {
    enumerable: true,
    get: function() {
        return DocumentControls;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reacti18next = require("react-i18next");
const _getTranslation = require("../../../../utilities/getTranslation");
const _formatDate = require("../../../utilities/formatDate");
const _Config = require("../../utilities/Config");
const _DocumentInfo = require("../../utilities/DocumentInfo");
const _Autosave = /*#__PURE__*/ _interop_require_default(require("../Autosave"));
const _DeleteDocument = /*#__PURE__*/ _interop_require_default(require("../DeleteDocument"));
const _DuplicateDocument = /*#__PURE__*/ _interop_require_default(require("../DuplicateDocument"));
const _Gutter = require("../Gutter");
const _Popup = /*#__PURE__*/ _interop_require_default(require("../Popup"));
const _PopupButtonList = /*#__PURE__*/ _interop_require_wildcard(require("../Popup/PopupButtonList"));
const _PreviewButton = /*#__PURE__*/ _interop_require_default(require("../PreviewButton"));
const _Publish = require("../Publish");
const _Save = require("../Save");
const _SaveDraft = require("../SaveDraft");
const _Status = /*#__PURE__*/ _interop_require_default(require("../Status"));
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
const baseClass = 'doc-controls';
const DocumentControls = (props)=>{
    const { id, collection, data, disableActions, global, hasSavePermission, isAccountView, isEditing, onSave, permissions } = props;
    const { slug, publishedDoc } = (0, _DocumentInfo.useDocumentInfo)();
    const { admin: { dateFormat }, collections, globals, routes: { admin: adminRoute } } = (0, _Config.useConfig)();
    const collectionConfig = collections.find((coll)=>coll.slug === slug);
    const globalConfig = globals.find((global)=>global.slug === slug);
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const hasCreatePermission = 'create' in permissions && permissions.create?.permission;
    const hasDeletePermission = 'delete' in permissions && permissions.delete?.permission;
    const showDotMenu = Boolean(collection && id && !disableActions && (hasCreatePermission || hasDeletePermission));
    const collectionLabel = ()=>{
        const label = collection?.labels?.singular;
        if (!label) return t('document');
        return typeof label === 'string' ? label : (0, _getTranslation.getTranslation)(label, i18n);
    };
    const unsavedDraftWithValidations = !id && collectionConfig?.versions?.drafts && collectionConfig.versions?.drafts.validate;
    return /*#__PURE__*/ _react.default.createElement(_Gutter.Gutter, {
        className: baseClass
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__wrapper`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__content`
    }, /*#__PURE__*/ _react.default.createElement("ul", {
        className: `${baseClass}__meta`
    }, collection && !isEditing && !isAccountView && /*#__PURE__*/ _react.default.createElement("li", {
        className: `${baseClass}__list-item`
    }, /*#__PURE__*/ _react.default.createElement("p", {
        className: `${baseClass}__value`
    }, t('creatingNewLabel', {
        label: collectionLabel()
    }))), (collection?.versions?.drafts || global?.versions?.drafts) && /*#__PURE__*/ _react.default.createElement(_react.Fragment, null, (global || collection && isEditing) && /*#__PURE__*/ _react.default.createElement("li", {
        className: [
            `${baseClass}__status`,
            `${baseClass}__list-item`
        ].filter(Boolean).join(' ')
    }, /*#__PURE__*/ _react.default.createElement(_Status.default, null)), (collectionConfig?.versions?.drafts && collectionConfig?.versions?.drafts?.autosave && !unsavedDraftWithValidations || globalConfig?.versions?.drafts && globalConfig?.versions?.drafts?.autosave) && hasSavePermission && /*#__PURE__*/ _react.default.createElement("li", {
        className: `${baseClass}__list-item`
    }, /*#__PURE__*/ _react.default.createElement(_Autosave.default, {
        collection: collection,
        global: global,
        id: id,
        onSave: onSave,
        publishedDocUpdatedAt: publishedDoc?.updatedAt || data?.createdAt
    }))), collection?.timestamps && (isEditing || isAccountView) && /*#__PURE__*/ _react.default.createElement(_react.Fragment, null, /*#__PURE__*/ _react.default.createElement("li", {
        className: [
            `${baseClass}__list-item`,
            `${baseClass}__value-wrap`
        ].filter(Boolean).join(' '),
        title: data?.updatedAt ? (0, _formatDate.formatDate)(data?.updatedAt, dateFormat, i18n?.language) : ''
    }, /*#__PURE__*/ _react.default.createElement("p", {
        className: `${baseClass}__label`
    }, t('lastModified'), ": "), data?.updatedAt && /*#__PURE__*/ _react.default.createElement("p", {
        className: `${baseClass}__value`
    }, (0, _formatDate.formatDate)(data.updatedAt, dateFormat, i18n?.language))), /*#__PURE__*/ _react.default.createElement("li", {
        className: [
            `${baseClass}__list-item`,
            `${baseClass}__value-wrap`
        ].filter(Boolean).join(' '),
        title: publishedDoc?.createdAt || data?.createdAt ? (0, _formatDate.formatDate)(publishedDoc?.createdAt || data?.createdAt, dateFormat, i18n?.language) : ''
    }, /*#__PURE__*/ _react.default.createElement("p", {
        className: `${baseClass}__label`
    }, t('created'), ": "), (publishedDoc?.createdAt || data?.createdAt) && /*#__PURE__*/ _react.default.createElement("p", {
        className: `${baseClass}__value`
    }, (0, _formatDate.formatDate)(publishedDoc?.createdAt || data?.createdAt, dateFormat, i18n?.language)))))), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__controls-wrapper`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__controls`
    }, (collection?.admin?.preview || global?.admin?.preview) && /*#__PURE__*/ _react.default.createElement(_PreviewButton.default, {
        CustomComponent: collection?.admin?.components?.edit?.PreviewButton || global?.admin?.components?.elements?.PreviewButton,
        generatePreviewURL: collection?.admin?.preview || global?.admin?.preview
    }), hasSavePermission && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, collection?.versions?.drafts || global?.versions?.drafts ? /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, (collectionConfig?.versions?.drafts && !collectionConfig?.versions?.drafts?.autosave || unsavedDraftWithValidations || globalConfig?.versions?.drafts && !globalConfig?.versions?.drafts?.autosave) && /*#__PURE__*/ _react.default.createElement(_SaveDraft.SaveDraft, {
        CustomComponent: collection?.admin?.components?.edit?.SaveDraftButton || global?.admin?.components?.elements?.SaveDraftButton
    }), /*#__PURE__*/ _react.default.createElement(_Publish.Publish, {
        CustomComponent: collection?.admin?.components?.edit?.PublishButton || global?.admin?.components?.elements?.PublishButton
    })) : /*#__PURE__*/ _react.default.createElement(_Save.Save, {
        CustomComponent: collection?.admin?.components?.edit?.SaveButton || global?.admin?.components?.elements?.SaveButton
    }))), showDotMenu && /*#__PURE__*/ _react.default.createElement(_Popup.default, {
        button: /*#__PURE__*/ _react.default.createElement("div", {
            className: `${baseClass}__dots`
        }, /*#__PURE__*/ _react.default.createElement("div", null), /*#__PURE__*/ _react.default.createElement("div", null), /*#__PURE__*/ _react.default.createElement("div", null)),
        className: `${baseClass}__popup`,
        horizontalAlign: "right",
        size: "large",
        verticalAlign: "bottom"
    }, /*#__PURE__*/ _react.default.createElement(_PopupButtonList.ButtonGroup, null, hasCreatePermission && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(_PopupButtonList.Button, {
        id: "action-create",
        to: `${adminRoute}/collections/${collection?.slug}/create`
    }, t('createNew')), !collection?.admin?.disableDuplicate && isEditing && /*#__PURE__*/ _react.default.createElement(_DuplicateDocument.default, {
        collection: collection,
        id: id,
        slug: collection?.slug
    })), hasDeletePermission && /*#__PURE__*/ _react.default.createElement(_DeleteDocument.default, {
        buttonId: "action-delete",
        collection: collection,
        id: id
    }))))), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__divider`
    }));
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL0RvY3VtZW50Q29udHJvbHMvaW5kZXgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBGcmFnbWVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuXG5pbXBvcnQgdHlwZSB7IENvbGxlY3Rpb25QZXJtaXNzaW9uLCBHbG9iYWxQZXJtaXNzaW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vYXV0aCdcbmltcG9ydCB0eXBlIHsgU2FuaXRpemVkQ29sbGVjdGlvbkNvbmZpZyB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbGxlY3Rpb25zL2NvbmZpZy90eXBlcydcbmltcG9ydCB0eXBlIHsgU2FuaXRpemVkR2xvYmFsQ29uZmlnIH0gZnJvbSAnLi4vLi4vLi4vLi4vZ2xvYmFscy9jb25maWcvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IENvbGxlY3Rpb25FZGl0Vmlld1Byb3BzIH0gZnJvbSAnLi4vLi4vdmlld3MvdHlwZXMnXG5cbmltcG9ydCB7IGdldFRyYW5zbGF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0aWVzL2dldFRyYW5zbGF0aW9uJ1xuaW1wb3J0IHsgZm9ybWF0RGF0ZSB9IGZyb20gJy4uLy4uLy4uL3V0aWxpdGllcy9mb3JtYXREYXRlJ1xuaW1wb3J0IHsgdXNlQ29uZmlnIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL0NvbmZpZydcbmltcG9ydCB7IHVzZURvY3VtZW50SW5mbyB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9Eb2N1bWVudEluZm8nXG5pbXBvcnQgQXV0b3NhdmUgZnJvbSAnLi4vQXV0b3NhdmUnXG5pbXBvcnQgRGVsZXRlRG9jdW1lbnQgZnJvbSAnLi4vRGVsZXRlRG9jdW1lbnQnXG5pbXBvcnQgRHVwbGljYXRlRG9jdW1lbnQgZnJvbSAnLi4vRHVwbGljYXRlRG9jdW1lbnQnXG5pbXBvcnQgeyBHdXR0ZXIgfSBmcm9tICcuLi9HdXR0ZXInXG5pbXBvcnQgUG9wdXAgZnJvbSAnLi4vUG9wdXAnXG5pbXBvcnQgKiBhcyBQb3B1cExpc3QgZnJvbSAnLi4vUG9wdXAvUG9wdXBCdXR0b25MaXN0J1xuaW1wb3J0IFByZXZpZXdCdXR0b24gZnJvbSAnLi4vUHJldmlld0J1dHRvbidcbmltcG9ydCB7IFB1Ymxpc2ggfSBmcm9tICcuLi9QdWJsaXNoJ1xuaW1wb3J0IHsgU2F2ZSB9IGZyb20gJy4uL1NhdmUnXG5pbXBvcnQgeyBTYXZlRHJhZnQgfSBmcm9tICcuLi9TYXZlRHJhZnQnXG5pbXBvcnQgU3RhdHVzIGZyb20gJy4uL1N0YXR1cydcbmltcG9ydCAnLi9pbmRleC5zY3NzJ1xuXG5jb25zdCBiYXNlQ2xhc3MgPSAnZG9jLWNvbnRyb2xzJ1xuXG5leHBvcnQgY29uc3QgRG9jdW1lbnRDb250cm9sczogUmVhY3QuRkM8e1xuICBhcGlVUkw6IHN0cmluZ1xuICBjb2xsZWN0aW9uPzogU2FuaXRpemVkQ29sbGVjdGlvbkNvbmZpZ1xuICBkYXRhPzogYW55XG4gIGRpc2FibGVBY3Rpb25zPzogYm9vbGVhblxuICBnbG9iYWw/OiBTYW5pdGl6ZWRHbG9iYWxDb25maWdcbiAgaGFzU2F2ZVBlcm1pc3Npb24/OiBib29sZWFuXG4gIGlkPzogc3RyaW5nXG4gIGlzQWNjb3VudFZpZXc/OiBib29sZWFuXG4gIGlzRWRpdGluZz86IGJvb2xlYW5cbiAgb25TYXZlPzogQ29sbGVjdGlvbkVkaXRWaWV3UHJvcHNbJ29uU2F2ZSddXG4gIHBlcm1pc3Npb25zPzogQ29sbGVjdGlvblBlcm1pc3Npb24gfCBHbG9iYWxQZXJtaXNzaW9uXG59PiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7XG4gICAgaWQsXG4gICAgY29sbGVjdGlvbixcbiAgICBkYXRhLFxuICAgIGRpc2FibGVBY3Rpb25zLFxuICAgIGdsb2JhbCxcbiAgICBoYXNTYXZlUGVybWlzc2lvbixcbiAgICBpc0FjY291bnRWaWV3LFxuICAgIGlzRWRpdGluZyxcbiAgICBvblNhdmUsXG4gICAgcGVybWlzc2lvbnMsXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IHsgc2x1ZywgcHVibGlzaGVkRG9jIH0gPSB1c2VEb2N1bWVudEluZm8oKVxuXG4gIGNvbnN0IHtcbiAgICBhZG1pbjogeyBkYXRlRm9ybWF0IH0sXG4gICAgY29sbGVjdGlvbnMsXG4gICAgZ2xvYmFscyxcbiAgICByb3V0ZXM6IHsgYWRtaW46IGFkbWluUm91dGUgfSxcbiAgfSA9IHVzZUNvbmZpZygpXG5cbiAgY29uc3QgY29sbGVjdGlvbkNvbmZpZyA9IGNvbGxlY3Rpb25zLmZpbmQoKGNvbGwpID0+IGNvbGwuc2x1ZyA9PT0gc2x1ZylcbiAgY29uc3QgZ2xvYmFsQ29uZmlnID0gZ2xvYmFscy5maW5kKChnbG9iYWwpID0+IGdsb2JhbC5zbHVnID09PSBzbHVnKVxuXG4gIGNvbnN0IHsgaTE4biwgdCB9ID0gdXNlVHJhbnNsYXRpb24oJ2dlbmVyYWwnKVxuXG4gIGNvbnN0IGhhc0NyZWF0ZVBlcm1pc3Npb24gPSAnY3JlYXRlJyBpbiBwZXJtaXNzaW9ucyAmJiBwZXJtaXNzaW9ucy5jcmVhdGU/LnBlcm1pc3Npb25cbiAgY29uc3QgaGFzRGVsZXRlUGVybWlzc2lvbiA9ICdkZWxldGUnIGluIHBlcm1pc3Npb25zICYmIHBlcm1pc3Npb25zLmRlbGV0ZT8ucGVybWlzc2lvblxuXG4gIGNvbnN0IHNob3dEb3RNZW51ID0gQm9vbGVhbihcbiAgICBjb2xsZWN0aW9uICYmIGlkICYmICFkaXNhYmxlQWN0aW9ucyAmJiAoaGFzQ3JlYXRlUGVybWlzc2lvbiB8fCBoYXNEZWxldGVQZXJtaXNzaW9uKSxcbiAgKVxuXG4gIGNvbnN0IGNvbGxlY3Rpb25MYWJlbCA9ICgpID0+IHtcbiAgICBjb25zdCBsYWJlbCA9IGNvbGxlY3Rpb24/LmxhYmVscz8uc2luZ3VsYXJcbiAgICBpZiAoIWxhYmVsKSByZXR1cm4gdCgnZG9jdW1lbnQnKVxuICAgIHJldHVybiB0eXBlb2YgbGFiZWwgPT09ICdzdHJpbmcnID8gbGFiZWwgOiBnZXRUcmFuc2xhdGlvbihsYWJlbCwgaTE4bilcbiAgfVxuXG4gIGNvbnN0IHVuc2F2ZWREcmFmdFdpdGhWYWxpZGF0aW9ucyA9XG4gICAgIWlkICYmIGNvbGxlY3Rpb25Db25maWc/LnZlcnNpb25zPy5kcmFmdHMgJiYgY29sbGVjdGlvbkNvbmZpZy52ZXJzaW9ucz8uZHJhZnRzLnZhbGlkYXRlXG5cbiAgcmV0dXJuIChcbiAgICA8R3V0dGVyIGNsYXNzTmFtZT17YmFzZUNsYXNzfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X193cmFwcGVyYH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19jb250ZW50YH0+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fbWV0YWB9PlxuICAgICAgICAgICAge2NvbGxlY3Rpb24gJiYgIWlzRWRpdGluZyAmJiAhaXNBY2NvdW50VmlldyAmJiAoXG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2xpc3QtaXRlbWB9PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fdmFsdWVgfT5cbiAgICAgICAgICAgICAgICAgIHt0KCdjcmVhdGluZ05ld0xhYmVsJywgeyBsYWJlbDogY29sbGVjdGlvbkxhYmVsKCkgfSl9XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHsoY29sbGVjdGlvbj8udmVyc2lvbnM/LmRyYWZ0cyB8fCBnbG9iYWw/LnZlcnNpb25zPy5kcmFmdHMpICYmIChcbiAgICAgICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgICAgIHsoZ2xvYmFsIHx8IChjb2xsZWN0aW9uICYmIGlzRWRpdGluZykpICYmIChcbiAgICAgICAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e1tgJHtiYXNlQ2xhc3N9X19zdGF0dXNgLCBgJHtiYXNlQ2xhc3N9X19saXN0LWl0ZW1gXVxuICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgICAgICAgICAgICAgICAuam9pbignICcpfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8U3RhdHVzIC8+XG4gICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgeygoY29sbGVjdGlvbkNvbmZpZz8udmVyc2lvbnM/LmRyYWZ0cyAmJlxuICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbkNvbmZpZz8udmVyc2lvbnM/LmRyYWZ0cz8uYXV0b3NhdmUgJiZcbiAgICAgICAgICAgICAgICAgICF1bnNhdmVkRHJhZnRXaXRoVmFsaWRhdGlvbnMpIHx8XG4gICAgICAgICAgICAgICAgICAoZ2xvYmFsQ29uZmlnPy52ZXJzaW9ucz8uZHJhZnRzICYmIGdsb2JhbENvbmZpZz8udmVyc2lvbnM/LmRyYWZ0cz8uYXV0b3NhdmUpKSAmJlxuICAgICAgICAgICAgICAgICAgaGFzU2F2ZVBlcm1pc3Npb24gJiYgKFxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19saXN0LWl0ZW1gfT5cbiAgICAgICAgICAgICAgICAgICAgICA8QXV0b3NhdmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb249e2NvbGxlY3Rpb259XG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWw9e2dsb2JhbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtpZH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17b25TYXZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVkRG9jVXBkYXRlZEF0PXtwdWJsaXNoZWREb2M/LnVwZGF0ZWRBdCB8fCBkYXRhPy5jcmVhdGVkQXR9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge2NvbGxlY3Rpb24/LnRpbWVzdGFtcHMgJiYgKGlzRWRpdGluZyB8fCBpc0FjY291bnRWaWV3KSAmJiAoXG4gICAgICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17W2Ake2Jhc2VDbGFzc31fX2xpc3QtaXRlbWAsIGAke2Jhc2VDbGFzc31fX3ZhbHVlLXdyYXBgXVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCcgJyl9XG4gICAgICAgICAgICAgICAgICB0aXRsZT17XG4gICAgICAgICAgICAgICAgICAgIGRhdGE/LnVwZGF0ZWRBdCA/IGZvcm1hdERhdGUoZGF0YT8udXBkYXRlZEF0LCBkYXRlRm9ybWF0LCBpMThuPy5sYW5ndWFnZSkgOiAnJ1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fbGFiZWxgfT57dCgnbGFzdE1vZGlmaWVkJyl9OiZuYnNwOzwvcD5cbiAgICAgICAgICAgICAgICAgIHtkYXRhPy51cGRhdGVkQXQgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3ZhbHVlYH0+XG4gICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdERhdGUoZGF0YS51cGRhdGVkQXQsIGRhdGVGb3JtYXQsIGkxOG4/Lmxhbmd1YWdlKX1cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtbYCR7YmFzZUNsYXNzfV9fbGlzdC1pdGVtYCwgYCR7YmFzZUNsYXNzfV9fdmFsdWUtd3JhcGBdXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oJyAnKX1cbiAgICAgICAgICAgICAgICAgIHRpdGxlPXtcbiAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVkRG9jPy5jcmVhdGVkQXQgfHwgZGF0YT8uY3JlYXRlZEF0XG4gICAgICAgICAgICAgICAgICAgICAgPyBmb3JtYXREYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwdWJsaXNoZWREb2M/LmNyZWF0ZWRBdCB8fCBkYXRhPy5jcmVhdGVkQXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVGb3JtYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGkxOG4/Lmxhbmd1YWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgIDogJydcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2xhYmVsYH0+e3QoJ2NyZWF0ZWQnKX06Jm5ic3A7PC9wPlxuICAgICAgICAgICAgICAgICAgeyhwdWJsaXNoZWREb2M/LmNyZWF0ZWRBdCB8fCBkYXRhPy5jcmVhdGVkQXQpICYmIChcbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X192YWx1ZWB9PlxuICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVibGlzaGVkRG9jPy5jcmVhdGVkQXQgfHwgZGF0YT8uY3JlYXRlZEF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZUZvcm1hdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG4/Lmxhbmd1YWdlLFxuICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19jb250cm9scy13cmFwcGVyYH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2NvbnRyb2xzYH0+XG4gICAgICAgICAgICB7KGNvbGxlY3Rpb24/LmFkbWluPy5wcmV2aWV3IHx8IGdsb2JhbD8uYWRtaW4/LnByZXZpZXcpICYmIChcbiAgICAgICAgICAgICAgPFByZXZpZXdCdXR0b25cbiAgICAgICAgICAgICAgICBDdXN0b21Db21wb25lbnQ9e1xuICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbj8uYWRtaW4/LmNvbXBvbmVudHM/LmVkaXQ/LlByZXZpZXdCdXR0b24gfHxcbiAgICAgICAgICAgICAgICAgIGdsb2JhbD8uYWRtaW4/LmNvbXBvbmVudHM/LmVsZW1lbnRzPy5QcmV2aWV3QnV0dG9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdlbmVyYXRlUHJldmlld1VSTD17Y29sbGVjdGlvbj8uYWRtaW4/LnByZXZpZXcgfHwgZ2xvYmFsPy5hZG1pbj8ucHJldmlld31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7aGFzU2F2ZVBlcm1pc3Npb24gJiYgKFxuICAgICAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAgICAgICAge2NvbGxlY3Rpb24/LnZlcnNpb25zPy5kcmFmdHMgfHwgZ2xvYmFsPy52ZXJzaW9ucz8uZHJhZnRzID8gKFxuICAgICAgICAgICAgICAgICAgPFJlYWN0LkZyYWdtZW50PlxuICAgICAgICAgICAgICAgICAgICB7KChjb2xsZWN0aW9uQ29uZmlnPy52ZXJzaW9ucz8uZHJhZnRzICYmXG4gICAgICAgICAgICAgICAgICAgICAgIWNvbGxlY3Rpb25Db25maWc/LnZlcnNpb25zPy5kcmFmdHM/LmF1dG9zYXZlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgIHVuc2F2ZWREcmFmdFdpdGhWYWxpZGF0aW9ucyB8fFxuICAgICAgICAgICAgICAgICAgICAgIChnbG9iYWxDb25maWc/LnZlcnNpb25zPy5kcmFmdHMgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFnbG9iYWxDb25maWc/LnZlcnNpb25zPy5kcmFmdHM/LmF1dG9zYXZlKSkgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxTYXZlRHJhZnRcbiAgICAgICAgICAgICAgICAgICAgICAgIEN1c3RvbUNvbXBvbmVudD17XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24/LmFkbWluPy5jb21wb25lbnRzPy5lZGl0Py5TYXZlRHJhZnRCdXR0b24gfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsPy5hZG1pbj8uY29tcG9uZW50cz8uZWxlbWVudHM/LlNhdmVEcmFmdEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDxQdWJsaXNoXG4gICAgICAgICAgICAgICAgICAgICAgQ3VzdG9tQ29tcG9uZW50PXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24/LmFkbWluPy5jb21wb25lbnRzPy5lZGl0Py5QdWJsaXNoQnV0dG9uIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWw/LmFkbWluPy5jb21wb25lbnRzPy5lbGVtZW50cz8uUHVibGlzaEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxTYXZlXG4gICAgICAgICAgICAgICAgICAgIEN1c3RvbUNvbXBvbmVudD17XG4gICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbj8uYWRtaW4/LmNvbXBvbmVudHM/LmVkaXQ/LlNhdmVCdXR0b24gfHxcbiAgICAgICAgICAgICAgICAgICAgICBnbG9iYWw/LmFkbWluPy5jb21wb25lbnRzPy5lbGVtZW50cz8uU2F2ZUJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtzaG93RG90TWVudSAmJiAoXG4gICAgICAgICAgICA8UG9wdXBcbiAgICAgICAgICAgICAgYnV0dG9uPXtcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fZG90c2B9PlxuICAgICAgICAgICAgICAgICAgPGRpdiAvPlxuICAgICAgICAgICAgICAgICAgPGRpdiAvPlxuICAgICAgICAgICAgICAgICAgPGRpdiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fcG9wdXBgfVxuICAgICAgICAgICAgICBob3Jpem9udGFsQWxpZ249XCJyaWdodFwiXG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ249XCJib3R0b21cIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8UG9wdXBMaXN0LkJ1dHRvbkdyb3VwPlxuICAgICAgICAgICAgICAgIHtoYXNDcmVhdGVQZXJtaXNzaW9uICYmIChcbiAgICAgICAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICAgICAgICAgICAgPFBvcHVwTGlzdC5CdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBpZD1cImFjdGlvbi1jcmVhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgIHRvPXtgJHthZG1pblJvdXRlfS9jb2xsZWN0aW9ucy8ke2NvbGxlY3Rpb24/LnNsdWd9L2NyZWF0ZWB9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7dCgnY3JlYXRlTmV3Jyl9XG4gICAgICAgICAgICAgICAgICAgIDwvUG9wdXBMaXN0LkJ1dHRvbj5cblxuICAgICAgICAgICAgICAgICAgICB7IWNvbGxlY3Rpb24/LmFkbWluPy5kaXNhYmxlRHVwbGljYXRlICYmIGlzRWRpdGluZyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPER1cGxpY2F0ZURvY3VtZW50IGNvbGxlY3Rpb249e2NvbGxlY3Rpb259IGlkPXtpZH0gc2x1Zz17Y29sbGVjdGlvbj8uc2x1Z30gLz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICB7aGFzRGVsZXRlUGVybWlzc2lvbiAmJiAoXG4gICAgICAgICAgICAgICAgICA8RGVsZXRlRG9jdW1lbnQgYnV0dG9uSWQ9XCJhY3Rpb24tZGVsZXRlXCIgY29sbGVjdGlvbj17Y29sbGVjdGlvbn0gaWQ9e2lkfSAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvUG9wdXBMaXN0LkJ1dHRvbkdyb3VwPlxuICAgICAgICAgICAgPC9Qb3B1cD5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2RpdmlkZXJgfSAvPlxuICAgIDwvR3V0dGVyPlxuICApXG59XG4iXSwibmFtZXMiOlsiRG9jdW1lbnRDb250cm9scyIsImJhc2VDbGFzcyIsInByb3BzIiwiaWQiLCJjb2xsZWN0aW9uIiwiZGF0YSIsImRpc2FibGVBY3Rpb25zIiwiZ2xvYmFsIiwiaGFzU2F2ZVBlcm1pc3Npb24iLCJpc0FjY291bnRWaWV3IiwiaXNFZGl0aW5nIiwib25TYXZlIiwicGVybWlzc2lvbnMiLCJzbHVnIiwicHVibGlzaGVkRG9jIiwidXNlRG9jdW1lbnRJbmZvIiwiYWRtaW4iLCJkYXRlRm9ybWF0IiwiY29sbGVjdGlvbnMiLCJnbG9iYWxzIiwicm91dGVzIiwiYWRtaW5Sb3V0ZSIsInVzZUNvbmZpZyIsImNvbGxlY3Rpb25Db25maWciLCJmaW5kIiwiY29sbCIsImdsb2JhbENvbmZpZyIsImkxOG4iLCJ0IiwidXNlVHJhbnNsYXRpb24iLCJoYXNDcmVhdGVQZXJtaXNzaW9uIiwiY3JlYXRlIiwicGVybWlzc2lvbiIsImhhc0RlbGV0ZVBlcm1pc3Npb24iLCJkZWxldGUiLCJzaG93RG90TWVudSIsIkJvb2xlYW4iLCJjb2xsZWN0aW9uTGFiZWwiLCJsYWJlbCIsImxhYmVscyIsInNpbmd1bGFyIiwiZ2V0VHJhbnNsYXRpb24iLCJ1bnNhdmVkRHJhZnRXaXRoVmFsaWRhdGlvbnMiLCJ2ZXJzaW9ucyIsImRyYWZ0cyIsInZhbGlkYXRlIiwiR3V0dGVyIiwiY2xhc3NOYW1lIiwiZGl2IiwidWwiLCJsaSIsInAiLCJGcmFnbWVudCIsImZpbHRlciIsImpvaW4iLCJTdGF0dXMiLCJhdXRvc2F2ZSIsIkF1dG9zYXZlIiwicHVibGlzaGVkRG9jVXBkYXRlZEF0IiwidXBkYXRlZEF0IiwiY3JlYXRlZEF0IiwidGltZXN0YW1wcyIsInRpdGxlIiwiZm9ybWF0RGF0ZSIsImxhbmd1YWdlIiwicHJldmlldyIsIlByZXZpZXdCdXR0b24iLCJDdXN0b21Db21wb25lbnQiLCJjb21wb25lbnRzIiwiZWRpdCIsImVsZW1lbnRzIiwiZ2VuZXJhdGVQcmV2aWV3VVJMIiwiUmVhY3QiLCJTYXZlRHJhZnQiLCJTYXZlRHJhZnRCdXR0b24iLCJQdWJsaXNoIiwiUHVibGlzaEJ1dHRvbiIsIlNhdmUiLCJTYXZlQnV0dG9uIiwiUG9wdXAiLCJidXR0b24iLCJob3Jpem9udGFsQWxpZ24iLCJzaXplIiwidmVydGljYWxBbGlnbiIsIlBvcHVwTGlzdCIsIkJ1dHRvbkdyb3VwIiwiQnV0dG9uIiwidG8iLCJkaXNhYmxlRHVwbGljYXRlIiwiRHVwbGljYXRlRG9jdW1lbnQiLCJEZWxldGVEb2N1bWVudCIsImJ1dHRvbklkIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OytCQTJCYUE7OztlQUFBQTs7OytEQTNCbUI7OEJBQ0Q7Z0NBT0E7NEJBQ0o7d0JBQ0Q7OEJBQ007aUVBQ1g7dUVBQ007MEVBQ0c7d0JBQ1A7OERBQ0w7eUVBQ1M7c0VBQ0Q7eUJBQ0Y7c0JBQ0g7MkJBQ0s7K0RBQ1A7UUFDWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFUCxNQUFNQyxZQUFZO0FBRVgsTUFBTUQsbUJBWVIsQ0FBQ0U7SUFDSixNQUFNLEVBQ0pDLEVBQUUsRUFDRkMsVUFBVSxFQUNWQyxJQUFJLEVBQ0pDLGNBQWMsRUFDZEMsTUFBTSxFQUNOQyxpQkFBaUIsRUFDakJDLGFBQWEsRUFDYkMsU0FBUyxFQUNUQyxNQUFNLEVBQ05DLFdBQVcsRUFDWixHQUFHVjtJQUVKLE1BQU0sRUFBRVcsSUFBSSxFQUFFQyxZ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