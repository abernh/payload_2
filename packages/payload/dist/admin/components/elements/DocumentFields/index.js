"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DocumentFields", {
    enumerable: true,
    get: function() {
        return DocumentFields;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _RenderFields = /*#__PURE__*/ _interop_require_default(require("../../forms/RenderFields"));
const _filterFields = require("../../forms/RenderFields/filterFields");
const _OperationProvider = require("../../utilities/OperationProvider");
const _Gutter = require("../Gutter");
const _ViewDescription = /*#__PURE__*/ _interop_require_default(require("../ViewDescription"));
require("./index.scss");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const baseClass = 'document-fields';
const DocumentFields = (props)=>{
    const { AfterFields, BeforeFields, description, fieldTypes, fields, forceRenderAllFields, forceSidebarWrap, hasSavePermission, permissions } = props;
    const operation = (0, _OperationProvider.useOperation)();
    const sidebarFields = (0, _filterFields.filterFields)({
        fieldSchema: fields,
        fieldTypes,
        filter: (field)=>field?.admin?.position === 'sidebar',
        operation,
        permissions: permissions.fields,
        readOnly: !hasSavePermission
    });
    const hasSidebarFields = sidebarFields && sidebarFields.length > 0;
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("div", {
        className: [
            baseClass,
            hasSidebarFields ? `${baseClass}--has-sidebar` : `${baseClass}--no-sidebar`,
            forceSidebarWrap && `${baseClass}--force-sidebar-wrap`
        ].filter(Boolean).join(' ')
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__main`
    }, /*#__PURE__*/ _react.default.createElement(_Gutter.Gutter, {
        className: `${baseClass}__edit`
    }, /*#__PURE__*/ _react.default.createElement("header", {
        className: `${baseClass}__header`
    }, description && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__sub-header`
    }, /*#__PURE__*/ _react.default.createElement(_ViewDescription.default, {
        description: description
    }))), BeforeFields || null, /*#__PURE__*/ _react.default.createElement(_RenderFields.default, {
        className: `${baseClass}__fields`,
        fieldSchema: fields,
        fieldTypes: fieldTypes,
        filter: (field)=>!field.admin.position || field.admin.position && field.admin.position !== 'sidebar',
        forceRenderAllFields: forceRenderAllFields,
        permissions: permissions.fields,
        readOnly: !hasSavePermission
    }), AfterFields || null)), hasSidebarFields && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__sidebar-wrap`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__sidebar`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__sidebar-fields`
    }, /*#__PURE__*/ _react.default.createElement(_RenderFields.default, {
        fieldTypes: fieldTypes,
        fields: sidebarFields,
        forceRenderAllFields: forceRenderAllFields,
        permissions: permissions.fields,
        readOnly: !hasSavePermission
    }))))));
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL0RvY3VtZW50RmllbGRzL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmltcG9ydCB0eXBlIHsgQ29sbGVjdGlvblBlcm1pc3Npb24sIEdsb2JhbFBlcm1pc3Npb24gfSBmcm9tICcuLi8uLi8uLi8uLi9hdXRoJ1xuaW1wb3J0IHR5cGUgeyBGaWVsZFdpdGhQYXRoIH0gZnJvbSAnLi4vLi4vLi4vLi4vZmllbGRzL2NvbmZpZy90eXBlcydcbmltcG9ydCB0eXBlIHsgRGVzY3JpcHRpb24gfSBmcm9tICcuLi8uLi9mb3Jtcy9GaWVsZERlc2NyaXB0aW9uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBGaWVsZFR5cGVzIH0gZnJvbSAnLi4vLi4vZm9ybXMvZmllbGQtdHlwZXMnXG5cbmltcG9ydCBSZW5kZXJGaWVsZHMgZnJvbSAnLi4vLi4vZm9ybXMvUmVuZGVyRmllbGRzJ1xuaW1wb3J0IHsgZmlsdGVyRmllbGRzIH0gZnJvbSAnLi4vLi4vZm9ybXMvUmVuZGVyRmllbGRzL2ZpbHRlckZpZWxkcydcbmltcG9ydCB7IHVzZU9wZXJhdGlvbiB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9PcGVyYXRpb25Qcm92aWRlcidcbmltcG9ydCB7IEd1dHRlciB9IGZyb20gJy4uL0d1dHRlcidcbmltcG9ydCBWaWV3RGVzY3JpcHRpb24gZnJvbSAnLi4vVmlld0Rlc2NyaXB0aW9uJ1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdkb2N1bWVudC1maWVsZHMnXG5cbmV4cG9ydCBjb25zdCBEb2N1bWVudEZpZWxkczogUmVhY3QuRkM8e1xuICBBZnRlckZpZWxkcz86IFJlYWN0LlJlYWN0Tm9kZVxuICBCZWZvcmVGaWVsZHM/OiBSZWFjdC5SZWFjdE5vZGVcbiAgZGVzY3JpcHRpb24/OiBEZXNjcmlwdGlvblxuICBmaWVsZFR5cGVzOiBGaWVsZFR5cGVzXG4gIGZpZWxkczogRmllbGRXaXRoUGF0aFtdXG4gIGZvcmNlUmVuZGVyQWxsRmllbGRzPzogYm9vbGVhblxuICBmb3JjZVNpZGViYXJXcmFwPzogYm9vbGVhblxuICBoYXNTYXZlUGVybWlzc2lvbjogYm9vbGVhblxuICBwZXJtaXNzaW9uczogQ29sbGVjdGlvblBlcm1pc3Npb24gfCBHbG9iYWxQZXJtaXNzaW9uXG59PiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7XG4gICAgQWZ0ZXJGaWVsZHMsXG4gICAgQmVmb3JlRmllbGRzLFxuICAgIGRlc2NyaXB0aW9uLFxuICAgIGZpZWxkVHlwZXMsXG4gICAgZmllbGRzLFxuICAgIGZvcmNlUmVuZGVyQWxsRmllbGRzLFxuICAgIGZvcmNlU2lkZWJhcldyYXAsXG4gICAgaGFzU2F2ZVBlcm1pc3Npb24sXG4gICAgcGVybWlzc2lvbnMsXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IG9wZXJhdGlvbiA9IHVzZU9wZXJhdGlvbigpXG5cbiAgY29uc3Qgc2lkZWJhckZpZWxkcyA9IGZpbHRlckZpZWxkcyh7XG4gICAgZmllbGRTY2hlbWE6IGZpZWxkcyxcbiAgICBmaWVsZFR5cGVzLFxuICAgIGZpbHRlcjogKGZpZWxkKSA9PiBmaWVsZD8uYWRtaW4/LnBvc2l0aW9uID09PSAnc2lkZWJhcicsXG4gICAgb3BlcmF0aW9uLFxuICAgIHBlcm1pc3Npb25zOiBwZXJtaXNzaW9ucy5maWVsZHMsXG4gICAgcmVhZE9ubHk6ICFoYXNTYXZlUGVybWlzc2lvbixcbiAgfSlcblxuICBjb25zdCBoYXNTaWRlYmFyRmllbGRzID0gc2lkZWJhckZpZWxkcyAmJiBzaWRlYmFyRmllbGRzLmxlbmd0aCA+IDBcblxuICByZXR1cm4gKFxuICAgIDxSZWFjdC5GcmFnbWVudD5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtbXG4gICAgICAgICAgYmFzZUNsYXNzLFxuICAgICAgICAgIGhhc1NpZGViYXJGaWVsZHMgPyBgJHtiYXNlQ2xhc3N9LS1oYXMtc2lkZWJhcmAgOiBgJHtiYXNlQ2xhc3N9LS1uby1zaWRlYmFyYCxcbiAgICAgICAgICBmb3JjZVNpZGViYXJXcmFwICYmIGAke2Jhc2VDbGFzc30tLWZvcmNlLXNpZGViYXItd3JhcGAsXG4gICAgICAgIF1cbiAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgLmpvaW4oJyAnKX1cbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX21haW5gfT5cbiAgICAgICAgICA8R3V0dGVyIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fZWRpdGB9PlxuICAgICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2hlYWRlcmB9PlxuICAgICAgICAgICAgICB7ZGVzY3JpcHRpb24gJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19zdWItaGVhZGVyYH0+XG4gICAgICAgICAgICAgICAgICA8Vmlld0Rlc2NyaXB0aW9uIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbn0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgICAge0JlZm9yZUZpZWxkcyB8fCBudWxsfVxuICAgICAgICAgICAgPFJlbmRlckZpZWxkc1xuICAgICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2ZpZWxkc2B9XG4gICAgICAgICAgICAgIGZpZWxkU2NoZW1hPXtmaWVsZHN9XG4gICAgICAgICAgICAgIGZpZWxkVHlwZXM9e2ZpZWxkVHlwZXN9XG4gICAgICAgICAgICAgIGZpbHRlcj17KGZpZWxkKSA9PlxuICAgICAgICAgICAgICAgICFmaWVsZC5hZG1pbi5wb3NpdGlvbiB8fFxuICAgICAgICAgICAgICAgIChmaWVsZC5hZG1pbi5wb3NpdGlvbiAmJiBmaWVsZC5hZG1pbi5wb3NpdGlvbiAhPT0gJ3NpZGViYXInKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGZvcmNlUmVuZGVyQWxsRmllbGRzPXtmb3JjZVJlbmRlckFsbEZpZWxkc31cbiAgICAgICAgICAgICAgcGVybWlzc2lvbnM9e3Blcm1pc3Npb25zLmZpZWxkc31cbiAgICAgICAgICAgICAgcmVhZE9ubHk9eyFoYXNTYXZlUGVybWlzc2lvbn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7QWZ0ZXJGaWVsZHMgfHwgbnVsbH1cbiAgICAgICAgICA8L0d1dHRlcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtoYXNTaWRlYmFyRmllbGRzICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fc2lkZWJhci13cmFwYH0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fc2lkZWJhcmB9PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fc2lkZWJhci1maWVsZHNgfT5cbiAgICAgICAgICAgICAgICA8UmVuZGVyRmllbGRzXG4gICAgICAgICAgICAgICAgICBmaWVsZFR5cGVzPXtmaWVsZFR5cGVzfVxuICAgICAgICAgICAgICAgICAgZmllbGRzPXtzaWRlYmFyRmllbGRzfVxuICAgICAgICAgICAgICAgICAgZm9yY2VSZW5kZXJBbGxGaWVsZHM9e2ZvcmNlUmVuZGVyQWxsRmllbGRzfVxuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnM9e3Blcm1pc3Npb25zLmZpZWxkc31cbiAgICAgICAgICAgICAgICAgIHJlYWRPbmx5PXshaGFzU2F2ZVBlcm1pc3Npb259XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG4gIClcbn1cbiJdLCJuYW1lcyI6WyJEb2N1bWVudEZpZWxkcyIsImJhc2VDbGFzcyIsInByb3BzIiwiQWZ0ZXJGaWVsZHMiLCJCZWZvcmVGaWVsZHMiLCJkZXNjcmlwdGlvbiIsImZpZWxkVHlwZXMiLCJmaWVsZHMiLCJmb3JjZVJlbmRlckFsbEZpZWxkcyIsImZvcmNlU2lkZWJhcldyYXAiLCJoYXNTYXZlUGVybWlzc2lvbiIsInBlcm1pc3Npb25zIiwib3BlcmF0aW9uIiwidXNlT3BlcmF0aW9uIiwic2lkZWJhckZpZWxkcyIsImZpbHRlckZpZWxkcyIsImZpZWxkU2NoZW1hIiwiZmlsdGVyIiwiZmllbGQiLCJhZG1pbiIsInBvc2l0aW9uIiwicmVhZE9ubHkiLCJoYXNTaWRlYmFyRmllbGRzIiwibGVuZ3RoIiwiUmVhY3QiLCJGcmFnbWVudCIsImRpdiIsImNsYXNzTmFtZSIsIkJvb2xlYW4iLCJqb2luIiwiR3V0dGVyIiwiaGVhZGVyIiwiVmlld0Rlc2NyaXB0aW9uIiwiUmVuZGVyRmllbGRzIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkFnQmFBOzs7ZUFBQUE7Ozs4REFoQks7cUVBT087OEJBQ0k7bUNBQ0E7d0JBQ047d0VBQ0s7UUFDckI7Ozs7OztBQUVQLE1BQU1DLFlBQVk7QUFFWCxNQUFNRCxpQkFVUixDQUFDRTtJQUNKLE1BQU0sRUFDSkMsV0FBVyxFQUNYQyxZQUFZLEVBQ1pDLFdBQVcsRUFDWEMsVUFBVSxFQUNWQyxNQUFNLEVBQ05DLG9CQUFvQixFQUNwQkMsZ0JBQWdCLEVBQ2hCQyxpQkFBaUIsRUFDakJDLFdBQVcsRUFDWixHQUFHVDtJQUVKLE1BQU1VLFlBQVlDLElBQUFBLCtCQUFZO0lBRTlCLE1BQU1DLGdCQUFnQkMsSUFBQUEsMEJBQVksRUFBQztRQUNqQ0MsYUFBYVQ7UUFDYkQ7UUFDQVcsUUFBUSxDQUFDQyxRQUFVQSxPQUFPQyxPQUFPQyxhQUFhO1FBQzlDUjtRQUNBRCxhQUFhQSxZQUFZSixNQUFNO1FBQy9CYyxVQUFVLENBQUNYO0lBQ2I7SUFFQSxNQUFNWSxtQkFBbUJSLGlCQUFpQkEsY0FBY1MsTUFBTSxHQUFHO0lBRWpFLHFCQUNFLDZCQUFDQyxjQUFLLENBQUNDLFFBQVEsc0JBQ2IsNkJBQUNDO1FBQ0NDLFdBQVc7WUFDVDFCO1lBQ0FxQixtQkFBbUIsQ0FBQyxFQUFFckIsVUFBVSxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUVBLFVBQVUsWUFBWSxDQUFDO1lBQzNFUSxvQkFBb0IsQ0FBQyxFQUFFUixVQUFVLG9CQUFvQixDQUFDO1NBQ3ZELENBQ0VnQixNQUFNLENBQUNXLFNBQ1BDLElBQUksQ0FBQztxQkFFUiw2QkFBQ0g7UUFBSUMsV0FBVyxDQUFDLEVBQUUxQixVQUFVLE1BQU0sQ0FBQztxQkFDbEMsNkJBQUM2QixjQUFNO1FBQUNILFdBQVcsQ0FBQyxFQUFFMUIsVUFBVSxNQUFNLENBQUM7cUJBQ3JDLDZCQUFDOEI7UUFBT0osV0FBVyxDQUFDLEVBQUUxQixVQUFVLFFBQVEsQ0FBQztPQUN0Q0ksNkJBQ0MsNkJBQUNxQjtRQUFJQyxXQUFXLENBQUMsRUFBRTFCLFVBQVUsWUFBWSxDQUFDO3FCQUN4Qyw2QkFBQytCLHdCQUFlO1FBQUMzQixhQUFhQTtVQUluQ0QsZ0JBQWdCLG9CQUNqQiw2QkFBQzZCLHFCQUFZO1FBQ1hOLFdBQVcsQ0FBQyxFQUFFMUIsVUFBVSxRQUFRLENBQUM7UUFDakNlLGFBQWFUO1FBQ2JELFlBQVlBO1FBQ1pXLFFBQVEsQ0FBQ0MsUUFDUCxDQUFDQSxNQUFNQyxLQUFLLENBQUNDLFFBQVEsSUFDcEJGLE1BQU1DLEtBQUssQ0FBQ0MsUUFBUSxJQUFJRixNQUFNQyxLQUFLLENBQUNDLFFBQVEsS0FBSztRQUVwRFosc0JBQXNCQTtRQUN0QkcsYUFBYUEsWUFBWUosTUFBTTtRQUMvQmMsVUFBVSxDQUFDWDtRQUVaUCxlQUFlLFFBR25CbUIsa0NBQ0MsNkJBQUNJO1FBQUlDLFdBQVcsQ0FBQyxFQUFFMUIsVUFBVSxjQUFjLENBQUM7cUJBQzFDLDZCQUFDeUI7UUFBSUMsV0FBVyxDQUFDLEVBQUUxQixVQUFVLFNBQVMsQ0FBQztxQkFDckMsNkJBQUN5QjtRQUFJQyxXQUFXLENBQUMsRUFBRTFCLFVBQVUsZ0JBQWdCLENBQUM7cUJBQzVDLDZCQUFDZ0MscUJBQVk7UUFDWDNCLFlBQVlBO1FBQ1pDLFFBQVFPO1FBQ1JOLHNCQUFzQkE7UUFDdEJHLGFBQWFBLFlBQVlKLE1BQU07UUFDL0JjLFVBQVUsQ0FBQ1g7O0FBUzdCIn0=