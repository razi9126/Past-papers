import React from 'react';
import { auth } from '../firebase';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './SignUp.css'

class EditProfile extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      oldusername: '',
      passwordOne: '',
      passwordTwo: '',
      error: null,
      email: '',
      updated: false,
      updated_msg: '',
    };
  }

  componentDidMount(){
    this._isMounted = true;
    this.setState({email: this.props.user.email})
    
    fetch('/get-username', {
      method: 'POST',
      body: JSON.stringify({id: this.props.user.uid}),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res=>{
      res.json().then(res1=>{
        console.log(res1)
        this.setState({username: res1.username, oldusername: res1.username})
      })
    })
  }

  render() {
    const { error, } = this.state;

    return (
      <div className = "right">
        <form className= "main_container" onSubmit={ async (e) => {
          e.preventDefault();
          const { passwordOne, passwordTwo, username, oldusername } = this.state;

          if(passwordOne!==passwordTwo){
            this.setState({error: {message: 'Passwords do not match'}})
            return
          } else{
            if(passwordOne!==""){
              try {
                await auth.doPasswordUpdate(passwordOne);
                this.setState({updated: true, updated_msg: "Your profile has been updated."})
              } catch (error) {
                this.setState({
                  error
                });
              }
            }
          }
          
          if(username!==oldusername){
            fetch('/change-username', {
              method: 'POST',
              body: JSON.stringify({id: this.props.user.uid, newusername: this.state.username}),
              headers: {
                "Content-Type": "application/json",
              }
            }).then(res=>{
              this.setState({updated: true, updated_msg: "Your profile has been updated.", oldusername:this.state.username})
            })
          }
        }}>

        <br/><div className = "control-group space-2"/>
          <div className = "center-container">
            <br/>
            <br/>

            <div className = "control-group space-1">
              <input required className="icon_username signup-login-form__btn-xl" value={this.state.username} onChange={event => this.setState({ username: event.target.value})} type="text" placeholder="Name"/>
            </div>
            <div className = "control-group space-1">
              <input disabled className="icon_signin signup-login-form__btn-xl" value={this.state.email} type="email" placeholder="Email Address" />
            </div>
            <div className = "control-group space-1">
              <input  className="icon_password signup-login-form__btn-xl" value={this.state.passwordOne} onChange={event => this.setState({ passwordOne: event.target.value})} type="password" placeholder="New Password" />
            </div>
            <div className = "control-group space-1">
              <input  className="icon_password signup-login-form__btn-xl" value={this.state.passwordTwo} onChange={event => this.setState({ passwordTwo: event.target.value})} type="password" placeholder="Confirm Password" />
            </div>

            <button className="block signup-login-form__btn-xl space-2" type="submit">
              Save Changes
            </button>
            <br/><div className = "control-group space-2"/>

            <div className={error? "error_msg":null}>
              { error && <p>{error.message}</p> }
            </div>
            <div className={this.state.updated? "updated_msg":null}>
              { this.state.updated && <p>{this.state.updated_msg}</p> }
            </div>
            <br/>
          </div>

        </form>
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

export default withRouter(connect(mapStateToProps)(EditProfile));