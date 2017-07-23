## Mandelbrot Set Explorer
This project implements a simple [Mandelbrot Set](https://en.wikipedia.org/wiki/Mandelbrot_set) explorer in your web browser. It is written in the [React](https://facebook.github.io/react/) framework and the [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) language, and has been a fun exercise for me to learn more about these two technologies. This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

**See the Mandelbrot Explorer live [here](http://www.eengstro.com).**

For build instructions, see the [README-CreateReactApp.md](README-CreateReactApp.md) file, or the Create React App [website](https://github.com/facebookincubator/create-react-app).

## Notes

### Where's Redux?
While there is state being maintained (e.g. window size, view size & position, etc), I didn't feel there were enough state objects to warrant the additional complexity (reducers, action creators, etc) of [Redux](http://redux.js.org/) during my initial implementation. That said, there are some things that *should* be in state, that currently aren't, i.e. color tables. I would like to include Redux in a future version.

### Escape time algorithm
The most straightforward way of implementing a mandelbrot visualization is with the [Escape Time Algorithm](https://en.wikipedia.org/wiki/Mandelbrot_set#Escape_time_algorithm). My implementation of this algorithm is in `mandelbrotCalculator.js`. It is intended to be a pure function (i.e. no side effects), so it can be passed as an argument to other functions. 

### Renderers
The renderers do the heavy lifting: they call a passed-in test function (normally, the escape time algorithm) for each pixel, calculate a color, and return the resulting image. Since the test function is passed in to the renderers, they are examples of the *[dependency injection](https://en.wikipedia.org/wiki/Dependency_injection)* pattern. They are also examples of *[higher-order functions](https://en.wikipedia.org/wiki/Higher-order_function)*, since they take a function as an argument.

There are two renderers implemented currently: `textRenderer` and `histogramRenderer`.

`textRenderer` was my first attempt at visualizing the results of the escape time algorithm, before I dug into how to use the \<canvas>. Instead of returning pixels, it returns a string that I could dump to the console. This was good enough to see the familiar cartioid and bulb shapes of the mandelbrot set, which motivated me to keep going. 

It also allowed me to validate my design approach, which separates the renderer(s) from the escape time algorithm implementation. See `textRenderer.test.js` for an example of passing a different test function to the renderer.

`textRenderer` is not used in the main program.

`histogramRenderer` builds up a normalized histogram as it executes, then uses this when choosing colors from the color table. Colors are linearly interpolated, as there are more possible iteration values than there are color table entries.

`histogramRenderer` is not quite pure, as it writes to the passed-in `ImageData` in place. This is because there is no straightforward way to construct an `ImageData` without a `CanvasRenderingContext2D`, and I didn't want the `histogramRenderer` to depend on the \<canvas>. A possible solution is to return a `Uint8ClampedArray` from the renderer rather than an `ImageData`, and leave it up to the caller to write that to an `ImageData`.

### Components
There are a couple of React components in this program. 

`MandelbrotCanvasComponent` wraps a \<canvas>, calls the renderer, and writes the renderer's output to the \<canvas>. It also reports when each mandelbrot render begins and ends. It exposes several properties to control its behavior, including scene dimensions, center point, and an `onClick` callback.

`ElapsedTimeComponent` is used to report elapsed rendering time in the corner of the browser window. It's a simple example of how React handles properties, and how changing those properties causes the component to refresh itself.

It also demonstrates, inadvertently, that JavaScript is single-threaded: the `ElapsedTimeComponent` should display "Stand by..." during rendering. However, it doesn't, since `histogramRenderer` is a tight, CPU-bound loop; while it's running, React's message handling is starved, and "Stand by..." is not (usually) displayed.

### To-do
- Additional renderers
  - Normalized iteration count, to give smooth colors
  - Allow user to switch renderers on the fly
- User-editable color maps, max iteration count, and other parameters
- General performance improvements
  - Explore WebGL to leverage GPU hardware
  - Multi-threading
- UI improvements
  - Support HiDPI displays
  - Support panning with click-and-drag
  - Support scroll wheel and pinching gestures for zooming
  - Zoom about the cursor rather than about the window center
  - During a zoom, resize the existing rendering while the new render executes in the background
- General code improvements
  - Use Redux for state management
  - A more functional style in the renderer(s)?
  - Introduce [Flow](https://flow.org) or [TypeScript](https://www.typescriptlang.org) for type sanity
  - Make color map a separate module or class, so it can be swapped out easily
  - Document Component properties in comments
  - Class vs module: adopt one pattern or the other for consistency
  - `histogramRenderer` unit tests
