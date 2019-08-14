const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require("multer");
const fs = require('fs');
const { google } = require('googleapis');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';
const readline = require('readline');
// const PORT = process.env.PORT || 2001;
const PORT = 2001;
// The authdata will be stored in this global variable. Pass this auth data
// to each function call.
var auth_data;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'pastpaper/build')));
	
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'pastpaper/build', 'index.html'));
});

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), saveAuth);
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

function uploadFile(auth, name) {
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
	    // Handle error
	    console.error(err);
	  } else {
	    console.log('File Id: ', file.data.id);
	  }
	});
}

function shareFolder(auth) {
	var permissions ={
	    'type': 'anyone',
	    'role': 'reader',
	  };
	const drive = google.drive({version: 'v3', auth});
	drive.permissions.create({
	      fileId: '1GfTFUiZQmhpHLAYv-7AX0xQRsrOtgbFk',
	      resource: permissions,
	  }, function(err,result){
	        if(err) console.log(err) 
	        else console.log(result)
	    });
}

function makeFolder(auth) {
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
		console.error(err);
	  } else {
		console.log('Folder Id: ', file);
	  }
	});
}

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        /*
          Files will be saved in the 'uploads' directory. Make
          sure this directory already exists!
        */
        cb(null, './files');
      },
      filename: function(req, file, cb){
      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
   },   
    });
    // create the multer instance that will be used to upload/save the file
    const upload = multer({ storage });

app.post('/uploadpic', upload.single('selectedFile'), (req, res) => {
	let filename = req.file.filename;
	console.log(filename);
	fileUpload(auth_data,filename).then(fileid =>{
		console.log("Drive id of file is: ", fileid);
	})
	// uploadFile(auth_data,filename);

	// await unlinkAsync(filename) //COULD GIVE ERROR. NEEDS PATH. CAN'T TEST DUE TO GIT ISSUES
      /*
        We now have a new req.file object here. At this point the file has been saved
        and the req.file.filename value will be the name returned by the
        filename() function defined in the diskStorage configuration. Other form fields
        are available here in req.body.
      */
      // res.send("File Uploaded");
    });


app.post('/upload-question', (req, res) => {
  console.log(req.body);
});

 
app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
);