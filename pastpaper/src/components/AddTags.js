import React from 'react';
import './AddTags.css'


class AddTags extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      label:'',
      response:'',
      alltags:[],
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
        this.setState({response:body.response})
        this.fetchtags()
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

    let taglist = this.state.alltags
    .map((singletag,i) => 
      <TagCard key={i} {...singletag} />
      )

    return (
      <React.Fragment>
      <form onSubmit={this.handleSubmit}>
      <label>
      Add Tag
      <input type="text" label={this.state.label} onChange={this.handleChange} />
      </label>
      <input type="submit" label="Submit" />
      </form>
      
      <h5>{this.state.response}</h5>
      <h4>Tags already in the list</h4>
      {taglist}
      </React.Fragment>
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