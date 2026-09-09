"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DefaultGlobalEdit", {
    enumerable: true,
    get: function() {
        return DefaultGlobalEdit;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reacti18next = require("react-i18next");
const _getTranslation = require("../../../../../utilities/getTranslation");
const _DocumentControls = require("../../../elements/DocumentControls");
const _DocumentFields = require("../../../elements/DocumentFields");
const _LeaveWithoutSaving = require("../../../modals/LeaveWithoutSaving");
const _Meta = /*#__PURE__*/ _interop_require_default(require("../../../utilities/Meta"));
const _SetStepNav = require("../../collections/Edit/SetStepNav");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const DefaultGlobalEdit = (props)=>{
    const { apiURL, data, fieldTypes, global, permissions } = props;
    const { i18n } = (0, _reacti18next.useTranslation)();
    const { admin: { description, forceRenderAllFields } = {}, fields, label } = global;
    const hasSavePermission = permissions?.update?.permission;
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(_Meta.default, {
        description: (0, _getTranslation.getTranslation)(label, i18n),
        keywords: `${(0, _getTranslation.getTranslation)(label, i18n)}, Payload, CMS`,
        title: (0, _getTranslation.getTranslation)(label, i18n)
    }), !(global.versions?.drafts && global.versions?.drafts?.autosave) && /*#__PURE__*/ _react.default.createElement(_LeaveWithoutSaving.LeaveWithoutSaving, null), /*#__PURE__*/ _react.default.createElement(_SetStepNav.SetStepNav, {
        global: global
    }), /*#__PURE__*/ _react.default.createElement(_DocumentControls.DocumentControls, {
        apiURL: apiURL,
        data: data,
        global: global,
        hasSavePermission: hasSavePermission,
        isEditing: true,
        permissions: permissions
    }), /*#__PURE__*/ _react.default.createElement(_DocumentFields.DocumentFields, {
        description: description,
        fieldTypes: fieldTypes,
        fields: fields,
        forceRenderAllFields: forceRenderAllFields,
        hasSavePermission: hasSavePermission,
        permissions: permissions
    }));
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL0dsb2JhbC9EZWZhdWx0L2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5cbmltcG9ydCB0eXBlIHsgRmllbGRUeXBlcyB9IGZyb20gJy4uLy4uLy4uL2Zvcm1zL2ZpZWxkLXR5cGVzJ1xuaW1wb3J0IHR5cGUgeyBHbG9iYWxFZGl0Vmlld1Byb3BzIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5cbmltcG9ydCB7IGdldFRyYW5zbGF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbGl0aWVzL2dldFRyYW5zbGF0aW9uJ1xuaW1wb3J0IHsgRG9jdW1lbnRDb250cm9scyB9IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0RvY3VtZW50Q29udHJvbHMnXG5pbXBvcnQgeyBEb2N1bWVudEZpZWxkcyB9IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0RvY3VtZW50RmllbGRzJ1xuaW1wb3J0IHsgTGVhdmVXaXRob3V0U2F2aW5nIH0gZnJvbSAnLi4vLi4vLi4vbW9kYWxzL0xlYXZlV2l0aG91dFNhdmluZydcbmltcG9ydCBNZXRhIGZyb20gJy4uLy4uLy4uL3V0aWxpdGllcy9NZXRhJ1xuaW1wb3J0IHsgU2V0U3RlcE5hdiB9IGZyb20gJy4uLy4uL2NvbGxlY3Rpb25zL0VkaXQvU2V0U3RlcE5hdidcblxuZXhwb3J0IGNvbnN0IERlZmF1bHRHbG9iYWxFZGl0OiBSZWFjdC5GQzxcbiAgR2xvYmFsRWRpdFZpZXdQcm9wcyAmIHtcbiAgICBmaWVsZFR5cGVzOiBGaWVsZFR5cGVzXG4gIH1cbj4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBhcGlVUkwsIGRhdGEsIGZpZWxkVHlwZXMsIGdsb2JhbCwgcGVybWlzc2lvbnMgfSA9IHByb3BzXG4gIGNvbnN0IHsgaTE4biB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIGNvbnN0IHsgYWRtaW46IHsgZGVzY3JpcHRpb24sIGZvcmNlUmVuZGVyQWxsRmllbGRzIH0gPSB7fSwgZmllbGRzLCBsYWJlbCB9ID0gZ2xvYmFsXG5cbiAgY29uc3QgaGFzU2F2ZVBlcm1pc3Npb24gPSBwZXJtaXNzaW9ucz8udXBkYXRlPy5wZXJtaXNzaW9uXG5cbiAgcmV0dXJuIChcbiAgICA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICA8TWV0YVxuICAgICAgICBkZXNjcmlwdGlvbj17Z2V0VHJhbnNsYXRpb24obGFiZWwsIGkxOG4pfVxuICAgICAgICBrZXl3b3Jkcz17YCR7Z2V0VHJhbnNsYXRpb24obGFiZWwsIGkxOG4pfSwgUGF5bG9hZCwgQ01TYH1cbiAgICAgICAgdGl0bGU9e2dldFRyYW5zbGF0aW9uKGxhYmVsLCBpMThuKX1cbiAgICAgIC8+XG4gICAgICB7IShnbG9iYWwudmVyc2lvbnM/LmRyYWZ0cyAmJiBnbG9iYWwudmVyc2lvbnM/LmRyYWZ0cz8uYXV0b3NhdmUpICYmIDxMZWF2ZVdpdGhvdXRTYXZpbmcgLz59XG4gICAgICA8U2V0U3RlcE5hdiBnbG9iYWw9e2dsb2JhbH0gLz5cbiAgICAgIDxEb2N1bWVudENvbnRyb2xzXG4gICAgICAgIGFwaVVSTD17YXBpVVJMfVxuICAgICAgICBkYXRhPXtkYXRhfVxuICAgICAgICBnbG9iYWw9e2dsb2JhbH1cbiAgICAgICAgaGFzU2F2ZVBlcm1pc3Npb249e2hhc1NhdmVQZXJtaXNzaW9ufVxuICAgICAgICBpc0VkaXRpbmdcbiAgICAgICAgcGVybWlzc2lvbnM9e3Blcm1pc3Npb25zfVxuICAgICAgLz5cbiAgICAgIDxEb2N1bWVudEZpZWxkc1xuICAgICAgICBkZXNjcmlwdGlvbj17ZGVzY3JpcHRpb259XG4gICAgICAgIGZpZWxkVHlwZXM9e2ZpZWxkVHlwZXN9XG4gICAgICAgIGZpZWxkcz17ZmllbGRzfVxuICAgICAgICBmb3JjZVJlbmRlckFsbEZpZWxkcz17Zm9yY2VSZW5kZXJBbGxGaWVsZHN9XG4gICAgICAgIGhhc1NhdmVQZXJtaXNzaW9uPXtoYXNTYXZlUGVybWlzc2lvbn1cbiAgICAgICAgcGVybWlzc2lvbnM9e3Blcm1pc3Npb25zfVxuICAgICAgLz5cbiAgICA8L1JlYWN0LkZyYWdtZW50PlxuICApXG59XG4iXSwibmFtZXMiOlsiRGVmYXVsdEdsb2JhbEVkaXQiLCJwcm9wcyIsImFwaVVSTCIsImRhdGEiLCJmaWVsZFR5cGVzIiwiZ2xvYmFsIiwicGVybWlzc2lvbnMiLCJpMThuIiwidXNlVHJhbnNsYXRpb24iLCJhZG1pbiIsImRlc2NyaXB0aW9uIiwiZm9yY2VSZW5kZXJBbGxGaWVsZHMiLCJmaWVsZHMiLCJsYWJlbCIsImhhc1NhdmVQZXJtaXNzaW9uIiwidXBkYXRlIiwicGVybWlzc2lvbiIsIlJlYWN0IiwiRnJhZ21lbnQiLCJNZXRhIiwiZ2V0VHJhbnNsYXRpb24iLCJrZXl3b3JkcyIsInRpdGxlIiwidmVyc2lvbnMiLCJkcmFmdHMiLCJhdXRvc2F2ZSIsIkxlYXZlV2l0aG91dFNhdmluZyIsIlNldFN0ZXBOYXYiLCJEb2N1bWVudENvbnRyb2xzIiwiaXNFZGl0aW5nIiwiRG9jdW1lbnRGaWVsZHMiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkFhYUE7OztlQUFBQTs7OzhEQWJLOzhCQUNhO2dDQUtBO2tDQUNFO2dDQUNGO29DQUNJOzZEQUNsQjs0QkFDVTs7Ozs7O0FBRXBCLE1BQU1BLG9CQUlULENBQUNDO0lBQ0gsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLElBQUksRUFBRUMsVUFBVSxFQUFFQyxNQUFNLEVBQUVDLFdBQVcsRUFBRSxHQUFHTDtJQUMxRCxNQUFNLEVBQUVNLElBQUksRUFBRSxHQUFHQyxJQUFBQSw0QkFBYztJQUUvQixNQUFNLEVBQUVDLE9BQU8sRUFBRUMsV0FBVyxFQUFFQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFQyxNQUFNLEVBQUVDLEtBQUssRUFBRSxHQUFHUjtJQUU3RSxNQUFNUyxvQkFBb0JSLGFBQWFTLFFBQVFDO0lBRS9DLHFCQUNFLDZCQUFDQyxjQUFLLENBQUNDLFFBQVEsc0JBQ2IsNkJBQUNDLGFBQUk7UUFDSFQsYUFBYVUsSUFBQUEsOEJBQWMsRUFBQ1AsT0FBT047UUFDbkNjLFVBQVUsQ0FBQyxFQUFFRCxJQUFBQSw4QkFBYyxFQUFDUCxPQUFPTixNQUFNLGNBQWMsQ0FBQztRQUN4RGUsT0FBT0YsSUFBQUEsOEJBQWMsRUFBQ1AsT0FBT047UUFFOUIsQ0FBRUYsQ0FBQUEsT0FBT2tCLFFBQVEsRUFBRUMsVUFBVW5CLE9BQU9rQixRQUFRLEVBQUVDLFFBQVFDLFFBQU8sbUJBQU0sNkJBQUNDLHNDQUFrQix1QkFDdkYsNkJBQUNDLHNCQUFVO1FBQUN0QixRQUFRQTtzQkFDcEIsNkJBQUN1QixrQ0FBZ0I7UUFDZjFCLFFBQVFBO1FBQ1JDLE1BQU1BO1FBQ05FLFFBQVFBO1FBQ1JTLG1CQUFtQkE7UUFDbkJlLFdBQUFBO1FBQ0F2QixhQUFhQTtzQkFFZiw2QkFBQ3dCLDhCQUFjO1FBQ2JwQixhQUFhQTtRQUNiTixZQUFZQTtRQUNaUSxRQUFRQTtRQUNSRCxzQkFBc0JBO1FBQ3RCRyxtQkFBbUJBO1FBQ25CUixhQUFhQTs7QUFJckIifQ==