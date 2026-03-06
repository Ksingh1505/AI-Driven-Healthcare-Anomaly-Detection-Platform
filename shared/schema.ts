import { pgTable, text, serial, doublePrecision, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vitals = pgTable("vitals", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  heartRate: doublePrecision("heart_rate").notNull(),
  spo2: doublePrecision("spo2").notNull(),
  temperature: doublePrecision("temperature").notNull(),
  bloodPressureSystolic: doublePrecision("blood_pressure_systolic").notNull(),
  bloodPressureDiastolic: doublePrecision("blood_pressure_diastolic").notNull(),
  respiratoryRate: doublePrecision("respiratory_rate").notNull(),
  anomalyFlag: boolean("anomaly_flag").default(false),
  severityScore: doublePrecision("severity_score").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").default('stable'), // stable, warning, critical
  notes: text("notes"),
});

export const insertVitalsSchema = createInsertSchema(vitals).omit({ id: true, timestamp: true });
export type Vitals = typeof vitals.$inferSelect;
export type InsertVitals = z.infer<typeof insertVitalsSchema>;

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  type: text("type").notNull(), // arrhythmia, tachycardia, bradycardia, hypoxia
  severity: text("severity").notNull(), // low, medium, high
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, timestamp: true });
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
