import React from 'react';

class AddTags extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value:'',
      response:'',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

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
      console.log(result)
      })      
  }

  // componentDidMount() {
  //   fetch('get-tags')
  //     .then(response => response.json())
  //     .then(data => console.log(data));
  // }



  render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <label>
      Add Tag
      <input type="text" value={this.state.value} onChange={this.handleChange} />
      </label>
      <input type="submit" value="Submit" />
      </form>
      );
  }
}
export default AddTags;