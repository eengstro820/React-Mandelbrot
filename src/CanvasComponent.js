import React from 'react'
import * as HistogramRenderer from './histogramRenderer.js'
import * as Mandelbrot from './mandelbrotCalculator'

/**
 * A simple class that exposes the <canvas> as a React component. See
 * https://stackoverflow.com/questions/30296341/rendering-returning-html5-canvas-in-reactjs
 */
export default class CanvasComponent extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.clearAndDraw()
    }

    componentDidUpdate(prevProps, prevState) {
        this.clearAndDraw()
    }

    clearAndDraw() {
        if (this.props.renderStarted) {
            this.props.renderStarted()
        }

        const context = this.canvas.getContext('2d');
        if (context) {
            this.draw(context);
        }

        if (this.props.renderEnded) {
            this.props.renderEnded()
        }
    }

    draw(context) {
        let imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        imageData = HistogramRenderer.render(imageData, Mandelbrot.escapeTimeTest,
            Mandelbrot.maxIterations, this.props.centerc, this.props.widthc)
        context.putImageData(imageData, 0, 0)
    }

    render() {
        return (
            <div>
                <canvas ref={canvas => this.canvas = canvas} className={this.props.className}
                    width={this.props.width} height={this.props.height}
                    onClick={this.props.onClick} />
            </div>
        );
    }
}