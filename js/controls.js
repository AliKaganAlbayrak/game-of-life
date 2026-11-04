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

  // --- theme ----------------------------------------------------------------
  var themeSelect = document.getElementById("theme");
  function applyTheme(name) {
    document.documentElement.setAttribute("data-theme", name);
    app.draw(); // canvas colours come from CSS variables, so repaint
  }
  applyTheme(themeSelect.value);
  themeSelect.addEventListener("change", function () {
    applyTheme(themeSelect.value);
  });

  // --- colour mode ----------------------------------------------------------
  var ageColor = document.getElementById("ageColor");
  function applyColorMode() {
    app.renderer.colorMode = ageColor.checked ? "age" : "solid";
    app.draw();
  }
  applyColorMode();
  ageColor.addEventListener("change", applyColorMode);

  // --- patterns -------------------------------------------------------------
  // Populate the pattern dropdown straight from the library.
  var patternSelect = document.getElementById("pattern");
  Object.keys(GOL.patterns).forEach(function (key) {
    var opt = document.createElement("option");
    opt.value = key;
    opt.textContent = GOL.patterns[key].name;
    patternSelect.appendChild(opt);
  });

  app.patternKey = patternSelect.value;
  patternSelect.addEventListener("change", function () {
    app.patternKey = patternSelect.value;
  });

  document.getElementById("placeBtn").addEventListener("click", function () {
    app.placePattern(patternSelect.value); // centred on the board
  });

  var placeMode = document.getElementById("placeMode");
  placeMode.addEventListener("change", function () {
    app.placeMode = placeMode.checked;
  });

  // --- rules ----------------------------------------------------------------
  var rulePreset = document.getElementById("rulePreset");
  var customRule = document.getElementById("customRule");
  Object.keys(GOL.rulePresets).forEach(function (notation) {
    var opt = document.createElement("option");
    opt.value = notation;
    opt.textContent = GOL.rulePresets[notation] + " (" + notation + ")";
    rulePreset.appendChild(opt);
  });

  function applyRule(notation) {
    var parsed = GOL.parseRule(notation);
    if (!parsed) {
      customRule.classList.add("invalid");
      return false;
    }
    customRule.classList.remove("invalid");
    GOL.setRule(parsed);
    return true;
  }

  // Picking a preset fills the custom box and applies it immediately.
  rulePreset.addEventListener("change", function () {
    customRule.value = rulePreset.value;
    applyRule(rulePreset.value);
  });

  document.getElementById("applyRule").addEventListener("click", function () {
    applyRule(customRule.value);
  });

  // --- wrap-around world ----------------------------------------------------
  var wrap = document.getElementById("wrap");
  wrap.addEventListener("change", function () {
    app.setWrap(wrap.checked);
  });
})(window.GOL);
