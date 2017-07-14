This project implements a simple [Mandelbrot Set](https://en.wikipedia.org/wiki/Mandelbrot_set) explorer in your web browser. It is written in the [React](https://facebook.github.io/react/) framework and the [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) language, and has been a fun exercise for me to learn more about these two technologies. This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## To-do
- Additional renderers
  - Normalized iteration count, to give smooth colors
  - Allow user to switch renderers on the fly
- User-editable color maps
- Explore WebGL to leverage GPU hardware
- General performance improvements in the histogram renderer
- UI improvements
  - Support panning with click-and-drag
  - Support scroll wheel and pinching gestures for zooming
  - Zoom about the cursor rather than about the window center
  - During a zoom, resize the existing rendering while the new render executes in the background
- General code improvements
  - A more functional style in the renderer(s)
  - Introduce [Flow](https://flow.org) or [TypeScript](https://www.typescriptlang.org) for type sanity
  - Class vs module: adopt one pattern or the other for consistency