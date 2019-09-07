import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { auth, db } from '../firebase';
import * as routes from '../constants/routes';
import * as firebase from 'firebase'

import './SignUp.css'

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
      error: null,
    }
    
    this.googleSignIn = this.googleSignIn.bind(this);
  }

  async googleSignIn(event){
    event.preventDefault();
    const {history,} = this.props;
    try{

      const auth = firebase.auth;
      const auth_ = firebase.auth();
   
      var provider = new auth.GoogleAuthProvider();
      console.log("asffas")
      auth_.signInWithPopup(provider)
      .then(async(response) =>{
        await db.doCreateUser(response.user.uid, response.user.displayName, response.user.email, 10, 'student');
        history.push(routes.HOME)

      })
    }catch (error) {
      // console.log("asfag")
      this.setState({
        error
      });
    }

  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    return (
      <div className = "right">
        <form className="main_container" onSubmit={async (e) => {
          e.preventDefault();

          if (this.state.passwordOne!==this.state.passwordTwo){
            this.setState({error: {message: 'Passwords do not match'}})
            return
          }

          const { username,email,passwordOne,} = this.state;
          const { history,} = this.props;

          try {
            const authUser = await auth.doCreateUserWithEmailAndPassword(email, passwordOne);
            await db.doCreateUser(authUser.user.uid, username, email, 10, 'student');
            history.push(routes.HOME);
          } catch (error) {
            this.setState({
              error
            });
          }
        }}>
          <br/><div className = "control-group space-2"/>
          <button className = "test signup-login-form__btn-xl space-1" onClick = {this.googleSignIn}>Continue with Google</button>
          <div className = "center-container">
            <br/>
            <div className = "a">
              <span className = "or"><b>or</b></span>
            </div>
            <br/>

            <div className = "control-group space-1">
              <input required className="icon_username signup-login-form__btn-xl" value={username} onChange={event => this.setState({ username: event.target.value})} type="text" placeholder="Name"/>
            </div>
            <div className = "control-group space-1">
              <input required className="icon_signin signup-login-form__btn-xl" value={email} onChange={event => this.setState({ email: event.target.value})} type="email" placeholder="Email Address" />
            </div>
            <div className = "control-group space-1">
              <input required className="icon_password signup-login-form__btn-xl" value={passwordOne} onChange={event => this.setState({ passwordOne: event.target.value})} type="password" placeholder="Password" />
            </div>
            <div className = "control-group space-1">
              <input required className="icon_password signup-login-form__btn-xl" value={passwordTwo} onChange={event => this.setState({ passwordTwo: event.target.value})} type="password" placeholder="Confirm Password" />
            </div>

            <button className="block signup-login-form__btn-xl space-2" type="submit">
              Sign Up
            </button>
            <br/><div className = "control-group space-2"/>

            <div className={error? "error_msg":null}>
              { error && <p>{error.message}</p> }
            </div>
            <br/>
            <div className = "a"/>
            <div className = "footer">
              <div className = "login_span">
                <span> Already have an account? </span>
                <span className="login-btn"> <Link className="login-link" to={routes.SIGN_IN}> Login </Link></span>
              </div>
            </div>
          </div>
         

        </form>
      </div>
    )
  }
}

export default withRouter(connect()(SignUp));