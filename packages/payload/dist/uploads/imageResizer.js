"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * For the provided image sizes, handle the resizing and the transforms
 * (format, trim, etc.) of each requested image size and return the result object.
 * This only handles the image sizes. The transforms of the original image
 * are handled in {@link ./generateFileData.ts}.
 *
 * The image will be resized according to the provided
 * resize config. If no image sizes are requested, the resolved data will be empty.
 * For every image that does not need to be resized, a result object with `null`
 * parameters will be returned.
 *
 * @param resizeConfig - the resize config
 * @returns the result of the resize operation(s)
 */ "default", {
    enumerable: true,
    get: function() {
        return resizeAndTransformImageSizes;
    }
});
const _filetype = require("file-type");
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _sanitizefilename = /*#__PURE__*/ _interop_require_default(require("sanitize-filename"));
const _sharp = /*#__PURE__*/ _interop_require_default(require("sharp"));
const _isNumber = require("../utilities/isNumber");
const _fileExists = /*#__PURE__*/ _interop_require_default(require("./fileExists"));
const _optionallyAppendMetadata = require("./optionallyAppendMetadata");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Sanitize the image name and extract the extension from the source image
 *
 * @param sourceImage - the source image
 * @returns the sanitized name and extension
 */ const getSanitizedImageData = (sourceImage)=>{
    const extension = sourceImage.split('.').pop();
    const name = (0, _sanitizefilename.default)(sourceImage.substring(0, sourceImage.lastIndexOf('.')) || sourceImage);
    return {
        name,
        ext: extension
    };
};
const createImageName = ({ extension, height, outputImageName, width })=>{
    return `${outputImageName}-${width}x${height}.${extension}`;
};
/**
 * Create the result object for the image resize operation based on the
 * provided parameters. If the name is not provided, an empty result object
 * is returned.
 *
 * @param name - the name of the image
 * @param filename - the filename of the image
 * @param width - the width of the image
 * @param height - the height of the image
 * @param filesize - the filesize of the image
 * @param mimeType - the mime type of the image
 * @param sizesToSave - the sizes to save
 * @returns the result object
 */ const createResult = ({ name, filename = null, filesize = null, height = null, mimeType = null, sizesToSave = [], width = null })=>{
    return {
        sizeData: {
            [name]: {
                filename,
                filesize,
                height,
                mimeType,
                width
            }
        },
        sizesToSave
    };
};
/**
 * Determine whether or not to resize the image.
 * - resize using image config
 * - resize using image config with focal adjustments
 * - do not resize at all
 *
 * `imageResizeConfig.withoutEnlargement`:
 * - undefined [default]: uploading images with smaller width AND height than the image size will return null
 * - false: always enlarge images to the image size
 * - true: if the image is smaller than the image size, return the original image
 *
 * `imageResizeConfig.withoutReduction`:
 * - false [default]: always enlarge images to the image size
 * - true: if the image is smaller than the image size, return the original image
 *
 * @return 'omit' | 'resize' | 'resizeWithFocalPoint'
 */ const getImageResizeAction = ({ dimensions: originalImage, hasFocalPoint, imageResizeConfig })=>{
    const { fit, height: targetHeight, width: targetWidth, withoutEnlargement, withoutReduction } = imageResizeConfig;
    // prevent upscaling by default when x and y are both smaller than target image size
    if (targetHeight && targetWidth) {
        const originalImageIsSmallerXAndY = originalImage.width < targetWidth && originalImage.height < targetHeight;
        if (withoutEnlargement === undefined && originalImageIsSmallerXAndY) {
            return 'omit' // prevent image size from being enlarged
            ;
        }
    }
    const originalImageIsSmallerXOrY = originalImage.width < targetWidth || originalImage.height < targetHeight;
    if (fit === 'contain' || fit === 'inside') return 'resize';
    if (!(0, _isNumber.isNumber)(targetHeight) && !(0, _isNumber.isNumber)(targetWidth)) return 'resize';
    const targetAspectRatio = targetWidth / targetHeight;
    const originalAspectRatio = originalImage.width / originalImage.height;
    if (originalAspectRatio === targetAspectRatio) return 'resize';
    if (withoutEnlargement && originalImageIsSmallerXOrY) return 'resize';
    if (withoutReduction && !originalImageIsSmallerXOrY) return 'resize';
    return hasFocalPoint ? 'resizeWithFocalPoint' : 'resize';
};
/**
 * Sanitize the resize config. If the resize config has the `withoutReduction`
 * property set to true, the `fit` and `position` properties will be set to `contain`
 * and `top left` respectively.
 *
 * @param resizeConfig - the resize config
 * @returns a sanitized resize config
 */ const sanitizeResizeConfig = (resizeConfig)=>{
    if (resizeConfig.withoutReduction) {
        return {
            ...resizeConfig,
            // Why fit `contain` should also be set to https://github.com/lovell/sharp/issues/3595
            fit: resizeConfig?.fit || 'contain',
            position: resizeConfig?.position || 'left top'
        };
    }
    return resizeConfig;
};
/**
 * Used to extract height from images, animated or not.
 *
 * @param sharpMetadata - the sharp metadata
 * @returns the height of the image
 */ function extractHeightFromImage(sharpMetadata) {
    if (sharpMetadata?.pages) {
        return sharpMetadata.height / sharpMetadata.pages;
    }
    return sharpMetadata.height;
}
async function resizeAndTransformImageSizes({ config, dimensions, file, mimeType, req, savedFilename, staticPath, uploadEdits, withMetadata }) {
    const { focalPoint: focalPointEnabled = true, imageSizes } = config.upload;
    // Focal point adjustments
    const incomingFocalPoint = uploadEdits?.focalPoint ? {
        x: (0, _isNumber.isNumber)(uploadEdits.focalPoint.x) ? Math.round(uploadEdits.focalPoint.x) : 50,
        y: (0, _isNumber.isNumber)(uploadEdits.focalPoint.y) ? Math.round(uploadEdits.focalPoint.y) : 50
    } : undefined;
    const defaultResult = {
        ...focalPointEnabled && incomingFocalPoint && {
            focalPoint: incomingFocalPoint
        },
        sizeData: {},
        sizesToSave: []
    };
    // Nothing to resize here so return as early as possible
    if (!imageSizes) return defaultResult;
    // Determine if the file is animated
    const fileIsAnimatedType = [
        'image/avif',
        'image/gif',
        'image/webp'
    ].includes(file.mimetype);
    const sharpOptions = {};
    if (fileIsAnimatedType) sharpOptions.animated = true;
    const sharpBase = (0, _sharp.default)(file.tempFilePath || file.data, sharpOptions).rotate() // pass rotate() to auto-rotate based on EXIF data. https://github.com/payloadcms/payload/pull/3081
    ;
    const originalImageMeta = await sharpBase.metadata();
    let adjustedDimensions = {
        ...dimensions
    };
    // Images with an exif orientation of 5, 6, 7, or 8 are auto-rotated by sharp
    // Need to adjust the dimensions to match the original image
    if ([
        5,
        6,
        7,
        8
    ].includes(originalImageMeta.orientation)) {
        adjustedDimensions = {
            ...dimensions,
            height: dimensions.width,
            width: dimensions.height
        };
    }
    const resizeImageMeta = {
        height: extractHeightFromImage(originalImageMeta),
        width: originalImageMeta.width
    };
    const results = await Promise.all(imageSizes.map(async (imageResizeConfig)=>{
        imageResizeConfig = sanitizeResizeConfig(imageResizeConfig);
        const resizeAction = getImageResizeAction({
            dimensions,
            hasFocalPoint: Boolean(incomingFocalPoint),
            imageResizeConfig
        });
        if (resizeAction === 'omit') return createResult({
            name: imageResizeConfig.name
        });
        const imageToResize = sharpBase.clone();
        let resized = imageToResize;
        if (resizeAction === 'resizeWithFocalPoint') {
            let { height: resizeHeight, width: resizeWidth } = imageResizeConfig;
            const originalAspectRatio = adjustedDimensions.width / adjustedDimensions.height;
            // Calculate resizeWidth based on original aspect ratio if it's undefined
            if (resizeHeight && !resizeWidth) {
                resizeWidth = Math.round(resizeHeight * originalAspectRatio);
            }
            // Calculate resizeHeight based on original aspect ratio if it's undefined
            if (resizeWidth && !resizeHeight) {
                resizeHeight = Math.round(resizeWidth / originalAspectRatio);
            }
            if (!resizeHeight) resizeHeight = resizeImageMeta.height;
            if (!resizeWidth) resizeWidth = resizeImageMeta.width;
            const resizeAspectRatio = resizeWidth / resizeHeight;
            const prioritizeHeight = resizeAspectRatio < originalAspectRatio;
            // Scales the image before extracting from it
            resized = imageToResize.resize({
                height: prioritizeHeight ? resizeHeight : undefined,
                width: prioritizeHeight ? undefined : resizeWidth
            });
            const metadataAppendedFile = await (0, _optionallyAppendMetadata.optionallyAppendMetadata)({
                req,
                sharpFile: resized,
                withMetadata
            });
            // Must read from buffer, resized.metadata will return the original image metadata
            const { info } = await metadataAppendedFile.toBuffer({
                resolveWithObject: true
            });
            resizeImageMeta.height = extractHeightFromImage({
                ...originalImageMeta,
                height: info.height
            });
            resizeImageMeta.width = info.width;
            const halfResizeX = resizeWidth / 2;
            const xFocalCenter = resizeImageMeta.width * (incomingFocalPoint.x / 100);
            const calculatedRightPixelBound = xFocalCenter + halfResizeX;
            let leftBound = xFocalCenter - halfResizeX;
            // if the right bound is greater than the image width, adjust the left bound
            // keeping focus on the right
            if (calculatedRightPixelBound > resizeImageMeta.width) {
                leftBound = resizeImageMeta.width - resizeWidth;
            }
            // if the left bound is less than 0, adjust the left bound to 0
            // keeping the focus on the left
            if (leftBound < 0) leftBound = 0;
            const halfResizeY = resizeHeight / 2;
            const yFocalCenter = resizeImageMeta.height * (incomingFocalPoint.y / 100);
            const calculatedBottomPixelBound = yFocalCenter + halfResizeY;
            let topBound = yFocalCenter - halfResizeY;
            // if the bottom bound is greater than the image height, adjust the top bound
            // keeping the image as far right as possible
            if (calculatedBottomPixelBound > resizeImageMeta.height) {
                topBound = resizeImageMeta.height - resizeHeight;
            }
            // if the top bound is less than 0, adjust the top bound to 0
            // keeping the image focus near the top
            if (topBound < 0) topBound = 0;
            resized = resized.extract({
                height: resizeHeight,
                left: Math.floor(leftBound),
                top: Math.floor(topBound),
                width: resizeWidth
            });
        } else {
            resized = imageToResize.resize(imageResizeConfig);
        }
        if (imageResizeConfig.formatOptions) {
            resized = resized.toFormat(imageResizeConfig.formatOptions.format, imageResizeConfig.formatOptions.options);
        }
        if (imageResizeConfig.trimOptions) {
            resized = resized.trim(imageResizeConfig.trimOptions);
        }
        const metadataAppendedFile = await (0, _optionallyAppendMetadata.optionallyAppendMetadata)({
            req,
            sharpFile: resized,
            withMetadata
        });
        const { data: bufferData, info: bufferInfo } = await metadataAppendedFile.toBuffer({
            resolveWithObject: true
        });
        const sanitizedImage = getSanitizedImageData(savedFilename);
        if (req.payloadUploadSizes) {
            req.payloadUploadSizes[imageResizeConfig.name] = bufferData;
        }
        const mimeInfo = await (0, _filetype.fromBuffer)(bufferData);
        const imageNameWithDimensions = imageResizeConfig.generateImageName ? imageResizeConfig.generateImageName({
            extension: mimeInfo?.ext || sanitizedImage.ext,
            height: extractHeightFromImage({
                ...originalImageMeta,
                height: bufferInfo.height
            }),
            originalName: sanitizedImage.name,
            sizeName: imageResizeConfig.name,
            width: bufferInfo.width
        }) : createImageName({
            extension: mimeInfo?.ext || sanitizedImage.ext,
            height: extractHeightFromImage({
                ...originalImageMeta,
                height: bufferInfo.height
            }),
            outputImageName: sanitizedImage.name,
            width: bufferInfo.width
        });
        const imagePath = `${staticPath}/${imageNameWithDimensions}`;
        if (await (0, _fileExists.default)(imagePath)) {
            try {
                _fs.default.unlinkSync(imagePath);
            } catch  {
            // Ignore unlink errors
            }
        }
        const { height, size, width } = bufferInfo;
        return createResult({
            name: imageResizeConfig.name,
            filename: imageNameWithDimensions,
            filesize: size,
            height: fileIsAnimatedType && originalImageMeta.pages ? height / originalImageMeta.pages : height,
            mimeType: mimeInfo?.mime || mimeType,
            sizesToSave: [
                {
                    buffer: bufferData,
                    path: imagePath
                }
            ],
            width
        });
    }));
    return results.reduce((acc, result)=>{
        Object.assign(acc.sizeData, result.sizeData);
        acc.sizesToSave.push(...result.sizesToSave);
        return acc;
    }, {
        ...defaultResult
    });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91cGxvYWRzL2ltYWdlUmVzaXplci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFVwbG9hZGVkRmlsZSB9IGZyb20gJ2V4cHJlc3MtZmlsZXVwbG9hZCdcbmltcG9ydCB0eXBlIHsgU2hhcnAsIE1ldGFkYXRhIGFzIFNoYXJwTWV0YWRhdGEsIFNoYXJwT3B0aW9ucyB9IGZyb20gJ3NoYXJwJ1xuXG5pbXBvcnQgeyBmcm9tQnVmZmVyIH0gZnJvbSAnZmlsZS10eXBlJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHNhbml0aXplIGZyb20gJ3Nhbml0aXplLWZpbGVuYW1lJ1xuaW1wb3J0IHNoYXJwIGZyb20gJ3NoYXJwJ1xuXG5pbXBvcnQgdHlwZSB7IFNhbml0aXplZENvbGxlY3Rpb25Db25maWcgfSBmcm9tICcuLi9jb2xsZWN0aW9ucy9jb25maWcvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFBheWxvYWRSZXF1ZXN0IH0gZnJvbSAnLi4vZXhwcmVzcy90eXBlcydcbmltcG9ydCB0eXBlIHtcbiAgRmlsZVNpemUsXG4gIEZpbGVTaXplcyxcbiAgRmlsZVRvU2F2ZSxcbiAgSW1hZ2VTaXplLFxuICBQcm9iZWRJbWFnZVNpemUsXG4gIFVwbG9hZEVkaXRzLFxufSBmcm9tICcuL3R5cGVzJ1xuXG5pbXBvcnQgeyBpc051bWJlciB9IGZyb20gJy4uL3V0aWxpdGllcy9pc051bWJlcidcbmltcG9ydCBmaWxlRXhpc3RzIGZyb20gJy4vZmlsZUV4aXN0cydcbmltcG9ydCB7IHR5cGUgV2l0aE1ldGFkYXRhLCBvcHRpb25hbGx5QXBwZW5kTWV0YWRhdGEgfSBmcm9tICcuL29wdGlvbmFsbHlBcHBlbmRNZXRhZGF0YSdcblxudHlwZSBSZXNpemVBcmdzID0ge1xuICBjb25maWc6IFNhbml0aXplZENvbGxlY3Rpb25Db25maWdcbiAgZGltZW5zaW9uczogUHJvYmVkSW1hZ2VTaXplXG4gIGZpbGU6IFVwbG9hZGVkRmlsZVxuICBtaW1lVHlwZTogc3RyaW5nXG4gIHJlcTogUGF5bG9hZFJlcXVlc3RcbiAgc2F2ZWRGaWxlbmFtZTogc3RyaW5nXG4gIHN0YXRpY1BhdGg6IHN0cmluZ1xuICB1cGxvYWRFZGl0cz86IFVwbG9hZEVkaXRzXG4gIHdpdGhNZXRhZGF0YT86IFdpdGhNZXRhZGF0YVxufVxuXG4vKiogUmVzdWx0IGZyb20gcmVzaXppbmcgYW5kIHRyYW5zZm9ybWluZyB0aGUgcmVxdWVzdGVkIGltYWdlIHNpemVzICovXG50eXBlIEltYWdlU2l6ZXNSZXN1bHQgPSB7XG4gIGZvY2FsUG9pbnQ/OiBVcGxvYWRFZGl0c1snZm9jYWxQb2ludCddXG4gIHNpemVEYXRhOiBGaWxlU2l6ZXNcbiAgc2l6ZXNUb1NhdmU6IEZpbGVUb1NhdmVbXVxufVxuXG50eXBlIFNhbml0aXplZEltYWdlRGF0YSA9IHtcbiAgZXh0OiBzdHJpbmdcbiAgbmFtZTogc3RyaW5nXG59XG5cbi8qKlxuICogU2FuaXRpemUgdGhlIGltYWdlIG5hbWUgYW5kIGV4dHJhY3QgdGhlIGV4dGVuc2lvbiBmcm9tIHRoZSBzb3VyY2UgaW1hZ2VcbiAqXG4gKiBAcGFyYW0gc291cmNlSW1hZ2UgLSB0aGUgc291cmNlIGltYWdlXG4gKiBAcmV0dXJucyB0aGUgc2FuaXRpemVkIG5hbWUgYW5kIGV4dGVuc2lvblxuICovXG5jb25zdCBnZXRTYW5pdGl6ZWRJbWFnZURhdGEgPSAoc291cmNlSW1hZ2U6IHN0cmluZyk6IFNhbml0aXplZEltYWdlRGF0YSA9PiB7XG4gIGNvbnN0IGV4dGVuc2lvbiA9IHNvdXJjZUltYWdlLnNwbGl0KCcuJykucG9wKClcbiAgY29uc3QgbmFtZSA9IHNhbml0aXplKHNvdXJjZUltYWdlLnN1YnN0cmluZygwLCBzb3VyY2VJbWFnZS5sYXN0SW5kZXhPZignLicpKSB8fCBzb3VyY2VJbWFnZSlcbiAgcmV0dXJuIHsgbmFtZSwgZXh0OiBleHRlbnNpb24gfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbWFnZSBuYW1lIGJhc2VkIG9uIHRoZSBvdXRwdXQgaW1hZ2UgbmFtZSwgdGhlIGRpbWVuc2lvbnMgYW5kXG4gKiB0aGUgZXh0ZW5zaW9uLlxuICpcbiAqIElnbm9yZSB0aGUgZmFjdCB0aGF0IGR1cGxpY2F0ZSBuYW1lcyBjb3VsZCBoYXBwZW4gaWYgdGhlIHRoZXJlIGlzIG9uZVxuICogc2l6ZSB3aXRoIGB3aWR0aCBBTkQgaGVpZ2h0YCBhbmQgb25lIHdpdGggb25seSBgaGVpZ2h0IE9SIHdpZHRoYC4gQmVjYXVzZVxuICogc3BhY2UgaXMgZXhwZW5zaXZlLCB3ZSB3aWxsIHJldXNlIHRoZSBzYW1lIGltYWdlIGZvciBib3RoIHNpemVzLlxuICpcbiAqIEBwYXJhbSBvdXRwdXRJbWFnZU5hbWUgLSB0aGUgc2FuaXRpemVkIGltYWdlIG5hbWVcbiAqIEBwYXJhbSBidWZmZXJJbmZvIC0gdGhlIGJ1ZmZlciBpbmZvXG4gKiBAcGFyYW0gZXh0ZW5zaW9uIC0gdGhlIGV4dGVuc2lvbiB0byB1c2VcbiAqIEByZXR1cm5zIHRoZSBuZXcgaW1hZ2UgbmFtZSB0aGF0IGlzIG5vdCB0YWtlblxuICovXG5cbnR5cGUgQ3JlYXRlSW1hZ2VOYW1lQXJncyA9IHtcbiAgZXh0ZW5zaW9uOiBzdHJpbmdcbiAgaGVpZ2h0OiBudW1iZXJcbiAgb3V0cHV0SW1hZ2VOYW1lOiBzdHJpbmdcbiAgd2lkdGg6IG51bWJlclxufVxuY29uc3QgY3JlYXRlSW1hZ2VOYW1lID0gKHtcbiAgZXh0ZW5zaW9uLFxuICBoZWlnaHQsXG4gIG91dHB1dEltYWdlTmFtZSxcbiAgd2lkdGgsXG59OiBDcmVhdGVJbWFnZU5hbWVBcmdzKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIGAke291dHB1dEltYWdlTmFtZX0tJHt3aWR0aH14JHtoZWlnaHR9LiR7ZXh0ZW5zaW9ufWBcbn1cblxudHlwZSBDcmVhdGVSZXN1bHRBcmdzID0ge1xuICBmaWxlbmFtZT86IEZpbGVTaXplWydmaWxlbmFtZSddXG4gIGZpbGVzaXplPzogRmlsZVNpemVbJ2ZpbGVzaXplJ11cbiAgaGVpZ2h0PzogRmlsZVNpemVbJ2hlaWdodCddXG4gIG1pbWVUeXBlPzogRmlsZVNpemVbJ21pbWVUeXBlJ11cbiAgbmFtZTogc3RyaW5nXG4gIHNpemVzVG9TYXZlPzogRmlsZVRvU2F2ZVtdXG4gIHdpZHRoPzogRmlsZVNpemVbJ3dpZHRoJ11cbn1cblxuLyoqXG4gKiBDcmVhdGUgdGhlIHJlc3VsdCBvYmplY3QgZm9yIHRoZSBpbWFnZSByZXNpemUgb3BlcmF0aW9uIGJhc2VkIG9uIHRoZVxuICogcHJvdmlkZWQgcGFyYW1ldGVycy4gSWYgdGhlIG5hbWUgaXMgbm90IHByb3ZpZGVkLCBhbiBlbXB0eSByZXN1bHQgb2JqZWN0XG4gKiBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBpbWFnZVxuICogQHBhcmFtIGZpbGVuYW1lIC0gdGhlIGZpbGVuYW1lIG9mIHRoZSBpbWFnZVxuICogQHBhcmFtIHdpZHRoIC0gdGhlIHdpZHRoIG9mIHRoZSBpbWFnZVxuICogQHBhcmFtIGhlaWdodCAtIHRoZSBoZWlnaHQgb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0gZmlsZXNpemUgLSB0aGUgZmlsZXNpemUgb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0gbWltZVR5cGUgLSB0aGUgbWltZSB0eXBlIG9mIHRoZSBpbWFnZVxuICogQHBhcmFtIHNpemVzVG9TYXZlIC0gdGhlIHNpemVzIHRvIHNhdmVcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2JqZWN0XG4gKi9cbmNvbnN0IGNyZWF0ZVJlc3VsdCA9ICh7XG4gIG5hbWUsXG4gIGZpbGVuYW1lID0gbnVsbCxcbiAgZmlsZXNpemUgPSBudWxsLFxuICBoZWlnaHQgPSBudWxsLFxuICBtaW1lVHlwZSA9IG51bGwsXG4gIHNpemVzVG9TYXZlID0gW10sXG4gIHdpZHRoID0gbnVsbCxcbn06IENyZWF0ZVJlc3VsdEFyZ3MpOiBJbWFnZVNpemVzUmVzdWx0ID0+IHtcbiAgcmV0dXJuIHtcbiAgICBzaXplRGF0YToge1xuICAgICAgW25hbWVdOiB7XG4gICAgICAgIGZpbGVuYW1lLFxuICAgICAgICBmaWxlc2l6ZSxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBtaW1lVHlwZSxcbiAgICAgICAgd2lkdGgsXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2l6ZXNUb1NhdmUsXG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciBvciBub3QgdG8gcmVzaXplIHRoZSBpbWFnZS5cbiAqIC0gcmVzaXplIHVzaW5nIGltYWdlIGNvbmZpZ1xuICogLSByZXNpemUgdXNpbmcgaW1hZ2UgY29uZmlnIHdpdGggZm9jYWwgYWRqdXN0bWVudHNcbiAqIC0gZG8gbm90IHJlc2l6ZSBhdCBhbGxcbiAqXG4gKiBgaW1hZ2VSZXNpemVDb25maWcud2l0aG91dEVubGFyZ2VtZW50YDpcbiAqIC0gdW5kZWZpbmVkIFtkZWZhdWx0XTogdXBsb2FkaW5nIGltYWdlcyB3aXRoIHNtYWxsZXIgd2lkdGggQU5EIGhlaWdodCB0aGFuIHRoZSBpbWFnZSBzaXplIHdpbGwgcmV0dXJuIG51bGxcbiAqIC0gZmFsc2U6IGFsd2F5cyBlbmxhcmdlIGltYWdlcyB0byB0aGUgaW1hZ2Ugc2l6ZVxuICogLSB0cnVlOiBpZiB0aGUgaW1hZ2UgaXMgc21hbGxlciB0aGFuIHRoZSBpbWFnZSBzaXplLCByZXR1cm4gdGhlIG9yaWdpbmFsIGltYWdlXG4gKlxuICogYGltYWdlUmVzaXplQ29uZmlnLndpdGhvdXRSZWR1Y3Rpb25gOlxuICogLSBmYWxzZSBbZGVmYXVsdF06IGFsd2F5cyBlbmxhcmdlIGltYWdlcyB0byB0aGUgaW1hZ2Ugc2l6ZVxuICogLSB0cnVlOiBpZiB0aGUgaW1hZ2UgaXMgc21hbGxlciB0aGFuIHRoZSBpbWFnZSBzaXplLCByZXR1cm4gdGhlIG9yaWdpbmFsIGltYWdlXG4gKlxuICogQHJldHVybiAnb21pdCcgfCAncmVzaXplJyB8ICdyZXNpemVXaXRoRm9jYWxQb2ludCdcbiAqL1xuY29uc3QgZ2V0SW1hZ2VSZXNpemVBY3Rpb24gPSAoe1xuICBkaW1lbnNpb25zOiBvcmlnaW5hbEltYWdlLFxuICBoYXNGb2NhbFBvaW50LFxuICBpbWFnZVJlc2l6ZUNvbmZpZyxcbn06IHtcbiAgZGltZW5zaW9uczogUHJvYmVkSW1hZ2VTaXplXG4gIGhhc0ZvY2FsUG9pbnQ/OiBib29sZWFuXG4gIGltYWdlUmVzaXplQ29uZmlnOiBJbWFnZVNpemVcbn0pOiAnb21pdCcgfCAncmVzaXplJyB8ICdyZXNpemVXaXRoRm9jYWxQb2ludCcgPT4ge1xuICBjb25zdCB7XG4gICAgZml0LFxuICAgIGhlaWdodDogdGFyZ2V0SGVpZ2h0LFxuICAgIHdpZHRoOiB0YXJnZXRXaWR0aCxcbiAgICB3aXRob3V0RW5sYXJnZW1lbnQsXG4gICAgd2l0aG91dFJlZHVjdGlvbixcbiAgfSA9IGltYWdlUmVzaXplQ29uZmlnXG5cbiAgLy8gcHJldmVudCB1cHNjYWxpbmcgYnkgZGVmYXVsdCB3aGVuIHggYW5kIHkgYXJlIGJvdGggc21hbGxlciB0aGFuIHRhcmdldCBpbWFnZSBzaXplXG4gIGlmICh0YXJnZXRIZWlnaHQgJiYgdGFyZ2V0V2lkdGgpIHtcbiAgICBjb25zdCBvcmlnaW5hbEltYWdlSXNTbWFsbGVyWEFuZFkgPVxuICAgICAgb3JpZ2luYWxJbWFnZS53aWR0aCA8IHRhcmdldFdpZHRoICYmIG9yaWdpbmFsSW1hZ2UuaGVpZ2h0IDwgdGFyZ2V0SGVpZ2h0XG4gICAgaWYgKHdpdGhvdXRFbmxhcmdlbWVudCA9PT0gdW5kZWZpbmVkICYmIG9yaWdpbmFsSW1hZ2VJc1NtYWxsZXJYQW5kWSkge1xuICAgICAgcmV0dXJuICdvbWl0JyAvLyBwcmV2ZW50IGltYWdlIHNpemUgZnJvbSBiZWluZyBlbmxhcmdlZFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9yaWdpbmFsSW1hZ2VJc1NtYWxsZXJYT3JZID1cbiAgICBvcmlnaW5hbEltYWdlLndpZHRoIDwgdGFyZ2V0V2lkdGggfHwgb3JpZ2luYWxJbWFnZS5oZWlnaHQgPCB0YXJnZXRIZWlnaHRcbiAgaWYgKGZpdCA9PT0gJ2NvbnRhaW4nIHx8IGZpdCA9PT0gJ2luc2lkZScpIHJldHVybiAncmVzaXplJ1xuICBpZiAoIWlzTnVtYmVyKHRhcmdldEhlaWdodCkgJiYgIWlzTnVtYmVyKHRhcmdldFdpZHRoKSkgcmV0dXJuICdyZXNpemUnXG5cbiAgY29uc3QgdGFyZ2V0QXNwZWN0UmF0aW8gPSB0YXJnZXRXaWR0aCAvIHRhcmdldEhlaWdodFxuICBjb25zdCBvcmlnaW5hbEFzcGVjdFJhdGlvID0gb3JpZ2luYWxJbWFnZS53aWR0aCAvIG9yaWdpbmFsSW1hZ2UuaGVpZ2h0XG4gIGlmIChvcmlnaW5hbEFzcGVjdFJhdGlvID09PSB0YXJnZXRBc3BlY3RSYXRpbykgcmV0dXJuICdyZXNpemUnXG5cbiAgaWYgKHdpdGhvdXRFbmxhcmdlbWVudCAmJiBvcmlnaW5hbEltYWdlSXNTbWFsbGVyWE9yWSkgcmV0dXJuICdyZXNpemUnXG4gIGlmICh3aXRob3V0UmVkdWN0aW9uICYmICFvcmlnaW5hbEltYWdlSXNTbWFsbGVyWE9yWSkgcmV0dXJuICdyZXNpemUnXG5cbiAgcmV0dXJuIGhhc0ZvY2FsUG9pbnQgPyAncmVzaXplV2l0aEZvY2FsUG9pbnQnIDogJ3Jlc2l6ZSdcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZSB0aGUgcmVzaXplIGNvbmZpZy4gSWYgdGhlIHJlc2l6ZSBjb25maWcgaGFzIHRoZSBgd2l0aG91dFJlZHVjdGlvbmBcbiAqIHByb3BlcnR5IHNldCB0byB0cnVlLCB0aGUgYGZpdGAgYW5kIGBwb3NpdGlvbmAgcHJvcGVydGllcyB3aWxsIGJlIHNldCB0byBgY29udGFpbmBcbiAqIGFuZCBgdG9wIGxlZnRgIHJlc3BlY3RpdmVseS5cbiAqXG4gKiBAcGFyYW0gcmVzaXplQ29uZmlnIC0gdGhlIHJlc2l6ZSBjb25maWdcbiAqIEByZXR1cm5zIGEgc2FuaXRpemVkIHJlc2l6ZSBjb25maWdcbiAqL1xuY29uc3Qgc2FuaXRpemVSZXNpemVDb25maWcgPSAocmVzaXplQ29uZmlnOiBJbWFnZVNpemUpOiBJbWFnZVNpemUgPT4ge1xuICBpZiAocmVzaXplQ29uZmlnLndpdGhvdXRSZWR1Y3Rpb24pIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ucmVzaXplQ29uZmlnLFxuICAgICAgLy8gV2h5IGZpdCBgY29udGFpbmAgc2hvdWxkIGFsc28gYmUgc2V0IHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9sb3ZlbGwvc2hhcnAvaXNzdWVzLzM1OTVcbiAgICAgIGZpdDogcmVzaXplQ29uZmlnPy5maXQgfHwgJ2NvbnRhaW4nLFxuICAgICAgcG9zaXRpb246IHJlc2l6ZUNvbmZpZz8ucG9zaXRpb24gfHwgJ2xlZnQgdG9wJyxcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc2l6ZUNvbmZpZ1xufVxuXG4vKipcbiAqIFVzZWQgdG8gZXh0cmFjdCBoZWlnaHQgZnJvbSBpbWFnZXMsIGFuaW1hdGVkIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0gc2hhcnBNZXRhZGF0YSAtIHRoZSBzaGFycCBtZXRhZGF0YVxuICogQHJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgaW1hZ2VcbiAqL1xuZnVuY3Rpb24gZXh0cmFjdEhlaWdodEZyb21JbWFnZShzaGFycE1ldGFkYXRhOiBTaGFycE1ldGFkYXRhKTogbnVtYmVyIHtcbiAgaWYgKHNoYXJwTWV0YWRhdGE/LnBhZ2VzKSB7XG4gICAgcmV0dXJuIHNoYXJwTWV0YWRhdGEuaGVpZ2h0IC8gc2hhcnBNZXRhZGF0YS5wYWdlc1xuICB9XG4gIHJldHVybiBzaGFycE1ldGFkYXRhLmhlaWdodFxufVxuXG4vKipcbiAqIEZvciB0aGUgcHJvdmlkZWQgaW1hZ2Ugc2l6ZXMsIGhhbmRsZSB0aGUgcmVzaXppbmcgYW5kIHRoZSB0cmFuc2Zvcm1zXG4gKiAoZm9ybWF0LCB0cmltLCBldGMuKSBvZiBlYWNoIHJlcXVlc3RlZCBpbWFnZSBzaXplIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvYmplY3QuXG4gKiBUaGlzIG9ubHkgaGFuZGxlcyB0aGUgaW1hZ2Ugc2l6ZXMuIFRoZSB0cmFuc2Zvcm1zIG9mIHRoZSBvcmlnaW5hbCBpbWFnZVxuICogYXJlIGhhbmRsZWQgaW4ge0BsaW5rIC4vZ2VuZXJhdGVGaWxlRGF0YS50c30uXG4gKlxuICogVGhlIGltYWdlIHdpbGwgYmUgcmVzaXplZCBhY2NvcmRpbmcgdG8gdGhlIHByb3ZpZGVkXG4gKiByZXNpemUgY29uZmlnLiBJZiBubyBpbWFnZSBzaXplcyBhcmUgcmVxdWVzdGVkLCB0aGUgcmVzb2x2ZWQgZGF0YSB3aWxsIGJlIGVtcHR5LlxuICogRm9yIGV2ZXJ5IGltYWdlIHRoYXQgZG9lcyBub3QgbmVlZCB0byBiZSByZXNpemVkLCBhIHJlc3VsdCBvYmplY3Qgd2l0aCBgbnVsbGBcbiAqIHBhcmFtZXRlcnMgd2lsbCBiZSByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0gcmVzaXplQ29uZmlnIC0gdGhlIHJlc2l6ZSBjb25maWdcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHJlc2l6ZSBvcGVyYXRpb24ocylcbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmVzaXplQW5kVHJhbnNmb3JtSW1hZ2VTaXplcyh7XG4gIGNvbmZpZyxcbiAgZGltZW5zaW9ucyxcbiAgZmlsZSxcbiAgbWltZVR5cGUsXG4gIHJlcSxcbiAgc2F2ZWRGaWxlbmFtZSxcbiAgc3RhdGljUGF0aCxcbiAgdXBsb2FkRWRpdHMsXG4gIHdpdGhNZXRhZGF0YSxcbn06IFJlc2l6ZUFyZ3MpOiBQcm9taXNlPEltYWdlU2l6ZXNSZXN1bHQ+IHtcbiAgY29uc3QgeyBmb2NhbFBvaW50OiBmb2NhbFBvaW50RW5hYmxlZCA9IHRydWUsIGltYWdlU2l6ZXMgfSA9IGNvbmZpZy51cGxvYWRcblxuICAvLyBGb2NhbCBwb2ludCBhZGp1c3RtZW50c1xuICBjb25zdCBpbmNvbWluZ0ZvY2FsUG9pbnQgPSB1cGxvYWRFZGl0cz8uZm9jYWxQb2ludFxuICAgID8ge1xuICAgICAgICB4OiBpc051bWJlcih1cGxvYWRFZGl0cy5mb2NhbFBvaW50LngpID8gTWF0aC5yb3VuZCh1cGxvYWRFZGl0cy5mb2NhbFBvaW50LngpIDogNTAsXG4gICAgICAgIHk6IGlzTnVtYmVyKHVwbG9hZEVkaXRzLmZvY2FsUG9pbnQueSkgPyBNYXRoLnJvdW5kKHVwbG9hZEVkaXRzLmZvY2FsUG9pbnQueSkgOiA1MCxcbiAgICAgIH1cbiAgICA6IHVuZGVmaW5lZFxuXG4gIGNvbnN0IGRlZmF1bHRSZXN1bHQ6IEltYWdlU2l6ZXNSZXN1bHQgPSB7XG4gICAgLi4uKGZvY2FsUG9pbnRFbmFibGVkICYmIGluY29taW5nRm9jYWxQb2ludCAmJiB7IGZvY2FsUG9pbnQ6IGluY29taW5nRm9jYWxQb2ludCB9KSxcbiAgICBzaXplRGF0YToge30sXG4gICAgc2l6ZXNUb1NhdmU6IFtdLFxuICB9XG5cbiAgLy8gTm90aGluZyB0byByZXNpemUgaGVyZSBzbyByZXR1cm4gYXMgZWFybHkgYXMgcG9zc2libGVcbiAgaWYgKCFpbWFnZVNpemVzKSByZXR1cm4gZGVmYXVsdFJlc3VsdFxuXG4gIC8vIERldGVybWluZSBpZiB0aGUgZmlsZSBpcyBhbmltYXRlZFxuICBjb25zdCBmaWxlSXNBbmltYXRlZFR5cGUgPSBbJ2ltYWdlL2F2aWYnLCAnaW1hZ2UvZ2lmJywgJ2ltYWdlL3dlYnAnXS5pbmNsdWRlcyhmaWxlLm1pbWV0eXBlKVxuICBjb25zdCBzaGFycE9wdGlvbnM6IFNoYXJwT3B0aW9ucyA9IHt9XG5cbiAgaWYgKGZpbGVJc0FuaW1hdGVkVHlwZSkgc2hhcnBPcHRpb25zLmFuaW1hdGVkID0gdHJ1ZVxuXG4gIGNvbnN0IHNoYXJwQmFzZTogU2hhcnAgfCB1bmRlZmluZWQgPSBzaGFycChmaWxlLnRlbXBGaWxlUGF0aCB8fCBmaWxlLmRhdGEsIHNoYXJwT3B0aW9ucykucm90YXRlKCkgLy8gcGFzcyByb3RhdGUoKSB0byBhdXRvLXJvdGF0ZSBiYXNlZCBvbiBFWElGIGRhdGEuIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXlsb2FkY21zL3BheWxvYWQvcHVsbC8zMDgxXG4gIGNvbnN0IG9yaWdpbmFsSW1hZ2VNZXRhID0gYXdhaXQgc2hhcnBCYXNlLm1ldGFkYXRhKClcblxuICBsZXQgYWRqdXN0ZWREaW1lbnNpb25zID0geyAuLi5kaW1lbnNpb25zIH1cblxuICAvLyBJbWFnZXMgd2l0aCBhbiBleGlmIG9yaWVudGF0aW9uIG9mIDUsIDYsIDcsIG9yIDggYXJlIGF1dG8tcm90YXRlZCBieSBzaGFycFxuICAvLyBOZWVkIHRvIGFkanVzdCB0aGUgZGltZW5zaW9ucyB0byBtYXRjaCB0aGUgb3JpZ2luYWwgaW1hZ2VcbiAgaWYgKFs1LCA2LCA3LCA4XS5pbmNsdWRlcyhvcmlnaW5hbEltYWdlTWV0YS5vcmllbnRhdGlvbikpIHtcbiAgICBhZGp1c3RlZERpbWVuc2lvbnMgPSB7XG4gICAgICAuLi5kaW1lbnNpb25zLFxuICAgICAgaGVpZ2h0OiBkaW1lbnNpb25zLndpZHRoLFxuICAgICAgd2lkdGg6IGRpbWVuc2lvbnMuaGVpZ2h0LFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlc2l6ZUltYWdlTWV0YSA9IHtcbiAgICBoZWlnaHQ6IGV4dHJhY3RIZWlnaHRGcm9tSW1hZ2Uob3JpZ2luYWxJbWFnZU1ldGEpLFxuICAgIHdpZHRoOiBvcmlnaW5hbEltYWdlTWV0YS53aWR0aCxcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdHM6IEltYWdlU2l6ZXNSZXN1bHRbXSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgIGltYWdlU2l6ZXMubWFwKGFzeW5jIChpbWFnZVJlc2l6ZUNvbmZpZyk6IFByb21pc2U8SW1hZ2VTaXplc1Jlc3VsdD4gPT4ge1xuICAgICAgaW1hZ2VSZXNpemVDb25maWcgPSBzYW5pdGl6ZVJlc2l6ZUNvbmZpZyhpbWFnZVJlc2l6ZUNvbmZpZylcblxuICAgICAgY29uc3QgcmVzaXplQWN0aW9uID0gZ2V0SW1hZ2VSZXNpemVBY3Rpb24oe1xuICAgICAgICBkaW1lbnNpb25zLFxuICAgICAgICBoYXNGb2NhbFBvaW50OiBCb29sZWFuKGluY29taW5nRm9jYWxQb2ludCksXG4gICAgICAgIGltYWdlUmVzaXplQ29uZmlnLFxuICAgICAgfSlcbiAgICAgIGlmIChyZXNpemVBY3Rpb24gPT09ICdvbWl0JykgcmV0dXJuIGNyZWF0ZVJlc3VsdCh7IG5hbWU6IGltYWdlUmVzaXplQ29uZmlnLm5hbWUgfSlcblxuICAgICAgY29uc3QgaW1hZ2VUb1Jlc2l6ZSA9IHNoYXJwQmFzZS5jbG9uZSgpXG4gICAgICBsZXQgcmVzaXplZCA9IGltYWdlVG9SZXNpemVcblxuICAgICAgaWYgKHJlc2l6ZUFjdGlvbiA9PT0gJ3Jlc2l6ZVdpdGhGb2NhbFBvaW50Jykge1xuICAgICAgICBsZXQgeyBoZWlnaHQ6IHJlc2l6ZUhlaWdodCwgd2lkdGg6IHJlc2l6ZVdpZHRoIH0gPSBpbWFnZVJlc2l6ZUNvbmZpZ1xuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsQXNwZWN0UmF0aW8gPSBhZGp1c3RlZERpbWVuc2lvbnMud2lkdGggLyBhZGp1c3RlZERpbWVuc2lvbnMuaGVpZ2h0XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHJlc2l6ZVdpZHRoIGJhc2VkIG9uIG9yaWdpbmFsIGFzcGVjdCByYXRpbyBpZiBpdCdzIHVuZGVmaW5lZFxuICAgICAgICBpZiAocmVzaXplSGVpZ2h0ICYmICFyZXNpemVXaWR0aCkge1xuICAgICAgICAgIHJlc2l6ZVdpZHRoID0gTWF0aC5yb3VuZChyZXNpemVIZWlnaHQgKiBvcmlnaW5hbEFzcGVjdFJhdGlvKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHJlc2l6ZUhlaWdodCBiYXNlZCBvbiBvcmlnaW5hbCBhc3BlY3QgcmF0aW8gaWYgaXQncyB1bmRlZmluZWRcbiAgICAgICAgaWYgKHJlc2l6ZVdpZHRoICYmICFyZXNpemVIZWlnaHQpIHtcbiAgICAgICAgICByZXNpemVIZWlnaHQgPSBNYXRoLnJvdW5kKHJlc2l6ZVdpZHRoIC8gb3JpZ2luYWxBc3BlY3RSYXRpbylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzaXplSGVpZ2h0KSByZXNpemVIZWlnaHQgPSByZXNpemVJbWFnZU1ldGEuaGVpZ2h0XG4gICAgICAgIGlmICghcmVzaXplV2lkdGgpIHJlc2l6ZVdpZHRoID0gcmVzaXplSW1hZ2VNZXRhLndpZHRoXG5cbiAgICAgICAgY29uc3QgcmVzaXplQXNwZWN0UmF0aW8gPSByZXNpemVXaWR0aCAvIHJlc2l6ZUhlaWdodFxuICAgICAgICBjb25zdCBwcmlvcml0aXplSGVpZ2h0ID0gcmVzaXplQXNwZWN0UmF0aW8gPCBvcmlnaW5hbEFzcGVjdFJhdGlvXG4gICAgICAgIC8vIFNjYWxlcyB0aGUgaW1hZ2UgYmVmb3JlIGV4dHJhY3RpbmcgZnJvbSBpdFxuICAgICAgICByZXNpemVkID0gaW1hZ2VUb1Jlc2l6ZS5yZXNpemUoe1xuICAgICAgICAgIGhlaWdodDogcHJpb3JpdGl6ZUhlaWdodCA/IHJlc2l6ZUhlaWdodCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB3aWR0aDogcHJpb3JpdGl6ZUhlaWdodCA/IHVuZGVmaW5lZCA6IHJlc2l6ZVdpZHRoLFxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhQXBwZW5kZWRGaWxlID0gYXdhaXQgb3B0aW9uYWxseUFwcGVuZE1ldGFkYXRhKHtcbiAgICAgICAgICByZXEsXG4gICAgICAgICAgc2hhcnBGaWxlOiByZXNpemVkLFxuICAgICAgICAgIHdpdGhNZXRhZGF0YSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBNdXN0IHJlYWQgZnJvbSBidWZmZXIsIHJlc2l6ZWQubWV0YWRhdGEgd2lsbCByZXR1cm4gdGhlIG9yaWdpbmFsIGltYWdlIG1ldGFkYXRhXG4gICAgICAgIGNvbnN0IHsgaW5mbyB9ID0gYXdhaXQgbWV0YWRhdGFBcHBlbmRlZEZpbGUudG9CdWZmZXIoeyByZXNvbHZlV2l0aE9iamVjdDogdHJ1ZSB9KVxuXG4gICAgICAgIHJlc2l6ZUltYWdlTWV0YS5oZWlnaHQgPSBleHRyYWN0SGVpZ2h0RnJvbUltYWdlKHtcbiAgICAgICAgICAuLi5vcmlnaW5hbEltYWdlTWV0YSxcbiAgICAgICAgICBoZWlnaHQ6IGluZm8uaGVpZ2h0LFxuICAgICAgICB9KVxuICAgICAgICByZXNpemVJbWFnZU1ldGEud2lkdGggPSBpbmZvLndpZHRoXG5cbiAgICAgICAgY29uc3QgaGFsZlJlc2l6ZVggPSByZXNpemVXaWR0aCAvIDJcbiAgICAgICAgY29uc3QgeEZvY2FsQ2VudGVyID0gcmVzaXplSW1hZ2VNZXRhLndpZHRoICogKGluY29taW5nRm9jYWxQb2ludC54IC8gMTAwKVxuICAgICAgICBjb25zdCBjYWxjdWxhdGVkUmlnaHRQaXhlbEJvdW5kID0geEZvY2FsQ2VudGVyICsgaGFsZlJlc2l6ZVhcbiAgICAgICAgbGV0IGxlZnRCb3VuZCA9IHhGb2NhbENlbnRlciAtIGhhbGZSZXNpemVYXG5cbiAgICAgICAgLy8gaWYgdGhlIHJpZ2h0IGJvdW5kIGlzIGdyZWF0ZXIgdGhhbiB0aGUgaW1hZ2Ugd2lkdGgsIGFkanVzdCB0aGUgbGVmdCBib3VuZFxuICAgICAgICAvLyBrZWVwaW5nIGZvY3VzIG9uIHRoZSByaWdodFxuICAgICAgICBpZiAoY2FsY3VsYXRlZFJpZ2h0UGl4ZWxCb3VuZCA+IHJlc2l6ZUltYWdlTWV0YS53aWR0aCkge1xuICAgICAgICAgIGxlZnRCb3VuZCA9IHJlc2l6ZUltYWdlTWV0YS53aWR0aCAtIHJlc2l6ZVdpZHRoXG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgbGVmdCBib3VuZCBpcyBsZXNzIHRoYW4gMCwgYWRqdXN0IHRoZSBsZWZ0IGJvdW5kIHRvIDBcbiAgICAgICAgLy8ga2VlcGluZyB0aGUgZm9jdXMgb24gdGhlIGxlZnRcbiAgICAgICAgaWYgKGxlZnRCb3VuZCA8IDApIGxlZnRCb3VuZCA9IDBcblxuICAgICAgICBjb25zdCBoYWxmUmVzaXplWSA9IHJlc2l6ZUhlaWdodCAvIDJcbiAgICAgICAgY29uc3QgeUZvY2FsQ2VudGVyID0gcmVzaXplSW1hZ2VNZXRhLmhlaWdodCAqIChpbmNvbWluZ0ZvY2FsUG9pbnQueSAvIDEwMClcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlZEJvdHRvbVBpeGVsQm91bmQgPSB5Rm9jYWxDZW50ZXIgKyBoYWxmUmVzaXplWVxuICAgICAgICBsZXQgdG9wQm91bmQgPSB5Rm9jYWxDZW50ZXIgLSBoYWxmUmVzaXplWVxuXG4gICAgICAgIC8vIGlmIHRoZSBib3R0b20gYm91bmQgaXMgZ3JlYXRlciB0aGFuIHRoZSBpbWFnZSBoZWlnaHQsIGFkanVzdCB0aGUgdG9wIGJvdW5kXG4gICAgICAgIC8vIGtlZXBpbmcgdGhlIGltYWdlIGFzIGZhciByaWdodCBhcyBwb3NzaWJsZVxuICAgICAgICBpZiAoY2FsY3VsYXRlZEJvdHRvbVBpeGVsQm91bmQgPiByZXNpemVJbWFnZU1ldGEuaGVpZ2h0KSB7XG4gICAgICAgICAgdG9wQm91bmQgPSByZXNpemVJbWFnZU1ldGEuaGVpZ2h0IC0gcmVzaXplSGVpZ2h0XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgdG9wIGJvdW5kIGlzIGxlc3MgdGhhbiAwLCBhZGp1c3QgdGhlIHRvcCBib3VuZCB0byAwXG4gICAgICAgIC8vIGtlZXBpbmcgdGhlIGltYWdlIGZvY3VzIG5lYXIgdGhlIHRvcFxuICAgICAgICBpZiAodG9wQm91bmQgPCAwKSB0b3BCb3VuZCA9IDBcblxuICAgICAgICByZXNpemVkID0gcmVzaXplZC5leHRyYWN0KHtcbiAgICAgICAgICBoZWlnaHQ6IHJlc2l6ZUhlaWdodCxcbiAgICAgICAgICBsZWZ0OiBNYXRoLmZsb29yKGxlZnRCb3VuZCksXG4gICAgICAgICAgdG9wOiBNYXRoLmZsb29yKHRvcEJvdW5kKSxcbiAgICAgICAgICB3aWR0aDogcmVzaXplV2lkdGgsXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNpemVkID0gaW1hZ2VUb1Jlc2l6ZS5yZXNpemUoaW1hZ2VSZXNpemVDb25maWcpXG4gICAgICB9XG5cbiAgICAgIGlmIChpbWFnZVJlc2l6ZUNvbmZpZy5mb3JtYXRPcHRpb25zKSB7XG4gICAgICAgIHJlc2l6ZWQgPSByZXNpemVkLnRvRm9ybWF0KFxuICAgICAgICAgIGltYWdlUmVzaXplQ29uZmlnLmZvcm1hdE9wdGlvbnMuZm9ybWF0LFxuICAgICAgICAgIGltYWdlUmVzaXplQ29uZmlnLmZvcm1hdE9wdGlvbnMub3B0aW9ucyxcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBpZiAoaW1hZ2VSZXNpemVDb25maWcudHJpbU9wdGlvbnMpIHtcbiAgICAgICAgcmVzaXplZCA9IHJlc2l6ZWQudHJpbShpbWFnZVJlc2l6ZUNvbmZpZy50cmltT3B0aW9ucylcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWV0YWRhdGFBcHBlbmRlZEZpbGUgPSBhd2FpdCBvcHRpb25hbGx5QXBwZW5kTWV0YWRhdGEoe1xuICAgICAgICByZXEsXG4gICAgICAgIHNoYXJwRmlsZTogcmVzaXplZCxcbiAgICAgICAgd2l0aE1ldGFkYXRhLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgeyBkYXRhOiBidWZmZXJEYXRhLCBpbmZvOiBidWZmZXJJbmZvIH0gPSBhd2FpdCBtZXRhZGF0YUFwcGVuZGVkRmlsZS50b0J1ZmZlcih7XG4gICAgICAgIHJlc29sdmVXaXRoT2JqZWN0OiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3Qgc2FuaXRpemVkSW1hZ2UgPSBnZXRTYW5pdGl6ZWRJbWFnZURhdGEoc2F2ZWRGaWxlbmFtZSlcblxuICAgICAgaWYgKHJlcS5wYXlsb2FkVXBsb2FkU2l6ZXMpIHtcbiAgICAgICAgcmVxLnBheWxvYWRVcGxvYWRTaXplc1tpbWFnZVJlc2l6ZUNvbmZpZy5uYW1lXSA9IGJ1ZmZlckRhdGFcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWltZUluZm8gPSBhd2FpdCBmcm9tQnVmZmVyKGJ1ZmZlckRhdGEpXG5cbiAgICAgIGNvbnN0IGltYWdlTmFtZVdpdGhEaW1lbnNpb25zID0gaW1hZ2VSZXNpemVDb25maWcuZ2VuZXJhdGVJbWFnZU5hbWVcbiAgICAgICAgPyBpbWFnZVJlc2l6ZUNvbmZpZy5nZW5lcmF0ZUltYWdlTmFtZSh7XG4gICAgICAgICAgICBleHRlbnNpb246IG1pbWVJbmZvPy5leHQgfHwgc2FuaXRpemVkSW1hZ2UuZXh0LFxuICAgICAgICAgICAgaGVpZ2h0OiBleHRyYWN0SGVpZ2h0RnJvbUltYWdlKHtcbiAgICAgICAgICAgICAgLi4ub3JpZ2luYWxJbWFnZU1ldGEsXG4gICAgICAgICAgICAgIGhlaWdodDogYnVmZmVySW5mby5oZWlnaHQsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG9yaWdpbmFsTmFtZTogc2FuaXRpemVkSW1hZ2UubmFtZSxcbiAgICAgICAgICAgIHNpemVOYW1lOiBpbWFnZVJlc2l6ZUNvbmZpZy5uYW1lLFxuICAgICAgICAgICAgd2lkdGg6IGJ1ZmZlckluZm8ud2lkdGgsXG4gICAgICAgICAgfSlcbiAgICAgICAgOiBjcmVhdGVJbWFnZU5hbWUoe1xuICAgICAgICAgICAgZXh0ZW5zaW9uOiBtaW1lSW5mbz8uZXh0IHx8IHNhbml0aXplZEltYWdlLmV4dCxcbiAgICAgICAgICAgIGhlaWdodDogZXh0cmFjdEhlaWdodEZyb21JbWFnZSh7XG4gICAgICAgICAgICAgIC4uLm9yaWdpbmFsSW1hZ2VNZXRhLFxuICAgICAgICAgICAgICBoZWlnaHQ6IGJ1ZmZlckluZm8uaGVpZ2h0LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBvdXRwdXRJbWFnZU5hbWU6IHNhbml0aXplZEltYWdlLm5hbWUsXG4gICAgICAgICAgICB3aWR0aDogYnVmZmVySW5mby53aWR0aCxcbiAgICAgICAgICB9KVxuXG4gICAgICBjb25zdCBpbWFnZVBhdGggPSBgJHtzdGF0aWNQYXRofS8ke2ltYWdlTmFtZVdpdGhEaW1lbnNpb25zfWBcblxuICAgICAgaWYgKGF3YWl0IGZpbGVFeGlzdHMoaW1hZ2VQYXRoKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZzLnVubGlua1N5bmMoaW1hZ2VQYXRoKVxuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAvLyBJZ25vcmUgdW5saW5rIGVycm9yc1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgaGVpZ2h0LCBzaXplLCB3aWR0aCB9ID0gYnVmZmVySW5mb1xuICAgICAgcmV0dXJuIGNyZWF0ZVJlc3VsdCh7XG4gICAgICAgIG5hbWU6IGltYWdlUmVzaXplQ29uZmlnLm5hbWUsXG4gICAgICAgIGZpbGVuYW1lOiBpbWFnZU5hbWVXaXRoRGltZW5zaW9ucyxcbiAgICAgICAgZmlsZXNpemU6IHNpemUsXG4gICAgICAgIGhlaWdodDpcbiAgICAgICAgICBmaWxlSXNBbmltYXRlZFR5cGUgJiYgb3JpZ2luYWxJbWFnZU1ldGEucGFnZXMgPyBoZWlnaHQgLyBvcmlnaW5hbEltYWdlTWV0YS5wYWdlcyA6IGhlaWdodCxcbiAgICAgICAgbWltZVR5cGU6IG1pbWVJbmZvPy5taW1lIHx8IG1pbWVUeXBlLFxuICAgICAgICBzaXplc1RvU2F2ZTogW3sgYnVmZmVyOiBidWZmZXJEYXRhLCBwYXRoOiBpbWFnZVBhdGggfV0sXG4gICAgICAgIHdpZHRoLFxuICAgICAgfSlcbiAgICB9KSxcbiAgKVxuXG4gIHJldHVybiByZXN1bHRzLnJlZHVjZShcbiAgICAoYWNjLCByZXN1bHQpID0+IHtcbiAgICAgIE9iamVjdC5hc3NpZ24oYWNjLnNpemVEYXRhLCByZXN1bHQuc2l6ZURhdGEpXG4gICAgICBhY2Muc2l6ZXNUb1NhdmUucHVzaCguLi5yZXN1bHQuc2l6ZXNUb1NhdmUpXG4gICAgICByZXR1cm4gYWNjXG4gICAgfSxcbiAgICB7IC4uLmRlZmF1bHRSZXN1bHQgfSxcbiAgKVxufVxuIl0sIm5hbWVzIjpbInJlc2l6ZUFuZFRyYW5zZm9ybUltYWdlU2l6ZXMiLCJnZXRTYW5pdGl6ZWRJbWFnZURhdGEiLCJzb3VyY2VJbWFnZSIsImV4dGVuc2lvbiIsInNwbGl0IiwicG9wIiwibmFtZSIsInNhbml0aXplIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJleHQiLCJjcmVhdGVJbWFnZU5hbWUiLCJoZWlnaHQiLCJvdXRwdXRJbWFnZU5hbWUiLCJ3aWR0aCIsImNyZWF0ZVJlc3VsdCIsImZpbGVuYW1lIiwiZmlsZXNpemUiLCJtaW1lVHlwZSIsInNpemVzVG9TYXZlIiwic2l6ZURhdGEiLCJnZXRJbWFnZVJlc2l6ZUFjdGlvbiIsImRpbWVuc2lvbnMiLCJvcmlnaW5hbEltYWdlIiwiaGFzRm9jYWxQb2ludCIsImltYWdlUmVzaXplQ29uZmlnIiwiZml0IiwidGFyZ2V0SGVpZ2h0IiwidGFyZ2V0V2lkdGgiLCJ3aXRob3V0RW5sYXJnZW1lbnQiLCJ3aXRob3V0UmVkdWN0aW9uIiwib3JpZ2luYWxJbWFnZUlzU21hbGxlclhBbmRZIiwidW5kZWZpbmVkIiwib3JpZ2luYWxJbWFnZUlzU21hbGxlclhPclkiLCJpc051bWJlciIsInRhcmdldEFzcGVjdFJhdGlvIiwib3JpZ2luYWxBc3BlY3RSYXRpbyIsInNhbml0aXplUmVzaXplQ29uZmlnIiwicmVzaXplQ29uZmlnIiwicG9zaXRpb24iLCJleHRyYWN0SGVpZ2h0RnJvbUltYWdlIiwic2hhcnBNZXRhZGF0YSIsInBhZ2VzIiwiY29uZmlnIiwiZmlsZSIsInJlcSIsInNhdmVkRmlsZW5hbWUiLCJzdGF0aWNQYXRoIiwidXBsb2FkRWRpdHMiLCJ3aXRoTWV0YWRhdGEiLCJmb2NhbFBvaW50IiwiZm9jYWxQb2ludEVuYWJsZWQiLCJpbWFnZVNpemVzIiwidXBsb2FkIiwiaW5jb21pbmdGb2NhbFBvaW50IiwieCIsIk1hdGgiLCJyb3VuZCIsInkiLCJkZWZhdWx0UmVzdWx0IiwiZmlsZUlzQW5pbWF0ZWRUeXBlIiwiaW5jbHVkZXMiLCJtaW1ldHlwZSIsInNoYXJwT3B0aW9ucyIsImFuaW1hdGVkIiwic2hhcnBCYXNlIiwic2hhcnAiLCJ0ZW1wRmlsZVBhdGgiLCJkYXRhIiwicm90YXRlIiwib3JpZ2luYWxJbWFnZU1ldGEiLCJtZXRhZGF0YSIsImFkanVzdGVkRGltZW5zaW9ucyIsIm9yaWVudGF0aW9uIiwicmVzaXplSW1hZ2VNZXRhIiwicmVzdWx0cyIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJyZXNpemVBY3Rpb24iLCJCb29sZWFuIiwiaW1hZ2VUb1Jlc2l6ZSIsImNsb25lIiwicmVzaXplZCIsInJlc2l6ZUhlaWdodCIsInJlc2l6ZVdpZHRoIiwicmVzaXplQXNwZWN0UmF0aW8iLCJwcmlvcml0aXplSGVpZ2h0IiwicmVzaXplIiwibWV0YWRhdGFBcHBlbmRlZEZpbGUiLCJvcHRpb25hbGx5QXBwZW5kTWV0YWRhdGEiLCJzaGFycEZpbGUiLCJpbmZvIiwidG9CdWZmZXIiLCJyZXNvbHZlV2l0aE9iamVjdCIsImhhbGZSZXNpemVYIiwieEZvY2FsQ2VudGVyIiwiY2FsY3VsYXRlZFJpZ2h0UGl4ZWxCb3VuZCIsImxlZnRCb3VuZCIsImhhbGZSZXNpemVZIiwieUZvY2FsQ2VudGVyIiwiY2FsY3VsYXRlZEJvdHRvbVBpeGVsQm91bmQiLCJ0b3BCb3VuZCIsImV4dHJhY3QiLCJsZWZ0IiwiZmxvb3IiLCJ0b3AiLCJmb3JtYXRPcHRpb25zIiwidG9Gb3JtYXQiLCJmb3JtYXQiLCJvcHRpb25zIiwidHJpbU9wdGlvbnMiLCJ0cmltIiwiYnVmZmVyRGF0YSIsImJ1ZmZlckluZm8iLCJzYW5pdGl6ZWRJbWFnZSIsInBheWxvYWRVcGxvYWRTaXplcyIsIm1pbWVJbmZvIiwiZnJvbUJ1ZmZlciIsImltYWdlTmFtZVdpdGhEaW1lbnNpb25zIiwiZ2VuZXJhdGVJbWFnZU5hbWUiLCJvcmlnaW5hbE5hbWUiLCJzaXplTmFtZSIsImltYWdlUGF0aCIsImZpbGVFeGlzdHMiLCJmcyIsInVubGlua1N5bmMiLCJzaXplIiwibWltZSIsImJ1ZmZlciIsInBhdGgiLCJyZWR1Y2UiLCJhY2MiLCJyZXN1bHQiLCJPYmplY3QiLCJhc3NpZ24iLCJwdXNoIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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