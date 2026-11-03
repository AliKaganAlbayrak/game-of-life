// The rules that turn one generation into the next.
//
// Classic Conway's Life is "B3/S23": a dead cell is Born with exactly 3 live
// neighbours, a live cell Survives with 2 or 3. We keep the rule as lookup
// tables so alternative rules can be plugged in later.
window.GOL = window.GOL || {};

(function (GOL) {
  "use strict";

  // birth[n] / survive[n] === 1 means that neighbour count keeps/creates life.
  GOL.rule = {
    birth: [0, 0, 0, 1, 0, 0, 0, 0, 0],
    survive: [0, 0, 1, 1, 0, 0, 0, 0, 0],
  };

  // Compute the next generation of `src` into `dst` (double buffering: we never
  // mutate the grid we are reading from, so neighbour counts stay consistent).
  GOL.step = function (src, dst) {
    var rule = GOL.rule;
    for (var y = 0; y < src.rows; y++) {
      for (var x = 0; x < src.cols; x++) {
        var n = src.countNeighbors(x, y);
        var alive = src.get(x, y);
        var next = alive ? rule.survive[n] : rule.birth[n];
        dst.cells[dst.index(x, y)] = next;
      }
    }
  };
})(window.GOL);
