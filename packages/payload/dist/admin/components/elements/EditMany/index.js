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
const _modal = require("@faceless-ui/modal");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reacti18next = require("react-i18next");
const _getTranslation = require("../../../../utilities/getTranslation");
const _Form = /*#__PURE__*/ _interop_require_default(require("../../forms/Form"));
const _context = require("../../forms/Form/context");
const _RenderFields = /*#__PURE__*/ _interop_require_default(require("../../forms/RenderFields"));
const _Submit = /*#__PURE__*/ _interop_require_default(require("../../forms/Submit"));
const _fieldtypes = require("../../forms/field-types");
const _X = /*#__PURE__*/ _interop_require_default(require("../../icons/X"));
const _Auth = require("../../utilities/Auth");
const _Config = require("../../utilities/Config");
const _DocumentInfo = require("../../utilities/DocumentInfo");
const _OperationProvider = require("../../utilities/OperationProvider");
const _SelectionProvider = require("../../views/collections/List/SelectionProvider");
const _Drawer = require("../Drawer");
const _FieldSelect = require("../FieldSelect");
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
const baseClass = 'edit-many';
const Submit = ({ action, disabled })=>{
    const { submit } = (0, _context.useForm)();
    const { t } = (0, _reacti18next.useTranslation)('general');
    const save = (0, _react.useCallback)(()=>{
        submit({
            action,
            method: 'PATCH',
            skipValidation: true
        });
    }, [
        action,
        submit
    ]);
    return /*#__PURE__*/ _react.default.createElement(_Submit.default, {
        className: `${baseClass}__save`,
        disabled: disabled,
        onClick: save
    }, t('save'));
};
const Publish = ({ action, disabled })=>{
    const { submit } = (0, _context.useForm)();
    const { t } = (0, _reacti18next.useTranslation)('version');
    const save = (0, _react.useCallback)(()=>{
        submit({
            action,
            method: 'PATCH',
            overrides: {
                _status: 'published'
            },
            skipValidation: true
        });
    }, [
        action,
        submit
    ]);
    return /*#__PURE__*/ _react.default.createElement(_Submit.default, {
        className: `${baseClass}__publish`,
        disabled: disabled,
        onClick: save
    }, t('publishChanges'));
};
const SaveDraft = ({ action, disabled })=>{
    const { submit } = (0, _context.useForm)();
    const { t } = (0, _reacti18next.useTranslation)('version');
    const save = (0, _react.useCallback)(()=>{
        submit({
            action,
            method: 'PATCH',
            overrides: {
                _status: 'draft'
            },
            skipValidation: true
        });
    }, [
        action,
        submit
    ]);
    return /*#__PURE__*/ _react.default.createElement(_Submit.default, {
        buttonStyle: "secondary",
        className: `${baseClass}__draft`,
        disabled: disabled,
        onClick: save
    }, t('saveDraft'));
};
const EditMany = (props)=>{
    const { collection: { slug, fields, labels: { plural } } = {}, collection, resetParams } = props;
    const { permissions } = (0, _Auth.useAuth)();
    const { closeModal } = (0, _modal.useModal)();
    const { routes: { api }, serverURL } = (0, _Config.useConfig)();
    const { count, getQueryParams, selectAll } = (0, _SelectionProvider.useSelection)();
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const [selected, setSelected] = (0, _react.useState)([]);
    const collectionPermissions = permissions?.collections?.[slug];
    const hasUpdatePermission = collectionPermissions?.update?.permission;
    const drawerSlug = `edit-${slug}`;
    if (selectAll === _SelectionProvider.SelectAllStatus.None || !hasUpdatePermission) {
        return null;
    }
    const onSuccess = ()=>{
        resetParams({
            page: selectAll === _SelectionProvider.SelectAllStatus.AllAvailable ? 1 : undefined
        });
    };
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: baseClass
    }, /*#__PURE__*/ _react.default.createElement(_Drawer.DrawerToggler, {
        "aria-label": t('edit'),
        className: `${baseClass}__toggle`,
        onClick: ()=>{
            setSelected([]);
        },
        slug: drawerSlug
    }, t('edit')), /*#__PURE__*/ _react.default.createElement(_Drawer.Drawer, {
        header: null,
        slug: drawerSlug
    }, /*#__PURE__*/ _react.default.createElement(_DocumentInfo.DocumentInfoProvider, {
        collection: collection
    }, /*#__PURE__*/ _react.default.createElement(_OperationProvider.OperationContext.Provider, {
        value: "update"
    }, /*#__PURE__*/ _react.default.createElement(_Form.default, {
        className: `${baseClass}__form`,
        onSuccess: onSuccess
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__main`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__header`
    }, /*#__PURE__*/ _react.default.createElement("h2", {
        className: `${baseClass}__header__title`
    }, t('editingLabel', {
        count,
        label: (0, _getTranslation.getTranslation)(plural, i18n)
    })), /*#__PURE__*/ _react.default.createElement("button", {
        "aria-label": t('close'),
        className: `${baseClass}__header__close`,
        id: `close-drawer__${drawerSlug}`,
        onClick: ()=>closeModal(drawerSlug),
        type: "button"
    }, /*#__PURE__*/ _react.default.createElement(_X.default, null))), /*#__PURE__*/ _react.default.createElement(_FieldSelect.FieldSelect, {
        fields: fields,
        setSelected: setSelected
    }), /*#__PURE__*/ _react.default.createElement(_RenderFields.default, {
        fieldSchema: selected,
        fieldTypes: _fieldtypes.fieldTypes
    }), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__sidebar-wrap`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__sidebar`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__sidebar-sticky-wrap`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__document-actions`
    }, collection.versions ? /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(SaveDraft, {
        action: `${serverURL}${api}/${slug}${getQueryParams()}&draft=true`,
        disabled: selected.length === 0
    }), /*#__PURE__*/ _react.default.createElement(Publish, {
        action: `${serverURL}${api}/${slug}${getQueryParams()}&draft=true`,
        disabled: selected.length === 0
    })) : /*#__PURE__*/ _react.default.createElement(Submit, {
        action: `${serverURL}${api}/${slug}${getQueryParams()}`,
        disabled: selected.length === 0
    })))))))))));
};
const _default = EditMany;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL0VkaXRNYW55L2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VNb2RhbCB9IGZyb20gJ0BmYWNlbGVzcy11aS9tb2RhbCdcbmltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcblxuaW1wb3J0IHR5cGUgeyBQcm9wcyB9IGZyb20gJy4vdHlwZXMnXG5cbmltcG9ydCB7IGdldFRyYW5zbGF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0aWVzL2dldFRyYW5zbGF0aW9uJ1xuaW1wb3J0IEZvcm0gZnJvbSAnLi4vLi4vZm9ybXMvRm9ybSdcbmltcG9ydCB7IHVzZUZvcm0gfSBmcm9tICcuLi8uLi9mb3Jtcy9Gb3JtL2NvbnRleHQnXG5pbXBvcnQgUmVuZGVyRmllbGRzIGZyb20gJy4uLy4uL2Zvcm1zL1JlbmRlckZpZWxkcydcbmltcG9ydCBGb3JtU3VibWl0IGZyb20gJy4uLy4uL2Zvcm1zL1N1Ym1pdCdcbmltcG9ydCB7IGZpZWxkVHlwZXMgfSBmcm9tICcuLi8uLi9mb3Jtcy9maWVsZC10eXBlcydcbmltcG9ydCBYIGZyb20gJy4uLy4uL2ljb25zL1gnXG5pbXBvcnQgeyB1c2VBdXRoIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL0F1dGgnXG5pbXBvcnQgeyB1c2VDb25maWcgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvQ29uZmlnJ1xuaW1wb3J0IHsgRG9jdW1lbnRJbmZvUHJvdmlkZXIgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvRG9jdW1lbnRJbmZvJ1xuaW1wb3J0IHsgT3BlcmF0aW9uQ29udGV4dCB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9PcGVyYXRpb25Qcm92aWRlcidcbmltcG9ydCB7IFNlbGVjdEFsbFN0YXR1cywgdXNlU2VsZWN0aW9uIH0gZnJvbSAnLi4vLi4vdmlld3MvY29sbGVjdGlvbnMvTGlzdC9TZWxlY3Rpb25Qcm92aWRlcidcbmltcG9ydCB7IERyYXdlciwgRHJhd2VyVG9nZ2xlciB9IGZyb20gJy4uL0RyYXdlcidcbmltcG9ydCB7IEZpZWxkU2VsZWN0IH0gZnJvbSAnLi4vRmllbGRTZWxlY3QnXG5pbXBvcnQgJy4vaW5kZXguc2NzcydcblxuY29uc3QgYmFzZUNsYXNzID0gJ2VkaXQtbWFueSdcblxuY29uc3QgU3VibWl0OiBSZWFjdC5GQzx7IGFjdGlvbjogc3RyaW5nOyBkaXNhYmxlZDogYm9vbGVhbiB9PiA9ICh7IGFjdGlvbiwgZGlzYWJsZWQgfSkgPT4ge1xuICBjb25zdCB7IHN1Ym1pdCB9ID0gdXNlRm9ybSgpXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oJ2dlbmVyYWwnKVxuXG4gIGNvbnN0IHNhdmUgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc3VibWl0KHtcbiAgICAgIGFjdGlvbixcbiAgICAgIG1ldGhvZDogJ1BBVENIJyxcbiAgICAgIHNraXBWYWxpZGF0aW9uOiB0cnVlLFxuICAgIH0pXG4gIH0sIFthY3Rpb24sIHN1Ym1pdF0pXG5cbiAgcmV0dXJuIChcbiAgICA8Rm9ybVN1Ym1pdCBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3NhdmVgfSBkaXNhYmxlZD17ZGlzYWJsZWR9IG9uQ2xpY2s9e3NhdmV9PlxuICAgICAge3QoJ3NhdmUnKX1cbiAgICA8L0Zvcm1TdWJtaXQ+XG4gIClcbn1cbmNvbnN0IFB1Ymxpc2g6IFJlYWN0LkZDPHsgYWN0aW9uOiBzdHJpbmc7IGRpc2FibGVkOiBib29sZWFuIH0+ID0gKHsgYWN0aW9uLCBkaXNhYmxlZCB9KSA9PiB7XG4gIGNvbnN0IHsgc3VibWl0IH0gPSB1c2VGb3JtKClcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigndmVyc2lvbicpXG5cbiAgY29uc3Qgc2F2ZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzdWJtaXQoe1xuICAgICAgYWN0aW9uLFxuICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgb3ZlcnJpZGVzOiB7XG4gICAgICAgIF9zdGF0dXM6ICdwdWJsaXNoZWQnLFxuICAgICAgfSxcbiAgICAgIHNraXBWYWxpZGF0aW9uOiB0cnVlLFxuICAgIH0pXG4gIH0sIFthY3Rpb24sIHN1Ym1pdF0pXG5cbiAgcmV0dXJuIChcbiAgICA8Rm9ybVN1Ym1pdCBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3B1Ymxpc2hgfSBkaXNhYmxlZD17ZGlzYWJsZWR9IG9uQ2xpY2s9e3NhdmV9PlxuICAgICAge3QoJ3B1Ymxpc2hDaGFuZ2VzJyl9XG4gICAgPC9Gb3JtU3VibWl0PlxuICApXG59XG5jb25zdCBTYXZlRHJhZnQ6IFJlYWN0LkZDPHsgYWN0aW9uOiBzdHJpbmc7IGRpc2FibGVkOiBib29sZWFuIH0+ID0gKHsgYWN0aW9uLCBkaXNhYmxlZCB9KSA9PiB7XG4gIGNvbnN0IHsgc3VibWl0IH0gPSB1c2VGb3JtKClcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigndmVyc2lvbicpXG5cbiAgY29uc3Qgc2F2ZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzdWJtaXQoe1xuICAgICAgYWN0aW9uLFxuICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgb3ZlcnJpZGVzOiB7XG4gICAgICAgIF9zdGF0dXM6ICdkcmFmdCcsXG4gICAgICB9LFxuICAgICAgc2tpcFZhbGlkYXRpb246IHRydWUsXG4gICAgfSlcbiAgfSwgW2FjdGlvbiwgc3VibWl0XSlcblxuICByZXR1cm4gKFxuICAgIDxGb3JtU3VibWl0IGJ1dHRvblN0eWxlPVwic2Vjb25kYXJ5XCIgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19kcmFmdGB9IGRpc2FibGVkPXtkaXNhYmxlZH0gb25DbGljaz17c2F2ZX0+XG4gICAgICB7dCgnc2F2ZURyYWZ0Jyl9XG4gICAgPC9Gb3JtU3VibWl0PlxuICApXG59XG5jb25zdCBFZGl0TWFueTogUmVhY3QuRkM8UHJvcHM+ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY29sbGVjdGlvbjogeyBzbHVnLCBmaWVsZHMsIGxhYmVsczogeyBwbHVyYWwgfSB9ID0ge30sIGNvbGxlY3Rpb24sIHJlc2V0UGFyYW1zIH0gPSBwcm9wc1xuXG4gIGNvbnN0IHsgcGVybWlzc2lvbnMgfSA9IHVzZUF1dGgoKVxuICBjb25zdCB7IGNsb3NlTW9kYWwgfSA9IHVzZU1vZGFsKClcbiAgY29uc3Qge1xuICAgIHJvdXRlczogeyBhcGkgfSxcbiAgICBzZXJ2ZXJVUkwsXG4gIH0gPSB1c2VDb25maWcoKVxuICBjb25zdCB7IGNvdW50LCBnZXRRdWVyeVBhcmFtcywgc2VsZWN0QWxsIH0gPSB1c2VTZWxlY3Rpb24oKVxuICBjb25zdCB7IGkxOG4sIHQgfSA9IHVzZVRyYW5zbGF0aW9uKCdnZW5lcmFsJylcbiAgY29uc3QgW3NlbGVjdGVkLCBzZXRTZWxlY3RlZF0gPSB1c2VTdGF0ZShbXSlcblxuICBjb25zdCBjb2xsZWN0aW9uUGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucz8uY29sbGVjdGlvbnM/LltzbHVnXVxuICBjb25zdCBoYXNVcGRhdGVQZXJtaXNzaW9uID0gY29sbGVjdGlvblBlcm1pc3Npb25zPy51cGRhdGU/LnBlcm1pc3Npb25cblxuICBjb25zdCBkcmF3ZXJTbHVnID0gYGVkaXQtJHtzbHVnfWBcblxuICBpZiAoc2VsZWN0QWxsID09PSBTZWxlY3RBbGxTdGF0dXMuTm9uZSB8fCAhaGFzVXBkYXRlUGVybWlzc2lvbikge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBjb25zdCBvblN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgcmVzZXRQYXJhbXMoeyBwYWdlOiBzZWxlY3RBbGwgPT09IFNlbGVjdEFsbFN0YXR1cy5BbGxBdmFpbGFibGUgPyAxIDogdW5kZWZpbmVkIH0pXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtiYXNlQ2xhc3N9PlxuICAgICAgPERyYXdlclRvZ2dsZXJcbiAgICAgICAgYXJpYS1sYWJlbD17dCgnZWRpdCcpfVxuICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3RvZ2dsZWB9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICBzZXRTZWxlY3RlZChbXSlcbiAgICAgICAgfX1cbiAgICAgICAgc2x1Zz17ZHJhd2VyU2x1Z31cbiAgICAgID5cbiAgICAgICAge3QoJ2VkaXQnKX1cbiAgICAgIDwvRHJhd2VyVG9nZ2xlcj5cbiAgICAgIDxEcmF3ZXIgaGVhZGVyPXtudWxsfSBzbHVnPXtkcmF3ZXJTbHVnfT5cbiAgICAgICAgPERvY3VtZW50SW5mb1Byb3ZpZGVyIGNvbGxlY3Rpb249e2NvbGxlY3Rpb259PlxuICAgICAgICAgIDxPcGVyYXRpb25Db250ZXh0LlByb3ZpZGVyIHZhbHVlPVwidXBkYXRlXCI+XG4gICAgICAgICAgICA8Rm9ybSBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2Zvcm1gfSBvblN1Y2Nlc3M9e29uU3VjY2Vzc30+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19tYWluYH0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2hlYWRlcmB9PlxuICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9faGVhZGVyX190aXRsZWB9PlxuICAgICAgICAgICAgICAgICAgICB7dCgnZWRpdGluZ0xhYmVsJywgeyBjb3VudCwgbGFiZWw6IGdldFRyYW5zbGF0aW9uKHBsdXJhbCwgaTE4bikgfSl9XG4gICAgICAgICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXt0KCdjbG9zZScpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2hlYWRlcl9fY2xvc2VgfVxuICAgICAgICAgICAgICAgICAgICBpZD17YGNsb3NlLWRyYXdlcl9fJHtkcmF3ZXJTbHVnfWB9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGNsb3NlTW9kYWwoZHJhd2VyU2x1Zyl9XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8WCAvPlxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPEZpZWxkU2VsZWN0IGZpZWxkcz17ZmllbGRzfSBzZXRTZWxlY3RlZD17c2V0U2VsZWN0ZWR9IC8+XG4gICAgICAgICAgICAgICAgPFJlbmRlckZpZWxkcyBmaWVsZFNjaGVtYT17c2VsZWN0ZWR9IGZpZWxkVHlwZXM9e2ZpZWxkVHlwZXN9IC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3NpZGViYXItd3JhcGB9PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3NpZGViYXJgfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3NpZGViYXItc3RpY2t5LXdyYXBgfT5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fZG9jdW1lbnQtYWN0aW9uc2B9PlxuICAgICAgICAgICAgICAgICAgICAgICAge2NvbGxlY3Rpb24udmVyc2lvbnMgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U2F2ZURyYWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb249e2Ake3NlcnZlclVSTH0ke2FwaX0vJHtzbHVnfSR7Z2V0UXVlcnlQYXJhbXMoKX0mZHJhZnQ9dHJ1ZWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17c2VsZWN0ZWQubGVuZ3RoID09PSAwfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFB1Ymxpc2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbj17YCR7c2VydmVyVVJMfSR7YXBpfS8ke3NsdWd9JHtnZXRRdWVyeVBhcmFtcygpfSZkcmFmdD10cnVlYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtzZWxlY3RlZC5sZW5ndGggPT09IDB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxTdWJtaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb249e2Ake3NlcnZlclVSTH0ke2FwaX0vJHtzbHVnfSR7Z2V0UXVlcnlQYXJhbXMoKX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtzZWxlY3RlZC5sZW5ndGggPT09IDB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvRm9ybT5cbiAgICAgICAgICA8L09wZXJhdGlvbkNvbnRleHQuUHJvdmlkZXI+XG4gICAgICAgIDwvRG9jdW1lbnRJbmZvUHJvdmlkZXI+XG4gICAgICA8L0RyYXdlcj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBFZGl0TWFueVxuIl0sIm5hbWVzIjpbImJhc2VDbGFzcyIsIlN1Ym1pdCIsImFjdGlvbiIsImRpc2FibGVkIiwic3VibWl0IiwidXNlRm9ybSIsInQiLCJ1c2VUcmFuc2xhdGlvbiIsInNhdmUiLCJ1c2VDYWxsYmFjayIsIm1ldGhvZCIsInNraXBWYWxpZGF0aW9uIiwiRm9ybVN1Ym1pdCIsImNsYXNzTmFtZSIsIm9uQ2xpY2siLCJQdWJsaXNoIiwib3ZlcnJpZGVzIiwiX3N0YXR1cyIsIlNhdmVEcmFmdCIsImJ1dHRvblN0eWxlIiwiRWRpdE1hbnkiLCJwcm9wcyIsImNvbGxlY3Rpb24iLCJzbHVnIiwiZmllbGRzIiwibGFiZWxzIiwicGx1cmFsIiwicmVzZXRQYXJhbXMiLCJwZXJtaXNzaW9ucyIsInVzZUF1dGgiLCJjbG9zZU1vZGFsIiwidXNlTW9kYWwiLCJyb3V0ZXMiLCJhcGkiLCJzZXJ2ZXJVUkwiLCJ1c2VDb25maWciLCJjb3VudCIsImdldFF1ZXJ5UGFyYW1zIiwic2VsZWN0QWxsIiwidXNlU2VsZWN0aW9uIiwiaTE4biIsInNlbGVjdGVkIiwic2V0U2VsZWN0ZWQiLCJ1c2VTdGF0ZSIsImNvbGxlY3Rpb25QZXJtaXNzaW9ucyIsImNvbGxlY3Rpb25zIiwiaGFzVXBkYXRlUGVybWlzc2lvbiIsInVwZGF0ZSIsInBlcm1pc3Npb24iLCJkcmF3ZXJTbHVnIiwiU2VsZWN0QWxsU3RhdHVzIiwiTm9uZSIsIm9uU3VjY2VzcyIsInBhZ2UiLCJBbGxBdmFpbGFibGUiLCJ1bmRlZmluZWQiLCJkaXYiLCJEcmF3ZXJUb2dnbGVyIiwiYXJpYS1sYWJlbCIsIkRyYXdlciIsImhlYWRlciIsIkRvY3VtZW50SW5mb1Byb3ZpZGVyIiwiT3BlcmF0aW9uQ29udGV4dCIsIlByb3ZpZGVyIiwidmFsdWUiLCJGb3JtIiwiaDIiLCJsYWJlbCIsImdldFRyYW5zbGF0aW9uIiwiYnV0dG9uIiwiaWQiLCJ0eXBlIiwiWCIsIkZpZWxkU2VsZWN0IiwiUmVuZGVyRmllbGRzIiwiZmllbGRTY2hlbWEiLCJmaWVsZFR5cGVzIiwidmVyc2lvbnMiLCJSZWFjdCIsIkZyYWdtZW50IiwibGVuZ3RoIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7K0JBaUxBOzs7ZUFBQTs7O3VCQWpMeUI7K0RBQ29COzhCQUNkO2dDQUlBOzZEQUNkO3lCQUNPO3FFQUNDOytEQUNGOzRCQUNJOzBEQUNiO3NCQUNVO3dCQUNFOzhCQUNXO21DQUNKO21DQUNhO3dCQUNSOzZCQUNWO1FBQ3JCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVQLE1BQU1BLFlBQVk7QUFFbEIsTUFBTUMsU0FBMEQsQ0FBQyxFQUFFQyxNQUFNLEVBQUVDLFFBQVEsRUFBRTtJQUNuRixNQUFNLEVBQUVDLE1BQU0sRUFBRSxHQUFHQyxJQUFBQSxnQkFBTztJQUMxQixNQUFNLEVBQUVDLENBQUMsRUFBRSxHQUFHQyxJQUFBQSw0QkFBYyxFQUFDO0lBRTdCLE1BQU1DLE9BQU9DLElBQUFBLGtCQUFXLEVBQUM7UUFDdkJMLE9BQU87WUFDTEY7WUFDQVEsUUFBUTtZQUNSQyxnQkFBZ0I7UUFDbEI7SUFDRixHQUFHO1FBQUNUO1FBQVFFO0tBQU87SUFFbkIscUJBQ0UsNkJBQUNRLGVBQVU7UUFBQ0MsV0FBVyxDQUFDLEVBQUViLFVBQVUsTUFBTSxDQUFDO1FBQUVHLFVBQVVBO1FBQVVXLFNBQVNOO09BQ3ZFRixFQUFFO0FBR1Q7QUFDQSxNQUFNUyxVQUEyRCxD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