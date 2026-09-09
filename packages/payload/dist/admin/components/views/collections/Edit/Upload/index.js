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
    Upload: function() {
        return Upload;
    },
    UploadActions: function() {
        return UploadActions;
    },
    editDrawerSlug: function() {
        return editDrawerSlug;
    },
    sizePreviewSlug: function() {
        return sizePreviewSlug;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reacti18next = require("react-i18next");
const _reacttoastify = require("react-toastify");
const _isImage = /*#__PURE__*/ _interop_require_default(require("../../../../../../uploads/isImage"));
const _Button = /*#__PURE__*/ _interop_require_default(require("../../../../elements/Button"));
const _Drawer = require("../../../../elements/Drawer");
const _Dropzone = require("../../../../elements/Dropzone");
const _EditUpload = require("../../../../elements/EditUpload");
const _FileDetails = /*#__PURE__*/ _interop_require_default(require("../../../../elements/FileDetails"));
const _PreviewSizes = /*#__PURE__*/ _interop_require_default(require("../../../../elements/PreviewSizes"));
const _Thumbnail = /*#__PURE__*/ _interop_require_default(require("../../../../elements/Thumbnail"));
const _Error = /*#__PURE__*/ _interop_require_default(require("../../../../forms/Error"));
const _context = require("../../../../forms/Form/context");
const _reduceFieldsToValues = /*#__PURE__*/ _interop_require_default(require("../../../../forms/Form/reduceFieldsToValues"));
const _shared = require("../../../../forms/field-types/shared");
const _useField = /*#__PURE__*/ _interop_require_default(require("../../../../forms/useField"));
const _DocumentInfo = require("../../../../utilities/DocumentInfo");
const _UploadEdits = require("../../../../utilities/UploadEdits");
require("./index.scss");
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
const baseClass = 'file-field';
const editDrawerSlug = 'edit-upload';
const sizePreviewSlug = 'preview-sizes';
const validate = (value)=>{
    if (!value && value !== undefined) {
        return 'A file is required.';
    }
    return true;
};
const UploadActions = ({ canEdit, showSizePreviews })=>{
    const { t } = (0, _reacti18next.useTranslation)('upload');
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__file-mutation`
    }, showSizePreviews && /*#__PURE__*/ _react.default.createElement(_Drawer.DrawerToggler, {
        className: `${baseClass}__previewSizes`,
        slug: sizePreviewSlug
    }, t('upload:previewSizes')), canEdit && /*#__PURE__*/ _react.default.createElement(_Drawer.DrawerToggler, {
        className: `${baseClass}__edit`,
        slug: editDrawerSlug
    }, t('upload:editImage')));
};
const Upload = (props)=>{
    const { collection, internalState, onChange } = props;
    const [replacingFile, setReplacingFile] = (0, _react.useState)(false);
    const [fileSrc, setFileSrc] = (0, _react.useState)(null);
    const { t } = (0, _reacti18next.useTranslation)([
        'upload',
        'general'
    ]);
    const { setModified } = (0, _context.useForm)();
    const { resetUploadEdits, updateUploadEdits, uploadEdits } = (0, _UploadEdits.useUploadEdits)();
    const [doc, setDoc] = (0, _react.useState)((0, _reduceFieldsToValues.default)(internalState || {}, true));
    const { docPermissions } = (0, _DocumentInfo.useDocumentInfo)();
    const { errorMessage, setValue, showError, value } = (0, _useField.default)({
        path: 'file',
        validate
    });
    const [showUrlInput, setShowUrlInput] = (0, _react.useState)(false);
    const [fileUrl, setFileUrl] = (0, _react.useState)('');
    const cursorPositionRef = (0, _react.useRef)(null);
    const urlInputRef = (0, _react.useRef)(null);
    const handleFileChange = (0, _react.useCallback)((newFile)=>{
        if (newFile instanceof File && (0, _isImage.default)(newFile.type)) {
            const fileReader = new FileReader();
            fileReader.onload = (e)=>{
                const imgSrc = e.target?.result;
                if (typeof imgSrc === 'string') {
                    setFileSrc(imgSrc);
                }
            };
            fileReader.readAsDataURL(newFile);
        }
        setValue(newFile);
        setShowUrlInput(false);
        if (typeof onChange === 'function') {
            onChange(newFile);
        }
    }, [
        onChange,
        setValue
    ]);
    const handleFileNameChange = (e)=>{
        const updatedFileName = e.target.value;
        const cursorPosition = e.target.selectionStart;
        cursorPositionRef.current = cursorPosition;
        if (value) {
            const fileValue = value;
            // Creating a new File object with updated properties
            const newFile = new File([
                fileValue
            ], updatedFileName, {
                type: fileValue.type
            });
            handleFileChange(newFile);
        }
    };
    (0, _react.useEffect)(()=>{
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const inputElement = document.querySelector(`.${baseClass}__filename`);
        if (inputElement && cursorPositionRef.current !== null) {
            inputElement.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
        }
    }, [
        value
    ]);
    const handleFileSelection = _react.default.useCallback((files)=>{
        const fileToUpload = files?.[0];
        handleFileChange(fileToUpload);
    }, [
        handleFileChange
    ]);
    const handleFileRemoval = (0, _react.useCallback)(()=>{
        setReplacingFile(true);
        handleFileChange(null);
        setFileSrc('');
        setFileUrl('');
        setDoc({});
        resetUploadEdits();
        setShowUrlInput(false);
    }, [
        handleFileChange,
        resetUploadEdits
    ]);
    const onEditsSave = (0, _react.useCallback)((args)=>{
        setModified(true);
        updateUploadEdits(args);
    }, [
        setModified,
        updateUploadEdits
    ]);
    const handlePasteUrlClick = ()=>{
        setShowUrlInput((prev)=>!prev);
    };
    const handleUrlSubmit = async ()=>{
        if (fileUrl) {
            try {
                const response = await fetch(fileUrl);
                const data = await response.blob();
                // Extract the file name from the URL
                const fileName = fileUrl.split('/').pop();
                // Create a new File object from the Blob data
                const file = new File([
                    data
                ], fileName, {
                    type: data.type
                });
                handleFileChange(file);
            } catch (e) {
                _reacttoastify.toast.error(e.message);
            }
        }
    };
    (0, _react.useEffect)(()=>{
        setDoc((0, _reduceFieldsToValues.default)(internalState || {}, true));
        setReplacingFile(false);
    }, [
        internalState
    ]);
    (0, _react.useEffect)(()=>{
        if (showUrlInput && urlInputRef.current) {
            urlInputRef.current.focus() // Focus on the remote-url input field when showUrlInput is true
            ;
        }
    }, [
        showUrlInput
    ]);
    const canRemoveUpload = docPermissions?.update?.permission && 'delete' in docPermissions && docPermissions?.delete?.permission;
    const hasImageSizes = collection?.upload?.imageSizes?.length > 0;
    const hasResizeOptions = Boolean(collection?.upload?.resizeOptions);
    // Explicitly check if set to true, default is undefined
    const focalPointEnabled = collection?.upload?.focalPoint === true;
    const { collection: { upload: { crop: showCrop = true, focalPoint = true } } = {} } = props;
    const showFocalPoint = focalPoint && (hasImageSizes || hasResizeOptions || focalPointEnabled);
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: [
            _shared.fieldBaseClass,
            baseClass
        ].filter(Boolean).join(' ')
    }, /*#__PURE__*/ _react.default.createElement(_Error.default, {
        message: errorMessage,
        showError: showError
    }), doc.filename && !replacingFile && /*#__PURE__*/ _react.default.createElement(_FileDetails.default, {
        canEdit: showCrop || showFocalPoint,
        collection: collection,
        doc: doc,
        handleRemove: canRemoveUpload ? handleFileRemoval : undefined,
        hasImageSizes: hasImageSizes,
        imageCacheTag: doc.updatedAt
    }), (!doc.filename || replacingFile) && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__upload`
    }, !value && !showUrlInput && /*#__PURE__*/ _react.default.createElement(_Dropzone.Dropzone, {
        className: `${baseClass}__dropzone`,
        mimeTypes: collection?.upload?.mimeTypes,
        onChange: handleFileSelection,
        onPasteUrlClick: handlePasteUrlClick
    }), showUrlInput && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__remote-file-wrap`
    }, /*#__PURE__*/ _react.default.createElement("input", {
        className: `${baseClass}__remote-file`,
        onChange: (e)=>{
            setFileUrl(e.target.value);
        },
        ref: urlInputRef,
        type: "text",
        value: fileUrl
    }), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__add-file-wrap`
    }, /*#__PURE__*/ _react.default.createElement("button", {
        className: `${baseClass}__add-file`,
        onClick: handleUrlSubmit,
        type: "button"
    }, t('upload:addFile')))), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        buttonStyle: "icon-label",
        className: `${baseClass}__remove`,
        icon: "x",
        iconStyle: "with-border",
        onClick: handleFileRemoval,
        round: true,
        tooltip: t('general:cancel')
    })), value && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__thumbnail-wrap`
    }, /*#__PURE__*/ _react.default.createElement(_Thumbnail.default, {
        fileSrc: (0, _isImage.default)(value.type) ? fileSrc : null
    })), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__file-adjustments`
    }, /*#__PURE__*/ _react.default.createElement("input", {
        className: `${baseClass}__filename`,
        onChange: handleFileNameChange,
        type: "text",
        value: value.name
    }), (0, _isImage.default)(value.type) && value.type !== 'image/svg+xml' && /*#__PURE__*/ _react.default.createElement(UploadActions, {
        canEdit: showCrop || showFocalPoint,
        showSizePreviews: hasImageSizes && doc.filename && !replacingFile
    })), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        buttonStyle: "icon-label",
        className: `${baseClass}__remove`,
        icon: "x",
        iconStyle: "with-border",
        onClick: handleFileRemoval,
        round: true,
        tooltip: t('general:cancel')
    }))), (value || doc.filename) && /*#__PURE__*/ _react.default.createElement(_Drawer.Drawer, {
        header: null,
        slug: editDrawerSlug
    }, /*#__PURE__*/ _react.default.createElement(_EditUpload.EditUpload, {
        fileName: value?.name || doc?.filename,
        fileSrc: doc?.url || fileSrc,
        imageCacheTag: doc.updatedAt,
        initialCrop: uploadEdits?.crop ?? undefined,
        initialFocalPoint: {
            x: uploadEdits?.focalPoint?.x || doc.focalX || 50,
            y: uploadEdits?.focalPoint?.y || doc.focalY || 50
        },
        onSave: onEditsSave,
        showCrop: showCrop,
        showFocalPoint: showFocalPoint
    })), doc && hasImageSizes && /*#__PURE__*/ _react.default.createElement(_Drawer.Drawer, {
        className: `${baseClass}__previewDrawer`,
        hoverTitle: true,
        slug: sizePreviewSlug,
        title: t('upload:sizesFor', {
            label: doc?.filename
        })
    }, /*#__PURE__*/ _react.default.createElement(_PreviewSizes.default, {
        collection: collection,
        doc: doc,
        imageCacheTag: doc.updatedAt
    })));
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3ZpZXdzL2NvbGxlY3Rpb25zL0VkaXQvVXBsb2FkL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdG9hc3QgfSBmcm9tICdyZWFjdC10b2FzdGlmeSdcblxuaW1wb3J0IHR5cGUgeyBVcGxvYWRFZGl0cyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3VwbG9hZHMvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFByb3BzIH0gZnJvbSAnLi90eXBlcydcblxuaW1wb3J0IGlzSW1hZ2UgZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vdXBsb2Fkcy9pc0ltYWdlJ1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi8uLi8uLi8uLi9lbGVtZW50cy9CdXR0b24nXG5pbXBvcnQgeyBEcmF3ZXIsIERyYXdlclRvZ2dsZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9lbGVtZW50cy9EcmF3ZXInXG5pbXBvcnQgeyBEcm9wem9uZSB9IGZyb20gJy4uLy4uLy4uLy4uL2VsZW1lbnRzL0Ryb3B6b25lJ1xuaW1wb3J0IHsgRWRpdFVwbG9hZCB9IGZyb20gJy4uLy4uLy4uLy4uL2VsZW1lbnRzL0VkaXRVcGxvYWQnXG5pbXBvcnQgRmlsZURldGFpbHMgZnJvbSAnLi4vLi4vLi4vLi4vZWxlbWVudHMvRmlsZURldGFpbHMnXG5pbXBvcnQgUHJldmlld1NpemVzIGZyb20gJy4uLy4uLy4uLy4uL2VsZW1lbnRzL1ByZXZpZXdTaXplcydcbmltcG9ydCBUaHVtYm5haWwgZnJvbSAnLi4vLi4vLi4vLi4vZWxlbWVudHMvVGh1bWJuYWlsJ1xuaW1wb3J0IEVycm9yIGZyb20gJy4uLy4uLy4uLy4uL2Zvcm1zL0Vycm9yJ1xuaW1wb3J0IHsgdXNlRm9ybSB9IGZyb20gJy4uLy4uLy4uLy4uL2Zvcm1zL0Zvcm0vY29udGV4dCdcbmltcG9ydCByZWR1Y2VGaWVsZHNUb1ZhbHVlcyBmcm9tICcuLi8uLi8uLi8uLi9mb3Jtcy9Gb3JtL3JlZHVjZUZpZWxkc1RvVmFsdWVzJ1xuaW1wb3J0IHsgZmllbGRCYXNlQ2xhc3MgfSBmcm9tICcuLi8uLi8uLi8uLi9mb3Jtcy9maWVsZC10eXBlcy9zaGFyZWQnXG5pbXBvcnQgdXNlRmllbGQgZnJvbSAnLi4vLi4vLi4vLi4vZm9ybXMvdXNlRmllbGQnXG5pbXBvcnQgeyB1c2VEb2N1bWVudEluZm8gfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXRpZXMvRG9jdW1lbnRJbmZvJ1xuaW1wb3J0IHsgdXNlVXBsb2FkRWRpdHMgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXRpZXMvVXBsb2FkRWRpdHMnXG5pbXBvcnQgJy4vaW5kZXguc2NzcydcblxuY29uc3QgYmFzZUNsYXNzID0gJ2ZpbGUtZmllbGQnXG5leHBvcnQgY29uc3QgZWRpdERyYXdlclNsdWcgPSAnZWRpdC11cGxvYWQnXG5leHBvcnQgY29uc3Qgc2l6ZVByZXZpZXdTbHVnID0gJ3ByZXZpZXctc2l6ZXMnXG5cbmNvbnN0IHZhbGlkYXRlID0gKHZhbHVlKSA9PiB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAnQSBmaWxlIGlzIHJlcXVpcmVkLidcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydCBjb25zdCBVcGxvYWRBY3Rpb25zID0gKHsgY2FuRWRpdCwgc2hvd1NpemVQcmV2aWV3cyB9KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oJ3VwbG9hZCcpXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2ZpbGUtbXV0YXRpb25gfT5cbiAgICAgIHtzaG93U2l6ZVByZXZpZXdzICYmIChcbiAgICAgICAgPERyYXdlclRvZ2dsZXIgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19wcmV2aWV3U2l6ZXNgfSBzbHVnPXtzaXplUHJldmlld1NsdWd9PlxuICAgICAgICAgIHt0KCd1cGxvYWQ6cHJldmlld1NpemVzJyl9XG4gICAgICAgIDwvRHJhd2VyVG9nZ2xlcj5cbiAgICAgICl9XG4gICAgICB7Y2FuRWRpdCAmJiAoXG4gICAgICAgIDxEcmF3ZXJUb2dnbGVyIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fZWRpdGB9IHNsdWc9e2VkaXREcmF3ZXJTbHVnfT5cbiAgICAgICAgICB7dCgndXBsb2FkOmVkaXRJbWFnZScpfVxuICAgICAgICA8L0RyYXdlclRvZ2dsZXI+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBVcGxvYWQ6IFJlYWN0LkZDPFByb3BzPiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IGNvbGxlY3Rpb24sIGludGVybmFsU3RhdGUsIG9uQ2hhbmdlIH0gPSBwcm9wc1xuICBjb25zdCBbcmVwbGFjaW5nRmlsZSwgc2V0UmVwbGFjaW5nRmlsZV0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2ZpbGVTcmMsIHNldEZpbGVTcmNdID0gdXNlU3RhdGU8bnVsbCB8IHN0cmluZz4obnVsbClcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbihbJ3VwbG9hZCcsICdnZW5lcmFsJ10pXG4gIGNvbnN0IHsgc2V0TW9kaWZpZWQgfSA9IHVzZUZvcm0oKVxuICBjb25zdCB7IHJlc2V0VXBsb2FkRWRpdHMsIHVwZGF0ZVVwbG9hZEVkaXRzLCB1cGxvYWRFZGl0cyB9ID0gdXNlVXBsb2FkRWRpdHMoKVxuICBjb25zdCBbZG9jLCBzZXREb2NdID0gdXNlU3RhdGUocmVkdWNlRmllbGRzVG9WYWx1ZXMoaW50ZXJuYWxTdGF0ZSB8fCB7fSwgdHJ1ZSkpXG4gIGNvbnN0IHsgZG9jUGVybWlzc2lvbnMgfSA9IHVzZURvY3VtZW50SW5mbygpXG4gIGNvbnN0IHsgZXJyb3JNZXNzYWdlLCBzZXRWYWx1ZSwgc2hvd0Vycm9yLCB2YWx1ZSB9ID0gdXNlRmllbGQ8RmlsZT4oe1xuICAgIHBhdGg6ICdmaWxlJyxcbiAgICB2YWxpZGF0ZSxcbiAgfSlcblxuICBjb25zdCBbc2hvd1VybElucHV0LCBzZXRTaG93VXJsSW5wdXRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtmaWxlVXJsLCBzZXRGaWxlVXJsXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpXG5cbiAgY29uc3QgY3Vyc29yUG9zaXRpb25SZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgdXJsSW5wdXRSZWYgPSB1c2VSZWY8SFRNTElucHV0RWxlbWVudD4obnVsbClcblxuICBjb25zdCBoYW5kbGVGaWxlQ2hhbmdlID0gdXNlQ2FsbGJhY2soXG4gICAgKG5ld0ZpbGU6IEZpbGUpID0+IHtcbiAgICAgIGlmIChuZXdGaWxlIGluc3RhbmNlb2YgRmlsZSAmJiBpc0ltYWdlKG5ld0ZpbGUudHlwZSkpIHtcbiAgICAgICAgY29uc3QgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICAgICAgZmlsZVJlYWRlci5vbmxvYWQgPSAoZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGltZ1NyYyA9IGUudGFyZ2V0Py5yZXN1bHRcblxuICAgICAgICAgIGlmICh0eXBlb2YgaW1nU3JjID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgc2V0RmlsZVNyYyhpbWdTcmMpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTChuZXdGaWxlKVxuICAgICAgfVxuXG4gICAgICBzZXRWYWx1ZShuZXdGaWxlKVxuICAgICAgc2V0U2hvd1VybElucHV0KGZhbHNlKVxuXG4gICAgICBpZiAodHlwZW9mIG9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9uQ2hhbmdlKG5ld0ZpbGUpXG4gICAgICB9XG4gICAgfSxcbiAgICBbb25DaGFuZ2UsIHNldFZhbHVlXSxcbiAgKVxuXG4gIGNvbnN0IGhhbmRsZUZpbGVOYW1lQ2hhbmdlID0gKGU6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XG4gICAgY29uc3QgdXBkYXRlZEZpbGVOYW1lID0gZS50YXJnZXQudmFsdWVcbiAgICBjb25zdCBjdXJzb3JQb3NpdGlvbiA9IGUudGFyZ2V0LnNlbGVjdGlvblN0YXJ0XG5cbiAgICBjdXJzb3JQb3NpdGlvblJlZi5jdXJyZW50ID0gY3Vyc29yUG9zaXRpb25cblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgY29uc3QgZmlsZVZhbHVlID0gdmFsdWVcbiAgICAgIC8vIENyZWF0aW5nIGEgbmV3IEZpbGUgb2JqZWN0IHdpdGggdXBkYXRlZCBwcm9wZXJ0aWVzXG4gICAgICBjb25zdCBuZXdGaWxlID0gbmV3IEZpbGUoW2ZpbGVWYWx1ZV0sIHVwZGF0ZWRGaWxlTmFtZSwgeyB0eXBlOiBmaWxlVmFsdWUudHlwZSB9KVxuICAgICAgaGFuZGxlRmlsZUNoYW5nZShuZXdGaWxlKVxuICAgIH1cbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bm5lY2Vzc2FyeS10eXBlLWFzc2VydGlvblxuICAgIGNvbnN0IGlucHV0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke2Jhc2VDbGFzc31fX2ZpbGVuYW1lYCkgYXMgSFRNTElucHV0RWxlbWVudFxuICAgIGlmIChpbnB1dEVsZW1lbnQgJiYgY3Vyc29yUG9zaXRpb25SZWYuY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgaW5wdXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGN1cnNvclBvc2l0aW9uUmVmLmN1cnJlbnQsIGN1cnNvclBvc2l0aW9uUmVmLmN1cnJlbnQpXG4gICAgfVxuICB9LCBbdmFsdWVdKVxuXG4gIGNvbnN0IGhhbmRsZUZpbGVTZWxlY3Rpb24gPSBSZWFjdC51c2VDYWxsYmFjayhcbiAgICAoZmlsZXM6IEZpbGVMaXN0KSA9PiB7XG4gICAgICBjb25zdCBmaWxlVG9VcGxvYWQgPSBmaWxlcz8uWzBdXG4gICAgICBoYW5kbGVGaWxlQ2hhbmdlKGZpbGVUb1VwbG9hZClcbiAgICB9LFxuICAgIFtoYW5kbGVGaWxlQ2hhbmdlXSxcbiAgKVxuXG4gIGNvbnN0IGhhbmRsZUZpbGVSZW1vdmFsID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldFJlcGxhY2luZ0ZpbGUodHJ1ZSlcbiAgICBoYW5kbGVGaWxlQ2hhbmdlKG51bGwpXG4gICAgc2V0RmlsZVNyYygnJylcbiAgICBzZXRGaWxlVXJsKCcnKVxuICAgIHNldERvYyh7fSlcbiAgICByZXNldFVwbG9hZEVkaXRzKClcbiAgICBzZXRTaG93VXJsSW5wdXQoZmFsc2UpXG4gIH0sIFtoYW5kbGVGaWxlQ2hhbmdlLCByZXNldFVwbG9hZEVkaXRzXSlcblxuICBjb25zdCBvbkVkaXRzU2F2ZSA9IHVzZUNhbGxiYWNrKFxuICAgIChhcmdzOiBVcGxvYWRFZGl0cykgPT4ge1xuICAgICAgc2V0TW9kaWZpZWQodHJ1ZSlcbiAgICAgIHVwZGF0ZVVwbG9hZEVkaXRzKGFyZ3MpXG4gICAgfSxcbiAgICBbc2V0TW9kaWZpZWQsIHVwZGF0ZVVwbG9hZEVkaXRzXSxcbiAgKVxuXG4gIGNvbnN0IGhhbmRsZVBhc3RlVXJsQ2xpY2sgPSAoKSA9PiB7XG4gICAgc2V0U2hvd1VybElucHV0KChwcmV2KSA9PiAhcHJldilcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZVVybFN1Ym1pdCA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoZmlsZVVybCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChmaWxlVXJsKVxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuYmxvYigpXG5cbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgZmlsZSBuYW1lIGZyb20gdGhlIFVSTFxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGZpbGVVcmwuc3BsaXQoJy8nKS5wb3AoKVxuXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBGaWxlIG9iamVjdCBmcm9tIHRoZSBCbG9iIGRhdGFcbiAgICAgICAgY29uc3QgZmlsZSA9IG5ldyBGaWxlKFtkYXRhXSwgZmlsZU5hbWUsIHsgdHlwZTogZGF0YS50eXBlIH0pXG4gICAgICAgIGhhbmRsZUZpbGVDaGFuZ2UoZmlsZSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdG9hc3QuZXJyb3IoZS5tZXNzYWdlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0RG9jKHJlZHVjZUZpZWxkc1RvVmFsdWVzKGludGVybmFsU3RhdGUgfHwge30sIHRydWUpKVxuICAgIHNldFJlcGxhY2luZ0ZpbGUoZmFsc2UpXG4gIH0sIFtpbnRlcm5hbFN0YXRlXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzaG93VXJsSW5wdXQgJiYgdXJsSW5wdXRSZWYuY3VycmVudCkge1xuICAgICAgdXJsSW5wdXRSZWYuY3VycmVudC5mb2N1cygpIC8vIEZvY3VzIG9uIHRoZSByZW1vdGUtdXJsIGlucHV0IGZpZWxkIHdoZW4gc2hvd1VybElucHV0IGlzIHRydWVcbiAgICB9XG4gIH0sIFtzaG93VXJsSW5wdXRdKVxuXG4gIGNvbnN0IGNhblJlbW92ZVVwbG9hZCA9XG4gICAgZG9jUGVybWlzc2lvbnM/LnVwZGF0ZT8ucGVybWlzc2lvbiAmJlxuICAgICdkZWxldGUnIGluIGRvY1Blcm1pc3Npb25zICYmXG4gICAgZG9jUGVybWlzc2lvbnM/LmRlbGV0ZT8ucGVybWlzc2lvblxuXG4gIGNvbnN0IGhhc0ltYWdlU2l6ZXMgPSBjb2xsZWN0aW9uPy51cGxvYWQ/LmltYWdlU2l6ZXM/Lmxlbmd0aCA+IDBcbiAgY29uc3QgaGFzUmVzaXplT3B0aW9ucyA9IEJvb2xlYW4oY29sbGVjdGlvbj8udXBsb2FkPy5yZXNpemVPcHRpb25zKVxuICAvLyBFeHBsaWNpdGx5IGNoZWNrIGlmIHNldCB0byB0cnVlLCBkZWZhdWx0IGlzIHVuZGVmaW5lZFxuICBjb25zdCBmb2NhbFBvaW50RW5hYmxlZCA9IGNvbGxlY3Rpb24/LnVwbG9hZD8uZm9jYWxQb2ludCA9PT0gdHJ1ZVxuXG4gIGNvbnN0IHsgY29sbGVjdGlvbjogeyB1cGxvYWQ6IHsgY3JvcDogc2hvd0Nyb3AgPSB0cnVlLCBmb2NhbFBvaW50ID0gdHJ1ZSB9IH0gPSB7fSB9ID0gcHJvcHNcblxuICBjb25zdCBzaG93Rm9jYWxQb2ludCA9IGZvY2FsUG9pbnQgJiYgKGhhc0ltYWdlU2l6ZXMgfHwgaGFzUmVzaXplT3B0aW9ucyB8fCBmb2NhbFBvaW50RW5hYmxlZClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtbZmllbGRCYXNlQ2xhc3MsIGJhc2VDbGFzc10uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJyAnKX0+XG4gICAgICA8RXJyb3IgbWVzc2FnZT17ZXJyb3JNZXNzYWdlfSBzaG93RXJyb3I9e3Nob3dFcnJvcn0gLz5cblxuICAgICAge2RvYy5maWxlbmFtZSAmJiAhcmVwbGFjaW5nRmlsZSAmJiAoXG4gICAgICAgIDxGaWxlRGV0YWlsc1xuICAgICAgICAgIGNhbkVkaXQ9e3Nob3dDcm9wIHx8IHNob3dGb2NhbFBvaW50fVxuICAgICAgICAgIGNvbGxlY3Rpb249e2NvbGxlY3Rpb259XG4gICAgICAgICAgZG9jPXtkb2N9XG4gICAgICAgICAgaGFuZGxlUmVtb3ZlPXtjYW5SZW1vdmVVcGxvYWQgPyBoYW5kbGVGaWxlUmVtb3ZhbCA6IHVuZGVmaW5lZH1cbiAgICAgICAgICBoYXNJbWFnZVNpemVzPXtoYXNJbWFnZVNpemVzfVxuICAgICAgICAgIGltYWdlQ2FjaGVUYWc9e2RvYy51cGRhdGVkQXR9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAgeyghZG9jLmZpbGVuYW1lIHx8IHJlcGxhY2luZ0ZpbGUpICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3VwbG9hZGB9PlxuICAgICAgICAgIHshdmFsdWUgJiYgIXNob3dVcmxJbnB1dCAmJiAoXG4gICAgICAgICAgICA8RHJvcHpvbmVcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19kcm9wem9uZWB9XG4gICAgICAgICAgICAgIG1pbWVUeXBlcz17Y29sbGVjdGlvbj8udXBsb2FkPy5taW1lVHlwZXN9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGaWxlU2VsZWN0aW9ufVxuICAgICAgICAgICAgICBvblBhc3RlVXJsQ2xpY2s9e2hhbmRsZVBhc3RlVXJsQ2xpY2t9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAge3Nob3dVcmxJbnB1dCAmJiAoXG4gICAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19yZW1vdGUtZmlsZS13cmFwYH0+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3JlbW90ZS1maWxlYH1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZXRGaWxlVXJsKGUudGFyZ2V0LnZhbHVlKVxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIHJlZj17dXJsSW5wdXRSZWZ9XG4gICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17ZmlsZVVybH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19hZGQtZmlsZS13cmFwYH0+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fYWRkLWZpbGVgfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVVcmxTdWJtaXR9XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7dCgndXBsb2FkOmFkZEZpbGUnKX1cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgIGJ1dHRvblN0eWxlPVwiaWNvbi1sYWJlbFwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19yZW1vdmVgfVxuICAgICAgICAgICAgICAgIGljb249XCJ4XCJcbiAgICAgICAgICAgICAgICBpY29uU3R5bGU9XCJ3aXRoLWJvcmRlclwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlRmlsZVJlbW92YWx9XG4gICAgICAgICAgICAgICAgcm91bmRcbiAgICAgICAgICAgICAgICB0b29sdGlwPXt0KCdnZW5lcmFsOmNhbmNlbCcpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICApfVxuICAgICAgICAgIHt2YWx1ZSAmJiAoXG4gICAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X190aHVtYm5haWwtd3JhcGB9PlxuICAgICAgICAgICAgICAgIDxUaHVtYm5haWwgZmlsZVNyYz17aXNJbWFnZSh2YWx1ZS50eXBlKSA/IGZpbGVTcmMgOiBudWxsfSAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2ZpbGUtYWRqdXN0bWVudHNgfT5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fZmlsZW5hbWVgfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZpbGVOYW1lQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3ZhbHVlLm5hbWV9XG4gICAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICAgIHtpc0ltYWdlKHZhbHVlLnR5cGUpICYmIHZhbHVlLnR5cGUgIT09ICdpbWFnZS9zdmcreG1sJyAmJiAoXG4gICAgICAgICAgICAgICAgICA8VXBsb2FkQWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICBjYW5FZGl0PXtzaG93Q3JvcCB8fCBzaG93Rm9jYWxQb2ludH1cbiAgICAgICAgICAgICAgICAgICAgc2hvd1NpemVQcmV2aWV3cz17aGFzSW1hZ2VTaXplcyAmJiBkb2MuZmlsZW5hbWUgJiYgIXJlcGxhY2luZ0ZpbGV9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgYnV0dG9uU3R5bGU9XCJpY29uLWxhYmVsXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3JlbW92ZWB9XG4gICAgICAgICAgICAgICAgaWNvbj1cInhcIlxuICAgICAgICAgICAgICAgIGljb25TdHlsZT1cIndpdGgtYm9yZGVyXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVGaWxlUmVtb3ZhbH1cbiAgICAgICAgICAgICAgICByb3VuZFxuICAgICAgICAgICAgICAgIHRvb2x0aXA9e3QoJ2dlbmVyYWw6Y2FuY2VsJyl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgeyh2YWx1ZSB8fCBkb2MuZmlsZW5hbWUpICYmIChcbiAgICAgICAgPERyYXdlciBoZWFkZXI9e251bGx9IHNsdWc9e2VkaXREcmF3ZXJTbHVnfT5cbiAgICAgICAgICA8RWRpdFVwbG9hZFxuICAgICAgICAgICAgZmlsZU5hbWU9e3ZhbHVlPy5uYW1lIHx8IGRvYz8uZmlsZW5hbWV9XG4gICAgICAgICAgICBmaWxlU3JjPXtkb2M/LnVybCB8fCBmaWxlU3JjfVxuICAgICAgICAgICAgaW1hZ2VDYWNoZVRhZz17ZG9jLnVwZGF0ZWRBdH1cbiAgICAgICAgICAgIGluaXRpYWxDcm9wPXt1cGxvYWRFZGl0cz8uY3JvcCA/PyB1bmRlZmluZWR9XG4gICAgICAgICAgICBpbml0aWFsRm9jYWxQb2ludD17e1xuICAgICAgICAgICAgICB4OiB1cGxvYWRFZGl0cz8uZm9jYWxQb2ludD8ueCB8fCBkb2MuZm9jYWxYIHx8IDUwLFxuICAgICAgICAgICAgICB5OiB1cGxvYWRFZGl0cz8uZm9jYWxQb2ludD8ueSB8fCBkb2MuZm9jYWxZIHx8IDUwLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uU2F2ZT17b25FZGl0c1NhdmV9XG4gICAgICAgICAgICBzaG93Q3JvcD17c2hvd0Nyb3B9XG4gICAgICAgICAgICBzaG93Rm9jYWxQb2ludD17c2hvd0ZvY2FsUG9pbnR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9EcmF3ZXI+XG4gICAgICApfVxuICAgICAge2RvYyAmJiBoYXNJbWFnZVNpemVzICYmIChcbiAgICAgICAgPERyYXdlclxuICAgICAgICAgIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fcHJldmlld0RyYXdlcmB9XG4gICAgICAgICAgaG92ZXJUaXRsZVxuICAgICAgICAgIHNsdWc9e3NpemVQcmV2aWV3U2x1Z31cbiAgICAgICAgICB0aXRsZT17dCgndXBsb2FkOnNpemVzRm9yJywgeyBsYWJlbDogZG9jPy5maWxlbmFtZSB9KX1cbiAgICAgICAgPlxuICAgICAgICAgIDxQcmV2aWV3U2l6ZXMgY29sbGVjdGlvbj17Y29sbGVjdGlvbn0gZG9jPXtkb2N9IGltYWdlQ2FjaGVUYWc9e2RvYy51cGRhdGVkQXR9IC8+XG4gICAgICAgIDwvRHJhd2VyPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuIl0sIm5hbWVzIjpbIlVwbG9hZCIsIlVwbG9hZEFjdGlvbnMiLCJlZGl0RHJhd2VyU2x1ZyIsInNpemVQcmV2aWV3U2x1ZyIsImJhc2VDbGFzcyIsInZhbGlkYXRlIiwidmFsdWUiLCJ1bmRlZmluZWQiLCJjYW5FZGl0Iiwic2hvd1NpemVQcmV2aWV3cyIsInQiLCJ1c2VUcmFuc2xhdGlvbiIsImRpdiIsImNsYXNzTmFtZSIsIkRyYXdlclRvZ2dsZXIiLCJzbHVnIiwicHJvcHMiLCJjb2xsZWN0aW9uIiwiaW50ZXJuYWxTdGF0ZSIsIm9uQ2hhbmdlIiwicmVwbGFjaW5nRmlsZSIsInNldFJlcGxhY2luZ0ZpbGUiLCJ1c2VTdGF0ZSIsImZpbGVTcmMiLCJzZXRGaWxlU3JjIiwic2V0TW9kaWZpZWQiLCJ1c2VGb3JtIiwicmVzZXRVcGxvYWRFZGl0cyIsInVwZGF0ZVVwbG9hZEVkaXRzIiwidXBsb2FkRWRpdHMiLCJ1c2VVcGxvYWRFZGl0cyIsImRvYyIsInNldERvYyIsInJlZHVjZUZpZWxkc1RvVmFsdWVzIiwiZG9jUGVybWlzc2lvbnMiLCJ1c2VEb2N1bWVudEluZm8iLCJlcnJvck1lc3NhZ2UiLCJzZXRWYWx1ZSIsInNob3dFcnJvciIsInVzZUZpZWxkIiwicGF0aCIsInNob3dVcmxJbnB1dCIsInNldFNob3dVcmxJbnB1dCIsImZpbGVVcmwiLCJzZXRGaWxlVXJsIiwiY3Vyc29yUG9zaXRpb25SZWYiLCJ1c2VSZWYiLCJ1cmxJbnB1dFJlZiIsImhhbmRsZUZpbGVDaGFuZ2UiLCJ1c2VDYWxsYmFjayIsIm5ld0ZpbGUiLCJGaWxlIiwiaXNJbWFnZSIsInR5cGUiLCJmaWxlUmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImUiLCJpbWdTcmMiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNEYXRhVVJMIiwiaGFuZGxlRmlsZU5hbWVDaGFuZ2UiLCJ1cGRhdGVkRmlsZU5hbWUiLCJjdXJzb3JQb3NpdGlvbiIsInNlbGVjdGlvblN0YXJ0IiwiY3VycmVudCIsImZpbGVWYWx1ZSIsInVzZUVmZmVjdCIsImlucHV0RWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInNldFNlbGVjdGlvblJhbmdlIiwiaGFuZGxlRmlsZVNlbGVjdGlvbiIsIlJlYWN0IiwiZmlsZXMiLCJmaWxlVG9VcGxvYWQiLCJoYW5kbGVGaWxlUmVtb3ZhbCIsIm9uRWRpdHNTYXZlIiwiYXJncyIsImhhbmRsZVBhc3RlVXJsQ2xpY2siLCJwcmV2IiwiaGFuZGxlVXJsU3VibWl0IiwicmVzcG9uc2UiLCJmZXRjaCIsImRhdGEiLCJibG9iIiwiZmlsZU5hbWUiLCJzcGxpdCIsInBvcCIsImZpbGUiLCJ0b2FzdCIsImVycm9yIiwibWVzc2FnZSIsImZvY3VzIiwiY2FuUmVtb3ZlVXBsb2FkIiwidXBkYXRlIiwicGVybWlzc2lvbiIsImRlbGV0ZSIsImhhc0ltYWdlU2l6ZXMiLCJ1cGxvYWQiLCJpbWFnZVNpemVzIiwibGVuZ3RoIiwiaGFzUmVzaXplT3B0aW9ucyIsIkJvb2xlYW4iLCJyZXNpemVPcHRpb25zIiwiZm9jYWxQb2ludEVuYWJsZWQiLCJmb2NhbFBvaW50IiwiY3JvcCIsInNob3dDcm9wIiwic2hvd0ZvY2FsUG9pbnQiLCJmaWVsZEJhc2VDbGFzcyIsImZpbHRlciIsImpvaW4iLCJFcnJvciIsImZpbGVuYW1lIiwiRmlsZURldGFpbHMiLCJoYW5kbGVSZW1vdmUiLCJpbWFnZUNhY2hlVGFnIiwidXBkYXRlZEF0IiwiRHJvcHpvbmUiLCJtaW1lVHlwZXMiLCJvblBhc3RlVXJsQ2xpY2siLCJGcmFnbWVudCIsImlucHV0IiwicmVmIiwiYnV0dG9uIiwib25DbGljayIsIkJ1dHRvbiIsImJ1dHRvblN0eWxlIiwiaWNvbiIsImljb25TdHlsZSIsInJvdW5kIiwidG9vbHRpcCIsIlRodW1ibmFpbCIsIm5hbWUiLCJEcmF3ZXIiLCJoZWFkZXIiLCJFZGl0VXBsb2FkIiwidXJsIiwiaW5pdGlhbENyb3AiLCJpbml0aWFsRm9jYWxQb2ludCIsIngiLCJmb2NhbFgiLCJ5IiwiZm9jYWxZIiwib25TYXZlIiwiaG92ZXJUaXRsZSIsInRpdGxlIiwibGFiZWwiLCJQcmV2aWV3U2l6ZXMiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFzRGFBLE1BQU07ZUFBTkE7O0lBbEJBQyxhQUFhO2VBQWJBOztJQVhBQyxjQUFjO2VBQWRBOztJQUNBQyxlQUFlO2VBQWZBOzs7K0RBMUJtRDs4QkFDakM7K0JBQ1Q7Z0VBS0Y7K0RBQ0Q7d0JBQ21COzBCQUNiOzRCQUNFO29FQUNIO3FFQUNDO2tFQUNIOzhEQUNKO3lCQUNNOzZFQUNTO3dCQUNGO2lFQUNWOzhCQUNXOzZCQUNEO1FBQ3hCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVQLE1BQU1DLFlBQVk7QUFDWCxNQUFNRixpQkFBaUI7QUFDdkIsTUFBTUMsa0JBQWtCO0FBRS9CLE1BQU1FLFdBQVcsQ0FBQ0M7SUFD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