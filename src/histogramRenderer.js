import * as RenderUtil from './renderUtil.js'

/**
 * @callback calculateFunction
 * @param {number} cx - the real part of C, expressed as an X
 * @param {number} cy - the imaginary part of C, expressed as a Y
 */

/**
 * Using the specified calculation function, render to the given imageData.
 * @param {object} imageData - an ImageData object to render to 
 * @param {calculateFunction} testerFunc - function that tests C
 * @param {number} maxIterations - the largest iteration value that testerFunc will return
 * @return {object} - modified imageData
 */
export function render(imageData, testerFunc, maxIterations) {
    // An escape histogram. Track the number of pixels in the image that escaped after 
    // [index] iterations. Index 0 represents pixels that lie within the set (i.e. did not
    // escape). 
    let histogram = []
    for (let i = 0; i <= maxIterations; ++i) {
        histogram.push(0)
    }

    // For each pixel, calculate the number of iterations required to escape the set.
    // Build up a 2D array as we go. Update the histogram.
    let iterPixels = []
    for (let x = 0; x < imageData.width; ++x) {
        iterPixels.push([])

        for (let y = 0; y < imageData.height; ++y) {
            let cx = RenderUtil.normalizeX(x, imageData.width)
            let cy = RenderUtil.normalizeY(y, imageData.height)
            let iterations = testerFunc(cx, cy)

            iterPixels[x].push(iterations)

            histogram[iterations]++
        }
    }

    // Build a new array, parallel to histogram, where each element is the sum of the 
    // histogram's elements from index 1 to the current index, inclusive. 
    // (Ignore histogram[0].) The very last element will contain the sum total of the 
    // entire histogram's contents.
    let runningTotalHistogram = [0]
    for (let i = 1; i <= maxIterations; ++i) {
        runningTotalHistogram.push(runningTotalHistogram[i - 1] + histogram[i])
    }

    // Walk each pixel from left to right, top to bottom. Write the color for each pixel to
    // the imageData object.
    let data = imageData.data
    let dataIdx = 0
    for (let y = 0; y < imageData.height; ++y) {
        for (let x = 0; x < imageData.width; ++x) {
            let inSet = iterPixels[x][y] === 0

            // Color will be based on how far through the iterations histogram
            // the given pixel appears.
            let iterations = iterPixels[x][y]
            let percentage = runningTotalHistogram[iterations] / 
                runningTotalHistogram[maxIterations]
            let color = inSet ? {r: 0, g: 0, b: 0} : getColor(percentage)

            data[dataIdx] = color.r     // red
            data[dataIdx + 1] = color.g // green
            data[dataIdx + 2] = color.b // blue
            data[dataIdx + 3] = 255     // alpha

            dataIdx += 4
        }
    }

    return imageData
}

let colorTable = [
    {r: 0, g: 0, b: 0, percent: 0},
    {r: 20, g: 20, b: 128, percent: 0.5},
    {r: 200, g: 0, b: 0, percent: 0.8},
    {r: 200, g: 50, b: 200, percent: 0.9},
    {r: 50, g: 200, b: 50, percent: 0.95},
    {r: 255, g: 255, b: 255, percent: 1}
]

/**
 * The color table is an array of objects with the fields {r, g, b, percent}.
 * r, g, b - channels, integers in the range [0, 255]
 * percent: float value, [0.0, 1.0].
 * Index should be sorted by percent, ascending.
 * @param {array} newColorTable 
 */
export function setColorTable(newColorTable) {
    colorTable = newColorTable
}

/**
 * Given a pixel's percentage through the iterations histogram, calculate a color.
 * @param {number} percentage
 * @return {object} A color object as {r, g, b}, each channel [0, 255]
 */
function getColor(percentage) {
    // shortcut if we won't enter the lookup loop
    if (percentage <= colorTable[0].percent) {
        return colorTable[0]
    }

    // look for the two rows that surround the provided percentage, then ask for
    // a linear interpolation between the two.
    for (let i = 0; i < colorTable.length - 1; ++i) {
        if (colorTable[i].percent < percentage && colorTable[i + 1].percent > percentage) {
            let interpolationPercentage = 
                (percentage - colorTable[i].percent) / 
                (colorTable[i + 1].percent - colorTable[i].percent)
            console.assert(0 <= interpolationPercentage && interpolationPercentage <= 1, 
                interpolationPercentage)
            return interpolateColor(colorTable[i], colorTable[i + 1], interpolationPercentage)
        }
    }

    // we ran off the end of the color table
    return colorTable[colorTable.length - 1]
}

/**
 * Perform a linear interpolation between the two provided colors.
 * @param {object} color0 - {r, g, b}
 * @param {object} color1 - {r, g, b}
 * @param {number} percent - Range from [0, 1.0].
 * @return {object} A new color, {r, g, b}.
 */
function interpolateColor(color0, color1, percent) {
    let newColor = {
        r: Math.round(color0.r * (1 - percent) + color1.r * percent),
        g: Math.round(color0.g * (1 - percent) + color1.g * percent),
        b: Math.round(color0.b * (1 - percent) + color1.b * percent)
    }

    return newColor
}
