// ----- 1️⃣ Firebase Config -----
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
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
    // Total participants
    const usersSnapshot = await db.collection("users").get();
    document.getElementById("totalParticipants").innerText = usersSnapshot.size;

    // Uploads per category
    const uploadsSnapshot = await db.collection("uploads").get();
    const categoryCounts = {
      Plastic: 0,
      Metal: 0,
      Glass: 0,
      Paper: 0,
      Cardboard: 0,
      Trash: 0
    };

    uploadsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (categoryCounts[data.category] !== undefined) {
        categoryCounts[data.category]++;
      }
    });

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
