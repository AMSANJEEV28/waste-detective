// dashboard.js
import { auth, db, onAuthStateChanged } from './firebase-config.js';
import { doc, getDoc } from 'firebase/firestore';

const userStatus = document.getElementById('userStatus');
const statusDiv = document.getElementById('status');
const progressTable = document.getElementById('progressTable');
const totalPointsEl = document.getElementById('totalPoints');
const totalImagesEl = document.getElementById('totalImages');

let currentUser = null;

// ---------------------
// LOAD DASHBOARD DATA
// ---------------------
async function loadDashboard() {
  if (!currentUser) return;
  statusDiv.textContent = "Loading your progress...";

  try {
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      statusDiv.textContent = "No progress data found. Start uploading images!";
      return;
    }

    const userData = userSnap.data();
    const progress = userData.progress || {};
    const categories = ["plastic","metal","glass","paper","cardboard","trash"];

    progressTable.innerHTML = "";
    let totalImages = 0;

    categories.forEach(cat => {
      const count = progress[cat] || 0;
      totalImages += count;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cat.charAt(0).toUpperCase() + cat.slice(1)}</td>
        <td>${count}</td>
        <td>2</td>
      `;
      progressTable.appendChild(tr);
    });

    // Update total points and images
    totalPointsEl.textContent = userData.totalPoints || 0;
    totalImagesEl.textContent = totalImages;

    // Update progress bars
    const moduleCompletion = userData.moduleCompleted ? 100 : 0;
    const totalUploadsTarget = 12; // 6 categories * 2
    const uploadCompletion = Math.min(Math.round((totalImages / totalUploadsTarget) * 100), 100);
    const totalPointsTarget = 12;
    const pointsCompletion = Math.min(Math.round((userData.totalPoints / totalPointsTarget) * 100), 100);

    document.getElementById('moduleProgressBar').style.width = moduleCompletion + '%';
    document.getElementById('uploadProgressBar').style.width = uploadCompletion + '%';
    document.getElementById('pointsProgressBar').style.width = pointsCompletion + '%';

    statusDiv.textContent = "Progress loaded successfully!";
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "Error loading dashboard: " + err.message;
  }
}

// ---------------------
// AUTH STATE CHANGE
// ---------------------
onAuthStateChanged(auth, user => {
  currentUser = user;
  if (user) {
    userStatus.textContent = `Signed in as ${user.displayName || user.email}`;
    loadDashboard();
  } else {
    userStatus.textContent = "Not signed in. Please login from Home page.";
    statusDiv.textContent = "";
  }
});
