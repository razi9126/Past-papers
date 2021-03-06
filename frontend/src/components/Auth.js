import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { firebase } from '../firebase';
import { signedIn, signOut } from '../actions/user'
import { db } from '../firebase/firebase';
import {Spinner} from 'react-bootstrap'
class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticating: true
        }

    }
    componentDidMount() {
        firebase.auth.onAuthStateChanged(authUser => {
            this.setState({
                isAuthenticating: false
            });
            if (authUser !== null) {
                //
                this.props.dispatch(signedIn(authUser,0,''));
                // console.log(authUser)
                let credits=0
                let type =''
                let userRef = db.collection('users')
                let query = userRef.where('email','==',authUser.email).get()
                  .then(async(snapshot) => {
                    if (snapshot.empty) {
                      console.log('User does not exist in Database');
                      return;
                    }  
                    snapshot.forEach(doc => {
                        let temp = doc.data()
                        credits = temp.credits
                        type = temp.usertype
                    });
                    this.props.dispatch(signedIn(authUser,credits,type));         
                  })
                  .catch(err => {
                    console.log('Error getting documents', err);
                  });
                // this.props.dispatch(signedIn(authUser,21,"from Auth.js"));         
            } else {
                this.props.dispatch(signOut());
            }
        });
    }

    render() {
        if (this.state.isAuthenticating) {
            return (
                <div className = "spinner">
                    <div className="inner-spinner"><Spinner className="spinner-actual" animation="border" variant="primary"/></div>
                </div>
            )
        }
        return (
            this.props.children
        )
    }
}


export default withRouter(connect()(Auth));