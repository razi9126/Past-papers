import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import '../App.css'
import logo from '../logo.svg';
import './Landing.css'
import Landing_1 from '../backdrops/Landing_1.jpg'

class Landing extends React.Component {
  render() {
    return (
       <div className="landing">
        <div className = "backdrop-landing">
          <img className = "backdrop-image" src = {Landing_1}/>
          <div className = "textbox1">
            <span className="heading-text">All your exam preparation material in one place</span>
          </div>
          <button className = "button-landing"> Get Started </button>
        </div>
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