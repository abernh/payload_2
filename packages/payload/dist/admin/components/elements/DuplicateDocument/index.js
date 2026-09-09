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
const _reactrouterdom = require("react-router-dom");
const _reacttoastify = require("react-toastify");
const _getTranslation = require("../../../../utilities/getTranslation");
const _api = require("../../../api");
const _context = require("../../forms/Form/context");
const _Minimal = /*#__PURE__*/ _interop_require_default(require("../../templates/Minimal"));
const _Config = require("../../utilities/Config");
const _Button = /*#__PURE__*/ _interop_require_default(require("../Button"));
const _PopupButtonList = /*#__PURE__*/ _interop_require_wildcard(require("../Popup/PopupButtonList"));
const _baseBeforeDuplicate = require("./baseBeforeDuplicate");
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
const baseClass = 'duplicate';
const Duplicate = ({ id, slug, collection })=>{
    const { push } = (0, _reactrouterdom.useHistory)();
    const modified = (0, _context.useFormModified)();
    const { toggleModal } = (0, _modal.useModal)();
    const { setModified } = (0, _context.useForm)();
    const { localization, routes: { api }, serverURL } = (0, _Config.useConfig)();
    const { routes: { admin } } = (0, _Config.useConfig)();
    const [hasClicked, setHasClicked] = (0, _react.useState)(false);
    const [isSubmitting, setIsSubmitting] = (0, _react.useState)(false);
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const modalSlug = `duplicate-${id}`;
    const handleClick = (0, _react.useCallback)(async (override = false)=>{
        if (isSubmitting) return;
        setIsSubmitting(true);
        setHasClicked(true);
        if (modified && !override) {
            toggleModal(modalSlug);
            return;
        }
        const saveDocument = async ({ id, duplicateID = '', locale = '' })=>{
            const response = await _api.requests.get(`${serverURL}${api}/${slug}/${id}`, {
                headers: {
                    'Accept-Language': i18n.language
                },
                params: {
                    depth: 0,
                    draft: true,
                    'fallback-locale': 'none',
                    locale
                }
            });
            let data = await response.json();
            data = (0, _baseBeforeDuplicate.baseBeforeDuplicate)({
                collection,
                data,
                locale
            });
            if (typeof collection.admin.hooks?.beforeDuplicate === 'function') {
                data = await collection.admin.hooks.beforeDuplicate({
                    collection,
                    data,
                    locale
                });
            }
            delete data['id'];
            if (!duplicateID) {
                if ('createdAt' in data) delete data.createdAt;
                if ('updatedAt' in data) delete data.updatedAt;
            }
            const result = await _api.requests[duplicateID ? 'patch' : 'post'](`${serverURL}${api}/${slug}/${duplicateID}?locale=${locale}&fallback-locale=none`, {
                body: JSON.stringify(data),
                headers: {
                    'Accept-Language': i18n.language,
                    'Content-Type': 'application/json'
                }
            });
            const json = await result.json();
            if (result.status === 201 || result.status === 200) {
                return json.doc.id;
            }
            // only show the error if this is the initial request failing
            if (!duplicateID) {
                json.errors.forEach((error)=>_reacttoastify.toast.error(error.message));
            }
            return null;
        };
        let duplicateID;
        let abort = false;
        const localeErrors = [];
        if (localization) {
            await localization.localeCodes.reduce(async (priorLocalePatch, locale)=>{
                await priorLocalePatch;
                if (abort) return;
                const localeResult = await saveDocument({
                    id,
                    duplicateID,
                    locale
                });
                duplicateID = localeResult || duplicateID;
                if (duplicateID && !localeResult) {
                    localeErrors.push(locale);
                }
                if (!duplicateID) {
                    abort = true;
                }
            }, Promise.resolve());
        } else {
            duplicateID = await saveDocument({
                id
            });
        }
        if (!duplicateID) {
            // document was not saved, error toast was displayed
            return;
        }
        _reacttoastify.toast.success(t('successfullyDuplicated', {
            label: (0, _getTranslation.getTranslation)(collection.labels.singular, i18n)
        }), {
            autoClose: 3000
        });
        if (localeErrors.length > 0) {
            _reacttoastify.toast.error(`
          ${t('error:localesNotSaved_other', {
                count: localeErrors.length
            })}
          ${localeErrors.join(', ')}
          `, {
                autoClose: 5000
            });
        }
        setModified(false);
        setIsSubmitting(false);
        setTimeout(()=>{
            push({
                pathname: `${admin}/collections/${slug}/${duplicateID}`
            });
        }, 10);
    }, [
        modified,
        localization,
        t,
        i18n,
        collection,
        setModified,
        toggleModal,
        modalSlug,
        serverURL,
        api,
        slug,
        id,
        push,
        admin
    ]);
    const confirm = (0, _react.useCallback)(async ()=>{
        await handleClick(true);
        setHasClicked(false);
    }, [
        handleClick
    ]);
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(_PopupButtonList.Button, {
        disabled: isSubmitting,
        id: "action-duplicate",
        onClick: ()=>handleClick(false)
    }, t('duplicate')), modified && hasClicked && /*#__PURE__*/ _react.default.createElement(_modal.Modal, {
        className: `${baseClass}__modal`,
        slug: modalSlug
    }, /*#__PURE__*/ _react.default.createElement(_Minimal.default, {
        className: `${baseClass}__modal-template`
    }, /*#__PURE__*/ _react.default.createElement("h1", null, t('confirmDuplication')), /*#__PURE__*/ _react.default.createElement("p", null, t('unsavedChangesDuplicate')), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        buttonStyle: "secondary",
        id: "confirm-cancel",
        onClick: ()=>toggleModal(modalSlug),
        type: "button"
    }, t('cancel')), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        id: "confirm-duplicate",
        onClick: confirm
    }, t('duplicateWithoutSaving')))));
};
const _default = Duplicate;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL0R1cGxpY2F0ZURvY3VtZW50L2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2RhbCwgdXNlTW9kYWwgfSBmcm9tICdAZmFjZWxlc3MtdWkvbW9kYWwnXG5pbXBvcnQgUmVhY3QsIHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSdcbmltcG9ydCB7IHRvYXN0IH0gZnJvbSAncmVhY3QtdG9hc3RpZnknXG5cbmltcG9ydCB0eXBlIHsgUHJvcHMgfSBmcm9tICcuL3R5cGVzJ1xuXG5pbXBvcnQgeyBnZXRUcmFuc2xhdGlvbiB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdGllcy9nZXRUcmFuc2xhdGlvbidcbmltcG9ydCB7IHJlcXVlc3RzIH0gZnJvbSAnLi4vLi4vLi4vYXBpJ1xuaW1wb3J0IHsgdXNlRm9ybSwgdXNlRm9ybU1vZGlmaWVkIH0gZnJvbSAnLi4vLi4vZm9ybXMvRm9ybS9jb250ZXh0J1xuaW1wb3J0IE1pbmltYWxUZW1wbGF0ZSBmcm9tICcuLi8uLi90ZW1wbGF0ZXMvTWluaW1hbCdcbmltcG9ydCB7IHVzZUNvbmZpZyB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9Db25maWcnXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL0J1dHRvbidcbmltcG9ydCAqIGFzIFBvcHVwTGlzdCBmcm9tICcuLi9Qb3B1cC9Qb3B1cEJ1dHRvbkxpc3QnXG5pbXBvcnQgeyBiYXNlQmVmb3JlRHVwbGljYXRlIH0gZnJvbSAnLi9iYXNlQmVmb3JlRHVwbGljYXRlJ1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdkdXBsaWNhdGUnXG5cbmNvbnN0IER1cGxpY2F0ZTogUmVhY3QuRkM8UHJvcHM+ID0gKHsgaWQsIHNsdWcsIGNvbGxlY3Rpb24gfSkgPT4ge1xuICBjb25zdCB7IHB1c2ggfSA9IHVzZUhpc3RvcnkoKVxuICBjb25zdCBtb2RpZmllZCA9IHVzZUZvcm1Nb2RpZmllZCgpXG4gIGNvbnN0IHsgdG9nZ2xlTW9kYWwgfSA9IHVzZU1vZGFsKClcbiAgY29uc3QgeyBzZXRNb2RpZmllZCB9ID0gdXNlRm9ybSgpXG4gIGNvbnN0IHtcbiAgICBsb2NhbGl6YXRpb24sXG4gICAgcm91dGVzOiB7IGFwaSB9LFxuICAgIHNlcnZlclVSTCxcbiAgfSA9IHVzZUNvbmZpZygpXG4gIGNvbnN0IHtcbiAgICByb3V0ZXM6IHsgYWRtaW4gfSxcbiAgfSA9IHVzZUNvbmZpZygpXG4gIGNvbnN0IFtoYXNDbGlja2VkLCBzZXRIYXNDbGlja2VkXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKVxuICBjb25zdCBbaXNTdWJtaXR0aW5nLCBzZXRJc1N1Ym1pdHRpbmddID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpXG4gIGNvbnN0IHsgaTE4biwgdCB9ID0gdXNlVHJhbnNsYXRpb24oJ2dlbmVyYWwnKVxuXG4gIGNvbnN0IG1vZGFsU2x1ZyA9IGBkdXBsaWNhdGUtJHtpZH1gXG5cbiAgY29uc3QgaGFuZGxlQ2xpY2sgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAob3ZlcnJpZGUgPSBmYWxzZSkgPT4ge1xuICAgICAgaWYgKGlzU3VibWl0dGluZykgcmV0dXJuXG4gICAgICBzZXRJc1N1Ym1pdHRpbmcodHJ1ZSlcbiAgICAgIHNldEhhc0NsaWNrZWQodHJ1ZSlcblxuICAgICAgaWYgKG1vZGlmaWVkICYmICFvdmVycmlkZSkge1xuICAgICAgICB0b2dnbGVNb2RhbChtb2RhbFNsdWcpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBzYXZlRG9jdW1lbnQgPSBhc3luYyAoe1xuICAgICAgICBpZCxcbiAgICAgICAgZHVwbGljYXRlSUQgPSAnJyxcbiAgICAgICAgbG9jYWxlID0gJycsXG4gICAgICB9KTogUHJvbWlzZTxudWxsIHwgc3RyaW5nPiA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxdWVzdHMuZ2V0KGAke3NlcnZlclVSTH0ke2FwaX0vJHtzbHVnfS8ke2lkfWAsIHtcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQWNjZXB0LUxhbmd1YWdlJzogaTE4bi5sYW5ndWFnZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgICBkcmFmdDogdHJ1ZSxcbiAgICAgICAgICAgICdmYWxsYmFjay1sb2NhbGUnOiAnbm9uZScsXG4gICAgICAgICAgICBsb2NhbGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcblxuICAgICAgICBkYXRhID0gYmFzZUJlZm9yZUR1cGxpY2F0ZSh7IGNvbGxlY3Rpb24sIGRhdGEsIGxvY2FsZSB9KVxuXG4gICAgICAgIGlmICh0eXBlb2YgY29sbGVjdGlvbi5hZG1pbi5ob29rcz8uYmVmb3JlRHVwbGljYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgZGF0YSA9IGF3YWl0IGNvbGxlY3Rpb24uYWRtaW4uaG9va3MuYmVmb3JlRHVwbGljYXRlKHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgbG9jYWxlLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgZGF0YVsnaWQnXVxuXG4gICAgICAgIGlmICghZHVwbGljYXRlSUQpIHtcbiAgICAgICAgICBpZiAoJ2NyZWF0ZWRBdCcgaW4gZGF0YSkgZGVsZXRlIGRhdGEuY3JlYXRlZEF0XG4gICAgICAgICAgaWYgKCd1cGRhdGVkQXQnIGluIGRhdGEpIGRlbGV0ZSBkYXRhLnVwZGF0ZWRBdFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVxdWVzdHNbZHVwbGljYXRlSUQgPyAncGF0Y2gnIDogJ3Bvc3QnXShcbiAgICAgICAgICBgJHtzZXJ2ZXJVUkx9JHthcGl9LyR7c2x1Z30vJHtkdXBsaWNhdGVJRH0/bG9jYWxlPSR7bG9jYWxlfSZmYWxsYmFjay1sb2NhbGU9bm9uZWAsXG4gICAgICAgICAge1xuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICdBY2NlcHQtTGFuZ3VhZ2UnOiBpMThuLmxhbmd1YWdlLFxuICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICApXG4gICAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXN1bHQuanNvbigpXG5cbiAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09IDIwMSB8fCByZXN1bHQuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICByZXR1cm4ganNvbi5kb2MuaWRcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9ubHkgc2hvdyB0aGUgZXJyb3IgaWYgdGhpcyBpcyB0aGUgaW5pdGlhbCByZXF1ZXN0IGZhaWxpbmdcbiAgICAgICAgaWYgKCFkdXBsaWNhdGVJRCkge1xuICAgICAgICAgIGpzb24uZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB0b2FzdC5lcnJvcihlcnJvci5tZXNzYWdlKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuXG4gICAgICBsZXQgZHVwbGljYXRlSUQ6IHN0cmluZ1xuICAgICAgbGV0IGFib3J0ID0gZmFsc2VcbiAgICAgIGNvbnN0IGxvY2FsZUVycm9ycyA9IFtdXG5cbiAgICAgIGlmIChsb2NhbGl6YXRpb24pIHtcbiAgICAgICAgYXdhaXQgbG9jYWxpemF0aW9uLmxvY2FsZUNvZGVzLnJlZHVjZShhc3luYyAocHJpb3JMb2NhbGVQYXRjaCwgbG9jYWxlKSA9PiB7XG4gICAgICAgICAgYXdhaXQgcHJpb3JMb2NhbGVQYXRjaFxuICAgICAgICAgIGlmIChhYm9ydCkgcmV0dXJuXG4gICAgICAgICAgY29uc3QgbG9jYWxlUmVzdWx0ID0gYXdhaXQgc2F2ZURvY3VtZW50KHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgZHVwbGljYXRlSUQsXG4gICAgICAgICAgICBsb2NhbGUsXG4gICAgICAgICAgfSlcbiAgICAgICAgICBkdXBsaWNhdGVJRCA9IGxvY2FsZVJlc3VsdCB8fCBkdXBsaWNhdGVJRFxuICAgICAgICAgIGlmIChkdXBsaWNhdGVJRCAmJiAhbG9jYWxlUmVzdWx0KSB7XG4gICAgICAgICAgICBsb2NhbGVFcnJvcnMucHVzaChsb2NhbGUpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZHVwbGljYXRlSUQpIHtcbiAgICAgICAgICAgIGFib3J0ID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgUHJvbWlzZS5yZXNvbHZlKCkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkdXBsaWNhdGVJRCA9IGF3YWl0IHNhdmVEb2N1bWVudCh7IGlkIH0pXG4gICAgICB9XG5cbiAgICAgIGlmICghZHVwbGljYXRlSUQpIHtcbiAgICAgICAgLy8gZG9jdW1lbnQgd2FzIG5vdCBzYXZlZCwgZXJyb3IgdG9hc3Qgd2FzIGRpc3BsYXllZFxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdG9hc3Quc3VjY2VzcyhcbiAgICAgICAgdCgnc3VjY2Vzc2Z1bGx5RHVwbGljYXRlZCcsIHsgbGFiZWw6IGdldFRyYW5zbGF0aW9uKGNvbGxlY3Rpb24ubGFiZWxzLnNpbmd1bGFyLCBpMThuKSB9KSxcbiAgICAgICAgeyBhdXRvQ2xvc2U6IDMwMDAgfSxcbiAgICAgIClcblxuICAgICAgaWYgKGxvY2FsZUVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRvYXN0LmVycm9yKFxuICAgICAgICAgIGBcbiAgICAgICAgICAke3QoJ2Vycm9yOmxvY2FsZXNOb3RTYXZlZF9vdGhlcicsIHsgY291bnQ6IGxvY2FsZUVycm9ycy5sZW5ndGggfSl9XG4gICAgICAgICAgJHtsb2NhbGVFcnJvcnMuam9pbignLCAnKX1cbiAgICAgICAgICBgLFxuICAgICAgICAgIHsgYXV0b0Nsb3NlOiA1MDAwIH0sXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgc2V0TW9kaWZpZWQoZmFsc2UpXG4gICAgICBzZXRJc1N1Ym1pdHRpbmcoZmFsc2UpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBwdXNoKHtcbiAgICAgICAgICBwYXRobmFtZTogYCR7YWRtaW59L2NvbGxlY3Rpb25zLyR7c2x1Z30vJHtkdXBsaWNhdGVJRH1gLFxuICAgICAgICB9KVxuICAgICAgfSwgMTApXG4gICAgfSxcbiAgICBbXG4gICAgICBtb2RpZmllZCxcbiAgICAgIGxvY2FsaXphdGlvbixcbiAgICAgIHQsXG4gICAgICBpMThuLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIHNldE1vZGlmaWVkLFxuICAgICAgdG9nZ2xlTW9kYWwsXG4gICAgICBtb2RhbFNsdWcsXG4gICAgICBzZXJ2ZXJVUkwsXG4gICAgICBhcGksXG4gICAgICBzbHVnLFxuICAgICAgaWQsXG4gICAgICBwdXNoLFxuICAgICAgYWRtaW4sXG4gICAgXSxcbiAgKVxuXG4gIGNvbnN0IGNvbmZpcm0gPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgaGFuZGxlQ2xpY2sodHJ1ZSlcbiAgICBzZXRIYXNDbGlja2VkKGZhbHNlKVxuICB9LCBbaGFuZGxlQ2xpY2tdKVxuXG4gIHJldHVybiAoXG4gICAgPFJlYWN0LkZyYWdtZW50PlxuICAgICAgPFBvcHVwTGlzdC5CdXR0b25cbiAgICAgICAgZGlzYWJsZWQ9e2lzU3VibWl0dGluZ31cbiAgICAgICAgaWQ9XCJhY3Rpb24tZHVwbGljYXRlXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlQ2xpY2soZmFsc2UpfVxuICAgICAgPlxuICAgICAgICB7dCgnZHVwbGljYXRlJyl9XG4gICAgICA8L1BvcHVwTGlzdC5CdXR0b24+XG4gICAgICB7bW9kaWZpZWQgJiYgaGFzQ2xpY2tlZCAmJiAoXG4gICAgICAgIDxNb2RhbCBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX21vZGFsYH0gc2x1Zz17bW9kYWxTbHVnfT5cbiAgICAgICAgICA8TWluaW1hbFRlbXBsYXRlIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fbW9kYWwtdGVtcGxhdGVgfT5cbiAgICAgICAgICAgIDxoMT57dCgnY29uZmlybUR1cGxpY2F0aW9uJyl9PC9oMT5cbiAgICAgICAgICAgIDxwPnt0KCd1bnNhdmVkQ2hhbmdlc0R1cGxpY2F0ZScpfTwvcD5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgYnV0dG9uU3R5bGU9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICBpZD1cImNvbmZpcm0tY2FuY2VsXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdG9nZ2xlTW9kYWwobW9kYWxTbHVnKX1cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdjYW5jZWwnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvbiBpZD1cImNvbmZpcm0tZHVwbGljYXRlXCIgb25DbGljaz17Y29uZmlybX0+XG4gICAgICAgICAgICAgIHt0KCdkdXBsaWNhdGVXaXRob3V0U2F2aW5nJyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L01pbmltYWxUZW1wbGF0ZT5cbiAgICAgICAgPC9Nb2RhbD5cbiAgICAgICl9XG4gICAgPC9SZWFjdC5GcmFnbWVudD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBEdXBsaWNhdGVcbiJdLCJuYW1lcyI6WyJiYXNlQ2xhc3MiLCJEdXBsaWNhdGUiLCJpZCIsInNsdWciLCJjb2xsZWN0aW9uIiwicHVzaCIsInVzZUhpc3RvcnkiLCJtb2RpZmllZCIsInVzZUZvcm1Nb2RpZmllZCIsInRvZ2dsZU1vZGFsIiwidXNlTW9kYWwiLCJzZXRNb2RpZmllZCIsInVzZUZvcm0iLCJsb2NhbGl6YXRpb24iLCJyb3V0ZXMiLCJhcGkiLCJzZXJ2ZXJVUkwiLCJ1c2VDb25maWciLCJhZG1pbiIsImhhc0NsaWNrZWQiLCJzZXRIYXNDbGlja2VkIiwidXNlU3RhdGUiLCJpc1N1Ym1pdHRpbmciLCJzZXRJc1N1Ym1pdHRpbmciLCJpMThuIiwidCIsInVzZVRyYW5zbGF0aW9uIiwibW9kYWxTbHVnIiwiaGFuZGxlQ2xpY2siLCJ1c2VDYWxsYmFjayIsIm92ZXJyaWRlIiwic2F2ZURvY3VtZW50IiwiZHVwbGljYXRlSUQiLCJsb2NhbGUiLCJyZXNwb25zZSIsInJlcXVlc3RzIiwiZ2V0IiwiaGVhZGVycyIsImxhbmd1YWdlIiwicGFyYW1zIiwiZGVwdGgiLCJkcmFmdCIsImRhdGEiLCJqc29uIiwiYmFzZUJlZm9yZUR1cGxpY2F0ZSIsImhvb2tzIiwiYmVmb3JlRHVwbGljYXRlIiwiY3JlYXRlZEF0IiwidXBkYXRlZEF0IiwicmVzdWx0IiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdGF0dXMiLCJkb2MiLCJlcnJvcnMiLCJmb3JFYWNoIiwiZXJyb3IiLCJ0b2FzdCIsIm1lc3NhZ2UiLCJhYm9ydCIsImxvY2FsZUVycm9ycyIsImxvY2FsZUNvZGVzIiwicmVkdWNlIiwicHJpb3JMb2NhbGVQYXRjaCIsImxvY2FsZVJlc3VsdCIsIlByb21pc2UiLCJyZXNvbHZlIiwic3VjY2VzcyIsImxhYmVsIiwiZ2V0VHJhbnNsYXRpb24iLCJsYWJlbHMiLCJzaW5ndWxhciIsImF1dG9DbG9zZSIsImxlbmd0aCIsImNvdW50Iiwiam9pbiIsInNldFRpbWVvdXQiLCJwYXRobmFtZSIsImNvbmZpcm0iLCJSZWFjdCIsIkZyYWdtZW50IiwiUG9wdXBMaXN0IiwiQnV0dG9uIiwiZGlzYWJsZWQiLCJvbkNsaWNrIiwiTW9kYWwiLCJjbGFzc05hbWUiLCJNaW5pbWFsVGVtcGxhdGUiLCJoMSIsInAiLCJidXR0b25TdHlsZSIsInR5cGUiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkF5TkE7OztlQUFBOzs7dUJBek5nQzsrREFDYTs4QkFDZDtnQ0FDSjsrQkFDTDtnQ0FJUztxQkFDTjt5QkFDZ0I7Z0VBQ2I7d0JBQ0Y7K0RBQ1A7eUVBQ1E7cUNBQ1M7UUFDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVAsTUFBTUEsWUFBWTtBQUVsQixNQUFNQyxZQUE2QixDQUFDLEVBQUVDLEVBQUUsRUFBRUMsSUFBSSxFQUFFQyxVQUFVLEVBQUU7SUFDMUQsTUFBTSxFQUFFQyxJQUFJLEVBQUUsR0FBR0MsSUFBQUEsMEJBQVU7SUFDM0IsTUFBTUMsV0FBV0MsSUFBQUEsd0JBQWU7SUFDaEMsTUFBTSxFQUFFQyxXQUFXLEVBQUUsR0FBR0MsSUFBQUEsZUFBUTtJQUNoQyxNQUFNLEVBQUVDLFdBQVcsRUFBRSxHQUFHQyxJQUFBQSxnQkFBTztJQUMvQixNQUFNLEVBQ0pDLFlBQVksRUFDWkMsUUFBUSxFQUFFQyxHQUFHLEVBQUUsRUFDZkMsU0FBUyxFQUNWLEdBQUdDLElBQUFBLGlCQUFTO0lBQ2IsTUFBTSxFQUNKSCxRQUFRLEVBQUVJLEtBQUss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