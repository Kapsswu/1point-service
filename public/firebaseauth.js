import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const actionCodeSettings = {
  url: 'https://point-service-c2fcb.web.app/auth.html',
  handleCodeInApp: true
};

// 🔐 SIGN UP
const signUpBtn = document.getElementById("submitSignUp");
if (signUpBtn) {
  signUpBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("rEmail").value.trim();
    const password = document.getElementById("rPassword").value.trim();
    const agreeTerms = document.getElementById("agree-terms").checked;
    const message = document.getElementById("signUpMessage");

    message.style.display = "none";
    if (!agreeTerms) {
      message.textContent = "⚠️ You must agree to the terms.";
      message.style.display = "block";
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("loggedInUserId", userCredential.user.uid);
      window.location.href = "index.html";
    } catch (error) {
      message.textContent = error.message;
      message.style.display = "block";
    }
  });
}

// ✉️ SEND SIGN-IN LINK
const signInBtn = document.getElementById("submitSignIn");
if (signInBtn) {
  signInBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("signInMessage");
    message.style.display = "none";

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      alert("✅ Sign-in link sent! Check your email.");
    } catch (error) {
      message.textContent = error.message;
      message.style.display = "block";
    }
  });
}

// ✅ COMPLETE SIGN-IN WITH EMAIL LINK
if (isSignInWithEmailLink(auth, window.location.href)) {
  (async () => {
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Please enter your email to confirm sign-in:");
    }
    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem("emailForSignIn");
      localStorage.setItem("loggedInUserId", result.user.uid);
      window.location.href = "index.html";
    } catch (error) {
      alert("❌ Sign-in failed: " + error.message);
    }
  })();
}

// 🔁 FORGOT PASSWORD
const forgotLink = document.getElementById("forgotPasswordLink");
if (forgotLink) {
  forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = window.prompt("Enter your email for password reset:");
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert("✅ Password reset email sent!");
      } catch (err) {
        alert("❌ " + err.message);
      }
    }
  });
}
