// index.js
import {
  auth, db, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
  doc, setDoc, getDoc, serverTimestamp
} from './firebase-config.js';

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const joinBtn = document.getElementById('joinBtn');
const profileDiv = document.getElementById('profile');

console.log("Index.js loaded");

// Login with Google
loginBtn.addEventListener('click', async () => {
  console.log("Login button clicked");
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Login success:", result.user);

    const user = result.user;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      console.log("New user, creating document...");
      await setDoc(userRef, {
        name: user.displayName || '',
        email: user.email || '',
        totalPoints: 0,
        completed: false,
        createdAt: serverTimestamp(),
        progress: {
          plastic: 0, metal: 0, glass: 0,
          paper: 0, cardboard: 0, trash: 0
        }
      });
      console.log("User document created");
    } else {
      console.log("Existing user:", snap.data());
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Login failed: ' + err.message);
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (err) {
    console.error("Sign out error:", err);
  }
});

// Navigate to upload page
joinBtn.addEventListener('click', () => {
  console.log("Navigating to upload page");
  window.location.href = 'upload.html';
});

// Auth state change
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in:", user);
    loginBtn.style.display = 'none';
    profileDiv.style.display = 'block';
    document.getElementById('username').textContent = user.displayName || 'User';
    document.getElementById('useremail').textContent = user.email || '';

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      document.getElementById('userpoints').textContent = snap.data().totalPoints || 0;
      console.log("User points:", snap.data().totalPoints);
    } else {
      console.log("User document not found in Firestore");
    }
  } else {
    console.log("No user signed in");
    loginBtn.style.display = 'inline-block';
    profileDiv.style.display = 'none';
  }
});
