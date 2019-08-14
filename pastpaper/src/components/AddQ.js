import React, { Component } from 'react';
import './AddQ.css'

class AddQ extends Component {
  constructor(props){
    super(props);
    this.state = {

      Subject: null,
      Year: '',
      Zone:  '',
      Paper: '',

      Topic: '',
      Subtopic: '',
      Difficulty: '',

      selectedFile: '',
      selectText: 'Upload Question Image',

      Answer: null,
      Description:'',
    }
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  fileSelectedHandler = event =>{
    let p1= new Promise((resolve, reject) =>{
      this.setState({
        selectedFile: event.target.files[0],
        selectText: event.target.files[0].name
      })
      let x=0
      resolve(x)
      
    })
    p1.then(x=>{
      console.log(this.state.selectedFile)
    })
  }

  changeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(event.target.name,event.target.value)
  }

  submitHandler = event =>{
    event.preventDefault();
    fetch('upload-question', {
      method: 'POST',
      body: JSON.stringify({Subject: this.state.Subject, Year: this.state.Year, Zone: this.state.Zone, Paper: this.state.Paper, Topic: this.state.Topic, Subtopic: this.state.Subtopic, Difficulty: this.state.Difficulty, Question: this.state.selectedFile, Answer: this.state.Answer, Description: this.state.Description}),
      headers: {
        "Content-Type": "application/json"
      }
    })

    this.setState({
      Topic: '',
      Subtopic: '',
      Difficulty: '',
      Answer: '',
      Description: '',
      selectedFile: '',
      selectText: 'Upload Question Image'
    })
  }
  
  render() {
    return (
      <div className="main_container">
        <h1 className="title"> ADD A QUESTION </h1>
        <div className="form-style">
          <form onSubmit={this.submitHandler}>
            <fieldset>
              <legend>
                <span className="number">1</span> 
                General Info
              </legend>
              
              <label htmlFor="job">Subject:</label>
              <select defaultValue= "None" id="job" name="Subject" onChange={this.changeHandler} required>
                  <option value="None">-------</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Additional Mathematics">Additional Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Pakistan Studies">Pakistan Studies</option>
                  <option value="Islamic Studies;">Islamic Studies</option>
                  <option value="Other">Other</option>
              </select>

              <input type="number" name="Year" placeholder="Year" value={this.state.Year} onChange={this.changeHandler} required/>
              <input type="number" name="Zone" placeholder="Zone" value={this.state.Zone} onChange={this.changeHandler} required/>
              <input type="number" name="Paper" placeholder="Paper" value={this.state.Paper} onChange={this.changeHandler} required/>   
            </fieldset>

            <fieldset>
              <legend>
                <span className="number">2</span> 
                Question Info
              </legend>

              <input type="text" name="Topic" placeholder="Topic" value={this.state.Topic} onChange={this.changeHandler} required />
              <input type="text" name="Subtopic" placeholder="Subtopic" value={this.state.Subtopic} onChange={this.changeHandler}required/>
              <input type="number" name="Difficulty" placeholder="Difficulty" value={this.state.Difficulty} onChange={this.changeHandler} required/>
              
              <div className="upload-btn-wrapper">
                <button className="btn">{this.state.selectText}</button>
                <input type="file" onChange={this.fileSelectedHandler} placeholder="sada" required/>
              </div>

              <label htmlFor="job">Answer</label>
              <select defaultValue="None" id="job" name="Answer" onChange={this.changeHandler} required>
                <optgroup>
                  <option value="None">-------</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </optgroup>
              </select>
              <textarea name="Description" placeholder="Description/Hints" value={this.state.Description} onChange={this.changeHandler}></textarea>
           
            </fieldset>
            <input type="submit" value="Save Question" />
          </form>
        </div>    
      </div>
    );
  }
}
export default AddQ;