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
const _joi = /*#__PURE__*/ _interop_require_default(require("joi"));
const _schema = require("../../config/schema");
const _componentSchema = require("../../config/shared/componentSchema");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const strategyBaseSchema = _joi.default.object().keys({
    logout: _joi.default.boolean(),
    refresh: _joi.default.boolean()
});
const collectionSchema = _joi.default.object().keys({
    slug: _joi.default.string().required(),
    access: _joi.default.object({
        admin: _joi.default.func(),
        create: _joi.default.func(),
        delete: _joi.default.func(),
        read: _joi.default.func(),
        readVersions: _joi.default.func(),
        unlock: _joi.default.func(),
        update: _joi.default.func()
    }),
    admin: _joi.default.object({
        components: _joi.default.object({
            AfterList: _joi.default.array().items(_componentSchema.componentSchema),
            AfterListTable: _joi.default.array().items(_componentSchema.componentSchema),
            BeforeList: _joi.default.array().items(_componentSchema.componentSchema),
            BeforeListTable: _joi.default.array().items(_componentSchema.componentSchema),
            edit: _joi.default.object({
                PreviewButton: _componentSchema.componentSchema,
                PublishButton: _componentSchema.componentSchema,
                SaveButton: _componentSchema.componentSchema,
                SaveDraftButton: _componentSchema.componentSchema
            }),
            views: _joi.default.object({
                Edit: _joi.default.alternatives().try(_componentSchema.componentSchema, _joi.default.object({
                    API: _joi.default.alternatives().try(_componentSchema.componentSchema, _componentSchema.customViewSchema),
                    Default: _joi.default.alternatives().try(_componentSchema.componentSchema, _componentSchema.customViewSchema),
                    LivePreview: _joi.default.alternatives().try(_componentSchema.componentSchema, _componentSchema.customViewSchema),
                    Version: _joi.default.alternatives().try(_componentSchema.componentSchema, _componentSchema.customViewSchema),
                    Versions: _joi.default.alternatives().try(_componentSchema.componentSchema, _componentSchema.customViewSchema)
                })),
                List: _joi.default.alternatives().try(_componentSchema.componentSchema, _joi.default.object({
                    Component: _componentSchema.componentSchema,
                    actions: _joi.default.array().items(_componentSchema.componentSchema)
                }))
            })
        }),
        defaultColumns: _joi.default.array().items(_joi.default.string()),
        description: _joi.default.alternatives().try(_joi.default.string(), _componentSchema.componentSchema),
        disableDuplicate: _joi.default.bool(),
        enableRichTextLink: _joi.default.boolean(),
        enableRichTextRelationship: _joi.default.boolean(),
        forceRenderAllFields: _joi.default.boolean(),
        group: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
            _joi.default.string()
        ])),
        hidden: _joi.default.alternatives().try(_joi.default.boolean(), _joi.default.func()),
        hideAPIURL: _joi.default.bool(),
        hooks: _joi.default.object({
            beforeDuplicate: _joi.default.func()
        }),
        listSearchableFields: _joi.default.array().items(_joi.default.string()),
        livePreview: _joi.default.object(_componentSchema.livePreviewSchema),
        pagination: _joi.default.object({
            defaultLimit: _joi.default.number(),
            limits: _joi.default.array().items(_joi.default.number())
        }),
        preview: _joi.default.func(),
        useAsTitle: _joi.default.string()
    }),
    auth: _joi.default.alternatives().try(_joi.default.object({
        cookies: _joi.default.object().keys({
            domain: _joi.default.string(),
            sameSite: _joi.default.string(),
            secure: _joi.default.boolean()
        }),
        depth: _joi.default.number(),
        disableLocalStrategy: _joi.default.boolean().valid(true),
        forgotPassword: _joi.default.object().keys({
            generateEmailHTML: _joi.default.func(),
            generateEmailSubject: _joi.default.func()
        }),
        lockTime: _joi.default.number(),
        maxLoginAttempts: _joi.default.number(),
        removeTokenFromResponses: _joi.default.boolean().valid(true),
        strategies: _joi.default.array().items(_joi.default.alternatives().try(strategyBaseSchema.keys({
            name: _joi.default.string().required(),
            strategy: _joi.default.func().maxArity(1).required()
        }), strategyBaseSchema.keys({
            name: _joi.default.string(),
            strategy: _joi.default.object().required()
        }))),
        tokenExpiration: _joi.default.number(),
        useAPIKey: _joi.default.boolean(),
        verify: _joi.default.alternatives().try(_joi.default.boolean(), _joi.default.object().keys({
            generateEmailHTML: _joi.default.func(),
            generateEmailSubject: _joi.default.func()
        }))
    }), _joi.default.boolean()),
    custom: _joi.default.object().pattern(_joi.default.string(), _joi.default.any()),
    db: _joi.default.object(),
    dbName: _joi.default.alternatives().try(_joi.default.string(), _joi.default.func()),
    defaultSort: _joi.default.string(),
    endpoints: _schema.endpointsSchema,
    fields: _joi.default.array(),
    graphQL: _joi.default.alternatives().try(_joi.default.object().keys({
        pluralName: _joi.default.string(),
        singularName: _joi.default.string()
    }), _joi.default.boolean()),
    hooks: _joi.default.object({
        afterChange: _joi.default.array().items(_joi.default.func()),
        afterDelete: _joi.default.array().items(_joi.default.func()),
        afterForgotPassword: _joi.default.array().items(_joi.default.func()),
        afterLogin: _joi.default.array().items(_joi.default.func()),
        afterLogout: _joi.default.array().items(_joi.default.func()),
        afterMe: _joi.default.array().items(_joi.default.func()),
        afterOperation: _joi.default.array().items(_joi.default.func()),
        afterRead: _joi.default.array().items(_joi.default.func()),
        afterRefresh: _joi.default.array().items(_joi.default.func()),
        beforeChange: _joi.default.array().items(_joi.default.func()),
        beforeDelete: _joi.default.array().items(_joi.default.func()),
        beforeLogin: _joi.default.array().items(_joi.default.func()),
        beforeOperation: _joi.default.array().items(_joi.default.func()),
        beforeRead: _joi.default.array().items(_joi.default.func()),
        beforeValidate: _joi.default.array().items(_joi.default.func()),
        me: _joi.default.array().items(_joi.default.func()),
        refresh: _joi.default.array().items(_joi.default.func())
    }),
    indexes: _joi.default.array().items(_joi.default.object().keys({
        fields: _joi.default.object().required(),
        options: _joi.default.object()
    })),
    labels: _joi.default.object({
        plural: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
            _joi.default.string()
        ])),
        singular: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
            _joi.default.string()
        ]))
    }),
    timestamps: _joi.default.boolean(),
    typescript: _joi.default.object().keys({
        interface: _joi.default.string()
    }),
    upload: _joi.default.alternatives().try(_joi.default.object({
        adminThumbnail: _joi.default.alternatives().try(_joi.default.string(), _joi.default.func()),
        crop: _joi.default.bool(),
        disableLocalStorage: _joi.default.bool(),
        displayPreview: _joi.default.bool().default(false),
        externalFileHeaderFilter: _joi.default.func(),
        filesRequiredOnCreate: _joi.default.bool(),
        focalPoint: _joi.default.bool(),
        formatOptions: _joi.default.object().keys({
            format: _joi.default.string(),
            options: _joi.default.object()
        }),
        handlers: _joi.default.array().items(_joi.default.func()),
        imageSizes: _joi.default.array().items(_joi.default.object().keys({
            name: _joi.default.string(),
            crop: _joi.default.string(),
            height: _joi.default.number().integer().allow(null),
            width: _joi.default.number().integer().allow(null)
        }).unknown()),
        mimeTypes: _joi.default.array().items(_joi.default.string()),
        resizeOptions: _joi.default.object().keys({
            background: _joi.default.string(),
            fastShrinkOnLoad: _joi.default.bool(),
            fit: _joi.default.string(),
            height: _joi.default.number().allow(null),
            kernel: _joi.default.string(),
            position: _joi.default.alternatives().try(_joi.default.string(), _joi.default.number()),
            width: _joi.default.number().allow(null),
            withoutEnlargement: _joi.default.bool()
        }).allow(null),
        staticDir: _joi.default.string(),
        staticOptions: _joi.default.object(),
        staticURL: _joi.default.string(),
        tempFileDir: _joi.default.string(),
        trimOptions: _joi.default.alternatives().try(_joi.default.object().keys({
            format: _joi.default.string(),
            options: _joi.default.object()
        }), _joi.default.string(), _joi.default.number()),
        useTempFiles: _joi.default.bool(),
        withMetadata: _joi.default.alternatives().try(_joi.default.boolean(), _joi.default.func())
    }), _joi.default.boolean()),
    versions: _joi.default.alternatives().try(_joi.default.object({
        drafts: _joi.default.alternatives().try(_joi.default.object({
            autosave: _joi.default.alternatives().try(_joi.default.boolean(), _joi.default.object({
                interval: _joi.default.number()
            })),
            validate: _joi.default.boolean()
        }), _joi.default.boolean()),
        maxPerDoc: _joi.default.number()
    }), _joi.default.boolean())
});
const _default = collectionSchema;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb2xsZWN0aW9ucy9jb25maWcvc2NoZW1hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqb2kgZnJvbSAnam9pJ1xuXG5pbXBvcnQgeyBlbmRwb2ludHNTY2hlbWEgfSBmcm9tICcuLi8uLi9jb25maWcvc2NoZW1hJ1xuaW1wb3J0IHtcbiAgY29tcG9uZW50U2NoZW1hLFxuICBjdXN0b21WaWV3U2NoZW1hLFxuICBsaXZlUHJldmlld1NjaGVtYSxcbn0gZnJvbSAnLi4vLi4vY29uZmlnL3NoYXJlZC9jb21wb25lbnRTY2hlbWEnXG5cbmNvbnN0IHN0cmF0ZWd5QmFzZVNjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgbG9nb3V0OiBqb2kuYm9vbGVhbigpLFxuICByZWZyZXNoOiBqb2kuYm9vbGVhbigpLFxufSlcblxuY29uc3QgY29sbGVjdGlvblNjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgc2x1Zzogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIGFjY2Vzczogam9pLm9iamVjdCh7XG4gICAgYWRtaW46IGpvaS5mdW5jKCksXG4gICAgY3JlYXRlOiBqb2kuZnVuYygpLFxuICAgIGRlbGV0ZTogam9pLmZ1bmMoKSxcbiAgICByZWFkOiBqb2kuZnVuYygpLFxuICAgIHJlYWRWZXJzaW9uczogam9pLmZ1bmMoKSxcbiAgICB1bmxvY2s6IGpvaS5mdW5jKCksXG4gICAgdXBkYXRlOiBqb2kuZnVuYygpLFxuICB9KSxcbiAgYWRtaW46IGpvaS5vYmplY3Qoe1xuICAgIGNvbXBvbmVudHM6IGpvaS5vYmplY3Qoe1xuICAgICAgQWZ0ZXJMaXN0OiBqb2kuYXJyYXkoKS5pdGVtcyhjb21wb25lbnRTY2hlbWEpLFxuICAgICAgQWZ0ZXJMaXN0VGFibGU6IGpvaS5hcnJheSgpLml0ZW1zKGNvbXBvbmVudFNjaGVtYSksXG4gICAgICBCZWZvcmVMaXN0OiBqb2kuYXJyYXkoKS5pdGVtcyhjb21wb25lbnRTY2hlbWEpLFxuICAgICAgQmVmb3JlTGlzdFRhYmxlOiBqb2kuYXJyYXkoKS5pdGVtcyhjb21wb25lbnRTY2hlbWEpLFxuICAgICAgZWRpdDogam9pLm9iamVjdCh7XG4gICAgICAgIFByZXZpZXdCdXR0b246IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgICAgUHVibGlzaEJ1dHRvbjogY29tcG9uZW50U2NoZW1hLFxuICAgICAgICBTYXZlQnV0dG9uOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICAgIFNhdmVEcmFmdEJ1dHRvbjogY29tcG9uZW50U2NoZW1hLFxuICAgICAgfSksXG4gICAgICB2aWV3czogam9pLm9iamVjdCh7XG4gICAgICAgIEVkaXQ6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoXG4gICAgICAgICAgY29tcG9uZW50U2NoZW1hLFxuICAgICAgICAgIGpvaS5vYmplY3Qoe1xuICAgICAgICAgICAgQVBJOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGNvbXBvbmVudFNjaGVtYSwgY3VzdG9tVmlld1NjaGVtYSksXG4gICAgICAgICAgICBEZWZhdWx0OiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGNvbXBvbmVudFNjaGVtYSwgY3VzdG9tVmlld1NjaGVtYSksXG4gICAgICAgICAgICBMaXZlUHJldmlldzogam9pLmFsdGVybmF0aXZlcygpLnRyeShjb21wb25lbnRTY2hlbWEsIGN1c3RvbVZpZXdTY2hlbWEpLFxuICAgICAgICAgICAgVmVyc2lvbjogam9pLmFsdGVybmF0aXZlcygpLnRyeShjb21wb25lbnRTY2hlbWEsIGN1c3RvbVZpZXdTY2hlbWEpLFxuICAgICAgICAgICAgVmVyc2lvbnM6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoY29tcG9uZW50U2NoZW1hLCBjdXN0b21WaWV3U2NoZW1hKSxcbiAgICAgICAgICAgIC8vIFJlbGF0aW9uc2hpcHNcbiAgICAgICAgICAgIC8vIFJlZmVyZW5jZXNcbiAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgICAgTGlzdDogam9pLmFsdGVybmF0aXZlcygpLnRyeShcbiAgICAgICAgICBjb21wb25lbnRTY2hlbWEsXG4gICAgICAgICAgam9pLm9iamVjdCh7XG4gICAgICAgICAgICBDb21wb25lbnQ6IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgICAgICAgIGFjdGlvbnM6IGpvaS5hcnJheSgpLml0ZW1zKGNvbXBvbmVudFNjaGVtYSksXG4gICAgICAgICAgfSksXG4gICAgICAgICksXG4gICAgICB9KSxcbiAgICB9KSxcbiAgICBkZWZhdWx0Q29sdW1uczogam9pLmFycmF5KCkuaXRlbXMoam9pLnN0cmluZygpKSxcbiAgICBkZXNjcmlwdGlvbjogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kuc3RyaW5nKCksIGNvbXBvbmVudFNjaGVtYSksXG4gICAgZGlzYWJsZUR1cGxpY2F0ZTogam9pLmJvb2woKSxcbiAgICBlbmFibGVSaWNoVGV4dExpbms6IGpvaS5ib29sZWFuKCksXG4gICAgZW5hYmxlUmljaFRleHRSZWxhdGlvbnNoaXA6IGpvaS5ib29sZWFuKCksXG4gICAgZm9yY2VSZW5kZXJBbGxGaWVsZHM6IGpvaS5ib29sZWFuKCksXG4gICAgZ3JvdXA6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBqb2kub2JqZWN0KCkucGF0dGVybihqb2kuc3RyaW5nKCksIFtqb2kuc3RyaW5nKCldKSksXG4gICAgaGlkZGVuOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5ib29sZWFuKCksIGpvaS5mdW5jKCkpLFxuICAgIGhpZGVBUElVUkw6IGpvaS5ib29sKCksXG4gICAgaG9va3M6IGpvaS5vYmplY3Qoe1xuICAgICAgYmVmb3JlRHVwbGljYXRlOiBqb2kuZnVuYygpLFxuICAgIH0pLFxuICAgIGxpc3RTZWFyY2hhYmxlRmllbGRzOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuc3RyaW5nKCkpLFxuICAgIGxpdmVQcmV2aWV3OiBqb2kub2JqZWN0KGxpdmVQcmV2aWV3U2NoZW1hKSxcbiAgICBwYWdpbmF0aW9uOiBqb2kub2JqZWN0KHtcbiAgICAgIGRlZmF1bHRMaW1pdDogam9pLm51bWJlcigpLFxuICAgICAgbGltaXRzOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kubnVtYmVyKCkpLFxuICAgIH0pLFxuICAgIHByZXZpZXc6IGpvaS5mdW5jKCksXG4gICAgdXNlQXNUaXRsZTogam9pLnN0cmluZygpLFxuICB9KSxcbiAgYXV0aDogam9pLmFsdGVybmF0aXZlcygpLnRyeShcbiAgICBqb2kub2JqZWN0KHtcbiAgICAgIGNvb2tpZXM6IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgICAgICAgZG9tYWluOiBqb2kuc3RyaW5nKCksXG4gICAgICAgIHNhbWVTaXRlOiBqb2kuc3RyaW5nKCksIC8vIFRPRE86IGFkZCBmdXJ0aGVyIHNwZWNpZmljaXR5IHdpdGggam9pLnhvclxuICAgICAgICBzZWN1cmU6IGpvaS5ib29sZWFuKCksXG4gICAgICB9KSxcbiAgICAgIGRlcHRoOiBqb2kubnVtYmVyKCksXG4gICAgICBkaXNhYmxlTG9jYWxTdHJhdGVneTogam9pLmJvb2xlYW4oKS52YWxpZCh0cnVlKSxcbiAgICAgIGZvcmdvdFBhc3N3b3JkOiBqb2kub2JqZWN0KCkua2V5cyh7XG4gICAgICAgIGdlbmVyYXRlRW1haWxIVE1MOiBqb2kuZnVuYygpLFxuICAgICAgICBnZW5lcmF0ZUVtYWlsU3ViamVjdDogam9pLmZ1bmMoKSxcbiAgICAgIH0pLFxuICAgICAgbG9ja1RpbWU6IGpvaS5udW1iZXIoKSxcbiAgICAgIG1heExvZ2luQXR0ZW1wdHM6IGpvaS5udW1iZXIoKSxcbiAgICAgIHJlbW92ZVRva2VuRnJvbVJlc3BvbnNlczogam9pLmJvb2xlYW4oKS52YWxpZCh0cnVlKSxcbiAgICAgIHN0cmF0ZWdpZXM6IGpvaS5hcnJheSgpLml0ZW1zKFxuICAgICAgICBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KFxuICAgICAgICAgIHN0cmF0ZWd5QmFzZVNjaGVtYS5rZXlzKHtcbiAgICAgICAgICAgIG5hbWU6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICAgICAgICAgICAgc3RyYXRlZ3k6IGpvaS5mdW5jKCkubWF4QXJpdHkoMSkucmVxdWlyZWQoKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBzdHJhdGVneUJhc2VTY2hlbWEua2V5cyh7XG4gICAgICAgICAgICBuYW1lOiBqb2kuc3RyaW5nKCksXG4gICAgICAgICAgICBzdHJhdGVneTogam9pLm9iamVjdCgpLnJlcXVpcmVkKCksXG4gICAgICAgICAgfSksXG4gICAgICAgICksXG4gICAgICApLFxuICAgICAgdG9rZW5FeHBpcmF0aW9uOiBqb2kubnVtYmVyKCksXG4gICAgICB1c2VBUElLZXk6IGpvaS5ib29sZWFuKCksXG4gICAgICB2ZXJpZnk6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoXG4gICAgICAgIGpvaS5ib29sZWFuKCksXG4gICAgICAgIGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgICAgICAgICBnZW5lcmF0ZUVtYWlsSFRNTDogam9pLmZ1bmMoKSxcbiAgICAgICAgICBnZW5lcmF0ZUVtYWlsU3ViamVjdDogam9pLmZ1bmMoKSxcbiAgICAgICAgfSksXG4gICAgICApLFxuICAgIH0pLFxuICAgIGpvaS5ib29sZWFuKCksXG4gICksXG4gIGN1c3RvbTogam9pLm9iamVjdCgpLnBhdHRlcm4oam9pLnN0cmluZygpLCBqb2kuYW55KCkpLFxuICBkYjogam9pLm9iamVjdCgpLFxuICBkYk5hbWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBqb2kuZnVuYygpKSxcbiAgZGVmYXVsdFNvcnQ6IGpvaS5zdHJpbmcoKSxcbiAgZW5kcG9pbnRzOiBlbmRwb2ludHNTY2hlbWEsXG4gIGZpZWxkczogam9pLmFycmF5KCksXG4gIGdyYXBoUUw6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoXG4gICAgam9pLm9iamVjdCgpLmtleXMoe1xuICAgICAgcGx1cmFsTmFtZTogam9pLnN0cmluZygpLFxuICAgICAgc2luZ3VsYXJOYW1lOiBqb2kuc3RyaW5nKCksXG4gICAgfSksXG4gICAgam9pLmJvb2xlYW4oKSxcbiAgKSxcbiAgaG9va3M6IGpvaS5vYmplY3Qoe1xuICAgIGFmdGVyQ2hhbmdlOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuZnVuYygpKSxcbiAgICBhZnRlckRlbGV0ZTogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gICAgYWZ0ZXJGb3Jnb3RQYXNzd29yZDogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gICAgYWZ0ZXJMb2dpbjogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gICAgYWZ0ZXJMb2dvdXQ6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5mdW5jKCkpLFxuICAgIGFmdGVyTWU6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5mdW5jKCkpLFxuICAgIGFmdGVyT3BlcmF0aW9uOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuZnVuYygpKSxcbiAgICBhZnRlclJlYWQ6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5mdW5jKCkpLFxuICAgIGFmdGVyUmVmcmVzaDogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gICAgYmVmb3JlQ2hhbmdlOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuZnVuYygpKSxcbiAgICBiZWZvcmVEZWxldGU6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5mdW5jKCkpLFxuICAgIGJlZm9yZUxvZ2luOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuZnVuYygpKSxcbiAgICBiZWZvcmVPcGVyYXRpb246IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5mdW5jKCkpLFxuICAgIGJlZm9yZVJlYWQ6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5mdW5jKCkpLFxuICAgIGJlZm9yZVZhbGlkYXRlOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuZnVuYygpKSxcbiAgICBtZTogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gICAgcmVmcmVzaDogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gIH0pLFxuICBpbmRleGVzOiBqb2kuYXJyYXkoKS5pdGVtcyhcbiAgICBqb2kub2JqZWN0KCkua2V5cyh7XG4gICAgICBmaWVsZHM6IGpvaS5vYmplY3QoKS5yZXF1aXJlZCgpLFxuICAgICAgb3B0aW9uczogam9pLm9iamVjdCgpLFxuICAgIH0pLFxuICApLFxuICBsYWJlbHM6IGpvaS5vYmplY3Qoe1xuICAgIHBsdXJhbDogam9pXG4gICAgICAuYWx0ZXJuYXRpdmVzKClcbiAgICAgIC50cnkoam9pLnN0cmluZygpLCBqb2kub2JqZWN0KCkucGF0dGVybihqb2kuc3RyaW5nKCksIFtqb2kuc3RyaW5nKCldKSksXG4gICAgc2luZ3VsYXI6IGpvaVxuICAgICAgLmFsdGVybmF0aXZlcygpXG4gICAgICAudHJ5KGpvaS5zdHJpbmcoKSwgam9pLm9iamVjdCgpLnBhdHRlcm4oam9pLnN0cmluZygpLCBbam9pLnN0cmluZygpXSkpLFxuICB9KSxcbiAgdGltZXN0YW1wczogam9pLmJvb2xlYW4oKSxcbiAgdHlwZXNjcmlwdDogam9pLm9iamVjdCgpLmtleXMoe1xuICAgIGludGVyZmFjZTogam9pLnN0cmluZygpLFxuICB9KSxcbiAgdXBsb2FkOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KFxuICAgIGpvaS5vYmplY3Qoe1xuICAgICAgYWRtaW5UaHVtYm5haWw6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBqb2kuZnVuYygpKSxcbiAgICAgIGNyb3A6IGpvaS5ib29sKCksXG4gICAgICBkaXNhYmxlTG9jYWxTdG9yYWdlOiBqb2kuYm9vbCgpLFxuICAgICAgZGlzcGxheVByZXZpZXc6IGpvaS5ib29sKCkuZGVmYXVsdChmYWxzZSksXG4gICAgICBleHRlcm5hbEZpbGVIZWFkZXJGaWx0ZXI6IGpvaS5mdW5jKCksXG4gICAgICBmaWxlc1JlcXVpcmVkT25DcmVhdGU6IGpvaS5ib29sKCksXG4gICAgICBmb2NhbFBvaW50OiBqb2kuYm9vbCgpLFxuICAgICAgZm9ybWF0T3B0aW9uczogam9pLm9iamVjdCgpLmtleXMoe1xuICAgICAgICBmb3JtYXQ6IGpvaS5zdHJpbmcoKSxcbiAgICAgICAgb3B0aW9uczogam9pLm9iamVjdCgpLFxuICAgICAgfSksXG4gICAgICBoYW5kbGVyczogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gICAgICBpbWFnZVNpemVzOiBqb2kuYXJyYXkoKS5pdGVtcyhcbiAgICAgICAgam9pXG4gICAgICAgICAgLm9iamVjdCgpXG4gICAgICAgICAgLmtleXMoe1xuICAgICAgICAgICAgbmFtZTogam9pLnN0cmluZygpLFxuICAgICAgICAgICAgY3JvcDogam9pLnN0cmluZygpLCAvLyBUT0RPOiBhZGQgZnVydGhlciBzcGVjaWZpY2l0eSB3aXRoIGpvaS54b3JcbiAgICAgICAgICAgIGhlaWdodDogam9pLm51bWJlcigpLmludGVnZXIoKS5hbGxvdyhudWxsKSxcbiAgICAgICAgICAgIHdpZHRoOiBqb2kubnVtYmVyKCkuaW50ZWdlcigpLmFsbG93KG51bGwpLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnVua25vd24oKSxcbiAgICAgICksXG4gICAgICBtaW1lVHlwZXM6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5zdHJpbmcoKSksXG4gICAgICByZXNpemVPcHRpb25zOiBqb2lcbiAgICAgICAgLm9iamVjdCgpXG4gICAgICAgIC5rZXlzKHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBqb2kuc3RyaW5nKCksXG4gICAgICAgICAgZmFzdFNocmlua09uTG9hZDogam9pLmJvb2woKSxcbiAgICAgICAgICBmaXQ6IGpvaS5zdHJpbmcoKSxcbiAgICAgICAgICBoZWlnaHQ6IGpvaS5udW1iZXIoKS5hbGxvdyhudWxsKSxcbiAgICAgICAgICBrZXJuZWw6IGpvaS5zdHJpbmcoKSxcbiAgICAgICAgICBwb3NpdGlvbjogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kuc3RyaW5nKCksIGpvaS5udW1iZXIoKSksXG4gICAgICAgICAgd2lkdGg6IGpvaS5udW1iZXIoKS5hbGxvdyhudWxsKSxcbiAgICAgICAgICB3aXRob3V0RW5sYXJnZW1lbnQ6IGpvaS5ib29sKCksXG4gICAgICAgIH0pXG4gICAgICAgIC5hbGxvdyhudWxsKSxcbiAgICAgIHN0YXRpY0Rpcjogam9pLnN0cmluZygpLFxuICAgICAgc3RhdGljT3B0aW9uczogam9pLm9iamVjdCgpLFxuICAgICAgc3RhdGljVVJMOiBqb2kuc3RyaW5nKCksXG4gICAgICB0ZW1wRmlsZURpcjogam9pLnN0cmluZygpLFxuICAgICAgdHJpbU9wdGlvbnM6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoXG4gICAgICAgIGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgICAgICAgICBmb3JtYXQ6IGpvaS5zdHJpbmcoKSxcbiAgICAgICAgICBvcHRpb25zOiBqb2kub2JqZWN0KCksXG4gICAgICAgIH0pLFxuICAgICAgICBqb2kuc3RyaW5nKCksXG4gICAgICAgIGpvaS5udW1iZXIoKSxcbiAgICAgICksXG4gICAgICB1c2VUZW1wRmlsZXM6IGpvaS5ib29sKCksXG4gICAgICB3aXRoTWV0YWRhdGE6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLmJvb2xlYW4oKSwgam9pLmZ1bmMoKSksXG4gICAgfSksXG4gICAgam9pLmJvb2xlYW4oKSxcbiAgKSxcbiAgdmVyc2lvbnM6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoXG4gICAgam9pLm9iamVjdCh7XG4gICAgICBkcmFmdHM6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoXG4gICAgICAgIGpvaS5vYmplY3Qoe1xuICAgICAgICAgIGF1dG9zYXZlOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KFxuICAgICAgICAgICAgam9pLmJvb2xlYW4oKSxcbiAgICAgICAgICAgIGpvaS5vYmplY3Qoe1xuICAgICAgICAgICAgICBpbnRlcnZhbDogam9pLm51bWJlcigpLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgKSxcbiAgICAgICAgICB2YWxpZGF0ZTogam9pLmJvb2xlYW4oKSxcbiAgICAgICAgfSksXG4gICAgICAgIGpvaS5ib29sZWFuKCksXG4gICAgICApLFxuICAgICAgbWF4UGVyRG9jOiBqb2kubnVtYmVyKCksXG4gICAgfSksXG4gICAgam9pLmJvb2xlYW4oKSxcbiAgKSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGNvbGxlY3Rpb25TY2hlbWFcbiJdLCJuYW1lcyI6WyJzdHJhdGVneUJhc2VTY2hlbWEiLCJqb2kiLCJvYmplY3QiLCJrZXlzIiwibG9nb3V0IiwiYm9vbGVhbiIsInJlZnJlc2giLCJjb2xsZWN0aW9uU2NoZW1hIiwic2x1ZyIsInN0cmluZyIsInJlcXVpcmVkIiwiYWNjZXNzIiwiYWRtaW4iLCJmdW5jIiwiY3JlYXRlIiwiZGVsZXRlIiwicmVhZCIsInJlYWRWZXJzaW9ucyIsInVubG9jayIsInVwZGF0ZSIsImNvbXBvbmVudHMiLCJBZnRlckxpc3QiLCJhcnJheSIsIml0ZW1zIiwiY29tcG9uZW50U2NoZW1hIiwiQWZ0ZXJMaXN0VGFibGUiLCJCZWZvcmVMaXN0IiwiQmVmb3JlTGlzdFRhYmxlIiwiZWRpdCIsIlByZXZpZXdCdXR0b24iLCJQdWJsaXNoQnV0dG9uIiwiU2F2ZUJ1dHRvbiIsIlNhdmVEcmFmdEJ1dHRvbiIsInZpZXdzIiwiRWRpdCIsImFsdGVybmF0aXZlcyIsInRyeSIsIkFQSSIsImN1c3RvbVZpZXdTY2hlbWEiLCJEZWZhdWx0IiwiTGl2ZVByZXZpZXciLCJWZXJzaW9uIiwiVmVyc2lvbnMiLCJMaXN0IiwiQ29tcG9uZW50IiwiYWN0aW9ucyIsImRlZmF1bHRDb2x1bW5zIiwiZGVzY3JpcHRpb24iLCJkaXNhYmxlRHVwbGljYXRlIiwiYm9vbCIsImVuYWJsZVJpY2hUZXh0TGluayIsImVuYWJsZVJpY2hUZXh0UmVsYXRpb25zaGlwIiwiZm9yY2VSZW5kZXJBbGxGaWVsZHMiLCJncm91cCIsInBhdHRlcm4iLCJoaWRkZW4iLCJoaWRlQVBJVVJMIiwiaG9va3MiLCJiZWZvcmVEdXBsaWNhdGUiLCJsaXN0U2VhcmNoYWJsZUZpZWxkcyIsImxpdmVQcmV2aWV3IiwibGl2ZVByZXZpZXdTY2hlbWEiLCJwYWdpbmF0aW9uIiwiZGVmYXVsdExpbWl0IiwibnVtYmVyIiwibGltaXRzIiwicHJldmlldyIsInVzZUFzVGl0bGUiLCJhdXRoIiwiY29va2llcyIsImRvbWFpbiIsInNhbWVTaXRlIiwic2VjdXJlIiwiZGVwdGgiLCJkaXNhYmxlTG9jYWxTdHJhdGVneSIsInZhbGlkIiwiZm9yZ290UGFzc3dvcmQiLCJnZW5lcmF0ZUVtYWlsSFRNTCIsImdlbmVyYXRlRW1haWxTdWJqZWN0IiwibG9ja1RpbWUiLCJtYXhMb2dpbkF0dGVtcHRzIiwicmVtb3ZlVG9rZW5Gcm9tUmVzcG9uc2VzIiwic3RyYXRlZ2llcyIsIm5hbWUiLCJzdHJhdGVneSIsIm1heEFyaXR5IiwidG9rZW5FeHBpcmF0aW9uIiwidXNlQVBJS2V5IiwidmVyaWZ5IiwiY3VzdG9tIiwiYW55IiwiZGIiLCJkYk5hbWUiLCJkZWZhdWx0U29ydCIsImVuZHBvaW50cyIsImVuZHBvaW50c1NjaGVtYSIsImZpZWxkcyIsImdyYXBoUUwiLCJwbHVyYWxOYW1lIiwic2luZ3VsYXJOYW1lIiwiYWZ0ZXJDaGFuZ2UiLCJhZnRlckRlbGV0ZSIsImFmdGVyRm9yZ290UGFzc3dvcmQiLCJhZnRlckxvZ2luIiwiYWZ0ZXJMb2dvdXQiLCJhZnRlck1lIiwiYWZ0ZXJPcGVyYXRpb24iLCJhZnRlclJlYWQiLCJhZnRlclJlZnJlc2giLCJiZWZvcmVDaGFuZ2UiLCJiZWZvcmVEZWxldGUiLCJiZWZvcmVMb2dpbiIsImJlZm9yZU9wZXJhdGlvbiIsImJlZm9yZVJlYWQiLCJiZWZvcmVWYWxpZGF0ZSIsIm1lIiwiaW5kZXhlcyIsIm9wdGlvbnMiLCJsYWJlbHMiLCJwbHVyYWwiLCJzaW5ndWxhciIsInRpbWVzdGFtcHMiLCJ0eXBlc2NyaXB0IiwiaW50ZXJmYWNlIiwidXBsb2FkIiwiYWRtaW5UaHVtYm5haWwiLCJjcm9wIiwiZGlzYWJsZUxvY2FsU3RvcmFnZSIsImRpc3BsYXlQcmV2aWV3IiwiZGVmYXVsdCIsImV4dGVybmFsRmlsZUhlYWRlckZpbHRlciIsImZpbGVzUmVxdWlyZWRPbkNyZWF0ZSIsImZvY2FsUG9pbnQiLCJmb3JtYXRPcHRpb25zIiwiZm9ybWF0IiwiaGFuZGxlcnMiLCJpbWFnZVNpemVzIiwiaGVpZ2h0IiwiaW50ZWdlciIsImFsbG93Iiwid2lkdGgiLCJ1bmtub3duIiwibWltZVR5cGVzIiwicmVzaXplT3B0aW9ucyIsImJhY2tncm91bmQiLCJmYXN0U2hyaW5rT25Mb2FkIiwiZml0Iiwia2VybmVsIiwicG9zaXRpb24iLCJ3aXRob3V0RW5sYXJnZW1lbnQiLCJzdGF0aWNEaXIiLCJzdGF0aWNPcHRpb25zIiwic3RhdGljVVJMIiwidGVtcEZpbGVEaXIiLCJ0cmltT3B0aW9ucyIsInVzZVRlbXBGaWxlcyIsIndpdGhNZXRhZGF0YSIsInZlcnNpb25zIiwiZHJhZnRzIiwiYXV0b3NhdmUiLCJpbnRlcnZhbCIsInZhbGlkYXRlIiwibWF4UGVyRG9jIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkFzUEE7OztlQUFBOzs7NERBdFBnQjt3QkFFZ0I7aUNBS3pCOzs7Ozs7QUFFUCxNQUFNQSxxQkFBcUJDLFlBQUcsQ0FBQ0MsTUFBTSxHQUFHQyxJQUFJLENBQUM7SUFDM0NDLFFBQVFILFlBQUcsQ0FBQ0ksT0FBTztJQUNuQkMsU0FBU0wsWUFBRyxDQUFDSSxPQUFPO0FBQ3RCO0FBRUEsTUFBTUUsbUJBQW1CTixZQUFHLENBQUNDLE1BQU0sR0FBR0MsSUFBSSxDQUFDO0lBQ3pDSyxNQUFNUCxZQUFHLENBQUNRLE1BQU0s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