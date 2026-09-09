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
const globalSchema = _joi.default.object().keys({
    slug: _joi.default.string().required(),
    access: _joi.default.object({
        read: _joi.default.func(),
        readVersions: _joi.default.func(),
        update: _joi.default.func()
    }),
    admin: _joi.default.object({
        components: _joi.default.object({
            elements: _joi.default.object({
                PreviewButton: _componentSchema.componentSchema,
                PublishButton: _componentSchema.componentSchema,
                SaveButton: _componentSchema.componentSchema,
                SaveDraftButton: _componentSchema.componentSchema
            }),
            views: _joi.default.object({
                Edit: _joi.default.alternatives().try(_componentSchema.componentSchema, _joi.default.object({
                    API: _joi.default.alternatives().try(_componentSchema.componentSchema, _componentSchema.customViewSchema),
                    Default: _joi.default.alternatives().try(_componentSchema.componentSchema, _componentSchema.customViewSchema),
                    Preview: _joi.default.alternatives().try(_componentSchema.componentSchema, _componentSchema.customViewSchema),
                    Version: _joi.default.alternatives().try(_componentSchema.componentSchema, _componentSchema.customViewSchema),
                    Versions: _joi.default.alternatives().try(_componentSchema.componentSchema, _componentSchema.customViewSchema)
                }))
            })
        }),
        description: _joi.default.alternatives().try(_joi.default.string(), _componentSchema.componentSchema),
        forceRenderAllFields: _joi.default.boolean(),
        group: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
            _joi.default.string()
        ])),
        hidden: _joi.default.alternatives().try(_joi.default.boolean(), _joi.default.func()),
        hideAPIURL: _joi.default.boolean(),
        livePreview: _joi.default.object(_componentSchema.livePreviewSchema),
        preview: _joi.default.func()
    }),
    custom: _joi.default.object().pattern(_joi.default.string(), _joi.default.any()),
    dbName: _joi.default.alternatives().try(_joi.default.string(), _joi.default.func()),
    endpoints: _schema.endpointsSchema,
    fields: _joi.default.array(),
    graphQL: _joi.default.alternatives().try(_joi.default.object().keys({
        name: _joi.default.string()
    }), _joi.default.boolean()),
    hooks: _joi.default.object({
        afterChange: _joi.default.array().items(_joi.default.func()),
        afterRead: _joi.default.array().items(_joi.default.func()),
        beforeChange: _joi.default.array().items(_joi.default.func()),
        beforeRead: _joi.default.array().items(_joi.default.func()),
        beforeValidate: _joi.default.array().items(_joi.default.func())
    }),
    label: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
        _joi.default.string()
    ])),
    typescript: _joi.default.object().keys({
        interface: _joi.default.string()
    }),
    versions: _joi.default.alternatives().try(_joi.default.object({
        drafts: _joi.default.alternatives().try(_joi.default.object({
            autosave: _joi.default.alternatives().try(_joi.default.boolean(), _joi.default.object({
                interval: _joi.default.number()
            })),
            validate: _joi.default.boolean()
        }), _joi.default.boolean()),
        max: _joi.default.number()
    }), _joi.default.boolean())
}).unknown();
const _default = globalSchema;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nbG9iYWxzL2NvbmZpZy9zY2hlbWEudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGpvaSBmcm9tICdqb2knXG5cbmltcG9ydCB7IGVuZHBvaW50c1NjaGVtYSB9IGZyb20gJy4uLy4uL2NvbmZpZy9zY2hlbWEnXG5pbXBvcnQge1xuICBjb21wb25lbnRTY2hlbWEsXG4gIGN1c3RvbVZpZXdTY2hlbWEsXG4gIGxpdmVQcmV2aWV3U2NoZW1hLFxufSBmcm9tICcuLi8uLi9jb25maWcvc2hhcmVkL2NvbXBvbmVudFNjaGVtYSdcblxuY29uc3QgZ2xvYmFsU2NoZW1hID0gam9pXG4gIC5vYmplY3QoKVxuICAua2V5cyh7XG4gICAgc2x1Zzogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgYWNjZXNzOiBqb2kub2JqZWN0KHtcbiAgICAgIHJlYWQ6IGpvaS5mdW5jKCksXG4gICAgICByZWFkVmVyc2lvbnM6IGpvaS5mdW5jKCksXG4gICAgICB1cGRhdGU6IGpvaS5mdW5jKCksXG4gICAgfSksXG4gICAgYWRtaW46IGpvaS5vYmplY3Qoe1xuICAgICAgY29tcG9uZW50czogam9pLm9iamVjdCh7XG4gICAgICAgIGVsZW1lbnRzOiBqb2kub2JqZWN0KHtcbiAgICAgICAgICBQcmV2aWV3QnV0dG9uOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICAgICAgUHVibGlzaEJ1dHRvbjogY29tcG9uZW50U2NoZW1hLFxuICAgICAgICAgIFNhdmVCdXR0b246IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgICAgICBTYXZlRHJhZnRCdXR0b246IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgICAgfSksXG4gICAgICAgIHZpZXdzOiBqb2kub2JqZWN0KHtcbiAgICAgICAgICBFZGl0OiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KFxuICAgICAgICAgICAgY29tcG9uZW50U2NoZW1hLFxuICAgICAgICAgICAgam9pLm9iamVjdCh7XG4gICAgICAgICAgICAgIEFQSTogam9pLmFsdGVybmF0aXZlcygpLnRyeShjb21wb25lbnRTY2hlbWEsIGN1c3RvbVZpZXdTY2hlbWEpLFxuICAgICAgICAgICAgICBEZWZhdWx0OiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGNvbXBvbmVudFNjaGVtYSwgY3VzdG9tVmlld1NjaGVtYSksXG4gICAgICAgICAgICAgIFByZXZpZXc6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoY29tcG9uZW50U2NoZW1hLCBjdXN0b21WaWV3U2NoZW1hKSxcbiAgICAgICAgICAgICAgVmVyc2lvbjogam9pLmFsdGVybmF0aXZlcygpLnRyeShjb21wb25lbnRTY2hlbWEsIGN1c3RvbVZpZXdTY2hlbWEpLFxuICAgICAgICAgICAgICBWZXJzaW9uczogam9pLmFsdGVybmF0aXZlcygpLnRyeShjb21wb25lbnRTY2hlbWEsIGN1c3RvbVZpZXdTY2hlbWEpLFxuICAgICAgICAgICAgICAvLyBSZWxhdGlvbnNoaXBzXG4gICAgICAgICAgICAgIC8vIFJlZmVyZW5jZXNcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICksXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgICBkZXNjcmlwdGlvbjogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kuc3RyaW5nKCksIGNvbXBvbmVudFNjaGVtYSksXG4gICAgICBmb3JjZVJlbmRlckFsbEZpZWxkczogam9pLmJvb2xlYW4oKSxcbiAgICAgIGdyb3VwOiBqb2lcbiAgICAgICAgLmFsdGVybmF0aXZlcygpXG4gICAgICAgIC50cnkoam9pLnN0cmluZygpLCBqb2kub2JqZWN0KCkucGF0dGVybihqb2kuc3RyaW5nKCksIFtqb2kuc3RyaW5nKCldKSksXG4gICAgICBoaWRkZW46IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLmJvb2xlYW4oKSwgam9pLmZ1bmMoKSksXG4gICAgICBoaWRlQVBJVVJMOiBqb2kuYm9vbGVhbigpLFxuICAgICAgbGl2ZVByZXZpZXc6IGpvaS5vYmplY3QobGl2ZVByZXZpZXdTY2hlbWEpLFxuICAgICAgcHJldmlldzogam9pLmZ1bmMoKSxcbiAgICB9KSxcbiAgICBjdXN0b206IGpvaS5vYmplY3QoKS5wYXR0ZXJuKGpvaS5zdHJpbmcoKSwgam9pLmFueSgpKSxcbiAgICBkYk5hbWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBqb2kuZnVuYygpKSxcbiAgICBlbmRwb2ludHM6IGVuZHBvaW50c1NjaGVtYSxcbiAgICBmaWVsZHM6IGpvaS5hcnJheSgpLFxuICAgIGdyYXBoUUw6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoXG4gICAgICBqb2kub2JqZWN0KCkua2V5cyh7XG4gICAgICAgIG5hbWU6IGpvaS5zdHJpbmcoKSxcbiAgICAgIH0pLFxuICAgICAgam9pLmJvb2xlYW4oKSxcbiAgICApLFxuICAgIGhvb2tzOiBqb2kub2JqZWN0KHtcbiAgICAgIGFmdGVyQ2hhbmdlOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuZnVuYygpKSxcbiAgICAgIGFmdGVyUmVhZDogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gICAgICBiZWZvcmVDaGFuZ2U6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5mdW5jKCkpLFxuICAgICAgYmVmb3JlUmVhZDogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gICAgICBiZWZvcmVWYWxpZGF0ZTogam9pLmFycmF5KCkuaXRlbXMoam9pLmZ1bmMoKSksXG4gICAgfSksXG4gICAgbGFiZWw6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBqb2kub2JqZWN0KCkucGF0dGVybihqb2kuc3RyaW5nKCksIFtqb2kuc3RyaW5nKCldKSksXG4gICAgdHlwZXNjcmlwdDogam9pLm9iamVjdCgpLmtleXMoe1xuICAgICAgaW50ZXJmYWNlOiBqb2kuc3RyaW5nKCksXG4gICAgfSksXG4gICAgdmVyc2lvbnM6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoXG4gICAgICBqb2kub2JqZWN0KHtcbiAgICAgICAgZHJhZnRzOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KFxuICAgICAgICAgIGpvaS5vYmplY3Qoe1xuICAgICAgICAgICAgYXV0b3NhdmU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoXG4gICAgICAgICAgICAgIGpvaS5ib29sZWFuKCksXG4gICAgICAgICAgICAgIGpvaS5vYmplY3Qoe1xuICAgICAgICAgICAgICAgIGludGVydmFsOiBqb2kubnVtYmVyKCksXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHZhbGlkYXRlOiBqb2kuYm9vbGVhbigpLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGpvaS5ib29sZWFuKCksXG4gICAgICAgICksXG4gICAgICAgIG1heDogam9pLm51bWJlcigpLFxuICAgICAgfSksXG4gICAgICBqb2kuYm9vbGVhbigpLFxuICAgICksXG4gIH0pXG4gIC51bmtub3duKClcblxuZXhwb3J0IGRlZmF1bHQgZ2xvYmFsU2NoZW1hXG4iXSwibmFtZXMiOlsiZ2xvYmFsU2NoZW1hIiwiam9pIiwib2JqZWN0Iiwia2V5cyIsInNsdWciLCJzdHJpbmciLCJyZXF1aXJlZCIsImFjY2VzcyIsInJlYWQiLCJmdW5jIiwicmVhZFZlcnNpb25zIiwidXBkYXRlIiwiYWRtaW4iLCJjb21wb25lbnRzIiwiZWxlbWVudHMiLCJQcmV2aWV3QnV0dG9uIiwiY29tcG9uZW50U2NoZW1hIiwiUHVibGlzaEJ1dHRvbiIsIlNhdmVCdXR0b24iLCJTYXZlRHJhZnRCdXR0b24iLCJ2aWV3cyIsIkVkaXQiLCJhbHRlcm5hdGl2ZXMiLCJ0cnkiLCJBUEkiLCJjdXN0b21WaWV3U2NoZW1hIiwiRGVmYXVsdCIsIlByZXZpZXciLCJWZXJzaW9uIiwiVmVyc2lvbnMiLCJkZXNjcmlwdGlvbiIsImZvcmNlUmVuZGVyQWxsRmllbGRzIiwiYm9vbGVhbiIsImdyb3VwIiwicGF0dGVybiIsImhpZGRlbiIsImhpZGVBUElVUkwiLCJsaXZlUHJldmlldyIsImxpdmVQcmV2aWV3U2NoZW1hIiwicHJldmlldyIsImN1c3RvbSIsImFueSIsImRiTmFtZSIsImVuZHBvaW50cyIsImVuZHBvaW50c1NjaGVtYSIsImZpZWxkcyIsImFycmF5IiwiZ3JhcGhRTCIsIm5hbWUiLCJob29rcyIsImFmdGVyQ2hhbmdlIiwiaXRlbXMiLCJhZnRlclJlYWQiLCJiZWZvcmVDaGFuZ2UiLCJiZWZvcmVSZWFkIiwiYmVmb3JlVmFsaWRhdGUiLCJsYWJlbCIsInR5cGVzY3JpcHQiLCJpbnRlcmZhY2UiLCJ2ZXJzaW9ucyIsImRyYWZ0cyIsImF1dG9zYXZlIiwiaW50ZXJ2YWwiLCJudW1iZXIiLCJ2YWxpZGF0ZSIsIm1heCIsInVua25vd24iXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7K0JBNkZBOzs7ZUFBQTs7OzREQTdGZ0I7d0JBRWdCO2lDQUt6Qjs7Ozs7O0FBRVAsTUFBTUEsZUFBZUMsWUFBRyxDQUNyQkMsTUFBTSxHQUNOQyxJQUFJLENBQUM7SUFDSkMsTUFBTUgsWUFBRyxDQUFDSSxNQUFNLEdBQUdDLFFBQVE7SUFDM0JDLFFBQVFOLFlBQUcsQ0FBQ0MsTUFBTSxDQUFDO1FBQ2pCTSxNQUFNUCxZQUFHLENBQUNRLElBQUk7UUFDZEMsY0FBY1QsWUFBRyxDQUFDUSxJQUFJO1FBQ3RCRSxRQUFRVixZQUFHLENBQUNRLElBQUk7SUFDbEI7SUFDQUcsT0FBT1gsWUFBRyxDQUFDQyxNQUFNLENBQUM7UUFDaEJXLFlBQVlaLFlBQUcsQ0FBQ0MsTUFBTSxDQUFDO1lBQ3JCWSxVQUFVYixZQUFHLENBQUNDLE1BQU0sQ0FBQztnQkFDbkJhLGVBQWVDLGdDQUFlO2dCQUM5QkMsZUFBZUQsZ0NBQWU7Z0JBQzlCRSxZQUFZRixnQ0FBZTtnQkFDM0JHLGlCQUFpQkgsZ0NBQWU7WUFDbEM7WUFDQUksT0FBT25CLFlBQUcsQ0FBQ0MsTUFB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