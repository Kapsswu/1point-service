document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer
  loadComponent("header-placeholder", "header.html");
  loadComponent("footer-placeholder", "footer.html");
});

function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;

      // Init sidebar toggle after header is loaded
      if (file === "header.html") {
        initSidebar();
      }
    })
    .catch(err => console.error(`Error loading ${file}:`, err));
}

function initSidebar() {
  const openBtn = document.getElementById("open-sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const sidebar = document.getElementById("sidebarMenu");

  if (openBtn && closeBtn && sidebar) {
    openBtn.addEventListener("click", () => {
      sidebar.classList.add("active");
    });
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  }
}
