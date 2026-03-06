import { type Vitals, type InsertVitals } from "@shared/schema";

export interface IStorage {
  getVitals(): Promise<Vitals[]>;
  getPatients(): Promise<string[]>;
  getPatientHistory(patientId: string): Promise<Vitals[]>;
  getAnomalies(): Promise<Vitals[]>;
  createVital(vital: InsertVitals): Promise<Vitals>;
}

export class MemStorage implements IStorage {
  private vitals: Map<number, Vitals>;
  private currentId: number;

  constructor() {
    this.vitals = new Map();
    this.currentId = 1;
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
      id: this.currentId++,
      anomalyFlag: vital.anomalyFlag ?? false,
      severityScore: vital.severityScore ?? 0,
      timestamp: new Date()
    };
    this.vitals.set(newVital.id, newVital);
    
    // Keep only last 1000 records to prevent memory leak
    if (this.vitals.size > 1000) {
      const firstKey = this.vitals.keys().next().value;
      if (firstKey !== undefined) {
        this.vitals.delete(firstKey);
      }
    }
    
    return newVital;
  }
}

export const storage = new MemStorage();
