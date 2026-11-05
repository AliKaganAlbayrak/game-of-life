// Keyboard shortcuts. These just click the matching toolbar buttons so the
// button labels (e.g. Play/Pause) stay in sync automatically.
(function () {
  "use strict";

  var map = {
    s: "stepBtn",
    r: "randomBtn",
    c: "clearBtn",
    p: "placeBtn",
  };

  function isTyping(el) {
    return el && (el.tagName === "INPUT" || el.tagName === "SELECT");
  }

  document.addEventListener("keydown", function (evt) {
    if (isTyping(evt.target)) return; // don't hijack text fields

    if (evt.code === "Space") {
      evt.preventDefault();
      document.getElementById("playPause").click();
      return;
    }

    if (evt.key === "?" && window.GOL.toggleHelp) {
      evt.preventDefault();
      window.GOL.toggleHelp();
      return;
    }

    var id = map[evt.key.toLowerCase()];
    if (id) {
      evt.preventDefault();
      document.getElementById(id).click();
    }
  });
})();
