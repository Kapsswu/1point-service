// firebasefirestore.js (MODULAR)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ✅ Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBIjDHdyokcHvzfzsAc5kK0tBaJxpKBwgY",
  authDomain: "point-service-c2fcb.firebaseapp.com",
  projectId: "point-service-c2fcb",
  storageBucket: "point-service-c2fcb.appspot.com",
  messagingSenderId: "77473043188",
  appId: "1:77473043188:web:8dc46646d5237291c6c4a1",
  measurementId: "G-MTVG8TYHDG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Save User Profile Data
export async function saveUserProfile(uid, userData) {
  try {
    await setDoc(doc(db, "users", uid), userData);
    console.log("✅ User profile saved.");
  } catch (error) {
    console.error("❌ Error saving profile:", error);
  }
}

// ✅ Load User Profile Data
export async function loadUserProfile(uid) {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn("⚠️ No user profile found.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error loading profile:", error);
    return null;
  }
}
