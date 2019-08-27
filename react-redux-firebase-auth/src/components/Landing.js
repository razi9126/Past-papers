import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import '../App.css'
import logo from '../logo.svg';


class Landing extends React.Component {
  render() {
    return (
       <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" /><br/>
            <h1> YOU ARE AT THE LANDING PAGE </h1>
        </header>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  };
}

export default withRouter(connect(mapStateToProps)(Landing));