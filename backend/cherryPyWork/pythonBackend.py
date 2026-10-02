
# import os
# import cherrypy
# import json
# import numpy as np
# import sys
# import traceback
# import io

# # === Fix Python Path ===
# backend_dir = os.path.dirname(os.path.abspath(__file__))
# sys.path.insert(0, backend_dir)
# sys.path.append("..")
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# from jsonClass import CircuitCreator

# # ========================================
# # Import QSVM Backend
# # ========================================
# try:
#     from qsvm_backend import (
#         qsvm_kernel_matrix,
#         qsvm_classify_points,
#         qsvm_from_dataset,
#         generate_kernel_surface
#     )
#     QSVM_AVAILABLE = True
#     print("✅ QSVM backend loaded")
# except ImportError as e:
#     QSVM_AVAILABLE = False
#     print(f"⚠️ QSVM unavailable: {e}")

# # ========================================
# # Import QPCA Backend with Interactive Parameters
# # ========================================
# try:
#     from qpca_backend_interactive import (
#         qpca_from_dataset, 
#         qpca_analyze, 
#         ComputeQPCAFromCSV
#     )
#     QPCA_AVAILABLE = True
#     print("✅ QPCA backend loaded with interactive parameters!")
# except ImportError as e:
#     QPCA_AVAILABLE = False
#     print(f"⚠️ QPCA unavailable: {e}")
#     print("   Make sure qutip and scikit-learn are installed:")
#     print("   pip install qutip scikit-learn pandas scipy")


# def make_json_serializable(obj):
#     """Convert numpy types to native Python types"""
#     if isinstance(obj, np.integer):
#         return int(obj)
#     elif isinstance(obj, np.floating):
#         return float(obj)
#     elif isinstance(obj, np.ndarray):
#         return obj.tolist()
#     elif isinstance(obj, dict):
#         return {key: make_json_serializable(value) for key, value in obj.items()}
#     elif isinstance(obj, (list, tuple)):
#         return [make_json_serializable(item) for item in obj]
#     return obj


# class BarcQBackend:
#     """Unified backend handling circuits, QSVM, and QPCA with interactive parameters"""

#     @cherrypy.expose
#     def index(self):
#         """Serve main HTML page"""
#         cherrypy.response.headers["Content-Type"] = "text/html; charset=utf-8"
#         html_path = os.path.join(
#             os.path.dirname(__file__),
#             "..", "..", "frontend", "GridInterface", "samples", "gridSkeleton.html"
#         )
#         try:
#             with open(html_path, encoding="utf-8") as f:
#                 return f.read().encode("utf-8")
#         except Exception as e:
#             return f"<h3>Error loading HTML: {e}</h3>".encode("utf-8")

#     # ========================================
#     # QPCA ENDPOINT WITH INTERACTIVE PARAMETERS
#     # ========================================
#     @cherrypy.expose
#     @cherrypy.tools.json_in()
#     @cherrypy.tools.json_out()
#     def ComputeQPCA(self):
#         """
#         POST /ComputeQPCA
#         Handles: {"dataset": "iris", "n_components": 2, "test_size": 0.3, "knn_neighbors": 5, "random_state": 42}
#         OR: {"data": [[...],[...]]}
#         """
#         try:
#             print("=" * 60)
#             print("🔬 QPCA Request Received")
#             print("=" * 60)

#             if not QPCA_AVAILABLE:
#                 return {
#                     "success": False,
#                     "error": "QPCA backend not available. Install: pip install qutip scikit-learn scipy"
#                 }

#             payload = cherrypy.request.json
#             print("📦 Payload:", json.dumps(payload, indent=2)[:200])

#             # Dataset mode WITH INTERACTIVE PARAMETERS
#             if "dataset" in payload:
#                 dataset = payload["dataset"]
#                 n_components = int(payload.get("n_components", 2))
#                 test_size = float(payload.get("test_size", 0.3))
#                 knn_neighbors = int(payload.get("knn_neighbors", 5))
#                 random_state = int(payload.get("random_state", 42))
                
#                 print(f"📊 Running QPCA on dataset: {dataset}")
#                 print(f"   Parameters: n_components={n_components}, test_size={test_size}, "
#                       f"knn_neighbors={knn_neighbors}, random_state={random_state}")
                
#                 result = qpca_from_dataset(
#                     dataset, 
#                     n_components, 
#                     test_size, 
#                     knn_neighbors, 
#                     random_state
#                 )
                
#                 if result.get("success"):
#                     print("✅ QPCA dataset analysis complete")
#                     print(f"   QPCA Accuracy: {result.get('evaluation_metrics', {}).get('qpca_classification_accuracy', 0)*100:.2f}%")
#                 else:
#                     print(f"❌ QPCA failed: {result.get('error')}")
                
#                 return make_json_serializable(result)

#             # Manual data mode
#             if "data" in payload:
#                 data = payload["data"]
#                 if not data:
#                     return {"success": False, "error": "Empty data array"}

#                 data_np = np.array(data)
#                 if data_np.ndim != 2:
#                     return {"success": False, "error": "Data must be 2D"}

#                 print(f"📊 Manual QPCA: {data_np.shape}")
                
#                 result = qpca_analyze(data, payload.get("n_components"))
                
#                 if result.get("success"):
#                     print("✅ Manual QPCA analysis complete")
#                 else:
#                     print(f"❌ QPCA failed: {result.get('error')}")
                
#                 return make_json_serializable(result)

#             return {"success": False, "error": "No valid input (need 'dataset' or 'data')"}

#         except Exception as e:
#             print(f"❌ QPCA Error: {str(e)}")
#             traceback.print_exc()
#             return {
#                 "success": False,
#                 "error": str(e),
#                 "traceback": traceback.format_exc()
#             }

#     # ========================================
#     # QPCA CSV UPLOAD ENDPOINT WITH INTERACTIVE PARAMETERS
#     # ========================================
#     @cherrypy.expose
#     @cherrypy.tools.json_out()
#     def ComputeQPCAFromCSV(self, file, n_components=None, test_size=None, 
#                            knn_neighbors=None, random_state=None):
#         """
#         POST /ComputeQPCAFromCSV (multipart/form-data)
#         Handles CSV file upload for QPCA with interactive parameters
        
#         CRITICAL: FormData fields come as separate parameters!
#         """
#         try:
#             print("=" * 60)
#             print("📄 QPCA CSV Upload Received")
#             print("=" * 60)

#             if not QPCA_AVAILABLE:
#                 return {
#                     "success": False,
#                     "error": "QPCA backend not available"
#                 }

#             # Get filename
#             filename = file.filename if hasattr(file, 'filename') else 'upload.csv'
            
#             # Read file content
#             file_content = file.file.read() if hasattr(file, 'file') else file.read()
            
#             # Convert parameters (they come as strings from FormData!)
#             n_components_int = int(n_components) if n_components else None
#             test_size_float = float(test_size) if test_size else None
#             knn_neighbors_int = int(knn_neighbors) if knn_neighbors else None
#             random_state_int = int(random_state) if random_state else None
            
#             print(f"📊 CSV: {filename}")
#             print(f"   Parameters: n_components={n_components_int}, test_size={test_size_float}, "
#                   f"knn_neighbors={knn_neighbors_int}, random_state={random_state_int}")

#             # Call backend function with all parameters
#             result = ComputeQPCAFromCSV(
#                 file_content, 
#                 filename=filename,
#                 n_components=n_components_int,
#                 test_size=test_size_float,
#                 knn_neighbors=knn_neighbors_int,
#                 random_state=random_state_int
#             )

#             if result.get("success"):
#                 print("✅ CSV QPCA complete")
#             else:
#                 print(f"❌ CSV QPCA failed: {result.get('error')}")
            
#             return make_json_serializable(result)

#         except Exception as e:
#             print(f"❌ CSV QPCA Error: {str(e)}")
#             traceback.print_exc()
#             return {
#                 "success": False,
#                 "error": str(e),
#                 "traceback": traceback.format_exc()
#             }

#     # ========================================
#     # MAIN CODE GENERATOR (Circuits + QSVM)
#     # ========================================
#     @cherrypy.expose
#     def CodeGenerator(self):
#         """
#         POST /CodeGenerator
#         Handles: Circuit simulation OR QSVM requests
#         """
#         cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
#         cherrypy.response.headers["Content-Type"] = "application/json; charset=utf-8"

#         try:
#             body = cherrypy.request.body.read().decode("utf-8")
#             if not body.strip():
#                 return json.dumps({"error": "Empty request body"}).encode("utf-8")

#             data = json.loads(body)
#             print("📩 CodeGenerator received:", json.dumps(data, indent=2)[:500])

#             # Route to QSVM handler
#             if isinstance(data, dict) and data.get("gate") == "QSVM":
#                 return self._handle_qsvm(data)

#             # Route to circuit handler
#             if isinstance(data, dict) and "instructions" in data:
#                 return self._handle_circuit(data)

#             return json.dumps({"error": "Unrecognized request format"}).encode("utf-8")

#         except Exception as e:
#             traceback.print_exc()
#             return json.dumps({"error": str(e)}).encode("utf-8")

#     # ========================================
#     # QSVM HANDLER
#     # ========================================
#     def _handle_qsvm(self, data):
#         """Process QSVM requests - WITH COMPARISON SUPPORT"""
#         if not QSVM_AVAILABLE:
#             return json.dumps({
#                 "error": "QSVM backend unavailable. Install: pip install qutip scikit-learn pandas"
#             }).encode("utf-8")

#         try:
#             params = data.get("params", {})
#             print(f"🔮 QSVM params: {params}")
            
#             # Extract kernel type (default to amplitude)
#             kernel_type = params.get("kernel_type", "amplitude")
            
#             # ============================================================
#             # MODE 1: COMPARE ALL KERNELS
#             # ============================================================
#             if params.get("compare_all"):
#                 dataset_name = params.get("dataset", "iris")
#                 print(f"📊 COMPARING ALL KERNELS on {dataset_name}")
                
#                 result = qsvm_from_dataset(
#                     dataset_name, 
#                     kernel_type=kernel_type,
#                     compare_all=True
#                 )
                
#                 print(f"✅ Comparison complete: {result.get('dataset', 'unknown')}")
#                 print(f"   Comparisons: {len(result.get('comparisons', []))} kernels")
                
#                 return json.dumps(make_json_serializable(result)).encode("utf-8")
            
#             # ============================================================
#             # MODE 2: SINGLE KERNEL - DATASET
#             # ============================================================
#             elif "dataset" in params:
#                 dataset_name = params["dataset"]
#                 print(f"🔮 QSVM Dataset: {dataset_name} with {kernel_type} kernel")
                
#                 result = qsvm_from_dataset(
#                     dataset_name, 
#                     kernel_type=kernel_type,
#                     compare_all=False
#                 )
                
#                 print(f"✅ QSVM complete: accuracy={result.get('qsvm_accuracy', 0):.3f}")
#                 return json.dumps(make_json_serializable(result)).encode("utf-8")
            
#             # ============================================================
#             # MODE 3: CSV UPLOAD
#             # ============================================================
#             elif "csv_data" in params:
#                 csv_data = params["csv_data"]
#                 print(f"📗 QSVM CSV Upload with {kernel_type} kernel")
                
#                 result = qsvm_from_dataset(
#                     csv_data, 
#                     kernel_type=kernel_type,
#                     compare_all=False
#                 )
                
#                 return json.dumps(make_json_serializable(result)).encode("utf-8")
            
#             # ============================================================
#             # MODE 4: MANUAL TEST POINTS
#             # ============================================================
#             else:
#                 x1 = float(params.get("x1", 0.0))
#                 x2 = float(params.get("x2", 0.0))
#                 z1 = float(params.get("z1", 0.0))
#                 z2 = float(params.get("z2", 0.0))
                
#                 print(f"🔮 QSVM Manual: x=({x1},{x2}), z=({z1},{z2}) with {kernel_type}")
                
#                 train_X = np.array([[0.0, 0.0], [0.0, 1.0], [1.0, 0.0], [1.0, 1.0]])
#                 train_y = np.array([1, 1, -1, -1])
#                 test_points = [np.array([x1, x2]), np.array([z1, z2])]
                
#                 # Use kernel_type parameter
#                 K = qsvm_kernel_matrix(train_X, kernel_type=kernel_type)
#                 predictions, probabilities = qsvm_classify_points(
#                     train_X, train_y, test_points, kernel_type=kernel_type
#                 )
#                 surface_data = generate_kernel_surface(
#                     kernel_type=kernel_type, resolution=20
#                 )
                
#                 qutip_code = f"""# QSVM Manual Test - {kernel_type.upper()} Kernel
# import numpy as np
# from qsvm_backend import qsvm_kernel_matrix, qsvm_classify_points

# train_X = np.array([[0.0, 0.0], [0.0, 1.0], [1.0, 0.0], [1.0, 1.0]])
# train_y = np.array([1, 1, -1, -1])
# test_points = [np.array([{x1}, {x2}]), np.array([{z1}, {z2}])]

# # Compute kernel matrix with {kernel_type} encoding
# K = qsvm_kernel_matrix(train_X, kernel_type='{kernel_type}')
# print("Kernel Matrix:", K)

# # Classify test points
# predictions, probs = qsvm_classify_points(
#     train_X, train_y, test_points, kernel_type='{kernel_type}'
# )
# print("Predictions:", predictions)
# print("Probabilities:", probs)
# """
                
#                 result = {
#                     "xdata": ["Point 1", "Point 2"],
#                     "ydata": [float(probabilities[0]), float(probabilities[1])],
#                     "kernel": K.tolist(),
#                     "predictions": [int(predictions[0]), int(predictions[1])],
#                     "probabilities": [float(probabilities[0]), float(probabilities[1])],
#                     "surface_data": make_json_serializable(surface_data),
#                     "qutip": qutip_code,
#                     "kernel_type": kernel_type,
#                     "test_points": {
#                         "point1": {"x": float(x1), "y": float(x2), "class": int(predictions[0])},
#                         "point2": {"x": float(z1), "y": float(z2), "class": int(predictions[1])}
#                     }
#                 }
                
#                 return json.dumps(result).encode("utf-8")

#         except Exception as e:
#             print(f"❌ QSVM Error: {str(e)}")
#             traceback.print_exc()
#             return json.dumps({"error": f"QSVM Error: {str(e)}"}).encode("utf-8")

#     # ========================================
#     # CIRCUIT HANDLER
#     # ========================================
#     def _handle_circuit(self, gateJson):
#         """Process quantum circuit simulation"""
#         try:
#             print("⚙️ Circuit simulation starting...")
#             json_str = gateJson if isinstance(gateJson, str) else json.dumps(gateJson)
#             data = json.loads(json_str)
            
#             if not data.get("instructions"):
#                 return json.dumps({
#                     "xdata": ["0b0"],
#                     "ydata": [1.0],
#                     "qutip": "# Empty circuit"
#                 }).encode("utf-8")

#             n_qubits = self._find_num_input_lines(json_str) + 1
#             print(f"   Qubits: {n_qubits}")
            
#             # Validate gate target bits
#             for gate in data.get("instructions", []):
#                 tgt_bits = gate.get("tgt_bits", [])
#                 if isinstance(tgt_bits, str):
#                     tgt_bits = [int(x) for x in tgt_bits.split(",") if x.strip()]
#                 elif isinstance(tgt_bits, int):
#                     tgt_bits = [tgt_bits]
                
#                 # Check if any target bit is >= n_qubits
#                 for bit in tgt_bits:
#                     if bit >= n_qubits:
#                         return json.dumps({
#                             "error": f"Gate '{gate.get('name')}' targets qubit {bit} but circuit only has {n_qubits} qubit(s). Please add more input lines to the grid."
#                         }).encode("utf-8")
            
#             cc = CircuitCreator(json_str, n_qubits, False)
#             output = cc.Apply()
            
#             yList = output[:, 0]
#             ySquared = [float(abs(item) ** 2) for item in yList]
#             xLabels = [bin(val) for val in range(2 ** n_qubits)]
            
#             response = {
#                 "xdata": xLabels,
#                 "ydata": ySquared,
#                 "qutip": "# Circuit simulation complete"
#             }
            
#             print("✅ Circuit complete")
#             return json.dumps(response).encode("utf-8")

#         except ValueError as ve:
#             error_msg = str(ve)
#             print(f"❌ Circuit validation error: {error_msg}")
#             if "Targets must be smaller" in error_msg:
#                 return json.dumps({
#                     "error": "Circuit configuration error: One or more gates are targeting qubits that don't exist. Please ensure all gates are placed on valid qubit lines in the grid."
#                 }).encode("utf-8")
#             return json.dumps({"error": error_msg}).encode("utf-8")
#         except Exception as e:
#             traceback.print_exc()
#             return json.dumps({"error": f"Circuit simulation failed: {str(e)}"}).encode("utf-8")

#     def _find_num_input_lines(self, gateJson):
#         """Find number of qubits in circuit"""
#         try:
#             json_dict = json.loads(gateJson)
#             ctl_bits, tgt_bits = [], []
            
#             for g in json_dict.get("instructions", []):
#                 if g.get("ctl_bits") and g["ctl_bits"] != "None":
#                     if isinstance(g["ctl_bits"], str):
#                         g["ctl_bits"] = list(map(int, g["ctl_bits"].split(",")))
#                     ctl_bits.extend(g["ctl_bits"])
                
#                 if g.get("tgt_bits"):
#                     if isinstance(g["tgt_bits"], str):
#                         g["tgt_bits"] = list(map(int, g["tgt_bits"].split(",")))
#                     tgt_bits.extend(g["tgt_bits"])
            
#             return max(ctl_bits + tgt_bits) if (ctl_bits or tgt_bits) else 0
#         except:
#             return 0


# # ========================================
# # SERVER STARTUP
# # ========================================
# if __name__ == "__main__":
#     frontend_dir = os.path.join(
#         os.path.dirname(__file__), 
#         "..", "..", "frontend"
#     )
    
#     cherrypy.config.update({
#         "server.socket_host": "127.0.0.1",
#         "server.socket_port": 8080,
#         "tools.encode.on": True,
#         "tools.encode.encoding": "utf-8",
#         "tools.response_headers.on": True,
#         "tools.response_headers.headers": [
#             ("Access-Control-Allow-Origin", "*"),
#             ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
#             ("Access-Control-Allow-Headers", "Content-Type")
#         ]
#     })
    
#     print("=" * 70)
#     print("🚀 BarcQ Unified Quantum Simulator - INTERACTIVE EDITION")
#     print("=" * 70)
#     print("🌐 URL: http://127.0.0.1:8080/")
#     print(f"📦 QSVM:  {'✅ Enabled' if QSVM_AVAILABLE else '❌ Disabled'}")
#     print(f"📦 QPCA:  {'✅ Enabled with Interactive Parameters!' if QPCA_AVAILABLE else '❌ Disabled'}")
#     print("=" * 70)
#     print("📡 Endpoints:")
#     print("   POST /CodeGenerator      → Circuit simulation & QSVM")
#     print("   POST /ComputeQPCA        → QPCA analysis (with parameters!)")
#     print("   POST /ComputeQPCAFromCSV → QPCA CSV upload (with parameters!)")
#     print("=" * 70)
    
#     if QPCA_AVAILABLE:
#         print("\n🎛️ QPCA Interactive Parameters:")
#         print("   • Components (1-10)")
#         print("   • Test Size (10%-50%)")
#         print("   • KNN Neighbors (1-15)")
#         print("   • Random Seed (0-9999)")
#         print("   • Auto-recompute toggle")
#         print()
#     else:
#         print("\n⚠️ QPCA is not available. To enable it:")
#         print("   pip install qutip scikit-learn pandas scipy")
#         print()
    
#     cherrypy.quickstart(BarcQBackend(), "/", {
#         "/": {
#             "tools.staticdir.on": True,
#             "tools.staticdir.dir": frontend_dir,
#             "tools.staticdir.index": "GridInterface/samples/gridSkeleton.html",
#         }
#     })

import os
import cherrypy
import json
import numpy as np
import sys
import traceback
import io

# === Fix Python Path ===
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)
sys.path.append("..")
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from jsonClass import CircuitCreator

# ========================================
# Import QSVM Backend
# ========================================
try:
    from qsvm_backend import (
        qsvm_kernel_matrix,
        qsvm_classify_points,
        qsvm_from_dataset,
        generate_kernel_surface
    )
    QSVM_AVAILABLE = True
    print("✅ QSVM backend loaded")
except ImportError as e:
    QSVM_AVAILABLE = False
    print(f"⚠️ QSVM unavailable: {e}")

# ========================================
# Import QPCA Backend
# ========================================
try:
    from qpca_backend import (
        qpca_from_dataset,
        qpca_analyze,
        ComputeQPCAFromCSV
    )
    QPCA_AVAILABLE = True
    print("✅ QPCA backend loaded")
except ImportError as e:
    QPCA_AVAILABLE = False
    print(f"⚠️ QPCA unavailable: {e}")


def make_json_serializable(obj):
    """Convert numpy types to native Python types"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: make_json_serializable(value) for key, value in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [make_json_serializable(item) for item in obj]
    return obj


class BarcQBackend:
    """Unified backend handling circuits, QSVM, and QPCA"""

    @cherrypy.expose
    def index(self):
        """Serve main HTML page"""
        cherrypy.response.headers["Content-Type"] = "text/html; charset=utf-8"
        html_path = os.path.join(
            os.path.dirname(__file__),
            "..", "..", "frontend", "GridInterface", "samples", "gridSkeleton.html"
        )
        try:
            with open(html_path, encoding="utf-8") as f:
                return f.read().encode("utf-8")
        except Exception as e:
            return f"<h3>Error loading HTML: {e}</h3>".encode("utf-8")

    # ========================================
    # QPCA ENDPOINT
    # ========================================
    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def ComputeQPCA(self):
        """Handles QPCA with datasets or manual data input"""
        try:
            print("=" * 60)
            print("🔬 QPCA Request Received")
            print("=" * 60)

            if not QPCA_AVAILABLE:
                return {"success": False, "error": "QPCA backend not available."}

            payload = cherrypy.request.json
            print("📦 Payload:", json.dumps(payload, indent=2)[:200])

            # Dataset mode
            if "dataset" in payload:
                dataset = payload["dataset"]
                n_components = int(payload.get("n_components", 2))
                test_size = float(payload.get("test_size", 0.3))
                knn_neighbors = int(payload.get("knn_neighbors", 5))
                random_state = int(payload.get("random_state", 42))

                print(f"📊 Running QPCA on dataset: {dataset}")
                result = qpca_from_dataset(
                    dataset, n_components, test_size, knn_neighbors, random_state
                )
                return make_json_serializable(result)

            # Manual data mode
            if "data" in payload:
                data = payload["data"]
                if not data:
                    return {"success": False, "error": "Empty data array"}
                data_np = np.array(data)
                if data_np.ndim != 2:
                    return {"success": False, "error": "Data must be 2D"}
                result = qpca_analyze(data, payload.get("n_components"))
                return make_json_serializable(result)

            return {"success": False, "error": "No valid QPCA input"}

        except Exception as e:
            traceback.print_exc()
            return {"success": False, "error": str(e)}

    # ========================================
    # QPCA CSV ENDPOINT
    # ========================================
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def ComputeQPCAFromCSV(self, file, n_components=None, test_size=None,
                           knn_neighbors=None, random_state=None):
        """Handles CSV QPCA Upload"""
        try:
            print("=" * 60)
            print("📄 QPCA CSV Upload Received")
            print("=" * 60)

            if not QPCA_AVAILABLE:
                return {"success": False, "error": "QPCA backend not available"}

            filename = file.filename if hasattr(file, "filename") else "upload.csv"
            file_content = file.file.read() if hasattr(file, "file") else file.read()

            n_components_int = int(n_components) if n_components else None
            test_size_float = float(test_size) if test_size else None
            knn_neighbors_int = int(knn_neighbors) if knn_neighbors else None
            random_state_int = int(random_state) if random_state else None

            result = ComputeQPCAFromCSV(
                file_content,
                filename=filename,
                n_components=n_components_int,
                test_size=test_size_float,
                knn_neighbors=knn_neighbors_int,
                random_state=random_state_int
            )
            return make_json_serializable(result)

        except Exception as e:
            traceback.print_exc()
            return {"success": False, "error": str(e)}

    # ========================================
    # CODE GENERATOR HANDLER
    # ========================================
    @cherrypy.expose
    def CodeGenerator(self):
        """Main handler for QSVM & Circuits"""
        cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
        cherrypy.response.headers["Content-Type"] = "application/json; charset=utf-8"

        try:
            body = cherrypy.request.body.read().decode("utf-8")
            if not body.strip():
                return json.dumps({"error": "Empty request body"}).encode("utf-8")

            data = json.loads(body)
            print("📩 CodeGenerator received:", json.dumps(data, indent=2)[:400])

            if data.get("gate") == "QSVM":
                return self._handle_qsvm(data)

            if "instructions" in data:
                return self._handle_circuit(data)

            return json.dumps({"error": "Unrecognized request format"}).encode("utf-8")

        except Exception as e:
            traceback.print_exc()
            return json.dumps({"error": str(e)}).encode("utf-8")

    # ========================================
    # QSVM HANDLER - CORRECTLY INDENTED
    # ========================================
    def _handle_qsvm(self, data):
        """Process QSVM requests - FIXED VERSION"""
        if not QSVM_AVAILABLE:
            return json.dumps({
                "error": "QSVM backend unavailable. Install: pip install qutip scikit-learn pandas"
            }).encode("utf-8")

        try:
            params = data.get("params", {})
            print(f"🔮 QSVM params received: {params}")
            
            # Extract kernel type (default to amplitude)
            kernel_type = params.get("kernel_type", "amplitude")
            
            # ============================================================
            # MODE 1: COMPARE ALL KERNELS
            # ============================================================
            if params.get("compare_all"):
                dataset_name = params.get("dataset", "iris")
                print(f"📊 COMPARING ALL KERNELS on {dataset_name}")
                
                result = qsvm_from_dataset(
                    dataset_name, 
                    kernel_type=kernel_type,
                    compare_all=True
                )
                
                print(f"✅ Comparison complete: {result.get('dataset', 'unknown')}")
                return json.dumps(make_json_serializable(result)).encode("utf-8")
            
            # ============================================================
            # MODE 2: DATASET MODE
            # ============================================================
            elif "dataset" in params:
                dataset_name = params["dataset"]
                print(f"🔮 QSVM Dataset: {dataset_name} with {kernel_type} kernel")
                
                result = qsvm_from_dataset(
                    dataset_name, 
                    kernel_type=kernel_type,
                    compare_all=False
                )
                
                print(f"✅ QSVM complete: accuracy={result.get('qsvm_accuracy', 0):.3f}")
                return json.dumps(make_json_serializable(result)).encode("utf-8")
            
            # ============================================================
            # MODE 3: CSV UPLOAD
            # ============================================================
            elif "csv_data" in params:
                csv_data = params["csv_data"]
                print(f"📗 QSVM CSV Upload with {kernel_type} kernel")
                
                result = qsvm_from_dataset(
                    csv_data, 
                    kernel_type=kernel_type,
                    compare_all=False
                )
                
                return json.dumps(make_json_serializable(result)).encode("utf-8")
            
            # ============================================================
            # MODE 4: MANUAL TEST POINTS - FIXED
            # ============================================================
            else:
                # Check if we have manual point parameters
                if not all(k in params for k in ["x1", "x2", "z1", "z2"]):
                    return json.dumps({
                        "error": "Manual mode requires x1, x2, z1, z2 parameters"
                    }).encode("utf-8")
                
                x1 = float(params.get("x1", 0.0))
                x2 = float(params.get("x2", 0.0))
                z1 = float(params.get("z1", 0.0))
                z2 = float(params.get("z2", 0.0))
                
                print(f"📍 QSVM Manual Mode:")
                print(f"   Point 1 (x): ({x1}, {x2})")
                print(f"   Point 2 (z): ({z1}, {z2})")
                print(f"   Kernel: {kernel_type}")
                
                # Training data (simple 2D XOR-like problem)
                train_X = np.array([[0.0, 0.0], [0.0, 1.0], [1.0, 0.0], [1.0, 1.0]])
                train_y = np.array([1, 1, -1, -1])
                test_points = [np.array([x1, x2]), np.array([z1, z2])]
                
                # Compute kernel matrix
                K = qsvm_kernel_matrix(train_X, kernel_type=kernel_type)
                print(f"✅ Kernel matrix computed: shape {K.shape}")
                
                # Classify test points
                predictions, probabilities = qsvm_classify_points(
                    train_X, train_y, test_points, kernel_type=kernel_type
                )
                print(f"✅ Predictions: {predictions}")
                print(f"✅ Probabilities: {probabilities}")
                
                # Generate kernel surface for visualization
                surface_data = generate_kernel_surface(
                    kernel_type=kernel_type, resolution=20
                )
                
                # Generate QuTiP code
                qutip_code = f"""# QSVM Manual Test - {kernel_type.upper()} Kernel
import numpy as np
from qsvm_backend import qsvm_kernel_matrix, qsvm_classify_points

# Training data (XOR-like problem)
train_X = np.array([[0.0, 0.0], [0.0, 1.0], [1.0, 0.0], [1.0, 1.0]])
train_y = np.array([1, 1, -1, -1])

# Test points
test_points = [
    np.array([{x1}, {x2}]),  # Point 1
    np.array([{z1}, {z2}])   # Point 2
]

# Compute kernel matrix with {kernel_type} encoding
K = qsvm_kernel_matrix(train_X, kernel_type='{kernel_type}')
print("Kernel Matrix:\\n", K)

# Classify test points
predictions, probs = qsvm_classify_points(
    train_X, train_y, test_points, kernel_type='{kernel_type}'
)
print("\\nPredictions:", predictions)
print("Probabilities:", probs)
"""
                
                # Build response
                result = {
                    "success": True,
                    "kernel": K.tolist(),
                    "predictions": [int(predictions[0]), int(predictions[1])],
                    "probabilities": [float(probabilities[0]), float(probabilities[1])],
                    "surface_data": make_json_serializable(surface_data),
                    "qutip": qutip_code,
                    "qutip_code": qutip_code,
                    "kernel_type": kernel_type,
                    "test_points": {
                        "point1": {
                            "x": float(x1), 
                            "y": float(x2), 
                            "class": int(predictions[0]),
                            "probability": float(probabilities[0])
                        },
                        "point2": {
                            "x": float(z1), 
                            "y": float(z2), 
                            "class": int(predictions[1]),
                            "probability": float(probabilities[1])
                        }
                    },
                    "training_data": {
                        "X": train_X.tolist(),
                        "y": train_y.tolist()
                    }
                }
                
                print(f"✅ Manual mode complete")
                return json.dumps(make_json_serializable(result)).encode("utf-8")

        except Exception as e:
            print(f"❌ QSVM Error: {str(e)}")
            traceback.print_exc()
            return json.dumps({
                "error": f"QSVM Error: {str(e)}",
                "traceback": traceback.format_exc()
            }).encode("utf-8")

    # ========================================
    # CIRCUIT HANDLER
    # ========================================
    def _handle_circuit(self, gateJson):
        """Process quantum circuit simulation"""
        try:
            data = json.loads(gateJson if isinstance(gateJson, str) else json.dumps(gateJson))

            # Detect algorithm gates like QSVM
            for gate in data.get("instructions", []):
                if gate.get("type") == "algorithm" and gate.get("name") == "QSVM":
                    print("🔮 Detected QSVM algorithm gate in circuit")
                    qsvm_config = gate.get("qsvm_config", {})
                    params = {
                        "dataset": qsvm_config.get("dataset", "iris"),
                        "kernel_type": qsvm_config.get("kernel_type", "amplitude"),
                        "split": qsvm_config.get("split", 0.7)
                    }
                    return self._handle_qsvm({"params": params})

            # Continue with standard quantum circuit simulation
            if not data.get("instructions"):
                return json.dumps({
                    "xdata": ["0b0"],
                    "ydata": [1.0],
                    "qutip": "# Empty circuit"
                }).encode("utf-8")

            n_qubits = self._find_num_input_lines(json.dumps(data)) + 1
            print(f"⚙️ Running circuit simulation with {n_qubits} qubits")

            cc = CircuitCreator(json.dumps(data), n_qubits, False)
            output = cc.Apply()

            yList = output[:, 0]
            ySquared = [float(abs(item) ** 2) for item in yList]
            xLabels = [bin(val) for val in range(2 ** n_qubits)]

            return json.dumps({
                "xdata": xLabels,
                "ydata": ySquared,
                "qutip": "# Circuit simulation complete"
            }).encode("utf-8")

        except Exception as e:
            traceback.print_exc()
            return json.dumps({"error": f"Circuit simulation failed: {str(e)}"}).encode("utf-8")

    def _find_num_input_lines(self, gateJson):
        """Find number of qubits in circuit"""
        try:
            json_dict = json.loads(gateJson)
            ctl_bits, tgt_bits = [], []
            for g in json_dict.get("instructions", []):
                if g.get("ctl_bits"):
                    ctl_bits += [int(x) for x in str(g["ctl_bits"]).split(",") if x.strip()]
                if g.get("tgt_bits"):
                    tgt_bits += [int(x) for x in str(g["tgt_bits"]).split(",") if x.strip()]
            return max(ctl_bits + tgt_bits) if (ctl_bits or tgt_bits) else 0
        except:
            return 0


# ========================================
# SERVER STARTUP
# ========================================
if __name__ == "__main__":
    frontend_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend")

    cherrypy.config.update({
        "server.socket_host": "127.0.0.1",
        "server.socket_port": 8080,
        "tools.encode.on": True,
        "tools.encode.encoding": "utf-8",
        "tools.response_headers.on": True,
        "tools.response_headers.headers": [
            ("Access-Control-Allow-Origin", "*"),
            ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
            ("Access-Control-Allow-Headers", "Content-Type")
        ]
    })

    print("=" * 70)
    print("🚀 BarcQ Unified Quantum Simulator")
    print("=" * 70)
    print("🌐 URL: http://127.0.0.1:8080/")
    print(f"📦 QSVM:  {'✅ Enabled' if QSVM_AVAILABLE else '❌ Disabled'}")
    print(f"📦 QPCA:  {'✅ Enabled' if QPCA_AVAILABLE else '❌ Disabled'}")
    print("=" * 70)
    print("📡 Endpoints:")
    print("   POST /CodeGenerator      → Circuit simulation & QSVM")
    print("   POST /ComputeQPCA        → QPCA analysis")
    print("   POST /ComputeQPCAFromCSV → QPCA CSV upload")
    print("=" * 70)

    cherrypy.quickstart(BarcQBackend(), "/", {
        "/": {
            "tools.staticdir.on": True,
            "tools.staticdir.dir": frontend_dir,
            "tools.staticdir.index": "GridInterface/samples/gridSkeleton.html",
        }
    })