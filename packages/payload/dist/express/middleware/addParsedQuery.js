"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addParsedQuery", {
    enumerable: true,
    get: function() {
        return addParsedQuery;
    }
});
const _qs = require("qs");
const _url = require("url");
function addParsedQuery(options) {
    return (req, res, next)=>{
        const url = (0, _url.parse)(req.url);
        req.query = (0, _qs.parse)(url.query, options);
        next();
    };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leHByZXNzL21pZGRsZXdhcmUvYWRkUGFyc2VkUXVlcnkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSZXF1ZXN0SGFuZGxlciB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgdHlwZSB7IElQYXJzZU9wdGlvbnMgfSBmcm9tICdxcydcblxuaW1wb3J0IHsgcGFyc2UgYXMgcGFyc2VRdWVyeVN0cmluZyB9IGZyb20gJ3FzJ1xuaW1wb3J0IHsgcGFyc2UgYXMgcGFyc2VVcmwgfSBmcm9tICd1cmwnXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVkdW5kYW50LXR5cGUtY29uc3RpdHVlbnRzXG50eXBlIFF1ZXJ5U3RyaW5nT3B0aW9ucyA9IElQYXJzZU9wdGlvbnMgJiB7IGRlY29kZXI/OiBuZXZlciB8IHVuZGVmaW5lZCB9XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRQYXJzZWRRdWVyeShvcHRpb25zPzogUXVlcnlTdHJpbmdPcHRpb25zKTogUmVxdWVzdEhhbmRsZXIge1xuICByZXR1cm4gKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgY29uc3QgdXJsID0gcGFyc2VVcmwocmVxLnVybClcbiAgICByZXEucXVlcnkgPSBwYXJzZVF1ZXJ5U3RyaW5nKHVybC5xdWVyeSwgb3B0aW9ucylcbiAgICBuZXh0KClcbiAgfVxufVxuIl0sIm5hbWVzIjpbImFkZFBhcnNlZFF1ZXJ5Iiwib3B0aW9ucyIsInJlcSIsInJlcyIsIm5leHQiLCJ1cmwiLCJwYXJzZVVybCIsInF1ZXJ5IiwicGFyc2VRdWVyeVN0cmluZyJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7K0JBU2dCQTs7O2VBQUFBOzs7b0JBTjBCO3FCQUNSO0FBSzNCLFNBQVNBLGVBQWVDLE9BQTRCO0lBQ3pELE9BQU8sQ0FBQ0MsS0FBS0MsS0FBS0M7UUFDaEIsTUFBTUMsTUFBTUMsSUFBQUEsVUFBUSxFQUFDSixJQUFJRyxHQUFHO1FBQzVCSCxJQUFJSyxLQUFLLEdBQUdDLElBQUFBLFNBQWdCLEVBQUNILElBQUlFLEtBQUssRUFBRU47UUFDeENHO0lBQ0Y7QUFDRiJ9