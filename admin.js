// admin.js
import { auth, db, onAuthStateChanged } from './firebase-config.js';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Elements
const adminMain = document.getElementById("adminMain");
const totalParticipantsEl = document.getElementById("totalParticipants");
const categoryCounts = {
  Plastic: document.getElementById("PlasticCount"),
  Metal: document.getElementById("MetalCount"),
  Glass: document.getElementById("GlassCount"),
  Paper: document.getElementById("PaperCount"),
  Cardboard: document.getElementById("CardboardCount"),
  Trash: document.getElementById("TrashCount")
};
const exportCSVBtn = document.getElementById("exportCSV");
const exportJSONBtn = document.getElementById("exportJSON");

// ✅ List of admin emails
const ADMIN_EMAILS = ["admin@himvillageprahari.com", "amsanjeev28@gmail.com"];

// ---------------------
// LOAD STATS
// ---------------------
async function loadStats() {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    totalParticipantsEl.textContent = usersSnapshot.size;

    const counts = { Plastic:0, Metal:0, Glass:0, Paper:0, Cardboard:0, Trash:0 };

    usersSnapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.progress) {
        counts.Plastic += data.progress.plastic || 0;
        counts.Metal += data.progress.metal || 0;
        counts.Glass += data.progress.glass || 0;
        counts.Paper += data.progress.paper || 0;
        counts.Cardboard += data.progress.cardboard || 0;
        counts.Trash += data.progress.trash || 0;
      }
    });

    // Update DOM
    for (const key in counts) {
      categoryCounts[key].textContent = counts[key];
    }

  } catch (err) {
    console.error("Error loading stats:", err);
    alert("Failed to load admin stats. Check console.");
  }
}

// ---------------------
// EXPORT HANDLERS
// ---------------------
exportCSVBtn.addEventListener("click", async () => {
  const snapshot = await getDocs(collection(db, "uploads"));
  const uploadsData = snapshot.docs.map(doc => doc.data());
  let csv = "userId,category,imageURL,timestamp\n";
  uploadsData.forEach(r => {
    csv += `${r.userId},${r.category},${r.imageURL},${r.timestamp}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "uploads.csv"; a.click();
  URL.revokeObjectURL(url);
});

exportJSONBtn.addEventListener("click", async () => {
  const snapshot = await getDocs(collection(db, "uploads"));
  const uploadsData = snapshot.docs.map(doc => doc.data());
  const blob = new Blob([JSON.stringify(uploadsData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "uploads.json"; a.click();
  URL.revokeObjectURL(url);
});

// ---------------------
// ADMIN AUTH CHECK
// ---------------------
onAuthStateChanged(auth, async user => {
  if (!user) return window.location.href = "index.html";

  if (!ADMIN_EMAILS.includes(user.email)) {
    alert("Access Denied: You are not an admin.");
    return window.location.href = "index.html";
  }

  // Show admin content
  adminMain.style.display = "block";

  // Load stats
  loadStats();
});
