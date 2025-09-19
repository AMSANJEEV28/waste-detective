// firebase-config.js
// Save this in your project root
// Using Firebase SDK v12

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, serverTimestamp, increment } 
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAR42iwcRLkywkiu83Oix7S5z_YxBq5rgc",
  authDomain: "waste-detective-7214b.firebaseapp.com",
  projectId: "waste-detective-7214b",
  storageBucket: "waste-detective-7214b.appspot.com",
  messagingSenderId: "1047902917063",
  appId: "1:1047902917063:web:59257f2f5156fea58a89e2",
  measurementId: "G-RM5VFX0XMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for other pages
export {
  app,
  auth,
  db,
  storage,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  increment,
  ref,
  uploadBytes,
  getDownloadURL
};
