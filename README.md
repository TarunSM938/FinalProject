# Scribble — Chat Application UI

A small chat application front end built for our web development coursework.
It has five pages — Home, Login/Sign up, Chat, Status, and Profile — with
sign up, login, and logout, and a chat screen where messages show up as
sticky notes instead of the usual rounded bubbles.

This is a **front-end-only** build — plain HTML, CSS, and JavaScript, no
framework, no backend. Accounts and messages are stored in the browser's
`localStorage`, which is enough for a UI demo but isn't real user data
storage. Good enough for this assignment; swap it for a real API if you ever
extend this into something more than a UI project.

## The five pages

Each of these can be assigned to a different group member to build or own:

1. **Home** (`index.html`) — landing page, intro to the app
2. **Login / Sign up** (`login.html`) — one page, two tabs: log in or create an account
3. **Chat** (`chat.html`) — contact roster + message thread (protected)
4. **Status** (`status.html`) — post your own status, see contacts' updates (protected)
5. **Profile** (`profile.html`) — view/edit your name and about line (protected)

"Protected" pages redirect to the login page if no one is signed in.
Logout is a button in the top nav on every protected page, not a separate page.

## What's included

- Sign up and login with basic validation, combined into one page with tabs
- Logout button (top nav on Chat / Status / Profile), which clears the session
- A chat screen with a contact roster and a message thread
- A status page for posting/viewing quick updates
- A profile page for viewing and editing your display name and about line
- `docs/` — the project report and the presentation deck

## Folder structure

```
chatapp/
├── index.html           Home page
├── login.html            Login + Sign up (tabbed)
├── chat.html              Chat — protected, redirects to login.html if not signed in
├── status.html             Status — protected
├── profile.html             Profile — protected
├── css/
│   └── style.css
├── js/
│   ├── auth.js           signup / login / logout logic, tab switching
│   ├── guard.js           protects chat.html / status.html / profile.html
│   ├── chat.js            roster, message thread, canned replies
│   ├── status.js          status feed + posting your own status
│   ├── profile.js         profile view/edit logic
│   └── session-ui.js      shared nav "log in / log out" state + greeting
├── assets/
│   └── favicon.svg
├── docs/
│   ├── project-report.docx
│   └── presentation.pptx
└── README.md
```

## Running it locally

No build step, no install. Two options:

1. Open `index.html` directly in a browser, or
2. Serve the folder so relative paths behave exactly like they will once
   hosted (recommended):
   ```bash
   python3 -m http.server 8000
   ```
   then visit `http://localhost:8000`.

## Before you submit — assign pages and add real names

There's no dedicated "team" page — instead, assign each of the five pages
(Home, Login/Sign up, Chat, Status, Profile) to one group member so everyone
has a clear, separately-gradable piece to own. Wherever you write the report
or the presentation, list who owned which page.

## Git & GitHub setup

If this folder isn't a git repo yet:

```bash
git init
git add .
git commit -m "Initial commit: project skeleton"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

From here, commit feature by feature rather than all at once — see
`COMMIT_GUIDE.md` for a suggested breakdown that gets you to 30+ commits
naturally, without padding history with meaningless commits.

## Deploying to GitHub Pages

1. Push the repo to GitHub (see above).
2. On GitHub, go to **Settings → Pages**.
3. Under **Source**, choose the `main` branch and the `/ (root)` folder.
4. Save. GitHub gives you a URL like
   `https://<your-username>.github.io/<repo-name>/` within a minute or two.
5. Double-check `chat.html`, `status.html`, and `profile.html` load correctly
   on the hosted URL, not just locally — relative paths are used throughout
   so this should work without changes.

## Known limitations (worth mentioning in the report)

- Auth is client-side only — anyone can read `localStorage` in devtools.
  Fine for a UI project, not for production.
- Messages are simulated: contacts "reply" with a canned line after a short
  delay. There's no real-time backend.
- Sessions don't sync across browsers/devices — signing up on one browser
  won't let you log in from another.
