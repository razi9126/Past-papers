import React from 'react';
import Select from 'react-select';

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

    return (
      <Select
        isMulti='true'
        value={selectedOption}
        onChange={this.handleChange}
        options={this.state.options}
      />
    );
  }
}
export default TagPhotos;