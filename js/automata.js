// Alternative "life-like" rules. A rule is written in B/S notation: the digits
// after B are the neighbour counts that give Birth to a dead cell, and the
// digits after S are the counts that let a live cell Survive. Conway's Life is
// "B3/S23".
window.GOL = window.GOL || {};

(function (GOL) {
  "use strict";

  // Parse "B3/S23" into the birth/survive lookup tables the engine uses.
  // Returns null if the string is not valid B/S notation.
  function parseRule(text) {
    var m = /^\s*B([0-8]*)\/S([0-8]*)\s*$/i.exec(text);
    if (!m) return null;
    var birth = new Uint8Array(9);
    var survive = new Uint8Array(9);
    for (var i = 0; i < m[1].length; i++) birth[+m[1][i]] = 1;
    for (var j = 0; j < m[2].length; j++) survive[+m[2][j]] = 1;
    return { birth: birth, survive: survive };
  }

  // Apply a parsed rule to the live engine.
  function setRule(rule) {
    GOL.rule.birth = rule.birth;
    GOL.rule.survive = rule.survive;
  }

  var presets = {
    "B3/S23": "Conway's Life",
    "B36/S23": "HighLife",
    "B2/S": "Seeds",
    "B3678/S34678": "Day & Night",
    "B1357/S1357": "Replicator",
    "B345/S5": "Long Life",
  };

  GOL.parseRule = parseRule;
  GOL.setRule = setRule;
  GOL.rulePresets = presets;
})(window.GOL);
