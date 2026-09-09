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
const _types = require("../../../../fields/config/types");
const _getTranslation = require("../../../../utilities/getTranslation");
const _useIntersect = /*#__PURE__*/ _interop_require_default(require("../../../hooks/useIntersect"));
const _OperationProvider = require("../../utilities/OperationProvider");
const _RenderCustomComponent = /*#__PURE__*/ _interop_require_default(require("../../utilities/RenderCustomComponent"));
const _filterFields = require("./filterFields");
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
const baseClass = 'render-fields';
const intersectionObserverOptions = {
    rootMargin: '1000px'
};
/**
 * If you send `fields` through, it will render those fields explicitly
 * Otherwise, it will reduce your fields using the other provided props
 * This is so that we can conditionally render fields before reducing them, if desired
 * See the sidebar in '../collections/Edit/Default/index.tsx' for an example
 *
 * The state/data for the fields it renders is not managed by this component. Instead, every component it renders has
 * their own handling of their own value, usually through the useField hook. This hook will get the field's value
 * from the Form the field is in, using the field's path.
 *
 * Thus, if you would like to set the value of a field you render here, you must do so in the Form that contains the field, or in the
 * Field component itself.
 *
 * All this component does is render the field's Field Components, and pass them the props they need to function.
 **/ const RenderFields = (props)=>{
    const { className, fieldTypes, forceRender: forceRenderFromProps, forceRenderAllFields, margins } = props;
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const [hasRendered, setHasRendered] = (0, _react.useState)(Boolean(forceRenderFromProps));
    const [intersectionRef, entry] = (0, _useIntersect.default)(intersectionObserverOptions, forceRenderFromProps);
    const isIntersecting = Boolean(entry?.isIntersecting);
    const isAboveViewport = entry?.boundingClientRect?.top < 0;
    const shouldRender = forceRenderFromProps || isIntersecting || isAboveViewport;
    const operation = (0, _OperationProvider.useOperation)();
    (0, _react.useEffect)(()=>{
        if (shouldRender && !hasRendered) {
            setHasRendered(true);
        }
    }, [
        shouldRender,
        hasRendered
    ]);
    let fieldsToRender = 'fields' in props ? props?.fields : null;
    if (!fieldsToRender && 'fieldSchema' in props) {
        const { fieldSchema, fieldTypes, filter, permissions, readOnly: readOnlyOverride } = props;
        fieldsToRender = (0, _filterFields.filterFields)({
            fieldSchema,
            fieldTypes,
            filter,
            operation,
            permissions,
            readOnly: readOnlyOverride
        });
    }
    if (fieldsToRender) {
        return /*#__PURE__*/ _react.default.createElement("div", {
            className: [
                baseClass,
                className,
                margins && `${baseClass}--margins-${margins}`,
                margins === false && `${baseClass}--margins-none`
            ].filter(Boolean).join(' '),
            ref: intersectionRef
        }, hasRendered && fieldsToRender.map((reducedField, fieldIndex)=>{
            const { FieldComponent, field, fieldIsPresentational, fieldPermissions, isFieldAffectingData, readOnly } = reducedField;
            if (fieldIsPresentational) {
                return /*#__PURE__*/ _react.default.createElement(FieldComponent, {
                    key: fieldIndex,
                    ...field
                });
            }
            if (field) {
                return /*#__PURE__*/ _react.default.createElement(_RenderCustomComponent.default, {
                    CustomComponent: field?.admin?.components?.Field,
                    DefaultComponent: FieldComponent,
                    componentProps: {
                        ...field,
                        admin: {
                            ...field.admin || {},
                            readOnly
                        },
                        fieldTypes,
                        forceRender: forceRenderAllFields || forceRenderFromProps,
                        indexPath: 'indexPath' in props ? `${props?.indexPath}.${fieldIndex}` : `${fieldIndex}`,
                        path: field.path || (isFieldAffectingData && 'name' in field ? field.name : ''),
                        permissions: fieldPermissions
                    },
                    key: fieldIndex
                });
            }
            return /*#__PURE__*/ _react.default.createElement("div", {
                className: "missing-field",
                key: fieldIndex
            }, t('error:noMatchedField', {
                label: (0, _types.fieldAffectsData)(field) ? (0, _getTranslation.getTranslation)(field.label || field.name, i18n) : field.path
            }));
        }));
    }
    return null;
};
const _default = RenderFields;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Zvcm1zL1JlbmRlckZpZWxkcy9pbmRleC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcblxuaW1wb3J0IHR5cGUgeyBQcm9wcyB9IGZyb20gJy4vdHlwZXMnXG5cbmltcG9ydCB7IGZpZWxkQWZmZWN0c0RhdGEgfSBmcm9tICcuLi8uLi8uLi8uLi9maWVsZHMvY29uZmlnL3R5cGVzJ1xuaW1wb3J0IHsgZ2V0VHJhbnNsYXRpb24gfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXRpZXMvZ2V0VHJhbnNsYXRpb24nXG5pbXBvcnQgdXNlSW50ZXJzZWN0IGZyb20gJy4uLy4uLy4uL2hvb2tzL3VzZUludGVyc2VjdCdcbmltcG9ydCB7IHVzZU9wZXJhdGlvbiB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9PcGVyYXRpb25Qcm92aWRlcidcbmltcG9ydCBSZW5kZXJDdXN0b21Db21wb25lbnQgZnJvbSAnLi4vLi4vdXRpbGl0aWVzL1JlbmRlckN1c3RvbUNvbXBvbmVudCdcbmltcG9ydCB7IGZpbHRlckZpZWxkcyB9IGZyb20gJy4vZmlsdGVyRmllbGRzJ1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdyZW5kZXItZmllbGRzJ1xuXG5jb25zdCBpbnRlcnNlY3Rpb25PYnNlcnZlck9wdGlvbnMgPSB7XG4gIHJvb3RNYXJnaW46ICcxMDAwcHgnLFxufVxuXG4vKipcbiAqIElmIHlvdSBzZW5kIGBmaWVsZHNgIHRocm91Z2gsIGl0IHdpbGwgcmVuZGVyIHRob3NlIGZpZWxkcyBleHBsaWNpdGx5XG4gKiBPdGhlcndpc2UsIGl0IHdpbGwgcmVkdWNlIHlvdXIgZmllbGRzIHVzaW5nIHRoZSBvdGhlciBwcm92aWRlZCBwcm9wc1xuICogVGhpcyBpcyBzbyB0aGF0IHdlIGNhbiBjb25kaXRpb25hbGx5IHJlbmRlciBmaWVsZHMgYmVmb3JlIHJlZHVjaW5nIHRoZW0sIGlmIGRlc2lyZWRcbiAqIFNlZSB0aGUgc2lkZWJhciBpbiAnLi4vY29sbGVjdGlvbnMvRWRpdC9EZWZhdWx0L2luZGV4LnRzeCcgZm9yIGFuIGV4YW1wbGVcbiAqXG4gKiBUaGUgc3RhdGUvZGF0YSBmb3IgdGhlIGZpZWxkcyBpdCByZW5kZXJzIGlzIG5vdCBtYW5hZ2VkIGJ5IHRoaXMgY29tcG9uZW50LiBJbnN0ZWFkLCBldmVyeSBjb21wb25lbnQgaXQgcmVuZGVycyBoYXNcbiAqIHRoZWlyIG93biBoYW5kbGluZyBvZiB0aGVpciBvd24gdmFsdWUsIHVzdWFsbHkgdGhyb3VnaCB0aGUgdXNlRmllbGQgaG9vay4gVGhpcyBob29rIHdpbGwgZ2V0IHRoZSBmaWVsZCdzIHZhbHVlXG4gKiBmcm9tIHRoZSBGb3JtIHRoZSBmaWVsZCBpcyBpbiwgdXNpbmcgdGhlIGZpZWxkJ3MgcGF0aC5cbiAqXG4gKiBUaHVzLCBpZiB5b3Ugd291bGQgbGlrZSB0byBzZXQgdGhlIHZhbHVlIG9mIGEgZmllbGQgeW91IHJlbmRlciBoZXJlLCB5b3UgbXVzdCBkbyBzbyBpbiB0aGUgRm9ybSB0aGF0IGNvbnRhaW5zIHRoZSBmaWVsZCwgb3IgaW4gdGhlXG4gKiBGaWVsZCBjb21wb25lbnQgaXRzZWxmLlxuICpcbiAqIEFsbCB0aGlzIGNvbXBvbmVudCBkb2VzIGlzIHJlbmRlciB0aGUgZmllbGQncyBGaWVsZCBDb21wb25lbnRzLCBhbmQgcGFzcyB0aGVtIHRoZSBwcm9wcyB0aGV5IG5lZWQgdG8gZnVuY3Rpb24uXG4gKiovXG5jb25zdCBSZW5kZXJGaWVsZHM6IFJlYWN0LkZDPFByb3BzPiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7XG4gICAgY2xhc3NOYW1lLFxuICAgIGZpZWxkVHlwZXMsXG4gICAgZm9yY2VSZW5kZXI6IGZvcmNlUmVuZGVyRnJvbVByb3BzLFxuICAgIGZvcmNlUmVuZGVyQWxsRmllbGRzLFxuICAgIG1hcmdpbnMsXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IHsgaTE4biwgdCB9ID0gdXNlVHJhbnNsYXRpb24oJ2dlbmVyYWwnKVxuICBjb25zdCBbaGFzUmVuZGVyZWQsIHNldEhhc1JlbmRlcmVkXSA9IHVzZVN0YXRlKEJvb2xlYW4oZm9yY2VSZW5kZXJGcm9tUHJvcHMpKVxuICBjb25zdCBbaW50ZXJzZWN0aW9uUmVmLCBlbnRyeV0gPSB1c2VJbnRlcnNlY3QoaW50ZXJzZWN0aW9uT2JzZXJ2ZXJPcHRpb25zLCBmb3JjZVJlbmRlckZyb21Qcm9wcylcblxuICBjb25zdCBpc0ludGVyc2VjdGluZyA9IEJvb2xlYW4oZW50cnk/LmlzSW50ZXJzZWN0aW5nKVxuICBjb25zdCBpc0Fib3ZlVmlld3BvcnQgPSBlbnRyeT8uYm91bmRpbmdDbGllbnRSZWN0Py50b3AgPCAwXG4gIGNvbnN0IHNob3VsZFJlbmRlciA9IGZvcmNlUmVuZGVyRnJvbVByb3BzIHx8IGlzSW50ZXJzZWN0aW5nIHx8IGlzQWJvdmVWaWV3cG9ydFxuICBjb25zdCBvcGVyYXRpb24gPSB1c2VPcGVyYXRpb24oKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNob3VsZFJlbmRlciAmJiAhaGFzUmVuZGVyZWQpIHtcbiAgICAgIHNldEhhc1JlbmRlcmVkKHRydWUpXG4gICAgfVxuICB9LCBbc2hvdWxkUmVuZGVyLCBoYXNSZW5kZXJlZF0pXG5cbiAgbGV0IGZpZWxkc1RvUmVuZGVyID0gJ2ZpZWxkcycgaW4gcHJvcHMgPyBwcm9wcz8uZmllbGRzIDogbnVsbFxuXG4gIGlmICghZmllbGRzVG9SZW5kZXIgJiYgJ2ZpZWxkU2NoZW1hJyBpbiBwcm9wcykge1xuICAgIGNvbnN0IHsgZmllbGRTY2hlbWEsIGZpZWxkVHlwZXMsIGZpbHRlciwgcGVybWlzc2lvbnMsIHJlYWRPbmx5OiByZWFkT25seU92ZXJyaWRlIH0gPSBwcm9wc1xuXG4gICAgZmllbGRzVG9SZW5kZXIgPSBmaWx0ZXJGaWVsZHMoe1xuICAgICAgZmllbGRTY2hlbWEsXG4gICAgICBmaWVsZFR5cGVzLFxuICAgICAgZmlsdGVyLFxuICAgICAgb3BlcmF0aW9uLFxuICAgICAgcGVybWlzc2lvbnMsXG4gICAgICByZWFkT25seTogcmVhZE9ubHlPdmVycmlkZSxcbiAgICB9KVxuICB9XG5cbiAgaWYgKGZpZWxkc1RvUmVuZGVyKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtbXG4gICAgICAgICAgYmFzZUNsYXNzLFxuICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICBtYXJnaW5zICYmIGAke2Jhc2VDbGFzc30tLW1hcmdpbnMtJHttYXJnaW5zfWAsXG4gICAgICAgICAgbWFyZ2lucyA9PT0gZmFsc2UgJiYgYCR7YmFzZUNsYXNzfS0tbWFyZ2lucy1ub25lYCxcbiAgICAgICAgXVxuICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgICAuam9pbignICcpfVxuICAgICAgICByZWY9e2ludGVyc2VjdGlvblJlZn1cbiAgICAgID5cbiAgICAgICAge2hhc1JlbmRlcmVkICYmXG4gICAgICAgICAgZmllbGRzVG9SZW5kZXIubWFwKChyZWR1Y2VkRmllbGQsIGZpZWxkSW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgICAgRmllbGRDb21wb25lbnQsXG4gICAgICAgICAgICAgIGZpZWxkLFxuICAgICAgICAgICAgICBmaWVsZElzUHJlc2VudGF0aW9uYWwsXG4gICAgICAgICAgICAgIGZpZWxkUGVybWlzc2lvbnMsXG4gICAgICAgICAgICAgIGlzRmllbGRBZmZlY3RpbmdEYXRhLFxuICAgICAgICAgICAgICByZWFkT25seSxcbiAgICAgICAgICAgIH0gPSByZWR1Y2VkRmllbGRcblxuICAgICAgICAgICAgaWYgKGZpZWxkSXNQcmVzZW50YXRpb25hbCkge1xuICAgICAgICAgICAgICByZXR1cm4gPEZpZWxkQ29tcG9uZW50IGtleT17ZmllbGRJbmRleH0gey4uLmZpZWxkfSAvPlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZmllbGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8UmVuZGVyQ3VzdG9tQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICBDdXN0b21Db21wb25lbnQ9e2ZpZWxkPy5hZG1pbj8uY29tcG9uZW50cz8uRmllbGR9XG4gICAgICAgICAgICAgICAgICBEZWZhdWx0Q29tcG9uZW50PXtGaWVsZENvbXBvbmVudH1cbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFByb3BzPXt7XG4gICAgICAgICAgICAgICAgICAgIC4uLmZpZWxkLFxuICAgICAgICAgICAgICAgICAgICBhZG1pbjoge1xuICAgICAgICAgICAgICAgICAgICAgIC4uLihmaWVsZC5hZG1pbiB8fCB7fSksXG4gICAgICAgICAgICAgICAgICAgICAgcmVhZE9ubHksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkVHlwZXMsXG4gICAgICAgICAgICAgICAgICAgIGZvcmNlUmVuZGVyOiBmb3JjZVJlbmRlckFsbEZpZWxkcyB8fCBmb3JjZVJlbmRlckZyb21Qcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhQYXRoOlxuICAgICAgICAgICAgICAgICAgICAgICdpbmRleFBhdGgnIGluIHByb3BzID8gYCR7cHJvcHM/LmluZGV4UGF0aH0uJHtmaWVsZEluZGV4fWAgOiBgJHtmaWVsZEluZGV4fWAsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGZpZWxkLnBhdGggfHwgKGlzRmllbGRBZmZlY3RpbmdEYXRhICYmICduYW1lJyBpbiBmaWVsZCA/IGZpZWxkLm5hbWUgOiAnJyksXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zOiBmaWVsZFBlcm1pc3Npb25zLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIGtleT17ZmllbGRJbmRleH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWlzc2luZy1maWVsZFwiIGtleT17ZmllbGRJbmRleH0+XG4gICAgICAgICAgICAgICAge3QoJ2Vycm9yOm5vTWF0Y2hlZEZpZWxkJywge1xuICAgICAgICAgICAgICAgICAgbGFiZWw6IGZpZWxkQWZmZWN0c0RhdGEoZmllbGQpXG4gICAgICAgICAgICAgICAgICAgID8gZ2V0VHJhbnNsYXRpb24oZmllbGQubGFiZWwgfHwgZmllbGQubmFtZSwgaTE4bilcbiAgICAgICAgICAgICAgICAgICAgOiBmaWVsZC5wYXRoLFxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlbmRlckZpZWxkc1xuIl0sIm5hbWVzIjpbImJhc2VDbGFzcyIsImludGVyc2VjdGlvbk9ic2VydmVyT3B0aW9ucyIsInJvb3RNYXJnaW4iLCJSZW5kZXJGaWVsZHMiLCJwcm9wcyIsImNsYXNzTmFtZSIsImZpZWxkVHlwZXMiLCJmb3JjZVJlbmRlciIsImZvcmNlUmVuZGVyRnJvbVByb3BzIiwiZm9yY2VSZW5kZXJBbGxGaWVsZHMiLCJtYXJnaW5zIiwiaTE4biIsInQiLCJ1c2VUcmFuc2xhdGlvbiIsImhhc1JlbmRlcmVkIiwic2V0SGFzUmVuZGVyZWQiLCJ1c2VTdGF0ZSIsIkJvb2xlYW4iLCJpbnRlcnNlY3Rpb25SZWYiLCJlbnRyeSIsInVzZUludGVyc2VjdCIsImlzSW50ZXJzZWN0aW5nIiwiaXNBYm92ZVZpZXdwb3J0IiwiYm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwic2hvdWxkUmVuZGVyIiwib3BlcmF0aW9uIiwidXNlT3BlcmF0aW9uIiwidXNlRWZmZWN0IiwiZmllbGRzVG9SZW5kZXIiLCJmaWVsZHMiLCJmaWVsZFNjaGVtYSIsImZpbHRlciIsInBlcm1pc3Npb25zIiwicmVhZE9ubHkiLCJyZWFkT25seU92ZXJyaWRlIiwiZmlsdGVyRmllbGRzIiwiZGl2Iiwiam9pbiIsInJlZiIsIm1hcCIsInJlZHVjZWRGaWVsZCIsImZpZWxkSW5kZXgiLCJGaWVsZENvbXBvbmVudCIsImZpZWxkIiwiZmllbGRJc1ByZXNlbnRhdGlvbmFsIiwiZmllbGRQZXJtaXNzaW9ucyIsImlzRmllbGRBZmZlY3RpbmdEYXRhIiwia2V5IiwiUmVuZGVyQ3VzdG9tQ29tcG9uZW50IiwiQ3VzdG9tQ29tcG9uZW50IiwiYWRtaW4iLCJjb21wb25lbnRzIiwiRmllbGQiLCJEZWZhdWx0Q29tcG9uZW50IiwiY29tcG9uZW50UHJvcHMiLCJpbmRleFBhdGgiLCJwYXRoIiwibmFtZSIsImxhYmVsIiwiZmllbGRBZmZlY3RzRGF0YSIsImdldFRyYW5zbGF0aW9uIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OytCQTZJQTs7O2VBQUE7OzsrREE3STJDOzhCQUNaO3VCQUlFO2dDQUNGO3FFQUNOO21DQUNJOzhFQUNLOzhCQUNMO1FBQ3RCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVQLE1BQU1BLFlBQVk7QUFFbEIsTUFBTUMsOEJBQThCO0lBQ2xDQyxZQUFZO0FBQ2Q7QUFFQTs7Ozs7Ozs7Ozs7Ozs7RUFjRSxHQUNGLE1BQU1DLGVBQWdDLENBQUNDO0lBQ3JDLE1B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