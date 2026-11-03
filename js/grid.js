// Grid model: the cell state lives here, independent of how it is drawn.
// Cells are stored in a flat typed array (row-major) for speed.
window.GOL = window.GOL || {};

(function (GOL) {
  "use strict";

  function Grid(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cells = new Uint8Array(cols * rows); // 0 = dead, 1 = alive
    // How many generations each cell has been continuously alive (0 = dead).
    // Used for age-based colouring; capped so the typed array never overflows.
    this.ages = new Uint16Array(cols * rows);
  }

  Grid.prototype.index = function (x, y) {
    return y * this.cols + x;
  };

  Grid.prototype.inBounds = function (x, y) {
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
  };

  Grid.prototype.get = function (x, y) {
    return this.cells[this.index(x, y)];
  };

  Grid.prototype.set = function (x, y, value) {
    var i = this.index(x, y);
    this.cells[i] = value ? 1 : 0;
    this.ages[i] = value ? 1 : 0;
  };

  Grid.prototype.toggle = function (x, y) {
    var i = this.index(x, y);
    var next = this.cells[i] ? 0 : 1;
    this.cells[i] = next;
    this.ages[i] = next;
  };

  Grid.prototype.clear = function () {
    this.cells.fill(0);
    this.ages.fill(0);
  };

  // Number of live cells on the board.
  Grid.prototype.population = function () {
    var count = 0;
    for (var i = 0; i < this.cells.length; i++) count += this.cells[i];
    return count;
  };

  // Fill the grid randomly; `density` is the probability (0..1) a cell is alive.
  Grid.prototype.randomize = function (density) {
    if (density == null) density = 0.3;
    for (var i = 0; i < this.cells.length; i++) {
      var alive = Math.random() < density ? 1 : 0;
      this.cells[i] = alive;
      this.ages[i] = alive;
    }
  };

  // Count the live cells in the 8-cell Moore neighbourhood of (x, y).
  // Cells outside the grid are treated as dead (a bounded world).
  Grid.prototype.countNeighbors = function (x, y) {
    var count = 0;
    for (var dy = -1; dy <= 1; dy++) {
      for (var dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        var nx = x + dx;
        var ny = y + dy;
        if (this.inBounds(nx, ny) && this.cells[this.index(nx, ny)]) {
          count++;
        }
      }
    }
    return count;
  };

  GOL.Grid = Grid;
})(window.GOL);
