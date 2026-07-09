/* =========================================================
   Scribble — guard.js
   Keeps chat.html for signed-in users only. Runs before the
   rest of the page's own script so a logged-out visitor never
   sees a flash of chat content.
   ========================================================= */

(function () {
  const session = (function () {
    try {
      return JSON.parse(localStorage.getItem("scribble_session"));
    } catch (e) {
      return null;
    }
  })();

  if (!session || !session.email) {
    window.location.replace("login.html");
  }
})();
