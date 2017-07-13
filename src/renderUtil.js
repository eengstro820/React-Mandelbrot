/**
 * Normalize the pixel X to lie within the bounds of the mandelbrot set.
 * FIXME: currently the bounds are hard-coded.
 * @param {number} x - pixel X, indexed from 0
 * @param {number} width - the width of the area in pixels
 */
export function normalizeX(x, width) {
    return x / (width - 1) * 3.5 - 2.5
}

/**
 * Normalize the pixel Y to lie within the bounds of the mandelbrot set.
 * FIXME: currently the bounds are hard-coded.
 * @param {number} y - pixel Y, indexed from 0
 * @param {number} height - the height of the area in pixels
 */
export function normalizeY(y, height) {
    return y / (height - 1) * 2 - 1
}