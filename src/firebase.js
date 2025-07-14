import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
 
// Your web app's Firebase configuration For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC73q9Etsel_hjMVUWtNEQs_rBG-DfjyPg",
  authDomain: "nutrition-tracker-58608.firebaseapp.com",
  projectId: "nutrition-tracker-58608",
  storageBucket: "nutrition-tracker-58608.firebasestorage.app",
  messagingSenderId: "151879015538",
  appId:  "1:151879015538:web:33ff040a756ffabaabf6eb",
  measurementId: "G-FYN71JBWDS"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };