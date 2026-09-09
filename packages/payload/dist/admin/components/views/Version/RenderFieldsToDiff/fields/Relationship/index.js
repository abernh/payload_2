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
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactdiffviewercontinued = /*#__PURE__*/ _interop_require_default(require("react-diff-viewer-continued"));
const _reacti18next = require("react-i18next");
const _types = require("../../../../../../../fields/config/types");
const _getTranslation = require("../../../../../../../utilities/getTranslation");
const _useUseAsTitle = require("../../../../../../hooks/useUseAsTitle");
const _Config = require("../../../../../utilities/Config");
const _Locale = require("../../../../../utilities/Locale");
const _Label = /*#__PURE__*/ _interop_require_default(require("../../Label"));
const _styles = require("../styles");
require("./index.scss");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const baseClass = 'relationship-diff';
const generateLabelFromValue = (collections, field, locale, value)=>{
    if (Array.isArray(value)) {
        return value.map((v)=>generateLabelFromValue(collections, field, locale, v)).filter(Boolean) // Filters out any undefined or empty values
        .join(', ');
    }
    let relatedDoc;
    let valueToReturn = '';
    if (value === null || typeof value === 'undefined') {
        return String(value);
    }
    const relationTo = 'relationTo' in field ? field.relationTo : undefined;
    if (value === null || typeof value === 'undefined') {
        return String(value);
    }
    if (typeof value === 'object' && 'relationTo' in value) {
        relatedDoc = value.value;
    } else {
        // Non-polymorphic relationship
        relatedDoc = value;
    }
    const relatedCollection = relationTo ? collections.find((c)=>c.slug === (typeof value === 'object' && 'relationTo' in value ? value.relationTo : relationTo)) : null;
    if (relatedCollection) {
        const useAsTitle = relatedCollection?.admin?.useAsTitle;
        const useAsTitleField = (0, _useUseAsTitle.useUseTitleField)(relatedCollection);
        let titleFieldIsLocalized = false;
        if (useAsTitleField && (0, _types.fieldAffectsData)(useAsTitleField)) {
            titleFieldIsLocalized = useAsTitleField.localized;
        }
        if (typeof relatedDoc?.[useAsTitle] !== 'undefined') {
            valueToReturn = relatedDoc[useAsTitle];
        } else if (typeof relatedDoc?.id !== 'undefined') {
            valueToReturn = relatedDoc.id;
        } else {
            valueToReturn = relatedDoc;
        }
        if (typeof valueToReturn === 'object' && titleFieldIsLocalized) {
            valueToReturn = valueToReturn[locale];
        }
    } else if (relatedDoc) {
        // Handle non-polymorphic `hasMany` relationships or fallback
        if (typeof relatedDoc.id !== 'undefined') {
            valueToReturn = relatedDoc.id;
        } else {
            valueToReturn = relatedDoc;
        }
    }
    if (typeof valueToReturn === 'object' && valueToReturn !== null) {
        valueToReturn = JSON.stringify(valueToReturn);
    }
    return valueToReturn;
};
const Relationship = ({ comparison, field, version })=>{
    const { collections } = (0, _Config.useConfig)();
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const { code: locale } = (0, _Locale.useLocale)();
    const placeholder = `[${t('noValue')}]`;
    let versionToRender = placeholder;
    let comparisonToRender = placeholder;
    if (version) {
        if ('hasMany' in field && field.hasMany && Array.isArray(version)) {
            versionToRender = version.map((val)=>generateLabelFromValue(collections, field, locale, val)).join(', ') || placeholder;
        } else {
            versionToRender = generateLabelFromValue(collections, field, locale, version) || placeholder;
        }
    }
    if (comparison) {
        if ('hasMany' in field && field.hasMany && Array.isArray(comparison)) {
            comparisonToRender = comparison.map((val)=>generateLabelFromValue(collections, field, locale, val)).join(', ') || placeholder;
        } else {
            comparisonToRender = generateLabelFromValue(collections, field, locale, comparison) || placeholder;
        }
    }
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: baseClass
    }, /*#__PURE__*/ _react.default.createElement(_Label.default, null, locale && /*#__PURE__*/ _react.default.createElement("span", {
        className: `${baseClass}__locale-label`
    }, locale), (0, _getTranslation.getTranslation)(field.label, i18n)), /*#__PURE__*/ _react.default.createElement(_reactdiffviewercontinued.default, {
        hideLineNumbers: true,
        newValue: typeof versionToRender !== 'undefined' ? String(versionToRender) : placeholder,
        oldValue: typeof comparisonToRender !== 'undefined' ? String(comparisonToRender) : placeholder,
        showDiffOnly: false,
        splitView: true,
        styles: _styles.diffStyles
    }));
};
const _default = Relationship;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL1ZlcnNpb24vUmVuZGVyRmllbGRzVG9EaWZmL2ZpZWxkcy9SZWxhdGlvbnNoaXAvaW5kZXgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERpZmZWaWV3ZXIgZnJvbSAncmVhY3QtZGlmZi12aWV3ZXItY29udGludWVkJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuXG5pbXBvcnQgdHlwZSB7IFNhbml0aXplZENvbGxlY3Rpb25Db25maWcgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb2xsZWN0aW9ucy9jb25maWcvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFJlbGF0aW9uc2hpcEZpZWxkIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vLi4vZmllbGRzL2NvbmZpZy90eXBlcydcbmltcG9ydCB0eXBlIHsgUHJvcHMgfSBmcm9tICcuLi90eXBlcydcblxuaW1wb3J0IHsgZmllbGRBZmZlY3RzRGF0YSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uLy4uL2ZpZWxkcy9jb25maWcvdHlwZXMnXG5pbXBvcnQgeyBnZXRUcmFuc2xhdGlvbiB9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uLy4uL3V0aWxpdGllcy9nZXRUcmFuc2xhdGlvbidcbmltcG9ydCB7IHVzZVVzZVRpdGxlRmllbGQgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi9ob29rcy91c2VVc2VBc1RpdGxlJ1xuaW1wb3J0IHsgdXNlQ29uZmlnIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbGl0aWVzL0NvbmZpZydcbmltcG9ydCB7IHVzZUxvY2FsZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWxpdGllcy9Mb2NhbGUnXG5pbXBvcnQgTGFiZWwgZnJvbSAnLi4vLi4vTGFiZWwnXG5pbXBvcnQgeyBkaWZmU3R5bGVzIH0gZnJvbSAnLi4vc3R5bGVzJ1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdyZWxhdGlvbnNoaXAtZGlmZidcblxudHlwZSBSZWxhdGlvbnNoaXBWYWx1ZSA9IFJlY29yZDxzdHJpbmcsIGFueT5cblxuY29uc3QgZ2VuZXJhdGVMYWJlbEZyb21WYWx1ZSA9IChcbiAgY29sbGVjdGlvbnM6IFNhbml0aXplZENvbGxlY3Rpb25Db25maWdbXSxcbiAgZmllbGQ6IFJlbGF0aW9uc2hpcEZpZWxkLFxuICBsb2NhbGU6IHN0cmluZyxcbiAgdmFsdWU6IHsgcmVsYXRpb25Ubzogc3RyaW5nOyB2YWx1ZTogUmVsYXRpb25zaGlwVmFsdWUgfSB8IFJlbGF0aW9uc2hpcFZhbHVlLFxuKTogc3RyaW5nID0+IHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gICAgICAubWFwKCh2KSA9PiBnZW5lcmF0ZUxhYmVsRnJvbVZhbHVlKGNvbGxlY3Rpb25zLCBmaWVsZCwgbG9jYWxlLCB2KSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbikgLy8gRmlsdGVycyBvdXQgYW55IHVuZGVmaW5lZCBvciBlbXB0eSB2YWx1ZXNcbiAgICAgIC5qb2luKCcsICcpXG4gIH1cblxuICBsZXQgcmVsYXRlZERvYzogUmVsYXRpb25zaGlwVmFsdWVcbiAgbGV0IHZhbHVlVG9SZXR1cm4gPSAnJyBhcyBhbnlcblxuICBpZiAodmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBTdHJpbmcodmFsdWUpXG4gIH1cblxuICBjb25zdCByZWxhdGlvblRvID0gJ3JlbGF0aW9uVG8nIGluIGZpZWxkID8gZmllbGQucmVsYXRpb25UbyA6IHVuZGVmaW5lZFxuXG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSlcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICdyZWxhdGlvblRvJyBpbiB2YWx1ZSkge1xuICAgIHJlbGF0ZWREb2MgPSB2YWx1ZS52YWx1ZVxuICB9IGVsc2Uge1xuICAgIC8vIE5vbi1wb2x5bW9ycGhpYyByZWxhdGlvbnNoaXBcbiAgICByZWxhdGVkRG9jID0gdmFsdWVcbiAgfVxuXG4gIGNvbnN0IHJlbGF0ZWRDb2xsZWN0aW9uID0gcmVsYXRpb25Ub1xuICAgID8gY29sbGVjdGlvbnMuZmluZChcbiAgICAgICAgKGMpID0+XG4gICAgICAgICAgYy5zbHVnID09PVxuICAgICAgICAgICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICdyZWxhdGlvblRvJyBpbiB2YWx1ZSA/IHZhbHVlLnJlbGF0aW9uVG8gOiByZWxhdGlvblRvKSxcbiAgICAgIClcbiAgICA6IG51bGxcblxuICBpZiAocmVsYXRlZENvbGxlY3Rpb24pIHtcbiAgICBjb25zdCB1c2VBc1RpdGxlID0gcmVsYXRlZENvbGxlY3Rpb24/LmFkbWluPy51c2VBc1RpdGxlXG4gICAgY29uc3QgdXNlQXNUaXRsZUZpZWxkID0gdXNlVXNlVGl0bGVGaWVsZChyZWxhdGVkQ29sbGVjdGlvbilcbiAgICBsZXQgdGl0bGVGaWVsZElzTG9jYWxpemVkID0gZmFsc2VcblxuICAgIGlmICh1c2VBc1RpdGxlRmllbGQgJiYgZmllbGRBZmZlY3RzRGF0YSh1c2VBc1RpdGxlRmllbGQpKSB7XG4gICAgICB0aXRsZUZpZWxkSXNMb2NhbGl6ZWQgPSB1c2VBc1RpdGxlRmllbGQubG9jYWxpemVkXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiByZWxhdGVkRG9jPy5bdXNlQXNUaXRsZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YWx1ZVRvUmV0dXJuID0gcmVsYXRlZERvY1t1c2VBc1RpdGxlXVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlbGF0ZWREb2M/LmlkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFsdWVUb1JldHVybiA9IHJlbGF0ZWREb2MuaWRcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVUb1JldHVybiA9IHJlbGF0ZWREb2NcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlVG9SZXR1cm4gPT09ICdvYmplY3QnICYmIHRpdGxlRmllbGRJc0xvY2FsaXplZCkge1xuICAgICAgdmFsdWVUb1JldHVybiA9IHZhbHVlVG9SZXR1cm5bbG9jYWxlXVxuICAgIH1cbiAgfSBlbHNlIGlmIChyZWxhdGVkRG9jKSB7XG4gICAgLy8gSGFuZGxlIG5vbi1wb2x5bW9ycGhpYyBgaGFzTWFueWAgcmVsYXRpb25zaGlwcyBvciBmYWxsYmFja1xuICAgIGlmICh0eXBlb2YgcmVsYXRlZERvYy5pZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhbHVlVG9SZXR1cm4gPSByZWxhdGVkRG9jLmlkXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlVG9SZXR1cm4gPSByZWxhdGVkRG9jXG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZVRvUmV0dXJuID09PSAnb2JqZWN0JyAmJiB2YWx1ZVRvUmV0dXJuICE9PSBudWxsKSB7XG4gICAgdmFsdWVUb1JldHVybiA9IEpTT04uc3RyaW5naWZ5KHZhbHVlVG9SZXR1cm4pXG4gIH1cblxuICByZXR1cm4gdmFsdWVUb1JldHVyblxufVxuXG5jb25zdCBSZWxhdGlvbnNoaXA6IFJlYWN0LkZDPFByb3BzICYgeyBmaWVsZDogUmVsYXRpb25zaGlwRmllbGQgfT4gPSAoe1xuICBjb21wYXJpc29uLFxuICBmaWVsZCxcbiAgdmVyc2lvbixcbn0pID0+IHtcbiAgY29uc3QgeyBjb2xsZWN0aW9ucyB9ID0gdXNlQ29uZmlnKClcbiAgY29uc3QgeyBpMThuLCB0IH0gPSB1c2VUcmFuc2xhdGlvbignZ2VuZXJhbCcpXG4gIGNvbnN0IHsgY29kZTogbG9jYWxlIH0gPSB1c2VMb2NhbGUoKVxuXG4gIGNvbnN0IHBsYWNlaG9sZGVyID0gYFske3QoJ25vVmFsdWUnKX1dYFxuXG4gIGxldCB2ZXJzaW9uVG9SZW5kZXI6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHBsYWNlaG9sZGVyXG4gIGxldCBjb21wYXJpc29uVG9SZW5kZXI6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHBsYWNlaG9sZGVyXG5cbiAgaWYgKHZlcnNpb24pIHtcbiAgICBpZiAoJ2hhc01hbnknIGluIGZpZWxkICYmIGZpZWxkLmhhc01hbnkgJiYgQXJyYXkuaXNBcnJheSh2ZXJzaW9uKSkge1xuICAgICAgdmVyc2lvblRvUmVuZGVyID1cbiAgICAgICAgdmVyc2lvbi5tYXAoKHZhbCkgPT4gZ2VuZXJhdGVMYWJlbEZyb21WYWx1ZShjb2xsZWN0aW9ucywgZmllbGQsIGxvY2FsZSwgdmFsKSkuam9pbignLCAnKSB8fFxuICAgICAgICBwbGFjZWhvbGRlclxuICAgIH0gZWxzZSB7XG4gICAgICB2ZXJzaW9uVG9SZW5kZXIgPSBnZW5lcmF0ZUxhYmVsRnJvbVZhbHVlKGNvbGxlY3Rpb25zLCBmaWVsZCwgbG9jYWxlLCB2ZXJzaW9uKSB8fCBwbGFjZWhvbGRlclxuICAgIH1cbiAgfVxuXG4gIGlmIChjb21wYXJpc29uKSB7XG4gICAgaWYgKCdoYXNNYW55JyBpbiBmaWVsZCAmJiBmaWVsZC5oYXNNYW55ICYmIEFycmF5LmlzQXJyYXkoY29tcGFyaXNvbikpIHtcbiAgICAgIGNvbXBhcmlzb25Ub1JlbmRlciA9XG4gICAgICAgIGNvbXBhcmlzb25cbiAgICAgICAgICAubWFwKCh2YWwpID0+IGdlbmVyYXRlTGFiZWxGcm9tVmFsdWUoY29sbGVjdGlvbnMsIGZpZWxkLCBsb2NhbGUsIHZhbCkpXG4gICAgICAgICAgLmpvaW4oJywgJykgfHwgcGxhY2Vob2xkZXJcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGFyaXNvblRvUmVuZGVyID1cbiAgICAgICAgZ2VuZXJhdGVMYWJlbEZyb21WYWx1ZShjb2xsZWN0aW9ucywgZmllbGQsIGxvY2FsZSwgY29tcGFyaXNvbikgfHwgcGxhY2Vob2xkZXJcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtiYXNlQ2xhc3N9PlxuICAgICAgPExhYmVsPlxuICAgICAgICB7bG9jYWxlICYmIDxzcGFuIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fbG9jYWxlLWxhYmVsYH0+e2xvY2FsZX08L3NwYW4+fVxuICAgICAgICB7Z2V0VHJhbnNsYXRpb24oZmllbGQubGFiZWwsIGkxOG4pfVxuICAgICAgPC9MYWJlbD5cbiAgICAgIDxSZWFjdERpZmZWaWV3ZXJcbiAgICAgICAgaGlkZUxpbmVOdW1iZXJzXG4gICAgICAgIG5ld1ZhbHVlPXt0eXBlb2YgdmVyc2lvblRvUmVuZGVyICE9PSAndW5kZWZpbmVkJyA/IFN0cmluZyh2ZXJzaW9uVG9SZW5kZXIpIDogcGxhY2Vob2xkZXJ9XG4gICAgICAgIG9sZFZhbHVlPXtcbiAgICAgICAgICB0eXBlb2YgY29tcGFyaXNvblRvUmVuZGVyICE9PSAndW5kZWZpbmVkJyA/IFN0cmluZyhjb21wYXJpc29uVG9SZW5kZXIpIDogcGxhY2Vob2xkZXJcbiAgICAgICAgfVxuICAgICAgICBzaG93RGlmZk9ubHk9e2ZhbHNlfVxuICAgICAgICBzcGxpdFZpZXdcbiAgICAgICAgc3R5bGVzPXtkaWZmU3R5bGVzfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWxhdGlvbnNoaXBcbiJdLCJuYW1lcyI6WyJiYXNlQ2xhc3MiLCJnZW5lcmF0ZUxhYmVsRnJvbVZhbHVlIiwiY29sbGVjdGlvbnMiLCJmaWVsZCIsImxvY2FsZSIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwidiIsImZpbHRlciIsIkJvb2xlYW4iLCJqb2luIiwicmVsYXRlZERvYyIsInZhbHVlVG9SZXR1cm4iLCJTdHJpbmciLCJyZWxhdGlvblRvIiwidW5kZWZpbmVkIiwicmVsYXRlZENvbGxlY3Rpb24iLCJmaW5kIiwiYyIsInNsdWciLCJ1c2VBc1RpdGxlIiwiYWRtaW4iLCJ1c2VBc1RpdGxlRmllbGQiLCJ1c2VVc2VUaXRsZUZpZWxkIiwidGl0bGVGaWVsZElzTG9jYWxpemVkIiwiZmllbGRBZmZlY3RzRGF0YSIsImxvY2FsaXplZCIsImlkIiwiSlNPTiIsInN0cmluZ2lmeSIsIlJlbGF0aW9uc2hpcCIsImNvbXBhcmlzb24iLCJ2ZXJzaW9uIiwidXNlQ29uZmlnIiwiaTE4biIsInQiLCJ1c2VUcmFuc2xhdGlvbiIsImNvZGUiLCJ1c2VMb2NhbGUiLCJwbGFjZWhvbGRlciIsInZlcnNpb25Ub1JlbmRlciIsImNvbXBhcmlzb25Ub1JlbmRlciIsImhhc01hbnkiLCJ2YWwiLCJkaXYiLCJjbGFzc05hbWUiLCJMYWJlbCIsInNwYW4iLCJnZXRUcmFuc2xhdGlvbiIsImxhYmVsIiwiUmVhY3REaWZmVmlld2VyIiwiaGlkZUxpbmVOdW1iZXJzIiwibmV3VmFsdWUiLCJvbGRWYWx1ZSIsInNob3dEaWZmT25seSIsInNwbGl0VmlldyIsInN0eWxlcyIsImRpZmZTdHlsZXMiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkEwSkE7OztlQUFBOzs7OERBMUprQjtpRkFDVTs4QkFDRzt1QkFNRTtnQ0FDRjsrQkFDRTt3QkFDUDt3QkFDQTs4REFDUjt3QkFDUztRQUNwQjs7Ozs7O0FBRVAsTUFBTUEsWUFBWTtBQUlsQixNQUFNQyx5QkFBeUIsQ0FDN0JDLGFBQ0FDLE9BQ0FDLFFBQ0FDO0lBRUEsSUFBSUMsTUFBTUMsT0FBTyxDQUFDRixRQUFRO1FBQ3hCLE9BQU9BLE1BQ0pHLEdBQUcsQ0FBQyxDQUFDQyxJQUFNUix1QkFBdUJDLGFBQWFDLE9BQU9DLFFBQVFLLElBQzlEQyxNQUFNLENBQUNDLFNBQVMsNENBQTRDO1NBQzVEQyxJQUFJLENBQUM7SUFDVjtJQUVBLElBQUlDO0lB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