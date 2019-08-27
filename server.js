const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require("multer");
const fs = require('fs');
const { google } = require('googleapis');
var firebase = require("firebase/app");
var http = require('http');

const SCOPES = ['https://www.googleapis.com/auth/drive']; // If modifying these scopes, delete token.json.
const TOKEN_PATH = 'token.json';

const readline = require('readline');
const PORT = process.env.PORT || 2001;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const admin = require('firebase-admin');
let serviceAccount = require('./past-papers-9566f-firebase-adminsdk-65q4d-c2f9a65bf1.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://past-papers-9566f.firebaseio.com"
})
let db = admin.firestore();

// The authdata will be stored in this global variable. Pass this auth data // to each function call.
var auth_data; 

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), saveAuth); // Authorize a client with credentials, then call the Google Drive API.
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
	  client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
	if (err) return getAccessToken(oAuth2Client, callback);
	oAuth2Client.setCredentials(JSON.parse(token));
	callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
	rl.close();
	oAuth2Client.getToken(code, (err, token) => {
	  if (err) return console.error('Error retrieving access token', err);
	  oAuth2Client.setCredentials(token);
	  // Store the token to disk for later program executions
	  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
		if (err) return console.error(err);
		console.log('Token stored to', TOKEN_PATH);
	  });
	  callback(oAuth2Client);
	});
  });
}


function saveAuth(auth) {
	auth_data = auth;
	// console.log(auth_data)
	console.log("Authentication complete");
	// shareFolder(auth).then((response)=>{
	// 	console.log(response)
	// })

	// fileUpload(auth_data,'2.jpg').then((question)=>{
	// 	console.log(question)
	// })

	// file to delete : 1ITKtcyeqbP5NjjgwxxpNku0DFLiZ4mlb

	// api key: AIzaSyAiAcu61XLAFm-WXyFlKNnHajFpqaJjFF4
	// deletefile('1nKcZ0-2s6kax5AtNtHm_pGFE4Nmwynx3')
	// uploadFile(auth_data,'photo.jpeg');
	// deletefile('1Ni8MUSiTQVgVKJvJiYcNRJbhxAugNnPU')
}

function deletefile(file_id){
	
	const options = {
	  hostname: 'https://www.googleapis.com',
	  path: '/drive/v3/files/'+ file_id+'?key=AIzaSyBB5-95sXXExxLWgT_lZL1rSWzLkBSnHC0',
	  method: 'DELETE',
	  headers: {
	    'Content-Type': 'application/json',
	    'Authorization': 'Bearer '+ auth_data.credentials.access_token
	  }
	}

	const req = http.request(options, (res) => {
	  console.log(`statusCode: ${res.statusCode}`)

	  res.on('data', (d) => {
	    console.log(d)
	  })
	})
}

const fileUpload = (auth,name) => {
  return new Promise((resolve, reject) => {
		const drive = google.drive({version: 'v3', auth});
		const filepath = 'files/' + name
		var folderId = '1PmVCcMf61pP89k_PQsAQbyYz-bpAGtHv';
		var fileMetadata = {
		'name': 'photo1.jpg',
		parents: [folderId]
		};
		var media = {
		mimeType: ['image/jpeg','image/jpg'],
		body: fs.createReadStream(filepath)
		};
		drive.files.create({
		  resource: fileMetadata,
		  media: media,
		  fields: 'id'
		}, function (err, file) {
		  if (err) {
		    reject(err);
		  } else {
		    resolve(file.data.id);
		  }
		});  
  });
};

const shareFolder = (auth) => {
	return new Promise((resolve, reject) => {
		var permissions ={
		    'type': 'anyone',
		    'role': 'reader',
		  };
		const drive = google.drive({version: 'v3', auth});
		drive.permissions.create({
		      fileId: '1PmVCcMf61pP89k_PQsAQbyYz-bpAGtHv',
		      resource: permissions,
		},function(err,result){
	        if(err){
	       		reject(err) 
	        }
	        else {
	        	resolve(result)
	        }
		});
	})
}

const makeFolder= (auth) => {
	return new Promise((resolve, reject) => {
		const drive = google.drive({version: 'v3', auth});
		var fileMetadata = {
		  'name': 'Pastpaper-Question-Images',
		  'mimeType': 'application/vnd.google-apps.folder'
		};
		drive.files.create({
		  resource: fileMetadata,
		  fields: 'id'
		}, function (err, file) {
		  if (err) {
			reject(err);
		  } else {
			resolve(file);
		  }
		});
	})
}

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './files');
      },
      filename: function(req, file, cb){
      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
   },   
});


const upload = multer({ storage });

app.post('/upload-question', upload.any(), (req, res) => {
	let qlink = ''
	let alink = ''
	const promises = req.files.map((file)=>{
		if (file.fieldname=='question'){
			let filename = file.filename;
			
			// returning the promise over here
			return fileUpload(auth_data,filename).then(qfileid =>{
				// console.log("Drive id of question is: ", qfileid);
				fs.unlink(file.path, function (err) {
					if(err){
						console.log("Error in deleting question from server", err)
					}
					else{
						console.log("Deleted question from folder");
					}
				});
				qlink = qfileid;
			}).catch(
			   error => {
			   	console.log("Error in upload to drive: ",error)
			   }
			);
		}
		if (file.fieldname=='answer'){
			let filename = file.filename;
			return fileUpload(auth_data,filename).then(afileid =>{
				// console.log("Drive id of answer is: ", afileid);
				fs.unlink(file.path, function (err) {
					if(err){
						console.log("Error in deleting answer from server", err)
					}
					else{
						console.log("Deleted answer from folder");
					}
				});
				alink = afileid;
			}).catch(
			   error => {
			   	console.log("Error in upload to drive: ",error)
			   }
			);
		}
	})
	Promise.all(promises).then((vals)=>{
		// console.log(vals)
		let data = {
					subject:(req.body.subject),
					session:(req.body.session),
					year:(req.body.year),
					syllabus:(req.body.syllabus),
					paper:(req.body.paper),
					difficulty:(req.body.difficulty),
					description:(req.body.description),
					question_link: qlink, // INSERT WHOLE LINK HERE
					answer_link: alink,	  // INSERT WHOLE LINK HERE. alink.length? ('www.google...' + alink):null	
					answer: (req.body.answertext==="null"? '': req.body.answertext),
					tags: []
				}

		let addQues = db.collection('question').add(data)
		.then(ref =>{
			res.send("Upload completed")
			console.log("Added record with id: ", ref.id)
		})
		.catch(error=>{
			res.send("Couldn't add record to DB")
			console.log("DB error while adding question: ", error)
		})
	});
});

app.post('/find-questions', (req,res)=>{
	let quesRef = db.collection('question')
	let query = quesRef.where('subject','==',req.body.subject)
	query = query.where('year','==',req.body.year)
	query = query.where('session','==',req.body.session)
	query = query.where('paper','==',req.body.paper)
	query.get()
		.then(snapshot =>{
			let send_ret = new Promise((resolve1, reject1)=>{
				let ret = []
				snapshot.forEach(doc =>{
					// console.log(doc.id, "=>", doc.data())
					let add_id = new Promise((resolve, reject) =>{
						let temp = doc.data()
						temp["id"] = doc.id
						resolve(temp)
					})
					add_id.then(temp=>{ret.push(temp)})
				})
				resolve1(ret)
			})
			send_ret.then(ret=>{res.send(ret)})
		})
		.catch(error =>{
			console.log("DB error while finding questions: ", error)
			res.send("error")
		})

})

app.post('/from-frontend', (req,res)=>{
	console.log("From frontend recieved")

})

app.post('/untagged-questions', (req,res)=>{
	let quesRef = db.collection('question')
	let query = quesRef.where('tags','==',[])
	query = query.where('subject','==',req.body.subject)
	query = query.where('syllabus','==', req.body.syllabus)
	query.get()
		.then(snapshot =>{
			let send_ret = new Promise((resolve1, reject1)=>{
				let ret = []
				snapshot.forEach(doc =>{
					// console.log(doc.id, "=>", doc.data())
					let add_id = new Promise((resolve, reject) =>{
						let temp = doc.data()
						temp["id"] = doc.id
						resolve(temp)
					})
					add_id.then(temp=>{ret.push(temp)})
				})
				resolve1(ret)
			})
			send_ret.then(ret=>{res.send(ret)})
		})
		.catch(error =>{
			console.log("DB error while finding questions: ", error)
			res.send("error")
		})
})

app.post('/tag-question', (req, res)=>{
	console.log(req.body.question_id, req.body.tags)
	let p1 = new Promise((resolve,reject)=>{
		let taglist = []
		for (var i = 0; i < req.body.tags.length ; i++) {
			taglist.push(req.body.tags[i]["label"])
		}
		resolve(taglist)
	})
	p1.then(taglist=>{
		console.log(taglist)
		db.collection('question').doc(req.body.question_id).update({
			tags: taglist
		})
		.then(()=>{
			console.log(question_id, "Gud")
			res.send("Tagged Question Successfully!")
		})
		.catch(error=>{
			res.send("Error in Tagging Question")
		})
	})

})

app.post('/add-tags', (req,res)=>{
	let tagRef = db.collection('tags');
	val_to_add = req.body.label
	val_to_add = val_to_add.toLowerCase()
	val_to_add = val_to_add.trim()


	let query = tagRef.where('label', '==', val_to_add).get()
	  .then(snapshot => {
	    if (snapshot.empty) {
	      
		    let data = {
				label: (val_to_add)
			}
			let addTags = db.collection('tags').add(data)
				.then(ref =>{
					res.send({response: "Tag Added"})
					console.log("Added tag with id: ", ref.id)
				})
				.catch(error=>{

					res.send({response: "Couldn't add tag to DB"})
					console.log("DB error while adding tag: ", error)
				})
		}
	    else{
	    	res.status(200).send({response: "The tag already exists"})
	    }  
	  })
	  .catch(err => {
	    console.log('Error getting documents', err);
	  });
})

app.post('/find-tags', (req,res)=>{
	let tagRef = db.collection('tags')
  	const alltags = tagRef.get()
  	.then(snapshot => {
  		let send_ret = new Promise((resolve1, reject1)=>{
				let ret = []
				snapshot.forEach(doc =>{
					// console.log(doc.id, "=>", doc.data())
					let add_id = new Promise((resolve, reject) =>{
						let temp = doc.data()
						temp["key"] = doc.id
						resolve(temp)
					})
					add_id.then(temp=>{ret.push(temp)})
				})
				resolve1(ret)
			})
			send_ret.then(ret=>{res.send(ret)})

	  })
	  .catch(err => {
	    console.log('Error getting documents', err);
	  });
});

/**
* Permanently delete a file, skipping the trash.
*
* @param {String} fileId ID of the file to delete.
*/
function deleteFile(fileId) {
  
}

app.post('/delete-question', (req,res)=>{
	db.collection('question').doc(req.body.question_id).delete()
		.then(()=>{
			console.log("Deleted Question: ", req.body.question_id)
			deleteFile(req.body.question_link)
			if (req.body.answer_link!="")
			{
				deleteFile(req.body.answer_link)
			}
			res.send("Deleted Question")
		})
		.catch(error =>{
			console.log(error)
			res.send("Error in Deleting Question")
		})
})

app.post('/delete-tag', (req,res)=>{
	db.collection('tags').doc(req.body.key).delete()
		.then(()=>{
			console.log("Deleted Tag")
			res.send("Deleted Tag")
		})
		.catch(error =>{
			console.log(error)
			res.send("Error in Deleting Tag")
		})
})

app.post('/edit-question', (req,res)=>{
	db.collection('question').doc(req.body.id).update({
		subject: req.body.subject,
		session: req.body.session,
		year: req.body.year,
		session: req.body.session,
		paper: req.body.paper,
		difficulty: req.body.difficulty,
		description: req.body.description,
		answer: req.body.answer
	})
	.then(()=>{
		console.log("Edited Question: ", req.body.id)
		res.send("Edited Question Successfully!")
	})
	.catch(error=>{
		console.log(error)
		res.send("Error in Editing Question")
	})	
})

app.use(express.static(path.join(__dirname, 'pastpaper/build')));  
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'pastpaper/build', 'index.html'));
});


app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
);