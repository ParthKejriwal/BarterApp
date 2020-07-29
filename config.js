import * as firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyCqywMruu4MtUynWBQzf7Ic1QleQD2hIlY",
    authDomain: "barter-app-14b03.firebaseapp.com",
    databaseURL: "https://barter-app-14b03.firebaseio.com",
    projectId: "barter-app-14b03",
    storageBucket: "barter-app-14b03.appspot.com",
    messagingSenderId: "170616226653",
    appId: "1:170616226653:web:b18ef01bdbb1bef5c85eb4"
  };

  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();