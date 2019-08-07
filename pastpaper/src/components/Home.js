import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import '../App.css';
import logo from '../logo.svg';


class Home extends Component {
  render() {
    return (

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <a
            className="App-link"
            href="\Upload"
            rel="noopener noreferrer"
          >
            Upload Questions
          </a>
        </header>
      </div>

    );
  }
}
export default Home;
