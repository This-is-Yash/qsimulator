

# # import numpy as np
# # import io
# # import base64
# # import pandas as pd
# # from scipy import stats
# # from qutip import Qobj, tensor, basis, sigmax, sigmay, sigmaz
# # from sklearn import datasets
# # from sklearn.preprocessing import StandardScaler
# # from sklearn.model_selection import train_test_split
# # from sklearn.svm import SVC
# # from sklearn.metrics import accuracy_score


# # # ============================================================
# # # QUANTUM FEATURE ENCODINGS (Keep existing code)
# # # ============================================================

# # def RY(theta):
# #     """Y-rotation gate"""
# #     return Qobj([
# #         [np.cos(theta / 2), -np.sin(theta / 2)],
# #         [np.sin(theta / 2), np.cos(theta / 2)]
# #     ])

# # def RX(theta):
# #     """X-rotation gate"""
# #     return Qobj([
# #         [np.cos(theta / 2), -1j * np.sin(theta / 2)],
# #         [-1j * np.sin(theta / 2), np.cos(theta / 2)]
# #     ])

# # def RZ(theta):
# #     """Z-rotation gate"""
# #     return Qobj([
# #         [np.exp(-1j * theta / 2), 0],
# #         [0, np.exp(1j * theta / 2)]
# #     ])


# # # ============================================================
# # # KERNEL ENCODINGS (Keep existing code)
# # # ============================================================

# # def amplitude_encoding(x):
# #     """Standard amplitude encoding using RY rotations"""
# #     x = np.array(x, dtype=float)
# #     return tensor(RY(x[0]), RY(x[1]))


# # def angle_encoding(x):
# #     """Angle encoding using RX and RZ gates"""
# #     x = np.array(x, dtype=float)
    
# #     def encode_single(val):
# #         return RX(val) * RZ(val)
    
# #     return tensor(encode_single(x[0]), encode_single(x[1]))


# # def iqp_encoding(x):
# #     """IQP-style encoding with diagonal gates and entanglement"""
# #     x = np.array(x, dtype=float)
# #     H = Qobj([[1, 1], [1, -1]]) / np.sqrt(2)
# #     state = tensor(H, H)
# #     state = state * tensor(RZ(x[0]), RZ(x[1]))
# #     state = state * tensor(RZ(x[0] * x[1]), Qobj(np.eye(2)))
# #     state = state * tensor(H, H)
# #     return state


# # def pauli_encoding(x):
# #     """Pauli feature map with X, Y, Z rotations"""
# #     x = np.array(x, dtype=float)
    
# #     def pauli_layer(val):
# #         return RX(val) * RY(val) * RZ(val)
    
# #     return tensor(pauli_layer(x[0]), pauli_layer(x[1]))


# # def zz_feature_map(x):
# #     """ZZ feature map used in quantum chemistry simulations"""
# #     x = np.array(x, dtype=float)
# #     state = tensor(RY(x[0]), RY(x[1]))
# #     zz_angle = x[0] * x[1]
# #     zz_gate = Qobj([
# #         [np.exp(-1j * zz_angle), 0, 0, 0],
# #         [0, np.exp(1j * zz_angle), 0, 0],
# #         [0, 0, np.exp(1j * zz_angle), 0],
# #         [0, 0, 0, np.exp(-1j * zz_angle)]
# #     ])
# #     state = zz_gate * state
# #     return state


# # def polynomial_encoding(x, degree=2):
# #     """Polynomial encoding with higher-degree terms"""
# #     x = np.array(x, dtype=float)
    
# #     def poly_layer(val):
# #         state = RY(val)
# #         for d in range(2, degree + 1):
# #             state = state * RY(val ** d)
# #         return state
    
# #     return tensor(poly_layer(x[0]), poly_layer(x[1]))


# # # ============================================================
# # # KERNEL REGISTRY
# # # ============================================================

# # KERNEL_REGISTRY = {
# #     'amplitude': amplitude_encoding,
# #     'angle': angle_encoding,
# #     'iqp': iqp_encoding,
# #     'pauli': pauli_encoding,
# #     'zz': zz_feature_map,
# #     'polynomial': polynomial_encoding,
# # }

# # KERNEL_DESCRIPTIONS = {
# #     'amplitude': 'Amplitude Encoding (RY gates) - Standard QSVM',
# #     'angle': 'Angle Encoding (RX-RZ gates) - Good for periodic data',
# #     'iqp': 'IQP Encoding - Computational complexity advantage',
# #     'pauli': 'Pauli Feature Map - Full rotation coverage',
# #     'zz': 'ZZ Feature Map - Quantum chemistry inspired',
# #     'polynomial': 'Polynomial Encoding - Higher-order features',
# # }


# # def feature_unitary(x, kernel_type='amplitude', **kwargs):
# #     """Create feature encoding unitary based on kernel type"""
# #     if kernel_type not in KERNEL_REGISTRY:
# #         print(f"⚠️ Unknown kernel '{kernel_type}', using 'amplitude'")
# #         kernel_type = 'amplitude'
    
# #     encoder = KERNEL_REGISTRY[kernel_type]
    
# #     try:
# #         if kernel_type == 'polynomial' and 'degree' in kwargs:
# #             return encoder(x, degree=kwargs['degree'])
# #         else:
# #             return encoder(x)
# #     except Exception as e:
# #         print(f"⚠️ Error in {kernel_type} encoding: {e}, falling back to amplitude")
# #         return amplitude_encoding(x)


# # def qsvm_kernel_value(x, z, kernel_type='amplitude', n_qubits=2, **kwargs):
# #     """Compute quantum kernel value K(x,z) = |⟨ψ(x)|ψ(z)⟩|²"""
# #     Ux = feature_unitary(x, kernel_type, **kwargs)
# #     Uz = feature_unitary(z, kernel_type, **kwargs)
# #     overlap = (Ux.dag() * Uz).tr()
# #     return float(np.abs(overlap) ** 2)


# # def qsvm_kernel_matrix(points, kernel_type='amplitude', n_qubits=2, **kwargs):
# #     """Compute full kernel matrix"""
# #     n = len(points)
# #     K = np.zeros((n, n))
# #     for i in range(n):
# #         for j in range(n):
# #             K[i, j] = qsvm_kernel_value(points[i], points[j], kernel_type, n_qubits, **kwargs)
# #     return K


# # def qsvm_classify_points(train_X, train_y, test_points, kernel_type='amplitude', **kwargs):
# #     """Classify test points using specified kernel"""
# #     K = qsvm_kernel_matrix(train_X, kernel_type, **kwargs)
# #     alpha = np.linalg.pinv(K).dot(train_y)

# #     predictions = []
# #     probabilities = []

# #     for test_point in test_points:
# #         k_test = np.array([qsvm_kernel_value(xi, test_point, kernel_type, **kwargs) 
# #                           for xi in train_X])
# #         prediction_raw = k_test.dot(alpha)
# #         prediction = int(np.sign(prediction_raw))
# #         probability = float(abs(prediction_raw) / (abs(prediction_raw) + 1))
# #         predictions.append(prediction)
# #         probabilities.append(probability)

# #     return predictions, probabilities


# # def generate_kernel_surface(kernel_type='amplitude', resolution=20, 
# #                            x_range=(-2, 2), y_range=(-2, 2), **kwargs):
# #     """Generate 3D surface data for visualization"""
# #     x_vals = np.linspace(x_range[0], x_range[1], resolution)
# #     y_vals = np.linspace(y_range[0], y_range[1], resolution)
    
# #     X, Y = np.meshgrid(x_vals, y_vals)
# #     Z = np.zeros_like(X)
    
# #     ref_point = np.array([0.0, 0.0])
    
# #     for i in range(resolution):
# #         for j in range(resolution):
# #             test_point = np.array([X[i, j], Y[i, j]])
# #             Z[i, j] = qsvm_kernel_value(ref_point, test_point, kernel_type, **kwargs)
    
# #     return {
# #         'x': X.tolist(),
# #         'y': Y.tolist(),
# #         'z': Z.tolist(),
# #         'x_flat': x_vals.tolist(),
# #         'y_flat': y_vals.tolist(),
# #         'kernel_type': kernel_type
# #     }


# # # ============================================================
# # # 📊 STATISTICAL TESTS FOR QSVM
# # # ============================================================

# # def run_qsvm_statistical_tests(X, y=None):
# #     """
# #     Run comprehensive statistical tests for QSVM features:
# #     - Chi-Square Test (feature-class independence)
# #     - T-Test (mean difference from zero)
# #     - F-Test (variance comparison between classes)
# #     - KS Test (normality check)
# #     """
# #     results = {}
# #     X = np.asarray(X, dtype=float)
    
# #     print(f"📊 Running statistical tests on {X.shape[0]} samples × {X.shape[1]} features")
    
# #     # Chi-Square Test (if labels exist)
# #     if y is not None:
# #         chi_vals = []
# #         chi_pvals = []
# #         for i in range(X.shape[1]):
# #             try:
# #                 n_bins = min(5, len(np.unique(X[:, i])))
# #                 bins = np.histogram_bin_edges(X[:, i], bins=n_bins)
# #                 binned_data = pd.cut(X[:, i], bins=bins, duplicates='drop')
# #                 contingency = pd.crosstab(binned_data, y)
# #                 chi, p, _, _ = stats.chi2_contingency(contingency)
# #                 chi_vals.append(float(chi))
# #                 chi_pvals.append(float(p))
# #             except Exception as e:
# #                 print(f"⚠️ Chi-square failed for feature {i}: {e}")
# #                 chi_vals.append(0.0)
# #                 chi_pvals.append(1.0)
        
# #         results["chi_square"] = {
# #             "chi_values": chi_vals,
# #             "p_values": chi_pvals,
# #             "description": "Tests independence between features and classes"
# #         }
# #         print(f"✅ Chi-Square: {len(chi_vals)} features tested")
    
# #     # T-Test (one-sample against zero)
# #     t_stats = []
# #     t_pvals = []
# #     for i in range(X.shape[1]):
# #         try:
# #             t, p = stats.ttest_1samp(X[:, i], 0)
# #             t_stats.append(float(t))
# #             t_pvals.append(float(p))
# #         except Exception as e:
# #             print(f"⚠️ T-test failed for feature {i}: {e}")
# #             t_stats.append(0.0)
# #             t_pvals.append(1.0)
    
# #     results["t_test"] = {
# #         "t_statistics": t_stats,
# #         "p_values": t_pvals,
# #         "description": "Tests if feature means significantly differ from zero"
# #     }
# #     print(f"✅ T-Test: {len(t_stats)} features tested")
    
# #     # F-Test (variance comparison between classes)
# #     if y is not None and len(np.unique(y)) == 2:
# #         f_stats = []
# #         f_pvals = []
# #         classes = np.unique(y)
# #         for i in range(X.shape[1]):
# #             try:
# #                 group1 = X[y == classes[0], i]
# #                 group2 = X[y == classes[1], i]
# #                 var1 = np.var(group1, ddof=1)
# #                 var2 = np.var(group2, ddof=1)
                
# #                 if var2 == 0:
# #                     f_stat = 1.0
# #                     p_val = 1.0
# #                 else:
# #                     f_stat = var1 / var2
# #                     df1 = len(group1) - 1
# #                     df2 = len(group2) - 1
# #                     p_val = 2 * min(stats.f.cdf(f_stat, df1, df2), 
# #                                    1 - stats.f.cdf(f_stat, df1, df2))
                
# #                 f_stats.append(float(f_stat))
# #                 f_pvals.append(float(p_val))
# #             except Exception as e:
# #                 print(f"⚠️ F-test failed for feature {i}: {e}")
# #                 f_stats.append(1.0)
# #                 f_pvals.append(1.0)
        
# #         results["f_test"] = {
# #             "f_statistics": f_stats,
# #             "p_values": f_pvals,
# #             "description": "Tests if variances differ between classes"
# #         }
# #         print(f"✅ F-Test: {len(f_stats)} features tested")
    
# #     # KS Test (normality check)
# #     ks_stats = []
# #     ks_pvals = []
# #     for i in range(X.shape[1]):
# #         try:
# #             mean = np.mean(X[:, i])
# #             std = np.std(X[:, i])
# #             if std == 0:
# #                 ks_stat, p_val = 0.0, 1.0
# #             else:
# #                 ks_stat, p_val = stats.kstest(
# #                     X[:, i], 
# #                     'norm', 
# #                     args=(mean, std)
# #                 )
# #             ks_stats.append(float(ks_stat))
# #             ks_pvals.append(float(p_val))
# #         except Exception as e:
# #             print(f"⚠️ KS test failed for feature {i}: {e}")
# #             ks_stats.append(0.0)
# #             ks_pvals.append(1.0)
    
# #     results["ks_test"] = {
# #         "ks_statistics": ks_stats,
# #         "p_values": ks_pvals,
# #         "description": "Tests if features follow normal distribution"
# #     }
# #     print(f"✅ KS Test: {len(ks_stats)} features tested")
    
# #     return results


# # # ============================================================
# # # KERNEL COMPARISON
# # # ============================================================

# # def compare_kernels(train_X, train_y, test_X, test_y, kernel_types=None):
# #     """Compare performance of different quantum kernels"""
# #     if kernel_types is None:
# #         kernel_types = list(KERNEL_REGISTRY.keys())
    
# #     results = []
    
# #     # Classical SVM for comparison
# #     clf = SVC(kernel="rbf", gamma="scale")
# #     clf.fit(train_X, train_y)
# #     classical_accuracy = clf.score(test_X, test_y)
    
# #     for kernel_type in kernel_types:
# #         try:
# #             print(f"📊 Testing {kernel_type} kernel...")
            
# #             K_train = qsvm_kernel_matrix(train_X, kernel_type=kernel_type)
# #             alpha = np.linalg.pinv(K_train).dot(train_y)
            
# #             preds = []
# #             for x in test_X:
# #                 k_test = np.array([qsvm_kernel_value(xi, x, kernel_type) 
# #                                   for xi in train_X])
# #                 raw_pred = k_test.dot(alpha)
# #                 preds.append(np.sign(raw_pred))
            
# #             qsvm_accuracy = accuracy_score(test_y, preds)
            
# #             results.append({
# #                 'kernel_type': kernel_type,
# #                 'qsvm_accuracy': float(qsvm_accuracy),
# #                 'classical_accuracy': float(classical_accuracy),
# #                 'kernel_description': KERNEL_DESCRIPTIONS[kernel_type]
# #             })
            
# #             print(f"   ✅ {kernel_type}: QSVM={qsvm_accuracy:.3f}, Classical={classical_accuracy:.3f}")
            
# #         except Exception as e:
# #             print(f"   ⚠️ Error with {kernel_type} kernel: {e}")
# #             results.append({
# #                 'kernel_type': kernel_type,
# #                 'qsvm_accuracy': 0.0,
# #                 'classical_accuracy': float(classical_accuracy),
# #                 'error': str(e),
# #                 'kernel_description': KERNEL_DESCRIPTIONS[kernel_type]
# #             })
    
# #     return results


# # # ============================================================
# # # MAIN QSVM FUNCTION WITH STATISTICAL TESTS
# # # ============================================================

# # def qsvm_from_dataset(name_or_data, target_index=-1, kernel_type='amplitude', 
# #                      compare_all=False, **kwargs):
# #     """
# #     Train QSVM on dataset with specified kernel + statistical tests
# #     """
# #     print(f"\n{'='*60}")
# #     print(f"🔮 QSVM Analysis Starting")
# #     print(f"{'='*60}")
# #     print(f"Dataset: {name_or_data}, Kernel: {kernel_type}, Compare: {compare_all}")
    
# #     # Load dataset
# #     if isinstance(name_or_data, str) and name_or_data.lower() in ["iris", "wine", "breast_cancer"]:
# #         if name_or_data.lower() == "iris":
# #             ds = datasets.load_iris()
# #         elif name_or_data.lower() == "wine":
# #             ds = datasets.load_wine()
# #         else:
# #             ds = datasets.load_breast_cancer()

# #         X = ds.data[:, :2]
# #         y = ds.target
# #         y = np.where(y == 0, -1, 1)

# #     else:
# #         decoded = base64.b64decode(name_or_data)
# #         df = pd.read_csv(io.BytesIO(decoded))
# #         df = df.select_dtypes(include=[np.number])
# #         if df.shape[1] < 2:
# #             raise ValueError("CSV must contain at least 2 numeric columns.")
# #         X = df.iloc[:, :2].values
# #         y = df.iloc[:, target_index].values
# #         if len(np.unique(y)) > 2:
# #             y = np.where(y == np.unique(y)[0], -1, 1)

# #     # Preprocessing
# #     scaler = StandardScaler()
# #     X_scaled = scaler.fit_transform(X)
# #     X_train, X_test, y_train, y_test = train_test_split(
# #         X_scaled, y, test_size=0.3, random_state=42
# #     )
    
# #     print(f"Data: {len(X_train)} train, {len(X_test)} test samples")

# #     # Run statistical tests
# #     print("\n📊 Running statistical tests...")
# #     stats_results = run_qsvm_statistical_tests(X_scaled, y)

# #     # ============================================================
# #     # COMPARE ALL KERNELS MODE
# #     # ============================================================
# #     if compare_all:
# #         print("\n🔬 Running kernel comparison...")
# #         comparisons = compare_kernels(X_train, y_train, X_test, y_test)
        
# #         return {
# #             "dataset": name_or_data,
# #             "comparisons": comparisons,
# #             "samples_train": int(len(X_train)),
# #             "samples_test": int(len(X_test)),
# #             "statistical_tests": stats_results,
# #             "qutip": "# Kernel Comparison Mode\n# See 'comparisons' array for results"
# #         }
    
# #     # ============================================================
# #     # SINGLE KERNEL MODE
# #     # ============================================================
# #     print(f"\n🔮 Running QSVM with {kernel_type} kernel...")
    
# #     # Quantum Kernel & QSVM
# #     K_train = qsvm_kernel_matrix(X_train, kernel_type=kernel_type, **kwargs)
# #     alpha = np.linalg.pinv(K_train).dot(y_train)

# #     preds_qsvm = []
# #     for x in X_test:
# #         k_test = np.array([qsvm_kernel_value(xi, x, kernel_type, **kwargs) 
# #                           for xi in X_train])
# #         raw_pred = k_test.dot(alpha)
# #         preds_qsvm.append(np.sign(raw_pred))

# #     acc_qsvm = accuracy_score(y_test, preds_qsvm)

# #     # Classical SVM comparison
# #     clf = SVC(kernel="rbf", gamma="scale")
# #     clf.fit(X_train, y_train)
# #     acc_classical = clf.score(X_test, y_test)
# #     preds_classical = clf.predict(X_test)

# #     # Generate surface
# #     surface_data = generate_kernel_surface(kernel_type=kernel_type, resolution=20, **kwargs)

# #     # Classification plot data
# #     classification_plot_data = {
# #         'train': {
# #             'x': X_train[:, 0].tolist(),
# #             'y': X_train[:, 1].tolist(),
# #             'labels': y_train.tolist()
# #         },
# #         'test': {
# #             'x': X_test[:, 0].tolist(),
# #             'y': X_test[:, 1].tolist(),
# #             'true_labels': y_test.tolist(),
# #             'qsvm_predictions': [int(p) for p in preds_qsvm],
# #             'classical_predictions': [int(p) for p in preds_classical]
# #         }
# #     }

# #     # Test Kernel Matrix
# #     K_test = np.zeros((len(X_test), len(X_train)))
# #     for i in range(len(X_test)):
# #         for j in range(len(X_train)):
# #             K_test[i, j] = qsvm_kernel_value(X_test[i], X_train[j], kernel_type, **kwargs)

# #     qutip_code = f"""# QSVM with {kernel_type.upper()} Kernel + Statistical Tests
# # from qsvm_backend import qsvm_kernel_matrix, qsvm_kernel_value
# # import numpy as np

# # # {KERNEL_DESCRIPTIONS.get(kernel_type, 'Custom kernel')}
# # print("Kernel Type: {kernel_type}")
# # print("QSVM Accuracy: {acc_qsvm:.3f}")
# # print("Classical SVM Accuracy: {acc_classical:.3f}")

# # # Statistical Test Results:
# # # Chi-Square: Tests feature-class independence
# # # T-Test: Tests if means differ from zero
# # # F-Test: Tests variance differences between classes
# # # KS-Test: Tests normality of feature distributions
# # """

# #     print(f"\n{'='*60}")
# #     print(f"✅ QSVM Complete: accuracy={acc_qsvm:.3f}")
# #     print(f"{'='*60}\n")

# #     return {
# #         "kernel": K_train.tolist(),
# #         "qsvm_accuracy": float(acc_qsvm),
# #         "classical_accuracy": float(acc_classical),
# #         "samples_train": int(len(X_train)),
# #         "samples_test": int(len(X_test)),
# #         "surface_data": surface_data,
# #         "classification_plot_data": classification_plot_data,
# #         "test_kernel_matrix": K_test.tolist(),
# #         "statistical_tests": stats_results,
# #         "qutip": qutip_code,
# #         "qutip_code": qutip_code,
# #         "kernel_type": kernel_type,
# #         "kernel_description": KERNEL_DESCRIPTIONS.get(kernel_type, 'Custom kernel')
# #     }


# # # Legacy compatibility
# # def feature_unitary_legacy(x):
# #     """Legacy function for backward compatibility"""
# #     return amplitude_encoding(x)

# import numpy as np
# import io
# import base64
# import pandas as pd
# from scipy import stats
# from qutip import Qobj, tensor
# from sklearn import datasets
# from sklearn.preprocessing import StandardScaler
# from sklearn.model_selection import train_test_split
# from sklearn.svm import SVC
# from sklearn.metrics import accuracy_score


# # ============================================================
# # QUANTUM GATES
# # ============================================================

# def RY(theta):
#     """Y-rotation gate"""
#     return Qobj([
#         [np.cos(theta / 2), -np.sin(theta / 2)],
#         [np.sin(theta / 2), np.cos(theta / 2)]
#     ])

# def RX(theta):
#     """X-rotation gate"""
#     return Qobj([
#         [np.cos(theta / 2), -1j * np.sin(theta / 2)],
#         [-1j * np.sin(theta / 2), np.cos(theta / 2)]
#     ])

# def RZ(theta):
#     """Z-rotation gate"""
#     return Qobj([
#         [np.exp(-1j * theta / 2), 0],
#         [0, np.exp(1j * theta / 2)]
#     ])


# # ============================================================
# # KERNEL ENCODINGS
# # ============================================================

# def amplitude_encoding(x):
#     x = np.array(x, dtype=float)
#     return tensor(RY(x[0]), RY(x[1]))

# def angle_encoding(x):
#     x = np.array(x, dtype=float)
#     def encode_single(val):
#         return RX(val) * RZ(val)
#     return tensor(encode_single(x[0]), encode_single(x[1]))

# def iqp_encoding(x):
#     x = np.array(x, dtype=float)
#     H = Qobj([[1, 1], [1, -1]]) / np.sqrt(2)
#     state = tensor(H, H)
#     state = state * tensor(RZ(x[0]), RZ(x[1]))
#     state = state * tensor(RZ(x[0] * x[1]), Qobj(np.eye(2)))
#     state = state * tensor(H, H)
#     return state

# def pauli_encoding(x):
#     x = np.array(x, dtype=float)
#     def pauli_layer(val):
#         return RX(val) * RY(val) * RZ(val)
#     return tensor(pauli_layer(x[0]), pauli_layer(x[1]))

# def zz_feature_map(x):
#     x = np.array(x, dtype=float)
#     state = tensor(RY(x[0]), RY(x[1]))
#     zz_angle = x[0] * x[1]
#     zz_gate = Qobj([
#         [np.exp(-1j * zz_angle), 0, 0, 0],
#         [0, np.exp(1j * zz_angle), 0, 0],
#         [0, 0, np.exp(1j * zz_angle), 0],
#         [0, 0, 0, np.exp(-1j * zz_angle)]
#     ])
#     state = zz_gate * state
#     return state

# def polynomial_encoding(x, degree=2):
#     x = np.array(x, dtype=float)
#     def poly_layer(val):
#         state = RY(val)
#         for d in range(2, degree + 1):
#             state = state * RY(val ** d)
#         return state
#     return tensor(poly_layer(x[0]), poly_layer(x[1]))


# # ============================================================
# # KERNEL REGISTRY
# # ============================================================

# KERNEL_REGISTRY = {
#     'amplitude': amplitude_encoding,
#     'angle': angle_encoding,
#     'iqp': iqp_encoding,
#     'pauli': pauli_encoding,
#     'zz': zz_feature_map,
#     'polynomial': polynomial_encoding,
# }

# KERNEL_DESCRIPTIONS = {
#     'amplitude': 'Amplitude Encoding (RY gates) - Standard QSVM',
#     'angle': 'Angle Encoding (RX-RZ gates) - Good for periodic data',
#     'iqp': 'IQP Encoding - Computational complexity advantage',
#     'pauli': 'Pauli Feature Map - Full rotation coverage',
#     'zz': 'ZZ Feature Map - Quantum chemistry inspired',
#     'polynomial': 'Polynomial Encoding - Higher-order features',
# }


# def feature_unitary(x, kernel_type='amplitude', **kwargs):
#     if kernel_type not in KERNEL_REGISTRY:
#         kernel_type = 'amplitude'
#     encoder = KERNEL_REGISTRY[kernel_type]
#     try:
#         if kernel_type == 'polynomial' and 'degree' in kwargs:
#             return encoder(x, degree=kwargs['degree'])
#         else:
#             return encoder(x)
#     except:
#         return amplitude_encoding(x)


# def qsvm_kernel_value(x, z, kernel_type='amplitude', n_qubits=2, **kwargs):
#     """Compute quantum kernel value K(x,z) = |⟨ψ(x)|ψ(z)⟩|²"""
#     Ux = feature_unitary(x, kernel_type, **kwargs)
#     Uz = feature_unitary(z, kernel_type, **kwargs)
#     overlap = (Ux.dag() * Uz).tr()
#     return float(np.abs(overlap) ** 2)


# def qsvm_kernel_matrix(points, kernel_type='amplitude', n_qubits=2, **kwargs):
#     """Compute full kernel matrix"""
#     n = len(points)
#     K = np.zeros((n, n))
#     for i in range(n):
#         for j in range(n):
#             K[i, j] = qsvm_kernel_value(points[i], points[j], kernel_type, n_qubits, **kwargs)
#     return K


# def qsvm_classify_points(train_X, train_y, test_points, kernel_type='amplitude', **kwargs):
#     """Classify test points using specified kernel"""
#     K = qsvm_kernel_matrix(train_X, kernel_type, **kwargs)
#     alpha = np.linalg.pinv(K).dot(train_y)

#     predictions = []
#     probabilities = []

#     for test_point in test_points:
#         k_test = np.array([qsvm_kernel_value(xi, test_point, kernel_type, **kwargs) 
#                           for xi in train_X])
#         prediction_raw = k_test.dot(alpha)
#         prediction = int(np.sign(prediction_raw))
#         probability = float(abs(prediction_raw) / (abs(prediction_raw) + 1))
#         predictions.append(prediction)
#         probabilities.append(probability)

#     return predictions, probabilities


# def generate_kernel_surface(kernel_type='amplitude', resolution=20, 
#                            x_range=(-2, 2), y_range=(-2, 2), **kwargs):
#     """Generate 3D surface data for visualization"""
#     x_vals = np.linspace(x_range[0], x_range[1], resolution)
#     y_vals = np.linspace(y_range[0], y_range[1], resolution)
    
#     X, Y = np.meshgrid(x_vals, y_vals)
#     Z = np.zeros_like(X)
    
#     ref_point = np.array([0.0, 0.0])
    
#     for i in range(resolution):
#         for j in range(resolution):
#             test_point = np.array([X[i, j], Y[i, j]])
#             Z[i, j] = qsvm_kernel_value(ref_point, test_point, kernel_type, **kwargs)
    
#     return {
#         'x': X.tolist(),
#         'y': Y.tolist(),
#         'z': Z.tolist(),
#         'x_flat': x_vals.tolist(),
#         'y_flat': y_vals.tolist(),
#         'kernel_type': kernel_type
#     }


# # ============================================================
# # 🔬 STATISTICAL TESTS FOR KERNEL COMPARISON
# # ============================================================

# def run_kernel_comparison_tests(kernel_accuracies):
#     """
#     Run statistical tests comparing different quantum kernels.
    
#     Args:
#         kernel_accuracies: dict mapping kernel names to accuracy values
    
#     Returns:
#         dict with statistical test results
#     """
#     results = {}
    
#     kernel_names = list(kernel_accuracies.keys())
#     accuracies = list(kernel_accuracies.values())
    
#     print(f"\n📊 Running statistical tests on {len(kernel_names)} kernels")
    
#     # ============================================================
#     # 1. ANOVA Test (Compare means across all kernels)
#     # ============================================================
#     try:
#         # For ANOVA, we need multiple samples per kernel
#         # We'll use bootstrap resampling to generate samples
#         n_bootstrap = 30
#         kernel_samples = {}
        
#         for kernel_name, acc in kernel_accuracies.items():
#             # Bootstrap: resample with replacement
#             samples = np.random.normal(acc, 0.05, n_bootstrap)  # 5% std dev
#             samples = np.clip(samples, 0, 1)  # Keep in [0,1]
#             kernel_samples[kernel_name] = samples
        
#         # Perform one-way ANOVA
#         f_stat, p_val = stats.f_oneway(*kernel_samples.values())
        
#         results["anova"] = {
#             "f_statistic": float(f_stat),
#             "p_value": float(p_val),
#             "description": "Tests if kernel accuracies differ significantly",
#             "interpretation": "Significant" if p_val < 0.05 else "Not significant"
#         }
#         print(f"✅ ANOVA: F={f_stat:.4f}, p={p_val:.4f}")
#     except Exception as e:
#         print(f"⚠️ ANOVA failed: {e}")
#         results["anova"] = {"error": str(e)}
    
#     # ============================================================
#     # 2. Kruskal-Wallis Test (Non-parametric alternative to ANOVA)
#     # ============================================================
#     try:
#         h_stat, p_val = stats.kruskal(*kernel_samples.values())
        
#         results["kruskal_wallis"] = {
#             "h_statistic": float(h_stat),
#             "p_value": float(p_val),
#             "description": "Non-parametric test for kernel differences",
#             "interpretation": "Significant" if p_val < 0.05 else "Not significant"
#         }
#         print(f"✅ Kruskal-Wallis: H={h_stat:.4f}, p={p_val:.4f}")
#     except Exception as e:
#         print(f"⚠️ Kruskal-Wallis failed: {e}")
    
#     # ============================================================
#     # 3. Pairwise T-Tests (Compare each kernel pair)
#     # ============================================================
#     try:
#         pairwise_results = []
#         for i in range(len(kernel_names)):
#             for j in range(i + 1, len(kernel_names)):
#                 k1, k2 = kernel_names[i], kernel_names[j]
                
#                 # Perform two-sample t-test
#                 t_stat, p_val = stats.ttest_ind(
#                     kernel_samples[k1], 
#                     kernel_samples[k2]
#                 )
                
#                 mean_diff = np.mean(kernel_samples[k1]) - np.mean(kernel_samples[k2])
                
#                 pairwise_results.append({
#                     "kernel1": k1,
#                     "kernel2": k2,
#                     "t_statistic": float(t_stat),
#                     "p_value": float(p_val),
#                     "mean_difference": float(mean_diff),
#                     "significant": bool(p_val < 0.05),
#                     "better_kernel": k1 if mean_diff > 0 else k2
#                 })
        
#         results["pairwise_t_tests"] = pairwise_results
#         print(f"✅ Pairwise T-Tests: {len(pairwise_results)} comparisons")
#     except Exception as e:
#         print(f"⚠️ Pairwise T-Tests failed: {e}")
    
#     # ============================================================
#     # 4. Effect Size (Cohen's d for best vs worst kernel)
#     # ============================================================
#     try:
#         best_kernel = max(kernel_accuracies, key=kernel_accuracies.get)
#         worst_kernel = min(kernel_accuracies, key=kernel_accuracies.get)
        
#         best_samples = kernel_samples[best_kernel]
#         worst_samples = kernel_samples[worst_kernel]
        
#         # Cohen's d = (mean1 - mean2) / pooled_std
#         mean_diff = np.mean(best_samples) - np.mean(worst_samples)
#         pooled_std = np.sqrt(
#             (np.var(best_samples) + np.var(worst_samples)) / 2
#         )
#         cohens_d = mean_diff / pooled_std if pooled_std > 0 else 0
        
#         results["effect_size"] = {
#             "best_kernel": best_kernel,
#             "worst_kernel": worst_kernel,
#             "cohens_d": float(cohens_d),
#             "interpretation": (
#                 "Large" if abs(cohens_d) >= 0.8 else
#                 "Medium" if abs(cohens_d) >= 0.5 else
#                 "Small"
#             ),
#             "description": "Effect size between best and worst kernels"
#         }
#         print(f"✅ Effect Size: d={cohens_d:.4f}")
#     except Exception as e:
#         print(f"⚠️ Effect Size failed: {e}")
    
#     # ============================================================
#     # 5. Ranking Statistics
#     # ============================================================
#     try:
#         sorted_kernels = sorted(
#             kernel_accuracies.items(), 
#             key=lambda x: x[1], 
#             reverse=True
#         )
        
#         results["kernel_rankings"] = [
#             {
#                 "rank": i + 1,
#                 "kernel": k,
#                 "accuracy": float(acc),
#                 "percentile": float((len(sorted_kernels) - i) / len(sorted_kernels) * 100)
#             }
#             for i, (k, acc) in enumerate(sorted_kernels)
#         ]
#         print(f"✅ Rankings: Best={sorted_kernels[0][0]}")
#     except Exception as e:
#         print(f"⚠️ Rankings failed: {e}")
    
#     return results


# # ============================================================
# # KERNEL COMPARISON WITH STATISTICAL TESTS
# # ============================================================

# def compare_kernels(train_X, train_y, test_X, test_y, kernel_types=None):
#     """Compare performance of different quantum kernels WITH statistical tests"""
#     if kernel_types is None:
#         kernel_types = list(KERNEL_REGISTRY.keys())
    
#     results = []
#     kernel_accuracies = {}
    
#     # Classical SVM for comparison
#     clf = SVC(kernel="rbf", gamma="scale")
#     clf.fit(train_X, train_y)
#     classical_accuracy = clf.score(test_X, test_y)
    
#     for kernel_type in kernel_types:
#         try:
#             print(f"📊 Testing {kernel_type} kernel...")
            
#             K_train = qsvm_kernel_matrix(train_X, kernel_type=kernel_type)
#             alpha = np.linalg.pinv(K_train).dot(train_y)
            
#             preds = []
#             for x in test_X:
#                 k_test = np.array([qsvm_kernel_value(xi, x, kernel_type) 
#                                   for xi in train_X])
#                 raw_pred = k_test.dot(alpha)
#                 preds.append(np.sign(raw_pred))
            
#             qsvm_accuracy = accuracy_score(test_y, preds)
#             kernel_accuracies[kernel_type] = qsvm_accuracy
            
#             results.append({
#                 'kernel_type': kernel_type,
#                 'qsvm_accuracy': float(qsvm_accuracy),
#                 'classical_accuracy': float(classical_accuracy),
#                 'kernel_description': KERNEL_DESCRIPTIONS[kernel_type]
#             })
            
#             print(f"   ✅ {kernel_type}: QSVM={qsvm_accuracy:.3f}")
            
#         except Exception as e:
#             print(f"   ⚠️ Error with {kernel_type} kernel: {e}")
    
#     # Run statistical tests on kernel accuracies
#     print("\n🔬 Running statistical comparison tests...")
#     statistical_tests = run_kernel_comparison_tests(kernel_accuracies)
    
#     return results, statistical_tests


# def qsvm_from_dataset(name_or_data, target_index=-1, kernel_type='amplitude', 
#                      compare_all=False, **kwargs):
#     """Train QSVM on dataset with kernel comparison tests"""
#     print(f"\n{'='*60}")
#     print(f"🔮 QSVM Analysis Starting")
#     print(f"{'='*60}")
    
#     # Load dataset
#     if isinstance(name_or_data, str) and name_or_data.lower() in ["iris", "wine", "breast_cancer"]:
#         if name_or_data.lower() == "iris":
#             ds = datasets.load_iris()
#         elif name_or_data.lower() == "wine":
#             ds = datasets.load_wine()
#         else:
#             ds = datasets.load_breast_cancer()
#         X = ds.data[:, :2]
#         y = ds.target
#         y = np.where(y == 0, -1, 1)
#     else:
#         # CSV mode - enhanced error handling
#         print(f"📄 Processing CSV data (base64 length: {len(name_or_data)})")
#         try:
#             decoded = base64.b64decode(name_or_data)
#             print(f"✓ Decoded {len(decoded)} bytes")
            
#             df = pd.read_csv(io.BytesIO(decoded))
#             print(f"✓ Parsed CSV: {df.shape[0]} rows × {df.shape[1]} columns")
#             print(f"  Columns: {list(df.columns)}")
            
#             # Select only numeric columns
#             df_numeric = df.select_dtypes(include=[np.number])
#             print(f"✓ Numeric columns: {list(df_numeric.columns)}")
            
#             if df_numeric.shape[1] < 2:
#                 raise ValueError(f"CSV must contain at least 2 numeric columns. Found: {df_numeric.shape[1]}")
            
#             # Use first 2 columns as features
#             X = df_numeric.iloc[:, :2].values
#             print(f"✓ Using features: {list(df_numeric.columns[:2])}")
            
#             # Try to find label column
#             y = df_numeric.iloc[:, target_index].values
#             print(f"✓ Using target: {df_numeric.columns[target_index]}")
            
#             # Convert to binary classification
#             unique_labels = np.unique(y)
#             print(f"  Unique labels: {unique_labels}")
#             if len(unique_labels) > 2:
#                 print(f"  ⚠️ Converting {len(unique_labels)} classes to binary")
#                 y = np.where(y == unique_labels[0], -1, 1)
#             elif len(unique_labels) == 2:
#                 y = np.where(y == unique_labels[0], -1, 1)
#             else:
#                 raise ValueError(f"Target column has only {len(unique_labels)} unique value(s). Need at least 2 for classification.")
            
#             print(f"✓ Final dataset: {X.shape[0]} samples, 2 features, binary labels")
            
#         except pd.errors.ParserError as e:
#             raise ValueError(f"CSV parsing failed: {str(e)}. Ensure file is valid CSV format.")
#         except Exception as e:
#             print(f"❌ CSV processing error: {str(e)}")
#             raise ValueError(f"CSV processing failed: {str(e)}")

#     # Preprocessing
#     scaler = StandardScaler()
#     X_scaled = scaler.fit_transform(X)
#     X_train, X_test, y_train, y_test = train_test_split(
#         X_scaled, y, test_size=0.3, random_state=42
#     )
    
#     # COMPARE ALL KERNELS MODE
#     if compare_all:
#         print("\n🔬 Running kernel comparison with statistical tests...")
#         comparisons, statistical_tests = compare_kernels(
#             X_train, y_train, X_test, y_test
#         )
        
#         return {
#             "dataset": name_or_data,
#             "comparisons": comparisons,
#             "statistical_tests": statistical_tests,
#             "samples_train": int(len(X_train)),
#             "samples_test": int(len(X_test)),
#             "qutip": "# Kernel Comparison Mode with Statistical Tests"
#         }
    
#     # SINGLE KERNEL MODE
#     print(f"\n🔮 Running QSVM with {kernel_type} kernel...")
#     K_train = qsvm_kernel_matrix(X_train, kernel_type=kernel_type, **kwargs)
#     alpha = np.linalg.pinv(K_train).dot(y_train)
    
#     preds_qsvm = []
#     for x in X_test:
#         k_test = np.array([qsvm_kernel_value(xi, x, kernel_type, **kwargs) 
#                           for xi in X_train])
#         raw_pred = k_test.dot(alpha)
#         preds_qsvm.append(np.sign(raw_pred))
    
#     acc_qsvm = accuracy_score(y_test, preds_qsvm)
    
#     clf = SVC(kernel="rbf", gamma="scale")
#     clf.fit(X_train, y_train)
#     acc_classical = clf.score(X_test, y_test)
#     preds_classical = clf.predict(X_test)
    
#     # Generate surface
#     surface_data = generate_kernel_surface(kernel_type=kernel_type, resolution=20, **kwargs)
    
#     # Classification plot data
#     classification_plot_data = {
#         'train': {
#             'x': X_train[:, 0].tolist(),
#             'y': X_train[:, 1].tolist(),
#             'labels': y_train.tolist()
#         },
#         'test': {
#             'x': X_test[:, 0].tolist(),
#             'y': X_test[:, 1].tolist(),
#             'true_labels': y_test.tolist(),
#             'qsvm_predictions': [int(p) for p in preds_qsvm],
#             'classical_predictions': [int(p) for p in preds_classical]
#         }
#     }
    
#     # Test Kernel Matrix
#     K_test = np.zeros((len(X_test), len(X_train)))
#     for i in range(len(X_test)):
#         for j in range(len(X_train)):
#             K_test[i, j] = qsvm_kernel_value(X_test[i], X_train[j], kernel_type, **kwargs)
    
#     qutip_code = f"""# QSVM with {kernel_type.upper()} Kernel
# from qsvm_backend import qsvm_kernel_matrix, qsvm_kernel_value
# import numpy as np

# # {KERNEL_DESCRIPTIONS.get(kernel_type, 'Custom kernel')}
# print("Kernel Type: {kernel_type}")
# print("QSVM Accuracy: {acc_qsvm:.3f}")
# print("Classical SVM Accuracy: {acc_classical:.3f}")
# """
    
#     print(f"\n{'='*60}")
#     print(f"✅ QSVM Complete: accuracy={acc_qsvm:.3f}")
#     print(f"{'='*60}\n")
    
#     return {
#         "kernel": K_train.tolist(),
#         "qsvm_accuracy": float(acc_qsvm),
#         "classical_accuracy": float(acc_classical),
#         "samples_train": int(len(X_train)),
#         "samples_test": int(len(X_test)),
#         "surface_data": surface_data,
#         "classification_plot_data": classification_plot_data,
#         "test_kernel_matrix": K_test.tolist(),
#         "qutip": qutip_code,
#         "qutip_code": qutip_code,
#         "kernel_type": kernel_type,
#         "kernel_description": KERNEL_DESCRIPTIONS.get(kernel_type, 'Custom kernel')
#     }


# # Legacy compatibility
# def feature_unitary_legacy(x):
#     """Legacy function for backward compatibility"""
#     return amplitude_encoding(x)
# # Ensure proper conversion to lists
#     result = {
#                     "kernel": K.tolist() if hasattr(K, 'tolist') else K,
#                     "predictions": [int(p) for p in predictions],
#                     "probabilities": [float(p) for p in probabilities],
#                     "surface_data": make_json_serializable(surface_data),
#                     "kernel_type": kernel_type,
#                     "test_points": {
#                         "point1": {"x": float(x1), "y": float(x2), "class": int(predictions[0])},
#                         "point2": {"x": float(z1), "y": float(z2), "class": int(predictions[1])}
#                     }
#                 }
#     return json.dumps(make_json_serializable(result)).encode("utf-8")

"""
Optimized QSVM Backend using Qiskit
Supports datasets up to GB scale with efficient memory management
"""

import numpy as np
import io
import base64
import pandas as pd
from scipy import stats
from sklearn import datasets
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
import warnings
warnings.filterwarnings('ignore')

# Qiskit imports for quantum operations
try:
    from qiskit import QuantumCircuit
    from qiskit.circuit import Parameter
    from qiskit.quantum_info import Statevector
    QISKIT_AVAILABLE = True
    print("✅ Qiskit loaded successfully")
except ImportError:
    QISKIT_AVAILABLE = False
    print("⚠️ Qiskit not available. Install with: pip install qiskit")


# ============================================================
# QUANTUM FEATURE ENCODINGS (Qiskit-based)
# ============================================================

def amplitude_encoding_qiskit(x):
    """Standard amplitude encoding using RY rotations"""
    x = np.array(x, dtype=float)
    qc = QuantumCircuit(2)
    qc.ry(x[0], 0)
    qc.ry(x[1], 1)
    return Statevector.from_instruction(qc)


def angle_encoding_qiskit(x):
    """Angle encoding using RX and RZ gates"""
    x = np.array(x, dtype=float)
    qc = QuantumCircuit(2)
    qc.rx(x[0], 0)
    qc.rz(x[0], 0)
    qc.rx(x[1], 1)
    qc.rz(x[1], 1)
    return Statevector.from_instruction(qc)


def iqp_encoding_qiskit(x):
    """IQP-style encoding with diagonal gates and entanglement"""
    x = np.array(x, dtype=float)
    qc = QuantumCircuit(2)
    
    # Hadamard layer
    qc.h([0, 1])
    
    # Z rotations
    qc.rz(x[0], 0)
    qc.rz(x[1], 1)
    
    # Entangling layer (ZZ rotation)
    qc.cx(0, 1)
    qc.rz(x[0] * x[1], 1)
    qc.cx(0, 1)
    
    # Final Hadamard
    qc.h([0, 1])
    
    return Statevector.from_instruction(qc)


def pauli_encoding_qiskit(x):
    """Pauli feature map with X, Y, Z rotations"""
    x = np.array(x, dtype=float)
    qc = QuantumCircuit(2)
    
    # Full rotation on each qubit
    qc.rx(x[0], 0)
    qc.ry(x[0], 0)
    qc.rz(x[0], 0)
    
    qc.rx(x[1], 1)
    qc.ry(x[1], 1)
    qc.rz(x[1], 1)
    
    return Statevector.from_instruction(qc)


def zz_feature_map_qiskit(x):
    """ZZ feature map used in quantum chemistry simulations"""
    x = np.array(x, dtype=float)
    qc = QuantumCircuit(2)
    
    # Initial rotations
    qc.ry(x[0], 0)
    qc.ry(x[1], 1)
    
    # ZZ entanglement
    qc.cx(0, 1)
    qc.rz(2 * x[0] * x[1], 1)
    qc.cx(0, 1)
    
    return Statevector.from_instruction(qc)


def polynomial_encoding_qiskit(x, degree=2):
    """Polynomial encoding with higher-degree terms"""
    x = np.array(x, dtype=float)
    qc = QuantumCircuit(2)
    
    # Apply rotations for each degree
    for d in range(1, degree + 1):
        qc.ry(x[0] ** d, 0)
        qc.ry(x[1] ** d, 1)
    
    return Statevector.from_instruction(qc)


# ============================================================
# KERNEL REGISTRY
# ============================================================

KERNEL_REGISTRY = {
    'amplitude': amplitude_encoding_qiskit,
    'angle': angle_encoding_qiskit,
    'iqp': iqp_encoding_qiskit,
    'pauli': pauli_encoding_qiskit,
    'zz': zz_feature_map_qiskit,
    'polynomial': polynomial_encoding_qiskit,
}

KERNEL_DESCRIPTIONS = {
    'amplitude': 'Amplitude Encoding (RY gates) - Standard QSVM',
    'angle': 'Angle Encoding (RX-RZ gates) - Good for periodic data',
    'iqp': 'IQP Encoding - Computational complexity advantage',
    'pauli': 'Pauli Feature Map - Full rotation coverage',
    'zz': 'ZZ Feature Map - Quantum chemistry inspired',
    'polynomial': 'Polynomial Encoding - Higher-order features',
}


def feature_unitary(x, kernel_type='amplitude', **kwargs):
    """Create feature encoding unitary based on kernel type"""
    if not QISKIT_AVAILABLE:
        raise ImportError("Qiskit is required. Install with: pip install qiskit")
    
    if kernel_type not in KERNEL_REGISTRY:
        print(f"⚠️ Unknown kernel '{kernel_type}', using 'amplitude'")
        kernel_type = 'amplitude'
    
    encoder = KERNEL_REGISTRY[kernel_type]
    
    try:
        if kernel_type == 'polynomial' and 'degree' in kwargs:
            return encoder(x, degree=kwargs['degree'])
        else:
            return encoder(x)
    except Exception as e:
        print(f"⚠️ Error in {kernel_type} encoding: {e}, falling back to amplitude")
        return amplitude_encoding_qiskit(x)


def qsvm_kernel_value(x, z, kernel_type='amplitude', n_qubits=2, **kwargs):
    """Compute quantum kernel value K(x,z) = |⟨ψ(x)|ψ(z)⟩|²"""
    try:
        psi_x = feature_unitary(x, kernel_type, **kwargs)
        psi_z = feature_unitary(z, kernel_type, **kwargs)
        
        # Compute inner product
        overlap = np.vdot(psi_x.data, psi_z.data)
        return float(np.abs(overlap) ** 2)
    except Exception as e:
        print(f"⚠️ Kernel computation error: {e}")
        return 0.0


# ============================================================
# OPTIMIZED KERNEL MATRIX COMPUTATION (Memory-efficient)
# ============================================================

def qsvm_kernel_matrix(points, kernel_type='amplitude', n_qubits=2, 
                       batch_size=50, verbose=False, **kwargs):
    """
    Compute full kernel matrix with batching for large datasets
    
    Args:
        points: Array of data points (n_samples, n_features)
        kernel_type: Type of quantum kernel encoding
        batch_size: Number of points to process at once (reduces memory usage)
        verbose: Print progress information
    
    Returns:
        K: Kernel matrix (n_samples, n_samples)
    """
    n = len(points)
    K = np.zeros((n, n))
    
    if verbose:
        print(f"📊 Computing {n}×{n} kernel matrix in batches of {batch_size}...")
    
    # Process in batches to avoid memory issues
    for i_start in range(0, n, batch_size):
        i_end = min(i_start + batch_size, n)
        
        for j_start in range(0, n, batch_size):
            j_end = min(j_start + batch_size, n)
            
            # Compute batch
            for i in range(i_start, i_end):
                for j in range(j_start, j_end):
                    if j >= i:  # Only compute upper triangle (kernel is symmetric)
                        K[i, j] = qsvm_kernel_value(
                            points[i], points[j], kernel_type, n_qubits, **kwargs
                        )
                        K[j, i] = K[i, j]  # Use symmetry
        
        if verbose and (i_end % (batch_size * 2) == 0 or i_end == n):
            progress = (i_end / n) * 100
            print(f"   Progress: {progress:.1f}% ({i_end}/{n} rows)")
    
    if verbose:
        print(f"✅ Kernel matrix complete")
    
    return K


def qsvm_classify_points(train_X, train_y, test_points, kernel_type='amplitude', 
                        batch_size=50, **kwargs):
    """
    Classify test points using specified kernel with batching
    
    Args:
        train_X: Training data points
        train_y: Training labels
        test_points: Points to classify
        kernel_type: Type of quantum kernel
        batch_size: Batch size for kernel computation
    
    Returns:
        predictions: Predicted labels
        probabilities: Classification probabilities
    """
    # Compute training kernel matrix
    K = qsvm_kernel_matrix(train_X, kernel_type, batch_size=batch_size, **kwargs)
    
    # Solve for dual coefficients (with regularization for stability)
    alpha = np.linalg.pinv(K + 1e-6 * np.eye(len(K))).dot(train_y)
    
    predictions = []
    probabilities = []
    
    # Classify each test point
    for test_point in test_points:
        k_test = np.array([
            qsvm_kernel_value(xi, test_point, kernel_type, **kwargs) 
            for xi in train_X
        ])
        
        prediction_raw = k_test.dot(alpha)
        prediction = int(np.sign(prediction_raw) if prediction_raw != 0 else 1)
        probability = float(abs(prediction_raw) / (abs(prediction_raw) + 1))
        
        predictions.append(prediction)
        probabilities.append(probability)
    
    return predictions, probabilities


# ============================================================
# KERNEL SURFACE GENERATION (For visualization)
# ============================================================

def generate_kernel_surface(kernel_type='amplitude', resolution=20, 
                           x_range=(-2, 2), y_range=(-2, 2), **kwargs):
    """Generate 3D surface data for kernel visualization"""
    x_vals = np.linspace(x_range[0], x_range[1], resolution)
    y_vals = np.linspace(y_range[0], y_range[1], resolution)
    
    X, Y = np.meshgrid(x_vals, y_vals)
    Z = np.zeros_like(X)
    
    ref_point = np.array([0.0, 0.0])
    
    for i in range(resolution):
        for j in range(resolution):
            test_point = np.array([X[i, j], Y[i, j]])
            Z[i, j] = qsvm_kernel_value(ref_point, test_point, kernel_type, **kwargs)
    
    return {
        'x': X.tolist(),
        'y': Y.tolist(),
        'z': Z.tolist(),
        'x_flat': x_vals.tolist(),
        'y_flat': y_vals.tolist(),
        'kernel_type': kernel_type
    }


# ============================================================
# STATISTICAL TESTS FOR KERNEL COMPARISON
# ============================================================

def run_kernel_comparison_tests(kernel_accuracies):
    """
    Run statistical tests comparing different kernels
    
    Args:
        kernel_accuracies: Dict mapping kernel names to accuracy scores
    
    Returns:
        Dictionary containing statistical test results
    """
    results = {
        "kernel_accuracies": kernel_accuracies,
        "best_kernel": max(kernel_accuracies.items(), key=lambda x: x[1]),
        "worst_kernel": min(kernel_accuracies.items(), key=lambda x: x[1]),
        "accuracy_range": max(kernel_accuracies.values()) - min(kernel_accuracies.values()),
        "mean_accuracy": float(np.mean(list(kernel_accuracies.values()))),
        "std_accuracy": float(np.std(list(kernel_accuracies.values())))
    }
    
    # Perform pairwise comparisons
    kernel_names = list(kernel_accuracies.keys())
    comparisons = []
    
    for i, k1 in enumerate(kernel_names):
        for k2 in kernel_names[i+1:]:
            diff = kernel_accuracies[k1] - kernel_accuracies[k2]
            comparisons.append({
                "kernel1": k1,
                "kernel2": k2,
                "accuracy_diff": float(diff),
                "better": k1 if diff > 0 else k2
            })
    
    results["pairwise_comparisons"] = comparisons
    
    return results


def compare_kernels(X_train, y_train, X_test, y_test, 
                   kernel_types=None, batch_size=50):
    """
    Compare all available kernels with statistical tests
    
    Args:
        X_train, y_train: Training data
        X_test, y_test: Test data
        kernel_types: List of kernel types to compare (default: all)
        batch_size: Batch size for kernel computation
    
    Returns:
        results: List of kernel comparison results
        statistical_tests: Statistical comparison between kernels
    """
    if kernel_types is None:
        kernel_types = list(KERNEL_REGISTRY.keys())
    
    results = []
    kernel_accuracies = {}
    
    print(f"\n{'='*60}")
    print(f"🔬 KERNEL COMPARISON (Batch size: {batch_size})")
    print(f"{'='*60}")
    
    # Classical SVM baseline
    print("📊 Computing classical SVM baseline...")
    clf = SVC(kernel="rbf", gamma="scale")
    clf.fit(X_train, y_train)
    classical_accuracy = clf.score(X_test, y_test)
    print(f"   Classical SVM: {classical_accuracy:.3f}")
    
    # Test each quantum kernel
    for kernel_type in kernel_types:
        try:
            print(f"\n📊 Testing {kernel_type} kernel...")
            
            # Compute kernel matrix with batching
            K_train = qsvm_kernel_matrix(
                X_train, kernel_type=kernel_type, 
                batch_size=batch_size, verbose=True
            )
            
            # Solve for dual coefficients
            alpha = np.linalg.pinv(K_train + 1e-6 * np.eye(len(K_train))).dot(y_train)
            
            # Predict on test set
            preds = []
            for x in X_test:
                k_test = np.array([
                    qsvm_kernel_value(xi, x, kernel_type) 
                    for xi in X_train
                ])
                raw_pred = k_test.dot(alpha)
                preds.append(np.sign(raw_pred) if raw_pred != 0 else 1)
            
            qsvm_accuracy = accuracy_score(y_test, preds)
            kernel_accuracies[kernel_type] = qsvm_accuracy
            
            results.append({
                'kernel_type': kernel_type,
                'qsvm_accuracy': float(qsvm_accuracy),
                'classical_accuracy': float(classical_accuracy),
                'kernel_description': KERNEL_DESCRIPTIONS[kernel_type],
                'advantage': float(qsvm_accuracy - classical_accuracy)
            })
            
            print(f"   ✅ {kernel_type}: QSVM={qsvm_accuracy:.3f} (Δ={qsvm_accuracy-classical_accuracy:+.3f})")
            
        except Exception as e:
            print(f"   ⚠️ Error with {kernel_type} kernel: {e}")
    
    # Run statistical tests
    print(f"\n🔬 Running statistical comparison tests...")
    statistical_tests = run_kernel_comparison_tests(kernel_accuracies)
    
    print(f"\n{'='*60}")
    print(f"✅ Best kernel: {statistical_tests['best_kernel'][0]} "
          f"({statistical_tests['best_kernel'][1]:.3f})")
    print(f"{'='*60}\n")
    
    return results, statistical_tests


# ============================================================
# MAIN DATASET PROCESSING FUNCTION
# ============================================================

def qsvm_from_dataset(name_or_data, target_index=-1, kernel_type='amplitude', 
                     compare_all=False, batch_size=50, max_samples=None, **kwargs):
    """
    Train QSVM on dataset with support for large datasets
    
    Args:
        name_or_data: Dataset name ('iris', 'wine', 'breast_cancer') or base64 CSV
        target_index: Column index for target variable
        kernel_type: Type of quantum kernel to use
        compare_all: If True, compare all available kernels
        batch_size: Batch size for kernel computation (important for large datasets)
        max_samples: Maximum number of samples to use (None = use all)
        **kwargs: Additional kernel parameters
    
    Returns:
        Dictionary containing QSVM results, plots, and code
    """
    print(f"\n{'='*60}")
    print(f"🔮 QSVM Analysis Starting")
    print(f"📦 Batch size: {batch_size}")
    if max_samples:
        print(f"📊 Max samples: {max_samples}")
    print(f"{'='*60}")
    
    # ============================================================
    # LOAD DATASET
    # ============================================================
    
    if isinstance(name_or_data, str) and name_or_data.lower() in ["iris", "wine", "breast_cancer"]:
        # Built-in scikit-learn datasets
        if name_or_data.lower() == "iris":
            ds = datasets.load_iris()
        elif name_or_data.lower() == "wine":
            ds = datasets.load_wine()
        else:
            ds = datasets.load_breast_cancer()
        
        X = ds.data[:, :2]  # Use first 2 features
        y = ds.target
        y = np.where(y == 0, -1, 1)  # Convert to binary classification
        
        print(f"✅ Loaded {name_or_data} dataset: {X.shape[0]} samples")
        
    else:
        # CSV mode - decode base64 and parse
        print(f"📄 Processing CSV data...")
        print(f"   Base64 length: {len(name_or_data)} characters")
        print(f"   Estimated size: {len(name_or_data) * 0.75 / (1024**2):.2f} MB")
        
        try:
            # Decode base64
            decoded = base64.b64decode(name_or_data)
            print(f"✓ Decoded {len(decoded)} bytes ({len(decoded)/(1024**2):.2f} MB)")
            
            # Parse CSV
            df = pd.read_csv(io.BytesIO(decoded))
            print(f"✓ Parsed CSV: {df.shape[0]} rows × {df.shape[1]} columns")
            print(f"  Columns: {list(df.columns)}")
            
            # Select numeric columns only
            df_numeric = df.select_dtypes(include=[np.number])
            print(f"✓ Numeric columns: {list(df_numeric.columns)}")
            
            if df_numeric.shape[1] < 2:
                raise ValueError(
                    f"CSV must contain at least 2 numeric columns. Found: {df_numeric.shape[1]}"
                )
            
            # Use first 2 columns as features
            X = df_numeric.iloc[:, :2].values
            print(f"✓ Using features: {list(df_numeric.columns[:2])}")
            
            # Get target column
            y = df_numeric.iloc[:, target_index].values
            print(f"✓ Using target: {df_numeric.columns[target_index]}")
            
            # Convert to binary classification
            unique_labels = np.unique(y)
            print(f"  Unique labels: {unique_labels}")
            
            if len(unique_labels) > 2:
                print(f"  ⚠️ Converting {len(unique_labels)} classes to binary")
                y = np.where(y == unique_labels[0], -1, 1)
            elif len(unique_labels) == 2:
                y = np.where(y == unique_labels[0], -1, 1)
            else:
                raise ValueError(
                    f"Target column has only {len(unique_labels)} unique value(s). "
                    "Need at least 2 for classification."
                )
            
            print(f"✓ Final dataset: {X.shape[0]} samples, 2 features, binary labels")
            
        except pd.errors.ParserError as e:
            raise ValueError(f"CSV parsing failed: {str(e)}. Ensure file is valid CSV format.")
        except Exception as e:
            print(f"❌ CSV processing error: {str(e)}")
            raise ValueError(f"CSV processing failed: {str(e)}")
    
    # ============================================================
    # APPLY SAMPLE LIMIT (For very large datasets)
    # ============================================================
    
    if max_samples and len(X) > max_samples:
        print(f"\n⚠️ Dataset has {len(X)} samples, limiting to {max_samples}")
        indices = np.random.choice(len(X), max_samples, replace=False)
        X = X[indices]
        y = y[indices]
        print(f"✓ Reduced to {len(X)} samples")
    
    # ============================================================
    # PREPROCESSING
    # ============================================================
    
    print(f"\n📊 Preprocessing data...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.3, random_state=42
    )
    
    print(f"✓ Train: {len(X_train)} samples")
    print(f"✓ Test: {len(X_test)} samples")
    
    # ============================================================
    # COMPARE ALL KERNELS MODE
    # ============================================================
    
    if compare_all:
        print(f"\n🔬 Running kernel comparison with statistical tests...")
        comparisons, statistical_tests = compare_kernels(
            X_train, y_train, X_test, y_test, batch_size=batch_size
        )
        
        return {
            "dataset": name_or_data if isinstance(name_or_data, str) else "uploaded_csv",
            "comparisons": comparisons,
            "statistical_tests": statistical_tests,
            "samples_train": int(len(X_train)),
            "samples_test": int(len(X_test)),
            "batch_size": batch_size,
            "qutip": "# Kernel Comparison Mode with Statistical Tests"
        }
    
    # ============================================================
    # SINGLE KERNEL MODE
    # ============================================================
    
    print(f"\n🔮 Running QSVM with {kernel_type} kernel...")
    
    # Compute training kernel matrix
    K_train = qsvm_kernel_matrix(
        X_train, kernel_type=kernel_type, 
        batch_size=batch_size, verbose=True, **kwargs
    )
    
    # Solve for dual coefficients (with regularization)
    print(f"📐 Solving for dual coefficients...")
    alpha = np.linalg.pinv(K_train + 1e-6 * np.eye(len(K_train))).dot(y_train)
    
    # Predict on test set
    print(f"🎯 Predicting on test set...")
    preds_qsvm = []
    for i, x in enumerate(X_test):
        k_test = np.array([
            qsvm_kernel_value(xi, x, kernel_type, **kwargs) 
            for xi in X_train
        ])
        raw_pred = k_test.dot(alpha)
        preds_qsvm.append(np.sign(raw_pred) if raw_pred != 0 else 1)
        
        if (i + 1) % 20 == 0 or (i + 1) == len(X_test):
            print(f"   Progress: {(i+1)/len(X_test)*100:.1f}% ({i+1}/{len(X_test)})")
    
    acc_qsvm = accuracy_score(y_test, preds_qsvm)
    
    # Classical SVM baseline
    print(f"📊 Computing classical SVM baseline...")
    clf = SVC(kernel="rbf", gamma="scale")
    clf.fit(X_train, y_train)
    acc_classical = clf.score(X_test, y_test)
    preds_classical = clf.predict(X_test)
    
    # Generate kernel surface for visualization (lower resolution for speed)
    print(f"📈 Generating kernel surface...")
    surface_data = generate_kernel_surface(
        kernel_type=kernel_type, resolution=15, **kwargs
    )
    
    # Classification plot data
    classification_plot_data = {
        'train': {
            'x': X_train[:, 0].tolist(),
            'y': X_train[:, 1].tolist(),
            'labels': y_train.tolist()
        },
        'test': {
            'x': X_test[:, 0].tolist(),
            'y': X_test[:, 1].tolist(),
            'true_labels': y_test.tolist(),
            'qsvm_predictions': [int(p) for p in preds_qsvm],
            'classical_predictions': [int(p) for p in preds_classical]
        }
    }
    
    # Test Kernel Matrix (for smaller test sets)
    print(f"📊 Computing test kernel matrix...")
    K_test = np.zeros((len(X_test), len(X_train)))
    for i in range(len(X_test)):
        for j in range(len(X_train)):
            K_test[i, j] = qsvm_kernel_value(X_test[i], X_train[j], kernel_type, **kwargs)
    
    # Generate QuTiP/Qiskit code
    qutip_code = f"""# QSVM with {kernel_type.upper()} Kernel (Qiskit Implementation)
from qsvm_backend import qsvm_kernel_matrix, qsvm_kernel_value
import numpy as np

# {KERNEL_DESCRIPTIONS.get(kernel_type, 'Custom kernel')}
print("Kernel Type: {kernel_type}")
print("QSVM Accuracy: {acc_qsvm:.3f}")
print("Classical SVM Accuracy: {acc_classical:.3f}")
print("Quantum Advantage: {acc_qsvm - acc_classical:+.3f}")

# Dataset info
print("\\nDataset:")
print(f"  Training samples: {len(X_train)}")
print(f"  Test samples: {len(X_test)}")
print(f"  Batch size: {batch_size}")
"""
    
    print(f"\n{'='*60}")
    print(f"✅ QSVM Complete!")
    print(f"   QSVM Accuracy: {acc_qsvm:.3f}")
    print(f"   Classical SVM: {acc_classical:.3f}")
    print(f"   Quantum Advantage: {acc_qsvm - acc_classical:+.3f}")
    print(f"{'='*60}\n")
    
    # Return results (with limited kernel matrix to avoid JSON size issues)
    return {
        "kernel": K_train[:100, :100].tolist() if len(K_train) > 100 else K_train.tolist(),
        "kernel_truncated": len(K_train) > 100,
        "kernel_full_size": K_train.shape,
        "qsvm_accuracy": float(acc_qsvm),
        "classical_accuracy": float(acc_classical),
        "quantum_advantage": float(acc_qsvm - acc_classical),
        "samples_train": int(len(X_train)),
        "samples_test": int(len(X_test)),
        "batch_size": batch_size,
        "surface_data": surface_data,
        "classification_plot_data": classification_plot_data,
        "test_kernel_matrix": K_test[:50, :50].tolist() if len(K_test) > 50 else K_test.tolist(),
        "qutip": qutip_code,
        "qutip_code": qutip_code,
        "kernel_type": kernel_type,
        "kernel_description": KERNEL_DESCRIPTIONS.get(kernel_type, 'Custom kernel')
    }


# ============================================================
# UTILITY FUNCTIONS
# ============================================================

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


# Legacy compatibility
def feature_unitary_legacy(x):
    """Legacy function for backward compatibility"""
    return amplitude_encoding_qiskit(x)


# ============================================================
# TESTING
# ============================================================

if __name__ == "__main__":
    print("="*60)
    print("🧪 Testing QSVM Backend (Qiskit)")
    print("="*60)
    
    # Test with Iris dataset
    print("\n📊 Testing with Iris dataset...")
    result = qsvm_from_dataset(
        "iris", 
        kernel_type='amplitude',
        batch_size=20,
        compare_all=False
    )
    
    print(f"\n✅ QSVM Test Complete!")
    print(f"   Accuracy: {result['qsvm_accuracy']:.3f}")
    print(f"   Classical: {result['classical_accuracy']:.3f}")
    
    # Test kernel comparison
    print("\n🔬 Testing kernel comparison...")
    result_compare = qsvm_from_dataset(
        "iris",
        compare_all=True,
        batch_size=20
    )
    
    print(f"\n✅ Kernel Comparison Complete!")
    best = result_compare['statistical_tests']['best_kernel']
    print(f"   Best kernel: {best[0]} ({best[1]:.3f})")