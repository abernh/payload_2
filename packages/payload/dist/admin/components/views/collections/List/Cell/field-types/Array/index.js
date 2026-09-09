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
const _reacti18next = require("react-i18next");
const _getTranslation = require("../../../../../../../../utilities/getTranslation");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ArrayCell = ({ data, field })=>{
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    const arrayFields = data ?? [];
    const label = arrayFields.length === 1 ? `${arrayFields.length} ${(0, _getTranslation.getTranslation)(field?.labels?.singular || t('row'), i18n)}` : `${arrayFields.length} ${(0, _getTranslation.getTranslation)(field?.labels?.plural || t('rows'), i18n)}`;
    return /*#__PURE__*/ _react.default.createElement("span", null, label);
};
const _default = ArrayCell;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL2NvbGxlY3Rpb25zL0xpc3QvQ2VsbC9maWVsZC10eXBlcy9BcnJheS9pbmRleC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuXG5pbXBvcnQgdHlwZSB7IEFycmF5RmllbGQgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9maWVsZHMvY29uZmlnL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBDZWxsQ29tcG9uZW50UHJvcHMgfSBmcm9tICcuLi8uLi90eXBlcydcblxuaW1wb3J0IHsgZ2V0VHJhbnNsYXRpb24gfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi91dGlsaXRpZXMvZ2V0VHJhbnNsYXRpb24nXG5cbmNvbnN0IEFycmF5Q2VsbDogUmVhY3QuRkM8Q2VsbENvbXBvbmVudFByb3BzPEFycmF5RmllbGQsIFJlY29yZDxzdHJpbmcsIHVua25vd24+Pj4gPSAoe1xuICBkYXRhLFxuICBmaWVsZCxcbn0pID0+IHtcbiAgY29uc3QgeyBpMThuLCB0IH0gPSB1c2VUcmFuc2xhdGlvbignZ2VuZXJhbCcpXG4gIGNvbnN0IGFycmF5RmllbGRzID0gZGF0YSA/PyBbXVxuXG4gIGNvbnN0IGxhYmVsID1cbiAgICBhcnJheUZpZWxkcy5sZW5ndGggPT09IDFcbiAgICAgID8gYCR7YXJyYXlGaWVsZHMubGVuZ3RofSAke2dldFRyYW5zbGF0aW9uKGZpZWxkPy5sYWJlbHM/LnNpbmd1bGFyIHx8IHQoJ3JvdycpLCBpMThuKX1gXG4gICAgICA6IGAke2FycmF5RmllbGRzLmxlbmd0aH0gJHtnZXRUcmFuc2xhdGlvbihmaWVsZD8ubGFiZWxzPy5wbHVyYWwgfHwgdCgncm93cycpLCBpMThuKX1gXG5cbiAgcmV0dXJuIDxzcGFuPntsYWJlbH08L3NwYW4+XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFycmF5Q2VsbFxuIl0sIm5hbWVzIjpbIkFycmF5Q2VsbCIsImRhdGEiLCJmaWVsZCIsImkxOG4iLCJ0IiwidXNlVHJhbnNsYXRpb24iLCJhcnJheUZpZWxkcyIsImxhYmVsIiwibGVuZ3RoIiwiZ2V0VHJhbnNsYXRpb24iLCJsYWJlbHMiLCJzaW5ndWxhciIsInBsdXJhbCIsInNwYW4iXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OytCQXVCQTs7O2VBQUE7Ozs4REF2QmtCOzhCQUNhO2dDQUtBOzs7Ozs7QUFFL0IsTUFBTUEsWUFBK0UsQ0FBQyxFQUNwRkMsSUFBSSxFQUNKQyxLQUFLLEVBQ047SUFDQyxNQUFNLEVBQUVDLElBQUksRUFBRUMsQ0FBQyxFQUFFLEdBQUdDLElBQUFBLDRCQUFjLEVBQUM7SUFDbkMsTUFBTUMsY0FBY0wsUUFBUSxFQUFFO0lBRTlCLE1BQU1NLFFBQ0pELFlBQVlFLE1BQU0sS0FBSyxJQUNuQixDQUFDLEVBQUVGLFlBQVlFLE1BQU0sQ0FBQyxDQUFDLEVBQUVDLElBQUFBLDhCQUFjLEVBQUNQLE9BQU9RLFFBQVFDLFlBQVlQLEVBQUUsUUFBUUQsTUFBTSxDQUFDLEdBQ3BGLENBQUMsRUFBRUcsWUFBWUUsTUFBTSxDQUFDLENBQUMsRUFBRUMsSUFBQUEsOEJBQWMsRUFBQ1AsT0FBT1EsUUFBUUUsVUFBVVIsRUFBRSxTQUFTRCxNQUFNLENBQUM7SUFFekYscUJBQU8sNkJBQUNVLGNBQU1OO0FBQ2hCO01BRUEsV0FBZVAifQ==