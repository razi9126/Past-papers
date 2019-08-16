const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require("multer");
const fs = require('fs');
const { google } = require('googleapis');
var firebase = require("firebase/app");

const SCOPES = ['https://www.googleapis.com/auth/drive']; // If modifying these scopes, delete token.json.
const TOKEN_PATH = 'token.json';
const readline = require('readline');
const PORT = 2001; // const PORT = process.env.PORT || 2001;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'pastpaper/build')));

const admin = require('firebase-admin');
let serviceAccount = require('./past-papers-9566f-firebase-adminsdk-65q4d-c2f9a65bf1.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://past-papers-9566f.firebaseio.com"
});
let db = admin.firestore();

// The authdata will be stored in this global variable. Pass this auth data // to each function call.
var auth_data; 

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'pastpaper/build', 'index.html'));
});

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
	console.log("Authentication complete");
	// uploadFile(auth_data,'photo.jpeg');
}

const fileUpload = (auth,name) => {
  return new Promise((resolve, reject) => {
		const drive = google.drive({version: 'v3', auth});
		const filepath = 'files/' + name
		var folderId = '1GfTFUiZQmhpHLAYv-7AX0xQRsrOtgbFk';
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
		      fileId: '1GfTFUiZQmhpHLAYv-7AX0xQRsrOtgbFk',
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
		  'name': 'Question-Images',
		  'mimeType': 'application/vnd.google-apps.folder'
		};
		drive.files.create({
		  resource: fileMetadata,
		  fields: 'id'
		}, function (err, file) {
		  if (err) {
			// Handle error
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

app.post('/uploadpic', upload.any(), (req, res) => {
	const promises = req.files.map((file)=>{
		if (file.fieldname=='question'){
			let filename = file.filename;
			// returning the promise over here
			return fileUpload(auth_data,filename).then(fileid =>{
				console.log("Drive id of question is: ", fileid);
				fs.unlink(file.path, function (err) {
					if(err){
						console.log("Error in deleting question from server", err)
					}
					else{
						console.log("Deleted from folder");
					}
				});
			}).catch(
			   error => {
			   	console.log("Error in upload to drive: ",error)
			   }
			);
		}
		if (file.fieldname=='answer'){
			let filename = file.filename;
			return fileUpload(auth_data,filename).then(fileid =>{
				console.log("Drive id of answer is: ", fileid);
				fs.unlink(file.path, function (err) {
					if(err){
						console.log("Error in deleting answer from server", err)
					}
					else{
						console.log("Deleted from folder");
					}
				});
			}).catch(
			   error => {
			   	console.log("Error in upload to drive: ",error)
			   }
			);
		}
	})
	Promise.all(promises).then(()=>{
		console.log("Done uploading both files")
		res.send("Both uploads completed")
	});
});

app.post('/upload-question', (req, res) => {
  console.log(req.body);
});

app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
);