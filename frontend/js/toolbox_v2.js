// ==========================================================
// BarcQ Quantum Simulator - Toolbox (v3.3 Clean QSVM Version)
// Handles loading of working quantum gates only.
// Removes non-existent gates like CRX, CRY, CRZ, CU, etc.
// Adds QSVM gate.
// ==========================================================

function CreateToolBox() {
  console.log("🧠 Initializing Toolbox...");

  // --- Step 1: Validate & parse gateJson safely ---
  var mydataExtended;

  try {
    if (typeof gateJson === "string") {
      console.log("📜 gateJson is a string — parsing JSON...");
      mydataExtended = JSON.parse(gateJson);
    } else if (typeof gateJson === "object" && gateJson !== null) {
      console.log("🧩 gateJson is already an object — using directly...");
      mydataExtended = gateJson;
    } else {
      throw new Error("❌ gateJson is neither string nor object!");
    }
  } catch (err) {
    console.error("🚨 Failed to parse gateJson:", err);
    // Fallback to empty object to prevent crash
    mydataExtended = {
      instructions: [],
      controlledgates: [],
      singequbitgates: []
    };
  }

  // --- Step 2: Store globally for gate rendering ---
  window.completeJson = mydataExtended;
  window.allowedControlledGates = mydataExtended.controlledgates || [];
  window.allowedSingleQubitGates = mydataExtended.singequbitgates || [];

  var mydata = mydataExtended.instructions || [];

  // --- Step 3: Filter out non-existent gates ---
  const invalidGates = [
    "CRX", "CRY", "CRZ", "CU",
    "CADD", "CSUB", "CPHASE", "CQFT"
  ];

  mydata = mydata.filter(
    g => g && g.name && !invalidGates.includes(g.name)
  );

  // --- Step 4: Add QSVM gate manually ---
  const qsvmGate = {
    name: "QSVM",
    num_bits: 1,
    ctl_enabled: 0,
    ctl_bits: "[]",
    tgt_bits: "[]",
    arg_enabled: 0,
    arg_value: 0,
    rowid: 0,
    columnid: 0
  };
  mydata.push(qsvmGate);
  const qpcaGate = {
    name: "QPCA",
    num_bits: 1,
    ctl_enabled: 0,
    ctl_bits: "[]",
    tgt_bits: "[]",
    arg_enabled: 0,
    arg_value: 0,
    rowid: 0,
    columnid: 0
  };
  mydata.push(qpcaGate);


  console.log("✅ Toolbox loading " + mydata.length + " gates...");
  console.log("Controlled gates:", allowedControlledGates);
  console.log("Single-qubit gates:", allowedSingleQubitGates);

  // --- Step 5: Build Toolbox Tables ---
  const $tableSingle = $('<table border="1" cellpadding="0" cellspacing="0"></table>');
  const $tableMultiple = $('<table border="1" cellpadding="0" cellspacing="0"></table>');

  mydata.forEach((gate) => {
    if (!gate || !gate.name) return;
    const $row = $("<tr/>");
    const gateId = gate.name;
    const rowStr = `<td id="${gateId}"></td>`;
    $row.append(rowStr);

    if (gate.num_bits > 1) {
      $tableMultiple.append($row);
    } else {
      $tableSingle.append($row);
    }
  });

  // --- Step 6: Ensure toolbox divs exist ---
  if ($("#toolboxDivSingle").length === 0) {
    $("<div id='toolboxDivSingle'></div>").appendTo("#toolbox");
  }
  if ($("#toolboxDivMultiple").length === 0) {
    $("<div id='toolboxDivMultiple'></div>").appendTo("#toolbox");
  }

  $("#toolboxDivSingle").empty().append($tableSingle);
  $("#toolboxDivMultiple").empty().append($tableMultiple);

  // --- Step 7: Render Each Gate Symbolically ---
  mydata.forEach((gateData) => {
    if (!gateData || !gateData.name) return;
    // if (gateData.name === "QSVM" || gateData.name === "QPCA") {
    //   return;
    

    // Defensive check for global gate() function
    if (typeof gate !== "function") {
      console.error("❌ gate() is not defined when rendering:", gateData.name);
      return;
    }

    // Render symbolic gate
    gate(gateData.name);

    // Attach attributes to gate cell
    $("#" + gateData.name)
      .attr("id", gateData.name)
      .attr("gate", gateData.name)
      .attr("num_bits", parseInt(gateData.num_bits))
      .attr("ctl_enabled", gateData.ctl_enabled)
      .attr("ctl_bits", gateData.ctl_bits)
      .attr("tgt_bits", gateData.tgt_bits)
      .attr("arg_enabled", gateData.arg_enabled)
      .attr("arg_value", gateData.arg_value)
      .attr("rowid", gateData.rowid)
      .attr("columnid", gateData.columnid)
      .attr("class", "cloneAble");

    // Attach right-click logic for parameterized gates
    QFTAttach($("#" + gateData.name));

    // Handle controlled-target metadata
    if (parseInt(gateData.num_bits) > 1) {
      $("#" + gateData.name).attr("targetGatename", gateData.targetGatename || "");
      $("#" + gateData.name).attr("targetGateType", gateData.targetGateType || "");
    }
  });

  // --- Step 8: Custom Rendering for QSVM ---
  const qsvmCell = $("#QSVM");
  if (qsvmCell.length) {
    qsvmCell.html(
      `<div style="
        width:45px;height:45px;display:flex;
        align-items:center;justify-content:center;
        background:#007BFF;color:white;font-weight:bold;
        border-radius:8px;font-size:13px;">QSVM</div>`
    );
  }
  const qpcaCell = $("#QPCA");
  if (qpcaCell.length) {
    qpcaCell.html(
      `<div style="
        width:45px;height:45px;display:flex;
        align-items:center;justify-content:center;
        background:#008080;color:white;font-weight:bold;
        border-radius:8px;font-size:12px;cursor:pointer;">
        QPCA
      </div>`
    );
    
    // Add click handler to switch to QPCA panel
    qpcaCell.find('div').click(function() {
      if (typeof openCity === 'function') {
        openCity(new Event('click'), 'qpcaPanel');
      } else {
        $('.tabcontent').hide();
        $('#qpcaPanel').show();
        $('.tablinks').removeClass('active');
        $('button[onclick*="qpcaPanel"]').addClass('active');
      }
    });
  }
}



  console.log("✅ Toolbox created successfully (Clean version).");


// ==========================================================
// QFTAttach() - Adds right-click menu for parameterized gates
// ==========================================================
function QFTAttach(obj) {
  if (!obj || typeof obj.on !== "function") return;

  obj.on("contextmenu", function (event) {
    event.preventDefault();

    const gateName = obj.attr("gate");
    if (["QFT", "IQFT", "ADDA", "IADD"].includes(gateName)) {
      const argVal = prompt(`Please enter number of input bits for ${gateName}:`, 2);
      if (argVal !== null) {
        console.log(`⚙️ Setting ${gateName} num_bits to ${argVal}`);
        obj.attr("num_bits", argVal);
      }
    }
  });
}

// ==========================================================
// Ensure this module is globally accessible
// ==========================================================
window.CreateToolBox = CreateToolBox;
window.QFTAttach = QFTAttach;

console.log("✅ toolbox_v2.js (Clean QSVM Version) loaded.");

// ==========================================================
// BarcQ Quantum Simulator - Toolbox (v3.4 - QSVM + QPCA)
// Handles loading of working quantum gates only.
// Removes non-existent gates like CRX, CRY, CRZ, CU, etc.
// Adds QSVM and QPCA gates.
// ==========================================================

// function CreateToolBox() {
//   console.log("🧠 Initializing Toolbox...");

//   // --- Step 1: Validate & parse gateJson safely ---
//   var mydataExtended;

//   try {
//     if (typeof gateJson === "string") {
//       console.log("📜 gateJson is a string – parsing JSON...");
//       mydataExtended = JSON.parse(gateJson);
//     } else if (typeof gateJson === "object" && gateJson !== null) {
//       console.log("🧩 gateJson is already an object – using directly...");
//       mydataExtended = gateJson;
//     } else {
//       throw new Error("❌ gateJson is neither string nor object!");
//     }
//   } catch (err) {
//     console.error("🚨 Failed to parse gateJson:", err);
//     // Fallback to empty object to prevent crash
//     mydataExtended = {
//       instructions: [],
//       controlledgates: [],
//       singequbitgates: []
//     };
//   }

//   // --- Step 2: Store globally for gate rendering ---
//   window.completeJson = mydataExtended;
//   window.allowedControlledGates = mydataExtended.controlledgates || [];
//   window.allowedSingleQubitGates = mydataExtended.singequbitgates || [];

//   var mydata = mydataExtended.instructions || [];

//   // --- Step 3: Filter out non-existent gates ---
//   const invalidGates = [
//     "CRX", "CRY", "CRZ", "CU",
//     "CADD", "CSUB", "CPHASE", "CQFT"
//   ];

//   mydata = mydata.filter(
//     g => g && g.name && !invalidGates.includes(g.name)
//   );

//   // --- Step 4: Add QSVM gate manually ---
//   const qsvmGate = {
//     name: "QSVM",
//     num_bits: 1,
//     ctl_enabled: 0,
//     ctl_bits: "[]",
//     tgt_bits: "[]",
//     arg_enabled: 0,
//     arg_value: 0,
//     rowid: 0,
//     columnid: 0
//   };
//   mydata.push(qsvmGate);

//   // --- Step 5: Add QPCA gate manually ---
//   const qpcaGate = {
//     name: "QPCA",
//     num_bits: 1,
//     ctl_enabled: 0,
//     ctl_bits: "[]",
//     tgt_bits: "[]",
//     arg_enabled: 0,
//     arg_value: 0,
//     rowid: 0,
//     columnid: 0
//   };
//   mydata.push(qpcaGate);

//   console.log("✅ Toolbox loading " + mydata.length + " gates...");
//   console.log("Controlled gates:", allowedControlledGates);
//   console.log("Single-qubit gates:", allowedSingleQubitGates);

//   // --- Step 6: Build Toolbox Tables ---
//   const $tableSingle = $('<table border="1" cellpadding="0" cellspacing="0"></table>');
//   const $tableMultiple = $('<table border="1" cellpadding="0" cellspacing="0"></table>');

//   mydata.forEach((gate) => {
//     if (!gate || !gate.name) return;
//     const $row = $("<tr/>");
//     const gateId = gate.name;
//     const rowStr = `<td id="${gateId}"></td>`;
//     $row.append(rowStr);

//     if (gate.num_bits > 1) {
//       $tableMultiple.append($row);
//     } else {
//       $tableSingle.append($row);
//     }
//   });

//   // --- Step 7: Ensure toolbox divs exist ---
//   if ($("#toolboxDivSingle").length === 0) {
//     $("<div id='toolboxDivSingle'></div>").appendTo("#toolbox");
//   }
//   if ($("#toolboxDivMultiple").length === 0) {
//     $("<div id='toolboxDivMultiple'></div>").appendTo("#toolbox");
//   }

//   $("#toolboxDivSingle").empty().append($tableSingle);
//   $("#toolboxDivMultiple").empty().append($tableMultiple);

//   // --- Step 8: Render Each Gate Symbolically ---
//   mydata.forEach((gateData) => {
//     if (!gateData || !gateData.name) return;

//     // Skip custom rendering for QSVM and QPCA (we'll do it manually)
//     if (gateData.name === "QSVM" || gateData.name === "QPCA") {
//       return;
//     }

//     // Defensive check for global gate() function
//     if (typeof gate !== "function") {
//       console.error("❌ gate() is not defined when rendering:", gateData.name);
//       return;
//     }

//     // Render symbolic gate
//     gate(gateData.name);

//     // Attach attributes to gate cell
//     $("#" + gateData.name)
//       .attr("id", gateData.name)
//       .attr("gate", gateData.name)
//       .attr("num_bits", parseInt(gateData.num_bits))
//       .attr("ctl_enabled", gateData.ctl_enabled)
//       .attr("ctl_bits", gateData.ctl_bits)
//       .attr("tgt_bits", gateData.tgt_bits)
//       .attr("arg_enabled", gateData.arg_enabled)
//       .attr("arg_value", gateData.arg_value)
//       .attr("rowid", gateData.rowid)
//       .attr("columnid", gateData.columnid)
//       .attr("class", "cloneAble");

//     // Attach right-click logic for parameterized gates
//     QFTAttach($("#" + gateData.name));

//     // Handle controlled-target metadata
//     if (parseInt(gateData.num_bits) > 1) {
//       $("#" + gateData.name).attr("targetGatename", gateData.targetGatename || "");
//       $("#" + gateData.name).attr("targetGateType", gateData.targetGateType || "");
//     }
//   });

//   // --- Step 9: Custom Rendering for QSVM ---
//   const qsvmCell = $("#QSVM");
//   if (qsvmCell.length) {
//     qsvmCell.html(
//       `<div style="
//         width:45px;height:45px;display:flex;
//         align-items:center;justify-content:center;
//         background:#6a0dad;color:white;font-weight:bold;
//         border-radius:8px;font-size:12px;cursor:pointer;">
//         QSVM
//       </div>`
//     );
    
//     // Add click handler to switch to QSVM panel
//     qsvmCell.find('div').click(function() {
//       if (typeof openCity === 'function') {
//         openCity(new Event('click'), 'qsvmPanel');
//       } else {
//         $('.tabcontent').hide();
//         $('#qsvmPanel').show();
//         $('.tablinks').removeClass('active');
//         $('button[onclick*="qsvmPanel"]').addClass('active');
//       }
//     });
//   }

//   // --- Step 10: Custom Rendering for QPCA ---
//   const qpcaCell = $("#QPCA");
//   if (qpcaCell.length) {
//     qpcaCell.html(
//       `<div style="
//         width:45px;height:45px;display:flex;
//         align-items:center;justify-content:center;
//         background:#008080;color:white;font-weight:bold;
//         border-radius:8px;font-size:12px;cursor:pointer;">
//         QPCA
//       </div>`
//     );
    
//     // Add click handler to switch to QPCA panel
//     qpcaCell.find('div').click(function() {
//       if (typeof openCity === 'function') {
//         openCity(new Event('click'), 'qpcaPanel');
//       } else {
//         $('.tabcontent').hide();
//         $('#qpcaPanel').show();
//         $('.tablinks').removeClass('active');
//         $('button[onclick*="qpcaPanel"]').addClass('active');
//       }
//     });
//   }

//   console.log("✅ Toolbox created successfully with QSVM and QPCA.");
// }

// // ==========================================================
// // QFTAttach() - Adds right-click menu for parameterized gates
// // ==========================================================
// function QFTAttach(obj) {
//   if (!obj || typeof obj.on !== "function") return;

//   obj.on("contextmenu", function (event) {
//     event.preventDefault();

//     const gateName = obj.attr("gate");
//     if (["QFT", "IQFT", "ADDA", "IADD"].includes(gateName)) {
//       const argVal = prompt(`Please enter number of input bits for ${gateName}:`, 2);
//       if (argVal !== null) {
//         console.log(`⚙️ Setting ${gateName} num_bits to ${argVal}`);
//         obj.attr("num_bits", argVal);
//       }
//     }
//   });
// }

// // ==========================================================
// // Ensure this module is globally accessible
// // ==========================================================
// window.CreateToolBox = CreateToolBox;
// window.QFTAttach = QFTAttach;

// console.log("✅ toolbox_v2.js (QSVM + QPCA Version) loaded.");




