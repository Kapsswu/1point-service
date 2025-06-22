// script.js — Reusable JavaScript for all AZ Service pages

// Load header and footer components
window.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-container");
  const footerContainer = document.getElementById("footer-container");

  if (headerContainer) {
    fetch("header.html").then(res => res.text()).then(data => {
      headerContainer.innerHTML = data;
    });
  }

  if (footerContainer) {
    fetch("footer.html").then(res => res.text()).then(data => {
      footerContainer.innerHTML = data;
    });
  }

  // Autofill booking.html
  const serviceField = document.getElementById("service");
  const user = JSON.parse(localStorage.getItem("az_user")) || {};
  if (serviceField) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("c") || "";
    const subcategory = urlParams.get("s") || "";
    serviceField.value = `${subcategory} (${category.replace(/-/g, ' ')})`;
    ["name", "phone", "location", "address"].forEach(id => {
      const input = document.getElementById(id);
      if (input && user[id]) input.value = user[id];
    });
  }

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
      localStorage.setItem("az_user", JSON.stringify({ name, phone, location, address }));
      alert("✅ Booking data prepared. Redirecting to WhatsApp...");
      window.open(`https://wa.me/916009982567?text=${encodedMessage}`, "_blank");
    });
  }

  // Handle terms.html checkbox logic
  const agreeCheckbox = document.getElementById("agree");
  const acceptBtn = document.getElementById("accept-btn");
  if (agreeCheckbox && acceptBtn) {
    document.getElementById("agree-section").style.display = "block";
    agreeCheckbox.addEventListener("change", () => {
      acceptBtn.disabled = !agreeCheckbox.checked;
    });
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("agreedToTerms", true);
      window.location.href = "index.html";
    });
  }

  // Search feature on homepage
  const searchInput = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");
  if (searchInput && suggestions) {
    const services = [
      "Electrician", "Plumber", "Technician", "Carpenter",
      "Taxi Service", "Photography", "Labour Service", "Car Repairs"
    ];
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      suggestions.innerHTML = "";
      if (query.length > 1) {
        services.filter(item => item.toLowerCase().includes(query))
          .forEach(match => {
            const li = document.createElement("li");
            li.textContent = match;
            li.addEventListener("click", () => {
              window.location.href = `booking.html?c=Search&s=${match}`;
            });
            suggestions.appendChild(li);
          });
      }
    });
  }

  // Logout handler (used in profile.html)
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("az_user");
      window.location.href = "signin.html";
    });
  }
});


