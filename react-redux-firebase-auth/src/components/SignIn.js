import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { requestSignIn, signedIn } from '../actions/user'
import { auth } from '../firebase';
import { db } from '../firebase/firebase';
import * as firebase from 'firebase'

import {doCreateUser} from '../firebase/db';


import * as routes from '../constants/routes';
import './SignIn.css'

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: null
    };
    
    this.googleSignIn = this.googleSignIn.bind(this);
  }

  async googleSignIn(event) {
    event.preventDefault();
    const {history,} = this.props;
    this.props.dispatch(requestSignIn());    
    
    try{

      const auth = firebase.auth;
      const auth_ = firebase.auth();
   
      var provider = new auth.GoogleAuthProvider();
      console.log("asffas")
      auth_.signInWithPopup(provider)
      .then(response=>{
        console.log(response)
        if (response.user === undefined) {
          history.push(routes.SIGN_IN);
        } else {

          let credits=0
          let type =''
          console.log(response.user)
          let userRef = db.collection('users')
          let query = userRef.where('email','==',response.user.email).get()
            .then(async (snapshot) => {
              if (snapshot.empty) {
                // console.log('11User does not exist in Database');
                await doCreateUser(response.user.uid, response.user.displayName, response.user.email, 10, 'student');
              }  
              snapshot.forEach(doc => {
                  let temp = doc.data()
                  credits = temp.credits
                  type = temp.usertype
                  this.props.dispatch(signedIn(response.user,credits,type));         
              });
            })
            .catch(err => {
              console.log('Error getting documents', err);
            });
          history.push(routes.HOME);
        }
      }) 
      .catch(e=> {
        console.log("error", e)
      })
      
    }catch (error) {
      // console.log("asfag")
      this.setState({
        error
      });
    }

  }


  render() {

    const er_email_db = "There is no user record corresponding to this identifier. The user may have been deleted."
    const er_email_a = "Invalid Email Address"

    const er_pw_db = "The password is invalid or the user does not have a password."
    const er_pw_a = "Incorrect Password"

    const { email, password, error, } = this.state;
    const isInvalid = password === '' || email === '';


    return (
      <div >
          <br/><br/><br/>
        <form className = "main_container"onSubmit={ async (e) => {
            e.preventDefault();
            const { email, password, } = this.state;
            const {history,} = this.props;
            this.props.dispatch(requestSignIn());

            try {
              const response = await auth.doSignInWithEmailAndPassword(email, password);
              // this.props.dispatch(signedIn(response.user, credits, usertype))


              if (response.user === undefined) {
                history.push(routes.SIGN_IN);
              } else {

                let credits=0
                let type =''
                // console.log(response.user)
                let userRef = db.collection('users')
                let query = userRef.where('email','==',response.user.email).get()
                  .then(snapshot => {
                    if (snapshot.empty) {
                      console.log('User does not exist in Database');
                      return;
                    }  
                    snapshot.forEach(doc => {
                        let temp = doc.data()
                        credits = temp.credits
                        type = temp.usertype
                        this.props.dispatch(signedIn(response.user,credits,type));         
                    });
                  })
                  .catch(err => {
                    console.log('Error getting documents', err);
                  });
                history.push(routes.HOME);
              }
            } catch (error) {
              this.setState({
                error
              });
            }
        }}>
          <br/><div className = "control-group space-2"/>
          <button className = "test signup-login-form__btn-xl space-1" onClick = {this.googleSignIn}>Sign In with Google</button>
          <div className = "center-container">
            <br/>
            <div className = "a">
              <span className = "or"><b>or</b></span>
            </div>
            <br/>
            <div className = "control-group space-1">
              <input className = "icon_signin signup-login-form__btn-xl" value={email} onChange={event => this.setState({email: event.target.value})} type="email" placeholder="Email Address" required/>
            </div>

            <div className = "control-group space-2" id="signin_email">
              <input className = "icon_password signup-login-form__btn-xl" value={password} onChange={event => this.setState({password: event.target.value})} type="password" placeholder="Password" required/>
            </div>
          
            <button className="block signup-login-form__btn-xl space-2"  type="submit">
              Sign In
            </button>
            <br/><div className = "control-group space-2"/>
          </div>        
          
          <div className={error? "error_msg":null}>
            { error && <p>{error.message===er_email_db? er_email_a: (error.message===er_pw_db? er_pw_a:error.message) }</p> }
          
          </div>
          <br/>
          <Link className = "forgot-pw" to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
          <br/><br/>
        </form>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  // console.log("state",state)
  return {
    user: state.user.user,
    credits: state.user.credits,
    usertype: state.user.usertype,
  };
}


export default withRouter(connect(mapStateToProps)(SignIn));
 // <img width="20px" alt="Google &quot;G&quot; Logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"/>