"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    AuthProvider: function() {
        return AuthProvider;
    },
    useAuth: function() {
        return useAuth;
    }
});
const _modal = require("@faceless-ui/modal");
const _qs = /*#__PURE__*/ _interop_require_default(require("qs"));
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reacti18next = require("react-i18next");
const _reactrouterdom = require("react-router-dom");
const _reacttoastify = require("react-toastify");
const _api = require("../../../api");
const _useDebounce = /*#__PURE__*/ _interop_require_default(require("../../../hooks/useDebounce"));
const _Config = require("../Config");
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
const Context = /*#__PURE__*/ (0, _react.createContext)({});
const maxTimeoutTime = 2147483647;
const AuthProvider = ({ children })=>{
    const [user, setUser] = (0, _react.useState)();
    const [tokenInMemory, setTokenInMemory] = (0, _react.useState)();
    const [tokenExpiration, setTokenExpiration] = (0, _react.useState)();
    const [strategy, setStrategy] = (0, _react.useState)();
    const { pathname } = (0, _reactrouterdom.useLocation)();
    const { push } = (0, _reactrouterdom.useHistory)();
    const config = (0, _Config.useConfig)();
    const { admin: { autoLogin, inactivityRoute: logoutInactivityRoute, user: userSlug }, routes: { admin, api }, serverURL } = config;
    const [permissions, setPermissions] = (0, _react.useState)();
    const { i18n } = (0, _reacti18next.useTranslation)();
    const { closeAllModals, openModal } = (0, _modal.useModal)();
    const [lastLocationChange, setLastLocationChange] = (0, _react.useState)(0);
    const debouncedLocationChange = (0, _useDebounce.default)(lastLocationChange, 10000);
    const userIDRef = _react.default.useRef();
    const id = user?.id;
    const refreshPermissions = (0, _react.useCallback)(async ({ locale } = {})=>{
        const params = {
            locale
        };
        try {
            const request = await _api.requests.get(`${serverURL}${api}/access${_qs.default.stringify(params, {
                addQueryPrefix: true
            })}`, {
                headers: {
                    'Accept-Language': i18n.language
                }
            });
            if (request.status === 200) {
                const json = await request.json();
                setPermissions(json);
            } else {
                throw new Error(`Fetching permissions failed with status code ${request.status}`);
            }
        } catch (e) {
            _reacttoastify.toast.error(`Refreshing permissions failed: ${e.message}`);
        }
    }, [
        serverURL,
        api,
        i18n
    ]);
    const setActiveUser = _react.default.useCallback(async (userToSet)=>{
        if (userIDRef.current && !userToSet?.id || userToSet?.id) {
            // refresh on logout and login
            await refreshPermissions();
        }
        userIDRef.current = userToSet?.id || null;
        setUser(userToSet);
    }, [
        refreshPermissions
    ]);
    const redirectToInactivityRoute = (0, _react.useCallback)(()=>{
        if (window.location.pathname.startsWith(admin)) {
            const redirectParam = `?redirect=${encodeURIComponent(window.location.pathname.replace(admin, ''))}`;
            push(`${admin}${logoutInactivityRoute}${redirectParam}`);
        } else {
            push(`${admin}${logoutInactivityRoute}`);
        }
        closeAllModals();
    }, [
        push,
        admin,
        logoutInactivityRoute,
        closeAllModals
    ]);
    const revokeTokenAndExpire = (0, _react.useCallback)(()=>{
        setTokenInMemory(undefined);
        setTokenExpiration(undefined);
        setStrategy(undefined);
    }, []);
    const setTokenAndExpiration = (0, _react.useCallback)((json)=>{
        const token = json?.token || json?.refreshedToken;
        if (token && json?.exp) {
            setTokenInMemory(token);
            setTokenExpiration(json.exp);
            if (json.strategy) {
                setStrategy(json.strategy);
            }
        } else {
            revokeTokenAndExpire();
        }
    }, [
        revokeTokenAndExpire
    ]);
    const refreshCookie = (0, _react.useCallback)((forceRefresh)=>{
        const now = Math.round(new Date().getTime() / 1000);
        const remainingTime = (typeof tokenExpiration === 'number' ? tokenExpiration : 0) - now;
        if (forceRefresh || tokenExpiration && remainingTime < 120) {
            setTimeout(async ()=>{
                try {
                    const request = await _api.requests.post(`${serverURL}${api}/${userSlug}/refresh-token`, {
                        headers: {
                            'Accept-Language': i18n.language
                        }
                    });
                    if (request.status === 200) {
                        const json = await request.json();
                        await setActiveUser(json.user);
                        setTokenAndExpiration(json);
                    } else {
                        await setActiveUser(null);
                        redirectToInactivityRoute();
                    }
                } catch (e) {
                    _reacttoastify.toast.error(e.message);
                }
            }, 1000);
        }
    }, [
        tokenExpiration,
        serverURL,
        api,
        userSlug,
        i18n.language,
        setActiveUser,
        setTokenAndExpiration,
        redirectToInactivityRoute
    ]);
    const refreshCookieAsync = (0, _react.useCallback)(async (skipSetUser)=>{
        try {
            const request = await _api.requests.post(`${serverURL}${api}/${userSlug}/refresh-token`, {
                headers: {
                    'Accept-Language': i18n.language
                }
            });
            if (request.status === 200) {
                const json = await request.json();
                if (!skipSetUser) {
                    await setActiveUser(json.user);
                    setTokenAndExpiration(json);
                }
                return json.user;
            }
            await setActiveUser(null);
            redirectToInactivityRoute();
            return null;
        } catch (e) {
            _reacttoastify.toast.error(`Refreshing token failed: ${e.message}`);
            return null;
        }
    }, [
        serverURL,
        api,
        userSlug,
        i18n,
        redirectToInactivityRoute,
        setTokenAndExpiration,
        setActiveUser
    ]);
    const logOut = (0, _react.useCallback)(async ()=>{
        await setActiveUser(null);
        revokeTokenAndExpire();
        void _api.requests.post(`${serverURL}${api}/${userSlug}/logout`);
    }, [
        serverURL,
        api,
        userSlug,
        revokeTokenAndExpire,
        setActiveUser
    ]);
    const fetchFullUser = _react.default.useCallback(async ()=>{
        try {
            const request = await _api.requests.get(`${serverURL}${api}/${userSlug}/me`, {
                headers: {
                    'Accept-Language': i18n.language
                }
            });
            if (request.status === 200) {
                const json = await request.json();
                if (json?.user) {
                    await setActiveUser(json.user);
                    if (json?.token) {
                        setTokenAndExpiration(json);
                    }
                } else if (autoLogin && autoLogin.prefillOnly !== true) {
                    // auto log-in with the provided autoLogin credentials. This is used in dev mode
                    // so you don't have to log in over and over again
                    const autoLoginResult = await _api.requests.post(`${serverURL}${api}/${userSlug}/login`, {
                        body: JSON.stringify({
                            email: autoLogin.email,
                            password: autoLogin.password
                        }),
                        headers: {
                            'Accept-Language': i18n.language,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (autoLoginResult.status === 200) {
                        const autoLoginJson = await autoLoginResult.json();
                        await setActiveUser(autoLoginJson.user);
                        if (autoLoginJson?.token) {
                            setTokenAndExpiration(autoLoginJson);
                        }
                    } else {
                        await setActiveUser(null);
                        revokeTokenAndExpire();
                    }
                } else {
                    await setActiveUser(null);
                    revokeTokenAndExpire();
                }
            }
        } catch (e) {
            _reacttoastify.toast.error(`Fetching user failed: ${e.message}`);
        }
    }, [
        serverURL,
        api,
        userSlug,
        i18n,
        autoLogin,
        setTokenAndExpiration,
        revokeTokenAndExpire,
        setActiveUser
    ]);
    // On mount, get user and set
    (0, _react.useEffect)(()=>{
        if (id === undefined || id !== userIDRef.current) {
            void fetchFullUser();
        }
    }, [
        fetchFullUser,
        id
    ]);
    // When location changes, refresh cookie
    (0, _react.useEffect)(()=>{
        if (id) {
            refreshCookie();
        }
    }, [
        debouncedLocationChange,
        refreshCookie,
        id
    ]);
    (0, _react.useEffect)(()=>{
        setLastLocationChange(Date.now());
    }, [
        pathname
    ]);
    (0, _react.useEffect)(()=>{
        let reminder;
        const now = Math.round(new Date().getTime() / 1000);
        const remainingTime = typeof tokenExpiration === 'number' ? tokenExpiration - now : 0;
        if (remainingTime > 0) {
            reminder = setTimeout(()=>{
                openModal('stay-logged-in');
            }, Math.max(Math.min((remainingTime - 60) * 1000, maxTimeoutTime)));
        }
        return ()=>{
            if (reminder) clearTimeout(reminder);
        };
    }, [
        tokenExpiration,
        openModal
    ]);
    (0, _react.useEffect)(()=>{
        let forceLogOut;
        const now = Math.round(new Date().getTime() / 1000);
        const remainingTime = typeof tokenExpiration === 'number' ? tokenExpiration - now : 0;
        if (remainingTime > 0) {
            forceLogOut = setTimeout(async ()=>{
                await setActiveUser(null);
                revokeTokenAndExpire();
                redirectToInactivityRoute();
            }, Math.max(Math.min(remainingTime * 1000, maxTimeoutTime), 0));
        }
        return ()=>{
            if (forceLogOut) clearTimeout(forceLogOut);
        };
    }, [
        tokenExpiration,
        closeAllModals,
        i18n,
        redirectToInactivityRoute,
        revokeTokenAndExpire,
        setActiveUser
    ]);
    return /*#__PURE__*/ _react.default.createElement(Context.Provider, {
        value: {
            fetchFullUser,
            logOut,
            permissions,
            refreshCookie,
            refreshCookieAsync,
            refreshPermissions,
            setUser: setActiveUser,
            strategy,
            token: tokenInMemory,
            tokenExpiration,
            user
        }
    }, children);
};
const useAuth = ()=>(0, _react.useContext)(Context);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3V0aWxpdGllcy9BdXRoL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VNb2RhbCB9IGZyb20gJ0BmYWNlbGVzcy11aS9tb2RhbCdcbmltcG9ydCBxcyBmcm9tICdxcydcbmltcG9ydCBSZWFjdCwgeyBjcmVhdGVDb250ZXh0LCB1c2VDYWxsYmFjaywgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlSGlzdG9yeSwgdXNlTG9jYXRpb24gfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJ1xuaW1wb3J0IHsgdG9hc3QgfSBmcm9tICdyZWFjdC10b2FzdGlmeSdcblxuaW1wb3J0IHR5cGUgeyBQZXJtaXNzaW9ucywgVXNlciB9IGZyb20gJy4uLy4uLy4uLy4uL2F1dGgvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEF1dGhDb250ZXh0IH0gZnJvbSAnLi90eXBlcydcblxuaW1wb3J0IHsgcmVxdWVzdHMgfSBmcm9tICcuLi8uLi8uLi9hcGknXG5pbXBvcnQgdXNlRGVib3VuY2UgZnJvbSAnLi4vLi4vLi4vaG9va3MvdXNlRGVib3VuY2UnXG5pbXBvcnQgeyB1c2VDb25maWcgfSBmcm9tICcuLi9Db25maWcnXG5cbmNvbnN0IENvbnRleHQgPSBjcmVhdGVDb250ZXh0KHt9IGFzIEF1dGhDb250ZXh0KVxuXG5jb25zdCBtYXhUaW1lb3V0VGltZSA9IDIxNDc0ODM2NDdcblxuZXhwb3J0IGNvbnN0IEF1dGhQcm92aWRlcjogUmVhY3QuRkM8eyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0+ID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xuICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZTxVc2VyIHwgbnVsbD4oKVxuICBjb25zdCBbdG9rZW5Jbk1lbW9yeSwgc2V0VG9rZW5Jbk1lbW9yeV0gPSB1c2VTdGF0ZTxzdHJpbmc+KClcbiAgY29uc3QgW3Rva2VuRXhwaXJhdGlvbiwgc2V0VG9rZW5FeHBpcmF0aW9uXSA9IHVzZVN0YXRlPG51bWJlcj4oKVxuICBjb25zdCBbc3RyYXRlZ3ksIHNldFN0cmF0ZWd5XSA9IHVzZVN0YXRlPHN0cmluZz4oKVxuICBjb25zdCB7IHBhdGhuYW1lIH0gPSB1c2VMb2NhdGlvbigpXG4gIGNvbnN0IHsgcHVzaCB9ID0gdXNlSGlzdG9yeSgpXG5cbiAgY29uc3QgY29uZmlnID0gdXNlQ29uZmlnKClcblxuICBjb25zdCB7XG4gICAgYWRtaW46IHsgYXV0b0xvZ2luLCBpbmFjdGl2aXR5Um91dGU6IGxvZ291dEluYWN0aXZpdHlSb3V0ZSwgdXNlcjogdXNlclNsdWcgfSxcbiAgICByb3V0ZXM6IHsgYWRtaW4sIGFwaSB9LFxuICAgIHNlcnZlclVSTCxcbiAgfSA9IGNvbmZpZ1xuXG4gIGNvbnN0IFtwZXJtaXNzaW9ucywgc2V0UGVybWlzc2lvbnNdID0gdXNlU3RhdGU8UGVybWlzc2lvbnM+KClcblxuICBjb25zdCB7IGkxOG4gfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyBjbG9zZUFsbE1vZGFscywgb3Blbk1vZGFsIH0gPSB1c2VNb2RhbCgpXG4gIGNvbnN0IFtsYXN0TG9jYXRpb25DaGFuZ2UsIHNldExhc3RMb2NhdGlvbkNoYW5nZV0gPSB1c2VTdGF0ZSgwKVxuICBjb25zdCBkZWJvdW5jZWRMb2NhdGlvbkNoYW5nZSA9IHVzZURlYm91bmNlKGxhc3RMb2NhdGlvbkNoYW5nZSwgMTAwMDApXG4gIGNvbnN0IHVzZXJJRFJlZiA9IFJlYWN0LnVzZVJlZjxudWxsIHwgbnVtYmVyIHwgc3RyaW5nPigpXG5cbiAgY29uc3QgaWQgPSB1c2VyPy5pZFxuXG4gIGNvbnN0IHJlZnJlc2hQZXJtaXNzaW9ucyA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICh7IGxvY2FsZSB9OiB7IGxvY2FsZT86IHN0cmluZyB9ID0ge30pID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgbG9jYWxlLFxuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IGF3YWl0IHJlcXVlc3RzLmdldChcbiAgICAgICAgICBgJHtzZXJ2ZXJVUkx9JHthcGl9L2FjY2VzcyR7cXMuc3RyaW5naWZ5KHBhcmFtcywgeyBhZGRRdWVyeVByZWZpeDogdHJ1ZSB9KX1gLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgJ0FjY2VwdC1MYW5ndWFnZSc6IGkxOG4ubGFuZ3VhZ2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIClcblxuICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGNvbnN0IGpzb246IFBlcm1pc3Npb25zID0gYXdhaXQgcmVxdWVzdC5qc29uKClcbiAgICAgICAgICBzZXRQZXJtaXNzaW9ucyhqc29uKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmV0Y2hpbmcgcGVybWlzc2lvbnMgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJHtyZXF1ZXN0LnN0YXR1c31gKVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRvYXN0LmVycm9yKGBSZWZyZXNoaW5nIHBlcm1pc3Npb25zIGZhaWxlZDogJHtlLm1lc3NhZ2V9YClcbiAgICAgIH1cbiAgICB9LFxuICAgIFtzZXJ2ZXJVUkwsIGFwaSwgaTE4bl0sXG4gIClcblxuICBjb25zdCBzZXRBY3RpdmVVc2VyID0gUmVhY3QudXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHVzZXJUb1NldDogVXNlciB8IG51bGwpID0+IHtcbiAgICAgIGlmICgodXNlcklEUmVmLmN1cnJlbnQgJiYgIXVzZXJUb1NldD8uaWQpIHx8IHVzZXJUb1NldD8uaWQpIHtcbiAgICAgICAgLy8gcmVmcmVzaCBvbiBsb2dvdXQgYW5kIGxvZ2luXG4gICAgICAgIGF3YWl0IHJlZnJlc2hQZXJtaXNzaW9ucygpXG4gICAgICB9XG4gICAgICB1c2VySURSZWYuY3VycmVudCA9IHVzZXJUb1NldD8uaWQgfHwgbnVsbFxuICAgICAgc2V0VXNlcih1c2VyVG9TZXQpXG4gICAgfSxcbiAgICBbcmVmcmVzaFBlcm1pc3Npb25zXSxcbiAgKVxuXG4gIGNvbnN0IHJlZGlyZWN0VG9JbmFjdGl2aXR5Um91dGUgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zdGFydHNXaXRoKGFkbWluKSkge1xuICAgICAgY29uc3QgcmVkaXJlY3RQYXJhbSA9IGA/cmVkaXJlY3Q9JHtlbmNvZGVVUklDb21wb25lbnQoXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKGFkbWluLCAnJyksXG4gICAgICApfWBcbiAgICAgIHB1c2goYCR7YWRtaW59JHtsb2dvdXRJbmFjdGl2aXR5Um91dGV9JHtyZWRpcmVjdFBhcmFtfWApXG4gICAgfSBlbHNlIHtcbiAgICAgIHB1c2goYCR7YWRtaW59JHtsb2dvdXRJbmFjdGl2aXR5Um91dGV9YClcbiAgICB9XG4gICAgY2xvc2VBbGxNb2RhbHMoKVxuICB9LCBbcHVzaCwgYWRtaW4sIGxvZ291dEluYWN0aXZpdHlSb3V0ZSwgY2xvc2VBbGxNb2RhbHNdKVxuXG4gIGNvbnN0IHJldm9rZVRva2VuQW5kRXhwaXJlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldFRva2VuSW5NZW1vcnkodW5kZWZpbmVkKVxuICAgIHNldFRva2VuRXhwaXJhdGlvbih1bmRlZmluZWQpXG4gICAgc2V0U3RyYXRlZ3kodW5kZWZpbmVkKVxuICB9LCBbXSlcblxuICBjb25zdCBzZXRUb2tlbkFuZEV4cGlyYXRpb24gPSB1c2VDYWxsYmFjayhcbiAgICAoanNvbikgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBqc29uPy50b2tlbiB8fCBqc29uPy5yZWZyZXNoZWRUb2tlblxuICAgICAgaWYgKHRva2VuICYmIGpzb24/LmV4cCkge1xuICAgICAgICBzZXRUb2tlbkluTWVtb3J5KHRva2VuKVxuICAgICAgICBzZXRUb2tlbkV4cGlyYXRpb24oanNvbi5leHApXG4gICAgICAgIGlmIChqc29uLnN0cmF0ZWd5KSB7XG4gICAgICAgICAgc2V0U3RyYXRlZ3koanNvbi5zdHJhdGVneSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV2b2tlVG9rZW5BbmRFeHBpcmUoKVxuICAgICAgfVxuICAgIH0sXG4gICAgW3Jldm9rZVRva2VuQW5kRXhwaXJlXSxcbiAgKVxuXG4gIGNvbnN0IHJlZnJlc2hDb29raWUgPSB1c2VDYWxsYmFjayhcbiAgICAoZm9yY2VSZWZyZXNoPzogYm9vbGVhbikgPT4ge1xuICAgICAgY29uc3Qgbm93ID0gTWF0aC5yb3VuZChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApXG4gICAgICBjb25zdCByZW1haW5pbmdUaW1lID0gKHR5cGVvZiB0b2tlbkV4cGlyYXRpb24gPT09ICdudW1iZXInID8gdG9rZW5FeHBpcmF0aW9uIDogMCkgLSBub3dcblxuICAgICAgaWYgKGZvcmNlUmVmcmVzaCB8fCAodG9rZW5FeHBpcmF0aW9uICYmIHJlbWFpbmluZ1RpbWUgPCAxMjApKSB7XG4gICAgICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gYXdhaXQgcmVxdWVzdHMucG9zdChgJHtzZXJ2ZXJVUkx9JHthcGl9LyR7dXNlclNsdWd9L3JlZnJlc2gtdG9rZW5gLCB7XG4gICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQWNjZXB0LUxhbmd1YWdlJzogaTE4bi5sYW5ndWFnZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXF1ZXN0Lmpzb24oKVxuICAgICAgICAgICAgICBhd2FpdCBzZXRBY3RpdmVVc2VyKGpzb24udXNlcilcbiAgICAgICAgICAgICAgc2V0VG9rZW5BbmRFeHBpcmF0aW9uKGpzb24pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhd2FpdCBzZXRBY3RpdmVVc2VyKG51bGwpXG4gICAgICAgICAgICAgIHJlZGlyZWN0VG9JbmFjdGl2aXR5Um91dGUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRvYXN0LmVycm9yKGUubWVzc2FnZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDApXG4gICAgICB9XG4gICAgfSxcbiAgICBbXG4gICAgICB0b2tlbkV4cGlyYXRpb24sXG4gICAgICBzZXJ2ZXJVUkwsXG4gICAgICBhcGksXG4gICAgICB1c2VyU2x1ZyxcbiAgICAgIGkxOG4ubGFuZ3VhZ2UsXG4gICAgICBzZXRBY3RpdmVVc2VyLFxuICAgICAgc2V0VG9rZW5BbmRFeHBpcmF0aW9uLFxuICAgICAgcmVkaXJlY3RUb0luYWN0aXZpdHlSb3V0ZSxcbiAgICBdLFxuICApXG5cbiAgY29uc3QgcmVmcmVzaENvb2tpZUFzeW5jID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHNraXBTZXRVc2VyPzogYm9vbGVhbik6IFByb21pc2U8VXNlcj4gPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IGF3YWl0IHJlcXVlc3RzLnBvc3QoYCR7c2VydmVyVVJMfSR7YXBpfS8ke3VzZXJTbHVnfS9yZWZyZXNoLXRva2VuYCwge1xuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdBY2NlcHQtTGFuZ3VhZ2UnOiBpMThuLmxhbmd1YWdlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVxdWVzdC5qc29uKClcbiAgICAgICAgICBpZiAoIXNraXBTZXRVc2VyKSB7XG4gICAgICAgICAgICBhd2FpdCBzZXRBY3RpdmVVc2VyKGpzb24udXNlcilcbiAgICAgICAgICAgIHNldFRva2VuQW5kRXhwaXJhdGlvbihqc29uKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4ganNvbi51c2VyXG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBzZXRBY3RpdmVVc2VyKG51bGwpXG4gICAgICAgIHJlZGlyZWN0VG9JbmFjdGl2aXR5Um91dGUoKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0b2FzdC5lcnJvcihgUmVmcmVzaGluZyB0b2tlbiBmYWlsZWQ6ICR7ZS5tZXNzYWdlfWApXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSxcbiAgICBbXG4gICAgICBzZXJ2ZXJVUkwsXG4gICAgICBhcGksXG4gICAgICB1c2VyU2x1ZyxcbiAgICAgIGkxOG4sXG4gICAgICByZWRpcmVjdFRvSW5hY3Rpdml0eVJvdXRlLFxuICAgICAgc2V0VG9rZW5BbmRFeHBpcmF0aW9uLFxuICAgICAgc2V0QWN0aXZlVXNlcixcbiAgICBdLFxuICApXG5cbiAgY29uc3QgbG9nT3V0ID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHNldEFjdGl2ZVVzZXIobnVsbClcbiAgICByZXZva2VUb2tlbkFuZEV4cGlyZSgpXG4gICAgdm9pZCByZXF1ZXN0cy5wb3N0KGAke3NlcnZlclVSTH0ke2FwaX0vJHt1c2VyU2x1Z30vbG9nb3V0YClcbiAgfSwgW3NlcnZlclVSTCwgYXBpLCB1c2VyU2x1ZywgcmV2b2tlVG9rZW5BbmRFeHBpcmUsIHNldEFjdGl2ZVVzZXJdKVxuXG4gIGNvbnN0IGZldGNoRnVsbFVzZXIgPSBSZWFjdC51c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBhd2FpdCByZXF1ZXN0cy5nZXQoYCR7c2VydmVyVVJMfSR7YXBpfS8ke3VzZXJTbHVnfS9tZWAsIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdBY2NlcHQtTGFuZ3VhZ2UnOiBpMThuLmxhbmd1YWdlLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlcXVlc3QuanNvbigpXG5cbiAgICAgICAgaWYgKGpzb24/LnVzZXIpIHtcbiAgICAgICAgICBhd2FpdCBzZXRBY3RpdmVVc2VyKGpzb24udXNlcilcbiAgICAgICAgICBpZiAoanNvbj8udG9rZW4pIHtcbiAgICAgICAgICAgIHNldFRva2VuQW5kRXhwaXJhdGlvbihqc29uKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhdXRvTG9naW4gJiYgYXV0b0xvZ2luLnByZWZpbGxPbmx5ICE9PSB0cnVlKSB7XG4gICAgICAgICAgLy8gYXV0byBsb2ctaW4gd2l0aCB0aGUgcHJvdmlkZWQgYXV0b0xvZ2luIGNyZWRlbnRpYWxzLiBUaGlzIGlzIHVzZWQgaW4gZGV2IG1vZGVcbiAgICAgICAgICAvLyBzbyB5b3UgZG9uJ3QgaGF2ZSB0byBsb2cgaW4gb3ZlciBhbmQgb3ZlciBhZ2FpblxuICAgICAgICAgIGNvbnN0IGF1dG9Mb2dpblJlc3VsdCA9IGF3YWl0IHJlcXVlc3RzLnBvc3QoYCR7c2VydmVyVVJMfSR7YXBpfS8ke3VzZXJTbHVnfS9sb2dpbmAsIHtcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgZW1haWw6IGF1dG9Mb2dpbi5lbWFpbCxcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6IGF1dG9Mb2dpbi5wYXNzd29yZCxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAnQWNjZXB0LUxhbmd1YWdlJzogaTE4bi5sYW5ndWFnZSxcbiAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAoYXV0b0xvZ2luUmVzdWx0LnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICBjb25zdCBhdXRvTG9naW5Kc29uID0gYXdhaXQgYXV0b0xvZ2luUmVzdWx0Lmpzb24oKVxuICAgICAgICAgICAgYXdhaXQgc2V0QWN0aXZlVXNlcihhdXRvTG9naW5Kc29uLnVzZXIpXG4gICAgICAgICAgICBpZiAoYXV0b0xvZ2luSnNvbj8udG9rZW4pIHtcbiAgICAgICAgICAgICAgc2V0VG9rZW5BbmRFeHBpcmF0aW9uKGF1dG9Mb2dpbkpzb24pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IHNldEFjdGl2ZVVzZXIobnVsbClcbiAgICAgICAgICAgIHJldm9rZVRva2VuQW5kRXhwaXJlKClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXdhaXQgc2V0QWN0aXZlVXNlcihudWxsKVxuICAgICAgICAgIHJldm9rZVRva2VuQW5kRXhwaXJlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRvYXN0LmVycm9yKGBGZXRjaGluZyB1c2VyIGZhaWxlZDogJHtlLm1lc3NhZ2V9YClcbiAgICB9XG4gIH0sIFtcbiAgICBzZXJ2ZXJVUkwsXG4gICAgYXBpLFxuICAgIHVzZXJTbHVnLFxuICAgIGkxOG4sXG4gICAgYXV0b0xvZ2luLFxuICAgIHNldFRva2VuQW5kRXhwaXJhdGlvbixcbiAgICByZXZva2VUb2tlbkFuZEV4cGlyZSxcbiAgICBzZXRBY3RpdmVVc2VyLFxuICBdKVxuXG4gIC8vIE9uIG1vdW50LCBnZXQgdXNlciBhbmQgc2V0XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQgfHwgaWQgIT09IHVzZXJJRFJlZi5jdXJyZW50KSB7XG4gICAgICB2b2lkIGZldGNoRnVsbFVzZXIoKVxuICAgIH1cbiAgfSwgW2ZldGNoRnVsbFVzZXIsIGlkXSlcblxuICAvLyBXaGVuIGxvY2F0aW9uIGNoYW5nZXMsIHJlZnJlc2ggY29va2llXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlkKSB7XG4gICAgICByZWZyZXNoQ29va2llKClcbiAgICB9XG4gIH0sIFtkZWJvdW5jZWRMb2NhdGlvbkNoYW5nZSwgcmVmcmVzaENvb2tpZSwgaWRdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0TGFzdExvY2F0aW9uQ2hhbmdlKERhdGUubm93KCkpXG4gIH0sIFtwYXRobmFtZV0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgcmVtaW5kZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+XG4gICAgY29uc3Qgbm93ID0gTWF0aC5yb3VuZChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApXG4gICAgY29uc3QgcmVtYWluaW5nVGltZSA9IHR5cGVvZiB0b2tlbkV4cGlyYXRpb24gPT09ICdudW1iZXInID8gdG9rZW5FeHBpcmF0aW9uIC0gbm93IDogMFxuXG4gICAgaWYgKHJlbWFpbmluZ1RpbWUgPiAwKSB7XG4gICAgICByZW1pbmRlciA9IHNldFRpbWVvdXQoXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBvcGVuTW9kYWwoJ3N0YXktbG9nZ2VkLWluJylcbiAgICAgICAgfSxcbiAgICAgICAgTWF0aC5tYXgoTWF0aC5taW4oKHJlbWFpbmluZ1RpbWUgLSA2MCkgKiAxMDAwLCBtYXhUaW1lb3V0VGltZSkpLFxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocmVtaW5kZXIpIGNsZWFyVGltZW91dChyZW1pbmRlcilcbiAgICB9XG4gIH0sIFt0b2tlbkV4cGlyYXRpb24sIG9wZW5Nb2RhbF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgZm9yY2VMb2dPdXQ6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+XG4gICAgY29uc3Qgbm93ID0gTWF0aC5yb3VuZChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApXG4gICAgY29uc3QgcmVtYWluaW5nVGltZSA9IHR5cGVvZiB0b2tlbkV4cGlyYXRpb24gPT09ICdudW1iZXInID8gdG9rZW5FeHBpcmF0aW9uIC0gbm93IDogMFxuXG4gICAgaWYgKHJlbWFpbmluZ1RpbWUgPiAwKSB7XG4gICAgICBmb3JjZUxvZ091dCA9IHNldFRpbWVvdXQoXG4gICAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBzZXRBY3RpdmVVc2VyKG51bGwpXG4gICAgICAgICAgcmV2b2tlVG9rZW5BbmRFeHBpcmUoKVxuICAgICAgICAgIHJlZGlyZWN0VG9JbmFjdGl2aXR5Um91dGUoKVxuICAgICAgICB9LFxuICAgICAgICBNYXRoLm1heChNYXRoLm1pbihyZW1haW5pbmdUaW1lICogMTAwMCwgbWF4VGltZW91dFRpbWUpLCAwKSxcbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGZvcmNlTG9nT3V0KSBjbGVhclRpbWVvdXQoZm9yY2VMb2dPdXQpXG4gICAgfVxuICB9LCBbXG4gICAgdG9rZW5FeHBpcmF0aW9uLFxuICAgIGNsb3NlQWxsTW9kYWxzLFxuICAgIGkxOG4sXG4gICAgcmVkaXJlY3RUb0luYWN0aXZpdHlSb3V0ZSxcbiAgICByZXZva2VUb2tlbkFuZEV4cGlyZSxcbiAgICBzZXRBY3RpdmVVc2VyLFxuICBdKVxuXG4gIHJldHVybiAoXG4gICAgPENvbnRleHQuUHJvdmlkZXJcbiAgICAgIHZhbHVlPXt7XG4gICAgICAgIGZldGNoRnVsbFVzZXIsXG4gICAgICAgIGxvZ091dCxcbiAgICAgICAgcGVybWlzc2lvbnMsXG4gICAgICAgIHJlZnJlc2hDb29raWUsXG4gICAgICAgIHJlZnJlc2hDb29raWVBc3luYyxcbiAgICAgICAgcmVmcmVzaFBlcm1pc3Npb25zLFxuICAgICAgICBzZXRVc2VyOiBzZXRBY3RpdmVVc2VyLFxuICAgICAgICBzdHJhdGVneSxcbiAgICAgICAgdG9rZW46IHRva2VuSW5NZW1vcnksXG4gICAgICAgIHRva2VuRXhwaXJhdGlvbixcbiAgICAgICAgdXNlcixcbiAgICAgIH19XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvQ29udGV4dC5Qcm92aWRlcj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgdXNlQXV0aCA9IDxUID0gVXNlciw+KCk6IEF1dGhDb250ZXh0PFQ+ID0+IHVzZUNvbnRleHQoQ29udGV4dCkgYXMgQXV0aENvbnRleHQ8VD5cbiJdLCJuYW1lcyI6WyJBdXRoUHJvdmlkZXIiLCJ1c2VBdXRoIiwiQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJtYXhUaW1lb3V0VGltZSIsImNoaWxkcmVuIiwidXNlciIsInNldFVzZXIiLCJ1c2VTdGF0ZSIsInRva2VuSW5NZW1vcnkiLCJzZXRUb2tlbkluTWVtb3J5IiwidG9rZW5FeHBpcmF0aW9uIiwic2V0VG9rZW5FeHBpcmF0aW9uIiwic3RyYXRlZ3kiLCJzZXRTdHJhdGVneSIsInBhdGhuYW1lIiwidXNlTG9jYXRpb24iLCJwdXNoIiwidXNlSGlzdG9yeSIsImNvbmZpZyIsInVzZUNvbmZpZyIsImFkbWluIiwiYXV0b0xvZ2luIiwiaW5hY3Rpdml0eVJvdXRlIiwibG9nb3V0SW5hY3Rpdml0eVJvdXRlIiwidXNlclNsdWciLCJyb3V0ZXMiLCJhcGkiLCJzZXJ2ZXJVUkwiLCJwZXJtaXNzaW9ucyIsInNldFBlcm1pc3Npb25zIiwiaTE4biIsInVzZVRyYW5zbGF0aW9uIiwiY2xvc2VBbGxNb2RhbHMiLCJvcGVuTW9kYWwiLCJ1c2VNb2RhbCIsImxhc3RMb2NhdGlvbkNoYW5nZSIsInNldExhc3RMb2NhdGlvbkNoYW5nZSIsImRlYm91bmNlZExvY2F0aW9uQ2hhbmdlIiwidXNlRGVib3VuY2UiLCJ1c2VySURSZWYiLCJSZWFjdCIsInVzZVJlZiIsImlkIiwicmVmcmVzaFBlcm1pc3Npb25zIiwidXNlQ2FsbGJhY2siLCJsb2NhbGUiLCJwYXJhbXMiLCJyZXF1ZXN0IiwicmVxdWVzdHMiLCJnZXQiLCJxcyIsInN0cmluZ2lmeSIsImFkZFF1ZXJ5UHJlZml4IiwiaGVhZGVycyIsImxhbmd1YWdlIiwic3RhdHVzIiwianNvbiIsIkVycm9yIiwiZSIsInRvYXN0IiwiZXJyb3IiLCJtZXNzYWdlIiwic2V0QWN0aXZlVXNlciIsInVzZXJUb1NldCIsImN1cnJlbnQiLCJyZWRpcmVjdFRvSW5hY3Rpdml0eVJvdXRlIiwid2luZG93IiwibG9jYXRpb24iLCJzdGFydHNXaXRoIiwicmVkaXJlY3RQYXJhbSIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlcGxhY2UiLCJyZXZva2VUb2tlbkFuZEV4cGlyZSIsInVuZGVmaW5lZCIsInNldFRva2VuQW5kRXhwaXJhdGlvbiIsInRva2VuIiwicmVmcmVzaGVkVG9rZW4iLCJleHAiLCJyZWZyZXNoQ29va2llIiwiZm9yY2VSZWZyZXNoIiwibm93IiwiTWF0aCIsInJvdW5kIiwiRGF0ZSIsImdldFRpbWUiLCJyZW1haW5pbmdUaW1lIiwic2V0VGltZW91dCIsInBvc3QiLCJyZWZyZXNoQ29va2llQXN5bmMiLCJza2lwU2V0VXNlciIsImxvZ091dCIsImZldGNoRnVsbFVzZXIiLCJwcmVmaWxsT25seSIsImF1dG9Mb2dpblJlc3VsdCIsImJvZHkiLCJKU09OIiwiZW1haWwiLCJwYXNzd29yZCIsImF1dG9Mb2dpbkpzb24iLCJ1c2VFZmZlY3QiLCJyZW1pbmRlciIsIm1heCIsIm1pbiIsImNsZWFyVGltZW91dCIsImZvcmNlTG9nT3V0IiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZUNvbnRleHQiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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