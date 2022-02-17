var positionBuffer
var colorBuffer
const maxVertex = 10000
var countClick = 0
var selectedShape = 'line'


function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas, multiplier) {
  multiplier = multiplier || 1;
  const width  = canvas.clientWidth  * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;
  if (canvas.width !== width ||  canvas.height !== height) {
    canvas.width  = width;
    canvas.height = height;
    return true;
  }
  return false;
}

function getRelativeMousePosition(event) {
  target = event.target;
  var rect = target.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

function getMouseCoordinate(event,gl){
  var pos = getRelativeMousePosition(event);
  return {
     x : pos.x / gl.canvas.width  *  2 - 1,
     y : pos.y / gl.canvas.height * -2 + 1,    
  }
}

function mouseClicked(gl,pos){
  // Mode memindah vertex
  // if (moveMode) {TODO : Ambil moveMode dari input}
  // Mode Membuat Shape
    var shape = document.getElementById("shape");
    shape.addEventListener("click", function (e) {
      selectedShape = e.target.value;
    });
    // Line
    if (selectedShape == 'line'){
      console.log('line')
    }
    // Square
    if (selectedShape == 'square'){
      console.log('square')
    }
    // Rectangle (Adjustable)
    if (selectedShape == 'rectangle'){
      console.log('rectangle')
    }
    // Polygon
    if (selectedShape == 'polygon'){
      console.log('polygon')
    }
  // 
  var positions = [
    pos.x, pos.y,
    pos.x, pos.y + 0.3,
    pos.x + 0.3, pos.y,
  ];
  
  var positions3=[
    pos.x,pos.y,
    pos.x+0.5,pos.y
  ]
  positions3 = new Float32Array([positions3])

  // Contoh penggunaan drawArray, masing masing shape ada cara untuk draw Array sendiri
  // var primitiveType = gl.TRIANGLE;
  // var offset = 0;
  // var count = 3;

  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions3);
  // gl.drawArrays(primitiveType, offset, count);

}

window.onload = function init() {
  var canvas = document.querySelector("#main-canvas");
  var gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
  // var gl = WebGLUtils.setupWebGL(canvas,{preserveDrawingBuffer: true});
  if (!gl) {
    alert ("WebGL is not available");
  }

   // Get the strings for our GLSL shaders
   var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
   var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
 
   // create GLSL shaders, upload the GLSL source, compile the shaders
   var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
   var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
 
   // Link the two shaders into a program
   var program = createProgram(gl, vertexShader, fragmentShader);
  // var program = initShaders(gl, "vertex-shader-2d", "fragment-shader-2d");
  gl.useProgram(program);
  
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 24 * maxVertex, gl.STATIC_DRAW);
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);

  // colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, 24 * maxVertex, gl.STATIC_DRAW);
  // var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(positionAttributeLocation);


  canvas.addEventListener("click", (event) => {
    console.log(event)
    let pos = getMouseCoordinate(event,gl)
    console.log(pos)
    mouseClicked(gl,pos)
  });
  
}

// main();