'use strict'

import * as mandelbrot from './mandelbrotCalculator'
import * as subject from './textRenderer'

function mandelbrotMock(cx, cyi) {
    if (cx > -0.5 && cx < 0.5 && cyi > -0.5 && cyi < 0.5) {
        return 0
    }
    return 1
}

describe('textRenderer', () => {
    it('renders mock as expected', () => {
        const expected = '..........\n' +
                         '..........\n' +
                         '..........\n' +
                         '......xx..\n' +
                         '......xx..\n' +
                         '......xx..\n' +
                         '......xx..\n' +
                         '..........\n' +
                         '..........\n' +
                         '..........\n';
        expect(subject.generateOutput(10, 10, mandelbrotMock)).toEqual(expected)
    })

    // it('junk', () => {
    //     console.log(subject.generateOutput(100, 50, mandelbrot.escapeTimeTest))
    // })

    // it('elapsed time junk', () => {
    //     let startTime = Date.now()
    //     subject.generateOutput(1000, 1000, mandelbrot.escapeTimeTest)
    //     let endTime = Date.now()
    //     console.log(`Elapsed time was ${endTime - startTime} seconds.`)
    // })
})
