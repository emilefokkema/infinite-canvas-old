# infiniteCanvas
### an infinite version of the html5 &lt;canvas&gt;

The usual way to draw on a `<canvs>` is of course to get a context like
```js
var context = document.getElementById("canvas").getContext("2d");
```
and then to use it to draw, say, a rectangle like
```
context.fillStyle = "#000";
context.fillRect(0, 0, 10, 10);
```

With `infiniteCanvas`, the usage is almost the same. Initialize like this:
```js
var canvas = document.getElementById("canvas"); //get the canvas element
var wrapped = infiniteCanvas(canvas); //get an infiniteCanvas for this canvas
```
and then draw on it like this:
```js
wrapped.onDraw(function(context){ //this context implements all methods and properties
// of the usual CanvasRenderingContext2D (even more!)
    context.fillStyle = "#000";
    context.fillRect(0, 0, 10, 10);
});
```
Now you can zoom and pan the canvas. See [examples](https://emilefokkema.github.io/infinite-canvas/).
