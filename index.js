import { auth, GoogleAuthProvider, signInWithPopup } from './firebase-config.js';

// // index.js
// import {
//   auth, db, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
//   doc, setDoc, getDoc, serverTimestamp
// } from './firebase-config.js';

// // ---------------------
// // DOM ELEMENTS
// // ---------------------
// const loginBtn = document.getElementById('loginBtn');
// const logoutBtn = document.getElementById('logoutBtn');
// const joinBtn = document.getElementById('joinBtn');
// const learnModuleBtn = document.getElementById('learnModuleBtn');
// const profileDiv = document.getElementById('profile');
// const usernameEl = document.getElementById('username');
// const useremailEl = document.getElementById('useremail');
// const moduleProgressEl = document.getElementById('moduleProgress');
// const userPointsEl = document.getElementById('userpoints');

// console.log("Index.js loaded");

// // ---------------------
// // LOGIN WITH GOOGLE
// // ---------------------
// loginBtn.addEventListener('click', async () => {
//   console.log("Login button clicked");
//   const provider = new GoogleAuthProvider();

//   try {
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;
//     console.log("Login success:", user);

//     const userRef = doc(db, 'users', user.uid);
//     const snap = await getDoc(userRef);

//     if (!snap.exists()) {
//       console.log("New user, creating Firestore document...");
//       await setDoc(userRef, {
//         name: user.displayName || '',
//         email: user.email || '',
//         totalPoints: 0,
//         moduleProgressSection: 0,
//         moduleCompleted: false,
//         progress: {
//           plastic: 0, metal: 0, glass: 0,
//           paper: 0, cardboard: 0, trash: 0
//         },
//         createdAt: serverTimestamp()
//       });
//       console.log("User document created");
//     } else {
//       console.log("Existing user:", snap.data());
//     }
//   } catch (err) {
//     console.error("Login error:", err);
//     alert('Login failed: ' + err.message);
//   }
// });

// // ---------------------
// // LOGOUT
// // ---------------------
// logoutBtn.addEventListener('click', async () => {
//   try {
//     await signOut(auth);
//     console.log("User signed out");
//   } catch (err) {
//     console.error("Sign out error:", err);
//   }
// });

// // ---------------------
// // NAVIGATION BUTTONS
// // ---------------------
// learnModuleBtn.addEventListener('click', () => {
//   window.location.href = 'learningmodule.html';
// });

// joinBtn.addEventListener('click', () => {
//   window.location.href = 'upload.html';
// });

// // ---------------------
// // AUTH STATE CHANGE
// // ---------------------
// const totalModuleSections = 5; // total sections in learning module
// const maxPoints = 12; // 2 per category * 6 categories

// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     console.log("User is signed in:", user);

//     // Show profile, hide login
//     loginBtn.style.display = 'none';
//     profileDiv.style.display = 'block';
//     usernameEl.textContent = user.displayName || 'User';
//     useremailEl.textContent = user.email || '';

//     const userRef = doc(db, 'users', user.uid);
//     const snap = await getDoc(userRef);

//     if (snap.exists()) {
//       const data = snap.data();
//       console.log("User Firestore data:", data);

//       // ---------------------
//       // MODULE PROGRESS
//       // ---------------------
//       const modulePercent = data.moduleCompleted
//         ? 100
//         : Math.round(((data.moduleProgressSection || 0) / totalModuleSections) * 100);

//       moduleProgressEl.textContent = `${modulePercent}%`;

//       // ---------------------
//       // ASSIGNMENT PROGRESS
//       // ---------------------
//       const assignmentPercent = Math.round((data.totalPoints || 0) / maxPoints * 100);
//       userPointsEl.textContent = `${assignmentPercent}%`;

//       console.log("Module Progress:", modulePercent + "%");
//       console.log("Assignment Progress:", assignmentPercent + "%");

//       // ---------------------
//       // BUTTON & CERTIFICATE LOGIC
//       // ---------------------
//       const categories = ["plastic","metal","glass","paper","cardboard","trash"];
//       let allAssignmentsDone = true;
//       categories.forEach(cat => {
//         if ((data.progress?.[cat] || 0) < 2) allAssignmentsDone = false;
//       });

//       if (data.moduleCompleted && allAssignmentsDone) {
//         learnModuleBtn.style.display = 'none';
//         joinBtn.style.display = 'none';

//         // Show congratulations / certificate
//         let existing = document.getElementById('certificateSection');
//         if (!existing) {
//           const certDiv = document.createElement('div');
//           certDiv.id = 'certificateSection';
//           certDiv.style.marginTop = '15px';
//           certDiv.innerHTML = `
//             <h3>🎉 Congratulations! You have completed all modules and assignments!</h3>
//             <button id="getCertificateBtn" class="hv-btn">Get Certificate</button>
//           `;
//           profileDiv.appendChild(certDiv);
//           document.getElementById('getCertificateBtn').addEventListener('click', () => {
//             window.location.href = 'certificate.html';
//           });
//         }

//       } else if (!data.moduleCompleted) {
//         learnModuleBtn.style.display = 'inline-block';
//         joinBtn.style.display = 'none';
//         const existing = document.getElementById('certificateSection');
//         if (existing) existing.remove();
//       } else if (data.moduleCompleted && !allAssignmentsDone) {
//         learnModuleBtn.style.display = 'none';
//         joinBtn.style.display = 'inline-block';
//         const existing = document.getElementById('certificateSection');
//         if (existing) existing.remove();
//       }

//     } else {
//       console.log("User document not found, creating default Firestore document...");
//       await setDoc(userRef, {
//         name: user.displayName || '',
//         email: user.email || '',
//         totalPoints: 0,
//         moduleProgressSection: 0,
//         moduleCompleted: false,
//         progress: {
//           plastic: 0, metal: 0, glass: 0,
//           paper: 0, cardboard: 0, trash: 0
//         },
//         createdAt: serverTimestamp()
//       });

//       // Set UI defaults
//       moduleProgressEl.textContent = `0%`;
//       userPointsEl.textContent = `0%`;
//       learnModuleBtn.style.display = 'inline-block';
//       joinBtn.style.display = 'none';
//     }

//   } else {
//     console.log("No user signed in");

//     // Show login, hide profile/buttons
//     loginBtn.style.display = 'inline-block';
//     profileDiv.style.display = 'none';
//     learnModuleBtn.style.display = 'none';
//     joinBtn.style.display = 'none';
//     moduleProgressEl.textContent = '0%';
//     userPointsEl.textContent = '0%';
//   }
// });




// index.js
import {
  auth, db, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
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
  console.log("Login button clicked");
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Login success:", user);

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      console.log("New user, creating Firestore document...");
      await setDoc(userRef, {
        name: user.displayName || '',
        email: user.email || '',
        totalPoints: 0,
        moduleProgressSection: 0,
        moduleCompleted: false,
        progress: {
          plastic: 0, metal: 0, glass: 0,
          paper: 0, cardboard: 0, trash: 0
        },
        createdAt: serverTimestamp()
      });
      console.log("User document created");
    } else {
      console.log("Existing user:", snap.data());
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
// NAVIGATION BUTTONS
// ---------------------
learnModuleBtn.addEventListener('click', () => {
  window.location.href = 'learningmodule.html';
});

joinBtn.addEventListener('click', () => {
  window.location.href = 'upload.html';
});

// ---------------------
// AUTH STATE CHANGE
// ---------------------
const totalModuleSections = 5; // total sections in learning module
const maxPoints = 12; // 2 per category * 6 categories

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in:", user);

    // Show profile & logout, hide login
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    profileDiv.style.display = 'block';
    usernameEl.textContent = user.displayName || 'User';
    useremailEl.textContent = user.email || '';

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      console.log("User Firestore data:", data);

      // ---------------------
      // MODULE PROGRESS
      // ---------------------
      const modulePercent = data.moduleCompleted
        ? 100
        : Math.round(((data.moduleProgressSection || 0) / totalModuleSections) * 100);
      moduleProgressEl.textContent = `${modulePercent}%`;

      // ---------------------
      // ASSIGNMENT PROGRESS
      // ---------------------
      const assignmentPercent = Math.round((data.totalPoints || 0) / maxPoints * 100);
      userPointsEl.textContent = `${assignmentPercent}%`;

      console.log("Module Progress:", modulePercent + "%");
      console.log("Assignment Progress:", assignmentPercent + "%");

      // ---------------------
      // BUTTON & CERTIFICATE LOGIC
      // ---------------------
      const categories = ["plastic","metal","glass","paper","cardboard","trash"];
      let allAssignmentsDone = false;

      if (data.progress) {
        allAssignmentsDone = categories.every(cat => (data.progress[cat] || 0) >= 2);
      }

      const certificateEligible = data.moduleCompleted === true && allAssignmentsDone === true && (data.totalPoints || 0) > 0;

      if (certificateEligible) {
        // Hide buttons
        learnModuleBtn.style.display = 'none';
        joinBtn.style.display = 'none';

        // Show certificate
        let existing = document.getElementById('certificateSection');
        if (!existing) {
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
        }
      } else {
        // Remove certificate section if exists
        const existing = document.getElementById('certificateSection');
        if (existing) existing.remove();

        // Decide which buttons to show
        if (!data.moduleCompleted) {
          learnModuleBtn.style.display = 'inline-block';
          joinBtn.style.display = 'none';
        } else if (data.moduleCompleted && !allAssignmentsDone) {
          learnModuleBtn.style.display = 'none';
          joinBtn.style.display = 'inline-block';
        }
      }

    } else {
      console.log("User document not found, creating default Firestore document...");
      await setDoc(userRef, {
        name: user.displayName || '',
        email: user.email || '',
        totalPoints: 0,
        moduleProgressSection: 0,
        moduleCompleted: false,
        progress: {
          plastic: 0, metal: 0, glass: 0,
          paper: 0, cardboard: 0, trash: 0
        },
        createdAt: serverTimestamp()
      });

      // Set UI defaults
      moduleProgressEl.textContent = `0%`;
      userPointsEl.textContent = `0%`;
      learnModuleBtn.style.display = 'inline-block';
      joinBtn.style.display = 'none';
    }

  } else {
    console.log("No user signed in");

    // Show login, hide profile & logout
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    profileDiv.style.display = 'none';
    learnModuleBtn.style.display = 'none';
    joinBtn.style.display = 'none';
    moduleProgressEl.textContent = '0%';
    userPointsEl.textContent = '0%';
  }
});
