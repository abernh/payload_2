"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LivePreviewView", {
    enumerable: true,
    get: function() {
        return LivePreviewView;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reacti18next = require("react-i18next");
const _getTranslation = require("../../../../utilities/getTranslation");
const _DocumentControls = require("../../elements/DocumentControls");
const _DocumentFields = require("../../elements/DocumentFields");
const _LeaveWithoutSaving = require("../../modals/LeaveWithoutSaving");
const _ActionsProvider = require("../../utilities/ActionsProvider");
const _Config = require("../../utilities/Config");
const _DocumentInfo = require("../../utilities/DocumentInfo");
const _Locale = require("../../utilities/Locale");
const _Meta = /*#__PURE__*/ _interop_require_default(require("../../utilities/Meta"));
const _SetStepNav = require("../collections/Edit/SetStepNav");
const _Context = require("./Context");
const _context = require("./Context/context");
const _Preview = require("./Preview");
require("./index.scss");
const _usePopupWindow = require("./usePopupWindow");
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
const baseClass = 'live-preview';
const PreviewView = (props)=>{
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const { previewWindowType } = (0, _context.useLivePreviewContext)();
    const { apiURL, data, fieldTypes, permissions } = props;
    let collection;
    let global;
    let disableActions;
    let disableLeaveWithoutSaving;
    let hasSavePermission;
    let isEditing;
    let id;
    let fields = [];
    let label;
    let description;
    if ('collection' in props) {
        collection = props?.collection;
        disableActions = props?.disableActions;
        disableLeaveWithoutSaving = props?.disableLeaveWithoutSaving;
        hasSavePermission = props?.hasSavePermission;
        isEditing = props?.isEditing;
        id = props?.id;
        fields = props?.collection?.fields;
    }
    if ('global' in props) {
        global = props?.global;
        fields = props?.global?.fields;
        label = props?.global?.label;
        description = props?.global?.admin?.description;
        hasSavePermission = permissions?.update?.permission;
    }
    return /*#__PURE__*/ _react.default.createElement(_react.Fragment, null, collection && /*#__PURE__*/ _react.default.createElement(_Meta.default, {
        description: t('editing'),
        keywords: `${(0, _getTranslation.getTranslation)(collection.labels.singular, i18n)}, Payload, CMS`,
        title: `${isEditing ? t('editing') : t('creating')} - ${(0, _getTranslation.getTranslation)(collection.labels.singular, i18n)}`
    }), global && /*#__PURE__*/ _react.default.createElement(_Meta.default, {
        description: (0, _getTranslation.getTranslation)(label, i18n),
        keywords: `${(0, _getTranslation.getTranslation)(label, i18n)}, Payload, CMS`,
        title: (0, _getTranslation.getTranslation)(label, i18n)
    }), (collection && !(collection.versions?.drafts && collection.versions?.drafts?.autosave) || global && !(global.versions?.drafts && global.versions?.drafts?.autosave)) && !disableLeaveWithoutSaving && /*#__PURE__*/ _react.default.createElement(_LeaveWithoutSaving.LeaveWithoutSaving, null), /*#__PURE__*/ _react.default.createElement(_SetStepNav.SetStepNav, {
        collection: collection,
        global: global,
        id: id,
        isEditing: isEditing,
        view: t('livePreview')
    }), /*#__PURE__*/ _react.default.createElement(_DocumentControls.DocumentControls, {
        apiURL: apiURL,
        collection: collection,
        data: data,
        disableActions: disableActions,
        global: global,
        hasSavePermission: hasSavePermission,
        id: id,
        isEditing: isEditing,
        permissions: permissions
    }), /*#__PURE__*/ _react.default.createElement("div", {
        className: [
            baseClass,
            previewWindowType === 'popup' && `${baseClass}--detached`
        ].filter(Boolean).join(' ')
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: [
            `${baseClass}__main`,
            previewWindowType === 'popup' && `${baseClass}__main--popup-open`
        ].filter(Boolean).join(' ')
    }, /*#__PURE__*/ _react.default.createElement(_DocumentFields.DocumentFields, {
        description: description,
        fieldTypes: fieldTypes,
        fields: fields,
        forceRenderAllFields: collection?.admin?.forceRenderAllFields ?? global?.admin?.forceRenderAllFields ?? false,
        forceSidebarWrap: true,
        hasSavePermission: hasSavePermission,
        permissions: permissions
    })), /*#__PURE__*/ _react.default.createElement(_Preview.LivePreview, props)));
};
const LivePreviewView = (props)=>{
    const { data } = props;
    const config = (0, _Config.useConfig)();
    const documentInfo = (0, _DocumentInfo.useDocumentInfo)();
    const locale = (0, _Locale.useLocale)();
    const { setViewActions } = (0, _ActionsProvider.useActions)();
    const collection = documentInfo.collection;
    const global = documentInfo.global;
    let livePreviewConfig = config?.admin?.livePreview;
    if ('collection' in props) {
        livePreviewConfig = {
            ...livePreviewConfig || {},
            ...props?.collection.admin.livePreview || {}
        };
    }
    if ('global' in props) {
        livePreviewConfig = {
            ...livePreviewConfig || {},
            ...props?.global.admin.livePreview || {}
        };
    }
    const [url, setURL] = _react.default.useState(()=>{
        if (typeof livePreviewConfig?.url === 'string') return livePreviewConfig?.url;
    });
    (0, _react.useEffect)(()=>{
        const getURL = async ()=>{
            const newURL = typeof livePreviewConfig?.url === 'function' ? await livePreviewConfig.url({
                data,
                documentInfo,
                locale
            }) : livePreviewConfig?.url;
            setURL(newURL);
        };
        getURL() // eslint-disable-line @typescript-eslint/no-floating-promises
        ;
    }, [
        data,
        documentInfo,
        locale,
        livePreviewConfig
    ]);
    (0, _react.useEffect)(()=>{
        const editConfig = (collection || global)?.admin?.components?.views?.Edit;
        const livePreviewActions = editConfig && 'LivePreview' in editConfig && 'actions' in editConfig.LivePreview ? editConfig.LivePreview.actions : [];
        setViewActions(livePreviewActions);
        return ()=>{
            setViewActions([]);
        };
    }, [
        collection,
        global,
        setViewActions
    ]);
    const breakpoints = [
        ...livePreviewConfig?.breakpoints || [],
        {
            name: 'responsive',
            height: '100%',
            label: 'Responsive',
            width: '100%'
        }
    ];
    const { isPopupOpen, openPopupWindow, popupRef } = (0, _usePopupWindow.usePopupWindow)({
        eventType: 'payload-live-preview',
        url
    });
    return /*#__PURE__*/ _react.default.createElement(_Context.LivePreviewProvider, {
        ...props,
        breakpoints: breakpoints,
        isPopupOpen: isPopupOpen,
        openPopupWindow: openPopupWindow,
        popupRef: popupRef,
        url: url
    }, /*#__PURE__*/ _react.default.createElement(PreviewView, props));
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL0xpdmVQcmV2aWV3L2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgRnJhZ21lbnQsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuXG5pbXBvcnQgdHlwZSB7IFNhbml0aXplZENvbGxlY3Rpb25Db25maWcgfSBmcm9tICcuLi8uLi8uLi8uLi9jb2xsZWN0aW9ucy9jb25maWcvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IExpdmVQcmV2aWV3Q29uZmlnIH0gZnJvbSAnLi4vLi4vLi4vLi4vZXhwb3J0cy9jb25maWcnXG5pbXBvcnQgdHlwZSB7IEZpZWxkIH0gZnJvbSAnLi4vLi4vLi4vLi4vZmllbGRzL2NvbmZpZy90eXBlcydcbmltcG9ydCB0eXBlIHsgU2FuaXRpemVkR2xvYmFsQ29uZmlnIH0gZnJvbSAnLi4vLi4vLi4vLi4vZ2xvYmFscy9jb25maWcvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEZpZWxkVHlwZXMgfSBmcm9tICcuLi8uLi9mb3Jtcy9maWVsZC10eXBlcydcbmltcG9ydCB0eXBlIHsgRWRpdFZpZXdQcm9wcyB9IGZyb20gJy4uL3R5cGVzJ1xuXG5pbXBvcnQgeyBnZXRUcmFuc2xhdGlvbiB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdGllcy9nZXRUcmFuc2xhdGlvbidcbmltcG9ydCB7IERvY3VtZW50Q29udHJvbHMgfSBmcm9tICcuLi8uLi9lbGVtZW50cy9Eb2N1bWVudENvbnRyb2xzJ1xuaW1wb3J0IHsgRG9jdW1lbnRGaWVsZHMgfSBmcm9tICcuLi8uLi9lbGVtZW50cy9Eb2N1bWVudEZpZWxkcydcbmltcG9ydCB7IExlYXZlV2l0aG91dFNhdmluZyB9IGZyb20gJy4uLy4uL21vZGFscy9MZWF2ZVdpdGhvdXRTYXZpbmcnXG5pbXBvcnQgeyB1c2VBY3Rpb25zIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL0FjdGlvbnNQcm92aWRlcidcbmltcG9ydCB7IHVzZUNvbmZpZyB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9Db25maWcnXG5pbXBvcnQgeyB1c2VEb2N1bWVudEluZm8gfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvRG9jdW1lbnRJbmZvJ1xuaW1wb3J0IHsgdXNlTG9jYWxlIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL0xvY2FsZSdcbmltcG9ydCBNZXRhIGZyb20gJy4uLy4uL3V0aWxpdGllcy9NZXRhJ1xuaW1wb3J0IHsgU2V0U3RlcE5hdiB9IGZyb20gJy4uL2NvbGxlY3Rpb25zL0VkaXQvU2V0U3RlcE5hdidcbmltcG9ydCB7IExpdmVQcmV2aWV3UHJvdmlkZXIgfSBmcm9tICcuL0NvbnRleHQnXG5pbXBvcnQgeyB1c2VMaXZlUHJldmlld0NvbnRleHQgfSBmcm9tICcuL0NvbnRleHQvY29udGV4dCdcbmltcG9ydCB7IExpdmVQcmV2aWV3IH0gZnJvbSAnLi9QcmV2aWV3J1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5pbXBvcnQgeyB1c2VQb3B1cFdpbmRvdyB9IGZyb20gJy4vdXNlUG9wdXBXaW5kb3cnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdsaXZlLXByZXZpZXcnXG5cbmNvbnN0IFByZXZpZXdWaWV3OiBSZWFjdC5GQzxcbiAgRWRpdFZpZXdQcm9wcyAmIHtcbiAgICBmaWVsZFR5cGVzOiBGaWVsZFR5cGVzXG4gIH1cbj4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBpMThuLCB0IH0gPSB1c2VUcmFuc2xhdGlvbignZ2VuZXJhbCcpXG4gIGNvbnN0IHsgcHJldmlld1dpbmRvd1R5cGUgfSA9IHVzZUxpdmVQcmV2aWV3Q29udGV4dCgpXG5cbiAgY29uc3QgeyBhcGlVUkwsIGRhdGEsIGZpZWxkVHlwZXMsIHBlcm1pc3Npb25zIH0gPSBwcm9wc1xuXG4gIGxldCBjb2xsZWN0aW9uOiBTYW5pdGl6ZWRDb2xsZWN0aW9uQ29uZmlnXG4gIGxldCBnbG9iYWw6IFNhbml0aXplZEdsb2JhbENvbmZpZ1xuICBsZXQgZGlzYWJsZUFjdGlvbnM6IGJvb2xlYW5cbiAgbGV0IGRpc2FibGVMZWF2ZVdpdGhvdXRTYXZpbmc6IGJvb2xlYW5cbiAgbGV0IGhhc1NhdmVQZXJtaXNzaW9uOiBib29sZWFuXG4gIGxldCBpc0VkaXRpbmc6IGJvb2xlYW5cbiAgbGV0IGlkOiBzdHJpbmdcbiAgbGV0IGZpZWxkczogRmllbGRbXSA9IFtdXG4gIGxldCBsYWJlbDogU2FuaXRpemVkR2xvYmFsQ29uZmlnWydsYWJlbCddXG4gIGxldCBkZXNjcmlwdGlvbjogU2FuaXRpemVkR2xvYmFsQ29uZmlnWydhZG1pbiddWydkZXNjcmlwdGlvbiddXG5cbiAgaWYgKCdjb2xsZWN0aW9uJyBpbiBwcm9wcykge1xuICAgIGNvbGxlY3Rpb24gPSBwcm9wcz8uY29sbGVjdGlvblxuICAgIGRpc2FibGVBY3Rpb25zID0gcHJvcHM/LmRpc2FibGVBY3Rpb25zXG4gICAgZGlzYWJsZUxlYXZlV2l0aG91dFNhdmluZyA9IHByb3BzPy5kaXNhYmxlTGVhdmVXaXRob3V0U2F2aW5nXG4gICAgaGFzU2F2ZVBlcm1pc3Npb24gPSBwcm9wcz8uaGFzU2F2ZVBlcm1pc3Npb25cbiAgICBpc0VkaXRpbmcgPSBwcm9wcz8uaXNFZGl0aW5nXG4gICAgaWQgPSBwcm9wcz8uaWRcbiAgICBmaWVsZHMgPSBwcm9wcz8uY29sbGVjdGlvbj8uZmllbGRzXG4gIH1cblxuICBpZiAoJ2dsb2JhbCcgaW4gcHJvcHMpIHtcbiAgICBnbG9iYWwgPSBwcm9wcz8uZ2xvYmFsXG4gICAgZmllbGRzID0gcHJvcHM/Lmdsb2JhbD8uZmllbGRzXG4gICAgbGFiZWwgPSBwcm9wcz8uZ2xvYmFsPy5sYWJlbFxuICAgIGRlc2NyaXB0aW9uID0gcHJvcHM/Lmdsb2JhbD8uYWRtaW4/LmRlc2NyaXB0aW9uXG4gICAgaGFzU2F2ZVBlcm1pc3Npb24gPSBwZXJtaXNzaW9ucz8udXBkYXRlPy5wZXJtaXNzaW9uXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxGcmFnbWVudD5cbiAgICAgIHtjb2xsZWN0aW9uICYmIChcbiAgICAgICAgPE1ldGFcbiAgICAgICAgICBkZXNjcmlwdGlvbj17dCgnZWRpdGluZycpfVxuICAgICAgICAgIGtleXdvcmRzPXtgJHtnZXRUcmFuc2xhdGlvbihjb2xsZWN0aW9uLmxhYmVscy5zaW5ndWxhciwgaTE4bil9LCBQYXlsb2FkLCBDTVNgfVxuICAgICAgICAgIHRpdGxlPXtgJHtpc0VkaXRpbmcgPyB0KCdlZGl0aW5nJykgOiB0KCdjcmVhdGluZycpfSAtICR7Z2V0VHJhbnNsYXRpb24oXG4gICAgICAgICAgICBjb2xsZWN0aW9uLmxhYmVscy5zaW5ndWxhcixcbiAgICAgICAgICAgIGkxOG4sXG4gICAgICAgICAgKX1gfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtnbG9iYWwgJiYgKFxuICAgICAgICA8TWV0YVxuICAgICAgICAgIGRlc2NyaXB0aW9uPXtnZXRUcmFuc2xhdGlvbihsYWJlbCwgaTE4bil9XG4gICAgICAgICAga2V5d29yZHM9e2Ake2dldFRyYW5zbGF0aW9uKGxhYmVsLCBpMThuKX0sIFBheWxvYWQsIENNU2B9XG4gICAgICAgICAgdGl0bGU9e2dldFRyYW5zbGF0aW9uKGxhYmVsLCBpMThuKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7KChjb2xsZWN0aW9uICYmICEoY29sbGVjdGlvbi52ZXJzaW9ucz8uZHJhZnRzICYmIGNvbGxlY3Rpb24udmVyc2lvbnM/LmRyYWZ0cz8uYXV0b3NhdmUpKSB8fFxuICAgICAgICAoZ2xvYmFsICYmICEoZ2xvYmFsLnZlcnNpb25zPy5kcmFmdHMgJiYgZ2xvYmFsLnZlcnNpb25zPy5kcmFmdHM/LmF1dG9zYXZlKSkpICYmXG4gICAgICAgICFkaXNhYmxlTGVhdmVXaXRob3V0U2F2aW5nICYmIDxMZWF2ZVdpdGhvdXRTYXZpbmcgLz59XG4gICAgICA8U2V0U3RlcE5hdlxuICAgICAgICBjb2xsZWN0aW9uPXtjb2xsZWN0aW9ufVxuICAgICAgICBnbG9iYWw9e2dsb2JhbH1cbiAgICAgICAgaWQ9e2lkfVxuICAgICAgICBpc0VkaXRpbmc9e2lzRWRpdGluZ31cbiAgICAgICAgdmlldz17dCgnbGl2ZVByZXZpZXcnKX1cbiAgICAgIC8+XG4gICAgICA8RG9jdW1lbnRDb250cm9sc1xuICAgICAgICBhcGlVUkw9e2FwaVVSTH1cbiAgICAgICAgY29sbGVjdGlvbj17Y29sbGVjdGlvbn1cbiAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgZGlzYWJsZUFjdGlvbnM9e2Rpc2FibGVBY3Rpb25zfVxuICAgICAgICBnbG9iYWw9e2dsb2JhbH1cbiAgICAgICAgaGFzU2F2ZVBlcm1pc3Npb249e2hhc1NhdmVQZXJtaXNzaW9ufVxuICAgICAgICBpZD17aWR9XG4gICAgICAgIGlzRWRpdGluZz17aXNFZGl0aW5nfVxuICAgICAgICBwZXJtaXNzaW9ucz17cGVybWlzc2lvbnN9XG4gICAgICAvPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e1tiYXNlQ2xhc3MsIHByZXZpZXdXaW5kb3dUeXBlID09PSAncG9wdXAnICYmIGAke2Jhc2VDbGFzc30tLWRldGFjaGVkYF1cbiAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgLmpvaW4oJyAnKX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17W1xuICAgICAgICAgICAgYCR7YmFzZUNsYXNzfV9fbWFpbmAsXG4gICAgICAgICAgICBwcmV2aWV3V2luZG93VHlwZSA9PT0gJ3BvcHVwJyAmJiBgJHtiYXNlQ2xhc3N9X19tYWluLS1wb3B1cC1vcGVuYCxcbiAgICAgICAgICBdXG4gICAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgICAuam9pbignICcpfVxuICAgICAgICA+XG4gICAgICAgICAgPERvY3VtZW50RmllbGRzXG4gICAgICAgICAgICBkZXNjcmlwdGlvbj17ZGVzY3JpcHRpb259XG4gICAgICAgICAgICBmaWVsZFR5cGVzPXtmaWVsZFR5cGVzfVxuICAgICAgICAgICAgZmllbGRzPXtmaWVsZHN9XG4gICAgICAgICAgICBmb3JjZVJlbmRlckFsbEZpZWxkcz17XG4gICAgICAgICAgICAgIGNvbGxlY3Rpb24/LmFkbWluPy5mb3JjZVJlbmRlckFsbEZpZWxkcyA/P1xuICAgICAgICAgICAgICBnbG9iYWw/LmFkbWluPy5mb3JjZVJlbmRlckFsbEZpZWxkcyA/P1xuICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yY2VTaWRlYmFyV3JhcFxuICAgICAgICAgICAgaGFzU2F2ZVBlcm1pc3Npb249e2hhc1NhdmVQZXJtaXNzaW9ufVxuICAgICAgICAgICAgcGVybWlzc2lvbnM9e3Blcm1pc3Npb25zfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8TGl2ZVByZXZpZXcgey4uLnByb3BzfSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9GcmFnbWVudD5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgTGl2ZVByZXZpZXdWaWV3OiBSZWFjdC5GQzxcbiAgRWRpdFZpZXdQcm9wcyAmIHtcbiAgICBmaWVsZFR5cGVzOiBGaWVsZFR5cGVzXG4gIH1cbj4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBkYXRhIH0gPSBwcm9wc1xuICBjb25zdCBjb25maWcgPSB1c2VDb25maWcoKVxuICBjb25zdCBkb2N1bWVudEluZm8gPSB1c2VEb2N1bWVudEluZm8oKVxuICBjb25zdCBsb2NhbGUgPSB1c2VMb2NhbGUoKVxuXG4gIGNvbnN0IHsgc2V0Vmlld0FjdGlvbnMgfSA9IHVzZUFjdGlvbnMoKVxuXG4gIGNvbnN0IGNvbGxlY3Rpb24gPSBkb2N1bWVudEluZm8uY29sbGVjdGlvblxuICBjb25zdCBnbG9iYWwgPSBkb2N1bWVudEluZm8uZ2xvYmFsXG5cbiAgbGV0IGxpdmVQcmV2aWV3Q29uZmlnOiBMaXZlUHJldmlld0NvbmZpZyA9IGNvbmZpZz8uYWRtaW4/LmxpdmVQcmV2aWV3XG5cbiAgaWYgKCdjb2xsZWN0aW9uJyBpbiBwcm9wcykge1xuICAgIGxpdmVQcmV2aWV3Q29uZmlnID0ge1xuICAgICAgLi4uKGxpdmVQcmV2aWV3Q29uZmlnIHx8IHt9KSxcbiAgICAgIC4uLihwcm9wcz8uY29sbGVjdGlvbi5hZG1pbi5saXZlUHJldmlldyB8fCB7fSksXG4gICAgfVxuICB9XG5cbiAgaWYgKCdnbG9iYWwnIGluIHByb3BzKSB7XG4gICAgbGl2ZVByZXZpZXdDb25maWcgPSB7XG4gICAgICAuLi4obGl2ZVByZXZpZXdDb25maWcgfHwge30pLFxuICAgICAgLi4uKHByb3BzPy5nbG9iYWwuYWRtaW4ubGl2ZVByZXZpZXcgfHwge30pLFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IFt1cmwsIHNldFVSTF0gPSBSZWFjdC51c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KCgpID0+IHtcbiAgICBpZiAodHlwZW9mIGxpdmVQcmV2aWV3Q29uZmlnPy51cmwgPT09ICdzdHJpbmcnKSByZXR1cm4gbGl2ZVByZXZpZXdDb25maWc/LnVybFxuICB9KVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgZ2V0VVJMID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbmV3VVJMID1cbiAgICAgICAgdHlwZW9mIGxpdmVQcmV2aWV3Q29uZmlnPy51cmwgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICA/IGF3YWl0IGxpdmVQcmV2aWV3Q29uZmlnLnVybCh7XG4gICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgIGRvY3VtZW50SW5mbyxcbiAgICAgICAgICAgICAgbG9jYWxlLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICA6IGxpdmVQcmV2aWV3Q29uZmlnPy51cmxcblxuICAgICAgc2V0VVJMKG5ld1VSTClcbiAgICB9XG5cbiAgICBnZXRVUkwoKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xuICB9LCBbZGF0YSwgZG9jdW1lbnRJbmZvLCBsb2NhbGUsIGxpdmVQcmV2aWV3Q29uZmlnXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGVkaXRDb25maWcgPSAoY29sbGVjdGlvbiB8fCBnbG9iYWwpPy5hZG1pbj8uY29tcG9uZW50cz8udmlld3M/LkVkaXRcbiAgICBjb25zdCBsaXZlUHJldmlld0FjdGlvbnMgPVxuICAgICAgZWRpdENvbmZpZyAmJiAnTGl2ZVByZXZpZXcnIGluIGVkaXRDb25maWcgJiYgJ2FjdGlvbnMnIGluIGVkaXRDb25maWcuTGl2ZVByZXZpZXdcbiAgICAgICAgPyBlZGl0Q29uZmlnLkxpdmVQcmV2aWV3LmFjdGlvbnNcbiAgICAgICAgOiBbXVxuXG4gICAgc2V0Vmlld0FjdGlvbnMobGl2ZVByZXZpZXdBY3Rpb25zKVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHNldFZpZXdBY3Rpb25zKFtdKVxuICAgIH1cbiAgfSwgW2NvbGxlY3Rpb24sIGdsb2JhbCwgc2V0Vmlld0FjdGlvbnNdKVxuXG4gIGNvbnN0IGJyZWFrcG9pbnRzOiBMaXZlUHJldmlld0NvbmZpZ1snYnJlYWtwb2ludHMnXSA9IFtcbiAgICAuLi4obGl2ZVByZXZpZXdDb25maWc/LmJyZWFrcG9pbnRzIHx8IFtdKSxcbiAgICB7XG4gICAgICBuYW1lOiAncmVzcG9uc2l2ZScsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIGxhYmVsOiAnUmVzcG9uc2l2ZScsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgIH0sXG4gIF1cblxuICBjb25zdCB7IGlzUG9wdXBPcGVuLCBvcGVuUG9wdXBXaW5kb3csIHBvcHVwUmVmIH0gPSB1c2VQb3B1cFdpbmRvdyh7XG4gICAgZXZlbnRUeXBlOiAncGF5bG9hZC1saXZlLXByZXZpZXcnLFxuICAgIHVybCxcbiAgfSlcblxuICByZXR1cm4gKFxuICAgIDxMaXZlUHJldmlld1Byb3ZpZGVyXG4gICAgICB7Li4ucHJvcHN9XG4gICAgICBicmVha3BvaW50cz17YnJlYWtwb2ludHN9XG4gICAgICBpc1BvcHVwT3Blbj17aXNQb3B1cE9wZW59XG4gICAgICBvcGVuUG9wdXBXaW5kb3c9e29wZW5Qb3B1cFdpbmRvd31cbiAgICAgIHBvcHVwUmVmPXtwb3B1cFJlZn1cbiAgICAgIHVybD17dXJsfVxuICAgID5cbiAgICAgIDxQcmV2aWV3VmlldyB7Li4ucHJvcHN9IC8+XG4gICAgPC9MaXZlUHJldmlld1Byb3ZpZGVyPlxuICApXG59XG4iXSwibmFtZXMiOlsiTGl2ZVByZXZpZXdWaWV3IiwiYmFzZUNsYXNzIiwiUHJldmlld1ZpZXciLCJwcm9wcyIsImkxOG4iLCJ0IiwidXNlVHJhbnNsYXRpb24iLCJwcmV2aWV3V2luZG93VHlwZSIsInVzZUxpdmVQcmV2aWV3Q29udGV4dCIsImFwaVVSTCIsImRhdGEiLCJmaWVsZFR5cGVzIiwicGVybWlzc2lvbnMiLCJjb2xsZWN0aW9uIiwiZ2xvYmFsIiwiZGlzYWJsZUFjdGlvbnMiLCJkaXNhYmxlTGVhdmVXaXRob3V0U2F2aW5nIiwiaGFzU2F2ZVBlcm1pc3Npb24iLCJpc0VkaXRpbmciLCJpZCIsImZpZWxkcyIsImxhYmVsIiwiZGVzY3JpcHRpb24iLCJhZG1pbiIsInVwZGF0ZSIsInBlcm1pc3Npb24iLCJGcmFnbWVudCIsIk1ldGEiLCJrZXl3b3JkcyIsImdldFRyYW5zbGF0aW9uIiwibGFiZWxzIiwic2luZ3VsYXIiLCJ0aXRsZSIsInZlcnNpb25zIiwiZHJhZnRzIiwiYXV0b3NhdmUiLCJMZWF2ZVdpdGhvdXRTYXZpbmciLCJTZXRTdGVwTmF2IiwidmlldyIsIkRvY3VtZW50Q29udHJvbHMiLCJkaXYiLCJjbGFzc05hbWUiLCJmaWx0ZXIiLCJCb29sZWFuIiwiam9pbiIsIkRvY3VtZW50RmllbGRzIiwiZm9yY2VSZW5kZXJBbGxGaWVsZHMiLCJmb3JjZVNpZGViYXJXcmFwIiwiTGl2ZVByZXZpZXciLCJjb25maWciLCJ1c2VDb25maWciLCJkb2N1bWVudEluZm8iLCJ1c2VEb2N1bWVudEluZm8iLCJsb2NhbGUiLCJ1c2VMb2NhbGUiLCJzZXRWaWV3QWN0aW9ucyIsInVzZUFjdGlvbnMiLCJsaXZlUHJldmlld0NvbmZpZyIsImxpdmVQcmV2aWV3IiwidXJsIiwic2V0VVJMIiwiUmVhY3QiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsImdldFVSTCIsIm5ld1VSTCIsImVkaXRDb25maWciLCJjb21wb25lbnRzIiwidmlld3MiLCJFZGl0IiwibGl2ZVByZXZpZXdBY3Rpb25zIiwiYWN0aW9ucyIsImJyZWFrcG9pbnRzIiwibmFtZSIsImhlaWdodCIsIndpZHRoIiwiaXNQb3B1cE9wZW4iLCJvcGVuUG9wdXBXaW5kb3ciLCJwb3B1cFJlZiIsInVzZVBvcHVwV2luZG93IiwiZXZlbnRUeXBlIiwiTGl2ZVByZXZpZXdQcm92aWRlciJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7K0JBNElhQTs7O2VBQUFBOzs7K0RBNUk4Qjs4QkFDWjtnQ0FTQTtrQ0FDRTtnQ0FDRjtvQ0FDSTtpQ0FDUjt3QkFDRDs4QkFDTTt3QkFDTjs2REFDVDs0QkFDVTt5QkFDUzt5QkFDRTt5QkFDVjtRQUNyQjtnQ0FDd0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRS9CLE1BQU1DLFlBQVk7QUFFbEIsTUFBTUMsY0FJRixDQUFDQztJQUNILE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxDQUFDLEVBQUUsR0FBR0MsSUFBQUEsNEJBQWMsRUFBQztJQUNuQyxNQUFNLEVB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