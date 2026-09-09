"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildVersionColumns", {
    enumerable: true,
    get: function() {
        return buildVersionColumns;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reacti18next = require("react-i18next");
const _reactrouterdom = require("react-router-dom");
const _formatDate = require("../../../utilities/formatDate");
const _SortColumn = /*#__PURE__*/ _interop_require_default(require("../../elements/SortColumn"));
const _Config = require("../../utilities/Config");
const _AutosaveCell = require("./cells/AutosaveCell");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const CreatedAtCell = ({ id, collection, date, global })=>{
    const { admin: { dateFormat }, routes: { admin } } = (0, _Config.useConfig)();
    const { params: { id: docID } } = (0, _reactrouterdom.useRouteMatch)();
    const { i18n } = (0, _reacti18next.useTranslation)();
    let to;
    if (collection) to = `${admin}/collections/${collection.slug}/${docID}/versions/${id}`;
    if (global) to = `${admin}/globals/${global.slug}/versions/${id}`;
    return /*#__PURE__*/ _react.default.createElement(_reactrouterdom.Link, {
        to: to
    }, date && (0, _formatDate.formatDate)(date, dateFormat, i18n?.language));
};
const TextCell = ({ children })=>/*#__PURE__*/ _react.default.createElement("span", null, children);
const buildVersionColumns = (collection, global, t, latestDraftVersion, latestPublishedVersion)=>{
    const entityConfig = collection || global;
    const columns = [
        {
            name: '',
            accessor: 'updatedAt',
            active: true,
            components: {
                Heading: /*#__PURE__*/ _react.default.createElement(_SortColumn.default, {
                    label: t('general:updatedAt'),
                    name: "updatedAt"
                }),
                renderCell: (row, data)=>/*#__PURE__*/ _react.default.createElement(CreatedAtCell, {
                        collection: collection,
                        date: data,
                        global: global,
                        id: row?.id
                    })
            },
            label: ''
        },
        {
            name: '',
            accessor: 'id',
            active: true,
            components: {
                Heading: /*#__PURE__*/ _react.default.createElement(_SortColumn.default, {
                    disable: true,
                    label: t('versionID'),
                    name: "id"
                }),
                renderCell: (row, data)=>/*#__PURE__*/ _react.default.createElement(TextCell, null, data)
            },
            label: ''
        }
    ];
    if (entityConfig?.versions?.drafts || entityConfig?.versions?.drafts && entityConfig.versions.drafts?.autosave) {
        columns.push({
            name: '',
            accessor: 'autosave',
            active: true,
            components: {
                Heading: /*#__PURE__*/ _react.default.createElement(_SortColumn.default, {
                    disable: true,
                    label: t('status'),
                    name: "autosave"
                }),
                renderCell: (row)=>{
                    return /*#__PURE__*/ _react.default.createElement(_AutosaveCell.AutosaveCell, {
                        latestDraftVersion: latestDraftVersion,
                        latestPublishedVersion: latestPublishedVersion,
                        rowData: row
                    });
                }
            },
            label: ''
        });
    }
    return columns;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL1ZlcnNpb25zL2NvbHVtbnMudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVEZ1bmN0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgTGluaywgdXNlUm91dGVNYXRjaCB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nXG5cbmltcG9ydCB0eXBlIHsgU2FuaXRpemVkQ29sbGVjdGlvbkNvbmZpZyB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbGxlY3Rpb25zL2NvbmZpZy90eXBlcydcbmltcG9ydCB0eXBlIHsgU2FuaXRpemVkR2xvYmFsQ29uZmlnIH0gZnJvbSAnLi4vLi4vLi4vLi4vZ2xvYmFscy9jb25maWcvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IENvbHVtbiB9IGZyb20gJy4uLy4uL2VsZW1lbnRzL1RhYmxlL3R5cGVzJ1xuXG5pbXBvcnQgeyBmb3JtYXREYXRlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0aWVzL2Zvcm1hdERhdGUnXG5pbXBvcnQgU29ydENvbHVtbiBmcm9tICcuLi8uLi9lbGVtZW50cy9Tb3J0Q29sdW1uJ1xuaW1wb3J0IHsgdXNlQ29uZmlnIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL0NvbmZpZydcbmltcG9ydCB7IEF1dG9zYXZlQ2VsbCB9IGZyb20gJy4vY2VsbHMvQXV0b3NhdmVDZWxsJ1xuXG50eXBlIENyZWF0ZWRBdENlbGxQcm9wcyA9IHtcbiAgY29sbGVjdGlvbj86IFNhbml0aXplZENvbGxlY3Rpb25Db25maWdcbiAgZGF0ZTogc3RyaW5nXG4gIGdsb2JhbD86IFNhbml0aXplZEdsb2JhbENvbmZpZ1xuICBpZDogc3RyaW5nXG59XG5cbmNvbnN0IENyZWF0ZWRBdENlbGw6IFJlYWN0LkZDPENyZWF0ZWRBdENlbGxQcm9wcz4gPSAoeyBpZCwgY29sbGVjdGlvbiwgZGF0ZSwgZ2xvYmFsIH0pID0+IHtcbiAgY29uc3Qge1xuICAgIGFkbWluOiB7IGRhdGVGb3JtYXQgfSxcbiAgICByb3V0ZXM6IHsgYWRtaW4gfSxcbiAgfSA9IHVzZUNvbmZpZygpXG4gIGNvbnN0IHtcbiAgICBwYXJhbXM6IHsgaWQ6IGRvY0lEIH0sXG4gIH0gPSB1c2VSb3V0ZU1hdGNoPHsgaWQ6IHN0cmluZyB9PigpXG5cbiAgY29uc3QgeyBpMThuIH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgbGV0IHRvOiBzdHJpbmdcblxuICBpZiAoY29sbGVjdGlvbikgdG8gPSBgJHthZG1pbn0vY29sbGVjdGlvbnMvJHtjb2xsZWN0aW9uLnNsdWd9LyR7ZG9jSUR9L3ZlcnNpb25zLyR7aWR9YFxuICBpZiAoZ2xvYmFsKSB0byA9IGAke2FkbWlufS9nbG9iYWxzLyR7Z2xvYmFsLnNsdWd9L3ZlcnNpb25zLyR7aWR9YFxuXG4gIHJldHVybiA8TGluayB0bz17dG99PntkYXRlICYmIGZvcm1hdERhdGUoZGF0ZSwgZGF0ZUZvcm1hdCwgaTE4bj8ubGFuZ3VhZ2UpfTwvTGluaz5cbn1cblxuY29uc3QgVGV4dENlbGw6IFJlYWN0LkZDPHsgY2hpbGRyZW4/OiBSZWFjdC5SZWFjdE5vZGUgfT4gPSAoeyBjaGlsZHJlbiB9KSA9PiA8c3Bhbj57Y2hpbGRyZW59PC9zcGFuPlxuXG5leHBvcnQgY29uc3QgYnVpbGRWZXJzaW9uQ29sdW1ucyA9IChcbiAgY29sbGVjdGlvbjogU2FuaXRpemVkQ29sbGVjdGlvbkNvbmZpZyxcbiAgZ2xvYmFsOiBTYW5pdGl6ZWRHbG9iYWxDb25maWcsXG4gIHQ6IFRGdW5jdGlvbixcbiAgbGF0ZXN0RHJhZnRWZXJzaW9uPzogc3RyaW5nLFxuICBsYXRlc3RQdWJsaXNoZWRWZXJzaW9uPzogc3RyaW5nLFxuKTogQ29sdW1uW10gPT4ge1xuICBjb25zdCBlbnRpdHlDb25maWcgPSBjb2xsZWN0aW9uIHx8IGdsb2JhbFxuXG4gIGNvbnN0IGNvbHVtbnM6IENvbHVtbltdID0gW1xuICAgIHtcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgYWNjZXNzb3I6ICd1cGRhdGVkQXQnLFxuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgY29tcG9uZW50czoge1xuICAgICAgICBIZWFkaW5nOiA8U29ydENvbHVtbiBsYWJlbD17dCgnZ2VuZXJhbDp1cGRhdGVkQXQnKX0gbmFtZT1cInVwZGF0ZWRBdFwiIC8+LFxuICAgICAgICByZW5kZXJDZWxsOiAocm93LCBkYXRhKSA9PiAoXG4gICAgICAgICAgPENyZWF0ZWRBdENlbGwgY29sbGVjdGlvbj17Y29sbGVjdGlvbn0gZGF0ZT17ZGF0YX0gZ2xvYmFsPXtnbG9iYWx9IGlkPXtyb3c/LmlkfSAvPlxuICAgICAgICApLFxuICAgICAgfSxcbiAgICAgIGxhYmVsOiAnJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgYWNjZXNzb3I6ICdpZCcsXG4gICAgICBhY3RpdmU6IHRydWUsXG4gICAgICBjb21wb25lbnRzOiB7XG4gICAgICAgIEhlYWRpbmc6IDxTb3J0Q29sdW1uIGRpc2FibGUgbGFiZWw9e3QoJ3ZlcnNpb25JRCcpfSBuYW1lPVwiaWRcIiAvPixcbiAgICAgICAgcmVuZGVyQ2VsbDogKHJvdywgZGF0YSkgPT4gPFRleHRDZWxsPntkYXRhfTwvVGV4dENlbGw+LFxuICAgICAgfSxcbiAgICAgIGxhYmVsOiAnJyxcbiAgICB9LFxuICBdXG5cbiAgaWYgKFxuICAgIGVudGl0eUNvbmZpZz8udmVyc2lvbnM/LmRyYWZ0cyB8fFxuICAgIChlbnRpdHlDb25maWc/LnZlcnNpb25zPy5kcmFmdHMgJiYgZW50aXR5Q29uZmlnLnZlcnNpb25zLmRyYWZ0cz8uYXV0b3NhdmUpXG4gICkge1xuICAgIGNvbHVtbnMucHVzaCh7XG4gICAgICBuYW1lOiAnJyxcbiAgICAgIGFjY2Vzc29yOiAnYXV0b3NhdmUnLFxuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgY29tcG9uZW50czoge1xuICAgICAgICBIZWFkaW5nOiA8U29ydENvbHVtbiBkaXNhYmxlIGxhYmVsPXt0KCdzdGF0dXMnKX0gbmFtZT1cImF1dG9zYXZlXCIgLz4sXG4gICAgICAgIHJlbmRlckNlbGw6IChyb3cpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEF1dG9zYXZlQ2VsbFxuICAgICAgICAgICAgICBsYXRlc3REcmFmdFZlcnNpb249e2xhdGVzdERyYWZ0VmVyc2lvbn1cbiAgICAgICAgICAgICAgbGF0ZXN0UHVibGlzaGVkVmVyc2lvbj17bGF0ZXN0UHVibGlzaGVkVmVyc2lvbn1cbiAgICAgICAgICAgICAgcm93RGF0YT17cm93fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbGFiZWw6ICcnLFxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gY29sdW1uc1xufVxuIl0sIm5hbWVzIjpbImJ1aWxkVmVyc2lvbkNvbHVtbnMiLCJDcmVhdGVkQXRDZWxsIiwiaWQiLCJjb2xsZWN0aW9uIiwiZGF0ZSIsImdsb2JhbCIsImFkbWluIiwiZGF0ZUZvcm1hdCIsInJvdXRlcyIsInVzZUNvbmZpZyIsInBhcmFtcyIsImRvY0lEIiwidXNlUm91dGVNYXRjaCIsImkxOG4iLCJ1c2VUcmFuc2xhdGlvbiIsInRvIiwic2x1ZyIsIkxpbmsiLCJmb3JtYXREYXRlIiwibGFuZ3VhZ2UiLCJUZXh0Q2VsbCIsImNoaWxkcmVuIiwic3BhbiIsInQiLCJsYXRlc3REcmFmdFZlcnNpb24iLCJsYXRlc3RQdWJsaXNoZWRWZXJzaW9uIiwiZW50aXR5Q29uZmlnIiwiY29sdW1ucyIsIm5hbWUiLCJhY2Nlc3NvciIsImFjdGl2ZSIsImNvbXBvbmVudHMiLCJIZWFkaW5nIiwiU29ydENvbHVtbiIsImxhYmVsIiwicmVuZGVyQ2VsbCIsInJvdyIsImRhdGEiLCJkaXNhYmxlIiwidmVyc2lvbnMiLCJkcmFmdHMiLCJhdXRvc2F2ZSIsInB1c2giLCJBdXRvc2F2ZUNlbGwiLCJyb3dEYXRhIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkEyQ2FBOzs7ZUFBQUE7Ozs4REF6Q0s7OEJBQ2E7Z0NBQ0s7NEJBTVQ7bUVBQ0o7d0JBQ0c7OEJBQ0c7Ozs7OztBQVM3QixNQUFNQyxnQkFBOEMsQ0FBQyxFQUFFQyxFQUFFLEVBQUVDLFVBQVUsRUFBRUMsSUFBSSxFQUFFQyxNQUFNLEVBQUU7SUFDbkYsTUFBTSxFQUNKQyxPQUFPLEVBQUVDLFVBQVUsRUFBRSxFQUNyQkMsUUFBUSxFQUFFRixLQUFLLEVBQUUsRUFDbEIsR0FBR0csSUFBQUEsaUJBQVM7SUFDYixNQUFNLEVBQ0pDLFFBQVEsRUFBRVIsSUFBSVMsS0FBSyxFQUFFLEVBQ3RCLEdBQUdDLElBQUFBLDZCQUFhO0lBRWpCLE1BQU0sRUFBRUMsSUFBSSxFQUFFLEdBQUdDLElBQUFBLDRCQUFjO0lBRS9CLElBQUlDO0lBRUosSUFBSVosWUFBWVksS0FBSyxDQUFDLEVBQUVULE1BQU0sYUFBYSxFQUFFSCxXQUFXYSxJQUFJLENBQUMsQ0FBQyxFQUFFTCxNQUFNLFVBQVUsRUFBRVQsR0FBRyxDQUFDO0lBQ3RGLElBQUlHLFFBQVFVLEtBQUssQ0FBQyxFQUFFVCxNQUFNLFNBQVMsRUFBRUQsT0FBT1csSUFBSSxDQUFDLFVBQVUsRUFBRWQsR0FBRyxDQUFDO0lBRWpFLHFCQUFPLDZCQUFDZSxvQkFBSTtRQUFDRixJQUFJQTtPQUFLWCxRQUFRYyxJQUFBQSxzQkFBVSxFQUFDZCxNQUFNRyxZQUFZTSxNQUFNTTtBQUNuRTtBQUVBLE1BQU1DLFdBQXFELENBQUMsRUFBRUMsUUFBUSxFQUFFLGlCQUFLLDZCQUFDQyxjQUFNRDtBQUU3RSxNQUFNckIsc0JBQXNCLENBQ2pDRyxZQUNBRSxRQUNBa0IsR0FDQUMsb0JBQ0FDO0lBRUEsTUFBTUMsZUFBZXZCLGNBQWNFO0lBRW5DLE1BQU1zQixVQUFvQjtRQUN4QjtZQUNFQyxNQUFNO1lBQ05DLFVBQVU7WUFDVkMsUUFBUTtZQUNSQyxZQUFZO2dCQUNWQyx1QkFBUyw2QkFBQ0MsbUJBQVU7b0JBQUNDLE9BQU9YLEVBQUU7b0JBQXNCSyxNQUFLOztnQkFDekRPLFlBQVksQ0FBQ0MsS0FBS0MscUJBQ2hCLDZCQUFDcEM7d0JBQWNFLFlBQVlBO3dCQUFZQyxNQUFNaUM7d0JBQU1oQyxRQUFRQTt3QkFBUUgsSUFBSWtDLEtBQUtsQzs7WUFFaEY7WUFDQWdDLE9BQU87UUFDVDtRQUNBO1lBQ0VOLE1BQU07WUFDTkMsVUFBVTtZQUNWQyxRQUFRO1lBQ1JDLFlBQVk7Z0JBQ1ZDLHVCQUFTLDZCQUFDQyxtQkFBVTtvQkFBQ0ssU0FBQUE7b0JBQVFKLE9BQU9YLEVBQUU7b0JBQWNLLE1BQUs7O2dCQUN6RE8sWUFBWSxDQUFDQyxLQUFLQyxxQkFBUyw2QkFBQ2pCLGdCQUFVaUI7WUFDeEM7WUFDQUgsT0FBTztRQUNUO0tBQ0Q7SUFFRCxJQUNFUixjQUFjYSxVQUFVQyxVQUN2QmQsY0FBY2EsVUFBVUMsVUFBVWQsYUFBYWEsUUFBUSxDQUFDQyxNQUFNLEVBQUVDLFVBQ2pFO1FBQ0FkLFFBQVFlLElBQUksQ0FBQztZQUNYZCxNQUFNO1lBQ05DLFVBQVU7WUFDVkMsUUFBUTtZQUNSQyxZQUFZO2dCQUNWQyx1QkFBUyw2QkFBQ0MsbUJBQVU7b0JBQUNLLFNBQUFBO29CQUFRSixPQUFPWCxFQUFFO29CQUFXSyxNQUFLOztnQkFDdERPLFlBQVksQ0FBQ0M7b0JBQ1gscUJBQ0UsNkJBQUNPLDBCQUFZO3dCQUNYbkIsb0JBQW9CQTt3QkFDcEJDLHdCQUF3QkE7d0JBQ3hCbUIsU0FBU1I7O2dCQUdmO1lBQ0Y7WUFDQUYsT0FBTztRQUNUO0lBQ0Y7SUFFQSxPQUFPUDtBQUNUIn0=