// Entry point: wires the grid model to the renderer and boots the app.
(function (GOL) {
  "use strict";

  var CELL_SIZE = 10;

  var canvas = document.getElementById("board");
  var cols = Math.floor(canvas.width / CELL_SIZE);
  var rows = Math.floor(canvas.height / CELL_SIZE);

  // Double buffering: `grid` is the current generation, `back` receives the
  // next one, then the two are swapped.
  var grid = new GOL.Grid(cols, rows);
  var back = new GOL.Grid(cols, rows);
  var renderer = new GOL.Renderer(canvas, CELL_SIZE);

  var generation = 0;
  var genEl = document.getElementById("genCount");
  var popEl = document.getElementById("popCount");

  function step() {
    GOL.step(grid, back);
    var tmp = grid;
    grid = back;
    back = tmp;
    generation++;
  }

  function updateStats() {
    genEl.textContent = generation;
    popEl.textContent = grid.population();
  }

  function draw() {
    renderer.render(grid);
    updateStats();
  }

  // --- animation loop -------------------------------------------------------
  var running = false;
  var speed = 10; // generations per second
  var lastTime = 0;
  var accumulator = 0;

  // FPS measurement (rendered frames per second, sampled ~twice a second).
  var fpsEl = document.getElementById("fpsCount");
  var fpsFrames = 0;
  var fpsLast = 0;

  function measureFps(now) {
    fpsFrames++;
    if (now - fpsLast >= 500) {
      fpsEl.textContent = Math.round((fpsFrames * 1000) / (now - fpsLast));
      fpsFrames = 0;
      fpsLast = now;
    }
  }

  function tick(now) {
    if (!running) return;
    var dt = now - lastTime;
    lastTime = now;
    accumulator += dt;

    var interval = 1000 / speed;
    while (accumulator >= interval) {
      step();
      accumulator -= interval;
    }
    draw();
    measureFps(now);
    requestAnimationFrame(tick);
  }

  function play() {
    if (running) return;
    running = true;
    lastTime = performance.now();
    accumulator = 0;
    fpsLast = lastTime;
    fpsFrames = 0;
    requestAnimationFrame(tick);
  }

  function pause() {
    running = false;
    fpsEl.textContent = 0;
  }

  function setSpeed(value) {
    speed = value;
  }

  // Wrap applies to whichever buffer is current, so set it on both.
  function setWrap(on) {
    grid.wrap = on;
    back.wrap = on;
  }

  // Stamp a named pattern. By default it is centred on the board; pass grid
  // coordinates (gx, gy) to place its top-left corner somewhere specific.
  function placePattern(key, gx, gy) {
    var pattern = GOL.patterns[key];
    if (!pattern) return;
    var cells = GOL.patternToCells(pattern);
    var w = pattern.rows[0].length;
    var h = pattern.rows.length;
    if (gx == null) gx = Math.floor((grid.cols - w) / 2);
    if (gy == null) gy = Math.floor((grid.rows - h) / 2);
    grid.stamp(cells, gx, gy);
    draw();
  }

  // Stamp a pattern centred on a canvas pixel position (used for click-to-place).
  function placePatternAtPixel(key, px, py) {
    var pattern = GOL.patterns[key];
    if (!pattern) return;
    var w = pattern.rows[0].length;
    var h = pattern.rows.length;
    var cx = Math.floor(px / CELL_SIZE) - Math.floor(w / 2);
    var cy = Math.floor(py / CELL_SIZE) - Math.floor(h / 2);
    placePattern(key, cx, cy);
  }

  // Convert a canvas pixel position to grid coordinates and set a cell.
  // Returns true if a cell actually changed (so callers can avoid redundant
  // redraws while dragging).
  var brushSize = 1; // paints a brushSize x brushSize block of cells

  function paintAtPixel(px, py, value) {
    var cx = Math.floor(px / CELL_SIZE);
    var cy = Math.floor(py / CELL_SIZE);
    var half = Math.floor(brushSize / 2);
    var changed = false;
    for (var dy = 0; dy < brushSize; dy++) {
      for (var dx = 0; dx < brushSize; dx++) {
        var x = cx - half + dx;
        var y = cy - half + dy;
        if (grid.inBounds(x, y) && grid.get(x, y) !== (value ? 1 : 0)) {
          grid.set(x, y, value);
          changed = true;
        }
      }
    }
    return changed;
  }

  function setBrushSize(value) {
    brushSize = Math.max(1, value | 0);
  }

  // Serialise the board to a compact plain object: just the live cell indices
  // plus the current settings. (Ages/trails are cosmetic and not saved.)
  function exportState() {
    var alive = [];
    for (var i = 0; i < grid.cells.length; i++) {
      if (grid.cells[i]) alive.push(i);
    }
    return {
      cols: grid.cols,
      rows: grid.rows,
      alive: alive,
      generation: generation,
      wrap: grid.wrap,
    };
  }

  var STORAGE_KEY = "gol:save";

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exportState()));
      return true;
    } catch (e) {
      return false; // storage may be unavailable (private mode, etc.)
    }
  }

  // Restore a board previously produced by exportState(). Dimensions must match
  // the current grid (the board size is fixed for a session).
  function importState(state) {
    if (!state || state.cols !== grid.cols || state.rows !== grid.rows) {
      return false;
    }
    grid.clear();
    for (var k = 0; k < state.alive.length; k++) {
      var i = state.alive[k];
      grid.cells[i] = 1;
      grid.ages[i] = 1;
    }
    generation = state.generation || 0;
    setWrap(!!state.wrap);
    draw();
    return true;
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      return importState(JSON.parse(raw));
    } catch (e) {
      return false;
    }
  }

  var density = 0.3; // fraction of live cells when randomising

  function setDensity(value) {
    density = value;
  }

  function randomize() {
    grid.randomize(density);
    generation = 0;
    draw();
  }

  function clear() {
    grid.clear();
    generation = 0;
    draw();
  }

  // Advance exactly one generation (useful while paused, to study a pattern).
  function stepOnce() {
    step();
    draw();
  }

  // Start with a famous pattern so the board isn't empty on first load.
  placePattern("gliderGun", 2, 2);
  draw();

  // expose for debugging in the console
  GOL.app = {
    get grid() {
      return grid;
    },
    get running() {
      return running;
    },
    renderer: renderer,
    step: step,
    draw: draw,
    play: play,
    pause: pause,
    setSpeed: setSpeed,
    setBrushSize: setBrushSize,
    setWrap: setWrap,
    saveState: saveState,
    loadState: loadState,
    paintAtPixel: paintAtPixel,
    placePattern: placePattern,
    placePatternAtPixel: placePatternAtPixel,
    placeMode: false, // when true, clicking stamps the current pattern
    patternKey: "glider",
    pixelToCell: function (px, py) {
      return { x: Math.floor(px / CELL_SIZE), y: Math.floor(py / CELL_SIZE) };
    },
    randomize: randomize,
    setDensity: setDensity,
    clear: clear,
    stepOnce: stepOnce,
    canvas: canvas,
    cellSize: CELL_SIZE,
  };
})(window.GOL);
