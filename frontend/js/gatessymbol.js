// ==========================================================
// Quantum Gate Symbol Renderer - gatessymbol.js
// ==========================================================

// ✅ Default visual constants
var xorrad = 10;
var controlrad = 6;

// ==========================================================
// Main Gate Dispatcher
// ==========================================================
// ==========================================================
// Main Gate Dispatcher (Fixed v3.6)
// ==========================================================
function gate(divid, targetSelector) {
  // ✅ Determine target container dynamically
  let target = targetSelector ? targetSelector : `#${divid}`;

  // Clear previous SVG content if any
  d3.select(target).selectAll("*").remove();

  // Dispatch based on gate type
  if (divid === "CNOT") return cnot(target, divid);
  if (divid === "SWAP") return swap(target, divid);
  if (divid === "CSWAP") return cswap(target, divid);
  if (divid === "CCNOT") return ccnot(target, divid);
  if (divid === "XOR") return xor(target, divid);
  if (divid === "CONTROL") return control(target, divid);

  // ✅ Custom QSVM visual
  if (divid === "QSVM") return qsvm(target, divid);

  // ✅ Single-qubit gates
  if (Array.isArray(allowedSingleQubitGates) && allowedSingleQubitGates.includes(divid)) {
    return x(target, divid);
  }

  // ✅ Controlled gates
  if (Array.isArray(allowedControlledGates) && allowedControlledGates.includes(divid)) {
    return cx(target, divid);
  }

  console.warn("⚠️ Unknown gate symbol requested:", divid);
  return null;
}

// ==========================================================
// Gate Symbol Functions
// ==========================================================
function cswap(target) {
  return swap(target, 1);
}

function swap(target, ctl_enabled = 0, ctl_bits = [0], tgt_bits = [1, 2]) {
  console.log("Inside SWAP symbol...");
  var numOfBits = ctl_enabled ? 3 : 2;

  var width = 35;
  var height = ctl_enabled ? 105 : 70;
  var x = width / 2;
  var y = ((2 * numOfBits - 1) / (2 * numOfBits)) * height;

  var svg = d3.select(target).append("svg").attr("width", width).attr("height", height);
  var g = svg.append("g");

  InsertCrossSymbol(g, x, y);
  y = (height * (2 * (numOfBits - 1) - 1)) / (2 * numOfBits);
  InsertCrossSymbol(g, x, y);

  if (numOfBits === 3) {
    y = (height * 1.0) / (2 * numOfBits);
    InsertControlSymbol(g, x, y);
  }

  g.append("line")
    .attr("x1", x)
    .attr("y1", y)
    .attr("x2", x)
    .attr("y2", (2 * numOfBits - 1) * y)
    .attr("stroke-width", "2px")
    .attr("stroke", "red");

  return svg;
}

function InsertCrossSymbol(g, x, y) {
  g.append("line")
    .attr("x1", x - controlrad)
    .attr("y1", y - controlrad)
    .attr("x2", x + controlrad)
    .attr("y2", y + controlrad)
    .attr("stroke-width", "2px")
    .attr("stroke", "red");
  g.append("line")
    .attr("x1", x - controlrad)
    .attr("y1", y + controlrad)
    .attr("x2", x + controlrad)
    .attr("y2", y - controlrad)
    .attr("stroke-width", "2px")
    .attr("stroke", "red");
}

function CustomGate(target) {
  var width = 35;
  var height = 35;

  var svg = d3
    .select(target)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .classed("draggableComp", true);

  svg.append("g");
  return svg;
}

function cx(target, divid) {
  var width = 35;
  var height = 70;
  var svg = d3.select(target).append("svg").attr("width", width).attr("height", height);
  var g = svg.append("g");

  var y1 = 0.5 * height;
  InsertImageSymbol(g, divid, 0, y1 - 17);

  var y2 = 0.25 * height;
  var xval = 0.5 * width;
  InsertControlSymbol(g, xval, y2);
  InsertLine(g, xval, y1, xval, y2);

  return svg;
}

function x(target, divid) {
  var width = 35;
  var height = 35;
  var svg = d3.select(target).append("svg").attr("width", width).attr("height", height);
  var g = svg.append("g");
  InsertImageSymbol(g, divid);
  return svg;
}

function InsertImageSymbol(g, gatename, x = 0, y = 0) {
  // ✅ CRITICAL FIX: Use relative path from samples/ folder
  const basePath = "../../../imagesSVG/";
  const upperName = gatename.toUpperCase();
  
  // Prepare both PNG and SVG paths
  const pngPath = `${basePath}${upperName}.png`;
  const svgPath = `${basePath}${upperName}.svg`;
  
  console.log(`🖼️ Loading image for ${gatename}...`);
  
  // Create image element in SVG
  const img = g.append("image")
    .attr("x", x)
    .attr("y", y)
    .attr("width", 35)
    .attr("height", 35)
    .attr("preserveAspectRatio", "xMidYMid meet");
  
  // Try PNG first
  img.attr("href", pngPath)
     .attr("xlink:href", pngPath);
  
  // Fallback mechanism: Test PNG, use SVG if PNG fails
  const testImg = new Image();
  
  testImg.onerror = function() {
    console.warn(`⚠️ PNG not found for ${gatename}, trying SVG: ${svgPath}`);
    
    // Switch to SVG
    img.attr("href", svgPath)
       .attr("xlink:href", svgPath);
    
    // Verify SVG loads
    const testSvg = new Image();
    testSvg.onerror = function() {
      console.error(`❌ Neither PNG nor SVG found for: ${gatename}`);
      console.error(`   Tried: ${pngPath} and ${svgPath}`);
    };
    testSvg.onload = function() {
      console.log(`✅ SVG loaded successfully: ${svgPath}`);
    };
    testSvg.src = svgPath;
  };
  
  testImg.onload = function() {
    console.log(`✅ PNG loaded successfully: ${pngPath}`);
  };
  
  // Start loading PNG
  testImg.src = pngPath;
  
  return img;
}


// ==========================================================
// Basic Shapes
// ==========================================================
function xor(target) {
  var width = 35;
  var height = 35;
  var x = width / 2;
  var y = height / 2;

  var svg = d3.select(target).append("svg").attr("width", width).attr("height", height);
  var g = svg.append("g");
  InsertXorSymbol(g, x, y);
  return svg;
}

function InsertXorSymbol(g, x, y) {
  g.append("circle").attr("r", xorrad).attr("cx", x).attr("cy", y).attr("fill", "green").attr("stroke-width", "2px").attr("stroke", "red");
  g.append("line").attr("x1", x - xorrad).attr("y1", y).attr("x2", x + xorrad).attr("y2", y).attr("stroke-width", "2px").attr("stroke", "red");
  g.append("line").attr("x1", x).attr("y1", y - xorrad).attr("x2", x).attr("y2", y + xorrad).attr("stroke-width", "2px").attr("stroke", "red");
}

function control(target) {
  var width = 35;
  var height = 35;
  var x = width / 2;
  var y = height / 2;

  var svg = d3.select(target).append("svg").attr("width", width).attr("height", height);
  var g = svg.append("g");
  InsertControlSymbol(g, x, y);
  return svg;
}

function InsertControlSymbol(g, x, y) {
  g.append("circle").attr("r", controlrad).attr("cx", x).attr("cy", y).attr("fill", "green").attr("stroke-width", "2px").attr("stroke", "red");
}

function InsertLine(g, x1, y1, x2, y2) {
  g.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).attr("stroke-width", "2px").attr("stroke", "red");
}

function ccnot(target) {
  var width = 35;
  var height = 105;
  var x = width / 2;

  var svg = d3.select(target).append("svg").attr("width", width).attr("height", height);
  var g = svg.append("g");

  var y = (5 * height) / 6;
  InsertXorSymbol(g, x, y);

  y = (3 * height) / 6;
  InsertControlSymbol(g, x, y);

  y = height / 6;
  InsertControlSymbol(g, x, y);

  g.append("line").attr("x1", x).attr("y1", y).attr("x2", x).attr("y2", (5 * height) / 6).attr("stroke-width", "2px").attr("stroke", "red");

  return svg;
}

function cnot(target) {
  console.log("Inside CNOT symbol...");
  var width = 35;
  var height = 70;
  var x = width / 2;
  var y = (3 * height) / 4;

  var svg = d3.select(target).append("svg").attr("width", width).attr("height", height);
  var g = svg.append("g");

  InsertXorSymbol(g, x, y);
  y = height / 4;
  InsertControlSymbol(g, x, y);

  g.append("line").attr("x1", x).attr("y1", y).attr("x2", x).attr("y2", (3 * height) / 4).attr("stroke-width", "2px").attr("stroke", "red");

  return svg;
}

// ==========================================================
// ✅ QSVM Symbol (Custom Gate Renderer)
// ==========================================================
function qsvm(target) {
  console.log("🟣 Rendering QSVM symbol...");
  var width = 45;
  var height = 45;

  var svg = d3.select(target).append("svg").attr("width", width).attr("height", height);
  var g = svg.append("g");

  g.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "lavender")
    .attr("stroke", "purple")
    .attr("stroke-width", "2px");

  g.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "purple")
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .text("QSVM");

  return svg;
}

// ✅ Expose globally
window.gate = gate;
console.log("✅ gate() is now globally available.");

// ==========================================================
// Enhanced QSVM Symbol Renderer
// Add this to your gatessymbol.js file
// ==========================================================

function qsvm(target) {
  console.log("🔮 Rendering QSVM algorithm gate...");
  var width = 60;
  var height = 60;

  var svg = d3.select(target).append("svg")
    .attr("width", width)
    .attr("height", height);
  
  var g = svg.append("g");

  // Gradient background
  var gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "qsvm-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%");
  
  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#667eea");
  
  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#764ba2");

  // Main rectangle
  g.append("rect")
    .attr("x", 2)
    .attr("y", 2)
    .attr("width", width - 4)
    .attr("height", height - 4)
    .attr("rx", 8)
    .attr("fill", "url(#qsvm-gradient)")
    .attr("stroke", "#6a0dad")
    .attr("stroke-width", "2px");

  // Label
  g.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 - 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .text("QSVM");

  // Subtitle
  g.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 + 10)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "9px")
    .attr("opacity", 0.9)
    .text("Algorithm");

  // Settings icon (gear)
  g.append("circle")
    .attr("cx", width - 12)
    .attr("cy", 12)
    .attr("r", 6)
    .attr("fill", "white")
    .attr("opacity", 0.3);
  
  g.append("text")
    .attr("x", width - 12)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .attr("fill", "#6a0dad")
    .attr("font-size", "10px")
    .attr("font-weight", "bold")
    .text("⚙");

  return svg;
}

// Update main gate dispatcher
function gate(divid, targetSelector) {
  let target = targetSelector ? targetSelector : `#${divid}`;
  d3.select(target).selectAll("*").remove();

  // Check for QSVM first
  if (divid === "QSVM") return qsvm(target);

  // Existing gate dispatching...
  if (divid === "CNOT") return cnot(target, divid);
  if (divid === "SWAP") return swap(target, divid);
  if (divid === "CSWAP") return cswap(target, divid);
  if (divid === "CCNOT") return ccnot(target, divid);
  if (divid === "XOR") return xor(target, divid);
  if (divid === "CONTROL") return control(target, divid);

  if (Array.isArray(allowedSingleQubitGates) && allowedSingleQubitGates.includes(divid)) {
    return x(target, divid);
  }

  if (Array.isArray(allowedControlledGates) && allowedControlledGates.includes(divid)) {
    return cx(target, divid);
  }

  console.warn("⚠️ Unknown gate symbol requested:", divid);
  return null;
}

window.gate = gate;
console.log("✅ QSVM gate symbol registered");