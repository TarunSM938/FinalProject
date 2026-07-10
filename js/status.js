/* =========================================================
   Scribble — status.js
   Lets the signed-in user post a short status line (saved to
   localStorage), and shows a small feed of canned status
   updates from the same contacts used on the chat page.
   ========================================================= */

const STATUS_CONTACTS = [
  { id: "amara", name: "Amara Osei", note: "heads down finishing the report", when: "2h ago" },
  { id: "dev", name: "Dev Kulkarni", note: "free after 5 today", when: "4h ago" },
  { id: "priya", name: "Priya Nair", note: "out sick, back tomorrow", when: "yesterday" },
  { id: "leo", name: "Leo Martins", note: "demo run-through went well 🎉", when: "yesterday" },
];

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

document.addEventListener("DOMContentLoaded", function () {
  const feed = document.getElementById("status-feed");
  if (!feed) return; // not on status.html

  let session = null;
  try {
    session = JSON.parse(localStorage.getItem("scribble_session"));
  } catch (e) {
    session = null;
  }
  if (!session) return;

  const MY_STATUS_KEY = `scribble_status_${session.email}`;
  const avatarEl = document.getElementById("my-status-avatar");
  const textEl = document.getElementById("my-status-text");
  const form = document.getElementById("status-form");
  const input = document.getElementById("status-input");

  avatarEl.textContent = initials(session.name);

  function renderMyStatus() {
    const saved = localStorage.getItem(MY_STATUS_KEY);
    textEl.textContent = saved ? saved : "No status yet — add one below.";
  }
  renderMyStatus();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    localStorage.setItem(MY_STATUS_KEY, text);
    renderMyStatus();
    input.value = "";
  });

  feed.innerHTML = "";
  STATUS_CONTACTS.forEach((c) => {
    const row = document.createElement("div");
    row.className = "status-row";
    row.innerHTML = `
      <div class="avatar-initial">${initials(c.name)}</div>
      <div style="flex:1;">
        <div class="status-row-name">${c.name}</div>
        <div class="status-row-note">${c.note}</div>
      </div>
      <div class="status-row-when">${c.when}</div>
    `;
    feed.appendChild(row);
  });
});
