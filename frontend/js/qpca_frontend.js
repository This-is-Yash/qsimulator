// // ============================================================
// // 🚀 QPCA Frontend - FIXED VERSION
// // ============================================================
// // Fixes:
// // 1. Run button visibility
// // 2. Proper HTML structure insertion
// // 3. Event handler initialization
// // ============================================================

// (function() {
//   'use strict';

//   const BACKEND_BASE = window.location.origin;
//   const DEBUG = true;

//   function log(...args) {
//     if (DEBUG) console.log('[QPCA]', ...args);
//   }

//   function logError(...args) {
//     console.error('[QPCA ERROR]', ...args);
//   }

//   // ============================================================
//   // STATE MANAGEMENT
//   // ============================================================
//   const state = {
//     currentMode: 'dataset',
//     selectedDataset: 'iris',
//     hasCSVFile: false,
//     isProcessing: false,
//     parameters: {
//       n_components: 2,
//       test_size: 0.3,
//       knn_neighbors: 5,
//       random_state: 42
//     },
//     lastResults: null
//   };

//   // ============================================================
//   // INITIALIZATION
//   // ============================================================
//   $(document).ready(function() {
//     log('Frontend initializing...');
//     setTimeout(() => {
//       initQPCA();
//     }, 500);
//   });

//   function initQPCA() {
//     log('🔬 Initializing QPCA Interface');

//     // Create QPCA panel content if it doesn't exist
//     if ($('#qpcaPanel').length && $('#qpcaPanel').children().length === 0) {
//       createQPCAPanelHTML();
//     }

//     // Setup event handlers
//     setupModeSwitch();
//     setupDatasetSelection();
//     setupFileUpload();
//     setupRunButtons();
//     setupParameterControls();
//     updateUI();

//     // Add to toolbox
//     setTimeout(() => {
//       if ($("#toolboxDivSingle").length) {
//         addQPCAToToolbox();
//       }
//     }, 800);

//     log('✅ QPCA Interface ready');
//   }

//   // ============================================================
//   // CREATE QPCA PANEL HTML
//   // ============================================================
//   function createQPCAPanelHTML() {
//     const html = `
//       <div style="padding: 20px;">
//         <h3 style="color:#008080; margin-top:0;">📊 Quantum Principal Component Analysis</h3>
        
//         <!-- Interactive Parameters Panel -->
//         <div id="qpcaParameterPanel"></div>
        
//         <!-- Mode Selection -->
//         <div style="margin-bottom: 20px;">
//           <label style="margin-right: 20px;">
//             <input type="radio" name="qpcaMode" value="dataset" checked> 📊 Dataset Mode
//           </label>
//           <label>
//             <input type="radio" name="qpcaMode" value="manual"> 📝 Manual Data
//           </label>
//         </div>

//         <!-- Dataset Section -->
//         <div id="datasetSection" style="margin-bottom: 20px;">
//           <label style="font-weight: bold; display: block; margin-bottom: 8px;">
//             Select Dataset:
//           </label>
//           <select id="qpcaDataset" style="width: 100%; padding: 10px; border-radius: 6px; border: 2px solid #008080;">
//             <option value="iris">🌸 Iris - Classic flower dataset</option>
//             <option value="wine">🍷 Wine - Chemical analysis</option>
//             <option value="breast_cancer">🎗️ Breast Cancer - Medical diagnosis</option>
//             <option value="csv">📄 Upload Custom CSV</option>
//           </select>
          
//           <!-- CSV Upload Section -->
//           <div id="csvUploadSection" style="display:none; margin-top: 15px;">
//             <input type="file" id="qpcaCsvFile" accept=".csv" style="width: 100%; padding: 8px;">
//             <button id="runCsvQPCA" style="display:none; margin-top: 10px; width: 100%; padding: 12px; background: #00897b; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
//               ▶️ Run QPCA on CSV
//             </button>
//           </div>
          
//           <!-- Dataset Run Button -->
//           <button id="runQPCA" style="margin-top: 15px; width: 100%; padding: 12px; background: #008080; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
//             ▶️ Run QPCA Analysis
//           </button>
//         </div>

//         <!-- Manual Data Section -->
//         <div id="manualSection" style="display:none; margin-bottom: 20px;">
//           <label style="font-weight: bold; display: block; margin-bottom: 8px;">
//             Enter Data (comma-separated, one row per line):
//           </label>
//           <textarea id="qpcaData" rows="6" style="width: 100%; padding: 10px; border-radius: 6px; border: 2px solid #008080; font-family: monospace;" placeholder="1.0, 2.0, 3.0
// 2.0, 3.0, 4.0
// 3.0, 4.0, 5.0"></textarea>
//           <button id="runManualQPCA" style="margin-top: 10px; width: 100%; padding: 12px; background: #008080; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
//             ▶️ Analyze Data
//           </button>
//         </div>

//         <!-- Results Output -->
//         <div id="qpcaOutput" style="display:none; margin-top: 30px;">
//           <div id="qpcaMetrics" style="margin-bottom: 20px;"></div>
          
//           <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
//             <div class="qpca-plot-container">
//               <h4 style="color:#008080; margin-top:0;">Eigenvalue Spectrum</h4>
//               <div id="qpcaEigenPlot" style="width:100%; height:400px;"></div>
//             </div>
            
//             <div class="qpca-plot-container">
//               <h4 style="color:#008080; margin-top:0;">Explained Variance</h4>
//               <div id="qpcaScreePlot" style="width:100%; height:400px;"></div>
//             </div>
//           </div>
          
//           <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
//             <div class="qpca-plot-container">
//               <h4 style="color:#008080; margin-top:0;">Density Matrix</h4>
//               <div id="qpcaDensityPlot" style="width:100%; height:400px;"></div>
//             </div>
            
//             <div class="qpca-plot-container">
//               <h4 style="color:#008080; margin-top:0;">Classification Accuracy</h4>
//               <div id="qpcaAccuracyPlot" style="width:100%; height:400px;"></div>
//             </div>
//           </div>
//         </div>

//         <!-- QuTiP Code Display -->
//         <div id="qpcaCodeSection" style="display:none; margin-top: 30px;">
//           <h4 style="color:#008080;">🧠 QuTiP Implementation Code</h4>
//           <pre id="qpcaCode" style="background:#1e1e1e; color:#d4d4d4; padding:20px; border-radius:8px; overflow-x:auto;"></pre>
//         </div>
//       </div>
//     `;

//     $('#qpcaPanel').html(html);
//     log('✅ QPCA Panel HTML created');
//   }

//   // ============================================================
//   // PARAMETER CONTROLS SETUP
//   // ============================================================
//   function setupParameterControls() {
//     if ($('#qpcaParameterPanel').length === 0) {
//       createParameterPanel();
//     }

//     // N Components Slider
//     $(document).off('input', '#nComponentsSlider').on('input', '#nComponentsSlider', function() {
//       const val = parseInt($(this).val());
//       state.parameters.n_components = val;
//       $('#nComponentsValue').text(val);
//       $('#nComponents').val(val);
//       log('N Components changed to:', val);
//       autoRecompute();
//     });

//     // Test Size Slider
//     $(document).off('input', '#testSizeSlider').on('input', '#testSizeSlider', function() {
//       const val = parseFloat($(this).val());
//       state.parameters.test_size = val;
//       $('#testSizeValue').text((val * 100).toFixed(0) + '%');
//       log('Test size changed to:', val);
//       autoRecompute();
//     });

//     // KNN Neighbors Slider
//     $(document).off('input', '#knnNeighborsSlider').on('input', '#knnNeighborsSlider', function() {
//       const val = parseInt($(this).val());
//       state.parameters.knn_neighbors = val;
//       $('#knnNeighborsValue').text(val);
//       log('KNN neighbors changed to:', val);
//       autoRecompute();
//     });

//     // Random State Input
//     $(document).off('input', '#randomStateInput').on('input', '#randomStateInput', function() {
//       const val = parseInt($(this).val()) || 42;
//       state.parameters.random_state = val;
//       log('Random state changed to:', val);
//     });

//     // Auto-recompute toggle
//     $(document).off('change', '#autoRecompute').on('change', '#autoRecompute', function() {
//       const isEnabled = $(this).is(':checked');
//       log('Auto-recompute:', isEnabled ? 'enabled' : 'disabled');
//     });

//     log('✅ Parameter controls setup complete');
//   }

//   function autoRecompute() {
//     if ($('#autoRecompute').is(':checked') && state.lastResults) {
//       log('Auto-recompute triggered');
//       clearTimeout(window.qpcaAutoRecomputeTimer);
//       window.qpcaAutoRecomputeTimer = setTimeout(() => {
//         runQPCAAnalysis();
//       }, 500);
//     }
//   }

//   // ============================================================
//   // CREATE PARAMETER PANEL
//   // ============================================================
//   function createParameterPanel() {
//     const panelHTML = `
//       <div id="qpcaParameterPanel" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
//         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
//           <h3 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 600;">
//             🎛️ Interactive Parameters
//           </h3>
//           <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
//             <input type="checkbox" id="autoRecompute" style="cursor: pointer;">
//             <span style="color: #34495e; font-size: 14px; font-weight: 500;">Auto-recompute</span>
//           </label>
//         </div>

//         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
          
//           <!-- N Components -->
//           <div class="parameter-control" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
//               <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">📊 Components</label>
//               <span id="nComponentsValue" style="background: #3498db; color: white; padding: 4px 12px; border-radius: 12px; font-weight: bold; font-size: 14px;">2</span>
//             </div>
//             <input type="range" id="nComponentsSlider" class="parameter-slider" min="1" max="10" value="2" step="1" style="width: 100%; cursor: pointer;">
//             <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
//               <span>1</span><span>10</span>
//             </div>
//           </div>

//           <!-- Test Size -->
//           <div class="parameter-control" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
//               <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">🎯 Test Size</label>
//               <span id="testSizeValue" style="background: #e74c3c; color: white; padding: 4px 12px; border-radius: 12px; font-weight: bold; font-size: 14px;">30%</span>
//             </div>
//             <input type="range" id="testSizeSlider" class="parameter-slider" min="0.1" max="0.5" value="0.3" step="0.05" style="width: 100%; cursor: pointer;">
//             <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
//               <span>10%</span><span>50%</span>
//             </div>
//           </div>

//           <!-- KNN Neighbors -->
//           <div class="parameter-control" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
//               <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">👥 KNN Neighbors</label>
//               <span id="knnNeighborsValue" style="background: #2ecc71; color: white; padding: 4px 12px; border-radius: 12px; font-weight: bold; font-size: 14px;">5</span>
//             </div>
//             <input type="range" id="knnNeighborsSlider" class="parameter-slider" min="1" max="15" value="5" step="1" style="width: 100%; cursor: pointer;">
//             <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
//               <span>1</span><span>15</span>
//             </div>
//           </div>

//           <!-- Random State -->
//           <div class="parameter-control" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//             <div style="margin-bottom: 10px;">
//               <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">🎲 Random Seed</label>
//             </div>
//             <input type="number" id="randomStateInput" value="42" min="0" max="9999" style="width: 100%; padding: 8px 12px; border: 2px solid #bdc3c7; border-radius: 6px; font-size: 14px; font-weight: 500; text-align: center;">
//             <div style="font-size: 11px; color: #7f8c8d; margin-top: 5px; text-align: center;">For reproducibility</div>
//           </div>

//         </div>

//         <div style="background: #fff9e6; border-left: 4px solid #f39c12; padding: 12px; margin-top: 15px; border-radius: 4px;">
//           <p style="margin: 0; color: #7d6608; font-size: 13px;">
//             <strong>💡 Tip:</strong> Enable <strong>Auto-recompute</strong> to see results update in real-time!
//           </p>
//         </div>
//       </div>
//     `;

//     $('#qpcaPanel').prepend(panelHTML);
//     log('✅ Parameter panel created');
//   }

//   // ============================================================
//   // EVENT HANDLERS SETUP
//   // ============================================================
//   function setupModeSwitch() {
//     $(document).off('change', 'input[name="qpcaMode"]').on('change', 'input[name="qpcaMode"]', function() {
//       state.currentMode = $(this).val();
//       log('Mode switched to:', state.currentMode);
//       updateUI();
//     });
//   }

//   function setupDatasetSelection() {
//     $(document).off('change', '#qpcaDataset').on('change', '#qpcaDataset', function() {
//       state.selectedDataset = $(this).val();
//       log('Dataset selected:', state.selectedDataset);
//       updateMaxComponents();
//       updateUI();
//     });
//   }

//   function updateMaxComponents() {
//     const maxComponents = {
//       'iris': 4,
//       'wine': 13,
//       'breast_cancer': 30,
//       'csv': 10
//     };
    
//     const max = maxComponents[state.selectedDataset] || 10;
//     $('#nComponentsSlider').attr('max', max);
    
//     if (state.parameters.n_components > max) {
//       state.parameters.n_components = Math.min(max, 2);
//       $('#nComponentsSlider').val(state.parameters.n_components);
//       $('#nComponentsValue').text(state.parameters.n_components);
//     }
    
//     $('#nComponentsSlider').siblings('div').find('span:last').text(max);
//   }

//   function setupFileUpload() {
//     $(document).off('change', '#qpcaCsvFile').on('change', '#qpcaCsvFile', function() {
//       state.hasCSVFile = this.files && this.files.length > 0;
//       if (state.hasCSVFile) {
//         log('📄 CSV file selected:', this.files[0].name);
//       }
//       updateUI();
//     });
//   }

//   function setupRunButtons() {
//     // Dataset QPCA button
//     $(document).off('click', '#runQPCA').on('click', '#runQPCA', function(e) {
//       e.preventDefault();
//       e.stopPropagation();
//       log('▶️ Run QPCA button clicked');
//       runQPCAAnalysis();
//     });

//     // CSV QPCA button
//     $(document).off('click', '#runCsvQPCA').on('click', '#runCsvQPCA', function(e) {
//       e.preventDefault();
//       e.stopPropagation();
//       log('▶️ Run CSV QPCA button clicked');
//       runCsvQPCA();
//     });

//     // Manual QPCA button
//     $(document).off('click', '#runManualQPCA').on('click', '#runManualQPCA', function(e) {
//       e.preventDefault();
//       e.stopPropagation();
//       log('▶️ Run Manual QPCA button clicked');
//       runQPCAAnalysis();
//     });
//   }

//   // ============================================================
//   // UI UPDATE
//   // ============================================================
//   function updateUI() {
//     if (state.currentMode === 'dataset') {
//       $('#datasetSection').show();
//       $('#manualSection').hide();
//     } else {
//       $('#datasetSection').hide();
//       $('#manualSection').show();
//     }

//     if (state.selectedDataset === 'csv') {
//       $('#runQPCA').hide();
//       $('#csvUploadSection').show();
//       $('#runCsvQPCA').toggle(state.hasCSVFile);
//     } else {
//       $('#runQPCA').show();
//       $('#csvUploadSection').hide();
//     }

//     log('UI updated - mode:', state.currentMode, 'dataset:', state.selectedDataset);
//   }

//   // ============================================================
//   // CSV QPCA PROCESSING
//   // ============================================================
//   function runCsvQPCA() {
//     if (state.isProcessing) return;

//     const fileInput = document.getElementById("qpcaCsvFile");
//     if (!fileInput || !fileInput.files.length) {
//       showError("Please select a CSV file");
//       return;
//     }

//     state.isProcessing = true;
//     showLoading("Processing CSV file...");

//     const formData = new FormData();
//     formData.append("file", fileInput.files[0]);
//     formData.append("n_components", state.parameters.n_components);
//     formData.append("test_size", state.parameters.test_size);
//     formData.append("knn_neighbors", state.parameters.knn_neighbors);
//     formData.append("random_state", state.parameters.random_state);
    
//     const url = `${BACKEND_BASE}/ComputeQPCAFromCSV`;

//     log('📤 Uploading CSV to', url, 'with parameters:', state.parameters);

//     fetch(url, { method: "POST", body: formData })
//     .then(response => response.json())
//     .then(data => {
//       log('📥 CSV result received:', data);
//       state.isProcessing = false;
//       hideLoading();

//       if (data.error || data.success === false) {
//         showError("CSV QPCA Error:\n\n" + (data.error || 'Unknown error'));
//       } else {
//         state.lastResults = data;
//         displayResults(data);
//       }
//     })
//     .catch(err => {
//       logError('CSV upload failed:', err);
//       state.isProcessing = false;
//       hideLoading();
//       showError("Upload failed: " + err.message);
//     });
//   }

//   // ============================================================
//   // DATASET/MANUAL QPCA PROCESSING
//   // ============================================================
//   function runQPCAAnalysis() {
//     if (state.isProcessing) return;

//     log('🔮 Running QPCA analysis with parameters:', state.parameters);
//     const mode = state.currentMode;
//     let payload = {};

//     try {
//       if (mode === 'dataset') {
//         const dataset = $('#qpcaDataset').val();

//         if (dataset === 'csv') {
//           showError("Use 'Run QPCA on CSV' button for CSV files");
//           return;
//         }

//         payload = { 
//           dataset,
//           n_components: state.parameters.n_components,
//           test_size: state.parameters.test_size,
//           knn_neighbors: state.parameters.knn_neighbors,
//           random_state: state.parameters.random_state
//         };

//       } else {
//         const raw = $("#qpcaData").val().trim();
//         if (!raw) {
//           showError("Please enter data");
//           return;
//         }

//         const lines = raw.split("\n").filter(line => line.trim());
//         const data = lines.map(line => {
//           return line.split(/[,\s]+/).map(x => parseFloat(x.trim()));
//         }).filter(row => row.length > 0 && row.every(x => !isNaN(x)));

//         if (!data.length) {
//           showError("Invalid data format");
//           return;
//         }

//         payload = { 
//           data,
//           n_components: state.parameters.n_components
//         };
//       }

//       state.isProcessing = true;
//       showLoading("Performing quantum analysis...");

//       const url = `${BACKEND_BASE}/ComputeQPCA`;
//       log('📤 Sending to', url, payload);

//       $.ajax({
//         type: "POST",
//         url: url,
//         data: JSON.stringify(payload),
//         contentType: "application/json",
//         dataType: "json",
//         success: function(res) {
//           log('✅ Backend response:', res);
//           state.isProcessing = false;
//           hideLoading();

//           if (res.error || res.success === false) {
//             showError(res.error || 'Analysis failed');
//           } else {
//             state.lastResults = res;
//             displayResults(res);
//           }
//         },
//         error: function(xhr, status, error) {
//           logError('Backend error:', xhr.status, error);
//           state.isProcessing = false;
//           hideLoading();
//           showError(`Backend error (${xhr.status}): ${error}`);
//         }
//       });

//     } catch (err) {
//       logError('Analysis error:', err);
//       state.isProcessing = false;
//       hideLoading();
//       showError("Error: " + err.message);
//     }
//   }

//   // ============================================================
//   // RESULTS DISPLAY (Simplified)
//   // ============================================================
//   function displayResults(res) {
//     log('👁️ Displaying QPCA results');
    
//     $('#qpcaOutput').show();
//     $('#qpcaCodeSection').show();

//     // Simple metrics display
//     let metricsHTML = '<h4>Analysis Complete</h4>';
//     if (res.dataset_info) {
//       metricsHTML += `<p>Dataset: ${res.dataset_info.name}, Samples: ${res.dataset_info.n_samples}, Features: ${res.dataset_info.n_features}</p>`;
//     }
//     if (res.evaluation_metrics && res.evaluation_metrics.qpca_classification_accuracy) {
//       metricsHTML += `<p>QPCA Accuracy: ${(res.evaluation_metrics.qpca_classification_accuracy * 100).toFixed(2)}%</p>`;
//     }
//     $('#qpcaMetrics').html(metricsHTML);

//     // Create plots
//     setTimeout(() => {
//       if (res.eigenvalues && document.getElementById("qpcaEigenPlot")) {
//         Plotly.newPlot("qpcaEigenPlot", [{
//           x: res.eigenvalues.map((_, i) => `PC${i + 1}`),
//           y: res.eigenvalues,
//           type: "bar",
//           marker: { color: "#00897b" }
//         }], { title: "Eigenvalue Spectrum" });
//       }
//     }, 100);

//     // Display code
//     if (res.qutip_code || res.qutip) {
//       $("#qpcaCode").text(res.qutip_code || res.qutip);
//     }

//     log('✅ Results displayed');
//   }

//   // ============================================================
//   // UI HELPERS
//   // ============================================================
//   function showLoading(message) {
//     let $loading = $('#qpcaLoading');
//     if (!$loading.length) {
//       $loading = $('<div id="qpcaLoading">')
//         .css({
//           position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
//           backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
//           alignItems: 'center', justifyContent: 'center', zIndex: 10000
//         })
//         .html(`<div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
//           <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #00897b; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
//           <p style="margin: 0; color: #333;">${message}</p>
//         </div>`)
//         .appendTo('body');

//       $('<style>').text('@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }').appendTo('head');
//     }
//     $loading.show();
//   }

//   function hideLoading() {
//     $('#qpcaLoading').hide();
//   }

//   function showError(message) {
//     alert('❌ ' + message);
//     logError(message);
//   }

//   // ============================================================
//   // TOOLBOX INTEGRATION
//   // ============================================================
//   function addQPCAToToolbox() {
//     if ($("#toolboxDivSingle .qpcaToolboxButton").length) return;

//     const qpcaButton = $("<div>")
//       .addClass("gateButton qpcaToolboxButton")
//       .css({
//         width: "45px", height: "45px", border: "2px solid #00897b",
//         backgroundColor: "#b2dfdb", borderRadius: "8px", margin: "8px auto",
//         textAlign: "center", lineHeight: "42px", fontWeight: "bold",
//         cursor: "pointer", transition: "all 0.2s ease"
//       })
//       .text("QPCA")
//       .attr("title", "Quantum Principal Component Analysis")
//       .hover(
//         function() { $(this).css({ backgroundColor: "#80cbc4", transform: "scale(1.05)" }); },
//         function() { $(this).css({ backgroundColor: "#b2dfdb", transform: "scale(1)" }); }
//       )
//       .click(function() {
//         log('QPCA button clicked');
//         $('.tabcontent').hide();
//         $('#qpcaPanel').show();
//         $('.tablinks').removeClass('active');
//         $('button[onclick*="qpcaPanel"]').addClass('active');
//       });

//     $("#toolboxDivSingle").append(qpcaButton);
//     log('✅ QPCA button added to toolbox');
//   }

//   // Export
//   window.QPCA = {
//     init: initQPCA,
//     runAnalysis: runQPCAAnalysis,
//     state: state
//   };

//   log('✅ QPCA Frontend Module Loaded');

// })();

// // ============================================================
// // 🚀 QPCA Frontend - INTERACTIVE PARAMETERS WITH SLIDERS
// // ============================================================
// // Quantum Principal Component Analysis - Web Interface
// // Compatible with CherryPyWorks Backend (Port 8080)
// // ============================================================

// // (function() {
// //   'use strict';

// //   // ============================================================
// //   // CONFIGURATION
// //   // ============================================================
// //   const BACKEND_BASE = window.location.origin;
// //   const DEBUG = true;

// //   function log(...args) {
// //     if (DEBUG) console.log('[QPCA]', ...args);
// //   }

// //   function logError(...args) {
// //     console.error('[QPCA ERROR]', ...args);
// //   }

// //   // ============================================================
// //   // STATE MANAGEMENT
// //   // ============================================================
// //   const state = {
// //     currentMode: 'dataset',
// //     selectedDataset: 'iris',
// //     hasCSVFile: false,
// //     isProcessing: false,
// //     parameters: {
// //       n_components: 2,
// //       test_size: 0.3,
// //       knn_neighbors: 5,
// //       random_state: 42
// //     },
// //     lastResults: null
// //   };

// //   // ============================================================
// //   // INITIALIZATION
// //   // ============================================================
// //   $(document).ready(function() {
// //     log('Frontend initializing...');
// //     initQPCA();
// //   });

// //   function initQPCA() {
// //     log('🔬 Initializing QPCA Interface');

// //     // Setup event handlers
// //     setupModeSwitch();
// //     setupDatasetSelection();
// //     setupFileUpload();
// //     setupRunButtons();
// //     setupParameterControls();
// //     updateUI();

// //     // Add to toolbox after delay
// //     setTimeout(() => {
// //       if ($("#toolboxDivSingle").length) {
// //         addQPCAToToolbox();
// //       }
// //     }, 800);

// //     log('✅ QPCA Interface ready');
// //   }

// //   // ============================================================
// //   // PARAMETER CONTROLS SETUP
// //   // ============================================================
// //   function setupParameterControls() {
// //     // Create parameter panel if it doesn't exist
// //     if ($('#qpcaParameterPanel').length === 0) {
// //       createParameterPanel();
// //     }

// //     // N Components Slider
// //     $('#nComponentsSlider').off('input').on('input', function() {
// //       const val = parseInt($(this).val());
// //       state.parameters.n_components = val;
// //       $('#nComponentsValue').text(val);
// //       $('#nComponents').val(val);
// //       log('N Components changed to:', val);
// //     });

// //     // Test Size Slider
// //     $('#testSizeSlider').off('input').on('input', function() {
// //       const val = parseFloat($(this).val());
// //       state.parameters.test_size = val;
// //       $('#testSizeValue').text((val * 100).toFixed(0) + '%');
// //       log('Test size changed to:', val);
// //     });

// //     // KNN Neighbors Slider
// //     $('#knnNeighborsSlider').off('input').on('input', function() {
// //       const val = parseInt($(this).val());
// //       state.parameters.knn_neighbors = val;
// //       $('#knnNeighborsValue').text(val);
// //       log('KNN neighbors changed to:', val);
// //     });

// //     // Random State Input
// //     $('#randomStateInput').off('input').on('input', function() {
// //       const val = parseInt($(this).val()) || 42;
// //       state.parameters.random_state = val;
// //       log('Random state changed to:', val);
// //     });

// //     // Auto-recompute toggle
// //     $('#autoRecompute').off('change').on('change', function() {
// //       const isEnabled = $(this).is(':checked');
// //       log('Auto-recompute:', isEnabled ? 'enabled' : 'disabled');
      
// //       if (isEnabled && state.lastResults) {
// //         log('Auto-recompute triggered');
// //         setTimeout(() => runQPCAAnalysis(), 500);
// //       }
// //     });

// //     // Real-time parameter updates with auto-recompute
// //     $('.parameter-slider').off('change').on('change', function() {
// //       if ($('#autoRecompute').is(':checked') && state.lastResults) {
// //         log('Parameter changed, auto-recomputing...');
// //         setTimeout(() => runQPCAAnalysis(), 300);
// //       }
// //     });
// //   }

// //   // ============================================================
// //   // CREATE PARAMETER PANEL
// //   // ============================================================
// //   function createParameterPanel() {
// //     const panelHTML = `
// //       <div id="qpcaParameterPanel" style="
// //         background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
// //         border-radius: 12px;
// //         padding: 20px;
// //         margin-bottom: 20px;
// //         box-shadow: 0 4px 12px rgba(0,0,0,0.15);
// //       ">
// //         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
// //           <h3 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 600;">
// //             🎛️ Interactive Parameters
// //           </h3>
// //           <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
// //             <input type="checkbox" id="autoRecompute" style="cursor: pointer;">
// //             <span style="color: #34495e; font-size: 14px; font-weight: 500;">Auto-recompute</span>
// //           </label>
// //         </div>

// //         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
          
// //           <!-- N Components -->
// //           <div class="parameter-control" style="
// //             background: white;
// //             padding: 15px;
// //             border-radius: 8px;
// //             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// //           ">
// //             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
// //               <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">
// //                 📊 Components
// //               </label>
// //               <span id="nComponentsValue" style="
// //                 background: #3498db;
// //                 color: white;
// //                 padding: 4px 12px;
// //                 border-radius: 12px;
// //                 font-weight: bold;
// //                 font-size: 14px;
// //               ">2</span>
// //             </div>
// //             <input 
// //               type="range" 
// //               id="nComponentsSlider" 
// //               class="parameter-slider"
// //               min="1" 
// //               max="10" 
// //               value="2" 
// //               step="1"
// //               style="width: 100%; cursor: pointer;"
// //             >
// //             <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
// //               <span>1</span>
// //               <span>10</span>
// //             </div>
// //           </div>

// //           <!-- Test Size -->
// //           <div class="parameter-control" style="
// //             background: white;
// //             padding: 15px;
// //             border-radius: 8px;
// //             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// //           ">
// //             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
// //               <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">
// //                 🎯 Test Size
// //               </label>
// //               <span id="testSizeValue" style="
// //                 background: #e74c3c;
// //                 color: white;
// //                 padding: 4px 12px;
// //                 border-radius: 12px;
// //                 font-weight: bold;
// //                 font-size: 14px;
// //               ">30%</span>
// //             </div>
// //             <input 
// //               type="range" 
// //               id="testSizeSlider" 
// //               class="parameter-slider"
// //               min="0.1" 
// //               max="0.5" 
// //               value="0.3" 
// //               step="0.05"
// //               style="width: 100%; cursor: pointer;"
// //             >
// //             <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
// //               <span>10%</span>
// //               <span>50%</span>
// //             </div>
// //           </div>

// //           <!-- KNN Neighbors -->
// //           <div class="parameter-control" style="
// //             background: white;
// //             padding: 15px;
// //             border-radius: 8px;
// //             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// //           ">
// //             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
// //               <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">
// //                 👥 KNN Neighbors
// //               </label>
// //               <span id="knnNeighborsValue" style="
// //                 background: #2ecc71;
// //                 color: white;
// //                 padding: 4px 12px;
// //                 border-radius: 12px;
// //                 font-weight: bold;
// //                 font-size: 14px;
// //               ">5</span>
// //             </div>
// //             <input 
// //               type="range" 
// //               id="knnNeighborsSlider" 
// //               class="parameter-slider"
// //               min="1" 
// //               max="15" 
// //               value="5" 
// //               step="1"
// //               style="width: 100%; cursor: pointer;"
// //             >
// //             <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
// //               <span>1</span>
// //               <span>15</span>
// //             </div>
// //           </div>

// //           <!-- Random State -->
// //           <div class="parameter-control" style="
// //             background: white;
// //             padding: 15px;
// //             border-radius: 8px;
// //             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// //           ">
// //             <div style="margin-bottom: 10px;">
// //               <label style="color: 2c3e50; font-weight: 500; font-size: 14px;">
// //                 🎲 Random Seed
// //               </label>
// //             </div>
// //             <input 
// //               type="number" 
// //               id="randomStateInput" 
// //               value="42"
// //               min="0"
// //               max="9999"
// //               style="
// //                 width: 100%;
// //                 padding: 8px 12px;
// //                 border: 2px solid #bdc3c7;
// //                 border-radius: 6px;
// //                 font-size: 14px;
// //                 font-weight: 500;
// //                 text-align: center;
// //               "
// //             >
// //             <div style="font-size: 11px; color: #7f8c8d; margin-top: 5px; text-align: center;">
// //               For reproducibility
// //             </div>
// //           </div>

// //         </div>

// //         <!-- Parameter Info Banner -->
// //         <div style="
// //           background: #fff9e6;
// //           border-left: 4px solid #f39c12;
// //           padding: 12px;
// //           margin-top: 15px;
// //           border-radius: 4px;
// //         ">
// //           <p style="margin: 0; color: #7d6608; font-size: 13px;">
// //             <strong>💡 Tip:</strong> Enable <strong>Auto-recompute</strong> to see results update in real-time as you adjust parameters!
// //           </p>
// //         </div>
// //       </div>
// //     `;

// //     // Insert before the dataset section
// //     if ($('#datasetSection').length) {
// //       $(panelHTML).insertBefore('#datasetSection');
// //     } else if ($('#qpcaPanel').length) {
// //       $('#qpcaPanel').prepend(panelHTML);
// //     }

// //     log('✅ Parameter panel created');
// //   }

// //   // ============================================================
// //   // EVENT HANDLERS SETUP
// //   // ============================================================
// //   function setupModeSwitch() {
// //     $('input[name="qpcaMode"]').off('change').on('change', function() {
// //       state.currentMode = $(this).val();
// //       log('Mode switched to:', state.currentMode);
// //       updateUI();
// //     });
// //   }

// //   function setupDatasetSelection() {
// //     $('#qpcaDataset').off('change').on('change', function() {
// //       state.selectedDataset = $(this).val();
// //       log('Dataset selected:', state.selectedDataset);
      
// //       // Update max components based on dataset
// //       updateMaxComponents();
// //       updateUI();
// //     });
// //   }

// //   function updateMaxComponents() {
// //     const maxComponents = {
// //       'iris': 4,
// //       'wine': 13,
// //       'breast_cancer': 30,
// //       'csv': 10
// //     };
    
// //     const max = maxComponents[state.selectedDataset] || 10;
// //     $('#nComponentsSlider').attr('max', max);
    
// //     // Adjust current value if it exceeds max
// //     if (state.parameters.n_components > max) {
// //       state.parameters.n_components = Math.min(max, 2);
// //       $('#nComponentsSlider').val(state.parameters.n_components);
// //       $('#nComponentsValue').text(state.parameters.n_components);
// //     }
    
// //     // Update max label
// //     $('#nComponentsSlider').siblings('div').find('span:last').text(max);
// //   }

// //   function setupFileUpload() {
// //     $("#qpcaCsvFile").off('change').on('change', function() {
// //       state.hasCSVFile = this.files && this.files.length > 0;
// //       if (state.hasCSVFile) {
// //         log('📄 CSV file selected:', this.files[0].name);
// //       }
// //       updateUI();
// //     });
// //   }

// //   function setupRunButtons() {
// //     $("#runQPCA").off('click').on('click', function(e) {
// //       e.preventDefault();
// //       e.stopPropagation();
// //       runQPCAAnalysis();
// //     });

// //     $("#runCsvQPCA").off('click').on('click', function(e) {
// //       e.preventDefault();
// //       e.stopPropagation();
// //       runCsvQPCA();
// //     });
// //   }

// //   // ============================================================
// //   // UI UPDATE
// //   // ============================================================
// //   function updateUI() {
// //     // Mode visibility
// //     if (state.currentMode === 'dataset') {
// //       $('#datasetSection').show();
// //       $('#manualSection').hide();
// //     } else {
// //       $('#datasetSection').hide();
// //       $('#manualSection').show();
// //     }

// //     // Dataset-specific UI
// //     if (state.selectedDataset === 'csv') {
// //       $('#runQPCA').hide();
// //       $('#csvUploadSection').show();
// //       $('#runCsvQPCA').toggle(state.hasCSVFile);
// //     } else {
// //       $('#runQPCA').show();
// //       $('#csvUploadSection').hide();
// //     }

// //     log('UI updated');
// //   }

// //   // ============================================================
// //   // CSV QPCA PROCESSING
// //   // ============================================================
// //   function runCsvQPCA() {
// //     if (state.isProcessing) {
// //       log('⚠️ Already processing...');
// //       return;
// //     }

// //     const fileInput = document.getElementById("qpcaCsvFile");
// //     if (!fileInput || !fileInput.files.length) {
// //       showError("Please select a CSV file");
// //       return;
// //     }

// //     state.isProcessing = true;
// //     showLoading("Processing CSV file...");

// //     const formData = new FormData();
// //     formData.append("file", fileInput.files[0]);
// //     formData.append("n_components", state.parameters.n_components);
// //     formData.append("test_size", state.parameters.test_size);
// //     formData.append("knn_neighbors", state.parameters.knn_neighbors);
// //     formData.append("random_state", state.parameters.random_state);
    
// //     const url = `${BACKEND_BASE}/ComputeQPCAFromCSV`;

// //     log('📤 Uploading CSV to', url, 'with parameters:', state.parameters);

// //     fetch(url, { 
// //       method: "POST", 
// //       body: formData 
// //     })
// //     .then(response => {
// //       if (!response.ok) {
// //         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
// //       }
// //       return response.json();
// //     })
// //     .then(data => {
// //       log('📥 CSV result received:', data);
// //       state.isProcessing = false;
// //       hideLoading();

// //       if (data.error) {
// //         showError("CSV QPCA Error:\n\n" + data.error);
// //         if (data.traceback) {
// //           logError('Traceback:', data.traceback);
// //         }
// //       } else if (data.success === false) {
// //         showError("CSV processing failed: " + (data.error || 'Unknown error'));
// //       } else {
// //         state.lastResults = data;
// //         displayResults(data);
// //         showParameterSummary();
// //       }
// //     })
// //     .catch(err => {
// //       logError('CSV upload failed:', err);
// //       state.isProcessing = false;
// //       hideLoading();
// //       showError("Upload failed: " + err.message);
// //     });
// //   }

// //   // ============================================================
// //   // DATASET/MANUAL QPCA PROCESSING
// //   // ============================================================
// //   function runQPCAAnalysis() {
// //     if (state.isProcessing) {
// //       log('⚠️ Already processing...');
// //       return;
// //     }

// //     log('🔮 Running QPCA analysis with parameters:', state.parameters);
// //     const mode = state.currentMode;
// //     let payload = {};

// //     try {
// //       if (mode === 'dataset') {
// //         // Dataset mode
// //         const dataset = $('#qpcaDataset').val();

// //         if (dataset === 'csv') {
// //           showError("Use 'Run CSV QPCA' button for CSV files");
// //           return;
// //         }

// //         payload = { 
// //           dataset,
// //           n_components: state.parameters.n_components,
// //           test_size: state.parameters.test_size,
// //           knn_neighbors: state.parameters.knn_neighbors,
// //           random_state: state.parameters.random_state
// //         };

// //       } else {
// //         // Manual mode
// //         const raw = $("#qpcaData").val().trim();
// //         if (!raw) {
// //           showError("Please enter data");
// //           return;
// //         }

// //         // Parse data
// //         const lines = raw.split("\n").filter(line => line.trim());
// //         const data = lines.map(line => {
// //           return line.split(/[,\s]+/).map(x => parseFloat(x.trim()));
// //         }).filter(row => row.length > 0 && row.every(x => !isNaN(x)));

// //         if (!data.length) {
// //           showError("Invalid data format. Use comma or space separated numbers.");
// //           return;
// //         }

// //         // Check consistency
// //         const rowLengths = data.map(r => r.length);
// //         const allSameLength = rowLengths.every(len => len === rowLengths[0]);
// //         if (!allSameLength) {
// //           showError("All rows must have the same number of values");
// //           return;
// //         }

// //         payload = { 
// //           data,
// //           n_components: state.parameters.n_components
// //         };
// //       }

// //       state.isProcessing = true;
// //       showLoading("Performing quantum analysis...");

// //       const url = `${BACKEND_BASE}/ComputeQPCA`;
// //       log('📤 Sending to', url, payload);

// //       $.ajax({
// //         type: "POST",
// //         url: url,
// //         data: JSON.stringify(payload),
// //         contentType: "application/json",
// //         dataType: "json",
// //         success: function(res) {
// //           log('✅ Backend response:', res);
// //           state.isProcessing = false;
// //           hideLoading();

// //           if (res.error) {
// //             showError(res.error);
// //             if (res.traceback) {
// //               logError('Traceback:', res.traceback);
// //             }
// //           } else if (res.success === false) {
// //             showError(res.error || 'Analysis failed');
// //           } else {
// //             state.lastResults = res;
// //             displayResults(res);
// //             showParameterSummary();
// //           }
// //         },
// //         error: function(xhr, status, error) {
// //           logError('Backend error:', xhr.status, error);
// //           state.isProcessing = false;
// //           hideLoading();
          
// //           let errorMsg = `Backend error (${xhr.status})`;
// //           if (xhr.responseText) {
// //             try {
// //               const errorData = JSON.parse(xhr.responseText);
// //               errorMsg += ': ' + (errorData.error || errorData.message || xhr.responseText);
// //             } catch(e) {
// //               errorMsg += ': ' + xhr.responseText;
// //             }
// //           } else {
// //             errorMsg += ': ' + error;
// //           }
// //           showError(errorMsg);
// //         }
// //       });

// //     } catch (err) {
// //       logError('Analysis error:', err);
// //       state.isProcessing = false;
// //       hideLoading();
// //       showError("Error: " + err.message);
// //     }
// //   }

// //   // ============================================================
// //   // PARAMETER SUMMARY DISPLAY
// //   // ============================================================
// //   function showParameterSummary() {
// //     const summaryHTML = `
// //       <div style="
// //         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //         color: white;
// //         padding: 15px;
// //         border-radius: 8px;
// //         margin-bottom: 15px;
// //         box-shadow: 0 2px 8px rgba(0,0,0,0.2);
// //       ">
// //         <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
// //           ⚙️ Analysis Parameters Used
// //         </h4>
// //         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 13px;">
// //           <div>
// //             <strong>Components:</strong> ${state.parameters.n_components}
// //           </div>
// //           <div>
// //             <strong>Test Size:</strong> ${(state.parameters.test_size * 100).toFixed(0)}%
// //           </div>
// //           <div>
// //             <strong>KNN Neighbors:</strong> ${state.parameters.knn_neighbors}
// //           </div>
// //           <div>
// //             <strong>Random Seed:</strong> ${state.parameters.random_state}
// //           </div>
// //         </div>
// //       </div>
// //     `;

// //     // Insert at top of metrics
// //     $('#qpcaMetrics').prepend(summaryHTML);
// //   }

// //   // ============================================================
// //   // RESULTS DISPLAY
// //   // ============================================================
// //   function displayResults(res) {
// //     log('👁️ Displaying QPCA results');
    
// //     // Show output section
// //     $('#qpcaOutput').show().css({ 
// //       display: 'block', 
// //       visibility: 'visible' 
// //     });

// //     // Display metrics
// //     displayQPCAMetrics(res);

// //     // Create plots after short delay
// //     setTimeout(() => {
// //       createQPCAPlots(res);
// //     }, 100);

// //     // Display QuTiP code
// //     if (res.qutip_code) {
// //       $("#qpcaCode").text(res.qutip_code);
// //     } else if (res.qutip) {
// //       $("#qpcaCode").text(res.qutip);
// //     }

// //     log('✅ Results displayed');
// //   }

// //   // ============================================================
// //   // ENHANCED METRICS DISPLAY WITH BEAUTIFUL TABLES
// //   // ============================================================
// //   function displayQPCAMetrics(res) {
// //     let html = '<div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">';
    
// //     // Main Title
// //     html += `
// //       <div style="text-align:center; margin-bottom:25px;">
// //         <h2 style="color:#00695c; margin:0; font-size:28px; font-weight:600;">
// //           ⚛️ Quantum PCA Analysis Results
// //         </h2>
// //         <p style="color:#666; margin:5px 0 0 0; font-size:14px;">
// //           Density Matrix Eigendecomposition & Statistical Evaluation
// //         </p>
// //       </div>
// //     `;

// //     // Dataset Information Card
// //     if (res.dataset_info) {
// //       html += renderDatasetInfo(res.dataset_info);
// //     }

// //     // Evaluation Metrics Card
// //     if (res.evaluation_metrics) {
// //       html += renderEvaluationMetrics(res.evaluation_metrics);
// //     }

// //     // Statistical Tests Card
// //     if (res.evaluation_metrics && res.evaluation_metrics.statistical_tests) {
// //       html += renderStatisticalTestsEnhanced(res.evaluation_metrics.statistical_tests);
// //     }

// //     // Confusion Matrices
// //     if (res.evaluation_metrics && res.evaluation_metrics.qpca_confusion_matrix) {
// //       html += renderConfusionMatrices(res.evaluation_metrics);
// //     }

// //     // Principal Components Table
// //     if (res.eigenvalues && res.eigenvalues.length > 0) {
// //       html += renderPrincipalComponents(res);
// //     }

// //     html += '</div>';
// //     $('#qpcaMetrics').html(html);
// //     log('✅ Metrics HTML updated');
// //   }

// //   // ============================================================
// //   // DATASET INFO CARD
// //   // ============================================================
// //   function renderDatasetInfo(info) {
// //     return `
// //       <div style="background:linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%); 
// //                   padding:20px; border-radius:12px; margin-bottom:20px;
// //                   box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
// //         <h3 style="color:#00695c; margin:0 0 15px 0; font-size:20px; font-weight:600;">
// //           📊 Dataset Information
// //         </h3>
// //         <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
// //           <div style="background:white; padding:15px; border-radius:8px;">
// //             <div style="color:#666; font-size:12px; margin-bottom:5px;">Dataset Name</div>
// //             <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.name || 'Custom'}</div>
// //           </div>
// //           <div style="background:white; padding:15px; border-radius:8px;">
// //             <div style="color:#666; font-size:12px; margin-bottom:5px;">Samples</div>
// //             <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.n_samples || 0}</div>
// //           </div>
// //           <div style="background:white; padding:15px; border-radius:8px;">
// //             <div style="color:#666; font-size:12px; margin-bottom:5px;">Features</div>
// //             <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.n_features || 0}</div>
// //           </div>
// //           ${info.n_classes ? `
// //           <div style="background:white; padding:15px; border-radius:8px;">
// //             <div style="color:#666; font-size:12px; margin-bottom:5px;">Classes</div>
// //             <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.n_classes}</div>
// //           </div>
// //           ` : ''}
// //         </div>
// //       </div>
// //     `;
// //   }

// //   // ============================================================
// //   // EVALUATION METRICS CARD
// //   // ============================================================
// //   function renderEvaluationMetrics(metrics) {
// //     let html = `
// //       <div style="background:linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); 
// //                   padding:20px; border-radius:12px; margin-bottom:20px;
// //                   box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
// //         <h3 style="color:#ef6c00; margin:0 0 15px 0; font-size:20px; font-weight:600;">
// //           ⚛️ Quantum Evaluation Metrics
// //         </h3>
// //         <table style="width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden;">
// //           <thead>
// //             <tr style="background:#ffcc80;">
// //               <th style="padding:12px; text-align:left; font-weight:600; color:#e65100;">Metric</th>
// //               <th style="padding:12px; text-align:right; font-weight:600; color:#e65100;">Value</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //     `;

// //     // Quantum Metrics
// //     if (metrics.density_matrix_purity !== undefined) {
// //       const purity = metrics.density_matrix_purity * 100;
// //       html += `
// //         <tr style="border-bottom:1px solid #f0f0f0;">
// //           <td style="padding:12px; font-weight:500;">Density Matrix Purity</td>
// //           <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#ef6c00; font-weight:bold;">
// //             ${purity.toFixed(2)}%
// //           </td>
// //         </tr>
// //       `;
// //     }

// //     if (metrics.information_retention !== undefined) {
// //       const retention = metrics.information_retention * 100;
// //       html += `
// //         <tr style="border-bottom:1px solid #f0f0f0;">
// //           <td style="padding:12px; font-weight:500;">Information Retention</td>
// //           <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#ef6c00; font-weight:bold;">
// //             ${retention.toFixed(2)}%
// //           </td>
// //         </tr>
// //       `;
// //     }

// //     // Classification Metrics
// //     if (metrics.qpca_classification_accuracy !== undefined) {
// //       const qpcaAcc = metrics.qpca_classification_accuracy * 100;
// //       html += `
// //         <tr style="border-bottom:1px solid #f0f0f0; background:#e8f5e9;">
// //           <td style="padding:12px; font-weight:500;">🔬 QPCA Classification Accuracy</td>
// //           <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#2e7d32; font-weight:bold;">
// //             ${qpcaAcc.toFixed(2)}%
// //           </td>
// //         </tr>
// //       `;
// //     }

// //     if (metrics.classical_pca_accuracy !== undefined) {
// //       const pcaAcc = metrics.classical_pca_accuracy * 100;
// //       html += `
// //         <tr style="border-bottom:1px solid #f0f0f0; background:#e3f2fd;">
// //           <td style="padding:12px; font-weight:500;">📊 Classical PCA Accuracy</td>
// //           <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#1565c0; font-weight:bold;">
// //             ${pcaAcc.toFixed(2)}%
// //           </td>
// //         </tr>
// //       `;
// //     }

// //     if (metrics.accuracy_difference !== undefined) {
// //       const diff = metrics.accuracy_difference * 100;
// //       const color = diff >= 0 ? '#2e7d32' : '#c62828';
// //       const bgColor = diff >= 0 ? '#c8e6c9' : '#ffcdd2';
// //       const icon = diff >= 0 ? '📈' : '📉';
// //       html += `
// //         <tr style="background:${bgColor};">
// //           <td style="padding:12px; font-weight:600;">${icon} Accuracy Difference (QPCA - PCA)</td>
// //           <td style="padding:12px; text-align:right; font-family:monospace; font-size:18px; color:${color}; font-weight:bold;">
// //             ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%
// //           </td>
// //         </tr>
// //       `;
// //     }

// //     html += `
// //           </tbody>
// //         </table>
// //       </div>
// //     `;

// //     return html;
// //   }

// //   // ============================================================
// //   // ENHANCED STATISTICAL TESTS DISPLAY
// //   // ============================================================
// //   function renderStatisticalTestsEnhanced(stats) {
// //     if (!stats) return '';

// //     let html = `
// //       <div style="background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); 
// //                   padding:20px; border-radius:12px; margin-bottom:20px;
// //                   box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
// //         <h3 style="color:#2e7d32; margin:0 0 15px 0; font-size:20px; font-weight:600;">
// //           📐 Statistical Hypothesis Tests
// //         </h3>
// //         <p style="color:#555; font-size:13px; margin:0 0 15px 0;">
// //           Testing feature significance and distribution characteristics
// //         </p>
// //     `;

// //     // Chi-Square Test Table
// //     if (stats.chi_square && stats.chi_square.chi_values) {
// //       html += renderStatTestTable(
// //         'Chi-Square Test (χ²)',
// //         'Tests independence between features and target classes',
// //         stats.chi_square.chi_values,
// //         stats.chi_square.p_values,
// //         'χ²',
// //         '#4caf50'
// //       );
// //     }

// //     // Z-Test Table
// //     if (stats.z_test && stats.z_test.z_scores) {
// //       html += renderStatTestTable(
// //         'Z-Test',
// //         'Tests if feature means differ significantly from zero',
// //         stats.z_test.z_scores,
// //         stats.z_test.p_values,
// //         'Z',
// //         '#2196f3'
// //       );
// //     }

// //     // T-Test Table
// //     if (stats.t_test && stats.t_test.t_scores) {
// //       html += renderStatTestTable(
// //         'T-Test (One-Sample)',
// //         'Tests if feature means are significantly different from zero',
// //         stats.t_test.t_scores,
// //         stats.t_test.p_values,
// //         'T',
// //         '#9c27b0'
// //       );
// //     }

// //     html += `
// //         <div style="background:white; padding:12px; border-radius:8px; margin-top:15px;">
// //           <p style="color:#666; font-size:12px; margin:0;">
// //             <strong>Note:</strong> p-values < 0.05 indicate statistically significant results (95% confidence level).
// //             Lower p-values suggest stronger evidence against the null hypothesis.
// //           </p>
// //         </div>
// //       </div>
// //     `;

// //     return html;
// //   }

// //   // ============================================================
// //   // STATISTICAL TEST TABLE RENDERER
// //   // ============================================================
// //   function renderStatTestTable(title, description, testValues, pValues, statLabel, color) {
// //     if (!testValues || !pValues) return '';

// //     let html = `
// //       <div style="background:white; padding:15px; border-radius:8px; margin-bottom:15px;">
// //         <h4 style="color:${color}; margin:0 0 5px 0; font-size:16px; font-weight:600;">
// //           ${title}
// //         </h4>
// //         <p style="color:#777; font-size:12px; margin:0 0 12px 0;">${description}</p>
        
// //         <table style="width:100%; border-collapse:collapse;">
// //           <thead>
// //             <tr style="background:${color}20;">
// //               <th style="padding:10px; text-align:left; border-bottom:2px solid ${color}; font-weight:600;">
// //                 Feature
// //               </th>
// //               <th style="padding:10px; text-align:right; border-bottom:2px solid ${color}; font-weight:600;">
// //                 ${statLabel} Statistic
// //               </th>
// //               <th style="padding:10px; text-align:right; border-bottom:2px solid ${color}; font-weight:600;">
// //                 p-value
// //               </th>
// //               <th style="padding:10px; text-align:center; border-bottom:2px solid ${color}; font-weight:600;">
// //                 Significance
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //     `;

// //     const n = testValues.length;
// //     for (let i = 0; i < n; i++) {
// //       const testVal = testValues[i];
// //       const pVal = pValues[i];
// //       const isSignificant = pVal < 0.05;
// //       const pValFormatted = pVal < 0.001 ? pVal.toExponential(2) : pVal.toFixed(4);
      
// //       html += `
// //         <tr style="border-bottom:1px solid #f0f0f0; ${isSignificant ? 'background:#fffde7;' : ''}">
// //           <td style="padding:10px; font-weight:500;">Feature ${i + 1}</td>
// //           <td style="padding:10px; text-align:right; font-family:monospace; color:${color};">
// //             ${testVal.toFixed(4)}
// //           </td>
// //           <td style="padding:10px; text-align:right; font-family:monospace; color:${isSignificant ? '#d84315' : '#666'}; font-weight:${isSignificant ? 'bold' : 'normal'};">
// //             ${pValFormatted}
// //           </td>
// //           <td style="padding:10px; text-align:center;">
// //             ${isSignificant 
// //               ? '<span style="color:#2e7d32; font-weight:bold;">✓ Yes (p < 0.05)</span>' 
// //               : '<span style="color:#666;">✗ No</span>'}
// //           </td>
// //         </tr>
// //       `;
// //     }

// //     html += `
// //           </tbody>
// //         </table>
// //       </div>
// //     `;

// //     return html;
// //   }

// //   // ============================================================
// //   // CONFUSION MATRICES DISPLAY
// //   // ============================================================
// //   function renderConfusionMatrices(metrics) {
// //     if (!metrics.qpca_confusion_matrix || !metrics.pca_confusion_matrix) return '';

// //     return `
// //       <div style="background:linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); 
// //                   padding:20px; border-radius:12px; margin-bottom:20px;
// //                   box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
// //         <h3 style="color:#6a1b9a; margin:0 0 15px 0; font-size:20px; font-weight:600;">
// //           🎯 Confusion Matrices
// //         </h3>
// //         <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
// //           ${renderSingleConfusionMatrix('QPCA', metrics.qpca_confusion_matrix, '#4caf50')}
// //           ${renderSingleConfusionMatrix('Classical PCA', metrics.pca_confusion_matrix, '#2196f3')}
// //         </div>
// //       </div>
// //     `;
// //   }

// //   function renderSingleConfusionMatrix(title, matrix, color) {
// //     if (!matrix || matrix.length === 0) return '';

// //     let html = `
// //       <div style="background:white; padding:15px; border-radius:8px;">
// //         <h4 style="color:${color}; margin:0 0 10px 0; font-size:16px; font-weight:600;">${title}</h4>
// //         <table style="width:100%; border-collapse:collapse;">
// //           <thead>
// //             <tr>
// //               <th style="padding:8px; text-align:center; background:${color}20; border:1px solid ${color}40;"></th>
// //     `;

// //     // Column headers
// //     for (let i = 0; i < matrix[0].length; i++) {
// //       html += `<th style="padding:8px; text-align:center; background:${color}20; border:1px solid ${color}40; font-weight:600;">Pred ${i}</th>`;
// //     }
// //     html += `</tr></thead><tbody>`;

// //     // Matrix rows
// //     for (let i = 0; i < matrix.length; i++) {
// //       html += `<tr>`;
// //       html += `<th style="padding:8px; text-align:center; background:${color}20; border:1px solid ${color}40; font-weight:600;">True ${i}</th>`;
      
// //       for (let j = 0; j < matrix[i].length; j++) {
// //         const val = matrix[i][j];
// //         const isCorrect = i === j;
// //         const bgColor = isCorrect ? (color === '#4caf50' ? '#c8e6c9' : '#bbdefb') : 'white';
        
// //         html += `
// //           <td style="padding:8px; text-align:center; border:1px solid ${color}40; 
// //                      background:${bgColor}; font-weight:${isCorrect ? 'bold' : 'normal'}; 
// //                      font-family:monospace; font-size:14px;">
// //             ${val}
// //           </td>
// //         `;
// //       }
// //       html += `</tr>`;
// //     }

// //     html += `</tbody></table></div>`;
// //     return html;
// //   }

// //   // ============================================================
// //   // PRINCIPAL COMPONENTS TABLE
// //   // ============================================================
// //   function renderPrincipalComponents(res) {
// //     return `
// //       <div style="background:linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); 
// //                   padding:20px; border-radius:12px; margin-bottom:20px;
// //                   box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
// //         <h3 style="color:#1565c0; margin:0 0 15px 0; font-size:20px; font-weight:600;">
// //           🔢 Principal Components Analysis
// //         </h3>
// //         <div style="overflow-x:auto;">
// //           <table style="width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden;">
// //             <thead>
// //               <tr style="background:#90caf9;">
// //                 <th style="padding:12px; text-align:left; font-weight:600; color:#0d47a1;">Component</th>
// //                 <th style="padding:12px; text-align:right; font-weight:600; color:#0d47a1;">Eigenvalue</th>
// //                 ${res.explained_variance_ratio ? '<th style="padding:12px; text-align:right; font-weight:600; color:#0d47a1;">Variance Explained</th>' : ''}
// //                 ${res.cumulative_variance ? '<th style="padding:12px; text-align:right; font-weight:600; color:#0d47a1;">Cumulative Variance</th>' : ''}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               ${renderPCRows(res)}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     `;
// //   }

// //   function renderPCRows(res) {
// //     let html = '';
// //     const maxComponents = Math.min(10, res.eigenvalues.length);
    
// //     for (let i = 0; i < maxComponents; i++) {
// //       const bgColor = i % 2 === 0 ? 'white' : '#e3f2fd';
// //       html += `
// //         <tr style="background:${bgColor}; border-bottom:1px solid #bbdefb;">
// //           <td style="padding:12px; font-weight:600; color:#1565c0;">PC${i+1}</td>
// //           <td style="padding:12px; text-align:right; font-family:monospace; font-size:14px;">
// //             ${res.eigenvalues[i].toFixed(6)}
// //           </td>
// //       `;
      
// //       if (res.explained_variance_ratio && res.explained_variance_ratio[i] !== undefined) {
// //         const varPercent = res.explained_variance_ratio[i] * 100;
// //         html += `
// //           <td style="padding:12px; text-align:right;">
// //             <div style="display:flex; align-items:center; justify-content:flex-end; gap:8px;">
// //               <div style="flex:1; max-width:150px; height:8px; background:#e0e0e0; border-radius:4px; overflow:hidden;">
// //                 <div style="height:100%; background:#1976d2; width:${varPercent}%;"></div>
// //               </div>
// //               <span style="font-family:monospace; font-weight:600; color:#1565c0;">${varPercent.toFixed(2)}%</span>
// //             </div>
// //           </td>
// //         `;
// //       }
      
// //       if (res.cumulative_variance && res.cumulative_variance[i] !== undefined) {
// //         const cumPercent = res.cumulative_variance[i] * 100;
// //         html += `
// //           <td style="padding:12px; text-align:right; font-family:monospace; font-weight:600; color:#2e7d32;">
// //             ${cumPercent.toFixed(2)}%
// //           </td>
// //         `;
// //       }
      
// //       html += `</tr>`;
// //     }

// //     return html;
// //   }

// //   // ============================================================
// //   // PLOTLY VISUALIZATIONS
// //   // ============================================================
// //   function createQPCAPlots(res) {
// //     log('📊 Creating QPCA plots');

// //     // Plot 1: Eigenvalue Spectrum
// //     if (res.eigenvalues && document.getElementById("qpcaEigenPlot")) {
// //       try {
// //         const trace = {
// //           x: res.eigenvalues.map((_, i) => `PC${i + 1}`),
// //           y: res.eigenvalues,
// //           type: "bar",
// //           marker: { 
// //             color: "#00897b",
// //             line: { color: "#004d40", width: 1 }
// //           }
// //         };
        
// //         const layout = {
// //           title: "Eigenvalue Spectrum",
// //           xaxis: { title: "Principal Component" },
// //           yaxis: { title: "Eigenvalue" },
// //           plot_bgcolor: "#f5f5f5",
// //           paper_bgcolor: "white"
// //         };

// //         Plotly.newPlot("qpcaEigenPlot", [trace], layout);
// //         log('✅ Eigenvalue plot created');
// //       } catch(e) {
// //         logError('Failed to create eigenvalue plot:', e);
// //       }
// //     }

// //     // Plot 2: Explained Variance
// //     if (res.explained_variance_ratio && document.getElementById("qpcaScreePlot")) {
// //       try {
// //         const traces = [{
// //           x: res.eigenvalues.map((_, i) => i + 1),
// //           y: res.explained_variance_ratio.map(v => v * 100),
// //           mode: "lines+markers",
// //           name: "Individual Variance",
// //           line: { color: "#1976d2", width: 2 },
// //           marker: { size: 8 }
// //         }];

// //         if (res.cumulative_variance && res.cumulative_variance.length) {
// //           traces.push({
// //             x: res.eigenvalues.map((_, i) => i + 1),
// //             y: res.cumulative_variance.map(v => v * 100),
// //             mode: "lines+markers",
// //             name: "Cumulative Variance",
// //             line: { color: "#d32f2f", width: 2, dash: "dash" },
// //             marker: { size: 8 }
// //           });
// //         }

// //         const layout = {
// //           title: "Explained Variance",
// //           xaxis: { title: "Principal Component" },
// //           yaxis: { title: "Variance (%)", range: [0, 105] },
// //           plot_bgcolor: "#f5f5f5",
// //           paper_bgcolor: "white",
// //           showlegend: true
// //         };

// //         Plotly.newPlot("qpcaScreePlot", traces, layout);
// //         log('✅ Variance plot created');
// //       } catch(e) {
// //         logError('Failed to create variance plot:', e);
// //       }
// //     }

// //     // Plot 3: Density Matrix Heatmap
// //     if (res.density_matrix && document.getElementById("qpcaDensityPlot")) {
// //       try {
// //         const absMatrix = res.density_matrix.map(row => 
// //           row.map(val => Math.abs(val))
// //         );

// //         const trace = {
// //           z: absMatrix,
// //           type: "heatmap",
// //           colorscale: "Viridis",
// //           colorbar: { title: "Magnitude" }
// //         };

// //         const layout = {
// //           title: "Density Matrix (Magnitude)",
// //           xaxis: { title: "Feature Index" },
// //           yaxis: { title: "Feature Index" },
// //           paper_bgcolor: "white"
// //         };

// //         Plotly.newPlot("qpcaDensityPlot", [trace], layout);
// //         log('✅ Density matrix plot created');
// //       } catch(e) {
// //         logError('Failed to create density matrix plot:', e);
// //       }
// //     }

// //     // Plot 4: Classification Accuracy Comparison
// //     if (res.evaluation_metrics && document.getElementById("qpcaAccuracyPlot")) {
// //       const m = res.evaluation_metrics;
      
// //       if (m.qpca_classification_accuracy !== undefined && 
// //           m.classical_pca_accuracy !== undefined) {
// //         try {
// //           const qpcaAcc = m.qpca_classification_accuracy * 100;
// //           const pcaAcc = m.classical_pca_accuracy * 100;

// //           const trace = {
// //             x: ['QPCA', 'Classical PCA'],
// //             y: [qpcaAcc, pcaAcc],
// //             type: "bar",
// //             marker: { 
// //               color: ['#4caf50', '#2196f3'],
// //               line: { color: ['#2e7d32', '#1565c0'], width: 2 }
// //             },
// //             text: [
// //               qpcaAcc.toFixed(2) + '%',
// //               pcaAcc.toFixed(2) + '%'
// //             ],
// //             textposition: "outside",
// //             textfont: { size: 14, weight: 'bold' }
// //           };

// //           const layout = {
// //             title: "Classification Accuracy (KNN, k=5)",
// //             yaxis: { 
// //               title: "Accuracy (%)", 
// //               range: [0, Math.max(qpcaAcc, pcaAcc) + 10] 
// //             },
// //             plot_bgcolor: "#f5f5f5",
// //             paper_bgcolor: "white"
// //           };

// //           Plotly.newPlot("qpcaAccuracyPlot", [trace], layout);
// //           log('✅ Accuracy comparison plot created');
// //         } catch(e) {
// //           logError('Failed to create accuracy plot:', e);
// //         }
// //       }
// //     }

// //     log('✅ All plots completed');
// //   }

// //   // ============================================================
// //   // TOOLBOX INTEGRATION
// //   // ============================================================
// //   function addQPCAToToolbox() {
// //     try {
// //       if ($("#toolboxDivSingle .qpcaToolboxButton").length) {
// //         log('⚠️ QPCA button already exists in toolbox');
// //         return;
// //       }

// //       const qpcaButton = $("<div>")
// //         .addClass("gateButton qpcaToolboxButton")
// //         .css({
// //           width: "45px",
// //           height: "45px",
// //           border: "2px solid #00897b",
// //           backgroundColor: "#b2dfdb",
// //           borderRadius: "8px",
// //           margin: "8px auto",
// //           textAlign: "center",
// //           lineHeight: "42px",
// //           fontWeight: "bold",
// //           cursor: "pointer",
// //           transition: "all 0.2s ease"
// //         })
// //         .text("QPCA")
// //         .attr("title", "Quantum Principal Component Analysis")
// //         .hover(
// //           function() {
// //             $(this).css({ 
// //               backgroundColor: "#80cbc4",
// //               transform: "scale(1.05)"
// //             });
// //           },
// //           function() {
// //             $(this).css({ 
// //               backgroundColor: "#b2dfdb",
// //               transform: "scale(1)"
// //             });
// //           }
// //         )
// //         .click(function() {
// //           log('QPCA button clicked');
// //           if (typeof openCity === 'function') {
// //             try {
// //               openCity({ currentTarget: this }, 'qpcaPanel');
// //             } catch (e) {
// //               log('openCity failed, using fallback');
// //               $('#qpcaPanel').show();
// //             }
// //           } else {
// //             $('#qpcaPanel').show();
// //           }
// //         });

// //       $("#toolboxDivSingle").append(qpcaButton);
// //       log('✅ QPCA button added to toolbox');
// //     } catch (e) {
// //       logError('Failed to add QPCA button to toolbox:', e);
// //     }
// //   }

// //   // ============================================================
// //   // UI HELPERS
// //   // ============================================================
// //   function showLoading(message) {
// //     let $loading = $('#qpcaLoading');
// //     if (!$loading.length) {
// //       $loading = $('<div id="qpcaLoading">')
// //         .css({
// //           position: 'fixed',
// //           top: 0,
// //           left: 0,
// //           width: '100%',
// //           height: '100%',
// //           backgroundColor: 'rgba(0,0,0,0.5)',
// //           display: 'flex',
// //           alignItems: 'center',
// //           justifyContent: 'center',
// //           zIndex: 10000
// //         })
// //         .html(`
// //           <div style="
// //             background: white;
// //             padding: 30px;
// //             border-radius: 10px;
// //             text-align: center;
// //             box-shadow: 0 4px 20px rgba(0,0,0,0.3);
// //           ">
// //             <div class="spinner" style="
// //               border: 4px solid #f3f3f3;
// //               border-top: 4px solid #00897b;
// //               border-radius: 50%;
// //               width: 40px;
// //               height: 40px;
// //               animation: spin 1s linear infinite;
// //               margin: 0 auto 15px;
// //             "></div>
// //             <p id="qpcaLoadingMessage" style="
// //               margin: 0;
// //               color: #333;
// //               font-size: 16px;
// //             ">${message}</p>
// //           </div>
// //         `)
// //         .appendTo('body');

// //       if (!$('#qpcaLoadingStyle').length) {
// //         $('<style id="qpcaLoadingStyle">')
// //           .text('@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }')
// //           .appendTo('head');
// //       }
// //     } else {
// //       $('#qpcaLoadingMessage').text(message);
// //     }
// //     $loading.show();
// //   }

// //   function hideLoading() {
// //     $('#qpcaLoading').hide();
// //   }

// //   function showError(message) {
// //     alert('❌ ' + message);
// //     logError(message);
// //   }

// //   // ============================================================
// //   // EXPORT FUNCTIONS FOR EXTERNAL USE
// //   // ============================================================
// //   window.QPCA = {
// //     init: initQPCA,
// //     runAnalysis: runQPCAAnalysis,
// //     runCSV: runCsvQPCA,
// //     displayResults: displayResults,
// //     state: state
// //   };

// //   log('✅ QPCA Frontend Module Loaded - Interactive Parameters Edition');

// // })();

// (function() {
//   'use strict';

//   // ============================================================
//   // CONFIGURATION
//   // ============================================================
//   const BACKEND_BASE = window.location.origin;
//   const DEBUG = true;

//   function log(...args) {
//     if (DEBUG) console.log('[QPCA]', ...args);
//   }

//   function logError(...args) {
//     console.error('[QPCA ERROR]', ...args);
//   }

//   // ============================================================
//   // STATE MANAGEMENT
//   // ============================================================
//   const state = {
//     currentMode: 'dataset',
//     selectedDataset: 'iris',
//     hasCSVFile: false,
//     isProcessing: false,
//     parameters: {
//       n_components: 2,
//       test_size: 0.3,
//       knn_neighbors: 5,
//       random_state: 42
//     },
//     lastResults: null
//   };

//   // ============================================================
//   // INITIALIZATION
//   // ============================================================
//   $(document).ready(function() {
//     log('Frontend initializing...');
//     initQPCA();
//   });

//   function initQPCA() {
//     log('🔬 Initializing QPCA Interface');

//     // Setup event handlers
//     setupModeSwitch();
//     setupDatasetSelection();
//     setupFileUpload();
//     setupRunButtons();
//     setupParameterControls();
//     updateUI();

//     // Add to toolbox after delay
//     setTimeout(() => {
//       if ($("#toolboxDivSingle").length) {
//         addQPCAToToolbox();
//       }
//     }, 800);

//     log('✅ QPCA Interface ready');
//   }

//   // ============================================================
//   // PARAMETER CONTROLS SETUP
//   // ============================================================
//   function setupParameterControls() {
//     // Create parameter panel if it doesn't exist
//     if ($('#qpcaParameterPanel').length === 0) {
//       createParameterPanel();
//     }

//     // N Components Slider
//     $('#nComponentsSlider').off('input').on('input', function() {
//       const val = parseInt($(this).val());
//       state.parameters.n_components = val;
//       $('#nComponentsValue').text(val);
//       $('#nComponents').val(val);
//       log('N Components changed to:', val);
//     });

//     // Test Size Slider
//     $('#testSizeSlider').off('input').on('input', function() {
//       const val = parseFloat($(this).val());
//       state.parameters.test_size = val;
//       $('#testSizeValue').text((val * 100).toFixed(0) + '%');
//       log('Test size changed to:', val);
//     });

//     // KNN Neighbors Slider
//     $('#knnNeighborsSlider').off('input').on('input', function() {
//       const val = parseInt($(this).val());
//       state.parameters.knn_neighbors = val;
//       $('#knnNeighborsValue').text(val);
//       log('KNN neighbors changed to:', val);
//     });

//     // Random State Input
//     $('#randomStateInput').off('input').on('input', function() {
//       const val = parseInt($(this).val()) || 42;
//       state.parameters.random_state = val;
//       log('Random state changed to:', val);
//     });

//     // Auto-recompute toggle
//     $('#autoRecompute').off('change').on('change', function() {
//       const isEnabled = $(this).is(':checked');
//       log('Auto-recompute:', isEnabled ? 'enabled' : 'disabled');
      
//       if (isEnabled && state.lastResults) {
//         log('Auto-recompute triggered');
//         setTimeout(() => runQPCAAnalysis(), 500);
//       }
//     });

//     // Real-time parameter updates with auto-recompute
//     $('.parameter-slider').off('change').on('change', function() {
//       if ($('#autoRecompute').is(':checked') && state.lastResults) {
//         log('Parameter changed, auto-recomputing...');
//         setTimeout(() => runQPCAAnalysis(), 300);
//       }
//     });
//   }

//   // ============================================================
//   // CREATE PARAMETER PANEL
//   // ============================================================
//   function createParameterPanel() {
//     const panelHTML = `
//       <div id="qpcaParameterPanel" style="
//         background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//         border-radius: 12px;
//         padding: 20px;
//         margin-bottom: 20px;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//       ">
//         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
//           <h3 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 600;">
//             🎛️ Interactive Parameters
//           </h3>
//           <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
//             <input type="checkbox" id="autoRecompute" style="cursor: pointer;">
//             <span style="color: #34495e; font-size: 14px; font-weight: 500;">Auto-recompute</span>
//           </label>
//         </div>

//         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
          
//           <!-- N Components -->
//           <div class="parameter-control" style="
//             background: white;
//             padding: 15px;
//             border-radius: 8px;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           ">
//             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
//               <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">
//                 📊 Components
//               </label>
//               <span id="nComponentsValue" style="
//                 background: #3498db;
//                 color: white;
//                 padding: 4px 12px;
//                 border-radius: 12px;
//                 font-weight: bold;
//                 font-size: 14px;
//               ">2</span>
//             </div>
//             <input 
//               type="range" 
//               id="nComponentsSlider" 
//               class="parameter-slider"
//               min="1" 
//               max="10" 
//               value="2" 
//               step="1"
//               style="width: 100%; cursor: pointer;"
//             >
//             <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
//               <span>1</span>
//               <span>10</span>
//             </div>
//           </div>

//           <!-- Test Size -->
//           <div class="parameter-control" style="
//             background: white;
//             padding: 15px;
//             border-radius: 8px;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           ">
//             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
//               <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">
//                 🎯 Test Size
//               </label>
//               <span id="testSizeValue" style="
//                 background: #e74c3c;
//                 color: white;
//                 padding: 4px 12px;
//                 border-radius: 12px;
//                 font-weight: bold;
//                 font-size: 14px;
//               ">30%</span>
//             </div>
//             <input 
//               type="range" 
//               id="testSizeSlider" 
//               class="parameter-slider"
//               min="0.1" 
//               max="0.5" 
//               value="0.3" 
//               step="0.05"
//               style="width: 100%; cursor: pointer;"
//             >
//             <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
//               <span>10%</span>
//               <span>50%</span>
//             </div>
//           </div>

//           <!-- KNN Neighbors -->
//           <div class="parameter-control" style="
//             background: white;
//             padding: 15px;
//             border-radius: 8px;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           ">
//             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
//               <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">
//                 👥 KNN Neighbors
//               </label>
//               <span id="knnNeighborsValue" style="
//                 background: #2ecc71;
//                 color: white;
//                 padding: 4px 12px;
//                 border-radius: 12px;
//                 font-weight: bold;
//                 font-size: 14px;
//               ">5</span>
//             </div>
//             <input 
//               type="range" 
//               id="knnNeighborsSlider" 
//               class="parameter-slider"
//               min="1" 
//               max="15" 
//               value="5" 
//               step="1"
//               style="width: 100%; cursor: pointer;"
//             >
//             <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
//               <span>1</span>
//               <span>15</span>
//             </div>
//           </div>

//           <!-- Random State -->
//           <div class="parameter-control" style="
//             background: white;
//             padding: 15px;
//             border-radius: 8px;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           ">
//             <div style="margin-bottom: 10px;">
//               <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">
//                 🎲 Random Seed
//               </label>
//             </div>
//             <input 
//               type="number" 
//               id="randomStateInput" 
//               value="42"
//               min="0"
//               max="9999"
//               style="
//                 width: 100%;
//                 padding: 8px 12px;
//                 border: 2px solid #bdc3c7;
//                 border-radius: 6px;
//                 font-size: 14px;
//                 font-weight: 500;
//                 text-align: center;
//               "
//             >
//             <div style="font-size: 11px; color: #7f8c8d; margin-top: 5px; text-align: center;">
//               For reproducibility
//             </div>
//           </div>

//         </div>

//         <!-- Parameter Info Banner -->
//         <div style="
//           background: #fff9e6;
//           border-left: 4px solid #f39c12;
//           padding: 12px;
//           margin-top: 15px;
//           border-radius: 4px;
//         ">
//           <p style="margin: 0; color: #7d6608; font-size: 13px;">
//             <strong>💡 Tip:</strong> Enable <strong>Auto-recompute</strong> to see results update in real-time as you adjust parameters!
//           </p>
//         </div>
//       </div>
//     `;

//     // Insert at top of QPCA panel
//     if ($('#qpcaPanel h3').first().length) {
//       $(panelHTML).insertAfter($('#qpcaPanel h3').first());
//     }

//     log('✅ Parameter panel created');
//   }

//   // ============================================================
//   // EVENT HANDLERS SETUP
//   // ============================================================
//   function setupModeSwitch() {
//     $('input[name="qpcaMode"]').off('change').on('change', function() {
//       state.currentMode = $(this).val();
//       log('Mode switched to:', state.currentMode);
//       updateUI();
//     });
//   }

//   function setupDatasetSelection() {
//     $('#qpcaDataset').off('change').on('change', function() {
//       state.selectedDataset = $(this).val();
//       log('Dataset selected:', state.selectedDataset);
      
//       // Update max components based on dataset
//       updateMaxComponents();
//       updateUI();
//     });
//   }

//   function updateMaxComponents() {
//     const maxComponents = {
//       'iris': 4,
//       'wine': 13,
//       'breast_cancer': 30,
//       'csv': 10
//     };
    
//     const max = maxComponents[state.selectedDataset] || 10;
//     $('#nComponentsSlider').attr('max', max);
    
//     // Adjust current value if it exceeds max
//     if (state.parameters.n_components > max) {
//       state.parameters.n_components = Math.min(max, 2);
//       $('#nComponentsSlider').val(state.parameters.n_components);
//       $('#nComponentsValue').text(state.parameters.n_components);
//     }
    
//     // Update max label
//     $('#nComponentsSlider').siblings('div').find('span:last').text(max);
//   }

//   function setupFileUpload() {
//     $("#qpcaCsvFile").off('change').on('change', function() {
//       state.hasCSVFile = this.files && this.files.length > 0;
//       if (state.hasCSVFile) {
//         log('📄 CSV file selected:', this.files[0].name);
//       }
//       updateUI();
//     });
//   }

//   function setupRunButtons() {
//     $("#runQPCA").off('click').on('click', function(e) {
//       e.preventDefault();
//       e.stopPropagation();
//       runQPCAAnalysis();
//     });

//     $("#runCsvQPCA").off('click').on('click', function(e) {
//       e.preventDefault();
//       e.stopPropagation();
//       runCsvQPCA();
//     });
//   }

//   // ============================================================
//   // UI UPDATE
//   // ============================================================
//   function updateUI() {
//     // Mode visibility
//     if (state.currentMode === 'dataset') {
//       $('#datasetSection').show();
//       $('#manualSection').hide();
//     } else {
//       $('#datasetSection').hide();
//       $('#manualSection').show();
//     }

//     // Dataset-specific UI
//     if (state.selectedDataset === 'csv') {
//       $('#runQPCA').hide();
//       $('#csvUploadSection').show();
//       $('#runCsvQPCA').toggle(state.hasCSVFile);
//     } else {
//       $('#runQPCA').show();
//       $('#csvUploadSection').hide();
//     }

//     log('UI updated');
//   }

//   // ============================================================
//   // CSV QPCA PROCESSING
//   // ============================================================
//   function runCsvQPCA() {
//     if (state.isProcessing) {
//       log('⚠️ Already processing...');
//       return;
//     }

//     const fileInput = document.getElementById("qpcaCsvFile");
//     if (!fileInput || !fileInput.files.length) {
//       showError("Please select a CSV file");
//       return;
//     }

//     state.isProcessing = true;
//     showLoading("Processing CSV file...");

//     const formData = new FormData();
//     formData.append("file", fileInput.files[0]);
//     formData.append("n_components", state.parameters.n_components);
//     formData.append("test_size", state.parameters.test_size);
//     formData.append("knn_neighbors", state.parameters.knn_neighbors);
//     formData.append("random_state", state.parameters.random_state);
    
//     const url = `${BACKEND_BASE}/ComputeQPCAFromCSV`;

//     log('📤 Uploading CSV to', url, 'with parameters:', state.parameters);

//     fetch(url, { 
//       method: "POST", 
//       body: formData 
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
//       return response.json();
//     })
//     .then(data => {
//       log('📥 CSV result received:', data);
//       state.isProcessing = false;
//       hideLoading();

//       if (data.error) {
//         showError("CSV QPCA Error:\n\n" + data.error);
//         if (data.traceback) {
//           logError('Traceback:', data.traceback);
//         }
//       } else if (data.success === false) {
//         showError("CSV processing failed: " + (data.error || 'Unknown error'));
//       } else {
//         state.lastResults = data;
//         displayResults(data);
//         showParameterSummary();
//       }
//     })
//     .catch(err => {
//       logError('CSV upload failed:', err);
//       state.isProcessing = false;
//       hideLoading();
//       showError("Upload failed: " + err.message);
//     });
//   }

//   // ============================================================
//   // DATASET/MANUAL QPCA PROCESSING
//   // ============================================================
//   function runQPCAAnalysis() {
//     if (state.isProcessing) {
//       log('⚠️ Already processing...');
//       return;
//     }

//     log('🔮 Running QPCA analysis with parameters:', state.parameters);
//     const mode = state.currentMode;
//     let payload = {};

//     try {
//       if (mode === 'dataset') {
//         // Dataset mode
//         const dataset = $('#qpcaDataset').val();

//         if (dataset === 'csv') {
//           showError("Use 'Run CSV QPCA' button for CSV files");
//           return;
//         }

//         payload = { 
//           dataset,
//           n_components: state.parameters.n_components,
//           test_size: state.parameters.test_size,
//           knn_neighbors: state.parameters.knn_neighbors,
//           random_state: state.parameters.random_state
//         };

//       } else {
//         // Manual mode
//         const raw = $("#qpcaData").val().trim();
//         if (!raw) {
//           showError("Please enter data");
//           return;
//         }

//         // Parse data
//         const lines = raw.split("\n").filter(line => line.trim());
//         const data = lines.map(line => {
//           return line.split(/[,\s]+/).map(x => parseFloat(x.trim()));
//         }).filter(row => row.length > 0 && row.every(x => !isNaN(x)));

//         if (!data.length) {
//           showError("Invalid data format. Use comma or space separated numbers.");
//           return;
//         }

//         // Check consistency
//         const rowLengths = data.map(r => r.length);
//         const allSameLength = rowLengths.every(len => len === rowLengths[0]);
//         if (!allSameLength) {
//           showError("All rows must have the same number of values");
//           return;
//         }

//         payload = { 
//           data,
//           n_components: state.parameters.n_components
//         };
//       }

//       state.isProcessing = true;
//       showLoading("Performing quantum analysis...");

//       const url = `${BACKEND_BASE}/ComputeQPCA`;
//       log('📤 Sending to', url, payload);

//       $.ajax({
//         type: "POST",
//         url: url,
//         data: JSON.stringify(payload),
//         contentType: "application/json",
//         dataType: "json",
//         success: function(res) {
//           log('✅ Backend response:', res);
//           state.isProcessing = false;
//           hideLoading();

//           if (res.error) {
//             showError(res.error);
//             if (res.traceback) {
//               logError('Traceback:', res.traceback);
//             }
//           } else if (res.success === false) {
//             showError(res.error || 'Analysis failed');
//           } else {
//             state.lastResults = res;
//             displayResults(res);
//             showParameterSummary();
//           }
//         },
//         error: function(xhr, status, error) {
//           logError('Backend error:', xhr.status, error);
//           state.isProcessing = false;
//           hideLoading();
          
//           let errorMsg = `Backend error (${xhr.status})`;
//           if (xhr.responseText) {
//             try {
//               const errorData = JSON.parse(xhr.responseText);
//               errorMsg += ': ' + (errorData.error || errorData.message || xhr.responseText);
//             } catch(e) {
//               errorMsg += ': ' + xhr.responseText;
//             }
//           } else {
//             errorMsg += ': ' + error;
//           }
//           showError(errorMsg);
//         }
//       });

//     } catch (err) {
//       logError('Analysis error:', err);
//       state.isProcessing = false;
//       hideLoading();
//       showError("Error: " + err.message);
//     }
//   }

//   // ============================================================
//   // PARAMETER SUMMARY DISPLAY
//   // ============================================================
//   function showParameterSummary() {
//     const summaryHTML = `
//       <div style="
//         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//         color: white;
//         padding: 15px;
//         border-radius: 8px;
//         margin-bottom: 15px;
//         box-shadow: 0 2px 8px rgba(0,0,0,0.2);
//       ">
//         <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
//           ⚙️ Analysis Parameters Used
//         </h4>
//         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 13px;">
//           <div>
//             <strong>Components:</strong> ${state.parameters.n_components}
//           </div>
//           <div>
//             <strong>Test Size:</strong> ${(state.parameters.test_size * 100).toFixed(0)}%
//           </div>
//           <div>
//             <strong>KNN Neighbors:</strong> ${state.parameters.knn_neighbors}
//           </div>
//           <div>
//             <strong>Random Seed:</strong> ${state.parameters.random_state}
//           </div>
//         </div>
//       </div>
//     `;

//     // Insert at top of metrics
//     $('#qpcaMetrics').prepend(summaryHTML);
//   }

//   // ============================================================
//   // RESULTS DISPLAY - FIXED FOR MANUAL INPUT
//   // ============================================================
//   function displayResults(res) {
//     log('👁️ Displaying QPCA results');
    
//     // Show output section
//     $('#qpcaOutput').show().css({ 
//       display: 'block', 
//       visibility: 'visible' 
//     });

//     // Display metrics
//     displayQPCAMetrics(res);

//     // Create plots after short delay
//     setTimeout(() => {
//       createQPCAPlots(res);
//     }, 100);

//     // Display QuTiP code
//     if (res.qutip_code) {
//       $("#qutipCode").text(res.qutip_code);
//     } else if (res.qutip) {
//       $("#qutipCode").text(res.qutip);
//     }

//     log('✅ Results displayed');
//   }

//   // ============================================================
//   // METRICS DISPLAY - HANDLES MANUAL INPUT WITHOUT CLASSIFICATION
//   // ============================================================
//   function displayQPCAMetrics(res) {
//     let html = '<div style="padding: 20px;">';
    
//     // Main Title
//     html += `
//       <div style="text-align:center; margin-bottom:25px;">
//         <h2 style="color:#00695c; margin:0; font-size:28px; font-weight:600;">
//           ⚛️ Quantum PCA Analysis Results
//         </h2>
//         <p style="color:#666; margin:5px 0 0 0; font-size:14px;">
//           Density Matrix Eigendecomposition & Statistical Evaluation
//         </p>
//       </div>
//     `;

//     // Dataset Information Card
//     if (res.dataset_info) {
//       html += renderDatasetInfo(res.dataset_info);
//     }

//     // Evaluation Metrics Card - ONLY IF AVAILABLE
//     if (res.evaluation_metrics) {
//       html += renderEvaluationMetrics(res.evaluation_metrics);
//     }

//     // Principal Components Table
//     if (res.eigenvalues && res.eigenvalues.length > 0) {
//       html += renderPrincipalComponents(res);
//     }

//     html += '</div>';
//     $('#qpcaMetrics').html(html);
//     log('✅ Metrics HTML updated');
//   }

//   // Dataset info card (unchanged)
//   function renderDatasetInfo(info) {
//     return `
//       <div style="background:linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%); 
//                   padding:20px; border-radius:12px; margin-bottom:20px;
//                   box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
//         <h3 style="color:#00695c; margin:0 0 15px 0; font-size:20px; font-weight:600;">
//           📊 Dataset Information
//         </h3>
//         <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
//           <div style="background:white; padding:15px; border-radius:8px;">
//             <div style="color:#666; font-size:12px; margin-bottom:5px;">Dataset</div>
//             <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.name || 'Custom'}</div>
//           </div>
//           <div style="background:white; padding:15px; border-radius:8px;">
//             <div style="color:#666; font-size:12px; margin-bottom:5px;">Samples</div>
//             <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.n_samples || 0}</div>
//           </div>
//           <div style="background:white; padding:15px; border-radius:8px;">
//             <div style="color:#666; font-size:12px; margin-bottom:5px;">Features</div>
//             <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.n_features || 0}</div>
//           </div>
//           ${info.n_classes ? `
//           <div style="background:white; padding:15px; border-radius:8px;">
//             <div style="color:#666; font-size:12px; margin-bottom:5px;">Classes</div>
//             <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.n_classes}</div>
//           </div>
//           ` : ''}
//         </div>
//       </div>
//     `;
//   }

//   // FIXED: Evaluation metrics - check if classification exists
//   function renderEvaluationMetrics(metrics) {
//     let html = `
//       <div style="background:linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); 
//                   padding:20px; border-radius:12px; margin-bottom:20px;
//                   box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
//         <h3 style="color:#ef6c00; margin:0 0 15px 0; font-size:20px; font-weight:600;">
//           ⚛️ Quantum Evaluation Metrics
//         </h3>
//         <table style="width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden;">
//           <thead>
//             <tr style="background:#ffcc80;">
//               <th style="padding:12px; text-align:left; font-weight:600; color:#e65100;">Metric</th>
//               <th style="padding:12px; text-align:right; font-weight:600; color:#e65100;">Value</th>
//             </tr>
//           </thead>
//           <tbody>
//     `;

//     // Quantum Metrics (always available for manual input)
//     if (metrics.density_matrix_purity !== undefined) {
//       const purity = metrics.density_matrix_purity * 100;
//       html += `
//         <tr style="border-bottom:1px solid #f0f0f0;">
//           <td style="padding:12px; font-weight:500;">Density Matrix Purity</td>
//           <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#ef6c00; font-weight:bold;">
//             ${purity.toFixed(2)}%
//           </td>
//         </tr>
//       `;
//     }

//     if (metrics.information_retention !== undefined) {
//       const retention = metrics.information_retention * 100;
//       html += `
//         <tr style="border-bottom:1px solid #f0f0f0;">
//           <td style="padding:12px; font-weight:500;">Information Retention</td>
//           <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#ef6c00; font-weight:bold;">
//             ${retention.toFixed(2)}%
//           </td>
//         </tr>
//       `;
//     }

//     // Classification Metrics (ONLY if available - not for manual input)
//     if (metrics.qpca_classification_accuracy !== undefined) {
//       const qpcaAcc = metrics.qpca_classification_accuracy * 100;
//       html += `
//         <tr style="border-bottom:1px solid #f0f0f0; background:#e8f5e9;">
//           <td style="padding:12px; font-weight:500;">🔬 QPCA Classification Accuracy</td>
//           <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#2e7d32; font-weight:bold;">
//             ${qpcaAcc.toFixed(2)}%
//           </td>
//         </tr>
//       `;
//     }

//     if (metrics.classical_pca_accuracy !== undefined) {
//       const pcaAcc = metrics.classical_pca_accuracy * 100;
//       html += `
//         <tr style="border-bottom:1px solid #f0f0f0; background:#e3f2fd;">
//           <td style="padding:12px; font-weight:500;">📊 Classical PCA Accuracy</td>
//           <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#1565c0; font-weight:bold;">
//             ${pcaAcc.toFixed(2)}%
//           </td>
//         </tr>
//       `;
//     }

//     if (metrics.accuracy_difference !== undefined) {
//       const diff = metrics.accuracy_difference * 100;
//       const color = diff >= 0 ? '#2e7d32' : '#c62828';
//       const bgColor = diff >= 0 ? '#c8e6c9' : '#ffcdd2';
//       const icon = diff >= 0 ? '📈' : '📉';
//       html += `
//         <tr style="background:${bgColor};">
//           <td style="padding:12px; font-weight:600;">${icon} Accuracy Difference (QPCA - PCA)</td>
//           <td style="padding:12px; text-align:right; font-family:monospace; font-size:18px; color:${color}; font-weight:bold;">
//             ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%
//           </td>
//         </tr>
//       `;
//     }

//     html += `
//           </tbody>
//         </table>
//       </div>
//     `;

//     return html;
//   }

//   // Principal Components Table (unchanged)
//   function renderPrincipalComponents(res) {
//     return `
//       <div style="background:linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); 
//                   padding:20px; border-radius:12px; margin-bottom:20px;
//                   box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
//         <h3 style="color:#1565c0; margin:0 0 15px 0; font-size:20px; font-weight:600;">
//           🔢 Principal Components Analysis
//         </h3>
//         <div style="overflow-x:auto;">
//           <table style="width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden;">
//             <thead>
//               <tr style="background:#90caf9;">
//                 <th style="padding:12px; text-align:left; font-weight:600; color:#0d47a1;">Component</th>
//                 <th style="padding:12px; text-align:right; font-weight:600; color:#0d47a1;">Eigenvalue</th>
//                 ${res.explained_variance_ratio ? '<th style="padding:12px; text-align:right; font-weight:600; color:#0d47a1;">Variance Explained</th>' : ''}
//                 ${res.cumulative_variance ? '<th style="padding:12px; text-align:right; font-weight:600; color:#0d47a1;">Cumulative Variance</th>' : ''}
//               </tr>
//             </thead>
//             <tbody>
//               ${renderPCRows(res)}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     `;
//   }

//   function renderPCRows(res) {
//     let html = '';
//     const maxComponents = Math.min(10, res.eigenvalues.length);
    
//     for (let i = 0; i < maxComponents; i++) {
//       const bgColor = i % 2 === 0 ? 'white' : '#e3f2fd';
//       html += `
//         <tr style="background:${bgColor}; border-bottom:1px solid #bbdefb;">
//           <td style="padding:12px; font-weight:600; color:#1565c0;">PC${i+1}</td>
//           <td style="padding:12px; text-align:right; font-family:monospace; font-size:14px;">
//             ${res.eigenvalues[i].toFixed(6)}
//           </td>
//       `;
      
//       if (res.explained_variance_ratio && res.explained_variance_ratio[i] !== undefined) {
//         const varPercent = res.explained_variance_ratio[i] * 100;
//         html += `
//           <td style="padding:12px; text-align:right;">
//             <div style="display:flex; align-items:center; justify-content:flex-end; gap:8px;">
//               <div style="flex:1; max-width:150px; height:8px; background:#e0e0e0; border-radius:4px; overflow:hidden;">
//                 <div style="height:100%; background:#1976d2; width:${varPercent}%;"></div>
//               </div>
//               <span style="font-family:monospace; font-weight:600; color:#1565c0;">${varPercent.toFixed(2)}%</span>
//             </div>
//           </td>
//         `;
//       }
      
//       if (res.cumulative_variance && res.cumulative_variance[i] !== undefined) {
//         const cumPercent = res.cumulative_variance[i] * 100;
//         html += `
//           <td style="padding:12px; text-align:right; font-family:monospace; font-weight:600; color:#2e7d32;">
//             ${cumPercent.toFixed(2)}%
//           </td>
//         `;
//       }
      
//       html += `</tr>`;
//     }

//     return html;
//   }

//   // ============================================================
//   // PLOTLY VISUALIZATIONS - FIXED TO WORK WITH MANUAL INPUT
//   // ============================================================
//   function createQPCAPlots(res) {
//     log('📊 Creating QPCA plots');

//     // Plot 1: Eigenvalue Spectrum (always works)
//     if (res.eigenvalues && document.getElementById("qpcaEigenPlot")) {
//       try {
//         const trace = {
//           x: res.eigenvalues.map((_, i) => `PC${i + 1}`),
//           y: res.eigenvalues,
//           type: "bar",
//           marker: { 
//             color: "#00897b",
//             line: { color: "#004d40", width: 1 }
//           }
//         };
        
//         const layout = {
//           title: "Eigenvalue Spectrum",
//           xaxis: { title: "Principal Component" },
//           yaxis: { title: "Eigenvalue" },
//           plot_bgcolor: "#f5f5f5",
//           paper_bgcolor: "white"
//         };

//         Plotly.newPlot("qpcaEigenPlot", [trace], layout);
//         log('✅ Eigenvalue plot created');
//       } catch(e) {
//         logError('Failed to create eigenvalue plot:', e);
//       }
//     }

//     // Plot 2: Explained Variance (always works if variance ratio exists)
//     if (res.explained_variance_ratio && document.getElementById("qpcaScreePlot")) {
//       try {
//         const traces = [{
//           x: res.eigenvalues.map((_, i) => i + 1),
//           y: res.explained_variance_ratio.map(v => v * 100),
//           mode: "lines+markers",
//           name: "Individual Variance",
//           line: { color: "#1976d2", width: 2 },
//           marker: { size: 8 }
//         }];

//         if (res.cumulative_variance && res.cumulative_variance.length) {
//           traces.push({
//             x: res.eigenvalues.map((_, i) => i + 1),
//             y: res.cumulative_variance.map(v => v * 100),
//             mode: "lines+markers",
//             name: "Cumulative Variance",
//             line: { color: "#d32f2f", width: 2, dash: "dash" },
//             marker: { size: 8 }
//           });
//         }

//         const layout = {
//           title: "Explained Variance",
//           xaxis: { title: "Principal Component" },
//           yaxis: { title: "Variance (%)", range: [0, 105] },
//           plot_bgcolor: "#f5f5f5",
//           paper_bgcolor: "white",
//           showlegend: true
//         };

//         Plotly.newPlot("qpcaScreePlot", traces, layout);
//         log('✅ Variance plot created');
//       } catch(e) {
//         logError('Failed to create variance plot:', e);
//       }
//     }

//     // Plot 3: Density Matrix Heatmap (always works)
//     if (res.density_matrix && document.getElementById("qpcaDensityPlot")) {
//       try {
//         const absMatrix = res.density_matrix.map(row => 
//           row.map(val => Math.abs(val))
//         );

//         const trace = {
//           z: absMatrix,
//           type: "heatmap",
//           colorscale: "Viridis",
//           colorbar: { title: "Magnitude" }
//         };

//         const layout = {
//           title: "Density Matrix (Magnitude)",
//           xaxis: { title: "Feature Index" },
//           yaxis: { title: "Feature Index" },
//           paper_bgcolor: "white"
//         };

//         Plotly.newPlot("qpcaDensityPlot", [trace], layout);
//         log('✅ Density matrix plot created');
//       } catch(e) {
//         logError('Failed to create density matrix plot:', e);
//       }
//     }

//     // Plot 4: Classification Accuracy (ONLY if available - hide for manual input)
//     const accuracyPlotDiv = document.getElementById("qpcaAccuracyPlot");
//     if (accuracyPlotDiv) {
//       const m = res.evaluation_metrics;
      
//       if (m && m.qpca_classification_accuracy !== undefined && 
//           m.classical_pca_accuracy !== undefined) {
//         try {
//           const qpcaAcc = m.qpca_classification_accuracy * 100;
//           const pcaAcc = m.classical_pca_accuracy * 100;

//           const trace = {
//             x: ['QPCA', 'Classical PCA'],
//             y: [qpcaAcc, pcaAcc],
//             type: "bar",
//             marker: { 
//               color: ['#4caf50', '#2196f3'],
//               line: { color: ['#2e7d32', '#1565c0'], width: 2 }
//             },
//             text: [
//               qpcaAcc.toFixed(2) + '%',
//               pcaAcc.toFixed(2) + '%'
//             ],
//             textposition: "outside",
//             textfont: { size: 14, weight: 'bold' }
//           };

//           const layout = {
//             title: "Classification Accuracy (KNN, k=" + state.parameters.knn_neighbors + ")",
//             yaxis: { 
//               title: "Accuracy (%)", 
//               range: [0, Math.max(qpcaAcc, pcaAcc) + 10] 
//             },
//             plot_bgcolor: "#f5f5f5",
//             paper_bgcolor: "white"
//           };

//           Plotly.newPlot("qpcaAccuracyPlot", [trace], layout);
//           $(accuracyPlotDiv).closest('.qpca-plot-container').show();
//           log('✅ Accuracy comparison plot created');
//         } catch(e) {
//           logError('Failed to create accuracy plot:', e);
//         }
//       } else {
//         // Hide accuracy plot for manual input (no classification)
//         $(accuracyPlotDiv).closest('.qpca-plot-container').hide();
//         log('ℹ️ Accuracy plot hidden (no classification data for manual input)');
//       }
//     }

//     log('✅ All plots completed');
//   }

//   // ============================================================
//   // TOOLBOX INTEGRATION
//   // ============================================================
//   function addQPCAToToolbox() {
//     try {
//       if ($("#toolboxDivSingle .qpcaToolboxButton").length) {
//         log('⚠️ QPCA button already exists in toolbox');
//         return;
//       }

//       const qpcaButton = $("<div>")
//         .addClass("gateButton qpcaToolboxButton")
//         .css({
//           width: "45px",
//           height: "45px",
//           border: "2px solid #00897b",
//           backgroundColor: "#b2dfdb",
//           borderRadius: "8px",
//           margin: "8px auto",
//           textAlign: "center",
//           lineHeight: "42px",
//           fontWeight: "bold",
//           cursor: "pointer",
//           transition: "all 0.2s ease"
//         })
//         .text("QPCA")
//         .attr("title", "Quantum Principal Component Analysis")
//         .hover(
//           function() {
//             $(this).css({ 
//               backgroundColor: "#80cbc4",
//               transform: "scale(1.05)"
//             });
//           },
//           function() {
//             $(this).css({ 
//               backgroundColor: "#b2dfdb",
//               transform: "scale(1)"
//             });
//           }
//         )
//         .click(function() {
//           log('QPCA button clicked');
//           if (typeof openCity === 'function') {
//             try {
//               openCity({ currentTarget: this }, 'qpcaPanel');
//             } catch (e) {
//               log('openCity failed, using fallback');
//               $('#qpcaPanel').show();
//             }
//           } else {
//             $('#qpcaPanel').show();
//           }
//         });

//       $("#toolboxDivSingle").append(qpcaButton);
//       log('✅ QPCA button added to toolbox');
//     } catch (e) {
//       logError('Failed to add QPCA button to toolbox:', e);
//     }
//   }

//   // ============================================================
//   // UI HELPERS
//   // ============================================================
//   function showLoading(message) {
//     let $loading = $('#qpcaLoading');
//     if (!$loading.length) {
//       $loading = $('<div id="qpcaLoading">')
//         .css({
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           backgroundColor: 'rgba(0,0,0,0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 10000
//         })
//         .html(`
//           <div style="
//             background: white;
//             padding: 30px;
//             border-radius: 10px;
//             text-align: center;
//             box-shadow: 0 4px 20px rgba(0,0,0,0.3);
//           ">
//             <div class="spinner" style="
//               border: 4px solid #f3f3f3;
//               border-top: 4px solid #00897b;
//               border-radius: 50%;
//               width: 40px;
//               height: 40px;
//               animation: spin 1s linear infinite;
//               margin: 0 auto 15px;
//             "></div>
//             <p id="qpcaLoadingMessage" style="
//               margin: 0;
//               color: #333;
//               font-size: 16px;
//             ">${message}</p>
//           </div>
//         `)
//         .appendTo('body');

//       if (!$('#qpcaLoadingStyle').length) {
//         $('<style id="qpcaLoadingStyle">')
//           .text('@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }')
//           .appendTo('head');
//       }
//     } else {
//       $('#qpcaLoadingMessage').text(message);
//     }
//     $loading.show();
//   }

//   function hideLoading() {
//     $('#qpcaLoading').hide();
//   }

//   function showError(message) {
//     alert('❌ ' + message);
//     logError(message);
//   }

//   // ============================================================
//   // EXPORT FUNCTIONS FOR EXTERNAL USE
//   // ============================================================
//   window.QPCA = {
//     init: initQPCA,
//     runAnalysis: runQPCAAnalysis,
//     runCSV: runCsvQPCA,
//     displayResults: displayResults,
//     state: state
//   };

//   log('✅ QPCA Frontend Module Loaded - Fixed Manual Input Edition');

// })();
(function() {
  'use strict';

  // ============================================================
  // CONFIGURATION
  // ============================================================
  const BACKEND_BASE = window.location.origin;
  const DEBUG = true;

  function log(...args) {
    if (DEBUG) console.log('[QPCA]', ...args);
  }

  function logError(...args) {
    console.error('[QPCA ERROR]', ...args);
  }

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const state = {
    currentMode: 'dataset',
    selectedDataset: 'iris',
    hasCSVFile: false,
    isProcessing: false,
    parameters: {
      n_components: 2,
      test_size: 0.3,
      knn_neighbors: 5,
      random_state: 42
    },
    lastResults: null
  };

  // ============================================================
  // INITIALIZATION
  // ============================================================
  $(document).ready(function() {
    log('Frontend initializing...');
    initQPCA();
  });

  function initQPCA() {
    log('🔬 Initializing QPCA Interface');

    // Setup event handlers
    setupModeSwitch();
    setupDatasetSelection();
    setupFileUpload();
    setupRunButtons();
    setupParameterControls();
    updateUI();

    // Add to toolbox after delay
    setTimeout(() => {
      if ($("#toolboxDivSingle").length) {
        addQPCAToToolbox();
      }
    }, 800);

    log('✅ QPCA Interface ready');
  }

  // ============================================================
  // PARAMETER CONTROLS SETUP
  // ============================================================
  function setupParameterControls() {
    // Create parameter panel if it doesn't exist
    if ($('#qpcaParameterPanel').length === 0) {
      createParameterPanel();
    }

    // N Components Slider
    $('#nComponentsSlider').off('input').on('input', function() {
      const val = parseInt($(this).val());
      state.parameters.n_components = val;
      $('#nComponentsValue').text(val);
      $('#nComponents').val(val);
      log('N Components changed to:', val);
    });

    // Test Size Slider
    $('#testSizeSlider').off('input').on('input', function() {
      const val = parseFloat($(this).val());
      state.parameters.test_size = val;
      $('#testSizeValue').text((val * 100).toFixed(0) + '%');
      log('Test size changed to:', val);
    });

    // KNN Neighbors Slider
    $('#knnNeighborsSlider').off('input').on('input', function() {
      const val = parseInt($(this).val());
      state.parameters.knn_neighbors = val;
      $('#knnNeighborsValue').text(val);
      log('KNN neighbors changed to:', val);
    });

    // Random State Input
    $('#randomStateInput').off('input').on('input', function() {
      const val = parseInt($(this).val()) || 42;
      state.parameters.random_state = val;
      log('Random state changed to:', val);
    });

    // Auto-recompute toggle
    $('#autoRecompute').off('change').on('change', function() {
      const isEnabled = $(this).is(':checked');
      log('Auto-recompute:', isEnabled ? 'enabled' : 'disabled');
      
      if (isEnabled && state.lastResults) {
        log('Auto-recompute triggered');
        setTimeout(() => runQPCAAnalysis(), 500);
      }
    });

    // Real-time parameter updates with auto-recompute
    $('.parameter-slider').off('change').on('change', function() {
      if ($('#autoRecompute').is(':checked') && state.lastResults) {
        log('Parameter changed, auto-recomputing...');
        setTimeout(() => runQPCAAnalysis(), 300);
      }
    });
  }

  // ============================================================
  // CREATE PARAMETER PANEL
  // ============================================================
  function createParameterPanel() {
    const panelHTML = `
      <div id="qpcaParameterPanel" style="
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 600;">
            🎛️ Interactive Parameters
          </h3>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="autoRecompute" style="cursor: pointer;">
            <span style="color: #34495e; font-size: 14px; font-weight: 500;">Auto-recompute</span>
          </label>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
          
          <!-- N Components -->
          <div class="parameter-control" style="
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">
                📊 Components
              </label>
              <span id="nComponentsValue" style="
                background: #3498db;
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 14px;
              ">2</span>
            </div>
            <input 
              type="range" 
              id="nComponentsSlider" 
              class="parameter-slider"
              min="1" 
              max="10" 
              value="2" 
              step="1"
              style="width: 100%; cursor: pointer;"
            >
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          <!-- Test Size -->
          <div class="parameter-control" style="
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">
                🎯 Test Size
              </label>
              <span id="testSizeValue" style="
                background: #e74c3c;
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 14px;
              ">30%</span>
            </div>
            <input 
              type="range" 
              id="testSizeSlider" 
              class="parameter-slider"
              min="0.1" 
              max="0.5" 
              value="0.3" 
              step="0.05"
              style="width: 100%; cursor: pointer;"
            >
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          <!-- KNN Neighbors -->
          <div class="parameter-control" style="
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">
                👥 KNN Neighbors
              </label>
              <span id="knnNeighborsValue" style="
                background: #2ecc71;
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 14px;
              ">5</span>
            </div>
            <input 
              type="range" 
              id="knnNeighborsSlider" 
              class="parameter-slider"
              min="1" 
              max="15" 
              value="5" 
              step="1"
              style="width: 100%; cursor: pointer;"
            >
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #7f8c8d; margin-top: 5px;">
              <span>1</span>
              <span>15</span>
            </div>
          </div>

          <!-- Random State -->
          <div class="parameter-control" style="
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            <div style="margin-bottom: 10px;">
              <label style="color: #2c3e50; font-weight: 500; font-size: 14px;">
                🎲 Random Seed
              </label>
            </div>
            <input 
              type="number" 
              id="randomStateInput" 
              value="42"
              min="0"
              max="9999"
              style="
                width: 100%;
                padding: 8px 12px;
                border: 2px solid #bdc3c7;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                text-align: center;
              "
            >
            <div style="font-size: 11px; color: #7f8c8d; margin-top: 5px; text-align: center;">
              For reproducibility
            </div>
          </div>

        </div>

        <!-- Parameter Info Banner -->
        <div style="
          background: #fff9e6;
          border-left: 4px solid #f39c12;
          padding: 12px;
          margin-top: 15px;
          border-radius: 4px;
        ">
          <p style="margin: 0; color: #7d6608; font-size: 13px;">
            <strong>💡 Tip:</strong> Enable <strong>Auto-recompute</strong> to see results update in real-time as you adjust parameters!
          </p>
        </div>
      </div>
    `;

    // Insert at top of QPCA panel
    if ($('#qpcaPanel h3').first().length) {
      $(panelHTML).insertAfter($('#qpcaPanel h3').first());
    }

    log('✅ Parameter panel created');
  }

  // ============================================================
  // EVENT HANDLERS SETUP
  // ============================================================
  function setupModeSwitch() {
    $('input[name="qpcaMode"]').off('change').on('change', function() {
      state.currentMode = $(this).val();
      log('Mode switched to:', state.currentMode);
      updateUI();
    });
  }

  function setupDatasetSelection() {
    $('#qpcaDataset').off('change').on('change', function() {
      state.selectedDataset = $(this).val();
      log('Dataset selected:', state.selectedDataset);
      
      // Update max components based on dataset
      updateMaxComponents();
      updateUI();
    });
  }

  function updateMaxComponents() {
    const maxComponents = {
      'iris': 4,
      'wine': 13,
      'breast_cancer': 30,
      'csv': 10
    };
    
    const max = maxComponents[state.selectedDataset] || 10;
    $('#nComponentsSlider').attr('max', max);
    
    // Adjust current value if it exceeds max
    if (state.parameters.n_components > max) {
      state.parameters.n_components = Math.min(max, 2);
      $('#nComponentsSlider').val(state.parameters.n_components);
      $('#nComponentsValue').text(state.parameters.n_components);
    }
    
    // Update max label
    $('#nComponentsSlider').siblings('div').find('span:last').text(max);
  }

  function setupFileUpload() {
    $("#qpcaCsvFile").off('change').on('change', function() {
      state.hasCSVFile = this.files && this.files.length > 0;
      if (state.hasCSVFile) {
        log('📄 CSV file selected:', this.files[0].name);
      }
      updateUI();
    });
  }

  function setupRunButtons() {
    $("#runQPCA").off('click').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      runQPCAAnalysis();
    });

    $("#runCsvQPCA").off('click').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      runCsvQPCA();
    });
  }

  // ============================================================
  // UI UPDATE
  // ============================================================
  function updateUI() {
    // Mode visibility
    if (state.currentMode === 'dataset') {
      $('#datasetSection').show();
      $('#manualSection').hide();
    } else {
      $('#datasetSection').hide();
      $('#manualSection').show();
    }

    // Dataset-specific UI
    if (state.selectedDataset === 'csv') {
      $('#runQPCA').hide();
      $('#csvUploadSection').show();
      $('#runCsvQPCA').toggle(state.hasCSVFile);
    } else {
      $('#runQPCA').show();
      $('#csvUploadSection').hide();
    }

    log('UI updated');
  }

  // ============================================================
  // CSV QPCA PROCESSING
  // ============================================================
  function runCsvQPCA() {
    if (state.isProcessing) {
      log('⚠️ Already processing...');
      return;
    }

    const fileInput = document.getElementById("qpcaCsvFile");
    if (!fileInput || !fileInput.files.length) {
      showError("Please select a CSV file");
      return;
    }

    state.isProcessing = true;
    showLoading("Processing CSV file...");

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("n_components", state.parameters.n_components);
    formData.append("test_size", state.parameters.test_size);
    formData.append("knn_neighbors", state.parameters.knn_neighbors);
    formData.append("random_state", state.parameters.random_state);
    
    const url = `${BACKEND_BASE}/ComputeQPCAFromCSV`;

    log('📤 Uploading CSV to', url, 'with parameters:', state.parameters);

    fetch(url, { 
      method: "POST", 
      body: formData 
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      log('📥 CSV result received:', data);
      state.isProcessing = false;
      hideLoading();

      if (data.error) {
        showError("CSV QPCA Error:\n\n" + data.error);
        if (data.traceback) {
          logError('Traceback:', data.traceback);
        }
      } else if (data.success === false) {
        showError("CSV processing failed: " + (data.error || 'Unknown error'));
      } else {
        state.lastResults = data;
        displayResults(data);
        showParameterSummary();
      }
    })
    .catch(err => {
      logError('CSV upload failed:', err);
      state.isProcessing = false;
      hideLoading();
      showError("Upload failed: " + err.message);
    });
  }

  // ============================================================
  // DATASET/MANUAL QPCA PROCESSING
  // ============================================================
  function runQPCAAnalysis() {
    if (state.isProcessing) {
      log('⚠️ Already processing...');
      return;
    }

    log('🔮 Running QPCA analysis with parameters:', state.parameters);
    const mode = state.currentMode;
    let payload = {};

    try {
      if (mode === 'dataset') {
        // Dataset mode
        const dataset = $('#qpcaDataset').val();

        if (dataset === 'csv') {
          showError("Use 'Run CSV QPCA' button for CSV files");
          return;
        }

        payload = { 
          dataset,
          n_components: state.parameters.n_components,
          test_size: state.parameters.test_size,
          knn_neighbors: state.parameters.knn_neighbors,
          random_state: state.parameters.random_state
        };

      } else {
        // Manual mode
        const raw = $("#qpcaData").val().trim();
        if (!raw) {
          showError("Please enter data");
          return;
        }

        // Parse data
        const lines = raw.split("\n").filter(line => line.trim());
        const data = lines.map(line => {
          return line.split(/[,\s]+/).map(x => parseFloat(x.trim()));
        }).filter(row => row.length > 0 && row.every(x => !isNaN(x)));

        if (!data.length) {
          showError("Invalid data format. Use comma or space separated numbers.");
          return;
        }

        // Check consistency
        const rowLengths = data.map(r => r.length);
        const allSameLength = rowLengths.every(len => len === rowLengths[0]);
        if (!allSameLength) {
          showError("All rows must have the same number of values");
          return;
        }

        payload = { 
          data,
          n_components: state.parameters.n_components
        };
      }

      state.isProcessing = true;
      showLoading("Performing quantum analysis...");

      const url = `${BACKEND_BASE}/ComputeQPCA`;
      log('📤 Sending to', url, payload);

      $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(payload),
        contentType: "application/json",
        dataType: "json",
        success: function(res) {
          log('✅ Backend response:', res);
          state.isProcessing = false;
          hideLoading();

          if (res.error) {
            showError(res.error);
            if (res.traceback) {
              logError('Traceback:', res.traceback);
            }
          } else if (res.success === false) {
            showError(res.error || 'Analysis failed');
          } else {
            state.lastResults = res;
            displayResults(res);
            showParameterSummary();
          }
        },
        error: function(xhr, status, error) {
          logError('Backend error:', xhr.status, error);
          state.isProcessing = false;
          hideLoading();
          
          let errorMsg = `Backend error (${xhr.status})`;
          if (xhr.responseText) {
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMsg += ': ' + (errorData.error || errorData.message || xhr.responseText);
            } catch(e) {
              errorMsg += ': ' + xhr.responseText;
            }
          } else {
            errorMsg += ': ' + error;
          }
          showError(errorMsg);
        }
      });

    } catch (err) {
      logError('Analysis error:', err);
      state.isProcessing = false;
      hideLoading();
      showError("Error: " + err.message);
    }
  }

  // ============================================================
  // PARAMETER SUMMARY DISPLAY
  // ============================================================
  function showParameterSummary() {
    const summaryHTML = `
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      ">
        <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
          ⚙️ Analysis Parameters Used
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 13px;">
          <div>
            <strong>Components:</strong> ${state.parameters.n_components}
          </div>
          <div>
            <strong>Test Size:</strong> ${(state.parameters.test_size * 100).toFixed(0)}%
          </div>
          <div>
            <strong>KNN Neighbors:</strong> ${state.parameters.knn_neighbors}
          </div>
          <div>
            <strong>Random Seed:</strong> ${state.parameters.random_state}
          </div>
        </div>
      </div>
    `;

    // Insert at top of metrics
    $('#qpcaMetrics').prepend(summaryHTML);
  }

  // ============================================================
  // RESULTS DISPLAY
  // ============================================================
  function displayResults(res) {
    log('👁️ Displaying QPCA results');
    
    // Show output section
    $('#qpcaOutput').show().css({ 
      display: 'block', 
      visibility: 'visible' 
    });

    // Display metrics
    displayQPCAMetrics(res);

    // Create plots after short delay
    setTimeout(() => {
      createQPCAPlots(res);
    }, 100);

    // Display QuTiP code
    if (res.qutip_code) {
      $("#qutipCode").text(res.qutip_code);
    } else if (res.qutip) {
      $("#qutipCode").text(res.qutip);
    }

    log('✅ Results displayed');
  }

  // ============================================================
  // METRICS DISPLAY WITH OVERALL STATISTICAL TESTS SUMMARY
  // ============================================================
  function displayQPCAMetrics(res) {
    let html = '<div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">';
    
    // Main Title
    html += `
      <div style="text-align:center; margin-bottom:25px;">
        <h2 style="color:#00695c; margin:0; font-size:28px; font-weight:600;">
          ⚛️ Quantum PCA Analysis Results
        </h2>
        <p style="color:#666; margin:5px 0 0 0; font-size:14px;">
          Density Matrix Eigendecomposition & Statistical Evaluation
        </p>
      </div>
    `;

    // Dataset Information Card
    if (res.dataset_info) {
      html += renderDatasetInfo(res.dataset_info);
    }

    // Quantum Metrics
    if (res.evaluation_metrics) {
      html += renderQuantumMetrics(res.evaluation_metrics);
    }

    // Classification Metrics (only if available)
    if (res.evaluation_metrics && res.evaluation_metrics.qpca_classification_accuracy !== undefined) {
      html += renderClassificationMetrics(res.evaluation_metrics);
    }

    // ⭐ OVERALL STATISTICAL TESTS SUMMARY - NEW!
    if (res.evaluation_metrics && res.evaluation_metrics.statistical_tests) {
      html += renderOverallStatisticalSummary(res.evaluation_metrics.statistical_tests);
    }

    // Confusion Matrices (only if available)
    if (res.evaluation_metrics && res.evaluation_metrics.qpca_confusion_matrix) {
      html += renderConfusionMatrices(res.evaluation_metrics);
    }

    // Principal Components Table
    if (res.eigenvalues && res.eigenvalues.length > 0) {
      html += renderPrincipalComponents(res);
    }

    html += '</div>';
    $('#qpcaMetrics').html(html);
    log('✅ Metrics HTML updated with overall statistical summary');
  }

  // ============================================================
  // QUANTUM METRICS RENDERER
  // ============================================================
  function renderQuantumMetrics(metrics) {
    let html = `
      <div style="background:linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); 
                  padding:20px; border-radius:12px; margin-bottom:20px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="color:#ef6c00; margin:0 0 15px 0; font-size:20px; font-weight:600;">
          ⚛️ Quantum Metrics
        </h3>
        <table style="width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden;">
          <thead>
            <tr style="background:#ffcc80;">
              <th style="padding:12px; text-align:left; font-weight:600; color:#e65100;">Metric</th>
              <th style="padding:12px; text-align:right; font-weight:600; color:#e65100;">Value</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (metrics.density_matrix_purity !== undefined) {
      const purity = metrics.density_matrix_purity * 100;
      html += `
        <tr style="border-bottom:1px solid #f0f0f0;">
          <td style="padding:12px; font-weight:500;">Density Matrix Purity</td>
          <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#ef6c00; font-weight:bold;">
            ${purity.toFixed(2)}%
          </td>
        </tr>
      `;
    }

    if (metrics.information_retention !== undefined) {
      const retention = metrics.information_retention * 100;
      html += `
        <tr>
          <td style="padding:12px; font-weight:500;">Information Retention</td>
          <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#ef6c00; font-weight:bold;">
            ${retention.toFixed(2)}%
          </td>
        </tr>
      `;
    }

    html += `</tbody></table></div>`;
    return html;
  }

  // ============================================================
  // CLASSIFICATION METRICS RENDERER
  // ============================================================
  function renderClassificationMetrics(metrics) {
    let html = `
      <div style="background:linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); 
                  padding:20px; border-radius:12px; margin-bottom:20px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="color:#2e7d32; margin:0 0 15px 0; font-size:20px; font-weight:600;">
          🎯 Classification Performance
        </h3>
        <table style="width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden;">
          <thead>
            <tr style="background:#a5d6a7;">
              <th style="padding:12px; text-align:left; font-weight:600; color:#1b5e20;">Method</th>
              <th style="padding:12px; text-align:right; font-weight:600; color:#1b5e20;">Accuracy</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (metrics.qpca_classification_accuracy !== undefined) {
      const qpcaAcc = metrics.qpca_classification_accuracy * 100;
      html += `
        <tr style="border-bottom:1px solid #f0f0f0;">
          <td style="padding:12px; font-weight:500;">🔬 QPCA Classification</td>
          <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#2e7d32; font-weight:bold;">
            ${qpcaAcc.toFixed(2)}%
          </td>
        </tr>
      `;
    }

    if (metrics.classical_pca_accuracy !== undefined) {
      const pcaAcc = metrics.classical_pca_accuracy * 100;
      html += `
        <tr style="border-bottom:1px solid #f0f0f0;">
          <td style="padding:12px; font-weight:500;">📊 Classical PCA</td>
          <td style="padding:12px; text-align:right; font-family:monospace; font-size:16px; color:#1565c0; font-weight:bold;">
            ${pcaAcc.toFixed(2)}%
          </td>
        </tr>
      `;
    }

    if (metrics.accuracy_difference !== undefined) {
      const diff = metrics.accuracy_difference * 100;
      const color = diff >= 0 ? '#2e7d32' : '#c62828';
      const icon = diff >= 0 ? '📈' : '📉';
      html += `
        <tr>
          <td style="padding:12px; font-weight:600;">${icon} Difference</td>
          <td style="padding:12px; text-align:right; font-family:monospace; font-size:18px; color:${color}; font-weight:bold;">
            ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%
          </td>
        </tr>
      `;
    }

    html += `</tbody></table></div>`;
    return html;
  }

  // ============================================================
  // ⭐ OVERALL STATISTICAL TESTS SUMMARY - SINGLE TABLE
  // ============================================================
  function renderOverallStatisticalSummary(stats) {
    if (!stats) return '';

    // Calculate average p-values for each test (overall dataset summary)
    const getSummaryMetric = (test) => {
      if (!test || !test.p_values) return null;
      
      const pValues = test.p_values;
      const avgPValue = pValues.reduce((a, b) => a + b, 0) / pValues.length;
      const significantCount = pValues.filter(p => p < 0.05).length;
      const totalCount = pValues.length;
      const significantPercent = (significantCount / totalCount) * 100;
      
      return {
        avgPValue,
        significantCount,
        totalCount,
        significantPercent
      };
    };

    const chiSquare = getSummaryMetric(stats.chi_square);
    const zTest = getSummaryMetric(stats.z_test);
    const tTest = getSummaryMetric(stats.t_test);
    const ksTest = getSummaryMetric(stats.ks_test);

    let html = `
      <div style="background:linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%); 
                  padding:20px; border-radius:12px; margin-bottom:20px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="color:#3f51b5; margin:0 0 10px 0; font-size:20px; font-weight:600;">
          📐 Overall Statistical Tests Summary
        </h3>
        <p style="color:#555; font-size:13px; margin:0 0 20px 0;">
          Comprehensive statistical hypothesis testing on entire dataset
        </p>
        
        <table style="width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden;">
          <thead>
            <tr style="background:#9fa8da;">
              <th style="padding:14px; text-align:left; font-weight:600; color:#1a237e; font-size:15px;">Test</th>
              <th style="padding:14px; text-align:center; font-weight:600; color:#1a237e; font-size:15px;">Avg p-value</th>
              <th style="padding:14px; text-align:center; font-weight:600; color:#1a237e; font-size:15px;">Significant Features</th>
              <th style="padding:14px; text-align:center; font-weight:600; color:#1a237e; font-size:15px;">Overall Result</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Chi-Square Test Row
    if (chiSquare) {
      const isOverallSig = chiSquare.avgPValue < 0.05;
      html += `
        <tr style="border-bottom:1px solid #e0e0e0;">
          <td style="padding:14px;">
            <div style="font-weight:600; color:#5e35b1; font-size:14px;">🔷 Chi-Square Test (χ²)</div>
            <div style="font-size:12px; color:#666; margin-top:4px;">Feature-class independence</div>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="font-family:monospace; font-size:16px; font-weight:600; color:#5e35b1;">
              ${chiSquare.avgPValue.toFixed(4)}
            </span>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="font-weight:600; color:#1976d2; font-size:15px;">
              ${chiSquare.significantCount}/${chiSquare.totalCount}
            </span>
            <div style="font-size:12px; color:#666; margin-top:4px;">
              (${chiSquare.significantPercent.toFixed(1)}%)
            </div>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="
              padding:6px 16px; 
              border-radius:20px; 
              font-weight:600; 
              font-size:13px;
              background:${isOverallSig ? '#c8e6c9' : '#ffcdd2'};
              color:${isOverallSig ? '#1b5e20' : '#b71c1c'};
            ">
              ${isOverallSig ? '✓ Significant' : '✗ Not Significant'}
            </span>
          </td>
        </tr>
      `;
    }

    // Z-Test Row
    if (zTest) {
      const isOverallSig = zTest.avgPValue < 0.05;
      html += `
        <tr style="border-bottom:1px solid #e0e0e0;">
          <td style="padding:14px;">
            <div style="font-weight:600; color:#0288d1; font-size:14px;">🔶 Z-Test</div>
            <div style="font-size:12px; color:#666; margin-top:4px;">Mean vs zero comparison</div>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="font-family:monospace; font-size:16px; font-weight:600; color:#0288d1;">
              ${zTest.avgPValue.toFixed(4)}
            </span>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="font-weight:600; color:#1976d2; font-size:15px;">
              ${zTest.significantCount}/${zTest.totalCount}
            </span>
            <div style="font-size:12px; color:#666; margin-top:4px;">
              (${zTest.significantPercent.toFixed(1)}%)
            </div>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="
              padding:6px 16px; 
              border-radius:20px; 
              font-weight:600; 
              font-size:13px;
              background:${isOverallSig ? '#c8e6c9' : '#ffcdd2'};
              color:${isOverallSig ? '#1b5e20' : '#b71c1c'};
            ">
              ${isOverallSig ? '✓ Significant' : '✗ Not Significant'}
            </span>
          </td>
        </tr>
      `;
    }

    // T-Test Row
    if (tTest) {
      const isOverallSig = tTest.avgPValue < 0.05;
      html += `
        <tr style="border-bottom:1px solid #e0e0e0;">
          <td style="padding:14px;">
            <div style="font-weight:600; color:#00897b; font-size:14px;">🔸 T-Test</div>
            <div style="font-size:12px; color:#666; margin-top:4px;">One-sample t-test</div>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="font-family:monospace; font-size:16px; font-weight:600; color:#00897b;">
              ${tTest.avgPValue.toFixed(4)}
            </span>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="font-weight:600; color:#1976d2; font-size:15px;">
              ${tTest.significantCount}/${tTest.totalCount}
            </span>
            <div style="font-size:12px; color:#666; margin-top:4px;">
              (${tTest.significantPercent.toFixed(1)}%)
            </div>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="
              padding:6px 16px; 
              border-radius:20px; 
              font-weight:600; 
              font-size:13px;
              background:${isOverallSig ? '#c8e6c9' : '#ffcdd2'};
              color:${isOverallSig ? '#1b5e20' : '#b71c1c'};
            ">
              ${isOverallSig ? '✓ Significant' : '✗ Not Significant'}
            </span>
          </td>
        </tr>
      `;
    }

    // KS Test Row
    if (ksTest) {
      const isOverallSig = ksTest.avgPValue >= 0.05; // Inverted for KS test!
      html += `
        <tr>
          <td style="padding:14px;">
            <div style="font-weight:600; color:#d32f2f; font-size:14px;">🔹 Kolmogorov-Smirnov Test</div>
            <div style="font-size:12px; color:#666; margin-top:4px;">Normality distribution test</div>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="font-family:monospace; font-size:16px; font-weight:600; color:#d32f2f;">
              ${ksTest.avgPValue.toFixed(4)}
            </span>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="font-weight:600; color:#1976d2; font-size:15px;">
              ${ksTest.significantCount}/${ksTest.totalCount}
            </span>
            <div style="font-size:12px; color:#666; margin-top:4px;">
              (${ksTest.significantPercent.toFixed(1)}% normal)
            </div>
          </td>
          <td style="padding:14px; text-align:center;">
            <span style="
              padding:6px 16px; 
              border-radius:20px; 
              font-weight:600; 
              font-size:13px;
              background:${isOverallSig ? '#c8e6c9' : '#ffcdd2'};
              color:${isOverallSig ? '#1b5e20' : '#b71c1c'};
            ">
              ${isOverallSig ? '✓ Normal' : '✗ Non-Normal'}
            </span>
          </td>
        </tr>
      `;
    }

    html += `
          </tbody>
        </table>
        
        <div style="background:#f5f5f5; padding:15px; border-radius:8px; margin-top:20px; border-left:4px solid #3f51b5;">
          <h4 style="color:#3f51b5; margin:0 0 10px 0; font-size:15px;">
            📊 Interpretation Guide
          </h4>
          <ul style="color:#666; font-size:13px; margin:0; padding-left:20px; line-height:1.8;">
            <li><strong>Avg p-value:</strong> Average statistical significance across all features</li>
            <li><strong>Significant Features:</strong> Number of features passing p < 0.05 threshold</li>
            <li><strong>Chi-Square:</strong> Tests if features are related to target classes</li>
            <li><strong>Z-Test & T-Test:</strong> Tests if feature means differ significantly from zero</li>
            <li><strong>KS Test:</strong> Tests if features follow normal distribution (higher p-value = more normal)</li>
          </ul>
        </div>
      </div>
    `;

    return html;
  }

  // Dataset info, confusion matrices, and principal components remain the same...
  // [Include all the other render functions from previous version]

  function renderDatasetInfo(info) {
    return `
      <div style="background:linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%); 
                  padding:20px; border-radius:12px; margin-bottom:20px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="color:#00695c; margin:0 0 15px 0; font-size:20px; font-weight:600;">
          📊 Dataset Information
        </h3>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
          <div style="background:white; padding:15px; border-radius:8px;">
            <div style="color:#666; font-size:12px; margin-bottom:5px;">Dataset</div>
            <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.name || 'Custom'}</div>
          </div>
          <div style="background:white; padding:15px; border-radius:8px;">
            <div style="color:#666; font-size:12px; margin-bottom:5px;">Samples</div>
            <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.n_samples || 0}</div>
          </div>
          <div style="background:white; padding:15px; border-radius:8px;">
            <div style="color:#666; font-size:12px; margin-bottom:5px;">Features</div>
            <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.n_features || 0}</div>
          </div>
          ${info.n_classes ? `
          <div style="background:white; padding:15px; border-radius:8px;">
            <div style="color:#666; font-size:12px; margin-bottom:5px;">Classes</div>
            <div style="color:#00695c; font-size:20px; font-weight:bold;">${info.n_classes}</div>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  function renderConfusionMatrices(metrics) {
    if (!metrics.qpca_confusion_matrix || !metrics.pca_confusion_matrix) return '';

    return `
      <div style="background:linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); 
                  padding:20px; border-radius:12px; margin-bottom:20px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="color:#6a1b9a; margin:0 0 15px 0; font-size:20px; font-weight:600;">
          🎯 Confusion Matrices
        </h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
          ${renderSingleConfusionMatrix('QPCA', metrics.qpca_confusion_matrix, '#4caf50')}
          ${renderSingleConfusionMatrix('Classical PCA', metrics.pca_confusion_matrix, '#2196f3')}
        </div>
      </div>
    `;
  }

  function renderSingleConfusionMatrix(title, matrix, color) {
    if (!matrix || matrix.length === 0) return '';

    let html = `
      <div style="background:white; padding:15px; border-radius:8px;">
        <h4 style="color:${color}; margin:0 0 10px 0; font-size:16px; font-weight:600;">${title}</h4>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="padding:8px; text-align:center; background:${color}20; border:1px solid ${color}40;"></th>
    `;

    for (let i = 0; i < matrix[0].length; i++) {
      html += `<th style="padding:8px; text-align:center; background:${color}20; border:1px solid ${color}40; font-weight:600;">Pred ${i}</th>`;
    }
    html += `</tr></thead><tbody>`;

    for (let i = 0; i < matrix.length; i++) {
      html += `<tr>`;
      html += `<th style="padding:8px; text-align:center; background:${color}20; border:1px solid ${color}40; font-weight:600;">True ${i}</th>`;
      
      for (let j = 0; j < matrix[i].length; j++) {
        const val = matrix[i][j];
        const isCorrect = i === j;
        const bgColor = isCorrect ? (color === '#4caf50' ? '#c8e6c9' : '#bbdefb') : 'white';
        
        html += `
          <td style="padding:8px; text-align:center; border:1px solid ${color}40; 
                     background:${bgColor}; font-weight:${isCorrect ? 'bold' : 'normal'}; 
                     font-family:monospace; font-size:14px;">
            ${val}
          </td>
        `;
      }
      html += `</tr>`;
    }

    html += `</tbody></table></div>`;
    return html;
  }

  function renderPrincipalComponents(res) {
    return `
      <div style="background:linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); 
                  padding:20px; border-radius:12px; margin-bottom:20px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="color:#1565c0; margin:0 0 15px 0; font-size:20px; font-weight:600;">
          🔢 Principal Components Analysis
        </h3>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden;">
            <thead>
              <tr style="background:#90caf9;">
                <th style="padding:12px; text-align:left; font-weight:600; color:#0d47a1;">Component</th>
                <th style="padding:12px; text-align:right; font-weight:600; color:#0d47a1;">Eigenvalue</th>
                ${res.explained_variance_ratio ? '<th style="padding:12px; text-align:right; font-weight:600; color:#0d47a1;">Variance Explained</th>' : ''}
                ${res.cumulative_variance ? '<th style="padding:12px; text-align:right; font-weight:600; color:#0d47a1;">Cumulative Variance</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${renderPCRows(res)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderPCRows(res) {
    let html = '';
    const maxComponents = Math.min(10, res.eigenvalues.length);
    
    for (let i = 0; i < maxComponents; i++) {
      const bgColor = i % 2 === 0 ? 'white' : '#e3f2fd';
      html += `
        <tr style="background:${bgColor}; border-bottom:1px solid #bbdefb;">
          <td style="padding:12px; font-weight:600; color:#1565c0;">PC${i+1}</td>
          <td style="padding:12px; text-align:right; font-family:monospace; font-size:14px;">
            ${res.eigenvalues[i].toFixed(6)}
          </td>
      `;
      
      if (res.explained_variance_ratio && res.explained_variance_ratio[i] !== undefined) {
        const varPercent = res.explained_variance_ratio[i] * 100;
        html += `
          <td style="padding:12px; text-align:right;">
            <div style="display:flex; align-items:center; justify-content:flex-end; gap:8px;">
              <div style="flex:1; max-width:150px; height:8px; background:#e0e0e0; border-radius:4px; overflow:hidden;">
                <div style="height:100%; background:#1976d2; width:${varPercent}%;"></div>
              </div>
              <span style="font-family:monospace; font-weight:600; color:#1565c0;">${varPercent.toFixed(2)}%</span>
            </div>
          </td>
        `;
      }
      
      if (res.cumulative_variance && res.cumulative_variance[i] !== undefined) {
        const cumPercent = res.cumulative_variance[i] * 100;
        html += `
          <td style="padding:12px; text-align:right; font-family:monospace; font-weight:600; color:#2e7d32;">
            ${cumPercent.toFixed(2)}%
          </td>
        `;
      }
      
      html += `</tr>`;
    }

    return html;
  }

  // ============================================================
  // PLOTLY VISUALIZATIONS - SAME AS BEFORE
  // ============================================================
  function createQPCAPlots(res) {
    log('📊 Creating QPCA plots');

    // Plot 1: Eigenvalue Spectrum
    if (res.eigenvalues && document.getElementById("qpcaEigenPlot")) {
      try {
        const trace = {
          x: res.eigenvalues.map((_, i) => `PC${i + 1}`),
          y: res.eigenvalues,
          type: "bar",
          marker: { 
            color: "#00897b",
            line: { color: "#004d40", width: 1 }
          }
        };
        
        const layout = {
          title: "Eigenvalue Spectrum",
          xaxis: { title: "Principal Component" },
          yaxis: { title: "Eigenvalue" },
          plot_bgcolor: "#f5f5f5",
          paper_bgcolor: "white"
        };

        Plotly.newPlot("qpcaEigenPlot", [trace], layout);
        log('✅ Eigenvalue plot created');
      } catch(e) {
        logError('Failed to create eigenvalue plot:', e);
      }
    }

    // Plot 2: Explained Variance
    if (res.explained_variance_ratio && document.getElementById("qpcaScreePlot")) {
      try {
        const traces = [{
          x: res.eigenvalues.map((_, i) => i + 1),
          y: res.explained_variance_ratio.map(v => v * 100),
          mode: "lines+markers",
          name: "Individual Variance",
          line: { color: "#1976d2", width: 2 },
          marker: { size: 8 }
        }];

        if (res.cumulative_variance && res.cumulative_variance.length) {
          traces.push({
            x: res.eigenvalues.map((_, i) => i + 1),
            y: res.cumulative_variance.map(v => v * 100),
            mode: "lines+markers",
            name: "Cumulative Variance",
            line: { color: "#d32f2f", width: 2, dash: "dash" },
            marker: { size: 8 }
          });
        }

        const layout = {
          title: "Explained Variance",
          xaxis: { title: "Principal Component" },
          yaxis: { title: "Variance (%)", range: [0, 105] },
          plot_bgcolor: "#f5f5f5",
          paper_bgcolor: "white",
          showlegend: true
        };

        Plotly.newPlot("qpcaScreePlot", traces, layout);
        log('✅ Variance plot created');
      } catch(e) {
        logError('Failed to create variance plot:', e);
      }
    }

    // Plot 3: Density Matrix Heatmap
    if (res.density_matrix && document.getElementById("qpcaDensityPlot")) {
      try {
        const absMatrix = res.density_matrix.map(row => 
          row.map(val => Math.abs(val))
        );

        const trace = {
          z: absMatrix,
          type: "heatmap",
          colorscale: "Viridis",
          colorbar: { title: "Magnitude" }
        };

        const layout = {
          title: "Density Matrix (Magnitude)",
          xaxis: { title: "Feature Index" },
          yaxis: { title: "Feature Index" },
          paper_bgcolor: "white"
        };

        Plotly.newPlot("qpcaDensityPlot", [trace], layout);
        log('✅ Density matrix plot created');
      } catch(e) {
        logError('Failed to create density matrix plot:', e);
      }
    }

    // Plot 4: Classification Accuracy
    const accuracyPlotDiv = document.getElementById("qpcaAccuracyPlot");
    if (accuracyPlotDiv) {
      const m = res.evaluation_metrics;
      
      if (m && m.qpca_classification_accuracy !== undefined && 
          m.classical_pca_accuracy !== undefined) {
        try {
          const qpcaAcc = m.qpca_classification_accuracy * 100;
          const pcaAcc = m.classical_pca_accuracy * 100;

          const trace = {
            x: ['QPCA', 'Classical PCA'],
            y: [qpcaAcc, pcaAcc],
            type: "bar",
            marker: { 
              color: ['#4caf50', '#2196f3'],
              line: { color: ['#2e7d32', '#1565c0'], width: 2 }
            },
            text: [
              qpcaAcc.toFixed(2) + '%',
              pcaAcc.toFixed(2) + '%'
            ],
            textposition: "outside",
            textfont: { size: 14, weight: 'bold' }
          };

          const layout = {
            title: "Classification Accuracy (KNN, k=" + state.parameters.knn_neighbors + ")",
            yaxis: { 
              title: "Accuracy (%)", 
              range: [0, Math.max(qpcaAcc, pcaAcc) + 10] 
            },
            plot_bgcolor: "#f5f5f5",
            paper_bgcolor: "white"
          };

          Plotly.newPlot("qpcaAccuracyPlot", [trace], layout);
          $(accuracyPlotDiv).closest('.qpca-plot-container').show();
          log('✅ Accuracy comparison plot created');
        } catch(e) {
          logError('Failed to create accuracy plot:', e);
        }
      } else {
        $(accuracyPlotDiv).closest('.qpca-plot-container').hide();
        log('ℹ️ Accuracy plot hidden (no classification data)');
      }
    }

    log('✅ All plots completed');
  }

  // ============================================================
  // TOOLBOX INTEGRATION
  // ============================================================
  function addQPCAToToolbox() {
    try {
      if ($("#toolboxDivSingle .qpcaToolboxButton").length) {
        log('⚠️ QPCA button already exists in toolbox');
        return;
      }

      const qpcaButton = $("<div>")
        .addClass("gateButton qpcaToolboxButton")
        .css({
          width: "45px",
          height: "45px",
          border: "2px solid #00897b",
          backgroundColor: "#b2dfdb",
          borderRadius: "8px",
          margin: "8px auto",
          textAlign: "center",
          lineHeight: "42px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease"
        })
        .text("QPCA")
        .attr("title", "Quantum Principal Component Analysis")
        .hover(
          function() {
            $(this).css({ 
              backgroundColor: "#80cbc4",
              transform: "scale(1.05)"
            });
          },
          function() {
            $(this).css({ 
              backgroundColor: "#b2dfdb",
              transform: "scale(1)"
            });
          }
        )
        .click(function() {
          log('QPCA button clicked');
          if (typeof openCity === 'function') {
            try {
              openCity({ currentTarget: this }, 'qpcaPanel');
            } catch (e) {
              log('openCity failed, using fallback');
              $('#qpcaPanel').show();
            }
          } else {
            $('#qpcaPanel').show();
          }
        });

      $("#toolboxDivSingle").append(qpcaButton);
      log('✅ QPCA button added to toolbox');
    } catch (e) {
      logError('Failed to add QPCA button to toolbox:', e);
    }
  }

  // ============================================================
  // UI HELPERS
  // ============================================================
  function showLoading(message) {
    let $loading = $('#qpcaLoading');
    if (!$loading.length) {
      $loading = $('<div id="qpcaLoading">')
        .css({
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        })
        .html(`
          <div style="
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          ">
            <div class="spinner" style="
              border: 4px solid #f3f3f3;
              border-top: 4px solid #00897b;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 0 auto 15px;
            "></div>
            <p id="qpcaLoadingMessage" style="
              margin: 0;
              color: #333;
              font-size: 16px;
            ">${message}</p>
          </div>
        `)
        .appendTo('body');

      if (!$('#qpcaLoadingStyle').length) {
        $('<style id="qpcaLoadingStyle">')
          .text('@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }')
          .appendTo('head');
      }
    } else {
      $('#qpcaLoadingMessage').text(message);
    }
    $loading.show();
  }

  function hideLoading() {
    $('#qpcaLoading').hide();
  }

  function showError(message) {
    alert('❌ ' + message);
    logError(message);
  }

  // ============================================================
  // EXPORT FUNCTIONS FOR EXTERNAL USE
  // ============================================================
  window.QPCA = {
    init: initQPCA,
    runAnalysis: runQPCAAnalysis,
    runCSV: runCsvQPCA,
    displayResults: displayResults,
    state: state
  };

  log('✅ QPCA Frontend Module Loaded - Overall Statistical Summary Edition');

})();