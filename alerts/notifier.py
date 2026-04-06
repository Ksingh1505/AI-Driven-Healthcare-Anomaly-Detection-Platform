import smtplib
from email.mime.text import MIMEText
import os



SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = os.getenv("SMTP_PORT", "587")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "alert@healthcare.local")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "password")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL", "doctor@healthcare.local")

def send_alert(patient_id, vitals, severity, shap_values):
    subject = f"CRITICAL ALERT: Abnormal Vitals for Patient {patient_id}"
    body = f"""
    Anomaly Detected for Patient {patient_id}
    Severity Score: {severity:.2f}
    
    Current Vitals:
    Heart Rate: {vitals['heart_rate']:.1f}
    SpO2: {vitals['spo2']:.1f}
    Temperature: {vitals['temperature']:.1f}
    BP: {vitals['blood_pressure_systolic']:.1f}/{vitals['blood_pressure_diastolic']:.1f}
    Resp Rate: {vitals['respiratory_rate']:.1f}
    
    Key Drivers (Explainable AI / SHAP):
    {shap_values}
    """
    
    print(f"---- ALERT EMAILED ----\n{subject}\n{body}\n-----------------------")
    # In a real environment, uncomment to send email
    # msg = MIMEText(body)
    # msg['Subject'] = subject
    # msg['From'] = SENDER_EMAIL
    # msg['To'] = RECIPIENT_EMAIL
    # try:
    #     server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    #     server.starttls()
    #     server.login(SENDER_EMAIL, SENDER_PASSWORD)
    #     server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
    #     server.quit()
    # except Exception as e:
    #     print(f"Failed to send email: {e}")
