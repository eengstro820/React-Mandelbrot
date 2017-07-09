import React, { Component } from 'react';
import './App.css';
import CanvasComponent from './CanvasComponent'

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <CanvasComponent className="TheCanvas" />
    );
  }
}

export default App;
