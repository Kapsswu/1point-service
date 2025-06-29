// firebaseauth.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBIjDHdyokcHvzfzsAc5kK0tBaJxpKBwgY",
  authDomain: "point-service-c2fcb.firebaseapp.com",
  projectId: "point-service-c2fcb",
  storageBucket: "point-service-c2fcb.appspot.com",
  messagingSenderId: "77473043188",
  appId: "1:77473043188:web:8dc46646d5237291c6c4a1",
  measurementId: "G-MTVG8TYHDG"
};

// 🔌 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 📩 Email link sign-in settings
const actionCodeSettings = {
  url: window.location.href,
  handleCodeInApp: true
};

// 🆕 Sign Up (with password)
const signUpBtn = document.getElementById("submitSignUp");
if (signUpBtn) {
  signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        localStorage.setItem("loggedInUserId", userCredential.user.uid);
        window.location.href = "index.html";
      })
      .catch((error) => {
        const message = document.getElementById("signUpMessage");
        message.textContent = error.message;
        message.style.display = "block";
      });
  });
}

// ✉️ Send Sign-In Email Link (passwordless)
const signInBtn = document.getElementById("submitSignIn");
if (signInBtn) {
  signInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
        alert("✅ Sign-in link sent! Check your email.");
      })
      .catch((error) => {
        const message = document.getElementById("signInMessage");
        message.textContent = error.message;
        message.style.display = "block";
      });
  });
}

// ✅ Complete sign-in from link (if opened via email)
if (isSignInWithEmailLink(auth, window.location.href)) {
  let email = window.localStorage.getItem("emailForSignIn");
  if (!email) {
    email = window.prompt("Please provide your email for confirmation");
  }

  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      window.localStorage.removeItem("emailForSignIn");
      localStorage.setItem("loggedInUserId", result.user.uid);
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("❌ Sign-in failed: " + error.message);
    });
}

// 🔐 Forgot Password
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
