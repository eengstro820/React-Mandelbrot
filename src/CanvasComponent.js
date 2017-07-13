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
        const context = this.canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw(context);
        }
    }

    draw(context) {
        let imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        imageData = HistogramRenderer.render(imageData, Mandelbrot.escapeTimeTest,
            Mandelbrot.maxIterations)
        context.putImageData(imageData, 0, 0)
    }

    render() {
        return (
            <canvas ref={canvas => this.canvas = canvas} className={this.props.className} />
        );
    }
}