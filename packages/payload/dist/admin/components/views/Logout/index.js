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
const _Button = /*#__PURE__*/ _interop_require_default(require("../../elements/Button"));
const _Minimal = /*#__PURE__*/ _interop_require_default(require("../../templates/Minimal"));
const _Auth = require("../../utilities/Auth");
const _Config = require("../../utilities/Config");
const _Meta = /*#__PURE__*/ _interop_require_default(require("../../utilities/Meta"));
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
const baseClass = 'logout';
const Logout = (props)=>{
    const { inactivity } = props;
    const { logOut } = (0, _Auth.useAuth)();
    const { routes: { admin } } = (0, _Config.useConfig)();
    const { t } = (0, _reacti18next.useTranslation)('authentication');
    // Fetch 'redirect' from the query string which denotes the URL the user originally tried to visit. This is set in the Routes.tsx file when a user tries to access a protected route and is redirected to the login screen.
    const query = new URLSearchParams((0, _reactrouterdom.useLocation)().search);
    const redirect = query.get('redirect');
    (0, _react.useEffect)(()=>{
        void logOut();
    }, [
        logOut
    ]);
    return /*#__PURE__*/ _react.default.createElement(_Minimal.default, {
        className: baseClass
    }, /*#__PURE__*/ _react.default.createElement(_Meta.default, {
        description: t('logoutUser'),
        keywords: t('logout'),
        title: t('logout')
    }), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__wrap`
    }, inactivity && /*#__PURE__*/ _react.default.createElement("h2", null, t('loggedOutInactivity')), !inactivity && /*#__PURE__*/ _react.default.createElement("h2", null, t('loggedOutSuccessfully')), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        buttonStyle: "secondary",
        el: "anchor",
        url: `${admin}/login${redirect && redirect.length > 0 ? `?redirect=${encodeURIComponent(redirect)}` : ''}`
    }, t('logBackIn'))));
};
const _default = Logout;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL0xvZ291dC9pbmRleC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlTG9jYXRpb24gfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJ1xuXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uLy4uL2VsZW1lbnRzL0J1dHRvbidcbmltcG9ydCBNaW5pbWFsIGZyb20gJy4uLy4uL3RlbXBsYXRlcy9NaW5pbWFsJ1xuaW1wb3J0IHsgdXNlQXV0aCB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9BdXRoJ1xuaW1wb3J0IHsgdXNlQ29uZmlnIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL0NvbmZpZydcbmltcG9ydCBNZXRhIGZyb20gJy4uLy4uL3V0aWxpdGllcy9NZXRhJ1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdsb2dvdXQnXG5cbmNvbnN0IExvZ291dDogUmVhY3QuRkM8eyBpbmFjdGl2aXR5PzogYm9vbGVhbiB9PiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IGluYWN0aXZpdHkgfSA9IHByb3BzXG5cbiAgY29uc3QgeyBsb2dPdXQgfSA9IHVzZUF1dGgoKVxuICBjb25zdCB7XG4gICAgcm91dGVzOiB7IGFkbWluIH0sXG4gIH0gPSB1c2VDb25maWcoKVxuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCdhdXRoZW50aWNhdGlvbicpXG5cbiAgLy8gRmV0Y2ggJ3JlZGlyZWN0JyBmcm9tIHRoZSBxdWVyeSBzdHJpbmcgd2hpY2ggZGVub3RlcyB0aGUgVVJMIHRoZSB1c2VyIG9yaWdpbmFsbHkgdHJpZWQgdG8gdmlzaXQuIFRoaXMgaXMgc2V0IGluIHRoZSBSb3V0ZXMudHN4IGZpbGUgd2hlbiBhIHVzZXIgdHJpZXMgdG8gYWNjZXNzIGEgcHJvdGVjdGVkIHJvdXRlIGFuZCBpcyByZWRpcmVjdGVkIHRvIHRoZSBsb2dpbiBzY3JlZW4uXG4gIGNvbnN0IHF1ZXJ5ID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh1c2VMb2NhdGlvbigpLnNlYXJjaClcbiAgY29uc3QgcmVkaXJlY3QgPSBxdWVyeS5nZXQoJ3JlZGlyZWN0JylcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHZvaWQgbG9nT3V0KClcbiAgfSwgW2xvZ091dF0pXG5cbiAgcmV0dXJuIChcbiAgICA8TWluaW1hbCBjbGFzc05hbWU9e2Jhc2VDbGFzc30+XG4gICAgICA8TWV0YSBkZXNjcmlwdGlvbj17dCgnbG9nb3V0VXNlcicpfSBrZXl3b3Jkcz17dCgnbG9nb3V0Jyl9IHRpdGxlPXt0KCdsb2dvdXQnKX0gLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X193cmFwYH0+XG4gICAgICAgIHtpbmFjdGl2aXR5ICYmIDxoMj57dCgnbG9nZ2VkT3V0SW5hY3Rpdml0eScpfTwvaDI+fVxuICAgICAgICB7IWluYWN0aXZpdHkgJiYgPGgyPnt0KCdsb2dnZWRPdXRTdWNjZXNzZnVsbHknKX08L2gyPn1cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIGJ1dHRvblN0eWxlPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICBlbD1cImFuY2hvclwiXG4gICAgICAgICAgdXJsPXtgJHthZG1pbn0vbG9naW4ke1xuICAgICAgICAgICAgcmVkaXJlY3QgJiYgcmVkaXJlY3QubGVuZ3RoID4gMCA/IGA/cmVkaXJlY3Q9JHtlbmNvZGVVUklDb21wb25lbnQocmVkaXJlY3QpfWAgOiAnJ1xuICAgICAgICAgIH1gfVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ2xvZ0JhY2tJbicpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvTWluaW1hbD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2dvdXRcbiJdLCJuYW1lcyI6WyJiYXNlQ2xhc3MiLCJMb2dvdXQiLCJwcm9wcyIsImluYWN0aXZpdHkiLCJsb2dPdXQiLCJ1c2VBdXRoIiwicm91dGVzIiwiYWRtaW4iLCJ1c2VDb25maWciLCJ0IiwidXNlVHJhbnNsYXRpb24iLCJxdWVyeSIsIlVSTFNlYXJjaFBhcmFtcyIsInVzZUxvY2F0aW9uIiwic2VhcmNoIiwicmVkaXJlY3QiLCJnZXQiLCJ1c2VFZmZlY3QiLCJNaW5pbWFsIiwiY2xhc3NOYW1lIiwiTWV0YSIsImRlc2NyaXB0aW9uIiwia2V5d29yZHMiLCJ0aXRsZSIsImRpdiIsImgyIiwiQnV0dG9uIiwiYnV0dG9uU3R5bGUiLCJlbCIsInVybCIsImxlbmd0aCIsImVuY29kZVVSSUNvbXBvbmVudCJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7K0JBa0RBOzs7ZUFBQTs7OytEQWxEaUM7OEJBQ0Y7Z0NBQ0g7K0RBRVQ7Z0VBQ0M7c0JBQ0k7d0JBQ0U7NkRBQ1Q7UUFDVjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFUCxNQUFNQSxZQUFZO0FBRWxCLE1BQU1DLFNBQTZDLENBQUNDO0lBQ2xELE1BQU0sRUFBRUMsVUFBVSxFQUFFLEdBQUdEO0lBRXZCLE1BQU0sRUFBRUUsTUFBTSxFQUFFLEdBQUdDLElBQUFBLGFBQU87SUFDMUIsTUFBTSxFQUNKQyxRQUFRLEVBQUVDLEtBQUssRUFBRSxFQUNsQixHQUFHQyxJQUFBQSxpQkFBUztJQUNiLE1BQU0sRUFBRUMsQ0FBQyxFQUFFLEdBQUdDLElBQUFBLDRCQUFjLEVBQUM7SUFFN0IsMk5BQTJOO0lBQzNOLE1BQU1DLFFBQVEsSUFBSUMsZ0JBQWdCQyxJQUFBQSwyQkFBVyxJQUFHQyxNQUFNO0lBQ3RELE1BQU1DLFdBQVdKLE1BQU1LLEdBQUcsQ0FBQztJQUUzQkMsSUFBQUEsZ0JBQVMsRUFBQztRQUNSLEtBQUtiO0lBQ1AsR0FBRztRQUFDQTtLQUFPO0lBRVgscUJBQ0UsNkJBQUNjLGdCQUFPO1FBQUNDLFdBQVduQjtxQkFDbEIsNkJBQUNvQixhQUFJO1FBQUNDLGFBQWFaLEVBQUU7UUFBZWEsVUFBVWIsRUFBRTtRQUFXYyxPQUFPZCxFQUFFO3NCQUNwRSw2QkFBQ2U7UUFBSUwsV0FBVyxDQUFDLEVBQUVuQixVQUFVLE1BQU0sQ0FBQztPQUNqQ0csNEJBQWMsNkJBQUNzQixZQUFJaEIsRUFBRSx5QkFDckIsQ0FBQ04sNEJBQWMsNkJBQUNzQixZQUFJaEIsRUFBRSx5Q0FDdkIsNkJBQUNpQixlQUFNO1FBQ0xDLGFBQVk7UUFDWkMsSUFBRztRQUNIQyxLQUFLLENBQUMsRUFBRXRCLE1BQU0sTUFBTSxFQUNsQlEsWUFBWUEsU0FBU2UsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUVDLG1CQUFtQmhCLFVBQVUsQ0FBQyxHQUFHLEdBQ2pGLENBQUM7T0FFRE4sRUFBRTtBQUtiO01BRUEsV0FBZVIifQ==