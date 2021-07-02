import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyCb1Q2Uj41yIBlpDRIQFr1JN9zeg5gkvVY",
    authDomain: "typetest-71455.firebaseapp.com",
    projectId: "typetest-71455",
    storageBucket: "typetest-71455.appspot.com",
    messagingSenderId: "533650024794",
    // Initialize Firebase
    appId: "1:533650024794:web:48309e2df43d7744806b63"
};

if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
}

firebase.getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(user => {
            resolve(user);
        }, reject);
    })
}

var db = firebase.firestore();

export { firebase, db };
