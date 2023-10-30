import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getFirestore, getStorage} from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyCkL8nqhFkiAA3gZSOCRHrYbCFS7RhFRxs",
    authDomain: "whatsapp-2-81fbd.firebaseapp.com",
    projectId: "whatsapp-2-81fbd",
    storageBucket: "whatsapp-2-81fbd.appspot.com",
    messagingSenderId: "764395419609",
    appId: "1:764395419609:web:abbcf480cc8dc7ac468bc8"
};



// const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
// const db = app.firestore();
// const auth = app.auth();
// const provider = new firebase.auth.GoogleAuthProvider();


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();


// const provider = new initializeApp.auth.GoogleAuthProvider();


export {db, auth, provider}