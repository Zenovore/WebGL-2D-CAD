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

var movingMode = false;
var movingData;
var changeColorMode = false;

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

function checkPointInsidePolygon(p, polygon) {
  var isInside = false;
  var minX =polygon[0]
  var minY =polygon[1]
  var maxX =polygon[0]
  var maxY =polygon[1]

  for (let k = 2 ; k<=polygon.length-2;k+= 2){
    minX = Math.min(polygon[k], minX);
    maxX = Math.max(polygon[k], maxX);
    minY = Math.min(polygon[k+1], minY);
    maxY = Math.max(polygon[k+1], maxY);
  }

  if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
      return false;
  }

  
  var i = 0, j = polygon.length - 2;
  for ( i,j; i<polygon.length; j = i+=2){
    if (j+2 == polygon.length && i != 0){
      j = 0
    } else if (j != polygon.length -2) {
      j += 2
    }    
    if ( (polygon[i+1] > p.y) != (polygon[j+1] > p.y) &&
      p.x < (polygon[j] - polygon[i]) * (p.y - polygon[i+1]) / (polygon[j+1] - polygon[i+1]) + polygon[i] ) {
    isInside = !isInside;
    }
  }

  return isInside;
}

function getPolygonIndex(event){
  let vertexLocation = getMouseCoordinate(event);
  let index = -1;
  for (let i = 0; i < allPolygonData.length; i++){
    if (checkPointInsidePolygon(vertexLocation,allPolygonData[i][0])){
      index = i
    }
  }
  if (index != -1){
    allPolygonData[index][1] = selectedColor
    render()
  }
}

function getCartesianDistance(x1,y1,x2,y2){
  return Math.sqrt(Math.pow(Math.abs(x1-x2),2) + Math.pow(Math.abs(y1-y2),2)) 
}

function searchClostestVertex(event) {
  let cursorPosition = getMouseCoordinate(event);
  let initialDistance = 999;
  var x;
  var moveShape = "";
  var indexArray = -1;
  var indexArrayPoint = -1;
  for (let i = 0; i < allLineData.length; i++) {
    for (let j = 0; j <= 2; j += 2) {
      x = getCartesianDistance(
        cursorPosition.x,
        cursorPosition.y,
        allLineData[i][0][j],
        allLineData[i][0][j + 1]
      );
      if (x < initialDistance) {
        initialDistance = x;
        moveShape = "line";
        indexArray = i;
        indexArrayPoint = j;
      }
    }
  }
  for (let i = 0; i < allSquareData.length; i++) {
    for (let j = 0; j <= 6; j += 2) {
      x = getCartesianDistance(
        cursorPosition.x,
        cursorPosition.y,
        allSquareData[i][0][j],
        allSquareData[i][0][j + 1]
      );
      if (x < initialDistance) {
        initialDistance = x;
        moveShape = "square";
        indexArray = i;
        indexArrayPoint = j;
      }
    }
  }
  for (let i = 0; i < allRectangleData.length; i++) {
    for (let j = 0; j <= 6; j += 2) {
      x = getCartesianDistance(
        cursorPosition.x,
        cursorPosition.y,
        allRectangleData[i][0][j],
        allRectangleData[i][0][j + 1]
      );
      if (x < initialDistance) {
        initialDistance = x;
        moveShape = "rectangle";
        indexArray = i;
        indexArrayPoint = j;
      }
    }
  }
  for (let i = 0; i < allPolygonData.length; i++) {
    let length = allPolygonData[i][0].length;
    for (let j = 0; j <= length - 2; j += 2) {
      x = getCartesianDistance(
        cursorPosition.x,
        cursorPosition.y,
        allPolygonData[i][0][j],
        allPolygonData[i][0][j + 1]
      );
      if (x < initialDistance) {
        initialDistance = x;
        moveShape = "polygon";
        indexArray = i;
        indexArrayPoint = j;
      }
    }
  }
  if (initialDistance > 0.02) {
    moveShape = "none";
  }
  console.log(initialDistance);
  console.log("======================================================");
  console.log(moveShape);
  console.log(indexArray);
  console.log(indexArrayPoint);
  console.log("======================================================");
  return {
    moveShape: moveShape,
    indexArray: indexArray,
    indexArrayPoint: indexArrayPoint,
  };
}

function changeVertexLocation(event) {
  let newVertexPos = getMouseCoordinate(event);
  console.log(movingData);
  if (movingData.moveShape == "line") {
    console.log("mangga");
    console.log(allLineData[movingData.indexArray][0]);
    allLineData[movingData.indexArray][0][movingData.indexArrayPoint] =
      newVertexPos.x;
    allLineData[movingData.indexArray][0][movingData.indexArrayPoint + 1] =
      newVertexPos.y;
  }
  if (movingData.moveShape == "square") {
    console.log("mangga1");
    console.log(allSquareData);
    allSquareData[movingData.indexArray][0][movingData.indexArrayPoint] =
      newVertexPos.x;
    allSquareData[movingData.indexArray][0][movingData.indexArrayPoint + 1] =
      newVertexPos.y;
  }
  if (movingData.moveShape == "rectangle") {
    console.log("mangga2");
    allRectangleData[movingData.indexArray][0][movingData.indexArrayPoint] =
      newVertexPos.x;
    allRectangleData[movingData.indexArray][0][movingData.indexArrayPoint + 1] =
      newVertexPos.y;
  }
  if (movingData.moveShape == "polygon") {
    console.log("mangga3");
    allPolygonData[movingData.indexArray][0][movingData.indexArrayPoint] =
      newVertexPos.x;
    allPolygonData[movingData.indexArray][0][movingData.indexArrayPoint + 1] =
      newVertexPos.y;
  }
}
function emptyArray(array) {
  while (array.length > 0) {
    array.pop();
  }
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
      let copyLineData = [...lineData];
      allLineData.push([copyLineData, selectedColor]);
      lineData = [];
      console.log(allLineData);
      countLineVertex = lineVertex;
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
    allSquareData.push([squareData, selectedColor]);
    squareData = [];
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

      let copyRectangleData = [...rectangleData];
      allLineData.push([copyRectangleData, selectedColor]);
      lineData = [];

      allRectangleData.push([rectangleData, selectedColor]);
      rectangleData = [];
      countRectangleVertex = 2;
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
      let copyPolygonData = [...polygonData];
      allPolygonData.push([copyPolygonData, selectedColor, polygonVertex]);
      polygonData = [];
      countPolygonVertex = polygonVertex;
      render();
    } else {
      polygonData.push(pos.x);
      polygonData.push(pos.y);
    }
  }
  // render(gl,pos)
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  // TODO: Ambil vertex data, create array, gambar sesuai bentuk
  // if (selectedShape == "line"){
  //   lineData = [];
  // }
  allLineData.map((item, index) => {
    let newLineData = item[0];
    let newSelectedColor = item[1];
    positions = new Float32Array(newLineData);
    gl.uniform4f(
      colorUniformLocation,
      newSelectedColor.r,
      newSelectedColor.g,
      newSelectedColor.b,
      1
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    count = lineVertex;
    countLineVertex = lineVertex;
    gl.drawArrays(gl.LINE_STRIP, 0, count);
  });

  allSquareData.map((item, index) => {
    let newSquareData = item[0];
    let newSelectedColor = item[1];
    positions = new Float32Array(newSquareData);
    gl.uniform4f(
      colorUniformLocation,
      newSelectedColor.r,
      newSelectedColor.g,
      newSelectedColor.b,
      1
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    count = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
  });

  allRectangleData.map((item, index) => {
    let newRectangleData = item[0];
    let newSelectedColor = item[1];
    positions = new Float32Array(newRectangleData);
    gl.uniform4f(
      colorUniformLocation,
      newSelectedColor.r,
      newSelectedColor.g,
      newSelectedColor.b,
      1
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    count = 4;
    gl.drawArrays(gl.TRIANGLE_FAN, 0, count);
  });

  allPolygonData.map((item, index) => {
    let newPolygonData = item[0];
    let newSelectedColor = item[1];
    let count = item[2];
    positions = new Float32Array(newPolygonData);
    gl.uniform4f(
      colorUniformLocation,
      newSelectedColor.r,
      newSelectedColor.g,
      newSelectedColor.b,
      1
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, count);
  });
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

      console.log(allLineData);
      render();
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

  // var moveButton = document.getElementById("moving-mode");
  // moveButton.addEventListener("click", function () {
  //   movingMode = !movingMode
  // });
  
  // var moveButton = document.getElementById("polygon-change-mode");
  // moveButton.addEventListener("click", function () {
  //   changeColorMode = !changeColorMode
  // });
  var radioButton = document.getElementById("drawing-mode");
  radioButton.addEventListener("click", function () {
    movingMode = false;
    changeColorMode = false;
  }); 

  var radioButton1 = document.getElementById("move-mode");
  radioButton1.addEventListener("click", function () {
    movingMode = true;
    changeColorMode = false;
  });  

  var radioButton2 = document.getElementById("change-color-mode");
  radioButton2.addEventListener("click", function () {
    movingMode = false;
    changeColorMode = true;
  });  

  canvas.addEventListener("mousedown", (event) => {
    if (movingMode) {
      movingData = searchClostestVertex(event);
      console.log("SEARCH ID");
    }
  });

  canvas.addEventListener("mouseup", (event) => {
    // Change Vertex Selected
    if (movingMode) {
      changeVertexLocation(event);
      console.log("RE RENDER");
      render();
    }
  });

  canvas.addEventListener("click", (event) => {
    if (!movingMode && !changeColorMode){
      drawing = true;
      console.log(event);
      let pos = getMouseCoordinate(event);
      console.log(pos);
      mouseClicked(pos);
    } else if(changeColorMode){
      getPolygonIndex(event)
      console.log('masuk change color')
    }
  });
};

// main();
