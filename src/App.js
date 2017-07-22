import React, { Component } from 'react';
import './App.css';
import CanvasComponent from './CanvasComponent'
import ElapsedTimeComponent from './ElapsedTimeComponent'
import * as RenderUtil from './renderUtil'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // dimensions of the window in pixels
      width: window.innerWidth,
      height: window.innerHeight,
      // center of rendering in cx, cy
      centerc: { x: -0.75, y: 0.0 },
      // width of rendering in c
      widthc: 3.5,
      // render start and end times
      renderStart: 0,
      renderEnd: 0 
    }

    // callbacks need a bind(this) to give them context when they are called
    this.updateDimensions = this.updateDimensions.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.renderStartedEventHandler = this.renderStartedEventHandler.bind(this)
    this.renderEndedEventHandler = this.renderEndedEventHandler.bind(this)
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  renderStartedEventHandler() {
    this.setState({
      renderStart: Date.now()
    })
  }

  renderEndedEventHandler() {
    this.setState({
      renderEnd: Date.now()
    })
  }

  handleClick(event) {
    let cx = RenderUtil.normalizeX(event.clientX, this.state.width, this.state.centerc.x, 
      this.state.widthc)
    let cy = RenderUtil.normalizeY(event.clientY, this.state.height, this.state.centerc.y,
      RenderUtil.calculateHeightC(this.state.widthc, this.state.width, this.state.height))
    this.setState({
      widthc: event.shiftKey ? this.state.widthc * 1.5 : this.state.widthc / 1.5,
      centerc: { 
        x: cx,
        y: cy
      }
    })
  }

  render() {
    let footerStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      color: 'white',
      padding: '5px',
      position: 'absolute',
      bottom: '0px',
      fontSize: '9px'
    }
    let aboutStyle = {
      ...footerStyle,
      left: '25px'
    }
    let timeElapsedStyle = {
      ...footerStyle,
      right: '25px'
    }
    
    return (
      <div id="container">
        <CanvasComponent className="TheCanvas" 
          width={this.state.width}
          height={this.state.height}
          centerc={this.state.centerc}
          widthc={this.state.widthc}
          onClick={this.handleClick}
          renderStarted={this.renderStartedEventHandler}
          renderEnded={this.renderEndedEventHandler} />

        <p style={aboutStyle}>
          By Eric Engstrom. Click to zoom, shift-click to zoom out. <a 
            href="https://github.com/eengstro820/React-Mandelbrot" 
            target="_blank" rel="noopener noreferrer">Source code.</a>
        </p>

        <ElapsedTimeComponent style={timeElapsedStyle} 
          start={this.state.renderStart}
          end={this.state.renderEnd}
          default="Stand by..." />
      </div>
    );
  }
}

export default App;
