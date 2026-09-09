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
const _getTranslation = require("../../../../utilities/getTranslation");
const _DocumentHeader = require("../../elements/DocumentHeader");
const _Loading = require("../../elements/Loading");
const _Form = /*#__PURE__*/ _interop_require_default(require("../../forms/Form"));
const _ActionsProvider = require("../../utilities/ActionsProvider");
const _OperationProvider = require("../../utilities/OperationProvider");
const _SetStepNav = require("../collections/Edit/SetStepNav");
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
const baseClass = 'global-edit';
const DefaultGlobalView = (props)=>{
    const { i18n } = (0, _reacti18next.useTranslation)('general');
    const { action, apiURL, data, disableRoutes, fieldTypes, global, initialState, isLoading, onSave, permissions } = props;
    const { setViewActions } = (0, _ActionsProvider.useActions)();
    const { label } = global;
    const hasSavePermission = permissions?.update?.permission;
    (0, _react.useEffect)(()=>{
        const path = location.pathname;
        if (!path.endsWith(global.slug)) {
            return;
        }
        const editConfig = global?.admin?.components?.views?.Edit;
        const defaultActions = editConfig && 'Default' in editConfig && 'actions' in editConfig.Default ? editConfig.Default.actions : [];
        setViewActions(defaultActions);
        return ()=>{
            setViewActions([]);
        };
    }, [
        global.slug,
        location.pathname,
        global?.admin?.components?.views?.Edit,
        setViewActions
    ]);
    return /*#__PURE__*/ _react.default.createElement("main", {
        className: `${baseClass} ${baseClass}--${global.slug}`
    }, /*#__PURE__*/ _react.default.createElement(_OperationProvider.OperationContext.Provider, {
        value: "update"
    }, /*#__PURE__*/ _react.default.createElement(_SetStepNav.SetStepNav, {
        global: global
    }), /*#__PURE__*/ _react.default.createElement(_Form.default, {
        action: action,
        className: `${baseClass}__form`,
        disabled: !hasSavePermission,
        initialState: initialState,
        method: "post",
        onSuccess: onSave
    }, /*#__PURE__*/ _react.default.createElement(_Loading.FormLoadingOverlayToggle, {
        action: "update",
        loadingSuffix: (0, _getTranslation.getTranslation)(label, i18n),
        name: `global-edit--${typeof label === 'string' ? label : label?.en}`
    }), !isLoading && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(_DocumentHeader.DocumentHeader, {
        apiURL: apiURL,
        data: data,
        global: global
    }), disableRoutes ? /*#__PURE__*/ _react.default.createElement(_CustomComponent.CustomGlobalComponent, {
        view: "Default",
        ...props
    }) : /*#__PURE__*/ _react.default.createElement(_Routes.GlobalRoutes, {
        ...props,
        fieldTypes: fieldTypes
    })))));
};
const _default = DefaultGlobalView;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL0dsb2JhbC9EZWZhdWx0LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5cbmltcG9ydCB0eXBlIHsgRmllbGRUeXBlcyB9IGZyb20gJy4uLy4uL2Zvcm1zL2ZpZWxkLXR5cGVzJ1xuaW1wb3J0IHR5cGUgeyBHbG9iYWxFZGl0Vmlld1Byb3BzIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmltcG9ydCB7IGdldFRyYW5zbGF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0aWVzL2dldFRyYW5zbGF0aW9uJ1xuaW1wb3J0IHsgRG9jdW1lbnRIZWFkZXIgfSBmcm9tICcuLi8uLi9lbGVtZW50cy9Eb2N1bWVudEhlYWRlcidcbmltcG9ydCB7IEZvcm1Mb2FkaW5nT3ZlcmxheVRvZ2dsZSB9IGZyb20gJy4uLy4uL2VsZW1lbnRzL0xvYWRpbmcnXG5pbXBvcnQgRm9ybSBmcm9tICcuLi8uLi9mb3Jtcy9Gb3JtJ1xuaW1wb3J0IHsgdXNlQWN0aW9ucyB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9BY3Rpb25zUHJvdmlkZXInXG5pbXBvcnQgeyBPcGVyYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL09wZXJhdGlvblByb3ZpZGVyJ1xuaW1wb3J0IHsgU2V0U3RlcE5hdiB9IGZyb20gJy4uL2NvbGxlY3Rpb25zL0VkaXQvU2V0U3RlcE5hdidcbmltcG9ydCB7IEdsb2JhbFJvdXRlcyB9IGZyb20gJy4vUm91dGVzJ1xuaW1wb3J0IHsgQ3VzdG9tR2xvYmFsQ29tcG9uZW50IH0gZnJvbSAnLi9Sb3V0ZXMvQ3VzdG9tQ29tcG9uZW50J1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdnbG9iYWwtZWRpdCdcblxuZXhwb3J0IHR5cGUgRGVmYXVsdEdsb2JhbFZpZXdQcm9wcyA9IEdsb2JhbEVkaXRWaWV3UHJvcHMgJiB7XG4gIGRpc2FibGVSb3V0ZXM/OiBib29sZWFuXG4gIGZpZWxkVHlwZXM6IEZpZWxkVHlwZXNcbn1cblxuY29uc3QgRGVmYXVsdEdsb2JhbFZpZXc6IFJlYWN0LkZDPERlZmF1bHRHbG9iYWxWaWV3UHJvcHM+ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgaTE4biB9ID0gdXNlVHJhbnNsYXRpb24oJ2dlbmVyYWwnKVxuXG4gIGNvbnN0IHtcbiAgICBhY3Rpb24sXG4gICAgYXBpVVJMLFxuICAgIGRhdGEsXG4gICAgZGlzYWJsZVJvdXRlcyxcbiAgICBmaWVsZFR5cGVzLFxuICAgIGdsb2JhbCxcbiAgICBpbml0aWFsU3RhdGUsXG4gICAgaXNMb2FkaW5nLFxuICAgIG9uU2F2ZSxcbiAgICBwZXJtaXNzaW9ucyxcbiAgfSA9IHByb3BzXG5cbiAgY29uc3QgeyBzZXRWaWV3QWN0aW9ucyB9ID0gdXNlQWN0aW9ucygpXG5cbiAgY29uc3QgeyBsYWJlbCB9ID0gZ2xvYmFsXG5cbiAgY29uc3QgaGFzU2F2ZVBlcm1pc3Npb24gPSBwZXJtaXNzaW9ucz8udXBkYXRlPy5wZXJtaXNzaW9uXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBwYXRoID0gbG9jYXRpb24ucGF0aG5hbWVcblxuICAgIGlmICghcGF0aC5lbmRzV2l0aChnbG9iYWwuc2x1ZykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGVkaXRDb25maWcgPSBnbG9iYWw/LmFkbWluPy5jb21wb25lbnRzPy52aWV3cz8uRWRpdFxuICAgIGNvbnN0IGRlZmF1bHRBY3Rpb25zID1cbiAgICAgIGVkaXRDb25maWcgJiYgJ0RlZmF1bHQnIGluIGVkaXRDb25maWcgJiYgJ2FjdGlvbnMnIGluIGVkaXRDb25maWcuRGVmYXVsdFxuICAgICAgICA/IGVkaXRDb25maWcuRGVmYXVsdC5hY3Rpb25zXG4gICAgICAgIDogW11cblxuICAgIHNldFZpZXdBY3Rpb25zKGRlZmF1bHRBY3Rpb25zKVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHNldFZpZXdBY3Rpb25zKFtdKVxuICAgIH1cbiAgfSwgW2dsb2JhbC5zbHVnLCBsb2NhdGlvbi5wYXRobmFtZSwgZ2xvYmFsPy5hZG1pbj8uY29tcG9uZW50cz8udmlld3M/LkVkaXQsIHNldFZpZXdBY3Rpb25zXSlcblxuICByZXR1cm4gKFxuICAgIDxtYWluIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfSAke2Jhc2VDbGFzc30tLSR7Z2xvYmFsLnNsdWd9YH0+XG4gICAgICA8T3BlcmF0aW9uQ29udGV4dC5Qcm92aWRlciB2YWx1ZT1cInVwZGF0ZVwiPlxuICAgICAgICA8U2V0U3RlcE5hdiBnbG9iYWw9e2dsb2JhbH0gLz5cbiAgICAgICAgPEZvcm1cbiAgICAgICAgICBhY3Rpb249e2FjdGlvbn1cbiAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2Zvcm1gfVxuICAgICAgICAgIGRpc2FibGVkPXshaGFzU2F2ZVBlcm1pc3Npb259XG4gICAgICAgICAgaW5pdGlhbFN0YXRlPXtpbml0aWFsU3RhdGV9XG4gICAgICAgICAgbWV0aG9kPVwicG9zdFwiXG4gICAgICAgICAgb25TdWNjZXNzPXtvblNhdmV9XG4gICAgICAgID5cbiAgICAgICAgICA8Rm9ybUxvYWRpbmdPdmVybGF5VG9nZ2xlXG4gICAgICAgICAgICBhY3Rpb249XCJ1cGRhdGVcIlxuICAgICAgICAgICAgbG9hZGluZ1N1ZmZpeD17Z2V0VHJhbnNsYXRpb24obGFiZWwsIGkxOG4pfVxuICAgICAgICAgICAgbmFtZT17YGdsb2JhbC1lZGl0LS0ke3R5cGVvZiBsYWJlbCA9PT0gJ3N0cmluZycgPyBsYWJlbCA6IGxhYmVsPy5lbn1gfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgeyFpc0xvYWRpbmcgJiYgKFxuICAgICAgICAgICAgPFJlYWN0LkZyYWdtZW50PlxuICAgICAgICAgICAgICA8RG9jdW1lbnRIZWFkZXIgYXBpVVJMPXthcGlVUkx9IGRhdGE9e2RhdGF9IGdsb2JhbD17Z2xvYmFsfSAvPlxuICAgICAgICAgICAgICB7ZGlzYWJsZVJvdXRlcyA/IChcbiAgICAgICAgICAgICAgICA8Q3VzdG9tR2xvYmFsQ29tcG9uZW50IHZpZXc9XCJEZWZhdWx0XCIgey4uLnByb3BzfSAvPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxHbG9iYWxSb3V0ZXMgey4uLnByb3BzfSBmaWVsZFR5cGVzPXtmaWVsZFR5cGVzfSAvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICApfVxuICAgICAgICA8L0Zvcm0+XG4gICAgICA8L09wZXJhdGlvbkNvbnRleHQuUHJvdmlkZXI+XG4gICAgPC9tYWluPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRHbG9iYWxWaWV3XG4iXSwibmFtZXMiOlsiYmFzZUNsYXNzIiwiRGVmYXVsdEdsb2JhbFZpZXciLCJwcm9wcyIsImkxOG4iLCJ1c2VUcmFuc2xhdGlvbiIsImFjdGlvbiIsImFwaVVSTCIsImRhdGEiLCJkaXNhYmxlUm91dGVzIiwiZmllbGRUeXBlcyIsImdsb2JhbCIsImluaXRpYWxTdGF0ZSIsImlzTG9hZGluZyIsIm9uU2F2ZSIsInBlcm1pc3Npb25zIiwic2V0Vmlld0FjdGlvbnMiLCJ1c2VBY3Rpb25zIiwibGFiZWwiLCJoYXNTYXZlUGVybWlzc2lvbiIsInVwZGF0ZSIsInBlcm1pc3Npb24iLCJ1c2VFZmZlY3QiLCJwYXRoIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImVuZHNXaXRoIiwic2x1ZyIsImVkaXRDb25maWciLCJhZG1pbiIsImNvbXBvbmVudHMiLCJ2aWV3cyIsIkVkaXQiLCJkZWZhdWx0QWN0aW9ucyIsIkRlZmF1bHQiLCJhY3Rpb25zIiwibWFpbiIsImNsYXNzTmFtZSIsIk9wZXJhdGlvbkNvbnRleHQiLCJQcm92aWRlciIsInZhbHVlIiwiU2V0U3RlcE5hdiIsIkZvcm0iLCJkaXNhYmxlZCIsIm1ldGhvZCIsIm9uU3VjY2VzcyIsIkZvcm1Mb2FkaW5nT3ZlcmxheVRvZ2dsZSIsImxvYWRpbmdTdWZmaXgiLCJnZXRUcmFuc2xhdGlvbiIsIm5hbWUiLCJlbiIsIlJlYWN0IiwiRnJhZ21lbnQiLCJEb2N1bWVudEhlYWRlciIsIkN1c3RvbUdsb2JhbENvbXBvbmVudCIsInZpZXciLCJHbG9iYWxSb3V0ZXMiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkFtR0E7OztlQUFBOzs7K0RBbkdpQzs4QkFDRjtnQ0FLQTtnQ0FDQTt5QkFDVTs2REFDeEI7aUNBQ1U7bUNBQ007NEJBQ047d0JBQ0U7aUNBQ1M7UUFDL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVAsTUFBTUEsWUFBWTtBQU9sQixNQUFNQyxvQkFBc0QsQ0FBQ0M7SUFDM0QsTUFBTSxFQUFFQyxJQUFJLEVBQUUsR0FBR0MsSUFBQUEsNEJBQWMsRUFBQztJQUVoQyxNQUFNLEVBQ0pDLE1BQU0sRUFDTkMsTUFBTSxFQUNOQyxJQUFJLEVBQ0pDLGFBQWEsRUFDYkMsVUFBVSxFQUNWQyxNQUFNLEVBQ05DLFlBQVksRUFDWkMsU0FBUyxFQUNUQyxNQUFNLEVBQ05DLFdBQVcsRUFDWixHQUFHWjtJQUVKLE1BQU0sRUFBRWEsY0FBYyxFQUFFLEdBQUdDLElBQUFBLDJCQUFVO0lBRXJDLE1BQU0sRUFBRUMsS0FBSyxFQUFFLEdBQUdQO0lBRWxCLE1BQU1RLG9CQUFvQkosYUFBYUssUUFBUUM7SUFFL0NDLElBQUFBLGdCQUFTLEVBQUM7UUFDUixNQUFNQyxPQUFPQyxTQUFTQyxRQUFRO1FBRTlCLElBQUksQ0FBQ0YsS0FBS0csUUFBUSxDQUFDZixPQUFPZ0IsSUFBSSxHQUFHO1lBQy9CO1FBQ0Y7UUFFQSxNQUFNQyxhQUFhakIsUUFBUWtCLE9BQU9DLFlBQVlDLE9BQU9DO1FBQ3JELE1BQU1DLGlCQUNKTCxjQUFjLGFBQWFBLGNBQWMsYUFBYUEsV0FBV00sT0FBTyxHQUNwRU4sV0FBV00sT0FBTyxDQUFDQyxPQUFPLEdBQzFCLEVBQUU7UUFFUm5CLGVBQWVpQjtRQUVmLE9BQU87WUFDTGpCLGVBQWUsRUFBRTtRQUNuQjtJQUNGLEdBQUc7UUFBQ0wsT0FBT2dCLElBQUk7UUFBRUgsU0FBU0MsUUFBUTtRQUFFZCxRQUFRa0IsT0FBT0MsWUFBWUMsT0FBT0M7UUFBTWhCO0tBQWU7SUFFM0YscUJBQ0UsNkJBQUNvQjtRQUFLQyxXQUFXLENBQUMsRUFBRXBDLFVBQVUsQ0FBQyxFQUFFQSxVQUFVLEVBQUUsRUFBRVUsT0FBT2dCLElBQUksQ0FBQyxDQUFDO3FCQUMxRCw2QkFBQ1csbUNBQWdCLENBQUNDLFFBQVE7UUFBQ0MsT0FBTTtxQkFDL0IsNkJBQUNDLHNCQUFVO1FBQUM5QixRQUFRQTtzQkFDcEIsNkJBQUMrQixhQUFJO1FBQ0hwQyxRQUFRQTtRQUNSK0IsV0FBVyxDQUFDLEVBQUVwQyxVQUFVLE1BQU0sQ0FBQztRQUMvQjBDLFVBQVUsQ0FBQ3hCO1FBQ1hQLGNBQWNBO1FBQ2RnQyxRQUFPO1FBQ1BDLFdBQVcvQjtxQkFFWCw2QkFBQ2dDLGlDQUF3QjtRQUN2QnhDLFFBQU87UUFDUHlDLGVBQWVDLElBQUFBLDhCQUFjLEVBQUM5QixPQUFPZDtRQUNyQzZDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsT0FBTy9CLFVBQVUsV0FBV0EsUUFBUUEsT0FBT2dDLEdBQUcsQ0FBQztRQUV0RSxDQUFDckMsMkJBQ0EsNkJBQUNzQyxjQUFLLENBQUNDLFFBQVEsc0JBQ2IsNkJBQUNDLDhCQUFjO1FBQUM5QyxRQUFRQTtRQUFRQyxNQUFNQTtRQUFNRyxRQUFRQTtRQUNuREYsOEJBQ0MsNkJBQUM2QyxzQ0FBcUI7UUFBQ0MsTUFBSztRQUFXLEdBQUdwRCxLQUFLO3VCQUUvQyw2QkFBQ3FELG9CQUFZO1FBQUUsR0FBR3JELEtBQUs7UUFBRU8sWUFBWUE7O0FBUXJEO01BRUEsV0FBZVIifQ==