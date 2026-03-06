import { type Vitals, type InsertVitals, type Alert, type InsertAlert } from "@shared/schema";

export interface IStorage {
  getVitals(): Promise<Vitals[]>;
  getPatients(): Promise<string[]>;
  getPatientHistory(patientId: string): Promise<Vitals[]>;
  getAnomalies(): Promise<Vitals[]>;
  createVital(vital: InsertVitals): Promise<Vitals>;
  updatePatientStatus(patientId: string, status: string, notes?: string): Promise<Vitals | undefined>;
  getAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertRead(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private vitals: Map<number, Vitals>;
  private alerts: Map<number, Alert>;
  private currentVitalId: number;
  private currentAlertId: number;

  constructor() {
    this.vitals = new Map();
    this.alerts = new Map();
    this.currentVitalId = 1;
    this.currentAlertId = 1;
  }

  async getVitals(): Promise<Vitals[]> {
    return Array.from(this.vitals.values()).sort((a, b) => 
      (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0)
    );
  }

  async getPatients(): Promise<string[]> {
    const patients = new Set<string>();
    for (const v of this.vitals.values()) {
      patients.add(v.patientId);
    }
    return Array.from(patients).sort();
  }

  async getPatientHistory(patientId: string): Promise<Vitals[]> {
    return Array.from(this.vitals.values())
      .filter(v => v.patientId === patientId)
      .sort((a, b) => (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0));
  }

  async getAnomalies(): Promise<Vitals[]> {
    return Array.from(this.vitals.values())
      .filter(v => v.anomalyFlag)
      .sort((a, b) => (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0));
  }

  async createVital(vital: InsertVitals): Promise<Vitals> {
    const newVital: Vitals = {
      ...vital,
      id: this.currentVitalId++,
      anomalyFlag: vital.anomalyFlag ?? false,
      severityScore: vital.severityScore ?? 0,
      timestamp: new Date(),
      status: vital.status ?? 'stable',
      notes: vital.notes ?? null
    };
    this.vitals.set(newVital.id, newVital);
    
    if (this.vitals.size > 1000) {
      const firstKey = this.vitals.keys().next().value;
      if (firstKey !== undefined) this.vitals.delete(firstKey);
    }
    
    return newVital;
  }

  async updatePatientStatus(patientId: string, status: string, notes?: string): Promise<Vitals | undefined> {
    const history = await this.getPatientHistory(patientId);
    if (history.length === 0) return undefined;
    
    const latest = history[0];
    const updated: Vitals = { ...latest, status, notes: notes ?? latest.notes };
    this.vitals.set(updated.id, updated);
    return updated;
  }

  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).sort((a, b) => 
      (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0)
    );
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const newAlert: Alert = {
      ...alert,
      id: this.currentAlertId++,
      isRead: false,
      timestamp: new Date()
    };
    this.alerts.set(newAlert.id, newAlert);
    return newAlert;
  }

  async markAlertRead(id: number): Promise<boolean> {
    const alert = this.alerts.get(id);
    if (!alert) return false;
    this.alerts.set(id, { ...alert, isRead: true });
    return true;
  }
}

export const storage = new MemStorage();
