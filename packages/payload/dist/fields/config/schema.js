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
    array: function() {
        return array;
    },
    baseAdminComponentFields: function() {
        return baseAdminComponentFields;
    },
    baseAdminFields: function() {
        return baseAdminFields;
    },
    baseField: function() {
        return baseField;
    },
    blocks: function() {
        return blocks;
    },
    checkbox: function() {
        return checkbox;
    },
    code: function() {
        return code;
    },
    collapsible: function() {
        return collapsible;
    },
    date: function() {
        return date;
    },
    default: function() {
        return _default;
    },
    email: function() {
        return email;
    },
    group: function() {
        return group;
    },
    idField: function() {
        return idField;
    },
    json: function() {
        return json;
    },
    number: function() {
        return number;
    },
    point: function() {
        return point;
    },
    radio: function() {
        return radio;
    },
    relationship: function() {
        return relationship;
    },
    richText: function() {
        return richText;
    },
    row: function() {
        return row;
    },
    select: function() {
        return select;
    },
    tabs: function() {
        return tabs;
    },
    text: function() {
        return text;
    },
    textarea: function() {
        return textarea;
    },
    ui: function() {
        return ui;
    },
    upload: function() {
        return upload;
    }
});
const _joi = /*#__PURE__*/ _interop_require_default(require("joi"));
const _componentSchema = require("../../config/shared/componentSchema");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const baseAdminComponentFields = _joi.default.object().keys({
    Cell: _componentSchema.componentSchema,
    Field: _componentSchema.componentSchema,
    Filter: _componentSchema.componentSchema
}).default({});
const baseAdminFields = _joi.default.object().keys({
    className: _joi.default.string(),
    components: baseAdminComponentFields,
    condition: _joi.default.func(),
    description: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
        _joi.default.string()
    ]), _componentSchema.componentSchema),
    disableBulkEdit: _joi.default.boolean().default(false),
    disableListColumn: _joi.default.boolean().default(false),
    disableListFilter: _joi.default.boolean().default(false),
    disabled: _joi.default.boolean().default(false),
    hidden: _joi.default.boolean().default(false),
    initCollapsed: _joi.default.boolean().default(false),
    position: _joi.default.string().valid('sidebar'),
    readOnly: _joi.default.boolean().default(false),
    style: _joi.default.object().unknown(),
    width: _joi.default.string()
});
const baseField = _joi.default.object().keys({
    access: _joi.default.object().keys({
        create: _joi.default.func(),
        read: _joi.default.func(),
        update: _joi.default.func()
    }),
    admin: baseAdminFields.default(),
    custom: _joi.default.object().pattern(_joi.default.string(), _joi.default.any()),
    hidden: _joi.default.boolean().default(false),
    hooks: _joi.default.object().keys({
        afterChange: _joi.default.array().items(_joi.default.func()).default([]),
        afterRead: _joi.default.array().items(_joi.default.func()).default([]),
        beforeChange: _joi.default.array().items(_joi.default.func()).default([]),
        beforeValidate: _joi.default.array().items(_joi.default.func()).default([])
    }).default(),
    index: _joi.default.boolean().default(false),
    label: _joi.default.alternatives().try(_joi.default.object().pattern(_joi.default.string(), [
        _joi.default.string()
    ]), _joi.default.string(), _joi.default.valid(false)),
    localized: _joi.default.boolean().default(false),
    required: _joi.default.boolean().default(false),
    saveToJWT: _joi.default.alternatives().try(_joi.default.boolean(), _joi.default.string()).default(false),
    unique: _joi.default.boolean().default(false),
    validate: _joi.default.func()
}).default();
const idField = baseField.keys({
    name: _joi.default.string().valid('id'),
    type: _joi.default.string().valid('text', 'number'),
    localized: _joi.default.invalid(true),
    required: _joi.default.not(false, 0).default(true)
});
const text = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('text').required(),
    admin: baseAdminFields.keys({
        autoComplete: _joi.default.string(),
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema,
            afterInput: _joi.default.array().items(_componentSchema.componentSchema),
            beforeInput: _joi.default.array().items(_componentSchema.componentSchema)
        }),
        placeholder: _joi.default.alternatives().try(_joi.default.object().pattern(_joi.default.string(), [
            _joi.default.string()
        ]), _joi.default.string()),
        rtl: _joi.default.boolean()
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.string().allow(''), _joi.default.func()),
    hasMany: _joi.default.boolean().default(false),
    maxLength: _joi.default.number(),
    maxRows: _joi.default.number().when('hasMany', {
        is: _joi.default.not(true),
        then: _joi.default.forbidden()
    }),
    minLength: _joi.default.number(),
    minRows: _joi.default.number().when('hasMany', {
        is: _joi.default.not(true),
        then: _joi.default.forbidden()
    })
});
const number = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('number').required(),
    admin: baseAdminFields.keys({
        autoComplete: _joi.default.string(),
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema,
            afterInput: _joi.default.array().items(_componentSchema.componentSchema).when('hasMany', {
                not: true,
                otherwise: _joi.default.forbidden()
            }),
            beforeInput: _joi.default.array().items(_componentSchema.componentSchema).when('hasMany', {
                not: true,
                otherwise: _joi.default.forbidden()
            })
        }),
        placeholder: _joi.default.string(),
        step: _joi.default.number()
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.number(), _joi.default.func(), _joi.default.array().when('hasMany', {
        not: true,
        then: _joi.default.forbidden()
    })),
    hasMany: _joi.default.boolean().default(false),
    max: _joi.default.number(),
    maxRows: _joi.default.number().when('hasMany', {
        is: _joi.default.not(true),
        then: _joi.default.forbidden()
    }),
    min: _joi.default.number(),
    minRows: _joi.default.number().when('hasMany', {
        is: _joi.default.not(true),
        then: _joi.default.forbidden()
    })
});
const textarea = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('textarea').required(),
    admin: baseAdminFields.keys({
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema,
            afterInput: _joi.default.array().items(_componentSchema.componentSchema),
            beforeInput: _joi.default.array().items(_componentSchema.componentSchema)
        }),
        placeholder: _joi.default.string(),
        rows: _joi.default.number(),
        rtl: _joi.default.boolean()
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.string().allow(''), _joi.default.func()),
    maxLength: _joi.default.number(),
    minLength: _joi.default.number()
});
const email = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('email').required(),
    admin: baseAdminFields.keys({
        autoComplete: _joi.default.string(),
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema,
            afterInput: _joi.default.array().items(_componentSchema.componentSchema),
            beforeInput: _joi.default.array().items(_componentSchema.componentSchema)
        }),
        placeholder: _joi.default.string()
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.string().allow(''), _joi.default.func()),
    maxLength: _joi.default.number(),
    minLength: _joi.default.number()
});
const code = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('code').required(),
    admin: baseAdminFields.keys({
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema
        }),
        editorOptions: _joi.default.object().unknown(),
        language: _joi.default.string()
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.string().allow(''), _joi.default.func())
});
const json = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('json').required(),
    admin: baseAdminFields.keys({
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema
        }),
        editorOptions: _joi.default.object().unknown()
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.array(), _joi.default.func(), _joi.default.object()),
    jsonSchema: _joi.default.object().unknown()
});
const select = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('select').required(),
    admin: baseAdminFields.keys({
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema
        }),
        isClearable: _joi.default.boolean().default(false),
        isSortable: _joi.default.boolean().default(false)
    }),
    dbName: _joi.default.alternatives().try(_joi.default.string(), _joi.default.func()),
    defaultValue: _joi.default.alternatives().try(_joi.default.string().allow(''), _joi.default.array().items(_joi.default.string().allow('')), _joi.default.func()),
    enumName: _joi.default.alternatives().try(_joi.default.string(), _joi.default.func()),
    hasMany: _joi.default.boolean().default(false),
    options: _joi.default.array().min(1).items(_joi.default.alternatives().try(_joi.default.string(), _joi.default.object({
        label: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
            _joi.default.string()
        ])),
        value: _joi.default.string().required().allow('')
    }))).required()
});
const radio = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('radio').required(),
    admin: baseAdminFields.keys({
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema
        }),
        layout: _joi.default.string().valid('vertical', 'horizontal')
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.string().allow(''), _joi.default.func()),
    enumName: _joi.default.alternatives().try(_joi.default.string(), _joi.default.func()),
    options: _joi.default.array().min(1).items(_joi.default.alternatives().try(_joi.default.string(), _joi.default.object({
        label: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
            _joi.default.string()
        ])).required(),
        value: _joi.default.string().required().allow('')
    }))).required()
});
const row = baseField.keys({
    type: _joi.default.string().valid('row').required(),
    admin: baseAdminFields.default(),
    fields: _joi.default.array().items(_joi.default.link('#field'))
});
const collapsible = baseField.keys({
    type: _joi.default.string().valid('collapsible').required(),
    admin: baseAdminFields.default(),
    fields: _joi.default.array().items(_joi.default.link('#field')),
    label: _joi.default.alternatives().try(_joi.default.string(), _componentSchema.componentSchema)
});
const tab = baseField.keys({
    name: _joi.default.string().when('localized', {
        is: _joi.default.exist(),
        then: _joi.default.required()
    }),
    description: _joi.default.alternatives().try(_joi.default.string(), _componentSchema.componentSchema),
    fields: _joi.default.array().items(_joi.default.link('#field')).required(),
    interfaceName: _joi.default.string().when('name', {
        not: _joi.default.exist(),
        then: _joi.default.forbidden()
    }),
    label: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
        _joi.default.string()
    ])).when('name', {
        is: _joi.default.not(),
        then: _joi.default.required()
    }),
    localized: _joi.default.boolean(),
    saveToJWT: _joi.default.alternatives().try(_joi.default.boolean(), _joi.default.string())
});
const tabs = baseField.keys({
    type: _joi.default.string().valid('tabs').required(),
    admin: baseAdminFields.keys({
        description: _joi.default.forbidden()
    }),
    fields: _joi.default.forbidden(),
    localized: _joi.default.forbidden(),
    tabs: _joi.default.array().items(tab).required()
});
const group = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('group').required(),
    admin: baseAdminFields.keys({
        hideGutter: _joi.default.boolean().default(true)
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.object(), _joi.default.func()),
    fields: _joi.default.array().items(_joi.default.link('#field')),
    interfaceName: _joi.default.string()
});
const array = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('array').required(),
    admin: baseAdminFields.keys({
        components: baseAdminComponentFields.keys({
            RowLabel: _componentSchema.componentSchema
        }).default({}),
        isSortable: _joi.default.boolean()
    }).default({}),
    dbName: _joi.default.alternatives().try(_joi.default.string(), _joi.default.func()),
    defaultValue: _joi.default.alternatives().try(_joi.default.array().items(_joi.default.object()), _joi.default.func()),
    fields: _joi.default.array().items(_joi.default.link('#field')).required(),
    interfaceName: _joi.default.string(),
    labels: _joi.default.object({
        plural: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
            _joi.default.string()
        ])),
        singular: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
            _joi.default.string()
        ]))
    }),
    maxRows: _joi.default.number(),
    minRows: _joi.default.number()
});
const upload = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('upload').required(),
    admin: baseAdminFields.keys({
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema
        })
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.object(), _joi.default.func()),
    displayPreview: _joi.default.boolean().default(false),
    filterOptions: _joi.default.alternatives().try(_joi.default.object(), _joi.default.func()),
    maxDepth: _joi.default.number(),
    relationTo: _joi.default.string().required()
});
const checkbox = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('checkbox').required(),
    admin: baseAdminFields.keys({
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema,
            afterInput: _joi.default.array().items(_componentSchema.componentSchema),
            beforeInput: _joi.default.array().items(_componentSchema.componentSchema)
        })
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.boolean(), _joi.default.func())
});
const point = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('point').required(),
    admin: baseAdminFields.keys({
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema,
            afterInput: _joi.default.array().items(_componentSchema.componentSchema),
            beforeInput: _joi.default.array().items(_componentSchema.componentSchema)
        })
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.array().items(_joi.default.number()).max(2).min(2), _joi.default.func())
});
const relationship = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('relationship').required(),
    admin: baseAdminFields.keys({
        allowCreate: _joi.default.boolean().default(true),
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema
        }),
        isSortable: _joi.default.boolean().default(false),
        sortOptions: _joi.default.alternatives().conditional(_joi.default.ref('...relationTo'), {
            is: _joi.default.string(),
            otherwise: _joi.default.object().pattern(_joi.default.string(), _joi.default.string()),
            then: _joi.default.string()
        })
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.func()),
    filterOptions: _joi.default.alternatives().try(_joi.default.object(), _joi.default.func()),
    hasMany: _joi.default.boolean().default(false),
    max: _joi.default.number().when('hasMany', {
        is: _joi.default.not(true),
        then: _joi.default.forbidden()
    }).warning('deprecated', {
        message: 'Use maxRows instead.'
    }),
    maxDepth: _joi.default.number(),
    maxRows: _joi.default.number().when('hasMany', {
        is: _joi.default.not(true),
        then: _joi.default.forbidden()
    }),
    min: _joi.default.number().when('hasMany', {
        is: _joi.default.not(true),
        then: _joi.default.forbidden()
    }).warning('deprecated', {
        message: 'Use minRows instead.'
    }),
    minRows: _joi.default.number().when('hasMany', {
        is: _joi.default.not(true),
        then: _joi.default.forbidden()
    }),
    relationTo: _joi.default.alternatives().try(_joi.default.string().required(), _joi.default.array().items(_joi.default.string()))
});
const blocks = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('blocks').required(),
    admin: baseAdminFields.keys({
        isSortable: _joi.default.boolean()
    }).default({}),
    blocks: _joi.default.array().items(_joi.default.object({
        slug: _joi.default.string().required(),
        custom: _joi.default.object().pattern(_joi.default.string(), _joi.default.any()),
        dbName: _joi.default.alternatives().try(_joi.default.string(), _joi.default.func()),
        fields: _joi.default.array().items(_joi.default.link('#field')),
        graphQL: _joi.default.object().keys({
            singularName: _joi.default.string()
        }),
        imageAltText: _joi.default.string(),
        imageURL: _joi.default.string(),
        interfaceName: _joi.default.string(),
        labels: _joi.default.object({
            plural: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
                _joi.default.string()
            ])),
            singular: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
                _joi.default.string()
            ]))
        })
    })).required(),
    defaultValue: _joi.default.alternatives().try(_joi.default.array().items(_joi.default.object()), _joi.default.func()),
    labels: _joi.default.object({
        plural: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
            _joi.default.string()
        ])),
        singular: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
            _joi.default.string()
        ]))
    }),
    maxRows: _joi.default.number(),
    minRows: _joi.default.number()
});
const richText = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('richText').required(),
    admin: baseAdminFields.keys({
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema
        })
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.array().items(_joi.default.object()), _joi.default.func(), _joi.default.object()),
    editor: _joi.default.object().keys({
        CellComponent: _componentSchema.componentSchema.optional(),
        FieldComponent: _componentSchema.componentSchema.optional(),
        LazyCellComponent: _joi.default.func().optional(),
        LazyFieldComponent: _joi.default.func().optional(),
        afterReadPromise: _joi.default.func().optional(),
        outputSchema: _joi.default.func().optional(),
        populationPromise: _joi.default.func().optional(),
        validate: _joi.default.func().required()
    }).unknown(),
    maxDepth: _joi.default.number()
});
const date = baseField.keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('date').required(),
    admin: baseAdminFields.keys({
        components: baseAdminComponentFields.keys({
            Error: _componentSchema.componentSchema,
            Label: _componentSchema.componentSchema,
            afterInput: _joi.default.array().items(_componentSchema.componentSchema),
            beforeInput: _joi.default.array().items(_componentSchema.componentSchema)
        }),
        date: _joi.default.object({
            displayFormat: _joi.default.string(),
            maxDate: _joi.default.date(),
            maxTime: _joi.default.date(),
            minDate: _joi.default.date(),
            minTime: _joi.default.date(),
            monthsToShow: _joi.default.number(),
            overrides: _joi.default.object().unknown(),
            pickerAppearance: _joi.default.string(),
            timeFormat: _joi.default.string(),
            timeIntervals: _joi.default.number()
        }),
        placeholder: _joi.default.string()
    }),
    defaultValue: _joi.default.alternatives().try(_joi.default.string(), _joi.default.func())
});
const ui = _joi.default.object().keys({
    name: _joi.default.string().required(),
    type: _joi.default.string().valid('ui').required(),
    admin: _joi.default.object().keys({
        components: _joi.default.object().keys({
            Cell: _componentSchema.componentSchema,
            Field: _componentSchema.componentSchema
        }).default({}),
        condition: _joi.default.func(),
        disableListColumn: _joi.default.boolean().default(false),
        position: _joi.default.string().valid('sidebar'),
        width: _joi.default.string()
    }).default(),
    custom: _joi.default.object().pattern(_joi.default.string(), _joi.default.any()),
    label: _joi.default.alternatives().try(_joi.default.string(), _joi.default.object().pattern(_joi.default.string(), [
        _joi.default.string()
    ]))
});
const fieldSchema = _joi.default.alternatives().try(text, number, textarea, email, code, json, select, group, array, row, collapsible, tabs, radio, relationship, checkbox, upload, richText, blocks, date, point, ui).id('field');
const _default = fieldSchema;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9maWVsZHMvY29uZmlnL3NjaGVtYS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgam9pIGZyb20gJ2pvaSdcblxuaW1wb3J0IHsgY29tcG9uZW50U2NoZW1hIH0gZnJvbSAnLi4vLi4vY29uZmlnL3NoYXJlZC9jb21wb25lbnRTY2hlbWEnXG5cbmV4cG9ydCBjb25zdCBiYXNlQWRtaW5Db21wb25lbnRGaWVsZHMgPSBqb2lcbiAgLm9iamVjdCgpXG4gIC5rZXlzKHtcbiAgICBDZWxsOiBjb21wb25lbnRTY2hlbWEsXG4gICAgRmllbGQ6IGNvbXBvbmVudFNjaGVtYSxcbiAgICBGaWx0ZXI6IGNvbXBvbmVudFNjaGVtYSxcbiAgfSlcbiAgLmRlZmF1bHQoe30pXG5cbmV4cG9ydCBjb25zdCBiYXNlQWRtaW5GaWVsZHMgPSBqb2kub2JqZWN0KCkua2V5cyh7XG4gIGNsYXNzTmFtZTogam9pLnN0cmluZygpLFxuICBjb21wb25lbnRzOiBiYXNlQWRtaW5Db21wb25lbnRGaWVsZHMsXG4gIGNvbmRpdGlvbjogam9pLmZ1bmMoKSxcbiAgZGVzY3JpcHRpb246IGpvaVxuICAgIC5hbHRlcm5hdGl2ZXMoKVxuICAgIC50cnkoam9pLnN0cmluZygpLCBqb2kub2JqZWN0KCkucGF0dGVybihqb2kuc3RyaW5nKCksIFtqb2kuc3RyaW5nKCldKSwgY29tcG9uZW50U2NoZW1hKSxcbiAgZGlzYWJsZUJ1bGtFZGl0OiBqb2kuYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLFxuICBkaXNhYmxlTGlzdENvbHVtbjogam9pLmJvb2xlYW4oKS5kZWZhdWx0KGZhbHNlKSxcbiAgZGlzYWJsZUxpc3RGaWx0ZXI6IGpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gIGRpc2FibGVkOiBqb2kuYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLFxuICBoaWRkZW46IGpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gIGluaXRDb2xsYXBzZWQ6IGpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gIHBvc2l0aW9uOiBqb2kuc3RyaW5nKCkudmFsaWQoJ3NpZGViYXInKSxcbiAgcmVhZE9ubHk6IGpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gIHN0eWxlOiBqb2kub2JqZWN0KCkudW5rbm93bigpLFxuICB3aWR0aDogam9pLnN0cmluZygpLFxufSlcblxuZXhwb3J0IGNvbnN0IGJhc2VGaWVsZCA9IGpvaVxuICAub2JqZWN0KClcbiAgLmtleXMoe1xuICAgIGFjY2Vzczogam9pLm9iamVjdCgpLmtleXMoe1xuICAgICAgY3JlYXRlOiBqb2kuZnVuYygpLFxuICAgICAgcmVhZDogam9pLmZ1bmMoKSxcbiAgICAgIHVwZGF0ZTogam9pLmZ1bmMoKSxcbiAgICB9KSxcbiAgICBhZG1pbjogYmFzZUFkbWluRmllbGRzLmRlZmF1bHQoKSxcbiAgICBjdXN0b206IGpvaS5vYmplY3QoKS5wYXR0ZXJuKGpvaS5zdHJpbmcoKSwgam9pLmFueSgpKSxcbiAgICBoaWRkZW46IGpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gICAgaG9va3M6IGpvaVxuICAgICAgLm9iamVjdCgpXG4gICAgICAua2V5cyh7XG4gICAgICAgIGFmdGVyQ2hhbmdlOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuZnVuYygpKS5kZWZhdWx0KFtdKSxcbiAgICAgICAgYWZ0ZXJSZWFkOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuZnVuYygpKS5kZWZhdWx0KFtdKSxcbiAgICAgICAgYmVmb3JlQ2hhbmdlOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuZnVuYygpKS5kZWZhdWx0KFtdKSxcbiAgICAgICAgYmVmb3JlVmFsaWRhdGU6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5mdW5jKCkpLmRlZmF1bHQoW10pLFxuICAgICAgfSlcbiAgICAgIC5kZWZhdWx0KCksXG4gICAgaW5kZXg6IGpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gICAgbGFiZWw6IGpvaVxuICAgICAgLmFsdGVybmF0aXZlcygpXG4gICAgICAudHJ5KGpvaS5vYmplY3QoKS5wYXR0ZXJuKGpvaS5zdHJpbmcoKSwgW2pvaS5zdHJpbmcoKV0pLCBqb2kuc3RyaW5nKCksIGpvaS52YWxpZChmYWxzZSkpLFxuICAgIGxvY2FsaXplZDogam9pLmJvb2xlYW4oKS5kZWZhdWx0KGZhbHNlKSxcbiAgICByZXF1aXJlZDogam9pLmJvb2xlYW4oKS5kZWZhdWx0KGZhbHNlKSxcbiAgICBzYXZlVG9KV1Q6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLmJvb2xlYW4oKSwgam9pLnN0cmluZygpKS5kZWZhdWx0KGZhbHNlKSxcbiAgICB1bmlxdWU6IGpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gICAgdmFsaWRhdGU6IGpvaS5mdW5jKCksXG4gIH0pXG4gIC5kZWZhdWx0KClcblxuZXhwb3J0IGNvbnN0IGlkRmllbGQgPSBiYXNlRmllbGQua2V5cyh7XG4gIG5hbWU6IGpvaS5zdHJpbmcoKS52YWxpZCgnaWQnKSxcbiAgdHlwZTogam9pLnN0cmluZygpLnZhbGlkKCd0ZXh0JywgJ251bWJlcicpLFxuICBsb2NhbGl6ZWQ6IGpvaS5pbnZhbGlkKHRydWUpLFxuICByZXF1aXJlZDogam9pLm5vdChmYWxzZSwgMCkuZGVmYXVsdCh0cnVlKSxcbn0pXG5cbmV4cG9ydCBjb25zdCB0ZXh0ID0gYmFzZUZpZWxkLmtleXMoe1xuICBuYW1lOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgdHlwZTogam9pLnN0cmluZygpLnZhbGlkKCd0ZXh0JykucmVxdWlyZWQoKSxcbiAgYWRtaW46IGJhc2VBZG1pbkZpZWxkcy5rZXlzKHtcbiAgICBhdXRvQ29tcGxldGU6IGpvaS5zdHJpbmcoKSxcbiAgICBjb21wb25lbnRzOiBiYXNlQWRtaW5Db21wb25lbnRGaWVsZHMua2V5cyh7XG4gICAgICBFcnJvcjogY29tcG9uZW50U2NoZW1hLFxuICAgICAgTGFiZWw6IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgIGFmdGVySW5wdXQ6IGpvaS5hcnJheSgpLml0ZW1zKGNvbXBvbmVudFNjaGVtYSksXG4gICAgICBiZWZvcmVJbnB1dDogam9pLmFycmF5KCkuaXRlbXMoY29tcG9uZW50U2NoZW1hKSxcbiAgICB9KSxcbiAgICBwbGFjZWhvbGRlcjogam9pXG4gICAgICAuYWx0ZXJuYXRpdmVzKClcbiAgICAgIC50cnkoam9pLm9iamVjdCgpLnBhdHRlcm4oam9pLnN0cmluZygpLCBbam9pLnN0cmluZygpXSksIGpvaS5zdHJpbmcoKSksXG4gICAgcnRsOiBqb2kuYm9vbGVhbigpLFxuICB9KSxcbiAgZGVmYXVsdFZhbHVlOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5zdHJpbmcoKS5hbGxvdygnJyksIGpvaS5mdW5jKCkpLFxuICBoYXNNYW55OiBqb2kuYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLFxuICBtYXhMZW5ndGg6IGpvaS5udW1iZXIoKSxcbiAgbWF4Um93czogam9pLm51bWJlcigpLndoZW4oJ2hhc01hbnknLCB7IGlzOiBqb2kubm90KHRydWUpLCB0aGVuOiBqb2kuZm9yYmlkZGVuKCkgfSksXG4gIG1pbkxlbmd0aDogam9pLm51bWJlcigpLFxuICBtaW5Sb3dzOiBqb2kubnVtYmVyKCkud2hlbignaGFzTWFueScsIHsgaXM6IGpvaS5ub3QodHJ1ZSksIHRoZW46IGpvaS5mb3JiaWRkZW4oKSB9KSxcbn0pXG5cbmV4cG9ydCBjb25zdCBudW1iZXIgPSBiYXNlRmllbGQua2V5cyh7XG4gIG5hbWU6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICB0eXBlOiBqb2kuc3RyaW5nKCkudmFsaWQoJ251bWJlcicpLnJlcXVpcmVkKCksXG4gIGFkbWluOiBiYXNlQWRtaW5GaWVsZHMua2V5cyh7XG4gICAgYXV0b0NvbXBsZXRlOiBqb2kuc3RyaW5nKCksXG4gICAgY29tcG9uZW50czogYmFzZUFkbWluQ29tcG9uZW50RmllbGRzLmtleXMoe1xuICAgICAgRXJyb3I6IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgIExhYmVsOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICBhZnRlcklucHV0OiBqb2lcbiAgICAgICAgLmFycmF5KClcbiAgICAgICAgLml0ZW1zKGNvbXBvbmVudFNjaGVtYSlcbiAgICAgICAgLndoZW4oJ2hhc01hbnknLCB7IG5vdDogdHJ1ZSwgb3RoZXJ3aXNlOiBqb2kuZm9yYmlkZGVuKCkgfSksXG4gICAgICBiZWZvcmVJbnB1dDogam9pXG4gICAgICAgIC5hcnJheSgpXG4gICAgICAgIC5pdGVtcyhjb21wb25lbnRTY2hlbWEpXG4gICAgICAgIC53aGVuKCdoYXNNYW55JywgeyBub3Q6IHRydWUsIG90aGVyd2lzZTogam9pLmZvcmJpZGRlbigpIH0pLFxuICAgIH0pLFxuICAgIHBsYWNlaG9sZGVyOiBqb2kuc3RyaW5nKCksXG4gICAgc3RlcDogam9pLm51bWJlcigpLFxuICB9KSxcbiAgZGVmYXVsdFZhbHVlOiBqb2lcbiAgICAuYWx0ZXJuYXRpdmVzKClcbiAgICAudHJ5KFxuICAgICAgam9pLm51bWJlcigpLFxuICAgICAgam9pLmZ1bmMoKSxcbiAgICAgIGpvaS5hcnJheSgpLndoZW4oJ2hhc01hbnknLCB7IG5vdDogdHJ1ZSwgdGhlbjogam9pLmZvcmJpZGRlbigpIH0pLFxuICAgICksXG4gIGhhc01hbnk6IGpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gIG1heDogam9pLm51bWJlcigpLFxuICBtYXhSb3dzOiBqb2kubnVtYmVyKCkud2hlbignaGFzTWFueScsIHsgaXM6IGpvaS5ub3QodHJ1ZSksIHRoZW46IGpvaS5mb3JiaWRkZW4oKSB9KSxcbiAgbWluOiBqb2kubnVtYmVyKCksXG4gIG1pblJvd3M6IGpvaS5udW1iZXIoKS53aGVuKCdoYXNNYW55JywgeyBpczogam9pLm5vdCh0cnVlKSwgdGhlbjogam9pLmZvcmJpZGRlbigpIH0pLFxufSlcblxuZXhwb3J0IGNvbnN0IHRleHRhcmVhID0gYmFzZUZpZWxkLmtleXMoe1xuICBuYW1lOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgdHlwZTogam9pLnN0cmluZygpLnZhbGlkKCd0ZXh0YXJlYScpLnJlcXVpcmVkKCksXG4gIGFkbWluOiBiYXNlQWRtaW5GaWVsZHMua2V5cyh7XG4gICAgY29tcG9uZW50czogYmFzZUFkbWluQ29tcG9uZW50RmllbGRzLmtleXMoe1xuICAgICAgRXJyb3I6IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgIExhYmVsOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICBhZnRlcklucHV0OiBqb2kuYXJyYXkoKS5pdGVtcyhjb21wb25lbnRTY2hlbWEpLFxuICAgICAgYmVmb3JlSW5wdXQ6IGpvaS5hcnJheSgpLml0ZW1zKGNvbXBvbmVudFNjaGVtYSksXG4gICAgfSksXG4gICAgcGxhY2Vob2xkZXI6IGpvaS5zdHJpbmcoKSxcbiAgICByb3dzOiBqb2kubnVtYmVyKCksXG4gICAgcnRsOiBqb2kuYm9vbGVhbigpLFxuICB9KSxcbiAgZGVmYXVsdFZhbHVlOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5zdHJpbmcoKS5hbGxvdygnJyksIGpvaS5mdW5jKCkpLFxuICBtYXhMZW5ndGg6IGpvaS5udW1iZXIoKSxcbiAgbWluTGVuZ3RoOiBqb2kubnVtYmVyKCksXG59KVxuXG5leHBvcnQgY29uc3QgZW1haWwgPSBiYXNlRmllbGQua2V5cyh7XG4gIG5hbWU6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICB0eXBlOiBqb2kuc3RyaW5nKCkudmFsaWQoJ2VtYWlsJykucmVxdWlyZWQoKSxcbiAgYWRtaW46IGJhc2VBZG1pbkZpZWxkcy5rZXlzKHtcbiAgICBhdXRvQ29tcGxldGU6IGpvaS5zdHJpbmcoKSxcbiAgICBjb21wb25lbnRzOiBiYXNlQWRtaW5Db21wb25lbnRGaWVsZHMua2V5cyh7XG4gICAgICBFcnJvcjogY29tcG9uZW50U2NoZW1hLFxuICAgICAgTGFiZWw6IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgIGFmdGVySW5wdXQ6IGpvaS5hcnJheSgpLml0ZW1zKGNvbXBvbmVudFNjaGVtYSksXG4gICAgICBiZWZvcmVJbnB1dDogam9pLmFycmF5KCkuaXRlbXMoY29tcG9uZW50U2NoZW1hKSxcbiAgICB9KSxcbiAgICBwbGFjZWhvbGRlcjogam9pLnN0cmluZygpLFxuICB9KSxcbiAgZGVmYXVsdFZhbHVlOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5zdHJpbmcoKS5hbGxvdygnJyksIGpvaS5mdW5jKCkpLFxuICBtYXhMZW5ndGg6IGpvaS5udW1iZXIoKSxcbiAgbWluTGVuZ3RoOiBqb2kubnVtYmVyKCksXG59KVxuXG5leHBvcnQgY29uc3QgY29kZSA9IGJhc2VGaWVsZC5rZXlzKHtcbiAgbmFtZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIHR5cGU6IGpvaS5zdHJpbmcoKS52YWxpZCgnY29kZScpLnJlcXVpcmVkKCksXG4gIGFkbWluOiBiYXNlQWRtaW5GaWVsZHMua2V5cyh7XG4gICAgY29tcG9uZW50czogYmFzZUFkbWluQ29tcG9uZW50RmllbGRzLmtleXMoe1xuICAgICAgRXJyb3I6IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgIExhYmVsOiBjb21wb25lbnRTY2hlbWEsXG4gICAgfSksXG4gICAgZWRpdG9yT3B0aW9uczogam9pLm9iamVjdCgpLnVua25vd24oKSwgLy8gRWRpdG9yWydvcHRpb25zJ10gQG1vbmFjby1lZGl0b3IvcmVhY3RcbiAgICBsYW5ndWFnZTogam9pLnN0cmluZygpLFxuICB9KSxcbiAgZGVmYXVsdFZhbHVlOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5zdHJpbmcoKS5hbGxvdygnJyksIGpvaS5mdW5jKCkpLFxufSlcblxuZXhwb3J0IGNvbnN0IGpzb24gPSBiYXNlRmllbGQua2V5cyh7XG4gIG5hbWU6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICB0eXBlOiBqb2kuc3RyaW5nKCkudmFsaWQoJ2pzb24nKS5yZXF1aXJlZCgpLFxuICBhZG1pbjogYmFzZUFkbWluRmllbGRzLmtleXMoe1xuICAgIGNvbXBvbmVudHM6IGJhc2VBZG1pbkNvbXBvbmVudEZpZWxkcy5rZXlzKHtcbiAgICAgIEVycm9yOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICBMYWJlbDogY29tcG9uZW50U2NoZW1hLFxuICAgIH0pLFxuICAgIGVkaXRvck9wdGlvbnM6IGpvaS5vYmplY3QoKS51bmtub3duKCksIC8vIEVkaXRvclsnb3B0aW9ucyddIEBtb25hY28tZWRpdG9yL3JlYWN0XG4gIH0pLFxuICBkZWZhdWx0VmFsdWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLmFycmF5KCksIGpvaS5mdW5jKCksIGpvaS5vYmplY3QoKSksXG4gIGpzb25TY2hlbWE6IGpvaS5vYmplY3QoKS51bmtub3duKCksXG59KVxuXG5leHBvcnQgY29uc3Qgc2VsZWN0ID0gYmFzZUZpZWxkLmtleXMoe1xuICBuYW1lOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgdHlwZTogam9pLnN0cmluZygpLnZhbGlkKCdzZWxlY3QnKS5yZXF1aXJlZCgpLFxuICBhZG1pbjogYmFzZUFkbWluRmllbGRzLmtleXMoe1xuICAgIGNvbXBvbmVudHM6IGJhc2VBZG1pbkNvbXBvbmVudEZpZWxkcy5rZXlzKHtcbiAgICAgIEVycm9yOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICBMYWJlbDogY29tcG9uZW50U2NoZW1hLFxuICAgIH0pLFxuICAgIGlzQ2xlYXJhYmxlOiBqb2kuYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLFxuICAgIGlzU29ydGFibGU6IGpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gIH0pLFxuICBkYk5hbWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBqb2kuZnVuYygpKSxcbiAgZGVmYXVsdFZhbHVlOiBqb2lcbiAgICAuYWx0ZXJuYXRpdmVzKClcbiAgICAudHJ5KGpvaS5zdHJpbmcoKS5hbGxvdygnJyksIGpvaS5hcnJheSgpLml0ZW1zKGpvaS5zdHJpbmcoKS5hbGxvdygnJykpLCBqb2kuZnVuYygpKSxcbiAgZW51bU5hbWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBqb2kuZnVuYygpKSxcbiAgaGFzTWFueTogam9pLmJvb2xlYW4oKS5kZWZhdWx0KGZhbHNlKSxcbiAgb3B0aW9uczogam9pXG4gICAgLmFycmF5KClcbiAgICAubWluKDEpXG4gICAgLml0ZW1zKFxuICAgICAgam9pLmFsdGVybmF0aXZlcygpLnRyeShcbiAgICAgICAgam9pLnN0cmluZygpLFxuICAgICAgICBqb2kub2JqZWN0KHtcbiAgICAgICAgICBsYWJlbDogam9pXG4gICAgICAgICAgICAuYWx0ZXJuYXRpdmVzKClcbiAgICAgICAgICAgIC50cnkoam9pLnN0cmluZygpLCBqb2kub2JqZWN0KCkucGF0dGVybihqb2kuc3RyaW5nKCksIFtqb2kuc3RyaW5nKCldKSksXG4gICAgICAgICAgdmFsdWU6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLmFsbG93KCcnKSxcbiAgICAgICAgfSksXG4gICAgICApLFxuICAgIClcbiAgICAucmVxdWlyZWQoKSxcbn0pXG5cbmV4cG9ydCBjb25zdCByYWRpbyA9IGJhc2VGaWVsZC5rZXlzKHtcbiAgbmFtZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIHR5cGU6IGpvaS5zdHJpbmcoKS52YWxpZCgncmFkaW8nKS5yZXF1aXJlZCgpLFxuICBhZG1pbjogYmFzZUFkbWluRmllbGRzLmtleXMoe1xuICAgIGNvbXBvbmVudHM6IGJhc2VBZG1pbkNvbXBvbmVudEZpZWxkcy5rZXlzKHtcbiAgICAgIEVycm9yOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICBMYWJlbDogY29tcG9uZW50U2NoZW1hLFxuICAgIH0pLFxuICAgIGxheW91dDogam9pLnN0cmluZygpLnZhbGlkKCd2ZXJ0aWNhbCcsICdob3Jpem9udGFsJyksXG4gIH0pLFxuICBkZWZhdWx0VmFsdWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLmFsbG93KCcnKSwgam9pLmZ1bmMoKSksXG4gIGVudW1OYW1lOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5zdHJpbmcoKSwgam9pLmZ1bmMoKSksXG4gIG9wdGlvbnM6IGpvaVxuICAgIC5hcnJheSgpXG4gICAgLm1pbigxKVxuICAgIC5pdGVtcyhcbiAgICAgIGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoXG4gICAgICAgIGpvaS5zdHJpbmcoKSxcbiAgICAgICAgam9pLm9iamVjdCh7XG4gICAgICAgICAgbGFiZWw6IGpvaVxuICAgICAgICAgICAgLmFsdGVybmF0aXZlcygpXG4gICAgICAgICAgICAudHJ5KGpvaS5zdHJpbmcoKSwgam9pLm9iamVjdCgpLnBhdHRlcm4oam9pLnN0cmluZygpLCBbam9pLnN0cmluZygpXSkpXG4gICAgICAgICAgICAucmVxdWlyZWQoKSxcbiAgICAgICAgICB2YWx1ZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCkuYWxsb3coJycpLFxuICAgICAgICB9KSxcbiAgICAgICksXG4gICAgKVxuICAgIC5yZXF1aXJlZCgpLFxufSlcblxuZXhwb3J0IGNvbnN0IHJvdyA9IGJhc2VGaWVsZC5rZXlzKHtcbiAgdHlwZTogam9pLnN0cmluZygpLnZhbGlkKCdyb3cnKS5yZXF1aXJlZCgpLFxuICBhZG1pbjogYmFzZUFkbWluRmllbGRzLmRlZmF1bHQoKSxcbiAgZmllbGRzOiBqb2kuYXJyYXkoKS5pdGVtcyhqb2kubGluaygnI2ZpZWxkJykpLFxufSlcblxuZXhwb3J0IGNvbnN0IGNvbGxhcHNpYmxlID0gYmFzZUZpZWxkLmtleXMoe1xuICB0eXBlOiBqb2kuc3RyaW5nKCkudmFsaWQoJ2NvbGxhcHNpYmxlJykucmVxdWlyZWQoKSxcbiAgYWRtaW46IGJhc2VBZG1pbkZpZWxkcy5kZWZhdWx0KCksXG4gIGZpZWxkczogam9pLmFycmF5KCkuaXRlbXMoam9pLmxpbmsoJyNmaWVsZCcpKSxcbiAgbGFiZWw6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBjb21wb25lbnRTY2hlbWEpLFxufSlcblxuY29uc3QgdGFiID0gYmFzZUZpZWxkLmtleXMoe1xuICBuYW1lOiBqb2kuc3RyaW5nKCkud2hlbignbG9jYWxpemVkJywgeyBpczogam9pLmV4aXN0KCksIHRoZW46IGpvaS5yZXF1aXJlZCgpIH0pLFxuICBkZXNjcmlwdGlvbjogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kuc3RyaW5nKCksIGNvbXBvbmVudFNjaGVtYSksXG4gIGZpZWxkczogam9pLmFycmF5KCkuaXRlbXMoam9pLmxpbmsoJyNmaWVsZCcpKS5yZXF1aXJlZCgpLFxuICBpbnRlcmZhY2VOYW1lOiBqb2kuc3RyaW5nKCkud2hlbignbmFtZScsIHsgbm90OiBqb2kuZXhpc3QoKSwgdGhlbjogam9pLmZvcmJpZGRlbigpIH0pLFxuICBsYWJlbDogam9pXG4gICAgLmFsdGVybmF0aXZlcygpXG4gICAgLnRyeShqb2kuc3RyaW5nKCksIGpvaS5vYmplY3QoKS5wYXR0ZXJuKGpvaS5zdHJpbmcoKSwgW2pvaS5zdHJpbmcoKV0pKVxuICAgIC53aGVuKCduYW1lJywgeyBpczogam9pLm5vdCgpLCB0aGVuOiBqb2kucmVxdWlyZWQoKSB9KSxcbiAgbG9jYWxpemVkOiBqb2kuYm9vbGVhbigpLFxuICBzYXZlVG9KV1Q6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLmJvb2xlYW4oKSwgam9pLnN0cmluZygpKSxcbn0pXG5cbmV4cG9ydCBjb25zdCB0YWJzID0gYmFzZUZpZWxkLmtleXMoe1xuICB0eXBlOiBqb2kuc3RyaW5nKCkudmFsaWQoJ3RhYnMnKS5yZXF1aXJlZCgpLFxuICBhZG1pbjogYmFzZUFkbWluRmllbGRzLmtleXMoe1xuICAgIGRlc2NyaXB0aW9uOiBqb2kuZm9yYmlkZGVuKCksXG4gIH0pLFxuICBmaWVsZHM6IGpvaS5mb3JiaWRkZW4oKSxcbiAgbG9jYWxpemVkOiBqb2kuZm9yYmlkZGVuKCksXG4gIHRhYnM6IGpvaS5hcnJheSgpLml0ZW1zKHRhYikucmVxdWlyZWQoKSxcbn0pXG5cbmV4cG9ydCBjb25zdCBncm91cCA9IGJhc2VGaWVsZC5rZXlzKHtcbiAgbmFtZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIHR5cGU6IGpvaS5zdHJpbmcoKS52YWxpZCgnZ3JvdXAnKS5yZXF1aXJlZCgpLFxuICBhZG1pbjogYmFzZUFkbWluRmllbGRzLmtleXMoe1xuICAgIGhpZGVHdXR0ZXI6IGpvaS5ib29sZWFuKCkuZGVmYXVsdCh0cnVlKSxcbiAgfSksXG4gIGRlZmF1bHRWYWx1ZTogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kub2JqZWN0KCksIGpvaS5mdW5jKCkpLFxuICBmaWVsZHM6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5saW5rKCcjZmllbGQnKSksXG4gIGludGVyZmFjZU5hbWU6IGpvaS5zdHJpbmcoKSxcbn0pXG5cbmV4cG9ydCBjb25zdCBhcnJheSA9IGJhc2VGaWVsZC5rZXlzKHtcbiAgbmFtZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIHR5cGU6IGpvaS5zdHJpbmcoKS52YWxpZCgnYXJyYXknKS5yZXF1aXJlZCgpLFxuICBhZG1pbjogYmFzZUFkbWluRmllbGRzXG4gICAgLmtleXMoe1xuICAgICAgY29tcG9uZW50czogYmFzZUFkbWluQ29tcG9uZW50RmllbGRzXG4gICAgICAgIC5rZXlzKHtcbiAgICAgICAgICBSb3dMYWJlbDogY29tcG9uZW50U2NoZW1hLFxuICAgICAgICB9KVxuICAgICAgICAuZGVmYXVsdCh7fSksXG4gICAgICBpc1NvcnRhYmxlOiBqb2kuYm9vbGVhbigpLFxuICAgIH0pXG4gICAgLmRlZmF1bHQoe30pLFxuICBkYk5hbWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBqb2kuZnVuYygpKSxcbiAgZGVmYXVsdFZhbHVlOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5hcnJheSgpLml0ZW1zKGpvaS5vYmplY3QoKSksIGpvaS5mdW5jKCkpLFxuICBmaWVsZHM6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5saW5rKCcjZmllbGQnKSkucmVxdWlyZWQoKSxcbiAgaW50ZXJmYWNlTmFtZTogam9pLnN0cmluZygpLFxuICBsYWJlbHM6IGpvaS5vYmplY3Qoe1xuICAgIHBsdXJhbDogam9pXG4gICAgICAuYWx0ZXJuYXRpdmVzKClcbiAgICAgIC50cnkoam9pLnN0cmluZygpLCBqb2kub2JqZWN0KCkucGF0dGVybihqb2kuc3RyaW5nKCksIFtqb2kuc3RyaW5nKCldKSksXG4gICAgc2luZ3VsYXI6IGpvaVxuICAgICAgLmFsdGVybmF0aXZlcygpXG4gICAgICAudHJ5KGpvaS5zdHJpbmcoKSwgam9pLm9iamVjdCgpLnBhdHRlcm4oam9pLnN0cmluZygpLCBbam9pLnN0cmluZygpXSkpLFxuICB9KSxcbiAgbWF4Um93czogam9pLm51bWJlcigpLFxuICBtaW5Sb3dzOiBqb2kubnVtYmVyKCksXG59KVxuXG5leHBvcnQgY29uc3QgdXBsb2FkID0gYmFzZUZpZWxkLmtleXMoe1xuICBuYW1lOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgdHlwZTogam9pLnN0cmluZygpLnZhbGlkKCd1cGxvYWQnKS5yZXF1aXJlZCgpLFxuICBhZG1pbjogYmFzZUFkbWluRmllbGRzLmtleXMoe1xuICAgIGNvbXBvbmVudHM6IGJhc2VBZG1pbkNvbXBvbmVudEZpZWxkcy5rZXlzKHtcbiAgICAgIEVycm9yOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICBMYWJlbDogY29tcG9uZW50U2NoZW1hLFxuICAgIH0pLFxuICB9KSxcbiAgZGVmYXVsdFZhbHVlOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5vYmplY3QoKSwgam9pLmZ1bmMoKSksXG4gIGRpc3BsYXlQcmV2aWV3OiBqb2kuYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLFxuICBmaWx0ZXJPcHRpb25zOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5vYmplY3QoKSwgam9pLmZ1bmMoKSksXG4gIG1heERlcHRoOiBqb2kubnVtYmVyKCksXG4gIHJlbGF0aW9uVG86IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxufSlcblxuZXhwb3J0IGNvbnN0IGNoZWNrYm94ID0gYmFzZUZpZWxkLmtleXMoe1xuICBuYW1lOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgdHlwZTogam9pLnN0cmluZygpLnZhbGlkKCdjaGVja2JveCcpLnJlcXVpcmVkKCksXG4gIGFkbWluOiBiYXNlQWRtaW5GaWVsZHMua2V5cyh7XG4gICAgY29tcG9uZW50czogYmFzZUFkbWluQ29tcG9uZW50RmllbGRzLmtleXMoe1xuICAgICAgRXJyb3I6IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgIExhYmVsOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICBhZnRlcklucHV0OiBqb2kuYXJyYXkoKS5pdGVtcyhjb21wb25lbnRTY2hlbWEpLFxuICAgICAgYmVmb3JlSW5wdXQ6IGpvaS5hcnJheSgpLml0ZW1zKGNvbXBvbmVudFNjaGVtYSksXG4gICAgfSksXG4gIH0pLFxuICBkZWZhdWx0VmFsdWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLmJvb2xlYW4oKSwgam9pLmZ1bmMoKSksXG59KVxuXG5leHBvcnQgY29uc3QgcG9pbnQgPSBiYXNlRmllbGQua2V5cyh7XG4gIG5hbWU6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICB0eXBlOiBqb2kuc3RyaW5nKCkudmFsaWQoJ3BvaW50JykucmVxdWlyZWQoKSxcbiAgYWRtaW46IGJhc2VBZG1pbkZpZWxkcy5rZXlzKHtcbiAgICBjb21wb25lbnRzOiBiYXNlQWRtaW5Db21wb25lbnRGaWVsZHMua2V5cyh7XG4gICAgICBFcnJvcjogY29tcG9uZW50U2NoZW1hLFxuICAgICAgTGFiZWw6IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgIGFmdGVySW5wdXQ6IGpvaS5hcnJheSgpLml0ZW1zKGNvbXBvbmVudFNjaGVtYSksXG4gICAgICBiZWZvcmVJbnB1dDogam9pLmFycmF5KCkuaXRlbXMoY29tcG9uZW50U2NoZW1hKSxcbiAgICB9KSxcbiAgfSksXG4gIGRlZmF1bHRWYWx1ZTogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kuYXJyYXkoKS5pdGVtcyhqb2kubnVtYmVyKCkpLm1heCgyKS5taW4oMiksIGpvaS5mdW5jKCkpLFxufSlcblxuZXhwb3J0IGNvbnN0IHJlbGF0aW9uc2hpcCA9IGJhc2VGaWVsZC5rZXlzKHtcbiAgbmFtZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIHR5cGU6IGpvaS5zdHJpbmcoKS52YWxpZCgncmVsYXRpb25zaGlwJykucmVxdWlyZWQoKSxcbiAgYWRtaW46IGJhc2VBZG1pbkZpZWxkcy5rZXlzKHtcbiAgICBhbGxvd0NyZWF0ZTogam9pLmJvb2xlYW4oKS5kZWZhdWx0KHRydWUpLFxuICAgIGNvbXBvbmVudHM6IGJhc2VBZG1pbkNvbXBvbmVudEZpZWxkcy5rZXlzKHtcbiAgICAgIEVycm9yOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICBMYWJlbDogY29tcG9uZW50U2NoZW1hLFxuICAgIH0pLFxuICAgIGlzU29ydGFibGU6IGpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG4gICAgc29ydE9wdGlvbnM6IGpvaS5hbHRlcm5hdGl2ZXMoKS5jb25kaXRpb25hbChqb2kucmVmKCcuLi5yZWxhdGlvblRvJyksIHtcbiAgICAgIGlzOiBqb2kuc3RyaW5nKCksXG4gICAgICBvdGhlcndpc2U6IGpvaS5vYmplY3QoKS5wYXR0ZXJuKGpvaS5zdHJpbmcoKSwgam9pLnN0cmluZygpKSxcbiAgICAgIHRoZW46IGpvaS5zdHJpbmcoKSxcbiAgICB9KSxcbiAgfSksXG4gIGRlZmF1bHRWYWx1ZTogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kuZnVuYygpKSxcbiAgZmlsdGVyT3B0aW9uczogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kub2JqZWN0KCksIGpvaS5mdW5jKCkpLFxuICBoYXNNYW55OiBqb2kuYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLFxuICBtYXg6IGpvaVxuICAgIC5udW1iZXIoKVxuICAgIC53aGVuKCdoYXNNYW55JywgeyBpczogam9pLm5vdCh0cnVlKSwgdGhlbjogam9pLmZvcmJpZGRlbigpIH0pXG4gICAgLndhcm5pbmcoJ2RlcHJlY2F0ZWQnLCB7IG1lc3NhZ2U6ICdVc2UgbWF4Um93cyBpbnN0ZWFkLicgfSksXG4gIG1heERlcHRoOiBqb2kubnVtYmVyKCksXG4gIG1heFJvd3M6IGpvaS5udW1iZXIoKS53aGVuKCdoYXNNYW55JywgeyBpczogam9pLm5vdCh0cnVlKSwgdGhlbjogam9pLmZvcmJpZGRlbigpIH0pLFxuICBtaW46IGpvaVxuICAgIC5udW1iZXIoKVxuICAgIC53aGVuKCdoYXNNYW55JywgeyBpczogam9pLm5vdCh0cnVlKSwgdGhlbjogam9pLmZvcmJpZGRlbigpIH0pXG4gICAgLndhcm5pbmcoJ2RlcHJlY2F0ZWQnLCB7IG1lc3NhZ2U6ICdVc2UgbWluUm93cyBpbnN0ZWFkLicgfSksXG4gIG1pblJvd3M6IGpvaS5udW1iZXIoKS53aGVuKCdoYXNNYW55JywgeyBpczogam9pLm5vdCh0cnVlKSwgdGhlbjogam9pLmZvcmJpZGRlbigpIH0pLFxuICByZWxhdGlvblRvOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLCBqb2kuYXJyYXkoKS5pdGVtcyhqb2kuc3RyaW5nKCkpKSxcbn0pXG5cbmV4cG9ydCBjb25zdCBibG9ja3MgPSBiYXNlRmllbGQua2V5cyh7XG4gIG5hbWU6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICB0eXBlOiBqb2kuc3RyaW5nKCkudmFsaWQoJ2Jsb2NrcycpLnJlcXVpcmVkKCksXG4gIGFkbWluOiBiYXNlQWRtaW5GaWVsZHNcbiAgICAua2V5cyh7XG4gICAgICBpc1NvcnRhYmxlOiBqb2kuYm9vbGVhbigpLFxuICAgIH0pXG4gICAgLmRlZmF1bHQoe30pLFxuICBibG9ja3M6IGpvaVxuICAgIC5hcnJheSgpXG4gICAgLml0ZW1zKFxuICAgICAgam9pLm9iamVjdCh7XG4gICAgICAgIHNsdWc6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICAgICAgICBjdXN0b206IGpvaS5vYmplY3QoKS5wYXR0ZXJuKGpvaS5zdHJpbmcoKSwgam9pLmFueSgpKSxcbiAgICAgICAgZGJOYW1lOiBqb2kuYWx0ZXJuYXRpdmVzKCkudHJ5KGpvaS5zdHJpbmcoKSwgam9pLmZ1bmMoKSksXG4gICAgICAgIGZpZWxkczogam9pLmFycmF5KCkuaXRlbXMoam9pLmxpbmsoJyNmaWVsZCcpKSxcbiAgICAgICAgZ3JhcGhRTDogam9pLm9iamVjdCgpLmtleXMoe1xuICAgICAgICAgIHNpbmd1bGFyTmFtZTogam9pLnN0cmluZygpLFxuICAgICAgICB9KSxcbiAgICAgICAgaW1hZ2VBbHRUZXh0OiBqb2kuc3RyaW5nKCksXG4gICAgICAgIGltYWdlVVJMOiBqb2kuc3RyaW5nKCksXG4gICAgICAgIGludGVyZmFjZU5hbWU6IGpvaS5zdHJpbmcoKSxcbiAgICAgICAgbGFiZWxzOiBqb2kub2JqZWN0KHtcbiAgICAgICAgICBwbHVyYWw6IGpvaVxuICAgICAgICAgICAgLmFsdGVybmF0aXZlcygpXG4gICAgICAgICAgICAudHJ5KGpvaS5zdHJpbmcoKSwgam9pLm9iamVjdCgpLnBhdHRlcm4oam9pLnN0cmluZygpLCBbam9pLnN0cmluZygpXSkpLFxuICAgICAgICAgIHNpbmd1bGFyOiBqb2lcbiAgICAgICAgICAgIC5hbHRlcm5hdGl2ZXMoKVxuICAgICAgICAgICAgLnRyeShqb2kuc3RyaW5nKCksIGpvaS5vYmplY3QoKS5wYXR0ZXJuKGpvaS5zdHJpbmcoKSwgW2pvaS5zdHJpbmcoKV0pKSxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICApXG4gICAgLnJlcXVpcmVkKCksXG4gIGRlZmF1bHRWYWx1ZTogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kuYXJyYXkoKS5pdGVtcyhqb2kub2JqZWN0KCkpLCBqb2kuZnVuYygpKSxcbiAgbGFiZWxzOiBqb2kub2JqZWN0KHtcbiAgICBwbHVyYWw6IGpvaVxuICAgICAgLmFsdGVybmF0aXZlcygpXG4gICAgICAudHJ5KGpvaS5zdHJpbmcoKSwgam9pLm9iamVjdCgpLnBhdHRlcm4oam9pLnN0cmluZygpLCBbam9pLnN0cmluZygpXSkpLFxuICAgIHNpbmd1bGFyOiBqb2lcbiAgICAgIC5hbHRlcm5hdGl2ZXMoKVxuICAgICAgLnRyeShqb2kuc3RyaW5nKCksIGpvaS5vYmplY3QoKS5wYXR0ZXJuKGpvaS5zdHJpbmcoKSwgW2pvaS5zdHJpbmcoKV0pKSxcbiAgfSksXG4gIG1heFJvd3M6IGpvaS5udW1iZXIoKSxcbiAgbWluUm93czogam9pLm51bWJlcigpLFxufSlcblxuZXhwb3J0IGNvbnN0IHJpY2hUZXh0ID0gYmFzZUZpZWxkLmtleXMoe1xuICBuYW1lOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgdHlwZTogam9pLnN0cmluZygpLnZhbGlkKCdyaWNoVGV4dCcpLnJlcXVpcmVkKCksXG4gIGFkbWluOiBiYXNlQWRtaW5GaWVsZHMua2V5cyh7XG4gICAgY29tcG9uZW50czogYmFzZUFkbWluQ29tcG9uZW50RmllbGRzLmtleXMoe1xuICAgICAgRXJyb3I6IGNvbXBvbmVudFNjaGVtYSxcbiAgICAgIExhYmVsOiBjb21wb25lbnRTY2hlbWEsXG4gICAgfSksXG4gIH0pLFxuICBkZWZhdWx0VmFsdWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLmFycmF5KCkuaXRlbXMoam9pLm9iamVjdCgpKSwgam9pLmZ1bmMoKSwgam9pLm9iamVjdCgpKSxcbiAgZWRpdG9yOiBqb2lcbiAgICAub2JqZWN0KClcbiAgICAua2V5cyh7XG4gICAgICBDZWxsQ29tcG9uZW50OiBjb21wb25lbnRTY2hlbWEub3B0aW9uYWwoKSxcbiAgICAgIEZpZWxkQ29tcG9uZW50OiBjb21wb25lbnRTY2hlbWEub3B0aW9uYWwoKSxcbiAgICAgIExhenlDZWxsQ29tcG9uZW50OiBqb2kuZnVuYygpLm9wdGlvbmFsKCksXG4gICAgICBMYXp5RmllbGRDb21wb25lbnQ6IGpvaS5mdW5jKCkub3B0aW9uYWwoKSxcbiAgICAgIGFmdGVyUmVhZFByb21pc2U6IGpvaS5mdW5jKCkub3B0aW9uYWwoKSxcbiAgICAgIG91dHB1dFNjaGVtYTogam9pLmZ1bmMoKS5vcHRpb25hbCgpLFxuICAgICAgcG9wdWxhdGlvblByb21pc2U6IGpvaS5mdW5jKCkub3B0aW9uYWwoKSxcbiAgICAgIHZhbGlkYXRlOiBqb2kuZnVuYygpLnJlcXVpcmVkKCksXG4gICAgfSlcbiAgICAudW5rbm93bigpLFxuICBtYXhEZXB0aDogam9pLm51bWJlcigpLFxufSlcblxuZXhwb3J0IGNvbnN0IGRhdGUgPSBiYXNlRmllbGQua2V5cyh7XG4gIG5hbWU6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICB0eXBlOiBqb2kuc3RyaW5nKCkudmFsaWQoJ2RhdGUnKS5yZXF1aXJlZCgpLFxuICBhZG1pbjogYmFzZUFkbWluRmllbGRzLmtleXMoe1xuICAgIGNvbXBvbmVudHM6IGJhc2VBZG1pbkNvbXBvbmVudEZpZWxkcy5rZXlzKHtcbiAgICAgIEVycm9yOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICBMYWJlbDogY29tcG9uZW50U2NoZW1hLFxuICAgICAgYWZ0ZXJJbnB1dDogam9pLmFycmF5KCkuaXRlbXMoY29tcG9uZW50U2NoZW1hKSxcbiAgICAgIGJlZm9yZUlucHV0OiBqb2kuYXJyYXkoKS5pdGVtcyhjb21wb25lbnRTY2hlbWEpLFxuICAgIH0pLFxuICAgIGRhdGU6IGpvaS5vYmplY3Qoe1xuICAgICAgZGlzcGxheUZvcm1hdDogam9pLnN0cmluZygpLFxuICAgICAgbWF4RGF0ZTogam9pLmRhdGUoKSxcbiAgICAgIG1heFRpbWU6IGpvaS5kYXRlKCksXG4gICAgICBtaW5EYXRlOiBqb2kuZGF0ZSgpLFxuICAgICAgbWluVGltZTogam9pLmRhdGUoKSxcbiAgICAgIG1vbnRoc1RvU2hvdzogam9pLm51bWJlcigpLFxuICAgICAgb3ZlcnJpZGVzOiBqb2kub2JqZWN0KCkudW5rbm93bigpLFxuICAgICAgcGlja2VyQXBwZWFyYW5jZTogam9pLnN0cmluZygpLFxuICAgICAgdGltZUZvcm1hdDogam9pLnN0cmluZygpLFxuICAgICAgdGltZUludGVydmFsczogam9pLm51bWJlcigpLFxuICAgIH0pLFxuICAgIHBsYWNlaG9sZGVyOiBqb2kuc3RyaW5nKCksXG4gIH0pLFxuICBkZWZhdWx0VmFsdWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBqb2kuZnVuYygpKSxcbn0pXG5cbmV4cG9ydCBjb25zdCB1aSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgbmFtZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIHR5cGU6IGpvaS5zdHJpbmcoKS52YWxpZCgndWknKS5yZXF1aXJlZCgpLFxuICBhZG1pbjogam9pXG4gICAgLm9iamVjdCgpXG4gICAgLmtleXMoe1xuICAgICAgY29tcG9uZW50czogam9pXG4gICAgICAgIC5vYmplY3QoKVxuICAgICAgICAua2V5cyh7XG4gICAgICAgICAgQ2VsbDogY29tcG9uZW50U2NoZW1hLFxuICAgICAgICAgIEZpZWxkOiBjb21wb25lbnRTY2hlbWEsXG4gICAgICAgIH0pXG4gICAgICAgIC5kZWZhdWx0KHt9KSxcbiAgICAgIGNvbmRpdGlvbjogam9pLmZ1bmMoKSxcbiAgICAgIGRpc2FibGVMaXN0Q29sdW1uOiBqb2kuYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLFxuICAgICAgcG9zaXRpb246IGpvaS5zdHJpbmcoKS52YWxpZCgnc2lkZWJhcicpLFxuICAgICAgd2lkdGg6IGpvaS5zdHJpbmcoKSxcbiAgICB9KVxuICAgIC5kZWZhdWx0KCksXG4gIGN1c3RvbTogam9pLm9iamVjdCgpLnBhdHRlcm4oam9pLnN0cmluZygpLCBqb2kuYW55KCkpLFxuICBsYWJlbDogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kuc3RyaW5nKCksIGpvaS5vYmplY3QoKS5wYXR0ZXJuKGpvaS5zdHJpbmcoKSwgW2pvaS5zdHJpbmcoKV0pKSxcbn0pXG5cbmNvbnN0IGZpZWxkU2NoZW1hID0gam9pXG4gIC5hbHRlcm5hdGl2ZXMoKVxuICAudHJ5KFxuICAgIHRleHQsXG4gICAgbnVtYmVyLFxuICAgIHRleHRhcmVhLFxuICAgIGVtYWlsLFxuICAgIGNvZGUsXG4gICAganNvbixcbiAgICBzZWxlY3QsXG4gICAgZ3JvdXAsXG4gICAgYXJyYXksXG4gICAgcm93LFxuICAgIGNvbGxhcHNpYmxlLFxuICAgIHRhYnMsXG4gICAgcmFkaW8sXG4gICAgcmVsYXRpb25zaGlwLFxuICAgIGNoZWNrYm94LFxuICAgIHVwbG9hZCxcbiAgICByaWNoVGV4dCxcbiAgICBibG9ja3MsXG4gICAgZGF0ZSxcbiAgICBwb2ludCxcbiAgICB1aSxcbiAgKVxuICAuaWQoJ2ZpZWxkJylcblxuZXhwb3J0IGRlZmF1bHQgZmllbGRTY2hlbWFcbiJdLCJuYW1lcyI6WyJhcnJheSIsImJhc2VBZG1pbkNvbXBvbmVudEZpZWxkcyIsImJhc2VBZG1pbkZpZWxkcyIsImJhc2VGaWVsZCIsImJsb2NrcyIsImNoZWNrYm94IiwiY29kZSIsImNvbGxhcHNpYmxlIiwiZGF0ZSIsImVtYWlsIiwiZ3JvdXAiLCJpZEZpZWxkIiwianNvbiIsIm51bWJlciIsInBvaW50IiwicmFkaW8iLCJyZWxhdGlvbnNoaXAiLCJyaWNoVGV4dCIsInJvdyIsInNlbGVjdCIsInRhYnMiLCJ0ZXh0IiwidGV4dGFyZWEiLCJ1aSIsInVwbG9hZCIsImpvaSIsIm9iamVjdCIsImtleXMiLCJDZWxsIiwiY29tcG9uZW50U2NoZW1hIiwiRmllbGQiLCJGaWx0ZXIiLCJkZWZhdWx0IiwiY2xhc3NOYW1lIiwic3RyaW5nIiwiY29tcG9uZW50cyIsImNvbmRpdGlvbiIsImZ1bmMiLCJkZXNjcmlwdGlvbiIsImFsdGVybmF0aXZlcyIsInRyeSIsInBhdHRlcm4iLCJkaXNhYmxlQnVsa0VkaXQiLCJib29sZWFuIiwiZGlzYWJsZUxpc3RDb2x1bW4iLCJkaXNhYmxlTGlzdEZpbHRlciIsImRpc2FibGVkIiwiaGlkZGVuIiwiaW5pdENvbGxhcHNlZCIsInBvc2l0aW9uIiwidmFsaWQiLCJyZWFkT25seSIsInN0eWxlIiwidW5rbm93biIsIndpZHRoIiwiYWNjZXNzIiwiY3JlYXRlIiwicmVhZCIsInVwZGF0ZSIsImFkbWluIiwiY3VzdG9tIiwiYW55IiwiaG9va3MiLCJhZnRlckNoYW5nZSIsIml0ZW1zIiwiYWZ0ZXJSZWFkIiwiYmVmb3JlQ2hhbmdlIiwiYmVmb3JlVmFsaWRhdGUiLCJpbmRleCIsImxhYmVsIiwibG9jYWxpemVkIiwicmVxdWlyZWQiLCJzYXZlVG9KV1QiLCJ1bmlxdWUiLCJ2YWxpZGF0ZSIsIm5hbWUiLCJ0eXBlIiwiaW52YWxpZCIsIm5vdCIsImF1dG9Db21wbGV0ZSIsIkVycm9yIiwiTGFiZWwiLCJhZnRlcklucHV0IiwiYmVmb3JlSW5wdXQiLCJwbGFjZWhvbGRlciIsInJ0bCIsImRlZmF1bHRWYWx1ZSIsImFsbG93IiwiaGFzTWFueSIsIm1heExlbmd0aCIsIm1heFJvd3MiLCJ3aGVuIiwiaXMiLCJ0aGVuIiwiZm9yYmlkZGVuIiwibWluTGVuZ3RoIiwibWluUm93cyIsIm90aGVyd2lzZSIsInN0ZXAiLCJtYXgiLCJtaW4iLCJyb3dzIiwiZWRpdG9yT3B0aW9ucyIsImxhbmd1YWdlIiwianNvblNjaGVtYSIsImlzQ2xlYXJhYmxlIiwiaXNTb3J0YWJsZSIsImRiTmFtZSIsImVudW1OYW1lIiwib3B0aW9ucyIsInZhbHVlIiwibGF5b3V0IiwiZmllbGRzIiwibGluayIsInRhYiIsImV4aXN0IiwiaW50ZXJmYWNlTmFtZSIsImhpZGVHdXR0ZXIiLCJSb3dMYWJlbCIsImxhYmVscyIsInBsdXJhbCIsInNpbmd1bGFyIiwiZGlzcGxheVByZXZpZXciLCJmaWx0ZXJPcHRpb25zIiwibWF4RGVwdGgiLCJyZWxhdGlvblRvIiwiYWxsb3dDcmVhdGUiLCJzb3J0T3B0aW9ucyIsImNvbmRpdGlvbmFsIiwicmVmIiwid2FybmluZyIsIm1lc3NhZ2UiLCJzbHVnIiwiZ3JhcGhRTCIsInNpbmd1bGFyTmFtZSIsImltYWdlQWx0VGV4dCIsImltYWdlVVJMIiwiZWRpdG9yIiwiQ2VsbENvbXBvbmVudCIsIm9wdGlvbmFsIiwiRmllbGRDb21wb25lbnQiLCJMYXp5Q2VsbENvbXBvbmVudCIsIkxhenlGaWVsZENvbXBvbmVudCIsImFmdGVyUmVhZFByb21pc2UiLCJvdXRwdXRTY2hlbWEiLCJwb3B1bGF0aW9uUHJvbWlzZSIsImRpc3BsYXlGb3JtYXQiLCJtYXhEYXRlIiwibWF4VGltZSIsIm1pbkRhdGUiLCJtaW5UaW1lIiwibW9udGhzVG9TaG93Iiwib3ZlcnJpZGVzIiwicGlja2VyQXBwZWFyYW5jZSIsInRpbWVGb3JtYXQiLCJ0aW1lSW50ZXJ2YWxzIiwiZmllbGRTY2hlbWEiLCJpZCJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQWlUYUEsS0FBSztlQUFMQTs7SUE3U0FD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