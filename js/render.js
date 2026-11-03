// Renderer: knows how to paint a Grid onto a <canvas>.
window.GOL = window.GOL || {};

(function (GOL) {
  "use strict";

  function Renderer(canvas, cellSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.cellSize = cellSize;
    this.colorMode = "age"; // "age" = heat-map by age, "solid" = single colour
    this.showTrails = true; // fade out cells that recently died
  }

  // Map a cell's age to a colour: freshly born cells are cyan, and as they
  // survive they drift through green and yellow to red — a little heat map.
  Renderer.prototype.ageColor = function (age) {
    var t = Math.min(age, 40) / 40; // 0..1
    var hue = 190 - t * 190; // 190 (cyan) -> 0 (red)
    return "hsl(" + hue.toFixed(0) + ", 85%, 62%)";
  };

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

  Renderer.prototype.drawCells = function (grid) {
    var ctx = this.ctx;
    var s = this.cellSize;
    var byAge = this.colorMode === "age";
    var solid = this.cssVar("--cell");
    if (!byAge) ctx.fillStyle = solid;
    for (var y = 0; y < grid.rows; y++) {
      for (var x = 0; x < grid.cols; x++) {
        var i = grid.index(x, y);
        if (grid.cells[i]) {
          if (byAge) ctx.fillStyle = this.ageColor(grid.ages[i]);
          ctx.fillRect(x * s + 1, y * s + 1, s - 1, s - 1);
        }
      }
    }
  };

  Renderer.prototype.drawTrails = function (grid) {
    var ctx = this.ctx;
    var s = this.cellSize;
    for (var y = 0; y < grid.rows; y++) {
      for (var x = 0; x < grid.cols; x++) {
        var i = grid.index(x, y);
        var t = grid.trail[i];
        if (t > 0 && !grid.cells[i]) {
          ctx.fillStyle = "rgba(120, 150, 230, " + ((t / 255) * 0.5).toFixed(3) + ")";
          ctx.fillRect(x * s + 1, y * s + 1, s - 1, s - 1);
        }
      }
    }
  };

  Renderer.prototype.render = function (grid) {
    this.clear();
    this.drawGridLines(grid);
    if (this.showTrails) this.drawTrails(grid);
    this.drawCells(grid);
  };

  GOL.Renderer = Renderer;
})(window.GOL);
