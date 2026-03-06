import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow.keras import layers, models
import joblib

def create_mock_data(n_samples=10000):
    np.random.seed(42)
    data = {
        'heart_rate': np.random.normal(75, 10, n_samples),
        'spo2': np.random.normal(98, 1.5, n_samples),
        'temperature': np.random.normal(36.8, 0.4, n_samples),
        'blood_pressure_systolic': np.random.normal(110, 10, n_samples),
        'blood_pressure_diastolic': np.random.normal(70, 8, n_samples),
        'respiratory_rate': np.random.normal(16, 2, n_samples)
    }
    return pd.DataFrame(data)

def train_isolation_forest(X):
    clf = IsolationForest(contamination=0.05, random_state=42)
    clf.fit(X)
    return clf

def train_autoencoder(X):
    input_dim = X.shape[1]
    
    model = models.Sequential([
        layers.Dense(32, activation='relu', input_shape=(input_dim,)),
        layers.Dense(16, activation='relu'),
        layers.Dense(8, activation='relu'),
        layers.Dense(16, activation='relu'),
        layers.Dense(32, activation='relu'),
        layers.Dense(input_dim, activation='linear')
    ])
    
    model.compile(optimizer='adam', loss='mse')
    model.fit(X, X, epochs=10, batch_size=32, validation_split=0.1, verbose=1)
    return model

if __name__ == '__main__':
    print("Generating mock data...")
    df = create_mock_data()
    
    print("Scaling data...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df)
    
    os.makedirs('models/saved', exist_ok=True)
    joblib.dump(scaler, 'models/saved/scaler.pkl')
    
    print("Training Isolation Forest...")
    iso_forest = train_isolation_forest(X_scaled)
    joblib.dump(iso_forest, 'models/saved/iso_forest.pkl')
    
    print("Training Autoencoder...")
    autoencoder = train_autoencoder(X_scaled)
    autoencoder.save('models/saved/autoencoder.h5')
    
    print("Models trained and saved successfully.")
