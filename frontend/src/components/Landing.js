import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import '../App.css'
import logo from '../logo.svg';
import './Landing.css'
import Landing_1 from '../backdrops/Landing_1.jpg'
import Landing_2 from '../backdrops/Landing_2.jpg'
import Why1 from '../backdrops/why1.png'
import Why2 from '../backdrops/why2.png'
import Why3 from '../backdrops/why3.png'
import Why4 from '../backdrops/why4.png'

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
        
        <div className= "backdrop-landing-2">
          <img className= "backdrop-image" src = {Landing_2}/>
          <div className = "textbox2">
            <span className = "heading-text"> 
              Why EdWise? 
            </span>
          </div>
          <div className = "textbox3">
            <span className = "para-text">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
            </span>
          </div>

          <div className="row">
            <div className = "empty-column"/>

            <div className="column">
              <img className = "icon" src={Why1} alt="" />
              <span className= "why-text"> Learn Faster </span>
            </div>
            <div className="column">
              <img className = "icon"  src={Why2} alt="" />
              <span className= "why-text"> Get Better Grades </span>
            </div>
            <div className="column">
              <img className = "icon"  src={Why3} alt="" />
              <span className= "why-text"> Get Feedback </span>
            </div>
            <div className="column">
              <img className = "icon"  src={Why4} alt="" />
              <span className= "why-text"> Study Anywhere </span>
            </div>

            <div className = "empty-column"/>
          </div>

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