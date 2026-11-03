// Wires the toolbar controls to the running app (GOL.app).
(function (GOL) {
  "use strict";

  var app = GOL.app;
  var playPauseBtn = document.getElementById("playPause");

  function syncPlayPauseLabel() {
    playPauseBtn.textContent = app.running ? "⏸ Pause" : "▶ Play";
  }

  playPauseBtn.addEventListener("click", function () {
    if (app.running) {
      app.pause();
    } else {
      app.play();
    }
    syncPlayPauseLabel();
  });

  syncPlayPauseLabel();
})(window.GOL);
