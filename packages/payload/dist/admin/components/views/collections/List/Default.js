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
const _windowinfo = require("@faceless-ui/window-info");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reacti18next = require("react-i18next");
const _formatFilesize = /*#__PURE__*/ _interop_require_default(require("../../../../../uploads/formatFilesize"));
const _getTranslation = require("../../../../../utilities/getTranslation");
const _Button = /*#__PURE__*/ _interop_require_default(require("../../../elements/Button"));
const _DeleteMany = /*#__PURE__*/ _interop_require_default(require("../../../elements/DeleteMany"));
const _EditMany = /*#__PURE__*/ _interop_require_default(require("../../../elements/EditMany"));
const _Gutter = require("../../../elements/Gutter");
const _ListControls = require("../../../elements/ListControls");
const _ListSelection = /*#__PURE__*/ _interop_require_default(require("../../../elements/ListSelection"));
const _Paginator = /*#__PURE__*/ _interop_require_default(require("../../../elements/Paginator"));
const _PerPage = /*#__PURE__*/ _interop_require_default(require("../../../elements/PerPage"));
const _Pill = /*#__PURE__*/ _interop_require_default(require("../../../elements/Pill"));
const _PublishMany = /*#__PURE__*/ _interop_require_default(require("../../../elements/PublishMany"));
const _ShimmerEffect = require("../../../elements/ShimmerEffect");
const _Table = require("../../../elements/Table");
const _UnpublishMany = /*#__PURE__*/ _interop_require_default(require("../../../elements/UnpublishMany"));
const _ViewDescription = /*#__PURE__*/ _interop_require_default(require("../../../elements/ViewDescription"));
const _Meta = /*#__PURE__*/ _interop_require_default(require("../../../utilities/Meta"));
const _RelationshipProvider = require("./RelationshipProvider");
const _SelectionProvider = require("./SelectionProvider");
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
const baseClass = 'collection-list';
const DefaultList = (props)=>{
    const { collection: { admin: { components: { AfterList, AfterListTable, BeforeList, BeforeListTable } = {}, description } = {}, labels: { plural: pluralLabel, singular: singularLabel } }, collection, customHeader, data, handlePageChange, handlePerPageChange, handleSearchChange, handleSortChange, handleWhereChange, hasCreatePermission, limit, modifySearchParams, newDocumentURL, resetParams, titleField } = props;
    const { breakpoints: { s: smallBreak } } = (0, _windowinfo.useWindowInfo)();
    const { i18n, t } = (0, _reacti18next.useTranslation)('general');
    let formattedDocs = data.docs || [];
    if (collection.upload) {
        formattedDocs = formattedDocs?.map((doc)=>{
            return {
                ...doc,
                filesize: (0, _formatFilesize.default)(doc.filesize)
            };
        });
    }
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass} ${baseClass}--${collection.slug}`
    }, Array.isArray(BeforeList) && BeforeList.map((Component, i)=>/*#__PURE__*/ _react.default.createElement(Component, {
            key: i,
            ...props
        })), /*#__PURE__*/ _react.default.createElement(_Meta.default, {
        title: (0, _getTranslation.getTranslation)(collection.labels.plural, i18n)
    }), /*#__PURE__*/ _react.default.createElement(_SelectionProvider.SelectionProvider, {
        docs: data.docs,
        totalDocs: data.totalDocs
    }, /*#__PURE__*/ _react.default.createElement(_Gutter.Gutter, {
        className: `${baseClass}__wrap`
    }, /*#__PURE__*/ _react.default.createElement("header", {
        className: `${baseClass}__header`
    }, customHeader && customHeader, !customHeader && /*#__PURE__*/ _react.default.createElement(_react.Fragment, null, /*#__PURE__*/ _react.default.createElement("h1", null, (0, _getTranslation.getTranslation)(pluralLabel, i18n)), hasCreatePermission && /*#__PURE__*/ _react.default.createElement(_Pill.default, {
        "aria-label": t('createNewLabel', {
            label: (0, _getTranslation.getTranslation)(singularLabel, i18n)
        }),
        to: newDocumentURL
    }, t('createNew')), !smallBreak && /*#__PURE__*/ _react.default.createElement(_ListSelection.default, {
        label: (0, _getTranslation.getTranslation)(collection.labels.plural, i18n)
    }), description && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__sub-header`
    }, /*#__PURE__*/ _react.default.createElement(_ViewDescription.default, {
        description: description
    })))), /*#__PURE__*/ _react.default.createElement(_ListControls.ListControls, {
        collection: collection,
        handleSearchChange: handleSearchChange,
        handleSortChange: handleSortChange,
        handleWhereChange: handleWhereChange,
        modifySearchQuery: modifySearchParams,
        resetParams: resetParams,
        titleField: titleField
    }), Array.isArray(BeforeListTable) && BeforeListTable.map((Component, i)=>/*#__PURE__*/ _react.default.createElement(Component, {
            key: i,
            ...props
        })), !data.docs && /*#__PURE__*/ _react.default.createElement(_ShimmerEffect.StaggeredShimmers, {
        className: [
            `${baseClass}__shimmer`,
            `${baseClass}__shimmer--rows`
        ].join(' '),
        count: 6
    }), data.docs && data.docs.length > 0 && /*#__PURE__*/ _react.default.createElement(_RelationshipProvider.RelationshipProvider, null, /*#__PURE__*/ _react.default.createElement(_Table.Table, {
        data: formattedDocs
    })), data.docs && data.docs.length === 0 && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__no-results`
    }, /*#__PURE__*/ _react.default.createElement("p", null, t('noResults', {
        label: (0, _getTranslation.getTranslation)(pluralLabel, i18n)
    })), hasCreatePermission && newDocumentURL && /*#__PURE__*/ _react.default.createElement(_Button.default, {
        el: "link",
        to: newDocumentURL
    }, t('createNewLabel', {
        label: (0, _getTranslation.getTranslation)(singularLabel, i18n)
    }))), Array.isArray(AfterListTable) && AfterListTable.map((Component, i)=>/*#__PURE__*/ _react.default.createElement(Component, {
            key: i,
            ...props
        })), data.docs && data.docs.length > 0 && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__page-controls`
    }, /*#__PURE__*/ _react.default.createElement(_Paginator.default, {
        disableHistoryChange: modifySearchParams === false,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
        limit: data.limit,
        nextPage: data.nextPage,
        numberOfNeighbors: 1,
        onChange: handlePageChange,
        page: data.page,
        prevPage: data.prevPage,
        totalPages: data.totalPages
    }), data?.totalDocs > 0 && /*#__PURE__*/ _react.default.createElement(_react.Fragment, null, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__page-info`
    }, data.page * data.limit - (data.limit - 1), "-", data.totalPages > 1 && data.totalPages !== data.page ? data.limit * data.page : data.totalDocs, ' ', t('of'), " ", data.totalDocs), /*#__PURE__*/ _react.default.createElement(_PerPage.default, {
        handleChange: handlePerPageChange,
        limit: limit,
        limits: collection?.admin?.pagination?.limits,
        modifySearchParams: modifySearchParams,
        resetPage: data.totalDocs <= data.pagingCounter
    }), smallBreak && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__list-selection`
    }, /*#__PURE__*/ _react.default.createElement(_react.Fragment, null, /*#__PURE__*/ _react.default.createElement(_ListSelection.default, {
        label: (0, _getTranslation.getTranslation)(collection.labels.plural, i18n)
    }), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__list-selection-actions`
    }, /*#__PURE__*/ _react.default.createElement(_EditMany.default, {
        collection: collection,
        resetParams: resetParams
    }), /*#__PURE__*/ _react.default.createElement(_PublishMany.default, {
        collection: collection,
        resetParams: resetParams
    }), /*#__PURE__*/ _react.default.createElement(_UnpublishMany.default, {
        collection: collection,
        resetParams: resetParams
    }), /*#__PURE__*/ _react.default.createElement(_DeleteMany.default, {
        collection: collection,
        resetParams: resetParams
    })))))))), Array.isArray(AfterList) && AfterList.map((Component, i)=>/*#__PURE__*/ _react.default.createElement(Component, {
            key: i,
            ...props
        })));
};
const _default = DefaultList;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL2NvbGxlY3Rpb25zL0xpc3QvRGVmYXVsdC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlV2luZG93SW5mbyB9IGZyb20gJ0BmYWNlbGVzcy11aS93aW5kb3ctaW5mbydcbmltcG9ydCBSZWFjdCwgeyBGcmFnbWVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuXG5pbXBvcnQgdHlwZSB7IFByb3BzIH0gZnJvbSAnLi90eXBlcydcblxuaW1wb3J0IGZvcm1hdEZpbGVzaXplIGZyb20gJy4uLy4uLy4uLy4uLy4uL3VwbG9hZHMvZm9ybWF0RmlsZXNpemUnXG5pbXBvcnQgeyBnZXRUcmFuc2xhdGlvbiB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWxpdGllcy9nZXRUcmFuc2xhdGlvbidcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vLi4vLi4vZWxlbWVudHMvQnV0dG9uJ1xuaW1wb3J0IERlbGV0ZU1hbnkgZnJvbSAnLi4vLi4vLi4vZWxlbWVudHMvRGVsZXRlTWFueSdcbmltcG9ydCBFZGl0TWFueSBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9FZGl0TWFueSdcbmltcG9ydCB7IEd1dHRlciB9IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0d1dHRlcidcbmltcG9ydCB7IExpc3RDb250cm9scyB9IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0xpc3RDb250cm9scydcbmltcG9ydCBMaXN0U2VsZWN0aW9uIGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL0xpc3RTZWxlY3Rpb24nXG5pbXBvcnQgUGFnaW5hdG9yIGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL1BhZ2luYXRvcidcbmltcG9ydCBQZXJQYWdlIGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL1BlclBhZ2UnXG5pbXBvcnQgUGlsbCBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9QaWxsJ1xuaW1wb3J0IFB1Ymxpc2hNYW55IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL1B1Ymxpc2hNYW55J1xuaW1wb3J0IHsgU3RhZ2dlcmVkU2hpbW1lcnMgfSBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9TaGltbWVyRWZmZWN0J1xuaW1wb3J0IHsgVGFibGUgfSBmcm9tICcuLi8uLi8uLi9lbGVtZW50cy9UYWJsZSdcbmltcG9ydCBVbnB1Ymxpc2hNYW55IGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL1VucHVibGlzaE1hbnknXG5pbXBvcnQgVmlld0Rlc2NyaXB0aW9uIGZyb20gJy4uLy4uLy4uL2VsZW1lbnRzL1ZpZXdEZXNjcmlwdGlvbidcbmltcG9ydCBNZXRhIGZyb20gJy4uLy4uLy4uL3V0aWxpdGllcy9NZXRhJ1xuaW1wb3J0IHsgUmVsYXRpb25zaGlwUHJvdmlkZXIgfSBmcm9tICcuL1JlbGF0aW9uc2hpcFByb3ZpZGVyJ1xuaW1wb3J0IHsgU2VsZWN0aW9uUHJvdmlkZXIgfSBmcm9tICcuL1NlbGVjdGlvblByb3ZpZGVyJ1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdjb2xsZWN0aW9uLWxpc3QnXG5cbmNvbnN0IERlZmF1bHRMaXN0OiBSZWFjdC5GQzxQcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3Qge1xuICAgIGNvbGxlY3Rpb246IHtcbiAgICAgIGFkbWluOiB7XG4gICAgICAgIGNvbXBvbmVudHM6IHsgQWZ0ZXJMaXN0LCBBZnRlckxpc3RUYWJsZSwgQmVmb3JlTGlzdCwgQmVmb3JlTGlzdFRhYmxlIH0gPSB7fSxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICB9ID0ge30sXG4gICAgICBsYWJlbHM6IHsgcGx1cmFsOiBwbHVyYWxMYWJlbCwgc2luZ3VsYXI6IHNpbmd1bGFyTGFiZWwgfSxcbiAgICB9LFxuICAgIGNvbGxlY3Rpb24sXG4gICAgY3VzdG9tSGVhZGVyLFxuICAgIGRhdGEsXG4gICAgaGFuZGxlUGFnZUNoYW5nZSxcbiAgICBoYW5kbGVQZXJQYWdlQ2hhbmdlLFxuICAgIGhhbmRsZVNlYXJjaENoYW5nZSxcbiAgICBoYW5kbGVTb3J0Q2hhbmdlLFxuICAgIGhhbmRsZVdoZXJlQ2hhbmdlLFxuICAgIGhhc0NyZWF0ZVBlcm1pc3Npb24sXG4gICAgbGltaXQsXG4gICAgbW9kaWZ5U2VhcmNoUGFyYW1zLFxuICAgIG5ld0RvY3VtZW50VVJMLFxuICAgIHJlc2V0UGFyYW1zLFxuICAgIHRpdGxlRmllbGQsXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IHtcbiAgICBicmVha3BvaW50czogeyBzOiBzbWFsbEJyZWFrIH0sXG4gIH0gPSB1c2VXaW5kb3dJbmZvKClcbiAgY29uc3QgeyBpMThuLCB0IH0gPSB1c2VUcmFuc2xhdGlvbignZ2VuZXJhbCcpXG4gIGxldCBmb3JtYXR0ZWREb2NzID0gZGF0YS5kb2NzIHx8IFtdXG5cbiAgaWYgKGNvbGxlY3Rpb24udXBsb2FkKSB7XG4gICAgZm9ybWF0dGVkRG9jcyA9IGZvcm1hdHRlZERvY3M/Lm1hcCgoZG9jKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5kb2MsXG4gICAgICAgIGZpbGVzaXplOiBmb3JtYXRGaWxlc2l6ZShkb2MuZmlsZXNpemUpLFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9ICR7YmFzZUNsYXNzfS0tJHtjb2xsZWN0aW9uLnNsdWd9YH0+XG4gICAgICB7QXJyYXkuaXNBcnJheShCZWZvcmVMaXN0KSAmJlxuICAgICAgICBCZWZvcmVMaXN0Lm1hcCgoQ29tcG9uZW50LCBpKSA9PiA8Q29tcG9uZW50IGtleT17aX0gey4uLnByb3BzfSAvPil9XG5cbiAgICAgIDxNZXRhIHRpdGxlPXtnZXRUcmFuc2xhdGlvbihjb2xsZWN0aW9uLmxhYmVscy5wbHVyYWwsIGkxOG4pfSAvPlxuICAgICAgPFNlbGVjdGlvblByb3ZpZGVyIGRvY3M9e2RhdGEuZG9jc30gdG90YWxEb2NzPXtkYXRhLnRvdGFsRG9jc30+XG4gICAgICAgIDxHdXR0ZXIgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X193cmFwYH0+XG4gICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2hlYWRlcmB9PlxuICAgICAgICAgICAge2N1c3RvbUhlYWRlciAmJiBjdXN0b21IZWFkZXJ9XG4gICAgICAgICAgICB7IWN1c3RvbUhlYWRlciAmJiAoXG4gICAgICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgICAgICA8aDE+e2dldFRyYW5zbGF0aW9uKHBsdXJhbExhYmVsLCBpMThuKX08L2gxPlxuICAgICAgICAgICAgICAgIHtoYXNDcmVhdGVQZXJtaXNzaW9uICYmIChcbiAgICAgICAgICAgICAgICAgIDxQaWxsXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e3QoJ2NyZWF0ZU5ld0xhYmVsJywgeyBsYWJlbDogZ2V0VHJhbnNsYXRpb24oc2luZ3VsYXJMYWJlbCwgaTE4bikgfSl9XG4gICAgICAgICAgICAgICAgICAgIHRvPXtuZXdEb2N1bWVudFVSTH1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3QoJ2NyZWF0ZU5ldycpfVxuICAgICAgICAgICAgICAgICAgPC9QaWxsPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgeyFzbWFsbEJyZWFrICYmIChcbiAgICAgICAgICAgICAgICAgIDxMaXN0U2VsZWN0aW9uIGxhYmVsPXtnZXRUcmFuc2xhdGlvbihjb2xsZWN0aW9uLmxhYmVscy5wbHVyYWwsIGkxOG4pfSAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAge2Rlc2NyaXB0aW9uICYmIChcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19zdWItaGVhZGVyYH0+XG4gICAgICAgICAgICAgICAgICAgIDxWaWV3RGVzY3JpcHRpb24gZGVzY3JpcHRpb249e2Rlc2NyaXB0aW9ufSAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgPExpc3RDb250cm9sc1xuICAgICAgICAgICAgY29sbGVjdGlvbj17Y29sbGVjdGlvbn1cbiAgICAgICAgICAgIGhhbmRsZVNlYXJjaENoYW5nZT17aGFuZGxlU2VhcmNoQ2hhbmdlfVxuICAgICAgICAgICAgaGFuZGxlU29ydENoYW5nZT17aGFuZGxlU29ydENoYW5nZX1cbiAgICAgICAgICAgIGhhbmRsZVdoZXJlQ2hhbmdlPXtoYW5kbGVXaGVyZUNoYW5nZX1cbiAgICAgICAgICAgIG1vZGlmeVNlYXJjaFF1ZXJ5PXttb2RpZnlTZWFyY2hQYXJhbXN9XG4gICAgICAgICAgICByZXNldFBhcmFtcz17cmVzZXRQYXJhbXN9XG4gICAgICAgICAgICB0aXRsZUZpZWxkPXt0aXRsZUZpZWxkfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge0FycmF5LmlzQXJyYXkoQmVmb3JlTGlzdFRhYmxlKSAmJlxuICAgICAgICAgICAgQmVmb3JlTGlzdFRhYmxlLm1hcCgoQ29tcG9uZW50LCBpKSA9PiA8Q29tcG9uZW50IGtleT17aX0gey4uLnByb3BzfSAvPil9XG4gICAgICAgICAgeyFkYXRhLmRvY3MgJiYgKFxuICAgICAgICAgICAgPFN0YWdnZXJlZFNoaW1tZXJzXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17W2Ake2Jhc2VDbGFzc31fX3NoaW1tZXJgLCBgJHtiYXNlQ2xhc3N9X19zaGltbWVyLS1yb3dzYF0uam9pbignICcpfVxuICAgICAgICAgICAgICBjb3VudD17Nn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7ZGF0YS5kb2NzICYmIGRhdGEuZG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxSZWxhdGlvbnNoaXBQcm92aWRlcj5cbiAgICAgICAgICAgICAgPFRhYmxlIGRhdGE9e2Zvcm1hdHRlZERvY3N9IC8+XG4gICAgICAgICAgICA8L1JlbGF0aW9uc2hpcFByb3ZpZGVyPlxuICAgICAgICAgICl9XG4gICAgICAgICAge2RhdGEuZG9jcyAmJiBkYXRhLmRvY3MubGVuZ3RoID09PSAwICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19uby1yZXN1bHRzYH0+XG4gICAgICAgICAgICAgIDxwPnt0KCdub1Jlc3VsdHMnLCB7IGxhYmVsOiBnZXRUcmFuc2xhdGlvbihwbHVyYWxMYWJlbCwgaTE4bikgfSl9PC9wPlxuICAgICAgICAgICAgICB7aGFzQ3JlYXRlUGVybWlzc2lvbiAmJiBuZXdEb2N1bWVudFVSTCAmJiAoXG4gICAgICAgICAgICAgICAgPEJ1dHRvbiBlbD1cImxpbmtcIiB0bz17bmV3RG9jdW1lbnRVUkx9PlxuICAgICAgICAgICAgICAgICAge3QoJ2NyZWF0ZU5ld0xhYmVsJywgeyBsYWJlbDogZ2V0VHJhbnNsYXRpb24oc2luZ3VsYXJMYWJlbCwgaTE4bikgfSl9XG4gICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtBcnJheS5pc0FycmF5KEFmdGVyTGlzdFRhYmxlKSAmJlxuICAgICAgICAgICAgQWZ0ZXJMaXN0VGFibGUubWFwKChDb21wb25lbnQsIGkpID0+IDxDb21wb25lbnQga2V5PXtpfSB7Li4ucHJvcHN9IC8+KX1cbiAgICAgICAgICB7ZGF0YS5kb2NzICYmIGRhdGEuZG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19wYWdlLWNvbnRyb2xzYH0+XG4gICAgICAgICAgICAgIDxQYWdpbmF0b3JcbiAgICAgICAgICAgICAgICBkaXNhYmxlSGlzdG9yeUNoYW5nZT17bW9kaWZ5U2VhcmNoUGFyYW1zID09PSBmYWxzZX1cbiAgICAgICAgICAgICAgICBoYXNOZXh0UGFnZT17ZGF0YS5oYXNOZXh0UGFnZX1cbiAgICAgICAgICAgICAgICBoYXNQcmV2UGFnZT17ZGF0YS5oYXNQcmV2UGFnZX1cbiAgICAgICAgICAgICAgICBsaW1pdD17ZGF0YS5saW1pdH1cbiAgICAgICAgICAgICAgICBuZXh0UGFnZT17ZGF0YS5uZXh0UGFnZX1cbiAgICAgICAgICAgICAgICBudW1iZXJPZk5laWdoYm9ycz17MX1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlUGFnZUNoYW5nZX1cbiAgICAgICAgICAgICAgICBwYWdlPXtkYXRhLnBhZ2V9XG4gICAgICAgICAgICAgICAgcHJldlBhZ2U9e2RhdGEucHJldlBhZ2V9XG4gICAgICAgICAgICAgICAgdG90YWxQYWdlcz17ZGF0YS50b3RhbFBhZ2VzfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICB7ZGF0YT8udG90YWxEb2NzID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3BhZ2UtaW5mb2B9PlxuICAgICAgICAgICAgICAgICAgICB7ZGF0YS5wYWdlICogZGF0YS5saW1pdCAtIChkYXRhLmxpbWl0IC0gMSl9LVxuICAgICAgICAgICAgICAgICAgICB7ZGF0YS50b3RhbFBhZ2VzID4gMSAmJiBkYXRhLnRvdGFsUGFnZXMgIT09IGRhdGEucGFnZVxuICAgICAgICAgICAgICAgICAgICAgID8gZGF0YS5saW1pdCAqIGRhdGEucGFnZVxuICAgICAgICAgICAgICAgICAgICAgIDogZGF0YS50b3RhbERvY3N9eycgJ31cbiAgICAgICAgICAgICAgICAgICAge3QoJ29mJyl9IHtkYXRhLnRvdGFsRG9jc31cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPFBlclBhZ2VcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlQ2hhbmdlPXtoYW5kbGVQZXJQYWdlQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICBsaW1pdD17bGltaXR9XG4gICAgICAgICAgICAgICAgICAgIGxpbWl0cz17Y29sbGVjdGlvbj8uYWRtaW4/LnBhZ2luYXRpb24/LmxpbWl0c31cbiAgICAgICAgICAgICAgICAgICAgbW9kaWZ5U2VhcmNoUGFyYW1zPXttb2RpZnlTZWFyY2hQYXJhbXN9XG4gICAgICAgICAgICAgICAgICAgIHJlc2V0UGFnZT17ZGF0YS50b3RhbERvY3MgPD0gZGF0YS5wYWdpbmdDb3VudGVyfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIHtzbWFsbEJyZWFrICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2xpc3Qtc2VsZWN0aW9uYH0+XG4gICAgICAgICAgICAgICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgICAgICAgICAgICAgPExpc3RTZWxlY3Rpb24gbGFiZWw9e2dldFRyYW5zbGF0aW9uKGNvbGxlY3Rpb24ubGFiZWxzLnBsdXJhbCwgaTE4bil9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fbGlzdC1zZWxlY3Rpb24tYWN0aW9uc2B9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8RWRpdE1hbnkgY29sbGVjdGlvbj17Y29sbGVjdGlvbn0gcmVzZXRQYXJhbXM9e3Jlc2V0UGFyYW1zfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8UHVibGlzaE1hbnkgY29sbGVjdGlvbj17Y29sbGVjdGlvbn0gcmVzZXRQYXJhbXM9e3Jlc2V0UGFyYW1zfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8VW5wdWJsaXNoTWFueSBjb2xsZWN0aW9uPXtjb2xsZWN0aW9ufSByZXNldFBhcmFtcz17cmVzZXRQYXJhbXN9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxEZWxldGVNYW55IGNvbGxlY3Rpb249e2NvbGxlY3Rpb259IHJlc2V0UGFyYW1zPXtyZXNldFBhcmFtc30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9HdXR0ZXI+XG4gICAgICA8L1NlbGVjdGlvblByb3ZpZGVyPlxuICAgICAge0FycmF5LmlzQXJyYXkoQWZ0ZXJMaXN0KSAmJlxuICAgICAgICBBZnRlckxpc3QubWFwKChDb21wb25lbnQsIGkpID0+IDxDb21wb25lbnQga2V5PXtpfSB7Li4ucHJvcHN9IC8+KX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0TGlzdFxuIl0sIm5hbWVzIjpbImJhc2VDbGFzcyIsIkRlZmF1bHRMaXN0IiwicHJvcHMiLCJjb2xsZWN0aW9uIiwiYWRtaW4iLCJjb21wb25lbnRzIiwiQWZ0ZXJMaXN0IiwiQWZ0ZXJMaXN0VGFibGUiLCJCZWZvcmVMaXN0IiwiQmVmb3JlTGlzdFRhYmxlIiwiZGVzY3JpcHRpb24iLCJsYWJlbHMiLCJwbHVyYWwiLCJwbHVyYWxMYWJlbCIsInNpbmd1bGFyIiwic2luZ3VsYXJMYWJlbCIsImN1c3RvbUhlYWRlciIsImRhdGEiLCJoYW5kbGVQYWdlQ2hhbmdlIiwiaGFuZGxlUGVyUGFnZUNoYW5nZSIsImhhbmRsZVNlYXJjaENoYW5nZSIsImhhbmRsZVNvcnRDaGFuZ2UiLCJoYW5kbGVXaGVyZUNoYW5nZSIsImhhc0NyZWF0ZVBlcm1pc3Npb24iLCJsaW1pdCIsIm1vZGlmeVNlYXJjaFBhcmFtcyIsIm5ld0RvY3VtZW50VVJMIiwicmVzZXRQYXJhbXMiLCJ0aXRsZUZpZWxkIiwiYnJlYWtwb2ludHMiLCJzIiwic21hbGxCcmVhayIsInVzZVdpbmRvd0luZm8iLCJpMThuIiwidCIsInVzZVRyYW5zbGF0aW9uIiwiZm9ybWF0dGVkRG9jcyIsImRvY3MiLCJ1cGxvYWQiLCJtYXAiLCJkb2MiLCJmaWxlc2l6ZSIsImZvcm1hdEZpbGVzaXplIiwiZGl2IiwiY2xhc3NOYW1lIiwic2x1ZyIsIkFycmF5IiwiaXNBcnJheSIsIkNvbXBvbmVudCIsImkiLCJrZXkiLCJNZXRhIiwidGl0bGUiLCJnZXRUcmFuc2xhdGlvbiIsIlNlbGVjdGlvblByb3ZpZGVyIiwidG90YWxEb2NzIiwiR3V0dGVyIiwiaGVhZGVyIiwiRnJhZ21lbnQiLCJoMSIsIlBpbGwiLCJhcmlhLWxhYmVsIiwibGFiZWwiLCJ0byIsIkxpc3RTZWxlY3Rpb24iLCJWaWV3RGVzY3JpcHRpb24iLCJMaXN0Q29udHJvbHMiLCJtb2RpZnlTZWFyY2hRdWVyeSIsIlN0YWdnZXJlZFNoaW1tZXJzIiwiam9pbiIsImNvdW50IiwibGVuZ3RoIiwiUmVsYXRpb25zaGlwUHJvdmlkZXIiLCJUYWJsZSIsInAiLCJCdXR0b24iLCJlbCIsIlBhZ2luYXRvciIsImRpc2FibGVIaXN0b3J5Q2hhbmdlIiwiaGFzTmV4dFBhZ2UiLCJoYXNQcmV2UGFnZSIsIm5leHRQYWdlIiwibnVtYmVyT2ZOZWlnaGJvcnMiLCJvbkNoYW5nZSIsInBhZ2UiLCJwcmV2UGFnZSIsInRvdGFsUGFnZXMiLCJQZXJQYWdlIiwiaGFuZGxlQ2hhbmdlIiwibGltaXRzIiwicGFnaW5hdGlvbiIsInJlc2V0UGFnZSIsInBhZ2luZ0NvdW50ZXIiLCJFZGl0TWFueSIsIlB1Ymxpc2hNYW55IiwiVW5wdWJsaXNoTWFueSIsIkRlbGV0ZU1hbnkiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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