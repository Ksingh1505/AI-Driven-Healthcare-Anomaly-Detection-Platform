import streamlit as st
import pandas as pd
import requests
import plotly.express as px
import plotly.graph_objects as go
import time
import os

API_URL = os.getenv("API_URL", "http://backend:5000")

st.set_page_config(
    page_title="Healthcare Anomaly Dashboard",
    page_icon="🏥",
    layout="wide"
)

st.title("🏥 Real-time Healthcare Anomaly Detection")

# Auto-refresh
refresh_rate = st.sidebar.slider("Refresh Rate (seconds)", 1, 60, 5)

def fetch_patients():
    try:
        response = requests.get(f"{API_URL}/patients")
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        st.error(f"Failed to fetch patients: {e}")
    return []

def fetch_anomalies():
    try:
        response = requests.get(f"{API_URL}/anomalies")
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        pass
    return []

def fetch_patient_history(patient_id):
    try:
        response = requests.get(f"{API_URL}/patient/{patient_id}")
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        pass
    return []

patients = fetch_patients()
anomalies = fetch_anomalies()

# Top KPIs
col1, col2, col3 = st.columns(3)
col1.metric("Total Patients Monitored", len(patients))
col2.metric("Recent Anomalies", len(anomalies))
critical_anomalies = len([a for a in anomalies if a['severity_score'] > 0.8])
col3.metric("Critical Alerts", critical_anomalies, delta_color="inverse")

st.divider()

col_main, col_side = st.columns([3, 1])

with col_main:
    st.subheader("Patient Monitoring Panel")
    if patients:
        selected_patient = st.selectbox("Select Patient", ["-- Select --"] + patients)
        
        if selected_patient != "-- Select --":
            history = fetch_patient_history(selected_patient)
            if history:
                df = pd.DataFrame(history)
                df['timestamp'] = pd.to_datetime(df['timestamp'])
                
                # Plot Heart Rate
                fig_hr = go.Figure()
                fig_hr.add_trace(go.Scatter(x=df['timestamp'], y=df['heart_rate'], mode='lines', name='Heart Rate'))
                
                # Add anomaly markers
                anomalies_df = df[df['anomaly_flag'] == True]
                fig_hr.add_trace(go.Scatter(
                    x=anomalies_df['timestamp'], 
                    y=anomalies_df['heart_rate'],
                    mode='markers',
                    marker=dict(color='red', size=10, symbol='x'),
                    name='Anomaly'
                ))
                
                fig_hr.update_layout(title=f"Heart Rate over Time - {selected_patient}", height=300)
                st.plotly_chart(fig_hr, use_container_width=True)
                
                # Plot SpO2
                fig_spo2 = px.line(df, x='timestamp', y='spo2', title=f"SpO2 over Time - {selected_patient}")
                fig_spo2.update_layout(height=300)
                st.plotly_chart(fig_spo2, use_container_width=True)
                
            else:
                st.info("No history found for this patient.")

with col_side:
    st.subheader("Recent Alerts")
    if anomalies:
        for anomaly in anomalies[:5]:
            severity_color = "red" if anomaly['severity_score'] > 0.8 else "orange"
            st.markdown(
                f"""
                <div style="padding:10px; border-left: 5px solid {severity_color}; background-color:#1e1e1e; margin-bottom:10px; border-radius:5px;">
                    <strong>Patient:</strong> {anomaly['patient_id']}<br/>
                    <strong>Severity:</strong> {anomaly['severity_score']:.2f}<br/>
                    <strong>Time:</strong> {anomaly['timestamp']}<br/>
                </div>
                """, unsafe_allow_html=True
            )
    else:
        st.success("No recent anomalies detected.")

time.sleep(refresh_rate)
st.rerun()
