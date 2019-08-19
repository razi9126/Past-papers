import React from 'react';
import Select from 'react-select';
import { Button, Card } from 'react-bootstrap';

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
        this.setState({Questions:untagged})
      }) 
    })
  }

  componentDidMount() {
    this.fetchtags()

  }


  handleChange = selectedOption => {
    this.setState({ selectedOption },()=>{
      console.log(`Option selected:`, this.state.selectedOption);
    });
  };
  render() {
    const { selectedOption } = this.state;
    const myoptions = this.state.alltags.map(v => ({
      label: v,
      value: v
    }));

    const cards = this.state.Questions.map((question,i)=>
        <div>
          <Card bg = "dark" text= "white">
            <Card.Header as="h5">
                Question &nbsp; &nbsp;
            </Card.Header>
            <Card.Img className = "card-img-tosp" variant="top" src={"https://drive.google.com/uc?id="+question.question_link} />
            <Card.Header as="h5">
              Add New Tags
              <Select
                isMulti='true'
                value={selectedOption}
                onChange={this.handleChange}
                options={this.state.options}
              />
            </Card.Header>
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


    return (
      <div>
        {cards}
      </div>

      
    );
  }
}
export default TagPhotos;