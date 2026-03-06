import os
import time
import json
import random
from confluent_kafka import Producer

KAFKA_BROKER = os.getenv('KAFKA_BROKER', 'localhost:29092')
TOPIC = 'patient_vitals'

def delivery_report(err, msg):
    if err is not None:
        print(f'Message delivery failed: {err}')
    else:
        print(f'Message delivered to {msg.topic()} [{msg.partition()}]')

def generate_vitals(patient_id):
    # Normal vitals with occasional anomalies
    is_anomaly = random.random() < 0.05
    
    if is_anomaly:
        return {
            'patient_id': patient_id,
            'heart_rate': random.uniform(120, 160) if random.random() > 0.5 else random.uniform(40, 50),
            'spo2': random.uniform(80, 92),
            'temperature': random.uniform(39.0, 41.0),
            'blood_pressure_systolic': random.uniform(140, 180),
            'blood_pressure_diastolic': random.uniform(90, 110),
            'respiratory_rate': random.uniform(25, 35),
            'timestamp': time.time()
        }
    else:
        return {
            'patient_id': patient_id,
            'heart_rate': random.uniform(60, 100),
            'spo2': random.uniform(95, 100),
            'temperature': random.uniform(36.1, 37.2),
            'blood_pressure_systolic': random.uniform(90, 120),
            'blood_pressure_diastolic': random.uniform(60, 80),
            'respiratory_rate': random.uniform(12, 20),
            'timestamp': time.time()
        }

if __name__ == '__main__':
    producer = Producer({'bootstrap.servers': KAFKA_BROKER})
    patients = [f'P{str(i).zfill(3)}' for i in range(1, 11)]

    print(f"Starting producer, connecting to {KAFKA_BROKER}...")
    while True:
        patient_id = random.choice(patients)
        vitals = generate_vitals(patient_id)
        
        producer.produce(
            TOPIC,
            key=patient_id.encode('utf-8'),
            value=json.dumps(vitals).encode('utf-8'),
            callback=delivery_report
        )
        producer.poll(0)
        time.sleep(1)
