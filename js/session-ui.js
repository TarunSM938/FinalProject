/* =========================================================
   Scribble — session-ui.js
   Small shared script: swaps the "Log in" nav link for a
   "Log out" button when someone is already signed in, and
   fills in any #user-greeting element with their first name.
   Safe to include on any page.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  let session = null;
  try {
    session = JSON.parse(localStorage.getItem("scribble_session"));
  } catch (e) {
    session = null;
  }

  const greeting = document.getElementById("user-greeting");
  if (session && greeting) {
    greeting.textContent = session.name.split(" ")[0];
  }

  const authLink = document.getElementById("nav-auth-link");
  if (authLink && session) {
    authLink.textContent = "Log out";
    authLink.href = "#";
    authLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("scribble_session");
      window.location.href = "login.html";
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("scribble_session");
      window.location.href = "login.html";
    });
  }
});
