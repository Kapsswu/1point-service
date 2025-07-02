// firebaseauth.js (MODULAR STYLE)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// ✅ Firebase Config
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

// ✅ SIGN UP
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
      await sendEmailVerification(userCredential.user);
      alert("✅ Account created! A verification email has been sent.");
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
}

// ✅ SIGN IN
const signInBtn = document.getElementById("submitSignIn");
if (signInBtn) {
  signInBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("signInMessage");

    message.style.display = "none";

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        message.textContent = "⚠️ Please verify your email before signing in.";
        message.style.display = "block";
        return;
      }

      localStorage.setItem("loggedInUserId", user.uid);
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

// 🔁 Forgot Password
const forgotLink = document.getElementById("forgotPasswordLink");
if (forgotLink) {
  forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = window.prompt("Enter your email to reset password:");
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert("✅ Password reset link sent to your email.");
      } catch (err) {
        alert("❌ " + err.message);
      }
    }
  });
}
