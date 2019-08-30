import { auth } from './firebase';
import * as firebase from 'firebase'
// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Sign In with Google
export const doSignInWithPopup = () =>{
	// const provider = new auth.GoogleAuthProvider();
 //    provider.addScope('https://www.googleapis.com/auth/plus.login');
	// auth.signInWithPopup(provider)

	const auth = firebase.auth;
    const auth_ = firebase.auth();
 
    var provider = new auth.GoogleAuthProvider();
    console.log("asffas")
    auth_.signInWithPopup(provider)
    .then(result=>{
    	console.log("result", result)
    	return result
    }) 
    .catch(e=> {
    	console.log("error", e)
    })
}

// Sign out
export const doSignOut = () =>
  auth.signOut();

// Password Reset
export const doPasswordReset = (email) =>
  auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
  auth.currentUser.updatePassword(password);

export const doSendEmailVerification = () =>
	auth.SendEmailVerification();