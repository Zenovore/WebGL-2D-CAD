var positionBuffer
var colorBuffer
const maxVertex = 10000
var countClick = 0
var selectedShape = 'line'
var positionAttributeLocation
var colorUniformLocation
var selectedColor = {r:0,g:0,b:0}
var saveData // TODO: Fitur save, semua shape dan color disimpan kesini
var allLineData // TODO: Array of all line [[lineData],[lineData]]
var lineData // TODO: Array of 2 vertex and color [[x1,y1,x2,y2],[color{r,g,b}]]
var allSquareData // TODO: Array of all line [[squareData],[squareData]]
var squareData // TODO: Array of 4 vertex and color [[x1,y1,x2,y2,x3,y3,..],[color{r,g,b}]]
var allRectangleData // TODO: Array of all line [[rectangleData],[rectangleData]]
var rectangleData// TODO: Array of 4 vertex and color [[x1,y1,x2,y2,x3,y3,..],[color{r,g,b}]]
var allPolygonData  // TODO: Array of all polygon [[polygonData],[polygonData]]
var polygonData // TODO: Array of n vertex and color [[x1,y1,x2,y2,xn,yn,..],[color{r,g,b}]]

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

function getColorInHex(e){
  console.log(e.target.value)
  hex = e.target.value
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var rgbData = result ?  {
    r: parseInt(result[1], 16)/255,
    g: parseInt(result[2], 16)/255,
    b: parseInt(result[3], 16)/255
  } : null;
  selectedColor = rgbData
}

function mouseClicked(gl,pos){ // TODO: Ambil vertex dari pos, cari pasangannya, push ke dalam data (line 9 -17)
  // Mode memindah vertex
  // if (moveMode) {TODO : Ambil moveMode dari input}
  // Mode Membuat Shape
  // Line TODO: Afif
  if (selectedShape == 'line'){
    console.log('line')
  }
  // Square TODO: Ahan
  if (selectedShape == 'square'){
    console.log('square')
  }
  // Rectangle (Adjustable) TODO: Chris
  if (selectedShape == 'rectangle'){
    console.log('rectangle')
  }
  // Polygon TODO: Alex
  if (selectedShape == 'polygon'){
    console.log('polygon')
  }
  render(gl,pos)
}
function render(gl,pos){ // TODO: Ambil vertex data, create array, gambar sesuai bentuk

  // Line TODO: Afif
  if (selectedShape == 'line'){
    console.log('line')
  }
  // Square TODO: Ahan
  if (selectedShape == 'square'){
    console.log('square')
  }
  // Rectangle (Adjustable) TODO: Chris
  if (selectedShape == 'rectangle'){
    console.log('rectangle')
  }
  // Polygon TODO: Alex
  if (selectedShape == 'polygon'){
    console.log('polygon')
  }


  // How to draw 
  // 1. Bikin posisinya, posisinya dependen sama lokasi cursor, yaitu pos
  
  // var positions = [
  //   pos.x, pos.y,
  //   pos.x, pos.y + 0.3,
  //   pos.x + 0.3, pos.y,
  // ];
  
  // var positions3=[
  //   pos.x,pos.y,
  //   pos.x+0.5,pos.y
  // ]

  // 2. Ubah Posisi ke Array Float32
  // positions3 = new Float32Array(positions3)
  // positions = new Float32Array(positions)
  
  // 3. warna, sudah sesuai sama data di input
  gl.uniform4f(colorUniformLocation,selectedColor.r,selectedColor.g,selectedColor.b, 1);
  
  // 4. Bind Buffer
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 5. Masukin Array Float32 ke dalem buffer subData
  // gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);

  // 6. Contoh penggunaan drawArray, masing masing shape ada cara untuk draw Array sendiri
  // var primitiveType = gl.TRIANGLES;
  // primitive Type ini ada berbagai macam bentuk, bisa cek di dokumentasi
  // var offset = 0;
  // var count = 3;
  
  // 7. Gambar 
  // gl.drawArrays(primitiveType, offset, count);
}

window.onload = function init() {
  // SETUP WEBGL
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
  positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  colorUniformLocation = gl.getUniformLocation(program, "u_color");
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);

  // EVENT HANDLER
  var shape = document.getElementById("shape");
  shape.addEventListener("click", function (e) {
    selectedShape = e.target.value;
  });

  var color = document.getElementById("color-picker");
  color.addEventListener("change", function (e) {
    getColorInHex(e)
  });

  // EVENT HANDLER
  canvas.addEventListener("click", (event) => {
    console.log(event)
    let pos = getMouseCoordinate(event,gl)
    console.log(pos)
    render(gl,pos)
  });
  
}

// main();