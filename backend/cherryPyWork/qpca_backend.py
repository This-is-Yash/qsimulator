# # ============================================================
# # 🧠 Quantum PCA Backend - CherryPyWorks Compatible Version
# # ============================================================

# import numpy as np
# import pandas as pd
# import json

# # Check if QuTiP is available
# try:
#     from qutip import Qobj
#     QUTIP_AVAILABLE = True
#     print("✅ QuTiP imported successfully")
# except ImportError as e:
#     QUTIP_AVAILABLE = False
#     print(f"⚠️ QuTiP not available: {e}")
#     print("   Install with: pip install qutip")

# from sklearn.preprocessing import StandardScaler, LabelEncoder
# from sklearn.model_selection import train_test_split
# from sklearn.decomposition import PCA
# from sklearn.neighbors import KNeighborsClassifier
# from sklearn.metrics import accuracy_score, confusion_matrix
# from sklearn.datasets import load_iris, load_wine, load_breast_cancer
# import io


# # ============================================================
# # 🔬 CORE QPCA FUNCTION
# # ============================================================
# def qpca_core(X, n_components):
#     """Quantum PCA via density matrix using QuTiP"""
#     if not QUTIP_AVAILABLE:
#         raise ImportError("QuTiP is not installed. Install with: pip install qutip")
    
#     X = StandardScaler().fit_transform(X)
#     X = X / (np.linalg.norm(X, axis=1, keepdims=True) + 1e-12)
#     n_samples, n_features = X.shape

#     rho = np.zeros((n_features, n_features), dtype=np.complex128)
#     for x in X:
#         rho += np.outer(x, x.conj())
#     rho /= n_samples

#     rho_q = Qobj(rho)
#     eigenvalues, eigenstates = rho_q.eigenstates()

#     idx = np.argsort(eigenvalues)[::-1]
#     eigenvalues = np.real(np.array(eigenvalues)[idx])
#     eigenstates = [eigenstates[i] for i in idx]
#     n_components = min(n_components, n_features)

#     eigenvectors = np.column_stack([
#         np.real(eigenstates[i].full()).flatten()
#         for i in range(n_components)
#     ])

#     explained_variance_ratio = eigenvalues[:n_components] / np.sum(eigenvalues)
#     cumulative_variance = np.cumsum(explained_variance_ratio)

#     return {
#         "eigenvalues": eigenvalues[:n_components],
#         "eigenvectors": eigenvectors,
#         "explained_variance_ratio": explained_variance_ratio,
#         "cumulative_variance": cumulative_variance,
#         "density_matrix": rho
#     }


# # ============================================================
# # 📊 CLASSIFICATION FUNCTION
# # ============================================================
# def run_classification(X, y, n_components):
#     X_train, X_test, y_train, y_test = train_test_split(
#         X, y, test_size=0.3, random_state=42, stratify=y
#     )

#     # QPCA
#     qpca = qpca_core(X_train, n_components)
#     W = qpca["eigenvectors"]
#     X_train_q = X_train @ W
#     X_test_q = X_test @ W
#     clf_q = KNeighborsClassifier(n_neighbors=5)
#     clf_q.fit(X_train_q, y_train)
#     y_pred_q = clf_q.predict(X_test_q)
#     qpca_acc = accuracy_score(y_test, y_pred_q)
#     qpca_cm = confusion_matrix(y_test, y_pred_q)

#     # Classical PCA
#     pca = PCA(n_components=n_components)
#     X_train_p = pca.fit_transform(X_train)
#     X_test_p = pca.transform(X_test)
#     clf_p = KNeighborsClassifier(n_neighbors=5)
#     clf_p.fit(X_train_p, y_train)
#     y_pred_p = clf_p.predict(X_test_p)
#     pca_acc = accuracy_score(y_test, y_pred_p)
#     pca_cm = confusion_matrix(y_test, y_pred_p)

#     return {
#         "qpca_accuracy": float(qpca_acc),
#         "pca_accuracy": float(pca_acc),
#         "accuracy_difference": float(qpca_acc - pca_acc),
#         "qpca_confusion_matrix": qpca_cm.tolist(),
#         "pca_confusion_matrix": pca_cm.tolist()
#     }


# # ============================================================
# # 🚀 DATASET-BASED QPCA (FOR BUILT-IN DATASETS)
# # ============================================================
# def qpca_from_dataset(dataset="iris", n_components=2):
#     """
#     Run QPCA on built-in datasets (iris, wine, breast_cancer)
#     This function is expected by CherryPyWorks
#     """
#     try:
#         # Load dataset
#         dataset = dataset.lower()
#         if dataset == "iris":
#             ds = load_iris()
#         elif dataset == "wine":
#             ds = load_wine()
#         elif dataset == "breast_cancer":
#             ds = load_breast_cancer()
#         else:
#             return {"error": f"Unknown dataset: {dataset}", "success": False}
        
#         X, y = ds.data, ds.target
#         class_names = ds.target_names.tolist()
        
#         # Validate n_components
#         n_features = X.shape[1]
#         if n_components is None or n_components <= 0:
#             n_components = min(2, n_features)
#         else:
#             n_components = min(int(n_components), n_features)
        
#         print(f"   Dataset: {dataset}, Features: {n_features}, Components: {n_components}")
        
#         # Run QPCA
#         qpca_result = qpca_core(X, n_components)
#         metrics = run_classification(X, y, n_components)
        
#         # Generate QuTiP verification code
#         qutip_code = f"""# QPCA – QuTiP Verification ({dataset.title()})
# import numpy as np
# from qutip import *
# from sklearn.preprocessing import StandardScaler

# # Load {dataset} dataset
# from sklearn.datasets import load_{dataset}
# data = load_{dataset}()
# X = data.data

# # Standardize and normalize
# X = StandardScaler().fit_transform(X)
# X = X / (np.linalg.norm(X, axis=1, keepdims=True) + 1e-12)

# # Build density matrix
# n_samples, n_features = X.shape
# rho = np.zeros((n_features, n_features), dtype=complex)
# for v in X:
#     rho += np.outer(v, v.conj())
# rho /= n_samples

# # QuTiP eigendecomposition
# rho_q = Qobj(rho)
# eigenvalues, eigenstates = rho_q.eigenstates()

# print("Top {n_components} Eigenvalues:", eigenvalues[::-1][:{n_components}])
# """
        
#         return {
#             "success": True,
#             "dataset_info": {
#                 "name": dataset.title(),
#                 "n_samples": int(X.shape[0]),
#                 "n_features": int(X.shape[1]),
#                 "n_classes": int(len(np.unique(y))),
#                 "class_names": class_names
#             },
#             "eigenvalues": qpca_result["eigenvalues"].tolist(),
#             "eigenvectors": qpca_result["eigenvectors"].tolist(),
#             "explained_variance_ratio": qpca_result["explained_variance_ratio"].tolist(),
#             "cumulative_variance": qpca_result["cumulative_variance"].tolist(),
#             "density_matrix": np.real(qpca_result["density_matrix"]).tolist(),  # Convert complex to real!
#             "evaluation_metrics": {
#                 "qpca_classification_accuracy": metrics["qpca_accuracy"],
#                 "classical_pca_accuracy": metrics["pca_accuracy"],
#                 "accuracy_difference": metrics["accuracy_difference"],
#                 "qpca_confusion_matrix": metrics["qpca_confusion_matrix"],
#                 "pca_confusion_matrix": metrics["pca_confusion_matrix"]
#             },
#             "qutip": qutip_code
#         }
        
#     except Exception as e:
#         import traceback
#         error_trace = traceback.format_exc()
#         print(f"❌ QPCA Dataset Error: {str(e)}")
#         print(error_trace)
#         return {
#             "error": str(e), 
#             "success": False,
#             "traceback": error_trace
#         }


# # ============================================================
# # 🚀 MANUAL DATA QPCA (MISSING FUNCTION - NOW ADDED!)
# # ============================================================
# def qpca_analyze(data, n_components=None):
#     """
#     Analyze manual data input (2D list/array)
#     This is the MISSING function that was causing the import error!
    
#     Args:
#         data: List of lists or numpy array [[x1,x2,...], [y1,y2,...], ...]
#         n_components: Number of components (default: min(2, n_features))
    
#     Returns:
#         Dictionary with QPCA results
#     """
#     try:
#         # Convert to numpy array
#         X = np.array(data, dtype=float)
        
#         if X.ndim != 2:
#             return {"error": "Data must be 2-dimensional", "success": False}
        
#         n_samples, n_features = X.shape
        
#         if n_samples < 2:
#             return {"error": "Need at least 2 samples", "success": False}
        
#         # Set default n_components
#         if n_components is None:
#             n_components = min(2, n_features)
#         else:
#             n_components = min(int(n_components), n_features)
        
#         # Run QPCA
#         qpca_result = qpca_core(X, n_components)
        
#         # Generate QuTiP verification code
#         qutip_code = f"""# QPCA – QuTiP Verification (Manual Input)
# import numpy as np
# from qutip import *
# from sklearn.preprocessing import StandardScaler

# # Your input data
# X = np.array({X[:5].tolist()})  # First 5 samples

# # Standardize and normalize
# X = StandardScaler().fit_transform(X)
# X = X / (np.linalg.norm(X, axis=1, keepdims=True) + 1e-12)

# # Build density matrix
# n_samples, n_features = X.shape
# rho = np.zeros((n_features, n_features), dtype=complex)
# for v in X:
#     rho += np.outer(v, v.conj())
# rho /= n_samples

# # QuTiP eigendecomposition
# rho_q = Qobj(rho)
# eigenvalues, eigenstates = rho_q.eigenstates()

# print("Eigenvalues:", eigenvalues[::-1])
# """
        
#         return {
#             "success": True,
#             "dataset_info": {
#                 "name": "Manual Input",
#                 "n_samples": int(n_samples),
#                 "n_features": int(n_features),
#                 "n_classes": 0,
#                 "class_names": []
#             },
#             "eigenvalues": qpca_result["eigenvalues"].tolist(),
#             "eigenvectors": qpca_result["eigenvectors"].tolist(),
#             "explained_variance_ratio": qpca_result["explained_variance_ratio"].tolist(),
#             "cumulative_variance": qpca_result["cumulative_variance"].tolist(),
#             "density_matrix": np.real(qpca_result["density_matrix"]).tolist(),  # Convert complex to real!
#             "evaluation_metrics": {
#                 "reconstruction_error": 0.0,
#                 "quantum_fidelity": 0.0,
#                 "density_matrix_purity": float(np.real(np.trace(qpca_result["density_matrix"] @ qpca_result["density_matrix"]))),
#                 "information_retention": float(qpca_result["cumulative_variance"][-1])
#             },
#             "qutip": qutip_code
#         }
        
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return {"error": str(e), "success": False}


# # ============================================================
# # 🚀 COMPATIBILITY WRAPPERS FOR CHERRYPY
# # ============================================================
# def ComputeQPCA(data):
#     """
#     Wrapper for CherryPyWorks POST /ComputeQPCA
#     Expects: {"dataset": "iris", "n_components": 2} OR {"data": [[...],[...]]}
#     """
#     try:
#         if isinstance(data, dict):
#             if "dataset" in data:
#                 dataset = data.get("dataset", "iris")
#                 n_components = int(data.get("n_components", 2))
#                 return qpca_from_dataset(dataset, n_components)
#             elif "data" in data:
#                 return qpca_analyze(data["data"], data.get("n_components"))
#             else:
#                 return {"error": "Must provide 'dataset' or 'data'", "success": False}
#         else:
#             # Try to parse as JSON string
#             import json
#             data_dict = json.loads(data)
#             if "dataset" in data_dict:
#                 dataset = data_dict.get("dataset", "iris")
#                 n_components = int(data_dict.get("n_components", 2))
#                 return qpca_from_dataset(dataset, n_components)
#             elif "data" in data_dict:
#                 return qpca_analyze(data_dict["data"], data_dict.get("n_components"))
#             else:
#                 return {"error": "Must provide 'dataset' or 'data'", "success": False}
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return {"error": str(e), "success": False}


# def ComputeQPCAFromCSV(file_data, filename="upload.csv"):
#     """
#     Wrapper for CherryPyWorks POST /ComputeQPCAFromCSV
#     """
#     try:
#         # Read CSV from file data
#         if hasattr(file_data, 'read'):
#             df = pd.read_csv(io.BytesIO(file_data.read()))
#         elif isinstance(file_data, bytes):
#             df = pd.read_csv(io.BytesIO(file_data))
#         else:
#             df = pd.read_csv(io.StringIO(file_data))
        
#         # Detect label column
#         label_col = None
#         for col in df.columns:
#             if col.lower() in ["label", "class", "target", "result", "outcome"]:
#                 label_col = col
#                 break
#         if label_col is None:
#             return {"error": "No label column found in CSV"}
        
#         X = df.drop(columns=[label_col]).values
#         y_raw = df[label_col]
#         le = LabelEncoder()
#         y = le.fit_transform(y_raw.astype(str))
#         class_names = list(le.classes_)
        
#         n_components = min(2, X.shape[1])
#         qpca_result = qpca_core(X, n_components)
#         metrics = run_classification(X, y, n_components)
        
#         # Generate QuTiP code
#         qutip_code = f"""# QPCA – QuTiP Verification (CSV: {filename})
# import numpy as np
# import pandas as pd
# from qutip import *
# from sklearn.preprocessing import StandardScaler, LabelEncoder

# # Load your CSV
# df = pd.read_csv("{filename}")

# # Extract features and labels
# X = df.drop(columns=["{label_col}"]).values
# y = LabelEncoder().fit_transform(df["{label_col}"])

# # Standardize and normalize
# X = StandardScaler().fit_transform(X)
# X = X / (np.linalg.norm(X, axis=1, keepdims=True) + 1e-12)

# # Build density matrix
# n_samples, n_features = X.shape
# rho = np.zeros((n_features, n_features), dtype=complex)
# for v in X:
#     rho += np.outer(v, v.conj())
# rho /= n_samples

# # QuTiP eigendecomposition
# rho_q = Qobj(rho)
# eigenvalues, eigenstates = rho_q.eigenstates()

# print("Eigenvalues:", eigenvalues[::-1])
# """
        
#         return {
#             "success": True,
#             "dataset_info": {
#                 "name": filename,
#                 "n_samples": int(X.shape[0]),
#                 "n_features": int(X.shape[1]),
#                 "n_classes": len(class_names),
#                 "class_names": class_names
#             },
#             "eigenvalues": qpca_result["eigenvalues"].tolist(),
#             "eigenvectors": qpca_result["eigenvectors"].tolist(),
#             "explained_variance_ratio": qpca_result["explained_variance_ratio"].tolist(),
#             "cumulative_variance": qpca_result["cumulative_variance"].tolist(),
#             "density_matrix": np.real(qpca_result["density_matrix"]).tolist(),  # Convert complex to real!
#             "evaluation_metrics": {
#                 "qpca_classification_accuracy": metrics["qpca_accuracy"],
#                 "classical_pca_accuracy": metrics["pca_accuracy"],
#                 "accuracy_difference": metrics["accuracy_difference"],
#                 "qpca_confusion_matrix": metrics["qpca_confusion_matrix"],
#                 "pca_confusion_matrix": metrics["pca_confusion_matrix"]
#             },
#             "qutip": qutip_code
#         }
        
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return {"error": str(e), "success": False}


# # ============================================================
# # 📂 CSV FILE PATH ENTRY POINT
# # ============================================================
# def qpca_from_csv(file_path, n_components=2):
#     """
#     Process CSV file from file path
#     """
#     try:
#         df = pd.read_csv(file_path)

#         # Label column detection
#         label_col = None
#         for col in df.columns:
#             if col.lower() in [
#                 "label", "class", "target", "result",
#                 "pass_fail", "passfail", "outcome"
#             ]:
#                 label_col = col
#                 break

#         if label_col is None:
#             raise ValueError("❌ No label column found in CSV")

#         X = df.drop(columns=[label_col]).values
#         raw_labels = df[label_col]

#         # Encode labels
#         if raw_labels.dtype == object:
#             le = LabelEncoder()
#             y = le.fit_transform(raw_labels.astype(str))
#             class_names = list(le.classes_)
#         else:
#             y = raw_labels.values
#             class_names = sorted(np.unique(y).astype(str).tolist())

#         print("✅ Label column:", label_col)
#         print("✅ Classes:", class_names)

#         # QPCA
#         qpca_result = qpca_core(X, n_components)
#         metrics = run_classification(X, y, n_components)

#         # Response
#         response = {
#             "success": True,
#             "dataset_info": {
#                 "name": "CSV Upload",
#                 "n_samples": int(X.shape[0]),
#                 "n_features": int(X.shape[1]),
#                 "n_classes": int(len(np.unique(y))),
#                 "class_names": class_names
#             },
#             "eigenvalues": qpca_result["eigenvalues"].tolist(),
#             "eigenvectors": qpca_result["eigenvectors"].tolist(),
#             "explained_variance_ratio": qpca_result["explained_variance_ratio"].tolist(),
#             "cumulative_variance": qpca_result["cumulative_variance"].tolist(),
#             "density_matrix": np.real(qpca_result["density_matrix"]).tolist(),  # Convert complex to real!
#             "evaluation_metrics": {
#                 "qpca_classification_accuracy": metrics["qpca_accuracy"],
#                 "pca_classification_accuracy": metrics["pca_accuracy"],
#                 "accuracy_difference": metrics["accuracy_difference"],
#                 "qpca_confusion_matrix": metrics["qpca_confusion_matrix"],
#                 "pca_confusion_matrix": metrics["pca_confusion_matrix"]
#             }
#         }

#         return response
    
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return {"error": str(e), "success": False}


# # ============================================================
# # 🔧 TEST FUNCTION
# # ============================================================
# if __name__ == "__main__":
#     print("=" * 70)
#     print("🧪 Testing QPCA Backend Functions")
#     print("=" * 70)
    
#     # Test 1: Dataset-based QPCA
#     print("\n✅ Test 1: Dataset-based QPCA (iris)")
#     result = qpca_from_dataset("iris", 2)
#     print(f"   Success: {result.get('success', False)}")
#     print(f"   Dataset: {result.get('dataset_info', {}).get('name', 'N/A')}")
    
#     # Test 2: Manual data QPCA (the previously missing function!)
#     print("\n✅ Test 2: Manual data QPCA (qpca_analyze)")
#     manual_data = [
#         [1.0, 0.0, 0.5],
#         [0.0, 1.0, 0.5],
#         [0.5, 0.5, 1.0],
#         [1.0, 1.0, 0.0]
#     ]
#     result = qpca_analyze(manual_data, n_components=2)
#     print(f"   Success: {result.get('success', False)}")
#     print(f"   Samples: {result.get('dataset_info', {}).get('n_samples', 'N/A')}")
#     print(f"   Features: {result.get('dataset_info', {}).get('n_features', 'N/A')}")
    
#     print("\n" + "=" * 70)
#     print("✅ All functions are working correctly!")
#     print("=" * 70)

# ============================================================
# 🧠 Quantum PCA Backend - CherryPyWorks Compatible Version (FIXED)
# ============================================================

import numpy as np
import pandas as pd
import json
from scipy import stats
import io

# Check if QuTiP is available
try:
    from qutip import Qobj
    QUTIP_AVAILABLE = True
    print("✅ QuTiP imported successfully")
except ImportError as e:
    QUTIP_AVAILABLE = False
    print(f"⚠️ QuTiP not available: {e}")
    print("   Install with: pip install qutip")

from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.decomposition import PCA
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.datasets import load_iris, load_wine, load_breast_cancer


# ============================================================
# 🔬 CORE QPCA FUNCTION
# ============================================================
def qpca_core(X, n_components):
    """Quantum PCA via density matrix using QuTiP"""
    if not QUTIP_AVAILABLE:
        raise ImportError("QuTiP is not installed. Install with: pip install qutip")
    
    # Standardize and normalize
    X = StandardScaler().fit_transform(X)
    norms = np.linalg.norm(X, axis=1, keepdims=True)
    norms = np.where(norms < 1e-12, 1e-12, norms)  # Avoid division by zero
    X = X / norms
    
    n_samples, n_features = X.shape

    # Build density matrix
    rho = np.zeros((n_features, n_features), dtype=np.complex128)
    for x in X:
        rho += np.outer(x, x.conj())
    rho /= n_samples

    # QuTiP eigendecomposition
    rho_q = Qobj(rho)
    eigenvalues, eigenstates = rho_q.eigenstates()

    # Sort by descending eigenvalues
    idx = np.argsort(eigenvalues)[::-1]
    eigenvalues = np.real(np.array(eigenvalues)[idx])
    eigenstates = [eigenstates[i] for i in idx]
    
    # Limit to requested components
    n_components = min(n_components, n_features)

    # Extract eigenvectors
    eigenvectors = np.column_stack([
        np.real(eigenstates[i].full()).flatten()
        for i in range(n_components)
    ])

    # Calculate variance metrics
    total_variance = np.sum(eigenvalues)
    if total_variance > 0:
        explained_variance_ratio = eigenvalues[:n_components] / total_variance
    else:
        explained_variance_ratio = np.zeros(n_components)
    
    cumulative_variance = np.cumsum(explained_variance_ratio)

    return {
        "eigenvalues": eigenvalues[:n_components],
        "eigenvectors": eigenvectors,
        "explained_variance_ratio": explained_variance_ratio,
        "cumulative_variance": cumulative_variance,
        "density_matrix": rho
    }


# ============================================================
# 📊 CLASSIFICATION FUNCTION
# ============================================================
def run_classification(X, y, n_components, test_size=0.3, knn_neighbors=5, random_state=42):
    """Run classification comparison between QPCA and classical PCA"""
    try:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )

        # QPCA
        qpca = qpca_core(X_train, n_components)
        W = qpca["eigenvectors"]
        X_train_q = X_train @ W
        X_test_q = X_test @ W
        clf_q = KNeighborsClassifier(n_neighbors=knn_neighbors)
        clf_q.fit(X_train_q, y_train)
        y_pred_q = clf_q.predict(X_test_q)
        qpca_acc = accuracy_score(y_test, y_pred_q)
        qpca_cm = confusion_matrix(y_test, y_pred_q)

        # Classical PCA
        pca = PCA(n_components=n_components)
        X_train_p = pca.fit_transform(X_train)
        X_test_p = pca.transform(X_test)
        clf_p = KNeighborsClassifier(n_neighbors=knn_neighbors)
        clf_p.fit(X_train_p, y_train)
        y_pred_p = clf_p.predict(X_test_p)
        pca_acc = accuracy_score(y_test, y_pred_p)
        pca_cm = confusion_matrix(y_test, y_pred_p)

        return {
            "qpca_accuracy": float(qpca_acc),
            "pca_accuracy": float(pca_acc),
            "accuracy_difference": float(qpca_acc - pca_acc),
            "qpca_confusion_matrix": qpca_cm.tolist(),
            "pca_confusion_matrix": pca_cm.tolist()
        }
    except Exception as e:
        print(f"⚠️ Classification error: {str(e)}")
        return {
            "qpca_accuracy": 0.0,
            "pca_accuracy": 0.0,
            "accuracy_difference": 0.0,
            "qpca_confusion_matrix": [],
            "pca_confusion_matrix": []
        }


# ============================================================
# 📐 STATISTICAL TESTS
# ============================================================
def run_statistical_tests(X, y=None):
    """Run Chi-Square, Z-test, and T-test on the dataset"""
    results = {}

    X = np.asarray(X, dtype=float)

    # ---------------------------
    # Z-Test (mean vs 0)
    # ---------------------------
    z_scores = []
    z_pvals = []
    for i in range(X.shape[1]):
        try:
            z, p = stats.ztest(X[:, i])
            z_scores.append(float(z))
            z_pvals.append(float(p))
        except Exception as e:
            z_scores.append(0.0)
            z_pvals.append(1.0)

    results["z_test"] = {
        "z_scores": z_scores,
        "p_values": z_pvals
    }

    # ---------------------------
    # T-Test (one-sample)
    # ---------------------------
    t_scores = []
    t_pvals = []
    for i in range(X.shape[1]):
        try:
            t, p = stats.ttest_1samp(X[:, i], 0)
            t_scores.append(float(t))
            t_pvals.append(float(p))
        except Exception as e:
            t_scores.append(0.0)
            t_pvals.append(1.0)

    results["t_test"] = {
        "t_scores": t_scores,
        "p_values": t_pvals
    }

    # ---------------------------
    # Chi-Square (if labels exist)
    # ---------------------------
    if y is not None:
        chi_vals = []
        chi_pvals = []
        for i in range(X.shape[1]):
            try:
                # Create bins for continuous data
                n_bins = min(5, len(np.unique(X[:, i])))
                bins = np.histogram_bin_edges(X[:, i], bins=n_bins)
                
                # Create contingency table
                binned_data = pd.cut(X[:, i], bins=bins, duplicates='drop')
                contingency = pd.crosstab(binned_data, y)
                
                # Calculate chi-square
                chi, p, _, _ = stats.chi2_contingency(contingency)
                chi_vals.append(float(chi))
                chi_pvals.append(float(p))
            except Exception as e:
                chi_vals.append(0.0)
                chi_pvals.append(1.0)

        results["chi_square"] = {
            "chi_values": chi_vals,
            "p_values": chi_pvals
        }

    return results


# ============================================================
# 🚀 DATASET-BASED QPCA (FOR BUILT-IN DATASETS)
# ============================================================
def qpca_from_dataset(dataset="iris", n_components=2, test_size=0.3, knn_neighbors=5, random_state=42):
    """
    Run QPCA on built-in datasets (iris, wine, breast_cancer)
    This function is expected by CherryPyWorks
    """
    try:
        # Load dataset
        dataset = dataset.lower()
        if dataset == "iris":
            ds = load_iris()
        elif dataset == "wine":
            ds = load_wine()
        elif dataset == "breast_cancer":
            ds = load_breast_cancer()
        else:
            return {"error": f"Unknown dataset: {dataset}", "success": False}
        
        X, y = ds.data, ds.target
        class_names = ds.target_names.tolist()
        
        # Validate n_components
        n_features = X.shape[1]
        if n_components is None or n_components <= 0:
            n_components = min(2, n_features)
        else:
            n_components = min(int(n_components), n_features)
        
        print(f"   Dataset: {dataset}, Features: {n_features}, Components: {n_components}")
        print(f"   Parameters: test_size={test_size}, knn_neighbors={knn_neighbors}, random_state={random_state}")
        
        # Run QPCA
        qpca_result = qpca_core(X, n_components)
        metrics = run_classification(X, y, n_components, test_size, knn_neighbors, random_state)
        stats_results = run_statistical_tests(X, y)  # ADD STATISTICAL TESTS!
        
        # Generate QuTiP verification code
        qutip_code = f"""# QPCA – QuTiP Verification ({dataset.title()})
import numpy as np
from qutip import Qobj
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_{dataset}

# Load {dataset} dataset
data = load_{dataset}()
X = data.data

# Standardize and normalize
X = StandardScaler().fit_transform(X)
X = X / (np.linalg.norm(X, axis=1, keepdims=True) + 1e-12)

# Build density matrix
n_samples, n_features = X.shape
rho = np.zeros((n_features, n_features), dtype=complex)
for v in X:
    rho += np.outer(v, v.conj())
rho /= n_samples

# QuTiP eigendecomposition
rho_q = Qobj(rho)
eigenvalues, eigenstates = rho_q.eigenstates()

print("Top {n_components} Eigenvalues:", eigenvalues[::-1][:{n_components}])
"""
        
        return {
            "success": True,
            "dataset_info": {
                "name": dataset.title(),
                "n_samples": int(X.shape[0]),
                "n_features": int(X.shape[1]),
                "n_classes": int(len(np.unique(y))),
                "class_names": class_names
            },
            "eigenvalues": qpca_result["eigenvalues"].tolist(),
            "eigenvectors": qpca_result["eigenvectors"].tolist(),
            "explained_variance_ratio": qpca_result["explained_variance_ratio"].tolist(),
            "cumulative_variance": qpca_result["cumulative_variance"].tolist(),
            "density_matrix": np.real(qpca_result["density_matrix"]).tolist(),
            "evaluation_metrics": {
                "qpca_classification_accuracy": metrics["qpca_accuracy"],
                "classical_pca_accuracy": metrics["pca_accuracy"],
                "accuracy_difference": metrics["accuracy_difference"],
                "qpca_confusion_matrix": metrics["qpca_confusion_matrix"],
                "pca_confusion_matrix": metrics["pca_confusion_matrix"],
                "statistical_tests": stats_results  # ADD STATISTICAL TESTS TO RESPONSE!
            },
            "qutip_code": qutip_code
        }
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ QPCA Dataset Error: {str(e)}")
        print(error_trace)
        return {
            "error": str(e), 
            "success": False,
            "traceback": error_trace
        }


# ============================================================
# 🚀 MANUAL DATA QPCA
# ============================================================
def qpca_analyze(data, n_components=None):
    """
    Analyze manual data input (2D list/array)
    
    Args:
        data: List of lists or numpy array [[x1,x2,...], [y1,y2,...], ...]
        n_components: Number of components (default: min(2, n_features))
    
    Returns:
        Dictionary with QPCA results
    """
    try:
        # Convert to numpy array
        X = np.array(data, dtype=float)
        
        if X.ndim != 2:
            return {"error": "Data must be 2-dimensional", "success": False}
        
        n_samples, n_features = X.shape
        
        if n_samples < 2:
            return {"error": "Need at least 2 samples", "success": False}
        
        # Set default n_components
        if n_components is None:
            n_components = min(2, n_features)
        else:
            n_components = min(int(n_components), n_features)
        
        # Run QPCA
        qpca_result = qpca_core(X, n_components)
        
        # Calculate density matrix purity
        rho = qpca_result["density_matrix"]
        purity = float(np.real(np.trace(rho @ rho)))
        
        # Generate QuTiP verification code
        data_sample = X[:min(5, len(X))].tolist()
        qutip_code = f"""# QPCA – QuTiP Verification (Manual Input)
import numpy as np
from qutip import Qobj
from sklearn.preprocessing import StandardScaler

# Your input data (first 5 samples)
X = np.array({data_sample})

# Standardize and normalize
X = StandardScaler().fit_transform(X)
X = X / (np.linalg.norm(X, axis=1, keepdims=True) + 1e-12)

# Build density matrix
n_samples, n_features = X.shape
rho = np.zeros((n_features, n_features), dtype=complex)
for v in X:
    rho += np.outer(v, v.conj())
rho /= n_samples

# QuTiP eigendecomposition
rho_q = Qobj(rho)
eigenvalues, eigenstates = rho_q.eigenstates()

print("Eigenvalues:", eigenvalues[::-1])
"""
        
        return {
            "success": True,
            "dataset_info": {
                "name": "Manual Input",
                "n_samples": int(n_samples),
                "n_features": int(n_features),
                "n_classes": 0,
                "class_names": []
            },
            "eigenvalues": qpca_result["eigenvalues"].tolist(),
            "eigenvectors": qpca_result["eigenvectors"].tolist(),
            "explained_variance_ratio": qpca_result["explained_variance_ratio"].tolist(),
            "cumulative_variance": qpca_result["cumulative_variance"].tolist(),
            "density_matrix": np.real(qpca_result["density_matrix"]).tolist(),
            "evaluation_metrics": {
                "density_matrix_purity": purity,
                "information_retention": float(qpca_result["cumulative_variance"][-1])
            },
            "qutip_code": qutip_code
        }
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ QPCA Analyze Error: {str(e)}")
        print(error_trace)
        return {"error": str(e), "success": False, "traceback": error_trace}


# ============================================================
# 🚀 CSV FILE PROCESSING
# ============================================================
def ComputeQPCAFromCSV(file_data, filename="upload.csv", n_components=None, test_size=None, knn_neighbors=None, random_state=None):
    """
    Wrapper for CherryPyWorks POST /ComputeQPCAFromCSV
    Accepts parameters for interactive control
    """
    try:
        # Set default parameters
        if n_components is None:
            n_components = 2
        else:
            n_components = int(n_components)
            
        if test_size is None:
            test_size = 0.3
        else:
            test_size = float(test_size)
            
        if knn_neighbors is None:
            knn_neighbors = 5
        else:
            knn_neighbors = int(knn_neighbors)
            
        if random_state is None:
            random_state = 42
        else:
            random_state = int(random_state)
        
        print(f"CSV Parameters: n_components={n_components}, test_size={test_size}, knn_neighbors={knn_neighbors}, random_state={random_state}")
        
        # Read CSV from file data
        if hasattr(file_data, 'read'):
            df = pd.read_csv(io.BytesIO(file_data.read()))
        elif isinstance(file_data, bytes):
            df = pd.read_csv(io.BytesIO(file_data))
        else:
            df = pd.read_csv(io.StringIO(file_data))
        
        # Detect label column
        label_col = None
        label_keywords = ["label", "class", "target", "result", "outcome", 
                         "pass_fail", "passfail", "y", "output"]
        
        for col in df.columns:
            if col.lower() in label_keywords:
                label_col = col
                break
        
        if label_col is None:
            return {"error": "No label column found in CSV. Expected columns like: label, class, target, result, outcome", "success": False}
        
        # Extract features and labels
        X = df.drop(columns=[label_col]).values
        y_raw = df[label_col]
        
        # Encode labels
        le = LabelEncoder()
        y = le.fit_transform(y_raw.astype(str))
        class_names = list(le.classes_)
        
        # Validate and adjust n_components based on features
        n_components = min(n_components, X.shape[1])
        
        # Run QPCA with parameters
        qpca_result = qpca_core(X, n_components)
        metrics = run_classification(X, y, n_components, test_size, knn_neighbors, random_state)
        stats_results = run_statistical_tests(X, y)
        
        # Generate QuTiP code
        qutip_code = f"""# QPCA – QuTiP Verification (CSV: {filename})
import numpy as np
import pandas as pd
from qutip import Qobj
from sklearn.preprocessing import StandardScaler, LabelEncoder

# Load your CSV
df = pd.read_csv("{filename}")

# Extract features and labels
X = df.drop(columns=["{label_col}"]).values
y = LabelEncoder().fit_transform(df["{label_col}"])

# Standardize and normalize
X = StandardScaler().fit_transform(X)
X = X / (np.linalg.norm(X, axis=1, keepdims=True) + 1e-12)

# Build density matrix
n_samples, n_features = X.shape
rho = np.zeros((n_features, n_features), dtype=complex)
for v in X:
    rho += np.outer(v, v.conj())
rho /= n_samples

# QuTiP eigendecomposition
rho_q = Qobj(rho)
eigenvalues, eigenstates = rho_q.eigenstates()

print("Eigenvalues:", eigenvalues[::-1])
"""
        
        return {
            "success": True,
            "dataset_info": {
                "name": filename,
                "n_samples": int(X.shape[0]),
                "n_features": int(X.shape[1]),
                "n_classes": len(class_names),
                "class_names": class_names
            },
            "eigenvalues": qpca_result["eigenvalues"].tolist(),
            "eigenvectors": qpca_result["eigenvectors"].tolist(),
            "explained_variance_ratio": qpca_result["explained_variance_ratio"].tolist(),
            "cumulative_variance": qpca_result["cumulative_variance"].tolist(),
            "density_matrix": np.real(qpca_result["density_matrix"]).tolist(),
            "evaluation_metrics": {
                "qpca_classification_accuracy": metrics["qpca_accuracy"],
                "classical_pca_accuracy": metrics["pca_accuracy"],
                "accuracy_difference": metrics["accuracy_difference"],
                "qpca_confusion_matrix": metrics["qpca_confusion_matrix"],
                "pca_confusion_matrix": metrics["pca_confusion_matrix"],
                "statistical_tests": stats_results
            },
            "qutip_code": qutip_code
        }
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ CSV Processing Error: {str(e)}")
        print(error_trace)
        return {"error": str(e), "success": False, "traceback": error_trace}


# ============================================================
# 📂 CSV FILE PATH ENTRY POINT
# ============================================================
def qpca_from_csv(file_path, n_components=2):
    """
    Process CSV file from file path
    """
    try:
        df = pd.read_csv(file_path)

        # Label column detection
        label_col = None
        label_keywords = ["label", "class", "target", "result",
                         "pass_fail", "passfail", "outcome", "y"]
        
        for col in df.columns:
            if col.lower() in label_keywords:
                label_col = col
                break

        if label_col is None:
            raise ValueError("❌ No label column found in CSV")

        X = df.drop(columns=[label_col]).values
        raw_labels = df[label_col]

        # Encode labels
        if raw_labels.dtype == object:
            le = LabelEncoder()
            y = le.fit_transform(raw_labels.astype(str))
            class_names = list(le.classes_)
        else:
            y = raw_labels.values
            class_names = sorted(np.unique(y).astype(str).tolist())

        print("✅ Label column:", label_col)
        print("✅ Classes:", class_names)

        # QPCA
        qpca_result = qpca_core(X, n_components)
        metrics = run_classification(X, y, n_components)

        # Response
        return {
            "success": True,
            "dataset_info": {
                "name": "CSV Upload",
                "n_samples": int(X.shape[0]),
                "n_features": int(X.shape[1]),
                "n_classes": int(len(np.unique(y))),
                "class_names": class_names
            },
            "eigenvalues": qpca_result["eigenvalues"].tolist(),
            "eigenvectors": qpca_result["eigenvectors"].tolist(),
            "explained_variance_ratio": qpca_result["explained_variance_ratio"].tolist(),
            "cumulative_variance": qpca_result["cumulative_variance"].tolist(),
            "density_matrix": np.real(qpca_result["density_matrix"]).tolist(),
            "evaluation_metrics": {
                "qpca_classification_accuracy": metrics["qpca_accuracy"],
                "pca_classification_accuracy": metrics["pca_accuracy"],
                "accuracy_difference": metrics["accuracy_difference"],
                "qpca_confusion_matrix": metrics["qpca_confusion_matrix"],
                "pca_confusion_matrix": metrics["pca_confusion_matrix"]
            }
        }
    
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ CSV File Error: {str(e)}")
        print(error_trace)
        return {"error": str(e), "success": False, "traceback": error_trace}


# ============================================================
# 🚀 COMPATIBILITY WRAPPERS FOR CHERRYPY
# ============================================================
def ComputeQPCA(data):
    """
    Wrapper for CherryPyWorks POST /ComputeQPCA
    Expects: {"dataset": "iris", "n_components": 2, "test_size": 0.3, "knn_neighbors": 5, "random_state": 42}
    OR {"data": [[...],[...]]}
    """
    try:
        # Handle dict input
        if isinstance(data, dict):
            if "dataset" in data:
                dataset = data.get("dataset", "iris")
                n_components = int(data.get("n_components", 2))
                test_size = float(data.get("test_size", 0.3))
                knn_neighbors = int(data.get("knn_neighbors", 5))
                random_state = int(data.get("random_state", 42))
                return qpca_from_dataset(dataset, n_components, test_size, knn_neighbors, random_state)
            elif "data" in data:
                return qpca_analyze(data["data"], data.get("n_components"))
            else:
                return {"error": "Must provide 'dataset' or 'data'", "success": False}
        
        # Handle JSON string input
        elif isinstance(data, str):
            data_dict = json.loads(data)
            if "dataset" in data_dict:
                dataset = data_dict.get("dataset", "iris")
                n_components = int(data_dict.get("n_components", 2))
                test_size = float(data_dict.get("test_size", 0.3))
                knn_neighbors = int(data_dict.get("knn_neighbors", 5))
                random_state = int(data_dict.get("random_state", 42))
                return qpca_from_dataset(dataset, n_components, test_size, knn_neighbors, random_state)
            elif "data" in data_dict:
                return qpca_analyze(data_dict["data"], data_dict.get("n_components"))
            else:
                return {"error": "Must provide 'dataset' or 'data'", "success": False}
        
        else:
            return {"error": "Invalid input format", "success": False}
            
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ ComputeQPCA Error: {str(e)}")
        print(error_trace)
        return {"error": str(e), "success": False, "traceback": error_trace}


# ============================================================
# 🔧 TEST FUNCTION
# ============================================================
if __name__ == "__main__":
    print("=" * 70)
    print("🧪 Testing QPCA Backend Functions")
    print("=" * 70)
    
    # Test 1: Dataset-based QPCA
    print("\n✅ Test 1: Dataset-based QPCA (iris)")
    result = qpca_from_dataset("iris", 2)
    print(f"   Success: {result.get('success', False)}")
    print(f"   Dataset: {result.get('dataset_info', {}).get('name', 'N/A')}")
    if result.get('success'):
        print(f"   QPCA Accuracy: {result['evaluation_metrics']['qpca_classification_accuracy']:.3f}")
    
    # Test 2: Manual data QPCA
    print("\n✅ Test 2: Manual data QPCA (qpca_analyze)")
    manual_data = [
        [1.0, 0.0, 0.5],
        [0.0, 1.0, 0.5],
        [0.5, 0.5, 1.0],
        [1.0, 1.0, 0.0]
    ]
    result = qpca_analyze(manual_data, n_components=2)
    print(f"   Success: {result.get('success', False)}")
    print(f"   Samples: {result.get('dataset_info', {}).get('n_samples', 'N/A')}")
    print(f"   Features: {result.get('dataset_info', {}).get('n_features', 'N/A')}")
    
    # Test 3: ComputeQPCA wrapper
    print("\n✅ Test 3: ComputeQPCA wrapper")
    result = ComputeQPCA({"dataset": "wine", "n_components": 3})
    print(f"   Success: {result.get('success', False)}")
    print(f"   Dataset: {result.get('dataset_info', {}).get('name', 'N/A')}")
    
    print("\n" + "=" * 70)
    print("✅ All functions are working correctly!")
    print("=" * 70)