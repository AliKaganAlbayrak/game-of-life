// A small library of famous Game of Life patterns. Each pattern is described
// as rows of text ("O" = live, anything else = dead), which is easy to read
// and edit by hand. `toCells` turns one into a list of live [x, y] offsets.
window.GOL = window.GOL || {};

(function (GOL) {
  "use strict";

  var patterns = {
    glider: {
      name: "Glider",
      rows: [".O.", "..O", "OOO"],
    },
    blinker: {
      name: "Blinker",
      rows: ["OOO"],
    },
    toad: {
      name: "Toad",
      rows: [".OOO", "OOO."],
    },
    beacon: {
      name: "Beacon",
      rows: ["OO..", "OO..", "..OO", "..OO"],
    },
    pulsar: {
      name: "Pulsar",
      rows: [
        "..OOO...OOO..",
        ".............",
        "O....O.O....O",
        "O....O.O....O",
        "O....O.O....O",
        "..OOO...OOO..",
        ".............",
        "..OOO...OOO..",
        "O....O.O....O",
        "O....O.O....O",
        "O....O.O....O",
        ".............",
        "..OOO...OOO..",
      ],
    },
    lwss: {
      name: "Lightweight spaceship",
      rows: ["O..O.", "....O", "O...O", ".OOOO"],
    },
    pentadecathlon: {
      name: "Pentadecathlon",
      rows: ["..O....O..", "OO.OOOO.OO", "..O....O.."],
    },
    acorn: {
      name: "Acorn",
      rows: [".O.....", "...O...", "OO..OOO"],
    },
    diehard: {
      name: "Diehard",
      rows: ["......O.", "OO......", ".O...OOO"],
    },
    rPentomino: {
      name: "R-pentomino",
      rows: [".OO", "OO.", ".O."],
    },
    gliderGun: {
      name: "Gosper glider gun",
      rows: [
        "........................O...........",
        "......................O.O...........",
        "............OO......OO............OO",
        "...........O...O....OO............OO",
        "OO........O.....O...OO..............",
        "OO........O...O.OO....O.O...........",
        "..........O.....O.......O...........",
        "...........O...O....................",
        "............OO......................",
      ],
    },
  };

  // Convert a pattern's text rows into live-cell offsets relative to (0, 0).
  function toCells(pattern) {
    var cells = [];
    for (var y = 0; y < pattern.rows.length; y++) {
      var row = pattern.rows[y];
      for (var x = 0; x < row.length; x++) {
        if (row[x] === "O") cells.push([x, y]);
      }
    }
    return cells;
  }

  GOL.patterns = patterns;
  GOL.patternToCells = toCells;
})(window.GOL);
