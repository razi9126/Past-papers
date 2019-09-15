import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import '../App.css'
import logo from '../logo.svg';
import './Landing.css'
import background from './blue_bg.jpg'

class Landing extends React.Component {
  render() {
    return (
       <div className="landing">
        <div className = "backdrop-landing">
          <img className = "backdrop-image" src = {background} />
          <div className = "backdrop-image-text"> BACKDROP ONE</div> 
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