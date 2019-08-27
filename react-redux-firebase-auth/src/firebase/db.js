import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>{
  // db.ref(`users/${id}`).set({
  //   username,
  //   email,
  // });
  let data = {
		id:id,
		email:email,
		username:username
	}

  let userRef = db.collection('users').add(data)
		.then(ref =>{
			console.log("Added record with id: ", ref.id)
		})
		.catch(error=>{
			console.log("DB error while adding question: ", error)
		})
}




export const onceGetUsers = () =>{
	// let userRef = db.collection('users')
 //  	const allusers = userRef.get()
 //  	.then(snapshot => {
 //  		let send_ret = new Promise((resolve1, reject1)=>{
	// 			let ret = []
	// 			snapshot.forEach(doc =>{
	// 				// console.log(doc.id, "=>", doc.data())
	// 				let add_id = new Promise((resolve, reject) =>{
	// 					let temp = doc.data()
	// 					temp["key"] = doc.id
	// 					resolve(temp)
	// 				})
	// 				add_id.then(temp=>{ret.push(temp)})
	// 			})
	// 			resolve1(ret)
	// 		})
	// 		send_ret.then(ret=>{res.send(ret)})

	//   })
	//   .catch(err => {
	//     console.log('Error getting documents', err);
	//   });

  // db.ref('users').once('value');
}

// Other db APIs ...
