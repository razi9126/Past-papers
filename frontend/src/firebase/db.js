import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email, credits, usertype) =>{
  // db.ref(`users/${id}`).set({
  //   username,
  //   email,
  // });
  let data = {
		id:id,
		email:email,
		username:username,
		credits:credits,
		usertype:usertype
	}

  let userRef = db.collection('users').add(data)
		.then(ref =>{
			console.log("Added record with id: ", ref.id)
		})
		.catch(error=>{
			console.log("DB error while adding question: ", error)
		})
		return (userRef)
}

export const onceGetUsers = () =>{


  // db.ref('users').once('value');
}

// Other db APIs ...
