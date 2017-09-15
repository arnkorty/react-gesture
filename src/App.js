import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Gesture from './Gesture';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className="magic-content">
          <Gesture height='300px' width='400px'> 可以使用鼠标旋转、拖拉 </Gesture>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default App;
