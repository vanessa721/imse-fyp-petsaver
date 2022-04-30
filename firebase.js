/*
Description: Firebase config page
Purpose: export firebase component 
*/
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDWrdHMGHCPRlvLkGJ5tSzqFt8iYM7FGPY",
  authDomain: "petsaver-1fa7d.firebaseapp.com",
  projectId: "petsaver-1fa7d",
  storageBucket: "petsaver-1fa7d.appspot.com",
  messagingSenderId: "75338640656",
  appId: "1:75338640656:web:0d6a66940c296f926c4995",
  measurementId: "G-8XQ7R549H4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
