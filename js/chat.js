/* =========================================================
   Scribble — chat.js
   Front-end-only chat simulation. Messages are kept per-contact
   in localStorage, and each contact "writes back" with a canned
   reply after a short delay, purely so the UI has something to
   demo. There is no real messaging backend here — wire this up
   to sockets/an API if this needs to become a real product.
   ========================================================= */

const CONTACTS = [
  {
    id: "amara",
    name: "Amara Osei",
    status: "online",
    replies: [
      "haha wait really?",
      "okay sending you the notes in a sec",
      "did you see what the prof posted?",
      "same, I'm still stuck on question 4",
    ],
  },
  {
    id: "dev",
    name: "Dev Kulkarni",
    status: "online",
    replies: [
      "on it 👍",
      "can we push the meeting to 6?",
      "lol that's fair",
      "sending the slides now",
    ],
  },
  {
    id: "priya",
    name: "Priya Nair",
    status: "offline",
    replies: [
      "just saw this, replying properly later",
      "sounds good to me",
      "can you loop in the rest of the group?",
    ],
  },
  {
    id: "leo",
    name: "Leo Martins",
    status: "online",
    replies: [
      "back in 5",
      "haha yes exactly",
      "I'll check and let you know",
      "deal 🤝",
    ],
  },
];

const STORE_PREFIX = "scribble_thread_";

function threadKey(email, contactId) {
  return `${STORE_PREFIX}${email}_${contactId}`;
}

function loadThread(email, contactId) {
  try {
    return JSON.parse(localStorage.getItem(threadKey(email, contactId))) || [];
  } catch (e) {
    return [];
  }
}

function saveThread(email, contactId, thread) {
  localStorage.setItem(threadKey(email, contactId), JSON.stringify(thread));
}

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function seedFirstMessage(contact) {
  const openers = {
    amara: "hey! did you finish the UI mockups for the group project?",
    dev: "yo, what time works for the standup tomorrow?",
    priya: "sent you the report draft, take a look when you can",
    leo: "are we still on for the demo run-through tonight?",
  };
  return openers[contact.id] || "hey, you around?";
}

document.addEventListener("DOMContentLoaded", function () {
  const rosterEl = document.getElementById("roster-list");
  const convBody = document.getElementById("conv-body");
  const convHeaderName = document.getElementById("conv-name");
  const convHeaderStatus = document.getElementById("conv-status");
  const composerForm = document.getElementById("composer-form");
  const composerInput = document.getElementById("composer-input");
  const emptyState = document.getElementById("empty-state");
  const conversationPanel = document.getElementById("conversation-panel");

  if (!rosterEl) return; // not on chat.html

  const session = JSON.parse(localStorage.getItem("scribble_session") || "null");
  const userGreeting = document.getElementById("user-greeting");
  if (session && userGreeting) {
    userGreeting.textContent = session.name.split(" ")[0];
  }

  let activeContactId = null;

  function renderRoster() {
    rosterEl.innerHTML = "";
    CONTACTS.forEach((contact) => {
      const thread = session ? loadThread(session.email, contact.id) : [];
      const last = thread[thread.length - 1];
      const preview = last ? last.text : seedFirstMessage(contact);

      const item = document.createElement("div");
      item.className = "roster-item" + (contact.id === activeContactId ? " active" : "");
      item.setAttribute("data-contact", contact.id);
      item.innerHTML = `
        <div class="avatar-initial">${initials(contact.name)}</div>
        <div style="flex:1; min-width:0;">
          <div class="r-name">${contact.name}</div>
          <div class="r-preview">${preview}</div>
        </div>
        <span class="status-dot ${contact.status}"></span>
      `;
      item.addEventListener("click", () => openConversation(contact.id));
      rosterEl.appendChild(item);
    });
  }

  function openConversation(contactId) {
    activeContactId = contactId;
    const contact = CONTACTS.find((c) => c.id === contactId);
    if (!contact || !session) return;

    emptyState.style.display = "none";
    conversationPanel.style.display = "flex";

    const avatarEl = document.getElementById("conv-avatar");
    if (avatarEl) avatarEl.textContent = initials(contact.name);

    convHeaderName.textContent = contact.name;
    convHeaderStatus.textContent = contact.status === "online" ? "online now" : "offline";
    convHeaderStatus.style.color = contact.status === "online" ? "var(--sage)" : "var(--text-mute)";

    let thread = loadThread(session.email, contactId);
    if (thread.length === 0) {
      thread = [
        {
          from: "them",
          text: seedFirstMessage(contact),
          ts: Date.now() - 1000 * 60 * 6,
        },
      ];
      saveThread(session.email, contactId, thread);
    }

    renderThread(thread);
    renderRoster();
    composerInput.focus();
  }

  function renderThread(thread) {
    convBody.innerHTML = "";
    thread.forEach((m) => {
      const bubble = document.createElement("div");
      bubble.className = "note-msg " + (m.from === "me" ? "mine" : "theirs");
      bubble.innerHTML = `${escapeHtml(m.text)}<span class="msg-time">${formatTime(m.ts)}</span>`;
      convBody.appendChild(bubble);
    });
    convBody.scrollTop = convBody.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  composerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = composerInput.value.trim();
    if (!text || !activeContactId || !session) return;

    const contact = CONTACTS.find((c) => c.id === activeContactId);
    const thread = loadThread(session.email, activeContactId);
    thread.push({ from: "me", text, ts: Date.now() });
    saveThread(session.email, activeContactId, thread);
    renderThread(thread);
    renderRoster();
    composerInput.value = "";

    if (contact.status === "online") {
      setTimeout(() => {
        const reply = contact.replies[Math.floor(Math.random() * contact.replies.length)];
        const updated = loadThread(session.email, activeContactId);
        updated.push({ from: "them", text: reply, ts: Date.now() });
        saveThread(session.email, activeContactId, updated);
        if (activeContactId === contact.id) {
          renderThread(updated);
        }
        renderRoster();
      }, 1100 + Math.random() * 900);
    }
  });

  renderRoster();
});
