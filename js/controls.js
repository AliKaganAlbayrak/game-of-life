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

  // --- speed ----------------------------------------------------------------
  var speedInput = document.getElementById("speed");
  app.setSpeed(parseInt(speedInput.value, 10));
  speedInput.addEventListener("input", function () {
    app.setSpeed(parseInt(speedInput.value, 10));
  });

  // --- random ---------------------------------------------------------------
  document.getElementById("randomBtn").addEventListener("click", function () {
    app.randomize();
  });

  // --- clear ----------------------------------------------------------------
  document.getElementById("clearBtn").addEventListener("click", function () {
    app.pause();
    syncPlayPauseLabel();
    app.clear();
  });

  // --- single step ----------------------------------------------------------
  document.getElementById("stepBtn").addEventListener("click", function () {
    app.pause();
    syncPlayPauseLabel();
    app.stepOnce();
  });
})(window.GOL);
