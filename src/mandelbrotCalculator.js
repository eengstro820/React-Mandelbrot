const bailout = 2
export const maxIterations = 1000

export const minCX = -2.5
export const maxCX = 1
export const minCYI = -1
export const maxCYI = 1

/**
 * Using the Escape Time Algorithm, return 0 if the given point C, expressed as its real (cx) and 
 * imaginary (cyi) parts, is within the mandelbrot set (i.e., it does not escape to inf), or the 
 * number of iterations until the given location escapes the bailout value.
 * @param {number} cx - the real part of C, expressed as an X coordinate within [minCX, maxCX]
 * @param {number} cyi - the imaginary part of C, expressed as a Y corrdinate within [minCYI, maxCYI]
 * @return iterations until escape, or 0 if C does not escape.
 */
export function escapeTimeTest(cx, cyi) {
    let iteration = 0
    let x = 0
    let y = 0
    while ((x * x + y * y < bailout * bailout) && (iteration < maxIterations)) {
        let xtemp = cx + x * x - y * y
        y = cyi + 2 * x * y
        x = xtemp
        ++iteration
    }

    return iteration === maxIterations ? 0 : iteration
}