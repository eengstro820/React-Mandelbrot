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
            this.draw(ctx);
        }
    }

    draw(ctx) {
        // First attempt at paintint the mandelbrot set!
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

        // get the pixel data from the canvas
        let context = this.canvas.getContext('2d')
        let imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height)
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

            // set pixel color: black if in the set, white otherwise
            data[i] = inSet ? 0 : 255       // red
            data[i + 1] = inSet ? 0 : 255   // green
            data[i + 2] = inSet ? 0 : 255   // blue
            data[i + 3] = 255               // alpha
        }

        // put the pixel data back on the canvas
        context.putImageData(imageData, 0, 0)
    }

    render() {
        return (
            <canvas ref={canvas => this.canvas = canvas} className={this.props.className} />
        );
    }
}