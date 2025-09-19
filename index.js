// index.js
import {
  auth, db, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
  doc, setDoc, getDoc, serverTimestamp
} from './firebase-config.js';

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const joinBtn = document.getElementById('joinBtn');
const profileDiv = document.getElementById('profile');

loginBtn.addEventListener('click', async () => {
  console.log("Login button clicked"); // 🔍 Debug
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Login success:", result.user);

    const user = result.user;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
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
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Login failed: ' + err.message);
  }
});

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
});

joinBtn.addEventListener('click', () => {
  window.location.href = 'upload.html';
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginBtn.style.display = 'none';
    profileDiv.style.display = 'block';
    document.getElementById('username').textContent = user.displayName || 'User';
    document.getElementById('useremail').textContent = user.email || '';

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      document.getElementById('userpoints').textContent = snap.data().totalPoints || 0;
    }
  } else {
    loginBtn.style.display = 'inline-block';
    profileDiv.style.display = 'none';
  }
});
