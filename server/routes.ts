import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.vitals.path, async (req, res) => {
    const vitals = await storage.getVitals();
    res.json(vitals);
  });

  app.get(api.patients.path, async (req, res) => {
    const patients = await storage.getPatients();
    res.json(patients);
  });

  app.get(api.patientHistory.path, async (req, res) => {
    const history = await storage.getPatientHistory(req.params.id);
    res.json(history);
  });

  app.get(api.anomalies.path, async (req, res) => {
    const anomalies = await storage.getAnomalies();
    res.json(anomalies);
  });

  // Background simulator
  setInterval(async () => {
    const patients = ["P001", "P002", "P003", "P004", "P005"];
    const patientId = patients[Math.floor(Math.random() * patients.length)];
    
    const isAnomaly = Math.random() < 0.1;
    
    await storage.createVital({
      patientId,
      heartRate: isAnomaly ? 130 + Math.random() * 30 : 60 + Math.random() * 40,
      spo2: isAnomaly ? 80 + Math.random() * 10 : 95 + Math.random() * 5,
      temperature: isAnomaly ? 38.5 + Math.random() * 2 : 36.5 + Math.random() * 1,
      bloodPressureSystolic: isAnomaly ? 140 + Math.random() * 40 : 110 + Math.random() * 20,
      bloodPressureDiastolic: isAnomaly ? 90 + Math.random() * 20 : 70 + Math.random() * 10,
      respiratoryRate: isAnomaly ? 25 + Math.random() * 10 : 14 + Math.random() * 6,
      anomalyFlag: isAnomaly,
      severityScore: isAnomaly ? 0.7 + Math.random() * 0.3 : 0.1 + Math.random() * 0.2
    });
  }, 2000);

  // Initial seed
  for (let i = 0; i < 20; i++) {
    const patients = ["P001", "P002", "P003", "P004", "P005"];
    const patientId = patients[Math.floor(Math.random() * patients.length)];
    await storage.createVital({
      patientId,
      heartRate: 60 + Math.random() * 40,
      spo2: 95 + Math.random() * 5,
      temperature: 36.5 + Math.random() * 1,
      bloodPressureSystolic: 110 + Math.random() * 20,
      bloodPressureDiastolic: 70 + Math.random() * 10,
      respiratoryRate: 14 + Math.random() * 6,
      anomalyFlag: false,
      severityScore: 0.1 + Math.random() * 0.2
    });
  }

  return httpServer;
}
