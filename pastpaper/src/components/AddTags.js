import React, {useState} from 'react';
import './AddTags.css'
import {Badge, Button} from 'react-bootstrap'


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
    this.deleteTag = this.deleteTag.bind(this);
  }

  deleteTag(event,key){
    event.preventDefault();
    fetch('/delete-tag', {
      method: 'POST',
      body: JSON.stringify({key: key}),
      headers: {
        "Content-Type": "application/json",
      }
    }).then((result) =>{
        let p1 = new Promise((resolve, reject)=>{
          let temp = this.state.alltags
          for (var i = 0; i < this.state.alltags.length; i++) {
            if(temp[i]["key"]==key){
              temp.splice(i,1)
              break;
            }
          }          
          resolve(temp)
        })
        p1.then(temp =>{
          this.setState({alltags: temp})
        })
      })
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
        console.log(this.state.alltags)
      })
    }) 
  }

  componentDidMount() {
    this.fetchtags()
  }

  render() {

    let taglist = this.state.alltags.map((singletag,i) => 
      <div key={i}>      
        <Button className = "btn-tag" variant = "secondary" onClick = {(e)=>{this.deleteTag(e,singletag.key)}} >
          {singletag.label} &nbsp;
          <Badge className = "tag-line" > X </Badge>
        </Button>
        <br/><br/>
      </div>
      )

    return (
      <div>
      <br/> <br/>
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
              
              <div className="form-style2">              
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
        <Button className = "btn-tag" variant = "secondary" onClick = {(e)=>{AddTags.deleteTag(props.key)}} >
          {props.label} &nbsp;
          <Badge className = "tag-line" > X </Badge>
        </Button>
        <br/><br/>
    </div>
    )
}
export default AddTags;