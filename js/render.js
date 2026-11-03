// Renderer: knows how to paint a Grid onto a <canvas>.
window.GOL = window.GOL || {};

(function (GOL) {
  "use strict";

  function Renderer(canvas, cellSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.cellSize = cellSize;
  }

  Renderer.prototype.cssVar = function (name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  };

  Renderer.prototype.clear = function () {
    this.ctx.fillStyle = this.cssVar("--bg");
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Renderer.prototype.drawGridLines = function (grid) {
    var ctx = this.ctx;
    var s = this.cellSize;
    ctx.strokeStyle = this.cssVar("--grid-line");
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var x = 0; x <= grid.cols; x++) {
      ctx.moveTo(x * s + 0.5, 0);
      ctx.lineTo(x * s + 0.5, grid.rows * s);
    }
    for (var y = 0; y <= grid.rows; y++) {
      ctx.moveTo(0, y * s + 0.5);
      ctx.lineTo(grid.cols * s, y * s + 0.5);
    }
    ctx.stroke();
  };

  Renderer.prototype.render = function (grid) {
    this.clear();
    this.drawGridLines(grid);
  };

  GOL.Renderer = Renderer;
})(window.GOL);
