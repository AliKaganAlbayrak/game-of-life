// Grid model: the cell state lives here, independent of how it is drawn.
// Cells are stored in a flat typed array (row-major) for speed.
window.GOL = window.GOL || {};

(function (GOL) {
  "use strict";

  function Grid(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cells = new Uint8Array(cols * rows); // 0 = dead, 1 = alive
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
    this.cells[this.index(x, y)] = value ? 1 : 0;
  };

  Grid.prototype.toggle = function (x, y) {
    var i = this.index(x, y);
    this.cells[i] = this.cells[i] ? 0 : 1;
  };

  Grid.prototype.clear = function () {
    this.cells.fill(0);
  };

  GOL.Grid = Grid;
})(window.GOL);
