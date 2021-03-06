import React, { Component } from 'react';
import './EditQ.css'
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { Modal, Button, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class EditQ extends Component {
  constructor(props){
    super(props);
    this.state = {
      Subject: null,
      Syllabus: '',
      Year: '',
      Session:  '',
      Paper: '',
      Form: true,
      Questions:[],
      showModal:false,
      selectedQid: '',
      selectedQSubject: '',
      selectedQYear: '',
      selectedQZone: '',
      selectedQPaper: '',
      selectedQDifficulty: '',
      selectedQDescription: '',
      selectedQAnswer: '',
      permission:false,
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
  }

  componentDidMount(){
    if(this.props.user!=null){
      console.log(this.props)
        if (this.props.usertype==="admin" || this.props.usertype==="teacher"){
          this.setState({permission: true})
        }
      }
  }
  editChangeHandler = event => {
    this.setState({
      ["selectedQ"+event.target.name] : event.target.value
    })
    console.log(event.target.name,event.target.value)
  }

  submitHandler = event =>{
    event.preventDefault();
    const { Syllabus, Subject, Year, Session, Paper } = this.state;  
    fetch('/find-questions', {
          method: 'POST',
          body: JSON.stringify({syllabus:Syllabus, subject: Subject, year: Year, session: Session, paper: Paper}),
          headers: {
            "Content-Type": "application/json",
          }
    }).then((result) =>{
        result.json().then(body=>{
          console.log(body)
          this.setState({
            Questions: body,
            Subject: null,
            Syllabus: '',
            Year: '',
            Session: '',
            Paper: '',
            Form: false,
            selectedQid: '',
            selectedQSubject: '',
            selectedQYear: '',
            selectedQZone: '',
            selectedQPaper: '',
            selectedQDifficulty: '',
            selectedQDescription: '',
            selectedQAnswer: '',
          })
        })
      })  

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
          body: JSON.stringify({question_id: question.id, question_link: question.question_link, answer_link: question.answer_link}),
          headers: {
            "Content-Type": "application/json",
          }
    }).then((result) =>{         
        console.log(result)
      })      

  }

  handleModalClose() {
      this.setState({ 
        showModal: false, 
        selectedQid: '',
        selectedQSubject: '',
        selectedQSyllabus: '',
        selectedQYear:'',
        selectedQSession:'',
        selectedQPaper:'',
        selectedQDifficulty:'',
        selectedQDescription:'',
        selectedQAnswer:'',
      });
  }

  handleModalShow(question) {
    let p1 = new Promise((resolve, reject)=>{
      this.setState({
        selectedQid: question.id,
        selectedQSyllabus: question.syllabus,
        selectedQSubject: question.subject,
        selectedQYear:question.year,
        selectedQSession:question.session,
        selectedQPaper:question.paper,
        selectedQDifficulty:question.difficulty,
        selectedQDescription:question.description,
        selectedQAnswer:question.answer,
      })
      resolve()
    })
    p1.then(()=>{
      this.setState({showModal: true})
    })
  }

  editSubmitHandler = event =>{
    event.preventDefault()
    fetch('/edit-question', {
      method: 'POST',
      body: JSON.stringify({id:this.state.selectedQid ,subject: this.state.selectedQSubject,syllabus: this.state.selectedQSyllabus, year: this.state.selectedQYear, session: this.state.selectedQSession, paper: this.state.selectedQPaper, difficulty: this.state.selectedQDifficulty, description:this.state.selectedQDescription, answer: this.state.selectedQAnswer}),
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(res=>{
      console.log(res.body)
      let pr = new Promise((resolve, reject)=>{
        let new_list = this.state.Questions
        for (var i = 0 ; i< new_list.length; i++) {
          if (new_list[i]["id"] ===this.state.selectedQid){
            if (new_list[i]["subject"]!==this.state.selectedQSubject ||
                new_list[i]["year"]!==this.state.selectedQYear ||
                new_list[i]["syllabus"]!==this.state.selectedQSyllabus ||
                new_list[i]["session"]!==this.state.selectedQSession ||
                new_list[i]["paper"]!==this.state.selectedQPaper
                ){
              new_list.splice(i,1)
            }
            else{
              new_list[i]["difficulty"]=this.state.selectedQDifficulty
              new_list[i]["description"]=this.state.selectedQDescription
              new_list[i]["answer"]=this.state.selectedQAnswer
            }
            break
          }
        }
        resolve(new_list)
      })
      pr.then(new_list=>{
          this.setState({Questions: new_list})
          console.log(new_list)
          this.handleModalClose()
      })


    })
  }

  render() {
    const editform = (
      <div>       
        <div className="main-container-q"> 
          <div className="form-style1">
            <form onSubmit = {this.editSubmitHandler}>
              <fieldset>
                <legend>
                  <span className="number">1</span> 
                  Question Details
                </legend>
                
                <label htmlFor="job">Syllabus:</label>
                <select defaultValue={this.state.selectedQSyllabus} id="job" name="Syllabus" onChange={(e)=>{this.editChangeHandler(e)}} required>
                    <option value="None">-------</option>
                    <option value="O-levels">O-levels</option>
                    <option value="A-levels">A-levels</option>
                    <option value="IGCSE">IGCSE</option>
                    <option value="IBDP">IBDP</option>
                </select>

                <label htmlFor="job">Subject:</label>
                <select defaultValue= {this.state.selectedQSubject} id="job" name="Subject" onChange={(e)=>{this.editChangeHandler(e)}} required>
                    <option value="None">-------</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Additional Mathematics">Additional Mathematics</option>
                   
                </select>

                <input type="number" name="Year" placeholder="Year" value={this.state.selectedQYear} onChange={(e)=>{this.editChangeHandler(e)}} required/>
                <label htmlFor="job">Session:</label>
                <select defaultValue= {this.state.selectedQSession} id="job" name="Session" onChange={(e)=>{this.editChangeHandler(e)}} required>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
                <input type="number" name="Paper" placeholder="Paper" value={this.state.selectedQPaper} onChange={(e)=>{this.editChangeHandler(e)}} required/>   
              </fieldset>

              <fieldset>
                <legend>
                  <span className="number">2</span> 
                  Question Info
                </legend>

                <label htmlFor="job"><b>Answer:</b> Do Nothing if Answer is Image</label>

                <select defaultValue={this.state.selectedQAnswer} id="job" name="Answer" onChange={(e)=>{this.editChangeHandler(e)}}>
                  <optgroup>
                    <option value="None">-------</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </optgroup>
                </select>
                
                <input type="number" name="Difficulty" placeholder="Difficulty" value={this.state.selectedQDifficulty} onChange={(e)=>{this.editChangeHandler(e)}} required/>
                <textarea name="Description" placeholder="Description/Hints" value={this.state.selectedQDescription} onChange={(e)=>{this.editChangeHandler(e)}} ></textarea>
              </fieldset>

              <input type="submit" value="Save Changes" />
            </form>
          </div>
        </div> 
      </div> 
    )


    const editModal = (
      <Modal show={this.state.showModal} animation='true' onHide={this.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editform}
        </Modal.Body>
      </Modal>
    )

    const form= ( 
    <div>       
      <div className="main-container-q"> 
        <h1 className="title1"> Search for Questions To Edit</h1>    
        <div className="form-style1">
          <form onSubmit={this.submitHandler}>
            <fieldset>
              <legend>
                <span className="number">1</span> 
                Question Details
              </legend>

              <label htmlFor="job">Syllabus:</label>
                <select defaultValue= "None" id="job" name="Syllabus" onChange={this.changeHandler}  required>
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
              <select defaultValue= {this.state.Session} id="job" name="Session" onChange={this.changeHandler} required>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
              </select>
              <input type="number" name="Paper" placeholder="Paper" value={this.state.Paper} onChange={this.changeHandler} required/>   
            </fieldset>

            <input type="submit" value="Show Results" />
          </form>
        </div>
      </div> 
    </div> 
    )

    

    const card = this.state.Questions.map((question,i)=>
        <div>
          <Card bg = "dark" text= "white">
            <Card.Header as="h5">
                Question &nbsp; &nbsp;
                <Button variant="info" onClick = {()=>{this.handleModalShow(question)}}> Edit </Button>
                &nbsp;
                <Button variant="danger" onClick={(e)=>{this.handleDelete(e,question)}}> Delete </Button>
            </Card.Header>
            <Card.Img className = "card-img-tosp" variant="top" src={"https://drive.google.com/uc?id="+question.question_link} />
            <Card.Body>
              <Card.Text>
                <b>{question.subject} {question.year} Paper {question.paper} Session {question.session}</b>
                <br/>
                <b>Description:</b> {question.description}
                <br/>
                <b>Difficulty Level:</b> {question.difficulty} 
              </Card.Text>
            </Card.Body>  
            <Card.Header as="h5">Answer</Card.Header>
            <Card.Body>
              <Card.Text>
                { question.answer!==""? 
                  question.answer:
                  <Card.Img className = "card-img-tosp" variant="top" src={"https://drive.google.com/uc?id="+question.answer_link} />
                }
              </Card.Text>
            </Card.Body>
            <Card.Footer as="h5">
              <div>
                {
                  question.tags.map((subitem, i) => {
                    return (
                       <Button>{subitem}</Button>
                    )
                  })
                }
              </div>
            </Card.Footer>
          </Card>
          <br />  
        </div>
    )

    const cards = (
      <div>
        <div className="main-container-q">
          <h1 className="title1"> Search Results </h1>    
        </div>
        <Button className="filter" variant="info" onClick={this.changeFilter}><i className="fa fa-search"></i> Change Filter</Button>
            
        <div>
          {card}
        </div>
      </div>
    )

    return (
      <div>
      {!this.state.permission ? <h3 className="heading"> Inadequate access rights </h3> :

      <div>
      <br/><br/>
        {this.state.Form? form:cards}
        {this.state.showModal? editModal:null}
      </div>
    }
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    credits: state.user.credits,
    usertype: state.user.usertype,
  };
}
export default withRouter(connect(mapStateToProps)(EditQ));
// export default EditQ;