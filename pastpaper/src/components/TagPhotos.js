import React from 'react';
import Select from 'react-select';
import { Button, Card } from 'react-bootstrap';
import './TagPhotos.css'
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

class TagPhotos extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedOption: null,
      alltags:[],
      options:[],
      Questions: [],
    }
    this.fetchtags = this.fetchtags.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveTags = this.saveTags.bind(this);
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
      body: '',
      headers: {
        "Content-Type": "application/json",
      }
    }).then((result) =>{
      result.json().then(untagged=>{
        console.log(untagged)
        this.setState({Questions:untagged})
      }) 
    })
  }

  componentDidMount() {
    this.fetchtags()
    this.fetchUntagged()

  }

  handleChange = selectedOption => {
    this.setState({ selectedOption },()=>{
      console.log(`Option selected:`, this.state.selectedOption);
    });
  };

  saveTags = (event, id) => {
    event.preventDefault();
    // console.log(id)
    fetch('/tag-question', {
      method: 'POST',
      body: JSON.stringify({question_id: id, tags: this.state.selectedOption}),
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
      // console.log(temp)
      this.setState({selectedOption: null, Questions: temp})
      
    })
  }

  render() {
    const { selectedOption } = this.state;
    const myoptions = this.state.alltags.map(v => ({
      label: v,
      value: v
    }));

    const cards = this.state.Questions.map((question,i)=>
      <div >
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
                value={selectedOption}
                onChange={this.handleChange}
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

    return (
      <div>
        {cards}
      </div>
    );
  }
}
export default TagPhotos;