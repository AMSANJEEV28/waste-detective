// certificate.js
import { auth, db, onAuthStateChanged } from './firebase-config.js';
import { doc, getDoc } from 'firebase/firestore';

const userStatus = document.getElementById('userStatus');
const statusDiv = document.getElementById('status');
const certBtn = document.getElementById('certBtn');

let currentUser = null;

// ---------------------
// CHECK ELIGIBILITY
// ---------------------
async function checkEligibility() {
  if (!currentUser) return;

  const userRef = doc(db, 'users', currentUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    const progress = data.progress || {};
    const categories = ['plastic', 'metal', 'glass', 'paper', 'cardboard', 'trash'];

    const eligible = categories.every(cat => (progress[cat] || 0) >= 2);

    if (eligible) {
      certBtn.disabled = false;
      certBtn.textContent = "Download Certificate";
      statusDiv.textContent = "Congratulations! 🎉 You have uploaded at least 2 images in each category.";
    } else {
      certBtn.disabled = true;
      certBtn.textContent = "Upload at least 2 images per category to unlock certificate";
      statusDiv.textContent = "You need at least 2 images per category to unlock certificate.";
    }

  } else {
    statusDiv.textContent = "User data not found. Upload at least one image first.";
  }
}

// ---------------------
// GENERATE PDF CERTIFICATE
// ---------------------
function generateCertificate(name) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1040, 720]
  });

  const img = new Image();
  img.src = 'digital_certificate.jpg';
  img.onload = () => {
    doc.addImage(img, 'JPG', 0, 0, 1040, 720);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(50);
    doc.setTextColor(0, 102, 51);
    doc.text(name, 520, 360, { align: "center" });

    doc.save(`WasteDetective_Certificate_${name}.pdf`);
  };
}

// ---------------------
// AUTH STATE
// ---------------------
onAuthStateChanged(auth, user => {
  currentUser = user;
  if (user) {
    userStatus.textContent = `Signed in as ${user.displayName || user.email}`;
    checkEligibility();
  } else {
    userStatus.textContent = "Not signed in. Please login from Home page.";
    statusDiv.textContent = "";
  }
});

// ---------------------
// BUTTON CLICK
// ---------------------
certBtn.addEventListener('click', () => {
  if (!currentUser) return alert("Please login first.");
  const name = currentUser.displayName || currentUser.email || "Participant";
  generateCertificate(name);
});
