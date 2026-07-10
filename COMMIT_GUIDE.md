# Suggested commit plan (30+ commits)

You said you'll commit this one feature at a time — here's a breakdown that
maps to real, separable pieces of the project, so the history actually tells
the story of how it was built instead of just being "commit 1, 2, 3" on the
same dump of files. Skip/reorder/merge any of these to match how your group
actually split the work — with five pages and five people, it maps neatly
onto "one person owns one page's commits."

1. Initial commit — empty repo, `.gitignore`, blank `README.md`
2. Add project folder structure (empty `css/`, `js/`, `assets/`, `docs/`)
3. Add `css/style.css` — CSS variables and reset

## Home page
4. Add `index.html` markup (no styling yet)
5. Style the top navigation bar
6. Build the landing hero section
7. Add the feature "sticky note" callouts
8. Add site footer

## Login / Sign up page
9. Add `login.html` markup with both login and signup panels
10. Style the auth card / notebook-page layout and tab switcher
11. Add `js/auth.js` — user storage helpers (`getUsers`, `saveUsers`, `findUserByEmail`)
12. Wire up sign-up form validation and account creation
13. Wire up login form validation and session creation
14. Add tab-switching logic between login and signup panels
15. Add form error/success messaging styling
16. Add `js/guard.js` — redirect logged-out users away from protected pages

## Chat page
17. Add `chat.html` markup — top bar, roster sidebar, empty conversation state
18. Style the roster sidebar (avatars, status dots, hover/active states)
19. Add `js/chat.js` — contact data and roster rendering
20. Implement opening a conversation and rendering message history
21. Style message bubbles (the sticky-note look, mine vs. theirs)
22. Implement sending a message and saving it to `localStorage`
23. Implement simulated contact replies with delay

## Status page
24. Add `status.html` markup — my status card, post form, feed list
25. Add `js/status.js` — posting a status and rendering the contacts' feed
26. Style the status feed rows

## Profile page
27. Add `profile.html` markup — avatar, editable fields, stats row
28. Add `js/profile.js` — reading session data, saving edits, computing stats
29. Style the profile card and stats

## Shared / final touches
30. Add `js/session-ui.js` — shared nav login/logout state and greeting across pages
31. Add logout button wiring on protected pages
32. Add responsive tweaks for mobile (chat layout, auth card padding)
33. Add favicon and finishing polish across pages
34. Add `README.md` with setup and deployment instructions
35. Add project report and presentation to `docs/`
36. Fix bugs found during testing (list the actual ones you hit)
37. Final polish + tag a submission release, e.g. `git tag v1.0`

## Commit message style

Keep messages short and specific to what changed — "Add login form
validation" reads much better in a group project's history than "update" or
"fix stuff". Since each page can be owned by a different person, it's fine
(and honest) for the commit history to show one contributor's name attached
to most commits under their page's section.
