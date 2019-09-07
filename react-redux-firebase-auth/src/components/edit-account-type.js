import React, { Component } from 'react';
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { Modal, Button, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class EditAccount extends Component {
  constructor(props){
    super(props);
    this.state = {
      Email:'',
      Type:'',
      Form: true,
      Users:[],
      showModal:false,
      permission:false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.editChangeHandler = this.editChangeHandler.bind(this);
    this.submitchange = this.submitchange.bind(this);
  
  }
  editChangeHandler(event){
    this.setState({
      Type: event.target.value
    }, function() {
      console.log(this.state.Type)
    })
  }

  handleChange(event) {
    this.setState({Email: event.target.value});
  };

  submitchange = event => {
    event.preventDefault()
    console.log("sfsf")
    console.log(event)
  };

  componentDidMount(){
    if(this.props.user!=null){
      console.log(this.props)
        if (this.props.usertype==="admin"){
          this.setState({permission: true})
        }
      }
  };

  submitHandler = event =>{
    event.preventDefault();
    const { Email } = this.state;  
    fetch('/find-user', {
          method: 'POST',
          body: JSON.stringify({email:Email}),
          headers: {
            "Content-Type": "application/json",
          }
    }).then((result) =>{
        result.json().then(body=>{
          console.log(body)
          this.setState({
            Users: body,
            Email:'',
            Username:'',
            Type:'',
            Credits:'',
            SelectedUser:'',
            Questions:'',
            Form: false,
          })
        })
      })  

    this.setState({Form: false})    
  }

  changeFilter = event =>{
    event.preventDefault();
    this.setState({Form:true})
  }


  render() {

    const form= ( 
    <div>       
      <div className="main-container-q"> 
        <h1 className="title1"> Enter email address of the user</h1>    
        <div className="form-style1">
          <form onSubmit={this.submitHandler}>
            <fieldset>
              <legend>
                <span className="number">1</span> 
                User Details
              </legend>

              <label htmlFor="job">Email:</label>
                <input required className="email" name='email' value={this.state.email} onChange={this.handleChange} type="text" placeholder="Email Address"/>

            </fieldset>
            <input type="submit" value="Show Results" />
          </form>
        </div>
      </div> 
    </div> 
    )

    

    const card = this.state.Users.map((user,i)=>
        <div>
          <Card bg = "dark" text= "white">
            <Card.Header as="h5">
                User &nbsp; &nbsp;
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <b>Name:</b> {user.username}
                <br/>
                <b>Credits: {user.credits} <br/>  Email: {user.email}</b>
                <br/>

                <label htmlFor="job">Typet:</label>
                <select defaultValue= {user.usertype} id="job" name="Type" onChange={(e)=>{this.editChangeHandler(e)}} required>
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                </select>
                <br/>
              </Card.Text>
            </Card.Body> 
            <Card.Footer as="h5">
              <div>
                <form onSubmit={this.submitchange(user)}>
                <input type="submit" value="Save Changes" />
                </form>
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
export default withRouter(connect(mapStateToProps)(EditAccount));