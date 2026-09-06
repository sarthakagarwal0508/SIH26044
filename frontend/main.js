// =========================================================
// MAIN.JS - GLOBAL FRONTEND CONTROLLER
// =========================================================

const API_BASE_URL = "http://localhost:5000/api";


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    setupLoginForm();

    setupLogout();

    loadHeaderProfile();
});


// =========================================================
// LOGIN
// =========================================================

function setupLoginForm() {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener(
        "submit",
        handleLogin
    );
}


async function handleLogin(event) {

    event.preventDefault();

    const role =
        document.getElementById("loginRole")?.value;

    const email =
        document.getElementById("loginUser")?.value.trim();

    const password =
        document.getElementById("loginPassword")?.value;

    const loginButton =
        document.getElementById("loginButton");

    const message =
        document.getElementById("loginMessage");


    if (!email || !password) {

        showLoginMessage(
            "Please enter email and password.",
            "error"
        );

        return;
    }


    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Login failed"
            );
        }


        // =================================================
        // SAVE AUTH DATA
        // =================================================

        localStorage.setItem(
            "authToken",
            data.token
        );

        localStorage.setItem(
            "userRole",
            role
        );

        if (data.user?.name) {

            localStorage.setItem(
                "userName",
                data.user.name
            );

        } else {

            localStorage.setItem(
                "userName",
                email.split("@")[0]
            );
        }


        if (data.user?.id) {

            localStorage.setItem(
                "userId",
                data.user.id
            );

        }


        showLoginMessage(
            "Login successful. Redirecting...",
            "success"
        );


        // =================================================
        // ROLE REDIRECTION
        // =================================================

        setTimeout(() => {

            if (role === "company") {

                window.location.href =
                    "company.html";

            } else if (role === "institution") {

                window.location.href =
                    "institution.html";

            } else {

                window.location.href =
                    "index.html";
            }

        }, 500);


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        showLoginMessage(
            error.message ||
            "Unable to connect to backend.",
            "error"
        );

        loginButton.disabled = false;
        loginButton.textContent =
            "Login to Portal 🚀";
    }
}


// =========================================================
// LOGIN MESSAGE
// =========================================================

function showLoginMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "loginMessage"
        );

    if (!message) {
        return;
    }

    message.textContent = text;

    message.className =
        `login-message ${type}`;
}


// =========================================================
// LOGOUT
// =========================================================

function setupLogout() {

    const logoutButtons =
        document.querySelectorAll(
            ".logout-btn"
        );


    logoutButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "authToken"
                );

                localStorage.removeItem(
                    "userRole"
                );

                localStorage.removeItem(
                    "userName"
                );

                localStorage.removeItem(
                    "userId"
                );

                window.location.href =
                    "login.html";
            }
        );
    });
}


// =========================================================
// HEADER PROFILE
// =========================================================

function loadHeaderProfile() {

    const userName =
        localStorage.getItem(
            "userName"
        ) || "Student";


    const studentNameEl =
        document.getElementById(
            "studentName"
        );

    const studentAvatarEl =
        document.getElementById(
            "studentAvatar"
        );

    const profileNameEl =
        document.getElementById(
            "profileName"
        );

    const profileAvatarEl =
        document.getElementById(
            "profileAvatar"
        );


    const companyNameEl =
        document.getElementById(
            "companyName"
        );


    const companyAvatarEl =
        document.getElementById(
            "companyAvatar"
        );


    const initial =
        userName.charAt(0).toUpperCase();


    if (studentNameEl) {

        studentNameEl.textContent =
            userName;
    }


    if (studentAvatarEl) {

        studentAvatarEl.textContent =
            initial;
    }


    if (profileNameEl) {

        profileNameEl.textContent =
            userName;
    }


    if (profileAvatarEl) {

        profileAvatarEl.textContent =
            initial;
    }


    if (companyNameEl) {

        companyNameEl.textContent =
            userName;
    }


    if (companyAvatarEl) {

        companyAvatarEl.textContent =
            initial;
    }
}


// =========================================================
// AUTH TOKEN HELPER
// =========================================================

function getAuthToken() {

    return localStorage.getItem(
        "authToken"
    );
}


// =========================================================
// AUTHENTICATED FETCH HELPER
// =========================================================

async function apiFetch(
    endpoint,
    options = {}
) {

    const token =
        getAuthToken();


    const headers = {
        ...(options.headers || {})
    };


    if (!headers["Content-Type"] &&
        !(options.body instanceof FormData)) {

        headers["Content-Type"] =
            "application/json";
    }


    if (token) {

        headers["Authorization"] =
            `Bearer ${token}`;
    }


    const response =
        await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );


    if (response.status === 401) {

        localStorage.removeItem(
            "authToken"
        );

        window.location.href =
            "login.html";

        throw new Error(
            "Session expired. Please login again."
        );
    }


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "API request failed"
        );
    }


    return data;
}