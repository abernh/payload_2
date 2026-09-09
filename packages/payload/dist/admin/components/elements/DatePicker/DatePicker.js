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
const _locale = /*#__PURE__*/ _interop_require_wildcard(require("date-fns/locale"));
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactdatepicker = /*#__PURE__*/ _interop_require_wildcard(require("react-datepicker"));
require("react-datepicker/dist/react-datepicker.css");
const _reacti18next = require("react-i18next");
const _getSupportedDateLocale = require("../../../utilities/formatDate/getSupportedDateLocale");
const _Calendar = /*#__PURE__*/ _interop_require_default(require("../../icons/Calendar"));
const _X = /*#__PURE__*/ _interop_require_default(require("../../icons/X"));
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
const baseClass = 'date-time-picker';
const DateTime = (props)=>{
    const { displayFormat: customDisplayFormat, maxDate, maxTime, minDate, minTime, monthsToShow = 1, onChange: onChangeFromProps, overrides, pickerAppearance = 'default', placeholder: placeholderText, readOnly, timeFormat = 'h:mm aa', timeIntervals = 30, value } = props;
    // Use the user's AdminUI language preference for the locale
    const { i18n } = (0, _reacti18next.useTranslation)();
    const locale = (0, _getSupportedDateLocale.getSupportedDateLocale)(i18n.language);
    try {
        (0, _reactdatepicker.registerLocale)(locale, _locale[locale]);
    } catch (e) {
        console.warn(`Could not find DatePicker locale for ${locale}`);
    }
    let dateFormat = customDisplayFormat;
    if (!customDisplayFormat) {
        // when no displayFormat is provided, determine format based on the picker appearance
        if (pickerAppearance === 'default') dateFormat = 'MM/dd/yyyy';
        else if (pickerAppearance === 'dayAndTime') dateFormat = 'MMM d, yyy h:mm a';
        else if (pickerAppearance === 'timeOnly') dateFormat = 'h:mm a';
        else if (pickerAppearance === 'dayOnly') dateFormat = 'MMM dd';
        else if (pickerAppearance === 'monthOnly') dateFormat = 'MMMM';
    }
    const onChange = (incomingDate)=>{
        const newDate = incomingDate;
        if (newDate instanceof Date) {
            newDate.setMilliseconds(0);
            if ([
                'dayOnly',
                'default',
                'monthOnly'
            ].includes(pickerAppearance)) {
                const tzOffset = incomingDate.getTimezoneOffset() / 60;
                newDate.setHours(12 - tzOffset, 0);
            }
        }
        if (typeof onChangeFromProps === 'function') onChangeFromProps(newDate);
    };
    const dateTimePickerProps = {
        customInputRef: 'ref',
        dateFormat,
        disabled: readOnly,
        maxDate,
        maxTime,
        minDate,
        minTime,
        monthsShown: Math.min(2, monthsToShow),
        onChange,
        placeholderText,
        selected: value && new Date(value),
        showMonthYearPicker: pickerAppearance === 'monthOnly',
        showPopperArrow: false,
        showTimeSelect: pickerAppearance === 'dayAndTime' || pickerAppearance === 'timeOnly',
        timeFormat,
        timeIntervals,
        ...overrides
    };
    const classes = [
        baseClass,
        `${baseClass}__appearance--${pickerAppearance}`
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: classes
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__icon-wrap`
    }, dateTimePickerProps.selected && /*#__PURE__*/ _react.default.createElement("button", {
        className: `${baseClass}__clear-button`,
        onClick: ()=>onChange(null),
        type: "button"
    }, /*#__PURE__*/ _react.default.createElement(_X.default, null)), /*#__PURE__*/ _react.default.createElement(_Calendar.default, null)), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__input-wrapper`
    }, /*#__PURE__*/ _react.default.createElement(_reactdatepicker.default, {
        ...dateTimePickerProps,
        dropdownMode: "select",
        locale: locale,
        popperModifiers: [
            {
                name: 'preventOverflow',
                enabled: true
            }
        ],
        showMonthDropdown: true,
        showYearDropdown: true
    })));
};
const _default = DateTime;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL0RhdGVQaWNrZXIvRGF0ZVBpY2tlci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgTG9jYWxlcyBmcm9tICdkYXRlLWZucy9sb2NhbGUnXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgRGF0ZVBpY2tlciwgeyByZWdpc3RlckxvY2FsZSB9IGZyb20gJ3JlYWN0LWRhdGVwaWNrZXInXG5pbXBvcnQgJ3JlYWN0LWRhdGVwaWNrZXIvZGlzdC9yZWFjdC1kYXRlcGlja2VyLmNzcydcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcblxuaW1wb3J0IHR5cGUgeyBQcm9wcyB9IGZyb20gJy4vdHlwZXMnXG5cbmltcG9ydCB7IGdldFN1cHBvcnRlZERhdGVMb2NhbGUgfSBmcm9tICcuLi8uLi8uLi91dGlsaXRpZXMvZm9ybWF0RGF0ZS9nZXRTdXBwb3J0ZWREYXRlTG9jYWxlJ1xuaW1wb3J0IENhbGVuZGFySWNvbiBmcm9tICcuLi8uLi9pY29ucy9DYWxlbmRhcidcbmltcG9ydCBYSWNvbiBmcm9tICcuLi8uLi9pY29ucy9YJ1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdkYXRlLXRpbWUtcGlja2VyJ1xuXG5jb25zdCBEYXRlVGltZTogUmVhY3QuRkM8UHJvcHM+ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBkaXNwbGF5Rm9ybWF0OiBjdXN0b21EaXNwbGF5Rm9ybWF0LFxuICAgIG1heERhdGUsXG4gICAgbWF4VGltZSxcbiAgICBtaW5EYXRlLFxuICAgIG1pblRpbWUsXG4gICAgbW9udGhzVG9TaG93ID0gMSxcbiAgICBvbkNoYW5nZTogb25DaGFuZ2VGcm9tUHJvcHMsXG4gICAgb3ZlcnJpZGVzLFxuICAgIHBpY2tlckFwcGVhcmFuY2UgPSAnZGVmYXVsdCcsXG4gICAgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyVGV4dCxcbiAgICByZWFkT25seSxcbiAgICB0aW1lRm9ybWF0ID0gJ2g6bW0gYWEnLFxuICAgIHRpbWVJbnRlcnZhbHMgPSAzMCxcbiAgICB2YWx1ZSxcbiAgfSA9IHByb3BzXG5cbiAgLy8gVXNlIHRoZSB1c2VyJ3MgQWRtaW5VSSBsYW5ndWFnZSBwcmVmZXJlbmNlIGZvciB0aGUgbG9jYWxlXG4gIGNvbnN0IHsgaTE4biB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBsb2NhbGUgPSBnZXRTdXBwb3J0ZWREYXRlTG9jYWxlKGkxOG4ubGFuZ3VhZ2UpXG5cbiAgdHJ5IHtcbiAgICByZWdpc3RlckxvY2FsZShsb2NhbGUsIExvY2FsZXNbbG9jYWxlXSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihgQ291bGQgbm90IGZpbmQgRGF0ZVBpY2tlciBsb2NhbGUgZm9yICR7bG9jYWxlfWApXG4gIH1cblxuICBsZXQgZGF0ZUZvcm1hdCA9IGN1c3RvbURpc3BsYXlGb3JtYXRcblxuICBpZiAoIWN1c3RvbURpc3BsYXlGb3JtYXQpIHtcbiAgICAvLyB3aGVuIG5vIGRpc3BsYXlGb3JtYXQgaXMgcHJvdmlkZWQsIGRldGVybWluZSBmb3JtYXQgYmFzZWQgb24gdGhlIHBpY2tlciBhcHBlYXJhbmNlXG4gICAgaWYgKHBpY2tlckFwcGVhcmFuY2UgPT09ICdkZWZhdWx0JykgZGF0ZUZvcm1hdCA9ICdNTS9kZC95eXl5J1xuICAgIGVsc2UgaWYgKHBpY2tlckFwcGVhcmFuY2UgPT09ICdkYXlBbmRUaW1lJykgZGF0ZUZvcm1hdCA9ICdNTU0gZCwgeXl5IGg6bW0gYSdcbiAgICBlbHNlIGlmIChwaWNrZXJBcHBlYXJhbmNlID09PSAndGltZU9ubHknKSBkYXRlRm9ybWF0ID0gJ2g6bW0gYSdcbiAgICBlbHNlIGlmIChwaWNrZXJBcHBlYXJhbmNlID09PSAnZGF5T25seScpIGRhdGVGb3JtYXQgPSAnTU1NIGRkJ1xuICAgIGVsc2UgaWYgKHBpY2tlckFwcGVhcmFuY2UgPT09ICdtb250aE9ubHknKSBkYXRlRm9ybWF0ID0gJ01NTU0nXG4gIH1cblxuICBjb25zdCBvbkNoYW5nZSA9IChpbmNvbWluZ0RhdGU6IERhdGUpID0+IHtcbiAgICBjb25zdCBuZXdEYXRlID0gaW5jb21pbmdEYXRlXG4gICAgaWYgKG5ld0RhdGUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICBuZXdEYXRlLnNldE1pbGxpc2Vjb25kcygwKVxuICAgICAgaWYgKFsnZGF5T25seScsICdkZWZhdWx0JywgJ21vbnRoT25seSddLmluY2x1ZGVzKHBpY2tlckFwcGVhcmFuY2UpKSB7XG4gICAgICAgIGNvbnN0IHR6T2Zmc2V0ID0gaW5jb21pbmdEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MFxuICAgICAgICBuZXdEYXRlLnNldEhvdXJzKDEyIC0gdHpPZmZzZXQsIDApXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb25DaGFuZ2VGcm9tUHJvcHMgPT09ICdmdW5jdGlvbicpIG9uQ2hhbmdlRnJvbVByb3BzKG5ld0RhdGUpXG4gIH1cblxuICBjb25zdCBkYXRlVGltZVBpY2tlclByb3BzID0ge1xuICAgIGN1c3RvbUlucHV0UmVmOiAncmVmJyxcbiAgICBkYXRlRm9ybWF0LFxuICAgIGRpc2FibGVkOiByZWFkT25seSxcbiAgICBtYXhEYXRlLFxuICAgIG1heFRpbWUsXG4gICAgbWluRGF0ZSxcbiAgICBtaW5UaW1lLFxuICAgIG1vbnRoc1Nob3duOiBNYXRoLm1pbigyLCBtb250aHNUb1Nob3cpLFxuICAgIG9uQ2hhbmdlLFxuICAgIHBsYWNlaG9sZGVyVGV4dCxcbiAgICBzZWxlY3RlZDogdmFsdWUgJiYgbmV3IERhdGUodmFsdWUpLFxuICAgIHNob3dNb250aFllYXJQaWNrZXI6IHBpY2tlckFwcGVhcmFuY2UgPT09ICdtb250aE9ubHknLFxuICAgIHNob3dQb3BwZXJBcnJvdzogZmFsc2UsXG4gICAgc2hvd1RpbWVTZWxlY3Q6IHBpY2tlckFwcGVhcmFuY2UgPT09ICdkYXlBbmRUaW1lJyB8fCBwaWNrZXJBcHBlYXJhbmNlID09PSAndGltZU9ubHknLFxuICAgIHRpbWVGb3JtYXQsXG4gICAgdGltZUludGVydmFscyxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH1cblxuICBjb25zdCBjbGFzc2VzID0gW2Jhc2VDbGFzcywgYCR7YmFzZUNsYXNzfV9fYXBwZWFyYW5jZS0tJHtwaWNrZXJBcHBlYXJhbmNlfWBdXG4gICAgLmZpbHRlcihCb29sZWFuKVxuICAgIC5qb2luKCcgJylcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19pY29uLXdyYXBgfT5cbiAgICAgICAge2RhdGVUaW1lUGlja2VyUHJvcHMuc2VsZWN0ZWQgJiYgKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fY2xlYXItYnV0dG9uYH1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlKG51bGwpfVxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFhJY29uIC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICl9XG4gICAgICAgIDxDYWxlbmRhckljb24gLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2lucHV0LXdyYXBwZXJgfT5cbiAgICAgICAgPERhdGVQaWNrZXJcbiAgICAgICAgICB7Li4uZGF0ZVRpbWVQaWNrZXJQcm9wc31cbiAgICAgICAgICBkcm9wZG93bk1vZGU9XCJzZWxlY3RcIlxuICAgICAgICAgIGxvY2FsZT17bG9jYWxlfVxuICAgICAgICAgIHBvcHBlck1vZGlmaWVycz17W1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAncHJldmVudE92ZXJmbG93JyxcbiAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXX1cbiAgICAgICAgICBzaG93TW9udGhEcm9wZG93blxuICAgICAgICAgIHNob3dZZWFyRHJvcGRvd25cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGVUaW1lXG4iXSwibmFtZXMiOlsiYmFzZUNsYXNzIiwiRGF0ZVRpbWUiLCJwcm9wcyIsImRpc3BsYXlGb3JtYXQiLCJjdXN0b21EaXNwbGF5Rm9ybWF0IiwibWF4RGF0ZSIsIm1heFRpbWUiLCJtaW5EYXRlIiwibWluVGltZSIsIm1vbnRoc1RvU2hvdyIsIm9uQ2hhbmdlIiwib25DaGFuZ2VGcm9tUHJvcHMiLCJvdmVycmlkZXMiLCJwaWNrZXJBcHBlYXJhbmNlIiwicGxhY2Vob2xkZXIiLCJwbGFjZWhvbGRlclRleHQiLCJyZWFkT25seSIsInRpbWVGb3JtYXQiLCJ0aW1lSW50ZXJ2YWxzIiwidmFsdWUiLCJpMThuIiwidXNlVHJhbnNsYXRpb24iLCJsb2NhbGUiLCJnZXRTdXBwb3J0ZWREYXRlTG9jYWxlIiwibGFuZ3VhZ2UiLCJyZWdpc3RlckxvY2FsZSIsIkxvY2FsZXMiLCJlIiwiY29uc29sZSIsIndhcm4iLCJkYXRlRm9ybWF0IiwiaW5jb21pbmdEYXRlIiwibmV3RGF0ZSIsIkRhdGUiLCJzZXRNaWxsaXNlY29uZHMiLCJpbmNsdWRlcyIsInR6T2Zmc2V0IiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJzZXRIb3VycyIsImRhdGVUaW1lUGlja2VyUHJvcHMiLCJjdXN0b21JbnB1dFJlZiIsImRpc2FibGVkIiwibW9udGhzU2hvd24iLCJNYXRoIiwibWluIiwic2VsZWN0ZWQiLCJzaG93TW9udGhZZWFyUGlja2VyIiwic2hvd1BvcHBlckFycm93Iiwic2hvd1RpbWVTZWxlY3QiLCJjbGFzc2VzIiwiZmlsdGVyIiwiQm9vbGVhbiIsImpvaW4iLCJkaXYiLCJjbGFzc05hbWUiLCJidXR0b24iLCJvbkNsaWNrIiwidHlwZSIsIlhJY29uIiwiQ2FsZW5kYXJJY29uIiwiRGF0ZVBpY2tlciIsImRyb3Bkb3duTW9kZSIsInBvcHBlck1vZGlmaWVycyIsIm5hbWUiLCJlbmFibGVkIiwic2hvd01vbnRoRHJvcGRvd24iLCJzaG93WWVhckRyb3Bkb3duIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkEySEE7OztlQUFBOzs7Z0VBM0h5Qjs4REFDUDt5RUFDeUI7UUFDcEM7OEJBQ3dCO3dDQUlRO2lFQUNkOzBEQUNQO1FBQ1g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVAsTUFBTUEsWUFBWTtBQUVsQixNQUFNQyxXQUE0QixDQUFDQztJQUNqQyxNQUFNLEVBQ0pDLGVBQWVDLG1CQUFtQixFQUNsQ0MsT0FBTyxFQUNQQyxPQUFPLEVBQ1BDLE9BQU8sRUFDUEMsT0FBTyxFQUNQQyxlQUFlLENBQUMsRUFDaEJDLFVBQVVDLGlCQUFpQixFQUMzQkMsU0FBUyxFQUNUQyxtQkFBbUIsU0FBUyxFQUM1QkMsYUFBYUMsZUFBZSxFQUM1QkMsUUFBUSxFQUNSQyxhQUFhLFNBQVMsRUFDdEJDLGdCQUFnQixFQUFFLEVBQ2xCQyxLQUFLLEVBQ04sR0FBR2pCO0lBRUosNERBQTREO0lBQzVELE1BQU0sRUFBRWtCLElBQUksRUFBRSxHQUFHQyxJQUFBQSw0QkFBYztJQUMvQixNQUFNQyxTQUFTQyxJQUFBQSw4Q0FBc0IsRUFBQ0gsS0FBS0ksUUFBUTtJQUVuRCxJQUFJO1FBQ0ZDLElBQUFBLCtCQUFjLEVBQUNILFFBQVFJLE9BQU8sQ0FBQ0osT0FBTztJQUN4QyxFQUFFLE9BQU9LLEdBQUc7UUFDVkMsUUFBUUMsSUFBSSxDQUFDLENBQUMscUNBQXFDLEVBQUVQLE9BQU8sQ0FBQztJQUMvRDtJQUVBLElBQUlRLGFBQWExQjtJQUVqQixJQUFJLENBQUNBLHFCQUFxQjtRQUN4QixxRkFBcUY7UUFDckYsSUFBSVMscUJBQXFCLFdBQVdpQixhQUFhO2FBQzVDLElBQUlqQixxQkFBcUIsY0FBY2lCLGFBQWE7YUFDcEQsSUFBSWpCLHFCQUFxQixZQUFZaUIsYUFBYTthQUNsRCxJQUFJakIscUJBQXFCLFdBQVdpQixhQUFhO2FBQ2pELElBQUlqQixxQkFBcUIsYUFBYWlCLGFBQWE7SUFDMUQ7SUFFQSxNQUFNcEIsV0FBVyxDQUFDcUI7UUFDaEIsTUFBTUMsVUFBVUQ7UUFDaEIsSUFBSUMsbUJBQW1CQyxNQUFNO1lBQzNCRCxRQUFRRSxlQUFlLENBQUM7WUFDeEIsSUFBSTtnQkFBQztnQkFBVztnQkFBVzthQUFZLENBQUNDLFFBQVEsQ0FBQ3RCLG1CQUFtQjtnQkFDbEUsTUFBTXVCLFdBQVdMLGFBQWFNLGlCQUFpQixLQUFLO2dCQUNwREwsUUFBUU0sUUFBUSxDQUFDLEtBQUtGLFVBQVU7WUFDbEM7UUFDRjtRQUNBLElBQUksT0FBT3pCLHNCQUFzQixZQUFZQSxrQkFBa0JxQjtJQUNqRTtJQUVBLE1BQU1PLHNCQUFzQjtRQUMxQkMsZ0JBQWdCO1FBQ2hCVjtRQUNBVyxVQUFVekI7UUFDVlg7UUFDQUM7UUFDQUM7UUFDQUM7UUFDQWtDLGFBQWFDLEtBQUtDLEdBQUcsQ0FBQyxHQUFHbkM7UUFDekJDO1FBQ0FLO1FBQ0E4QixVQUFVMUIsU0FBUyxJQUFJYyxLQUFLZDtRQUM1QjJCLHFCQUFxQmpDLHFCQUFxQjtRQUMxQ2tDLGlCQUFpQjtRQUNqQkMsZ0JBQWdCbkMscUJBQXFCLGdCQUFnQkEscUJBQXFCO1FBQzFFSTtRQUNBQztRQUNBLEdBQUdOLFNBQVM7SUFDZDtJQUVBLE1BQU1xQyxVQUFVO1FBQUNqRDtRQUFXLENBQUMsRUFBRUEsVUFBVSxjQUFjLEVBQUVhLGlCQUFpQixDQUFDO0tBQUMsQ0FDekVxQyxNQUFNLENBQUNDLFNBQ1BDLElBQUksQ0FBQztJQUVSLHFCQUNFLDZCQUFDQztRQUFJQyxXQUFXTDtxQkFDZCw2QkFBQ0k7UUFBSUMsV0FBVyxDQUFDLEVBQUV0RCxVQUFVLFdBQVcsQ0FBQztPQUN0Q3VDLG9CQUFvQk0sUUFBUSxrQkFDM0IsNkJBQUNVO1FBQ0NELFdBQVcsQ0FBQyxFQUFFdEQsVUFBVSxjQUFjLENBQUM7UUFDdkN3RCxTQUFTLElBQU05QyxTQUFTO1FBQ3hCK0MsTUFBSztxQkFFTCw2QkFBQ0MsVUFBSyx3QkFHViw2QkFBQ0MsaUJBQVksd0JBRWYsNkJBQUNOO1FBQUlDLFdBQVcsQ0FBQyxFQUFFdEQsVUFBVSxlQUFlLENBQUM7cUJBQzNDLDZCQUFDNEQsd0JBQVU7UUFDUixHQUFHckIsbUJBQW1CO1FBQ3ZCc0IsY0FBYTtRQUNidkMsUUFBUUE7UUFDUndDLGlCQUFpQjtZQUNmO2dCQUNFQyxNQUFNO2dCQUNOQyxTQUFTO1lBQ1g7U0FDRDtRQUNEQyxtQkFBQUE7UUFDQUMsa0JBQUFBOztBQUtWO01BRUEsV0FBZWpFIn0=