import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Vitals } from "@shared/schema";

// Map JSON string dates back to Date objects
const mapVitalsDates = (vitalsList: any[]): Vitals[] => {
  return vitalsList.map((v) => ({
    ...v,
    timestamp: new Date(v.timestamp),
  }));
};

export function usePatients() {
  return useQuery({
    queryKey: [api.patients.path],
    queryFn: async () => {
      const res = await fetch(api.patients.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch patients");
      const data = await res.json();
      return api.patients.responses[200].parse(data);
    },
    refetchInterval: 5000, // Real-time polling
  });
}

export function usePatientHistory(patientId: string | null) {
  return useQuery({
    queryKey: [api.patientHistory.path, patientId],
    queryFn: async () => {
      if (!patientId) return [];
      const url = buildUrl(api.patientHistory.path, { id: patientId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch patient history");
      const data = await res.json();
      const parsed = api.patientHistory.responses[200].parse(data);
      // Ensure chronological order for charts
      return mapVitalsDates(parsed).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    },
    enabled: !!patientId,
    refetchInterval: 5000, // Real-time polling
  });
}

export function useAnomalies() {
  return useQuery({
    queryKey: [api.anomalies.path],
    queryFn: async () => {
      const res = await fetch(api.anomalies.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch anomalies");
      const data = await res.json();
      const parsed = api.anomalies.responses[200].parse(data);
      return mapVitalsDates(parsed).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    },
    refetchInterval: 5000,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: [api.alerts.list.path],
    queryFn: async () => {
      const res = await fetch(api.alerts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch alerts");
      const data = await res.json();
      const parsed = api.alerts.list.responses[200].parse(data);
      return parsed.map(a => ({ ...a, timestamp: new Date(a.timestamp) }));
    },
    refetchInterval: 5000,
  });
}
