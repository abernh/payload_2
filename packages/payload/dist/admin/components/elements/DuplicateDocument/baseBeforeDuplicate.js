"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "baseBeforeDuplicate", {
    enumerable: true,
    get: function() {
        return baseBeforeDuplicate;
    }
});
const _bsonobjectid = /*#__PURE__*/ _interop_require_default(require("bson-objectid"));
const _types = require("../../../../exports/types");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const baseBeforeDuplicate = (args)=>{
    const { collection: { fields }, data } = args;
    traverseFields(fields, data);
    return data;
};
function traverseFields(fields, data) {
    if (typeof data === 'undefined' || data === null) return;
    fields.forEach((field)=>{
        switch(field.type){
            case 'array':
                if (Array.isArray(data?.[field.name])) {
                    data[field.name].forEach((row)=>{
                        if (!row) return;
                        row.id = new _bsonobjectid.default().toHexString();
                        traverseFields(field.fields, row);
                    });
                }
                break;
            case 'blocks':
                {
                    if (Array.isArray(data?.[field.name])) {
                        data[field.name].forEach((row)=>{
                            if (!row) return;
                            const configBlock = field.blocks.find((block)=>block.slug === row.blockType);
                            if (!configBlock) return;
                            row.id = new _bsonobjectid.default().toHexString();
                            traverseFields(configBlock.fields, row);
                        });
                    }
                    break;
                }
            case 'row':
            case 'collapsible':
                traverseFields(field.fields, data);
                break;
            case 'tabs':
                field.tabs.forEach((tab)=>{
                    if (!(0, _types.tabHasName)(tab)) {
                        traverseFields(tab.fields, data);
                        return;
                    }
                    if (data && data[tab.name]) {
                        traverseFields(tab.fields, data[tab.name]);
                    }
                });
                break;
            case 'group':
                if (data && data[field.name]) {
                    traverseFields(field.fields, data[field.name]);
                }
                break;
            default:
                break;
        }
    });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL0R1cGxpY2F0ZURvY3VtZW50L2Jhc2VCZWZvcmVEdXBsaWNhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9iamVjdElEIGZyb20gJ2Jzb24tb2JqZWN0aWQnXG5cbmltcG9ydCB7IHR5cGUgQmVmb3JlRHVwbGljYXRlLCB0eXBlIEZpZWxkLCB0YWJIYXNOYW1lIH0gZnJvbSAnLi4vLi4vLi4vLi4vZXhwb3J0cy90eXBlcydcblxuLyoqXG4gKiBDcmVhdGVzIG5ldyBJRHMgZm9yIGJsb2NrcyAvIGFycmF5cyBpdGVtcyB0byBhdm9pZCBlcnJvcnMgd2l0aCByZWxhdGlvbmFsIGRhdGFiYXNlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IGJhc2VCZWZvcmVEdXBsaWNhdGUgPSAoYXJnczogUGFyYW1ldGVyczxCZWZvcmVEdXBsaWNhdGU+WzBdKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjb2xsZWN0aW9uOiB7IGZpZWxkcyB9LFxuICAgIGRhdGEsXG4gIH0gPSBhcmdzXG5cbiAgdHJhdmVyc2VGaWVsZHMoZmllbGRzLCBkYXRhKVxuXG4gIHJldHVybiBkYXRhXG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlRmllbGRzKGZpZWxkczogRmllbGRbXSwgZGF0YTogdW5rbm93bikge1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnIHx8IGRhdGEgPT09IG51bGwpIHJldHVyblxuXG4gIGZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhPy5bZmllbGQubmFtZV0pKSB7XG4gICAgICAgICAgZGF0YVtmaWVsZC5uYW1lXS5mb3JFYWNoKChyb3cpID0+IHtcbiAgICAgICAgICAgIGlmICghcm93KSByZXR1cm5cbiAgICAgICAgICAgIHJvdy5pZCA9IG5ldyBPYmplY3RJRCgpLnRvSGV4U3RyaW5nKClcbiAgICAgICAgICAgIHRyYXZlcnNlRmllbGRzKGZpZWxkLmZpZWxkcywgcm93KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2Jsb2Nrcyc6IHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YT8uW2ZpZWxkLm5hbWVdKSkge1xuICAgICAgICAgIGRhdGFbZmllbGQubmFtZV0uZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXJvdykgcmV0dXJuXG4gICAgICAgICAgICBjb25zdCBjb25maWdCbG9jayA9IGZpZWxkLmJsb2Nrcy5maW5kKChibG9jaykgPT4gYmxvY2suc2x1ZyA9PT0gcm93LmJsb2NrVHlwZSlcbiAgICAgICAgICAgIGlmICghY29uZmlnQmxvY2spIHJldHVyblxuICAgICAgICAgICAgcm93LmlkID0gbmV3IE9iamVjdElEKCkudG9IZXhTdHJpbmcoKVxuICAgICAgICAgICAgdHJhdmVyc2VGaWVsZHMoY29uZmlnQmxvY2suZmllbGRzLCByb3cpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSAncm93JzpcbiAgICAgIGNhc2UgJ2NvbGxhcHNpYmxlJzpcbiAgICAgICAgdHJhdmVyc2VGaWVsZHMoZmllbGQuZmllbGRzLCBkYXRhKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAndGFicyc6XG4gICAgICAgIGZpZWxkLnRhYnMuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICAgICAgaWYgKCF0YWJIYXNOYW1lKHRhYikpIHtcbiAgICAgICAgICAgIHRyYXZlcnNlRmllbGRzKHRhYi5maWVsZHMsIGRhdGEpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhW3RhYi5uYW1lXSkge1xuICAgICAgICAgICAgdHJhdmVyc2VGaWVsZHModGFiLmZpZWxkcywgZGF0YVt0YWIubmFtZV0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnZ3JvdXAnOlxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhW2ZpZWxkLm5hbWVdKSB7XG4gICAgICAgICAgdHJhdmVyc2VGaWVsZHMoZmllbGQuZmllbGRzLCBkYXRhW2ZpZWxkLm5hbWVdKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVha1xuICAgIH1cbiAgfSlcbn1cbiJdLCJuYW1lcyI6WyJiYXNlQmVmb3JlRHVwbGljYXRlIiwiYXJncyIsImNvbGxlY3Rpb24iLCJmaWVsZHMiLCJkYXRhIiwidHJhdmVyc2VGaWVsZHMiLCJmb3JFYWNoIiwiZmllbGQiLCJ0eXBlIiwiQXJyYXkiLCJpc0FycmF5IiwibmFtZSIsInJvdyIsImlkIiwiT2JqZWN0SUQiLCJ0b0hleFN0cmluZyIsImNvbmZpZ0Jsb2NrIiwiYmxvY2tzIiwiZmluZCIsImJsb2NrIiwic2x1ZyIsImJsb2NrVHlwZSIsInRhYnMiLCJ0YWIiLCJ0YWJIYXNOYW1lIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkFPYUE7OztlQUFBQTs7O3FFQVBRO3VCQUV3Qzs7Ozs7O0FBS3RELE1BQU1BLHNCQUFzQixDQUFDQztJQUNsQyxNQUFNLEVBQ0pDLFlBQVksRUFBRUMsTUFBTSxFQUFFLEVBQ3RCQyxJQUFJLEVBQ0wsR0FBR0g7SUFFSkksZUFBZUYsUUFBUUM7SUFFdkIsT0FBT0E7QUFDVDtBQUVBLFNBQVNDLGVBQWVGLE1BQWUsRUFBRUMsSUFBYTtJQUNwRCxJQUFJLE9BQU9BLFNBQVMsZUFBZUEsU0FBUyxNQUFNO0lBRWxERCxPQUFPRyxPQUFPLENBQUMsQ0FBQ0M7UUFDZCxPQUFRQSxNQUFNQyxJQUFJO1lBQ2hCLEtBQUs7Z0JBQ0gsSUFBSUMsTUFBTUMsT0FBTyxDQUFDTixNQUFNLENBQUNHLE1BQU1JLElBQUksQ0FBQyxHQUFHO29CQUNyQ1AsSUFBSSxDQUFDRyxNQUFNSSxJQUFJLENBQUMsQ0FBQ0wsT0FBTyxDQUFDLENBQUNNO3dCQUN4QixJQUFJLENBQUNBLEtBQUs7d0JBQ1ZBLElBQUlDLEVBQUUsR0FBRyxJQUFJQyxxQkFBUSxHQUFHQyxXQUFXO3dCQUNuQ1YsZUFBZUUsTUFBTUosTUFBTSxFQUFFUztvQkFDL0I7Z0JBQ0Y7Z0JBQ0E7WUFDRixLQUFLO2dCQUFVO29CQUNiLElBQUlILE1BQU1DLE9BQU8sQ0FBQ04sTUFBTSxDQUFDRyxNQUFNSSxJQUFJLENBQUMsR0FBRzt3QkFDckNQLElBQUksQ0FBQ0csTUFBTUksSUFBSSxDQUFDLENBQUNMLE9BQU8sQ0FBQyxDQUFDTTs0QkFDeEIsSUFBSSxDQUFDQSxLQUFLOzRCQUNWLE1BQU1JLGNBQWNULE1BQU1VLE1BQU0sQ0FBQ0MsSUFBSSxDQUFDLENBQUNDLFFBQVVBLE1BQU1DLElBQUksS0FBS1IsSUFBSVMsU0FBUzs0QkFDN0UsSUFBSSxDQUFDTCxhQUFhOzRCQUNsQkosSUFBSUMsRUFBRSxHQUFHLElBQUlDLHFCQUFRLEdBQUdDLFdBQVc7NEJBQ25DVixlQUFlVyxZQUFZYixNQUFNLEVBQUVTO3dCQUNyQztvQkFDRjtvQkFDQTtnQkFDRjtZQUNBLEtBQUs7WUFDTCxLQUFLO2dCQUNIUCxlQUFlRSxNQUFNSixNQUFNLEVBQUVDO2dCQUM3QjtZQUNGLEtBQUs7Z0JBQ0hHLE1BQU1lLElBQUksQ0FBQ2hCLE9BQU8sQ0FBQyxDQUFDaUI7b0JBQ2xCLElBQUksQ0FBQ0MsSUFBQUEsaUJBQVUsRUFBQ0QsTUFBTTt3QkFDcEJsQixlQUFla0IsSUFBSXBCLE1BQU0sRUFBRUM7d0JBQzNCO29CQUNGO29CQUVBLElBQUlBLFFBQVFBLElBQUksQ0FBQ21CLElBQUlaLElBQUksQ0FBQyxFQUFFO3dCQUMxQk4sZUFBZWtCLElBQUlwQixNQUFNLEVBQUVDLElBQUksQ0FBQ21CLElBQUlaLElBQUksQ0FBQztvQkFDM0M7Z0JBQ0Y7Z0JBQ0E7WUFDRixLQUFLO2dCQUNILElBQUlQLFFBQVFBLElBQUksQ0FBQ0csTUFBTUksSUFBSSxDQUFDLEVBQUU7b0JBQzVCTixlQUFlRSxNQUFNSixNQUFNLEVBQUVDLElBQUksQ0FBQ0csTUFBTUksSUFBSSxDQUFDO2dCQUMvQztnQkFDQTtZQUNGO2dCQUNFO1FBQ0o7SUFDRjtBQUNGIn0=