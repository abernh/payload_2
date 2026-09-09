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
const _react = require("react");
const _reacti18next = require("react-i18next");
const _useThrottledEffect = /*#__PURE__*/ _interop_require_default(require("../../../hooks/useThrottledEffect"));
const _Auth = require("../../utilities/Auth");
const _Config = require("../../utilities/Config");
const _DocumentInfo = require("../../utilities/DocumentInfo");
const _OperationProvider = require("../../utilities/OperationProvider");
const _context = require("../Form/context");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Get and set the value of a form field.
 *
 * @see https://payloadcms.com/docs/admin/hooks#usefield
 */ const useField = (options)=>{
    const { condition, disableFormData = false, hasRows, path, validate } = options;
    const submitted = (0, _context.useFormSubmitted)();
    const processing = (0, _context.useFormProcessing)();
    const { user } = (0, _Auth.useAuth)();
    const { id } = (0, _DocumentInfo.useDocumentInfo)();
    const operation = (0, _OperationProvider.useOperation)();
    const field = (0, _context.useFormFields)(([fields])=>fields[path]);
    const { t } = (0, _reacti18next.useTranslation)();
    const dispatchField = (0, _context.useFormFields)(([_, dispatch])=>dispatch);
    const config = (0, _Config.useConfig)();
    const { getData, getDataByPath, getSiblingData, setModified } = (0, _context.useForm)();
    const value = field?.value;
    const initialValue = field?.initialValue;
    const valid = typeof field?.valid === 'boolean' ? field.valid : true;
    const showError = valid === false && submitted;
    const prevValid = (0, _react.useRef)(valid);
    const prevErrorMessage = (0, _react.useRef)(field?.errorMessage);
    const prevValue = (0, _react.useRef)(value);
    // Method to return from `useField`, used to
    // update field values from field component(s)
    const setValue = (0, _react.useCallback)((e, disableModifyingForm = false)=>{
        const val = e && e.target ? e.target.value : e;
        if (!disableModifyingForm) {
            if (typeof setModified === 'function') {
                // Update modified state after field value comes back
                // to avoid cursor jump caused by state value / DOM mismatch
                setTimeout(()=>{
                    setModified(true);
                }, 10);
            }
        }
        dispatchField({
            type: 'UPDATE',
            disableFormData: disableFormData || hasRows && val > 0,
            path,
            value: val
        });
    }, [
        setModified,
        path,
        dispatchField,
        disableFormData,
        hasRows
    ]);
    // Store result from hook as ref
    // to prevent unnecessary rerenders
    const result = (0, _react.useMemo)(()=>({
            errorMessage: field?.errorMessage,
            formProcessing: processing,
            formSubmitted: submitted,
            initialValue,
            rows: field?.rows,
            setValue,
            showError,
            valid: field?.valid,
            value
        }), [
        field?.errorMessage,
        field?.rows,
        field?.valid,
        processing,
        setValue,
        showError,
        submitted,
        value,
        initialValue
    ]);
    // Throttle the validate function
    (0, _useThrottledEffect.default)(()=>{
        const validateField = async ()=>{
            let valueToValidate = value;
            if (field?.rows && Array.isArray(field.rows)) {
                valueToValidate = getDataByPath(path);
            }
            let errorMessage;
            let valid = false;
            const validationResult = typeof validate === 'function' ? await validate(valueToValidate, {
                id,
                config,
                data: getData(),
                operation,
                previousValue: prevValue.current,
                siblingData: getSiblingData(path),
                t,
                user
            }) : true;
            if (typeof validationResult === 'string') {
                errorMessage = validationResult;
                valid = false;
            } else {
                valid = validationResult;
                errorMessage = undefined;
            }
            // Only dispatch if the validation result has changed
            // This will prevent unnecessary rerenders
            if (valid !== prevValid.current || errorMessage !== prevErrorMessage.current) {
                prevValid.current = valid;
                prevErrorMessage.current = errorMessage;
                if (typeof dispatchField === 'function') {
                    dispatchField({
                        type: 'UPDATE',
                        condition,
                        disableFormData: disableFormData || (hasRows ? typeof value === 'number' && value > 0 : false),
                        errorMessage,
                        path,
                        previousValue: prevValue.current,
                        rows: field?.rows,
                        valid,
                        validate,
                        value
                    });
                }
            }
        };
        void validateField();
    }, 150, [
        value,
        condition,
        disableFormData,
        dispatchField,
        getData,
        getSiblingData,
        getDataByPath,
        id,
        operation,
        path,
        user,
        validate,
        field?.rows
    ]);
    return result;
};
const _default = useField;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Zvcm1zL3VzZUZpZWxkL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlTWVtbywgdXNlUmVmIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5cbmltcG9ydCB0eXBlIHsgRmllbGRUeXBlLCBPcHRpb25zIH0gZnJvbSAnLi90eXBlcydcblxuaW1wb3J0IHVzZVRocm90dGxlZEVmZmVjdCBmcm9tICcuLi8uLi8uLi9ob29rcy91c2VUaHJvdHRsZWRFZmZlY3QnXG5pbXBvcnQgeyB1c2VBdXRoIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL0F1dGgnXG5pbXBvcnQgeyB1c2VDb25maWcgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvQ29uZmlnJ1xuaW1wb3J0IHsgdXNlRG9jdW1lbnRJbmZvIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL0RvY3VtZW50SW5mbydcbmltcG9ydCB7IHVzZU9wZXJhdGlvbiB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9PcGVyYXRpb25Qcm92aWRlcidcbmltcG9ydCB7IHVzZUZvcm0sIHVzZUZvcm1GaWVsZHMsIHVzZUZvcm1Qcm9jZXNzaW5nLCB1c2VGb3JtU3VibWl0dGVkIH0gZnJvbSAnLi4vRm9ybS9jb250ZXh0J1xuXG4vKipcbiAqIEdldCBhbmQgc2V0IHRoZSB2YWx1ZSBvZiBhIGZvcm0gZmllbGQuXG4gKlxuICogQHNlZSBodHRwczovL3BheWxvYWRjbXMuY29tL2RvY3MvYWRtaW4vaG9va3MjdXNlZmllbGRcbiAqL1xuY29uc3QgdXNlRmllbGQgPSA8VCw+KG9wdGlvbnM6IE9wdGlvbnMpOiBGaWVsZFR5cGU8VD4gPT4ge1xuICBjb25zdCB7IGNvbmRpdGlvbiwgZGlzYWJsZUZvcm1EYXRhID0gZmFsc2UsIGhhc1Jvd3MsIHBhdGgsIHZhbGlkYXRlIH0gPSBvcHRpb25zXG5cbiAgY29uc3Qgc3VibWl0dGVkID0gdXNlRm9ybVN1Ym1pdHRlZCgpXG4gIGNvbnN0IHByb2Nlc3NpbmcgPSB1c2VGb3JtUHJvY2Vzc2luZygpXG4gIGNvbnN0IHsgdXNlciB9ID0gdXNlQXV0aCgpXG4gIGNvbnN0IHsgaWQgfSA9IHVzZURvY3VtZW50SW5mbygpXG4gIGNvbnN0IG9wZXJhdGlvbiA9IHVzZU9wZXJhdGlvbigpXG4gIGNvbnN0IGZpZWxkID0gdXNlRm9ybUZpZWxkcygoW2ZpZWxkc10pID0+IGZpZWxkc1twYXRoXSlcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGRpc3BhdGNoRmllbGQgPSB1c2VGb3JtRmllbGRzKChbXywgZGlzcGF0Y2hdKSA9PiBkaXNwYXRjaClcbiAgY29uc3QgY29uZmlnID0gdXNlQ29uZmlnKClcblxuICBjb25zdCB7IGdldERhdGEsIGdldERhdGFCeVBhdGgsIGdldFNpYmxpbmdEYXRhLCBzZXRNb2RpZmllZCB9ID0gdXNlRm9ybSgpXG5cbiAgY29uc3QgdmFsdWUgPSBmaWVsZD8udmFsdWUgYXMgVFxuICBjb25zdCBpbml0aWFsVmFsdWUgPSBmaWVsZD8uaW5pdGlhbFZhbHVlIGFzIFRcbiAgY29uc3QgdmFsaWQgPSB0eXBlb2YgZmllbGQ/LnZhbGlkID09PSAnYm9vbGVhbicgPyBmaWVsZC52YWxpZCA6IHRydWVcbiAgY29uc3Qgc2hvd0Vycm9yID0gdmFsaWQgPT09IGZhbHNlICYmIHN1Ym1pdHRlZFxuXG4gIGNvbnN0IHByZXZWYWxpZCA9IHVzZVJlZih2YWxpZClcbiAgY29uc3QgcHJldkVycm9yTWVzc2FnZSA9IHVzZVJlZihmaWVsZD8uZXJyb3JNZXNzYWdlKVxuICBjb25zdCBwcmV2VmFsdWUgPSB1c2VSZWYodmFsdWUpXG5cbiAgLy8gTWV0aG9kIHRvIHJldHVybiBmcm9tIGB1c2VGaWVsZGAsIHVzZWQgdG9cbiAgLy8gdXBkYXRlIGZpZWxkIHZhbHVlcyBmcm9tIGZpZWxkIGNvbXBvbmVudChzKVxuICBjb25zdCBzZXRWYWx1ZSA9IHVzZUNhbGxiYWNrKFxuICAgIChlLCBkaXNhYmxlTW9kaWZ5aW5nRm9ybSA9IGZhbHNlKSA9PiB7XG4gICAgICBjb25zdCB2YWwgPSBlICYmIGUudGFyZ2V0ID8gZS50YXJnZXQudmFsdWUgOiBlXG5cbiAgICAgIGlmICghZGlzYWJsZU1vZGlmeWluZ0Zvcm0pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRNb2RpZmllZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIC8vIFVwZGF0ZSBtb2RpZmllZCBzdGF0ZSBhZnRlciBmaWVsZCB2YWx1ZSBjb21lcyBiYWNrXG4gICAgICAgICAgLy8gdG8gYXZvaWQgY3Vyc29yIGp1bXAgY2F1c2VkIGJ5IHN0YXRlIHZhbHVlIC8gRE9NIG1pc21hdGNoXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBzZXRNb2RpZmllZCh0cnVlKVxuICAgICAgICAgIH0sIDEwKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGRpc3BhdGNoRmllbGQoe1xuICAgICAgICB0eXBlOiAnVVBEQVRFJyxcbiAgICAgICAgZGlzYWJsZUZvcm1EYXRhOiBkaXNhYmxlRm9ybURhdGEgfHwgKGhhc1Jvd3MgJiYgdmFsID4gMCksXG4gICAgICAgIHBhdGgsXG4gICAgICAgIHZhbHVlOiB2YWwsXG4gICAgICB9KVxuICAgIH0sXG4gICAgW3NldE1vZGlmaWVkLCBwYXRoLCBkaXNwYXRjaEZpZWxkLCBkaXNhYmxlRm9ybURhdGEsIGhhc1Jvd3NdLFxuICApXG5cbiAgLy8gU3RvcmUgcmVzdWx0IGZyb20gaG9vayBhcyByZWZcbiAgLy8gdG8gcHJldmVudCB1bm5lY2Vzc2FyeSByZXJlbmRlcnNcbiAgY29uc3QgcmVzdWx0OiBGaWVsZFR5cGU8VD4gPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBlcnJvck1lc3NhZ2U6IGZpZWxkPy5lcnJvck1lc3NhZ2UsXG4gICAgICBmb3JtUHJvY2Vzc2luZzogcHJvY2Vzc2luZyxcbiAgICAgIGZvcm1TdWJtaXR0ZWQ6IHN1Ym1pdHRlZCxcbiAgICAgIGluaXRpYWxWYWx1ZSxcbiAgICAgIHJvd3M6IGZpZWxkPy5yb3dzLFxuICAgICAgc2V0VmFsdWUsXG4gICAgICBzaG93RXJyb3IsXG4gICAgICB2YWxpZDogZmllbGQ/LnZhbGlkLFxuICAgICAgdmFsdWUsXG4gICAgfSksXG4gICAgW1xuICAgICAgZmllbGQ/LmVycm9yTWVzc2FnZSxcbiAgICAgIGZpZWxkPy5yb3dzLFxuICAgICAgZmllbGQ/LnZhbGlkLFxuICAgICAgcHJvY2Vzc2luZyxcbiAgICAgIHNldFZhbHVlLFxuICAgICAgc2hvd0Vycm9yLFxuICAgICAgc3VibWl0dGVkLFxuICAgICAgdmFsdWUsXG4gICAgICBpbml0aWFsVmFsdWUsXG4gICAgXSxcbiAgKVxuXG4gIC8vIFRocm90dGxlIHRoZSB2YWxpZGF0ZSBmdW5jdGlvblxuICB1c2VUaHJvdHRsZWRFZmZlY3QoXG4gICAgKCkgPT4ge1xuICAgICAgY29uc3QgdmFsaWRhdGVGaWVsZCA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgbGV0IHZhbHVlVG9WYWxpZGF0ZSA9IHZhbHVlXG5cbiAgICAgICAgaWYgKGZpZWxkPy5yb3dzICYmIEFycmF5LmlzQXJyYXkoZmllbGQucm93cykpIHtcbiAgICAgICAgICB2YWx1ZVRvVmFsaWRhdGUgPSBnZXREYXRhQnlQYXRoKHBhdGgpXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZXJyb3JNZXNzYWdlOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgICAgICAgbGV0IHZhbGlkOiBib29sZWFuIHwgc3RyaW5nID0gZmFsc2VcblxuICAgICAgICBjb25zdCB2YWxpZGF0aW9uUmVzdWx0ID1cbiAgICAgICAgICB0eXBlb2YgdmFsaWRhdGUgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgID8gYXdhaXQgdmFsaWRhdGUodmFsdWVUb1ZhbGlkYXRlLCB7XG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGdldERhdGEoKSxcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAgcHJldmlvdXNWYWx1ZTogcHJldlZhbHVlLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgc2libGluZ0RhdGE6IGdldFNpYmxpbmdEYXRhKHBhdGgpLFxuICAgICAgICAgICAgICAgIHQsXG4gICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogdHJ1ZVxuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdGlvblJlc3VsdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBlcnJvck1lc3NhZ2UgPSB2YWxpZGF0aW9uUmVzdWx0XG4gICAgICAgICAgdmFsaWQgPSBmYWxzZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbGlkID0gdmFsaWRhdGlvblJlc3VsdFxuICAgICAgICAgIGVycm9yTWVzc2FnZSA9IHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gT25seSBkaXNwYXRjaCBpZiB0aGUgdmFsaWRhdGlvbiByZXN1bHQgaGFzIGNoYW5nZWRcbiAgICAgICAgLy8gVGhpcyB3aWxsIHByZXZlbnQgdW5uZWNlc3NhcnkgcmVyZW5kZXJzXG4gICAgICAgIGlmICh2YWxpZCAhPT0gcHJldlZhbGlkLmN1cnJlbnQgfHwgZXJyb3JNZXNzYWdlICE9PSBwcmV2RXJyb3JNZXNzYWdlLmN1cnJlbnQpIHtcbiAgICAgICAgICBwcmV2VmFsaWQuY3VycmVudCA9IHZhbGlkXG4gICAgICAgICAgcHJldkVycm9yTWVzc2FnZS5jdXJyZW50ID0gZXJyb3JNZXNzYWdlXG5cbiAgICAgICAgICBpZiAodHlwZW9mIGRpc3BhdGNoRmllbGQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoRmllbGQoe1xuICAgICAgICAgICAgICB0eXBlOiAnVVBEQVRFJyxcbiAgICAgICAgICAgICAgY29uZGl0aW9uLFxuICAgICAgICAgICAgICBkaXNhYmxlRm9ybURhdGE6XG4gICAgICAgICAgICAgICAgZGlzYWJsZUZvcm1EYXRhIHx8IChoYXNSb3dzID8gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IDAgOiBmYWxzZSksXG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZSxcbiAgICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgICAgcHJldmlvdXNWYWx1ZTogcHJldlZhbHVlLmN1cnJlbnQsXG4gICAgICAgICAgICAgIHJvd3M6IGZpZWxkPy5yb3dzLFxuICAgICAgICAgICAgICB2YWxpZCxcbiAgICAgICAgICAgICAgdmFsaWRhdGUsXG4gICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdm9pZCB2YWxpZGF0ZUZpZWxkKClcbiAgICB9LFxuICAgIDE1MCxcbiAgICBbXG4gICAgICB2YWx1ZSxcbiAgICAgIGNvbmRpdGlvbixcbiAgICAgIGRpc2FibGVGb3JtRGF0YSxcbiAgICAgIGRpc3BhdGNoRmllbGQsXG4gICAgICBnZXREYXRhLFxuICAgICAgZ2V0U2libGluZ0RhdGEsXG4gICAgICBnZXREYXRhQnlQYXRoLFxuICAgICAgaWQsXG4gICAgICBvcGVyYXRpb24sXG4gICAgICBwYXRoLFxuICAgICAgdXNlcixcbiAgICAgIHZhbGlkYXRlLFxuICAgICAgZmllbGQ/LnJvd3MsXG4gICAgXSxcbiAgKVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlRmllbGRcbiJdLCJuYW1lcyI6WyJ1c2VGaWVsZCIsIm9wdGlvbnMiLCJjb25kaXRpb24iLCJkaXNhYmxlRm9ybURhdGEiLCJoYXNSb3dzIiwicGF0aCIsInZhbGlkYXRlIiwic3VibWl0dGVkIiwidXNlRm9ybVN1Ym1pdHRlZCIsInByb2Nlc3NpbmciLCJ1c2VGb3JtUHJvY2Vzc2luZyIsInVzZXIiLCJ1c2VBdXRoIiwiaWQiLCJ1c2VEb2N1bWVudEluZm8iLCJvcGVyYXRpb24iLCJ1c2VPcGVyYXRpb24iLCJmaWVsZCIsInVzZUZvcm1GaWVsZHMiLCJmaWVsZHMiLCJ0IiwidXNlVHJhbnNsYXRpb24iLCJkaXNwYXRjaEZpZWxkIiwiXyIsImRpc3BhdGNoIiwiY29uZmlnIiwidXNlQ29uZmlnIiwiZ2V0RGF0YSIsImdldERhdGFCeVBhdGgiLCJnZXRTaWJsaW5nRGF0YSIsInNldE1vZGlmaWVkIiwidXNlRm9ybSIsInZhbHVlIiwiaW5pdGlhbFZhbHVlIiwidmFsaWQiLCJzaG93RXJyb3IiLCJwcmV2VmFsaWQiLCJ1c2VSZWYiLCJwcmV2RXJyb3JNZXNzYWdlIiwiZXJyb3JNZXNzYWdlIiwicHJldlZhbHVlIiwic2V0VmFsdWUiLCJ1c2VDYWxsYmFjayIsImUiLCJkaXNhYmxlTW9kaWZ5aW5nRm9ybSIsInZhbCIsInRhcmdldCIsInNldFRpbWVvdXQiLCJ0eXBlIiwicmVzdWx0IiwidXNlTWVtbyIsImZvcm1Qcm9jZXNzaW5nIiwiZm9ybVN1Ym1pdHRlZCIsInJvd3MiLCJ1c2VUaHJvdHRsZWRFZmZlY3QiLCJ2YWxpZGF0ZUZpZWxkIiwidmFsdWVUb1ZhbGlkYXRlIiwiQXJyYXkiLCJpc0FycmF5IiwidmFsaWRhdGlvblJlc3VsdCIsImRhdGEiLCJwcmV2aW91c1ZhbHVlIiwiY3VycmVudCIsInNpYmxpbmdEYXRhIiwidW5kZWZpbmVkIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7K0JBZ0xBOzs7ZUFBQTs7O3VCQWhMNkM7OEJBQ2Q7MkVBSUE7c0JBQ1A7d0JBQ0U7OEJBQ007bUNBQ0g7eUJBQytDOzs7Ozs7QUFFNUU7Ozs7Q0FJQyxHQUNELE1BQU1BLFdBQVcsQ0FBS0M7SUFDcEIsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLGtCQUFrQixLQUFLLEVBQUVDLE9BQU8sRUFBRUMsSUFBSSxFQUFFQyxRQUFRLEVBQUUsR0FBR0w7SUFFeEUsTUFBTU0sWUFBWUMsSUFBQUEseUJBQWdCO0lBQ2xDLE1BQU1DLGFBQWFDLElBQUFBLDBCQUFpQjtJQUNwQyxNQUFNLEVBQUVDLElBQUksRUFBRSxHQUFHQyxJQUFBQSxhQUFPO0lBQ3hCLE1BQU0sRUFBRUMsRUFBRSxFQUFFLEdBQUdDLElBQUFBLDZCQUFlO0lBQzlCLE1BQU1DLFlBQVlDLElBQUFBLCtCQUFZO0lBQzlCLE1BQU1DLFFBQVFDLElBQUFBLHNCQUFhLEVBQUMsQ0FBQyxDQUFDQyxPQUFPLEdBQUtBLE1BQU0sQ0FBQ2QsS0FBSztJQUN0RCxNQUFNLEVBQUVlLENBQUMsRUFBRSxHQUFHQyxJQUFBQSw0QkFBYztJQUM1QixNQUFNQyxnQkFBZ0JKLElBQUFBLHNCQUFhLEVBQUMsQ0FBQyxDQUFDSyxHQUFHQyxTQUFTLEdBQUtBO0lBQ3ZELE1BQU1DLFNBQVNDLElBQUFBLGlCQUFTO0lBRXhCLE1BQU0sRUFBRUMsT0FBTyxFQUFFQyxhQUFhLEVBQUVDLGNBQWMsRUFBRUMsV0FBVyxFQUFFLEdBQUdDLElBQUFBLGdCQUFPO0lBRXZFLE1BQU1DLFFBQVFmLE9BQU9lO0lBQ3JCLE1BQU1DLGVBQWVoQixPQUFPZ0I7SUFDNUIsTUFBTUMsUUFBUSxPQUFPakIsT0FBT2lCLFVBQVUsWUFBWWpCLE1BQU1pQixLQUFLLEdBQUc7SUFDaEUsTUFBTUMsWUFBWUQsVUFBVSxTQUFTM0I7SUFFckMsTUFBTTZCLFlBQVlDLElBQUFBLGFBQU0sRUFBQ0g7SUFDekIsTUFBTUksbUJBQW1CRCxJQUFBQSxhQUFNLEVBQUNwQixPQUFPc0I7SUFDdkMsTUFBTUMsWUFBWUgsSUFBQUEsYUFBTSxFQUFDTDtJQUV6Qiw0Q0FBNEM7SUFDNUMsOENBQThDO0lBQzlDLE1BQU1TLFdBQVdDLElBQUFBLGtCQUFXLEVBQzFCLENBQUNDLEdBQUdDLHVCQUF1QixLQUFLO1FBQzlCLE1BQU1DLE1BQU1GLEtBQUtBLEVBQUVHLE1BQU0sR0FBR0gsRUFBRUcsTUFBTSxDQUFDZCxLQUFLLEdBQUdXO1FBRTdDLElBQUksQ0FBQ0Msc0JBQXNCO1lBQ3pCLElBQUksT0FBT2QsZ0JBQWdCLFlBQVk7Z0JBQ3JDLHFEQUFxRDtnQkFDckQsNERBQTREO2dCQUM1RGlCLFdBQVc7b0JBQ1RqQixZQUFZO2dCQUNkLEdBQUc7WUFDTDtRQUNGO1FBRUFSLGNBQWM7WUFDWjBCLE1BQU07WUFDTjdDLGlCQUFpQkEsbUJBQW9CQyxXQUFXeUMsTUFBTTtZQUN0RHhDO1lBQ0EyQixPQUFPYTtRQUNUO0lBQ0YsR0FDQTtRQUFDZjtRQUFhekI7UUFBTWlCO1FBQWVuQjtRQUFpQkM7S0FBUTtJQUc5RCxnQ0FBZ0M7SUFDaEMsbUNBQW1DO0lBQ25DLE1BQU02QyxTQUF1QkMsSUFBQUEsY0FBTyxFQUNsQyxJQUFPLENBQUE7WUFDTFgsY0FBY3RCLE9BQU9zQjtZQUNyQlksZ0JBQWdCMUM7WUFDaEIyQyxlQUFlN0M7WUFDZjBCO1lBQ0FvQixNQUFNcEMsT0FBT29DO1lBQ2JaO1lBQ0FOO1lBQ0FELE9BQU9qQixPQUFPaUI7WUFDZEY7UUFDRixDQUFBLEdBQ0E7UUFDRWYsT0FBT3NCO1FBQ1B0QixPQUFPb0M7UUFDUHBDLE9BQU9pQjtRQUNQekI7UUFDQWdDO1FBQ0FOO1FBQ0E1QjtRQUNBeUI7UUFDQUM7S0FDRDtJQUdILGlDQUFpQztJQUNqQ3FCLElBQUFBLDJCQUFrQixFQUNoQjtRQUNFLE1BQU1DLGdCQUFnQjtZQUNwQixJQUFJQyxrQkFBa0J4QjtZQUV0QixJQUFJZixPQUFPb0MsUUFBUUksTUFBTUMsT0FBTyxDQUFDekMsTUFBTW9DLElBQUksR0FBRztnQkFDNUNHLGtCQUFrQjVCLGNBQWN2QjtZQUNsQztZQUVBLElBQUlrQztZQUNKLElBQUlMLFFBQTBCO1lBRTlCLE1BQU15QixtQkFDSixPQUFPckQsYUFBYSxhQUNoQixNQUFNQSxTQUFTa0QsaUJBQWlCO2dCQUM5QjNDO2dCQUNBWTtnQkFDQW1DLE1BQU1qQztnQkFDTlo7Z0JBQ0E4QyxlQUFlckIsVUFBVXNCLE9BQU87Z0JBQ2hDQyxhQUFhbEMsZUFBZXhCO2dCQUM1QmU7Z0JBQ0FUO1lBQ0YsS0FDQTtZQUVOLElBQUksT0FBT2dELHFCQUFxQixVQUFVO2dCQUN4Q3BCLGVBQWVvQjtnQkFDZnpCLFFBQVE7WUFDVixPQUFPO2dCQUNMQSxRQUFReUI7Z0JBQ1JwQixlQUFleUI7WUFDakI7WUFFQSxxREFBcUQ7WUFDckQsMENBQTBDO1lBQzFDLElBQUk5QixVQUFVRSxVQUFVMEIsT0FBTyxJQUFJdkIsaUJBQWlCRCxpQkFBaUJ3QixPQUFPLEVBQUU7Z0JBQzVFMUIsVUFBVTBCLE9BQU8sR0FBRzVCO2dCQUNwQkksaUJBQWlCd0IsT0FBTyxHQUFHdkI7Z0JBRTNCLElBQUksT0FBT2pCLGtCQUFrQixZQUFZO29CQUN2Q0EsY0FBYzt3QkFDWjBCLE1BQU07d0JBQ045Qzt3QkFDQUMsaUJBQ0VBLG1CQUFvQkMsQ0FBQUEsVUFBVSxPQUFPNEIsVUFBVSxZQUFZQSxRQUFRLElBQUksS0FBSTt3QkFDN0VPO3dCQUNBbEM7d0JBQ0F3RCxlQUFlckIsVUFBVXNCLE9BQU87d0JBQ2hDVCxNQUFNcEMsT0FBT29DO3dCQUNibkI7d0JBQ0E1Qjt3QkFDQTBCO29CQUNGO2dCQUNGO1lBQ0Y7UUFDRjtRQUVBLEtBQUt1QjtJQUNQLEdBQ0EsS0FDQTtRQUNFdkI7UUFDQTlCO1FBQ0FDO1FBQ0FtQjtRQUNBSztRQUNBRTtRQUNBRDtRQUNBZjtRQUNBRTtRQUNBVjtRQUNBTTtRQUNBTDtRQUNBVyxPQUFPb0M7S0FDUjtJQUdILE9BQU9KO0FBQ1Q7TUFFQSxXQUFlakQifQ==