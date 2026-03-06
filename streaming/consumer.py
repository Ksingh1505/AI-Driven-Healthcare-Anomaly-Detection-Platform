import os
import json
import psycopg2
from confluent_kafka import Consumer, KafkaError
from alerts.notifier import send_alert
from models.anomaly_detector import AnomalyDetector

KAFKA_BROKER = os.getenv('KAFKA_BROKER', 'localhost:29092')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('POSTGRES_USER', 'healthcare_user')
DB_PASSWORD = os.getenv('POSTGRES_PASSWORD', 'healthcare_password')
DB_NAME = os.getenv('POSTGRES_DB', 'healthcare_db')
TOPIC = 'patient_vitals'

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

def insert_vitals(conn, data, anomaly_flag, severity):
    cur = conn.cursor()
    query = """
        INSERT INTO vitals (
            patient_id, heart_rate, spo2, temperature, 
            blood_pressure_systolic, blood_pressure_diastolic, 
            respiratory_rate, anomaly_flag, severity_score
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cur.execute(query, (
        data['patient_id'], data['heart_rate'], data['spo2'],
        data['temperature'], data['blood_pressure_systolic'],
        data['blood_pressure_diastolic'], data['respiratory_rate'],
        anomaly_flag, severity
    ))
    conn.commit()
    cur.close()

if __name__ == '__main__':
    consumer = Consumer({
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': 'vitals_processor',
        'auto.offset.reset': 'earliest'
    })
    
    consumer.subscribe([TOPIC])
    detector = AnomalyDetector()
    conn = get_db_connection()
    
    print(f"Starting consumer, waiting for messages on {TOPIC}...")
    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    print(msg.error())
                    break
            
            vitals = json.loads(msg.value().decode('utf-8'))
            
            # Predict anomaly
            is_anomaly, severity, shap_values = detector.predict(vitals)
            
            if is_anomaly and severity > 0.8:
                send_alert(vitals['patient_id'], vitals, severity, shap_values)
                
            insert_vitals(conn, vitals, bool(is_anomaly), float(severity))
            print(f"Processed record for {vitals['patient_id']}: Anomaly={is_anomaly}")
            
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()
        conn.close()
