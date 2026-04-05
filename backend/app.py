from flask import Flask, jsonify, request
import psycopg2
import os


app = Flask(__name__)

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('POSTGRES_USER', 'healthcare_user')
DB_PASSWORD = os.getenv('POSTGRES_PASSWORD', 'healthcare_password')
DB_NAME = os.getenv('POSTGRES_DB', 'healthcare_db')

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

@app.route('/patients', methods=['GET'])
def get_patients():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT patient_id FROM vitals;")
    patients = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(patients)

@app.route('/anomalies', methods=['GET'])
def get_anomalies():
    limit = request.args.get('limit', 50)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT patient_id, heart_rate, spo2, temperature, severity_score, timestamp "
        "FROM vitals WHERE anomaly_flag = TRUE ORDER BY timestamp DESC LIMIT %s;", 
        (limit,)
    )
    cols = ['patient_id', 'heart_rate', 'spo2', 'temperature', 'severity_score', 'timestamp']
    anomalies = [dict(zip(cols, row)) for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(anomalies)

@app.route('/patient/<id>', methods=['GET'])
def get_patient_history(id):
    limit = request.args.get('limit', 100)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT heart_rate, spo2, temperature, blood_pressure_systolic, blood_pressure_diastolic, "
        "respiratory_rate, anomaly_flag, timestamp "
        "FROM vitals WHERE patient_id = %s ORDER BY timestamp DESC LIMIT %s;", 
        (id, limit)
    )
    cols = ['heart_rate', 'spo2', 'temperature', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'respiratory_rate', 'anomaly_flag', 'timestamp']
    history = [dict(zip(cols, row)) for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(history)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
