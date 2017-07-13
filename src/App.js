import React, { Component } from 'react';
import './App.css';
import CanvasComponent from './CanvasComponent'

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

  render() {
    return (
      <CanvasComponent className="TheCanvas" 
        width={this.state.width} 
        height={this.state.height}
        centerc={this.state.centerc}
        widthc={this.state.widthc} />
    );
  }
}

export default App;
