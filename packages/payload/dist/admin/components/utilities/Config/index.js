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
    ConfigProvider: function() {
        return ConfigProvider;
    },
    useConfig: function() {
        return useConfig;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
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
const Context = /*#__PURE__*/ (0, _react.createContext)({});
const ConfigProvider = ({ children, config: incomingConfig })=>{
    const [config, setConfig] = _react.default.useState();
    const hasAwaited = _react.default.useRef(false);
    _react.default.useEffect(()=>{
        if (incomingConfig && !hasAwaited.current) {
            hasAwaited.current = true;
            const awaitConfig = async ()=>{
                const resolvedConfig = await incomingConfig;
                setConfig(resolvedConfig);
            };
            void awaitConfig();
        }
    }, [
        incomingConfig
    ]);
    if (!config) return null;
    return /*#__PURE__*/ _react.default.createElement(Context.Provider, {
        value: config
    }, children);
};
const useConfig = ()=>(0, _react.useContext)(Context);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3V0aWxpdGllcy9Db25maWcvaW5kZXgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnXG5cbmltcG9ydCB0eXBlIHsgU2FuaXRpemVkQ29uZmlnIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29uZmlnL3R5cGVzJ1xuXG5jb25zdCBDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxTYW5pdGl6ZWRDb25maWc+KHt9IGFzIFNhbml0aXplZENvbmZpZylcblxuZXhwb3J0IGNvbnN0IENvbmZpZ1Byb3ZpZGVyOiBSZWFjdC5GQzx7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGU7IGNvbmZpZzogU2FuaXRpemVkQ29uZmlnIH0+ID0gKHtcbiAgY2hpbGRyZW4sXG4gIGNvbmZpZzogaW5jb21pbmdDb25maWcsXG59KSA9PiB7XG4gIGNvbnN0IFtjb25maWcsIHNldENvbmZpZ10gPSBSZWFjdC51c2VTdGF0ZTxTYW5pdGl6ZWRDb25maWc+KClcbiAgY29uc3QgaGFzQXdhaXRlZCA9IFJlYWN0LnVzZVJlZihmYWxzZSlcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpbmNvbWluZ0NvbmZpZyAmJiAhaGFzQXdhaXRlZC5jdXJyZW50KSB7XG4gICAgICBoYXNBd2FpdGVkLmN1cnJlbnQgPSB0cnVlXG5cbiAgICAgIGNvbnN0IGF3YWl0Q29uZmlnID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXNvbHZlZENvbmZpZyA9IGF3YWl0IGluY29taW5nQ29uZmlnXG4gICAgICAgIHNldENvbmZpZyhyZXNvbHZlZENvbmZpZylcbiAgICAgIH1cbiAgICAgIHZvaWQgYXdhaXRDb25maWcoKVxuICAgIH1cbiAgfSwgW2luY29taW5nQ29uZmlnXSlcblxuICBpZiAoIWNvbmZpZykgcmV0dXJuIG51bGxcblxuICByZXR1cm4gPENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e2NvbmZpZ30+e2NoaWxkcmVufTwvQ29udGV4dC5Qcm92aWRlcj5cbn1cblxuZXhwb3J0IGNvbnN0IHVzZUNvbmZpZyA9ICgpOiBTYW5pdGl6ZWRDb25maWcgPT4gdXNlQ29udGV4dChDb250ZXh0KVxuIl0sIm5hbWVzIjpbIkNvbmZpZ1Byb3ZpZGVyIiwidXNlQ29uZmlnIiwiQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJjaGlsZHJlbiIsImNvbmZpZyIsImluY29taW5nQ29uZmlnIiwic2V0Q29uZmlnIiwiUmVhY3QiLCJ1c2VTdGF0ZSIsImhhc0F3YWl0ZWQiLCJ1c2VSZWYiLCJ1c2VFZmZlY3QiLCJjdXJyZW50IiwiYXdhaXRDb25maWciLCJyZXNvbHZlZENvbmZpZyIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VDb250ZXh0Il0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFNYUEsY0FBYztlQUFkQTs7SUF3QkFDLFNBQVM7ZUFBVEE7OzsrREE5Qm9DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJakQsTUFBTUMsd0JBQVVDLElBQUFBLG9CQUFhLEVBQWtCLENBQUM7QUFFekMsTUFBTUgsaUJBQW1GLENBQUMsRUFDL0ZJLFFBQVEsRUFDUkMsUUFBUUMsY0FBYyxFQUN2QjtJQUNDLE1BQU0sQ0FBQ0QsUUFBUUUsVUFBVSxHQUFHQyxjQUFLLENBQUNDLFFBQVE7SUFDMUMsTUFBTUMsYUFBYUYsY0FBSyxDQUFDRyxNQUFNLENBQUM7SUFFaENILGNBQUssQ0FBQ0ksU0FBUyxDQUFDO1FBQ2QsSUFBSU4sa0JBQWtCLENBQUNJLFdBQVdHLE9BQU8sRUFBRTtZQUN6Q0gsV0FBV0csT0FBTyxHQUFHO1lBRXJCLE1BQU1DLGNBQWM7Z0JBQ2xCLE1BQU1DLGlCQUFpQixNQUFNVDtnQkFDN0JDLFVBQVVRO1lBQ1o7WUFDQSxLQUFLRDtRQUNQO0lBQ0YsR0FBRztRQUFDUjtLQUFlO0lBRW5CLElBQUksQ0FBQ0QsUUFBUSxPQUFPO0lBRXBCLHFCQUFPLDZCQUFDSCxRQUFRYyxRQUFRO1FBQUNDLE9BQU9aO09BQVNEO0FBQzNDO0FBRU8sTUFBTUgsWUFBWSxJQUF1QmlCLElBQUFBLGlCQUFVLEVBQUNoQiJ9