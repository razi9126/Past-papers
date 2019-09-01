import React from 'react';
import Select from 'react-select';
import { Button, Card } from 'react-bootstrap';
import './TagPhotos.css'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

class TagPhotos extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedOption: [],
      alltags:[],
      options:[],
      Questions: [],
      showForm: true,
      Subject: null,
      Syllabus: '',
    }
    this.fetchtags = this.fetchtags.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveTags = this.saveTags.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.fetchUntagged = this.fetchUntagged.bind(this);
  }

  changeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  fetchtags(){
    // fetches tags from server and makes them in a form that can be passed to select
    fetch('/find-tags', {
      method: 'POST',
      body: '',
      headers: {
        "Content-Type": "application/json",
      }
    }).then((result) =>{
      result.json().then(tags=>{
        this.setState({alltags:tags},()=>{
          let userList = [];
          let list = [];
          list = this.state.alltags;
          for (var i = 0; i < list.length; i++) {
            userList.push({
              label: list[i].label,
              value: list[i].label
            });
          }
          this.setState({
            options: userList

        })
      })
    }) 
  })
  };

  fetchUntagged(){
    fetch('/untagged-questions', {
      method: 'POST',
      body: JSON.stringify({syllabus:this.state.Syllabus, subject: this.state.Subject}),
      headers: {
        "Content-Type": "application/json",
      }
    }).then((result) =>{
      result.json().then(untagged=>{
        // console.log(untagged)
        this.setState({Questions:untagged, showForm: false})
      }) 
    })
  }

  submitHandler = event =>{
    event.preventDefault()
    this.fetchUntagged()
  }

  componentDidMount() {
    this.fetchtags()
    // this.fetchUntagged()

  }

  handleChange = (selectedOption,qid) => {
    console.log(selectedOption, qid)
    this.state.selectedOption[qid] = selectedOption
    console.log(this.state.selectedOption)
  };

  saveTags = (event, id) => {
    event.preventDefault();
    console.log(this.state.selectedOption[id])
    fetch('/tag-question', {
      method: 'POST',
      body: JSON.stringify({question_id: id, tags: this.state.selectedOption[id]}),
      headers: {
        "Content-Type": "application/json",
      }
    }).then((result)=>{
        // document.getElementById(id).classList.add("animated-card")
        let temp = this.state.Questions
        for (var i = temp.length - 1; i >= 0; i--) {
          if (temp[i]["id"]==id){
            temp.splice(i,1)
          }
        }
        this.setState({selectedOption:[], Questions: temp})
    })
  }

  render() {
    const { selectedOption } = this.state;
    const myoptions = this.state.alltags.map(v => ({
      label: v,
      value: v
    }));
        console.log(this.props)

    const cards = this.state.Questions.map((question,i)=>
      <div key={i} >
        <Card bg = "dark" id={question.id}>
          <Card.Header as="h5" className="white_text">
              Question &nbsp; &nbsp;
          </Card.Header>
          <Card.Img className = "card-img-tosp" variant="top" src={"https://drive.google.com/uc?id="+question.question_link} />
          <Card.Header as="h5">
            <div className="white_text">Add New Tags</div>
            <br/> 
              <Select
                isMulti='true'
                value={selectedOption[question.id]}
                onChange={(e)=>{this.handleChange(e,question.id)}}
                options={this.state.options}
              />
          </Card.Header>
          <Card.Footer as="h5">
            <div className="right">
              <Button variant ="info" onClick={(e)=>{this.saveTags(e,question.id)}}> Save </Button> 
            </div>
          </Card.Footer>
        </Card>
        <br />  
      </div>
    )

    const blank = (
      <div className= "main_container">
        <br/><br/><br/>
        <Card  bg = "dark" id="blank" className ="vc">
          <Card.Header as="h5" className="white_text">
              No Untagged Questions &nbsp; &nbsp;
          </Card.Header>
        </Card>
      </div>
      )

    const searchform = (
        <div>       
          <div className="main_container"> 
            <h1 className="title1"> Search for Questions To Tag </h1>    
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
                </fieldset>

                <input type="submit" value="Show Results" />
              </form>
            </div>
          </div> 
        </div>
      )

    return (
      <div>
      <br/><br/>
        {this.state.showForm? searchform: (this.state.Questions.length? cards: blank)}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    credits: state.user.credits,
    usertype: state.user.usertype  
  };
}
export default withRouter(connect(mapStateToProps)(TagPhotos));
// export default TagPhotos;