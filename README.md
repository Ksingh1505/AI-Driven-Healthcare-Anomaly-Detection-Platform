# AI-Driven Healthcare Anomaly Detection Platform

A real-time healthcare monitoring system that detects abnormal patient vitals using machine learning and deep learning.

## Tech Stack
- **Python** (Core Language)
- **Apache Kafka** (Streaming Pipeline)
- **Scikit-learn** (Isolation Forest Model)
- **TensorFlow/Keras** (Autoencoder Model)
- **PostgreSQL** (Database Layer)
- **Flask** (REST API)
- **Streamlit** (Dashboard)
- **Docker & Docker Compose** (Deployment)

## System Architecture
1. **Data Simulation (Producer)**: Simulates patient vitals and publishes to Kafka.
2. **Streaming Pipeline (Consumer)**: Reads from Kafka, processes data through Machine Learning models.
3. **Machine Learning**: Calculates anomaly flag, severity score, and Explainable AI metrics (SHAP).
4. **Database Layer**: Stores the processed patient vitals and anomaly results in PostgreSQL.
5. **Alerts**: Triggers SMTP email notifications for critical anomalies.
6. **Backend API**: Exposes patient data and anomalies via Flask.
7. **Dashboard**: Visualizes data in real-time using Streamlit and Plotly.

## Installation Steps

1. Clone the repository
2. Ensure Docker and Docker Compose are installed on your system.
3. Build and start the services:

```bash
docker-compose up --build
```

## Services
- **Kafka / Zookeeper**: Ports 29092, 22181
- **PostgreSQL**: Port 5432
- **Flask Backend API**: http://localhost:5000
- **Streamlit Dashboard**: http://localhost:8501

## Usage Instructions
1. Open http://localhost:8501 in your browser to access the dashboard.
2. The producer automatically generates simulated patient data and pushes it to Kafka.
3. The consumer automatically reads this data, detects anomalies, and saves them to the database.
4. Alerts are printed to the console (can be configured to send real emails in `alerts/notifier.py`).
5. Use the API at `http://localhost:5000/patients` and `http://localhost:5000/anomalies` to access data programmatically.

## Initial Setup for Machine Learning
Before running the stream processors, you can train and generate the baseline models:

```bash
pip install -r docker/requirements.txt
python training/train_models.py
```
This generates mock data, scales it, and trains the Isolation Forest and Autoencoder models, saving them to `models/saved/`. Note that the streaming pipeline is currently mocked for immediate execution.
