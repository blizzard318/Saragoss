// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJYmkYSH2tEANYLaCUYSAOMDWbWE4Ptzw",
  authDomain: "saragoss-fb5ab.firebaseapp.com",
  projectId: "saragoss-fb5ab",
  storageBucket: "saragoss-fb5ab.firebasestorage.app",
  messagingSenderId: "514133086317",
  appId: "1:514133086317:web:60597fd6f71b0b7136ef64",
  measurementId: "G-3H9MP75SXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);