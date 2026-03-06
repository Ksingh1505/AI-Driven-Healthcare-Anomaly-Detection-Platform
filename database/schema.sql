CREATE TABLE IF NOT EXISTS vitals (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    heart_rate FLOAT NOT NULL,
    spo2 FLOAT NOT NULL,
    temperature FLOAT NOT NULL,
    blood_pressure_systolic FLOAT NOT NULL,
    blood_pressure_diastolic FLOAT NOT NULL,
    respiratory_rate FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    anomaly_flag BOOLEAN DEFAULT FALSE,
    severity_score FLOAT DEFAULT 0.0
);

CREATE INDEX idx_patient_id ON vitals(patient_id);
CREATE INDEX idx_timestamp ON vitals(timestamp);
