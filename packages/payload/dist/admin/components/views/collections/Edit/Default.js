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
const _getTranslation = require("../../../../../utilities/getTranslation");
const _DocumentHeader = require("../../../elements/DocumentHeader");
const _Loading = require("../../../elements/Loading");
const _Form = /*#__PURE__*/ _interop_require_default(require("../../../forms/Form"));
const _ActionsProvider = require("../../../utilities/ActionsProvider");
const _Auth = require("../../../utilities/Auth");
const _DocumentEvents = require("../../../utilities/DocumentEvents");
const _OperationProvider = require("../../../utilities/OperationProvider");
const _Routes = require("./Routes");
const _CustomComponent = require("./Routes/CustomComponent");
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
const baseClass = 'collection-edit';
const DefaultEditView = (props)=>{
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const { refreshCookieAsync, user } = (0, _Auth.useAuth)();
    const { id, action, apiURL, collection, customHeader, data, disableRoutes, fieldTypes, hasSavePermission, internalState, isEditing, isLoading, onSave: onSaveFromProps } = props;
    const { setViewActions } = (0, _ActionsProvider.useActions)();
    const { reportUpdate } = (0, _DocumentEvents.useDocumentEvents)();
    const { auth } = collection;
    const classes = [
        baseClass,
        `${baseClass}--${collection.slug}`,
        isEditing && `${baseClass}--is-editing`
    ].filter(Boolean).join(' ');
    const location = (0, _reactrouterdom.useLocation)();
    const onSave = (0, _react.useCallback)(async (json)=>{
        reportUpdate({
            id,
            entitySlug: collection.slug,
            updatedAt: json?.result?.updatedAt || new Date().toISOString()
        });
        if (auth && id === user.id) {
            await refreshCookieAsync();
        }
        if (typeof onSaveFromProps === 'function') {
            onSaveFromProps({
                ...json,
                operation: id ? 'update' : 'create'
            });
        }
    }, [
        id,
        onSaveFromProps,
        auth,
        user,
        refreshCookieAsync,
        collection,
        reportUpdate
    ]);
    const operation = isEditing ? 'update' : 'create';
    (0, _react.useEffect)(()=>{
        const path = location.pathname;
        if (!(path.endsWith(id) || path.endsWith('/create'))) {
            return;
        }
        const editConfig = collection?.admin?.components?.views?.Edit;
        const defaultActions = editConfig && 'Default' in editConfig && 'actions' in editConfig.Default ? editConfig.Default.actions : [];
        setViewActions(defaultActions);
        return ()=>{
            setViewActions([]);
        };
    }, [
        id,
        location.pathname,
        collection?.admin?.components?.views?.Edit,
        setViewActions
    ]);
    return /*#__PURE__*/ _react.default.createElement("main", {
        className: classes
    }, /*#__PURE__*/ _react.default.createElement(_OperationProvider.OperationContext.Provider, {
        value: operation
    }, /*#__PURE__*/ _react.default.createElement(_Form.default, {
        action: action,
        className: `${baseClass}__form`,
        disabled: !hasSavePermission,
        initialState: internalState,
        method: id ? 'patch' : 'post',
        onSuccess: onSave
    }, /*#__PURE__*/ _react.default.createElement(_Loading.FormLoadingOverlayToggle, {
        action: isLoading ? 'loading' : operation,
        formIsLoading: isLoading,
        loadingSuffix: (0, _getTranslation.getTranslation)(collection.labels.singular, i18n),
        name: `collection-edit--${typeof collection?.labels?.singular === 'string' ? collection.labels.singular : t('document')}`,
        type: "withoutNav"
    }), !isLoading && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(_DocumentHeader.DocumentHeader, {
        apiURL: apiURL,
        collection: collection,
        customHeader: customHeader,
        data: data,
        id: id,
        isEditing: isEditing
    }), disableRoutes ? /*#__PURE__*/ _react.default.createElement(_CustomComponent.CustomCollectionComponent, {
        view: "Default",
        ...props
    }) : /*#__PURE__*/ _react.default.createElement(_Routes.CollectionRoutes, {
        ...props,
        fieldTypes: fieldTypes
    })))));
};
const _default = DefaultEditView;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL2NvbGxlY3Rpb25zL0VkaXQvRGVmYXVsdC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZUxvY2F0aW9uIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSdcblxuaW1wb3J0IHR5cGUgeyBGaWVsZFR5cGVzIH0gZnJvbSAnLi4vLi4vLi4vZm9ybXMvZmllbGQtdHlwZXMnXG5pbXBvcnQgdHlwZSB7IENvbGxlY3Rpb25FZGl0Vmlld1Byb3BzIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5cbmltcG9ydCB7IGdldFRyYW5zbGF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbGl0aWVzL2dldFRyYW5zbGF0aW9uJ1xuaW1wb3J0IHsgRG9jdW1lbnRIZWFkZXIgfSBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9Eb2N1bWVudEhlYWRlcidcbmltcG9ydCB7IEZvcm1Mb2FkaW5nT3ZlcmxheVRvZ2dsZSB9IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0xvYWRpbmcnXG5pbXBvcnQgRm9ybSBmcm9tICcuLi8uLi8uLi9mb3Jtcy9Gb3JtJ1xuaW1wb3J0IHsgdXNlQWN0aW9ucyB9IGZyb20gJy4uLy4uLy4uL3V0aWxpdGllcy9BY3Rpb25zUHJvdmlkZXInXG5pbXBvcnQgeyB1c2VBdXRoIH0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0aWVzL0F1dGgnXG5pbXBvcnQgeyB1c2VEb2N1bWVudEV2ZW50cyB9IGZyb20gJy4uLy4uLy4uL3V0aWxpdGllcy9Eb2N1bWVudEV2ZW50cydcbmltcG9ydCB7IE9wZXJhdGlvbkNvbnRleHQgfSBmcm9tICcuLi8uLi8uLi91dGlsaXRpZXMvT3BlcmF0aW9uUHJvdmlkZXInXG5pbXBvcnQgeyBDb2xsZWN0aW9uUm91dGVzIH0gZnJvbSAnLi9Sb3V0ZXMnXG5pbXBvcnQgeyBDdXN0b21Db2xsZWN0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9Sb3V0ZXMvQ3VzdG9tQ29tcG9uZW50J1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdjb2xsZWN0aW9uLWVkaXQnXG5cbmV4cG9ydCB0eXBlIERlZmF1bHRFZGl0Vmlld1Byb3BzID0gQ29sbGVjdGlvbkVkaXRWaWV3UHJvcHMgJiB7XG4gIGN1c3RvbUhlYWRlcj86IFJlYWN0LlJlYWN0Tm9kZVxuICBkaXNhYmxlUm91dGVzPzogYm9vbGVhblxuICBmaWVsZFR5cGVzOiBGaWVsZFR5cGVzXG59XG5cbmNvbnN0IERlZmF1bHRFZGl0VmlldzogUmVhY3QuRkM8RGVmYXVsdEVkaXRWaWV3UHJvcHM+ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgaTE4biwgdCB9ID0gdXNlVHJhbnNsYXRpb24oJ2dlbmVyYWwnKVxuICBjb25zdCB7IHJlZnJlc2hDb29raWVBc3luYywgdXNlciB9ID0gdXNlQXV0aCgpXG5cbiAgY29uc3Qge1xuICAgIGlkLFxuICAgIGFjdGlvbixcbiAgICBhcGlVUkwsXG4gICAgY29sbGVjdGlvbixcbiAgICBjdXN0b21IZWFkZXIsXG4gICAgZGF0YSxcbiAgICBkaXNhYmxlUm91dGVzLFxuICAgIGZpZWxkVHlwZXMsXG4gICAgaGFzU2F2ZVBlcm1pc3Npb24sXG4gICAgaW50ZXJuYWxTdGF0ZSxcbiAgICBpc0VkaXRpbmcsXG4gICAgaXNMb2FkaW5nLFxuICAgIG9uU2F2ZTogb25TYXZlRnJvbVByb3BzLFxuICB9ID0gcHJvcHNcblxuICBjb25zdCB7IHNldFZpZXdBY3Rpb25zIH0gPSB1c2VBY3Rpb25zKClcbiAgY29uc3QgeyByZXBvcnRVcGRhdGUgfSA9IHVzZURvY3VtZW50RXZlbnRzKClcblxuICBjb25zdCB7IGF1dGggfSA9IGNvbGxlY3Rpb25cblxuICBjb25zdCBjbGFzc2VzID0gW1xuICAgIGJhc2VDbGFzcyxcbiAgICBgJHtiYXNlQ2xhc3N9LS0ke2NvbGxlY3Rpb24uc2x1Z31gLFxuICAgIGlzRWRpdGluZyAmJiBgJHtiYXNlQ2xhc3N9LS1pcy1lZGl0aW5nYCxcbiAgXVxuICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAuam9pbignICcpXG5cbiAgY29uc3QgbG9jYXRpb24gPSB1c2VMb2NhdGlvbigpXG5cbiAgY29uc3Qgb25TYXZlID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKGpzb24pID0+IHtcbiAgICAgIHJlcG9ydFVwZGF0ZSh7XG4gICAgICAgIGlkLFxuICAgICAgICBlbnRpdHlTbHVnOiBjb2xsZWN0aW9uLnNsdWcsXG4gICAgICAgIHVwZGF0ZWRBdDoganNvbj8ucmVzdWx0Py51cGRhdGVkQXQgfHwgbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgfSlcbiAgICAgIGlmIChhdXRoICYmIGlkID09PSB1c2VyLmlkKSB7XG4gICAgICAgIGF3YWl0IHJlZnJlc2hDb29raWVBc3luYygpXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygb25TYXZlRnJvbVByb3BzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9uU2F2ZUZyb21Qcm9wcyh7XG4gICAgICAgICAgLi4uanNvbixcbiAgICAgICAgICBvcGVyYXRpb246IGlkID8gJ3VwZGF0ZScgOiAnY3JlYXRlJyxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LFxuICAgIFtpZCwgb25TYXZlRnJvbVByb3BzLCBhdXRoLCB1c2VyLCByZWZyZXNoQ29va2llQXN5bmMsIGNvbGxlY3Rpb24sIHJlcG9ydFVwZGF0ZV0sXG4gIClcblxuICBjb25zdCBvcGVyYXRpb24gPSBpc0VkaXRpbmcgPyAndXBkYXRlJyA6ICdjcmVhdGUnXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBwYXRoID0gbG9jYXRpb24ucGF0aG5hbWVcblxuICAgIGlmICghKHBhdGguZW5kc1dpdGgoaWQpIHx8IHBhdGguZW5kc1dpdGgoJy9jcmVhdGUnKSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBlZGl0Q29uZmlnID0gY29sbGVjdGlvbj8uYWRtaW4/LmNvbXBvbmVudHM/LnZpZXdzPy5FZGl0XG4gICAgY29uc3QgZGVmYXVsdEFjdGlvbnMgPVxuICAgICAgZWRpdENvbmZpZyAmJiAnRGVmYXVsdCcgaW4gZWRpdENvbmZpZyAmJiAnYWN0aW9ucycgaW4gZWRpdENvbmZpZy5EZWZhdWx0XG4gICAgICAgID8gZWRpdENvbmZpZy5EZWZhdWx0LmFjdGlvbnNcbiAgICAgICAgOiBbXVxuXG4gICAgc2V0Vmlld0FjdGlvbnMoZGVmYXVsdEFjdGlvbnMpXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc2V0Vmlld0FjdGlvbnMoW10pXG4gICAgfVxuICB9LCBbaWQsIGxvY2F0aW9uLnBhdGhuYW1lLCBjb2xsZWN0aW9uPy5hZG1pbj8uY29tcG9uZW50cz8udmlld3M/LkVkaXQsIHNldFZpZXdBY3Rpb25zXSlcblxuICByZXR1cm4gKFxuICAgIDxtYWluIGNsYXNzTmFtZT17Y2xhc3Nlc30+XG4gICAgICA8T3BlcmF0aW9uQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17b3BlcmF0aW9ufT5cbiAgICAgICAgPEZvcm1cbiAgICAgICAgICBhY3Rpb249e2FjdGlvbn1cbiAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2Zvcm1gfVxuICAgICAgICAgIGRpc2FibGVkPXshaGFzU2F2ZVBlcm1pc3Npb259XG4gICAgICAgICAgaW5pdGlhbFN0YXRlPXtpbnRlcm5hbFN0YXRlfVxuICAgICAgICAgIG1ldGhvZD17aWQgPyAncGF0Y2gnIDogJ3Bvc3QnfVxuICAgICAgICAgIG9uU3VjY2Vzcz17b25TYXZlfVxuICAgICAgICA+XG4gICAgICAgICAgPEZvcm1Mb2FkaW5nT3ZlcmxheVRvZ2dsZVxuICAgICAgICAgICAgYWN0aW9uPXtpc0xvYWRpbmcgPyAnbG9hZGluZycgOiBvcGVyYXRpb259XG4gICAgICAgICAgICBmb3JtSXNMb2FkaW5nPXtpc0xvYWRpbmd9XG4gICAgICAgICAgICBsb2FkaW5nU3VmZml4PXtnZXRUcmFuc2xhdGlvbihjb2xsZWN0aW9uLmxhYmVscy5zaW5ndWxhciwgaTE4bil9XG4gICAgICAgICAgICBuYW1lPXtgY29sbGVjdGlvbi1lZGl0LS0ke1xuICAgICAgICAgICAgICB0eXBlb2YgY29sbGVjdGlvbj8ubGFiZWxzPy5zaW5ndWxhciA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICA/IGNvbGxlY3Rpb24ubGFiZWxzLnNpbmd1bGFyXG4gICAgICAgICAgICAgICAgOiB0KCdkb2N1bWVudCcpXG4gICAgICAgICAgICB9YH1cbiAgICAgICAgICAgIHR5cGU9XCJ3aXRob3V0TmF2XCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIHshaXNMb2FkaW5nICYmIChcbiAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICAgICAgPERvY3VtZW50SGVhZGVyXG4gICAgICAgICAgICAgICAgYXBpVVJMPXthcGlVUkx9XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbj17Y29sbGVjdGlvbn1cbiAgICAgICAgICAgICAgICBjdXN0b21IZWFkZXI9e2N1c3RvbUhlYWRlcn1cbiAgICAgICAgICAgICAgICBkYXRhPXtkYXRhfVxuICAgICAgICAgICAgICAgIGlkPXtpZH1cbiAgICAgICAgICAgICAgICBpc0VkaXRpbmc9e2lzRWRpdGluZ31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAge2Rpc2FibGVSb3V0ZXMgPyAoXG4gICAgICAgICAgICAgICAgPEN1c3RvbUNvbGxlY3Rpb25Db21wb25lbnQgdmlldz1cIkRlZmF1bHRcIiB7Li4ucHJvcHN9IC8+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPENvbGxlY3Rpb25Sb3V0ZXMgey4uLnByb3BzfSBmaWVsZFR5cGVzPXtmaWVsZFR5cGVzfSAvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICApfVxuICAgICAgICA8L0Zvcm0+XG4gICAgICA8L09wZXJhdGlvbkNvbnRleHQuUHJvdmlkZXI+XG4gICAgPC9tYWluPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRFZGl0Vmlld1xuIl0sIm5hbWVzIjpbImJhc2VDbGFzcyIsIkRlZmF1bHRFZGl0VmlldyIsInByb3BzIiwiaTE4biIsInQiLCJ1c2VUcmFuc2xhdGlvbiIsInJlZnJlc2hDb29raWVBc3luYyIsInVzZXIiLCJ1c2VBdXRoIiwiaWQiLCJhY3Rpb24iLCJhcGlVUkwiLCJjb2xsZWN0aW9uIiwiY3VzdG9tSGVhZGVyIiwiZGF0YSIsImRpc2FibGVSb3V0ZXMiLCJmaWVsZFR5cGVzIiwiaGFzU2F2ZVBlcm1pc3Npb24iLCJpbnRlcm5hbFN0YXRlIiwiaXNFZGl0aW5nIiwiaXNMb2FkaW5nIiwib25TYXZlIiwib25TYXZlRnJvbVByb3BzIiwic2V0Vmlld0FjdGlvbnMiLCJ1c2VBY3Rpb25zIiwicmVwb3J0VXBkYXRlIiwidXNlRG9jdW1lbnRFdmVudHMiLCJhdXRoIiwiY2xhc3NlcyIsInNsdWciLCJmaWx0ZXIiLCJCb29sZWFuIiwiam9pbiIsImxvY2F0aW9uIiwidXNlTG9jYXRpb24iLCJ1c2VDYWxsYmFjayIsImpzb24iLCJlbnRpdHlTbHVnIiwidXBkYXRlZEF0IiwicmVzdWx0IiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwib3BlcmF0aW9uIiwidXNlRWZmZWN0IiwicGF0aCIsInBhdGhuYW1lIiwiZW5kc1dpdGgiLCJlZGl0Q29uZmlnIiwiYWRtaW4iLCJjb21wb25lbnRzIiwidmlld3MiLCJFZGl0IiwiZGVmYXVsdEFjdGlvbnMiLCJEZWZhdWx0IiwiYWN0aW9ucyIsIm1haW4iLCJjbGFzc05hbWUiLCJPcGVyYXRpb25Db250ZXh0IiwiUHJvdmlkZXIiLCJ2YWx1ZSIsIkZvcm0iLCJkaXNhYmxlZCIsImluaXRpYWxTdGF0ZSIsIm1ldGhvZCIsIm9uU3VjY2VzcyIsIkZvcm1Mb2FkaW5nT3ZlcmxheVRvZ2dsZSIsImZvcm1Jc0xvYWRpbmciLCJsb2FkaW5nU3VmZml4IiwiZ2V0VHJhbnNsYXRpb24iLCJsYWJlbHMiLCJzaW5ndWxhciIsIm5hbWUiLCJ0eXBlIiwiUmVhY3QiLCJGcmFnbWVudCIsIkRvY3VtZW50SGVhZGVyIiwiQ3VzdG9tQ29sbGVjdGlvbkNvbXBvbmVudCIsInZpZXciLCJDb2xsZWN0aW9uUm91dGVzIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OytCQXFKQTs7O2VBQUE7OzsrREFySjhDOzhCQUNmO2dDQUNIO2dDQUtHO2dDQUNBO3lCQUNVOzZEQUN4QjtpQ0FDVTtzQkFDSDtnQ0FDVTttQ0FDRDt3QkFDQTtpQ0FDUztRQUNuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFUCxNQUFNQSxZQUFZO0FBUWxCLE1BQU1DLGtCQUFrRCxDQUFDQztJQUN2RCxNQUFNLEVBQUVDLElBQUksRUFBRUMsQ0FBQyxFQUFFLEdBQUdDLElBQUFBLDRCQUFjLEVBQUM7SUFDbkMsTUFBTSxFQUFFQyxrQkFBa0IsRUFBRUMsSUFBSSxFQUFFLEdBQUdDLElBQUFBLGFBQU87SUFFNUMsTUFBTSxFQUNKQyxFQUFFLEVBQ0ZDLE1BQU0sRUFDTkMsTUFBTSxFQUNOQyxVQUFVLEVBQ1ZDLFlBQVksRUFDWkMsSUFBSSxFQUNKQyxhQUFhLEVBQ2JDLFVBQVUsRUFDVkMsaUJBQWlCLEVBQ2pCQyxhQUFhLEVBQ2JDLFNBQVMsRUFDVEMsU0FBUyxFQUNUQyxRQUFRQyxlQUFlLEVBQ3hCLEdBQUdwQjtJ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