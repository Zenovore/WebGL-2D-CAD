var gl;

var positionBuffer;
var colorBuffer;
const maxVertex = 10000;
var countClick = 0;

var selectedShape = "line";

var polygonVertex = 3;
var countPolygonVertex = 3;

var lineVertex = 2;
var countLineVertex = 2;

var countRectangleVertex = 2;

var positionAttributeLocation;
var colorUniformLocation;
var selectedColor = { r: 0, g: 0, b: 0 };

var allLineData = []; // TODO: Array of all line [[lineData],[lineData]]
var lineData = []; // TODO: Array of 2 vertex and color [[x1,y1,x2,y2],[color{r,g,b}]]

var allSquareData = []; // TODO: Array of all line [[squareData],[squareData]]
var squareData = []; // TODO: Array of 4 vertex and color [[x1,y1,x2,y2,x3,y3,..],[color{r,g,b}]]

var allRectangleData = []; // TODO: Array of all line [[rectangleData],[rectangleData]]
var rectangleData = []; // TODO: Array of 4 vertex and color [[x1,y1,x2,y2,x3,y3,..],[color{r,g,b}]]

var allPolygonData = []; // TODO: Array of all polygon [[polygonData],[polygonData]]
var polygonData = []; // TODO: Array of n vertex and color [[x1,y1,x2,y2,xn,yn,..],[color{r,g,b}]]

var canvasWidth;
var canvasHeight;

var width = 0.5;

// ================= SHADER AND PROGRAM =================
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

// ================= CANVAS AND POSITION =================
function resizeCanvasToDisplaySize(canvas, multiplier) {
  multiplier = multiplier || 1;
  const width = (canvas.clientWidth * multiplier) | 0;
  const height = (canvas.clientHeight * multiplier) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
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
  };
}

function getMouseCoordinate(event) {
  var pos = getRelativeMousePosition(event);
  return {
    x: (pos.x / canvasWidth) * 2 - 1,
    y: (pos.y / canvasHeight) * -2 + 1,
  };
}

function getColorInHex(e) {
  console.log(e.target.value);
  hex = e.target.value;
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var rgbData = result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : null;
  selectedColor = rgbData;
}

function mouseClicked(pos) {
  // TODO: Ambil vertex dari pos, cari pasangannya, push ke dalam data (line 9 -17)
  // Line TODO: Afif
  if (selectedShape == "line") {
    console.log("line");
    countLineVertex--;
    console.log(countLineVertex);
    if (countLineVertex == 0) {
      lineData.push(pos.x);
      lineData.push(pos.y);
      console.log(lineData);
      render();
    } else {
      lineData.push(pos.x);
      lineData.push(pos.y);
    }
  }
  // Square TODO: Ahan
  if (selectedShape == "square") {
    console.log("square");
    var widthx = (width / canvasWidth) * 720;
    var widthy = (width / canvasHeight) * 720;

    squareData.push(pos.x);
    squareData.push(pos.y);

    squareData.push(pos.x + widthx);
    squareData.push(pos.y);

    squareData.push(pos.x);
    squareData.push(pos.y + widthy);

    squareData.push(pos.x + widthx);
    squareData.push(pos.y + widthy);
    console.log(squareData);
    render();
  }
  // Rectangle (Adjustable) TODO: Chris
  if (selectedShape == "rectangle") {
    console.log("rectangle");
    console.log(pos);
    countRectangleVertex--;
    if (countRectangleVertex == 0) {
      rectangleData[2] = pos.x;
      rectangleData[4] = pos.x;
      rectangleData[5] = pos.y;
      rectangleData[7] = pos.y;
      console.log(rectangleData);
      render();
    } else {
      for (var i = 0; i < 4; i++) {
        rectangleData.push(pos.x);
        rectangleData.push(pos.y);
      }
    }
  }
  // Polygon TODO: Alex
  if (selectedShape == "polygon") {
    console.log("polygon");
    console.log(pos);
    countPolygonVertex--;
    console.log(countPolygonVertex);
    if (countPolygonVertex == 0) {
      polygonData.push(pos.x);
      polygonData.push(pos.y);
      console.log(polygonData);
      render();
    } else {
      polygonData.push(pos.x);
      polygonData.push(pos.y);
    }
  }
  // render(gl,pos)
}

function loadLine() {
  selectedShape = "line";
  allLineData.map((item, index) => {
    lineData = item[0];
    render();
  });
}

function loadSquare() {
  selectedShape = "square";
  allSquareData.map((item, index) => {
    squareData = item[0];
    render();
  });
}

function loadRectangle() {
  selectedShape = "rectangle";
  allRectangleData.map((item, index) => {
    rectangleData = item[0];
    render();
  });
}

function loadPolygon() {
  selectedShape = "polygon";
  allPolygonData.map((item, index) => {
    polygonData = item[0];
    render();
  });
}

function render() {
  // TODO: Ambil vertex data, create array, gambar sesuai bentuk

  // Line TODO: Afif
  if (selectedShape == "line") {
    positions = new Float32Array(lineData);
    gl.uniform4f(
      colorUniformLocation,
      selectedColor.r,
      selectedColor.g,
      selectedColor.b,
      1
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    count = lineVertex;
    countLineVertex = lineVertex;
    gl.drawArrays(gl.LINE_STRIP, 0, count);
    allLineData.push([lineData, selectedColor, lineVertex]); // SAVE TO DATA
    lineData = [];
  }
  // Square TODO: Ahan
  if (selectedShape == "square") {
    console.log("square");
    positions = new Float32Array(squareData);
    gl.uniform4f(
      colorUniformLocation,
      selectedColor.r,
      selectedColor.g,
      selectedColor.b,
      1
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    count = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
    allSquareData.push([squareData, selectedColor]); // SAVE TO DATA
    squareData = [];
  }
  // Rectangle (Adjustable) TODO: Chris
  if (selectedShape == "rectangle") {
    positions = new Float32Array(rectangleData);
    gl.uniform4f(
      colorUniformLocation,
      selectedColor.r,
      selectedColor.g,
      selectedColor.b,
      1
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    count = 4;
    countRectangleVertex = 2;
    gl.drawArrays(gl.TRIANGLE_FAN, 0, count);
    allRectangleData.push([rectangleData, selectedColor, 4]); // SAVE TO DATA
    rectangleData = [];
  }
  // Polygon TODO: Alex
  if (selectedShape == "polygon") {
    positions = new Float32Array(polygonData);
    gl.uniform4f(
      colorUniformLocation,
      selectedColor.r,
      selectedColor.g,
      selectedColor.b,
      1
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    count = polygonVertex;
    countPolygonVertex = polygonVertex;
    gl.drawArrays(gl.TRIANGLE_FAN, 0, count);
    allPolygonData.push([polygonData, selectedColor, polygonVertex]); // SAVE TO DATA
    polygonData = [];
  }

  // How to draw
  // 1. Bikin posisinya, posisinya dependen sama lokasi cursor, yaitu pos

  // var positions = [
  //   pos.x, pos.y,
  //   pos.x, pos.y + 0.3,
  //   pos.x + 0.2, pos.y,
  //   pos.x + 0.2, pos.y+0.3,
  // ];

  // var positions3=[
  //   pos.x,pos.y,
  //   pos.x+0.5,pos.y
  // ]

  // 2. Ubah Posisi ke Array Float32
  // positions3 = new Float32Array(positions)
  // console.log(positions)

  // 3. warna, sudah sesuai sama data di input
  // gl.uniform4f(colorUniformLocation,selectedColor.r,selectedColor.g,selectedColor.b, 1);

  // 4. Bind Buffer
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 5. Masukin Array Float32 ke dalem buffer subData
  // gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);

  // 6. Contoh penggunaan drawArray, masing masing shape ada cara untuk draw Array sendiri
  // var primitiveType = gl.TRIANGLE_STRIP;
  // primitive Type ini ada berbagai macam bentuk, bisa cek di dokumentasi
  // var offset = 0;
  // var count = 3;

  // 7. Gambar
  // gl.drawArrays(primitiveType, offset, count);
}

// ================= SETUP =================
window.onload = function init() {
  // SETUP WEBGL
  var canvas = document.querySelector("#main-canvas");
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  // var gl = WebGLUtils.setupWebGL(canvas,{preserveDrawingBuffer: true});
  if (!gl) {
    alert("WebGL is not available");
  }

  // Get the strings for our GLSL shaders
  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

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

  canvasWidth = gl.canvas.width;
  canvasHeight = gl.canvas.height;

  // EVENT HANDLER
  var shape = document.getElementById("shape");
  shape.addEventListener("click", function (e) {
    selectedShape = e.target.value;
  });

  var color = document.getElementById("color-picker");
  color.addEventListener("change", function (e) {
    getColorInHex(e);
  });

  var polygonVertexInput = document.getElementById("polygon-vertex");
  polygonVertexInput.addEventListener("change", function (e) {
    polygonVertex = e.target.value;
    countPolygonVertex = polygonVertex;
    polygonData = [];
  });

  var setWidth = document.getElementById("width");
  setWidth.addEventListener("change", function (e) {
    const temp = parseInt(e.target.value);
    width = (10 * temp) / 1000 || 0.5;
  });

  const saveData = () => {
    const data = {
      allLineData,
      allSquareData,
      allRectangleData,
      allPolygonData,
    };

    console.log(data);

    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(data)], { type: "json" });
    a.href = URL.createObjectURL(file);
    a.download = "WebGL2D.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  var saveButton = document.getElementById("save");
  saveButton.addEventListener("click", saveData);

  const loadProgress = (e) => {
    const file = e.target.files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function (e) {
      let data = e.target.result;
      data = JSON.parse(data);

      allLineData = data.allLineData;
      allSquareData = data.allSquareData;
      allRectangleData = data.allRectangleData;
      allPolygonData = data.allPolygonData;

      loadLine();
      loadSquare();
      loadRectangle();
      loadPolygon();
    });
    reader.readAsBinaryString(file);
  };

  let loadButton = document.getElementById("load");
  loadButton.addEventListener("change", loadProgress);

  var clrbtn = document.getElementById("clrbtn");
  clrbtn.addEventListener("click", function () {
    location.reload();
  });
  // EVENT HANDLER

  var drawing = false;
  canvas.addEventListener("click", (event) => {
    drawing = true;
    console.log(event);
    let pos = getMouseCoordinate(event);
    console.log(pos);
    mouseClicked(pos);
  });
};

// main();
