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
  var AGE_CAP = 65535; // Uint16 max, so ages never wrap around
  var TRAIL_START = 255; // intensity of a freshly vacated cell
  var TRAIL_DECAY = 36; // how fast a trail fades per generation

  GOL.step = function (src, dst) {
    var rule = GOL.rule;
    for (var y = 0; y < src.rows; y++) {
      for (var x = 0; x < src.cols; x++) {
        var i = src.index(x, y);
        var n = src.countNeighbors(x, y);
        var alive = src.cells[i];
        var next = alive ? rule.survive[n] : rule.birth[n];
        dst.cells[i] = next;
        if (next) {
          // survivors keep ageing; freshly born cells start at age 1
          var prev = src.ages[i];
          dst.ages[i] = prev < AGE_CAP ? prev + 1 : AGE_CAP;
          dst.trail[i] = 0;
        } else {
          dst.ages[i] = 0;
          if (alive) {
            dst.trail[i] = TRAIL_START; // this cell just died
          } else {
            var t = src.trail[i];
            dst.trail[i] = t > TRAIL_DECAY ? t - TRAIL_DECAY : 0;
          }
        }
      }
    }
  };
})(window.GOL);
