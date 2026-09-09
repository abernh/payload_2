"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EditUpload", {
    enumerable: true,
    get: function() {
        return EditUpload;
    }
});
const _modal = require("@faceless-ui/modal");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reacti18next = require("react-i18next");
const _reactimagecrop = /*#__PURE__*/ _interop_require_default(require("react-image-crop"));
require("react-image-crop/dist/ReactCrop.css");
const _Plus = /*#__PURE__*/ _interop_require_default(require("../../icons/Plus"));
const _Upload = require("../../views/collections/Edit/Upload");
const _Button = /*#__PURE__*/ _interop_require_default(require("../Button"));
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
const baseClass = 'edit-upload';
const Input = /*#__PURE__*/ (0, _react.forwardRef)((props, ref)=>{
    const { name, onChange, value } = props;
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__input`
    }, name, /*#__PURE__*/ _react.default.createElement("input", {
        name: name,
        onChange: (e)=>onChange(e.target.value),
        ref: ref,
        type: "number",
        value: value
    }));
});
const defaultCrop = {
    height: 100,
    unit: '%',
    width: 100,
    x: 0,
    y: 0
};
const EditUpload = ({ fileName, fileSrc, imageCacheTag, initialCrop, initialFocalPoint, onSave, showCrop, showFocalPoint })=>{
    const { closeModal } = (0, _modal.useModal)();
    const { t } = (0, _reacti18next.useTranslation)([
        'general',
        'upload'
    ]);
    const [crop, setCrop] = (0, _react.useState)(()=>({
            ...defaultCrop,
            ...initialCrop || {}
        }));
    const defaultFocalPosition = {
        x: 50,
        y: 50
    };
    const [focalPosition, setFocalPosition] = (0, _react.useState)(()=>({
            ...defaultFocalPosition,
            ...initialFocalPoint
        }));
    const [checkBounds, setCheckBounds] = (0, _react.useState)(false);
    const [uncroppedPixelHeight, setUncroppedPixelHeight] = (0, _react.useState)(0);
    const [uncroppedPixelWidth, setUncroppedPixelWidth] = (0, _react.useState)(0);
    const focalWrapRef = (0, _react.useRef)();
    const imageRef = (0, _react.useRef)();
    const cropRef = (0, _react.useRef)();
    const heightInputRef = (0, _react.useRef)(null);
    const widthInputRef = (0, _react.useRef)(null);
    const [imageLoaded, setImageLoaded] = (0, _react.useState)(false);
    const onImageLoad = (e)=>{
        // set the default image height/width on load
        setUncroppedPixelHeight(e.currentTarget.naturalHeight);
        setUncroppedPixelWidth(e.currentTarget.naturalWidth);
        setImageLoaded(true);
    };
    const fineTuneCrop = ({ dimension, value })=>{
        const intValue = parseInt(value);
        if (dimension === 'width' && intValue >= uncroppedPixelWidth) return null;
        if (dimension === 'height' && intValue >= uncroppedPixelHeight) return null;
        const percentage = 100 * (intValue / (dimension === 'width' ? uncroppedPixelWidth : uncroppedPixelHeight));
        if (percentage === 100 || percentage === 0) return null;
        setCrop({
            ...crop,
            [dimension]: percentage
        });
    };
    const fineTuneFocalPosition = ({ coordinate, value })=>{
        const intValue = parseInt(value);
        if (intValue >= 0 && intValue <= 100) {
            setFocalPosition((prevPosition)=>({
                    ...prevPosition,
                    [coordinate]: intValue
                }));
        }
    };
    const saveEdits = ()=>{
        if (typeof onSave === 'function') onSave({
            crop: crop ? crop : undefined,
            focalPoint: focalPosition,
            heightInPixels: Number(heightInputRef?.current?.value ?? uncroppedPixelHeight),
            widthInPixels: Number(widthInputRef?.current?.value ?? uncroppedPixelWidth)
        });
        closeModal(_Upload.editDrawerSlug);
    };
    const onDragEnd = _react.default.useCallback(({ x, y })=>{
        setFocalPosition({
            x,
            y
        });
        setCheckBounds(false);
    }, []);
    const centerFocalPoint = ()=>{
        const containerRect = focalWrapRef.current.getBoundingClientRect();
        const boundsRect = showCrop ? cropRef.current.getBoundingClientRect() : imageRef.current.getBoundingClientRect();
        const xCenter = (boundsRect.left - containerRect.left + boundsRect.width / 2) / containerRect.width * 100;
        const yCenter = (boundsRect.top - containerRect.top + boundsRect.height / 2) / containerRect.height * 100;
        setFocalPosition({
            x: xCenter,
            y: yCenter
        });
    };
    const fileSrcToUse = imageCacheTag ? `${fileSrc}?${imageCacheTag}` : fileSrc;
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: baseClass
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__header`
    }, /*#__PURE__*/ _react.default.createElement("h2", {
        title: `${t('general:editing')} ${fileName}`
    }, t('general:editing'), " ", fileName), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__actions`
    }, /*#__PURE__*/ _react.default.createElement(_Button.default, {
        "aria-label": t('cancel'),
        buttonStyle: "secondary",
        className: `${baseClass}__cancel`,
        onClick: ()=>closeModal(_Upload.editDrawerSlug)
    }, t('general:cancel')), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        "aria-label": t('general:applyChanges'),
        buttonStyle: "primary",
        className: `${baseClass}__save`,
        disabled: !imageLoaded,
        onClick: ()=>saveEdits()
    }, t('general:applyChanges')))), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__toolWrap`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__crop`
    }, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__focal-wrapper`,
        ref: focalWrapRef,
        style: {
            aspectRatio: `${uncroppedPixelWidth / uncroppedPixelHeight}`
        }
    }, showCrop ? /*#__PURE__*/ _react.default.createElement(_reactimagecrop.default, {
        className: `${baseClass}__reactCrop`,
        crop: crop,
        onChange: (_, c)=>setCrop(c),
        onComplete: ()=>setCheckBounds(true),
        renderSelectionAddon: ()=>{
            return /*#__PURE__*/ _react.default.createElement("div", {
                className: `${baseClass}__crop-window`,
                ref: cropRef
            });
        }
    }, /*#__PURE__*/ _react.default.createElement("img", {
        alt: t('upload:setCropArea'),
        onLoad: onImageLoad,
        ref: imageRef,
        src: fileSrcToUse
    })) : /*#__PURE__*/ _react.default.createElement("img", {
        alt: t('upload:setFocalPoint'),
        onLoad: onImageLoad,
        ref: imageRef,
        src: fileSrcToUse
    }), showFocalPoint && /*#__PURE__*/ _react.default.createElement(DraggableElement, {
        boundsRef: showCrop ? cropRef : imageRef,
        checkBounds: showCrop ? checkBounds : false,
        className: `${baseClass}__focalPoint`,
        containerRef: focalWrapRef,
        initialPosition: focalPosition,
        onDragEnd: onDragEnd,
        setCheckBounds: showCrop ? setCheckBounds : false
    }, /*#__PURE__*/ _react.default.createElement(_Plus.default, null)))), (showCrop || showFocalPoint) && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__sidebar`
    }, showCrop && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__groupWrap`
    }, /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__titleWrap`
    }, /*#__PURE__*/ _react.default.createElement("h3", null, t('upload:crop')), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        buttonStyle: "none",
        className: `${baseClass}__reset`,
        onClick: ()=>setCrop({
                height: 100,
                unit: '%',
                width: 100,
                x: 0,
                y: 0
            })
    }, t('general:reset')))), /*#__PURE__*/ _react.default.createElement("span", {
        className: `${baseClass}__description`
    }, t('upload:cropToolDescription')), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__inputsWrap`
    }, /*#__PURE__*/ _react.default.createElement(Input, {
        name: `${t('upload:width')} (px)`,
        onChange: (value)=>fineTuneCrop({
                dimension: 'width',
                value
            }),
        ref: widthInputRef,
        value: (crop.width / 100 * uncroppedPixelWidth).toFixed(0)
    }), /*#__PURE__*/ _react.default.createElement(Input, {
        name: `${t('upload:height')} (px)`,
        onChange: (value)=>fineTuneCrop({
                dimension: 'height',
                value
            }),
        ref: heightInputRef,
        value: (crop.height / 100 * uncroppedPixelHeight).toFixed(0)
    }))), showFocalPoint && /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__groupWrap`
    }, /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__titleWrap`
    }, /*#__PURE__*/ _react.default.createElement("h3", null, t('upload:focalPoint')), /*#__PURE__*/ _react.default.createElement(_Button.default, {
        buttonStyle: "none",
        className: `${baseClass}__reset`,
        onClick: centerFocalPoint
    }, t('general:reset')))), /*#__PURE__*/ _react.default.createElement("span", {
        className: `${baseClass}__description`
    }, t('upload:focalPointDescription')), /*#__PURE__*/ _react.default.createElement("div", {
        className: `${baseClass}__inputsWrap`
    }, /*#__PURE__*/ _react.default.createElement(Input, {
        name: "X %",
        onChange: (value)=>fineTuneFocalPosition({
                coordinate: 'x',
                value
            }),
        value: focalPosition.x.toFixed(0)
    }), /*#__PURE__*/ _react.default.createElement(Input, {
        name: "Y %",
        onChange: (value)=>fineTuneFocalPosition({
                coordinate: 'y',
                value
            }),
        value: focalPosition.y.toFixed(0)
    }))))));
};
const DraggableElement = ({ boundsRef, checkBounds, children, className, containerRef, initialPosition = {
    x: 50,
    y: 50
}, onDragEnd, setCheckBounds })=>{
    const [position, setPosition] = (0, _react.useState)({
        x: initialPosition.x,
        y: initialPosition.y
    });
    const [isDragging, setIsDragging] = (0, _react.useState)(false);
    const dragRef = (0, _react.useRef)();
    const getCoordinates = _react.default.useCallback((mouseXArg, mouseYArg, recenter)=>{
        const containerRect = containerRef.current.getBoundingClientRect();
        const boundsRect = boundsRef.current.getBoundingClientRect();
        const mouseX = mouseXArg ?? boundsRect.left;
        const mouseY = mouseYArg ?? boundsRect.top;
        const xOutOfBounds = mouseX < boundsRect.left || mouseX > boundsRect.right;
        const yOutOfBounds = mouseY < boundsRect.top || mouseY > boundsRect.bottom;
        let x = (mouseX - containerRect.left) / containerRect.width * 100;
        let y = (mouseY - containerRect.top) / containerRect.height * 100;
        const xCenter = (boundsRect.left - containerRect.left + boundsRect.width / 2) / containerRect.width * 100;
        const yCenter = (boundsRect.top - containerRect.top + boundsRect.height / 2) / containerRect.height * 100;
        if (xOutOfBounds || yOutOfBounds) {
            setIsDragging(false);
            if (mouseX < boundsRect.left) {
                x = (boundsRect.left - containerRect.left) / containerRect.width * 100;
            } else if (mouseX > boundsRect.right) {
                x = (containerRect.width - (containerRect.right - boundsRect.right)) / containerRect.width * 100;
            }
            if (mouseY < boundsRect.top) {
                y = (boundsRect.top - containerRect.top) / containerRect.height * 100;
            } else if (mouseY > boundsRect.bottom) {
                y = (containerRect.height - (containerRect.bottom - boundsRect.bottom)) / containerRect.height * 100;
            }
            if (recenter) {
                x = xOutOfBounds ? xCenter : x;
                y = yOutOfBounds ? yCenter : y;
            }
        }
        return {
            x,
            y
        };
    }, [
        boundsRef,
        containerRef
    ]);
    const handleMouseDown = (event)=>{
        event.preventDefault();
        setIsDragging(true);
    };
    const handleMouseMove = (event)=>{
        if (!isDragging) return null;
        const { x, y } = getCoordinates(event.clientX, event.clientY);
        setPosition({
            x,
            y
        });
    };
    const onDrop = ()=>{
        setIsDragging(false);
        onDragEnd(position);
    };
    _react.default.useEffect(()=>{
        if (isDragging || !dragRef.current) return;
        if (checkBounds) {
            const { height, left, top, width } = dragRef.current.getBoundingClientRect();
            const { x, y } = getCoordinates(left + width / 2, top + height / 2, true);
            onDragEnd({
                x,
                y
            });
            setPosition({
                x,
                y
            });
            setCheckBounds(false);
            return;
        }
    }, [
        getCoordinates,
        isDragging,
        checkBounds,
        setCheckBounds,
        position.x,
        position.y,
        onDragEnd
    ]);
    _react.default.useEffect(()=>{
        setPosition({
            x: initialPosition.x,
            y: initialPosition.y
        });
    }, [
        initialPosition.x,
        initialPosition.y
    ]);
    return /*#__PURE__*/ _react.default.createElement("div", {
        className: [
            `${baseClass}__draggable-container`,
            isDragging && `${baseClass}__draggable-container--dragging`
        ].filter(Boolean).join(' '),
        onMouseMove: handleMouseMove
    }, /*#__PURE__*/ _react.default.createElement("button", {
        className: [
            `${baseClass}__draggable`,
            className
        ].filter(Boolean).join(' '),
        onMouseDown: handleMouseDown,
        onMouseUp: onDrop,
        ref: dragRef,
        style: {
            left: `${position.x}%`,
            top: `${position.y}%`
        },
        type: "button"
    }, children), /*#__PURE__*/ _react.default.createElement("div", null));
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2VsZW1lbnRzL0VkaXRVcGxvYWQvaW5kZXgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZU1vZGFsIH0gZnJvbSAnQGZhY2VsZXNzLXVpL21vZGFsJ1xuaW1wb3J0IFJlYWN0LCB7IGZvcndhcmRSZWYsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBSZWFjdENyb3AgZnJvbSAncmVhY3QtaW1hZ2UtY3JvcCdcbmltcG9ydCAncmVhY3QtaW1hZ2UtY3JvcC9kaXN0L1JlYWN0Q3JvcC5jc3MnXG5cbmltcG9ydCB0eXBlIHsgVXBsb2FkRWRpdHMgfSBmcm9tICcuLi8uLi8uLi8uLi91cGxvYWRzL3R5cGVzJ1xuXG5pbXBvcnQgUGx1cyBmcm9tICcuLi8uLi9pY29ucy9QbHVzJ1xuaW1wb3J0IHsgZWRpdERyYXdlclNsdWcgfSBmcm9tICcuLi8uLi92aWV3cy9jb2xsZWN0aW9ucy9FZGl0L1VwbG9hZCdcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vQnV0dG9uJ1xuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmNvbnN0IGJhc2VDbGFzcyA9ICdlZGl0LXVwbG9hZCdcblxudHlwZSBQcm9wcyA9IHtcbiAgbmFtZTogc3RyaW5nXG4gIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZFxuICB2YWx1ZTogc3RyaW5nXG59XG5cbmNvbnN0IElucHV0ID0gZm9yd2FyZFJlZjxIVE1MSW5wdXRFbGVtZW50LCBQcm9wcz4oKHByb3BzLCByZWYpID0+IHtcbiAgY29uc3QgeyBuYW1lLCBvbkNoYW5nZSwgdmFsdWUgfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9faW5wdXRgfT5cbiAgICAgIHtuYW1lfVxuICAgICAgPGlucHV0XG4gICAgICAgIG5hbWU9e25hbWV9XG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gb25DaGFuZ2UoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICByZWY9e3JlZn1cbiAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gIClcbn0pXG5cbnR5cGUgRm9jYWxQb3NpdGlvbiA9IHtcbiAgeDogbnVtYmVyXG4gIHk6IG51bWJlclxufVxuXG5leHBvcnQgdHlwZSBFZGl0VXBsb2FkUHJvcHMgPSB7XG4gIGZpbGVOYW1lOiBzdHJpbmdcbiAgZmlsZVNyYzogc3RyaW5nXG4gIGltYWdlQ2FjaGVUYWc/OiBzdHJpbmdcbiAgaW5pdGlhbENyb3A/OiBVcGxvYWRFZGl0c1snY3JvcCddXG4gIGluaXRpYWxGb2NhbFBvaW50PzogRm9jYWxQb3NpdGlvblxuICBvblNhdmU/OiAodXBsb2FkRWRpdHM6IFVwbG9hZEVkaXRzKSA9PiB2b2lkXG4gIHNob3dDcm9wPzogYm9vbGVhblxuICBzaG93Rm9jYWxQb2ludD86IGJvb2xlYW5cbn1cblxuY29uc3QgZGVmYXVsdENyb3A6IFVwbG9hZEVkaXRzWydjcm9wJ10gPSB7XG4gIGhlaWdodDogMTAwLFxuICB1bml0OiAnJScsXG4gIHdpZHRoOiAxMDAsXG4gIHg6IDAsXG4gIHk6IDAsXG59XG5cbmV4cG9ydCBjb25zdCBFZGl0VXBsb2FkOiBSZWFjdC5GQzxFZGl0VXBsb2FkUHJvcHM+ID0gKHtcbiAgZmlsZU5hbWUsXG4gIGZpbGVTcmMsXG4gIGltYWdlQ2FjaGVUYWcsXG4gIGluaXRpYWxDcm9wLFxuICBpbml0aWFsRm9jYWxQb2ludCxcbiAgb25TYXZlLFxuICBzaG93Q3JvcCxcbiAgc2hvd0ZvY2FsUG9pbnQsXG59KSA9PiB7XG4gIGNvbnN0IHsgY2xvc2VNb2RhbCB9ID0gdXNlTW9kYWwoKVxuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKFsnZ2VuZXJhbCcsICd1cGxvYWQnXSlcblxuICBjb25zdCBbY3JvcCwgc2V0Q3JvcF0gPSB1c2VTdGF0ZTxVcGxvYWRFZGl0c1snY3JvcCddPigoKSA9PiAoe1xuICAgIC4uLmRlZmF1bHRDcm9wLFxuICAgIC4uLihpbml0aWFsQ3JvcCB8fCB7fSksXG4gIH0pKVxuXG4gIGNvbnN0IGRlZmF1bHRGb2NhbFBvc2l0aW9uOiBGb2NhbFBvc2l0aW9uID0ge1xuICAgIHg6IDUwLFxuICAgIHk6IDUwLFxuICB9XG5cbiAgY29uc3QgW2ZvY2FsUG9zaXRpb24sIHNldEZvY2FsUG9zaXRpb25dID0gdXNlU3RhdGU8Rm9jYWxQb3NpdGlvbj4oKCkgPT4gKHtcbiAgICAuLi5kZWZhdWx0Rm9jYWxQb3NpdGlvbixcbiAgICAuLi5pbml0aWFsRm9jYWxQb2ludCxcbiAgfSkpXG5cbiAgY29uc3QgW2NoZWNrQm91bmRzLCBzZXRDaGVja0JvdW5kc10gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSlcbiAgY29uc3QgW3VuY3JvcHBlZFBpeGVsSGVpZ2h0LCBzZXRVbmNyb3BwZWRQaXhlbEhlaWdodF0gPSB1c2VTdGF0ZTxudW1iZXI+KDApXG4gIGNvbnN0IFt1bmNyb3BwZWRQaXhlbFdpZHRoLCBzZXRVbmNyb3BwZWRQaXhlbFdpZHRoXSA9IHVzZVN0YXRlPG51bWJlcj4oMClcblxuICBjb25zdCBmb2NhbFdyYXBSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQgfCB1bmRlZmluZWQ+KClcbiAgY29uc3QgaW1hZ2VSZWYgPSB1c2VSZWY8SFRNTEltYWdlRWxlbWVudCB8IHVuZGVmaW5lZD4oKVxuICBjb25zdCBjcm9wUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50IHwgdW5kZWZpbmVkPigpXG5cbiAgY29uc3QgaGVpZ2h0SW5wdXRSZWYgPSB1c2VSZWY8SFRNTElucHV0RWxlbWVudCB8IG51bGw+KG51bGwpXG4gIGNvbnN0IHdpZHRoSW5wdXRSZWYgPSB1c2VSZWY8SFRNTElucHV0RWxlbWVudCB8IG51bGw+KG51bGwpXG5cbiAgY29uc3QgW2ltYWdlTG9hZGVkLCBzZXRJbWFnZUxvYWRlZF0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSlcblxuICBjb25zdCBvbkltYWdlTG9hZCA9IChlKSA9PiB7XG4gICAgLy8gc2V0IHRoZSBkZWZhdWx0IGltYWdlIGhlaWdodC93aWR0aCBvbiBsb2FkXG4gICAgc2V0VW5jcm9wcGVkUGl4ZWxIZWlnaHQoZS5jdXJyZW50VGFyZ2V0Lm5hdHVyYWxIZWlnaHQpXG4gICAgc2V0VW5jcm9wcGVkUGl4ZWxXaWR0aChlLmN1cnJlbnRUYXJnZXQubmF0dXJhbFdpZHRoKVxuICAgIHNldEltYWdlTG9hZGVkKHRydWUpXG4gIH1cblxuICBjb25zdCBmaW5lVHVuZUNyb3AgPSAoeyBkaW1lbnNpb24sIHZhbHVlIH06IHsgZGltZW5zaW9uOiAnaGVpZ2h0JyB8ICd3aWR0aCc7IHZhbHVlOiBzdHJpbmcgfSkgPT4ge1xuICAgIGNvbnN0IGludFZhbHVlID0gcGFyc2VJbnQodmFsdWUpXG4gICAgaWYgKGRpbWVuc2lvbiA9PT0gJ3dpZHRoJyAmJiBpbnRWYWx1ZSA+PSB1bmNyb3BwZWRQaXhlbFdpZHRoKSByZXR1cm4gbnVsbFxuICAgIGlmIChkaW1lbnNpb24gPT09ICdoZWlnaHQnICYmIGludFZhbHVlID49IHVuY3JvcHBlZFBpeGVsSGVpZ2h0KSByZXR1cm4gbnVsbFxuXG4gICAgY29uc3QgcGVyY2VudGFnZSA9XG4gICAgICAxMDAgKiAoaW50VmFsdWUgLyAoZGltZW5zaW9uID09PSAnd2lkdGgnID8gdW5jcm9wcGVkUGl4ZWxXaWR0aCA6IHVuY3JvcHBlZFBpeGVsSGVpZ2h0KSlcblxuICAgIGlmIChwZXJjZW50YWdlID09PSAxMDAgfHwgcGVyY2VudGFnZSA9PT0gMCkgcmV0dXJuIG51bGxcblxuICAgIHNldENyb3Aoe1xuICAgICAgLi4uY3JvcCxcbiAgICAgIFtkaW1lbnNpb25dOiBwZXJjZW50YWdlLFxuICAgIH0pXG4gIH1cblxuICBjb25zdCBmaW5lVHVuZUZvY2FsUG9zaXRpb24gPSAoe1xuICAgIGNvb3JkaW5hdGUsXG4gICAgdmFsdWUsXG4gIH06IHtcbiAgICBjb29yZGluYXRlOiAneCcgfCAneSdcbiAgICB2YWx1ZTogc3RyaW5nXG4gIH0pID0+IHtcbiAgICBjb25zdCBpbnRWYWx1ZSA9IHBhcnNlSW50KHZhbHVlKVxuICAgIGlmIChpbnRWYWx1ZSA+PSAwICYmIGludFZhbHVlIDw9IDEwMCkge1xuICAgICAgc2V0Rm9jYWxQb3NpdGlvbigocHJldlBvc2l0aW9uKSA9PiAoeyAuLi5wcmV2UG9zaXRpb24sIFtjb29yZGluYXRlXTogaW50VmFsdWUgfSkpXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc2F2ZUVkaXRzID0gKCkgPT4ge1xuICAgIGlmICh0eXBlb2Ygb25TYXZlID09PSAnZnVuY3Rpb24nKVxuICAgICAgb25TYXZlKHtcbiAgICAgICAgY3JvcDogY3JvcCA/IGNyb3AgOiB1bmRlZmluZWQsXG4gICAgICAgIGZvY2FsUG9pbnQ6IGZvY2FsUG9zaXRpb24sXG4gICAgICAgIGhlaWdodEluUGl4ZWxzOiBOdW1iZXIoaGVpZ2h0SW5wdXRSZWY/LmN1cnJlbnQ/LnZhbHVlID8/IHVuY3JvcHBlZFBpeGVsSGVpZ2h0KSxcbiAgICAgICAgd2lkdGhJblBpeGVsczogTnVtYmVyKHdpZHRoSW5wdXRSZWY/LmN1cnJlbnQ/LnZhbHVlID8/IHVuY3JvcHBlZFBpeGVsV2lkdGgpLFxuICAgICAgfSlcbiAgICBjbG9zZU1vZGFsKGVkaXREcmF3ZXJTbHVnKVxuICB9XG5cbiAgY29uc3Qgb25EcmFnRW5kID0gUmVhY3QudXNlQ2FsbGJhY2soKHsgeCwgeSB9KSA9PiB7XG4gICAgc2V0Rm9jYWxQb3NpdGlvbih7IHgsIHkgfSlcbiAgICBzZXRDaGVja0JvdW5kcyhmYWxzZSlcbiAgfSwgW10pXG5cbiAgY29uc3QgY2VudGVyRm9jYWxQb2ludCA9ICgpID0+IHtcbiAgICBjb25zdCBjb250YWluZXJSZWN0ID0gZm9jYWxXcmFwUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBjb25zdCBib3VuZHNSZWN0ID0gc2hvd0Nyb3BcbiAgICAgID8gY3JvcFJlZi5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICA6IGltYWdlUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBjb25zdCB4Q2VudGVyID1cbiAgICAgICgoYm91bmRzUmVjdC5sZWZ0IC0gY29udGFpbmVyUmVjdC5sZWZ0ICsgYm91bmRzUmVjdC53aWR0aCAvIDIpIC8gY29udGFpbmVyUmVjdC53aWR0aCkgKiAxMDBcbiAgICBjb25zdCB5Q2VudGVyID1cbiAgICAgICgoYm91bmRzUmVjdC50b3AgLSBjb250YWluZXJSZWN0LnRvcCArIGJvdW5kc1JlY3QuaGVpZ2h0IC8gMikgLyBjb250YWluZXJSZWN0LmhlaWdodCkgKiAxMDBcbiAgICBzZXRGb2NhbFBvc2l0aW9uKHsgeDogeENlbnRlciwgeTogeUNlbnRlciB9KVxuICB9XG5cbiAgY29uc3QgZmlsZVNyY1RvVXNlID0gaW1hZ2VDYWNoZVRhZyA/IGAke2ZpbGVTcmN9PyR7aW1hZ2VDYWNoZVRhZ31gIDogZmlsZVNyY1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2Jhc2VDbGFzc30+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9faGVhZGVyYH0+XG4gICAgICAgIDxoMiB0aXRsZT17YCR7dCgnZ2VuZXJhbDplZGl0aW5nJyl9ICR7ZmlsZU5hbWV9YH0+XG4gICAgICAgICAge3QoJ2dlbmVyYWw6ZWRpdGluZycpfSB7ZmlsZU5hbWV9XG4gICAgICAgIDwvaDI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19hY3Rpb25zYH0+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgYXJpYS1sYWJlbD17dCgnY2FuY2VsJyl9XG4gICAgICAgICAgICBidXR0b25TdHlsZT1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2NhbmNlbGB9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBjbG9zZU1vZGFsKGVkaXREcmF3ZXJTbHVnKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnZ2VuZXJhbDpjYW5jZWwnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBhcmlhLWxhYmVsPXt0KCdnZW5lcmFsOmFwcGx5Q2hhbmdlcycpfVxuICAgICAgICAgICAgYnV0dG9uU3R5bGU9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fc2F2ZWB9XG4gICAgICAgICAgICBkaXNhYmxlZD17IWltYWdlTG9hZGVkfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2F2ZUVkaXRzKCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ2dlbmVyYWw6YXBwbHlDaGFuZ2VzJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fdG9vbFdyYXBgfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2Nyb3BgfT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2ZvY2FsLXdyYXBwZXJgfVxuICAgICAgICAgICAgcmVmPXtmb2NhbFdyYXBSZWZ9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBhc3BlY3RSYXRpbzogYCR7dW5jcm9wcGVkUGl4ZWxXaWR0aCAvIHVuY3JvcHBlZFBpeGVsSGVpZ2h0fWAsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtzaG93Q3JvcCA/IChcbiAgICAgICAgICAgICAgPFJlYWN0Q3JvcFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fcmVhY3RDcm9wYH1cbiAgICAgICAgICAgICAgICBjcm9wPXtjcm9wfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoXywgYykgPT4gc2V0Q3JvcChjKX1cbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlPXsoKSA9PiBzZXRDaGVja0JvdW5kcyh0cnVlKX1cbiAgICAgICAgICAgICAgICByZW5kZXJTZWxlY3Rpb25BZGRvbj17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19jcm9wLXdpbmRvd2B9IHJlZj17Y3JvcFJlZn0gLz5cbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgYWx0PXt0KCd1cGxvYWQ6c2V0Q3JvcEFyZWEnKX1cbiAgICAgICAgICAgICAgICAgIG9uTG9hZD17b25JbWFnZUxvYWR9XG4gICAgICAgICAgICAgICAgICByZWY9e2ltYWdlUmVmfVxuICAgICAgICAgICAgICAgICAgc3JjPXtmaWxlU3JjVG9Vc2V9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9SZWFjdENyb3A+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgYWx0PXt0KCd1cGxvYWQ6c2V0Rm9jYWxQb2ludCcpfVxuICAgICAgICAgICAgICAgIG9uTG9hZD17b25JbWFnZUxvYWR9XG4gICAgICAgICAgICAgICAgcmVmPXtpbWFnZVJlZn1cbiAgICAgICAgICAgICAgICBzcmM9e2ZpbGVTcmNUb1VzZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7c2hvd0ZvY2FsUG9pbnQgJiYgKFxuICAgICAgICAgICAgICA8RHJhZ2dhYmxlRWxlbWVudFxuICAgICAgICAgICAgICAgIGJvdW5kc1JlZj17c2hvd0Nyb3AgPyBjcm9wUmVmIDogaW1hZ2VSZWZ9XG4gICAgICAgICAgICAgICAgY2hlY2tCb3VuZHM9e3Nob3dDcm9wID8gY2hlY2tCb3VuZHMgOiBmYWxzZX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2ZvY2FsUG9pbnRgfVxuICAgICAgICAgICAgICAgIGNvbnRhaW5lclJlZj17Zm9jYWxXcmFwUmVmfVxuICAgICAgICAgICAgICAgIGluaXRpYWxQb3NpdGlvbj17Zm9jYWxQb3NpdGlvbn1cbiAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e29uRHJhZ0VuZH1cbiAgICAgICAgICAgICAgICBzZXRDaGVja0JvdW5kcz17c2hvd0Nyb3AgPyBzZXRDaGVja0JvdW5kcyA6IGZhbHNlfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFBsdXMgLz5cbiAgICAgICAgICAgICAgPC9EcmFnZ2FibGVFbGVtZW50PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHsoc2hvd0Nyb3AgfHwgc2hvd0ZvY2FsUG9pbnQpICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fc2lkZWJhcmB9PlxuICAgICAgICAgICAge3Nob3dDcm9wICYmIChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX2dyb3VwV3JhcGB9PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fdGl0bGVXcmFwYH0+XG4gICAgICAgICAgICAgICAgICAgIDxoMz57dCgndXBsb2FkOmNyb3AnKX08L2gzPlxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgYnV0dG9uU3R5bGU9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3Jlc2V0YH1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q3JvcCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0OiAnJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHt0KCdnZW5lcmFsOnJlc2V0Jyl9XG4gICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19kZXNjcmlwdGlvbmB9PlxuICAgICAgICAgICAgICAgICAge3QoJ3VwbG9hZDpjcm9wVG9vbERlc2NyaXB0aW9uJyl9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19pbnB1dHNXcmFwYH0+XG4gICAgICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICAgICAgbmFtZT17YCR7dCgndXBsb2FkOndpZHRoJyl9IChweClgfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBmaW5lVHVuZUNyb3AoeyBkaW1lbnNpb246ICd3aWR0aCcsIHZhbHVlIH0pfVxuICAgICAgICAgICAgICAgICAgICByZWY9e3dpZHRoSW5wdXRSZWZ9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXsoKGNyb3Aud2lkdGggLyAxMDApICogdW5jcm9wcGVkUGl4ZWxXaWR0aCkudG9GaXhlZCgwKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICAgICAgbmFtZT17YCR7dCgndXBsb2FkOmhlaWdodCcpfSAocHgpYH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZSkgPT4gZmluZVR1bmVDcm9wKHsgZGltZW5zaW9uOiAnaGVpZ2h0JywgdmFsdWUgfSl9XG4gICAgICAgICAgICAgICAgICAgIHJlZj17aGVpZ2h0SW5wdXRSZWZ9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXsoKGNyb3AuaGVpZ2h0IC8gMTAwKSAqIHVuY3JvcHBlZFBpeGVsSGVpZ2h0KS50b0ZpeGVkKDApfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuXG4gICAgICAgICAgICB7c2hvd0ZvY2FsUG9pbnQgJiYgKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fZ3JvdXBXcmFwYH0+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X190aXRsZVdyYXBgfT5cbiAgICAgICAgICAgICAgICAgICAgPGgzPnt0KCd1cGxvYWQ6Zm9jYWxQb2ludCcpfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBidXR0b25TdHlsZT1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fcmVzZXRgfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2NlbnRlckZvY2FsUG9pbnR9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7dCgnZ2VuZXJhbDpyZXNldCcpfVxuICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9fZGVzY3JpcHRpb25gfT5cbiAgICAgICAgICAgICAgICAgIHt0KCd1cGxvYWQ6Zm9jYWxQb2ludERlc2NyaXB0aW9uJyl9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtiYXNlQ2xhc3N9X19pbnB1dHNXcmFwYH0+XG4gICAgICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cIlggJVwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUpID0+IGZpbmVUdW5lRm9jYWxQb3NpdGlvbih7IGNvb3JkaW5hdGU6ICd4JywgdmFsdWUgfSl9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb2NhbFBvc2l0aW9uLngudG9GaXhlZCgwKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cIlkgJVwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUpID0+IGZpbmVUdW5lRm9jYWxQb3NpdGlvbih7IGNvb3JkaW5hdGU6ICd5JywgdmFsdWUgfSl9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb2NhbFBvc2l0aW9uLnkudG9GaXhlZCgwKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IERyYWdnYWJsZUVsZW1lbnQgPSAoe1xuICBib3VuZHNSZWYsXG4gIGNoZWNrQm91bmRzLFxuICBjaGlsZHJlbixcbiAgY2xhc3NOYW1lLFxuICBjb250YWluZXJSZWYsXG4gIGluaXRpYWxQb3NpdGlvbiA9IHsgeDogNTAsIHk6IDUwIH0sXG4gIG9uRHJhZ0VuZCxcbiAgc2V0Q2hlY2tCb3VuZHMsXG59KSA9PiB7XG4gIGNvbnN0IFtwb3NpdGlvbiwgc2V0UG9zaXRpb25dID0gdXNlU3RhdGUoeyB4OiBpbml0aWFsUG9zaXRpb24ueCwgeTogaW5pdGlhbFBvc2l0aW9uLnkgfSlcbiAgY29uc3QgW2lzRHJhZ2dpbmcsIHNldElzRHJhZ2dpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGRyYWdSZWYgPSB1c2VSZWY8SFRNTEJ1dHRvbkVsZW1lbnQgfCB1bmRlZmluZWQ+KClcblxuICBjb25zdCBnZXRDb29yZGluYXRlcyA9IFJlYWN0LnVzZUNhbGxiYWNrKFxuICAgIChtb3VzZVhBcmc/OiBudW1iZXIsIG1vdXNlWUFyZz86IG51bWJlciwgcmVjZW50ZXI/OiBib29sZWFuKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXJSZWN0ID0gY29udGFpbmVyUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNvbnN0IGJvdW5kc1JlY3QgPSBib3VuZHNSZWYuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgY29uc3QgbW91c2VYID0gbW91c2VYQXJnID8/IGJvdW5kc1JlY3QubGVmdFxuICAgICAgY29uc3QgbW91c2VZID0gbW91c2VZQXJnID8/IGJvdW5kc1JlY3QudG9wXG5cbiAgICAgIGNvbnN0IHhPdXRPZkJvdW5kcyA9IG1vdXNlWCA8IGJvdW5kc1JlY3QubGVmdCB8fCBtb3VzZVggPiBib3VuZHNSZWN0LnJpZ2h0XG4gICAgICBjb25zdCB5T3V0T2ZCb3VuZHMgPSBtb3VzZVkgPCBib3VuZHNSZWN0LnRvcCB8fCBtb3VzZVkgPiBib3VuZHNSZWN0LmJvdHRvbVxuXG4gICAgICBsZXQgeCA9ICgobW91c2VYIC0gY29udGFpbmVyUmVjdC5sZWZ0KSAvIGNvbnRhaW5lclJlY3Qud2lkdGgpICogMTAwXG4gICAgICBsZXQgeSA9ICgobW91c2VZIC0gY29udGFpbmVyUmVjdC50b3ApIC8gY29udGFpbmVyUmVjdC5oZWlnaHQpICogMTAwXG4gICAgICBjb25zdCB4Q2VudGVyID1cbiAgICAgICAgKChib3VuZHNSZWN0LmxlZnQgLSBjb250YWluZXJSZWN0LmxlZnQgKyBib3VuZHNSZWN0LndpZHRoIC8gMikgLyBjb250YWluZXJSZWN0LndpZHRoKSAqIDEwMFxuICAgICAgY29uc3QgeUNlbnRlciA9XG4gICAgICAgICgoYm91bmRzUmVjdC50b3AgLSBjb250YWluZXJSZWN0LnRvcCArIGJvdW5kc1JlY3QuaGVpZ2h0IC8gMikgLyBjb250YWluZXJSZWN0LmhlaWdodCkgKiAxMDBcbiAgICAgIGlmICh4T3V0T2ZCb3VuZHMgfHwgeU91dE9mQm91bmRzKSB7XG4gICAgICAgIHNldElzRHJhZ2dpbmcoZmFsc2UpXG4gICAgICAgIGlmIChtb3VzZVggPCBib3VuZHNSZWN0LmxlZnQpIHtcbiAgICAgICAgICB4ID0gKChib3VuZHNSZWN0LmxlZnQgLSBjb250YWluZXJSZWN0LmxlZnQpIC8gY29udGFpbmVyUmVjdC53aWR0aCkgKiAxMDBcbiAgICAgICAgfSBlbHNlIGlmIChtb3VzZVggPiBib3VuZHNSZWN0LnJpZ2h0KSB7XG4gICAgICAgICAgeCA9XG4gICAgICAgICAgICAoKGNvbnRhaW5lclJlY3Qud2lkdGggLSAoY29udGFpbmVyUmVjdC5yaWdodCAtIGJvdW5kc1JlY3QucmlnaHQpKSAvXG4gICAgICAgICAgICAgIGNvbnRhaW5lclJlY3Qud2lkdGgpICpcbiAgICAgICAgICAgIDEwMFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vdXNlWSA8IGJvdW5kc1JlY3QudG9wKSB7XG4gICAgICAgICAgeSA9ICgoYm91bmRzUmVjdC50b3AgLSBjb250YWluZXJSZWN0LnRvcCkgLyBjb250YWluZXJSZWN0LmhlaWdodCkgKiAxMDBcbiAgICAgICAgfSBlbHNlIGlmIChtb3VzZVkgPiBib3VuZHNSZWN0LmJvdHRvbSkge1xuICAgICAgICAgIHkgPVxuICAgICAgICAgICAgKChjb250YWluZXJSZWN0LmhlaWdodCAtIChjb250YWluZXJSZWN0LmJvdHRvbSAtIGJvdW5kc1JlY3QuYm90dG9tKSkgL1xuICAgICAgICAgICAgICBjb250YWluZXJSZWN0LmhlaWdodCkgKlxuICAgICAgICAgICAgMTAwXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVjZW50ZXIpIHtcbiAgICAgICAgICB4ID0geE91dE9mQm91bmRzID8geENlbnRlciA6IHhcbiAgICAgICAgICB5ID0geU91dE9mQm91bmRzID8geUNlbnRlciA6IHlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4geyB4LCB5IH1cbiAgICB9LFxuICAgIFtib3VuZHNSZWYsIGNvbnRhaW5lclJlZl0sXG4gIClcblxuICBjb25zdCBoYW5kbGVNb3VzZURvd24gPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc2V0SXNEcmFnZ2luZyh0cnVlKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKCFpc0RyYWdnaW5nKSByZXR1cm4gbnVsbFxuICAgIGNvbnN0IHsgeCwgeSB9ID0gZ2V0Q29vcmRpbmF0ZXMoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSlcblxuICAgIHNldFBvc2l0aW9uKHsgeCwgeSB9KVxuICB9XG5cbiAgY29uc3Qgb25Ecm9wID0gKCkgPT4ge1xuICAgIHNldElzRHJhZ2dpbmcoZmFsc2UpXG4gICAgb25EcmFnRW5kKHBvc2l0aW9uKVxuICB9XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNEcmFnZ2luZyB8fCAhZHJhZ1JlZi5jdXJyZW50KSByZXR1cm5cbiAgICBpZiAoY2hlY2tCb3VuZHMpIHtcbiAgICAgIGNvbnN0IHsgaGVpZ2h0LCBsZWZ0LCB0b3AsIHdpZHRoIH0gPSBkcmFnUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNvbnN0IHsgeCwgeSB9ID0gZ2V0Q29vcmRpbmF0ZXMobGVmdCArIHdpZHRoIC8gMiwgdG9wICsgaGVpZ2h0IC8gMiwgdHJ1ZSlcbiAgICAgIG9uRHJhZ0VuZCh7IHgsIHkgfSlcbiAgICAgIHNldFBvc2l0aW9uKHsgeCwgeSB9KVxuICAgICAgc2V0Q2hlY2tCb3VuZHMoZmFsc2UpXG4gICAgICByZXR1cm5cbiAgICB9XG4gIH0sIFtnZXRDb29yZGluYXRlcywgaXNEcmFnZ2luZywgY2hlY2tCb3VuZHMsIHNldENoZWNrQm91bmRzLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55LCBvbkRyYWdFbmRdKVxuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0UG9zaXRpb24oeyB4OiBpbml0aWFsUG9zaXRpb24ueCwgeTogaW5pdGlhbFBvc2l0aW9uLnkgfSlcbiAgfSwgW2luaXRpYWxQb3NpdGlvbi54LCBpbml0aWFsUG9zaXRpb24ueV0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e1tcbiAgICAgICAgYCR7YmFzZUNsYXNzfV9fZHJhZ2dhYmxlLWNvbnRhaW5lcmAsXG4gICAgICAgIGlzRHJhZ2dpbmcgJiYgYCR7YmFzZUNsYXNzfV9fZHJhZ2dhYmxlLWNvbnRhaW5lci0tZHJhZ2dpbmdgLFxuICAgICAgXVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgIC5qb2luKCcgJyl9XG4gICAgICBvbk1vdXNlTW92ZT17aGFuZGxlTW91c2VNb3ZlfVxuICAgID5cbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPXtbYCR7YmFzZUNsYXNzfV9fZHJhZ2dhYmxlYCwgY2xhc3NOYW1lXS5maWx0ZXIoQm9vbGVhbikuam9pbignICcpfVxuICAgICAgICBvbk1vdXNlRG93bj17aGFuZGxlTW91c2VEb3dufVxuICAgICAgICBvbk1vdXNlVXA9e29uRHJvcH1cbiAgICAgICAgcmVmPXtkcmFnUmVmfVxuICAgICAgICBzdHlsZT17eyBsZWZ0OiBgJHtwb3NpdGlvbi54fSVgLCB0b3A6IGAke3Bvc2l0aW9uLnl9JWAgfX1cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICA+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGRpdiAvPlxuICAgIDwvZGl2PlxuICApXG59XG4iXSwibmFtZXMiOlsiRWRpdFVwbG9hZCIsImJhc2VDbGFzcyIsIklucHV0IiwiZm9yd2FyZFJlZiIsInByb3BzIiwicmVmIiwibmFtZSIsIm9uQ2hhbmdlIiwidmFsdWUiLCJkaXYiLCJjbGFzc05hbWUiLCJpbnB1dCIsImUiLCJ0YXJnZXQiLCJ0eXBlIiwiZGVmYXVsdENyb3AiLCJoZWlnaHQiLCJ1bml0Iiwid2lkdGgiLCJ4IiwieSIsImZpbGVOYW1lIiwiZmlsZVNyYyIsImltYWdlQ2FjaGVUYWciLCJpbml0aWFsQ3JvcCIsImluaXRpYWxGb2NhbFBvaW50Iiwib25TYXZlIiwic2hvd0Nyb3AiLCJzaG93Rm9jYWxQb2ludCIsImNsb3NlTW9kYWwiLCJ1c2VNb2RhbCIsInQiLCJ1c2VUcmFuc2xhdGlvbiIsImNyb3AiLCJzZXRDcm9wIiwidXNlU3RhdGUiLCJkZWZhdWx0Rm9jYWxQb3NpdGlvbiIsImZvY2FsUG9zaXRpb24iLCJzZXRGb2NhbFBvc2l0aW9uIiwiY2hlY2tCb3VuZHMiLCJzZXRDaGVja0JvdW5kcyIsInVuY3JvcHBlZFBpeGVsSGVpZ2h0Iiwic2V0VW5jcm9wcGVkUGl4ZWxIZWlnaHQiLCJ1bmNyb3BwZWRQaXhlbFdpZHRoIiwic2V0VW5jcm9wcGVkUGl4ZWxXaWR0aCIsImZvY2FsV3JhcFJlZiIsInVzZVJlZiIsImltYWdlUmVmIiwiY3JvcFJlZiIsImhlaWdodElucHV0UmVmIiwid2lkdGhJbnB1dFJlZiIsImltYWdlTG9hZGVkIiwic2V0SW1hZ2VMb2FkZWQiLCJvbkltYWdlTG9hZCIsImN1cnJlbnRUYXJnZXQiLCJuYXR1cmFsSGVpZ2h0IiwibmF0dXJhbFdpZHRoIiwiZmluZVR1bmVDcm9wIiwiZGltZW5zaW9uIiwiaW50VmFsdWUiLCJwYXJzZUludCIsInBlcmNlbnRhZ2UiLCJmaW5lVHVuZUZvY2FsUG9zaXRpb24iLCJjb29yZGluYXRlIiwicHJldlBvc2l0aW9uIiwic2F2ZUVkaXRzIiwidW5kZWZpbmVkIiwiZm9jYWxQb2ludCIsImhlaWdodEluUGl4ZWxzIiwiTnVtYmVyIiwiY3VycmVudCIsIndpZHRoSW5QaXhlbHMiLCJlZGl0RHJhd2VyU2x1ZyIsIm9uRHJhZ0VuZCIsIlJlYWN0IiwidXNlQ2FsbGJhY2siLCJjZW50ZXJGb2NhbFBvaW50IiwiY29udGFpbmVyUmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImJvdW5kc1JlY3QiLCJ4Q2VudGVyIiwibGVmdCIsInlDZW50ZXIiLCJ0b3AiLCJmaWxlU3JjVG9Vc2UiLCJoMiIsInRpdGxlIiwiQnV0dG9uIiwiYXJpYS1sYWJlbCIsImJ1dHRvblN0eWxlIiwib25DbGljayIsImRpc2FibGVkIiwic3R5bGUiLCJhc3BlY3RSYXRpbyIsIlJlYWN0Q3JvcCIsIl8iLCJjIiwib25Db21wbGV0ZSIsInJlbmRlclNlbGVjdGlvbkFkZG9uIiwiaW1nIiwiYWx0Iiwib25Mb2FkIiwic3JjIiwiRHJhZ2dhYmxlRWxlbWVudCIsImJvdW5kc1JlZiIsImNvbnRhaW5lclJlZiIsImluaXRpYWxQb3NpdGlvbiIsIlBsdXMiLCJoMyIsInNwYW4iLCJ0b0ZpeGVkIiwiY2hpbGRyZW4iLCJwb3NpdGlvbiIsInNldFBvc2l0aW9uIiwiaXNEcmFnZ2luZyIsInNldElzRHJhZ2dpbmciLCJkcmFnUmVmIiwiZ2V0Q29vcmRpbmF0ZXMiLCJtb3VzZVhBcmciLCJtb3VzZVlBcmciLCJyZWNlbnRlciIsIm1vdXNlWCIsIm1vdXNlWSIsInhPdXRPZkJvdW5kcyIsInJpZ2h0IiwieU91dE9mQm91bmRzIiwiYm90dG9tIiwiaGFuZGxlTW91c2VEb3duIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZU1vdXNlTW92ZSIsImNsaWVudFgiLCJjbGllbnRZIiwib25Ecm9wIiwidXNlRWZmZWN0IiwiZmlsdGVyIiwiQm9vbGVhbiIsImpvaW4iLCJvbk1vdXNlTW92ZSIsImJ1dHRvbiIsIm9uTW91c2VEb3duIiwib25Nb3VzZVVwIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7K0JBOERhQTs7O2VBQUFBOzs7dUJBOURZOytEQUMyQjs4QkFDckI7dUVBQ1Q7UUFDZjs2REFJVTt3QkFDYzsrREFDWjtRQUNaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVQLE1BQU1DLFlBQVk7QUFRbEIsTUFBTUMsc0JBQVFDLElBQUFBLGlCQUFVLEVBQTBCLENBQUNDLE9BQU9DO0lBQ3hELE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxRQUFRLEVBQUVDLEtBQUssRUFBRSxHQUFHSjtJQUVsQyxx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