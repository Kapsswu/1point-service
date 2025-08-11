// firebaseauth.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { saveUserProfile } from "./firebasefirestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIjDHdyokcHvzfzsAc5kK0tBaJxpKBwgY",
  authDomain: "point-service-c2fcb.firebaseapp.com",
  projectId: "point-service-c2fcb",
  storageBucket: "point-service-c2fcb.appspot.com",
  messagingSenderId: "77473043188",
  appId: "1:77473043188:web:8dc46646d5237291c6c4a1",
  measurementId: "G-MTVG8TYHDG"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Helper function to show messages
function showMessage(element, text, isError = true) {
  element.textContent = text;
  element.style.color = isError ? "#b00020" : "#007700";
  element.style.display = "block";
}

// Helper function to validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// -- Sign Up Logic --
const signUpBtn = document.getElementById("submitSignUp");
if (signUpBtn) {
  signUpBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("rEmail").value.trim();
    const password = document.getElementById("rPassword").value.trim();
    const agreeTerms = document.getElementById("agree-terms").checked;
    const message = document.getElementById("signUpMessage");

    message.style.display = "none";

    if (!email || !password) {
      showMessage(message, "⚠️ Email and password are required.");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage(message, "⚠️ Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      showMessage(message, "⚠️ Password should be at least 6 characters.");
      return;
    }

    if (!agreeTerms) {
      showMessage(message, "⚠️ You must agree to the terms.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Create user profile data
      const userData = {
        uid: uid,
        email: email,
        createdAt: new Date().toISOString()
      };

      // Save profile to Firestore
      await saveUserProfile(uid, userData);

      // Send email verification
      await sendEmailVerification(userCredential.user);

      alert("✅ Account created! A verification email has been sent.");
      window.location.href = "auth.html";
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showMessage(message, "⚠️ This email is already registered. Try signing in.");
      } else if (error.code === "auth/weak-password") {
        showMessage(message, "⚠️ Password should be at least 6 characters.");
      } else {
        showMessage(message, "❌ " + error.message);
      }
    }
  });
}

// -- Sign In Logic --
const signInBtn = document.getElementById("submitSignIn");
if (signInBtn) {
  signInBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("signInMessage");

    message.style.display = "none";

    if (!email || !password) {
      showMessage(message, "⚠️ Email and password are required.");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage(message, "⚠️ Please enter a valid email address.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        showMessage(message, "⚠️ Please verify your email before signing in.");
        return;
      }

      // Redirect on successful login
      window.location.href = "index.html";
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        showMessage(message, "❌ No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        showMessage(message, "❌ Incorrect password.");
      } else {
        showMessage(message, "❌ " + error.message);
      }
    }
  });
}

// -- Forgot Password Logic --
const forgotLink = document.getElementById("forgotPasswordLink");
if (forgotLink) {
  forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = window.prompt("Enter your email to reset password:");

    if (!email) return alert("⚠️ Email is required to reset password.");
    if (!isValidEmail(email)) return alert("⚠️ Please enter a valid email address.");

    try {
      await sendPasswordResetEmail(auth, email);
      alert("✅ Password reset link sent to your email.");
    } catch (err) {
      alert("❌ " + err.message);
    }
  });
}
