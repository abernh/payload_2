/* eslint-disable @typescript-eslint/no-use-before-define */ /* eslint-disable no-await-in-loop */ /* eslint-disable no-restricted-syntax */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _graphql = require("graphql");
const _graphqlscalars = require("graphql-scalars");
const _graphqltypejson = require("graphql-type-json");
const _types = require("../../fields/config/types");
const _formatLabels = require("../../utilities/formatLabels");
const _combineParentName = /*#__PURE__*/ _interop_require_default(require("../utilities/combineParentName"));
const _formatName = /*#__PURE__*/ _interop_require_default(require("../utilities/formatName"));
const _formatOptions = /*#__PURE__*/ _interop_require_default(require("../utilities/formatOptions"));
const _buildWhereInputType = /*#__PURE__*/ _interop_require_default(require("./buildWhereInputType"));
const _isFieldNullable = /*#__PURE__*/ _interop_require_default(require("./isFieldNullable"));
const _withNullableType = /*#__PURE__*/ _interop_require_default(require("./withNullableType"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function buildObjectType({ name, baseFields = {}, fields, forceNullable, parentName, payload }) {
    const fieldToSchemaMap = {
        array: (objectTypeConfig, field)=>{
            const interfaceName = field?.interfaceName || (0, _combineParentName.default)(parentName, (0, _formatLabels.toWords)(field.name, true));
            if (!payload.types.arrayTypes[interfaceName]) {
                const objectType = buildObjectType({
                    name: interfaceName,
                    fields: field.fields,
                    forceNullable: (0, _isFieldNullable.default)(field, forceNullable),
                    parentName: interfaceName,
                    payload
                });
                if (Object.keys(objectType.getFields()).length) {
                    payload.types.arrayTypes[interfaceName] = objectType;
                }
            }
            if (!payload.types.arrayTypes[interfaceName]) {
                return objectTypeConfig;
            }
            const arrayType = new _graphql.GraphQLList(new _graphql.GraphQLNonNull(payload.types.arrayTypes[interfaceName]));
            return {
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, arrayType)
                }
            };
        },
        blocks: (objectTypeConfig, field)=>{
            const blockTypes = field.blocks.reduce((acc, block)=>{
                if (!payload.types.blockTypes[block.slug]) {
                    const interfaceName = block?.interfaceName || block?.graphQL?.singularName || (0, _formatLabels.toWords)(block.slug, true);
                    const objectType = buildObjectType({
                        name: interfaceName,
                        fields: [
                            ...block.fields,
                            {
                                name: 'blockType',
                                type: 'text'
                            }
                        ],
                        forceNullable,
                        parentName: interfaceName,
                        payload
                    });
                    if (Object.keys(objectType.getFields()).length) {
                        payload.types.blockTypes[block.slug] = objectType;
                    }
                }
                if (payload.types.blockTypes[block.slug]) {
                    acc.push(payload.types.blockTypes[block.slug]);
                }
                return acc;
            }, []);
            if (blockTypes.length === 0) {
                return objectTypeConfig;
            }
            const fullName = (0, _combineParentName.default)(parentName, (0, _formatLabels.toWords)(field.name, true));
            const type = new _graphql.GraphQLList(new _graphql.GraphQLNonNull(new _graphql.GraphQLUnionType({
                name: fullName,
                resolveType: (data)=>payload.types.blockTypes[data.blockType].name,
                types: blockTypes
            })));
            return {
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, type)
                }
            };
        },
        checkbox: (objectTypeConfig, field)=>({
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, _graphql.GraphQLBoolean, forceNullable)
                }
            }),
        code: (objectTypeConfig, field)=>({
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, _graphql.GraphQLString, forceNullable)
                }
            }),
        collapsible: (objectTypeConfig, field)=>field.fields.reduce((objectTypeConfigWithCollapsibleFields, subField)=>{
                const addSubField = fieldToSchemaMap[subField.type];
                if (addSubField) return addSubField(objectTypeConfigWithCollapsibleFields, subField);
                return objectTypeConfigWithCollapsibleFields;
            }, objectTypeConfig),
        date: (objectTypeConfig, field)=>({
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, _graphqlscalars.DateTimeResolver, forceNullable)
                }
            }),
        email: (objectTypeConfig, field)=>({
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, _graphqlscalars.EmailAddressResolver, forceNullable)
                }
            }),
        group: (objectTypeConfig, field)=>{
            const interfaceName = field?.interfaceName || (0, _combineParentName.default)(parentName, (0, _formatLabels.toWords)(field.name, true));
            if (!payload.types.groupTypes[interfaceName]) {
                const objectType = buildObjectType({
                    name: interfaceName,
                    fields: field.fields,
                    forceNullable: (0, _isFieldNullable.default)(field, forceNullable),
                    parentName: interfaceName,
                    payload
                });
                if (Object.keys(objectType.getFields()).length) {
                    payload.types.groupTypes[interfaceName] = objectType;
                }
            }
            if (!payload.types.groupTypes[interfaceName]) {
                return objectTypeConfig;
            }
            return {
                ...objectTypeConfig,
                [field.name]: {
                    type: payload.types.groupTypes[interfaceName]
                }
            };
        },
        json: (objectTypeConfig, field)=>({
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, _graphqltypejson.GraphQLJSON, forceNullable)
                }
            }),
        number: (objectTypeConfig, field)=>{
            const type = field?.name === 'id' ? _graphql.GraphQLInt : _graphql.GraphQLFloat;
            return {
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, field?.hasMany === true ? new _graphql.GraphQLList(type) : type, forceNullable)
                }
            };
        },
        point: (objectTypeConfig, field)=>({
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, new _graphql.GraphQLList(new _graphql.GraphQLNonNull(_graphql.GraphQLFloat)), forceNullable)
                }
            }),
        radio: (objectTypeConfig, field)=>({
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, new _graphql.GraphQLEnumType({
                        name: (0, _combineParentName.default)(parentName, field.name),
                        values: (0, _formatOptions.default)(field)
                    }), forceNullable)
                }
            }),
        relationship: (objectTypeConfig, field)=>{
            const { relationTo } = field;
            const isRelatedToManyCollections = Array.isArray(relationTo);
            const hasManyValues = field.hasMany;
            const relationshipName = (0, _combineParentName.default)(parentName, (0, _formatLabels.toWords)(field.name, true));
            let type;
            let relationToType = null;
            if (Array.isArray(relationTo)) {
                relationToType = new _graphql.GraphQLEnumType({
                    name: `${relationshipName}_RelationTo`,
                    values: relationTo.reduce((relations, relation)=>({
                            ...relations,
                            [(0, _formatName.default)(relation)]: {
                                value: relation
                            }
                        }), {})
                });
                const types = relationTo.map((relation)=>payload.collections[relation].graphQL.type);
                type = new _graphql.GraphQLObjectType({
                    name: `${relationshipName}_Relationship`,
                    fields: {
                        relationTo: {
                            type: relationToType
                        },
                        value: {
                            type: new _graphql.GraphQLUnionType({
                                name: relationshipName,
                                async resolveType (data, { req }) {
                                    return payload.collections[data.collection].graphQL.type.name;
                                },
                                types
                            })
                        }
                    }
                });
            } else {
                ({ type } = payload.collections[relationTo].graphQL);
            }
            // If the relationshipType is undefined at this point,
            // it can be assumed that this blockType can have a relationship
            // to itself. Therefore, we set the relationshipType equal to the blockType
            // that is currently being created.
            type = type || newlyCreatedBlockType;
            const relationshipArgs = {};
            const relationsUseDrafts = (Array.isArray(relationTo) ? relationTo : [
                relationTo
            ]).some((relation)=>payload.collections[relation].config.versions?.drafts);
            if (relationsUseDrafts) {
                relationshipArgs.draft = {
                    type: _graphql.GraphQLBoolean
                };
            }
            if (payload.config.localization) {
                relationshipArgs.locale = {
                    type: payload.types.localeInputType
                };
                relationshipArgs.fallbackLocale = {
                    type: payload.types.fallbackLocaleInputType
                };
            }
            const relationship = {
                type: (0, _withNullableType.default)(field, hasManyValues ? new _graphql.GraphQLList(new _graphql.GraphQLNonNull(type)) : type, forceNullable),
                args: relationshipArgs,
                extensions: {
                    complexity: 10
                },
                async resolve (parent, args, context) {
                    const value = parent[field.name];
                    const locale = args.locale || context.req.locale;
                    const fallbackLocale = args.fallbackLocale || context.req.fallbackLocale;
                    let relatedCollectionSlug = field.relationTo;
                    const draft = args.draft ?? context.req.query?.draft;
                    if (hasManyValues) {
                        const results = [];
                        const resultPromises = [];
                        const createPopulationPromise = async (relatedDoc, i)=>{
                            let id = relatedDoc;
                            let collectionSlug = field.relationTo;
                            if (isRelatedToManyCollections) {
                                collectionSlug = relatedDoc.relationTo;
                                id = relatedDoc.value;
                            }
                            const result = await context.req.payloadDataLoader.load(JSON.stringify([
                                context.req.transactionID,
                                collectionSlug,
                                id,
                                0,
                                0,
                                locale,
                                fallbackLocale,
                                false,
                                false,
                                draft
                            ]));
                            if (result) {
                                if (isRelatedToManyCollections) {
                                    results[i] = {
                                        relationTo: collectionSlug,
                                        value: {
                                            ...result,
                                            collection: collectionSlug
                                        }
                                    };
                                } else {
                                    results[i] = result;
                                }
                            }
                        };
                        if (value) {
                            value.forEach((relatedDoc, i)=>{
                                resultPromises.push(createPopulationPromise(relatedDoc, i));
                            });
                        }
                        await Promise.all(resultPromises);
                        return results.filter((doc)=>doc != null);
                    }
                    let id = value;
                    if (isRelatedToManyCollections && value) {
                        id = value.value;
                        relatedCollectionSlug = value.relationTo;
                    }
                    if (id) {
                        const relatedDocument = await context.req.payloadDataLoader.load(JSON.stringify([
                            context.req.transactionID,
                            relatedCollectionSlug,
                            id,
                            0,
                            0,
                            locale,
                            fallbackLocale,
                            false,
                            false,
                            draft
                        ]));
                        if (relatedDocument) {
                            if (isRelatedToManyCollections) {
                                return {
                                    relationTo: relatedCollectionSlug,
                                    value: {
                                        ...relatedDocument,
                                        collection: relatedCollectionSlug
                                    }
                                };
                            }
                            return relatedDocument;
                        }
                        return null;
                    }
                    return null;
                }
            };
            return {
                ...objectTypeConfig,
                [field.name]: relationship
            };
        },
        richText: (objectTypeConfig, field)=>({
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, _graphqltypejson.GraphQLJSON, forceNullable),
                    args: {
                        depth: {
                            type: _graphql.GraphQLInt
                        }
                    },
                    async resolve (parent, args, context) {
                        let depth = payload.config.defaultDepth;
                        if (typeof args.depth !== 'undefined') depth = args.depth;
                        const editor = field?.editor;
                        // RichText fields have their own depth argument in GraphQL.
                        // This is why the populationPromise (which populates richtext fields like uploads and relationships)
                        // is run here again, with the provided depth.
                        // In the graphql find.ts resolver, the depth is then hard-coded to 0.
                        // Effectively, this means that the populationPromise for GraphQL is only run here, and not in the find.ts resolver / normal population promise.
                        if (editor?.populationPromise) {
                            const populateDepth = field?.maxDepth !== undefined && field?.maxDepth < depth ? field?.maxDepth : depth;
                            await editor?.populationPromise({
                                context,
                                depth: populateDepth,
                                draft: args.draft,
                                field,
                                findMany: false,
                                flattenLocales: false,
                                overrideAccess: false,
                                populationPromises: [],
                                req: context.req,
                                showHiddenFields: false,
                                siblingDoc: parent
                            });
                        }
                        return parent[field.name];
                    }
                }
            }),
        row: (objectTypeConfig, field)=>field.fields.reduce((objectTypeConfigWithRowFields, subField)=>{
                const addSubField = fieldToSchemaMap[subField.type];
                if (addSubField) return addSubField(objectTypeConfigWithRowFields, subField);
                return objectTypeConfigWithRowFields;
            }, objectTypeConfig),
        select: (objectTypeConfig, field)=>{
            const fullName = (0, _combineParentName.default)(parentName, field.name);
            let type = new _graphql.GraphQLEnumType({
                name: fullName,
                values: (0, _formatOptions.default)(field)
            });
            type = field.hasMany ? new _graphql.GraphQLList(new _graphql.GraphQLNonNull(type)) : type;
            type = (0, _withNullableType.default)(field, type, forceNullable);
            return {
                ...objectTypeConfig,
                [field.name]: {
                    type
                }
            };
        },
        tabs: (objectTypeConfig, field)=>field.tabs.reduce((tabSchema, tab)=>{
                if ((0, _types.tabHasName)(tab)) {
                    const interfaceName = tab?.interfaceName || (0, _combineParentName.default)(parentName, (0, _formatLabels.toWords)(tab.name, true));
                    if (!payload.types.groupTypes[interfaceName]) {
                        const objectType = buildObjectType({
                            name: interfaceName,
                            fields: tab.fields,
                            forceNullable,
                            parentName: interfaceName,
                            payload
                        });
                        if (Object.keys(objectType.getFields()).length) {
                            payload.types.groupTypes[interfaceName] = objectType;
                        }
                    }
                    if (!payload.types.groupTypes[interfaceName]) {
                        return tabSchema;
                    }
                    return {
                        ...tabSchema,
                        [tab.name]: {
                            type: payload.types.groupTypes[interfaceName]
                        }
                    };
                }
                return {
                    ...tabSchema,
                    ...tab.fields.reduce((subFieldSchema, subField)=>{
                        const addSubField = fieldToSchemaMap[subField.type];
                        if (addSubField) return addSubField(subFieldSchema, subField);
                        return subFieldSchema;
                    }, tabSchema)
                };
            }, objectTypeConfig),
        text: (objectTypeConfig, field)=>({
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, field.hasMany === true ? new _graphql.GraphQLList(_graphql.GraphQLString) : _graphql.GraphQLString, forceNullable)
                }
            }),
        textarea: (objectTypeConfig, field)=>({
                ...objectTypeConfig,
                [field.name]: {
                    type: (0, _withNullableType.default)(field, _graphql.GraphQLString, forceNullable)
                }
            }),
        upload: (objectTypeConfig, field)=>{
            const { relationTo } = field;
            const uploadName = (0, _combineParentName.default)(parentName, (0, _formatLabels.toWords)(field.name, true));
            // If the relationshipType is undefined at this point,
            // it can be assumed that this blockType can have a relationship
            // to itself. Therefore, we set the relationshipType equal to the blockType
            // that is currently being created.
            const type = (0, _withNullableType.default)(field, payload.collections[relationTo].graphQL.type || newlyCreatedBlockType, forceNullable);
            const uploadArgs = {};
            if (payload.config.localization) {
                uploadArgs.locale = {
                    type: payload.types.localeInputType
                };
                uploadArgs.fallbackLocale = {
                    type: payload.types.fallbackLocaleInputType
                };
            }
            const relatedCollectionSlug = field.relationTo;
            const upload = {
                type,
                args: uploadArgs,
                extensions: {
                    complexity: 20
                },
                async resolve (parent, args, context) {
                    const value = parent[field.name];
                    const locale = args.locale || context.req.locale;
                    const fallbackLocale = args.fallbackLocale || context.req.fallbackLocale;
                    const id = value;
                    const draft = args.draft ?? context.req.query?.draft;
                    if (id) {
                        const relatedDocument = await context.req.payloadDataLoader.load(JSON.stringify([
                            context.req.transactionID,
                            relatedCollectionSlug,
                            id,
                            0,
                            0,
                            locale,
                            fallbackLocale,
                            false,
                            false,
                            Boolean(draft)
                        ]));
                        return relatedDocument || null;
                    }
                    return null;
                }
            };
            const whereFields = payload.collections[relationTo].config.fields;
            upload.args.where = {
                type: (0, _buildWhereInputType.default)({
                    name: uploadName,
                    fields: whereFields,
                    parentName: uploadName,
                    payload
                })
            };
            return {
                ...objectTypeConfig,
                [field.name]: upload
            };
        }
    };
    const objectSchema = {
        name,
        fields: ()=>fields.reduce((objectTypeConfig, field)=>{
                const fieldSchema = fieldToSchemaMap[field.type];
                if (typeof fieldSchema !== 'function') {
                    return objectTypeConfig;
                }
                return {
                    ...objectTypeConfig,
                    ...fieldSchema(objectTypeConfig, field)
                };
            }, baseFields)
    };
    const newlyCreatedBlockType = new _graphql.GraphQLObjectType(objectSchema);
    return newlyCreatedBlockType;
}
const _default = buildObjectType;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9idWlsZE9iamVjdFR5cGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVzZS1iZWZvcmUtZGVmaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1hd2FpdC1pbi1sb29wICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1yZXN0cmljdGVkLXN5bnRheCAqL1xuaW1wb3J0IHR5cGUgeyBHcmFwaFFMRmllbGRDb25maWcsIEdyYXBoUUxUeXBlIH0gZnJvbSAnZ3JhcGhxbCdcblxuaW1wb3J0IHtcbiAgR3JhcGhRTEJvb2xlYW4sXG4gIEdyYXBoUUxFbnVtVHlwZSxcbiAgR3JhcGhRTEZsb2F0LFxuICBHcmFwaFFMSW50LFxuICBHcmFwaFFMTGlzdCxcbiAgR3JhcGhRTE5vbk51bGwsXG4gIEdyYXBoUUxPYmplY3RUeXBlLFxuICBHcmFwaFFMU3RyaW5nLFxuICBHcmFwaFFMVW5pb25UeXBlLFxufSBmcm9tICdncmFwaHFsJ1xuaW1wb3J0IHsgRGF0ZVRpbWVSZXNvbHZlciwgRW1haWxBZGRyZXNzUmVzb2x2ZXIgfSBmcm9tICdncmFwaHFsLXNjYWxhcnMnXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11c2UtYmVmb3JlLWRlZmluZSAqL1xuaW1wb3J0IHsgR3JhcGhRTEpTT04gfSBmcm9tICdncmFwaHFsLXR5cGUtanNvbidcblxuaW1wb3J0IHR5cGUgeyBSaWNoVGV4dEFkYXB0ZXIgfSBmcm9tICcuLi8uLi9hZG1pbi9jb21wb25lbnRzL2Zvcm1zL2ZpZWxkLXR5cGVzL1JpY2hUZXh0L3R5cGVzJ1xuaW1wb3J0IHR5cGUge1xuICBBcnJheUZpZWxkLFxuICBCbG9ja0ZpZWxkLFxuICBDaGVja2JveEZpZWxkLFxuICBDb2RlRmllbGQsXG4gIENvbGxhcHNpYmxlRmllbGQsXG4gIERhdGVGaWVsZCxcbiAgRW1haWxGaWVsZCxcbiAgRmllbGQsXG4gIEdyb3VwRmllbGQsXG4gIEpTT05GaWVsZCxcbiAgTnVtYmVyRmllbGQsXG4gIFBvaW50RmllbGQsXG4gIFJhZGlvRmllbGQsXG4gIFJlbGF0aW9uc2hpcEZpZWxkLFxuICBSaWNoVGV4dEZpZWxkLFxuICBSb3dGaWVsZCxcbiAgU2VsZWN0RmllbGQsXG4gIFRhYnNGaWVsZCxcbiAgVGV4dEZpZWxkLFxuICBUZXh0YXJlYUZpZWxkLFxuICBVcGxvYWRGaWVsZCxcbn0gZnJvbSAnLi4vLi4vZmllbGRzL2NvbmZpZy90eXBlcydcbmltcG9ydCB0eXBlIHsgUGF5bG9hZCB9IGZyb20gJy4uLy4uL3BheWxvYWQnXG5cbmltcG9ydCB7IHRhYkhhc05hbWUgfSBmcm9tICcuLi8uLi9maWVsZHMvY29uZmlnL3R5cGVzJ1xuaW1wb3J0IHsgdG9Xb3JkcyB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9mb3JtYXRMYWJlbHMnXG5pbXBvcnQgY29tYmluZVBhcmVudE5hbWUgZnJvbSAnLi4vdXRpbGl0aWVzL2NvbWJpbmVQYXJlbnROYW1lJ1xuaW1wb3J0IGZvcm1hdE5hbWUgZnJvbSAnLi4vdXRpbGl0aWVzL2Zvcm1hdE5hbWUnXG5pbXBvcnQgZm9ybWF0T3B0aW9ucyBmcm9tICcuLi91dGlsaXRpZXMvZm9ybWF0T3B0aW9ucydcbmltcG9ydCBidWlsZFdoZXJlSW5wdXRUeXBlIGZyb20gJy4vYnVpbGRXaGVyZUlucHV0VHlwZSdcbmltcG9ydCBpc0ZpZWxkTnVsbGFibGUgZnJvbSAnLi9pc0ZpZWxkTnVsbGFibGUnXG5pbXBvcnQgd2l0aE51bGxhYmxlVHlwZSBmcm9tICcuL3dpdGhOdWxsYWJsZVR5cGUnXG5cbnR5cGUgTG9jYWxlSW5wdXRUeXBlID0ge1xuICBmYWxsYmFja0xvY2FsZToge1xuICAgIHR5cGU6IEdyYXBoUUxUeXBlXG4gIH1cbiAgbG9jYWxlOiB7XG4gICAgdHlwZTogR3JhcGhRTFR5cGVcbiAgfVxuICB3aGVyZToge1xuICAgIHR5cGU6IEdyYXBoUUxUeXBlXG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgT2JqZWN0VHlwZUNvbmZpZyA9IHtcbiAgW3BhdGg6IHN0cmluZ106IEdyYXBoUUxGaWVsZENvbmZpZzxhbnksIGFueT5cbn1cblxudHlwZSBBcmdzID0ge1xuICBiYXNlRmllbGRzPzogT2JqZWN0VHlwZUNvbmZpZ1xuICBmaWVsZHM6IEZpZWxkW11cbiAgZm9yY2VOdWxsYWJsZT86IGJvb2xlYW5cbiAgbmFtZTogc3RyaW5nXG4gIHBhcmVudE5hbWU6IHN0cmluZ1xuICBwYXlsb2FkOiBQYXlsb2FkXG59XG5cbmZ1bmN0aW9uIGJ1aWxkT2JqZWN0VHlwZSh7XG4gIG5hbWUsXG4gIGJhc2VGaWVsZHMgPSB7fSxcbiAgZmllbGRzLFxuICBmb3JjZU51bGxhYmxlLFxuICBwYXJlbnROYW1lLFxuICBwYXlsb2FkLFxufTogQXJncyk6IEdyYXBoUUxPYmplY3RUeXBlIHtcbiAgY29uc3QgZmllbGRUb1NjaGVtYU1hcCA9IHtcbiAgICBhcnJheTogKG9iamVjdFR5cGVDb25maWc6IE9iamVjdFR5cGVDb25maWcsIGZpZWxkOiBBcnJheUZpZWxkKSA9PiB7XG4gICAgICBjb25zdCBpbnRlcmZhY2VOYW1lID1cbiAgICAgICAgZmllbGQ/LmludGVyZmFjZU5hbWUgfHwgY29tYmluZVBhcmVudE5hbWUocGFyZW50TmFtZSwgdG9Xb3JkcyhmaWVsZC5uYW1lLCB0cnVlKSlcblxuICAgICAgaWYgKCFwYXlsb2FkLnR5cGVzLmFycmF5VHlwZXNbaW50ZXJmYWNlTmFtZV0pIHtcbiAgICAgICAgY29uc3Qgb2JqZWN0VHlwZSA9IGJ1aWxkT2JqZWN0VHlwZSh7XG4gICAgICAgICAgbmFtZTogaW50ZXJmYWNlTmFtZSxcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkLmZpZWxkcyxcbiAgICAgICAgICBmb3JjZU51bGxhYmxlOiBpc0ZpZWxkTnVsbGFibGUoZmllbGQsIGZvcmNlTnVsbGFibGUpLFxuICAgICAgICAgIHBhcmVudE5hbWU6IGludGVyZmFjZU5hbWUsXG4gICAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMob2JqZWN0VHlwZS5nZXRGaWVsZHMoKSkubGVuZ3RoKSB7XG4gICAgICAgICAgcGF5bG9hZC50eXBlcy5hcnJheVR5cGVzW2ludGVyZmFjZU5hbWVdID0gb2JqZWN0VHlwZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghcGF5bG9hZC50eXBlcy5hcnJheVR5cGVzW2ludGVyZmFjZU5hbWVdKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RUeXBlQ29uZmlnXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFycmF5VHlwZSA9IG5ldyBHcmFwaFFMTGlzdChuZXcgR3JhcGhRTE5vbk51bGwocGF5bG9hZC50eXBlcy5hcnJheVR5cGVzW2ludGVyZmFjZU5hbWVdKSlcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ub2JqZWN0VHlwZUNvbmZpZyxcbiAgICAgICAgW2ZpZWxkLm5hbWVdOiB7IHR5cGU6IHdpdGhOdWxsYWJsZVR5cGUoZmllbGQsIGFycmF5VHlwZSkgfSxcbiAgICAgIH1cbiAgICB9LFxuICAgIGJsb2NrczogKG9iamVjdFR5cGVDb25maWc6IE9iamVjdFR5cGVDb25maWcsIGZpZWxkOiBCbG9ja0ZpZWxkKSA9PiB7XG4gICAgICBjb25zdCBibG9ja1R5cGVzOiBHcmFwaFFMT2JqZWN0VHlwZTxhbnksIGFueT5bXSA9IGZpZWxkLmJsb2Nrcy5yZWR1Y2UoKGFjYywgYmxvY2spID0+IHtcbiAgICAgICAgaWYgKCFwYXlsb2FkLnR5cGVzLmJsb2NrVHlwZXNbYmxvY2suc2x1Z10pIHtcbiAgICAgICAgICBjb25zdCBpbnRlcmZhY2VOYW1lID1cbiAgICAgICAgICAgIGJsb2NrPy5pbnRlcmZhY2VOYW1lIHx8IGJsb2NrPy5ncmFwaFFMPy5zaW5ndWxhck5hbWUgfHwgdG9Xb3JkcyhibG9jay5zbHVnLCB0cnVlKVxuXG4gICAgICAgICAgY29uc3Qgb2JqZWN0VHlwZSA9IGJ1aWxkT2JqZWN0VHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBpbnRlcmZhY2VOYW1lLFxuICAgICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAgIC4uLmJsb2NrLmZpZWxkcyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdibG9ja1R5cGUnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBmb3JjZU51bGxhYmxlLFxuICAgICAgICAgICAgcGFyZW50TmFtZTogaW50ZXJmYWNlTmFtZSxcbiAgICAgICAgICAgIHBheWxvYWQsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhvYmplY3RUeXBlLmdldEZpZWxkcygpKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBheWxvYWQudHlwZXMuYmxvY2tUeXBlc1tibG9jay5zbHVnXSA9IG9iamVjdFR5cGVcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGF5bG9hZC50eXBlcy5ibG9ja1R5cGVzW2Jsb2NrLnNsdWddKSB7XG4gICAgICAgICAgYWNjLnB1c2gocGF5bG9hZC50eXBlcy5ibG9ja1R5cGVzW2Jsb2NrLnNsdWddKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgfSwgW10pXG5cbiAgICAgIGlmIChibG9ja1R5cGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0VHlwZUNvbmZpZ1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmdWxsTmFtZSA9IGNvbWJpbmVQYXJlbnROYW1lKHBhcmVudE5hbWUsIHRvV29yZHMoZmllbGQubmFtZSwgdHJ1ZSkpXG5cbiAgICAgIGNvbnN0IHR5cGUgPSBuZXcgR3JhcGhRTExpc3QoXG4gICAgICAgIG5ldyBHcmFwaFFMTm9uTnVsbChcbiAgICAgICAgICBuZXcgR3JhcGhRTFVuaW9uVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBmdWxsTmFtZSxcbiAgICAgICAgICAgIHJlc29sdmVUeXBlOiAoZGF0YSkgPT4gcGF5bG9hZC50eXBlcy5ibG9ja1R5cGVzW2RhdGEuYmxvY2tUeXBlXS5uYW1lLFxuICAgICAgICAgICAgdHlwZXM6IGJsb2NrVHlwZXMsXG4gICAgICAgICAgfSksXG4gICAgICAgICksXG4gICAgICApXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLm9iamVjdFR5cGVDb25maWcsXG4gICAgICAgIFtmaWVsZC5uYW1lXTogeyB0eXBlOiB3aXRoTnVsbGFibGVUeXBlKGZpZWxkLCB0eXBlKSB9LFxuICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tib3g6IChvYmplY3RUeXBlQ29uZmlnOiBPYmplY3RUeXBlQ29uZmlnLCBmaWVsZDogQ2hlY2tib3hGaWVsZCkgPT4gKHtcbiAgICAgIC4uLm9iamVjdFR5cGVDb25maWcsXG4gICAgICBbZmllbGQubmFtZV06IHsgdHlwZTogd2l0aE51bGxhYmxlVHlwZShmaWVsZCwgR3JhcGhRTEJvb2xlYW4sIGZvcmNlTnVsbGFibGUpIH0sXG4gICAgfSksXG4gICAgY29kZTogKG9iamVjdFR5cGVDb25maWc6IE9iamVjdFR5cGVDb25maWcsIGZpZWxkOiBDb2RlRmllbGQpID0+ICh7XG4gICAgICAuLi5vYmplY3RUeXBlQ29uZmlnLFxuICAgICAgW2ZpZWxkLm5hbWVdOiB7IHR5cGU6IHdpdGhOdWxsYWJsZVR5cGUoZmllbGQsIEdyYXBoUUxTdHJpbmcsIGZvcmNlTnVsbGFibGUpIH0sXG4gICAgfSksXG4gICAgY29sbGFwc2libGU6IChvYmplY3RUeXBlQ29uZmlnOiBPYmplY3RUeXBlQ29uZmlnLCBmaWVsZDogQ29sbGFwc2libGVGaWVsZCkgPT5cbiAgICAgIGZpZWxkLmZpZWxkcy5yZWR1Y2UoKG9iamVjdFR5cGVDb25maWdXaXRoQ29sbGFwc2libGVGaWVsZHMsIHN1YkZpZWxkKSA9PiB7XG4gICAgICAgIGNvbnN0IGFkZFN1YkZpZWxkID0gZmllbGRUb1NjaGVtYU1hcFtzdWJGaWVsZC50eXBlXVxuICAgICAgICBpZiAoYWRkU3ViRmllbGQpIHJldHVybiBhZGRTdWJGaWVsZChvYmplY3RUeXBlQ29uZmlnV2l0aENvbGxhcHNpYmxlRmllbGRzLCBzdWJGaWVsZClcbiAgICAgICAgcmV0dXJuIG9iamVjdFR5cGVDb25maWdXaXRoQ29sbGFwc2libGVGaWVsZHNcbiAgICAgIH0sIG9iamVjdFR5cGVDb25maWcpLFxuICAgIGRhdGU6IChvYmplY3RUeXBlQ29uZmlnOiBPYmplY3RUeXBlQ29uZmlnLCBmaWVsZDogRGF0ZUZpZWxkKSA9PiAoe1xuICAgICAgLi4ub2JqZWN0VHlwZUNvbmZpZyxcbiAgICAgIFtmaWVsZC5uYW1lXTogeyB0eXBlOiB3aXRoTnVsbGFibGVUeXBlKGZpZWxkLCBEYXRlVGltZVJlc29sdmVyLCBmb3JjZU51bGxhYmxlKSB9LFxuICAgIH0pLFxuICAgIGVtYWlsOiAob2JqZWN0VHlwZUNvbmZpZzogT2JqZWN0VHlwZUNvbmZpZywgZmllbGQ6IEVtYWlsRmllbGQpID0+ICh7XG4gICAgICAuLi5vYmplY3RUeXBlQ29uZmlnLFxuICAgICAgW2ZpZWxkLm5hbWVdOiB7IHR5cGU6IHdpdGhOdWxsYWJsZVR5cGUoZmllbGQsIEVtYWlsQWRkcmVzc1Jlc29sdmVyLCBmb3JjZU51bGxhYmxlKSB9LFxuICAgIH0pLFxuICAgIGdyb3VwOiAob2JqZWN0VHlwZUNvbmZpZzogT2JqZWN0VHlwZUNvbmZpZywgZmllbGQ6IEdyb3VwRmllbGQpID0+IHtcbiAgICAgIGNvbnN0IGludGVyZmFjZU5hbWUgPVxuICAgICAgICBmaWVsZD8uaW50ZXJmYWNlTmFtZSB8fCBjb21iaW5lUGFyZW50TmFtZShwYXJlbnROYW1lLCB0b1dvcmRzKGZpZWxkLm5hbWUsIHRydWUpKVxuXG4gICAgICBpZiAoIXBheWxvYWQudHlwZXMuZ3JvdXBUeXBlc1tpbnRlcmZhY2VOYW1lXSkge1xuICAgICAgICBjb25zdCBvYmplY3RUeXBlID0gYnVpbGRPYmplY3RUeXBlKHtcbiAgICAgICAgICBuYW1lOiBpbnRlcmZhY2VOYW1lLFxuICAgICAgICAgIGZpZWxkczogZmllbGQuZmllbGRzLFxuICAgICAgICAgIGZvcmNlTnVsbGFibGU6IGlzRmllbGROdWxsYWJsZShmaWVsZCwgZm9yY2VOdWxsYWJsZSksXG4gICAgICAgICAgcGFyZW50TmFtZTogaW50ZXJmYWNlTmFtZSxcbiAgICAgICAgICBwYXlsb2FkLFxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhvYmplY3RUeXBlLmdldEZpZWxkcygpKS5sZW5ndGgpIHtcbiAgICAgICAgICBwYXlsb2FkLnR5cGVzLmdyb3VwVHlwZXNbaW50ZXJmYWNlTmFtZV0gPSBvYmplY3RUeXBlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFwYXlsb2FkLnR5cGVzLmdyb3VwVHlwZXNbaW50ZXJmYWNlTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFR5cGVDb25maWdcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ub2JqZWN0VHlwZUNvbmZpZyxcbiAgICAgICAgW2ZpZWxkLm5hbWVdOiB7IHR5cGU6IHBheWxvYWQudHlwZXMuZ3JvdXBUeXBlc1tpbnRlcmZhY2VOYW1lXSB9LFxuICAgICAgfVxuICAgIH0sXG4gICAganNvbjogKG9iamVjdFR5cGVDb25maWc6IE9iamVjdFR5cGVDb25maWcsIGZpZWxkOiBKU09ORmllbGQpID0+ICh7XG4gICAgICAuLi5vYmplY3RUeXBlQ29uZmlnLFxuICAgICAgW2ZpZWxkLm5hbWVdOiB7IHR5cGU6IHdpdGhOdWxsYWJsZVR5cGUoZmllbGQsIEdyYXBoUUxKU09OLCBmb3JjZU51bGxhYmxlKSB9LFxuICAgIH0pLFxuICAgIG51bWJlcjogKG9iamVjdFR5cGVDb25maWc6IE9iamVjdFR5cGVDb25maWcsIGZpZWxkOiBOdW1iZXJGaWVsZCkgPT4ge1xuICAgICAgY29uc3QgdHlwZSA9IGZpZWxkPy5uYW1lID09PSAnaWQnID8gR3JhcGhRTEludCA6IEdyYXBoUUxGbG9hdFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ub2JqZWN0VHlwZUNvbmZpZyxcbiAgICAgICAgW2ZpZWxkLm5hbWVdOiB7XG4gICAgICAgICAgdHlwZTogd2l0aE51bGxhYmxlVHlwZShcbiAgICAgICAgICAgIGZpZWxkLFxuICAgICAgICAgICAgZmllbGQ/Lmhhc01hbnkgPT09IHRydWUgPyBuZXcgR3JhcGhRTExpc3QodHlwZSkgOiB0eXBlLFxuICAgICAgICAgICAgZm9yY2VOdWxsYWJsZSxcbiAgICAgICAgICApLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgIH0sXG4gICAgcG9pbnQ6IChvYmplY3RUeXBlQ29uZmlnOiBPYmplY3RUeXBlQ29uZmlnLCBmaWVsZDogUG9pbnRGaWVsZCkgPT4gKHtcbiAgICAgIC4uLm9iamVjdFR5cGVDb25maWcsXG4gICAgICBbZmllbGQubmFtZV06IHtcbiAgICAgICAgdHlwZTogd2l0aE51bGxhYmxlVHlwZShcbiAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICBuZXcgR3JhcGhRTExpc3QobmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxGbG9hdCkpLFxuICAgICAgICAgIGZvcmNlTnVsbGFibGUsXG4gICAgICAgICksXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHJhZGlvOiAob2JqZWN0VHlwZUNvbmZpZzogT2JqZWN0VHlwZUNvbmZpZywgZmllbGQ6IFJhZGlvRmllbGQpID0+ICh7XG4gICAgICAuLi5vYmplY3RUeXBlQ29uZmlnLFxuICAgICAgW2ZpZWxkLm5hbWVdOiB7XG4gICAgICAgIHR5cGU6IHdpdGhOdWxsYWJsZVR5cGUoXG4gICAgICAgICAgZmllbGQsXG4gICAgICAgICAgbmV3IEdyYXBoUUxFbnVtVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBjb21iaW5lUGFyZW50TmFtZShwYXJlbnROYW1lLCBmaWVsZC5uYW1lKSxcbiAgICAgICAgICAgIHZhbHVlczogZm9ybWF0T3B0aW9ucyhmaWVsZCksXG4gICAgICAgICAgfSksXG4gICAgICAgICAgZm9yY2VOdWxsYWJsZSxcbiAgICAgICAgKSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgcmVsYXRpb25zaGlwOiAob2JqZWN0VHlwZUNvbmZpZzogT2JqZWN0VHlwZUNvbmZpZywgZmllbGQ6IFJlbGF0aW9uc2hpcEZpZWxkKSA9PiB7XG4gICAgICBjb25zdCB7IHJlbGF0aW9uVG8gfSA9IGZpZWxkXG4gICAgICBjb25zdCBpc1JlbGF0ZWRUb01hbnlDb2xsZWN0aW9ucyA9IEFycmF5LmlzQXJyYXkocmVsYXRpb25UbylcbiAgICAgIGNvbnN0IGhhc01hbnlWYWx1ZXMgPSBmaWVsZC5oYXNNYW55XG4gICAgICBjb25zdCByZWxhdGlvbnNoaXBOYW1lID0gY29tYmluZVBhcmVudE5hbWUocGFyZW50TmFtZSwgdG9Xb3JkcyhmaWVsZC5uYW1lLCB0cnVlKSlcblxuICAgICAgbGV0IHR5cGVcbiAgICAgIGxldCByZWxhdGlvblRvVHlwZSA9IG51bGxcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVsYXRpb25UbykpIHtcbiAgICAgICAgcmVsYXRpb25Ub1R5cGUgPSBuZXcgR3JhcGhRTEVudW1UeXBlKHtcbiAgICAgICAgICBuYW1lOiBgJHtyZWxhdGlvbnNoaXBOYW1lfV9SZWxhdGlvblRvYCxcbiAgICAgICAgICB2YWx1ZXM6IHJlbGF0aW9uVG8ucmVkdWNlKFxuICAgICAgICAgICAgKHJlbGF0aW9ucywgcmVsYXRpb24pID0+ICh7XG4gICAgICAgICAgICAgIC4uLnJlbGF0aW9ucyxcbiAgICAgICAgICAgICAgW2Zvcm1hdE5hbWUocmVsYXRpb24pXToge1xuICAgICAgICAgICAgICAgIHZhbHVlOiByZWxhdGlvbixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAge30sXG4gICAgICAgICAgKSxcbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCB0eXBlcyA9IHJlbGF0aW9uVG8ubWFwKChyZWxhdGlvbikgPT4gcGF5bG9hZC5jb2xsZWN0aW9uc1tyZWxhdGlvbl0uZ3JhcGhRTC50eXBlKVxuXG4gICAgICAgIHR5cGUgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICAgICAgICAgIG5hbWU6IGAke3JlbGF0aW9uc2hpcE5hbWV9X1JlbGF0aW9uc2hpcGAsXG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICByZWxhdGlvblRvOiB7XG4gICAgICAgICAgICAgIHR5cGU6IHJlbGF0aW9uVG9UeXBlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgIHR5cGU6IG5ldyBHcmFwaFFMVW5pb25UeXBlKHtcbiAgICAgICAgICAgICAgICBuYW1lOiByZWxhdGlvbnNoaXBOYW1lLFxuICAgICAgICAgICAgICAgIGFzeW5jIHJlc29sdmVUeXBlKGRhdGEsIHsgcmVxIH0pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBwYXlsb2FkLmNvbGxlY3Rpb25zW2RhdGEuY29sbGVjdGlvbl0uZ3JhcGhRTC50eXBlLm5hbWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHR5cGVzLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIDsoeyB0eXBlIH0gPSBwYXlsb2FkLmNvbGxlY3Rpb25zW3JlbGF0aW9uVG9dLmdyYXBoUUwpXG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZSByZWxhdGlvbnNoaXBUeXBlIGlzIHVuZGVmaW5lZCBhdCB0aGlzIHBvaW50LFxuICAgICAgLy8gaXQgY2FuIGJlIGFzc3VtZWQgdGhhdCB0aGlzIGJsb2NrVHlwZSBjYW4gaGF2ZSBhIHJlbGF0aW9uc2hpcFxuICAgICAgLy8gdG8gaXRzZWxmLiBUaGVyZWZvcmUsIHdlIHNldCB0aGUgcmVsYXRpb25zaGlwVHlwZSBlcXVhbCB0byB0aGUgYmxvY2tUeXBlXG4gICAgICAvLyB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBjcmVhdGVkLlxuXG4gICAgICB0eXBlID0gdHlwZSB8fCBuZXdseUNyZWF0ZWRCbG9ja1R5cGVcblxuICAgICAgY29uc3QgcmVsYXRpb25zaGlwQXJnczoge1xuICAgICAgICBkcmFmdD86IHVua25vd25cbiAgICAgICAgZmFsbGJhY2tMb2NhbGU/OiB1bmtub3duXG4gICAgICAgIGxpbWl0PzogdW5rbm93blxuICAgICAgICBsb2NhbGU/OiB1bmtub3duXG4gICAgICAgIHBhZ2U/OiB1bmtub3duXG4gICAgICAgIHdoZXJlPzogdW5rbm93blxuICAgICAgfSA9IHt9XG5cbiAgICAgIGNvbnN0IHJlbGF0aW9uc1VzZURyYWZ0cyA9IChBcnJheS5pc0FycmF5KHJlbGF0aW9uVG8pID8gcmVsYXRpb25UbyA6IFtyZWxhdGlvblRvXSkuc29tZShcbiAgICAgICAgKHJlbGF0aW9uKSA9PiBwYXlsb2FkLmNvbGxlY3Rpb25zW3JlbGF0aW9uXS5jb25maWcudmVyc2lvbnM/LmRyYWZ0cyxcbiAgICAgIClcblxuICAgICAgaWYgKHJlbGF0aW9uc1VzZURyYWZ0cykge1xuICAgICAgICByZWxhdGlvbnNoaXBBcmdzLmRyYWZ0ID0ge1xuICAgICAgICAgIHR5cGU6IEdyYXBoUUxCb29sZWFuLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXlsb2FkLmNvbmZpZy5sb2NhbGl6YXRpb24pIHtcbiAgICAgICAgcmVsYXRpb25zaGlwQXJncy5sb2NhbGUgPSB7XG4gICAgICAgICAgdHlwZTogcGF5bG9hZC50eXBlcy5sb2NhbGVJbnB1dFR5cGUsXG4gICAgICAgIH1cblxuICAgICAgICByZWxhdGlvbnNoaXBBcmdzLmZhbGxiYWNrTG9jYWxlID0ge1xuICAgICAgICAgIHR5cGU6IHBheWxvYWQudHlwZXMuZmFsbGJhY2tMb2NhbGVJbnB1dFR5cGUsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVsYXRpb25zaGlwID0ge1xuICAgICAgICB0eXBlOiB3aXRoTnVsbGFibGVUeXBlKFxuICAgICAgICAgIGZpZWxkLFxuICAgICAgICAgIGhhc01hbnlWYWx1ZXMgPyBuZXcgR3JhcGhRTExpc3QobmV3IEdyYXBoUUxOb25OdWxsKHR5cGUpKSA6IHR5cGUsXG4gICAgICAgICAgZm9yY2VOdWxsYWJsZSxcbiAgICAgICAgKSxcbiAgICAgICAgYXJnczogcmVsYXRpb25zaGlwQXJncyxcbiAgICAgICAgZXh0ZW5zaW9uczogeyBjb21wbGV4aXR5OiAxMCB9LFxuICAgICAgICBhc3luYyByZXNvbHZlKHBhcmVudCwgYXJncywgY29udGV4dCkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGFyZW50W2ZpZWxkLm5hbWVdXG4gICAgICAgICAgY29uc3QgbG9jYWxlID0gYXJncy5sb2NhbGUgfHwgY29udGV4dC5yZXEubG9jYWxlXG4gICAgICAgICAgY29uc3QgZmFsbGJhY2tMb2NhbGUgPSBhcmdzLmZhbGxiYWNrTG9jYWxlIHx8IGNvbnRleHQucmVxLmZhbGxiYWNrTG9jYWxlXG4gICAgICAgICAgbGV0IHJlbGF0ZWRDb2xsZWN0aW9uU2x1ZyA9IGZpZWxkLnJlbGF0aW9uVG9cbiAgICAgICAgICBjb25zdCBkcmFmdCA9IGFyZ3MuZHJhZnQgPz8gY29udGV4dC5yZXEucXVlcnk/LmRyYWZ0XG5cbiAgICAgICAgICBpZiAoaGFzTWFueVZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdXG4gICAgICAgICAgICBjb25zdCByZXN1bHRQcm9taXNlcyA9IFtdXG5cbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZVBvcHVsYXRpb25Qcm9taXNlID0gYXN5bmMgKHJlbGF0ZWREb2MsIGkpID0+IHtcbiAgICAgICAgICAgICAgbGV0IGlkID0gcmVsYXRlZERvY1xuICAgICAgICAgICAgICBsZXQgY29sbGVjdGlvblNsdWcgPSBmaWVsZC5yZWxhdGlvblRvXG5cbiAgICAgICAgICAgICAgaWYgKGlzUmVsYXRlZFRvTWFueUNvbGxlY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvblNsdWcgPSByZWxhdGVkRG9jLnJlbGF0aW9uVG9cbiAgICAgICAgICAgICAgICBpZCA9IHJlbGF0ZWREb2MudmFsdWVcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbnRleHQucmVxLnBheWxvYWREYXRhTG9hZGVyLmxvYWQoXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoW1xuICAgICAgICAgICAgICAgICAgY29udGV4dC5yZXEudHJhbnNhY3Rpb25JRCxcbiAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25TbHVnLFxuICAgICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgIGxvY2FsZSxcbiAgICAgICAgICAgICAgICAgIGZhbGxiYWNrTG9jYWxlLFxuICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIGRyYWZ0LFxuICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICApXG5cbiAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGlmIChpc1JlbGF0ZWRUb01hbnlDb2xsZWN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0c1tpXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25UbzogY29sbGVjdGlvblNsdWcsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgLi4ucmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IGNvbGxlY3Rpb25TbHVnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHRzW2ldID0gcmVzdWx0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKChyZWxhdGVkRG9jLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0UHJvbWlzZXMucHVzaChjcmVhdGVQb3B1bGF0aW9uUHJvbWlzZShyZWxhdGVkRG9jLCBpKSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocmVzdWx0UHJvbWlzZXMpXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5maWx0ZXIoKGRvYykgPT4gZG9jICE9IG51bGwpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IGlkID0gdmFsdWVcbiAgICAgICAgICBpZiAoaXNSZWxhdGVkVG9NYW55Q29sbGVjdGlvbnMgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgIGlkID0gdmFsdWUudmFsdWVcbiAgICAgICAgICAgIHJlbGF0ZWRDb2xsZWN0aW9uU2x1ZyA9IHZhbHVlLnJlbGF0aW9uVG9cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWREb2N1bWVudCA9IGF3YWl0IGNvbnRleHQucmVxLnBheWxvYWREYXRhTG9hZGVyLmxvYWQoXG4gICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KFtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlcS50cmFuc2FjdGlvbklELFxuICAgICAgICAgICAgICAgIHJlbGF0ZWRDb2xsZWN0aW9uU2x1ZyxcbiAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgbG9jYWxlLFxuICAgICAgICAgICAgICAgIGZhbGxiYWNrTG9jYWxlLFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgIGRyYWZ0LFxuICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgKHJlbGF0ZWREb2N1bWVudCkge1xuICAgICAgICAgICAgICBpZiAoaXNSZWxhdGVkVG9NYW55Q29sbGVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgcmVsYXRpb25UbzogcmVsYXRlZENvbGxlY3Rpb25TbHVnLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgLi4ucmVsYXRlZERvY3VtZW50LFxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiByZWxhdGVkQ29sbGVjdGlvblNsdWcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiByZWxhdGVkRG9jdW1lbnRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5vYmplY3RUeXBlQ29uZmlnLFxuICAgICAgICBbZmllbGQubmFtZV06IHJlbGF0aW9uc2hpcCxcbiAgICAgIH1cbiAgICB9LFxuICAgIHJpY2hUZXh0OiAob2JqZWN0VHlwZUNvbmZpZzogT2JqZWN0VHlwZUNvbmZpZywgZmllbGQ6IFJpY2hUZXh0RmllbGQpID0+ICh7XG4gICAgICAuLi5vYmplY3RUeXBlQ29uZmlnLFxuICAgICAgW2ZpZWxkLm5hbWVdOiB7XG4gICAgICAgIHR5cGU6IHdpdGhOdWxsYWJsZVR5cGUoZmllbGQsIEdyYXBoUUxKU09OLCBmb3JjZU51bGxhYmxlKSxcbiAgICAgICAgYXJnczoge1xuICAgICAgICAgIGRlcHRoOiB7XG4gICAgICAgICAgICB0eXBlOiBHcmFwaFFMSW50LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIHJlc29sdmUocGFyZW50LCBhcmdzLCBjb250ZXh0KSB7XG4gICAgICAgICAgbGV0IGRlcHRoID0gcGF5bG9hZC5jb25maWcuZGVmYXVsdERlcHRoXG4gICAgICAgICAgaWYgKHR5cGVvZiBhcmdzLmRlcHRoICE9PSAndW5kZWZpbmVkJykgZGVwdGggPSBhcmdzLmRlcHRoXG4gICAgICAgICAgY29uc3QgZWRpdG9yOiBSaWNoVGV4dEFkYXB0ZXIgPSBmaWVsZD8uZWRpdG9yXG5cbiAgICAgICAgICAvLyBSaWNoVGV4dCBmaWVsZHMgaGF2ZSB0aGVpciBvd24gZGVwdGggYXJndW1lbnQgaW4gR3JhcGhRTC5cbiAgICAgICAgICAvLyBUaGlzIGlzIHdoeSB0aGUgcG9wdWxhdGlvblByb21pc2UgKHdoaWNoIHBvcHVsYXRlcyByaWNodGV4dCBmaWVsZHMgbGlrZSB1cGxvYWRzIGFuZCByZWxhdGlvbnNoaXBzKVxuICAgICAgICAgIC8vIGlzIHJ1biBoZXJlIGFnYWluLCB3aXRoIHRoZSBwcm92aWRlZCBkZXB0aC5cbiAgICAgICAgICAvLyBJbiB0aGUgZ3JhcGhxbCBmaW5kLnRzIHJlc29sdmVyLCB0aGUgZGVwdGggaXMgdGhlbiBoYXJkLWNvZGVkIHRvIDAuXG4gICAgICAgICAgLy8gRWZmZWN0aXZlbHksIHRoaXMgbWVhbnMgdGhhdCB0aGUgcG9wdWxhdGlvblByb21pc2UgZm9yIEdyYXBoUUwgaXMgb25seSBydW4gaGVyZSwgYW5kIG5vdCBpbiB0aGUgZmluZC50cyByZXNvbHZlciAvIG5vcm1hbCBwb3B1bGF0aW9uIHByb21pc2UuXG4gICAgICAgICAgaWYgKGVkaXRvcj8ucG9wdWxhdGlvblByb21pc2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcHVsYXRlRGVwdGggPVxuICAgICAgICAgICAgICBmaWVsZD8ubWF4RGVwdGggIT09IHVuZGVmaW5lZCAmJiBmaWVsZD8ubWF4RGVwdGggPCBkZXB0aCA/IGZpZWxkPy5tYXhEZXB0aCA6IGRlcHRoXG5cbiAgICAgICAgICAgIGF3YWl0IGVkaXRvcj8ucG9wdWxhdGlvblByb21pc2Uoe1xuICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICBkZXB0aDogcG9wdWxhdGVEZXB0aCxcbiAgICAgICAgICAgICAgZHJhZnQ6IGFyZ3MuZHJhZnQsXG4gICAgICAgICAgICAgIGZpZWxkLFxuICAgICAgICAgICAgICBmaW5kTWFueTogZmFsc2UsXG4gICAgICAgICAgICAgIGZsYXR0ZW5Mb2NhbGVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgb3ZlcnJpZGVBY2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICBwb3B1bGF0aW9uUHJvbWlzZXM6IFtdLFxuICAgICAgICAgICAgICByZXE6IGNvbnRleHQucmVxLFxuICAgICAgICAgICAgICBzaG93SGlkZGVuRmllbGRzOiBmYWxzZSxcbiAgICAgICAgICAgICAgc2libGluZ0RvYzogcGFyZW50LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcGFyZW50W2ZpZWxkLm5hbWVdXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHJvdzogKG9iamVjdFR5cGVDb25maWc6IE9iamVjdFR5cGVDb25maWcsIGZpZWxkOiBSb3dGaWVsZCkgPT5cbiAgICAgIGZpZWxkLmZpZWxkcy5yZWR1Y2UoKG9iamVjdFR5cGVDb25maWdXaXRoUm93RmllbGRzLCBzdWJGaWVsZCkgPT4ge1xuICAgICAgICBjb25zdCBhZGRTdWJGaWVsZCA9IGZpZWxkVG9TY2hlbWFNYXBbc3ViRmllbGQudHlwZV1cbiAgICAgICAgaWYgKGFkZFN1YkZpZWxkKSByZXR1cm4gYWRkU3ViRmllbGQob2JqZWN0VHlwZUNvbmZpZ1dpdGhSb3dGaWVsZHMsIHN1YkZpZWxkKVxuICAgICAgICByZXR1cm4gb2JqZWN0VHlwZUNvbmZpZ1dpdGhSb3dGaWVsZHNcbiAgICAgIH0sIG9iamVjdFR5cGVDb25maWcpLFxuICAgIHNlbGVjdDogKG9iamVjdFR5cGVDb25maWc6IE9iamVjdFR5cGVDb25maWcsIGZpZWxkOiBTZWxlY3RGaWVsZCkgPT4ge1xuICAgICAgY29uc3QgZnVsbE5hbWUgPSBjb21iaW5lUGFyZW50TmFtZShwYXJlbnROYW1lLCBmaWVsZC5uYW1lKVxuXG4gICAgICBsZXQgdHlwZTogR3JhcGhRTFR5cGUgPSBuZXcgR3JhcGhRTEVudW1UeXBlKHtcbiAgICAgICAgbmFtZTogZnVsbE5hbWUsXG4gICAgICAgIHZhbHVlczogZm9ybWF0T3B0aW9ucyhmaWVsZCksXG4gICAgICB9KVxuXG4gICAgICB0eXBlID0gZmllbGQuaGFzTWFueSA/IG5ldyBHcmFwaFFMTGlzdChuZXcgR3JhcGhRTE5vbk51bGwodHlwZSkpIDogdHlwZVxuICAgICAgdHlwZSA9IHdpdGhOdWxsYWJsZVR5cGUoZmllbGQsIHR5cGUsIGZvcmNlTnVsbGFibGUpXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLm9iamVjdFR5cGVDb25maWcsXG4gICAgICAgIFtmaWVsZC5uYW1lXTogeyB0eXBlIH0sXG4gICAgICB9XG4gICAgfSxcbiAgICB0YWJzOiAob2JqZWN0VHlwZUNvbmZpZzogT2JqZWN0VHlwZUNvbmZpZywgZmllbGQ6IFRhYnNGaWVsZCkgPT5cbiAgICAgIGZpZWxkLnRhYnMucmVkdWNlKCh0YWJTY2hlbWEsIHRhYikgPT4ge1xuICAgICAgICBpZiAodGFiSGFzTmFtZSh0YWIpKSB7XG4gICAgICAgICAgY29uc3QgaW50ZXJmYWNlTmFtZSA9XG4gICAgICAgICAgICB0YWI/LmludGVyZmFjZU5hbWUgfHwgY29tYmluZVBhcmVudE5hbWUocGFyZW50TmFtZSwgdG9Xb3Jkcyh0YWIubmFtZSwgdHJ1ZSkpXG5cbiAgICAgICAgICBpZiAoIXBheWxvYWQudHlwZXMuZ3JvdXBUeXBlc1tpbnRlcmZhY2VOYW1lXSkge1xuICAgICAgICAgICAgY29uc3Qgb2JqZWN0VHlwZSA9IGJ1aWxkT2JqZWN0VHlwZSh7XG4gICAgICAgICAgICAgIG5hbWU6IGludGVyZmFjZU5hbWUsXG4gICAgICAgICAgICAgIGZpZWxkczogdGFiLmZpZWxkcyxcbiAgICAgICAgICAgICAgZm9yY2VOdWxsYWJsZSxcbiAgICAgICAgICAgICAgcGFyZW50TmFtZTogaW50ZXJmYWNlTmFtZSxcbiAgICAgICAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhvYmplY3RUeXBlLmdldEZpZWxkcygpKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcGF5bG9hZC50eXBlcy5ncm91cFR5cGVzW2ludGVyZmFjZU5hbWVdID0gb2JqZWN0VHlwZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghcGF5bG9hZC50eXBlcy5ncm91cFR5cGVzW2ludGVyZmFjZU5hbWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFiU2NoZW1hXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnRhYlNjaGVtYSxcbiAgICAgICAgICAgIFt0YWIubmFtZV06IHsgdHlwZTogcGF5bG9hZC50eXBlcy5ncm91cFR5cGVzW2ludGVyZmFjZU5hbWVdIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi50YWJTY2hlbWEsXG4gICAgICAgICAgLi4udGFiLmZpZWxkcy5yZWR1Y2UoKHN1YkZpZWxkU2NoZW1hLCBzdWJGaWVsZCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWRkU3ViRmllbGQgPSBmaWVsZFRvU2NoZW1hTWFwW3N1YkZpZWxkLnR5cGVdXG4gICAgICAgICAgICBpZiAoYWRkU3ViRmllbGQpIHJldHVybiBhZGRTdWJGaWVsZChzdWJGaWVsZFNjaGVtYSwgc3ViRmllbGQpXG4gICAgICAgICAgICByZXR1cm4gc3ViRmllbGRTY2hlbWFcbiAgICAgICAgICB9LCB0YWJTY2hlbWEpLFxuICAgICAgICB9XG4gICAgICB9LCBvYmplY3RUeXBlQ29uZmlnKSxcbiAgICB0ZXh0OiAob2JqZWN0VHlwZUNvbmZpZzogT2JqZWN0VHlwZUNvbmZpZywgZmllbGQ6IFRleHRGaWVsZCkgPT4gKHtcbiAgICAgIC4uLm9iamVjdFR5cGVDb25maWcsXG4gICAgICBbZmllbGQubmFtZV06IHtcbiAgICAgICAgdHlwZTogd2l0aE51bGxhYmxlVHlwZShcbiAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICBmaWVsZC5oYXNNYW55ID09PSB0cnVlID8gbmV3IEdyYXBoUUxMaXN0KEdyYXBoUUxTdHJpbmcpIDogR3JhcGhRTFN0cmluZyxcbiAgICAgICAgICBmb3JjZU51bGxhYmxlLFxuICAgICAgICApLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICB0ZXh0YXJlYTogKG9iamVjdFR5cGVDb25maWc6IE9iamVjdFR5cGVDb25maWcsIGZpZWxkOiBUZXh0YXJlYUZpZWxkKSA9PiAoe1xuICAgICAgLi4ub2JqZWN0VHlwZUNvbmZpZyxcbiAgICAgIFtmaWVsZC5uYW1lXTogeyB0eXBlOiB3aXRoTnVsbGFibGVUeXBlKGZpZWxkLCBHcmFwaFFMU3RyaW5nLCBmb3JjZU51bGxhYmxlKSB9LFxuICAgIH0pLFxuICAgIHVwbG9hZDogKG9iamVjdFR5cGVDb25maWc6IE9iamVjdFR5cGVDb25maWcsIGZpZWxkOiBVcGxvYWRGaWVsZCkgPT4ge1xuICAgICAgY29uc3QgeyByZWxhdGlvblRvIH0gPSBmaWVsZFxuXG4gICAgICBjb25zdCB1cGxvYWROYW1lID0gY29tYmluZVBhcmVudE5hbWUocGFyZW50TmFtZSwgdG9Xb3JkcyhmaWVsZC5uYW1lLCB0cnVlKSlcblxuICAgICAgLy8gSWYgdGhlIHJlbGF0aW9uc2hpcFR5cGUgaXMgdW5kZWZpbmVkIGF0IHRoaXMgcG9pbnQsXG4gICAgICAvLyBpdCBjYW4gYmUgYXNzdW1lZCB0aGF0IHRoaXMgYmxvY2tUeXBlIGNhbiBoYXZlIGEgcmVsYXRpb25zaGlwXG4gICAgICAvLyB0byBpdHNlbGYuIFRoZXJlZm9yZSwgd2Ugc2V0IHRoZSByZWxhdGlvbnNoaXBUeXBlIGVxdWFsIHRvIHRoZSBibG9ja1R5cGVcbiAgICAgIC8vIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGNyZWF0ZWQuXG5cbiAgICAgIGNvbnN0IHR5cGUgPSB3aXRoTnVsbGFibGVUeXBlKFxuICAgICAgICBmaWVsZCxcbiAgICAgICAgcGF5bG9hZC5jb2xsZWN0aW9uc1tyZWxhdGlvblRvXS5ncmFwaFFMLnR5cGUgfHwgbmV3bHlDcmVhdGVkQmxvY2tUeXBlLFxuICAgICAgICBmb3JjZU51bGxhYmxlLFxuICAgICAgKVxuXG4gICAgICBjb25zdCB1cGxvYWRBcmdzID0ge30gYXMgTG9jYWxlSW5wdXRUeXBlXG5cbiAgICAgIGlmIChwYXlsb2FkLmNvbmZpZy5sb2NhbGl6YXRpb24pIHtcbiAgICAgICAgdXBsb2FkQXJncy5sb2NhbGUgPSB7XG4gICAgICAgICAgdHlwZTogcGF5bG9hZC50eXBlcy5sb2NhbGVJbnB1dFR5cGUsXG4gICAgICAgIH1cblxuICAgICAgICB1cGxvYWRBcmdzLmZhbGxiYWNrTG9jYWxlID0ge1xuICAgICAgICAgIHR5cGU6IHBheWxvYWQudHlwZXMuZmFsbGJhY2tMb2NhbGVJbnB1dFR5cGUsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVsYXRlZENvbGxlY3Rpb25TbHVnID0gZmllbGQucmVsYXRpb25Ub1xuXG4gICAgICBjb25zdCB1cGxvYWQgPSB7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIGFyZ3M6IHVwbG9hZEFyZ3MsXG4gICAgICAgIGV4dGVuc2lvbnM6IHsgY29tcGxleGl0eTogMjAgfSxcbiAgICAgICAgYXN5bmMgcmVzb2x2ZShwYXJlbnQsIGFyZ3MsIGNvbnRleHQpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhcmVudFtmaWVsZC5uYW1lXVxuICAgICAgICAgIGNvbnN0IGxvY2FsZSA9IGFyZ3MubG9jYWxlIHx8IGNvbnRleHQucmVxLmxvY2FsZVxuICAgICAgICAgIGNvbnN0IGZhbGxiYWNrTG9jYWxlID0gYXJncy5mYWxsYmFja0xvY2FsZSB8fCBjb250ZXh0LnJlcS5mYWxsYmFja0xvY2FsZVxuICAgICAgICAgIGNvbnN0IGlkID0gdmFsdWVcbiAgICAgICAgICBjb25zdCBkcmFmdCA9IGFyZ3MuZHJhZnQgPz8gY29udGV4dC5yZXEucXVlcnk/LmRyYWZ0XG5cbiAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWREb2N1bWVudCA9IGF3YWl0IGNvbnRleHQucmVxLnBheWxvYWREYXRhTG9hZGVyLmxvYWQoXG4gICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KFtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlcS50cmFuc2FjdGlvbklELFxuICAgICAgICAgICAgICAgIHJlbGF0ZWRDb2xsZWN0aW9uU2x1ZyxcbiAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgbG9jYWxlLFxuICAgICAgICAgICAgICAgIGZhbGxiYWNrTG9jYWxlLFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgIEJvb2xlYW4oZHJhZnQpLFxuICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWREb2N1bWVudCB8fCBudWxsXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfSxcbiAgICAgIH1cblxuICAgICAgY29uc3Qgd2hlcmVGaWVsZHMgPSBwYXlsb2FkLmNvbGxlY3Rpb25zW3JlbGF0aW9uVG9dLmNvbmZpZy5maWVsZHNcblxuICAgICAgdXBsb2FkLmFyZ3Mud2hlcmUgPSB7XG4gICAgICAgIHR5cGU6IGJ1aWxkV2hlcmVJbnB1dFR5cGUoe1xuICAgICAgICAgIG5hbWU6IHVwbG9hZE5hbWUsXG4gICAgICAgICAgZmllbGRzOiB3aGVyZUZpZWxkcyxcbiAgICAgICAgICBwYXJlbnROYW1lOiB1cGxvYWROYW1lLFxuICAgICAgICAgIHBheWxvYWQsXG4gICAgICAgIH0pLFxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5vYmplY3RUeXBlQ29uZmlnLFxuICAgICAgICBbZmllbGQubmFtZV06IHVwbG9hZCxcbiAgICAgIH1cbiAgICB9LFxuICB9XG5cbiAgY29uc3Qgb2JqZWN0U2NoZW1hID0ge1xuICAgIG5hbWUsXG4gICAgZmllbGRzOiAoKSA9PlxuICAgICAgZmllbGRzLnJlZHVjZSgob2JqZWN0VHlwZUNvbmZpZywgZmllbGQpID0+IHtcbiAgICAgICAgY29uc3QgZmllbGRTY2hlbWEgPSBmaWVsZFRvU2NoZW1hTWFwW2ZpZWxkLnR5cGVdXG5cbiAgICAgICAgaWYgKHR5cGVvZiBmaWVsZFNjaGVtYSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBvYmplY3RUeXBlQ29uZmlnXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLm9iamVjdFR5cGVDb25maWcsXG4gICAgICAgICAgLi4uZmllbGRTY2hlbWEob2JqZWN0VHlwZUNvbmZpZywgZmllbGQpLFxuICAgICAgICB9XG4gICAgICB9LCBiYXNlRmllbGRzKSxcbiAgfVxuXG4gIGNvbnN0IG5ld2x5Q3JlYXRlZEJsb2NrVHlwZSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZShvYmplY3RTY2hlbWEpXG5cbiAgcmV0dXJuIG5ld2x5Q3JlYXRlZEJsb2NrVHlwZVxufVxuXG5leHBvcnQgZGVmYXVsdCBidWlsZE9iamVjdFR5cGVcbiJdLCJuYW1lcyI6WyJidWlsZE9iamVjdFR5cGUiLCJuYW1lIiwiYmFzZUZpZWxkcyIsImZpZWxkcyIsImZvcmNlTnVsbGFibGUiLCJwYXJlbnROYW1lIiwicGF5bG9hZCIsImZpZWxkVG9TY2hlbWFNYXAiLCJhcnJheSIsIm9iamVjdFR5cGVDb25maWciLCJmaWVsZCIsImludGVyZmFjZU5hbWUiLCJjb21iaW5lUGFyZW50TmFtZSIsInRvV29yZHMiLCJ0eXBlcyIsImFycmF5VHlwZXMiLCJvYmplY3RUeXBlIiwiaXNGaWVsZE51bGxhYmxlIiwiT2JqZWN0Iiwia2V5cyIsImdldEZpZWxkcyIsImxlbmd0aCIsImFycmF5VHlwZSIsIkdyYXBoUUxMaXN0IiwiR3JhcGhRTE5vbk51bGwiLCJ0eXBlIiwid2l0aE51bGxhYmxlVHlwZSIsImJsb2NrcyIsImJsb2NrVHlwZXMiLCJyZWR1Y2UiLCJhY2MiLCJibG9jayIsInNsdWciLCJncmFwaFFMIiwic2luZ3VsYXJOYW1lIiwicHVzaCIsImZ1bGxOYW1lIiwiR3JhcGhRTFVuaW9uVHlwZSIsInJlc29sdmVUeXBlIiwiZGF0YSIsImJsb2NrVHlwZSIsImNoZWNrYm94IiwiR3JhcGhRTEJvb2xlYW4iLCJjb2RlIiwiR3JhcGhRTFN0cmluZyIsImNvbGxhcHNpYmxlIiwib2JqZWN0VHlwZUNvbmZpZ1dpdGhDb2xsYXBzaWJsZUZpZWxkcyIsInN1YkZpZWxkIiwiYWRkU3ViRmllbGQiLCJkYXRlIiwiRGF0ZVRpbWVSZXNvbHZlciIsImVtYWlsIiwiRW1haWxBZGRyZXNzUmVzb2x2ZXIiLCJncm91cCIsImdyb3VwVHlwZXMiLCJqc29uIiwiR3JhcGhRTEpTT04iLCJudW1iZXIiLCJHcmFwaFFMSW50IiwiR3JhcGhRTEZsb2F0IiwiaGFzTWFueSIsInBvaW50IiwicmFkaW8iLCJHcmFwaFFMRW51bVR5cGUiLCJ2YWx1ZXMiLCJmb3JtYXRPcHRpb25zIiwicmVsYXRpb25zaGlwIiwicmVsYXRpb25UbyIsImlzUmVsYXRlZFRvTWFueUNvbGxlY3Rpb25zIiwiQXJyYXkiLCJpc0FycmF5IiwiaGFzTWFueVZhbHVlcyIsInJlbGF0aW9uc2hpcE5hbWUiLCJyZWxhdGlvblRvVHlwZSIsInJlbGF0aW9ucyIsInJlbGF0aW9uIiwiZm9ybWF0TmFtZSIsInZhbHVlIiwibWFwIiwiY29sbGVjdGlvbnMiLCJHcmFwaFFMT2JqZWN0VHlwZSIsInJlcSIsImNvbGxlY3Rpb24iLCJuZXdseUNyZWF0ZWRCbG9ja1R5cGUiLCJyZWxhdGlvbnNoaXBBcmdzIiwicmVsYXRpb25zVXNlRHJhZnRzIiwic29tZSIsImNvbmZpZyIsInZlcnNpb25zIiwiZHJhZnRzIiwiZHJhZnQiLCJsb2NhbGl6YXRpb24iLCJsb2NhbGUiLCJsb2NhbGVJbnB1dFR5cGUiLCJmYWxsYmFja0xvY2FsZSIsImZhbGxiYWNrTG9jYWxlSW5wdXRUeXBlIiwiYXJncyIsImV4dGVuc2lvbnMiLCJjb21wbGV4aXR5IiwicmVzb2x2ZSIsInBhcmVudCIsImNvbnRleHQiLCJyZWxhdGVkQ29sbGVjdGlvblNsdWciLCJxdWVyeSIsInJlc3VsdHMiLCJyZXN1bHRQcm9taXNlcyIsImNyZWF0ZVBvcHVsYXRpb25Qcm9taXNlIiwicmVsYXRlZERvYyIsImkiLCJpZCIsImNvbGxlY3Rpb25TbHVnIiwicmVzdWx0IiwicGF5bG9hZERhdGFMb2FkZXIiLCJsb2FkIiwiSlNPTiIsInN0cmluZ2lmeSIsInRyYW5zYWN0aW9uSUQiLCJmb3JFYWNoIiwiUHJvbWlzZSIsImFsbCIsImZpbHRlciIsImRvYyIsInJlbGF0ZWREb2N1bWVudCIsInJpY2hUZXh0IiwiZGVwdGgiLCJkZWZhdWx0RGVwdGgiLCJlZGl0b3IiLCJwb3B1bGF0aW9uUHJvbWlzZSIsInBvcHVsYXRlRGVwdGgiLCJtYXhEZXB0aCIsInVuZGVmaW5lZCIsImZpbmRNYW55IiwiZmxhdHRlbkxvY2FsZXMiLCJvdmVycmlkZUFjY2VzcyIsInBvcHVsYXRpb25Qcm9taXNlcyIsInNob3dIaWRkZW5GaWVsZHMiLCJzaWJsaW5nRG9jIiwicm93Iiwib2JqZWN0VHlwZUNvbmZpZ1dpdGhSb3dGaWVsZHMiLCJzZWxlY3QiLCJ0YWJzIiwidGFiU2NoZW1hIiwidGFiIiwidGFiSGFzTmFtZSIsInN1YkZpZWxkU2NoZW1hIiwidGV4dCIsInRleHRhcmVhIiwidXBsb2FkIiwidXBsb2FkTmFtZSIsInVwbG9hZEFyZ3MiLCJCb29sZWFuIiwid2hlcmVGaWVsZHMiLCJ3aGVyZSIsImJ1aWxkV2hlcmVJbnB1dFR5cGUiLCJvYmplY3RTY2hlbWEiLCJmaWVsZFNjaGVtYSJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiQUFBQSwwREFBMEQsR0FDMUQsbUNBQW1DLEdBQ25DLHVDQUF1Qzs7OzsrQkFxcUJ2Qzs7O2VBQUE7Ozt5QkF4cEJPO2dDQUNnRDtpQ0FFM0I7dUJBNEJEOzhCQUNIOzBFQUNNO21FQUNQO3NFQUNHOzRFQUNNO3dFQUNKO3lFQUNDOzs7Ozs7QUEyQjdCLFNBQVNBLGdCQUFnQixFQUN2QkMsSUFBSSxFQUNKQyxhQUFhLENBQUMsQ0FBQyxFQUNmQyxNQUFNLEVBQ05DLGFBQWEsRUFD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