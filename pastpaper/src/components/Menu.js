import React, { Component } from 'react';
import './Menu.css'
import plus from './plus_cyan.png'
import minus from './minus_cyan.png'

class Upload extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className="main_container">
        
        <a href= "/AddQ">
          <div className="inner_container">
            <img className = "img" src= {plus} alt="" />
            <div className = "label">
              <p> Add a Question </p>
            </div>  
          </div>
        </a>
        
        <span> &nbsp;&nbsp;</span>
        
        <a href = "/EditQ">
          <div className="inner_container">
            <img className = "img" src= {minus} alt="" />
            <div className = "label">
              <p> Edit a Question </p>
            </div>  
          </div>
        </a>

      </div>
    );
  }
}
export default Upload;