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
const _getTranslation = require("../../../../../../../../utilities/getTranslation");
const _useIntersect = /*#__PURE__*/ _interop_require_default(require("../../../../../../../hooks/useIntersect"));
const _useTitle = require("../../../../../../../hooks/useTitle");
const _Config = require("../../../../../../utilities/Config");
const _RelationshipProvider = require("../../../RelationshipProvider");
const _File = /*#__PURE__*/ _interop_require_default(require("../File"));
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
const baseClass = 'relationship-cell';
const totalToShow = 3;
const RelationshipCell = (props)=>{
    const { data: cellData, field } = props;
    const config = (0, _Config.useConfig)();
    const { collections, routes } = config;
    const [intersectionRef, entry] = (0, _useIntersect.default)();
    const [values, setValues] = (0, _react.useState)([]);
    const { documents, getRelationships } = (0, _RelationshipProvider.useListRelationships)();
    const [hasRequested, setHasRequested] = (0, _react.useState)(false);
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const isAboveViewport = entry?.boundingClientRect?.top < window.innerHeight;
    (0, _react.useEffect)(()=>{
        if (cellData && isAboveViewport && !hasRequested) {
            const formattedValues = [];
            const arrayCellData = Array.isArray(cellData) ? cellData : [
                cellData
            ];
            arrayCellData.slice(0, arrayCellData.length < totalToShow ? arrayCellData.length : totalToShow).forEach((cell)=>{
                if (typeof cell === 'object' && 'relationTo' in cell && 'value' in cell) {
                    formattedValues.push(cell);
                }
                if ((typeof cell === 'number' || typeof cell === 'string') && 'relationTo' in field && typeof field.relationTo === 'string') {
                    formattedValues.push({
                        relationTo: field.relationTo,
                        value: cell
                    });
                } else if (typeof cell.id !== 'undefined' && typeof field.relationTo === 'string') {
                    formattedValues.push({
                        relationTo: field.relationTo,
                        value: cell.id
                    });
                }
            });
            getRelationships(formattedValues);
            setHasRequested(true);
            setValues(formattedValues);
        }
    }, [
        cellData,
        field,
        collections,
        isAboveViewport,
        routes.api,
        hasRequested,
        getRelationships
    ]);
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: baseClass,
        ref: intersectionRef
    }, values.map(({ relationTo, value }, i)=>{
        const document = documents[relationTo][value];
        const relatedCollection = collections.find(({ slug })=>slug === relationTo);
        const label = (0, _useTitle.formatUseAsTitle)({
            collection: relatedCollection,
            config,
            doc: document === false ? null : document,
            i18n
        });
        let fileField = null;
        if (field.type === 'upload') {
            const relatedCollectionPreview = !!relatedCollection.upload.displayPreview;
            const fieldPreview = field.displayPreview;
            const previewAllowed = fieldPreview || relatedCollectionPreview && fieldPreview !== false;
            if (previewAllowed && document) {
                fileField = /*#__PURE__*/ _react.default.createElement(_File.default, {
                    collection: relatedCollection,
                    data: label,
                    field: field,
                    rowData: document
                });
            }
        }
        return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, {
            key: i
        }, document === false && `${t('untitled')} - ID: ${value}`, document === null && `${t('loading')}...`, document && (fileField || label || `${t('untitled')} - ID: ${value}`), values.length > i + 1 && ', ');
    }), Array.isArray(cellData) && cellData.length > totalToShow && t('fields:itemsAndMore', {
        count: cellData.length - totalToShow,
        items: ''
    }), values.length === 0 && t('noLabel', {
        label: (0, _getTranslation.getTranslation)(field?.label || '', i18n)
    }));
};
const _default = RelationshipCell;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL2NvbGxlY3Rpb25zL0xpc3QvQ2VsbC9maWVsZC10eXBlcy9SZWxhdGlvbnNoaXAvaW5kZXgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5cbmltcG9ydCB0eXBlIHsgUmVsYXRpb25zaGlwRmllbGQsIFVwbG9hZEZpZWxkIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vZXhwb3J0cy90eXBlcydcbmltcG9ydCB0eXBlIHsgQ2VsbENvbXBvbmVudFByb3BzIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5cbmltcG9ydCB7IGdldFRyYW5zbGF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXRpbGl0aWVzL2dldFRyYW5zbGF0aW9uJ1xuaW1wb3J0IHVzZUludGVyc2VjdCBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi8uLi9ob29rcy91c2VJbnRlcnNlY3QnXG5pbXBvcnQgeyBmb3JtYXRVc2VBc1RpdGxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vLi4vaG9va3MvdXNlVGl0bGUnXG5pbXBvcnQgeyB1c2VDb25maWcgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi91dGlsaXRpZXMvQ29uZmlnJ1xuaW1wb3J0IHsgdXNlTGlzdFJlbGF0aW9uc2hpcHMgfSBmcm9tICcuLi8uLi8uLi9SZWxhdGlvbnNoaXBQcm92aWRlcidcbmltcG9ydCBGaWxlIGZyb20gJy4uL0ZpbGUnXG5pbXBvcnQgJy4vaW5kZXguc2NzcydcblxudHlwZSBWYWx1ZSA9IHsgcmVsYXRpb25Ubzogc3RyaW5nOyB2YWx1ZTogbnVtYmVyIHwgc3RyaW5nIH1cbmNvbnN0IGJhc2VDbGFzcyA9ICdyZWxhdGlvbnNoaXAtY2VsbCdcbmNvbnN0IHRvdGFsVG9TaG93ID0gM1xuXG5jb25zdCBSZWxhdGlvbnNoaXBDZWxsOiBSZWFjdC5GQzxDZWxsQ29tcG9uZW50UHJvcHM8UmVsYXRpb25zaGlwRmllbGQgfCBVcGxvYWRGaWVsZD4+ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgZGF0YTogY2VsbERhdGEsIGZpZWxkIH0gPSBwcm9wc1xuICBjb25zdCBjb25maWcgPSB1c2VDb25maWcoKVxuICBjb25zdCB7IGNvbGxlY3Rpb25zLCByb3V0ZXMgfSA9IGNvbmZpZ1xuICBjb25zdCBbaW50ZXJzZWN0aW9uUmVmLCBlbnRyeV0gPSB1c2VJbnRlcnNlY3QoKVxuICBjb25zdCBbdmFsdWVzLCBzZXRWYWx1ZXNdID0gdXNlU3RhdGU8VmFsdWVbXT4oW10pXG4gIGNvbnN0IHsgZG9jdW1lbnRzLCBnZXRSZWxhdGlvbnNoaXBzIH0gPSB1c2VMaXN0UmVsYXRpb25zaGlwcygpXG4gIGNvbnN0IFtoYXNSZXF1ZXN0ZWQsIHNldEhhc1JlcXVlc3RlZF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgeyBpMThuLCB0IH0gPSB1c2VUcmFuc2xhdGlvbignZ2VuZXJhbCcpXG5cbiAgY29uc3QgaXNBYm92ZVZpZXdwb3J0ID0gZW50cnk/LmJvdW5kaW5nQ2xpZW50UmVjdD8udG9wIDwgd2luZG93LmlubmVySGVpZ2h0XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoY2VsbERhdGEgJiYgaXNBYm92ZVZpZXdwb3J0ICYmICFoYXNSZXF1ZXN0ZWQpIHtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZFZhbHVlczogVmFsdWVbXSA9IFtdXG5cbiAgICAgIGNvbnN0IGFycmF5Q2VsbERhdGEgPSBBcnJheS5pc0FycmF5KGNlbGxEYXRhKSA/IGNlbGxEYXRhIDogW2NlbGxEYXRhXVxuICAgICAgYXJyYXlDZWxsRGF0YVxuICAgICAgICAuc2xpY2UoMCwgYXJyYXlDZWxsRGF0YS5sZW5ndGggPCB0b3RhbFRvU2hvdyA/IGFycmF5Q2VsbERhdGEubGVuZ3RoIDogdG90YWxUb1Nob3cpXG4gICAgICAgIC5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjZWxsID09PSAnb2JqZWN0JyAmJiAncmVsYXRpb25UbycgaW4gY2VsbCAmJiAndmFsdWUnIGluIGNlbGwpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFZhbHVlcy5wdXNoKGNlbGwpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICh0eXBlb2YgY2VsbCA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGNlbGwgPT09ICdzdHJpbmcnKSAmJlxuICAgICAgICAgICAgJ3JlbGF0aW9uVG8nIGluIGZpZWxkICYmXG4gICAgICAgICAgICB0eXBlb2YgZmllbGQucmVsYXRpb25UbyA9PT0gJ3N0cmluZydcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFZhbHVlcy5wdXNoKHtcbiAgICAgICAgICAgICAgcmVsYXRpb25UbzogZmllbGQucmVsYXRpb25UbyxcbiAgICAgICAgICAgICAgdmFsdWU6IGNlbGwsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNlbGwuaWQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBmaWVsZC5yZWxhdGlvblRvID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZm9ybWF0dGVkVmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICByZWxhdGlvblRvOiBmaWVsZC5yZWxhdGlvblRvLFxuICAgICAgICAgICAgICB2YWx1ZTogY2VsbC5pZCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgZ2V0UmVsYXRpb25zaGlwcyhmb3JtYXR0ZWRWYWx1ZXMpXG4gICAgICBzZXRIYXNSZXF1ZXN0ZWQodHJ1ZSlcbiAgICAgIHNldFZhbHVlcyhmb3JtYXR0ZWRWYWx1ZXMpXG4gICAgfVxuICB9LCBbY2VsbERhdGEsIGZpZWxkLCBjb2xsZWN0aW9ucywgaXNBYm92ZVZpZXdwb3J0LCByb3V0ZXMuYXBpLCBoYXNSZXF1ZXN0ZWQsIGdldFJlbGF0aW9uc2hpcHNdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2Jhc2VDbGFzc30gcmVmPXtpbnRlcnNlY3Rpb25SZWZ9PlxuICAgICAge3ZhbHVlcy5tYXAoKHsgcmVsYXRpb25UbywgdmFsdWUgfSwgaSkgPT4ge1xuICAgICAgICBjb25zdCBkb2N1bWVudCA9IGRvY3VtZW50c1tyZWxhdGlvblRvXVt2YWx1ZV1cbiAgICAgICAgY29uc3QgcmVsYXRlZENvbGxlY3Rpb24gPSBjb2xsZWN0aW9ucy5maW5kKCh7IHNsdWcgfSkgPT4gc2x1ZyA9PT0gcmVsYXRpb25UbylcblxuICAgICAgICBjb25zdCBsYWJlbCA9IGZvcm1hdFVzZUFzVGl0bGUoe1xuICAgICAgICAgIGNvbGxlY3Rpb246IHJlbGF0ZWRDb2xsZWN0aW9uLFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICBkb2M6IGRvY3VtZW50ID09PSBmYWxzZSA/IG51bGwgOiBkb2N1bWVudCxcbiAgICAgICAgICBpMThuLFxuICAgICAgICB9KVxuXG4gICAgICAgIGxldCBmaWxlRmllbGQgPSBudWxsXG4gICAgICAgIGlmIChmaWVsZC50eXBlID09PSAndXBsb2FkJykge1xuICAgICAgICAgIGNvbnN0IHJlbGF0ZWRDb2xsZWN0aW9uUHJldmlldyA9ICEhcmVsYXRlZENvbGxlY3Rpb24udXBsb2FkLmRpc3BsYXlQcmV2aWV3XG4gICAgICAgICAgY29uc3QgZmllbGRQcmV2aWV3ID0gZmllbGQuZGlzcGxheVByZXZpZXdcbiAgICAgICAgICBjb25zdCBwcmV2aWV3QWxsb3dlZCA9XG4gICAgICAgICAgICBmaWVsZFByZXZpZXcgfHwgKHJlbGF0ZWRDb2xsZWN0aW9uUHJldmlldyAmJiBmaWVsZFByZXZpZXcgIT09IGZhbHNlKVxuICAgICAgICAgIGlmIChwcmV2aWV3QWxsb3dlZCAmJiBkb2N1bWVudCkge1xuICAgICAgICAgICAgZmlsZUZpZWxkID0gKFxuICAgICAgICAgICAgICA8RmlsZSBjb2xsZWN0aW9uPXtyZWxhdGVkQ29sbGVjdGlvbn0gZGF0YT17bGFiZWx9IGZpZWxkPXtmaWVsZH0gcm93RGF0YT17ZG9jdW1lbnR9IC8+XG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQga2V5PXtpfT5cbiAgICAgICAgICAgIHtkb2N1bWVudCA9PT0gZmFsc2UgJiYgYCR7dCgndW50aXRsZWQnKX0gLSBJRDogJHt2YWx1ZX1gfVxuICAgICAgICAgICAge2RvY3VtZW50ID09PSBudWxsICYmIGAke3QoJ2xvYWRpbmcnKX0uLi5gfVxuICAgICAgICAgICAge2RvY3VtZW50ICYmIChmaWxlRmllbGQgfHwgbGFiZWwgfHwgYCR7dCgndW50aXRsZWQnKX0gLSBJRDogJHt2YWx1ZX1gKX1cbiAgICAgICAgICAgIHt2YWx1ZXMubGVuZ3RoID4gaSArIDEgJiYgJywgJ31cbiAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICAgICApXG4gICAgICB9KX1cbiAgICAgIHtBcnJheS5pc0FycmF5KGNlbGxEYXRhKSAmJlxuICAgICAgICBjZWxsRGF0YS5sZW5ndGggPiB0b3RhbFRvU2hvdyAmJlxuICAgICAgICB0KCdmaWVsZHM6aXRlbXNBbmRNb3JlJywgeyBjb3VudDogY2VsbERhdGEubGVuZ3RoIC0gdG90YWxUb1Nob3csIGl0ZW1zOiAnJyB9KX1cbiAgICAgIHt2YWx1ZXMubGVuZ3RoID09PSAwICYmIHQoJ25vTGFiZWwnLCB7IGxhYmVsOiBnZXRUcmFuc2xhdGlvbihmaWVsZD8ubGFiZWwgfHwgJycsIGkxOG4pIH0pfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlbGF0aW9uc2hpcENlbGxcbiJdLCJuYW1lcyI6WyJiYXNlQ2xhc3MiLCJ0b3RhbFRvU2hvdyIsIlJlbGF0aW9uc2hpcENlbGwiLCJwcm9wcyIsImRhdGEiLCJjZWxsRGF0YSIsImZpZWxkIiwiY29uZmlnIiwidXNlQ29uZmlnIiwiY29sbGVjdGlvbnMiLCJyb3V0ZXMiLCJpbnRlcnNlY3Rpb25SZWYiLCJlbnRyeSIsInVzZUludGVyc2VjdCIsInZhbHVlcyIsInNldFZhbHVlcyIsInVzZVN0YXRlIiwiZG9jdW1lbnRzIiwiZ2V0UmVsYXRpb25zaGlwcyIsInVzZUxpc3RSZWxhdGlvbnNoaXBzIiwiaGFzUmVxdWVzdGVkIiwic2V0SGFzUmVxdWVzdGVkIiwiaTE4biIsInQiLCJ1c2VUcmFuc2xhdGlvbiIsImlzQWJvdmVWaWV3cG9ydCIsImJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsIndpbmRvdyIsImlubmVySGVpZ2h0IiwidXNlRWZmZWN0IiwiZm9ybWF0dGVkVmFsdWVzIiwiYXJyYXlDZWxsRGF0YSIsIkFycmF5IiwiaXNBcnJheSIsInNsaWNlIiwibGVuZ3RoIiwiZm9yRWFjaCIsImNlbGwiLCJwdXNoIiwicmVsYXRpb25UbyIsInZhbHVlIiwiaWQiLCJhcGkiLCJkaXYiLCJjbGFzc05hbWUiLCJyZWYiLCJtYXAiLCJpIiwiZG9jdW1lbnQiLCJyZWxhdGVkQ29sbGVjdGlvbiIsImZpbmQiLCJzbHVnIiwibGFiZWwiLCJmb3JtYXRVc2VBc1RpdGxlIiwiY29sbGVjdGlvbiIsImRvYyIsImZpbGVGaWVsZCIsInR5cGUiLCJyZWxhdGVkQ29sbGVjdGlvblByZXZpZXciLCJ1cGxvYWQiLCJkaXNwbGF5UHJldmlldyIsImZpZWxkUHJldmlldyIsInByZXZpZXdBbGxvd2VkIiwiRmlsZSIsInJvd0RhdGEiLCJSZWFjdCIsIkZyYWdtZW50Iiwia2V5IiwiY291bnQiLCJpdGVtcyIsImdldFRyYW5zbGF0aW9uIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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