import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';
import ClusterLaba from './ClusterLaba';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <div>
        <ClusterLaba />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
