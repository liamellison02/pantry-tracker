// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBL7HoVtjSl2RjuZ9Hk5zDLc6lLG4SsjIo",
  authDomain: "pantry-tracker-48eb0.firebaseapp.com",
  projectId: "pantry-tracker-48eb0",
  storageBucket: "pantry-tracker-48eb0.appspot.com",
  messagingSenderId: "284249088323",
  appId: "1:284249088323:web:0d3528a5cf256acc71cff6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {firestore}