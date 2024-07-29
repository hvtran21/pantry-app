// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvAJNFkPYUga5s3TSnL57mPCMTv4ABEZ4",
  authDomain: "pantry-app-83553.firebaseapp.com",
  projectId: "pantry-app-83553",
  storageBucket: "pantry-app-83553.appspot.com",
  messagingSenderId: "753992721484",
  appId: "1:753992721484:web:45a715c0b5a5a6878600e9",
  measurementId: "G-EPWKMZ3BDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app, db};