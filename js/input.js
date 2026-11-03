// Mouse / touch drawing on the board. Left button (or touch) paints live
// cells; holding Shift or the right button erases.
(function (GOL) {
  "use strict";

  var app = GOL.app;
  var canvas = app.canvas;
  var drawing = false;
  var eraseMode = false;

  // The canvas is displayed scaled (CSS max-width), so map screen pixels back
  // to the canvas's own coordinate system before painting.
  function toCanvasCoords(evt) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY,
    };
  }

  function paint(evt) {
    var p = toCanvasCoords(evt);
    if (app.paintAtPixel(p.x, p.y, !eraseMode)) {
      app.draw();
    }
  }

  canvas.addEventListener("mousedown", function (evt) {
    evt.preventDefault();
    drawing = true;
    eraseMode = evt.button === 2 || evt.shiftKey;
    paint(evt);
  });

  canvas.addEventListener("mousemove", function (evt) {
    if (drawing) paint(evt);
  });

  window.addEventListener("mouseup", function () {
    drawing = false;
  });

  // Don't pop up the context menu when erasing with the right button.
  canvas.addEventListener("contextmenu", function (evt) {
    evt.preventDefault();
  });
})(window.GOL);
