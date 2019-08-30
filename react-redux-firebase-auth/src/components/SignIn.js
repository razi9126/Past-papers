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
      console.log("asfag")
      this.setState({
        error
      });
    }

  }

  render() {
    const { email, password, error, } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <div className="main_container">
        <form className="signUpFormContainer" onSubmit={ async (e) => {
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

          <input value={email} onChange={event => this.setState({email: event.target.value})} type="text" placeholder="Email Address"/>
          <input  value={password} onChange={event => this.setState({password: event.target.value})} type="password" placeholder="Password"/>
          <button  disabled={isInvalid} type="submit">
            Sign In
          </button>

          <button onClick = {this.googleSignIn}>
            Sign In with Google
          </button>
            { error && <p>{error.message}</p> }
        </form>
        <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
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