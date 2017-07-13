import React from 'react'
import * as HistogramRenderer from './histogramRenderer.js'
import * as Mandelbrot from './mandelbrotCalculator'

/**
 * A simple class that exposes the <canvas> as a React component. See
 * https://stackoverflow.com/questions/30296341/rendering-returning-html5-canvas-in-reactjs
 */
export default class CanvasComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    

    componentDidUpdate(prevProps, prevState) {
        // TODO Only redraw if the props have changed
        //if (this.props.secondRect !== prevProps.secondRect) {
            this.clearAndDraw()
        //}
    }

    clearAndDraw() {
        const context = this.canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw(context);
        }
    }

    draw(context) {
        let imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        imageData = HistogramRenderer.render(imageData, Mandelbrot.escapeTimeTest,
            Mandelbrot.maxIterations, this.props.centerc, this.props.widthc)
        context.putImageData(imageData, 0, 0)

        console.log("CanvasComponent.draw() returning.")
    }

    render() {
        return (
            <canvas ref={canvas => this.canvas = canvas} className={this.props.className}
                width={this.props.width} height={this.props.height} />
        );
    }
}