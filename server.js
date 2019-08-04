const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT || 2001;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'pastpaper/build')));
    
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'pastpaper/build', 'index.html'));
  });
// }

 
app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
);