import React, { Component } from 'react';
import './AddQ.css'
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class AddQ extends Component {
  constructor(props){
    super(props);
    this.state = {
      Subject: null,
      Year: '',
      Session:  '',
      Paper: '',
      response:'',
      showModal:false,
      Session:'',
      questionFile: '',
      questionText: 'Upload Question Image',
      Answer: null,
      answerFile: '',
      answerText: 'Upload Answer Image',
      Difficulty: 1,
      Description:'',
      Syllabus:'',
    }
    this.questionselectedHandler = this.questionselectedHandler.bind(this);
    this.answerselectedHandler = this.answerselectedHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalShow = this.handleModalShow.bind(this);
  }

  questionselectedHandler = event =>{
    if(event.target.files.length!== 0){
      this.setState({
        questionFile: event.target.files[0],
        questionText: event.target.files[0].name
      })
    }
    else{
      this.setState({
        questionFile: '',
        questionText: 'Upload Question Image'
      })
    }      
  }

  answerselectedHandler = event =>{
    // console.log(event.target.files)
    if(event.target.files.length!== 0){
      this.setState({
        answerFile: event.target.files[0],
        answerText: event.target.files[0].name
      })
    }
    else{
      this.setState({
        answerFile: '',
        answerText: 'Upload Answer Image'
      })
    }      
  }

  handleModalClose() {
    this.setState({showModal: false})
  }

  handleModalShow() {
    this.setState({showModal: true})
  }


  changeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(event.target.name,event.target.value)
  }

  submitHandler = event =>{
    event.preventDefault();
    const { Subject, Session, Year, Paper, Difficulty, Answer, Description, questionFile, answerFile, Syllabus } = this.state;
    let formData= new FormData();
    formData.append('subject', Subject);
    formData.append('syllabus', Syllabus);
    formData.append('year', Year);
    formData.append('session', Session);
    formData.append('paper', Paper);
    formData.append('difficulty', Difficulty);
    formData.append('answertext', Answer);
    formData.append('description', Description);
    formData.append('question', questionFile);
    formData.append('answer', answerFile);

    axios.post('/upload-question', formData)
      .then((result) =>{
        console.log(result)
        this.setState({
          Difficulty: 1,
          Answer: '',
          Description: '',
          questionFile: '',
          questionText: 'Upload Question Image',
          answerFile: '',
          answerText: 'Upload Answer Image',
          response: result.data
        })
        this.handleModalShow()
      })
  }
  
  render() {
    // console.log(this.props.user)
    const editModal = (
      <Modal show={this.state.showModal} animation='true' onHide={this.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>{this.state.response} </h3>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleModalClose}>
            Add new
          </Button>
        </Modal.Footer>
      </Modal>
    )

    return (
      <div className="main_container">
      <br/><br/>
        <h1 className="title1"> ADD A QUESTION </h1>
        <div className="form-style1">
          <form onSubmit={this.submitHandler}>
            <fieldset>
              <legend>
                <span className="number">1</span> 
                General Info
              </legend>
              
              <label htmlFor="job">Syllabus:</label>
              <select defaultValue= "None" id="job" name="Syllabus" onChange={this.changeHandler} required>
                  <option value="None">-------</option>
                  <option value="O-levels">O-levels</option>
                  <option value="A-levels">A-levels</option>
                  <option value="IGCSE">IGCSE</option>
                  <option value="IBDP">IBDP</option>
              </select>

              <label htmlFor="job">Subject:</label>
              <select defaultValue= "None" id="job" name="Subject" onChange={this.changeHandler} required>
                  <option value="None">-------</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Additional Mathematics">Additional Mathematics</option>
                  
              </select>

              <input type="number" name="Year" placeholder="Year" value={this.state.Year} onChange={this.changeHandler} required/>
              <label htmlFor="job">Session:</label>
              <select defaultValue= "None" id="job" name="Session" onChange={this.changeHandler} required>
                  <option value="None">-------</option>                  
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
              </select>
              <input type="number" name="Paper" placeholder="Paper" value={this.state.Paper} onChange={this.changeHandler} required/>   
            </fieldset>

            <fieldset>
              <legend>
                <span className="number">2</span> 
                Question Info
              </legend>

              <div className="upload-btn1-wrapper">
                <button className="btn1">{this.state.questionText}</button>
                <input type="file" onChange={this.questionselectedHandler} placeholder="sada" required/>
              </div>

              <label htmlFor="job">Answer: (Please select either text or image but not both)</label>

              <select defaultValue="None" id="job" name="Answer" onChange={this.changeHandler}>
                <optgroup>
                  <option value="None">-------</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </optgroup>
              </select>
              
              <div className="upload-btn1-wrapper">
                <button className="btn1">{this.state.answerText}</button>
                <input type="file" onChange={this.answerselectedHandler} placeholder="sada"/>
              </div>
              <label htmlFor="job">Difficulty</label>
              <input type="number" name="Difficulty" placeholder="Difficulty" value={this.state.Difficulty} onChange={this.changeHandler} required/>
              <textarea name="Description" placeholder="Description/Hints" value={this.state.Description} onChange={this.changeHandler}></textarea>
           
            </fieldset>
            <input type="submit" value="Save Question" />
          </form>
        </div> 
        <div>{this.state.showModal? editModal:null}  </div> 
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  };
}
export default withRouter(connect(mapStateToProps)(AddQ));