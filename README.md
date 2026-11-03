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

## Features

- Interactive grid you can draw on with the mouse
- Play / pause and adjustable speed
- Random fill and clear
- (more coming — see the commit history)

## Running it

Open `index.html` in any modern browser. That's it.

## License

MIT — see [LICENSE](LICENSE).
