import os
import cherrypy
import json
import numpy as np
import sys

# === Add parent directory to path ===
sys.path.append("..")
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# === Import JSON Circuit Handler ===
from jsonClass import CircuitCreator, run_qpca

print("✅ Successfully imported CircuitCreator and run_qpca from jsonClass")

# === QPCA Backend with Dataset Support ===
try:
    from qpca_backend import qpca_from_dataset, qpca_analyze
    QPCA_DATASETS_AVAILABLE = True
    print("✅ QPCA dataset support available")
except ImportError as e:
    QPCA_DATASETS_AVAILABLE = False
    print(f"⚠️ QPCA dataset support not available: {e}")


def make_json_serializable(obj):
    """Convert numpy types to native Python types for JSON serialization"""
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


def generate_qpca_code(data, result):
    """Generate QuTiP code for QPCA visualization"""
    n_samples, n_features = data.shape
    
    code = f"""# Quantum Principal Component Analysis (QPCA)
# Dataset: {n_samples} samples × {n_features} features

import numpy as np
from qutip import *

# Input data
data = np.array({data.tolist()})
print("Data shape:", data.shape)

# Normalize data
norms = np.linalg.norm(data, axis=1, keepdims=True)
normalized_data = data / (norms + 1e-10)
print("Normalized data:\\n", normalized_data)

# Construct density matrix: ρ = (1/N) Σ |ψᵢ⟩⟨ψᵢ|
n_samples = data.shape[0]
n_features = data.shape[1]
density_matrix = np.zeros((n_features, n_features), dtype=complex)

for vec in normalized_data:
    density_matrix += np.outer(vec, vec.conj())

density_matrix /= n_samples
print("\\nDensity matrix:\\n", density_matrix)

# Convert to QuTiP Qobj
rho = Qobj(density_matrix)
print("\\nDensity matrix trace:", rho.tr())
print("Density matrix is Hermitian:", rho.isherm)

# Diagonalize to get principal components
eigenvalues, eigenvectors = rho.eigenstates()

# Sort by eigenvalue (descending)
sorted_indices = np.argsort(eigenvalues)[::-1]
eigenvalues_sorted = np.array([eigenvalues[i] for i in sorted_indices])
eigenvectors_sorted = [eigenvectors[i] for i in sorted_indices]

print("\\n=== QPCA Results ===")
print("Eigenvalues (Principal Component Strengths):")
for i, val in enumerate(eigenvalues_sorted):
    print(f"  PC{{i+1}}: {{val:.6f}}")

# Explained variance ratio
explained_variance = eigenvalues_sorted / eigenvalues_sorted.sum()
print("\\nExplained Variance Ratio:")
for i, ratio in enumerate(explained_variance):
    print(f"  PC{{i+1}}: {{ratio*100:.2f}}%")

print(f"\\nFirst {{min(2, len(eigenvalues_sorted))}} PCs explain " + 
      f"{{explained_variance[:min(2, len(eigenvalues_sorted))].sum()*100:.2f}}% of variance")

# Project data onto principal components
print("\\n=== Data Projections ===")
for i, data_point in enumerate(normalized_data):
    print(f"\\nSample {{i+1}}:")
    for j in range(min(2, len(eigenvectors_sorted))):
        pc = eigenvectors_sorted[j].full().flatten()
        projection = np.dot(data_point, pc)
        print(f"  Projection onto PC{{j+1}}: {{projection:.4f}}")
"""
    return code


# ==========================================================
# ✅ BarcQ Backend with QPCA Support
# ==========================================================
class BarcQBackend:

    @cherrypy.expose
    def index(self):
        """Serve frontend HTML"""
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

    # ======================================================
    # ✅ ENHANCED: QPCA Endpoint with Dataset Support
    # ======================================================
    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def ComputeQPCA(self):
        """
        Endpoint for Quantum Principal Component Analysis
        POST /ComputeQPCA
        
        Accepts:
        1. Manual data: {"data": [[1.0, 0.0], [0.8, 0.2], ...]}
        2. Dataset: {"dataset": "iris", "n_components": 3}
        3. CSV: {"csv_data": "x,y\\n1,2\\n3,4", "n_components": 2}
        """
        try:
            print("=" * 60)
            print("🔮 ComputeQPCA endpoint called")
            
            # Get input data from request
            input_data = cherrypy.request.json
            
            # === DATASET MODE ===
            if 'dataset' in input_data and QPCA_DATASETS_AVAILABLE:
                dataset_name = input_data.get('dataset')
                n_components = input_data.get('n_components', None)
                
                print(f"📊 Dataset mode: {dataset_name}")
                print(f"   Components: {n_components or 'auto'}")
                
                # Use qpca_backend for dataset processing
                result = qpca_from_dataset(dataset_name, n_components)
                result = make_json_serializable(result)
                result['success'] = True
                
                print(f"✅ QPCA dataset analysis complete")
                print(f"   Dataset: {result.get('dataset_info', {}).get('name', 'Unknown')}")
                print(f"   Samples: {result.get('dataset_info', {}).get('n_samples', 0)}")
                print(f"   Features: {result.get('dataset_info', {}).get('n_features', 0)}")
                print("=" * 60)
                
                return result
            
            # === CSV MODE ===
            elif 'csv_data' in input_data and QPCA_DATASETS_AVAILABLE:
                csv_data = input_data.get('csv_data')
                n_components = input_data.get('n_components', None)
                
                print(f"📗 CSV upload mode")
                
                result = qpca_from_dataset(csv_data, n_components)
                result = make_json_serializable(result)
                result['success'] = True
                
                print(f"✅ CSV QPCA analysis complete")
                print("=" * 60)
                
                return result
            
            # === MANUAL DATA MODE ===
            elif 'data' in input_data:
                data = input_data.get('data', [])
                
                if not data:
                    print("❌ No data provided")
                    return {
                        'error': 'No data provided',
                        'success': False
                    }
                
                # Convert to numpy array for validation
                data_array = np.array(data)
                
                if len(data_array.shape) != 2:
                    print(f"❌ Invalid data shape: {data_array.shape}")
                    return {
                        'error': 'Data must be a 2D array (list of lists)',
                        'success': False
                    }
                
                print(f"✅ Manual QPCA data received: {data_array.shape}")
                
                # Use enhanced backend if available
                if QPCA_DATASETS_AVAILABLE:
                    n_components = input_data.get('n_components', None)
                    result = qpca_analyze(data, n_components)
                    
                    # Add dataset info for manual mode
                    result["dataset_info"] = {
                        "name": "User Input",
                        "n_samples": len(data),
                        "n_features": len(data[0]) if data else 0
                    }
                    result["xdata"] = [f"PC{i+1}" for i in range(len(result["eigenvalues"]))]
                    result["ydata"] = result["eigenvalues"]
                    
                    # Generate QuTiP code
                    result['qutip'] = generate_qpca_code(data_array, result)
                    result = make_json_serializable(result)
                else:
                    # Fallback to original run_qpca from jsonClass
                    result = run_qpca(data)
                    result['qutip'] = generate_qpca_code(data_array, result)
                
                result['success'] = True
                
                print(f"✅ QPCA computed successfully")
                print(f"📈 Eigenvalues: {result.get('eigenvalues', [])[:5]}")
                print("=" * 60)
                
                return result
            
            else:
                print("❌ No valid input provided")
                return {
                    'error': 'No data, dataset, or csv_data provided',
                    'success': False
                }
            
        except Exception as e:
            print(f"❌ QPCA Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                'error': str(e),
                'success': False,
                'eigenvalues': [],
                'eigenvectors': [],
                'explained_variance_ratio': []
            }

    # ======================================================
    # ✅ Unified Code Handler (for circuit simulation)
    # ======================================================
    @cherrypy.expose
    def CodeGenerator(self):
        """Handle circuit simulation requests"""
        try:
            cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
            cherrypy.response.headers["Content-Type"] = "application/json; charset=utf-8"

            body = cherrypy.request.body.read().decode("utf-8")
            if not body.strip():
                return json.dumps({"error": "Empty request"}).encode("utf-8")

            data = json.loads(body)
            print("📩 Incoming circuit request")

            # Handle standard circuit requests
            if isinstance(data, dict) and "instructions" in data:
                return self._handle_circuit(data)

            return json.dumps({"error": "Invalid request type"}).encode("utf-8")

        except Exception as e:
            import traceback
            traceback.print_exc()
            return json.dumps({"error": f"Exception: {str(e)}"}).encode("utf-8")

    # ======================================================
    # ✅ QuTiP Circuit Simulation
    # ======================================================
    def _handle_circuit(self, gateJson):
        """Run circuit simulation using QuTiP"""
        try:
            print("⚙️ Running QuTiP circuit simulation...")
            json_str = gateJson if isinstance(gateJson, str) else json.dumps(gateJson)
            self.numOfInputLines = self._find_num_input_lines(json_str) + 1

            self.circCreator = CircuitCreator(json_str, self.numOfInputLines, False)
            self.output = self.circCreator.Apply()

            yList = self.output[:, 0]
            ySquared = [float(abs(item) ** 2) for item in yList]  # Ensure float
            xLabels = [bin(val) for val in range(2 ** self.numOfInputLines)]

            response = {
                "xdata": xLabels,
                "ydata": ySquared,
                "qutip": "# QuTiP circuit simulation executed successfully",
            }

            print("✅ Circuit simulation complete.")
            return json.dumps(response).encode("utf-8")

        except Exception as e:
            import traceback
            traceback.print_exc()
            return json.dumps({"error": f"Circuit simulation error: {str(e)}"}).encode("utf-8")

    # ======================================================
    # ✅ Helper – Find Number of Qubits
    # ======================================================
    def _find_num_input_lines(self, gateJson):
        json_dict = json.loads(gateJson)
        ctl_bits, tgt_bits = [], []
        for g in json_dict.get("instructions", []):
            if g.get("ctl_bits") == "None" or g.get("ctl_bits") is None:
                g["ctl_bits"] = None
            if g.get("ctl_bits"):
                if isinstance(g["ctl_bits"], str):
                    g["ctl_bits"] = list(map(int, g["ctl_bits"].split(",")))
                if isinstance(g["ctl_bits"], list):
                    ctl_bits += g["ctl_bits"]
            if g.get("tgt_bits"):
                if isinstance(g["tgt_bits"], str):
                    g["tgt_bits"] = list(map(int, g["tgt_bits"].split(",")))
                if isinstance(g["tgt_bits"], list):
                    tgt_bits += g["tgt_bits"]
        return max(ctl_bits + tgt_bits) if (ctl_bits or tgt_bits) else 0


# ==========================================================
# ✅ CherryPy Server Configuration
# ==========================================================
if __name__ == "__main__":
    # Get the frontend directory (adjust path as needed)
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(backend_dir))
    frontend_dir = os.path.join(project_root, "frontend")
    
    print(f"📁 Backend dir: {backend_dir}")
    print(f"📁 Frontend dir: {frontend_dir}")

    cherrypy.config.update({
        "server.socket_host": "127.0.0.1",
        "server.socket_port": 8081,
        "tools.encode.on": True,
        "tools.encode.encoding": "utf-8",
        "tools.response_headers.on": True,
        "tools.response_headers.headers": [
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type')
        ],
    })

    config = {
        "/": {
            "tools.staticdir.on": True,
            "tools.staticdir.dir": frontend_dir,
            "tools.staticdir.index": "GridInterface/samples/gridSkeleton.html",
        },
        "/js": {
            "tools.staticdir.on": True,
            "tools.staticdir.dir": os.path.join(frontend_dir, "js"),
        },
        "/css": {
            "tools.staticdir.on": True,
            "tools.staticdir.dir": os.path.join(frontend_dir, "css"),
        },
    }

    print("=" * 60)
    print("🚀 Starting BarcQ Backend with Enhanced QPCA Support")
    print("🌐 URL: http://127.0.0.1:8080")
    print("🔗 QPCA Endpoint: POST /ComputeQPCA")
    print("🔗 Circuit Endpoint: POST /CodeGenerator")
    print(f"📊 QPCA Datasets: {'✅ Enabled' if QPCA_DATASETS_AVAILABLE else '❌ Disabled (install qpca_backend.py)'}")
    print("=" * 60)

    cherrypy.quickstart(BarcQBackend(), "/", config)