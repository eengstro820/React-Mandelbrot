'use strict'

import React from 'react'
import * as Mandelbrot from './mandelbrotCalculator'
import * as RenderUtil from './renderUtil.js'

/**
 * A simple class that exposes the <canvas> as a React component. See
 * https://stackoverflow.com/questions/30296341/rendering-returning-html5-canvas-in-reactjs
 */
export default class CanvasComponent extends React.Component {
    constructor(props) {
        super(props);

        this._resizeHandler = () => {
            /* Allows CSS to determine size of canvas */
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;

            this.clearAndDraw();
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this._resizeHandler);

        /* Allows CSS to determine size of canvas */
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.clearAndDraw();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resizeHandler);
    }

    componentDidUpdate(prevProps, prevState) {
        // TODO Only redraw if the props have changed
        //if (this.props.secondRect !== prevProps.secondRect) {
            this.clearAndDraw();
        //}
    }

    clearAndDraw() {
        const ctx = this.canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw2(ctx);
        }
    }

    draw(ctx) {
        // First attempt at painting the mandelbrot set!
        // TODO: the CanvasComponent, being a view (perhaps it should be renamed?),
        // is not the correct place to do all of this. Refactor out into a View Model later,
        // so it can be unit tested, swapped out, etc.

        // Given the index into an imageSet.data, and the width of the imageSet,
        // return the X, Y of the pixel as {x, y}.
        function getPixelXY(i, imageWidth) {
            let pixelIdx = Math.floor(i / 4)
            let x = pixelIdx % imageWidth
            let y = Math.floor(pixelIdx / imageWidth)
            return {
                x: x, 
                y: y
            }
        }

        // For a pixel that escaped with the specified number of iterations, return a color
        // in the form {r, g, b}, where each color ranges from 0 to 255, inclusive.
        // TODO: factor out to a separate module.
        function getColor(iterations, maxIterations) {
            // simple!
            let gray = iterations / maxIterations * 255
            return {
                r: gray,
                g: gray,
                b: gray
            }
        }

        // get the pixel data from the canvas
        //let context = this.canvas.getContext('2d')
        let imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        let data = imageData.data

        // paint over the existing image data
        for (let i = 0; i < data.length; i += 4) {
            // get the pixel coordinates for the current imageData index
            let coords = getPixelXY(i, imageData.width)
            let normalX = RenderUtil.normalizeX(coords.x, imageData.width)
            let normalY = RenderUtil.normalizeY(coords.y, imageData.height)
            
            // test if the current pixel is in the mandelbrot set
            let escapeIters = Mandelbrot.escapeTimeTest(normalX, normalY)
            let inSet = escapeIters === 0

            // set pixel color: black if in the set, colored otherwise
            let color = getColor(escapeIters, Mandelbrot.maxIterations)
            data[i] = inSet ? 0 : color.r       // red
            data[i + 1] = inSet ? 0 : color.g   // green
            data[i + 2] = inSet ? 0 : color.b   // blue
            data[i + 3] = 255                   // alpha
        }

        // put the pixel data back on the canvas
        ctx.putImageData(imageData, 0, 0)
    }

    draw2(ctx) {
        let imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

        // Initialize a histogram, which will track iterations needed to escape.
        // Note that index 0 represents points within the set.
        let histogram = []
        for (let i = 0; i <= Mandelbrot.maxIterations; ++i) {
            histogram.push(0)
        }

        // For each pixel, calculate the number of iterations required to escape the set.
        // Build up a 2D array as we go. Update the histogram.
        let iterPixels = []
        for (let x = 0; x < imageData.width; ++x) {
            iterPixels.push([])

            for (let y = 0; y < imageData.height; ++y) {
                let normalX = RenderUtil.normalizeX(x, imageData.width)
                let normalY = RenderUtil.normalizeY(y, imageData.height)
                let iterations = Mandelbrot.escapeTimeTest(normalX, normalY)

                iterPixels[x].push(iterations)

                histogram[iterations]++
            }
        }

        // Build a new array, parallel to histogram, where each element is the sum of the 
        // histogram's elements from index 1 to the current index, inclusive. 
        // (Ignore histogram[0].) The very last element will contain the sum total of the 
        // entire histogram's contents.
        let runningTotalHistogram = [0]
        for (let i = 1; i <= Mandelbrot.maxIterations; ++i) {
            runningTotalHistogram.push(runningTotalHistogram[i - 1] + histogram[i])
        }

        // Based on the histograms, calculate a color for the specified pixel, and return it
        // as {r, g, b}.
        // TODO: factor out into a separate module
        function getColor(x, y) {
            let iterations = iterPixels[x][y]
            let percentage = runningTotalHistogram[iterations] / 
                runningTotalHistogram[Mandelbrot.maxIterations]
            
            let r = percentage * 255
            let g = percentage * 255
            let b = percentage * 255

            return {
                r: r,
                g: g,
                b: b
            }
        }

        // Walk each pixel from left to right, top to bottom. Write the color for each pixel to
        // the imageData object.
        let data = imageData.data
        let dataIdx = 0
        for (let y = 0; y < imageData.height; ++y) {
            for (let x = 0; x < imageData.width; ++x) {
                let inSet = iterPixels[x][y] === 0
                let color = getColor(x, y)

                data[dataIdx] = inSet ? 0 : color.r     // red
                data[dataIdx + 1] = inSet ? 0 : color.g // green
                data[dataIdx + 2] = inSet ? 0 : color.b // blue
                data[dataIdx + 3] = 255                 // alpha

                dataIdx += 4
            }
        }

        ctx.putImageData(imageData, 0, 0)
    }

    render() {
        return (
            <canvas ref={canvas => this.canvas = canvas} className={this.props.className} />
        );
    }
}