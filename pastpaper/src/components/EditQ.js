import React, { Component } from 'react';
import './EditQ.css'
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { Modal, Button, Card } from 'react-bootstrap';


class DelQ extends Component {
  constructor(props){
    super(props);
    this.state = {
      Subject: null,
      Year: '',
      Zone:  '',
      Paper: '',
      Form: true,
      Questions:[],
      showModal:false,
    }

    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalShows = this.handleModalShow.bind(this);
  }
  
  changeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(event.target.name,event.target.value)
  }

  submitHandler = event =>{
    event.preventDefault();
    const { Subject, Year, Zone, Paper } = this.state;  
    // fetch('/find-questions', {
    //       method: 'POST',
    //       body: JSON.stringify({subject: Subject, year: Year, zone: Zone, paper: Paper}),
    //       headers: {
    //         "Content-Type": "application/json",
    //       }
    // }).then((result) =>{
    //     result.json().then(body=>{
    //       console.log(body)
    //       this.setState({
    //         Questions: body,
    //         Subject: null,
    //         Year: '',
    //         Zone: '',
    //         Paper: '',
    //         Form: false
    //       })
    //     })
    //   })  

    this.setState({Form: false})    
  }

  changeFilter = event =>{
    event.preventDefault();
    this.setState({Form:true})
  }

  handleDelete(e, question){
    confirmAlert({
      title: 'Delete Question',
      message: 'Are you sure you want to delete this question?',
      buttons: [
        { 
          label: 'Proceed',
          onClick: ()=>{this.deleteQuestion(e, question)}
        },
        {
          label: 'Cancel',
        }
      ]
    })
  }

  deleteQuestion(e,question){
    e.preventDefault();
    console.log(question)
    let p1 = new Promise((resolve, reject)=>{
    let filtered = this.state.Questions.filter(ques => ques["id"]!== question.id)
        resolve(filtered)
    })
    p1.then(filtered => {
      this.setState({Questions: filtered})
    })
    
    fetch('/delete-question', {
          method: 'POST',
          body: JSON.stringify({question_id: question.id}),
          headers: {
            "Content-Type": "application/json",
          }
    }).then((result) =>{         
        console.log(result)
      })      

  }

  handleModalClose() {
      this.setState({ showModal: false });
  }

  handleModalShow() {
     this.setState({ showModal: true });

  }

  render() {
    const editModal = (
      <Modal show={this.state.showModal} animation='true' onHide={this.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Put Form here</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal>

    )


    const form= ( 
    <div>       
      <div className="main_container"> 
        <h1 className="title"> SEARCH FOR QUESTIONS </h1>    
        <div className="form-style1">
          <form onSubmit={this.submitHandler}>
            <fieldset>
              <legend>
                <span className="number">1</span> 
                Question Details
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

            <input type="submit" value="Show Results" />
          </form>
        </div>
      </div> 
        <Button variant = "danger" onClick={() =>{this.handleModalShow()}}> modal </Button>
    </div> 
    )


    const qlist = this.state.Questions.map((question,i)=>
        <tr>
          <td>{question.subject}</td>
          <td>{question.year}</td>
          <td>{question.zone}</td>
          <td>{question.paper}</td>
          <td>{question.difficulty}</td>
          <td>{question.description}</td>
          <td>{question.question_link}</td>
          <td>{question.answer_link}</td>
          <td>{question.answer}</td>
          <td>{question.tags}</td>
          <td className='select'>
            <button className='button' onClick = {()=>{this.handleModalShow()}}>
              Edit
            </button>
          </td>
          <td className='select'>
            <button className='button' onClick = {(e)=>{this.handleDelete(e,question)}}>
              Delete
            </button>
          </td>
        </tr>  
    )

    const cards = (
      <div>
        <div className="main_container">
          <h1 className="title"> SEARCH RESULTS </h1>    
        </div>
        <button className="filter" onClick={this.changeFilter}><i className="fa fa-search"></i> Change Filter</button>
            
        <div className="main_container">
          <Card>
            <Card.Img className = "card-img-top" variant="top" src="https://i.ytimg.com/vi/tSWCs1TuEZI/maxresdefault.jpg" />
            <Card.ImgOverlay>
              <Card.Title>QUESTION</Card.Title>
            </Card.ImgOverlay>
            <Card.Body>
              <Card.Text>
                Subject:<br/> 
                Year:  <br/>
                Paper: <br/>
                Zone:  <br/>
              </Card.Text>
            </Card.Body>
          </Card>
          <br />
        </div>
      </div>
    )

    return (
      <div>
        {this.state.Form? form:cards}
        {this.state.showModal? editModal:null}
      </div>

/*
      <div className="main_container">
        <h1 className="title"> DELETE A QUESTION </h1>
      </div>
*/
    );
  }
}
export default DelQ;