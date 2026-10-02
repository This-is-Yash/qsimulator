// ===============================================================
// ✅ GRID TO JSON MODULE — BarcQ v2.5 (Fixed & Stable)
// Works with absolute-positioned gate divs
// ===============================================================

var circuitJsonObj = { header: {}, config: {} };
var instructionsList = [];

/*
** ✅ Extract all gates from grid dynamically
*/
function GridToJson() {
  instructionsList = [];
  console.log("🔍 Scanning grid for gates...");

  $("#dropzoneDiv .draggableComp").each(function () {

    const gateDiv = $(this);
    const gateName = gateDiv.attr("gate") || gateDiv.attr("name");
    if (!gateName) return;

    const pos = gateDiv.position();

    // Safe parse for control/target bits
    let ctlBits = [];
    let tgtBits = [];
    try { ctlBits = JSON.parse(gateDiv.attr("ctl_bits") || "[]"); } catch {}
    try { tgtBits = JSON.parse(gateDiv.attr("tgt_bits") || "[]"); } catch {}

    const gate = {
      name: gateName,
      num_bits: parseInt(gateDiv.attr("num_bits") || 1),
      ctl_enabled: parseInt(gateDiv.attr("ctl_enabled") || 0),
      ctl_bits: ctlBits,
      tgt_bits: tgtBits,
      arg_enabled: parseInt(gateDiv.attr("arg_enabled") || 0),
      arg_value: parseFloat(gateDiv.attr("arg_value") || 0),
      rowid: Math.floor(pos.top / 50),
      columnid: Math.floor(pos.left / 50),
      x: pos.left,
      y: pos.top
    };

    instructionsList.push(gate);
  });

  circuitJsonObj.instructions = instructionsList;
  console.log("✅ Circuit JSON Object:", circuitJsonObj);
  return circuitJsonObj;
}

/*
** ✅ Export circuit to downloadable JSON file
*/
function ExportJson() {
  const data = GridToJson();

  if (!data.instructions || data.instructions.length === 0) {
    alert("⚠️ No gates to export — please add gates first.");
    return;
  }

  try {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BarcQ_Circuit.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log("✅ Circuit exported successfully!");
  } catch (e) {
    console.error("❌ ExportJson failed:", e);
    alert("Error exporting circuit: " + e.message);
  }
}

/*
** ✅ Load JSON file and re-draw gates on grid
*/
function LoadCircuit() {
  try {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = event => {
        const jsonData = JSON.parse(event.target.result);
        console.log("📂 Loaded JSON:", jsonData);

        if (!jsonData.instructions || jsonData.instructions.length === 0) {
          alert("⚠️ No gates found in selected JSON file.");
          return;
        }

        alert(`✅ Loaded circuit with ${jsonData.instructions.length} gates.`);
        RedrawCircuitFromJSON(jsonData.instructions);
      };

      reader.readAsText(file);
    };

    input.click();
  } catch (e) {
    console.error("❌ LoadCircuit failed:", e);
    alert("Error loading circuit: " + e.message);
  }
}

/*
** ✅ Redraw imported gates on grid
*/
function RedrawCircuitFromJSON(instructions) {
  console.log("🎨 Redrawing circuit...");
  $("#grid").empty();
  if (typeof CreateDropZone === "function") CreateDropZone();

  instructions.forEach(g => {
    const newGateId = `${g.name}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newGate = $("<div></div>")
      .addClass("draggableComp")
      .attr({
        id: newGateId,
        gate: g.name,
        name: g.name,
        num_bits: g.num_bits,
        ctl_enabled: g.ctl_enabled,
        ctl_bits: JSON.stringify(g.ctl_bits),
        tgt_bits: JSON.stringify(g.tgt_bits),
        arg_enabled: g.arg_enabled,
        arg_value: g.arg_value,
        rowid: g.rowid,
        columnid: g.columnid
      })
      .css({
        position: "absolute",
        left: g.x + "px",
        top: g.y + "px",
        width: "35px",
        height: "35px",
        cursor: "grab",
        zIndex: 1000
      });

    $("#grid").append(newGate);

    // Render SVG gate (safe)
    try {
      if (typeof gate === "function") {
        const svgGate = gate(g.name, "#" + newGateId);
        if (svgGate && typeof svgGate.appendTo === "function") {
          svgGate.appendTo(newGate);
        }
      }
    } catch (err) {
      console.warn(`⚠️ Failed to render ${g.name}:`, err);
    }

    // Make draggable again
    if (typeof newGate.draggable === "function") {
      newGate.draggable({
        containment: "#grid",
        scroll: false,
        start: function () {
          $(this).css("cursor", "grabbing");
        },
        stop: function () {
          $(this).css("cursor", "grab");
        }
      });
    }
  });

  console.log("✅ Circuit redrawn successfully!");
}

/*
** ✅ Pre-run validation before sending to backend
*/
function ValidateCircuitBeforeRun() {
  const json = GridToJson();
  if (!json.instructions || json.instructions.length === 0) {
    alert("⚠️ Your circuit is empty! Add at least one gate before running simulation.");
    return false;
  }
  return true;
}

/*
** ✅ Placeholders for other buttons
*/
function newControlledGate() {
  alert("🧩 newControlledGate() placeholder — logic can be added here.");
}
function CreateGate() {
  alert("🎛️ CreateGate() placeholder — logic can be added here.");
}

// ==========================================================
// GridToJson Enhancement for QSVM Algorithm Gates
// Add this function to your gridtojson.js
// ==========================================================

// Enhanced GridToJson to handle QSVM gates
function GridToJson_QSVM() {
  const gatesList = [];
  
  // Iterate through all gates in the grid
  $(".dropzone").each(function() {
    const cell = $(this);
    const gate = cell.children().first();
    
    if (!gate.length || !gate.attr("gate")) return;
    
    const gateName = gate.attr("gate");
    const gateData = {
      name: gateName,
      num_bits: parseInt(gate.attr("num_bits")) || 1,
      ctl_enabled: parseInt(gate.attr("ctl_enabled")) || 0,
      ctl_bits: gate.attr("ctl_bits") || "[]",
      tgt_bits: gate.attr("tgt_bits") || "[]",
      arg_enabled: parseInt(gate.attr("arg_enabled")) || 0,
      arg_value: gate.attr("arg_value") || 0,
      rowid: parseInt(cell.attr("rowid")) || 0,
      columnid: parseInt(cell.attr("columnid")) || 0
    };
    
    // ⭐ QSVM-specific handling
    if (gateName === "QSVM") {
      gateData.type = "algorithm";
      
      // Check if gate has been configured
      if (gate.attr("qsvm-configured") === "true") {
        try {
          const config = JSON.parse(gate.attr("qsvm-config"));
          gateData.qsvm_config = config;
          console.log("✅ Exporting configured QSVM gate:", config);
        } catch (e) {
          console.warn("⚠️ Failed to parse QSVM config:", e);
          // Use defaults if config parsing fails
          gateData.qsvm_config = {
            dataset: "iris",
            kernel_type: "amplitude",
            split: 0.7
          };
        }
      } else {
        console.warn("⚠️ QSVM gate not configured, using defaults");
        gateData.qsvm_config = {
          dataset: "iris",
          kernel_type: "amplitude",
          split: 0.7
        };
      }
    }
    
    gatesList.push(gateData);
  });
  
  const circuitJson = {
    instructions: gatesList,
    metadata: {
      timestamp: new Date().toISOString(),
      hasAlgorithmGates: gatesList.some(g => g.type === "algorithm")
    }
  };
  
  // Store globally
  window.circuitJsonObj = circuitJson;
  
  console.log("📋 Circuit JSON generated:", circuitJson);
  return circuitJson;
}

// Override original GridToJson
const originalGridToJson = window.GridToJson;
window.GridToJson = function() {
  try {
    return GridToJson_QSVM();
  } catch (e) {
    console.error("❌ GridToJson_QSVM failed, falling back to original:", e);
    if (originalGridToJson) return originalGridToJson();
    return { instructions: [] };
  }
};

console.log("✅ Enhanced GridToJson with QSVM support loaded");