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

  function step() {
    GOL.step(grid, back);
    var tmp = grid;
    grid = back;
    back = tmp;
  }

  function draw() {
    renderer.render(grid);
  }

  draw();

  // expose for debugging in the console
  GOL.app = {
    get grid() {
      return grid;
    },
    renderer: renderer,
    step: step,
    draw: draw,
  };
})(window.GOL);
