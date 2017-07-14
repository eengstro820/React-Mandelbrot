import React, { Component } from 'react';
import './App.css';
import CanvasComponent from './CanvasComponent'
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
      widthc: 3.5
    }

    this.updateDimensions = this.updateDimensions.bind(this)
    this.handleClick = this.handleClick.bind(this)
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
    return (
      <div id="container">
         <CanvasComponent className="TheCanvas" 
          width={this.state.width}
          height={this.state.height}
          centerc={this.state.centerc}
          widthc={this.state.widthc}
          onClick={this.handleClick} /> 
      </div>
    );
  }
}

export default App;
