// index.js
// ✅ Works with Vite + Netlify + Firebase environment variables

import { 
  auth, provider, db,
  signInWithPopup, signOut, onAuthStateChanged,
  doc, setDoc, getDoc, serverTimestamp
} from './firebase-config.js';

// ---------------------
// DOM ELEMENTS
// ---------------------
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const joinBtn = document.getElementById('joinBtn');
const learnModuleBtn = document.getElementById('learnModuleBtn');
const profileDiv = document.getElementById('profile');
const usernameEl = document.getElementById('username');
const useremailEl = document.getElementById('useremail');
const moduleProgressEl = document.getElementById('moduleProgress');
const userPointsEl = document.getElementById('userpoints');

console.log("Index.js loaded");

// ---------------------
// LOGIN WITH GOOGLE
// ---------------------
loginBtn.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || '',
        email: user.email || '',
        totalPoints: 0,
        moduleProgressSection: 0,
        moduleCompleted: false,
        progress: { plastic:0, metal:0, glass:0, paper:0, cardboard:0, trash:0 },
        createdAt: serverTimestamp()
      });
    }

  } catch (err) {
    console.error("Login error:", err);
    alert('Login failed: ' + err.message);
  }
});

// ---------------------
// LOGOUT
// ---------------------
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (err) {
    console.error("Sign out error:", err);
  }
});

// ---------------------
// NAVIGATION
// ---------------------
learnModuleBtn.addEventListener('click', () => window.location.href = 'learningmodule.html');
joinBtn.addEventListener('click', () => window.location.href = 'upload.html');

// ---------------------
// AUTH STATE CHANGE
// ---------------------
const totalModuleSections = 5;
const maxPoints = 12;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    profileDiv.style.display = 'block';
    usernameEl.textContent = user.displayName || 'User';
    useremailEl.textContent = user.email || '';

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    let data;
    if (snap.exists()) {
      data = snap.data();
    } else {
      data = {
        totalPoints: 0,
        moduleProgressSection: 0,
        moduleCompleted: false,
        progress: { plastic:0, metal:0, glass:0, paper:0, cardboard:0, trash:0 }
      };
      await setDoc(userRef, { ...data, name: user.displayName || '', email: user.email || '', createdAt: serverTimestamp() });
    }

    // Update UI
    const modulePercent = data.moduleCompleted
      ? 100
      : Math.round((data.moduleProgressSection || 0)/totalModuleSections*100);
    const assignmentPercent = Math.round((data.totalPoints || 0)/maxPoints*100);

    moduleProgressEl.textContent = `${modulePercent}%`;
    userPointsEl.textContent = `${assignmentPercent}%`;

    // Buttons / certificate logic
    const categories = ["plastic","metal","glass","paper","cardboard","trash"];
    const allAssignmentsDone = categories.every(cat => (data.progress[cat] || 0) >= 2);
    const certificateEligible = data.moduleCompleted && allAssignmentsDone && (data.totalPoints || 0) > 0;

    const existingCert = document.getElementById('certificateSection');
    if (certificateEligible && !existingCert) {
      const certDiv = document.createElement('div');
      certDiv.id = 'certificateSection';
      certDiv.style.marginTop = '15px';
      certDiv.innerHTML = `
        <h3>🎉 Congratulations! You have completed all modules and assignments!</h3>
        <button id="getCertificateBtn" class="hv-btn">Get Certificate</button>
      `;
      profileDiv.appendChild(certDiv);
      document.getElementById('getCertificateBtn').addEventListener('click', () => {
        window.location.href = 'certificate.html';
      });
      learnModuleBtn.style.display = 'none';
      joinBtn.style.display = 'none';
    } else if (!certificateEligible && existingCert) {
      existingCert.remove();
      learnModuleBtn.style.display = data.moduleCompleted ? 'none' : 'inline-block';
      joinBtn.style.display = data.moduleCompleted ? 'inline-block' : 'none';
    }

  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    profileDiv.style.display = 'none';
    learnModuleBtn.style.display = 'none';
    joinBtn.style.display = 'none';
    moduleProgressEl.textContent = '0%';
    userPointsEl.textContent = '0%';
  }
});
