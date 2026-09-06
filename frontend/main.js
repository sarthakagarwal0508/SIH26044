// main.js
// =========================================================
// MAIN.JS - GLOBAL FRONTEND CONTROLLER
// Handles Auth, Navigation, Role Redirection, and Logout
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Setup Logout Buttons across all pages
    setupLogout();

    // 2. Setup Login Form Handler (if on index/login page)
    setupLoginForm();

    // 3. Load User Data in Header (if logged in)
    loadHeaderProfile();
});


// ---------------------------------------------------------
// LOGOUT FUNCTIONALITY
// ---------------------------------------------------------
function setupLogout() {
    const logoutBtns = document.querySelectorAll(".logout-btn");
    
    logoutBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Clear simulated session/role
            localStorage.removeItem("userRole");
            localStorage.removeItem("userName");
            
            alert("Logging out...");
            
            // Redirect to main login page
            window.location.href = "index.html";
        });
    });
}


// ---------------------------------------------------------
// LOGIN FORM & ROLE REDIRECTION
// ---------------------------------------------------------
function setupLoginForm() {
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const roleSelect = document.getElementById("userRole");
            const nameInput = document.getElementById("userNameInput");
            
            const selectedRole = roleSelect ? roleSelect.value : "student";
            const userName = nameInput && nameInput.value ? nameInput.value : "Bhavishya";

            // Save details to LocalStorage
            localStorage.setItem("userRole", selectedRole);
            localStorage.setItem("userName", userName);

            // Route based on selected role
            if (selectedRole === "company") {
                window.location.href = "company.html";
            } else if (selectedRole === "institution") {
                window.location.href = "institution.html";
            } else {
                window.location.href = "profile.html"; // Default Student route
            }
        });
    }
}


// ---------------------------------------------------------
// DYNAMIC HEADER PROFILE LOADER
// ---------------------------------------------------------
function loadHeaderProfile() {
    const userName = localStorage.getItem("userName") || "Student";
    
    // Find profile elements on page
    const studentNameEl = document.getElementById("studentName");
    const studentAvatarEl = document.getElementById("studentAvatar");
    const profileNameEl = document.getElementById("profileName");
    const profileAvatarEl = document.getElementById("profileAvatar");

    // Get first letter for avatar circle
    const initial = userName.charAt(0).toUpperCase();

    // Update Topbar Info if elements exist on current page
    if (studentNameEl) studentNameEl.textContent = userName;
    if (studentAvatarEl) studentAvatarEl.textContent = initial;
    if (profileNameEl) profileNameEl.textContent = userName;
    if (profileAvatarEl) profileAvatarEl.textContent = initial;
}