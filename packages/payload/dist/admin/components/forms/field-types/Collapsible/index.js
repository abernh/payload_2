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
const _Collapsible = require("../../../elements/Collapsible");
const _ErrorPill = require("../../../elements/ErrorPill");
const _DocumentInfo = require("../../../utilities/DocumentInfo");
const _Preferences = require("../../../utilities/Preferences");
const _FieldDescription = /*#__PURE__*/ _interop_require_default(require("../../FieldDescription"));
const _context = require("../../Form/context");
const _createNestedFieldPath = require("../../Form/createNestedFieldPath");
const _RenderFields = /*#__PURE__*/ _interop_require_default(require("../../RenderFields"));
const _RowLabel = require("../../RowLabel");
const _WatchChildErrors = require("../../WatchChildErrors");
const _withCondition = /*#__PURE__*/ _interop_require_default(require("../../withCondition"));
const _shared = require("../shared");
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
const baseClass = 'collapsible-field';
const CollapsibleField = (props)=>{
    const { admin: { className, description, initCollapsed, readOnly }, fieldTypes, fields, forceRender = false, indexPath, label, path, permissions } = props;
    const { getPreference, setPreference } = (0, _Preferences.usePreferences)();
    const { preferencesKey } = (0, _DocumentInfo.useDocumentInfo)();
    const [collapsedOnMount, setCollapsedOnMount] = (0, _react.useState)();
    const fieldPreferencesKey = `collapsible-${indexPath.replace(/\./g, '__')}`;
    const [errorCount, setErrorCount] = (0, _react.useState)(0);
    const submitted = (0, _context.useFormSubmitted)();
    const onToggle = (0, _react.useCallback)(async (newCollapsedState)=>{
        const existingPreferences = await getPreference(preferencesKey);
        if (preferencesKey) {
            await setPreference(preferencesKey, {
                ...existingPreferences,
                ...path ? {
                    fields: {
                        ...existingPreferences?.fields || {},
                        [path]: {
                            ...existingPreferences?.fields?.[path],
                            collapsed: newCollapsedState
                        }
                    }
                } : {
                    fields: {
                        ...existingPreferences?.fields || {},
                        [fieldPreferencesKey]: {
                            ...existingPreferences?.fields?.[fieldPreferencesKey],
                            collapsed: newCollapsedState
                        }
                    }
                }
            });
        }
    }, [
        preferencesKey,
        fieldPreferencesKey,
        getPreference,
        setPreference,
        path
    ]);
    (0, _react.useEffect)(()=>{
        const fetchInitialState = async ()=>{
            if (preferencesKey) {
                const preferences = await getPreference(preferencesKey);
                const specificPreference = path ? preferences?.fields?.[path]?.collapsed : preferences?.fields?.[fieldPreferencesKey]?.collapsed;
                if (specificPreference !== undefined) {
                    setCollapsedOnMount(Boolean(specificPreference));
                } else {
                    setCollapsedOnMount(typeof initCollapsed === 'boolean' ? initCollapsed : false);
                }
            } else {
                setCollapsedOnMount(typeof initCollapsed === 'boolean' ? initCollapsed : false);
            }
        };
        void fetchInitialState();
    }, [
        getPreference,
        preferencesKey,
        fieldPreferencesKey,
        initCollapsed,
        path
    ]);
    if (typeof collapsedOnMount !== 'boolean') return null;
    const fieldHasErrors = submitted && errorCount > 0;
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: [
            _shared.fieldBaseClass,
            baseClass,
            className,
            fieldHasErrors ? `${baseClass}--has-error` : `${baseClass}--has-no-error`
        ].filter(Boolean).join(' '),
        id: `field-${fieldPreferencesKey}${path ? `-${path.replace(/\./g, '__')}` : ''}`
    }, /*#__PURE__*/ _react.default.createElement(_WatchChildErrors.WatchChildErrors, {
        fieldSchema: fields,
        path: path,
        setErrorCount: setErrorCount
    }), /*#__PURE__*/ _react.default.createElement(_Collapsible.Collapsible, {
        className: `${baseClass}__collapsible`,
        collapsibleStyle: errorCount > 0 ? 'error' : 'default',
        header: /*#__PURE__*/ _react.default.createElement("div", {
            className: `${baseClass}__row-label-wrap`
        }, /*#__PURE__*/ _react.default.createElement(_RowLabel.RowLabel, {
            label: label,
            path: path
        }), errorCount > 0 && /*#__PURE__*/ _react.default.createElement(_ErrorPill.ErrorPill, {
            count: errorCount,
            withMessage: true
        })),
        initCollapsed: collapsedOnMount,
        onToggle: onToggle
    }, /*#__PURE__*/ _react.default.createElement(_RenderFields.default, {
        fieldSchema: fields.map((field)=>({
                ...field,
                path: (0, _createNestedFieldPath.createNestedFieldPath)(path, field)
            })),
        fieldTypes: fieldTypes,
        forceRender: forceRender,
        indexPath: indexPath,
        margins: "small",
        permissions: permissions,
        readOnly: readOnly
    })), /*#__PURE__*/ _react.default.createElement(_FieldDescription.default, {
        description: description,
        path: path
    }));
};
const _default = (0, _withCondition.default)(CollapsibleField);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Zvcm1zL2ZpZWxkLXR5cGVzL0NvbGxhcHNpYmxlL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcblxuaW1wb3J0IHR5cGUgeyBEb2N1bWVudFByZWZlcmVuY2VzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vcHJlZmVyZW5jZXMvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFByb3BzIH0gZnJvbSAnLi90eXBlcydcblxuaW1wb3J0IHsgQ29sbGFwc2libGUgfSBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9Db2xsYXBzaWJsZSdcbmltcG9ydCB7IEVycm9yUGlsbCB9IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0Vycm9yUGlsbCdcbmltcG9ydCB7IHVzZURvY3VtZW50SW5mbyB9IGZyb20gJy4uLy4uLy4uL3V0aWxpdGllcy9Eb2N1bWVudEluZm8nXG5pbXBvcnQgeyB1c2VQcmVmZXJlbmNlcyB9IGZyb20gJy4uLy4uLy4uL3V0aWxpdGllcy9QcmVmZXJlbmNlcydcbmltcG9ydCBGaWVsZERlc2NyaXB0aW9uIGZyb20gJy4uLy4uL0ZpZWxkRGVzY3JpcHRpb24nXG5pbXBvcnQgeyB1c2VGb3JtU3VibWl0dGVkIH0gZnJvbSAnLi4vLi4vRm9ybS9jb250ZXh0J1xuaW1wb3J0IHsgY3JlYXRlTmVzdGVkRmllbGRQYXRoIH0gZnJvbSAnLi4vLi4vRm9ybS9jcmVhdGVOZXN0ZWRGaWVsZFBhdGgnXG5pbXBvcnQgUmVuZGVyRmllbGRzIGZyb20gJy4uLy4uL1JlbmRlckZpZWxkcydcbmltcG9ydCB7IFJvd0xhYmVsIH0gZnJvbSAnLi4vLi4vUm93TGFiZWwnXG5pbXBvcnQgeyBXYXRjaENoaWxkRXJyb3JzIH0gZnJvbSAnLi4vLi4vV2F0Y2hDaGlsZEVycm9ycydcbmltcG9ydCB3aXRoQ29uZGl0aW9uIGZyb20gJy4uLy4uL3dpdGhDb25kaXRpb24nXG5pbXBvcnQgeyBmaWVsZEJhc2VDbGFzcyB9IGZyb20gJy4uL3NoYXJlZCdcbmltcG9ydCAnLi9pbmRleC5zY3NzJ1xuXG5jb25zdCBiYXNlQ2xhc3MgPSAnY29sbGFwc2libGUtZmllbGQnXG5cbmNvbnN0IENvbGxhcHNpYmxlRmllbGQ6IFJlYWN0LkZDPFByb3BzPiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7XG4gICAgYWRtaW46IHsgY2xhc3NOYW1lLCBkZXNjcmlwdGlvbiwgaW5pdENvbGxhcHNlZCwgcmVhZE9ubHkgfSxcbiAgICBmaWVsZFR5cGVzLFxuICAgIGZpZWxkcyxcbiAgICBmb3JjZVJlbmRlciA9IGZhbHNlLFxuICAgIGluZGV4UGF0aCxcbiAgICBsYWJlbCxcbiAgICBwYXRoLFxuICAgIHBlcm1pc3Npb25zLFxuICB9ID0gcHJvcHNcblxuICBjb25zdCB7IGdldFByZWZlcmVuY2UsIHNldFByZWZlcmVuY2UgfSA9IHVzZVByZWZlcmVuY2VzKClcbiAgY29uc3QgeyBwcmVmZXJlbmNlc0tleSB9ID0gdXNlRG9jdW1lbnRJbmZvKClcbiAgY29uc3QgW2NvbGxhcHNlZE9uTW91bnQsIHNldENvbGxhcHNlZE9uTW91bnRdID0gdXNlU3RhdGU8Ym9vbGVhbj4oKVxuICBjb25zdCBmaWVsZFByZWZlcmVuY2VzS2V5ID0gYGNvbGxhcHNpYmxlLSR7aW5kZXhQYXRoLnJlcGxhY2UoL1xcLi9nLCAnX18nKX1gXG4gIGNvbnN0IFtlcnJvckNvdW50LCBzZXRFcnJvckNvdW50XSA9IHVzZVN0YXRlKDApXG4gIGNvbnN0IHN1Ym1pdHRlZCA9IHVzZUZvcm1TdWJtaXR0ZWQoKVxuXG4gIGNvbnN0IG9uVG9nZ2xlID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKG5ld0NvbGxhcHNlZFN0YXRlOiBib29sZWFuKSA9PiB7XG4gICAgICBjb25zdCBleGlzdGluZ1ByZWZlcmVuY2VzOiBEb2N1bWVudFByZWZlcmVuY2VzID0gYXdhaXQgZ2V0UHJlZmVyZW5jZShwcmVmZXJlbmNlc0tleSlcblxuICAgICAgaWYgKHByZWZlcmVuY2VzS2V5KSB7XG4gICAgICAgIGF3YWl0IHNldFByZWZlcmVuY2UocHJlZmVyZW5jZXNLZXksIHtcbiAgICAgICAgICAuLi5leGlzdGluZ1ByZWZlcmVuY2VzLFxuICAgICAgICAgIC4uLihwYXRoXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIC4uLihleGlzdGluZ1ByZWZlcmVuY2VzPy5maWVsZHMgfHwge30pLFxuICAgICAgICAgICAgICAgICAgW3BhdGhdOiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmV4aXN0aW5nUHJlZmVyZW5jZXM/LmZpZWxkcz8uW3BhdGhdLFxuICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IG5ld0NvbGxhcHNlZFN0YXRlLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIC4uLihleGlzdGluZ1ByZWZlcmVuY2VzPy5maWVsZHMgfHwge30pLFxuICAgICAgICAgICAgICAgICAgW2ZpZWxkUHJlZmVyZW5jZXNLZXldOiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmV4aXN0aW5nUHJlZmVyZW5jZXM/LmZpZWxkcz8uW2ZpZWxkUHJlZmVyZW5jZXNLZXldLFxuICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IG5ld0NvbGxhcHNlZFN0YXRlLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LFxuICAgIFtwcmVmZXJlbmNlc0tleSwgZmllbGRQcmVmZXJlbmNlc0tleSwgZ2V0UHJlZmVyZW5jZSwgc2V0UHJlZmVyZW5jZSwgcGF0aF0sXG4gIClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGZldGNoSW5pdGlhbFN0YXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHByZWZlcmVuY2VzS2V5KSB7XG4gICAgICAgIGNvbnN0IHByZWZlcmVuY2VzID0gYXdhaXQgZ2V0UHJlZmVyZW5jZShwcmVmZXJlbmNlc0tleSlcbiAgICAgICAgY29uc3Qgc3BlY2lmaWNQcmVmZXJlbmNlID0gcGF0aFxuICAgICAgICAgID8gcHJlZmVyZW5jZXM/LmZpZWxkcz8uW3BhdGhdPy5jb2xsYXBzZWRcbiAgICAgICAgICA6IHByZWZlcmVuY2VzPy5maWVsZHM/LltmaWVsZFByZWZlcmVuY2VzS2V5XT8uY29sbGFwc2VkXG5cbiAgICAgICAgaWYgKHNwZWNpZmljUHJlZmVyZW5jZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc2V0Q29sbGFwc2VkT25Nb3VudChCb29sZWFuKHNwZWNpZmljUHJlZmVyZW5jZSkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0Q29sbGFwc2VkT25Nb3VudCh0eXBlb2YgaW5pdENvbGxhcHNlZCA9PT0gJ2Jvb2xlYW4nID8gaW5pdENvbGxhcHNlZCA6IGZhbHNlKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRDb2xsYXBzZWRPbk1vdW50KHR5cGVvZiBpbml0Q29sbGFwc2VkID09PSAnYm9vbGVhbicgPyBpbml0Q29sbGFwc2VkIDogZmFsc2UpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdm9pZCBmZXRjaEluaXRpYWxTdGF0ZSgpXG4gIH0sIFtnZXRQcmVmZXJlbmNlLCBwcmVmZXJlbmNlc0tleSwgZmllbGRQcmVmZXJlbmNlc0tleSwgaW5pdENvbGxhcHNlZCwgcGF0aF0pXG5cbiAgaWYgKHR5cGVvZiBjb2xsYXBzZWRPbk1vdW50ICE9PSAnYm9vbGVhbicpIHJldHVybiBudWxsXG5cbiAgY29uc3QgZmllbGRIYXNFcnJvcnMgPSBzdWJtaXR0ZWQgJiYgZXJyb3JDb3VudCA+IDBcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17W1xuICAgICAgICBmaWVsZEJhc2VDbGFzcyxcbiAgICAgICAgYmFzZUNsYXNzLFxuICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgIGZpZWxkSGFzRXJyb3JzID8gYCR7YmFzZUNsYXNzfS0taGFzLWVycm9yYCA6IGAke2Jhc2VDbGFzc30tLWhhcy1uby1lcnJvcmAsXG4gICAgICBdXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgLmpvaW4oJyAnKX1cbiAgICAgIGlkPXtgZmllbGQtJHtmaWVsZFByZWZlcmVuY2VzS2V5fSR7cGF0aCA/IGAtJHtwYXRoLnJlcGxhY2UoL1xcLi9nLCAnX18nKX1gIDogJyd9YH1cbiAgICA+XG4gICAgICA8V2F0Y2hDaGlsZEVycm9ycyBmaWVsZFNjaGVtYT17ZmllbGRzfSBwYXRoPXtwYXRofSBzZXRFcnJvckNvdW50PXtzZXRFcnJvckNvdW50fSAvPlxuICAgICAgPENvbGxhcHNpYmxlXG4gICAgICAgIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fY29sbGFwc2libGVgfVxuICAgICAgICBjb2xsYXBzaWJsZVN0eWxlPXtlcnJvckNvdW50ID4gMCA/ICdlcnJvcicgOiAnZGVmYXVsdCd9XG4gICAgICAgIGhlYWRlcj17XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3Jvdy1sYWJlbC13cmFwYH0+XG4gICAgICAgICAgICA8Um93TGFiZWwgbGFiZWw9e2xhYmVsfSBwYXRoPXtwYXRofSAvPlxuICAgICAgICAgICAge2Vycm9yQ291bnQgPiAwICYmIDxFcnJvclBpbGwgY291bnQ9e2Vycm9yQ291bnR9IHdpdGhNZXNzYWdlIC8+fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICB9XG4gICAgICAgIGluaXRDb2xsYXBzZWQ9e2NvbGxhcHNlZE9uTW91bnR9XG4gICAgICAgIG9uVG9nZ2xlPXtvblRvZ2dsZX1cbiAgICAgID5cbiAgICAgICAgPFJlbmRlckZpZWxkc1xuICAgICAgICAgIGZpZWxkU2NoZW1hPXtmaWVsZHMubWFwKChmaWVsZCkgPT4gKHtcbiAgICAgICAgICAgIC4uLmZpZWxkLFxuICAgICAgICAgICAgcGF0aDogY3JlYXRlTmVzdGVkRmllbGRQYXRoKHBhdGgsIGZpZWxkKSxcbiAgICAgICAgICB9KSl9XG4gICAgICAgICAgZmllbGRUeXBlcz17ZmllbGRUeXBlc31cbiAgICAgICAgICBmb3JjZVJlbmRlcj17Zm9yY2VSZW5kZXJ9XG4gICAgICAgICAgaW5kZXhQYXRoPXtpbmRleFBhdGh9XG4gICAgICAgICAgbWFyZ2lucz1cInNtYWxsXCJcbiAgICAgICAgICBwZXJtaXNzaW9ucz17cGVybWlzc2lvbnN9XG4gICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAvPlxuICAgICAgPC9Db2xsYXBzaWJsZT5cbiAgICAgIDxGaWVsZERlc2NyaXB0aW9uIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbn0gcGF0aD17cGF0aH0gLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCB3aXRoQ29uZGl0aW9uKENvbGxhcHNpYmxlRmllbGQpXG4iXSwibmFtZXMiOlsiYmFzZUNsYXNzIiwiQ29sbGFwc2libGVGaWVsZCIsInByb3BzIiwiYWRtaW4iLCJjbGFzc05hbWUiLCJkZXNjcmlwdGlvbiIsImluaXRDb2xsYXBzZWQiLCJyZWFkT25seSIsImZpZWxkVHlwZXMiLCJmaWVsZHMiLCJmb3JjZVJlbmRlciIsImluZGV4UGF0aCIsImxhYmVsIiwicGF0aCIsInBlcm1pc3Npb25zIiwiZ2V0UHJlZmVyZW5jZSIsInNldFByZWZlcmVuY2UiLCJ1c2VQcmVmZXJlbmNlcyIsInByZWZlcmVuY2VzS2V5IiwidXNlRG9jdW1lbnRJbmZvIiwiY29sbGFwc2VkT25Nb3VudCIsInNldENvbGxhcHNlZE9uTW91bnQiLCJ1c2VTdGF0ZSIsImZpZWxkUHJlZmVyZW5jZXNLZXkiLCJyZXBsYWNlIiwiZXJyb3JDb3VudCIsInNldEVycm9yQ291bnQiLCJzdWJtaXR0ZWQiLCJ1c2VGb3JtU3VibWl0dGVkIiwib25Ub2dnbGUiLCJ1c2VDYWxsYmFjayIsIm5ld0NvbGxhcHNlZFN0YXRlIiwiZXhpc3RpbmdQcmVmZXJlbmNlcyIsImNvbGxhcHNlZCIsInVzZUVmZmVjdCIsImZldGNoSW5pdGlhbFN0YXRlIiwicHJlZmVyZW5jZXMiLCJzcGVjaWZpY1ByZWZlcmVuY2UiLCJ1bmRlZmluZWQiLCJCb29sZWFuIiwiZmllbGRIYXNFcnJvcnMiLCJkaXYiLCJmaWVsZEJhc2VDbGFzcyIsImZpbHRlciIsImpvaW4iLCJpZCIsIldhdGNoQ2hpbGRFcnJvcnMiLCJmaWVsZFNjaGVtYSIsIkNvbGxhcHNpYmxlIiwiY29sbGFwc2libGVTdHlsZSIsImhlYWRlciIsIlJvd0xhYmVsIiwiRXJyb3JQaWxsIiwiY291bnQiLCJ3aXRoTWVzc2FnZSIsIlJlbmRlckZpZWxkcyIsIm1hcCIsImZpZWxkIiwiY3JlYXRlTmVzdGVkRmllbGRQYXRoIiwibWFyZ2lucyIsIkZpZWxkRGVzY3JpcHRpb24iLCJ3aXRoQ29uZGl0aW9uIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OytCQTRJQTs7O2VBQUE7OzsrREE1SXdEOzZCQUs1QjsyQkFDRjs4QkFDTTs2QkFDRDt5RUFDRjt5QkFDSTt1Q0FDSztxRUFDYjswQkFDQTtrQ0FDUTtzRUFDUDt3QkFDSztRQUN4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFUCxNQUFNQSxZQUFZO0FBRWxCLE1BQU1DLG1CQUFvQyxDQUFDQztJQUN6QyxNQUFNLEVBQ0pDLE9BQU8sRUFBRUMsU0FBUyxFQUFFQyxXQUFXLEVBQUVDLGFBQWEsRUFBRUMsUUFBUSxFQUFFLEVBQzFEQyxVQUFVLEVBQ1ZDLE1BQU0sRUFDTkMsY0FBYyxLQUFLLEVBQ25CQyxTQUFTLEVBQ1RDLEtBQUssRUFDTEMsSUFBSSxFQUNKQyxXQUFXLEVBQ1osR0FBR1o7SUFFSixNQUFNLEVBQUVhLGFBQWEsRUFBRUMsYUFBYSxFQUFFLEdBQUdDLElBQUFBLDJCQUFjO0lBQ3ZELE1BQU0sRUFBRUMsY0FBYyxFQUFFLEdBQUdDLElBQUFBLDZCQUFlO0lBQzFDLE1BQU0sQ0FBQ0Msa0JBQWtCQyxvQkFBb0IsR0FBR0MsSUFBQUEsZUFBUTtJQUN4RCxNQUFNQyxzQkFBc0IsQ0FBQyxZQUFZLEVBQUVaLFVBQVVhLE9BQU8sQ0FBQyxPQUFPLE1BQU0sQ0FBQztJQUMzRSxNQUFNLENBQUNDLFlBQVlDLGNBQWMsR0FBR0osSUFBQUEsZUFBUSxFQUFDO0lBQzdDLE1BQU1LLFlBQVlDLElBQUFBLHlCQUFnQjtJQUVsQyxNQUFNQyxXQUFXQyxJQUFBQSxrQkFBVyxFQUMxQixPQUFPQztRQUNMLE1BQU1DLHNCQUEyQyxNQUFNakIsY0FBY0c7UUFFckUsSUFBSUEsZ0JBQWdCO1lBQ2xCLE1BQU1GLGNBQWNFLGdCQUFnQjtnQkFDbEMsR0FBR2MsbUJBQW1CO2dCQUN0QixHQUFJbkIsT0FDQTtvQkFDRUosUUFBUTt3QkFDTixHQUFJdUIscUJBQXFCdkIsVUFBVSxDQUFDLENBQUM7d0JBQ3JDLENBQUNJLEtBQUssRUFBRTs0QkFDTixHQUFHbUIscUJBQXFCdkIsUUFBUSxDQUFDSSxLQUFLOzRCQUN0Q29CLFdBQVdGO3dCQUNiO29CQUNGO2dCQUNGLElBQ0E7b0JBQ0V0QixRQUFRO3dCQUNOLEdBQUl1QixxQkFBcUJ2QixVQUFVLENBQUMsQ0FBQzt3QkFDckMsQ0FBQ2Msb0JBQW9CLEVBQUU7NEJBQ3JCLEdBQUdTLHFCQUFxQnZCLFFBQVEsQ0FBQ2Msb0JBQW9COzRCQUNyRFUsV0FBV0Y7d0JBQ2I7b0JBQ0Y7Z0JBQ0YsQ0FBQztZQUNQO1FBQ0Y7SUFDRixHQUNBO1FBQUNiO1FBQWdCSztRQUFxQlI7UUFBZUM7UUFBZUg7S0FBSztJQUczRXFCLElBQUFBLGdCQUFTLEVBQUM7UUFDUixNQUFNQyxvQkFBb0I7WUFDeEIsSUFBSWpCLGdCQUFnQjtnQkFDbEIsTUFBTWtCLGNBQWMsTUFBTXJCLGNBQWNHO2dCQUN4QyxNQUFNbUIscUJBQXFCeEIsT0FDdkJ1QixhQUFhM0IsUUFBUSxDQUFDSSxLQUFLLEVBQUVvQixZQUM3QkcsYUFBYTNCLFFBQVEsQ0FBQ2Msb0JBQW9CLEVBQUVVO2dCQUVoRCxJQUFJSSx1QkFBdUJDLFdBQVc7b0JBQ3BDakIsb0JBQW9Ca0IsUUFBUUY7Z0JBQzlCLE9BQU87b0JBQ0xoQixvQkFBb0IsT0FBT2Ysa0JBQWtCLFlBQVlBLGdCQUFnQjtnQkFDM0U7WUFDRixPQUFPO2dCQUNMZSxvQkFBb0IsT0FBT2Ysa0JBQWtCLFlBQVlBLGdCQUFnQjtZQUMzRTtRQUNGO1FBRUEsS0FBSzZCO0lBQ1AsR0FBRztRQUFDcEI7UUFBZUc7UUFBZ0JLO1FBQXFCakI7UUFBZU87S0FBSztJQUU1RSxJQUFJLE9BQU9PLHFCQUFxQixXQUFXLE9BQU87SUFFbEQsTUFBTW9CLGlCQUFpQmIsYUFBYUYsYUFBYTtJQUVqRCxxQkFDRSw2QkFBQ2dCO1FBQ0NyQyxXQUFXO1lBQ1RzQyxzQkFBYztZQUNkMUM7WUFDQUk7WUFDQW9DLGlCQUFpQixDQUFDLEVBQUV4QyxVQUFVLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRUEsVUFBVSxjQUFjLENBQUM7U0FDMUUsQ0FDRTJDLE1BQU0sQ0FBQ0osU0FDUEssSUFBSSxDQUFDO1FBQ1JDLElBQUksQ0FBQyxNQUFNLEVBQUV0QixvQkFBb0IsRUFBRVYsT0FBTyxDQUFDLENBQUMsRUFBRUEsS0FBS1csT0FBTyxDQUFDLE9BQU8sTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO3FCQUVoRiw2QkFBQ3NCLGtDQUFnQjtRQUFDQyxhQUFhdEM7UUFBUUksTUFBTUE7UUFBTWEsZUFBZUE7c0JBQ2xFLDZCQUFDc0Isd0JBQVc7UUFDVjVDLFdBQVcsQ0FBQyxFQUFFSixVQUFVLGFBQWEsQ0FBQztRQUN0Q2lELGtCQUFrQnhCLGFBQWEsSUFBSSxVQUFVO1FBQzdDeUIsc0JBQ0UsNkJBQUNUO1lBQUlyQyxXQUFXLENBQUMsRUFBRUosVUFBVSxnQkFBZ0IsQ0FBQzt5QkFDNUMsNkJBQUNtRCxrQkFBUTtZQUFDdkMsT0FBT0E7WUFBT0MsTUFBTUE7WUFDN0JZLGFBQWEsbUJBQUssNkJBQUMyQixvQkFBUztZQUFDQyxPQUFPNUI7WUFBWTZCLGFBQUFBOztRQUdyRGhELGVBQWVjO1FBQ2ZTLFVBQVVBO3FCQUVWLDZCQUFDMEIscUJBQVk7UUFDWFIsYUFBYXRDLE9BQU8rQyxHQUFHLENBQUMsQ0FBQ0MsUUFBVyxDQUFBO2dCQUNsQyxHQUFHQSxLQUFLO2dCQUNSNUMsTUFBTTZDLElBQUFBLDRDQUFxQixFQUFDN0MsTUFBTTRDO1lBQ3BDLENBQUE7UUFDQWpELFlBQVlBO1FBQ1pFLGFBQWFBO1FBQ2JDLFdBQVdBO1FBQ1hnRCxTQUFRO1FBQ1I3QyxhQUFhQTtRQUNiUCxVQUFVQTt1QkFHZCw2QkFBQ3FELHlCQUFnQjtRQUFDdkQsYUFBYUE7UUFBYVEsTUFBTUE7O0FBR3hEO01BRUEsV0FBZWdELElBQUFBLHNCQUFhLEVBQUM1RCJ9