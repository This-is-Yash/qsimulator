#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Diagnostic script to test QSVM JSON serialization
Run this to identify any serialization issues before running the server
"""

import json
import numpy as np
import sys

# Test if qsvm_backend can be imported
try:
    from qsvm_backend import (
        qsvm_kernel_matrix,
        qsvm_classify_points,
        generate_kernel_surface
    )
    print("✅ QSVM backend imported successfully")
except ImportError as e:
    print(f"❌ Failed to import QSVM backend: {e}")
    sys.exit(1)


def test_manual_mode():
    """Test manual point classification"""
    print("\n" + "="*60)
    print("Testing Manual Mode")
    print("="*60)
    
    # Training data
    train_X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    train_y = np.array([1, 1, -1, -1])
    
    # Test points
    test_points = [np.array([0.0, 1.0]), np.array([1.0, 0.0])]
    
    print(f"Training data shape: {train_X.shape}")
    print(f"Test points: {test_points}")
    
    # Compute kernel
    K = qsvm_kernel_matrix(train_X)
    print(f"Kernel matrix shape: {K.shape}")
    print(f"Kernel matrix dtype: {K.dtype}")
    
    # Classify
    predictions, probabilities = qsvm_classify_points(train_X, train_y, test_points)
    print(f"\nPredictions: {predictions}")
    print(f"Predictions types: {[type(p) for p in predictions]}")
    print(f"Probabilities: {probabilities}")
    print(f"Probabilities types: {[type(p) for p in probabilities]}")
    
    # Generate surface
    surface_data = generate_kernel_surface(resolution=10)
    print(f"\nSurface data keys: {surface_data.keys()}")
    print(f"Surface x type: {type(surface_data['x'])}")
    print(f"Surface x[0] type: {type(surface_data['x'][0])}")
    
    # Build result dictionary
    result = {
        "xdata": ["Point 1", "Point 2"],
        "ydata": [float(probabilities[0]), float(probabilities[1])],
        "kernel": K.tolist(),
        "predictions": [int(predictions[0]), int(predictions[1])],
        "probabilities": [float(probabilities[0]), float(probabilities[1])],
        "surface_data": surface_data,
        "test_points": {
            "point1": {
                "x": float(0.0),
                "y": float(1.0),
                "class": int(predictions[0])
            },
            "point2": {
                "x": float(1.0),
                "y": float(0.0),
                "class": int(predictions[1])
            }
        },
        "qutip": "# Test code"
    }
    
    # Test JSON serialization
    print("\n" + "-"*60)
    print("Testing JSON Serialization")
    print("-"*60)
    
    try:
        json_str = json.dumps(result)
        print("✅ JSON serialization successful!")
        print(f"JSON length: {len(json_str)} characters")
        
        # Test deserialization
        decoded = json.loads(json_str)
        print("✅ JSON deserialization successful!")
        
        return True
        
    except Exception as e:
        print(f"❌ JSON serialization failed: {e}")
        print(f"Error type: {type(e)}")
        
        # Find problematic field
        print("\nTesting individual fields:")
        for key, value in result.items():
            try:
                json.dumps({key: value})
                print(f"  ✅ {key}: OK")
            except Exception as field_error:
                print(f"  ❌ {key}: {field_error}")
                print(f"     Value type: {type(value)}")
                if isinstance(value, (list, dict)):
                    print(f"     First item type: {type(value[0] if isinstance(value, list) else list(value.values())[0])}")
        
        return False


def test_dataset_mode():
    """Test dataset mode"""
    print("\n" + "="*60)
    print("Testing Dataset Mode (Iris)")
    print("="*60)
    
    try:
        from qsvm_backend import qsvm_from_dataset
        result = qsvm_from_dataset("iris")
        
        print(f"Result keys: {result.keys()}")
        print(f"QSVM Accuracy: {result['qsvm_accuracy']}")
        print(f"Classical Accuracy: {result['classical_accuracy']}")
        
        # Test JSON serialization
        json_str = json.dumps(result)
        print("✅ Dataset mode JSON serialization successful!")
        
        return True
        
    except Exception as e:
        print(f"❌ Dataset mode failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("🔬 QSVM Diagnostic Test")
    print("="*60)
    
    manual_ok = test_manual_mode()
    dataset_ok = test_dataset_mode()
    
    print("\n" + "="*60)
    print("Summary")
    print("="*60)
    print(f"Manual Mode: {'✅ PASS' if manual_ok else '❌ FAIL'}")
    print(f"Dataset Mode: {'✅ PASS' if dataset_ok else '❌ FAIL'}")
    
    if manual_ok and dataset_ok:
        print("\n🎉 All tests passed! QSVM backend is ready.")
        sys.exit(0)
    else:
        print("\n⚠️ Some tests failed. Check errors above.")
        sys.exit(1)