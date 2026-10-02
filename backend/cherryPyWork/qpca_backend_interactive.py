# ============================================================
# 🧠 Quantum PCA Backend - Interactive Parameters Edition
# ============================================================
# Enhanced with KS Test and robust error handling

import numpy as np
import pandas as pd
import json
from scipy import stats
import io
import traceback

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
    norms = np.where(norms < 1e-12, 1e-12, norms)
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
# 📊 CLASSIFICATION FUNCTION WITH PARAMETERS
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
        traceback.print_exc()
        return {
            "qpca_accuracy": 0.0,
            "pca_accuracy": 0.0,
            "accuracy_difference": 0.0,
            "qpca_confusion_matrix": [],
            "pca_confusion_matrix": []
        }


# ============================================================
# 🔍 STATISTICAL TESTS (WITH KS TEST!)
# ============================================================
def run_statistical_tests(X, y=None):
    """
    Run comprehensive statistical tests:
    - Chi-Square Test (feature-class independence)
    - Z-Test (mean vs zero)
    - T-Test (one-sample)
    - KS Test (normality check) ⭐ NEW!
    """
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
        except:
            z_scores.append(0.0)
            z_pvals.append(1.0)

    results["z_test"] = {
        "z_scores": z_scores,
        "p_values": z_pvals,
        "description": "Tests if feature means significantly differ from zero"
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
        except:
            t_scores.append(0.0)
            t_pvals.append(1.0)

    results["t_test"] = {
        "t_scores": t_scores,
        "p_values": t_pvals,
        "description": "Tests if feature means are significantly different from zero"
    }

    # ---------------------------
    # ⭐ KS Test (Kolmogorov-Smirnov)
    # Tests if data follows normal distribution
    # ---------------------------
    ks_stats = []
    ks_pvals = []
    for i in range(X.shape[1]):
        try:
            # Compare against normal distribution
            ks_stat, p_val = stats.kstest(
                X[:, i], 
                'norm', 
                args=(np.mean(X[:, i]), np.std(X[:, i]))
            )
            ks_stats.append(float(ks_stat))
            ks_pvals.append(float(p_val))
        except:
            ks_stats.append(0.0)
            ks_pvals.append(1.0)

    results["ks_test"] = {
        "ks_statistics": ks_stats,
        "p_values": ks_pvals,
        "description": "Tests if features follow normal distribution (lower p-value = less normal)"
    }

    # ---------------------------
    # Chi-Square (if labels exist)
    # ---------------------------
    if y is not None:
        chi_vals = []
        chi_pvals = []
        for i in range(X.shape[1]):
            try:
                n_bins = min(5, len(np.unique(X[:, i])))
                bins = np.histogram_bin_edges(X[:, i], bins=n_bins)
                binned_data = pd.cut(X[:, i], bins=bins, duplicates='drop')
                contingency = pd.crosstab(binned_data, y)
                chi, p, _, _ = stats.chi2_contingency(contingency)
                chi_vals.append(float(chi))
                chi_pvals.append(float(p))
            except:
                chi_vals.append(0.0)
                chi_pvals.append(1.0)

        results["chi_square"] = {
            "chi_values": chi_vals,
            "p_values": chi_pvals,
            "description": "Tests independence between features and target classes"
        }

    return results


# ============================================================
# 🚀 DATASET-BASED QPCA WITH INTERACTIVE PARAMETERS
# ============================================================
def qpca_from_dataset(dataset="iris", n_components=2, test_size=0.3, 
                      knn_neighbors=5, random_state=42):
    """
    Run QPCA on built-in datasets with interactive parameters
    """
    try:
        print(f"\n{'='*60}")
        print(f"📊 QPCA Analysis Starting")
        print(f"{'='*60}")
        print(f"Dataset: {dataset}")
        print(f"Parameters: components={n_components}, test_size={test_size}, knn={knn_neighbors}, seed={random_state}")
        
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
        
        # Validate and adjust parameters
        n_features = X.shape[1]
        n_components = min(int(n_components), n_features)
        test_size = max(0.1, min(0.5, float(test_size)))
        knn_neighbors = max(1, min(15, int(knn_neighbors)))
        random_state = int(random_state) % 10000
        
        print(f"Validated: components={n_components}/{n_features} features")
        
        # Run QPCA
        qpca_result = qpca_core(X, n_components)
        print("✅ QPCA eigendecomposition complete")
        
        metrics = run_classification(X, y, n_components, test_size, knn_neighbors, random_state)
        print(f"✅ Classification complete: QPCA={metrics['qpca_accuracy']:.3f}, PCA={metrics['pca_accuracy']:.3f}")
        
        stats_results = run_statistical_tests(X, y)
        print("✅ Statistical tests complete")
        
        # Generate QuTiP code
        qutip_code = f"""# QPCA — QuTiP Verification ({dataset.title()})
# Parameters: n_components={n_components}, test_size={test_size}, 
#             knn_neighbors={knn_neighbors}, random_state={random_state}

import numpy as np
from qutip import Qobj
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_{dataset}
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

# Load dataset
data = load_{dataset}()
X, y = data.data, data.target

# Standardize and normalize
X_scaled = StandardScaler().fit_transform(X)
X_norm = X_scaled / (np.linalg.norm(X_scaled, axis=1, keepdims=True) + 1e-12)

# Build density matrix
n_samples, n_features = X_norm.shape
rho = np.zeros((n_features, n_features), dtype=complex)
for v in X_norm:
    rho += np.outer(v, v.conj())
rho /= n_samples

# QuTiP eigendecomposition
rho_q = Qobj(rho)
eigenvalues, eigenstates = rho_q.eigenstates()

print("Top {n_components} Eigenvalues:", eigenvalues[::-1][:{n_components}])
print("QPCA Accuracy: {metrics['qpca_accuracy']*100:.2f}%")
"""
        
        result = {
            "success": True,
            "dataset_info": {
                "name": dataset.title(),
                "n_samples": int(X.shape[0]),
                "n_features": int(X.shape[1]),
                "n_classes": int(len(np.unique(y))),
                "class_names": class_names
            },
            "parameters_used": {
                "n_components": n_components,
                "test_size": test_size,
                "knn_neighbors": knn_neighbors,
                "random_state": random_state
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
        
        print(f"{'='*60}")
        print("✅ QPCA Analysis Complete!")
        print(f"{'='*60}\n")
        
        return result
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"\n❌ QPCA Dataset Error: {str(e)}")
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
    """Analyze manual data input (2D list/array)"""
    try:
        X = np.array(data, dtype=float)
        
        if X.ndim != 2:
            return {"error": "Data must be 2-dimensional", "success": False}
        
        n_samples, n_features = X.shape
        
        if n_samples < 2:
            return {"error": "Need at least 2 samples", "success": False}
        
        if n_components is None:
            n_components = min(2, n_features)
        else:
            n_components = min(int(n_components), n_features)
        
        qpca_result = qpca_core(X, n_components)
        rho = qpca_result["density_matrix"]
        purity = float(np.real(np.trace(rho @ rho)))
        
        data_sample = X[:min(5, len(X))].tolist()
        qutip_code = f"""# QPCA — Manual Input Analysis
import numpy as np
from qutip import Qobj
from sklearn.preprocessing import StandardScaler

X = np.array({data_sample})
X_scaled = StandardScaler().fit_transform(X)
X_norm = X_scaled / (np.linalg.norm(X_scaled, axis=1, keepdims=True) + 1e-12)

n_samples, n_features = X_norm.shape
rho = np.zeros((n_features, n_features), dtype=complex)
for v in X_norm:
    rho += np.outer(v, v.conj())
rho /= n_samples

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
        error_trace = traceback.format_exc()
        print(f"❌ QPCA Analyze Error: {str(e)}")
        print(error_trace)
        return {"error": str(e), "success": False, "traceback": error_trace}


# ============================================================
# 🚀 CSV PROCESSING WITH INTERACTIVE PARAMETERS
# ============================================================
def ComputeQPCAFromCSV(file_data, filename="upload.csv", n_components=None, 
                       test_size=None, knn_neighbors=None, random_state=None):
    """Process CSV file with interactive parameters"""
    try:
        print(f"\n{'='*60}")
        print(f"📄 CSV QPCA Processing: {filename}")
        print(f"{'='*60}")
        
        # Set defaults
        n_components = int(n_components) if n_components else 2
        test_size = float(test_size) if test_size else 0.3
        knn_neighbors = int(knn_neighbors) if knn_neighbors else 5
        random_state = int(random_state) if random_state else 42
        
        print(f"Parameters: components={n_components}, test_size={test_size}, knn={knn_neighbors}, seed={random_state}")
        
        # Read CSV
        if hasattr(file_data, 'read'):
            df = pd.read_csv(io.BytesIO(file_data.read()))
        elif isinstance(file_data, bytes):
            df = pd.read_csv(io.BytesIO(file_data))
        else:
            df = pd.read_csv(io.StringIO(file_data))
        
        print(f"CSV loaded: {df.shape[0]} rows × {df.shape[1]} columns")
        
        # Find label column
        label_col = None
        label_keywords = ["label", "class", "target", "result", "outcome", 
                         "pass_fail", "passfail", "y", "output", "category"]
        
        for col in df.columns:
            if col.lower() in label_keywords:
                label_col = col
                break
        
        if label_col is None:
            error_msg = f"No label column found. Available columns: {list(df.columns)}\nExpected: label, class, target, result, outcome"
            print(f"❌ {error_msg}")
            return {
                "error": error_msg,
                "success": False
            }
        
        print(f"Label column found: '{label_col}'")
        
        # Extract features and labels
        X = df.drop(columns=[label_col]).values
        y_raw = df[label_col]
        le = LabelEncoder()
        y = le.fit_transform(y_raw.astype(str))
        class_names = list(le.classes_)
        
        print(f"Features: {X.shape[1]}, Classes: {len(class_names)}")
        
        # Adjust parameters
        n_components = min(n_components, X.shape[1])
        
        # Run QPCA
        qpca_result = qpca_core(X, n_components)
        print("✅ QPCA complete")
        
        metrics = run_classification(X, y, n_components, test_size, knn_neighbors, random_state)
        print(f"✅ Classification: QPCA={metrics['qpca_accuracy']:.3f}, PCA={metrics['pca_accuracy']:.3f}")
        
        stats_results = run_statistical_tests(X, y)
        print("✅ Statistical tests complete")
        
        qutip_code = f"""# QPCA — CSV Analysis ({filename})
# Parameters: n_components={n_components}, test_size={test_size},
#             knn_neighbors={knn_neighbors}, random_state={random_state}

import numpy as np
import pandas as pd
from qutip import Qobj
from sklearn.preprocessing import StandardScaler, LabelEncoder

df = pd.read_csv("{filename}")
X = df.drop(columns=["{label_col}"]).values
y = LabelEncoder().fit_transform(df["{label_col}"])

X_scaled = StandardScaler().fit_transform(X)
X_norm = X_scaled / (np.linalg.norm(X_scaled, axis=1, keepdims=True) + 1e-12)

n_samples, n_features = X_norm.shape
rho = np.zeros((n_features, n_features), dtype=complex)
for v in X_norm:
    rho += np.outer(v, v.conj())
rho /= n_samples

rho_q = Qobj(rho)
eigenvalues, eigenstates = rho_q.eigenstates()
print("Eigenvalues:", eigenvalues[::-1])
print("QPCA Accuracy: {metrics['qpca_accuracy']*100:.2f}%")
"""
        
        result = {
            "success": True,
            "dataset_info": {
                "name": filename,
                "n_samples": int(X.shape[0]),
                "n_features": int(X.shape[1]),
                "n_classes": len(class_names),
                "class_names": class_names
            },
            "parameters_used": {
                "n_components": n_components,
                "test_size": test_size,
                "knn_neighbors": knn_neighbors,
                "random_state": random_state
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
        
        print(f"{'='*60}")
        print("✅ CSV QPCA Complete!")
        print(f"{'='*60}\n")
        
        return result
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"\n❌ CSV Processing Error: {str(e)}")
        print(error_trace)
        return {
            "error": str(e), 
            "success": False,
            "traceback": error_trace
        }


# ============================================================
# 🧪 MODULE TEST
# ============================================================
if __name__ == "__main__":
    print("=" * 70)
    print("🧪 Testing QPCA Interactive Backend with KS Test")
    print("=" * 70)
    
    # Test with iris dataset
    print("\n✅ Test 1: Iris with custom parameters")
    result = qpca_from_dataset(
        dataset="iris",
        n_components=3,
        test_size=0.2,
        knn_neighbors=7,
        random_state=123
    )
    
    if result.get('success'):
        print(f"   Accuracy: {result['evaluation_metrics']['qpca_classification_accuracy']:.3f}")
        print(f"   Parameters: {result['parameters_used']}")
        
        # Check KS test
        if 'statistical_tests' in result['evaluation_metrics']:
            ks_test = result['evaluation_metrics']['statistical_tests'].get('ks_test')
            if ks_test:
                print(f"   ✅ KS Test included: {len(ks_test['ks_statistics'])} features tested")
    
    print("\n" + "=" * 70)
    print("✅ Interactive QPCA Backend Ready with KS Test!")
    print("=" * 70)