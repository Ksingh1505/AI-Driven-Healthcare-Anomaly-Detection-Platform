import { Users, AlertTriangle, Activity } from "lucide-react";
import { usePatients, useAnomalies } from "@/hooks/use-vitals";

export function KPICards() {
  const { data: patients = [] } = usePatients();
  const { data: anomalies = [] } = useAnomalies();

  const criticalAnomalies = anomalies.filter((a) => (a.severityScore ?? 0) > 0.8).length;

  const kpis = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      title: "Recent Anomalies",
      value: anomalies.length,
      icon: Activity,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20",
    },
    {
      title: "Critical Alerts",
      value: criticalAnomalies,
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20",
      animate: criticalAnomalies > 0 ? "pulse-glow" : "",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className={`glass-panel p-6 rounded-2xl flex items-center space-x-4 border-l-4 transition-all duration-300 hover:translate-y-[-2px] ${kpi.border}`}
        >
          <div className={`p-4 rounded-xl ${kpi.bg}`}>
            <kpi.icon className={`w-8 h-8 ${kpi.color} ${kpi.animate || ""}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {kpi.title}
            </p>
            <h3 className="text-3xl font-display font-bold text-foreground mt-1">
              {kpi.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
