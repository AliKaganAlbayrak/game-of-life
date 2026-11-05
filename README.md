# Game of Life

Conway's Game of Life — an interactive cellular automaton simulator that runs
right in the browser. No build step, no dependencies: just open `index.html`.

Simple local rules produce complex, lifelike emergent behaviour: gliders glide,
guns fire, pulsars pulse.

## Rules

A cell is either **alive** or **dead**. Every generation, each cell looks at its
8 neighbours and updates:

- A live cell with **2 or 3** live neighbours survives.
- A live cell with fewer than 2 neighbours dies (underpopulation).
- A live cell with more than 3 neighbours dies (overpopulation).
- A dead cell with exactly **3** live neighbours becomes alive (reproduction).

This is "B3/S23" — but the simulator lets you change the rule (see below).

## Features

- Interactive grid — draw and erase cells with the mouse (and touch)
- Play / pause, single step, and **step back** to undo generations
- Adjustable speed, brush size and random-fill density
- **Age heat-map** colouring and a fading trail for cells that just died
- Four themes: Midnight, Light, Neon, Retro (remembered between visits)
- A library of famous patterns (glider, pulsar, Gosper glider gun, acorn…)
  that you can place at the centre or stamp with the mouse
- **Alternative rules**: HighLife, Seeds, Day & Night and more, plus a custom
  **B/S rule editor**
- Optional wrap-around (toroidal) world
- Save / load to the browser, or export / import a board as JSON
- Live stats: generation, population, peak, FPS and cursor position
- Keyboard shortcuts and a built-in help panel

## Controls

| Key       | Action              |
| --------- | ------------------- |
| `Space`   | Play / pause        |
| `S`       | Single step         |
| `R`       | Random fill         |
| `C`       | Clear               |
| `P`       | Place pattern       |
| `?`       | Toggle help panel   |

Left-drag draws, Shift or right-drag erases. Turn on **Click to place** to stamp
the selected pattern with the mouse.

## Running it

Open `index.html` in any modern browser. That's it. (Or serve the folder with
any static file server, e.g. `python -m http.server`.)

## License

MIT — see [LICENSE](LICENSE).
