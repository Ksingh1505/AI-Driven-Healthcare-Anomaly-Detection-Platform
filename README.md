# AI-Driven Healthcare Anomaly Detection Platform

## Overview

The AI-Driven Healthcare Anomaly Detection Platform is a real-time monitoring system designed to detect abnormal patterns in patient vital signs using Machine Learning and streaming data pipelines.

Traditional healthcare monitoring systems rely on fixed thresholds and manual observation. This project improves patient monitoring by using machine learning models to automatically detect anomalies in physiological signals.

The system processes real-time patient data, identifies abnormal patterns, stores detected anomalies in a database, and visualizes results through an interactive dashboard.

---

## Features

• Real-time patient vital sign monitoring  
• Machine learning based anomaly detection  
• Streaming data pipeline using Kafka  
• Interactive dashboard for monitoring patients  
• Database storage for historical health data  
• Alert system for abnormal patient conditions  

---

## Tech Stack

### Backend
Python  
Flask  

### Machine Learning
Scikit-learn  
TensorFlow / Keras  

### Data Processing
Pandas  
NumPy  

### Streaming
Apache Kafka  

### Database
PostgreSQL  

### Visualization
Streamlit  
Plotly  

---

## System Architecture

Patient Vitals  
↓  
Kafka Producer  
↓  
Kafka Topic (Streaming Data)  
↓  
Kafka Consumer  
↓  
Machine Learning Model (Isolation Forest / Autoencoder)  
↓  
PostgreSQL Database  
↓  
Flask API  
↓  
Streamlit Dashboard  

---

## Machine Learning Models

### Isolation Forest

Isolation Forest is used to detect anomalies by isolating unusual observations in the dataset.

It works well for:
- high dimensional data
- unsupervised anomaly detection

### Autoencoder Neural Network

Autoencoder is a deep learning model that learns compressed representations of data and detects anomalies by measuring reconstruction error.

---

## Dataset

The system can work with:

• Simulated patient vital signs  
• ICU datasets such as PhysioNet  
• Healthcare monitoring datasets  

Example features:

- Heart Rate  
- SpO₂  
- Temperature  
- Blood Pressure  

---

## Installation

Clone the repository

Move into project folder
cd AI-Healthcare-Anomaly-Detection


Install dependencies


pip install -r requirements.txt


---

## Running the System

Start Kafka server

Start Kafka producer


python streaming/producer.py


Start Kafka consumer


python streaming/consumer.py


Start backend API


python backend/app.py


Start dashboard


streamlit run dashboard/app.py


---

## Dashboard

The Streamlit dashboard allows users to:

• Monitor patient vital signs  
• View anomaly alerts  
• Analyze trends in health data  
• Track patient history  

---

## Applications

This system can be used in:

• Hospitals  
• Remote patient monitoring systems  
• ICU monitoring systems  
• Healthcare analytics platforms  

---

## Future Improvements

• Integration with IoT medical devices  
• Real-time alert notifications  
• Explainable AI for anomaly interpretation  
• Deployment on cloud platforms  

---

## Author

Komal Singh  
B.Tech CSE (AI & ML)<img width="1904" height="877" alt="Screenshot 2026-03-07 153843" src="https://github.com/user-attachments/assets/03a38f60-5c75-49ed-9e04-07ded1d8fa05" />
<img width="1910" height="896" alt="Screenshot 2026-03-07 153831" src="https://github.com/user-attachments/assets/b99a3b9b-017e-408d-818a-78b0e0231e82" />
<img width="1915" height="902" alt="Screenshot 2026-03-07 153814" src="https://github.com/user-attachments/assets/5171356f-62bf-4f71-9a5e-0041d0b6a5c0" />
