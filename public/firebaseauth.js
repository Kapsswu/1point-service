// firebaseauth.js

// 🔌 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBIjDHdyokcHvzfzsAc5kK0tBaJxpKBwgY",
  authDomain: "point-service-c2fcb.firebaseapp.com",
  projectId: "point-service-c2fcb",
  storageBucket: "point-service-c2fcb.appspot.com",
  messagingSenderId: "77473043188",
  appId: "1:77473043188:web:8dc46646d5237291c6c4a1",
  measurementId: "G-MTVG8TYHDG"
};

// 🔐 Init
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 📩 Email link settings
const actionCodeSettings = {
  url: 'https://point-service-c2fcb.web.app/auth.html',
  handleCodeInApp: true
};

// 🆕 Sign Up
const signUpBtn = document.getElementById("submitSignUp");
if (signUpBtn) {
  signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;

    auth.createUserWithEmailAndPassword(email, password)
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

// ✉️ Send Sign-In Email Link
const signInBtn = document.getElementById("submitSignIn");
if (signInBtn) {
  signInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;

    auth.sendSignInLinkToEmail(email, actionCodeSettings)
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

// ✅ Complete Sign-in
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  let email = window.localStorage.getItem("emailForSignIn");
  if (!email) {
    email = window.prompt("Please confirm your email:");
  }

  auth.signInWithEmailLink(email, window.location.href)
    .then((result) => {
      localStorage.removeItem("emailForSignIn");
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
    const email = prompt("Enter your email:");
    if (email) {
      auth.sendPasswordResetEmail(email)
        .then(() => alert("✅ Password reset sent!"))
        .catch((err) => alert("❌ " + err.message));
    }
  });
}
