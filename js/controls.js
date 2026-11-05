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

  // --- step back ------------------------------------------------------------
  document.getElementById("backBtn").addEventListener("click", function () {
    app.pause();
    syncPlayPauseLabel();
    app.stepBack();
  });

  // --- theme ----------------------------------------------------------------
  var THEME_KEY = "gol:theme";
  var themeSelect = document.getElementById("theme");
  function applyTheme(name) {
    document.documentElement.setAttribute("data-theme", name);
    try {
      localStorage.setItem(THEME_KEY, name);
    } catch (e) {
      /* storage may be unavailable */
    }
    app.draw(); // canvas colours come from CSS variables, so repaint
  }
  // Restore the previously chosen theme, if any.
  try {
    var savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) themeSelect.value = savedTheme;
  } catch (e) {
    /* ignore */
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

  // --- grid lines -----------------------------------------------------------
  var showGrid = document.getElementById("showGrid");
  showGrid.addEventListener("change", function () {
    app.renderer.showGrid = showGrid.checked;
    app.draw();
  });

  // --- brush size -----------------------------------------------------------
  var brush = document.getElementById("brush");
  app.setBrushSize(parseInt(brush.value, 10));
  brush.addEventListener("input", function () {
    app.setBrushSize(parseInt(brush.value, 10));
  });

  // --- random density -------------------------------------------------------
  var densityInput = document.getElementById("density");
  app.setDensity(parseInt(densityInput.value, 10) / 100);
  densityInput.addEventListener("input", function () {
    app.setDensity(parseInt(densityInput.value, 10) / 100);
  });

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

  // --- help panel -----------------------------------------------------------
  var help = document.getElementById("help");
  function toggleHelp() {
    help.classList.toggle("hidden");
  }
  document.getElementById("helpBtn").addEventListener("click", toggleHelp);
  GOL.toggleHelp = toggleHelp; // reused by the keyboard handler

  // --- auto-pause when the tab is hidden ------------------------------------
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && app.running) {
      app.pause();
      syncPlayPauseLabel();
    }
  });

  // --- save / load ----------------------------------------------------------
  document.getElementById("saveBtn").addEventListener("click", function () {
    app.saveState();
  });
  document.getElementById("loadBtn").addEventListener("click", function () {
    if (app.loadState()) {
      app.pause();
      syncPlayPauseLabel();
      wrap.checked = app.grid.wrap;
    }
  });

  // --- export / import as JSON text -----------------------------------------
  document.getElementById("exportBtn").addEventListener("click", function () {
    var json = JSON.stringify(app.exportState());
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).then(
        function () {
          window.alert("Board copied to clipboard as JSON.");
        },
        function () {
          window.prompt("Copy the board JSON:", json);
        }
      );
    } else {
      window.prompt("Copy the board JSON:", json);
    }
  });

  document.getElementById("importBtn").addEventListener("click", function () {
    var text = window.prompt("Paste board JSON:");
    if (!text) return;
    var state;
    try {
      state = JSON.parse(text);
    } catch (e) {
      window.alert("That isn't valid JSON.");
      return;
    }
    if (app.importState(state)) {
      app.pause();
      syncPlayPauseLabel();
      wrap.checked = app.grid.wrap;
    } else {
      window.alert("Board size doesn't match — can't import this one.");
    }
  });

  // --- remember UI settings -------------------------------------------------
  // Persist a handful of inputs so the controls come back the way you left them.
  // We restore the value then fire the input's own event so its effect applies.
  var persisted = [
    { id: "speed", prop: "value", evt: "input" },
    { id: "density", prop: "value", evt: "input" },
    { id: "brush", prop: "value", evt: "input" },
    { id: "ageColor", prop: "checked", evt: "change" },
    { id: "showGrid", prop: "checked", evt: "change" },
  ];
  persisted.forEach(function (item) {
    var el = document.getElementById(item.id);
    var key = "gol:ui:" + item.id;
    try {
      var saved = localStorage.getItem(key);
      if (saved !== null) {
        el[item.prop] = item.prop === "checked" ? saved === "true" : saved;
        el.dispatchEvent(new Event(item.evt));
      }
    } catch (e) {
      /* ignore */
    }
    el.addEventListener(item.evt, function () {
      try {
        localStorage.setItem(key, el[item.prop]);
      } catch (e) {
        /* ignore */
      }
    });
  });
})(window.GOL);
