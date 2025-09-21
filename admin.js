import { auth, GoogleAuthProvider, signInWithPopup } from './firebase-config.js';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ----- 2️⃣ Admin Emails -----
const ADMIN_EMAILS = ["admin@himvillageprahari", "amsanjeev28@gmail.com"];

// ----- 3️⃣ Auth Check -----
auth.onAuthStateChanged((user) => {
  if (user) {
    if (ADMIN_EMAILS.includes(user.email)) {
      // User is admin, load dashboard
      loadAdminDashboard();
    } else {
      alert("Access Denied: You are not an admin.");
      window.location.href = "/"; // redirect to home
    }
  } else {
    window.location.href = "/login"; // redirect to login
  }
});

// ----- 4️⃣ Load Admin Dashboard -----
async function loadAdminDashboard() {
  try {
    const usersSnapshot = await db.collection("users").get();

    // Total participants
    document.getElementById("totalParticipants").innerText = usersSnapshot.size;

    // Initialize category counts
    const categoryCounts = {
      Plastic: 0,
      Metal: 0,
      Glass: 0,
      Paper: 0,
      Cardboard: 0,
      Trash: 0
    };

    // Sum uploads from all users
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      const progress = data.progress || {};

      categoryCounts.Plastic += progress.plastic || 0;
      categoryCounts.Metal += progress.metal || 0;
      categoryCounts.Glass += progress.glass || 0;
      categoryCounts.Paper += progress.paper || 0;
      categoryCounts.Cardboard += progress.cardboard || 0;
      categoryCounts.Trash += progress.trash || 0;
    });

    // Update HTML
    for (let cat in categoryCounts) {
      document.getElementById(`${cat}Count`).innerText = categoryCounts[cat];
    }

  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
}


// ----- 5️⃣ Export JSON -----
document.getElementById("exportJSON").addEventListener("click", async () => {
  const uploadsSnapshot = await db.collection("uploads").get();
  const uploadsData = uploadsSnapshot.docs.map(doc => doc.data());

  const blob = new Blob([JSON.stringify(uploadsData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "uploads.json";
  a.click();
  URL.revokeObjectURL(url);
});

// ----- 6️⃣ Export CSV -----
document.getElementById("exportCSV").addEventListener("click", async () => {
  const uploadsSnapshot = await db.collection("uploads").get();
  const uploadsData = uploadsSnapshot.docs.map(doc => doc.data());

  let csv = "userId,category,imageURL,timestamp\n";
  uploadsData.forEach(row => {
    csv += `${row.userId},${row.category},${row.imageURL},${row.timestamp}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "uploads.csv";
  a.click();
  URL.revokeObjectURL(url);
});
