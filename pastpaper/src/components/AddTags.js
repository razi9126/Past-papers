import React, {useState} from 'react';
import './AddTags.css'
import {Badge} from 'react-bootstrap'

class AddTags extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      label:'',
      response:'',
      alltags:[],
      showAlert:false,
      counter: 0,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchtags = this.fetchtags.bind(this);
  }

  handleChange(event) {
    this.setState({label: event.target.value});
  };

  handleSubmit(event) {
    event.preventDefault();
    const { label } = this.state;  
    fetch('/add-tags', {
      method: 'POST',
      body: JSON.stringify({label: label}),
      headers: {
        "Content-Type": "application/json",
      }
    }).then((result) =>{
      result.json().then(body=>{
        console.log(body.response)
        this.setState({response:body.response, showAlert: true})
        this.fetchtags()
        if(body.response!== "The tag already exists"){
          this.setState({counter: this.state.counter+1})
        }
      })
    })      
  };

  fetchtags(){
    fetch('/find-tags', {
      method: 'POST',
      body: '',
      headers: {
        "Content-Type": "application/json",
      }
    }).then((result) =>{
      result.json().then(tags=>{
        this.setState({alltags:tags})
      })
    }) 
  }

  componentDidMount() {
    this.fetchtags()
  }

  render() {

    let taglist = this.state.alltags.map((singletag,i) => 
        <TagCard key={i} {...singletag} />
      )

    return (
      <div>
        <React.Fragment>
            <div className="main_container">
              <div className="form-style1">
                <form onSubmit = {this.handleSubmit}>
                  <fieldset>
                    <legend>
                      <span className="number">1</span> 
                      Add a New Tag
                    </legend>
                    <input type="text" label={this.state.label} onChange={this.handleChange} />            
                  </fieldset>
                  <input type="submit" value="Add Tag" />
                </form>
              </div>
              
              <div className="form-style1">              
                <legend>
                  <span className="number">2</span> 
                  Tags Already Added {this.state.counter? <small><Badge variant="success">+{this.state.counter}</Badge></small>:null}
                </legend>
                <div className="list">{taglist}</div>
              </div>
            
          </div>
        </React.Fragment>
      </div>
      );
  }
};

const TagCard = (props) => {
  return (
    <div>

    <p>{props.label}</p>
    </div>
    )
}
export default AddTags;