// ==========================================================
// BarcQ / Quantum Simulator - Gate Definitions with QSVM
// ==========================================================

var gateJson = {
  "instructions": [
    // --- Single Qubit Gates ---
    { "name": "H", "num_bits": 1, "ctl_enabled": 0, "ctl_bits": [], "tgt_bits": [0], "arg_enabled": 0, "arg_value": 0, "rowid": 0, "columnid": 0 },
    { "name": "X", "num_bits": 1, "ctl_enabled": 0, "ctl_bits": [], "tgt_bits": [0], "arg_enabled": 0, "arg_value": 0, "rowid": 0, "columnid": 0 },
    { "name": "Y", "num_bits": 1, "ctl_enabled": 0, "ctl_bits": [], "tgt_bits": [0], "arg_enabled": 0, "arg_value": 0, "rowid": 0, "columnid": 0 },
    { "name": "Z", "num_bits": 1, "ctl_enabled": 0, "ctl_bits": [], "tgt_bits": [0], "arg_enabled": 0, "arg_value": 0, "rowid": 0, "columnid": 0 },
    { "name": "RX", "num_bits": 1, "ctl_enabled": 0, "ctl_bits": [], "tgt_bits": [0], "arg_enabled": 1, "arg_value": "θ", "rowid": 0, "columnid": 0 },
    { "name": "RY", "num_bits": 1, "ctl_enabled": 0, "ctl_bits": [], "tgt_bits": [0], "arg_enabled": 1, "arg_value": "θ", "rowid": 0, "columnid": 0 },
    { "name": "RZ", "num_bits": 1, "ctl_enabled": 0, "ctl_bits": [], "tgt_bits": [0], "arg_enabled": 1, "arg_value": "θ", "rowid": 0, "columnid": 0 },
    { "name": "PHASEGATE", "num_bits": 1, "ctl_enabled": 0, "ctl_bits": [], "tgt_bits": [0], "arg_enabled": 1, "arg_value": "φ", "rowid": 0, "columnid": 0 },

    // --- Multi Qubit Gates ---
    { "name": "CNOT", "num_bits": 2, "ctl_enabled": 1, "ctl_bits": [0], "tgt_bits": [1], "arg_enabled": 0, "arg_value": 0, "rowid": 0, "columnid": 0 },
    { "name": "SWAP", "num_bits": 2, "ctl_enabled": 0, "ctl_bits": [], "tgt_bits": [0, 1], "arg_enabled": 0, "arg_value": 0, "rowid": 0, "columnid": 0 },
    { "name": "CCNOT", "num_bits": 3, "ctl_enabled": 1, "ctl_bits": [0, 1], "tgt_bits": [2], "arg_enabled": 0, "arg_value": 0, "rowid": 0, "columnid": 0 },

    // --- ⭐ QSVM Algorithm Gate ---
    { 
      "name": "QSVM", 
      "num_bits": 2, 
      "ctl_enabled": 0, 
      "ctl_bits": [], 
      "tgt_bits": [0, 1], 
      "arg_enabled": 0, 
      "arg_value": 0, 
      "rowid": 0, 
      "columnid": 0,
      "type": "algorithm",
      "hasPopup": true,
      "description": "Quantum Support Vector Machine"
    }
  ],
  "controlledgates": ["CRX", "CRY", "CRZ", "CPHASE"],
  "singequbitgates": ["H", "X", "Y", "Z", "RX", "RY", "RZ", "PHASEGATE"],
  "algorithmgates": ["QSVM"],
  "metadata": { "version": "3.0", "description": "Standard + QSVM Algorithm Gate" }
};

console.log("✅ gateJson initialized with QSVM algorithm gate");
