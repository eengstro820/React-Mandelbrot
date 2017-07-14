import React from 'react'
import * as HistogramRenderer from './histogramRenderer.js'
import * as Mandelbrot from './mandelbrotCalculator'
import ElapsedTimeComponent from './ElapsedTimeComponent'

/**
 * A simple class that exposes the <canvas> as a React component. See
 * https://stackoverflow.com/questions/30296341/rendering-returning-html5-canvas-in-reactjs
 */
export default class CanvasComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: 0
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // only redraw if the props have changed
        if (this.props !== prevProps) {
            this.clearAndDraw()
        }
    }

    clearAndDraw() {
        this.setState({
            start: Date.now(),
        })

        const context = this.canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw(context);
        }

        this.setState({
            end: Date.now()
        })
    }

    draw(context) {
        let imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        imageData = HistogramRenderer.render(imageData, Mandelbrot.escapeTimeTest,
            Mandelbrot.maxIterations, this.props.centerc, this.props.widthc)
        context.putImageData(imageData, 0, 0)
    }

    render() {
        let timeElapsedStyle = {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            padding: '5px',
            position: 'absolute',
            right: '25px',
            bottom: '0px',
            fontSize: '9px'
        }

        return (
            <div>
                <canvas ref={canvas => this.canvas = canvas} className={this.props.className}
                    width={this.props.width} height={this.props.height}
                    onClick={this.props.onClick} />
                <ElapsedTimeComponent style={timeElapsedStyle} 
                    start={this.state.start}
                    end={this.state.end}
                    default="Stand by..." />
            </div>
        );
    }
}