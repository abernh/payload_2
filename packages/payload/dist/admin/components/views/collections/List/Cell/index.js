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
const _reactrouterdom = require("react-router-dom");
const _types = require("../../../../../../fields/config/types");
const _getTranslation = require("../../../../../../utilities/getTranslation");
const _Config = require("../../../../utilities/Config");
const _RenderCustomComponent = /*#__PURE__*/ _interop_require_default(require("../../../../utilities/RenderCustomComponent"));
const _fieldtypes = /*#__PURE__*/ _interop_require_default(require("./field-types"));
const _Code = /*#__PURE__*/ _interop_require_default(require("./field-types/Code"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const DefaultCell = (props)=>{
    const { cellData, className, collection: { slug }, collection, field, link = true, onClick, rowData: { id } = {}, rowData } = props;
    const { routes: { admin } } = (0, _Config.useConfig)();
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    let WrapElement = 'span';
    const wrapElementProps = {
        className
    };
    if (link) {
        WrapElement = _reactrouterdom.Link;
        wrapElementProps.to = `${admin}/collections/${slug}/${id}`;
    }
    if (typeof onClick === 'function') {
        WrapElement = 'button';
        wrapElementProps.type = 'button';
        wrapElementProps.onClick = ()=>{
            onClick(props);
        };
    }
    if (field.name === 'id') {
        return /*#__PURE__*/ _react.default.createElement(WrapElement, wrapElementProps, /*#__PURE__*/ _react.default.createElement(_Code.default, {
            collection: collection,
            data: `ID: ${String(cellData)}`,
            field: field,
            nowrap: true,
            rowData: rowData
        }));
    }
    let CellComponent = (cellData || typeof cellData === 'boolean') && cellData !== null && typeof cellData !== 'undefined' && _fieldtypes.default[field.type];
    if (!CellComponent) {
        if (collection.upload && (0, _types.fieldAffectsData)(field) && field.name === 'filename') {
            CellComponent = _fieldtypes.default.File;
        } else {
            if ((cellData === undefined || cellData === null || typeof cellData === 'string' && cellData.trim() === '') && 'label' in field) {
                return /*#__PURE__*/ _react.default.createElement(WrapElement, wrapElementProps, t('noLabel', {
                    label: (0, _getTranslation.getTranslation)(typeof field.label === 'function' ? 'data' : field.label || 'data', i18n)
                }));
            } else if ([
                'number',
                'string'
            ].includes(typeof cellData)) {
                return /*#__PURE__*/ _react.default.createElement(WrapElement, wrapElementProps, cellData);
            } else if (typeof cellData === 'object') {
                return /*#__PURE__*/ _react.default.createElement(WrapElement, wrapElementProps, JSON.stringify(cellData));
            }
        }
    }
    return /*#__PURE__*/ _react.default.createElement(WrapElement, wrapElementProps, CellComponent ? /*#__PURE__*/ _react.default.createElement(CellComponent, {
        collection: collection,
        data: cellData,
        field: field,
        rowData: rowData
    }) : null);
};
const Cell = (props)=>{
    const { cellData, className, colIndex, collection, field: { admin: { components: { Cell: CustomCell } = {} } = {} }, field, link, onClick, rowData } = props;
    return /*#__PURE__*/ _react.default.createElement(_RenderCustomComponent.default, {
        CustomComponent: CustomCell,
        DefaultComponent: DefaultCell,
        componentProps: {
            cellData,
            className,
            colIndex,
            collection,
            field,
            link,
            onClick,
            rowData
        }
    });
};
const _default = Cell;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL2NvbGxlY3Rpb25zL0xpc3QvQ2VsbC9pbmRleC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nXG5cbmltcG9ydCB0eXBlIHsgQ29kZUZpZWxkIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vZmllbGRzL2NvbmZpZy90eXBlcydcbmltcG9ydCB0eXBlIHsgQ2VsbENvbXBvbmVudFByb3BzLCBQcm9wcyB9IGZyb20gJy4vdHlwZXMnXG5cbmltcG9ydCB7IGZpZWxkQWZmZWN0c0RhdGEgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi9maWVsZHMvY29uZmlnL3R5cGVzJ1xuaW1wb3J0IHsgZ2V0VHJhbnNsYXRpb24gfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi91dGlsaXRpZXMvZ2V0VHJhbnNsYXRpb24nXG5pbXBvcnQgeyB1c2VDb25maWcgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXRpZXMvQ29uZmlnJ1xuaW1wb3J0IFJlbmRlckN1c3RvbUNvbXBvbmVudCBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXRpZXMvUmVuZGVyQ3VzdG9tQ29tcG9uZW50J1xuaW1wb3J0IGNlbGxDb21wb25lbnRzIGZyb20gJy4vZmllbGQtdHlwZXMnXG5pbXBvcnQgQ29kZUNlbGwgZnJvbSAnLi9maWVsZC10eXBlcy9Db2RlJ1xuXG5jb25zdCBEZWZhdWx0Q2VsbDogUmVhY3QuRkM8UHJvcHM+ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjZWxsRGF0YSxcbiAgICBjbGFzc05hbWUsXG4gICAgY29sbGVjdGlvbjogeyBzbHVnIH0sXG4gICAgY29sbGVjdGlvbixcbiAgICBmaWVsZCxcbiAgICBsaW5rID0gdHJ1ZSxcbiAgICBvbkNsaWNrLFxuICAgIHJvd0RhdGE6IHsgaWQgfSA9IHt9LFxuICAgIHJvd0RhdGEsXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IHtcbiAgICByb3V0ZXM6IHsgYWRtaW4gfSxcbiAgfSA9IHVzZUNvbmZpZygpXG4gIGNvbnN0IHsgaTE4biwgdCB9ID0gdXNlVHJhbnNsYXRpb24oJ2dlbmVyYWwnKVxuXG4gIGxldCBXcmFwRWxlbWVudDogUmVhY3QuQ29tcG9uZW50VHlwZTxhbnk+IHwgc3RyaW5nID0gJ3NwYW4nXG5cbiAgY29uc3Qgd3JhcEVsZW1lbnRQcm9wczoge1xuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICAgIG9uQ2xpY2s/OiAoKSA9PiB2b2lkXG4gICAgdG8/OiBzdHJpbmdcbiAgICB0eXBlPzogJ2J1dHRvbidcbiAgfSA9IHtcbiAgICBjbGFzc05hbWUsXG4gIH1cblxuICBpZiAobGluaykge1xuICAgIFdyYXBFbGVtZW50ID0gTGlua1xuICAgIHdyYXBFbGVtZW50UHJvcHMudG8gPSBgJHthZG1pbn0vY29sbGVjdGlvbnMvJHtzbHVnfS8ke2lkfWBcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb25DbGljayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFdyYXBFbGVtZW50ID0gJ2J1dHRvbidcbiAgICB3cmFwRWxlbWVudFByb3BzLnR5cGUgPSAnYnV0dG9uJ1xuICAgIHdyYXBFbGVtZW50UHJvcHMub25DbGljayA9ICgpID0+IHtcbiAgICAgIG9uQ2xpY2socHJvcHMpXG4gICAgfVxuICB9XG5cbiAgaWYgKGZpZWxkLm5hbWUgPT09ICdpZCcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFdyYXBFbGVtZW50IHsuLi53cmFwRWxlbWVudFByb3BzfT5cbiAgICAgICAgPENvZGVDZWxsXG4gICAgICAgICAgY29sbGVjdGlvbj17Y29sbGVjdGlvbn1cbiAgICAgICAgICBkYXRhPXtgSUQ6ICR7U3RyaW5nKGNlbGxEYXRhKX1gfVxuICAgICAgICAgIGZpZWxkPXtmaWVsZCBhcyBDb2RlRmllbGR9XG4gICAgICAgICAgbm93cmFwXG4gICAgICAgICAgcm93RGF0YT17cm93RGF0YX1cbiAgICAgICAgLz5cbiAgICAgIDwvV3JhcEVsZW1lbnQ+XG4gICAgKVxuICB9XG5cbiAgbGV0IENlbGxDb21wb25lbnQ6IFJlYWN0LkZDPENlbGxDb21wb25lbnRQcm9wcz4gfCBmYWxzZSA9XG4gICAgKGNlbGxEYXRhIHx8IHR5cGVvZiBjZWxsRGF0YSA9PT0gJ2Jvb2xlYW4nKSAmJlxuICAgIGNlbGxEYXRhICE9PSBudWxsICYmXG4gICAgdHlwZW9mIGNlbGxEYXRhICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIGNlbGxDb21wb25lbnRzW2ZpZWxkLnR5cGVdXG5cbiAgaWYgKCFDZWxsQ29tcG9uZW50KSB7XG4gICAgaWYgKGNvbGxlY3Rpb24udXBsb2FkICYmIGZpZWxkQWZmZWN0c0RhdGEoZmllbGQpICYmIGZpZWxkLm5hbWUgPT09ICdmaWxlbmFtZScpIHtcbiAgICAgIENlbGxDb21wb25lbnQgPSBjZWxsQ29tcG9uZW50cy5GaWxlXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChcbiAgICAgICAgKGNlbGxEYXRhID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICBjZWxsRGF0YSA9PT0gbnVsbCB8fFxuICAgICAgICAgICh0eXBlb2YgY2VsbERhdGEgPT09ICdzdHJpbmcnICYmIGNlbGxEYXRhLnRyaW0oKSA9PT0gJycpKSAmJlxuICAgICAgICAnbGFiZWwnIGluIGZpZWxkXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8V3JhcEVsZW1lbnQgey4uLndyYXBFbGVtZW50UHJvcHN9PlxuICAgICAgICAgICAge3QoJ25vTGFiZWwnLCB7XG4gICAgICAgICAgICAgIGxhYmVsOiBnZXRUcmFuc2xhdGlvbihcbiAgICAgICAgICAgICAgICB0eXBlb2YgZmllbGQubGFiZWwgPT09ICdmdW5jdGlvbicgPyAnZGF0YScgOiBmaWVsZC5sYWJlbCB8fCAnZGF0YScsXG4gICAgICAgICAgICAgICAgaTE4bixcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvV3JhcEVsZW1lbnQ+XG4gICAgICAgIClcbiAgICAgIH0gZWxzZSBpZiAoWydudW1iZXInLCAnc3RyaW5nJ10uaW5jbHVkZXModHlwZW9mIGNlbGxEYXRhKSkge1xuICAgICAgICByZXR1cm4gPFdyYXBFbGVtZW50IHsuLi53cmFwRWxlbWVudFByb3BzfT57Y2VsbERhdGF9PC9XcmFwRWxlbWVudD5cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNlbGxEYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gPFdyYXBFbGVtZW50IHsuLi53cmFwRWxlbWVudFByb3BzfT57SlNPTi5zdHJpbmdpZnkoY2VsbERhdGEpfTwvV3JhcEVsZW1lbnQ+XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8V3JhcEVsZW1lbnQgey4uLndyYXBFbGVtZW50UHJvcHN9PlxuICAgICAge0NlbGxDb21wb25lbnQgPyAoXG4gICAgICAgIDxDZWxsQ29tcG9uZW50IGNvbGxlY3Rpb249e2NvbGxlY3Rpb259IGRhdGE9e2NlbGxEYXRhfSBmaWVsZD17ZmllbGR9IHJvd0RhdGE9e3Jvd0RhdGF9IC8+XG4gICAgICApIDogbnVsbH1cbiAgICA8L1dyYXBFbGVtZW50PlxuICApXG59XG5cbmNvbnN0IENlbGw6IFJlYWN0LkZDPFByb3BzPiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7XG4gICAgY2VsbERhdGEsXG4gICAgY2xhc3NOYW1lLFxuICAgIGNvbEluZGV4LFxuICAgIGNvbGxlY3Rpb24sXG4gICAgZmllbGQ6IHsgYWRtaW46IHsgY29tcG9uZW50czogeyBDZWxsOiBDdXN0b21DZWxsIH0gPSB7fSB9ID0ge30gfSxcbiAgICBmaWVsZCxcbiAgICBsaW5rLFxuICAgIG9uQ2xpY2ssXG4gICAgcm93RGF0YSxcbiAgfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8UmVuZGVyQ3VzdG9tQ29tcG9uZW50XG4gICAgICBDdXN0b21Db21wb25lbnQ9e0N1c3RvbUNlbGx9XG4gICAgICBEZWZhdWx0Q29tcG9uZW50PXtEZWZhdWx0Q2VsbH1cbiAgICAgIGNvbXBvbmVudFByb3BzPXtcbiAgICAgICAge1xuICAgICAgICAgIGNlbGxEYXRhLFxuICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICBjb2xJbmRleCxcbiAgICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICAgIGZpZWxkLFxuICAgICAgICAgIGxpbmssXG4gICAgICAgICAgb25DbGljayxcbiAgICAgICAgICByb3dEYXRhLFxuICAgICAgICB9IGFzIFByb3BzXG4gICAgICB9XG4gICAgLz5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDZWxsXG4iXSwibmFtZXMiOlsiRGVmYXVsdENlbGwiLCJwcm9wcyIsImNlbGxEYXRhIiwiY2xhc3NOYW1lIiwiY29sbGVjdGlvbiIsInNsdWciLCJmaWVsZCIsImxpbmsiLCJvbkNsaWNrIiwicm93RGF0YSIsImlkIiwicm91dGVzIiwiYWRtaW4iLCJ1c2VDb25maWciLCJpMThuIiwidCIsInVzZVRyYW5zbGF0aW9uIiwiV3JhcEVsZW1lbnQiLCJ3cmFwRWxlbWVudFByb3BzIiwiTGluayIsInRvIiwidHlwZSIsIm5hbWUiLCJDb2RlQ2VsbCIsImRhdGEiLCJTdHJpbmciLCJub3dyYXAiLCJDZWxsQ29tcG9uZW50IiwiY2VsbENvbXBvbmVudHMiLCJ1cGxvYWQiLCJmaWVsZEFmZmVjdHNEYXRhIiwiRmlsZSIsInVuZGVmaW5lZCIsInRyaW0iLCJsYWJlbCIsImdldFRyYW5zbGF0aW9uIiwiaW5jbHVkZXMiLCJKU09OIiwic3RyaW5naWZ5IiwiQ2VsbCIsImNvbEluZGV4IiwiY29tcG9uZW50cyIsIkN1c3RvbUNlbGwiLCJSZW5kZXJDdXN0b21Db21wb25lbnQiLCJDdXN0b21Db21wb25lbnQiLCJEZWZhdWx0Q29tcG9uZW50IiwiY29tcG9uZW50UHJv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