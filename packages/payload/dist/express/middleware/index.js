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
const _bodyparser = /*#__PURE__*/ _interop_require_default(require("body-parser"));
const _compression = /*#__PURE__*/ _interop_require_default(require("compression"));
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _expressfileupload = /*#__PURE__*/ _interop_require_default(require("express-fileupload"));
const _expressratelimit = /*#__PURE__*/ _interop_require_default(require("express-rate-limit"));
const _methodoverride = /*#__PURE__*/ _interop_require_default(require("method-override"));
const _passport = /*#__PURE__*/ _interop_require_default(require("passport"));
const _middleware = /*#__PURE__*/ _interop_require_default(require("../../localization/middleware"));
const _addParsedQuery = require("./addParsedQuery");
const _authenticate = /*#__PURE__*/ _interop_require_default(require("./authenticate"));
const _convertPayload = /*#__PURE__*/ _interop_require_default(require("./convertPayload"));
const _corsHeaders = /*#__PURE__*/ _interop_require_default(require("./corsHeaders"));
const _defaultPayload = /*#__PURE__*/ _interop_require_default(require("./defaultPayload"));
const _i18n = require("./i18n");
const _identifyAPI = /*#__PURE__*/ _interop_require_default(require("./identifyAPI"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const middleware = (payload)=>{
    const rateLimitOptions = {
        max: payload.config.rateLimit.max,
        windowMs: payload.config.rateLimit.window
    };
    if (typeof payload.config.rateLimit.skip === 'function') rateLimitOptions.skip = payload.config.rateLimit.skip;
    if (payload.config.express.middleware?.length) {
        payload.logger.warn('express.middleware is deprecated. Please migrate to express.postMiddleware.');
    }
    return [
        _defaultPayload.default,
        ...payload.config.express.preMiddleware || [],
        (0, _expressratelimit.default)(rateLimitOptions),
        _passport.default.initialize(),
        (0, _i18n.i18nMiddleware)(payload.config.i18n),
        (0, _identifyAPI.default)('REST'),
        (0, _methodoverride.default)('X-HTTP-Method-Override'),
        (0, _addParsedQuery.addParsedQuery)({
            arrayLimit: 1000,
            depth: 10,
            strictNullHandling: true
        }),
        _bodyparser.default.urlencoded({
            extended: true
        }),
        (0, _compression.default)(payload.config.express.compression),
        _middleware.default,
        _express.default.json(payload.config.express.json),
        (0, _expressfileupload.default)({
            parseNested: true,
            ...payload.config.upload
        }),
        _convertPayload.default,
        (0, _authenticate.default)(payload.config),
        (0, _corsHeaders.default)(payload.config),
        ...payload.config.express.middleware || [],
        ...payload.config.express.postMiddleware || []
    ];
};
const _default = middleware;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leHByZXNzL21pZGRsZXdhcmUvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInXG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nXG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGZpbGVVcGxvYWQgZnJvbSAnZXhwcmVzcy1maWxldXBsb2FkJ1xuaW1wb3J0IHJhdGVMaW1pdCBmcm9tICdleHByZXNzLXJhdGUtbGltaXQnXG5pbXBvcnQgbWV0aG9kT3ZlcnJpZGUgZnJvbSAnbWV0aG9kLW92ZXJyaWRlJ1xuaW1wb3J0IHBhc3Nwb3J0IGZyb20gJ3Bhc3Nwb3J0J1xuXG5pbXBvcnQgdHlwZSB7IFBheWxvYWQgfSBmcm9tICcuLi8uLi9wYXlsb2FkJ1xuaW1wb3J0IHR5cGUgeyBQYXlsb2FkUmVxdWVzdCB9IGZyb20gJy4uL3R5cGVzJ1xuXG5pbXBvcnQgbG9jYWxpemF0aW9uTWlkZGxld2FyZSBmcm9tICcuLi8uLi9sb2NhbGl6YXRpb24vbWlkZGxld2FyZSdcbmltcG9ydCB7IGFkZFBhcnNlZFF1ZXJ5IH0gZnJvbSAnLi9hZGRQYXJzZWRRdWVyeSdcbmltcG9ydCBhdXRoZW50aWNhdGUgZnJvbSAnLi9hdXRoZW50aWNhdGUnXG5pbXBvcnQgY29udmVydFBheWxvYWQgZnJvbSAnLi9jb252ZXJ0UGF5bG9hZCdcbmltcG9ydCBjb3JzSGVhZGVycyBmcm9tICcuL2NvcnNIZWFkZXJzJ1xuaW1wb3J0IGRlZmF1bHRQYXlsb2FkIGZyb20gJy4vZGVmYXVsdFBheWxvYWQnXG5pbXBvcnQgeyBpMThuTWlkZGxld2FyZSB9IGZyb20gJy4vaTE4bidcbmltcG9ydCBpZGVudGlmeUFQSSBmcm9tICcuL2lkZW50aWZ5QVBJJ1xuXG5jb25zdCBtaWRkbGV3YXJlID0gKHBheWxvYWQ6IFBheWxvYWQpOiBhbnkgPT4ge1xuICBjb25zdCByYXRlTGltaXRPcHRpb25zOiB7XG4gICAgbWF4PzogbnVtYmVyXG4gICAgc2tpcD86IChyZXE6IFBheWxvYWRSZXF1ZXN0KSA9PiBib29sZWFuXG4gICAgd2luZG93TXM/OiBudW1iZXJcbiAgfSA9IHtcbiAgICBtYXg6IHBheWxvYWQuY29uZmlnLnJhdGVMaW1pdC5tYXgsXG4gICAgd2luZG93TXM6IHBheWxvYWQuY29uZmlnLnJhdGVMaW1pdC53aW5kb3csXG4gIH1cblxuICBpZiAodHlwZW9mIHBheWxvYWQuY29uZmlnLnJhdGVMaW1pdC5za2lwID09PSAnZnVuY3Rpb24nKVxuICAgIHJhdGVMaW1pdE9wdGlvbnMuc2tpcCA9IHBheWxvYWQuY29uZmlnLnJhdGVMaW1pdC5za2lwXG5cbiAgaWYgKHBheWxvYWQuY29uZmlnLmV4cHJlc3MubWlkZGxld2FyZT8ubGVuZ3RoKSB7XG4gICAgcGF5bG9hZC5sb2dnZXIud2FybihcbiAgICAgICdleHByZXNzLm1pZGRsZXdhcmUgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIG1pZ3JhdGUgdG8gZXhwcmVzcy5wb3N0TWlkZGxld2FyZS4nLFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBbXG4gICAgZGVmYXVsdFBheWxvYWQsXG4gICAgLi4uKHBheWxvYWQuY29uZmlnLmV4cHJlc3MucHJlTWlkZGxld2FyZSB8fCBbXSksXG4gICAgcmF0ZUxpbWl0KHJhdGVMaW1pdE9wdGlvbnMpLFxuICAgIHBhc3Nwb3J0LmluaXRpYWxpemUoKSxcbiAgICBpMThuTWlkZGxld2FyZShwYXlsb2FkLmNvbmZpZy5pMThuKSxcbiAgICBpZGVudGlmeUFQSSgnUkVTVCcpLFxuICAgIG1ldGhvZE92ZXJyaWRlKCdYLUhUVFAtTWV0aG9kLU92ZXJyaWRlJyksXG4gICAgYWRkUGFyc2VkUXVlcnkoeyBhcnJheUxpbWl0OiAxMDAwLCBkZXB0aDogMTAsIHN0cmljdE51bGxIYW5kbGluZzogdHJ1ZSB9KSxcbiAgICBib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSxcbiAgICBjb21wcmVzc2lvbihwYXlsb2FkLmNvbmZpZy5leHByZXNzLmNvbXByZXNzaW9uKSxcbiAgICBsb2NhbGl6YXRpb25NaWRkbGV3YXJlLFxuICAgIGV4cHJlc3MuanNvbihwYXlsb2FkLmNvbmZpZy5leHByZXNzLmpzb24pLFxuICAgIGZpbGVVcGxvYWQoe1xuICAgICAgcGFyc2VOZXN0ZWQ6IHRydWUsXG4gICAgICAuLi5wYXlsb2FkLmNvbmZpZy51cGxvYWQsXG4gICAgfSksXG4gICAgY29udmVydFBheWxvYWQsXG4gICAgYXV0aGVudGljYXRlKHBheWxvYWQuY29uZmlnKSxcbiAgICBjb3JzSGVhZGVycyhwYXlsb2FkLmNvbmZpZyksXG4gICAgLi4uKHBheWxvYWQuY29uZmlnLmV4cHJlc3MubWlkZGxld2FyZSB8fCBbXSksXG4gICAgLi4uKHBheWxvYWQuY29uZmlnLmV4cHJlc3MucG9zdE1pZGRsZXdhcmUgfHwgW10pLFxuICBdXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1pZGRsZXdhcmVcbiJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwicGF5bG9hZCIsInJhdGVMaW1pdE9wdGlvbnMiLCJtYXgiLCJjb25maWciLCJyYXRlTGltaXQiLCJ3aW5kb3dNcyIsIndpbmRvdyIsInNraXAiLCJleHByZXNzIiwibGVuZ3RoIiwibG9nZ2VyIiwid2FybiIsImRlZmF1bHRQYXlsb2FkIiwicHJlTWlkZGxld2FyZSIsInBhc3Nwb3J0IiwiaW5pdGlhbGl6ZSIsImkxOG5NaWRkbGV3YXJlIiwiaTE4biIsImlkZW50aWZ5QVBJIiwibWV0aG9kT3ZlcnJpZGUiLCJhZGRQYXJzZWRRdWVyeSIsImFycmF5TGltaXQiLCJkZXB0aCIsInN0cmljdE51bGxIYW5kbGluZyIsImJvZHlQYXJzZXIiLCJ1cmxlbmNvZGVkIiwiZXh0ZW5kZWQiLCJjb21wcmVzc2lvbiIsImxvY2FsaXphdGlvbk1pZGRsZXdhcmUiLCJqc29uIiwiZmlsZVVwbG9hZCIsInBhcnNlTmVzdGVkIiwidXBsb2FkIiwiY29udmVydFBheWxvYWQiLCJhdXRoZW50aWNhdGUiLCJjb3JzSGVhZGVycyIsInBvc3RNaWRkbGV3YXJlIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkFnRUE7OztlQUFBOzs7bUVBaEV1QjtvRUFDQztnRUFDSjswRUFDRzt5RUFDRDt1RUFDSztpRUFDTjttRUFLYztnQ0FDSjtxRUFDTjt1RUFDRTtvRUFDSDt1RUFDRztzQkFDSTtvRUFDUDs7Ozs7O0FBRXhCLE1BQU1BLGFBQWEsQ0FBQ0M7SUFDbEIsTUFBTUMsbUJBSUY7UUFDRkMsS0FBS0YsUUFBUUcsTUFBTSxDQUFDQyxTQUFTLENBQUNGLEdBQUc7UUFDakNHLFVBQVVMLFFBQVFHLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDRSxNQUFNO0lBQzNDO0lBRUEsSUFBSSxPQUFPTixRQUFRRyxNQUFNLENBQUNDLFNBQVMsQ0FBQ0csSUFBSSxLQUFLLFlBQzNDTixpQkFBaUJNLElBQUksR0FBR1AsUUFBUUcsTUFBTSxDQUFDQyxTQUFTLENBQUNHLElBQUk7SUFFdkQsSUFBSVAsUUFBUUcsTUFBTSxDQUFDSyxPQUFPLENBQUNULFVBQVUsRUFBRVUsUUFBUTtRQUM3Q1QsUUFBUVUsTUFBTSxDQUFDQyxJQUFJLENBQ2pCO0lBRUo7SUFFQSxPQUFPO1FBQ0xDLHVCQUFjO1dBQ1ZaLFFBQVFHLE1BQU0sQ0FBQ0ssT0FBTyxDQUFDSyxhQUFhLElBQUksRUFBRTtRQUM5Q1QsSUFBQUEseUJBQVMsRUFBQ0g7UUFDVmEsaUJBQVEsQ0FBQ0MsVUFBVTtRQUNuQkMsSUFBQUEsb0JBQWMsRUFBQ2hCLFFBQVFHLE1BQU0sQ0FBQ2MsSUFBSTtRQUNsQ0MsSUFBQUEsb0JBQVcsRUFBQztRQUNaQyxJQUFBQSx1QkFBYyxFQUFDO1FBQ2ZDLElBQUFBLDhCQUFjLEVBQUM7WUFBRUMsWUFBWTtZQUFNQyxPQUFPO1lBQUlDLG9CQUFvQjtRQUFLO1FBQ3ZFQyxtQkFBVSxDQUFDQyxVQUFVLENBQUM7WUFBRUMsVUFBVTtRQUFLO1FBQ3ZDQyxJQUFBQSxvQkFBVyxFQUFDM0IsUUFBUUcsTUFBTSxDQUFDSyxPQUFPLENBQUNtQixXQUFXO1FBQzlDQyxtQkFBc0I7UUFDdEJwQixnQkFBTyxDQUFDcUIsSUFBSSxDQUFDN0IsUUFBUUcsTUFBTSxDQUFDSyxPQUFPLENBQUNxQixJQUFJO1FBQ3hDQyxJQUFBQSwwQkFBVSxFQUFDO1lBQ1RDLGFBQWE7WUFDYixHQUFHL0IsUUFBUUcsTUFBTSxDQUFDNkIsTUFBTTtRQUMxQjtRQUNBQyx1QkFBYztRQUNkQyxJQUFBQSxxQkFBWSxFQUFDbEMsUUFBUUcsTUFBTTtRQUMzQmdDLElBQUFBLG9CQUFXLEVBQUNuQyxRQUFRRyxNQUFNO1dBQ3RCSCxRQUFRRyxNQUFNLENBQUNLLE9BQU8sQ0FBQ1QsVUFBVSxJQUFJLEVBQUU7V0FDdkNDLFFBQVFHLE1BQU0sQ0FBQ0ssT0FBTyxDQUFDNEIsY0FBYyxJQUFJLEVBQUU7S0FDaEQ7QUFDSDtNQUVBLFdBQWVyQyJ9