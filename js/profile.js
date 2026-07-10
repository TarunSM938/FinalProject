/* =========================================================
   Scribble — profile.js
   Reads the signed-in user's session, lets them update a
   display name and a short "about" line, and shows a couple
   of light stats pulled from what's already in localStorage.
   ========================================================= */

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("profile-form");
  if (!form) return; // not on profile.html

  let session = null;
  try {
    session = JSON.parse(localStorage.getItem("scribble_session"));
  } catch (e) {
    session = null;
  }
  if (!session) return; // guard.js already redirects, this is just a safety net

  const nameEl = document.getElementById("profile-name");
  const emailEl = document.getElementById("profile-email");
  const avatarEl = document.getElementById("profile-avatar");
  const displayNameInput = document.getElementById("display-name");
  const statusLineInput = document.getElementById("status-line");
  const msg = document.getElementById("profile-message");

  const ABOUT_KEY = `scribble_about_${session.email}`;

  function render() {
    nameEl.textContent = session.name;
    emailEl.textContent = session.email;
    avatarEl.textContent = initials(session.name);
    displayNameInput.value = session.name;
    statusLineInput.value = localStorage.getItem(ABOUT_KEY) || "";
  }
  render();

  // Stats: a couple of honest, small numbers pulled from real local data.
  const messagesSentEl = document.getElementById("stat-messages");
  let sent = 0;
  ["amara", "dev", "priya", "leo"].forEach((id) => {
    try {
      const thread = JSON.parse(localStorage.getItem(`scribble_thread_${session.email}_${id}`)) || [];
      sent += thread.filter((m) => m.from === "me").length;
    } catch (e) {
      /* ignore */
    }
  });
  if (messagesSentEl) messagesSentEl.textContent = sent;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const newName = displayNameInput.value.trim();
    const about = statusLineInput.value.trim();

    if (newName.length < 2) {
      msg.textContent = "Enter a display name.";
      msg.className = "form-msg error show";
      return;
    }

    session.name = newName;
    localStorage.setItem("scribble_session", JSON.stringify(session));
    localStorage.setItem(ABOUT_KEY, about);

    // Keep the accounts list in sync too, so the name survives re-login.
    try {
      const users = JSON.parse(localStorage.getItem("scribble_users")) || [];
      const idx = users.findIndex((u) => u.email === session.email);
      if (idx !== -1) {
        users[idx].name = newName;
        localStorage.setItem("scribble_users", JSON.stringify(users));
      }
    } catch (e) {
      /* ignore */
    }

    render();
    msg.textContent = "Profile updated.";
    msg.className = "form-msg success show";
  });
});
