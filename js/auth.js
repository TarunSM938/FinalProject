/* =========================================================
   Scribble — auth.js
   Small client-side auth simulation for a frontend project.
   Accounts and sessions live in localStorage only — there is
   no server here. Good enough for a UI/UX demo, not for real
   user data. Swap this out for real API calls if you ever
   hook this up to a backend.
   ========================================================= */

const USERS_KEY = "scribble_users";
const SESSION_KEY = "scribble_session";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
  return getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

function setSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ name: user.name, email: user.email })
  );
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch (e) {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Very small helpers — this is a UI demo, not a security layer.
function hashPassword(password) {
  // Not real hashing. Just enough obfuscation so passwords aren't
  // sitting around in plain text in devtools by accident.
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `sb_${hash}_${password.length}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(el, text, type) {
  el.textContent = text;
  el.classList.remove("error", "success", "show");
  el.classList.add(type, "show");
}

// ---- Signup panel wiring -------------------------------------------------
function initSignupForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  const msg = document.getElementById("signup-message");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("password");
  const passConfirmInput = document.getElementById("password-confirm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value;
    const passwordConfirm = passConfirmInput.value;

    if (name.length < 2) {
      showMessage(msg, "Enter your full name.", "error");
      nameInput.focus();
      return;
    }
    if (!isValidEmail(email)) {
      showMessage(msg, "That email address doesn't look right.", "error");
      emailInput.focus();
      return;
    }
    if (password.length < 6) {
      showMessage(msg, "Password needs at least 6 characters.", "error");
      passInput.focus();
      return;
    }
    if (password !== passwordConfirm) {
      showMessage(msg, "Passwords don't match.", "error");
      passConfirmInput.focus();
      return;
    }
    if (findUserByEmail(email)) {
      showMessage(msg, "An account with that email already exists — try logging in instead.", "error");
      return;
    }

    const users = getUsers();
    users.push({ name, email, passwordHash: hashPassword(password) });
    saveUsers(users);
    setSession({ name, email });

    showMessage(msg, "Account created. Taking you in…", "success");
    setTimeout(() => {
      window.location.href = "chat.html";
    }, 700);
  });
}

// ---- Login panel wiring ---------------------------------------------------
function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const msg = document.getElementById("login-message");
  const emailInput = document.getElementById("login-email");
  const passInput = document.getElementById("login-password");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passInput.value;
    const user = findUserByEmail(email);

    if (!user || user.passwordHash !== hashPassword(password)) {
      showMessage(msg, "Email or password doesn't match our records.", "error");
      return;
    }

    setSession(user);
    showMessage(msg, "Welcome back — one sec…", "success");
    setTimeout(() => {
      window.location.href = "chat.html";
    }, 500);
  });
}

// ---- Logout button (used on chat.html) -----------------------------------
function initLogoutButton() {
  const btn = document.getElementById("logout-btn");
  if (!btn) return;
  btn.addEventListener("click", function () {
    clearSession();
    window.location.href = "login.html";
  });
}

// ---- Login / signup tab switching -----------------------------------------
function initAuthTabs() {
  const tabRow = document.getElementById("tab-row");
  if (!tabRow) return;

  const buttons = tabRow.querySelectorAll(".tab-btn");
  const panels = {
    login: document.getElementById("login-panel"),
    signup: document.getElementById("signup-panel"),
  };

  function activate(tab) {
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    Object.keys(panels).forEach((key) => {
      panels[key].classList.toggle("active", key === tab);
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => activate(btn.dataset.tab));
  });

  // Deep-link support: login.html#signup opens straight to the sign-up tab.
  if (window.location.hash === "#signup") {
    activate("signup");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initAuthTabs();
  initSignupForm();
  initLoginForm();
  initLogoutButton();
});
