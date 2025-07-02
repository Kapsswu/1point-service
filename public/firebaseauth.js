// firebaseauth.js (MODULAR STYLE)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendPasswordResetEmail,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// ✅ Config
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
const auth = getAuth(app);

// Action code settings
const actionCodeSettings = {
  url: 'https://point-service-c2fcb.web.app/auth.html',
  handleCodeInApp: true
};

// 🔐 Sign Up
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

    // ✅ Send email link to login instead of signing in immediately
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem("emailForSignIn", email);

    alert("✅ Account created. A login link has been sent to your email.");
    window.location.href = "auth.html";
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      message.textContent = "⚠️ This email is already registered. Try signing in.";
    } else if (error.code === "auth/weak-password") {
      message.textContent = "⚠️ Password should be at least 6 characters.";
    } else {
      message.textContent = "❌ " + error.message;
    }
    message.style.display = "block";
  }
});

// 📩 Sign-In Link
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const signInBtn = document.getElementById("submitSignIn");
if (signInBtn) {
  signInBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("signInMessage");

    message.style.display = "none";
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("loggedInUserId", result.user.uid);
      alert("✅ Logged in!");
      window.location.href = "index.html";
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        message.textContent = "❌ No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        message.textContent = "❌ Incorrect password.";
      } else {
        message.textContent = "❌ " + error.message;
      }
      message.style.display = "block";
    }
  });
}

// ✅ Complete Email Link Sign-In
if (isSignInWithEmailLink(auth, window.location.href)) {
  (async () => {
    let email = localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Enter your email to finish sign-in:");
    }

    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      localStorage.removeItem("emailForSignIn");
      localStorage.setItem("loggedInUserId", result.user.uid);
      window.location.href = "index.html";
    } catch (error) {
      alert("❌ Sign-in failed: " + error.message);
    }
  })();
}

// 🔁 Forgot Password
const forgotLink = document.getElementById("forgotPasswordLink");
if (forgotLink) {
  forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = window.prompt("Enter your email to reset password:");
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert("✅ Reset link sent!");
      } catch (err) {
        alert("❌ " + err.message);
      }
    }
  });
}
