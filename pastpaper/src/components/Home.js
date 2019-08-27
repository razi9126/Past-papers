import React, { Component } from 'react';
import '../App.css';
import logo from '../logo.svg';


class Home extends Component {
  render() {
    return (

      <div className="App">
        <header className="App-header">
          <a
            className="App-link"
            href="/Menu"
            rel="noopener noreferrer"
          >
            <img src={logo} className="App-logo" alt="logo" /><br/>
            Go to Menu
          </a>
        </header>
      </div>

    );
  }
}
export default Home;
