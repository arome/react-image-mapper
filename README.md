# react-image-mapper

React Component to highlight interactive zones in images

## Demo & Examples

Live demo: [coldiary.github.io/react-image-mapper](http://arome.github.io/react-image-mapper/)

To build the example locally, run:

```
npm install
npm start
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.

## Installation

The easiest way to use react-image-mapper is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-image-mapper.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-image-mapper --save
```

## Usage

Import the component as you normally do, and add it wherever you like in your JSX views as below:

```javascript
// ES5 require
var ImageMapper = require('react-image-mapper');

// ES6 import
import ImageMapper from 'react-image-mapper';

<ImageMapper src={IMAGE_URL} map={AREAS_MAP} />;
```

### Properties

| Props           | type     | Description                                       | default                                                                        |
| --------------- | -------- | ------------------------------------------------- | ------------------------------------------------------------------------------ |
| **src**         | _string_ | Image source url                                  | **required**                                                                   |
| **map**         | _object_ | Mapping description                               | `{ name: generated, areas: [ ] }`<br/>(see below)                              |
| **fillColor**   | _string_ | Fill color of the highlighted zone                | `rgba(255, 255, 255, 0.5)`                                                     |
| **strokeColor** | _string_ | Border color of the highlighted zone              | `rgba(0, 0, 0, 0.5)`                                                           |
| **lineWidth**   | _number_ | Border thickness of the highlighted zone          | `1`                                                                            |
| **width**       | _number_ | Image width                                       | `Displayed width`                                                              |
| **height**      | _number_ | Image height                                      | `Displayed height`                                                             |
| **active**      | _bool_   | Enable/Disable highlighting                       | `true`                                                                         |
| **imgWidth**    | _number_ | Original image width                              | `null`                                                                         |
| **imgHeight**    | _number_ | Original image height                              | `null`                                                                         |
| **path**        | _object_ | A path to draw between different areas on the map | `{line:{color:"red",strokeWidth:3},circle:{color:"red",radius:5}`<br/>(see below)|

| Props callbacks            | Called on                                                                    | signature                              |
| -------------------------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| **onLoad**                 | Image loading and canvas initialization completed                            | `(): void`                             |
| **onExtendedAreasCreated** | The extended areas (with `scaledCoords` etc., see below) have been created   | `(extendedAreas: obj[]): void`         |
| **onMouseEnter**           | Hovering a zone in image                                                     | `(area: obj, index: num, event): void` |
| **onMouseLeave**           | Leaving a zone in image                                                      | `(area: obj, index: num, event): void` |
| **onMouseMove**            | Moving mouse on a zone in image                                              | `(area: obj, index: num, event): void` |
| **onMouseDown**            | Pressing a mouse button on a zone in image                                   | `(area: obj, index: num, event): void` |
| **onMouseUp**              | Releasing a mouse button while the pointer is located in a zone in the image | `(area: obj, index: num, event): void` |
| **onClick**                | Click on a zone in image                                                     | `(area: obj, index: num, event): void` |
| **onImageClick**           | Click outside of a zone in image                                             | `(event): void`                        |
| **onImageMouseMove**       | Moving mouse on the image itself                                             | `(event): void`                        |
| **onImageMouseDown**       | Pressing a mouse button on the image itself                                  | `(event): void`                        |
| **onImageMouseUp**         | Releasing a mouse button while the pointer is located in the image itself    | `(event): void`                        |

Map is an object describing highlighted areas in the image.

Its structure is similar to the HTML syntax of mapping:

- **map**: (_object_) Object to describe highlighted zones 
	- **name**: (_string_) Name of the map, used to bind to the image. 
	- **areas**: (_array_) Array of **area objects** 
		- **area**: (_object_) Shaped like below :

| Property   |       type        | Description                                                                                                                                                                                                                                                                               |
| ---------- | :---------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **\_id**   |     _string_      | Uniquely identify an area. Index in array is used if this value is not provided.                                                                                                                                                                                                          |
| **shape**  |     _string_      | Either `rect`, `circle` or `poly`                                                                                                                                                                                                                                                         |
| **coords** | _array of number_ | Coordinates delimiting the zone according to the specified shape: <ul><li>**rect**: `top-left-X`,`top-left-Y`,`bottom-right-X`,`bottom-right-Y`</li><li>**circle**: `center-X`,`center-Y`,`radius`</li><li>**poly**: Every point in the polygon path as `point-X`,`point-Y`,...</li></ul> |
| **href**   |     _string_      | Target link for a click in the zone (note that if you provide a onClick prop, `href` will be prevented)                                                                                                                                                                                   |

Path is an object describing the path to draw on the map between available areas on the map.

Its structure is as follow:

- **path**: (_object_) Object to describe the path to draw
	- **line**: (_object_) Styling of the lines between two areas
  	- **color**: (_string_) Color of the line
  	- **strokeWidth**: (_number_) Stroke width of the line 
	- **circle**: (_object_) Styling of the circles at the extremeties of a line 
		- **color**: (_string_) Color of the point
		- **radius**: (_number_) Radius of the circle to draw 
	- **steps**: (_array of array_): An array of arrays containing a pair of number representing the pair of areas to draw a line between. The number represent the position of the area in the map. i.e. [[1,2], [2,3]] will draw a line from area 1 to 2 then from 2 to 3.

When received from an event handler, an area is extended with the following properties:

| Property         |       type        | Description                                                           |
| ---------------- | :---------------: | --------------------------------------------------------------------- |
| **scaledCoords** | _array of number_ | Scaled coordinates (see [Dynamic Scaling](#dynamic-scaling) below)    |
| **center**       | _array of number_ | Coordinates positionning the center or centroid of the area: `[X, Y]` |

## Dynamic scaling

When a parent component updates the **width**/**height** props on `<ImageMapper>`, the area coordinates also have to be scaled. This can be accomplied by specifying both the new **width**/**height** and a constant **imgWidth**/**imgHeight**. **imgWidth**/**imgHeight** is the width/height of the original image. `<ImageMapper>` will calculate the new coordinates for each area. For example:

```javascript
/* assume that image is actually 1500px wide and 1000px tall */

// this will be a 1:1 scale, areas will be 3x bigger than they should be
<ImageMapper width={500} />

// this will be the same 1:1 scale, same problem with areas being too big
<ImageMapper width={500} imgWidth={500} />

// this will scale the areas to 1/3rd, they will now fit the 500px image on the screen
<ImageMapper width={500} imgWidth={1500} />

// this will scale the areas vertically to 1/2, they will now fit the 500px height on the screen
<ImageMapper height={500} imgHeight={1000} />
```

## Development (`src`, `lib` and the build process)

**NOTE:** The source code for the component is in `src`. A transpiled CommonJS version (generated with Babel) is available in `lib` for use with node.js, browserify and webpack. A UMD bundle is also built to `dist`, which can be included without the need for any build system.

To build, watch and serve the examples (which will also watch the component source), run `npm start`. If you just want to watch changes to `src` and rebuild `lib`, run `npm run watch` (this is useful if you are working with `npm link`).

### Notes & Contributions

This a component is still a work in progress.

If you encounter a bug of some kind, feel free to report the issue.

If you'd like to improve this code or ask/advise for any improvement, feel free to comment it as well.

## License

Distributed with an MIT License. See LICENSE.txt for more details

Copyright (c) 2017 Coldiary.
