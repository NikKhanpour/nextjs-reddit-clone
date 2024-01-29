// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnAN-I_rC9HmTOm-To7b7jd5CwwW5soK4",
  authDomain: "my-reddit-clone-8ca2a.firebaseapp.com",
  projectId: "my-reddit-clone-8ca2a",
  storageBucket: "my-reddit-clone-8ca2a.appspot.com",
  messagingSenderId: "702231906094",
  appId: "1:702231906094:web:dbb23acae7dfdbf3009cbf",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, firestore, auth, storage };
