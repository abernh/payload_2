"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    endpointsSchema: function() {
        return endpointsSchema;
    }
});
const _joi = /*#__PURE__*/ _interop_require_default(require("joi"));
const _adminViewSchema = require("./shared/adminViewSchema");
const _componentSchema = require("./shared/componentSchema");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const component = _joi.default.alternatives().try(_joi.default.object().unknown(), _joi.default.func());
const endpointsSchema = _joi.default.alternatives().try(_joi.default.array().items(_joi.default.object({
    custom: _joi.default.object().pattern(_joi.default.string(), _joi.default.any()),
    handler: _joi.default.alternatives().try(_joi.default.array().items(_joi.default.func()), _joi.default.func()),
    method: _joi.default.string().valid('get', 'head', 'post', 'put', 'patch', 'delete', 'connect', 'options'),
    path: _joi.default.string(),
    root: _joi.default.bool()
})), _joi.default.boolean());
const _default = _joi.default.object({
    admin: _joi.default.object({
        autoLogin: _joi.default.alternatives().try(_joi.default.object().keys({
            email: _joi.default.string(),
            password: _joi.default.string(),
            prefillOnly: _joi.default.boolean()
        }), _joi.default.boolean()),
        avatar: _joi.default.alternatives().try(_joi.default.string(), component),
        buildPath: _joi.default.string(),
        bundler: {
            build: _joi.default.func(),
            dev: _joi.default.func(),
            serve: _joi.default.func()
        },
        components: _joi.default.object().keys({
            Nav: component,
            actions: _joi.default.array().items(component),
            afterDashboard: _joi.default.array().items(component),
            afterLogin: _joi.default.array().items(component),
            afterNavLinks: _joi.default.array().items(component),
            beforeDashboard: _joi.default.array().items(component),
            beforeLogin: _joi.default.array().items(component),
            beforeNavLinks: _joi.default.array().items(component),
            graphics: _joi.default.object({
                Icon: component,
                Logo: component
            }),
            logout: _joi.default.object({
                Button: component
            }),
            providers: _joi.default.array().items(component),
            views: _joi.default.alternatives().try(_joi.default.object({
                Account: _joi.default.alternatives().try(component, _adminViewSchema.adminViewSchema),
                Dashboard: _joi.default.alternatives().try(component, _adminViewSchema.adminViewSchema)
            }), _joi.default.object().pattern(_joi.default.string(), component))
        }),
        css: _joi.default.string(),
        dateFormat: _joi.default.string(),
        disable: _joi.default.bool(),
        inactivityRoute: _joi.default.string(),
        indexHTML: _joi.default.string(),
        livePreview: _joi.default.object({
            ..._componentSchema.livePreviewSchema,
            collections: _joi.default.array().items(_joi.default.string()),
            globals: _joi.default.array().items(_joi.default.string())
        }),
        logoutRoute: _joi.default.string(),
        meta: _joi.default.object().keys({
            favicon: _joi.default.string(),
            ogImage: _joi.default.string(),
            titleSuffix: _joi.default.string()
        }),
        user: _joi.default.string(),
        vite: _joi.default.func(),
        webpack: _joi.default.func()
    }),
    collections: _joi.default.array(),
    cookiePrefix: _joi.default.string(),
    cors: [
        _joi.default.string().valid('*'),
        _joi.default.array().items(_joi.default.string())
    ],
    csrf: _joi.default.array().items(_joi.default.string().allow('')).sparse(),
    custom: _joi.default.object().pattern(_joi.default.string(), _joi.default.any()),
    db: _joi.default.any(),
    debug: _joi.default.boolean(),
    defaultDepth: _joi.default.number().min(0).max(30),
    defaultMaxTextLength: _joi.default.number(),
    editor: _joi.default.object().required().keys({
        CellComponent: _componentSchema.componentSchema.optional(),
        FieldComponent: _componentSchema.componentSchema.optional(),
        LazyCellComponent: _joi.default.func().optional(),
        LazyFieldComponent: _joi.default.func().optional(),
        afterReadPromise: _joi.default.func().optional(),
        outputSchema: _joi.default.func().optional(),
        populationPromise: _joi.default.func().optional(),
        validate: _joi.default.func().required()
    }).unknown(),
    email: _joi.default.object(),
    endpoints: endpointsSchema,
    express: _joi.default.object().keys({
        compression: _joi.default.object(),
        json: _joi.default.object(),
        middleware: _joi.default.array().items(_joi.default.func()),
        postMiddleware: _joi.default.array().items(_joi.default.func()),
        preMiddleware: _joi.default.array().items(_joi.default.func())
    }),
    globals: _joi.default.array(),
    graphQL: _joi.default.object().keys({
        disable: _joi.default.boolean(),
        disablePlaygroundInProduction: _joi.default.boolean(),
        maxComplexity: _joi.default.number(),
        mutations: _joi.default.function(),
        queries: _joi.default.function(),
        schemaOutputFile: _joi.default.string()
    }),
    hooks: _joi.default.object().keys({
        afterError: _joi.default.func()
    }),
    i18n: _joi.default.object(),
    indexSortableFields: _joi.default.boolean(),
    joiValidation: _joi.default.boolean(),
    local: _joi.default.boolean(),
    localization: _joi.default.alternatives().try(_joi.default.object().keys({
        defaultLocale: _joi.default.string(),
        fallback: _joi.default.boolean(),
        localeCodes: _joi.default.array().items(_joi.default.string()),
        locales: _joi.default.alternatives().try(_joi.default.array().items(_joi.default.object().keys({
            code: _joi.default.string(),
            fallbackLocale: _joi.default.string(),
            label: _joi.default.alternatives().try(_joi.default.object().pattern(_joi.default.string(), [
                _joi.default.string()
            ]), _joi.default.string(), _joi.default.valid(false)),
            rtl: _joi.default.boolean(),
            toString: _joi.default.func()
        })), _joi.default.array().items(_joi.default.string()))
    }), _joi.default.boolean()),
    maxDepth: _joi.default.number().min(0).max(100),
    onInit: _joi.default.func(),
    plugins: _joi.default.array().items(_joi.default.func()),
    rateLimit: _joi.default.object().keys({
        max: _joi.default.number(),
        skip: _joi.default.func(),
        trustProxy: _joi.default.boolean(),
        window: _joi.default.number()
    }),
    routes: _joi.default.object({
        admin: _joi.default.string(),
        api: _joi.default.string(),
        graphQL: _joi.default.string(),
        graphQLPlayground: _joi.default.string()
    }),
    serverURL: _joi.default.string().uri().allow('').custom((value, helper)=>{
        const urlWithoutProtocol = value.split('//')[1];
        if (!urlWithoutProtocol) {
            return helper.message({
                custom: 'You need to include either "https://" or "http://" in your serverURL.'
            });
        }
        if (urlWithoutProtocol.indexOf('/') > -1) {
            return helper.message({
                custom: 'Your serverURL cannot have a path. It can only contain a protocol, a domain, and an optional port.'
            });
        }
        return value;
    }),
    telemetry: _joi.default.boolean(),
    typescript: _joi.default.object({
        declare: _joi.default.boolean(),
        outputFile: _joi.default.string()
    }),
    upload: _joi.default.object()
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25maWcvc2NoZW1hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqb2kgZnJvbSAnam9pJ1xuXG5pbXBvcnQgeyBhZG1pblZpZXdTY2hlbWEgfSBmcm9tICcuL3NoYXJlZC9hZG1pblZpZXdTY2hlbWEnXG5pbXBvcnQgeyBjb21wb25lbnRTY2hlbWEsIGxpdmVQcmV2aWV3U2NoZW1hIH0gZnJvbSAnLi9zaGFyZWQvY29tcG9uZW50U2NoZW1hJ1xuXG5jb25zdCBjb21wb25lbnQgPSBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5vYmplY3QoKS51bmtub3duKCksIGpvaS5mdW5jKCkpXG5cbmV4cG9ydCBjb25zdCBlbmRwb2ludHNTY2hlbWEgPSBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KFxuICBqb2kuYXJyYXkoKS5pdGVtcyhcbiAgICBqb2kub2JqZWN0KHtcbiAgICAgIGN1c3RvbTogam9pLm9iamVjdCgpLnBhdHRlcm4oam9pLnN0cmluZygpLCBqb2kuYW55KCkpLFxuICAgICAgaGFuZGxlcjogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kuYXJyYXkoKS5pdGVtcyhqb2kuZnVuYygpKSwgam9pLmZ1bmMoKSksXG4gICAgICBtZXRob2Q6IGpvaVxuICAgICAgICAuc3RyaW5nKClcbiAgICAgICAgLnZhbGlkKCdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnY29ubmVjdCcsICdvcHRpb25zJyksXG4gICAgICBwYXRoOiBqb2kuc3RyaW5nKCksXG4gICAgICByb290OiBqb2kuYm9vbCgpLFxuICAgIH0pLFxuICApLFxuICBqb2kuYm9vbGVhbigpLFxuKVxuXG5leHBvcnQgZGVmYXVsdCBqb2kub2JqZWN0KHtcbiAgYWRtaW46IGpvaS5vYmplY3Qoe1xuICAgIGF1dG9Mb2dpbjogam9pLmFsdGVybmF0aXZlcygpLnRyeShcbiAgICAgIGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgICAgICAgZW1haWw6IGpvaS5zdHJpbmcoKSxcbiAgICAgICAgcGFzc3dvcmQ6IGpvaS5zdHJpbmcoKSxcbiAgICAgICAgcHJlZmlsbE9ubHk6IGpvaS5ib29sZWFuKCksXG4gICAgICB9KSxcbiAgICAgIGpvaS5ib29sZWFuKCksXG4gICAgKSxcbiAgICBhdmF0YXI6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBjb21wb25lbnQpLFxuICAgIGJ1aWxkUGF0aDogam9pLnN0cmluZygpLFxuICAgIGJ1bmRsZXI6IHtcbiAgICAgIGJ1aWxkOiBqb2kuZnVuYygpLFxuICAgICAgZGV2OiBqb2kuZnVuYygpLFxuICAgICAgc2VydmU6IGpvaS5mdW5jKCksXG4gICAgfSxcbiAgICBjb21wb25lbnRzOiBqb2kub2JqZWN0KCkua2V5cyh7XG4gICAgICBOYXY6IGNvbXBvbmVudCxcbiAgICAgIGFjdGlvbnM6IGpvaS5hcnJheSgpLml0ZW1zKGNvbXBvbmVudCksXG4gICAgICBhZnRlckRhc2hib2FyZDogam9pLmFycmF5KCkuaXRlbXMoY29tcG9uZW50KSxcbiAgICAgIGFmdGVyTG9naW46IGpvaS5hcnJheSgpLml0ZW1zKGNvbXBvbmVudCksXG4gICAgICBhZnRlck5hdkxpbmtzOiBqb2kuYXJyYXkoKS5pdGVtcyhjb21wb25lbnQpLFxuICAgICAgYmVmb3JlRGFzaGJvYXJkOiBqb2kuYXJyYXkoKS5pdGVtcyhjb21wb25lbnQpLFxuICAgICAgYmVmb3JlTG9naW46IGpvaS5hcnJheSgpLml0ZW1zKGNvbXBvbmVudCksXG4gICAgICBiZWZvcmVOYXZMaW5rczogam9pLmFycmF5KCkuaXRlbXMoY29tcG9uZW50KSxcbiAgICAgIGdyYXBoaWNzOiBqb2kub2JqZWN0KHtcbiAgICAgICAgSWNvbjogY29tcG9uZW50LFxuICAgICAgICBMb2dvOiBjb21wb25lbnQsXG4gICAgICB9KSxcbiAgICAgIGxvZ291dDogam9pLm9iamVjdCh7XG4gICAgICAgIEJ1dHRvbjogY29tcG9uZW50LFxuICAgICAgfSksXG4gICAgICBwcm92aWRlcnM6IGpvaS5hcnJheSgpLml0ZW1zKGNvbXBvbmVudCksXG4gICAgICB2aWV3czogam9pLmFsdGVybmF0aXZlcygpLnRyeShcbiAgICAgICAgam9pLm9iamVjdCh7XG4gICAgICAgICAgQWNjb3VudDogam9pLmFsdGVybmF0aXZlcygpLnRyeShjb21wb25lbnQsIGFkbWluVmlld1NjaGVtYSksXG4gICAgICAgICAgRGFzaGJvYXJkOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGNvbXBvbmVudCwgYWRtaW5WaWV3U2NoZW1hKSxcbiAgICAgICAgfSksXG4gICAgICAgIGpvaS5vYmplY3QoKS5wYXR0ZXJuKGpvaS5zdHJpbmcoKSwgY29tcG9uZW50KSxcbiAgICAgICksXG4gICAgfSksXG4gICAgY3NzOiBqb2kuc3RyaW5nKCksXG4gICAgZGF0ZUZvcm1hdDogam9pLnN0cmluZygpLFxuICAgIGRpc2FibGU6IGpvaS5ib29sKCksXG4gICAgaW5hY3Rpdml0eVJvdXRlOiBqb2kuc3RyaW5nKCksXG4gICAgaW5kZXhIVE1MOiBqb2kuc3RyaW5nKCksXG4gICAgbGl2ZVByZXZpZXc6IGpvaS5vYmplY3Qoe1xuICAgICAgLi4ubGl2ZVByZXZpZXdTY2hlbWEsXG4gICAgICBjb2xsZWN0aW9uczogam9pLmFycmF5KCkuaXRlbXMoam9pLnN0cmluZygpKSxcbiAgICAgIGdsb2JhbHM6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5zdHJpbmcoKSksXG4gICAgfSksXG4gICAgbG9nb3V0Um91dGU6IGpvaS5zdHJpbmcoKSxcbiAgICBtZXRhOiBqb2kub2JqZWN0KCkua2V5cyh7XG4gICAgICBmYXZpY29uOiBqb2kuc3RyaW5nKCksXG4gICAgICBvZ0ltYWdlOiBqb2kuc3RyaW5nKCksXG4gICAgICB0aXRsZVN1ZmZpeDogam9pLnN0cmluZygpLFxuICAgIH0pLFxuICAgIHVzZXI6IGpvaS5zdHJpbmcoKSxcbiAgICB2aXRlOiBqb2kuZnVuYygpLFxuICAgIHdlYnBhY2s6IGpvaS5mdW5jKCksXG4gIH0pLFxuICBjb2xsZWN0aW9uczogam9pLmFycmF5KCksXG4gIGNvb2tpZVByZWZpeDogam9pLnN0cmluZygpLFxuICBjb3JzOiBbam9pLnN0cmluZygpLnZhbGlkKCcqJyksIGpvaS5hcnJheSgpLml0ZW1zKGpvaS5zdHJpbmcoKSldLFxuICBjc3JmOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuc3RyaW5nKCkuYWxsb3coJycpKS5zcGFyc2UoKSxcbiAgY3VzdG9tOiBqb2kub2JqZWN0KCkucGF0dGVybihqb2kuc3RyaW5nKCksIGpvaS5hbnkoKSksXG4gIGRiOiBqb2kuYW55KCksXG4gIGRlYnVnOiBqb2kuYm9vbGVhbigpLFxuICBkZWZhdWx0RGVwdGg6IGpvaS5udW1iZXIoKS5taW4oMCkubWF4KDMwKSxcbiAgZGVmYXVsdE1heFRleHRMZW5ndGg6IGpvaS5udW1iZXIoKSxcbiAgZWRpdG9yOiBqb2lcbiAgICAub2JqZWN0KClcbiAgICAucmVxdWlyZWQoKVxuICAgIC5rZXlzKHtcbiAgICAgIENlbGxDb21wb25lbnQ6IGNvbXBvbmVudFNjaGVtYS5vcHRpb25hbCgpLFxuICAgICAgRmllbGRDb21wb25lbnQ6IGNvbXBvbmVudFNjaGVtYS5vcHRpb25hbCgpLFxuICAgICAgTGF6eUNlbGxDb21wb25lbnQ6IGpvaS5mdW5jKCkub3B0aW9uYWwoKSxcbiAgICAgIExhenlGaWVsZENvbXBvbmVudDogam9pLmZ1bmMoKS5vcHRpb25hbCgpLFxuICAgICAgYWZ0ZXJSZWFkUHJvbWlzZTogam9pLmZ1bmMoKS5vcHRpb25hbCgpLFxuICAgICAgb3V0cHV0U2NoZW1hOiBqb2kuZnVuYygpLm9wdGlvbmFsKCksXG4gICAgICBwb3B1bGF0aW9uUHJvbWlzZTogam9pLmZ1bmMoKS5vcHRpb25hbCgpLFxuICAgICAgdmFsaWRhdGU6IGpvaS5mdW5jKCkucmVxdWlyZWQoKSxcbiAgICB9KVxuICAgIC51bmtub3duKCksXG4gIGVtYWlsOiBqb2kub2JqZWN0KCksXG4gIGVuZHBvaW50czogZW5kcG9pbnRzU2NoZW1hLFxuICBleHByZXNzOiBqb2kub2JqZWN0KCkua2V5cyh7XG4gICAgY29tcHJlc3Npb246IGpvaS5vYmplY3QoKSxcbiAgICBqc29uOiBqb2kub2JqZWN0KCksXG4gICAgbWlkZGxld2FyZTogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gICAgcG9zdE1pZGRsZXdhcmU6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5mdW5jKCkpLFxuICAgIHByZU1pZGRsZXdhcmU6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5mdW5jKCkpLFxuICB9KSxcbiAgZ2xvYmFsczogam9pLmFycmF5KCksXG4gIGdyYXBoUUw6IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgICBkaXNhYmxlOiBqb2kuYm9vbGVhbigpLFxuICAgIGRpc2FibGVQbGF5Z3JvdW5kSW5Qcm9kdWN0aW9uOiBqb2kuYm9vbGVhbigpLFxuICAgIG1heENvbXBsZXhpdHk6IGpvaS5udW1iZXIoKSxcbiAgICBtdXRhdGlvbnM6IGpvaS5mdW5jdGlvbigpLFxuICAgIHF1ZXJpZXM6IGpvaS5mdW5jdGlvbigpLFxuICAgIHNjaGVtYU91dHB1dEZpbGU6IGpvaS5zdHJpbmcoKSxcbiAgfSksXG4gIGhvb2tzOiBqb2kub2JqZWN0KCkua2V5cyh7XG4gICAgYWZ0ZXJFcnJvcjogam9pLmZ1bmMoKSxcbiAgfSksXG4gIGkxOG46IGpvaS5vYmplY3QoKSxcbiAgaW5kZXhTb3J0YWJsZUZpZWxkczogam9pLmJvb2xlYW4oKSxcbiAgam9pVmFsaWRhdGlvbjogam9pLmJvb2xlYW4oKSxcbiAgbG9jYWw6IGpvaS5ib29sZWFuKCksXG4gIGxvY2FsaXphdGlvbjogam9pLmFsdGVybmF0aXZlcygpLnRyeShcbiAgICBqb2kub2JqZWN0KCkua2V5cyh7XG4gICAgICBkZWZhdWx0TG9jYWxlOiBqb2kuc3RyaW5nKCksXG4gICAgICBmYWxsYmFjazogam9pLmJvb2xlYW4oKSxcbiAgICAgIGxvY2FsZUNvZGVzOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuc3RyaW5nKCkpLFxuICAgICAgbG9jYWxlczogam9pLmFsdGVybmF0aXZlcygpLnRyeShcbiAgICAgICAgam9pLmFycmF5KCkuaXRlbXMoXG4gICAgICAgICAgam9pLm9iamVjdCgpLmtleXMoe1xuICAgICAgICAgICAgY29kZTogam9pLnN0cmluZygpLFxuICAgICAgICAgICAgZmFsbGJhY2tMb2NhbGU6IGpvaS5zdHJpbmcoKSxcbiAgICAgICAgICAgIGxhYmVsOiBqb2lcbiAgICAgICAgICAgICAgLmFsdGVybmF0aXZlcygpXG4gICAgICAgICAgICAgIC50cnkoXG4gICAgICAgICAgICAgICAgam9pLm9iamVjdCgpLnBhdHRlcm4oam9pLnN0cmluZygpLCBbam9pLnN0cmluZygpXSksXG4gICAgICAgICAgICAgICAgam9pLnN0cmluZygpLFxuICAgICAgICAgICAgICAgIGpvaS52YWxpZChmYWxzZSksXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICBydGw6IGpvaS5ib29sZWFuKCksXG4gICAgICAgICAgICB0b1N0cmluZzogam9pLmZ1bmMoKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgICAgam9pLmFycmF5KCkuaXRlbXMoam9pLnN0cmluZygpKSxcbiAgICAgICksXG4gICAgfSksXG4gICAgam9pLmJvb2xlYW4oKSxcbiAgKSxcbiAgbWF4RGVwdGg6IGpvaS5udW1iZXIoKS5taW4oMCkubWF4KDEwMCksXG4gIG9uSW5pdDogam9pLmZ1bmMoKSxcbiAgcGx1Z2luczogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gIHJhdGVMaW1pdDogam9pLm9iamVjdCgpLmtleXMoe1xuICAgIG1heDogam9pLm51bWJlcigpLFxuICAgIHNraXA6IGpvaS5mdW5jKCksXG4gICAgdHJ1c3RQcm94eTogam9pLmJvb2xlYW4oKSxcbiAgICB3aW5kb3c6IGpvaS5udW1iZXIoKSxcbiAgfSksXG4gIHJvdXRlczogam9pLm9iamVjdCh7XG4gICAgYWRtaW46IGpvaS5zdHJpbmcoKSxcbiAgICBhcGk6IGpvaS5zdHJpbmcoKSxcbiAgICBncmFwaFFMOiBqb2kuc3RyaW5nKCksXG4gICAgZ3JhcGhRTFBsYXlncm91bmQ6IGpvaS5zdHJpbmcoKSxcbiAgfSksXG4gIHNlcnZlclVSTDogam9pXG4gICAgLnN0cmluZygpXG4gICAgLnVyaSgpXG4gICAgLmFsbG93KCcnKVxuICAgIC5jdXN0b20oKHZhbHVlLCBoZWxwZXIpID0+IHtcbiAgICAgIGNvbnN0IHVybFdpdGhvdXRQcm90b2NvbCA9IHZhbHVlLnNwbGl0KCcvLycpWzFdXG5cbiAgICAgIGlmICghdXJsV2l0aG91dFByb3RvY29sKSB7XG4gICAgICAgIHJldHVybiBoZWxwZXIubWVzc2FnZSh7XG4gICAgICAgICAgY3VzdG9tOiAnWW91IG5lZWQgdG8gaW5jbHVkZSBlaXRoZXIgXCJodHRwczovL1wiIG9yIFwiaHR0cDovL1wiIGluIHlvdXIgc2VydmVyVVJMLicsXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGlmICh1cmxXaXRob3V0UHJvdG9jb2wuaW5kZXhPZignLycpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIGhlbHBlci5tZXNzYWdlKHtcbiAgICAgICAgICBjdXN0b206XG4gICAgICAgICAgICAnWW91ciBzZXJ2ZXJVUkwgY2Fubm90IGhhdmUgYSBwYXRoLiBJdCBjYW4gb25seSBjb250YWluIGEgcHJvdG9jb2wsIGEgZG9tYWluLCBhbmQgYW4gb3B0aW9uYWwgcG9ydC4nLFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9KSxcbiAgdGVsZW1ldHJ5OiBqb2kuYm9vbGVhbigpLFxuICB0eXBlc2NyaXB0OiBqb2kub2JqZWN0KHtcbiAgICBkZWNsYXJlOiBqb2kuYm9vbGVhbigpLFxuICAgIG91dHB1dEZpbGU6IGpvaS5zdHJpbmcoKSxcbiAgfSksXG4gIHVwbG9hZDogam9pLm9iamVjdCgpLFxufSlcbiJdLCJuYW1lcyI6WyJlbmRwb2ludHNTY2hlbWEiLCJjb21wb25lbnQiLCJqb2kiLCJhbHRlcm5hdGl2ZXMiLCJ0cnkiLCJvYmplY3QiLCJ1bmtub3duIiwiZnVuYyIsImFycmF5IiwiaXRlbXMiLCJjdXN0b20iLCJwYXR0ZXJuIiwic3RyaW5nIiwiYW55IiwiaGFuZGxlciIsIm1ldGhvZCIsInZhbGlkIiwicGF0aCIsInJvb3QiLCJib29sIiwiYm9vbGVhbiIsImFkbWluIiwiYXV0b0xvZ2luIiwia2V5cyIsImVtYWlsIiwicGFzc3dvcmQiLCJwcmVmaWxsT25seSIsImF2YXRhciIsImJ1aWxkUGF0aCIsImJ1bmRsZXIiLCJidWlsZCIsImRldiIsInNlcnZlIiwiY29tcG9uZW50cyIsIk5hdiIsImFjdGlvbnMiLCJhZnRlckRhc2hib2FyZCIsImFmdGVyTG9naW4iLCJhZnRlck5hdkxpbmtzIiwiYmVmb3JlRGFzaGJvYXJkIiwiYmVmb3JlTG9naW4iLCJiZWZvcmVOYXZMaW5rcyIsImdyYXBoaWNzIiwiSWNvbiIsIkxvZ28iLCJsb2dvdXQiLCJCdXR0b24iLCJwcm92aWRlcnMiLCJ2aWV3cyIsIkFjY291bnQiLCJhZG1pblZpZXdTY2hlbWEiLCJEYXNoYm9hcmQiLCJjc3MiLCJkYXRlRm9ybWF0IiwiZGlzYWJsZSIsImluYWN0aXZpdHlSb3V0ZSIsImluZGV4SFRNTCIsImxpdmVQcmV2aWV3IiwibGl2ZVByZXZpZXdTY2hlbWEiLCJjb2xsZWN0aW9ucyIsImdsb2JhbHMiLCJsb2dvdXRSb3V0ZSIsIm1ldGEiLCJmYXZpY29uIiwib2dJbWFnZSIsInRpdGxlU3VmZml4IiwidXNlciIsInZpdGUiLCJ3ZWJwYWNrIiwiY29va2llUHJlZml4IiwiY29ycyIsImNzcmYiLCJhbGxvdyIsInNwYXJzZSIsImRiIiwiZGVidWciLCJkZWZhdWx0RGVwdGgiLCJudW1iZXIiLCJtaW4iLCJtYXgiLCJkZWZhdWx0TWF4VGV4dExlbmd0aCIsImVkaXRvciIsInJlcXVpcmVkIiwiQ2VsbENvbXBvbmVudCIsImNvbXBvbmVudFNjaGVtYSIsIm9wdGlvbmFsIiwiRmllbGRDb21wb25lbnQiLCJMYXp5Q2VsbENvbXBvbmVudCIsIkxhenlGaWVsZENvbXBvbmVudCIsImFmdGVyUmVhZFByb21pc2UiLCJvdXRwdXRTY2hlbWEiLCJwb3B1bGF0aW9uUHJvbWlzZSIsInZhbGlkYXRlIiwiZW5kcG9pbnRzIiwiZXhwcmVzcyIsImNvbXByZXNzaW9uIiwianNvbiIsIm1pZGRsZXdhcmUiLCJwb3N0TWlkZGxld2FyZSIsInByZU1pZGRsZXdhcmUiLCJncmFwaFFMIiwiZGlzYWJsZVBsYXlncm91bmRJblByb2R1Y3Rpb24iLCJtYXhDb21wbGV4aXR5IiwibXV0YXRpb25zIiwiZnVuY3Rpb24iLCJxdWVyaWVzIiwic2NoZW1hT3V0cHV0RmlsZSIsImhvb2tzIiwiYWZ0ZXJFcnJvciIsImkxOG4iLCJpbmRleFNvcnRhYmxlRmllbGRzIiwiam9pVmFsaWRhdGlvbiIsImxvY2FsIiwibG9jYWxpemF0aW9uIiwiZGVmYXVsdExvY2FsZSIsImZhbGxiYWNrIiwibG9jYWxlQ29kZXMiLCJsb2NhbGVzIiwiY29kZSIsImZhbGxiYWNrTG9jYWxlIiwibGFiZWwiLCJydGwiLCJ0b1N0cmluZyIsIm1heERlcHRoIiwib25Jbml0IiwicGx1Z2lucyIsInJhdGVMaW1pdCIsInNraXAiLCJ0cnVzdFByb3h5Iiwid2luZG93Iiwicm91dGVzIiwiYXBpIiwiZ3JhcGhRTFBsYXlncm91bmQiLCJzZXJ2ZXJVUkwiLCJ1cmkiLCJ2YWx1ZSIsImhlbHBlciIsInVybFdpdGhvdXRQcm90b2NvbCIsInNwbGl0IiwibWVzc2FnZSIsImluZGV4T2YiLCJ0ZWxlbWV0cnkiLCJ0eXBlc2NyaXB0IiwiZGVjbGFyZSIsIm91dHB1dEZpbGUiLCJ1cGxvYWQiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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