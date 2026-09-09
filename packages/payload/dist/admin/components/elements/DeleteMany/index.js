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
const _reacttoastify = require("react-toastify");
const _getTranslation = require("../../../../utilities/getTranslation");
const _api = require("../../../api");
const _Minimal = /*#__PURE__*/ _interop_require_default(require("../../templates/Minimal"));
const _Auth = require("../../utilities/Auth");
const _Config = require("../../utilities/Config");
const _SelectionProvider = require("../../views/collections/List/SelectionProvider");
const _Button = /*#__PURE__*/ _interop_require_default(require("../Button"));
const _Pill = /*#__PURE__*/ _interop_require_default(require("../Pill"));
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
const baseClass = 'delete-documents';
const DeleteMany = (props)=>{
    const { collection: { slug, labels: { plural } } = {}, resetParams } = props;
    const { permissions } = (0, _Auth.useAuth)();
    const { routes: { api }, serverURL } = (0, _Config.useConfig)();
    const { toggleModal } = (0, _modal.useModal)();
    const { count, getQueryParams, selectAll, toggleAll } = (0, _SelectionProvider.useSelection)();
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const [deleting, setDeleting] = (0, _react.useState)(false);
    const collectionPermissions = permissions?.collections?.[slug];
    const hasDeletePermission = collectionPermissions?.delete?.permission;
    const modalSlug = `delete-${slug}`;
    const addDefaultError = (0, _react.useCallback)(()=>{
        _reacttoastify.toast.error(t('error:unknown'));
    }, [
        t
    ]);
    const handleDelete = (0, _react.useCallback)(()=>{
        setDeleting(true);
        void _api.requests.delete(`${serverURL}${api}/${slug}${getQueryParams()}`, {
            headers: {
                'Accept-Language': i18n.language,
                'Content-Type': 'application/json'
            }
        }).then(async (res)=>{
            try {
                const json = await res.json();
                toggleModal(modalSlug);
                if (res.status < 400) {
                    _reacttoastify.toast.success(json.message || t('deletedSuccessfully'), {
                        autoClose: 3000
                    });
                    toggleAll();
                    resetParams({
                        page: selectAll ? 1 : undefined
                    });
                    return null;
                }
                if (json.errors) {
                    let message = json.message;
                    if (json.errors) {
                        json.errors.forEach((error)=>{
                            message = message + '\n' + error.message;
                        });
                    }
                    _reacttoastify.toast.error(message);
                } else {
                    addDefaultError();
                }
                return false;
            } catch (e) {
                return addDefaultError();
            }
        });
    }, [
        addDefaultError,
        api,
        getQueryParams,
        i18n.language,
        modalSlug,
        resetParams,
        selectAll,
        serverURL,
        slug,
        t,
        toggleAll,
        toggleModal
    ]);
    if (selectAll === _SelectionProvider.SelectAllStatus.None || !hasDeletePermission) {
        return null;
    }
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(_Pill.default, {
        className: `${baseClass}__toggle`,
        onClick: ()=>{
            setDeleting(false);
            toggleModal(modalSlug);
        }
    }, t('delete')), /*#__PURE__*/ _react.default.createElement(_modal.Modal, {
        className: baseClass,
        slug: modalSlug
    }, /*#__PURE__*/ _react.default.createElement(_Minimal.default, {
        className: `${baseClass}__template`
    }, /*#__PURE__*/ _react.default.createElement("h1", null, t('confirmDeletion')), /*#__PURE__*/ _react.default.createElement("p", null, t('aboutToDeleteCount', {
        count,
        label: (0, _getTranslation.getTranslation)(plural, i18n)
    })), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        buttonStyle: "secondary",
        id: "confirm-cancel",
        onClick: deleting ? undefined : ()=>toggleModal(modalSlug),
        type: "button"
    }, t('cancel')), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        id: "confirm-delete",
        onClick: deleting ? undefined : handleDelete
    }, deleting ? t('deleting') : t('confirm')))));
};
const _default = DeleteMany;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL0RlbGV0ZU1hbnkvaW5kZXgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZGFsLCB1c2VNb2RhbCB9IGZyb20gJ0BmYWNlbGVzcy11aS9tb2RhbCdcbmltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHRvYXN0IH0gZnJvbSAncmVhY3QtdG9hc3RpZnknXG5cbmltcG9ydCB0eXBlIHsgUHJvcHMgfSBmcm9tICcuL3R5cGVzJ1xuXG5pbXBvcnQgeyBnZXRUcmFuc2xhdGlvbiB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdGllcy9nZXRUcmFuc2xhdGlvbidcbmltcG9ydCB7IHJlcXVlc3RzIH0gZnJvbSAnLi4vLi4vLi4vYXBpJ1xuaW1wb3J0IE1pbmltYWxUZW1wbGF0ZSBmcm9tICcuLi8uLi90ZW1wbGF0ZXMvTWluaW1hbCdcbmltcG9ydCB7IHVzZUF1dGggfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvQXV0aCdcbmltcG9ydCB7IHVzZUNvbmZpZyB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9Db25maWcnXG5pbXBvcnQgeyBTZWxlY3RBbGxTdGF0dXMsIHVzZVNlbGVjdGlvbiB9IGZyb20gJy4uLy4uL3ZpZXdzL2NvbGxlY3Rpb25zL0xpc3QvU2VsZWN0aW9uUHJvdmlkZXInXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbidcbmltcG9ydCBQaWxsIGZyb20gJy4uL1BpbGwnXG5pbXBvcnQgJy4vaW5kZXguc2NzcydcblxuY29uc3QgYmFzZUNsYXNzID0gJ2RlbGV0ZS1kb2N1bWVudHMnXG5cbmNvbnN0IERlbGV0ZU1hbnk6IFJlYWN0LkZDPFByb3BzPiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IGNvbGxlY3Rpb246IHsgc2x1ZywgbGFiZWxzOiB7IHBsdXJhbCB9IH0gPSB7fSwgcmVzZXRQYXJhbXMgfSA9IHByb3BzXG5cbiAgY29uc3QgeyBwZXJtaXNzaW9ucyB9ID0gdXNlQXV0aCgpXG4gIGNvbnN0IHtcbiAgICByb3V0ZXM6IHsgYXBpIH0sXG4gICAgc2VydmVyVVJMLFxuICB9ID0gdXNlQ29uZmlnKClcbiAgY29uc3QgeyB0b2dnbGVNb2RhbCB9ID0gdXNlTW9kYWwoKVxuICBjb25zdCB7IGNvdW50LCBnZXRRdWVyeVBhcmFtcywgc2VsZWN0QWxsLCB0b2dnbGVBbGwgfSA9IHVzZVNlbGVjdGlvbigpXG4gIGNvbnN0IHsgaTE4biwgdCB9ID0gdXNlVHJhbnNsYXRpb24oJ2dlbmVyYWwnKVxuICBjb25zdCBbZGVsZXRpbmcsIHNldERlbGV0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIGNvbnN0IGNvbGxlY3Rpb25QZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zPy5jb2xsZWN0aW9ucz8uW3NsdWddXG4gIGNvbnN0IGhhc0RlbGV0ZVBlcm1pc3Npb24gPSBjb2xsZWN0aW9uUGVybWlzc2lvbnM/LmRlbGV0ZT8ucGVybWlzc2lvblxuXG4gIGNvbnN0IG1vZGFsU2x1ZyA9IGBkZWxldGUtJHtzbHVnfWBcblxuICBjb25zdCBhZGREZWZhdWx0RXJyb3IgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgdG9hc3QuZXJyb3IodCgnZXJyb3I6dW5rbm93bicpKVxuICB9LCBbdF0pXG5cbiAgY29uc3QgaGFuZGxlRGVsZXRlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldERlbGV0aW5nKHRydWUpXG4gICAgdm9pZCByZXF1ZXN0c1xuICAgICAgLmRlbGV0ZShgJHtzZXJ2ZXJVUkx9JHthcGl9LyR7c2x1Z30ke2dldFF1ZXJ5UGFyYW1zKCl9YCwge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0FjY2VwdC1MYW5ndWFnZSc6IGkxOG4ubGFuZ3VhZ2UsXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICAudGhlbihhc3luYyAocmVzKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlcy5qc29uKClcbiAgICAgICAgICB0b2dnbGVNb2RhbChtb2RhbFNsdWcpXG4gICAgICAgICAgaWYgKHJlcy5zdGF0dXMgPCA0MDApIHtcbiAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3MoanNvbi5tZXNzYWdlIHx8IHQoJ2RlbGV0ZWRTdWNjZXNzZnVsbHknKSwgeyBhdXRvQ2xvc2U6IDMwMDAgfSlcbiAgICAgICAgICAgIHRvZ2dsZUFsbCgpXG4gICAgICAgICAgICByZXNldFBhcmFtcyh7IHBhZ2U6IHNlbGVjdEFsbCA/IDEgOiB1bmRlZmluZWQgfSlcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGpzb24uZXJyb3JzKSB7XG4gICAgICAgICAgICBsZXQgbWVzc2FnZSA9IGpzb24ubWVzc2FnZVxuXG4gICAgICAgICAgICBpZiAoanNvbi5lcnJvcnMpIHtcbiAgICAgICAgICAgICAganNvbi5lcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gbWVzc2FnZSArICdcXG4nICsgZXJyb3IubWVzc2FnZVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0b2FzdC5lcnJvcihtZXNzYWdlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhZGREZWZhdWx0RXJyb3IoKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJldHVybiBhZGREZWZhdWx0RXJyb3IoKVxuICAgICAgICB9XG4gICAgICB9KVxuICB9LCBbXG4gICAgYWRkRGVmYXVsdEVycm9yLFxuICAgIGFwaSxcbiAgICBnZXRRdWVyeVBhcmFtcyxcbiAgICBpMThuLmxhbmd1YWdlLFxuICAgIG1vZGFsU2x1ZyxcbiAgICByZXNldFBhcmFtcyxcbiAgICBzZWxlY3RBbGwsXG4gICAgc2VydmVyVVJMLFxuICAgIHNsdWcsXG4gICAgdCxcbiAgICB0b2dnbGVBbGwsXG4gICAgdG9nZ2xlTW9kYWwsXG4gIF0pXG5cbiAgaWYgKHNlbGVjdEFsbCA9PT0gU2VsZWN0QWxsU3RhdHVzLk5vbmUgfHwgIWhhc0RlbGV0ZVBlcm1pc3Npb24pIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICA8UGlsbFxuICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3RvZ2dsZWB9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICBzZXREZWxldGluZyhmYWxzZSlcbiAgICAgICAgICB0b2dnbGVNb2RhbChtb2RhbFNsdWcpXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHt0KCdkZWxldGUnKX1cbiAgICAgIDwvUGlsbD5cbiAgICAgIDxNb2RhbCBjbGFzc05hbWU9e2Jhc2VDbGFzc30gc2x1Zz17bW9kYWxTbHVnfT5cbiAgICAgICAgPE1pbmltYWxUZW1wbGF0ZSBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3RlbXBsYXRlYH0+XG4gICAgICAgICAgPGgxPnt0KCdjb25maXJtRGVsZXRpb24nKX08L2gxPlxuICAgICAgICAgIDxwPnt0KCdhYm91dFRvRGVsZXRlQ291bnQnLCB7IGNvdW50LCBsYWJlbDogZ2V0VHJhbnNsYXRpb24ocGx1cmFsLCBpMThuKSB9KX08L3A+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgYnV0dG9uU3R5bGU9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgaWQ9XCJjb25maXJtLWNhbmNlbFwiXG4gICAgICAgICAgICBvbkNsaWNrPXtkZWxldGluZyA/IHVuZGVmaW5lZCA6ICgpID0+IHRvZ2dsZU1vZGFsKG1vZGFsU2x1Zyl9XG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnY2FuY2VsJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvbiBpZD1cImNvbmZpcm0tZGVsZXRlXCIgb25DbGljaz17ZGVsZXRpbmcgPyB1bmRlZmluZWQgOiBoYW5kbGVEZWxldGV9PlxuICAgICAgICAgICAge2RlbGV0aW5nID8gdCgnZGVsZXRpbmcnKSA6IHQoJ2NvbmZpcm0nKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9NaW5pbWFsVGVtcGxhdGU+XG4gICAgICA8L01vZGFsPlxuICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVsZXRlTWFueVxuIl0sIm5hbWVzIjpbImJhc2VDbGFzcyIsIkRlbGV0ZU1hbnkiLCJwcm9wcyIsImNvbGxlY3Rpb24iLCJzbHVnIiwibGFiZWxzIiwicGx1cmFsIiwicmVzZXRQYXJhbXMiLCJwZXJtaXNzaW9ucyIsInVzZUF1dGgiLCJyb3V0ZXMiLCJhcGkiLCJzZXJ2ZXJVUkwiLCJ1c2VDb25maWciLCJ0b2dnbGVNb2RhbCIsInVzZU1vZGFsIiwiY291bnQiLCJnZXRRdWVyeVBhcmFtcyIsInNlbGVjdEFsbCIsInRvZ2dsZUFsbCIsInVzZVNlbGVjdGlvbiIsImkxOG4iLCJ0IiwidXNlVHJhbnNsYXRpb24iLCJkZWxldGluZyIsInNldERlbGV0aW5nIiwidXNlU3RhdGUiLCJjb2xsZWN0aW9uUGVybWlzc2lvbnMiLCJjb2xsZWN0aW9ucyIsImhhc0RlbGV0ZVBlcm1pc3Npb24iLCJkZWxldGUiLCJwZXJtaXNzaW9uIiwibW9kYWxTbHVnIiwiYWRkRGVmYXVsdEVycm9yIiwidXNlQ2FsbGJhY2siLCJ0b2FzdCIsImVycm9yIiwiaGFuZGxlRGVsZXRlIiwicmVxdWVzdHMiLCJoZWFkZXJzIiwibGFuZ3VhZ2UiLCJ0aGVuIiwicmVzIiwianNvbiIsInN0YXR1cyIsInN1Y2Nlc3MiLCJtZXNzYWdlIiwiYXV0b0Nsb3NlIiwicGFnZSIsInVuZGVmaW5lZCIsImVycm9ycyIsImZvckVhY2giLCJlIiwiU2VsZWN0QWxsU3RhdHVzIiwiTm9uZSIsIlJlYWN0IiwiRnJhZ21lbnQiLCJQaWxsIiwiY2xhc3NOYW1lIiwib25DbGljayIsIk1vZGFsIiwiTWluaW1hbFRlbXBsYXRlIiwiaDEiLCJwIiwibGFiZWwiLCJnZXRUcmFuc2xhdGlvbiIsIkJ1dHRvbiIsImJ1dHRvblN0eWxlIiwiaWQiLCJ0eXBlIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OytCQWtJQTs7O2VBQUE7Ozt1QkFsSWdDOytEQUNhOzhCQUNkOytCQUNUO2dDQUlTO3FCQUNOO2dFQUNHO3NCQUNKO3dCQUNFO21DQUNvQjsrREFDM0I7NkRBQ0Y7UUFDVjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFUCxNQUFNQSxZQUFZO0FBRWxCLE1BQU1DLGFBQThCLENBQUNDO0lBQ25DLE1BQU0sRUFBRUMsWUFBWSxFQUFFQyxJQUFJLEVBQUVDLFFBQVEsRUFBRUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRUMsV0FBVyxFQUFFLEdBQUdMO0lBRXZFLE1BQU0sRUFBRU0sV0FBVyxFQUFFLEdBQUdDLElBQUFBLGFBQU87SUFDL0IsTUFBTSxFQUNKQyxRQUFRLEVBQUVDLEdBQUcsRUFBRSxFQUNmQyxTQUFTLEVBQ1YsR0FBR0MsSUFBQUEsaUJBQVM7SUFDYixNQUFNLEVBQUVDLFdBQVcsRUFBRSxHQUFHQyxJ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