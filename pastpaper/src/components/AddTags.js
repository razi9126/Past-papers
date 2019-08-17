import React from 'react';

class AddTags extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value:'',
      response:'',
      alltags:[],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  };

  handleSubmit(event) {
    event.preventDefault();
    const { value } = this.state;  
    fetch('/add-tags', {
      method: 'POST',
      body: JSON.stringify({value: value}),
      headers: {
        "Content-Type": "application/json",
      }
    }).then((result) =>{
      result.json().then(body=>{
        this.setState({response:body.response})
      })
    })      
  };

  // componentDidMount() {
  //   console.log("Mounted")
  //   fetch('/find-tags')
  //   .then((result) =>{
  //     result.json().then(body=>{
  //       console.log(body)
  //     })
  //   }) 
  // };
  componentDidMount() {
    fetch('/find-tags', {
      method: 'POST',
      body: '',
      headers: {
        "Content-Type": "application/json",
      }
    }).then((result) =>{
      result.json().then(body=>{

        console.log(body)
        body.forEach((x)=>{
          console.lod(x)
        })
      })
    }) 
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
      <input type="text" value={this.state.value} onChange={this.handleChange} />
      </label>
      <input type="submit" value="Submit" />
      </form>
      
      <h5>{this.state.response}</h5>

      </React.Fragment>
      );
  }
};

const TagCard = (props) => {
  return (
    <div>
    <hr />
    <p><b>Tag:</b> {props.value.toUpperCase()}</p>
    <hr />
    </div>
    )
}
export default AddTags;