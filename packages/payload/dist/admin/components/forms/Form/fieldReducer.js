"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fieldReducer", {
    enumerable: true,
    get: function() {
        return fieldReducer;
    }
});
const _bsonobjectid = /*#__PURE__*/ _interop_require_default(require("bson-objectid"));
const _deepequal = /*#__PURE__*/ _interop_require_default(require("deep-equal"));
const _deepCopyObject = require("../../../../utilities/deepCopyObject");
const _getSiblingData = /*#__PURE__*/ _interop_require_default(require("./getSiblingData"));
const _reduceFieldsToValues = /*#__PURE__*/ _interop_require_default(require("./reduceFieldsToValues"));
const _rows = require("./rows");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function fieldReducer(state, action) {
    switch(action.type){
        case 'REPLACE_STATE':
            {
                const newState = {};
                // Only update fields that have changed
                // by comparing old value / initialValue to new
                // ..
                // This is a performance enhancement for saving
                // large documents with hundreds of fields
                Object.entries(action.state).forEach(([path, field])=>{
                    const oldField = state[path];
                    const newField = field;
                    if (!(0, _deepequal.default)(oldField, newField)) {
                        newState[path] = newField;
                    } else if (oldField) {
                        newState[path] = oldField;
                    }
                });
                return newState;
            }
        case 'REMOVE':
            {
                const newState = {
                    ...state
                };
                if (newState[action.path]) delete newState[action.path];
                return newState;
            }
        case 'MODIFY_CONDITION':
            {
                const { path, result, user } = action;
                return Object.entries(state).reduce((newState, [fieldPath, field])=>{
                    if (fieldPath === path || fieldPath.indexOf(`${path}.`) === 0) {
                        let passesCondition = result;
                        // If a condition is being set to true,
                        // Set all conditions to true
                        // Besides those who still fail their own conditions
                        if (passesCondition && field.condition) {
                            passesCondition = Boolean(field.condition((0, _reduceFieldsToValues.default)(state, true), (0, _getSiblingData.default)(state, path), {
                                user
                            }));
                        }
                        return {
                            ...newState,
                            [fieldPath]: {
                                ...field,
                                passesCondition
                            }
                        };
                    }
                    return {
                        ...newState,
                        [fieldPath]: {
                            ...field
                        }
                    };
                }, {});
            }
        case 'UPDATE':
            {
                const newField = Object.entries(action).reduce((field, [key, value])=>{
                    if ([
                        'condition',
                        'disableFormData',
                        'errorMessage',
                        'initialValue',
                        'passesCondition',
                        'previousValue',
                        'rows',
                        'valid',
                        'validate',
                        'value'
                    ].includes(key)) {
                        return {
                            ...field,
                            [key]: value
                        };
                    }
                    return field;
                }, state[action.path] || {});
                return {
                    ...state,
                    [action.path]: newField
                };
            }
        case 'REMOVE_ROW':
            {
                const { path, rowIndex } = action;
                const { remainingFields, rows } = (0, _rows.separateRows)(path, state);
                const rowsMetadata = [
                    ...state[path]?.rows || []
                ];
                rows.splice(rowIndex, 1);
                rowsMetadata.splice(rowIndex, 1);
                const newState = {
                    ...remainingFields,
                    [path]: {
                        ...state[path],
                        disableFormData: rows.length > 0,
                        rows: rowsMetadata,
                        value: rows.length
                    },
                    ...(0, _rows.flattenRows)(path, rows)
                };
                return newState;
            }
        case 'ADD_ROW':
            {
                const { blockType, path, rowIndex: rowIndexFromArgs, subFieldState } = action;
                const rowIndex = typeof rowIndexFromArgs === 'number' ? rowIndexFromArgs : state[path]?.rows?.length || 0;
                const rowsMetadata = [
                    ...state[path]?.rows || []
                ];
                rowsMetadata.splice(rowIndex, 0, // new row
                {
                    id: new _bsonobjectid.default().toHexString(),
                    blockType: blockType || undefined,
                    childErrorPaths: new Set(),
                    collapsed: false
                });
                if (blockType) {
                    subFieldState.blockType = {
                        initialValue: blockType,
                        valid: true,
                        value: blockType
                    };
                }
                // add new row to array _field state_
                const { remainingFields, rows: siblingRows } = (0, _rows.separateRows)(path, state);
                siblingRows.splice(rowIndex, 0, subFieldState);
                const newState = {
                    ...remainingFields,
                    ...(0, _rows.flattenRows)(path, siblingRows),
                    [path]: {
                        ...state[path],
                        disableFormData: true,
                        rows: rowsMetadata,
                        value: siblingRows.length
                    }
                };
                return newState;
            }
        case 'REPLACE_ROW':
            {
                const { blockType, path, rowIndex: rowIndexArg, subFieldState } = action;
                const { remainingFields, rows: siblingRows } = (0, _rows.separateRows)(path, state);
                const rowIndex = Math.max(0, Math.min(rowIndexArg, siblingRows?.length - 1 || 0));
                const rowsMetadata = [
                    ...state[path]?.rows || []
                ];
                rowsMetadata[rowIndex] = {
                    id: new _bsonobjectid.default().toHexString(),
                    blockType: blockType || undefined,
                    childErrorPaths: new Set(),
                    collapsed: false
                };
                if (blockType) {
                    subFieldState.blockType = {
                        initialValue: blockType,
                        valid: true,
                        value: blockType
                    };
                }
                // replace form _field state_
                siblingRows[rowIndex] = subFieldState;
                const newState = {
                    ...remainingFields,
                    ...(0, _rows.flattenRows)(path, siblingRows),
                    [path]: {
                        ...state[path],
                        disableFormData: true,
                        rows: rowsMetadata,
                        value: siblingRows.length
                    }
                };
                return newState;
            }
        case 'DUPLICATE_ROW':
            {
                const { path, rowIndex } = action;
                const { remainingFields, rows } = (0, _rows.separateRows)(path, state);
                const rowsMetadata = state[path]?.rows || [];
                const duplicateRowMetadata = (0, _deepCopyObject.deepCopyObject)(rowsMetadata[rowIndex]);
                if (duplicateRowMetadata.id) duplicateRowMetadata.id = new _bsonobjectid.default().toHexString();
                const duplicateRowState = (0, _deepCopyObject.deepCopyObject)(rows[rowIndex]);
                if (duplicateRowState.id) duplicateRowState.id = new _bsonobjectid.default().toHexString();
                for (const key of Object.keys(duplicateRowState).filter((key)=>key.endsWith('.id'))){
                    const idState = duplicateRowState[key];
                    if (idState && typeof idState.value === 'string' && _bsonobjectid.default.isValid(idState.value)) {
                        duplicateRowState[key].value = new _bsonobjectid.default().toHexString();
                        duplicateRowState[key].initialValue = new _bsonobjectid.default().toHexString();
                    }
                }
                // If there are subfields
                if (Object.keys(duplicateRowState).length > 0) {
                    // Add new object containing subfield names to unflattenedRows array
                    rows.splice(rowIndex + 1, 0, duplicateRowState);
                    rowsMetadata.splice(rowIndex + 1, 0, duplicateRowMetadata);
                }
                const newState = {
                    ...remainingFields,
                    [path]: {
                        ...state[path],
                        disableFormData: true,
                        rows: rowsMetadata,
                        value: rows.length
                    },
                    ...(0, _rows.flattenRows)(path, rows)
                };
                return newState;
            }
        case 'MOVE_ROW':
            {
                const { moveFromIndex, moveToIndex, path } = action;
                const { remainingFields, rows } = (0, _rows.separateRows)(path, state);
                // copy the row to move
                const copyOfMovingRow = rows[moveFromIndex];
                // delete the row by index
                rows.splice(moveFromIndex, 1);
                // insert row copyOfMovingRow back in
                rows.splice(moveToIndex, 0, copyOfMovingRow);
                // modify array/block internal row state (i.e. collapsed, blockType)
                const rowStateCopy = [
                    ...state[path]?.rows || []
                ];
                const movingRowState = {
                    ...rowStateCopy[moveFromIndex]
                };
                rowStateCopy.splice(moveFromIndex, 1);
                rowStateCopy.splice(moveToIndex, 0, movingRowState);
                const newState = {
                    ...remainingFields,
                    ...(0, _rows.flattenRows)(path, rows),
                    [path]: {
                        ...state[path],
                        rows: rowStateCopy
                    }
                };
                return newState;
            }
        case 'SET_ROW_COLLAPSED':
            {
                const { collapsed, path, rowID, setDocFieldPreferences } = action;
                const arrayState = state[path];
                const { collapsedRowIDs, matchedIndex } = state[path].rows.reduce((acc, row, index)=>{
                    const isMatchingRow = row.id === rowID;
                    if (isMatchingRow) acc.matchedIndex = index;
                    if (!isMatchingRow && row.collapsed) acc.collapsedRowIDs.push(row.id);
                    else if (isMatchingRow && collapsed) acc.collapsedRowIDs.push(row.id);
                    return acc;
                }, {
                    collapsedRowIDs: [],
                    matchedIndex: undefined
                });
                if (matchedIndex > -1) {
                    arrayState.rows[matchedIndex].collapsed = collapsed;
                    setDocFieldPreferences(path, {
                        collapsed: collapsedRowIDs
                    });
                }
                const newState = {
                    ...state,
                    [path]: {
                        ...arrayState
                    }
                };
                return newState;
            }
        case 'SET_ALL_ROWS_COLLAPSED':
            {
                const { collapsed, path, setDocFieldPreferences } = action;
                const { collapsedRowIDs, rows } = state[path].rows.reduce((acc, row)=>{
                    if (collapsed) acc.collapsedRowIDs.push(row.id);
                    acc.rows.push({
                        ...row,
                        collapsed
                    });
                    return acc;
                }, {
                    collapsedRowIDs: [],
                    rows: []
                });
                setDocFieldPreferences(path, {
                    collapsed: collapsedRowIDs
                });
                return {
                    ...state,
                    [path]: {
                        ...state[path],
                        rows
                    }
                };
            }
        default:
            {
                return state;
            }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Zvcm1zL0Zvcm0vZmllbGRSZWR1Y2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPYmplY3RJRCBmcm9tICdic29uLW9iamVjdGlkJ1xuaW1wb3J0IGVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnXG5cbmltcG9ydCB0eXBlIHsgRmllbGRBY3Rpb24sIEZpZWxkcywgRm9ybUZpZWxkIH0gZnJvbSAnLi90eXBlcydcblxuaW1wb3J0IHsgZGVlcENvcHlPYmplY3QgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXRpZXMvZGVlcENvcHlPYmplY3QnXG5pbXBvcnQgZ2V0U2libGluZ0RhdGEgZnJvbSAnLi9nZXRTaWJsaW5nRGF0YSdcbmltcG9ydCByZWR1Y2VGaWVsZHNUb1ZhbHVlcyBmcm9tICcuL3JlZHVjZUZpZWxkc1RvVmFsdWVzJ1xuaW1wb3J0IHsgZmxhdHRlblJvd3MsIHNlcGFyYXRlUm93cyB9IGZyb20gJy4vcm93cydcblxuLyoqXG4gKiBSZWR1Y2VyIHdoaWNoIG1vZGlmaWVzIHRoZSBmb3JtIGZpZWxkIHN0YXRlIChhbGwgdGhlIGN1cnJlbnQgZGF0YSBvZiB0aGUgZmllbGRzIGluIHRoZSBmb3JtKS4gV2hlbiBjYWxsZWQgdXNpbmcgZGlzcGF0Y2gsIGl0IHdpbGwgcmV0dXJuIGEgbmV3IHN0YXRlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkUmVkdWNlcihzdGF0ZTogRmllbGRzLCBhY3Rpb246IEZpZWxkQWN0aW9uKTogRmllbGRzIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgJ1JFUExBQ0VfU1RBVEUnOiB7XG4gICAgICBjb25zdCBuZXdTdGF0ZSA9IHt9XG5cbiAgICAgIC8vIE9ubHkgdXBkYXRlIGZpZWxkcyB0aGF0IGhhdmUgY2hhbmdlZFxuICAgICAgLy8gYnkgY29tcGFyaW5nIG9sZCB2YWx1ZSAvIGluaXRpYWxWYWx1ZSB0byBuZXdcbiAgICAgIC8vIC4uXG4gICAgICAvLyBUaGlzIGlzIGEgcGVyZm9ybWFuY2UgZW5oYW5jZW1lbnQgZm9yIHNhdmluZ1xuICAgICAgLy8gbGFyZ2UgZG9jdW1lbnRzIHdpdGggaHVuZHJlZHMgb2YgZmllbGRzXG5cbiAgICAgIE9iamVjdC5lbnRyaWVzKGFjdGlvbi5zdGF0ZSkuZm9yRWFjaCgoW3BhdGgsIGZpZWxkXSkgPT4ge1xuICAgICAgICBjb25zdCBvbGRGaWVsZCA9IHN0YXRlW3BhdGhdXG4gICAgICAgIGNvbnN0IG5ld0ZpZWxkID0gZmllbGRcblxuICAgICAgICBpZiAoIWVxdWFsKG9sZEZpZWxkLCBuZXdGaWVsZCkpIHtcbiAgICAgICAgICBuZXdTdGF0ZVtwYXRoXSA9IG5ld0ZpZWxkXG4gICAgICAgIH0gZWxzZSBpZiAob2xkRmllbGQpIHtcbiAgICAgICAgICBuZXdTdGF0ZVtwYXRoXSA9IG9sZEZpZWxkXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiBuZXdTdGF0ZVxuICAgIH1cblxuICAgIGNhc2UgJ1JFTU9WRSc6IHtcbiAgICAgIGNvbnN0IG5ld1N0YXRlID0geyAuLi5zdGF0ZSB9XG4gICAgICBpZiAobmV3U3RhdGVbYWN0aW9uLnBhdGhdKSBkZWxldGUgbmV3U3RhdGVbYWN0aW9uLnBhdGhdXG4gICAgICByZXR1cm4gbmV3U3RhdGVcbiAgICB9XG5cbiAgICBjYXNlICdNT0RJRllfQ09ORElUSU9OJzoge1xuICAgICAgY29uc3QgeyBwYXRoLCByZXN1bHQsIHVzZXIgfSA9IGFjdGlvblxuXG4gICAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoc3RhdGUpLnJlZHVjZSgobmV3U3RhdGUsIFtmaWVsZFBhdGgsIGZpZWxkXSkgPT4ge1xuICAgICAgICBpZiAoZmllbGRQYXRoID09PSBwYXRoIHx8IGZpZWxkUGF0aC5pbmRleE9mKGAke3BhdGh9LmApID09PSAwKSB7XG4gICAgICAgICAgbGV0IHBhc3Nlc0NvbmRpdGlvbiA9IHJlc3VsdFxuXG4gICAgICAgICAgLy8gSWYgYSBjb25kaXRpb24gaXMgYmVpbmcgc2V0IHRvIHRydWUsXG4gICAgICAgICAgLy8gU2V0IGFsbCBjb25kaXRpb25zIHRvIHRydWVcbiAgICAgICAgICAvLyBCZXNpZGVzIHRob3NlIHdobyBzdGlsbCBmYWlsIHRoZWlyIG93biBjb25kaXRpb25zXG5cbiAgICAgICAgICBpZiAocGFzc2VzQ29uZGl0aW9uICYmIGZpZWxkLmNvbmRpdGlvbikge1xuICAgICAgICAgICAgcGFzc2VzQ29uZGl0aW9uID0gQm9vbGVhbihcbiAgICAgICAgICAgICAgZmllbGQuY29uZGl0aW9uKHJlZHVjZUZpZWxkc1RvVmFsdWVzKHN0YXRlLCB0cnVlKSwgZ2V0U2libGluZ0RhdGEoc3RhdGUsIHBhdGgpLCB7XG4gICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLm5ld1N0YXRlLFxuICAgICAgICAgICAgW2ZpZWxkUGF0aF06IHtcbiAgICAgICAgICAgICAgLi4uZmllbGQsXG4gICAgICAgICAgICAgIHBhc3Nlc0NvbmRpdGlvbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5uZXdTdGF0ZSxcbiAgICAgICAgICBbZmllbGRQYXRoXToge1xuICAgICAgICAgICAgLi4uZmllbGQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgfSwge30pXG4gICAgfVxuXG4gICAgY2FzZSAnVVBEQVRFJzoge1xuICAgICAgY29uc3QgbmV3RmllbGQgPSBPYmplY3QuZW50cmllcyhhY3Rpb24pLnJlZHVjZShcbiAgICAgICAgKGZpZWxkLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdjb25kaXRpb24nLFxuICAgICAgICAgICAgICAnZGlzYWJsZUZvcm1EYXRhJyxcbiAgICAgICAgICAgICAgJ2Vycm9yTWVzc2FnZScsXG4gICAgICAgICAgICAgICdpbml0aWFsVmFsdWUnLFxuICAgICAgICAgICAgICAncGFzc2VzQ29uZGl0aW9uJyxcbiAgICAgICAgICAgICAgJ3ByZXZpb3VzVmFsdWUnLFxuICAgICAgICAgICAgICAncm93cycsXG4gICAgICAgICAgICAgICd2YWxpZCcsXG4gICAgICAgICAgICAgICd2YWxpZGF0ZScsXG4gICAgICAgICAgICAgICd2YWx1ZScsXG4gICAgICAgICAgICBdLmluY2x1ZGVzKGtleSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLmZpZWxkLFxuICAgICAgICAgICAgICBba2V5XTogdmFsdWUsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGZpZWxkXG4gICAgICAgIH0sXG4gICAgICAgIHN0YXRlW2FjdGlvbi5wYXRoXSB8fCAoe30gYXMgRm9ybUZpZWxkKSxcbiAgICAgIClcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIFthY3Rpb24ucGF0aF06IG5ld0ZpZWxkLFxuICAgICAgfVxuICAgIH1cblxuICAgIGNhc2UgJ1JFTU9WRV9ST1cnOiB7XG4gICAgICBjb25zdCB7IHBhdGgsIHJvd0luZGV4IH0gPSBhY3Rpb25cbiAgICAgIGNvbnN0IHsgcmVtYWluaW5nRmllbGRzLCByb3dzIH0gPSBzZXBhcmF0ZVJvd3MocGF0aCwgc3RhdGUpXG4gICAgICBjb25zdCByb3dzTWV0YWRhdGEgPSBbLi4uKHN0YXRlW3BhdGhdPy5yb3dzIHx8IFtdKV1cblxuICAgICAgcm93cy5zcGxpY2Uocm93SW5kZXgsIDEpXG4gICAgICByb3dzTWV0YWRhdGEuc3BsaWNlKHJvd0luZGV4LCAxKVxuXG4gICAgICBjb25zdCBuZXdTdGF0ZTogRmllbGRzID0ge1xuICAgICAgICAuLi5yZW1haW5pbmdGaWVsZHMsXG4gICAgICAgIFtwYXRoXToge1xuICAgICAgICAgIC4uLnN0YXRlW3BhdGhdLFxuICAgICAgICAgIGRpc2FibGVGb3JtRGF0YTogcm93cy5sZW5ndGggPiAwLFxuICAgICAgICAgIHJvd3M6IHJvd3NNZXRhZGF0YSxcbiAgICAgICAgICB2YWx1ZTogcm93cy5sZW5ndGgsXG4gICAgICAgIH0sXG4gICAgICAgIC4uLmZsYXR0ZW5Sb3dzKHBhdGgsIHJvd3MpLFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3U3RhdGVcbiAgICB9XG5cbiAgICBjYXNlICdBRERfUk9XJzoge1xuICAgICAgY29uc3QgeyBibG9ja1R5cGUsIHBhdGgsIHJvd0luZGV4OiByb3dJbmRleEZyb21BcmdzLCBzdWJGaWVsZFN0YXRlIH0gPSBhY3Rpb25cbiAgICAgIGNvbnN0IHJvd0luZGV4ID1cbiAgICAgICAgdHlwZW9mIHJvd0luZGV4RnJvbUFyZ3MgPT09ICdudW1iZXInID8gcm93SW5kZXhGcm9tQXJncyA6IHN0YXRlW3BhdGhdPy5yb3dzPy5sZW5ndGggfHwgMFxuXG4gICAgICBjb25zdCByb3dzTWV0YWRhdGEgPSBbLi4uKHN0YXRlW3BhdGhdPy5yb3dzIHx8IFtdKV1cbiAgICAgIHJvd3NNZXRhZGF0YS5zcGxpY2UoXG4gICAgICAgIHJvd0luZGV4LFxuICAgICAgICAwLFxuICAgICAgICAvLyBuZXcgcm93XG4gICAgICAgIHtcbiAgICAgICAgICBpZDogbmV3IE9iamVjdElEKCkudG9IZXhTdHJpbmcoKSxcbiAgICAgICAgICBibG9ja1R5cGU6IGJsb2NrVHlwZSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgY2hpbGRFcnJvclBhdGhzOiBuZXcgU2V0KCksXG4gICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIClcblxuICAgICAgaWYgKGJsb2NrVHlwZSkge1xuICAgICAgICBzdWJGaWVsZFN0YXRlLmJsb2NrVHlwZSA9IHtcbiAgICAgICAgICBpbml0aWFsVmFsdWU6IGJsb2NrVHlwZSxcbiAgICAgICAgICB2YWxpZDogdHJ1ZSxcbiAgICAgICAgICB2YWx1ZTogYmxvY2tUeXBlLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBuZXcgcm93IHRvIGFycmF5IF9maWVsZCBzdGF0ZV9cbiAgICAgIGNvbnN0IHsgcmVtYWluaW5nRmllbGRzLCByb3dzOiBzaWJsaW5nUm93cyB9ID0gc2VwYXJhdGVSb3dzKHBhdGgsIHN0YXRlKVxuICAgICAgc2libGluZ1Jvd3Muc3BsaWNlKHJvd0luZGV4LCAwLCBzdWJGaWVsZFN0YXRlKVxuXG4gICAgICBjb25zdCBuZXdTdGF0ZTogRmllbGRzID0ge1xuICAgICAgICAuLi5yZW1haW5pbmdGaWVsZHMsXG4gICAgICAgIC4uLmZsYXR0ZW5Sb3dzKHBhdGgsIHNpYmxpbmdSb3dzKSxcbiAgICAgICAgW3BhdGhdOiB7XG4gICAgICAgICAgLi4uc3RhdGVbcGF0aF0sXG4gICAgICAgICAgZGlzYWJsZUZvcm1EYXRhOiB0cnVlLFxuICAgICAgICAgIHJvd3M6IHJvd3NNZXRhZGF0YSxcbiAgICAgICAgICB2YWx1ZTogc2libGluZ1Jvd3MubGVuZ3RoLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3U3RhdGVcbiAgICB9XG5cbiAgICBjYXNlICdSRVBMQUNFX1JPVyc6IHtcbiAgICAgIGNvbnN0IHsgYmxvY2tUeXBlLCBwYXRoLCByb3dJbmRleDogcm93SW5kZXhBcmcsIHN1YkZpZWxkU3RhdGUgfSA9IGFjdGlvblxuICAgICAgY29uc3QgeyByZW1haW5pbmdGaWVsZHMsIHJvd3M6IHNpYmxpbmdSb3dzIH0gPSBzZXBhcmF0ZVJvd3MocGF0aCwgc3RhdGUpXG4gICAgICBjb25zdCByb3dJbmRleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHJvd0luZGV4QXJnLCBzaWJsaW5nUm93cz8ubGVuZ3RoIC0gMSB8fCAwKSlcblxuICAgICAgY29uc3Qgcm93c01ldGFkYXRhID0gWy4uLihzdGF0ZVtwYXRoXT8ucm93cyB8fCBbXSldXG4gICAgICByb3dzTWV0YWRhdGFbcm93SW5kZXhdID0ge1xuICAgICAgICBpZDogbmV3IE9iamVjdElEKCkudG9IZXhTdHJpbmcoKSxcbiAgICAgICAgYmxvY2tUeXBlOiBibG9ja1R5cGUgfHwgdW5kZWZpbmVkLFxuICAgICAgICBjaGlsZEVycm9yUGF0aHM6IG5ldyBTZXQoKSxcbiAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIH1cblxuICAgICAgaWYgKGJsb2NrVHlwZSkge1xuICAgICAgICBzdWJGaWVsZFN0YXRlLmJsb2NrVHlwZSA9IHtcbiAgICAgICAgICBpbml0aWFsVmFsdWU6IGJsb2NrVHlwZSxcbiAgICAgICAgICB2YWxpZDogdHJ1ZSxcbiAgICAgICAgICB2YWx1ZTogYmxvY2tUeXBlLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHJlcGxhY2UgZm9ybSBfZmllbGQgc3RhdGVfXG4gICAgICBzaWJsaW5nUm93c1tyb3dJbmRleF0gPSBzdWJGaWVsZFN0YXRlXG5cbiAgICAgIGNvbnN0IG5ld1N0YXRlOiBGaWVsZHMgPSB7XG4gICAgICAgIC4uLnJlbWFpbmluZ0ZpZWxkcyxcbiAgICAgICAgLi4uZmxhdHRlblJvd3MocGF0aCwgc2libGluZ1Jvd3MpLFxuICAgICAgICBbcGF0aF06IHtcbiAgICAgICAgICAuLi5zdGF0ZVtwYXRoXSxcbiAgICAgICAgICBkaXNhYmxlRm9ybURhdGE6IHRydWUsXG4gICAgICAgICAgcm93czogcm93c01ldGFkYXRhLFxuICAgICAgICAgIHZhbHVlOiBzaWJsaW5nUm93cy5sZW5ndGgsXG4gICAgICAgIH0sXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXdTdGF0ZVxuICAgIH1cblxuICAgIGNhc2UgJ0RVUExJQ0FURV9ST1cnOiB7XG4gICAgICBjb25zdCB7IHBhdGgsIHJvd0luZGV4IH0gPSBhY3Rpb25cbiAgICAgIGNvbnN0IHsgcmVtYWluaW5nRmllbGRzLCByb3dzIH0gPSBzZXBhcmF0ZVJvd3MocGF0aCwgc3RhdGUpXG4gICAgICBjb25zdCByb3dzTWV0YWRhdGEgPSBzdGF0ZVtwYXRoXT8ucm93cyB8fCBbXVxuXG4gICAgICBjb25zdCBkdXBsaWNhdGVSb3dNZXRhZGF0YSA9IGRlZXBDb3B5T2JqZWN0KHJvd3NNZXRhZGF0YVtyb3dJbmRleF0pXG4gICAgICBpZiAoZHVwbGljYXRlUm93TWV0YWRhdGEuaWQpIGR1cGxpY2F0ZVJvd01ldGFkYXRhLmlkID0gbmV3IE9iamVjdElEKCkudG9IZXhTdHJpbmcoKVxuXG4gICAgICBjb25zdCBkdXBsaWNhdGVSb3dTdGF0ZSA9IGRlZXBDb3B5T2JqZWN0KHJvd3Nbcm93SW5kZXhdKVxuICAgICAgaWYgKGR1cGxpY2F0ZVJvd1N0YXRlLmlkKSBkdXBsaWNhdGVSb3dTdGF0ZS5pZCA9IG5ldyBPYmplY3RJRCgpLnRvSGV4U3RyaW5nKClcblxuICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoZHVwbGljYXRlUm93U3RhdGUpLmZpbHRlcigoa2V5KSA9PiBrZXkuZW5kc1dpdGgoJy5pZCcpKSkge1xuICAgICAgICBjb25zdCBpZFN0YXRlID0gZHVwbGljYXRlUm93U3RhdGVba2V5XVxuXG4gICAgICAgIGlmIChpZFN0YXRlICYmIHR5cGVvZiBpZFN0YXRlLnZhbHVlID09PSAnc3RyaW5nJyAmJiBPYmplY3RJRC5pc1ZhbGlkKGlkU3RhdGUudmFsdWUpKSB7XG4gICAgICAgICAgZHVwbGljYXRlUm93U3RhdGVba2V5XS52YWx1ZSA9IG5ldyBPYmplY3RJRCgpLnRvSGV4U3RyaW5nKClcbiAgICAgICAgICBkdXBsaWNhdGVSb3dTdGF0ZVtrZXldLmluaXRpYWxWYWx1ZSA9IG5ldyBPYmplY3RJRCgpLnRvSGV4U3RyaW5nKClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgc3ViZmllbGRzXG4gICAgICBpZiAoT2JqZWN0LmtleXMoZHVwbGljYXRlUm93U3RhdGUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gQWRkIG5ldyBvYmplY3QgY29udGFpbmluZyBzdWJmaWVsZCBuYW1lcyB0byB1bmZsYXR0ZW5lZFJvd3MgYXJyYXlcbiAgICAgICAgcm93cy5zcGxpY2Uocm93SW5kZXggKyAxLCAwLCBkdXBsaWNhdGVSb3dTdGF0ZSlcbiAgICAgICAgcm93c01ldGFkYXRhLnNwbGljZShyb3dJbmRleCArIDEsIDAsIGR1cGxpY2F0ZVJvd01ldGFkYXRhKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAgICAgLi4ucmVtYWluaW5nRmllbGRzLFxuICAgICAgICBbcGF0aF06IHtcbiAgICAgICAgICAuLi5zdGF0ZVtwYXRoXSxcbiAgICAgICAgICBkaXNhYmxlRm9ybURhdGE6IHRydWUsXG4gICAgICAgICAgcm93czogcm93c01ldGFkYXRhLFxuICAgICAgICAgIHZhbHVlOiByb3dzLmxlbmd0aCxcbiAgICAgICAgfSxcbiAgICAgICAgLi4uZmxhdHRlblJvd3MocGF0aCwgcm93cyksXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXdTdGF0ZVxuICAgIH1cblxuICAgIGNhc2UgJ01PVkVfUk9XJzoge1xuICAgICAgY29uc3QgeyBtb3ZlRnJvbUluZGV4LCBtb3ZlVG9JbmRleCwgcGF0aCB9ID0gYWN0aW9uXG4gICAgICBjb25zdCB7IHJlbWFpbmluZ0ZpZWxkcywgcm93cyB9ID0gc2VwYXJhdGVSb3dzKHBhdGgsIHN0YXRlKVxuXG4gICAgICAvLyBjb3B5IHRoZSByb3cgdG8gbW92ZVxuICAgICAgY29uc3QgY29weU9mTW92aW5nUm93ID0gcm93c1ttb3ZlRnJvbUluZGV4XVxuICAgICAgLy8gZGVsZXRlIHRoZSByb3cgYnkgaW5kZXhcbiAgICAgIHJvd3Muc3BsaWNlKG1vdmVGcm9tSW5kZXgsIDEpXG4gICAgICAvLyBpbnNlcnQgcm93IGNvcHlPZk1vdmluZ1JvdyBiYWNrIGluXG4gICAgICByb3dzLnNwbGljZShtb3ZlVG9JbmRleCwgMCwgY29weU9mTW92aW5nUm93KVxuXG4gICAgICAvLyBtb2RpZnkgYXJyYXkvYmxvY2sgaW50ZXJuYWwgcm93IHN0YXRlIChpLmUuIGNvbGxhcHNlZCwgYmxvY2tUeXBlKVxuICAgICAgY29uc3Qgcm93U3RhdGVDb3B5ID0gWy4uLihzdGF0ZVtwYXRoXT8ucm93cyB8fCBbXSldXG4gICAgICBjb25zdCBtb3ZpbmdSb3dTdGF0ZSA9IHsgLi4ucm93U3RhdGVDb3B5W21vdmVGcm9tSW5kZXhdIH1cbiAgICAgIHJvd1N0YXRlQ29weS5zcGxpY2UobW92ZUZyb21JbmRleCwgMSlcbiAgICAgIHJvd1N0YXRlQ29weS5zcGxpY2UobW92ZVRvSW5kZXgsIDAsIG1vdmluZ1Jvd1N0YXRlKVxuXG4gICAgICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAgICAgLi4ucmVtYWluaW5nRmllbGRzLFxuICAgICAgICAuLi5mbGF0dGVuUm93cyhwYXRoLCByb3dzKSxcbiAgICAgICAgW3BhdGhdOiB7XG4gICAgICAgICAgLi4uc3RhdGVbcGF0aF0sXG4gICAgICAgICAgcm93czogcm93U3RhdGVDb3B5LFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3U3RhdGVcbiAgICB9XG5cbiAgICBjYXNlICdTRVRfUk9XX0NPTExBUFNFRCc6IHtcbiAgICAgIGNvbnN0IHsgY29sbGFwc2VkLCBwYXRoLCByb3dJRCwgc2V0RG9jRmllbGRQcmVmZXJlbmNlcyB9ID0gYWN0aW9uXG5cbiAgICAgIGNvbnN0IGFycmF5U3RhdGUgPSBzdGF0ZVtwYXRoXVxuXG4gICAgICBjb25zdCB7IGNvbGxhcHNlZFJvd0lEcywgbWF0Y2hlZEluZGV4IH0gPSBzdGF0ZVtwYXRoXS5yb3dzLnJlZHVjZShcbiAgICAgICAgKGFjYywgcm93LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlzTWF0Y2hpbmdSb3cgPSByb3cuaWQgPT09IHJvd0lEXG4gICAgICAgICAgaWYgKGlzTWF0Y2hpbmdSb3cpIGFjYy5tYXRjaGVkSW5kZXggPSBpbmRleFxuXG4gICAgICAgICAgaWYgKCFpc01hdGNoaW5nUm93ICYmIHJvdy5jb2xsYXBzZWQpIGFjYy5jb2xsYXBzZWRSb3dJRHMucHVzaChyb3cuaWQpXG4gICAgICAgICAgZWxzZSBpZiAoaXNNYXRjaGluZ1JvdyAmJiBjb2xsYXBzZWQpIGFjYy5jb2xsYXBzZWRSb3dJRHMucHVzaChyb3cuaWQpXG5cbiAgICAgICAgICByZXR1cm4gYWNjXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb2xsYXBzZWRSb3dJRHM6IFtdLFxuICAgICAgICAgIG1hdGNoZWRJbmRleDogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgKVxuXG4gICAgICBpZiAobWF0Y2hlZEluZGV4ID4gLTEpIHtcbiAgICAgICAgYXJyYXlTdGF0ZS5yb3dzW21hdGNoZWRJbmRleF0uY29sbGFwc2VkID0gY29sbGFwc2VkXG4gICAgICAgIHNldERvY0ZpZWxkUHJlZmVyZW5jZXMocGF0aCwgeyBjb2xsYXBzZWQ6IGNvbGxhcHNlZFJvd0lEcyB9KVxuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIFtwYXRoXToge1xuICAgICAgICAgIC4uLmFycmF5U3RhdGUsXG4gICAgICAgIH0sXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXdTdGF0ZVxuICAgIH1cblxuICAgIGNhc2UgJ1NFVF9BTExfUk9XU19DT0xMQVBTRUQnOiB7XG4gICAgICBjb25zdCB7IGNvbGxhcHNlZCwgcGF0aCwgc2V0RG9jRmllbGRQcmVmZXJlbmNlcyB9ID0gYWN0aW9uXG5cbiAgICAgIGNvbnN0IHsgY29sbGFwc2VkUm93SURzLCByb3dzIH0gPSBzdGF0ZVtwYXRoXS5yb3dzLnJlZHVjZShcbiAgICAgICAgKGFjYywgcm93KSA9PiB7XG4gICAgICAgICAgaWYgKGNvbGxhcHNlZCkgYWNjLmNvbGxhcHNlZFJvd0lEcy5wdXNoKHJvdy5pZClcblxuICAgICAgICAgIGFjYy5yb3dzLnB1c2goe1xuICAgICAgICAgICAgLi4ucm93LFxuICAgICAgICAgICAgY29sbGFwc2VkLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICByZXR1cm4gYWNjXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb2xsYXBzZWRSb3dJRHM6IFtdLFxuICAgICAgICAgIHJvd3M6IFtdLFxuICAgICAgICB9LFxuICAgICAgKVxuXG4gICAgICBzZXREb2NGaWVsZFByZWZlcmVuY2VzKHBhdGgsIHsgY29sbGFwc2VkOiBjb2xsYXBzZWRSb3dJRHMgfSlcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIFtwYXRoXToge1xuICAgICAgICAgIC4uLnN0YXRlW3BhdGhdLFxuICAgICAgICAgIHJvd3MsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVmYXVsdDoge1xuICAgICAgcmV0dXJuIHN0YXRlXG4gICAgfVxuICB9XG59XG4iXSwibmFtZXMiOlsiZmllbGRSZWR1Y2VyIiwic3RhdGUiLCJhY3Rpb24iLCJ0eXBlIiwibmV3U3RhdGUiLCJPYmplY3QiLCJlbnRyaWVzIiwiZm9yRWFjaCIsInBhdGgiLCJmaWVsZCIsIm9sZEZpZWxkIiwibmV3RmllbGQiLCJlcXVhbCIsInJlc3VsdCIsInVzZXIiLCJyZWR1Y2UiLCJmaWVsZFBhdGgiLCJpbmRleE9mIiwicGFzc2VzQ29uZGl0aW9uIiwiY29uZGl0aW9uIiwiQm9vbGVhbiIsInJlZHVjZUZpZWxkc1RvVmFsdWVzIiwiZ2V0U2libGluZ0RhdGEiLCJrZXkiLCJ2YWx1ZSIsImluY2x1ZGVzIiwicm93SW5kZXgiLCJyZW1haW5pbmdGaWVsZHMiLCJyb3dzIiwic2VwYXJhdGVSb3dzIiwicm93c01ldGFkYXRhIiwic3BsaWNlIiwiZGlzYWJsZUZvcm1EYXRhIiwibGVuZ3RoIiwiZmxhdHRlblJvd3MiLCJibG9ja1R5cGUiLCJyb3dJbmRleEZyb21BcmdzIiwic3ViRmllbGRTdGF0ZSIsImlkIiwiT2JqZWN0SUQiLCJ0b0hleFN0cmluZyIsInVuZGVmaW5lZCIsImNoaWxkRXJyb3JQYXRocyIsIlNldCIsImNvbGxhcHNlZCIsImluaXRpYWxWYWx1ZSIsInZhbGlkIiwic2libGluZ1Jvd3MiLCJyb3dJbmRleEFyZyIsIk1hdGgiLCJtYXgiLCJtaW4iLCJkdXBsaWNhdGVSb3dNZXRhZGF0YSIsImRlZXBDb3B5T2JqZWN0IiwiZHVwbGljYXRlUm93U3RhdGUiLCJrZXlzIiwiZmlsdGVyIiwiZW5kc1dpdGgiLCJpZFN0YXRlIiwiaXNWYWxpZCIsIm1vdmVGcm9tSW5kZXgiLCJtb3ZlVG9JbmRleCIsImNvcHlPZk1vdmluZ1JvdyIsInJvd1N0YXRlQ29weSIsIm1vdmluZ1Jvd1N0YXRlIiwicm93SUQiLCJzZXREb2NGaWVsZFByZWZlcmVuY2VzIiwiYXJyYXlTdGF0ZSIsImNvbGxhcHNlZFJvd0lEcyIsIm1hdGNoZWRJbmRleCIsImFjYyIsInJvdyIsImluZGV4IiwiaXNNYXRjaGluZ1JvdyIsInB1c2giXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7K0JBYWdCQTs7O2VBQUFBOzs7cUVBYks7a0VBQ0g7Z0NBSWE7dUVBQ0o7NkVBQ007c0JBQ1M7Ozs7OztBQUtuQyxTQUFTQSxhQUFhQyxLQUFhLEVBQUVDLE1B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