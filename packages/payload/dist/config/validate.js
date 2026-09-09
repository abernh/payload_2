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
const _schema = /*#__PURE__*/ _interop_require_default(require("../collections/config/schema"));
const _schema1 = /*#__PURE__*/ _interop_require_wildcard(require("../fields/config/schema"));
const _types = require("../fields/config/types");
const _schema2 = /*#__PURE__*/ _interop_require_default(require("../globals/config/schema"));
const _schema3 = /*#__PURE__*/ _interop_require_default(require("./schema"));
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
const validateFields = (context, entity)=>{
    const errors = [];
    entity.fields.forEach((field)=>{
        let idResult = {
            error: null
        };
        if ((0, _types.fieldAffectsData)(field) && field.name === 'id') {
            idResult = _schema1.idField.validate(field, {
                abortEarly: false
            });
        }
        const result = _schema1.default.validate(field, {
            abortEarly: false
        });
        if (idResult.error) {
            idResult.error.details.forEach(({ message })=>{
                errors.push(`${context} "${entity.slug}" > Field${(0, _types.fieldAffectsData)(field) ? ` "${field.name}" >` : ''} ${message}`);
            });
        }
        if (result.error) {
            result.error.details.forEach(({ message })=>{
                errors.push(`${context} "${entity.slug}" > Field${(0, _types.fieldAffectsData)(field) ? ` "${field.name}" >` : ''} ${message}`);
            });
        }
    });
    return errors;
};
const validateCollections = async (collections)=>{
    const errors = [];
    collections.forEach((collection)=>{
        const result = _schema.default.validate(collection, {
            abortEarly: false
        });
        if (result.error) {
            result.error.details.forEach(({ message })=>{
                errors.push(`Collection "${collection.slug}" > ${message}`);
            });
        }
        errors.push(...validateFields('Collection', collection));
    });
    return errors;
};
const validateGlobals = (globals)=>{
    const errors = [];
    globals.forEach((global)=>{
        const result = _schema2.default.validate(global, {
            abortEarly: false
        });
        if (result.error) {
            result.error.details.forEach(({ message })=>{
                errors.push(`Globals "${global.slug}" > ${message}`);
            });
        }
        errors.push(...validateFields('Global', global));
    });
    return errors;
};
const validateSchema = async (config, logger)=>{
    const result = _schema3.default.validate(config, {
        abortEarly: false
    });
    if (!config?.joiValidation) {
        return config;
    }
    const nestedErrors = [
        ...await validateCollections(config.collections),
        ...validateGlobals(config.globals)
    ];
    if (result.error || nestedErrors.length > 0) {
        logger.error(`There were ${(result.error?.details?.length || 0) + nestedErrors.length} errors validating your Payload config`);
        let i = 0;
        if (result.error) {
            result.error.details.forEach(({ message })=>{
                i += 1;
                logger.error(`${i}: ${message}`);
            });
        }
        nestedErrors.forEach((message)=>{
            i += 1;
            logger.error(`${i}: ${message}`);
        });
        process.exit(1);
    }
    return result.value;
};
const _default = validateSchema;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25maWcvdmFsaWRhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBWYWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnam9pJ1xuaW1wb3J0IHR5cGUgeyBMb2dnZXIgfSBmcm9tICdwaW5vJ1xuXG5pbXBvcnQgdHlwZSB7IFNhbml0aXplZENvbGxlY3Rpb25Db25maWcgfSBmcm9tICcuLi9jb2xsZWN0aW9ucy9jb25maWcvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFNhbml0aXplZEdsb2JhbENvbmZpZyB9IGZyb20gJy4uL2dsb2JhbHMvY29uZmlnL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBTYW5pdGl6ZWRDb25maWcgfSBmcm9tICcuL3R5cGVzJ1xuXG5pbXBvcnQgY29sbGVjdGlvblNjaGVtYSBmcm9tICcuLi9jb2xsZWN0aW9ucy9jb25maWcvc2NoZW1hJ1xuaW1wb3J0IGZpZWxkU2NoZW1hLCB7IGlkRmllbGQgfSBmcm9tICcuLi9maWVsZHMvY29uZmlnL3NjaGVtYSdcbmltcG9ydCB7IGZpZWxkQWZmZWN0c0RhdGEgfSBmcm9tICcuLi9maWVsZHMvY29uZmlnL3R5cGVzJ1xuaW1wb3J0IGdsb2JhbFNjaGVtYSBmcm9tICcuLi9nbG9iYWxzL2NvbmZpZy9zY2hlbWEnXG5pbXBvcnQgc2NoZW1hIGZyb20gJy4vc2NoZW1hJ1xuXG5jb25zdCB2YWxpZGF0ZUZpZWxkcyA9IChcbiAgY29udGV4dDogc3RyaW5nLFxuICBlbnRpdHk6IFNhbml0aXplZENvbGxlY3Rpb25Db25maWcgfCBTYW5pdGl6ZWRHbG9iYWxDb25maWcsXG4pOiBzdHJpbmdbXSA9PiB7XG4gIGNvbnN0IGVycm9yczogc3RyaW5nW10gPSBbXVxuICBlbnRpdHkuZmllbGRzLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgbGV0IGlkUmVzdWx0OiBQYXJ0aWFsPFZhbGlkYXRpb25SZXN1bHQ+ID0geyBlcnJvcjogbnVsbCB9XG4gICAgaWYgKGZpZWxkQWZmZWN0c0RhdGEoZmllbGQpICYmIGZpZWxkLm5hbWUgPT09ICdpZCcpIHtcbiAgICAgIGlkUmVzdWx0ID0gaWRGaWVsZC52YWxpZGF0ZShmaWVsZCwgeyBhYm9ydEVhcmx5OiBmYWxzZSB9KVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGZpZWxkU2NoZW1hLnZhbGlkYXRlKGZpZWxkLCB7IGFib3J0RWFybHk6IGZhbHNlIH0pXG4gICAgaWYgKGlkUmVzdWx0LmVycm9yKSB7XG4gICAgICBpZFJlc3VsdC5lcnJvci5kZXRhaWxzLmZvckVhY2goKHsgbWVzc2FnZSB9KSA9PiB7XG4gICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgIGAke2NvbnRleHR9IFwiJHtlbnRpdHkuc2x1Z31cIiA+IEZpZWxkJHtcbiAgICAgICAgICAgIGZpZWxkQWZmZWN0c0RhdGEoZmllbGQpID8gYCBcIiR7ZmllbGQubmFtZX1cIiA+YCA6ICcnXG4gICAgICAgICAgfSAke21lc3NhZ2V9YCxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9XG4gICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgcmVzdWx0LmVycm9yLmRldGFpbHMuZm9yRWFjaCgoeyBtZXNzYWdlIH0pID0+IHtcbiAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgYCR7Y29udGV4dH0gXCIke2VudGl0eS5zbHVnfVwiID4gRmllbGQke1xuICAgICAgICAgICAgZmllbGRBZmZlY3RzRGF0YShmaWVsZCkgPyBgIFwiJHtmaWVsZC5uYW1lfVwiID5gIDogJydcbiAgICAgICAgICB9ICR7bWVzc2FnZX1gLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGVycm9yc1xufVxuXG5jb25zdCB2YWxpZGF0ZUNvbGxlY3Rpb25zID0gYXN5bmMgKGNvbGxlY3Rpb25zOiBTYW5pdGl6ZWRDb2xsZWN0aW9uQ29uZmlnW10pOiBQcm9taXNlPHN0cmluZ1tdPiA9PiB7XG4gIGNvbnN0IGVycm9yczogc3RyaW5nW10gPSBbXVxuICBjb2xsZWN0aW9ucy5mb3JFYWNoKChjb2xsZWN0aW9uKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gY29sbGVjdGlvblNjaGVtYS52YWxpZGF0ZShjb2xsZWN0aW9uLCB7IGFib3J0RWFybHk6IGZhbHNlIH0pXG4gICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgcmVzdWx0LmVycm9yLmRldGFpbHMuZm9yRWFjaCgoeyBtZXNzYWdlIH0pID0+IHtcbiAgICAgICAgZXJyb3JzLnB1c2goYENvbGxlY3Rpb24gXCIke2NvbGxlY3Rpb24uc2x1Z31cIiA+ICR7bWVzc2FnZX1gKVxuICAgICAgfSlcbiAgICB9XG4gICAgZXJyb3JzLnB1c2goLi4udmFsaWRhdGVGaWVsZHMoJ0NvbGxlY3Rpb24nLCBjb2xsZWN0aW9uKSlcbiAgfSlcblxuICByZXR1cm4gZXJyb3JzXG59XG5cbmNvbnN0IHZhbGlkYXRlR2xvYmFscyA9IChnbG9iYWxzOiBTYW5pdGl6ZWRHbG9iYWxDb25maWdbXSk6IHN0cmluZ1tdID0+IHtcbiAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdXG4gIGdsb2JhbHMuZm9yRWFjaCgoZ2xvYmFsKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gZ2xvYmFsU2NoZW1hLnZhbGlkYXRlKGdsb2JhbCwgeyBhYm9ydEVhcmx5OiBmYWxzZSB9KVxuICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgIHJlc3VsdC5lcnJvci5kZXRhaWxzLmZvckVhY2goKHsgbWVzc2FnZSB9KSA9PiB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBHbG9iYWxzIFwiJHtnbG9iYWwuc2x1Z31cIiA+ICR7bWVzc2FnZX1gKVxuICAgICAgfSlcbiAgICB9XG4gICAgZXJyb3JzLnB1c2goLi4udmFsaWRhdGVGaWVsZHMoJ0dsb2JhbCcsIGdsb2JhbCkpXG4gIH0pXG5cbiAgcmV0dXJuIGVycm9yc1xufVxuXG5jb25zdCB2YWxpZGF0ZVNjaGVtYSA9IGFzeW5jIChcbiAgY29uZmlnOiBTYW5pdGl6ZWRDb25maWcsXG4gIGxvZ2dlcjogTG9nZ2VyLFxuKTogUHJvbWlzZTxTYW5pdGl6ZWRDb25maWc+ID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gc2NoZW1hLnZhbGlkYXRlKGNvbmZpZywge1xuICAgIGFib3J0RWFybHk6IGZhbHNlLFxuICB9KVxuXG4gIGlmICghY29uZmlnPy5qb2lWYWxpZGF0aW9uKSB7XG4gICAgcmV0dXJuIGNvbmZpZ1xuICB9XG5cbiAgY29uc3QgbmVzdGVkRXJyb3JzID0gW1xuICAgIC4uLihhd2FpdCB2YWxpZGF0ZUNvbGxlY3Rpb25zKGNvbmZpZy5jb2xsZWN0aW9ucykpLFxuICAgIC4uLnZhbGlkYXRlR2xvYmFscyhjb25maWcuZ2xvYmFscyksXG4gIF1cblxuICBpZiAocmVzdWx0LmVycm9yIHx8IG5lc3RlZEVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgbG9nZ2VyLmVycm9yKFxuICAgICAgYFRoZXJlIHdlcmUgJHtcbiAgICAgICAgKHJlc3VsdC5lcnJvcj8uZGV0YWlscz8ubGVuZ3RoIHx8IDApICsgbmVzdGVkRXJyb3JzLmxlbmd0aFxuICAgICAgfSBlcnJvcnMgdmFsaWRhdGluZyB5b3VyIFBheWxvYWQgY29uZmlnYCxcbiAgICApXG5cbiAgICBsZXQgaSA9IDBcbiAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICByZXN1bHQuZXJyb3IuZGV0YWlscy5mb3JFYWNoKCh7IG1lc3NhZ2UgfSkgPT4ge1xuICAgICAgICBpICs9IDFcbiAgICAgICAgbG9nZ2VyLmVycm9yKGAke2l9OiAke21lc3NhZ2V9YClcbiAgICAgIH0pXG4gICAgfVxuICAgIG5lc3RlZEVycm9ycy5mb3JFYWNoKChtZXNzYWdlKSA9PiB7XG4gICAgICBpICs9IDFcbiAgICAgIGxvZ2dlci5lcnJvcihgJHtpfTogJHttZXNzYWdlfWApXG4gICAgfSlcblxuICAgIHByb2Nlc3MuZXhpdCgxKVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdC52YWx1ZVxufVxuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZVNjaGVtYVxuIl0sIm5hbWVzIjpbInZhbGlkYXRlRmllbGRzIiwiY29udGV4dCIsImVudGl0eSIsImVycm9ycyIsImZpZWxkcyIsImZvckVhY2giLCJmaWVsZCIsImlkUmVzdWx0IiwiZXJyb3IiLCJmaWVsZEFmZmVjdHNEYXRhIiwibmFtZSIsImlkRmllbGQiLCJ2YWxpZGF0ZSIsImFib3J0RWFybHkiLCJyZXN1bHQiLCJmaWVsZFNjaGVtYSIsImRldGFpbHMiLCJtZXNzYWdlIiwicHVzaCIsInNsdWciLCJ2YWxpZGF0ZUNvbGxlY3Rpb25zIiwiY29sbGVjdGlvbnMiLCJjb2xsZWN0aW9uIiwiY29sbGVjdGlvblNjaGVtYSIsInZhbGlkYXRlR2xvYmFscyIsImdsb2JhbHMiLCJnbG9iYWwiLCJnbG9iYWxTY2hlbWEiLCJ2YWxpZGF0ZVNjaGVtYSIsImNvbmZpZyIsImxvZ2dlciIsInNjaGVtYSIsImpvaVZhbGlkYXRpb24iLCJuZXN0ZWRFcnJvcnMiLCJsZW5ndGgiLCJpIiwicHJvY2VzcyIsImV4aXQiLCJ2YWx1ZSJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkF1SEE7OztlQUFBOzs7K0RBaEg2QjtpRUFDUTt1QkFDSjtnRUFDUjtnRUFDTjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFbkIsTUFBTUEsaUJBQWlCLENBQ3JCQyxTQUNBQztJQUVBLE1BQU1DLFNBQW1CLEVBQUU7SUFDM0JELE9BQU9FLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDLENBQUNDO1FBQ3JCLElBQUlDLFdBQXNDO1lBQUVDLE9BQU87UUFBSztRQUN4RCxJQUFJQyxJQUFBQSx1QkFBZ0IsRUFBQ0gsVUFBVUEsTUFBTUks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