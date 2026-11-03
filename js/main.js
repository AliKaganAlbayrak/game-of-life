// Entry point: wires the grid model to the renderer and boots the app.
(function (GOL) {
  "use strict";

  var CELL_SIZE = 10;

  var canvas = document.getElementById("board");
  var cols = Math.floor(canvas.width / CELL_SIZE);
  var rows = Math.floor(canvas.height / CELL_SIZE);

  var grid = new GOL.Grid(cols, rows);
  var renderer = new GOL.Renderer(canvas, CELL_SIZE);

  renderer.render(grid);

  // expose for debugging in the console
  GOL.app = { grid: grid, renderer: renderer };
})(window.GOL);
