// // ============================================================
// // QSVM FRONTEND - COMPLETE WITH KERNEL COMPARISON TESTS
// // FIXED VERSION - Full Interactive UI
// // ============================================================

// $(document).ready(function () {
//   console.log("✅ QSVM Frontend with Kernel Comparison Tests Initialized");
//   setTimeout(() => addQSVMToToolbox(), 1000);
// });

// function addQSVMToToolbox() {
//   const qsvmGate = $("<div>")
//     .addClass("gateButton")
//     .css({
//       width: "45px",
//       height: "45px",
//       border: "2px solid #6a0dad",
//       backgroundColor: "#d3bdf0",
//       borderRadius: "8px",
//       margin: "8px auto",
//       textAlign: "center",
//       lineHeight: "42px",
//       fontWeight: "bold",
//       cursor: "pointer",
//     })
//     .text("QSVM")
//     .attr("title", "Quantum Support Vector Machine")
//     .click(() => showQSVMPopup());

//   $("#toolboxDivSingle").append(qsvmGate);
// }

// function showQSVMPopup() {
//   $("#qsvmPopup").remove();

//   const popup = $(`
//     <div id="qsvmPopup" style="position:fixed;top:50%;left:50%;
//       transform:translate(-50%,-50%);
//       background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       border:3px solid #fff;padding:0;
//       z-index:9999;border-radius:16px;width:550px;
//       box-shadow:0 20px 60px rgba(0,0,0,0.5);">

//       <!-- Header -->
//       <div style="background:rgba(255,255,255,0.95);padding:20px;border-radius:16px 16px 0 0;
//                   border-bottom:3px solid #6a0dad;">
//         <h3 style="color:#6a0dad;margin:0;text-align:center;font-size:24px;">
//           🔮 Quantum Support Vector Machine
//         </h3>
//         <p style="text-align:center;color:#666;margin:8px 0 0 0;font-size:13px;">
//           Configure your quantum ML experiment
//         </p>
//       </div>

//       <!-- Main Content -->
//       <div style="padding:25px;background:rgba(255,255,255,0.98);border-radius:0 0 16px 16px;">
        
//         <!-- Mode Selection with Visual Cards -->
//         <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
//           <div class="mode-card" data-mode="manual" style="padding:15px;border:3px solid #6a0dad;
//                border-radius:10px;cursor:pointer;text-align:center;background:#f5f0ff;
//                transition:all 0.3s;">
//             <div style="font-size:32px;">📝</div>
//             <div style="font-weight:bold;margin-top:8px;color:#6a0dad;">Manual Points</div>
//             <div style="font-size:11px;color:#666;margin-top:4px;">Test custom coordinates</div>
//           </div>
//           <div class="mode-card" data-mode="dataset" style="padding:15px;border:2px solid #ddd;
//                border-radius:10px;cursor:pointer;text-align:center;background:#f9f9f9;
//                transition:all 0.3s;">
//             <div style="font-size:32px;">📊</div>
//             <div style="font-weight:bold;margin-top:8px;color:#666;">Dataset Mode</div>
//             <div style="font-size:11px;color:#666;margin-top:4px;">Use real ML datasets</div>
//           </div>
//         </div>

//         <!-- Manual Inputs with Live Preview -->
//         <div id="manualInputs" style="padding:15px;background:#f9f9ff;border-radius:10px;
//              border:2px solid #6a0dad;margin-bottom:15px;">
//           <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
//             <p style="font-weight:bold;margin:0;color:#6a0dad;">Test Points:</p>
//             <button id="randomizePoints" style="background:#2196F3;color:white;border:none;
//                     padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;">
//               🎲 Randomize
//             </button>
//           </div>
          
//           <div style="background:white;padding:12px;border-radius:8px;margin-bottom:10px;">
//             <div style="font-weight:600;color:#6a0dad;margin-bottom:8px;">Point 1 (x):</div>
//             <div style="display:flex;gap:10px;align-items:center;">
//               <div style="flex:1;">
//                 <label style="font-size:12px;color:#666;">x₁:</label>
//                 <input id="x1" type="range" min="-2" max="2" step="0.1" value="0" 
//                        style="width:100%;" oninput="$('#x1val').text(this.value)">
//                 <div id="x1val" style="text-align:center;font-weight:bold;color:#6a0dad;">0.0</div>
//               </div>
//               <div style="flex:1;">
//                 <label style="font-size:12px;color:#666;">x₂:</label>
//                 <input id="x2" type="range" min="-2" max="2" step="0.1" value="1" 
//                        style="width:100%;" oninput="$('#x2val').text(this.value)">
//                 <div id="x2val" style="text-align:center;font-weight:bold;color:#6a0dad;">1.0</div>
//               </div>
//             </div>
//           </div>

//           <div style="background:white;padding:12px;border-radius:8px;">
//             <div style="font-weight:600;color:#e64a19;margin-bottom:8px;">Point 2 (z):</div>
//             <div style="display:flex;gap:10px;align-items:center;">
//               <div style="flex:1;">
//                 <label style="font-size:12px;color:#666;">z₁:</label>
//                 <input id="z1" type="range" min="-2" max="2" step="0.1" value="1" 
//                        style="width:100%;" oninput="$('#z1val').text(this.value)">
//                 <div id="z1val" style="text-align:center;font-weight:bold;color:#e64a19;">1.0</div>
//               </div>
//               <div style="flex:1;">
//                 <label style="font-size:12px;color:#666;">z₂:</label>
//                 <input id="z2" type="range" min="-2" max="2" step="0.1" value="0" 
//                        style="width:100%;" oninput="$('#z2val').text(this.value)">
//                 <div id="z2val" style="text-align:center;font-weight:bold;color:#e64a19;">0.0</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <!-- Dataset Inputs -->
//         <div id="datasetInputs" style="display:none;padding:15px;background:#e3f2fd;
//              border-radius:10px;border:2px solid #2196F3;margin-bottom:15px;">
//           <label style="font-weight:bold;color:#1976d2;display:block;margin-bottom:8px;">
//             Select Dataset:
//           </label>
//           <select id="datasetSelect" style="width:100%;padding:10px;border-radius:6px;
//                   border:2px solid #2196F3;font-size:14px;background:white;">
//             <option value="iris">🌸 Iris - Classic 3-class flower dataset</option>
//             <option value="wine">🍷 Wine - Chemical analysis dataset</option>
//             <option value="breast_cancer">🎗️ Breast Cancer - Medical diagnosis</option>
//             <option value="csv">📄 Upload Custom CSV File</option>
//           </select>
//           <input type="file" id="csvFile" accept=".csv" 
//                  style="display:none;margin-top:10px;width:100%;">
//         </div>

//         <!-- Kernel Selection with Descriptions -->
//         <div style="padding:15px;background:linear-gradient(135deg,#fff3e0,#ffe0b2);
//              border-radius:10px;border:2px solid #ff9800;margin-bottom:15px;">
//           <label style="font-weight:bold;color:#e65100;display:block;margin-bottom:8px;">
//             ⚛️ Quantum Kernel Encoding:
//           </label>
//           <select id="kernelSelect" style="width:100%;padding:10px;border-radius:6px;
//                   border:2px solid #ff9800;font-size:14px;background:white;">
//             <option value="amplitude">🔵 Amplitude Encoding (RY gates) - Standard</option>
//             <option value="angle">🔄 Angle Encoding (RX-RZ) - Periodic data</option>
//             <option value="iqp">💠 IQP Encoding - Quantum complexity advantage</option>
//             <option value="pauli">🌀 Pauli Feature Map - Full rotation coverage</option>
//             <option value="zz">⚡ ZZ Feature Map - Quantum chemistry inspired</option>
//             <option value="polynomial">📈 Polynomial - Higher-order features</option>
//           </select>
//           <div id="kernelDescription" style="margin-top:8px;padding:8px;background:white;
//                border-radius:6px;font-size:12px;color:#666;min-height:40px;">
//             Select a kernel to see its description
//           </div>
//         </div>

//         <!-- Action Buttons -->
//         <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px;">
//           <button id="runQSVM" style="background:linear-gradient(135deg,#6a0dad,#9b4dca);
//                   color:white;border:none;padding:14px;border-radius:8px;cursor:pointer;
//                   font-weight:bold;font-size:15px;box-shadow:0 4px 12px rgba(106,13,173,0.4);
//                   transition:all 0.3s;">
//             ▶️ Run QSVM
//           </button>
//           <button id="compareKernels" style="background:linear-gradient(135deg,#2196F3,#64b5f6);
//                   color:white;border:none;padding:14px;border-radius:8px;cursor:pointer;
//                   font-weight:bold;font-size:15px;box-shadow:0 4px 12px rgba(33,150,243,0.4);
//                   transition:all 0.3s;">
//             📊 Compare All
//           </button>
//         </div>
        
//         <button id="closeQSVM" style="width:100%;background:#f44336;color:white;border:none;
//                 padding:12px;border-radius:8px;margin-top:10px;cursor:pointer;font-weight:bold;">
//           ✖️ Close
//         </button>

//         <!-- Info Banner -->
//         <div style="background:linear-gradient(135deg,#c8e6c9,#a5d6a7);padding:12px;
//              border-radius:8px;margin-top:15px;border:2px solid #4caf50;">
//           <div style="font-weight:bold;color:#2e7d32;margin-bottom:4px;">💡 Quick Tips:</div>
//           <ul style="margin:4px 0;padding-left:20px;font-size:12px;color:#1b5e20;">
//             <li>Use sliders to interactively adjust test points</li>
//             <li>Compare mode runs statistical tests on all 6 kernels</li>
//             <li>Different kernels work better for different data patterns</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   `);

//   $("body").append(popup);
//   addQSVMInteractivity();
// }

// function addQSVMInteractivity() {
//   // Mode card selection with proper state tracking
//   $(".mode-card").click(function() {
//     const mode = $(this).data("mode");
//     console.log("🎯 Mode card clicked:", mode);
    
//     // Reset all cards to inactive state
//     $(".mode-card").css({
//       "border": "2px solid #ddd",
//       "background": "#f9f9f9"
//     }).find("div").eq(1).css("color", "#666");
    
//     // Set clicked card to active state
//     if (mode === "manual") {
//       $(this).css({
//         "border": "3px solid #6a0dad",
//         "background": "#f5f0ff"
//       }).find("div").eq(1).css("color", "#6a0dad");
//     } else {
//       $(this).css({
//         "border": "3px solid #2196F3",
//         "background": "#e3f2fd"
//       }).find("div").eq(1).css("color", "#1976d2");
//     }
    
//     // Toggle input sections
//     $("#manualInputs").toggle(mode === "manual");
//     $("#datasetInputs").toggle(mode === "dataset");
    
//     console.log("✅ Mode switched to:", mode);
//   });

//   // Randomize points button
//   $("#randomizePoints").click(function() {
//     const rand = () => (Math.random() * 4 - 2).toFixed(1);
//     $("#x1").val(rand()).trigger("input");
//     $("#x2").val(rand()).trigger("input");
//     $("#z1").val(rand()).trigger("input");
//     $("#z2").val(rand()).trigger("input");
//   });

//   // Kernel description on change
//   $("#kernelSelect").change(function() {
//     const descriptions = {
//       amplitude: "Uses RY rotation gates to encode data into quantum states. Standard choice for QSVM.",
//       angle: "Combines RX and RZ rotations. Works well with periodic or circular data patterns.",
//       iqp: "Instantaneous Quantum Polynomial encoding with computational complexity advantages.",
//       pauli: "Uses all three Pauli rotations (X, Y, Z) for comprehensive feature coverage.",
//       zz: "Inspired by quantum chemistry simulations. Includes entangling ZZ interactions.",
//       polynomial: "Encodes higher-order polynomial features for complex decision boundaries."
//     };
//     $("#kernelDescription").text(descriptions[$(this).val()] || "");
//   }).trigger("change");

//   // Button hover effects
//   $("#runQSVM, #compareKernels").hover(
//     function() { $(this).css("transform", "translateY(-2px)"); },
//     function() { $(this).css("transform", "translateY(0)"); }
//   );
  
//   // CSV file input handler
//   $("#datasetSelect").change(function() {
//     const isCsv = $(this).val() === "csv";
//     if (isCsv) {
//       $("#csvFile").show().css({
//         "display": "block",
//         "width": "100%",
//         "padding": "8px",
//         "margin-top": "10px",
//         "border": "2px dashed #2196F3",
//         "border-radius": "6px",
//         "background": "white"
//       });
//     } else {
//       $("#csvFile").hide();
//     }
//   });
// }

// // ============================================================
// // Event Handlers
// // ============================================================
// $(document)
//   .off("click", "#closeQSVM")
//   .on("click", "#closeQSVM", () => {
//     $("#qsvmPopup").fadeOut(200, function() { $(this).remove(); });
//   });

// $(document)
//   .off("click", "#runQSVM")
//   .on("click", "#runQSVM", function () {
//     // Detect mode from the active card (the one with purple/blue border)
//     const activeCard = $(".mode-card[style*='3px solid']");
//     const mode = activeCard.length > 0 ? activeCard.data("mode") : "manual";
//     const kernel = $("#kernelSelect").val();

//     console.log("🎯 Detected mode:", mode, "Kernel:", kernel);

//     if (mode === "manual") {
//       runQSVMManual(kernel);
//     } else {
//       const ds = $("#datasetSelect").val();
//       console.log("📊 Dataset selected:", ds);
//       if (ds === "csv") handleCSVUpload(kernel);
//       else runQSVMOnDataset(ds, kernel);
//     }
//   });

// $(document)
//   .off("click", "#compareKernels")
//   .on("click", "#compareKernels", function () {
//     // Detect mode from the active card
//     const activeCard = $(".mode-card[style*='3px solid']");
//     const mode = activeCard.length > 0 ? activeCard.data("mode") : "manual";
    
//     console.log("📊 Compare clicked, mode:", mode);
    
//     if (mode === "dataset") {
//       const ds = $("#datasetSelect").val();
//       console.log("📊 Comparing dataset:", ds);
//       if (ds !== "csv") compareAllKernels(ds);
//       else alert("⚠️ Kernel comparison not available for CSV yet.");
//     } else {
//       alert("⚠️ Kernel comparison only available for dataset mode.");
//     }
//   });

// // ============================================================
// // Data Handlers
// // ============================================================
// function runQSVMManual(kernel) {
//   const x1 = parseFloat($("#x1").val());
//   const x2 = parseFloat($("#x2").val());
//   const z1 = parseFloat($("#z1").val());
//   const z2 = parseFloat($("#z2").val());
//   sendQSVMRequest({ x1, x2, z1, z2, kernel_type: kernel });
// }

// function handleCSVUpload(kernel) {
//   const file = $("#csvFile")[0].files[0];
//   if (!file) {
//     alert("⚠️ Please upload a CSV file.");
//     return;
//   }
//   const reader = new FileReader();
//   reader.onload = function (e) {
//     const base64 = btoa(e.target.result);
//     sendQSVMRequest({ csv_data: base64, kernel_type: kernel });
//   };
//   reader.readAsBinaryString(file);
// }

// function runQSVMOnDataset(name, kernel) {
//   sendQSVMRequest({ dataset: name, kernel_type: kernel });
// }

// // ============================================================
// // COMPARE ALL KERNELS
// // ============================================================
// function compareAllKernels(dataset) {
//   console.log("📊 COMPARISON MODE: Comparing all kernels on", dataset);
//   $("#qsvmPopup").fadeOut(200, function() { $(this).remove(); });

//   // Switch to QSVM tab
//   $(".tabcontent").hide();
//   $("#qsvmPanel").show();
//   $(".tablinks").removeClass("active");
//   $('button[onclick*="qsvmPanel"]').addClass("active");

//   // Show loading animation
//   const loadingHTML = `
//     <div style="text-align:center;padding:40px;">
//       <h2 style="color:#6a0dad;margin:20px 0;">
//         ⏳ Comparing All 6 Quantum Kernels...
//       </h2>
//       <p style="color:#666;font-size:14px;margin:20px 0;">
//         Running ANOVA, Kruskal-Wallis, Pairwise T-Tests, and Effect Size Analysis
//       </p>
//       <div style="margin:20px auto;width:50px;height:50px;border:5px solid #f3f3f3;border-top:5px solid #6a0dad;border-radius:50%;animation:spin 1s linear infinite;"></div>
//       <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>
//     </div>
//   `;
  
//   $("#qsvmMetrics").html(loadingHTML);
//   $("#qsvmOutput").html(loadingHTML).show();

//   $.ajax({
//     type: "POST",
//     url: "/CodeGenerator",
//     data: JSON.stringify({
//       gate: "QSVM",
//       params: { 
//         dataset: dataset, 
//         compare_all: true 
//       }
//     }),
//     contentType: "application/json; charset=utf-8",
//     success: function (res) {
//       if (typeof res === "string") res = JSON.parse(res);
//       console.log("📥 Comparison response received:", res);
      
//       if (res.statistical_tests) {
//         console.log("✅ Statistical tests found!");
//         displayKernelComparison(res);
//       } else {
//         console.error("❌ No statistical_tests in response!");
//         $("#qsvmMetrics").html(`
//           <div style="padding:40px;text-align:center;">
//             <h3 style="color:red;">⚠️ Error: No Statistical Tests</h3>
//             <pre>${JSON.stringify(res, null, 2)}</pre>
//           </div>
//         `);
//       }
//     },
//     error: function (xhr, status, error) {
//       console.error("❌ Comparison error:", error);
//       $("#qsvmMetrics").html('<p style="color:red;padding:40px;text-align:center;">Error: ' + error + '</p>');
//     }
//   });
// }

// // ============================================================
// // SINGLE KERNEL QSVM REQUEST
// // ============================================================
// function sendQSVMRequest(params) {
//   console.log("📮 Sending single kernel QSVM request:", params);
//   $("#qsvmPopup").fadeOut(200, function() { $(this).remove(); });

//   // Show loading state
//   $(".tabcontent").hide();
//   $("#qsvmPanel").show();
//   $(".tablinks").removeClass("active");
//   $('button[onclick*="qsvmPanel"]').addClass("active");
  
//   $("#qsvmOutput").html(`
//     <div style="text-align:center;padding:60px;">
//       <div style="width:60px;height:60px;border:6px solid #f3f3f3;
//                   border-top:6px solid #6a0dad;border-radius:50%;
//                   margin:0 auto 20px auto;
//                   animation:spin 1s linear infinite;"></div>
//       <h3 style="color:#6a0dad;">🔮 Running Quantum SVM...</h3>
//       <p style="color:#666;">Computing kernel matrix and classifications</p>
//       <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>
//     </div>
//   `).show();

//   $.ajax({
//     type: "POST",
//     url: "/CodeGenerator",
//     data: JSON.stringify({ gate: "QSVM", params }),
//     contentType: "application/json; charset=utf-8",
//     dataType: "json",
//     success: function (res) {
//       console.log("✅ QSVM Response received:", res);
      
//       if (typeof res === "string") {
//         try {
//           res = JSON.parse(res);
//         } catch (e) {
//           console.error("Failed to parse response:", e);
//           $("#qsvmOutput").html(`
//             <div style="padding:40px;text-align:center;">
//               <h3 style="color:#f44336;">❌ Error Parsing Response</h3>
//               <pre style="text-align:left;background:#f5f5f5;padding:15px;border-radius:8px;overflow:auto;">${res}</pre>
//             </div>
//           `);
//           return;
//         }
//       }
      
//       if (res.error) {
//         $("#qsvmOutput").html(`
//           <div style="padding:40px;text-align:center;">
//             <h3 style="color:#f44336;">❌ QSVM Error</h3>
//             <p style="color:#666;">${res.error}</p>
//           </div>
//         `);
//         return;
//       }
      
//       // Display single kernel results
//       function displaySingleKernelResults(res) {
//   console.log("🎨 Rendering single kernel results display");
  
//   let html = `
//     <div style="margin:20px;padding:20px;background:white;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
//       <h2 style="color:#6a0dad;text-align:center;margin-bottom:20px;font-size:28px;">
//         🔮 Quantum SVM Results
//       </h2>
      
//       <div style="text-align:center;margin:20px 0;">
//         <span style="background:linear-gradient(135deg,#6a0dad,#9b4dca);color:white;
//                      padding:12px 30px;border-radius:25px;font-weight:bold;font-size:18px;
//                      box-shadow:0 4px 12px rgba(106,13,173,0.3);">
//           Kernel: ${res.kernel_type ? res.kernel_type.toUpperCase() : 'AMPLITUDE'}
//         </span>
//       </div>
//   `;
  
//   // Accuracy metrics
//   if (res.qsvm_accuracy !== undefined) {
//     const qsvmAcc = (res.qsvm_accuracy * 100).toFixed(2);
//     const classicalAcc = (res.classical_accuracy * 100).toFixed(2);
//     const diff = (res.qsvm_accuracy - res.classical_accuracy) * 100;
//     const diffColor = diff > 0 ? '#4CAF50' : (diff < 0 ? '#f44336' : '#666');
    
//     html += `
//       <div style="padding:25px;border:3px solid #6a0dad;border-radius:12px;
//                   background:linear-gradient(135deg,#f5f0ff,#fff);margin-bottom:25px;">
//         <h3 style="color:#6a0dad;margin-top:0;text-align:center;">📊 Classification Performance</h3>
        
//         <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:20px;">
//           <div style="text-align:center;padding:20px;background:white;border-radius:10px;
//                       box-shadow:0 2px 8px rgba(0,0,0,0.1);border:2px solid #6a0dad;">
//             <div style="font-size:42px;font-weight:bold;color:#6a0dad;">
//               ${qsvmAcc}%
//             </div>
//             <div style="color:#666;margin-top:8px;font-weight:600;">🔵 Quantum SVM</div>
//             <div style="font-size:12px;color:#999;margin-top:4px;">
//               ${res.samples_train || '?'} train / ${res.samples_test || '?'} test samples
//             </div>
//           </div>
          
//           <div style="text-align:center;padding:20px;background:white;border-radius:10px;
//                       box-shadow:0 2px 8px rgba(0,0,0,0.1);border:2px solid #4CAF50;">
//             <div style="font-size:42px;font-weight:bold;color:#4CAF50;">
//               ${classicalAcc}%
//             </div>
//             <div style="color:#666;margin-top:8px;font-weight:600;">🟢 Classical SVM</div>
//             <div style="font-size:12px;color:#999;margin-top:4px;">
//               RBF kernel baseline
//             </div>
//           </div>
          
//           <div style="text-align:center;padding:20px;background:white;border-radius:10px;
//                       box-shadow:0 2px 8px rgba(0,0,0,0.1);border:2px solid ${diffColor};">
//             <div style="font-size:42px;font-weight:bold;color:${diffColor};">
//               ${diff > 0 ? '+' : ''}${diff.toFixed(2)}%
//             </div>
//             <div style="color:#666;margin-top:8px;font-weight:600;">📈 Difference</div>
//             <div style="font-size:12px;color:#999;margin-top:4px;">
//               ${diff > 0 ? 'Quantum advantage!' : diff < 0 ? 'Classical better' : 'Equal performance'}
//             </div>
//           </div>
//         </div>
//     `;
    
//     if (res.kernel_description) {
//       html += `
//         <div style="margin-top:20px;padding:15px;background:#fff3cd;border-radius:8px;
//                     border:2px solid #ffc107;">
//           <div style="font-weight:bold;color:#856404;margin-bottom:5px;">💡 About This Kernel:</div>
//           <div style="color:#856404;font-size:14px;">${res.kernel_description}</div>
//         </div>
//       `;
//     }
    
//     html += '</div>';
//   }
  
//   // Manual test points results
//   if (res.predictions && res.test_points) {
//     html += `
//       <div style="padding:20px;border:2px solid #2196F3;border-radius:10px;
//                   background:#e3f2fd;margin-bottom:20px;">
//         <h3 style="color:#1976d2;margin-top:0;">🎯 Test Point Classifications</h3>
//         <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
//           <div style="background:white;padding:15px;border-radius:8px;">
//             <div style="font-weight:bold;color:#6a0dad;margin-bottom:8px;">
//               📍 Point 1: (${res.test_points.point1.x.toFixed(2)}, ${res.test_points.point1.y.toFixed(2)})
//             </div>
//             <div style="font-size:24px;color:${res.test_points.point1.class === 1 ? '#4CAF50' : '#f44336'};">
//               Class: ${res.test_points.point1.class === 1 ? '+1' : '-1'}
//             </div>
//           </div>
//           <div style="background:white;padding:15px;border-radius:8px;">
//             <div style="font-weight:bold;color:#e64a19;margin-bottom:8px;">
//               📍 Point 2: (${res.test_points.point2.x.toFixed(2)}, ${res.test_points.point2.y.toFixed(2)})
//             </div>
//             <div style="font-size:24px;color:${res.test_points.point2.class === 1 ? '#4CAF50' : '#f44336'};">
//               Class: ${res.test_points.point2.class === 1 ? '+1' : '-1'}
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//   }
  
//   // QuTiP code
//   if (res.qutip_code || res.qutip) {
//     const code = res.qutip_code || res.qutip;
//     html += `
//       <div style="padding:20px;border:2px solid #6a0dad;border-radius:10px;
//                   background:#1e1e1e;margin-top:20px;">
//         <h3 style="color:#fff;margin-top:0;margin-bottom:15px;">🧠 QuTiP Implementation</h3>
//         <pre style="color:#d4d4d4;margin:0;overflow-x:auto;white-space:pre-wrap;
//                     font-family:'Courier New',monospace;font-size:13px;line-height:1.6;">${code}</pre>
//       </div>
//     `;
//   }
  
//   html += '</div>';
  
//   // Write to BOTH containers to ensure visibility
//   $("#qsvmOutput").html(html);
//   $("#qsvmMetrics").html(html);
  
//   console.log("✅ Results display rendered successfully");
// }
      
//       // Render plots with delays
//       setTimeout(() => {
//         if (res.kernel && Array.isArray(res.kernel) && res.kernel.length > 0) {
//           console.log("📊 Rendering kernel heatmap");
//           try {
//             Plotly.newPlot("kernelHeatmap", [{
//               z: res.kernel,
//               type: "heatmap",
//               colorscale: "Viridis",
//               colorbar: { title: "Kernel Value" }
//             }], {
//               title: `Kernel Matrix - ${(res.kernel_type || 'amplitude').toUpperCase()}`,
//               margin: { t: 60, l: 60, r: 80, b: 50 }
//             });
//           } catch (e) {
//             console.error("Error rendering heatmap:", e);
//           }
//         }
//       }, 300);
      
//       setTimeout(() => {
//         if (res.surface_data && res.surface_data.x) {
//           console.log("📊 Rendering 3D surface");
//           try {
//             Plotly.newPlot("kernelSurface3D", [{
//               type: "surface",
//               x: res.surface_data.x,
//               y: res.surface_data.y,
//               z: res.surface_data.z,
//               colorscale: "Viridis",
//               showscale: true
//             }], {
//               title: `Kernel Surface - ${(res.kernel_type || 'amplitude').toUpperCase()}`,
//               scene: {
//                 xaxis: { title: "Feature 1" },
//                 yaxis: { title: "Feature 2" },
//                 zaxis: { title: "Kernel Value" }
//               }
//             }, { responsive: true });
//           } catch (e) {
//             console.error("Error rendering 3D surface:", e);
//           }
//         }
//       }, 500);

//       // Update QuTiP code tab
//       if (res.qutip_code || res.qutip) {
//         $("#qutipCode").text(res.qutip_code || res.qutip);
//       }
//     },
//     error: function (xhr, status, error) {
//       console.error("❌ QSVM AJAX Error:", status, error);
//       console.error("Response text:", xhr.responseText);
//       $("#qsvmOutput").html(`
//         <div style="padding:40px;text-align:center;">
//           <h3 style="color:#f44336;">❌ Connection Error</h3>
//           <p style="color:#666;">Failed to communicate with backend</p>
//           <pre style="text-align:left;background:#f5f5f5;padding:15px;border-radius:8px;overflow:auto;">
// Status: ${status}
// Error: ${error}
// Response: ${xhr.responseText || 'No response'}
//           </pre>
//           <button onclick="location.reload()" style="margin-top:20px;padding:10px 20px;background:#6a0dad;color:white;border:none;border-radius:6px;cursor:pointer;">
//             🔄 Reload Page
//           </button>
//         </div>
//       `);
//     }
//   });
// }

// function displaySingleKernelResults(res) {
//   console.log("🎨 Rendering single kernel results display");
  
//   let html = `
//     <div style="margin:20px;padding:20px;background:white;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
//       <h2 style="color:#6a0dad;text-align:center;margin-bottom:20px;font-size:28px;">
//         🔮 Quantum SVM Results
//       </h2>
      
//       <div style="text-align:center;margin:20px 0;">
//         <span style="background:linear-gradient(135deg,#6a0dad,#9b4dca);color:white;
//                      padding:12px 30px;border-radius:25px;font-weight:bold;font-size:18px;
//                      box-shadow:0 4px 12px rgba(106,13,173,0.3);">
//           Kernel: ${res.kernel_type ? res.kernel_type.toUpperCase() : 'AMPLITUDE'}
//         </span>
//       </div>
//   `;
  
//   // Accuracy metrics
//   if (res.qsvm_accuracy !== undefined) {
//     const qsvmAcc = (res.qsvm_accuracy * 100).toFixed(2);
//     const classicalAcc = (res.classical_accuracy * 100).toFixed(2);
//     const diff = (res.qsvm_accuracy - res.classical_accuracy) * 100;
//     const diffColor = diff > 0 ? '#4CAF50' : (diff < 0 ? '#f44336' : '#666');
    
//     html += `
//       <div style="padding:25px;border:3px solid #6a0dad;border-radius:12px;
//                   background:linear-gradient(135deg,#f5f0ff,#fff);margin-bottom:25px;">
//         <h3 style="color:#6a0dad;margin-top:0;text-align:center;">📊 Classification Performance</h3>
        
//         <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:20px;">
//           <div style="text-align:center;padding:20px;background:white;border-radius:10px;
//                       box-shadow:0 2px 8px rgba(0,0,0,0.1);border:2px solid #6a0dad;">
//             <div style="font-size:42px;font-weight:bold;color:#6a0dad;">
//               ${qsvmAcc}%
//             </div>
//             <div style="color:#666;margin-top:8px;font-weight:600;">🔵 Quantum SVM</div>
//             <div style="font-size:12px;color:#999;margin-top:4px;">
//               ${res.samples_train || '?'} train / ${res.samples_test || '?'} test samples
//             </div>
//           </div>
          
//           <div style="text-align:center;padding:20px;background:white;border-radius:10px;
//                       box-shadow:0 2px 8px rgba(0,0,0,0.1);border:2px solid #4CAF50;">
//             <div style="font-size:42px;font-weight:bold;color:#4CAF50;">
//               ${classicalAcc}%
//             </div>
//             <div style="color:#666;margin-top:8px;font-weight:600;">🟢 Classical SVM</div>
//             <div style="font-size:12px;color:#999;margin-top:4px;">
//               RBF kernel baseline
//             </div>
//           </div>
          
//           <div style="text-align:center;padding:20px;background:white;border-radius:10px;
//                       box-shadow:0 2px 8px rgba(0,0,0,0.1);border:2px solid ${diffColor};">
//             <div style="font-size:42px;font-weight:bold;color:${diffColor};">
//               ${diff > 0 ? '+' : ''}${diff.toFixed(2)}%
//             </div>
//             <div style="color:#666;margin-top:8px;font-weight:600;">📈 Difference</div>
//             <div style="font-size:12px;color:#999;margin-top:4px;">
//               ${diff > 0 ? 'Quantum advantage!' : diff < 0 ? 'Classical better' : 'Equal performance'}
//             </div>
//           </div>
//         </div>
//     `;
    
//     if (res.kernel_description) {
//       html += `
//         <div style="margin-top:20px;padding:15px;background:#fff3cd;border-radius:8px;
//                     border:2px solid #ffc107;">
//           <div style="font-weight:bold;color:#856404;margin-bottom:5px;">💡 About This Kernel:</div>
//           <div style="color:#856404;font-size:14px;">${res.kernel_description}</div>
//         </div>
//       `;
//     }
    
//     html += '</div>';
//   }
  
//   // Manual test points results
//   if (res.predictions && res.test_points) {
//     html += `
//       <div style="padding:20px;border:2px solid #2196F3;border-radius:10px;
//                   background:#e3f2fd;margin-bottom:20px;">
//         <h3 style="color:#1976d2;margin-top:0;">🎯 Test Point Classifications</h3>
//         <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
//           <div style="background:white;padding:15px;border-radius:8px;">
//             <div style="font-weight:bold;color:#6a0dad;margin-bottom:8px;">
//               📍 Point 1: (${res.test_points.point1.x.toFixed(2)}, ${res.test_points.point1.y.toFixed(2)})
//             </div>
//             <div style="font-size:24px;color:${res.test_points.point1.class === 1 ? '#4CAF50' : '#f44336'};">
//               Class: ${res.test_points.point1.class === 1 ? '+1' : '-1'}
//             </div>
//           </div>
//           <div style="background:white;padding:15px;border-radius:8px;">
//             <div style="font-weight:bold;color:#e64a19;margin-bottom:8px;">
//               📍 Point 2: (${res.test_points.point2.x.toFixed(2)}, ${res.test_points.point2.y.toFixed(2)})
//             </div>
//             <div style="font-size:24px;color:${res.test_points.point2.class === 1 ? '#4CAF50' : '#f44336'};">
//               Class: ${res.test_points.point2.class === 1 ? '+1' : '-1'}
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//   }
  
//   // QuTiP code
//   if (res.qutip_code || res.qutip) {
//     const code = res.qutip_code || res.qutip;
//     html += `
//       <div style="padding:20px;border:2px solid #6a0dad;border-radius:10px;
//                   background:#1e1e1e;margin-top:20px;">
//         <h3 style="color:#fff;margin-top:0;margin-bottom:15px;">🧠 QuTiP Implementation</h3>
//         <pre style="color:#d4d4d4;margin:0;overflow-x:auto;white-space:pre-wrap;
//                     font-family:'Courier New',monospace;font-size:13px;line-height:1.6;">${code}</pre>
//       </div>
//     `;
//   }
  
//   html += '</div>';
  
//   $("#qsvmMetrics").html(html);
//   console.log("✅ Results display rendered successfully");
// }

// // ============================================================
// // KERNEL COMPARISON DISPLAY
// // ============================================================
// function displayKernelComparison(res) {
//   console.log("🎨 Rendering kernel comparison display");
  
//   let html = `
//     <div style="margin:20px;padding:20px;background:#f5f5f5;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
//       <h2 style="color:#6a0dad;text-align:center;margin-bottom:30px;font-size:28px;">
//         🔬 Quantum Kernel Comparison Results
//       </h2>
//       <p style="text-align:center;color:#666;margin-bottom:30px;font-size:16px;background:white;padding:15px;border-radius:8px;">
//         Dataset: <strong>${res.dataset || 'Unknown'}</strong> | 
//         Train: <strong>${res.samples_train}</strong> samples | 
//         Test: <strong>${res.samples_test}</strong> samples
//       </p>
//   `;
  
//   // Accuracy comparison table
//   if (res.comparisons && res.comparisons.length > 0) {
//     html += `
//       <div style="background:white;padding:20px;border-radius:12px;margin-bottom:30px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
//         <h3 style="color:#6a0dad;margin-top:0;">📈 Accuracy Comparison</h3>
//         <table style="width:100%;border-collapse:collapse;margin-top:15px;">
//           <thead>
//             <tr style="background:#6a0dad;color:white;">
//               <th style="padding:12px;text-align:left;">Kernel</th>
//               <th style="padding:12px;text-align:center;">QSVM Accuracy</th>
//               <th style="padding:12px;text-align:center;">Classical SVM</th>
//               <th style="padding:12px;text-align:center;">Difference</th>
//             </tr>
//           </thead>
//           <tbody>
//     `;
    
//     res.comparisons.forEach((comp, idx) => {
//       const diff = comp.qsvm_accuracy - comp.classical_accuracy;
//       const diffColor = diff > 0 ? '#4CAF50' : (diff < 0 ? '#f44336' : '#666');
//       const bgColor = idx % 2 === 0 ? '#f9f9f9' : 'white';
      
//       html += `
//         <tr style="background:${bgColor};">
//           <td style="padding:12px;font-weight:600;">${comp.kernel_type.toUpperCase()}</td>
//           <td style="padding:12px;text-align:center;color:#6a0dad;font-weight:bold;">
//             ${(comp.qsvm_accuracy * 100).toFixed(2)}%
//           </td>
//           <td style="padding:12px;text-align:center;color:#2196F3;">
//             ${(comp.classical_accuracy * 100).toFixed(2)}%
//           </td>
//           <td style="padding:12px;text-align:center;color:${diffColor};font-weight:bold;">
//             ${diff > 0 ? '+' : ''}${(diff * 100).toFixed(2)}%
//           </td>
//         </tr>
//       `;
//     });
    
//     html += `
//           </tbody>
//         </table>
//       </div>
//     `;
//   }
  
//   // Statistical tests
//   if (res.statistical_tests) {
//     html += renderKernelStatisticalTests(res.statistical_tests);
//   }
  
//   html += '</div>';
  
//   $("#qsvmOutput").html(html);
//   $("#qsvmMetrics").html(html);
  
//   console.log("✅ Kernel comparison display rendered successfully");
// }

// // ============================================================
// // RENDER STATISTICAL TESTS
// // ============================================================
// function renderKernelStatisticalTests(stats) {
//   let html = `
//     <div style="background:linear-gradient(135deg,#e3f2fd,#bbdefb);
//                 padding:25px;border-radius:12px;margin-bottom:20px;
//                 box-shadow:0 4px 12px rgba(0,0,0,0.1);">
//       <h3 style="color:#1976d2;margin:0 0 20px 0;font-size:24px;text-align:center;">
//         🔬 Statistical Kernel Comparison Tests
//       </h3>
//   `;
  
//   // ANOVA
//   if (stats.anova) {
//     const anova = stats.anova;
//     const sig = anova.p_value < 0.05;
//     html += `
//       <div style="background:white;padding:20px;border-radius:10px;margin-bottom:20px;border:2px solid #1976d2;">
//         <h4 style="color:#1976d2;">📊 ANOVA (Analysis of Variance)</h4>
//         <p style="color:#666;font-size:13px;">${anova.description}</p>
//         <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;">
//           <div style="text-align:center;padding:15px;background:#e3f2fd;border-radius:8px;">
//             <div style="font-size:28px;font-weight:bold;color:#1976d2;">
//               ${anova.f_statistic.toFixed(4)}
//             </div>
//             <div style="font-size:12px;color:#666;">F-Statistic</div>
//           </div>
//           <div style="text-align:center;padding:15px;background:#e3f2fd;border-radius:8px;">
//             <div style="font-size:28px;font-weight:bold;color:${sig ? '#d32f2f' : '#666'};">
//               ${anova.p_value.toFixed(4)}
//             </div>
//             <div style="font-size:12px;color:#666;">p-value</div>
//           </div>
//           <div style="text-align:center;padding:15px;background:${sig ? '#c8e6c9' : '#ffecb3'};border-radius:8px;">
//             <div style="font-size:18px;font-weight:bold;color:${sig ? '#2e7d32' : '#f57c00'};">
//               ${anova.interpretation}
//             </div>
//             <div style="font-size:12px;color:#666;">Result</div>
//           </div>
//         </div>
//       </div>
//     `;
//   }
  
//   // Kruskal-Wallis
//   if (stats.kruskal_wallis) {
//     const kw = stats.kruskal_wallis;
//     const sig = kw.p_value < 0.05;
//     html += `
//       <div style="background:white;padding:20px;border-radius:10px;margin-bottom:20px;border:2px solid #7b1fa2;">
//         <h4 style="color:#7b1fa2;">📈 Kruskal-Wallis Test</h4>
//         <p style="color:#666;font-size:13px;">${kw.description}</p>
//         <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;">
//           <div style="text-align:center;padding:15px;background:#f3e5f5;border-radius:8px;">
//             <div style="font-size:28px;font-weight:bold;color:#7b1fa2;">
//               ${kw.h_statistic.toFixed(4)}
//             </div>
//             <div style="font-size:12px;color:#666;">H-Statistic</div>
//           </div>
//           <div style="text-align:center;padding:15px;background:#f3e5f5;border-radius:8px;">
//             <div style="font-size:28px;font-weight:bold;color:${sig ? '#d32f2f' : '#666'};">
//               ${kw.p_value.toFixed(4)}
//             </div>
//             <div style="font-size:12px;color:#666;">p-value</div>
//           </div>
//           <div style="text-align:center;padding:15px;background:${sig ? '#c8e6c9' : '#ffecb3'};border-radius:8px;">
//             <div style="font-size:18px;font-weight:bold;color:${sig ? '#2e7d32' : '#f57c00'};">
//               ${kw.interpretation}
//             </div>
//             <div style="font-size:12px;color:#666;">Result</div>
//           </div>
//         </div>
//       </div>
//     `;
//   }
//   // ============================================================
// // Pairwise T-Tests
// // ============================================================
// if (stats.pairwise_t_tests && stats.pairwise_t_tests.length > 0) {
//   html += `
//     <div style="background:white;padding:20px;border-radius:10px;margin-bottom:20px;border:2px solid #e64a19;">
//       <h4 style="color:#e64a19;">🔀 Pairwise T-Tests</h4>
//       <table style="width:100%;border-collapse:collapse;">
//         <thead>
//           <tr style="background:#ffccbc;">
//             <th style="padding:10px;">Kernel 1</th>
//             <th style="padding:10px;">Kernel 2</th>
//             <th style="padding:10px;text-align:center;">Mean Diff</th>
//             <th style="padding:10px;text-align:center;">p-value</th>
//             <th style="padding:10px;text-align:center;">Significant?</th>
//             <th style="padding:10px;text-align:center;">Winner</th>
//           </tr>
//         </thead>
//         <tbody>
//   `;

//   stats.pairwise_t_tests.forEach((test, idx) => {
//     const bg = idx % 2 === 0 ? '#fff3e0' : 'white';
//     html += `
//       <tr style="background:${bg};">
//         <td style="padding:10px;">${test.kernel1.toUpperCase()}</td>
//         <td style="padding:10px;">${test.kernel2.toUpperCase()}</td>
//         <td style="padding:10px;text-align:center;color:${test.mean_difference > 0 ? '#2e7d32' : '#d32f2f'};">
//           ${(test.mean_difference * 100).toFixed(2)}%
//         </td>
//         <td style="padding:10px;text-align:center;">${test.p_value.toFixed(4)}</td>
//         <td style="padding:10px;text-align:center;">
//           ${test.significant ? '<span style="color:#2e7d32;">✓</span>' : '<span style="color:#999;">✗</span>'}
//         </td>
//         <td style="padding:10px;text-align:center;font-weight:bold;color:#e64a19;">
//           ${test.better_kernel.toUpperCase()}
//         </td>
//       </tr>
//     `;
//   });

//   html += `
//         </tbody>
//       </table>
//     </div>
//   `;
// }

// // ============================================================
// // Effect Size
// // ============================================================
// if (stats.effect_size) {
//   const es = stats.effect_size;
//   const colors = { 'Large': '#4caf50', 'Medium': '#ff9800', 'Small': '#9e9e9e' };
//   const color = colors[es.interpretation] || '#666';
//   html += `
//     <div style="background:white;padding:20px;border-radius:10px;margin-bottom:20px;border:2px solid #00796b;">
//       <h4 style="color:#00796b;">🔍 Effect Size (Cohen's d)</h4>
//       <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;">
//         <div style="text-align:center;padding:15px;background:#e0f2f1;border-radius:8px;">
//           <div style="font-size:28px;font-weight:bold;color:#00796b;">
//             ${es.cohens_d.toFixed(4)}
//           </div>
//           <div style="font-size:12px;color:#666;">Cohen's d</div>
//         </div>
//         <div style="text-align:center;padding:15px;background:${color}20;border-radius:8px;">
//           <div style="font-size:18px;font-weight:bold;color:${color};">
//             ${es.interpretation}
//           </div>
//           <div style="font-size:12px;color:#666;">Effect Size</div>
//         </div>
//         <div style="text-align:center;padding:15px;background:#e0f2f1;border-radius:8px;">
//           <div style="font-size:14px;font-weight:bold;color:#00796b;">
//             ${es.best_kernel.toUpperCase()} > ${es.worst_kernel.toUpperCase()}
//           </div>
//           <div style="font-size:12px;color:#666;">Best vs Worst</div>
//         </div>
//       </div>
//     </div>
//   `;
// }

// // ============================================================
// // Rankings
// // ============================================================
// if (stats.kernel_rankings) {
//   html += `
//     <div style="background:white;padding:20px;border-radius:10px;border:2px solid #6a0dad;">
//       <h4 style="color:#6a0dad;">🏆 Kernel Rankings</h4>
//       <div style="display:grid;gap:10px;">
//   `;
//   stats.kernel_rankings.forEach(rank => {
//     const medal = rank.rank === 1 ? '🥇' : rank.rank === 2 ? '🥈' : rank.rank === 3 ? '🥉' : '🏅';
//     const bg = rank.rank === 1 ? '#fff3cd' : rank.rank === 2 ? '#e7f3ff' : rank.rank === 3 ? '#ffeaa7' : '#f9f9f9';
//     html += `
//       <div style="display:flex;align-items:center;padding:12px;background:${bg};border-radius:8px;">
//         <div style="font-size:28px;margin-right:15px;">${medal}</div>
//         <div style="flex:1;">
//           <div style="font-weight:600;font-size:16px;">#${rank.rank} ${rank.kernel.toUpperCase()}</div>
//           <div style="font-size:12px;color:#666;">Accuracy: ${(rank.accuracy * 100).toFixed(2)}%</div>
//         </div>
//         <div style="font-weight:bold;color:#6a0dad;">Top ${rank.percentile.toFixed(0)}%</div>
//       </div>
//     `;
//   });
//   html += `
//       </div>
//     </div>
//   `;
// }

// html += '</div>';
// return html;
// }
// ============================================================
// QSVM FRONTEND - COMPLETE IMPLEMENTATION (PART 1/4)
// ============================================================
// Features:
//  • Adds QSVM button to toolbox
//  • Builds configuration popup
//  • Mode cards (Manual vs Dataset)
//  • Sliders, dataset selector, kernel selector
//  • UI tips and styling
// ============================================================

$(document).ready(function () {
  console.log("✅ QSVM Frontend Initialized (Part 1)");
  setTimeout(() => addQSVMToToolbox(), 1000);
});

// ------------------------------------------------------------
// ADD QSVM BUTTON TO TOOLBOX
// ------------------------------------------------------------
function addQSVMToToolbox() {
  const qsvmGate = $("<div>")
    .addClass("gateButton")
    .css({
      width: "45px",
      height: "45px",
      border: "2px solid #6a0dad",
      backgroundColor: "#d3bdf0",
      borderRadius: "8px",
      margin: "8px auto",
      textAlign: "center",
      lineHeight: "42px",
      fontWeight: "bold",
      cursor: "pointer",
    })
    .text("QSVM")
    .attr("title", "Quantum Support Vector Machine")
    .click(() => showQSVMPopup());

  $("#toolboxDivSingle").append(qsvmGate);
}

// ------------------------------------------------------------
// POPUP WINDOW BUILDER
// ------------------------------------------------------------
// ------------------------------------------------------------
// POPUP WINDOW BUILDER  ✅ SCROLLABLE + STICKY BUTTONS
// ------------------------------------------------------------
function showQSVMPopup() {
  $("#qsvmPopup").remove();

  const popup = $(`
    <div id="qsvmPopup" style="
      position:fixed; top:50%; left:50%;
      transform:translate(-50%,-50%);
      background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
      border:3px solid #fff;
      border-radius:16px;
      z-index:9999;
      width:560px;
      box-shadow:0 20px 60px rgba(0,0,0,0.5);
      max-height:85vh;
      overflow-y:auto;
      padding:0;
    ">

      <!-- Header -->
      <div style="
        background:rgba(255,255,255,0.95);
        padding:20px;
        border-radius:16px 16px 0 0;
        border-bottom:3px solid #6a0dad;
        position:sticky;
        top:0;
        z-index:5;
      ">
        <h3 style="
          color:#6a0dad; margin:0;
          text-align:center; font-size:24px;
        ">
          🔮 Quantum Support Vector Machine
        </h3>
        <p style="
          text-align:center;
          color:#666;
          margin:8px 0 0 0;
          font-size:13px;
        ">
          Configure your Quantum ML experiment
        </p>
      </div>

      <!-- Body -->
      <div style="padding:25px; background:#fff;">
        
        <!-- MODE SELECTION -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
          <div class="mode-card" data-mode="manual" style="
            padding:15px; border:3px solid #6a0dad;
            border-radius:10px; cursor:pointer;
            text-align:center; background:#f5f0ff;
            transition:all 0.3s;
          ">
            <div style="font-size:32px;">📍</div>
            <div style="font-weight:bold; margin-top:8px; color:#6a0dad;">Manual Points</div>
            <div style="font-size:11px; color:#666; margin-top:4px;">Test custom coordinates</div>
          </div>

          <div class="mode-card" data-mode="dataset" style="
            padding:15px; border:2px solid #ddd;
            border-radius:10px; cursor:pointer;
            text-align:center; background:#f9f9f9;
            transition:all 0.3s;
          ">
            <div style="font-size:32px;">📊</div>
            <div style="font-weight:bold; margin-top:8px; color:#666;">Dataset Mode</div>
            <div style="font-size:11px; color:#666; margin-top:4px;">Use real ML datasets</div>
          </div>
        </div>

        <!-- MANUAL INPUTS -->
        <div id="manualInputs" style="
          padding:15px; background:#f9f9ff; border-radius:10px;
          border:2px solid #6a0dad; margin-bottom:15px;
        ">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <p style="font-weight:bold; margin:0; color:#6a0dad;">Test Points:</p>
            <button id="randomizePoints" style="
              background:#2196F3; color:white; border:none;
              padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer;
            ">🎲 Randomize</button>
          </div>

          <div style="background:white;padding:12px;border-radius:8px;margin-bottom:10px;">
            <div style="font-weight:600;color:#6a0dad;margin-bottom:8px;">Point 1 (x):</div>
            <div style="display:flex;gap:10px;align-items:center;">
              <div style="flex:1;">
                <label style="font-size:12px;color:#666;">x₁:</label>
                <input id="x1" type="range" min="-2" max="2" step="0.1" value="0"
                       style="width:100%;" oninput="$('#x1val').text(this.value)">
                <div id="x1val" style="text-align:center;font-weight:bold;color:#6a0dad;">0.0</div>
              </div>
              <div style="flex:1;">
                <label style="font-size:12px;color:#666;">x₂:</label>
                <input id="x2" type="range" min="-2" max="2" step="0.1" value="1"
                       style="width:100%;" oninput="$('#x2val').text(this.value)">
                <div id="x2val" style="text-align:center;font-weight:bold;color:#6a0dad;">1.0</div>
              </div>
            </div>
          </div>

          <div style="background:white;padding:12px;border-radius:8px;">
            <div style="font-weight:600;color:#e64a19;margin-bottom:8px;">Point 2 (z):</div>
            <div style="display:flex;gap:10px;align-items:center;">
              <div style="flex:1;">
                <label style="font-size:12px;color:#666;">z₁:</label>
                <input id="z1" type="range" min="-2" max="2" step="0.1" value="1"
                       style="width:100%;" oninput="$('#z1val').text(this.value)">
                <div id="z1val" style="text-align:center;font-weight:bold;color:#e64a19;">1.0</div>
              </div>
              <div style="flex:1;">
                <label style="font-size:12px;color:#666;">z₂:</label>
                <input id="z2" type="range" min="-2" max="2" step="0.1" value="0"
                       style="width:100%;" oninput="$('#z2val').text(this.value)">
                <div id="z2val" style="text-align:center;font-weight:bold;color:#e64a19;">0.0</div>
              </div>
            </div>
          </div>
        </div>

        <!-- DATASET INPUTS -->
        <div id="datasetInputs" style="
          display:none; padding:15px; background:#e3f2fd;
          border-radius:10px; border:2px solid #2196F3; margin-bottom:15px;
        ">
          <label style="font-weight:bold;color:#1976d2;display:block;margin-bottom:8px;">Select Dataset:</label>
          <select id="datasetSelect" style="
            width:100%;padding:10px;border-radius:6px;border:2px solid #2196F3;
            font-size:14px;background:white;
          ">
            <option value="iris">🌸 Iris – 3-class flower dataset</option>
            <option value="wine">🍷 Wine – Chemical analysis</option>
            <option value="breast_cancer">🎗️ Breast Cancer – Diagnosis</option>
            <option value="csv">📄 Upload Custom CSV</option>
          </select>
          <input type="file" id="csvFile" accept=".csv"
                 style="display:none;margin-top:10px;width:100%;">
        </div>

        <!-- KERNEL SELECTION -->
        <div style="margin-bottom:15px;">
          <label style="font-weight:bold;color:#6a0dad;display:block;margin-bottom:8px;">Select Kernel:</label>
          <select id="kernelSelect" style="
            width:100%;padding:10px;border-radius:6px;
            border:2px solid #6a0dad;font-size:14px;background:white;
          ">
            <option value="amplitude">Amplitude Encoding</option>
            <option value="angle">Angle Encoding</option>
            <option value="pauli">Pauli Feature Map</option>
            <option value="zz">ZZ Feature Map</option>
            <option value="iqp">IQP Feature Map</option>
            <option value="polynomial">Polynomial Kernel</option>
          </select>
          <div id="kernelDescription" style="font-size:12px;color:#555;margin-top:8px;">
            Uses RY rotation gates to encode data amplitudes — balanced performance and efficiency.
          </div>
        </div>

      </div> <!-- end body -->

      <!-- Sticky Footer Buttons -->
      <div style="
        position:sticky; bottom:0;
        background:white; padding:15px 20px;
        border-top:2px solid #eee; z-index:10;
      ">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
          <button id="runQSVM" style="
            background:#6a0dad;color:white;border:none;
            padding:10px;border-radius:8px;cursor:pointer;font-weight:bold;
          ">▶️ Run QSVM</button>
          <button id="compareKernels" style="
            background:#2196F3;color:white;border:none;
            padding:10px;border-radius:8px;cursor:pointer;font-weight:bold;
          ">📊 Compare All</button>
        </div>
        <button id="closeQSVM" style="
          width:100%;background:#f44336;color:white;border:none;
          padding:10px;border-radius:8px;cursor:pointer;font-weight:bold;
        ">✖️ Close</button>
      </div>
    </div>
  `);

  $("body").append(popup);
  addQSVMInteractivity();
}


// ============================================================
// QSVM FRONTEND (PART 2/4)
// ------------------------------------------------------------
// Handles:
//  • Mode switching (manual ↔ dataset)
//  • Randomization of points
//  • Kernel description updates
//  • CSV dataset file handling
//  • Button animations
//  • Main event listeners (Run / Compare / Close)
// ============================================================

// ------------------------------------------------------------
// INTERACTIVITY HANDLER
// ------------------------------------------------------------
function addQSVMInteractivity() {
  // --- Mode selection cards ---
  $(".mode-card").click(function () {
    const mode = $(this).data("mode");
    console.log("🎯 Mode selected:", mode);

    // Reset all cards
    $(".mode-card")
      .css({ border: "2px solid #ddd", background: "#f9f9f9" })
      .find("div")
      .eq(1)
      .css("color", "#666");

    // Highlight active one
    if (mode === "manual") {
      $(this)
        .css({ border: "3px solid #6a0dad", background: "#f5f0ff" })
        .find("div")
        .eq(1)
        .css("color", "#6a0dad");
    } else {
      $(this)
        .css({ border: "3px solid #2196F3", background: "#e3f2fd" })
        .find("div")
        .eq(1)
        .css("color", "#1976d2");
    }

    // Toggle visible section
    $("#manualInputs").toggle(mode === "manual");
    $("#datasetInputs").toggle(mode === "dataset");
  });

  // --- Randomize button ---
  $("#randomizePoints").click(function () {
    const rand = () => (Math.random() * 4 - 2).toFixed(1);
    $("#x1").val(rand()).trigger("input");
    $("#x2").val(rand()).trigger("input");
    $("#z1").val(rand()).trigger("input");
    $("#z2").val(rand()).trigger("input");
  });

  // --- Kernel selector ---
  $("#kernelSelect")
    .change(function () {
      const descriptions = {
        amplitude:
          "Uses RY rotation gates to encode data amplitudes — balanced performance and efficiency.",
        angle:
          "Applies RX-RZ rotations; performs well on periodic or circular data patterns.",
        iqp:
          "Instantaneous Quantum Polynomial encoding — leverages quantum interference complexity.",
        pauli:
          "Employs all Pauli rotations (X, Y, Z) to capture diverse quantum correlations.",
        zz: "ZZ feature map — introduces entanglement through ZZ interactions for correlated features.",
        polynomial:
          "Encodes higher-order polynomial feature expansions similar to classical polynomial kernels.",
      };
      $("#kernelDescription").text(descriptions[$(this).val()]);
    })
    .trigger("change");

  // --- Button hover animations ---
  $("#runQSVM, #compareKernels").hover(
    function () {
      $(this).css("transform", "translateY(-2px)");
    },
    function () {
      $(this).css("transform", "translateY(0)");
    }
  );

  // --- Dataset selector (show CSV upload input) ---
  $("#datasetSelect").change(function () {
    const isCsv = $(this).val() === "csv";
    if (isCsv) {
      $("#csvFile").show().css({
        display: "block",
        width: "100%",
        padding: "8px",
        marginTop: "10px",
        border: "2px dashed #2196F3",
        borderRadius: "6px",
        background: "white",
      });
    } else {
      $("#csvFile").hide();
    }
  });
}

// ------------------------------------------------------------
// CLOSE BUTTON HANDLER
// ------------------------------------------------------------
$(document)
  .off("click", "#closeQSVM")
  .on("click", "#closeQSVM", () => {
    $("#qsvmPopup").fadeOut(200, function () {
      $(this).remove();
    });
  });

// ------------------------------------------------------------
// RUN QSVM BUTTON HANDLER
// ------------------------------------------------------------
$(document)
  .off("click", "#runQSVM")
  .on("click", "#runQSVM", function () {
    const activeCard = $(".mode-card[style*='3px solid']");
    const mode = activeCard.length > 0 ? activeCard.data("mode") : "manual";
    const kernel = $("#kernelSelect").val();

    console.log("▶️ Run clicked:", mode, "kernel:", kernel);

    if (mode === "manual") {
      runQSVMManual(kernel);
    } else {
      const ds = $("#datasetSelect").val();
      if (ds === "csv") handleCSVUpload(kernel);
      else runQSVMOnDataset(ds, kernel);
    }
  });

// ------------------------------------------------------------
// COMPARE ALL BUTTON HANDLER
// ------------------------------------------------------------
$(document)
  .off("click", "#compareKernels")
  .on("click", "#compareKernels", function () {
    const activeCard = $(".mode-card[style*='3px solid']");
    const mode = activeCard.length > 0 ? activeCard.data("mode") : "manual";

    if (mode === "dataset") {
      const ds = $("#datasetSelect").val();
      if (ds !== "csv") compareAllKernels(ds);
      else alert("⚠️ Kernel comparison not supported for CSV yet.");
    } else {
      alert("⚠️ Comparison available only in dataset mode.");
    }
  });

// ------------------------------------------------------------
// RUNNING MODES
// ------------------------------------------------------------
function runQSVMManual(kernel) {
  const x1 = parseFloat($("#x1").val());
  const x2 = parseFloat($("#x2").val());
  const z1 = parseFloat($("#z1").val());
  const z2 = parseFloat($("#z2").val());
  sendQSVMRequest({ x1, x2, z1, z2, kernel_type: kernel });
}

function handleCSVUpload(kernel) {
  const file = $("#csvFile")[0].files[0];
  if (!file) {
    alert("⚠️ Please upload a CSV file first.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    const base64 = btoa(e.target.result);
    sendQSVMRequest({ csv_data: base64, kernel_type: kernel });
  };
  reader.readAsBinaryString(file);
}

function runQSVMOnDataset(name, kernel) {
  sendQSVMRequest({ dataset: name, kernel_type: kernel });
}

// ------------------------------------------------------------
// LOADING STATE FOR COMPARE MODE
// ------------------------------------------------------------
function showLoadingAnimation(message, subtext) {
  return `
    <div style="text-align:center; padding:40px;">
      <h2 style="color:#6a0dad; margin:20px 0;">${message}</h2>
      <p style="color:#666; font-size:14px; margin:20px 0;">${subtext}</p>
      <div style="margin:20px auto; width:50px; height:50px;
                  border:5px solid #f3f3f3; border-top:5px solid #6a0dad;
                  border-radius:50%; animation:spin 1s linear infinite;"></div>
      <style>@keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }</style>
    </div>
  `;
}

// ============================================================
// QSVM FRONTEND (PART 3/4)
// ------------------------------------------------------------
// Handles:
//  • AJAX calls to backend (/CodeGenerator)
//  • Single-kernel execution
//  • Compare-all loading animation
//  • Heatmap and 3D-surface visualizations
//  • Results-tab synchronization
// ============================================================

// ------------------------------------------------------------
// COMPARE-ALL MODE
// ------------------------------------------------------------
function compareAllKernels(dataset) {
  console.log("📊 Comparing all kernels on", dataset);
  $("#qsvmPopup").fadeOut(200, () => $(this).remove());

  $(".tabcontent").hide();
  $("#qsvmPanel").show();
  $(".tablinks").removeClass("active");
  $('button[onclick*="qsvmPanel"]').addClass("active");

  const loadingHTML = showLoadingAnimation(
    "⏳ Comparing All Quantum Kernels…",
    "Running ANOVA, Kruskal–Wallis, pairwise t-tests and effect-size analysis"
  );
  $("#qsvmOutput,#qsvmMetrics").html(loadingHTML);

  $.ajax({
    type: "POST",
    url: "/CodeGenerator",
    data: JSON.stringify({ gate: "QSVM", params: { dataset, compare_all: true } }),
    contentType: "application/json; charset=utf-8",
    success: function (res) {
      try {
        if (typeof res === "string") res = JSON.parse(res);
      } catch (e) {
        console.error("❌ Invalid JSON:", e);
        $("#qsvmMetrics").html("<p style='color:red;'>Invalid response format.</p>");
        return;
      }
      console.log("📥 Compare-all response:", res);
      displayKernelComparison(res);
    },
    error: (xhr, _, err) => {
      console.error("❌ Compare error:", err);
      $("#qsvmMetrics").html(`<p style="color:red;">Error: ${err}</p>`);
    },
  });
}

// ------------------------------------------------------------
// SINGLE-KERNEL EXECUTION
// ------------------------------------------------------------
function sendQSVMRequest(params) {
  console.log("🔮 Running QSVM with params:", params);
  $("#qsvmPopup").fadeOut(200, () => $(this).remove());

  $(".tabcontent").hide();
  $("#qsvmPanel").show();
  $(".tablinks").removeClass("active");
  $('button[onclick*="qsvmPanel"]').addClass("active");

  $("#qsvmOutput").html(
    showLoadingAnimation("🔮 Running Quantum SVM…", "Computing kernel matrix and classification accuracy")
  );

  $.ajax({
    type: "POST",
    url: "/CodeGenerator",
    data: JSON.stringify({ gate: "QSVM", params }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (res) {
      try {
        if (typeof res === "string") res = JSON.parse(res);
      } catch (e) {
        $("#qsvmOutput").html(`<pre style="color:red;">${e}</pre>`);
        return;
      }
      if (res.error) {
        $("#qsvmOutput").html(`<p style="color:red;">${res.error}</p>`);
        return;
      }
      displaySingleKernelResults(res);

      // --- Visual Heatmap ---
      if (res.kernel && Array.isArray(res.kernel)) {
        try {
          Plotly.newPlot(
            "kernelHeatmap",
            [
              {
                z: res.kernel,
                type: "heatmap",
                colorscale: "Viridis",
                colorbar: { title: "Kernel Value" },
              },
            ],
            {
              title: `Kernel Matrix – ${(res.kernel_type || "amplitude").toUpperCase()}`,
              margin: { t: 60, l: 60, r: 60, b: 50 },
            },
            { responsive: true }
          );
        } catch (e) {
          console.error("Heatmap render error:", e);
        }
      }

      // --- 3D Surface Plot ---
      if (res.surface_data && res.surface_data.x) {
        try {
          Plotly.newPlot(
            "kernelSurface3D",
            [
              {
                type: "surface",
                x: res.surface_data.x,
                y: res.surface_data.y,
                z: res.surface_data.z,
                colorscale: "Viridis",
              },
            ],
            {
              title: `Kernel Surface – ${(res.kernel_type || "amplitude").toUpperCase()}`,
              scene: {
                xaxis: { title: "Feature 1" },
                yaxis: { title: "Feature 2" },
                zaxis: { title: "Kernel Value" },
              },
            },
            { responsive: true }
          );
        } catch (e) {
          console.error("3D surface error:", e);
        }
      }

      // --- Insert QuTiP code (if present) ---
      if (res.qutip_code || res.qutip) {
        $("#qutipCode").text(res.qutip_code || res.qutip);
      }
    },
    error: (xhr, _, err) => {
      $("#qsvmOutput").html(`
        <div style="text-align:center;padding:40px;">
          <h3 style="color:#f44336;">❌ Backend Connection Error</h3>
          <pre style="background:#f5f5f5;padding:10px;border-radius:8px;">${xhr.responseText || err}</pre>
        </div>
      `);
    },
  });
}

// ------------------------------------------------------------
// DISPLAY SINGLE-KERNEL RESULTS
// ------------------------------------------------------------
function displaySingleKernelResults(res) {
  console.log("🎨 Rendering single-kernel results");
  displayResultsTabComparison(res); // mirror to Results tab

  const qAcc = (res.qsvm_accuracy * 100).toFixed(2);
  const cAcc = (res.classical_accuracy * 100).toFixed(2);
  const diff = (res.qsvm_accuracy - res.classical_accuracy) * 100;
  const diffColor = diff > 0 ? "#4CAF50" : diff < 0 ? "#f44336" : "#666";

  let html = `
    <div style="margin:20px;padding:20px;background:white;border-radius:12px;
                box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      <h2 style="color:#6a0dad;text-align:center;margin-bottom:15px;">
        🔮 QSVM Results
      </h2>
      <div style="text-align:center;margin-bottom:20px;">
        <span style="background:linear-gradient(135deg,#6a0dad,#9b4dca);
                     color:white;padding:10px 25px;border-radius:25px;
                     font-weight:bold;font-size:18px;">
          Kernel: ${(res.kernel_type || "amplitude").toUpperCase()}
        </span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;">
        <div style="background:#f5f0ff;padding:20px;border-radius:10px;text-align:center;">
          <div style="font-size:36px;color:#6a0dad;font-weight:bold;">${qAcc}%</div>
          <div>Quantum SVM</div>
        </div>
        <div style="background:#e8f5e9;padding:20px;border-radius:10px;text-align:center;">
          <div style="font-size:36px;color:#4CAF50;font-weight:bold;">${cAcc}%</div>
          <div>Classical SVM</div>
        </div>
        <div style="background:#fff3e0;padding:20px;border-radius:10px;text-align:center;">
          <div style="font-size:36px;color:${diffColor};font-weight:bold;">
            ${diff > 0 ? "+" : ""}${diff.toFixed(2)}%
          </div>
          <div>Δ Difference</div>
        </div>
      </div>
  `;

  // Manual-mode point results
  if (res.test_points) {
    html += `
      <div style="margin-top:20px;padding:15px;background:#e3f2fd;border-radius:10px;">
        <h4 style="color:#1976d2;margin-top:0;">🎯 Test Point Classifications</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div style="background:white;padding:10px;border-radius:8px;">
            <b>Point 1:</b> (${res.test_points.point1.x.toFixed(2)}, ${res.test_points.point1.y.toFixed(2)}) → 
            <span style="color:${res.test_points.point1.class===1?"#4CAF50":"#f44336"};">
              ${res.test_points.point1.class===1?"+1":"−1"}
            </span>
          </div>
          <div style="background:white;padding:10px;border-radius:8px;">
            <b>Point 2:</b> (${res.test_points.point2.x.toFixed(2)}, ${res.test_points.point2.y.toFixed(2)}) → 
            <span style="color:${res.test_points.point2.class===1?"#4CAF50":"#f44336"};">
              ${res.test_points.point2.class===1?"+1":"−1"}
            </span>
          </div>
        </div>
      </div>`;
  }

  // QuTiP code snippet
  if (res.qutip_code) {
    html += `
      <div style="margin-top:25px;background:#1e1e1e;padding:15px;border-radius:8px;">
        <h4 style="color:white;">🧠 QuTiP Implementation</h4>
        <pre style="color:#d4d4d4;white-space:pre-wrap;">${res.qutip_code}</pre>
      </div>`;
  }

  html += "</div>";
  $("#qsvmOutput,#qsvmMetrics").html(html);
  console.log("✅ Single-kernel results rendered");
}

// ------------------------------------------------------------
// MIRROR RESULTS IN RESULTS TAB
// ------------------------------------------------------------
function displayResultsTabComparison(res) {
  console.log("📊 Updating Results tab for single run");
  $(".tabcontent").hide();
  $("#results").show();
  $(".tablinks").removeClass("active");
  $('button[onclick*="results"]').addClass("active");

  const q = res.qsvm_accuracy * 100;
  const c = res.classical_accuracy * 100;

  const trace = {
    x: ["Quantum SVM", "Classical SVM"],
    y: [q, c],
    type: "bar",
    marker: { color: ["#6a0dad", "#4CAF50"] },
    text: [q.toFixed(2) + "%", c.toFixed(2) + "%"],
    textposition: "outside",
  };

  Plotly.newPlot(
    "plotHist",
    [trace],
    {
      title: `🔮 QSVM vs Classical – ${(res.kernel_type || "Amplitude").toUpperCase()} Kernel`,
      yaxis: { title: "Accuracy (%)" },
      xaxis: { title: "Model Type" },
      margin: { t: 70, b: 60, l: 80, r: 40 },
      plot_bgcolor: "#fafafa",
      paper_bgcolor: "white",
    },
    { responsive: true }
  );
}

// ============================================================
// QSVM FRONTEND (PART 4 / 4)
// ------------------------------------------------------------
// Handles:
//   • Kernel-wise comparison tables
//   • Statistical test rendering (ANOVA, Kruskal, T-tests)
//   • Performance rankings in Results tab
// ============================================================

// ------------------------------------------------------------
// MAIN COMPARISON RENDERER (QSVM TAB)
// ------------------------------------------------------------
function displayKernelComparison(res) {
  console.log("🎨 Rendering kernel comparison display");
  displayResultsTabKernelComparison(res); // also mirror

  let html = `
    <div style="margin:20px;padding:20px;background:#fafafa;
                border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      <h2 style="color:#6a0dad;text-align:center;margin-bottom:25px;">
        🔬 Quantum Kernel Comparison
      </h2>
      <p style="text-align:center;color:#555;margin-bottom:25px;">
        Dataset <strong>${res.dataset || "Unknown"}</strong> | 
        Train ${res.samples_train || "?"} | Test ${res.samples_test || "?"}
      </p>
  `;

  // --- Accuracy table ---
  if (res.comparisons && res.comparisons.length > 0) {
    html += `
      <div style="background:white;padding:15px;border-radius:10px;margin-bottom:25px;">
        <h3 style="color:#6a0dad;">📈 Accuracy Comparison</h3>
        <table style="width:100%;border-collapse:collapse;margin-top:10px;">
          <thead>
            <tr style="background:#6a0dad;color:white;">
              <th style="padding:8px;text-align:left;">Kernel</th>
              <th style="padding:8px;text-align:center;">QSVM Acc (%)</th>
              <th style="padding:8px;text-align:center;">Classical Acc (%)</th>
              <th style="padding:8px;text-align:center;">Δ Difference</th>
            </tr>
          </thead><tbody>
    `;
    res.comparisons.forEach((c, i) => {
      const diff = (c.qsvm_accuracy - c.classical_accuracy) * 100;
      const diffColor = diff > 0 ? "#4CAF50" : diff < 0 ? "#f44336" : "#555";
      const bg = i % 2 === 0 ? "#fafafa" : "white";
      html += `
        <tr style="background:${bg};">
          <td style="padding:8px;font-weight:600;">${c.kernel_type.toUpperCase()}</td>
          <td style="padding:8px;text-align:center;color:#6a0dad;">
            ${(c.qsvm_accuracy * 100).toFixed(2)}
          </td>
          <td style="padding:8px;text-align:center;color:#2196F3;">
            ${(c.classical_accuracy * 100).toFixed(2)}
          </td>
          <td style="padding:8px;text-align:center;color:${diffColor};font-weight:bold;">
            ${diff > 0 ? "+" : ""}${diff.toFixed(2)}
          </td>
        </tr>`;
    });
    html += "</tbody></table></div>";
  }

  // --- Statistical results ---
  if (res.statistical_tests) html += renderKernelStatisticalTests(res.statistical_tests);

  html += "</div>";
  $("#qsvmOutput,#qsvmMetrics").html(html);
  console.log("✅ Kernel comparison rendered");
}

// ------------------------------------------------------------
// RESULTS TAB — COMPARISON VISUALS
// ------------------------------------------------------------
function displayResultsTabKernelComparison(res) {
  console.log("📊 Updating Results tab for kernel comparison");
  $(".tabcontent").hide();
  $("#results").show();
  $(".tablinks").removeClass("active");
  $('button[onclick*="results"]').addClass("active");
  if (!res.comparisons || !res.comparisons.length) return;

  const kernels = res.comparisons.map(k => k.kernel_type.toUpperCase());
  const qAcc = res.comparisons.map(k => k.qsvm_accuracy * 100);
  const cAcc = res.comparisons.map(k => k.classical_accuracy * 100);

  Plotly.newPlot(
    "plotHist",
    [
      { x: kernels, y: qAcc, name: "Quantum SVM", type: "bar", marker: { color: "#6a0dad" } },
      { x: kernels, y: cAcc, name: "Classical SVM", type: "bar", marker: { color: "#4CAF50" } },
    ],
    {
      title: "🔬 Quantum Kernel Comparison",
      barmode: "group",
      yaxis: { title: "Accuracy (%)" },
      xaxis: { title: "Kernel Type", tickangle: -30 },
      legend: { orientation: "h", x: 0.5, xanchor: "center" },
      margin: { t: 60, l: 60, r: 40, b: 100 },
      plot_bgcolor: "#f9f9f9",
    },
    { responsive: true }
  );

  // --- Rankings table ---
  const sorted = res.comparisons
    .map(c => ({
      kernel: c.kernel_type,
      qsvm: c.qsvm_accuracy * 100,
      classical: c.classical_accuracy * 100,
      diff: (c.qsvm_accuracy - c.classical_accuracy) * 100,
    }))
    .sort((a, b) => b.qsvm - a.qsvm);

  let table = `
    <div style="margin-top:25px;background:white;padding:20px;border-radius:12px;
                box-shadow:0 3px 8px rgba(0,0,0,0.1);">
      <h3 style="color:#6a0dad;text-align:center;">🏆 Kernel Rankings</h3>
      <table style="width:100%;border-collapse:collapse;margin-top:10px;">
        <thead>
          <tr style="background:#6a0dad;color:white;">
            <th style="padding:8px;text-align:left;">Rank</th>
            <th style="padding:8px;text-align:left;">Kernel</th>
            <th style="padding:8px;text-align:center;">QSVM (%)</th>
            <th style="padding:8px;text-align:center;">Classical (%)</th>
            <th style="padding:8px;text-align:center;">Δ</th>
          </tr>
        </thead><tbody>`;
  sorted.forEach((k, i) => {
    const medal = ["🥇", "🥈", "🥉"][i] || i + 1;
    const color = k.diff > 0 ? "#4CAF50" : k.diff < 0 ? "#f44336" : "#555";
    table += `
      <tr style="background:${i % 2 ? "#fafafa" : "white"};">
        <td style="padding:8px;">${medal}</td>
        <td style="padding:8px;font-weight:600;">${k.kernel.toUpperCase()}</td>
        <td style="padding:8px;text-align:center;color:#6a0dad;">${k.qsvm.toFixed(2)}</td>
        <td style="padding:8px;text-align:center;color:#4CAF50;">${k.classical.toFixed(2)}</td>
        <td style="padding:8px;text-align:center;color:${color};font-weight:bold;">
          ${k.diff > 0 ? "+" : ""}${k.diff.toFixed(2)}
        </td>
      </tr>`;
  });
  table += "</tbody></table></div>";
  $("#plotHist").append(table);
}

// ------------------------------------------------------------
// STATISTICAL TESTS RENDERER
// ------------------------------------------------------------
function renderKernelStatisticalTests(stats) {
  let html = `
    <div style="background:#e3f2fd;padding:20px;border-radius:10px;
                box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="text-align:center;color:#1976d2;">🔬 Statistical Tests</h3>
  `;

  // --- ANOVA ---
  if (stats.anova) {
    const s = stats.anova;
    html += `
      <div style="background:white;padding:15px;border-radius:8px;margin-top:15px;
                  border-left:4px solid #1976d2;">
        <h4 style="color:#1976d2;margin:0;">📊 ANOVA</h4>
        <p style="font-size:13px;color:#555;">F = ${s.f_statistic.toFixed(4)}, 
          p = ${s.p_value.toFixed(4)} → <b>${s.interpretation}</b></p>
      </div>`;
  }

  // --- Kruskal-Wallis ---
  if (stats.kruskal_wallis) {
    const s = stats.kruskal_wallis;
    html += `
      <div style="background:white;padding:15px;border-radius:8px;margin-top:15px;
                  border-left:4px solid #7b1fa2;">
        <h4 style="color:#7b1fa2;margin:0;">📈 Kruskal-Wallis</h4>
        <p style="font-size:13px;color:#555;">H = ${s.h_statistic.toFixed(4)}, 
          p = ${s.p_value.toFixed(4)} → <b>${s.interpretation}</b></p>
      </div>`;
  }

  // --- Pairwise t-tests ---
  if (stats.pairwise_t_tests && stats.pairwise_t_tests.length) {
    html += `
      <div style="background:white;padding:15px;border-radius:8px;margin-top:15px;
                  border-left:4px solid #e64a19;">
        <h4 style="color:#e64a19;margin:0;">🔀 Pairwise t-Tests</h4>
        <table style="width:100%;border-collapse:collapse;margin-top:5px;">
          <thead>
            <tr style="background:#ffe0b2;">
              <th style="padding:6px;">Kernel 1</th>
              <th style="padding:6px;">Kernel 2</th>
              <th style="padding:6px;text-align:center;">Mean Δ</th>
              <th style="padding:6px;text-align:center;">p-value</th>
              <th style="padding:6px;text-align:center;">Significant?</th>
            </tr>
          </thead><tbody>`;
    stats.pairwise_t_tests.forEach(t => {
      const sig = t.p_value < 0.05;
      html += `
        <tr style="background:${sig ? "#fff8e1" : "white"};">
          <td style="padding:6px;">${t.kernel1}</td>
          <td style="padding:6px;">${t.kernel2}</td>
          <td style="padding:6px;text-align:center;">${t.mean_diff.toFixed(4)}</td>
          <td style="padding:6px;text-align:center;">${t.p_value.toFixed(4)}</td>
          <td style="padding:6px;text-align:center;color:${sig ? "#4CAF50" : "#555"};">
            ${sig ? "✅ Yes" : "–"}
          </td>
        </tr>`;
    });
    html += "</tbody></table></div>";
  }

  html += "</div>";
  return html;
}

// ============================================================
// END OF QSVM_FRONTEND COMPLETE
// ============================================================
console.log("✅ QSVM Frontend Loaded (Parts 1–4 merged successfully)");


/* ============================================================
   🧹 POLISHED IMPROVEMENTS — QSVM FRONTEND
   ============================================================ */

// 1️⃣ Global Spinner CSS (Add once at top-level or dynamically)
if (!document.getElementById("qsvm-global-style")) {
  const style = document.createElement("style");
  style.id = "qsvm-global-style";
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// 2️⃣ Ensure Plotly placeholders exist in DOM
$(document).ready(function () {
  if (!$("#kernelHeatmap").length) {
    $("#qsvmPanel").append('<div id="kernelHeatmap" style="margin-top:30px;height:400px;"></div>');
  }
  if (!$("#kernelSurface3D").length) {
    $("#qsvmPanel").append('<div id="kernelSurface3D" style="margin-top:30px;height:400px;"></div>');
  }
});

// 3️⃣ Results Tab Sync (Reintroduced)
function displayResultsTabComparison(res) {
  console.log("📊 Updating Results tab with single QSVM results");

  $(".tabcontent").hide();
  $("#results").show();
  $(".tablinks").removeClass("active");
  $('button[onclick*="results"]').addClass("active");

  const qAcc = (res.qsvm_accuracy * 100).toFixed(2);
  const cAcc = (res.classical_accuracy * 100).toFixed(2);

  const trace = {
    x: ["Quantum SVM", "Classical SVM"],
    y: [qAcc, cAcc],
    type: "bar",
    marker: { color: ["#6a0dad", "#4CAF50"] },
    text: [qAcc + "%", cAcc + "%"],
    textposition: "outside",
  };

  Plotly.newPlot(
    "plotHist",
    [trace],
    {
      title: `🔮 QSVM vs Classical – ${(res.kernel_type || "Amplitude").toUpperCase()} Kernel`,
      yaxis: { title: "Accuracy (%)" },
      xaxis: { title: "Model Type" },
      margin: { t: 70, b: 60, l: 80, r: 40 },
      plot_bgcolor: "#fafafa",
      paper_bgcolor: "white",
    },
    { responsive: true }
  );
}

// 4️⃣ Kernel Comparison also updates Results tab
function displayKernelComparison(res) {
  console.log("🎨 Rendering kernel comparison display");

  // Sync to results tab for consistency
  displayResultsTabKernelComparison(res);

  let html = `
    <div style="margin:20px;padding:20px;background:#f5f5f5;border-radius:12px;
                box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      <h2 style="color:#6a0dad;text-align:center;margin-bottom:30px;font-size:28px;">
        🔬 Quantum Kernel Comparison Results
      </h2>
      <p style="text-align:center;color:#666;margin-bottom:30px;font-size:16px;background:white;
                padding:15px;border-radius:8px;">
        Dataset: <strong>${res.dataset || 'Unknown'}</strong> | 
        Train: <strong>${res.samples_train}</strong> | 
        Test: <strong>${res.samples_test}</strong>
      </p>
  `;

  // Accuracy table (same as before)
  if (res.comparisons && res.comparisons.length > 0) {
    html += `
      <div style="background:white;padding:20px;border-radius:12px;margin-bottom:30px;
                  box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="color:#6a0dad;margin-top:0;">📈 Accuracy Comparison</h3>
        <table style="width:100%;border-collapse:collapse;margin-top:15px;">
          <thead>
            <tr style="background:#6a0dad;color:white;">
              <th style="padding:12px;text-align:left;">Kernel</th>
              <th style="padding:12px;text-align:center;">QSVM (%)</th>
              <th style="padding:12px;text-align:center;">Classical (%)</th>
              <th style="padding:12px;text-align:center;">Δ Difference</th>
            </tr>
          </thead>
          <tbody>
    `;
    res.comparisons.forEach((c, i) => {
      const diff = (c.qsvm_accuracy - c.classical_accuracy) * 100;
      const diffColor = diff > 0 ? "#4CAF50" : diff < 0 ? "#f44336" : "#666";
      html += `
        <tr style="background:${i % 2 === 0 ? "#fafafa" : "white"};">
          <td style="padding:12px;font-weight:600;">${c.kernel_type.toUpperCase()}</td>
          <td style="padding:12px;text-align:center;color:#6a0dad;">${(c.qsvm_accuracy * 100).toFixed(2)}</td>
          <td style="padding:12px;text-align:center;color:#2196F3;">${(c.classical_accuracy * 100).toFixed(2)}</td>
          <td style="padding:12px;text-align:center;color:${diffColor};font-weight:bold;">
            ${diff > 0 ? "+" : ""}${diff.toFixed(2)}
          </td>
        </tr>`;
    });
    html += "</tbody></table></div>";
  }

  // Statistical tests
  if (res.statistical_tests) html += renderKernelStatisticalTests(res.statistical_tests);
  html += "</div>";

  $("#qsvmOutput").html(html);
  $("#qsvmMetrics").html(html);

  console.log("✅ Kernel comparison rendered + synced to Results tab");
}

// 5️⃣ Results Tab Kernel Comparison Visualization
function displayResultsTabKernelComparison(res) {
  console.log("📊 Updating Results tab for kernel comparison");
  $(".tabcontent").hide();
  $("#results").show();
  $(".tablinks").removeClass("active");
  $('button[onclick*="results"]').addClass("active");

  const kernels = res.comparisons.map(k => k.kernel_type.toUpperCase());
  const qAcc = res.comparisons.map(k => k.qsvm_accuracy * 100);
  const cAcc = res.comparisons.map(k => k.classical_accuracy * 100);

  Plotly.newPlot(
    "plotHist",
    [
      { x: kernels, y: qAcc, name: "Quantum SVM", type: "bar", marker: { color: "#6a0dad" } },
      { x: kernels, y: cAcc, name: "Classical SVM", type: "bar", marker: { color: "#4CAF50" } },
    ],
    {
      title: "🔬 Quantum Kernel Comparison",
      barmode: "group",
      yaxis: { title: "Accuracy (%)" },
      xaxis: { title: "Kernel Type" },
      legend: { orientation: "h", x: 0.5, xanchor: "center" },
      margin: { t: 60, l: 60, r: 40, b: 100 },
      plot_bgcolor: "#f9f9f9",
    },
    { responsive: true }
  );
}

