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
 * @param {number} cyi - the imaginary part of C, expressed as a Y coordinate within [minCYI, maxCYI]
 * @return iterations until escape, or 0 if C does not escape.
 */
export function escapeTimeTest(cx, cyi) {
    // Easy tests for early bailout. These give a modest performance gain if the cartioid
    // or period 2 bulb occupy part of the view.
    if (inPeriod2Bulb(cx, cyi) || inCartioid(cx, cyi)) {
        return 0
    }

    let iteration = 0
    let x = 0
    let y = 0

    while ((x * x + y * y < bailout * bailout) && (iteration < maxIterations)) {
        let xtemp = cx + x * x - y * y
        let ytemp = cyi + 2 * x * y

        // Periodicity check: if we reach the same point again, C will not diverge; we can
        // bail out early. This gives a modest performance gain.
        if (x === xtemp && y === ytemp) {
            iteration = maxIterations
            break
        }

        x = xtemp
        y = ytemp
        ++iteration
    }

    return iteration === maxIterations ? 0 : iteration
}

/**
 * Test whether the given C is within the set's cartioid.
 * @param {number} cx 
 * @param {number} cyi
 * @return true if C is within the cartioid, false otherwise
 */
function inCartioid(cx, cyi) {
    let cyiSq = cyi * cyi
    let a = cx - 0.25
    let q = a * a + cyiSq
    return q * (q + a) < 0.25 * cyiSq
}

/**
 * Test whether the given C is within the set's period 2 bulb.
 * @param {number} cx 
 * @param {*} cyi 
 * @return true if C is within the period 2 bulb, false otherwise
 */
function inPeriod2Bulb(cx, cyi) {
    return (cx + 1) * (cx + 1) + cyi * cyi < 0.0625
}