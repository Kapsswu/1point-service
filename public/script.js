// ✅ Firebase imports
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

const allowedPagesWithoutLogin = ["index.html", "", "/", "auth.html"];
const currentPage = location.pathname.split("/").pop();

onAuthStateChanged(auth, (user) => {
  if (!user && !allowedPagesWithoutLogin.includes(currentPage)) {
    alert("\ud83d\udd10 Please sign in to access this page.");
    window.location.href = "auth.html";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-container");
  const footerContainer = document.getElementById("footer-container");

  // Load header
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

            const allowedWithoutLogin = ["index.html", "", "/"];
            document.querySelectorAll("a").forEach((link) => {
              const href = link.getAttribute("href");
              if (href && !allowedWithoutLogin.some(page => href.includes(page))) {
                link.addEventListener("click", (e) => {
                  e.preventDefault();
                  alert("\ud83d\udd10 Please sign in to access this feature.");
                });
              }
            });
          }
        });
      });
  }

  // Autofill booking form
  const serviceField = document.getElementById("service");
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("c") || "";
  const subcategory = urlParams.get("s") || "";

  if (serviceField) {
    serviceField.value = `${subcategory} (${category.replace(/-/g, ' ')})`;
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      const userData = docSnap.exists() ? docSnap.data() : {};
      ["name", "phone", "location", "address"].forEach(id => {
        const input = document.getElementById(id);
        if (input && userData[id]) input.value = userData[id];
      });
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  });

  // Handle booking form submission
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const location = document.getElementById("location").value;
    const address = document.getElementById("address").value;
    const description = document.getElementById("description").value;
    const datetime = document.getElementById("datetime").value;
    const urgency = document.getElementById("urgency").value;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("c") || "";
    const subcategory = urlParams.get("s") || "";

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

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Save/update profile info
          await setDoc(doc(db, "users", user.uid), {
            name, phone, location, address
          }, { merge: true });

          // ✅ Save booking into history subcollection
          await addDoc(collection(db, "users", user.uid, "bookings"), {
            service: subcategory,
            category: category.replace(/-/g, ' '),
            description,
            preferredTime: datetime,
            urgency,
            status: "Pending", // default status
            createdAt: serverTimestamp()
          });

        } catch (err) {
          console.error("Failed to save booking:", err);
        }
      }
    });

    alert("✅ Booking data prepared. Redirecting to WhatsApp...");
    window.open(`https://wa.me/916009982567?text=${encodedMessage}`, "_blank");
  });
}

  // Terms agreement
  const agreeCheckbox = document.getElementById("agree");
  const acceptBtn = document.getElementById("accept-btn");
  if (agreeCheckbox && acceptBtn) {
    document.getElementById("agree-section").style.display = "block";
    agreeCheckbox.addEventListener("change", () => {
      acceptBtn.disabled = !agreeCheckbox.checked;
    });
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("agreedToTerms", "true");
      window.location.href = "auth.html";
    });
  }

  // Search suggestions
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
});

// Set background images for homepage cards
document.querySelectorAll(".category-card").forEach(card => {
  const bg = card.getAttribute("data-bg");
  if (bg) {
    card.style.backgroundImage = `url(${bg})`;
  }
});

