'use strict'

import * as util from './renderUtil'

/**
 * @callback calculateFunction
 * @param {number} cx - the real part of C, expressed as an X within [-2.5, 1]
 * @param {number} cy - the imaginary part of C, expressed as a Y within [-1, 1]
 */

/**
 * 
 * @param {number} width - width of the area to render in characters
 * @param {number} height - height of the area to render in characters
 * @param {calculationFunction} testerFunc - function that tests C
 * @return {string} - an ASCII visualization
 */
export function generateOutput(width, height, testerFunc) {
    let str = ''
    for (let y = 0; y < height; ++y) {
        let rowStr = ''
        for (let x = 0; x < width; ++x) {
            let result = testerFunc(util.normalizeX(x, width, -0.75, 3.5), 
                util.normalizeY(y, height, 0, 2))
            rowStr += result === 0 ? 'x' : '.'
        }
        str += rowStr + '\n'
    }

    return str
}

