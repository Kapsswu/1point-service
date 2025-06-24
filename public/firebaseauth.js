// firebaseauth.js – Handles Firebase authentication

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBIjDHdyokcHvzfzsAc5kK0tBaJxpKBwgY",
  authDomain: "point-service-c2fcb.firebaseapp.com",
  projectId: "point-service-c2fcb",
  storageBucket: "point-service-c2fcb.firebasestorage.app",
  messagingSenderId: "77473043188",
  appId: "1:77473043188:web:8dc46646d5237291c6c4a1",
  measurementId: "G-MTVG8TYHDG"
};

// 🔌 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔐 Sign Up
const signUpBtn = document.getElementById("submitSignUp");
if (signUpBtn) {
  signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // ✅ Save to localStorage
        localStorage.setItem("loggedInUserId", userCredential.user.uid);

        // ✅ Redirect to homepage
        window.location.href = "index.html";
      })
      .catch((error) => {
        const message = document.getElementById("signUpMessage");
        message.textContent = error.message;
        message.style.display = "block";
      });
  });
}

// 🔓 Sign In
const signInBtn = document.getElementById("submitSignIn");
if (signInBtn) {
  signInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        localStorage.setItem("loggedInUserId", userCredential.user.uid);
        window.location.href = "index.html";
      })
      .catch((error) => {
        const message = document.getElementById("signInMessage");
        message.textContent = error.message;
        message.style.display = "block";
      });
  });
}

// 🔑 Forgot Password
const forgotLink = document.getElementById("forgotPasswordLink");
if (forgotLink) {
  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    const email = prompt("Enter your email to reset password:");
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => alert("✅ Reset email sent. Check your inbox."))
        .catch((err) => alert("❌ " + err.message));
    }
  });
}

