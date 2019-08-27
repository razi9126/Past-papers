var firebase = require("firebase");

const config = {
  apiKey: "AIzaSyDQj7y_2buxKiLDpHM9G86uLV6pZUJCq1g",
  authDomain: "past-papers-9566f.firebaseapp.com",
  databaseURL: "https://past-papers-9566f.firebaseio.com",
  projectId: "past-papers-9566f",
  storageBucket: "past-papers-9566f.appspot.com",
  messagingSenderId: "344546774584",
  appId: "1:344546774584:web:d6821d4619081909"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};
