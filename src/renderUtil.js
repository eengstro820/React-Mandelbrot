/**
 * Convert a pixel location to CX.
 * @param {number} x - pixel location, X (increasing right)
 * @param {number} width - width of the view in pixels
 * @param {number} centercx - center of the rendered view in C, X
 * @param {number} widthc  - width of the rendered view in C
 * @return {number} corresponding CX (increasing right)
 */
export function normalizeX(x, width, centercx, widthc) {
    let leftc = centercx - widthc / 2.0
    let cx = leftc + x / (width - 1) * widthc
    return cx
}

/**
 * Convert a pixel location to CY.
 * @param {number} y - pixel location, Y (increasing down)
 * @param {number} height - height of the view in pixels
 * @param {number} centercy - center of the rendered view in C, Y
 * @param {number} heightc - height of the rendered view in C
 * @return {number} corresponding CY (increasing up)
 */
export function normalizeY(y, height, centercy, heightc) {
    let topc = centercy + heightc / 2.0
    let cy = topc - y / (height - 1) * heightc
    return cy
}

/**
 * Calculate the height in C, given the width in C and the dimensions in pixels.
 * @param {number} widthc - rendered view width in C
 * @param {number} width - width of the view in pixels
 * @param {number} height - height of the view in pixels
 * @return {number} rendered view height in C
 */
export function calculateHeightC(widthc, width, height) {
    let aspectRatio = width / height
    return widthc / aspectRatio
}