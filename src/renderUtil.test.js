'use strict'

import * as subject from './renderUtil'

describe('X normalization', () => {
    it('normalizes min X', () => {
        expect(subject.normalizeX(0, 10, 1, 5)).toBe(-1.5)
    })

    it('normalizes max X', () => {
        expect(subject.normalizeX(9, 10, 1, 5)).toBe(3.5)
    })
})

describe('Y normalization', () => {
    it('normalizes min Y', () => {
        expect(subject.normalizeY(0, 10, 1, 5)).toBe(3.5)
    })
    it('normalizes max Y', () => {
        expect(subject.normalizeY(9, 10, 1, 5)).toBe(-1.5)
    })
})
