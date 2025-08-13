// ✅ Firebase imports
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// 🔹 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIjDHdyokcHvzfzsAc5kK0tBaJxpKBwgY",
  authDomain: "point-service-c2fcb.firebaseapp.com",
  projectId: "point-service-c2fcb",
  storageBucket: "point-service-c2fcb.appspot.com",
  messagingSenderId: "77473043188",
  appId: "1:77473043188:web:8dc46646d5237291c6c4a1",
  measurementId: "G-MTVG8TYHDG"
};

// 🔹 Initialize Firebase (only once)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Pages that don't require login
const allowedPagesWithoutLogin = ["index.html", "", "/", "auth.html"];
const currentPage = location.pathname.split("/").pop();

// Redirect unauthenticated users from protected pages
onAuthStateChanged(auth, (user) => {
  if (!user && !allowedPagesWithoutLogin.includes(currentPage)) {
    alert("🔒 Please sign in to access this page.");
    window.location.href = "auth.html";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-container");
  const footerContainer = document.getElementById("footer-container");

  // Load header and update nav links based on auth state
  if (headerContainer) {
    fetch("header.html")
      .then(res => res.text())
      .then(data => {
        headerContainer.innerHTML = data;

        const signInLink = document.getElementById("signin-link");
        const profileIcon = document.getElementById("profile-icon");

        onAuthStateChanged(auth, (user) => {
          if (user) {
            if (signInLink) signInLink.style.display = "none";
            if (profileIcon) profileIcon.style.display = "inline-block";
          } else {
            if (signInLink) signInLink.style.display = "inline-block";
            if (profileIcon) profileIcon.style.display = "none";

            // Disable protected links for unauthenticated users
            const allowedWithoutLogin = ["index.html", "", "/"];
            document.querySelectorAll("a").forEach((link) => {
              const href = link.getAttribute("href");
              if (href && !allowedWithoutLogin.some(page => href.includes(page))) {
                link.addEventListener("click", (e) => {
                  e.preventDefault();
                  alert("🔒 Please sign in to access this feature.");
                });
              }
            });
          }
        });
      });
  }

  // Autofill booking service field from URL params
  const serviceField = document.getElementById("service");
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("c") || "";
  const subcategory = urlParams.get("s") || "";

  if (serviceField) {
    serviceField.value = `${subcategory} (${category.replace(/-/g, ' ')})`;
  }

  // Autofill user profile data into booking form if logged in
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const userData = docSnap.data();
        ["name", "phone", "location", "address"].forEach(id => {
          const input = document.getElementById(id);
          if (input && userData[id]) input.value = userData[id];
        });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  });

  // Booking form submission handler
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get input values trimmed and sanitized
      const name = sanitizeInput(document.getElementById("name").value);
      const phone = sanitizeInput(document.getElementById("phone").value);
      const location = sanitizeInput(document.getElementById("location").value);
      const address = sanitizeInput(document.getElementById("address").value);
      const description = sanitizeInput(document.getElementById("description").value);
      const datetime = sanitizeInput(document.getElementById("datetime").value);
      const urgency = sanitizeInput(document.getElementById("urgency").value);

      const message = `*AZ Service Booking*%0A
*Service:* ${subcategory}%0A
*Category:* ${category.replace(/-/g, ' ')}%0A
*Name:* ${name}%0A
*Phone:* ${phone}%0A
*Location:* ${location}%0A
*Address:* ${address}%0A
*Description:* ${description}%0A
*Preferred Time:* ${datetime}%0A
*Urgency:* ${urgency}`;

      const encodedMessage = encodeURIComponent(message);

      try {
        // Update user profile info in Firestore
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, "users", user.uid), {
            name, phone, location, address
          }, { merge: true });
        }
      } catch (err) {
        console.error("Failed to save profile info:", err);
      }

      alert("✅ Booking data prepared. Redirecting to WhatsApp...");
      window.open(`https://wa.me/916009982567?text=${encodedMessage}`, "_blank");
    });
  }

  // Terms agreement logic
  const agreeCheckbox = document.getElementById("agree");
  const acceptBtn = document.getElementById("accept-btn");
  if (agreeCheckbox && acceptBtn) {
    const agreeSection = document.getElementById("agree-section");
    if (agreeSection) agreeSection.style.display = "block";

    agreeCheckbox.addEventListener("change", () => {
      acceptBtn.disabled = !agreeCheckbox.checked;
    });

    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("agreedToTerms", "true");
      window.location.href = "auth.html";
    });
  }

  // Search suggestions logic
  const searchInput = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");

  if (searchInput && suggestions) {
    const services = [
      "Electrician", "Plumber", "Technician", "Carpenter",
      "Taxi Service", "Photography", "Labour Service", "Car Repairs",
      "Painter", "Mason", "Bike Service", "Courier",
      "Party Planner", "Video Editor", "Furniture Rental",
      "Legal Consultant", "Finance Consultant", "Broker",
      "Property Manager", "Appliances Rental", "DJ", "Mechanic"
    ];

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      suggestions.innerHTML = "";

      if (query.length > 1) {
        const matched = services.filter(item =>
          item.toLowerCase().includes(query)
        );

        matched.forEach(match => {
          const li = document.createElement("li");
          li.textContent = match;
          li.addEventListener("click", () => {
            window.location.href = `booking.html?c=Search&s=${encodeURIComponent(match)}`;
          });
          suggestions.appendChild(li);
        });
      }
    });
  }

  // Logout handler
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "auth.html";
      } catch (err) {
        console.error("Logout failed:", err);
      }
    });
  }

  // --- Sidebar Menu Logic ---
  const openBtn = document.getElementById('open-sidebar');
const closeBtn = document.getElementById('close-sidebar');
const sidebar = document.getElementById('sidebar-menu');
const overlay = document.getElementById('sidebar-overlay');

if (openBtn && closeBtn && sidebar && overlay) {
  openBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.classList.add('sidebar-open');
  });

  closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
  });
}

  // --- End Sidebar ---
});

// Simple input sanitization helper to trim and strip potential harmful characters
function sanitizeInput(input) {
  const temp = input.trim();
  // Replace line breaks and encode HTML special chars if needed, here simple example:
  return temp.replace(/[<>]/g, '');
}

